// Pilote le Chrome (ou Edge) installé via le protocole DevTools, sans dépendance.
// Utilisé par cv/build.mjs et tools/captures.mjs. Chemin du navigateur surchargeable avec CHROME_PATH.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BROWSERS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function openPage({ width, height, deviceScaleFactor = 1, port = 9333, args = [] }) {
  const browser = BROWSERS.find(p => p && existsSync(p));
  if (!browser) throw new Error('Chrome introuvable : définissez CHROME_PATH.');

  const profile = await mkdtemp(join(tmpdir(), 'porfolio-chrome-'));
  const proc = spawn(browser, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--hide-scrollbars',
    ...args,
    'about:blank',
  ], { stdio: 'ignore' });

  let socketUrl;
  for (let i = 0; i < 60 && !socketUrl; i++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      socketUrl = targets.find(t => t.type === 'page')?.webSocketDebuggerUrl;
    } catch { /* navigateur pas encore prêt */ }
    if (!socketUrl) await sleep(250);
  }
  if (!socketUrl) { proc.kill(); throw new Error('Le navigateur ne répond pas sur le port DevTools.'); }

  const ws = new WebSocket(socketUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let seq = 0;
  const pending = new Map();
  const waiters = new Map();
  const listeners = new Map();
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.id && pending.has(msg.id)) {
      const { res, rej } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? rej(new Error(msg.error.message)) : res(msg.result);
      return;
    }
    if (!msg.method) return;
    (listeners.get(msg.method) || []).forEach(fn => fn(msg.params));
    if (waiters.has(msg.method)) {
      waiters.get(msg.method)();
      waiters.delete(msg.method);
    }
  };
  const on = (method, fn) => listeners.set(method, [...(listeners.get(method) || []), fn]);

  const send = (method, params = {}) => new Promise((res, rej) => {
    const id = ++seq;
    pending.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (exceptionDetails) throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
    return result.value;
  };
  const navigate = async url => {
    const loaded = new Promise(res => waiters.set('Page.loadEventFired', res));
    await send('Page.navigate', { url });
    await loaded;
  };
  const close = async () => {
    ws.close();
    proc.kill();
    await sleep(300);
    await rm(profile, { recursive: true, force: true }).catch(() => {});
  };

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor, mobile: false });
  return { send, evaluate, navigate, on, close };
}
