const { useEffect, useLayoutEffect, useState, useRef } = React;

// ============== DATA ==============
const PROFILE = {
  name: "Robert Emmanuel",
  lastName: "Mamadou Sagne",
  role: "Développeur Fullstack",
  location: "Rufisque Ouest — Sénégal",
  email: "sagneemma25@gmail.com",
  phone: "+221 77 866 20 79",
  available: "En poste — Globo Afrique",
};

const EXPERIENCES = [
  {
    period: "Oct 2026 — Présent",
    title: "Développeur Fullstack",
    company: "Globo Afrique Dakar",
    mono: "GA",
    role: "CDD — Contractuel",
    desc: "Recruté en contrat à l'issue du stage. Conception, développement et maintenance des plateformes métiers de Globo Afrique, de l'API jusqu'à la mise en production.",
    stack: ["Angular", "React", "Node.js", "MySQL"],
  },
  {
    period: "Oct 2024 — Sept 2026",
    title: "Développeur Fullstack",
    company: "Globo Afrique Dakar",
    mono: "GA",
    role: "Stagiaire",
    desc: "Conception de plateformes métiers : écosystème BNSP (back-office et deux PWA), pilotage commercial du Groupe Kirène, refonte de Globo Fleet et suivi des livraisons Petrosen. Architecture front modulaire, intégration API et tableaux de bord opérationnels.",
    stack: ["React", "Angular", "REST", "UI/UX"],
  },
  {
    period: "Août 2023",
    title: "Traitement de la DPI",
    company: "DSID — Direction Des Systèmes D'Information Des Douanes",
    mono: "DPI",
    role: "Stagiaire Fullstack",
    desc: "Implémentation d'une nouvelle fonctionnalité pour le traitement de la DPI : développement front-end Angular, back-end Spring Boot, intégration avec la base IBM DB2 WLOC.",
    stack: ["Angular", "Spring Boot", "DB2"],
  },
  {
    period: "Août 2022 — Nov 2022",
    title: "Plateforme de suivi matériel",
    company: "DSID — Direction Des Systèmes D'Information Des Douanes",
    mono: "DSID",
    role: "Stagiaire Fullstack",
    desc: "Conception et mise en place complète d'une plateforme web pour le suivi du matériel de la DSID. Modélisation UML, développement Spring Boot / Angular 14, administration base de données.",
    stack: ["Angular 14", "Spring Boot", "UML", "SQL"],
  },
  {
    period: "Juil 2020 — Nov 2020",
    title: "Application de location de voiture",
    company: "École Supérieure Polytechnique de Dakar",
    mono: "ESP",
    role: "Stagiaire Web",
    desc: "Conception et réalisation d'une application web complète pour la location de voiture. Modélisation UML, développement PHP / Bootstrap, administration MySQL.",
    stack: ["PHP", "MySQL", "Bootstrap", "UML"],
  },
];

// Étude de cas phare : les trois applications BNSP, dans l'ordre où un incident les traverse.
const BNSP = {
  client: "Brigade Nationale des Sapeurs-Pompiers",
  period: "2025 — 2026",
  apps: [
    {
      key: "citoyen",
      step: "Signaler",
      name: "PWA Citoyen",
      who: "Pour le témoin d'un incident, sans compte à créer",
      desc: "Le citoyen décrit l'incident et joint photo, vidéo et note vocale ; sa position GPS est captée automatiquement. Il suit ensuite son signalement et reçoit une notification dès qu'une équipe le prend en charge.",
      points: [
        "Photo, vidéo et audio capturés depuis le navigateur",
        "Position GPS sur carte, repère ajustable",
        "Suivi des signalements et notifications push",
      ],
      stack: ["Angular 20", "PWA", "Leaflet", "Web Push"],
    },
    {
      key: "admin",
      step: "Affecter",
      name: "Back-office",
      who: "Pour le centre qui reçoit les alertes",
      desc: "Chaque signalement remonte aussitôt dans le back-office, avec une notification. L'opérateur le situe sur la carte et l'affecte à une équipe disponible, filtrée par région et par type d'intervention.",
      points: [
        "Tableau de bord, interventions et géolocalisation",
        "Équipes, personnel, ressources, rôles et permissions",
        "Notifications, journal d'activité et mode sombre",
      ],
      stack: ["Angular 20", "SSR", "Material", "Leaflet", "Chart.js"],
    },
    {
      key: "pompier",
      step: "Intervenir",
      name: "PWA Pompiers",
      who: "Pour l'équipe sur le terrain",
      desc: "Les pompiers de l'équipe affectée reçoivent une notification. Un seul prend en charge pour tous ; l'application bascule alors sur la carte, avec l'itinéraire, la distance et le temps de trajet.",
      points: [
        "Notification push dès l'affectation",
        "Prise en charge unique pour toute l'équipe",
        "Itinéraire, navigation et clôture sur place",
      ],
      stack: ["Angular 20", "Signals", "Leaflet", "OSRM"],
    },
  ],
  core: ["Node.js", "Express 5", "Sequelize", "MySQL", "Web Push"],
};

// Projets livrés chez Globo Afrique. `draft: true` = masqué tant que la fiche n'est pas complétée.
const PROJECTS = [
  {
    name: "Globo Fleet",
    client: "Globo Afrique · logiciel multi-structures",
    year: "2026",
    kind: "Gestion de parc & maintenance",
    role: "Fullstack — refonte V2 et nouvelles fonctionnalités",
    desc: "Logiciel de gestion de flotte : actifs, missions, maintenances préventives et curatives, stocks de pièces et achats. Il sert autant le gestionnaire de parc que le magasinier, le technicien ou le chauffeur.",
    modules: ["Actifs", "Missions", "Maintenances", "Stocks", "Rapports"],
    features: [
      "Refonte V2 de l'ensemble des écrans",
      "Check-lists d'inspection paramétrables, signées, exportées en PDF",
      "Rapports : coûts, disponibilité, immobilisation, km parcourus",
      "Alertes stock et visites techniques, guide utilisateur complet",
    ],
    stack: ["Laravel", "PHP", "MySQL", "Blade", "DomPDF"],
    // Captures du guide utilisateur, données sensibles masquées par tools/captures.mjs.
    shotsNote: "Captures réelles · données sensibles floutées",
    shots: [
      { src: "assets/projects/globofleet-operationnel.webp", label: "Tableau de bord · Opérationnel" },
      { src: "assets/projects/globofleet-financier.webp", label: "Tableau de bord · Financier" },
      { src: "assets/projects/globofleet-checklists.webp", label: "Check-lists · Équipements et contrôles" },
    ],
  },
  {
    name: "Mercurio",
    client: "Groupe Kirène · SIAGRO",
    year: "2025 — 2026",
    kind: "Pilotage commercial",
    role: "Front-end — conception, intégration API, CI/CD",
    desc: "Plateforme de pilotage de la distribution du Groupe Kirène. Direction, commerciaux et distributeurs y retrouvent chacun leurs chiffres, leurs commandes et leurs factures, dans un espace pensé pour leur profil.",
    modules: ["Direction", "Commercial", "Distributeur", "Admin"],
    features: [
      "Tableau de bord Direction : 17 analyses du chiffre d'affaires",
      "Heatmap du CA par zone et par mois, prévu vs réalisé",
      "Commandes, factures et statut de livraison par distributeur",
      "Exports PDF / Excel, rôles, permissions et journal d'activité",
    ],
    stack: ["Angular 21", "SSR", "ApexCharts", "Chart.js", "GitLab CI"],
    // Le vrai front, alimenté par des données fictives (tools/mercurio-demo.mjs) : aucun chiffre du client.
    shotsNote: "Application réelle · données de démonstration",
    shots: [
      { src: "assets/projects/mercurio-ca.webp", label: "Direction · Chiffre d'affaires" },
      { src: "assets/projects/mercurio-heatmap.webp", label: "Direction · Heatmap zone × mois" },
      { src: "assets/projects/mercurio-analyse.webp", label: "Direction · Analyse des ventes" },
    ],
  },
  {
    name: "PTS",
    client: "Petrosen",
    year: "2024",
    kind: "Suivi des livraisons",
    desc: "Plateforme de suivi des livraisons de produits pétroliers : de la commande client jusqu'à la livraison, avec la gestion des transporteurs, des chauffeurs et des camions à compartiments.",
    modules: ["Commandes", "Flotte", "Livraisons", "Incidents"],
    features: [
      "Transporteurs, chauffeurs et camions compartimentés",
      "Commandes clients et produits",
      "Suivi des livraisons par étapes et statuts",
      "Déclaration d'incidents et documents",
    ],
    stack: ["Angular", "Laravel", "MySQL"],
    // Pages Blade réelles, alimentées par des données fictives (tools/pts-demo.mjs).
    shotsNote: "Application réelle · données de démonstration",
    shots: [
      { src: "assets/projects/pts-dashboard.webp", label: "Tableau de bord · Disponibilités" },
      { src: "assets/projects/pts-livraisons.webp", label: "Suivi des livraisons" },
      { src: "assets/projects/pts-suivi.webp", label: "Suivi d'un acheminement · 13 étapes" },
    ],
  },
];

const SKILLS = {
  "Back-end": [
    ["Java", "expert"],
    ["Spring Boot", "expert"],
    ["PHP", "expert"],
    ["Laravel", "compétent"],
  ],
  "Front-end": [
    ["Angular", "expert"],
    ["React.js", "compétent"],
    ["JavaScript", "expert"],
    ["HTML / CSS", "expert"],
    ["Bootstrap", "expert"],
    ["Figma", "expert"],
  ],
  "Systèmes & Data": [
    ["MySQL", "expert"],
    ["PostgreSQL", "expert"],
    ["Admin. base de données", "expert"],
    ["Admin. système", "expert"],
    ["Cybersécurité", "expert"],
    ["Linux / Windows / macOS", "expert"],
    ["Jira", "expert"],
  ],
};

const EDUCATION = [
  {
    year: "2020 — 2022",
    title: "Diplôme d'Ingénieur Technologue en Informatique",
    school: "École Supérieure Polytechnique de Dakar",
  },
  {
    year: "2018 — 2020",
    title: "Diplôme Supérieur de Technologie en Informatique",
    school: "École Supérieure Polytechnique de Dakar",
  },
  {
    year: "2017 — 2018",
    title: "Baccalauréat Scientifique (S2)",
    school: "École Saint Pierre de Grand Dakar",
  },
  {
    year: "2024 — 2025",
    title: "Certification CompTIA Security+",
    school: "GOMYCODE Dakar",
    isCert: true,
  },
];

