// Captures de PTS (Petrosen) avec des données de démonstration.
// Les pages Blade sont rendues par PHP sans base ni session, puis servies par interception des requêtes
// dans Chrome : chaque appel /api reçoit des données fictives, toute autre requête externe est bloquée.
// Aucune base réelle n'est lue ni écrite, aucun serveur n'est lancé.
//   node tools/pts-demo.mjs
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openPage } from './chrome.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PTS = process.env.PTS_DIR || join(ROOT, '..', 'pts-web');
const PHP = process.env.PHP_PATH || 'php';
const ORIGIN = 'http://pts.localhost:4322';
const OUT = join(ROOT, 'assets', 'projects');
const VIEW = { width: 1440, height: 900 };
const WIDTH = 1280;
const PAGES = { dashboard: 'dashboard', delivery: 'delivery' };

// ---------- Rendu des pages Blade ----------
// Tout est surchargé avant le démarrage de Laravel : session et cache en mémoire, base SQLite en mémoire
// (une requête imprévue échouerait au lieu de toucher MySQL), vues compilées et journaux hors du dépôt.
const RENDER = `<?php
[$base, $origin, $out] = array_slice($argv, 1, 3);
$paths = array_slice($argv, 4);
$env = [
  'APP_DEBUG' => 'false', 'APP_URL' => $origin, 'DB_CONNECTION' => 'sqlite', 'DB_DATABASE' => ':memory:',
  'SESSION_DRIVER' => 'array', 'CACHE_STORE' => 'array', 'QUEUE_CONNECTION' => 'sync',
  'VIEW_COMPILED_PATH' => $out, 'LOG_CHANNEL' => 'stderr',
];
foreach ($env as $k => $v) { putenv("$k=$v"); $_ENV[$k] = $v; $_SERVER[$k] = $v; }
require $base . '/vendor/autoload.php';
$app = require $base . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Http\\Kernel::class);
foreach ($paths as $path) {
  $request = Illuminate\\Http\\Request::create($origin . '/' . $path, 'GET');
  $response = $kernel->handle($request);
  if ($response->getStatusCode() !== 200) { fwrite(STDERR, "$path: HTTP " . $response->getStatusCode() . "\\n"); exit(1); }
  file_put_contents($out . '/' . $path . '.html', $response->getContent());
  $kernel->terminate($request, $response);
}
`;

// ---------- Données fictives, déterministes ----------
let seed = 11;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const pick = list => list[Math.floor(rnd() * list.length)];
const pad = n => String(n).padStart(2, '0');
const now = new Date();
const Y = now.getFullYear(), M = now.getMonth() + 1;
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
const addMin = (d, m) => new Date(d.getTime() + m * 60000);

const CARRIERS = ['TransSahel Logistique', 'Cap-Vert Citernes', 'Baobab Transport', 'Niayes Transit', 'Rapide Fleuve']
  .map((nom, i) => ({ id: i + 1, nom, capacity: 180 + Math.round(rnd() * 160) }));
const CLIENTS = ['Énergies du Cap', 'Sahel Carburants', 'Teranga Pétrole', 'Kayor Énergie', 'Atlantique Distribution'];
const SITES = ['Station Pikine', 'Station Rufisque', 'Station Thiès Route', 'Station Mbour', 'Dépôt Kaolack', 'Station Diamniadio', 'Station Touba'];
const PRODUCTS = ['Gasoil', 'Super sans plomb', 'Pétrole lampant'];
const DRIVERS = ['Mamadou Sarr', 'Ibrahima Diouf', 'Cheikh Gueye', 'Alioune Ndour', 'Modou Faye', 'Samba Kane'];
const plate = () => `${pick(['DK', 'TH', 'SL', 'KL'])} ${1000 + Math.floor(rnd() * 8999)} ${String.fromCharCode(65 + Math.floor(rnd() * 26))}${String.fromCharCode(65 + Math.floor(rnd() * 26))}`;
const STEPS = ['Départ vers dépôt', 'Arrivée dépôt', 'Safe To Load', 'Validation BL et chargement', 'Début chargement', 'Fin chargement',
  'Formalités douanières', 'Sortie dépôt', 'Départ vers site client', 'Arrivée site client', 'Début dépotage', 'Fin dépotage', 'Signature BL']
  .map((libelle, i) => ({ id: i + 1, libelle, ordre: i + 1, delai_minutes: i < 4 || i > 6 ? 120 : 0 }));

