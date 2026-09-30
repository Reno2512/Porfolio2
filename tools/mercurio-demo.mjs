// Captures du tableau de bord Direction de Mercurio, avec des données de démonstration.
// Le front est servi depuis son build par interception des requêtes dans Chrome : chaque appel à l'API
// reçoit des données fictives, toute autre requête externe est bloquée. Aucun serveur réel n'est contacté.
//   cd ../mercurio-front && npx ng build --configuration development --output-path <dossier>
//   MERCURIO_BUILD=<dossier>/browser node tools/mercurio-demo.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openPage } from './chrome.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FRONT = join(ROOT, '..', 'mercurio-front');
const BUILD = process.env.MERCURIO_BUILD;
if (!BUILD || !existsSync(join(BUILD, 'index.csr.html'))) throw new Error('MERCURIO_BUILD doit pointer vers le dossier browser du build.');
const API_URL = (await readFile(join(FRONT, 'src', 'environements', 'environement.ts'), 'utf8'))
  .match(/^\s*apiUrl:\s*['"]([^'"]+)['"]/m)[1].replace(/\/$/, '');
const ORIGIN = 'http://mercurio.localhost:4321';
const OUT = join(ROOT, 'assets', 'projects');
const VIEW = { width: 1440, height: 900 };
const WIDTH = 1280;

// ---------- Données fictives, déterministes ----------
let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const jitter = (k = 0.18) => 1 - k + rnd() * k * 2;
const pad = n => String(n).padStart(2, '0');

const COMMERCIALS = ['Awa Diop', 'Moussa Ndiaye', 'Fatou Sow', 'Ibrahima Fall', 'Aminata Ba', 'Cheikh Mbaye', 'Mariama Sarr', 'Ousmane Faye']
  .map((name, i) => ({ id: i + 1, salesperson_name: name, salesperson_code: `C${pad(i + 1)}` }));
const ZONES = [['Dakar', 1], ['Thiès', 0.62], ['Mbour', 0.5], ['Touba', 0.46], ['Kaolack', 0.4], ['Saint-Louis', 0.34], ['Ziguinchor', 0.24]];
const CLIENTS = [
  ['Grossiste Tilène', 'Dakar'], ['Dépôt Pikine', 'Dakar'], ['Supérette Almadies', 'Dakar'], ['Alimentation Médina', 'Dakar'],
  ['Comptoir Parcelles', 'Dakar'], ['Dépôt Rufisque', 'Dakar'], ['Supérette Point E', 'Dakar'], ['Grossiste Thiès Centre', 'Thiès'],
  ['Dépôt Tivaouane', 'Thiès'], ['Alimentation Saly', 'Mbour'], ['Comptoir Mbour Plage', 'Mbour'], ['Grossiste Touba Nord', 'Touba'],
  ['Dépôt Mbacké', 'Touba'], ['Grossiste Kaolack', 'Kaolack'], ['Dépôt Kahone', 'Kaolack'], ['Comptoir Sor', 'Saint-Louis'],
  ['Alimentation Guet Ndar', 'Saint-Louis'], ['Dépôt Ziguinchor', 'Ziguinchor'], ['Supérette Boucotte', 'Ziguinchor'],
].map(([name, zone], i) => ({
  customer_name: name,
  zone,
  commercial: COMMERCIALS[i % COMMERCIALS.length].salesperson_name,
  share: ZONES.find(z => z[0] === zone)[1] * (0.6 + rnd() * 0.8),
}));
const shareSum = CLIENTS.reduce((s, c) => s + c.share, 0);
CLIENTS.forEach(c => { c.share /= shareSum; });
const PRODUCTS = [
  ['Eau minérale 1,5 L', 0.2], ['Eau minérale 0,5 L', 0.14], ['Jus d\'orange 1 L', 0.11], ['Boisson gazeuse 33 cl', 0.1],
  ['Lait UHT 1 L', 0.09], ['Jus de mangue 1 L', 0.08], ['Eau minérale 10 L', 0.07], ['Nectar de goyave 1 L', 0.06],
  ['Jus de bissap 33 cl', 0.05], ['Yaourt à boire 50 cl', 0.04], ['Eau aromatisée 50 cl', 0.03], ['Lait concentré 397 g', 0.03],
].map(([name, share], i) => ({ sku: `P${pad(i + 1)}`, name, share }));
const CHANNELS = [['Grossistes', 0.42], ['Détaillants', 0.28], ['Grandes surfaces', 0.18], ['Hôtels et restaurants', 0.12]];

