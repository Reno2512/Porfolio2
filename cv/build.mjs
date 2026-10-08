// Génère les CV (PDF) et leurs vignettes pour le portfolio.
//   node cv/build.mjs            → toutes les versions
//   node cv/build.mjs canada     → une seule version
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { openPage } from '../tools/chrome.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

// Pages à 96 dpi. Le CV standard tient sur une page A4 à hauteur fixe ; la version canadienne
// (format Lettre US) s'écoule sur deux pages au plus.
const VARIANTS = {
  standard: {
    source: 'cv.html',
    pdf: 'Robert-Emmanuel-Sagne-CV.pdf',
    preview: 'cv-preview.webp',
    page: { width: 794, height: 1123 }, // A4 : 210 × 297 mm
    fixedPage: true,
  },
  canada: {
    source: 'cv-canada.html',
    pdf: 'Robert-Emmanuel-Sagne-CV-Canada.pdf',
    preview: 'cv-canada-preview.webp',
    page: { width: 816, height: 1056 }, // Lettre US : 8,5 × 11 po
    maxPages: 2,
  },
};

const only = process.argv[2];
if (only && !VARIANTS[only]) throw new Error(`Version inconnue : ${only} (${Object.keys(VARIANTS).join(', ')})`);
for (const [id, v] of Object.entries(VARIANTS)) {
  if (!only || only === id) await build(id, v);
}

async function build(id, { source, pdf: pdfName, preview, page: PAGE, fixedPage, maxPages }) {
  const SOURCE = join(HERE, source);
  const PDF = join(HERE, pdfName);
  const PREVIEW = join(HERE, preview);
  const page = await openPage(PAGE);
  try {
    await page.navigate(pathToFileURL(SOURCE).href);

    const fonts = await page.evaluate(`document.fonts.ready.then(() =>
      ['Instrument Serif', 'Space Grotesk', 'JetBrains Mono'].filter(f => !document.fonts.check('12px "' + f + '"')))`);
    if (fonts.length) throw new Error(`Polices non chargées (réseau ?) : ${fonts.join(', ')}`);

    // Page à hauteur fixe : un bloc qui déborde serait coupé sans bruit dans le PDF.
    const overflow = !fixedPage ? [] : await page.evaluate(`[...document.querySelectorAll('.main, .side')].map(c => {
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
    const bytes = Buffer.from(pdf, 'base64');
    const pages = (bytes.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    if (maxPages && pages > maxPages) throw new Error(`${id} : ${pages} pages, ${maxPages} au plus`);
    await writeFile(PDF, bytes);

    const { data: shot } = await page.send('Page.captureScreenshot', {
      format: 'webp',
      quality: 84,
      clip: { x: 0, y: 0, ...PAGE, scale: 1 },
    });
    await writeFile(PREVIEW, Buffer.from(shot, 'base64'));

    const free = overflow.map(o => `${o.col} ${-o.over}px`).join(', ');
    console.log(`[${id}] PDF      ${PDF} (${pages} page${pages > 1 ? 's' : ''})\n[${id}] Vignette ${PREVIEW}${free ? `\n[${id}] Marge libre en bas : ${free}` : ''}`);
  } finally {
    await page.close();
  }
}