// 14 livraisons : terminées, en cours à différentes étapes, à venir, une annulée.
const DELIVERIES = Array.from({ length: 14 }, (_, i) => {
  const id = 4180 - i;
  const done = i >= 7 ? 13 : i >= 4 ? 0 : [9, 6, 3, 11][i];
  const start = addMin(now, -(i >= 7 ? 1440 * (i - 5) : done * 55 + 40));
  const carrier = CARRIERS[i % CARRIERS.length];
  const products = i % 3 === 0 ? [PRODUCTS[0], PRODUCTS[1]] : [pick(PRODUCTS)];
  const suivis = STEPS.map((etape, k) => ({
    etape, date_heure_debut: k < done ? iso(addMin(start, k * 48)) : null,
    localisation_debut: { latitude: 14.69 + rnd() * 0.1, longitude: -17.44 + rnd() * 0.1 },
  }));
  return {
    id,
    statut_id: done === 13 ? 2 : done > 0 ? 1 : 0,
    canceled_at: i === 12 ? iso(addMin(now, -2880)) : null,
    incidents: i === 1 || i === 9 ? [{ etape_id: 7, description: 'Attente des documents douaniers' }] : [],
    commande: { ref_commande: `CMD-${Y}-${pad(412 - i)}`, zone_delai: { delai: i === 0 ? 0 : 2 } },
    site_depart: 'Dépôt de Mbao',
    bon_livraison: {
      ref_bl: `BL-${Y}${pad(M)}-${pad(96 - i)}`,
      camion: { id: 100 + i, matricule: plate() },
      remorque: plate(),
      chauffeur: DRIVERS[i % DRIVERS.length],
      detail_commandes: products.map(libelle => ({ produit: { libelle }, quantite: String(pick([10000, 15000, 20000, 30000])) })),
      transporteur: carrier,
      date_prevu: iso(start),
      site_livraison: SITES[i % SITES.length],
      client: { nom: CLIENTS[i % CLIENTS.length] },
      date_signature: done === 13 ? iso(addMin(start, 12 * 48)) : null,
    },
    suivi_livraisons: suivis,
  };
});

const days = new Date(Y, M, 0).getDate();
const dayIso = d => `${Y}-${pad(M)}-${pad(d)}`;
const daily = Array.from({ length: days }, (_, k) => {
  const weekend = [0, 6].includes(new Date(Y, M - 1, k + 1).getDay());
  return CARRIERS.map(c => Math.round(c.capacity * (weekend ? 0.55 : 0.8 + rnd() * 0.35)));
});

const PERMISSIONS = ['Camions', 'Clients', 'Commande client', 'Commandes', 'Depots', 'Livraison', 'Service client', 'Service logistique', 'Transporteurs', 'Utilisateurs']
  .flatMap(x => ['Lister', 'Ajouter', 'Modifier', 'Supprimer'].map(v => `${v} ${x}`))
  .concat(['Lister Programme de chargement', 'Lister Tableau de bord'])
  .map((name, i) => ({ id: i + 1, name }));

function api(method, path) {
  if (path === '/api/check_token') {
    return {
      message: {
        id: 1, prenom: 'Compte', nom: 'Démo', avatar: null, is_password_changed: 1, roles: [{ name: 'Admin' }],
        notifications: [
          { id: 1, titre: 'Livraison terminée', message: `${DELIVERIES[7].bon_livraison.ref_bl} signé par le client`, created_at: iso(addMin(now, -35)), read_at: null },
          { id: 2, titre: 'Incident signalé', message: 'Attente des documents douaniers', created_at: iso(addMin(now, -95)), read_at: null },
        ],
      },
      permissions: PERMISSIONS,
    };
  }
  if (path === '/api/dashboard/chart-data') {
    return { data: daily.map((caps, k) => {
      const dispo = caps.reduce((a, b) => a + b, 0);
      return { jour: dayIso(k + 1), capacite_disponible: dispo, volume_commande: Math.round(dispo * (0.62 + rnd() * 0.3)) };
    }) };
  }
  if (path === '/api/dashboard/table-data') {
    return { data: Object.fromEntries(CARRIERS.map((c, j) => [c.nom, daily.map((caps, k) => ({ jour: dayIso(k + 1), capacite_disponible: caps[j] }))])) };
  }
  if (path === '/api/dashboard/transporteurs-data') {
    return { data: CARRIERS.map((c, j) => ({
      transporteur: c.nom, nombre_camions: 4 + j * 2, total_capacite: c.capacity * 10, total_compartiments: (4 + j * 2) * 4,
    })) };
  }
  if (path === '/api/livraisons') return { data: DELIVERIES };
  const detail = path.match(/^\/api\/livraisons\/(\d+)\/(details|tracking)$/);
  if (detail) {
    const d = DELIVERIES.find(x => x.id === +detail[1]) || DELIVERIES[0];
    const bl = d.bon_livraison;
    if (detail[2] === 'details') {
      return { data: { vehicule: bl.camion.matricule, liquide: bl.detail_commandes[0].produit.libelle, remorque: bl.remorque,
        chauffeur: bl.chauffeur, date_expedition: bl.date_prevu, zone_delai: d.commande.zone_delai.delai, statut_id: d.statut_id } };
    }
    return { data: [{
      livraison_id: d.id, liquide: bl.detail_commandes[0].produit.libelle,
      completed_deliveries: 128, to_do_deliveries: 9, ongoing_deliveries: 6,
      timeline: d.suivi_livraisons.map(s => ({ etape_id: s.etape.id, etape_libelle: s.etape.libelle, date_heure_debut: s.date_heure_debut, etape: s.etape })),
      incidents: d.incidents,
      livraison: { commande: d.commande, bon_livraison: bl },
    }] };
  }
  if (path.startsWith('/api/transporteurs')) return { data: CARRIERS };
  console.warn(`API non simulée : ${method} ${path}`);
  return { data: [] };
}

