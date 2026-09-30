// Prépare les captures d'écran des projets pour le portfolio : masque les données sensibles
// (montants, immatriculations…) directement dans les pixels, puis exporte en WebP.
//   node tools/captures.mjs
// Les captures sources restent hors de ce dépôt : seules les versions masquées y entrent.
// Zones à masquer en pixels de l'image source : [x, y, largeur, hauteur].
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openPage } from './chrome.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets', 'projects');
const GLOBOFLEET = process.env.GLOBOFLEET_CAPTURES || join(ROOT, '..', 'globofleet-back', 'docs', 'captures');
const WIDTH = 1280;

const JOBS = [
  { from: join(GLOBOFLEET, 'tableau-de-bord-operationnel.png'), to: 'globofleet-operationnel.webp', redact: [] },
  {
    from: join(GLOBOFLEET, 'tableau-de-bord.png'),
    to: 'globofleet-financier.webp',
    redact: [
      [440, 480, 390, 68],     // Achats de pièces
      [1020, 480, 380, 68],    // Coûts de maintenance
      [1600, 480, 385, 68],    // Total dépenses
      [445, 720, 67, 402],     // Échelle des montants
      [1770, 815, 165, 70],    // Total du top 5
      [1595, 990, 510, 195],   // Top 5 : immatriculations et montants
    ],
  },
  { from: join(GLOBOFLEET, 'check-lists-parametrage.png'), to: 'globofleet-checklists.webp', redact: [] },
];

// Flou fort puis mosaïque à gros blocs : le flou seul serait réversible, la mosaïque qui le suit ne l'est pas.
// Le flou préalable évite aussi les confettis colorés du lissage ClearType. Agrandissement lissé pour l'aspect.
// La zone déclarée reste couverte à ~100 % ; le fondu ne se fait que dans une marge au-delà, sur du fond.
const PROCESS = `async (src, rects, outW) => {
  const img = new Image();
  img.src = src;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const canvas = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });
  const FEATHER = 14;
  // Toutes les zones sont calculées sur l'image d'origine, avant d'en peindre une seule.
  const patches = rects.map(([rx, ry, rw, rh]) => {
    const x = rx - FEATHER, y = ry - FEATHER, w = rw + FEATHER * 2, h = rh + FEATHER * 2;
    const pad = 40;
    const soft = canvas(w + pad * 2, h + pad * 2);
    const sctx = soft.getContext('2d');
    sctx.filter = 'blur(16px)';
    sctx.drawImage(c, x - pad, y - pad, soft.width, soft.height, 0, 0, soft.width, soft.height);
    const tiny = canvas(Math.max(1, Math.round(w / 18)), Math.max(1, Math.round(h / 18)));
    tiny.getContext('2d').drawImage(soft, pad, pad, w, h, 0, 0, tiny.width, tiny.height);
    const patch = canvas(w, h);
    const pctx = patch.getContext('2d');
    pctx.drawImage(tiny, 0, 0, w, h);
    pctx.filter = 'blur(6px)';
    pctx.drawImage(tiny, 0, 0, w, h);
    // Masque : plein sur la zone élargie de FEATHER/2, adouci d'un flou de FEATHER/4 (≈ 2 sigma à l'intérieur).
    pctx.filter = 'blur(' + FEATHER / 4 + 'px)';
    pctx.globalCompositeOperation = 'destination-in';
    pctx.beginPath();
    pctx.roundRect(FEATHER / 2, FEATHER / 2, w - FEATHER, h - FEATHER, 10);
    pctx.fill();
    return [patch, x, y];
  });
  for (const [patch, x, y] of patches) ctx.drawImage(patch, x, y);
  const out = document.createElement('canvas');
  out.width = outW;
  out.height = Math.round(c.height * outW / c.width);
  const octx = out.getContext('2d');
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(c, 0, 0, out.width, out.height);
  return out.toDataURL('image/webp', 0.84).split(',')[1];
}`;

await mkdir(OUT, { recursive: true });
const page = await openPage({ width: 800, height: 600, port: 9334 });
try {
  for (const job of JOBS) {
    const src = `data:image/png;base64,${(await readFile(job.from)).toString('base64')}`;
    const webp = await page.evaluate(`(${PROCESS})(${JSON.stringify(src)}, ${JSON.stringify(job.redact)}, ${WIDTH})`);
    const buf = Buffer.from(webp, 'base64');
    await writeFile(join(OUT, job.to), buf);
    console.log(`${job.to}  ${Math.round(buf.length / 1024)} Ko  ${job.redact.length} zone(s) masquée(s)`);
  }
} finally {
  await page.close();
}
