const { useEffect, useState, useRef } = React;

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
    role: "Stagiaire",
    desc: "Conception de deux plateformes métiers : suivi des livraisons Petrosen et gestion des interventions / affectation des pompiers. Architecture front modulaire, intégration API et tableaux de bord opérationnels.",
    stack: ["React", "Angular", "REST", "UI/UX"],
  },
  {
    period: "Août 2023",
    title: "Traitement de la DPI",
    company: "DSID — Direction Des Systèmes D'Information Des Douanes",
    role: "Stagiaire Fullstack",
    desc: "Implémentation d'une nouvelle fonctionnalité pour le traitement de la DPI : développement front-end Angular, back-end Spring Boot, intégration avec la base IBM DB2 WLOC.",
    stack: ["Angular", "Spring Boot", "DB2"],
  },
  {
    period: "Août 2022 — Nov 2022",
    title: "Plateforme de suivi matériel",
    company: "DSID — Direction Des Systèmes D'Information Des Douanes",
    role: "Stagiaire Fullstack",
    desc: "Conception et mise en place complète d'une plateforme web pour le suivi du matériel de la DSID. Modélisation UML, développement Spring Boot / Angular 14, administration base de données.",
    stack: ["Angular 14", "Spring Boot", "UML", "SQL"],
  },
  {
    period: "Juil 2020 — Nov 2020",
    title: "Application de location de voiture",
    company: "École Supérieure Polytechnique de Dakar",
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

// ============== HOOKS ==============
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

function useCursor() {
  useEffect(() => {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);

    const onOver = (e) => {
      const t = e.target.closest('a, button, .xp-item, .skill-col li, .email-btn, .edu-item');
      if (t) ring.classList.add('hover');
    };
    const onOut = (e) => {
      const t = e.target.closest('a, button, .xp-item, .skill-col li, .email-btn, .edu-item');
      if (t) ring.classList.remove('hover');
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf);
    };
  }, []);
}

function useClock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  const opt = { timeZone: 'Africa/Dakar', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  return new Intl.DateTimeFormat('fr-FR', opt).format(t);
}

// ============== COMPONENTS ==============
function Intro() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 3600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`intro ${gone ? 'gone' : ''}`}>
      <div className="intro-label">Loading portfolio</div>
      <div className="intro-num">
        <Counter from={0} to={100} dur={2400} />
      </div>
      <div className="intro-label">Robert Emmanuel · 2026</div>
    </div>
  );
}

function Counter({ from, to, dur }) {
  const [v, setV] = useState(from);
  useEffect(() => {
    const start = performance.now();
    let raf;
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  const str = String(v).padStart(3, '0');
  return <>{str.split('').map((c, i) => <span key={i}>{c}</span>)}</>;
}

function Nav() {
  const t = useClock();
  return (
    <nav className="nav">
      <div className="nav-mark">
        <span className="dot"></span>
        <span>RE/MS</span>
      </div>
      <ul className="nav-links">
        <li><a href="#about" data-num="01">À propos</a></li>
        <li><a href="#work" data-num="02">Expériences</a></li>
        <li><a href="#skills" data-num="03">Stack</a></li>
        <li><a href="#edu" data-num="04">Formation</a></li>
        <li><a href="#contact" data-num="05">Contact</a></li>
      </ul>
      <div className="nav-time">Dakar · {t}</div>
    </nav>
  );
}

function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-top">
        <div className="meta-block">
          <div className="label">Portfolio · 2026</div>
          <div className="value">v.01 — Édition unique</div>
        </div>
        <div className="meta-block">
          <div className="label">Index</div>
          <div className="value">001 / 005</div>
        </div>
      </div>

      <div className="hero-main">
        <h1 className="hero-title">
          <div className="line"><span>Robert</span></div>
          <div className="line"><span><i className="ital" style={{fontStyle:'italic'}}>Emmanuel</i></span></div>
          <div className="line"><span>Sagne<span className="small-line">Ingénieur Fullstack · basé à Dakar</span></span></div>
        </h1>
      </div>

      <div className="hero-bottom">
        <div className="col">
          <div className="label">Rôle</div>
          <div className="value">Fullstack · Sécurité</div>
        </div>
        <div className="col">
          <div className="label">Spécialités</div>
          <div className="value">Spring Boot · Angular · React</div>
        </div>
        <div className="col">
          <div className="label">Statut</div>
          <div className="value" style={{color:'var(--accent)'}}>● Disponible</div>
        </div>
        <a href="#about" className="scroll-cta">
          <span>Défiler</span>
          <span className="arrow">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1V11M6 11L1 6M6 11L11 6" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          </span>
        </a>
      </div>
    </header>
  );
}