// Saisonnalité : les boissons culminent en saison chaude. 2026 progresse d'environ 12 % sur 2025.
const SEASON = [0.78, 0.8, 0.92, 1.06, 1.18, 1.22, 1.16, 1.08, 1.02, 0.94, 0.86, 0.9];
const LAST_MONTH = { 2026: new Date().getFullYear() === 2026 ? new Date().getMonth() + 1 : 12 };
const lastMonth = y => LAST_MONTH[y] ?? 12;
const monthTotal = (y, m) => 212e6 * SEASON[m - 1] * (y >= 2026 ? 1.12 : 1) * (1 + ((m * 7 + y) % 5 - 2) * 0.015);

function chiffresAffaires({ annee, mois }) {
  const y = +annee, m = +mois;
  const rows = [];
  for (let k = 1; k <= lastMonth(y); k++) {
    CLIENTS.forEach(c => rows.push({
      salesperson_name: c.commercial,
      customer_name: c.customer_name,
      zone: c.zone,
      ca_ht: String(Math.round(monthTotal(y, k) * c.share * jitter(0.22))),
      mois: `${pad(k)}-${y}`,
    }));
  }
  const month = rows.filter(r => r.mois === `${pad(m)}-${y}`);
  const byCommercial = COMMERCIALS.map(c => ({
    salesperson_name: c.salesperson_name,
    ca_ht: String(month.filter(r => r.salesperson_name === c.salesperson_name).reduce((s, r) => s + +r.ca_ht, 0)),
    mois: `${pad(m)}-${y}`,
  }));
  const total = month.reduce((s, r) => s + +r.ca_ht, 0);
  return {
    data: {
      ca_du_mois: [{ ca_ht: String(total) }],
      ca_nombre_nouveaux_client: [{ nombre_clients: '14' }],
      ca_panier_moyen: [{ panier_moyen: String(Math.round(total / 118)) }],
      ca_comparatif_global_vs_commercial: [{ ca_global: String(total), ca_commercial: String(total) }],
      ca_par_commercial: byCommercial,
      ca_client_par_commercial: rows,
      ca_evolution_ca_annuel: Array.from({ length: lastMonth(y) }, (_, i) => ({
        mois: String(i + 1),
        ca_ht_mensuel: String(Math.round(monthTotal(y, i + 1))),
      })),
    },
  };
}

function analyseVentes({ annee, mois }) {
  const total = monthTotal(+annee, +mois);
  const top = [...CLIENTS].sort((a, b) => b.share - a.share).slice(0, 15);
  // Le graphique SKU trace une barre par ligne : une ligne par produit, rattachée à un client pour la matrice croisée.
  return {
    data: {
      analyse_vente_repartition_ca_par_produit: PRODUCTS.map((p, i) => ({
        sku: p.sku, produit: p.name, client: top[i % top.length].customer_name,
        ca_sku: String(Math.round(total * p.share * jitter(0.08))),
      })),
      analyse_vente_repartition_par_canal_distribution: CHANNELS.map(([canal, s]) => ({ canal, ca_canal: String(Math.round(total * s)) })),
      analyse_vente_prevu_vs_realise: top.map(c => {
        const realise = total * c.share * jitter(0.1);
        return { sell_to_customer_name: c.customer_name, montant_prevu: String(Math.round(realise * (1.04 + rnd() * 0.1))), montant_realise: String(Math.round(realise)) };
      }),
    },
  };
}