// CV généré depuis cv/cv.html : `node cv/build.mjs` refait le PDF et la vignette.
const CV = {
  href: "cv/Robert-Emmanuel-Sagne-CV.pdf",
  file: "Robert-Emmanuel-Sagne-CV.pdf",
  preview: "cv/cv-preview.webp",
  size: "355 Ko",
  updated: "Sept. 2026",
};

// ============== MOTION SYSTEM ==============
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = window.matchMedia('(pointer: fine)').matches;
const MOTION = !REDUCED && !!window.gsap;

// Shared state between the GSAP timelines and the canvas render loop.
const FIELD = { reveal: REDUCED ? 1 : 0 };

const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#01';

function scramble(el, duration = 0.9) {
  const final = el.dataset.text || el.textContent;
  el.dataset.text = final;
  const proxy = { p: 0 };
  return gsap.to(proxy, {
    p: 1,
    duration,
    ease: 'none',
    onUpdate() {
      const n = Math.floor(proxy.p * final.length);
      let out = final.slice(0, n);
      for (let i = n; i < final.length; i++) {
        out += final[i] === ' ' ? ' ' : SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
      }
      el.textContent = out;
    },
    onComplete() { el.textContent = final; },
  });
}

function Chars({ text }) {
  return text.split('').map((c, i) => (
    <span className="char" key={i}>{c === ' ' ? ' ' : c}</span>
  ));
}

// ============== HOOKS ==============
function useClock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  const opt = { timeZone: 'Africa/Dakar', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  return new Intl.DateTimeFormat('fr-FR', opt).format(t);
}

// ============== CURSOR ==============
function Cursor() {
  const outer = useRef(null);
  const stretch = useRef(null);
  const dot = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (!FINE || !MOTION) return;
    document.documentElement.classList.add('has-cursor');
    const o = outer.current, s = stretch.current, d = dot.current;
    gsap.set([o, d], { xPercent: -50, yPercent: -50 });
    const ringX = gsap.quickTo(o, 'x', { duration: 0.5, ease: 'power3' });
    const ringY = gsap.quickTo(o, 'y', { duration: 0.5, ease: 'power3' });
    const dotX = gsap.quickTo(d, 'x', { duration: 0.08, ease: 'power3' });
    const dotY = gsap.quickTo(d, 'y', { duration: 0.08, ease: 'power3' });
    let lx = 0, ly = 0, shown = false;

    const onMove = (e) => {
      if (!shown) {
        shown = true;
        gsap.set([o, d], { x: e.clientX, y: e.clientY });
        gsap.to([o, d], { autoAlpha: 1, duration: 0.3 });
      }
      ringX(e.clientX); ringY(e.clientY);
      dotX(e.clientX); dotY(e.clientY);
      const dx = e.clientX - lx, dy = e.clientY - ly;
      lx = e.clientX; ly = e.clientY;
      const speed = Math.min(Math.hypot(dx, dy) / 60, 0.45);
      gsap.to(s, {
        rotation: Math.atan2(dy, dx) * 180 / Math.PI,
        scaleX: 1 + speed,
        scaleY: 1 - speed * 0.5,
        duration: 0.2,
        overwrite: true,
        onComplete: () => gsap.to(s, { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'power3' }),
      });
    };

    const setState = (target) => {
      o.classList.remove('is-hover', 'is-label', 'is-hidden');
      d.classList.remove('is-hidden');
      if (!target) return;
      if (target.dataset.cursor === 'hide') {
        o.classList.add('is-hidden');
        d.classList.add('is-hidden');
      } else if (target.dataset.cursorLabel) {
        label.current.textContent = target.dataset.cursorLabel;
        o.classList.add('is-label');
        d.classList.add('is-hidden');
      } else {
        o.classList.add('is-hover');
      }
    };
    const onOver = (e) => setState(e.target.closest('[data-cursor], [data-cursor-label], a, button'));
    const onLeave = () => { shown = false; gsap.to([o, d], { autoAlpha: 0, duration: 0.3 }); };
    const onDown = () => gsap.to(s, { scale: 0.8, duration: 0.2, overwrite: true });
    const onUp = () => gsap.to(s, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)', overwrite: true });

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={outer} aria-hidden="true">
        <div className="cursor-stretch" ref={stretch}>
          <div className="cursor-body"></div>
        </div>
        <span className="cursor-label" ref={label}></span>
      </div>
      <div className="cursor-dot" ref={dot} aria-hidden="true"></div>
    </>
  );
}

// ============== HERO DOT FIELD ==============
function DotField() {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext('2d');
    const GAP = FINE ? 26 : 34;
    const RADIUS = 170;
    let w = 0, h = 0, dots = [], raf = 0, visible = true;
    const mouse = { x: -9999, y: -9999, sx: -9999, sy: -9999, active: false };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = c.getBoundingClientRect();
      w = r.width; h = r.height;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      const offX = (w % GAP) / 2 + GAP / 2, offY = (h % GAP) / 2 + GAP / 2;
      for (let y = offY; y < h; y += GAP) {
        for (let x = offX; x < w; x += GAP) dots.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
      }
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      mouse.sx += (mouse.x - mouse.sx) * 0.12;
      mouse.sy += (mouse.y - mouse.sy) * 0.12;
      const cx = w * 0.5, cy = h * 0.55;
      const maxR = Math.hypot(w, h) * 0.6;
      const revealR = FIELD.reveal * maxR;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        let tx = d.ox, ty = d.oy, near = 0;
        if (mouse.active) {
          const dx = d.ox - mouse.sx, dy = d.oy - mouse.sy;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS) {
            near = 1 - dist / RADIUS;
            const push = near * near * 42;
            tx += (dx / (dist || 1)) * push;
            ty += (dy / (dist || 1)) * push;
          }
        }
        d.vx = (d.vx + (tx - d.x) * 0.14) * 0.74;
        d.vy = (d.vy + (ty - d.y) * 0.14) * 0.74;
        d.x += d.vx; d.y += d.vy;

        const fromCenter = Math.hypot(d.ox - cx, d.oy - cy);
        const rev = Math.max(0, Math.min(1, (revealR - fromCenter) / 160));
        if (rev <= 0) continue;
        const wave = 0.5 + 0.5 * Math.sin(t * 0.0009 + d.ox * 0.012 + d.oy * 0.017);
        const a = (0.06 + wave * 0.12 + near * 0.8) * rev;
        const size = 1 + near * 1.8 + (rev < 1 ? (1 - rev) * 2 : 0);
        ctx.fillStyle = near > 0.05
          ? `rgba(242, 205, 58, ${a})`
          : `rgba(242, 237, 226, ${a})`;
        ctx.fillRect(d.x - size / 2, d.y - size / 2, size, size);
      }
    };

    const loop = (t) => {
      if (visible) draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      const r = c.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      if (!mouse.active) { mouse.sx = mouse.x; mouse.sy = mouse.y; mouse.active = true; }
    };
    const onLeave = () => { mouse.active = false; };

    resize();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(c);
    window.addEventListener('resize', resize);
    if (REDUCED) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
      if (FINE) {
        window.addEventListener('mousemove', onMove);
        document.documentElement.addEventListener('mouseleave', onLeave);
      }
    }
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas className="dotfield" ref={ref} aria-hidden="true"></canvas>;
}

// ============== COMPONENTS ==============
function Intro() {
  if (!MOTION) return null;
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-layer intro-layer--accent"></div>
      <div className="intro-layer intro-layer--main">
        <div className="intro-label intro-fade">Loading portfolio</div>
        <div className="intro-num">
          {[0, 1, 2].map(i => (
            <span className="digit" key={i}>
              <span className="digit-col">
                {Array.from({ length: 10 }, (_, n) => <span key={n}>{n}</span>)}
              </span>
            </span>
          ))}
        </div>
        <div className="intro-bar"><span></span></div>
        <div className="intro-label intro-fade">Robert Emmanuel · 2026</div>
      </div>
    </div>
  );
}

function Nav() {
  const t = useClock();
  const links = [
    ['about', '01', 'À propos'],
    ['work', '02', 'Expériences'],
    ['projects', '03', 'Projets'],
    ['skills', '04', 'Stack'],
    ['edu', '05', 'Formation'],
    ['contact', '06', 'Contact'],
  ];
  return (
    <nav className="nav">
      <a href="#top" className="nav-mark">
        <span className="dot"></span>
        <span>RE/MS</span>
      </a>
      <ul className="nav-links">
        {links.map(([id, num, label]) => (
          <li key={id}>
            <a href={`#${id}`} data-section={id}>
              <span className="nav-num">{num}</span>
              <span className="roll" data-text={label}><span>{label}</span></span>
            </a>
          </li>
        ))}
      </ul>
      <div className="nav-end">
        <a href={CV.href} download={CV.file} className="nav-cv" data-magnetic="0.3" aria-label={`Télécharger le CV (PDF, ${CV.size})`}>
          <span className="nav-cv-ic" aria-hidden="true">
            <svg viewBox="0 0 12 12" fill="none">
              <path className="nav-cv-arrow" d="M6 1V8M3 5.2L6 8.2L9 5.2" />
              <path d="M1.5 11H10.5" />
            </svg>
          </span>
          <span className="roll" data-text="CV"><span>CV</span></span>
        </a>
        <div className="nav-time">Dakar · {t}</div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header className="hero" id="top">
      <DotField />
      <div className="hero-top">
        <div className="meta-block hero-fade">
          <div className="label">Portfolio · 2026</div>
          <div className="value">v.01 — Édition unique</div>
        </div>
        <div className="meta-block hero-fade">
          <div className="label">Index</div>
          <div className="value">001 / 006</div>
        </div>
      </div>

      <div className="hero-main">
        <h1 className="hero-title" aria-label="Robert Emmanuel Sagne">
          <span className="line l1" aria-hidden="true"><span className="line-inner"><Chars text="Robert" /></span></span>
          <span className="line l2" aria-hidden="true"><span className="line-inner ital"><Chars text="Emmanuel" /></span></span>
          <span className="line l3" aria-hidden="true">
            <span className="line-inner"><Chars text="Sagne" /></span>
            <span className="small-line"><span className="small-rule"></span><span className="small-text">Développeur Fullstack · basé à Dakar</span></span>
          </span>
        </h1>

        <a href="#contact" className="badge" data-magnetic="0.5" data-cursor-label="Contact" aria-label="En poste chez Globo Afrique — me contacter">
          <svg className="badge-ring" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <path id="badge-circle" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
            </defs>
            <text>
              <textPath href="#badge-circle" textLength="500" lengthAdjust="spacing">
                En poste · Globo Afrique · Dakar · Fullstack ·
              </textPath>
            </text>
          </svg>
          <span className="badge-core" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <path d="M1 13L13 1M13 1H4M13 1V10" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
        </a>
      </div>

      <div className="hero-bottom">
        <span className="hero-rule"></span>
        <div className="col hero-fade">
          <div className="label">Rôle</div>
          <div className="value">Fullstack · Sécurité</div>
        </div>
        <div className="col hero-fade">
          <div className="label">Spécialités</div>
          <div className="value">Spring Boot · Angular · React</div>
        </div>
        <div className="col hero-fade">
          <div className="label">Statut</div>
          <div className="value status"><span className="live"></span>En poste · CDD</div>
        </div>
        <a href="#about" className="scroll-cta hero-fade">
          <span>Défiler</span>
          <span className="arrow" data-magnetic="0.6">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1V11M6 11L1 6M6 11L11 6" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
        </a>
      </div>
    </header>
  );
}