function About() {
  return (
    <section className="section" id="about">
      <div className="section-head">
        <div><span className="num">[01]</span> · À propos</div>
        <div className="title reveal">Construire avec rigueur, livrer avec passion.</div>
      </div>

      <div className="about-grid">
        <p className="about-lead reveal">
          Jeune ingénieur en informatique <em>passionné</em> par l'innovation, motivé par la recherche de nouveaux défis.
        </p>
        <div className="about-text reveal">
          <p>
            Doté d'une solide expertise technique et d'une capacité d'adaptation remarquable, je conçois et déploie des plateformes web complètes — du modèle UML jusqu'à la mise en production — pour des organismes publics et privés à Dakar.
          </p>
          <p>
            Spring Boot, Angular, React, bases relationnelles, sécurité système : je choisis les outils qui servent le problème, pas l'inverse. Mon objectif : contribuer activement à des projets ambitieux dans un environnement dynamique et stimulant.
          </p>

          <div className="about-stats">
            <div className="stat">
              <div className="n">04</div>
              <div className="l">Expériences</div>
            </div>
            <div className="stat">
              <div className="n">06</div>
              <div className="l">Années de code</div>
            </div>
            <div className="stat">
              <div className="n">01</div>
              <div className="l">Certif. Security+</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ['Spring Boot', '✦', 'Angular', '✦', 'React.js', '✦', 'Java', '✦', 'PostgreSQL', '✦', 'Cybersécurité', '✦', 'Figma', '✦', 'PHP', '✦', 'MySQL', '✦'];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[...items, ...items].map((it, i) =>
          it === '✦'
            ? <span key={i} className="dot"></span>
            : <span key={i} className={`item ${i % 2 === 0 ? '' : 'alt'}`}>{it}</span>
        )}
      </div>
    </div>
  );
}

function Experience() {
  return (
    <section className="section" id="work">
      <div className="section-head">
        <div><span className="num">[02]</span> · Expériences</div>
        <div className="title reveal">Quatre terrains. Une méthode.</div>
      </div>
      <div className="xp-list">
        {EXPERIENCES.map((x, i) => (
          <article className="xp-item reveal" key={i}>
            <div className="xp-period">{x.period}</div>
            <div className="xp-main">
              <h3>{x.title}</h3>
              <div className="company">{x.company} · <span style={{color:'var(--fg-mute)'}}>{x.role}</span></div>
              <p>{x.desc}</p>
            </div>
            <div className="xp-stack">
              {x.stack.map((s, j) => <span key={j}>{s}</span>)}
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
      <div className="section-head">
        <div><span className="num">[03]</span> · Compétences</div>
        <div className="title reveal">La stack.</div>
      </div>

      <Marquee />

      <div className="skills-block">
        {Object.entries(SKILLS).map(([cat, list]) => (
          <div className="skill-col reveal" key={cat}>
            <h4>{cat} <span>{String(list.length).padStart(2, '0')}</span></h4>
            <ul>
              {list.map(([name, lvl], i) => (
                <li key={i}>
                  <span>{name}</span>
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
      <div className="section-head">
        <div><span className="num">[04]</span> · Formation</div>
        <div className="title reveal">Le parcours.</div>
      </div>

      <div className="edu-list reveal">
        {EDUCATION.map((e, i) => (
          <article className={`edu-item ${e.isCert ? 'cert' : ''}`} key={i}>
            <div className="year">{e.year}</div>
            <h3>{e.title}</h3>
            <div className="school">{e.school}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="cta" id="contact">
      <div className="cta-pre reveal">[05] · Travaillons ensemble</div>
      <h2 className="reveal">
        Un projet <em>ambitieux ?</em><br/>
        Discutons-en.
      </h2>
      <a href={`mailto:${PROFILE.email}`} className="email-btn reveal">
        <span>{PROFILE.email}</span>
        <span className="arrow">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 13L13 1M13 1H4M13 1V10" stroke="currentColor" strokeWidth="1.4"/>
          </svg>
        </span>
      </a>
      <div className="cta-links reveal">
        <a href={`tel:${PROFILE.phone}`}>+221 77 866 20 79</a>
        <a href="#" target="_blank" rel="noopener">LinkedIn ↗</a>
        <a href="#top">Retour haut ↑</a>
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

// ============== APP ==============
function App() {
  useReveal();
  useCursor();
  return (
    <>
      <div className="cursor-dot"></div>
      <div className="cursor-ring"></div>
      <Intro />
      <Nav />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Education />
      <Contact />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