function performanceEquipes({ annee }) {
  return {
    data: {
      performance_equipes_taux_conversion_devis_commande: COMMERCIALS.map(c => {
        const devis = Math.round(38 + rnd() * 50);
        const commandes = Math.round(devis * (0.52 + rnd() * 0.3));
        return { salesperson_name: c.salesperson_name, nd_devis: String(devis), nb_commande: String(commandes), taux_convenition: String(Math.round(commandes / devis * 100)) };
      }),
      performance_equipes_taux_nouveaux_contacts_clients: COMMERCIALS.map(c => ({ salesperson_name: c.salesperson_name, nb_nouveaux_clients: String(1 + Math.round(rnd() * 5)) })),
      performance_equipes_taux_nouveaux_contacts_crees_par_mois: Array.from({ length: lastMonth(+annee) }, (_, i) => ({
        periode: `${pad(i + 1)}-${annee}`, nb_nouveaux_contacts: String(Math.round(18 + rnd() * 26)),
      })),
      performance_equipes_taux_requetes_client_satisfaites: [{ taux_satisfaction: '93' }, { taux_satisfaction: '88' }],
    },
  };
}

const PERMISSIONS = [
  'Lister Utilisateurs', 'Lister Rôles', 'Lister Permissions', 'Lister Log d\'activité', 'Lister Dashboard Commercial',
  'Lister clients du portefeuille', 'Lister Dashboard distributeur', 'Lister Commandes', 'Lister Factures', 'Lister Dashboard Direction',
].map((name, i) => ({ id: i + 1, name }));

function api(method, path, body) {
  if (path === '/roles') return { data: [{ id: 1, name: 'Direction', permissions: PERMISSIONS }] };
  if (path === '/permissions') return { data: PERMISSIONS };
  if (path === '/notifications') return { notifications: [] };
  if (path.startsWith('/commercials')) return { result: { data: COMMERCIALS, pagination: { totalPages: 1 } } };
  if (path === '/clients/liste') return { result: { data: [] } };
  if (path === '/dashboard/chiffres_affaires') return chiffresAffaires(body);
  if (path === '/dashboard/analyse_ventes') return analyseVentes(body);
  if (path === '/dashboard/performance_equipes') return performanceEquipes(body);
  console.warn(`API non simulée : ${method} ${path}`);
  return { data: [] };
}

// ---------- Service des requêtes ----------
const TYPES = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.ico': 'image/x-icon' };
const PASS = ['https://fonts.googleapis.com/', 'https://fonts.gstatic.com/', 'https://cdn.jsdelivr.net/', 'https://cdnjs.cloudflare.com/'];
const blocked = new Set();

const page = await openPage({ ...VIEW, port: 9335, args: ['--disable-web-security'] });
const fulfill = (requestId, status, type, buf) => page.send('Fetch.fulfillRequest', {
  requestId, responseCode: status,
  responseHeaders: [{ name: 'Content-Type', value: type }, { name: 'Access-Control-Allow-Origin', value: '*' }],
  body: Buffer.from(buf).toString('base64'),
});

page.on('Fetch.requestPaused', async ({ requestId, request }) => {
  const { url, method, postData } = request;
  try {
    if (url.startsWith(API_URL)) {
      const path = new URL(url).pathname.slice(new URL(API_URL).pathname.replace(/\/$/, '').length);
      if (method === 'OPTIONS') return await fulfill(requestId, 204, 'text/plain', '');
      return await fulfill(requestId, 200, 'application/json', JSON.stringify(api(method, path, postData ? JSON.parse(postData) : {})));
    }
    if (url.startsWith(ORIGIN)) {
      const file = join(BUILD, decodeURIComponent(new URL(url).pathname));
      const asset = extname(file) && existsSync(file) ? file : join(BUILD, 'index.csr.html');
      return await fulfill(requestId, 200, TYPES[extname(asset)] || 'application/octet-stream', await readFile(asset));
    }
    if (PASS.some(p => url.startsWith(p))) return await page.send('Fetch.continueRequest', { requestId });
    blocked.add(new URL(url).host);
    await page.send('Fetch.failRequest', { requestId, errorReason: 'BlockedByClient' });
  } catch (e) {
    console.error('Requête', url.slice(0, 80), e.message);
  }
});