function SectionHead({ num, label, title }) {
  return (
    <div className="section-head">
      <div className="eyebrow">
        <span className="num" data-scramble>[{num}]</span>
        <span className="sep">·</span>
        <span data-scramble>{label}</span>
      </div>
      <div className="title split-words">{title}</div>
    </div>
  );
}

function About() {
  return (
    <section className="section" id="about">
      <span className="rule"></span>
      <SectionHead num="01" label="À propos" title="Construire avec rigueur, livrer avec passion." />

      <div className="about-grid">
        <p className="about-lead">
          Jeune ingénieur en informatique <em>passionné</em> par l'innovation, motivé par la recherche de nouveaux défis.
        </p>
        <div className="about-text">
          <p className="split-lines">
            Doté d'une solide expertise technique et d'une capacité d'adaptation remarquable, je conçois et déploie des plateformes web complètes — du modèle UML jusqu'à la mise en production — pour des organismes publics et privés à Dakar.
          </p>
          <p className="split-lines">
            Spring Boot, Angular, React, bases relationnelles, sécurité système : je choisis les outils qui servent le problème, pas l'inverse. Mon objectif : contribuer activement à des projets ambitieux dans un environnement dynamique et stimulant.
          </p>

          <div className="about-stats">
            {[[5, 'Expériences'], [6, 'Années de code'], [1, 'Certif. Security+']].map(([n, l]) => (
              <div className="stat" key={l}>
                <span className="stat-rule"></span>
                <div className="n" data-count={n}>{String(n).padStart(2, '0')}</div>
                <div className="l">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ['Spring Boot', 'Angular', 'React.js', 'Java', 'PostgreSQL', 'Cybersécurité', 'Figma', 'PHP', 'MySQL', 'Laravel'];
  const row = (list, outline) => [...list, ...list].map((it, i) => (
    <React.Fragment key={i}>
      <span className={`item ${i % 2 ? 'alt' : ''} ${outline ? 'outline' : ''}`}>{it}</span>
      <span className="dot"></span>
    </React.Fragment>
  ));
  return (
    <div className="marquee" aria-label={items.join(', ')}>
      <div className="marquee-row"><div className="marquee-track" aria-hidden="true">{row(items, false)}</div></div>
      <div className="marquee-row"><div className="marquee-track" aria-hidden="true">{row([...items].reverse(), true)}</div></div>
    </div>
  );
}

function XpPreview() {
  if (!FINE || !MOTION) return null;
  return (
    <div className="xp-preview" aria-hidden="true">
      <div className="xp-preview-inner">
        {EXPERIENCES.map((x, i) => (
          <div className="xp-card" key={i}>
            <div className="xp-card-top">
              <span>{String(i + 1).padStart(2, '0')} / {String(EXPERIENCES.length).padStart(2, '0')}</span>
              <span>{x.role}</span>
            </div>
            <div className="xp-card-mono">{x.mono}</div>
            <div className="xp-card-bottom">{x.period}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Experience() {
  return (
    <section className="section" id="work">
      <span className="rule"></span>
      <SectionHead num="02" label="Expériences" title="Cinq terrains. Une méthode." />
      <div className="xp-list" data-cursor="hide">
        {EXPERIENCES.map((x, i) => (
          <article className="xp-item" key={i}>
            <span className="xp-line"></span>
            <span className="xp-fill"></span>
            <div className="xp-inner">
              <div className="xp-period xp-anim">
                <span className="xp-index">{String(i + 1).padStart(2, '0')}</span>
                {x.period}
              </div>
              <div className="xp-main">
                <h3 className="xp-anim">{x.title}</h3>
                <div className="company xp-anim">{x.company} · <span className="xp-role">{x.role}</span></div>
                <p className="xp-anim">{x.desc}</p>
              </div>
              <div className="xp-stack">
                {x.stack.map((s, j) => <span className="xp-pill" key={j}>{s}</span>)}
              </div>
            </div>
          </article>
        ))}
        <span className="xp-line xp-line--end"></span>
      </div>
      <XpPreview />
    </section>
  );
}

// ============== BNSP SCREENS ==============
// Mockups dessinés en HTML/SVG. Le DOM porte l'état FINAL de chaque scène (repli sans animation) ;
// les timelines de buildBnsp posent l'état initial puis rejouent la scène.
const ICONS = {
  flame: <path d="M12 3c.6 3.4 5 5.6 5 10.4a5 5 0 0 1-10 0c0-2.6 1.5-3.9 2.2-6.1 1.3 1 2 2.3 2.3 3.6.9-2.4 1-5.1.5-7.9z" />,
  camera: <><path d="M4 8h3.2l1.6-2.5h6.4L16.8 8H20v11H4z" /><circle cx="12" cy="13.2" r="3.2" /></>,
  video: <><rect x="3" y="7" width="12.5" height="10" rx="2" /><path d="M15.5 11l5.5-3v8l-5.5-3" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  bell: <><path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>,
  nav: <path d="M4 11.5L20 4l-7.5 16-1.8-6.7z" />,
};

function Icon({ name }) {
  return (
    <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

// Repère de carte dont la pointe est en (0,0) : on le place avec un <g transform> parent.
function MapPin({ className }) {
  return (
    <g className={className}>
      <ellipse className="map-pin-halo" cx="0" cy="0" rx="7" ry="2.4" />
      <path className="map-pin-body" d="M0 0C-1.8-3.6-6-6.6-6-10.8a6 6 0 0 1 12 0C6-6.6 1.8-3.6 0 0Z" />
      <circle className="map-pin-eye" cx="0" cy="-10.8" r="2.2" />
    </g>
  );
}

function Phone({ variant, label, children }) {
  return (
    <div className={`phone phone--${variant}`} role="img" aria-label={label}>
      <div className="phone-screen" aria-hidden="true">
        <div className="scr-status"><span>10:24</span><span className="scr-bat"></span></div>
        {children}
      </div>
    </div>
  );
}

function ScreenCitoyen() {
  const types = ['Incendie', 'Accident', 'Inondation', 'Effondrement', 'Malaise'];
  return (
    <Phone variant="citoyen" label="Application citoyenne : signalement d'un incendie avec photo, vidéo, audio et position GPS, puis confirmation d'envoi">
      <div className="cit-head">
        <span className="cit-logo">BNSP</span>
        <b>Signaler un incident</b>
      </div>
      <div className="cit-label">Type d'incident</div>
      <div className="cit-types">
        {types.map((t, i) => i === 0 ? (
          <span className="cit-type cit-type--on" key={t}>
            <Icon name="flame" />{t}
            <span className="cit-type-fill"><Icon name="flame" />{t}</span>
          </span>
        ) : <span className="cit-type" key={t}>{t}</span>)}
      </div>
      <div className="cit-label">Photo, vidéo et audio</div>
      <div className="cit-media">
        {[['camera', 'Photo'], ['video', 'Vidéo'], ['mic', 'Audio']].map(([ic, l]) => (
          <div className="cit-tile" key={l}>
            <Icon name={ic} />
            <span>{l}</span>
            <span className="cit-check"><Icon name="check" /></span>
          </div>
        ))}
      </div>
      <div className="cit-label">Position</div>
      <div className="cit-map">
        <svg viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice">
          <rect className="map-block" x="46" y="58" width="50" height="18" rx="2" />
          <rect className="map-block" x="112" y="24" width="30" height="18" rx="2" />
          <path className="map-street" d="M0 18H160M0 50H160M0 84H160M38 0V110M104 0V110" />
          <path className="map-street map-street--main" d="M0 104L160 10" />
          <g transform="translate(71 50)"><MapPin className="cit-pin" /></g>
        </svg>
        <span className="cit-gps">GPS · ±8 m</span>
      </div>
      <div className="cit-send">Envoyer le signalement</div>
      <div className="cit-sheet">
        <span className="cit-sheet-ic"><Icon name="check" /></span>
        <b>Signalement envoyé</b>
        <small>Vous serez notifié dès la prise en charge</small>
      </div>
    </Phone>
  );
}

function ScreenAdmin() {
  const teams = [['Équipe Alpha', 'Disponible', 'ok'], ['Équipe Delta', 'Disponible', 'ok'], ['Équipe Bravo', 'En mission', 'busy']];
  return (
    <div className="browser" role="img" aria-label="Back-office : un nouveau signalement apparaît sur la carte et est affecté à l'équipe Alpha, qui est notifiée">
      <div className="browser-bar" aria-hidden="true"><i></i><i></i><i></i><span className="browser-tab">GISP · Interventions</span></div>
      <div className="adm" aria-hidden="true">
        <aside className="adm-rail">
          <span className="adm-logo"></span>
          {[0, 1, 2, 3, 4].map(i => <i key={i} className={i === 1 ? 'is-on' : ''}></i>)}
        </aside>
        <div className="adm-main">
          <div className="adm-top">
            <b>Interventions</b>
            <span className="adm-bell"><Icon name="bell" /><em className="adm-badge">1</em></span>
          </div>
          <div className="adm-kpis">
            <div className="adm-kpi adm-kpi--wait"><small>En attente</small><b className="adm-n-wait">0</b></div>
            <div className="adm-kpi"><small>En cours</small><b className="adm-n-run">3</b></div>
            <div className="adm-kpi"><small>Clôturées</small><b>14</b></div>
          </div>
          <div className="adm-map">
            <div className="adm-sweep"></div>
            <svg viewBox="0 0 200 110" preserveAspectRatio="xMidYMid slice">
              <rect className="map-block" x="98" y="52" width="46" height="20" rx="2" />
              <rect className="map-block" x="36" y="84" width="46" height="10" rx="2" />
              <path className="map-street" d="M0 22H200M0 44H200M0 78H200M0 96H200M30 0V110M90 0V110M150 0V110" />
              <path className="map-street map-street--main" d="M0 104L200 8" />
              <path className="adm-link" d="M58 78H90V44H122" pathLength="1" />
              {[[40, 22], [150, 96]].map(([x, y], i) => <circle className="adm-team" cx={x} cy={y} r="3" key={i} />)}
              <circle className="adm-team adm-team--alpha" cx="58" cy="78" r="3.4" />
              <g transform="translate(122 44)">
                <g className="adm-incident">
                  <circle className="adm-incident-ping" r="4" />
                  <circle className="adm-incident-dot" r="4" />
                </g>
              </g>
            </svg>
          </div>
        </div>
        <div className="adm-pop">
          <b>Affecter une équipe</b>
          <small>Filtrées par type · Incendie</small>
          {teams.map(([n, s, st], i) => (
            <div className={`adm-row adm-row--${st}${i === 0 ? ' adm-row--pick' : ''}`} key={n}>
              {i === 0 && <span className="adm-row-hl"></span>}
              <span className="adm-row-dot"></span><span>{n}</span><em>{s}</em>
            </div>
          ))}
          <span className="adm-assign">Affecter</span>
        </div>
        <div className="adm-toast"><Icon name="check" />Équipe Alpha notifiée</div>
      </div>
    </div>
  );
}

function ScreenPompier() {
  return (
    <Phone variant="pompier" label="Application pompiers : notification d'intervention, prise en charge, puis itinéraire vers l'incident">
      <div className="pmp-top">
        <b>En cours</b>
        <span className="pmp-state">En intervention</span>
      </div>
      <div className="pmp-stage">
        <div className="pmp-map">
          <svg viewBox="0 0 100 130" preserveAspectRatio="xMidYMid slice">
            <rect className="map-block" x="28" y="68" width="18" height="22" rx="2" />
            <rect className="map-block" x="58" y="40" width="14" height="16" rx="2" />
            <path className="map-street" d="M0 34H100M0 62H100M0 96H100M0 110H100M22 0V130M52 0V130M78 0V130" />
            <path className="map-street map-street--main" d="M0 128L100 72" />
            <path className="pmp-route" d="M22 110V96H52V62H78V38" pathLength="1" />
            <g transform="translate(22 110)">
              <circle className="pmp-me-halo" r="5" />
              <circle className="pmp-me" r="2.6" />
            </g>
            <g transform="translate(78 38)"><MapPin className="pmp-target" /></g>
          </svg>
          <div className="pmp-chip"><b>2,4 km</b><span>6 min</span></div>
        </div>
        <div className="pmp-empty"><span className="live"></span>En attente d'affectation</div>
        <div className="pmp-card">
          <div className="pmp-band"><Icon name="flame" />Incendie<em>Priorité haute</em></div>
          <p>Départ de feu dans un entrepôt, fumée visible depuis la route.</p>
          <small>Affectée à 10:26</small>
          <span className="pmp-take">Prendre en charge</span>
          <span className="pmp-more">Voir les détails</span>
        </div>
      </div>
      <div className="pmp-actions">
        <span className="pmp-btn pmp-btn--nav"><Icon name="nav" />Naviguer</span>
        <span className="pmp-btn">Terminer</span>
      </div>
      <nav className="pmp-tabs"><span className="is-on">En cours</span><span>Historique</span></nav>
      <div className="pmp-push">
        <span className="pmp-push-ic"><Icon name="flame" /></span>
        <div><b>Nouvelle intervention</b><small>Incendie · priorité haute</small></div>
        <em>maintenant</em>
      </div>
    </Phone>
  );
}

const SCREENS = { citoyen: ScreenCitoyen, admin: ScreenAdmin, pompier: ScreenPompier };

function BnspCase() {
  return (
    <div className="bnsp">
      <div className="bnsp-pin">
        <div className="bnsp-head">
          <span><b>Étude de cas</b> · BNSP</span>
          <span>{BNSP.client}</span>
          <span>{BNSP.period}</span>
        </div>

        <div className="bnsp-track">
          <div className="bnsp-intro">
            <h3 className="bnsp-intro-title">Un incident, <em>trois applications,</em> une seule chaîne.</h3>
            <p className="bnsp-lead">
              Le citoyen signale, le centre affecte, l'équipe intervient. J'ai conçu et développé les trois interfaces de l'écosystème BNSP, branchées sur une même API.
            </p>
            <div className="bnsp-hint"><span className="bnsp-hint-dot"></span>Suivez l'incident</div>
          </div>

          {BNSP.apps.map((a, i) => {
            const Screen = SCREENS[a.key];
            return (
              <article className={`bnsp-panel bnsp-panel--${a.key}`} data-scene={a.key} key={a.key}>
                <div className="bnsp-copy">
                  <div className="bnsp-step"><span className="n">{String(i + 1).padStart(2, '0')}</span>{a.step}</div>
                  <h4 className="bnsp-app">{a.name}</h4>
                  <div className="bnsp-who">{a.who}</div>
                  <p className="bnsp-desc">{a.desc}</p>
                  <ul className="bnsp-points">
                    {a.points.map(pt => <li key={pt}>{pt}</li>)}
                  </ul>
                  <div className="project-stack">
                    {a.stack.map(t => <span className="xp-pill" key={t}>{t}</span>)}
                  </div>
                </div>
                <div className="bnsp-device"><Screen /></div>
              </article>
            );
          })}

          <div className="bnsp-outro">
            <h3 className="bnsp-outro-title">Du signalement à l'intervention, <em>sans ressaisie.</em></h3>
            <p className="bnsp-lead">
              Les trois applications partagent la même API. Chaque changement de statut part en notification push, avec une synchronisation de secours toutes les 30 secondes quand l'application est ouverte.
            </p>
            <div className="project-stack">
              {BNSP.core.map(t => <span className="xp-pill" key={t}>{t}</span>)}
            </div>
          </div>
        </div>

        <div className="bnsp-rail" aria-hidden="true">
          <span className="bnsp-rail-fill"></span>
          {BNSP.apps.map((a, i) => (
            <span className="bnsp-node" key={a.key}>
              <span>{String(i + 1).padStart(2, '0')} · {a.step}</span>
            </span>
          ))}
          <span className="bnsp-packet-track"><span className="bnsp-packet"></span></span>
        </div>
      </div>
    </div>
  );
}

// ============== PROJECT VISUALS ==============
// Captures réelles empilées : l'écran de devant défile seul, glisse derrière la pile, le suivant avance.
// La barre de progression active pilote le rythme : son animationend passe à l'écran suivant, donc mettre
// l'animation CSS en pause (survol, carte hors de l'écran) met le défilement en pause.
function ScreenDeck({ name, shots, note }) {
  const [current, setCurrent] = useState(0);
  const [leaving, setLeaving] = useState(-1);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const n = shots.length;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const show = (next) => {
    if (next === current) return;
    // L'écran de devant qui part au fond de la pile joue sa sortie ; les autres glissent simplement.
    setLeaving((current - next + n) % n === n - 1 ? current : -1);
    setCurrent(next);
  };
  const autoplay = !REDUCED;
  const paused = hover || !visible;

  return (
    <div
      ref={ref}
      className={`pv pv-deck${paused ? ' is-paused' : ''}${autoplay ? '' : ' is-static'}`}
      onMouseEnter={() => FINE && setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="deck-stage">
        {shots.map((s, i) => (
          <figure
            className={`deck-screen${i === leaving ? ' is-leaving' : ''}`}
            key={s.src}
            style={{ '--d': (i - current + n) % n }}
            aria-hidden={i !== current}
            onAnimationEnd={(e) => { if (e.animationName === 'deck-leave') setLeaving(-1); }}
          >
            <div className="browser-bar" aria-hidden="true"><i></i><i></i><i></i><span className="browser-tab">{name} · {s.label}</span></div>
            <img src={s.src} alt={`${name} : ${s.label}`} width="1280" height="800" loading="lazy" decoding="async" />
          </figure>
        ))}
      </div>
      <div className="deck-ui">
        <div className="deck-tabs">
          {shots.map((s, i) => (
            <button
              type="button"
              className={`deck-tab${i === current ? ' is-on' : ''}${i < current ? ' is-past' : ''}`}
              key={s.src}
              aria-label={`Afficher : ${s.label}`}
              aria-pressed={i === current}
              onClick={() => show(i)}
            >
              <span
                className="deck-tab-fill"
                onAnimationEnd={(e) => { if (autoplay && e.animationName === 'deck-progress') show((current + 1) % n); }}
              ></span>
            </button>
          ))}
        </div>
        <div className="deck-caption">
          <span className="deck-count">{String(current + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
          <span className="deck-label" key={current}>{shots[current].label}</span>
        </div>
      </div>
      {note && <div className="deck-note">{note}</div>}
    </div>
  );
}

function Projects() {
  const list = PROJECTS.filter(p => !p.draft);
  return (
    <section className="section" id="projects">
      <span className="rule"></span>
      <SectionHead num="03" label="Projets" title="Livré chez Globo Afrique." />
      <BnspCase />
      <div className="projects-stack">
        {list.map((p, i) => (
          <article className="project-card" key={p.name} style={{ '--i': i }}>
            <div className="project-info">
              <div className="project-meta">
                <span className="project-index">{String(i + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}</span>
                <span>{p.kind} · {p.year}</span>
              </div>
              <div>
                <h3 className="project-name">{p.name}</h3>
                <div className="project-client">{p.client}</div>
                <p className="project-desc">{p.desc}</p>
                {p.role && <div className="project-role">{p.role}</div>}
              </div>
              <ul className="project-features">
                {p.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <div className="project-stack">
                {p.stack.map(t => <span className="xp-pill" key={t}>{t}</span>)}
              </div>
            </div>
            <div className="project-visual">
              <ScreenDeck name={p.name} shots={p.shots} note={p.shotsNote} />
              <div className="project-modules">
                {p.modules.map(m => <span key={m}>{m}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="section" id="skills">
      <span className="rule"></span>
      <SectionHead num="04" label="Compétences" title="La stack." />

      <Marquee />

      <div className="skills-block">
        {Object.entries(SKILLS).map(([cat, list]) => (
          <div className="skill-col" key={cat}>
            <h4><span data-scramble>{cat}</span> <span className="count">{String(list.length).padStart(2, '0')}</span></h4>
            <span className="col-rule"></span>
            <ul>
              {list.map(([name, lvl], i) => (
                <li key={i}>
                  <span className="skill-name"><span className="bullet"></span>{name}</span>
                  <span className={`level ${lvl}`}>— {lvl}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Education() {
  return (
    <section className="section" id="edu">
      <span className="rule"></span>
      <SectionHead num="05" label="Formation" title="Le parcours." />

      <div className="edu-list">
        {EDUCATION.map((e, i) => (
          <article className={`edu-item ${e.isCert ? 'cert' : ''}`} key={i}>
            <div className="edu-content">
              <div className="year">{e.year}</div>
              <h3>{e.title}</h3>
              <div className="school">{e.school}</div>
            </div>
          </article>
        ))}
      </div>

      <CvDrop />
    </section>
  );
}

// Le CV sort d'une fente d'imprimante au fil du défilement. Le DOM porte l'état final (feuille sortie) :
// buildCv pose l'état initial et rejoue l'impression.
function CvDrop() {
  const meta = [['Format', 'PDF · A4'], ['Pages', '1'], ['Poids', CV.size], ['Mise à jour', CV.updated]];
  return (
    <div className="cvd">
      <div className="cvd-copy">
        <div className="cvd-eyebrow">
          <span className="num" data-scramble>[CV]</span>
          <span className="sep">·</span>
          <span data-scramble>Version imprimable</span>
        </div>
        <h3 className="cvd-title split-words">Tout le parcours, <em>sur une page.</em></h3>
        <p className="cvd-lead">
          Expériences, projets, stack et formation, condensés sur une page A4 : lisible d'un coup d'œil, prête à imprimer ou à transmettre.
        </p>
        <dl className="cvd-meta">
          {meta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
        <a href={CV.href} download={CV.file} className="cvd-btn" data-magnetic="0.2" data-cursor="hide">
          <span className="cvd-btn-fill"></span>
          <span className="cvd-btn-ic" aria-hidden="true">
            <svg viewBox="0 0 44 44" fill="none">
              <circle className="cvd-ring" cx="22" cy="22" r="20.5" pathLength="1" />
              <g className="cvd-arrow"><path className="cvd-arrow-loop" d="M22 14V29M16 23.5L22 29.5L28 23.5" /></g>
              <path className="cvd-check" d="M15.5 22.5L20 27L29 17.5" pathLength="1" />
            </svg>
          </span>
          <span className="cvd-btn-label">
            <span className="cvd-btn-roll">
              <span>Télécharger le CV</span>
              <span aria-hidden="true">Téléchargement…</span>
              <span aria-hidden="true">Téléchargé</span>
            </span>
          </span>
          <span className="cvd-btn-meta">PDF · {CV.size}</span>
          <span className="cvd-btn-bar"></span>
        </a>
      </div>

      <div className="cvd-stage">
        <div className="cvd-printer">
          <div className="cvd-feed">
            <div className="cvd-tilt">
              <a href={CV.href} target="_blank" rel="noopener" className="cvd-sheet" data-cursor-label="Voir" aria-label="Ouvrir le CV (PDF) dans un nouvel onglet">
                <img src={CV.preview} alt="" width="794" height="1123" loading="lazy" decoding="async" />
                <span className="cvd-scan"></span>
                <span className="cvd-glare"></span>
              </a>
            </div>
          </div>
          <div className="cvd-slot" aria-hidden="true">
            <span className="cvd-slot-label">RE/MS · A4</span>
            <span className="cvd-led"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Contact() {
  return (
    <section className="cta" id="contact">
      <span className="rule"></span>
      <div className="cta-orb" aria-hidden="true"></div>
      <div className="cta-pre" data-scramble>[06] · Travaillons ensemble</div>
      <h2 className="cta-title">
        Un projet <em>ambitieux ?</em><br />
        Discutons-en.
      </h2>
      <div className="cta-actions">
        <a href={`mailto:${PROFILE.email}`} className="email-btn" data-magnetic="0.3" data-cursor="hide">
          <span className="email-fill"></span>
          <span className="email-text">{PROFILE.email}</span>
          <span className="arrow">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 13L13 1M13 1H4M13 1V10" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
        </a>
      </div>
      <div className="cta-links">
        <a href={`tel:${PROFILE.phone}`} data-magnetic="0.25">+221 77 866 20 79</a>
        <a href="#" target="_blank" rel="noopener" data-magnetic="0.25">LinkedIn ↗</a>
        <a href={CV.href} download={CV.file} data-magnetic="0.25">CV · PDF ↓</a>
        <a href="#top" data-magnetic="0.25">Retour haut ↑</a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <div>© 2026 — Robert Emmanuel Mamadou Sagne</div>
      <div>Dakar · Sénégal</div>
      <div>Construit avec rigueur</div>
    </footer>
  );
}

// ============== CHOREOGRAPHY ==============
function buildIntro(lenis) {
  const tl = gsap.timeline();
  const cols = gsap.utils.toArray('.intro .digit-col');
  const bar = '.intro-bar span';
  const counter = { v: 0 };
  const renderDigits = () => {
    const s = String(Math.round(counter.v)).padStart(3, '0');
    cols.forEach((col, i) => { col.style.transform = `translateY(${-Number(s[i]) * 10}%)`; });
  };

  gsap.set('.hero-title .char', { yPercent: 115, rotate: 8 });
  gsap.set('.hero-fade', { autoAlpha: 0, y: 24 });
  gsap.set('.hero-rule', { scaleX: 0 });
  gsap.set('.small-rule', { scaleX: 0 });
  gsap.set('.small-text', { autoAlpha: 0, x: -12 });
  gsap.set('.badge', { scale: 0, rotate: -90 });
  gsap.set('.nav', { autoAlpha: 0, y: -16 });

  tl.from('.intro-fade', { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.1, ease: 'power3.out' })
    .from('.intro .digit', { yPercent: 100, duration: 0.8, stagger: 0.06, ease: 'expo.out' }, 0.1)
    .to(counter, {
      v: 100,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        renderDigits();
        gsap.set(bar, { scaleX: counter.v / 100 });
      },
    }, 0.3)
    .addLabel('exit')
    .to('.intro .digit', { yPercent: -110, duration: 0.7, stagger: 0.05, ease: 'expo.in' }, 'exit')
    .to('.intro-fade', { autoAlpha: 0, y: -12, duration: 0.4, stagger: 0.05, ease: 'power2.in' }, 'exit')
    .to(bar, { scaleX: 0, transformOrigin: 'right center', duration: 0.6, ease: 'expo.in' }, 'exit')
    .addLabel('curtain', '-=0.1')
    .to('.intro-layer--main', { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, 'curtain')
    .to('.intro-layer--accent', { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, 'curtain+=0.14')
    .addLabel('hero', 'curtain+=0.65')
    .to(FIELD, { reveal: 1, duration: 2.4, ease: 'power2.out' }, 'hero')
    .to('.hero-title .char', {
      yPercent: 0,
      rotate: 0,
      duration: 1.4,
      ease: 'expo.out',
      stagger: { each: 0.035, from: 'start' },
    }, 'hero')
    .to('.small-rule', { scaleX: 1, duration: 1, ease: 'expo.inOut' }, 'hero+=0.6')
    .to('.small-text', { autoAlpha: 1, x: 0, duration: 0.9, ease: 'expo.out' }, 'hero+=0.9')
    .to('.hero-rule', { scaleX: 1, duration: 1.4, ease: 'expo.inOut' }, 'hero+=0.3')
    .to('.hero-fade', { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07, ease: 'expo.out' }, 'hero+=0.5')
    .to('.nav', { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out' }, 'hero+=0.6')
    .to('.badge', { scale: 1, rotate: 0, duration: 1.4, ease: 'elastic.out(1, 0.6)' }, 'hero+=0.8')
    .add(() => {
      gsap.set('.intro', { display: 'none' });
      document.documentElement.classList.remove('is-loading');
      lenis && lenis.start();
      // La barre de défilement réapparaît : la largeur utile change, les épinglages doivent être remesurés.
      ScrollTrigger.refresh();
    }, 'hero+=0.2');

  return tl;
}

function buildHero() {
  // Scroll: the title lines drift apart like layers of depth, the field fades.
  gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  })
    .to('.hero-title .l1', { xPercent: -14, ease: 'none' }, 0)
    .to('.hero-title .l2', { xPercent: 9, ease: 'none' }, 0)
    .to('.hero-title .l3', { xPercent: -5, ease: 'none' }, 0)
    .to('.hero-main', { yPercent: 10, autoAlpha: 0, ease: 'power1.in' }, 0)
    .to('.dotfield', { autoAlpha: 0, ease: 'none' }, 0)
    .to('.hero-top', { yPercent: -60, autoAlpha: 0, ease: 'none' }, 0);

  // Rotating availability badge — spins faster with scroll velocity.
  const spin = gsap.to('.badge-ring', { rotation: 360, duration: 16, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
  ScrollTrigger.create({
    onUpdate(self) {
      const v = Math.min(Math.abs(self.getVelocity()) / 250, 6);
      gsap.to(spin, { timeScale: (self.direction || 1) * (1 + v), duration: 0.2, overwrite: true });
      gsap.to(spin, { timeScale: 1, duration: 1.2, delay: 0.25, ease: 'power2.out' });
    },
  });

  if (!FINE) return;
  // Pointer depth: each line answers the cursor with a different weight.
  const lines = [['.l1', 18], ['.l2', -28], ['.l3', 10]].map(([sel, amt]) => ({
    x: gsap.quickTo(`.hero-title ${sel}`, 'x', { duration: 1.2, ease: 'power3' }),
    y: gsap.quickTo(`.hero-title ${sel}`, 'y', { duration: 1.2, ease: 'power3' }),
    amt,
  }));
  const hero = document.querySelector('.hero');
  const onMove = (e) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    lines.forEach(l => { l.x(nx * l.amt); l.y(ny * l.amt * 0.35); });
  };
  hero.addEventListener('mousemove', onMove);
  return () => hero.removeEventListener('mousemove', onMove);
}

function buildNav(lenis) {
  gsap.to('.scroll-progress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
  });

  const nav = document.querySelector('.nav');
  let hidden = false;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      const shouldHide = self.direction === 1 && self.scroll() > window.innerHeight * 0.6;
      if (shouldHide !== hidden) {
        hidden = shouldHide;
        gsap.to(nav, { yPercent: hidden ? -130 : 0, duration: 0.6, ease: 'expo.out', overwrite: 'auto' });
      }
    },
  });

  gsap.utils.toArray('section[id]').forEach(sec => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle(self) {
        const link = document.querySelector(`.nav-links a[data-section="${sec.id}"]`);
        if (link) link.classList.toggle('is-active', self.isActive);
      },
    });
  });
}

function buildSections() {
  // Hairline rules draw across as each section arrives.
  gsap.utils.toArray('.rule').forEach(rule => {
    gsap.from(rule, {
      scaleX: 0,
      duration: 1.6,
      ease: 'expo.inOut',
      scrollTrigger: { trigger: rule, start: 'top 92%' },
    });
  });

  // Decoded mono labels.
  gsap.utils.toArray('[data-scramble]').forEach(el => {
    gsap.set(el, { autoAlpha: 0 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => { gsap.set(el, { autoAlpha: 1 }); scramble(el); },
    });
  });

  // Section titles: masked word rise.
  gsap.utils.toArray('.split-words').forEach(el => {
    SplitText.create(el, {
      type: 'words',
      mask: 'words',
      wordsClass: 'split-word',
      autoSplit: true,
      onSplit: (self) => gsap.from(self.words, {
        yPercent: 110,
        rotate: 4,
        duration: 1.2,
        stagger: 0.06,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      }),
    });
  });

  // Body copy: masked line reveal.
  gsap.utils.toArray('.split-lines').forEach(el => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 105,
        duration: 1.1,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      }),
    });
  });

  // About lead: words light up as the reader scrolls through them.
  SplitText.create('.about-lead', {
    type: 'words',
    autoSplit: true,
    onSplit: (self) => gsap.fromTo(self.words, { opacity: 0.12 }, {
      opacity: 1,
      stagger: 0.1,
      ease: 'none',
      scrollTrigger: { trigger: '.about-lead', start: 'top 80%', end: 'bottom 45%', scrub: true },
    }),
  });

  // Stats count up; their rules grow from the baseline.
  gsap.utils.toArray('.stat').forEach((stat, i) => {
    const n = stat.querySelector('.n');
    const target = Number(n.dataset.count);
    const proxy = { v: 0 };
    const tl = gsap.timeline({ scrollTrigger: { trigger: stat, start: 'top 90%' }, delay: i * 0.12 });
    tl.from(stat.querySelector('.stat-rule'), { scaleY: 0, duration: 1, ease: 'expo.inOut' })
      .from(stat.querySelectorAll('.n, .l'), { autoAlpha: 0, y: 16, duration: 0.8, stagger: 0.08, ease: 'expo.out' }, 0.3)
      .to(proxy, {
        v: target,
        duration: 1.4,
        ease: 'power3.out',
        onUpdate: () => { n.textContent = String(Math.round(proxy.v)).padStart(2, '0'); },
      }, 0.3);
  });
}

function buildExperience() {
  gsap.utils.toArray('.xp-item').forEach(item => {
    gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 85%' } })
      .from(item.querySelector('.xp-line'), { scaleX: 0, duration: 1.4, ease: 'expo.inOut' })
      .from(item.querySelectorAll('.xp-anim'), { autoAlpha: 0, y: 30, duration: 1, stagger: 0.07, ease: 'expo.out' }, 0.35)
      .from(item.querySelectorAll('.xp-pill'), { autoAlpha: 0, scale: 0.6, duration: 0.7, stagger: 0.05, ease: 'back.out(2)' }, 0.55);
  });
  gsap.from('.xp-line--end', {
    scaleX: 0,
    duration: 1.4,
    ease: 'expo.inOut',
    scrollTrigger: { trigger: '.xp-line--end', start: 'top 95%' },
  });

  if (!FINE) return;

  // Direction-aware fill + a floating card that trails the cursor.
  const list = document.querySelector('.xp-list');
  const card = document.querySelector('.xp-preview');
  const inner = document.querySelector('.xp-preview-inner');
  gsap.set(card, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
  const xTo = gsap.quickTo(card, 'x', { duration: 0.7, ease: 'power3' });
  const yTo = gsap.quickTo(card, 'y', { duration: 0.7, ease: 'power3' });
  const rTo = gsap.quickTo(card, 'rotation', { duration: 0.9, ease: 'power3' });
  let lastX = 0;

  const onMove = (e) => {
    xTo(e.clientX); yTo(e.clientY);
    rTo(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.6));
    lastX = e.clientX;
  };
  const onEnter = (e) => {
    gsap.set(card, { x: e.clientX, y: e.clientY });
    lastX = e.clientX;
    gsap.to(card, { scale: 1, autoAlpha: 1, duration: 0.7, ease: 'expo.out', overwrite: 'auto' });
  };
  const onLeave = () => gsap.to(card, { scale: 0, autoAlpha: 0, rotation: 0, duration: 0.5, ease: 'expo.in', overwrite: 'auto' });
  list.addEventListener('mousemove', onMove);
  list.addEventListener('mouseenter', onEnter);
  list.addEventListener('mouseleave', onLeave);

  const rows = gsap.utils.toArray('.xp-item');
  const cleanups = rows.map((row, i) => {
    const fill = row.querySelector('.xp-fill');
    const edge = (e) => {
      const r = row.getBoundingClientRect();
      return e.clientY < r.top + r.height / 2 ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)';
    };
    const enter = (e) => {
      row.classList.add('is-hover');
      gsap.fromTo(fill, { clipPath: edge(e) }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'expo.out', overwrite: true });
      gsap.to(inner, { yPercent: -100 * i, duration: 0.8, ease: 'expo.out', overwrite: true });
    };
    const leave = (e) => {
      row.classList.remove('is-hover');
      gsap.to(fill, { clipPath: edge(e), duration: 0.5, ease: 'expo.out', overwrite: true });
    };
    row.addEventListener('mouseenter', enter);
    row.addEventListener('mouseleave', leave);
    return () => { row.removeEventListener('mouseenter', enter); row.removeEventListener('mouseleave', leave); };
  });

  return () => {
    list.removeEventListener('mousemove', onMove);
    list.removeEventListener('mouseenter', onEnter);
    list.removeEventListener('mouseleave', onLeave);
    cleanups.forEach(fn => fn());
  };
}

// ---- BNSP : une scène par écran. Chaque fonction pose l'état initial et renvoie une timeline en pause. ----
function press(tl, el, at) {
  return tl
    .to(el, { scale: 0.93, duration: 0.14, ease: 'power2.in' }, at)
    .to(el, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' }, '>');
}

function sceneCitoyen(el) {
  const q = gsap.utils.selector(el);
  gsap.set(q('.cit-type-fill'), { clipPath: 'circle(0% at 22% 50%)' });
  gsap.set(q('.cit-check'), { scale: 0, autoAlpha: 0 });
  gsap.set(q('.cit-pin'), { y: -26, autoAlpha: 0 });
  gsap.set(q('.cit-gps'), { autoAlpha: 0, y: 6 });
  gsap.set(q('.cit-send'), { autoAlpha: 0.4 });
  gsap.set(q('.cit-sheet'), { yPercent: 115 });

  const tl = gsap.timeline({ paused: true });
  press(tl, q('.cit-type--on'), 0.3)
    .to(q('.cit-type-fill'), { clipPath: 'circle(140% at 22% 50%)', duration: 0.8, ease: 'expo.out' }, 0.42)
    .to(q('.cit-tile'), { keyframes: [{ scale: 0.94, duration: 0.12 }, { scale: 1, duration: 0.5, ease: 'expo.out' }], stagger: 0.38 }, 1)
    .to(q('.cit-check'), { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'back.out(2.6)', stagger: 0.38 }, 1.1)
    .to(q('.cit-pin'), { y: 0, autoAlpha: 1, duration: 0.9, ease: 'bounce.out' }, 2.2)
    .to(q('.cit-gps'), { autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 2.6)
    .to(q('.cit-send'), { autoAlpha: 1, duration: 0.4 }, 2.8);
  press(tl, q('.cit-send'), 3.25)
    .to(q('.cit-sheet'), { yPercent: 0, duration: 1, ease: 'expo.out' }, 3.5)
    .from(q('.cit-sheet-ic'), { scale: 0, rotate: -120, duration: 0.9, ease: 'back.out(2)' }, 3.75);
  return tl;
}

function sceneAdmin(el) {
  const q = gsap.utils.selector(el);
  const nWait = q('.adm-n-wait')[0];
  const nRun = q('.adm-n-run')[0];
  const count = { wait: 0, run: 2 };
  const render = () => {
    nWait.textContent = Math.round(count.wait);
    nRun.textContent = Math.round(count.run);
  };
  render();
  gsap.set(q('.adm-incident'), { scale: 0, autoAlpha: 0, transformOrigin: '50% 50%' });
  gsap.set(q('.adm-badge'), { scale: 0 });
  gsap.set(q('.adm-pop'), { autoAlpha: 0, y: 14, scale: 0.97 });
  gsap.set(q('.adm-row-hl'), { scaleX: 0 });
  gsap.set(q('.adm-link'), { strokeDashoffset: 1 });
  gsap.set(q('.adm-toast'), { autoAlpha: 0, y: 10 });

  const tl = gsap.timeline({ paused: true })
    .to(q('.adm-incident'), { scale: 1, autoAlpha: 1, duration: 0.8, ease: 'back.out(3)' }, 0.3)
    .to(q('.adm-badge'), { scale: 1, duration: 0.6, ease: 'back.out(3)' }, 0.45)
    .to(count, { wait: 1, duration: 0.3, onUpdate: render }, 0.5)
    .fromTo(q('.adm-kpi--wait'), { '--flash': 0 }, { '--flash': 1, duration: 0.25, yoyo: true, repeat: 1 }, 0.5)
    .to(q('.adm-pop'), { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'expo.out' }, 1.2)
    .to(q('.adm-row-hl'), { scaleX: 1, duration: 0.6, ease: 'expo.out' }, 1.75);
  press(tl, q('.adm-assign'), 2.3)
    .to(q('.adm-pop'), { autoAlpha: 0, y: 10, scale: 0.97, duration: 0.45, ease: 'power2.in' }, 2.6)
    .to(q('.adm-link'), { strokeDashoffset: 0, duration: 1.1, ease: 'expo.inOut' }, 2.8)
    .to(q('.adm-team--alpha'), { scale: 1.8, transformOrigin: '50% 50%', duration: 0.3, yoyo: true, repeat: 1 }, 2.8)
    .to(count, { wait: 0, run: 3, duration: 0.3, onUpdate: render }, 3.3)
    .to(q('.adm-toast'), { autoAlpha: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 3.4);
  return tl;
}

function scenePompier(el) {
  const q = gsap.utils.selector(el);
  gsap.set(q('.pmp-push'), { yPercent: -160, autoAlpha: 0 });
  gsap.set(q('.pmp-empty'), { autoAlpha: 1 });
  gsap.set(q('.pmp-card'), { yPercent: 120, autoAlpha: 0 });
  gsap.set(q('.pmp-map'), { autoAlpha: 0 });
  gsap.set(q('.pmp-state'), { autoAlpha: 0, x: 8 });
  gsap.set(q('.pmp-target'), { y: -22, autoAlpha: 0 });
  gsap.set(q('.pmp-route'), { strokeDashoffset: 1 });
  gsap.set(q('.pmp-chip'), { autoAlpha: 0, scale: 0.8 });
  gsap.set(q('.pmp-btn'), { autoAlpha: 0, y: 12 });

  const tl = gsap.timeline({ paused: true })
    .to(q('.pmp-push'), { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out' }, 0.3)
    // Le téléphone vibre à la réception de la notification.
    .to(el, { keyframes: { x: [0, -3, 3, -2, 2, 0] }, duration: 0.45, ease: 'none' }, 0.35)
    .to(q('.pmp-push'), { yPercent: -160, autoAlpha: 0, duration: 0.6, ease: 'power3.in' }, 1.6)
    .to(q('.pmp-empty'), { autoAlpha: 0, duration: 0.3 }, 1.7)
    .to(q('.pmp-card'), { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out' }, 1.8);
  press(tl, q('.pmp-take'), 2.7)
    .to(q('.pmp-card'), { yPercent: 120, autoAlpha: 0, duration: 0.6, ease: 'power3.in' }, 3)
    .to(q('.pmp-map'), { autoAlpha: 1, duration: 0.6 }, 3.1)
    .to(q('.pmp-state'), { autoAlpha: 1, x: 0, duration: 0.6, ease: 'expo.out' }, 3.2)
    .to(q('.pmp-target'), { y: 0, autoAlpha: 1, duration: 0.9, ease: 'bounce.out' }, 3.3)
    .to(q('.pmp-route'), { strokeDashoffset: 0, duration: 1.4, ease: 'expo.inOut' }, 3.5)
    .to(q('.pmp-btn'), { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out' }, 4.2)
    .to(q('.pmp-chip'), { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(2.5)' }, 4.4);
  return tl;
}

const SCENES = { citoyen: sceneCitoyen, admin: sceneAdmin, pompier: scenePompier };

function sceneFor(panel) {
  return SCENES[panel.dataset.scene](panel.querySelector('.phone, .browser'));
}

function buildBnsp() {
  const root = document.querySelector('.bnsp');
  if (!root) return;
  const panels = gsap.utils.toArray('.bnsp-panel', root);
  const outro = root.querySelectorAll('.bnsp-outro > *');

  SplitText.create(root.querySelector('.bnsp-intro-title'), {
    type: 'words',
    mask: 'words',
    wordsClass: 'split-word',
    autoSplit: true,
    onSplit: (self) => gsap.from(self.words, {
      yPercent: 110,
      rotate: 4,
      duration: 1.2,
      stagger: 0.05,
      ease: 'expo.out',
      scrollTrigger: { trigger: root, start: 'top 75%' },
    }),
  });
  gsap.from(root.querySelectorAll('.bnsp-head > *, .bnsp-intro .bnsp-lead, .bnsp-hint'), {
    autoAlpha: 0,
    y: 20,
    duration: 1,
    stagger: 0.08,
    ease: 'expo.out',
    scrollTrigger: { trigger: root, start: 'top 75%' },
  });

  const mm = gsap.matchMedia();

  // Desktop : la section s'épingle et le récit défile à l'horizontale. Un rail suit l'incident.
  mm.add('(min-width: 901px)', () => {
    root.classList.add('is-rail');
    const pin = root.querySelector('.bnsp-pin');
    const track = root.querySelector('.bnsp-track');
    const nodes = gsap.utils.toArray('.bnsp-node', root);
    const setFill = gsap.quickSetter(root.querySelector('.bnsp-rail-fill'), 'scaleX');
    const setPacket = gsap.quickSetter(root.querySelector('.bnsp-packet-track'), 'xPercent');
    const distance = () => track.scrollWidth - pin.clientWidth;
    let stops = [];

    // Position de chaque étape sur le rail = progression à laquelle son panneau passe au centre.
    const measure = () => {
      const d = distance();
      stops = panels.map(p => gsap.utils.clamp(0, 1, (p.offsetLeft + p.offsetWidth / 2 - pin.clientWidth / 2) / d));
      nodes.forEach((n, i) => { n.style.left = `${stops[i] * 100}%`; });
    };
    const syncRail = () => {
      const p = scroll.progress();
      setFill(p);
      setPacket(p * 100);
      let current = -1;
      stops.forEach((s, i) => { if (p >= s - 0.01) current = i; });
      nodes.forEach((n, i) => {
        n.classList.toggle('is-past', i <= current);
        n.classList.toggle('is-current', i === current);
      });
    };

    const scroll = gsap.to(track, { x: () => -distance(), ease: 'none', onUpdate: syncRail });
    ScrollTrigger.create({
      trigger: pin,
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 1,
      animation: scroll,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      // Épinglée après la création des déclencheurs de sections plus bas : elle doit être mesurée en premier.
      refreshPriority: 1,
      onRefresh: () => { measure(); syncRail(); },
    });

    panels.forEach(panel => {
      gsap.fromTo(panel.querySelector('.bnsp-device'), { x: 90 }, {
        x: -90,
        ease: 'none',
        scrollTrigger: { trigger: panel, containerAnimation: scroll, start: 'left right', end: 'right left', scrub: true },
      });
      gsap.from(panel.querySelectorAll('.bnsp-copy > *'), {
        autoAlpha: 0,
        y: 26,
        duration: 1,
        stagger: 0.07,
        ease: 'expo.out',
        scrollTrigger: { trigger: panel, containerAnimation: scroll, start: 'left 72%', toggleActions: 'play none none reverse' },
      });
      ScrollTrigger.create({
        trigger: panel,
        containerAnimation: scroll,
        start: 'left 55%',
        animation: sceneFor(panel),
        toggleActions: 'play none none reverse',
      });
    });
    gsap.from(outro, {
      autoAlpha: 0,
      y: 30,
      duration: 1.1,
      stagger: 0.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: root.querySelector('.bnsp-outro'), containerAnimation: scroll, start: 'left 75%' },
    });

    return () => {
      root.classList.remove('is-rail');
      nodes.forEach(n => n.classList.remove('is-past', 'is-current'));
    };
  });

  // Mobile : récit vertical, chaque écran joue sa scène en entrant dans la vue.
  mm.add('(max-width: 900px)', () => {
    panels.forEach(panel => {
      gsap.from(panel.querySelectorAll('.bnsp-copy > *'), {
        autoAlpha: 0,
        y: 26,
        duration: 1,
        stagger: 0.07,
        ease: 'expo.out',
        scrollTrigger: { trigger: panel, start: 'top 80%' },
      });
      ScrollTrigger.create({
        trigger: panel.querySelector('.bnsp-device'),
        start: 'top 75%',
        animation: sceneFor(panel),
        toggleActions: 'play none none reverse',
      });
    });
    gsap.from(outro, {
      autoAlpha: 0,
      y: 30,
      duration: 1.1,
      stagger: 0.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: root.querySelector('.bnsp-outro'), start: 'top 85%' },
    });
  });

  return () => mm.revert();
}

// Visuels du deck : chaque instrument s'anime quand sa carte arrive.
function buildVisual(card) {
  // Captures : la pile se redresse comme un écran qu'on relève, puis suit le pointeur.
  // GSAP ne touche que la scène : la profondeur de chaque écran reste pilotée par le CSS.
  const deck = card.querySelector('.pv-deck');
  if (deck) {
    const stage = deck.querySelector('.deck-stage');
    gsap.set(stage, { transformPerspective: 1400, transformOrigin: '50% 100%' });
    gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 70%' } })
      .from(stage, { rotationX: 38, y: 60, duration: 1.6, ease: 'expo.out' }, 0.2)
      .from(deck.querySelectorAll('.deck-tab, .deck-caption, .deck-note'), { autoAlpha: 0, y: 12, duration: 0.8, stagger: 0.06, ease: 'expo.out' }, 0.7);

    if (!FINE) return;
    const rx = gsap.quickTo(stage, 'rotationX', { duration: 1, ease: 'power3' });
    const ry = gsap.quickTo(stage, 'rotationY', { duration: 1, ease: 'power3' });
    const move = (e) => {
      const r = deck.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 10);
      rx((0.5 - (e.clientY - r.top) / r.height) * 7);
    };
    const leave = () => { rx(0); ry(0); };
    deck.addEventListener('mousemove', move);
    deck.addEventListener('mouseleave', leave);
    return () => {
      deck.removeEventListener('mousemove', move);
      deck.removeEventListener('mouseleave', leave);
    };
  }
}

function buildProjects() {
  // L'étude de cas précède le deck dans la page : ses déclencheurs sont créés en premier.
  const cleanups = [buildBnsp()];
  const cards = gsap.utils.toArray('.project-card');
  const stacked = window.matchMedia('(min-width: 901px)').matches;

  cards.forEach((card, i) => {
    SplitText.create(card.querySelector('.project-name'), {
      type: 'chars',
      mask: 'chars',
      charsClass: 'split-char',
      autoSplit: true,
      onSplit: (self) => gsap.from(self.chars, {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.05,
        ease: 'expo.out',
        scrollTrigger: { trigger: card, start: 'top 75%' },
      }),
    });
    gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 75%' } })
      .from(card.querySelectorAll('.project-meta, .project-client, .project-desc, .project-role'), { autoAlpha: 0, y: 24, duration: 1, stagger: 0.08, ease: 'expo.out' }, 0.2)
      .from(card.querySelectorAll('.project-features li'), { autoAlpha: 0, x: -20, duration: 0.8, stagger: 0.06, ease: 'expo.out' }, 0.4)
      .from(card.querySelectorAll('.project-stack .xp-pill, .project-modules span'), { autoAlpha: 0, scale: 0.6, duration: 0.6, stagger: 0.04, ease: 'back.out(2)' }, 0.5)
      .from(card.querySelector('.pv'), { autoAlpha: 0, scale: 0.85, duration: 1.4, ease: 'expo.out' }, 0.2);
    cleanups.push(buildVisual(card));

    // Stacked deck: each card recedes as the next one slides over it.
    const next = cards[i + 1];
    if (stacked && next) {
      // Départ explicite : depuis `filter: none`, GSAP partirait de brightness(0) et noircirait la carte d'un coup.
      gsap.fromTo(card, { scale: 1, filter: 'brightness(1)' }, {
        scale: 0.9,
        filter: 'brightness(0.45)',
        ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true },
      });
    }
  });

  return () => cleanups.forEach(fn => fn && fn());
}

function buildMarquee() {
  const tracks = gsap.utils.toArray('.marquee-track');
  const wrap = gsap.utils.wrap(-50, 0);
  const state = tracks.map((track, i) => ({ track, x: i ? -50 : 0, dir: i ? 1 : -1 }));
  let boost = 0, scrollDir = 1, active = false, hover = 1;

  ScrollTrigger.create({
    trigger: '.marquee',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => { active = self.isActive; },
    onUpdate: (self) => {
      scrollDir = self.direction || scrollDir;
      boost = gsap.utils.clamp(-1, 1, self.getVelocity() / 3000) * 6;
    },
  });

  const marquee = document.querySelector('.marquee');
  const slow = () => { hover = 0.25; };
  const fast = () => { hover = 1; };
  marquee.addEventListener('mouseenter', slow);
  marquee.addEventListener('mouseleave', fast);

  let smooth = 1;
  const tick = (time, dt) => {
    if (!active) return;
    boost *= 0.92;
    smooth += (hover - smooth) * 0.06;
    const speed = (0.012 * smooth + Math.abs(boost) * 0.02) * dt * 0.06;
    state.forEach(s => {
      s.x = wrap(s.x + speed * s.dir * scrollDir);
      gsap.set(s.track, { xPercent: s.x, skewX: -boost * 1.6 * s.dir });
    });
  };
  gsap.ticker.add(tick);
  return () => {
    gsap.ticker.remove(tick);
    marquee.removeEventListener('mouseenter', slow);
    marquee.removeEventListener('mouseleave', fast);
  };
}

function buildSkills() {
  gsap.utils.toArray('.skill-col').forEach((col, i) => {
    gsap.timeline({ scrollTrigger: { trigger: col, start: 'top 85%' }, delay: i * 0.1 })
      .from(col.querySelector('.col-rule'), { scaleX: 0, duration: 1.2, ease: 'expo.inOut' })
      .from(col.querySelector('.count'), { autoAlpha: 0, y: 10, duration: 0.6, ease: 'expo.out' }, 0.2)
      .from(col.querySelectorAll('li'), { autoAlpha: 0, x: -24, duration: 0.9, stagger: 0.05, ease: 'expo.out' }, 0.3);
  });
}

function buildEducation() {
  gsap.timeline({ scrollTrigger: { trigger: '.edu-list', start: 'top 85%' } })
    .from('.edu-list', { clipPath: 'inset(0% 100% 0% 0%)', duration: 1.4, ease: 'expo.inOut' })
    .from('.edu-content', { autoAlpha: 0, y: 40, duration: 1.1, stagger: 0.1, ease: 'expo.out' }, 0.6);

  if (!FINE) return;
  const items = gsap.utils.toArray('.edu-item');
  const handlers = items.map(item => {
    const move = (e) => {
      const r = item.getBoundingClientRect();
      item.style.setProperty('--mx', `${e.clientX - r.left}px`);
      item.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    item.addEventListener('mousemove', move);
    return () => item.removeEventListener('mousemove', move);
  });
  return () => handlers.forEach(fn => fn());
}

function buildCv() {
  const root = document.querySelector('.cvd');
  if (!root) return;
  const q = gsap.utils.selector(root);
  const printer = q('.cvd-printer')[0];
  const sheet = q('.cvd-sheet')[0];
  const btn = q('.cvd-btn')[0];

  gsap.from(q('.cvd-lead, .cvd-meta > div, .cvd-btn'), {
    autoAlpha: 0,
    y: 24,
    duration: 1,
    stagger: 0.08,
    ease: 'expo.out',
    scrollTrigger: { trigger: root, start: 'top 75%' },
  });
  gsap.from(q('.cvd-slot'), {
    autoAlpha: 0,
    scaleX: 0.7,
    duration: 1.2,
    ease: 'expo.out',
    scrollTrigger: { trigger: printer, start: 'top 90%' },
  });

  // Impression : la feuille sort de la fente au rythme du défilement ; la tête s'allume pendant la sortie.
  gsap.fromTo(sheet, { yPercent: 101 }, {
    yPercent: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: printer,
      start: 'top 85%',
      end: 'bottom 72%',
      scrub: 0.8,
      onUpdate: (self) => printer.classList.toggle('is-printing', self.progress > 0.01 && self.progress < 0.99),
    },
  });

  // Téléchargement : la flèche plonge, l'anneau et la barre se remplissent, la feuille est scannée puis saute
  // hors de la fente. Le lien n'est jamais bloqué : le navigateur télécharge pendant que la scène joue.
  const roll = q('.cvd-btn-roll')[0];
  let busy = false;
  const onClick = () => {
    if (busy) return;
    busy = true;
    btn.classList.add('is-busy');
    const tl = gsap.timeline({ onComplete: () => { busy = false; btn.classList.remove('is-busy'); } });
    tl.to(btn, { scale: 0.95, duration: 0.12, ease: 'power2.in' }, 0)
      .to(btn, { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.45)' }, 0.12)
      .to(q('.cvd-arrow'), { y: 26, duration: 0.35, ease: 'power3.in' }, 0)
      .to(roll, { yPercent: -100 / 3, duration: 0.6, ease: 'expo.out' }, 0.1)
      .fromTo(q('.cvd-ring'), { strokeDashoffset: 1, autoAlpha: 1 }, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, 0.15)
      .fromTo(q('.cvd-btn-bar'), { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 1, ease: 'power2.inOut' }, 0.15)
      .fromTo(q('.cvd-scan'), { yPercent: -100, autoAlpha: 1 }, { yPercent: 560, duration: 1, ease: 'power2.inOut' }, 0.15)
      .to(q('.cvd-scan'), { autoAlpha: 0, duration: 0.25 }, 0.95)
      .to(sheet, { y: -18, duration: 0.3, ease: 'power3.out' }, 1)
      .to(sheet, { y: 0, duration: 0.9, ease: 'bounce.out' }, 1.3)
      .addLabel('done', 1.15)
      .to(roll, { yPercent: -200 / 3, duration: 0.6, ease: 'expo.out' }, 'done')
      .to(q('.cvd-check'), { strokeDashoffset: 0, duration: 0.55, ease: 'expo.out' }, 'done')
      .addLabel('reset', 'done+=1.7')
      .to(q('.cvd-check'), { strokeDashoffset: -1, duration: 0.4, ease: 'power2.in' }, 'reset')
      .to(q('.cvd-ring'), { autoAlpha: 0, duration: 0.4 }, 'reset')
      .to(q('.cvd-btn-bar'), { scaleX: 0, transformOrigin: 'right center', duration: 0.6, ease: 'expo.inOut' }, 'reset')
      .to(roll, { yPercent: 0, duration: 0.7, ease: 'expo.out' }, 'reset+=0.1')
      .fromTo(q('.cvd-arrow'), { y: -26 }, { y: 0, duration: 0.7, ease: 'expo.out', immediateRender: false }, 'reset+=0.2')
      .set(q('.cvd-check'), { strokeDashoffset: 1 });
  };
  btn.addEventListener('click', onClick);

  if (!FINE) return () => btn.removeEventListener('click', onClick);

  // La feuille, tenue par la fente, se penche vers le pointeur ; un reflet suit la souris.
  const stage = q('.cvd-stage')[0];
  const tilt = q('.cvd-tilt')[0];
  gsap.set(tilt, { transformPerspective: 1100, transformOrigin: '50% 100%' });
  const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.9, ease: 'power3' });
  const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.9, ease: 'power3' });
  const move = (e) => {
    const r = sheet.getBoundingClientRect();
    const nx = gsap.utils.clamp(0, 1, (e.clientX - r.left) / r.width);
    const ny = gsap.utils.clamp(0, 1, (e.clientY - r.top) / r.height);
    ry((nx - 0.5) * 16);
    rx((0.5 - ny) * 12);
    sheet.style.setProperty('--gx', `${(nx * 100).toFixed(1)}%`);
    sheet.style.setProperty('--gy', `${(ny * 100).toFixed(1)}%`);
  };
  const leave = () => { rx(0); ry(0); };
  stage.addEventListener('mousemove', move);
  stage.addEventListener('mouseleave', leave);
  return () => {
    btn.removeEventListener('click', onClick);
    stage.removeEventListener('mousemove', move);
    stage.removeEventListener('mouseleave', leave);
  };
}

function buildContact() {
  SplitText.create('.cta-title', {
    type: 'chars,lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    onSplit: (self) => gsap.from(self.chars, {
      yPercent: 120,
      rotate: 12,
      ease: 'power2.out',
      stagger: 0.02,
      scrollTrigger: { trigger: '.cta', start: 'top 80%', end: 'top 20%', scrub: 0.8 },
    }),
  });
  gsap.from('.cta-actions, .cta-links', {
    autoAlpha: 0,
    y: 40,
    duration: 1.2,
    stagger: 0.12,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.cta-actions', start: 'top 92%' },
  });
  gsap.to('.cta-orb', { scale: 1.15, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  if (!FINE) return;
  const cta = document.querySelector('.cta');
  const xTo = gsap.quickTo('.cta-orb', 'x', { duration: 2.4, ease: 'power3' });
  const yTo = gsap.quickTo('.cta-orb', 'y', { duration: 2.4, ease: 'power3' });
  const move = (e) => {
    const r = cta.getBoundingClientRect();
    xTo((e.clientX - r.left - r.width / 2) * 0.5);
    yTo((e.clientY - r.top - r.height / 2) * 0.5);
  };
  cta.addEventListener('mousemove', move);
  return () => cta.removeEventListener('mousemove', move);
}

function buildMagnetic() {
  if (!FINE) return;
  const els = gsap.utils.toArray('[data-magnetic]');
  const handlers = els.map(el => {
    const strength = parseFloat(el.dataset.magnetic) || 0.35;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3' });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.35)', overwrite: true });
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); };
  });
  return () => handlers.forEach(fn => fn());
}

// ============== APP ==============
function App() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (!MOTION) {
      document.documentElement.classList.remove('is-loading');
      return;
    }
    gsap.registerPlugin(ScrollTrigger, SplitText);
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    let lenis = null;
    const lenisRaf = (time) => lenis && lenis.raf(time * 1000);
    if (window.Lenis) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(lenisRaf);
      gsap.ticker.lagSmoothing(0);
      lenis.stop();
    }

    const onAnchor = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
      else target.scrollIntoView({ behavior: 'smooth' });
    };
    document.addEventListener('click', onAnchor);

    const cleanups = [];
    const ctx = gsap.context(() => {}, root);
    let cancelled = false;
    const fontsReady = Promise.race([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise(r => setTimeout(r, 2500)),
    ]);

    fontsReady.then(() => {
      if (cancelled) return;
      ctx.add(() => {
        buildIntro(lenis);
        buildNav(lenis);
        [buildHero, buildSections, buildExperience, buildProjects, buildMarquee, buildSkills, buildEducation, buildCv, buildContact, buildMagnetic]
          .forEach(fn => { const c = fn(); if (c) cleanups.push(c); });
      });
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      document.removeEventListener('click', onAnchor);
      cleanups.forEach(fn => fn());
      ctx.revert();
      gsap.ticker.remove(lenisRaf);
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <div ref={root}>
      <div className="scroll-progress" aria-hidden="true"></div>
      <div className="grain" aria-hidden="true"></div>
      <Cursor />
      <Intro />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
