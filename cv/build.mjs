// Génère le CV (PDF A4) et sa vignette pour le portfolio à partir de cv.html.
//   node cv/build.mjs
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { openPage } from '../tools/chrome.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(HERE, 'cv.html');
const PDF = join(HERE, 'Robert-Emmanuel-Sagne-CV.pdf');
const PREVIEW = join(HERE, 'cv-preview.webp');
// A4 à 96 dpi : 210 × 297 mm.
const PAGE = { width: 794, height: 1123 };

const page = await openPage(PAGE);
try {
  await page.navigate(pathToFileURL(SOURCE).href);

  const fonts = await page.evaluate(`document.fonts.ready.then(() =>
    ['Instrument Serif', 'Space Grotesk', 'JetBrains Mono'].filter(f => !document.fonts.check('12px "' + f + '"')))`);
  if (fonts.length) throw new Error(`Polices non chargées (réseau ?) : ${fonts.join(', ')}`);

  // La page est à hauteur fixe : un bloc qui déborde serait coupé sans bruit dans le PDF.
  const overflow = await page.evaluate(`[...document.querySelectorAll('.main, .side')].map(c => {
    const box = c.getBoundingClientRect();
    const end = box.bottom - parseFloat(getComputedStyle(c).paddingBottom);
    return { col: c.className, over: Math.round(c.lastElementChild.getBoundingClientRect().bottom - end) };
  })`);
  const clipped = overflow.filter(o => o.over > 0);
  if (clipped.length) throw new Error(`Le contenu déborde de la page A4 : ${JSON.stringify(clipped)}`);

  const { data: pdf } = await page.send('Page.printToPDF', {
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
    generateDocumentOutline: true,
  });
  await writeFile(PDF, Buffer.from(pdf, 'base64'));

  const { data: shot } = await page.send('Page.captureScreenshot', {
    format: 'webp',
    quality: 84,
    clip: { x: 0, y: 0, ...PAGE, scale: 1 },
  });
  await writeFile(PREVIEW, Buffer.from(shot, 'base64'));

  const free = overflow.map(o => `${o.col} ${-o.over}px`).join(', ');
  console.log(`PDF      ${PDF}\nVignette ${PREVIEW}\nMarge libre en bas : ${free}`);
} finally {
  await page.close();
}