// ---------- Service des requêtes ----------
const TYPES = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html; charset=utf-8', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject', '.ico': 'image/x-icon' };
const PASS = ['https://fonts.googleapis.com/', 'https://fonts.gstatic.com/', 'https://cdn.jsdelivr.net/', 'https://cdnjs.cloudflare.com/', 'https://code.jquery.com/', 'https://cdn.datatables.net/'];

const work = await mkdtemp(join(tmpdir(), 'pts-demo-'));
await writeFile(join(work, 'render.php'), RENDER);
execFileSync(PHP, [join(work, 'render.php'), PTS, ORIGIN, work, ...Object.values(PAGES)], { stdio: 'inherit' });

const blocked = new Set();
const page = await openPage({ ...VIEW, port: 9336 });
const fulfill = (requestId, status, type, buf) => page.send('Fetch.fulfillRequest', {
  requestId, responseCode: status, responseHeaders: [{ name: 'Content-Type', value: type }], body: Buffer.from(buf).toString('base64'),
});

page.on('Fetch.requestPaused', async ({ requestId, request }) => {
  const { url, method } = request;
  try {
    if (url.startsWith(ORIGIN)) {
      const path = decodeURIComponent(new URL(url).pathname);
      if (path.startsWith('/api/')) return await fulfill(requestId, 200, 'application/json', JSON.stringify(api(method, path.replace(/\/$/, ''))));
      const view = Object.entries(PAGES).find(([route]) => path === `/${route}`);
      if (view) return await fulfill(requestId, 200, TYPES['.html'], await readFile(join(work, `${view[1]}.html`)));
      const file = join(PTS, 'public', path);
      if (extname(file) && existsSync(file)) return await fulfill(requestId, 200, TYPES[extname(file)] || 'application/octet-stream', await readFile(file));
      return await fulfill(requestId, 404, 'text/plain', '');
    }
    if (PASS.some(p => url.startsWith(p))) return await page.send('Fetch.continueRequest', { requestId });
    blocked.add(new URL(url).host);
    await page.send('Fetch.failRequest', { requestId, errorReason: 'BlockedByClient' });
  } catch (e) {
    console.error('Requête', url.slice(0, 80), e.message);
  }
});

const sleep = ms => new Promise(r => setTimeout(r, ms));
const capture = async file => {
  const { data } = await page.send('Page.captureScreenshot', { format: 'webp', quality: 84, clip: { x: 0, y: 0, ...VIEW, scale: WIDTH / VIEW.width } });
  await writeFile(join(OUT, file), Buffer.from(data, 'base64'));
  console.log(`${file}  ${Math.round(Buffer.from(data, 'base64').length / 1024)} Ko`);
};

try {
  await page.send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
  await page.send('Page.addScriptToEvaluateOnNewDocument', { source: `sessionStorage.setItem('token', 'demo');` });

  await page.navigate(`${ORIGIN}/dashboard`);
  await sleep(4000);
  await capture('pts-dashboard.webp');

  await page.navigate(`${ORIGIN}/delivery`);
  await sleep(4000);
  await capture('pts-livraisons.webp');

  // Détail d'une livraison en cours : chronologie des étapes, compteurs, incident.
  await page.evaluate(`document.querySelector('button[onclick="getFullDeliveryDetails(\\'${DELIVERIES[1].id}\\')"]').click(); true`);
  await sleep(2500);
  await capture('pts-suivi.webp');

  if (blocked.size) console.log(`Requêtes externes bloquées : ${[...blocked].join(', ')}`);
} finally {
  await page.close();
  await rm(work, { recursive: true, force: true });
}
