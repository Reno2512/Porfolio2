// Génère le CV (PDF A4) et sa vignette pour le portfolio à partir de cv.html.
// Aucune dépendance : pilote le Chrome (ou Edge) installé via le protocole DevTools.
//   node cv/build.mjs
// Chemin du navigateur surchargeable avec CHROME_PATH.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(HERE, 'cv.html');
const PDF = join(HERE, 'Robert-Emmanuel-Sagne-CV.pdf');
const PREVIEW = join(HERE, 'cv-preview.webp');
const PORT = 9333;
// A4 à 96 dpi : 210 × 297 mm.
const PAGE = { width: 794, height: 1123 };

const BROWSERS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];
const browser = BROWSERS.find(p => p && existsSync(p));
if (!browser) throw new Error('Chrome introuvable : définissez CHROME_PATH.');

const sleep = ms => new Promise(r => setTimeout(r, ms));
const profile = await mkdtemp(join(tmpdir(), 'cv-build-'));
const proc = spawn(browser, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  '--remote-allow-origins=*',
  `--user-data-dir=${profile}`,
  '--no-first-run',
  '--hide-scrollbars',
  'about:blank',
], { stdio: 'ignore' });

async function pageSocket() {
  for (let i = 0; i < 60; i++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = targets.find(t => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch { /* navigateur pas encore prêt */ }
    await sleep(250);
  }
  throw new Error('Le navigateur ne répond pas sur le port DevTools.');
}

const ws = new WebSocket(await pageSocket());
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

let seq = 0;
const pending = new Map();
const waiters = new Map();
ws.onmessage = ({ data }) => {
  const msg = JSON.parse(data);
  if (msg.id && pending.has(msg.id)) {
    const { res, rej } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? rej(new Error(msg.error.message)) : res(msg.result);
  } else if (msg.method && waiters.has(msg.method)) {
    waiters.get(msg.method)();
    waiters.delete(msg.method);
  }
};
const send = (method, params = {}) => new Promise((res, rej) => {
  const id = ++seq;
  pending.set(id, { res, rej });
  ws.send(JSON.stringify({ id, method, params }));
});
const once = method => new Promise(res => waiters.set(method, res));
const evaluate = async expression => {
  const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (exceptionDetails) throw new Error(exceptionDetails.text);
  return result.value;
};

try {
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { ...PAGE, deviceScaleFactor: 1, mobile: false });
  const loaded = once('Page.loadEventFired');
  await send('Page.navigate', { url: pathToFileURL(SOURCE).href });
  await loaded;

  const fonts = await evaluate(`document.fonts.ready.then(() =>
    ['Instrument Serif', 'Space Grotesk', 'JetBrains Mono'].filter(f => !document.fonts.check('12px "' + f + '"')))`);
  if (fonts.length) throw new Error(`Polices non chargées (réseau ?) : ${fonts.join(', ')}`);

  // La page est à hauteur fixe : un bloc qui déborde serait coupé sans bruit dans le PDF.
  const overflow = await evaluate(`[...document.querySelectorAll('.main, .side')].map(c => {
    const box = c.getBoundingClientRect();
    const end = box.bottom - parseFloat(getComputedStyle(c).paddingBottom);
    return { col: c.className, over: Math.round(c.lastElementChild.getBoundingClientRect().bottom - end) };
  })`);
  const clipped = overflow.filter(o => o.over > 0);
  if (clipped.length) throw new Error(`Le contenu déborde de la page A4 : ${JSON.stringify(clipped)}`);

  const { data: pdf } = await send('Page.printToPDF', {
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
    generateDocumentOutline: true,
  });
  await writeFile(PDF, Buffer.from(pdf, 'base64'));

  const { data: shot } = await send('Page.captureScreenshot', {
    format: 'webp',
    quality: 84,
    clip: { x: 0, y: 0, ...PAGE, scale: 1 },
  });
  await writeFile(PREVIEW, Buffer.from(shot, 'base64'));

  const free = overflow.map(o => `${o.col} ${-o.over}px`).join(', ');
  console.log(`PDF      ${PDF}\nVignette ${PREVIEW}\nMarge libre en bas : ${free}`);
} finally {
  ws.close();
  proc.kill();
  await sleep(300);
  await rm(profile, { recursive: true, force: true }).catch(() => {});
}