const sleep = ms => new Promise(r => setTimeout(r, ms));
try {
  await page.send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
  await page.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `localStorage.setItem('mercurio_token', 'demo');
      localStorage.setItem('mercurio_user', ${JSON.stringify(JSON.stringify({
        id: 1, firstName: 'Compte', lastName: 'Démo', email: 'direction@demo.local', code: null, role: { id: 1, name: 'Direction' },
      }))});`,
  });
  await page.navigate(`${ORIGIN}/direction/dashboard-v2`);
  await sleep(4000);

  // Onglet à ouvrir, et titre de carte à amener en haut de l'écran (sinon haut de page).
  const frames = [
    { tab: 0, file: 'mercurio-ca.webp' },
    { tab: 0, card: 'Heatmap CA par zone', file: 'mercurio-heatmap.webp' },
    { tab: 1, file: 'mercurio-analyse.webp' },
  ];
  for (const { tab, card, file } of frames) {
    await page.evaluate(`(() => {
      document.querySelectorAll('.tab')[${tab}].click();
      window.scrollTo(0, 0);
      return true;
    })()`);
    await sleep(2500);
    let clip = null;
    if (card) {
      clip = await page.evaluate(`(() => {
        const title = [...document.querySelectorAll('h3')].find(h => h.textContent.includes(${JSON.stringify(card)}));
        // Remonte jusqu'à la carte entière (l'en-tête de carte porte aussi une classe « card-… »).
        let box = title;
        while (box.parentElement && box.getBoundingClientRect().height < 300) box = box.parentElement;
        // Défilement instantané du bon conteneur : le défilement doux de l'application annulerait un second appel.
        let scroller = box.parentElement;
        while (scroller && !(scroller.scrollHeight > scroller.clientHeight && /auto|scroll/.test(getComputedStyle(scroller).overflowY))) {
          scroller = scroller.parentElement;
        }
        scroller = scroller || document.scrollingElement;
        scroller.scrollTo({ top: scroller.scrollTop + box.getBoundingClientRect().top - 84, behavior: 'instant' });
        // En bas de page, la barre latérale (non collante) est vide : on cadre la zone de contenu seule, en 16:10,
        // calée sur le bas de la carte. Coordonnées du document, car la capture suit le défilement de la page.
        // Le bouton flottant « Tweaks » serait coupé par ce cadrage.
        document.querySelector('.tweaks-fab')?.style.setProperty('visibility', 'hidden');
        const left = Math.round(document.querySelector('aside, .layout-menu')?.getBoundingClientRect().right || 0);
        const width = innerWidth - left;
        const height = Math.round(width * 10 / 16);
        const top = Math.max(0, box.getBoundingClientRect().bottom + 24 - height);
        return { x: scrollX + left, y: scrollY + top, width, height };
      })()`);
    }
    await sleep(1500);
    if (!clip) {
      const [x, y] = await page.evaluate('[window.scrollX, window.scrollY]');
      clip = { x, y, ...VIEW };
    }
    const { data } = await page.send('Page.captureScreenshot', {
      format: 'webp', quality: 84, clip: { ...clip, scale: WIDTH / clip.width },
    });
    await writeFile(join(OUT, file), Buffer.from(data, 'base64'));
    console.log(`${file}  ${Math.round(Buffer.from(data, 'base64').length / 1024)} Ko`);
  }
  if (blocked.size) console.log(`Requêtes externes bloquées : ${[...blocked].length} hôte(s)`);
} finally {
  await page.close();
}
