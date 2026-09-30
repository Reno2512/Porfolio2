const { useEffect, useLayoutEffect, useState, useRef } = React;

// ============== DATA ==============
const PROFILE = {
  name: "Robert Emmanuel",
  lastName: "Mamadou Sagne",
  role: "Ingénieur Fullstack",
  location: "Rufisque Ouest — Sénégal",
  email: "sagneemma25@gmail.com",
  phone: "+221 77 866 20 79",
  available: "Disponible — Q3 2026",
};

const EXPERIENCES = [
  {
    period: "Oct 2024 — Présent",
    title: "Développeur Fullstack",
    company: "Globo Afrique Dakar",
    mono: "GA",
    role: "Stagiaire",
    desc: "Conception de deux plateformes métiers : suivi des livraisons Petrosen et gestion des interventions / affectation des pompiers. Architecture front modulaire, intégration API et tableaux de bord opérationnels.",
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
    ['skills', '03', 'Stack'],
    ['edu', '04', 'Formation'],
    ['contact', '05', 'Contact'],
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
      <div className="nav-time">Dakar · {t}</div>
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
          <div className="value">001 / 005</div>
        </div>
      </div>

      <div className="hero-main">
        <h1 className="hero-title" aria-label="Robert Emmanuel Sagne">
          <span className="line l1" aria-hidden="true"><span className="line-inner"><Chars text="Robert" /></span></span>
          <span className="line l2" aria-hidden="true"><span className="line-inner ital"><Chars text="Emmanuel" /></span></span>
          <span className="line l3" aria-hidden="true">
            <span className="line-inner"><Chars text="Sagne" /></span>
            <span className="small-line"><span className="small-rule"></span><span className="small-text">Ingénieur Fullstack · basé à Dakar</span></span>
          </span>
        </h1>

        <a href="#contact" className="badge" data-magnetic="0.5" data-cursor-label="Contact" aria-label="Disponible — me contacter">
          <svg className="badge-ring" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <path id="badge-circle" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
            </defs>
            <text>
              <textPath href="#badge-circle" textLength="500" lengthAdjust="spacing">
                Disponible · Q3 2026 · Ouvert aux projets ·
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
          <div className="value status"><span className="live"></span>Disponible</div>
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
            {[[4, 'Expériences'], [6, 'Années de code'], [1, 'Certif. Security+']].map(([n, l]) => (
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
      <SectionHead num="02" label="Expériences" title="Quatre terrains. Une méthode." />
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

function Skills() {
  return (
    <section className="section" id="skills">
      <span className="rule"></span>
      <SectionHead num="03" label="Compétences" title="La stack." />

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
      <SectionHead num="04" label="Formation" title="Le parcours." />

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
    </section>
  );
}

function Contact() {
  return (
    <section className="cta" id="contact">
      <span className="rule"></span>
      <div className="cta-orb" aria-hidden="true"></div>
      <div className="cta-pre" data-scramble>[05] · Travaillons ensemble</div>
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
        [buildHero, buildSections, buildExperience, buildMarquee, buildSkills, buildEducation, buildContact, buildMagnetic]
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
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
