// Home — versión React del "Home Netzen standalone", con animación ampliada.
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon, Button, Container, Section, SectionHeading, Steps, TagChip, Stat, Reveal, prefersReducedMotion } from "../components/ui.jsx";
import { CTABand } from "../components/chrome.jsx";
import { LABELS, CTA_PATHS } from "../lib/copy.js";
import isotipo from "../assets/netzen-isotipo-red.png";
import heroImage from "../assets/netzen-hero-v2.jpg";

const NUCLEOS = {
  plataforma: {
    n: "01", icon: "Cpu", title: "Plataforma", overline: "Núcleo tecnológico",
    tagline: "El núcleo tecnológico — la joya de la corona",
    desc: "Software modular para comercializar, operar y crecer: una plataforma configurable mediante contrato de uso de licencia en modalidad de renta, con consultoría incluida. Netzen no es una fábrica de software — se configura a tu operación sin perder calidad.",
    bullets: [
      <><b>Software Netzen</b> — backoffice completo: inventario, facturación, comisiones, crédito y cobranza.</>,
      <><b>Oficina Virtual</b> por distribuidor y tiendas replicadas.</>,
      <><b>NIA</b> — reporteo y análisis en lenguaje natural.</>,
      <><b>Analítica y predicción</b>, promociones e inventario, infraestructura dedicada.</>
    ],
    cta: { label: "Ver Plataforma", to: "/plataforma" },
    note: "Implementación con consultoría incluida"
  },
  academy: {
    n: "02", icon: "GraduationCap", title: "Academy", overline: "Núcleo de educación",
    tagline: "Educación para empresarios y redes de distribuidores",
    desc: "Forma a empresarios y profesionaliza redes de distribuidores, con la experiencia de más de 30 años en la industria.",
    bullets: [
      <><b>Diplomado de Alta Dirección</b> — para empresarios y líderes del negocio.</>,
      <><b>Diplomado Distribuidor Independiente</b> — formación B2B para tu red de distribuidores (88 h).</>,
      <><b>Talleres y formación corporativa</b>, con cohortes multimarcas.</>
    ],
    cta: { label: "Ver Academy", to: "/academy" },
    note: "Cotización B2B para redes"
  },
  consulting: {
    n: "03", icon: "Compass", title: "Consulting", overline: "Núcleo de estrategia",
    tagline: "Estrategia — el cerebro que conecta todo",
    desc: "El cerebro que conecta todo. El diagnóstico es la puerta de entrada: entendemos alcance, etapa, red y necesidad real antes de recomendar un recorrido.",
    bullets: [
      <><b>Diagnóstico</b> integral de tu operación y tu momento.</>,
      <><b>Planes de compensación</b>: diseño, auditoría, simulación y corrección.</>,
      <><b>Estrategia y expansión</b>, Escuela MLM y consultoría tecnológica incluida.</>
    ],
    cta: { label: "Ver Consulting", to: "/consulting" },
    note: "La conversación empieza por valor, no por precio"
  }
};

const RUTAS = {
  A: {
    letter: "A", title: "Apenas empiezo", quote: "«No sé bien qué es, o quiero arrancar bien desde el día uno.»",
    panelTitle: "Empieza bien desde el día uno",
    panelDesc: "Entras por el diagnóstico y sales con un plan recomendado a tu medida.",
    steps: [
      { title: "Agenda tu diagnóstico", description: "Entendemos tu etapa, alcance y necesidad real." },
      { title: "Recibe un plan recomendado", description: "Un recorrido a tu medida, con valor por delante." },
      { title: "Arranca con acompañamiento", description: "Escuela MLM si aplica, o Diplomado de Alta Dirección." }
    ],
    cta: { label: "Empezar", to: "/soluciones/empezar" },
    note: "El acompañamiento entra después del diagnóstico, si aplica"
  },
  B: {
    letter: "B", title: "Ya tengo empresa y quiero escalarla", quote: "«Migrar, escalar, omnicanalidad, multipaís.»",
    panelTitle: "Escala sin romper tu operación",
    panelDesc: "Plataforma y Consulting trabajan juntos para migrar y escalar con orden.",
    steps: [
      { title: "Agenda tu diagnóstico", description: "Mapeamos tu operación actual y a dónde quieres escalar." },
      { title: "Solicita un demo", description: "Acceso controlado para prospectos calificados." },
      { title: "Plataforma + Consulting", description: "Migración, omnicanalidad y multipaís con consultoría incluida." }
    ],
    cta: { label: "Escalar", to: "/soluciones/empresa-establecida" },
    note: "Demo para prospectos calificados"
  },
  C: {
    letter: "C", title: "Quiero profesionalizar mi red", quote: "«A mí como empresario, o a mi red de distribuidores.»",
    panelTitle: "Ruta directa a Academy",
    panelDesc: "Formación para ti y para tu red de distribuidores, sin rodeos.",
    steps: [
      { title: "Elige el programa", description: "Alta Dirección para ti; Distribuidor Independiente para tu red." },
      { title: "Cotización B2B", description: "Formación para redes de distribuidores y fuerza comercial." },
      { title: "Profesionaliza tu red", description: "Con la experiencia de más de 30 años en la industria." }
    ],
    cta: { label: "Profesionalizar", to: "/soluciones/red-de-distribuidores" },
    note: "Cotización B2B para redes"
  },
  D: {
    letter: "D", title: "Ya tengo software propio", quote: "«Tecnología obsoleta u operación compleja.»", isNew: true,
    panelTitle: "Moderniza sin migrar todo",
    panelDesc: "Suma capacidades sobre lo que ya tienes, sin detener tu operación.",
    steps: [
      { title: "Diagnóstico técnico", description: "Evaluamos tu software actual y su operación." },
      { title: "Integra sin migrar todo", description: "Integraciones y módulos satelitales sobre lo que ya tienes." },
      { title: "Suma NIA y analítica", description: "Reporteo en lenguaje natural y predicción sobre tu operación." }
    ],
    cta: { label: "Modernizar", to: "/soluciones/modernizar" },
    note: "Integraciones y satelitales sobre tu software actual"
  }
};

const CICLO = [
  { n: 1, title: "Descubre", core: "Consulting", desc: "Entiende qué es Netzen y cómo se conecta el ecosistema con tu operación." },
  { n: 2, title: "Diagnostica", core: "Conversión", desc: "La puerta de entrada: entendemos alcance, etapa, red y necesidad real — sin hablar de precio aún." },
  { n: 3, title: "Diseña", core: "Consulting", desc: "Plan de compensación y estrategia: diseño, auditoría, simulación y corrección." },
  { n: 4, title: "Implementa", core: "Plataforma", desc: "Plataforma configurable mediante contrato de uso de licencia en modalidad de renta, con consultoría incluida en la implementación." },
  { n: 5, title: "Capacita", core: "Academy", desc: "Forma a la empresa y a su red de distribuidores con los programas de Academy." },
  { n: 6, title: "Opera y crece", core: "Plataforma", desc: "NIA, analítica, promociones e inventario y soporte en el día a día." },
  { n: 7, title: "Escala", core: "Plataforma", desc: "Omnicanalidad y multipaís: canales y mercados en una sola operación conectada." }
];

const MODELOS = ["Venta directa", "Multinivel", "Retail", "Franquicias", "E-commerce", "Punto de venta"];

function HeroEditorial() {
  const cores = [
    { icon: "Cpu", label: "Plataforma", to: "/plataforma" },
    { icon: "GraduationCap", label: "Academy", to: "/academy" },
    { icon: "Compass", label: "Consulting", to: "/consulting" }
  ];
  return (
    <figure className="hero-editorial">
      <img
        src={heroImage}
        alt="Líderes y consultores latinoamericanos trabajando en una estrategia de transformación"
      />
      <span className="hero-editorial__shade" aria-hidden />
      <figcaption className="hero-editorial__caption">
        <span className="badge badge--accent">Empresa humana</span>
        <strong>Tecnología con criterio. Crecimiento con propósito.</strong>
        <span>Personas, operación y estrategia trabajando como un solo sistema.</span>
      </figcaption>
      <nav className="hero-editorial__cores" aria-label="Explorar los núcleos de Netzen">
        {cores.map((core) => (
          <Link to={core.to} key={core.label}>
            <Icon name={core.icon} size={16} />
            {core.label}
          </Link>
        ))}
      </nav>
    </figure>
  );
}

/* ---------- hero orbital ---------- */
function HeroOrbit({ nucleo, onPick }) {
  // Posiciones = CENTROS de nodo (simétricos a 120°, radio 38% del contenedor);
  // las líneas de conexión del SVG terminan exactamente en estos puntos.
  const nodes = [
    { key: "plataforma", icon: "Cpu", label: "Plataforma", left: "50%", top: "12%", delay: "0s" },
    { key: "academy", icon: "GraduationCap", label: "Academy", left: "83%", top: "69%", delay: "0.9s" },
    { key: "consulting", icon: "Compass", label: "Consulting", left: "17%", top: "69%", delay: "1.8s" }
  ];
  return (
    <div>
      <div style={{ position: "relative", width: "min(440px,100%)", aspectRatio: "1/1", margin: "0 auto" }}>
        {/* anillo exterior giratorio */}
        <svg viewBox="0 0 100 100" className="nz-orbit" style={{ position: "absolute", inset: "5%" }} aria-hidden>
          <circle cx="50" cy="50" r="49.4" fill="none" stroke="var(--nz-gray-300)" strokeWidth="0.35" strokeDasharray="2.4 3.4" />
        </svg>
        <div style={{ position: "absolute", inset: "24%", border: "1px solid var(--nz-red-tint-strong)", borderRadius: "50%" }} />
        {/* núcleo cálido + líneas de conexión — pasan POR DETRÁS de la lente para que la refracción sea visible */}
        <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }} aria-hidden>
          <defs>
            <radialGradient id="nzHeroCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(196,20,20,.22)" />
              <stop offset="100%" stopColor="rgba(196,20,20,0)" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="30" fill="url(#nzHeroCore)" />
          <g stroke="var(--nz-red-tint-strong)" strokeWidth="0.8">
            <line x1="50" y1="50" x2="50" y2="12" />
            <line x1="50" y1="50" x2="83" y2="69" />
            <line x1="50" y1="50" x2="17" y2="69" />
          </g>
        </svg>
        {/* centro — LA lente de vidrio líquido: gruesa, redonda, deforma lo que pasa detrás */}
        <div className="nz-glass nz-glass--liquid nz-glass--lens nz-glass--round" style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
          width: 132, height: 132,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <img src={isotipo} alt="Isotipo Netzen" style={{ width: 52, display: "block" }} />
        </div>
        {/* nodos */}
        {nodes.map((nd) => {
          const active = nucleo === nd.key;
          return (
            // centrado vía la propiedad `translate` (canal aparte): la animación nzFloat anima `transform` y pisaría un translate(-50%,-50%)
            <div key={nd.key} className="nz-float" style={{ position: "absolute", left: nd.left, top: nd.top, translate: "-50% -50%", "--nz-float-delay": nd.delay }}>
              <button
                onClick={() => onPick(nd.key)}
                aria-label={`Explorar ${nd.label}`}
                style={{
                  width: 106, height: 106, borderRadius: "50%", background: "var(--nz-white)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
                  cursor: "pointer", transition: "all 220ms var(--ease-out)",
                  fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12, color: "var(--text-body)", padding: 0,
                  border: `1.5px solid ${active ? "var(--nz-red)" : "var(--nz-gray-200)"}`,
                  boxShadow: active ? "var(--shadow-md)" : "var(--shadow-sm)"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--nz-red)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = active ? "var(--nz-red)" : "var(--nz-gray-200)"; e.currentTarget.style.boxShadow = active ? "var(--shadow-md)" : "var(--shadow-sm)"; }}
              >
                <Icon name={nd.icon} size={22} style={{ color: "var(--nz-red)" }} />
                <span>{nd.label}</span>
              </button>
            </div>
          );
        })}
      </div>
      <p style={{ textAlign: "center", color: "var(--text-tertiary)", fontSize: 13, margin: "16px 0 0" }}>
        Un ecosistema — haz clic en un núcleo para explorarlo
      </p>
    </div>
  );
}

export default function Home() {
  const [nucleo, setNucleo] = useState("plataforma");
  const [ruta, setRuta] = useState("A");
  const [step, setStep] = useState(1);
  const touched = useRef(false);
  const navigate = useNavigate();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const pickFromHero = (n) => { setNucleo(n); scrollTo("sec-nucleos"); };
  const cur = CICLO[step - 1];
  const N = NUCLEOS[nucleo];
  const R = RUTAS[ruta];

  return (
    <>
      {/* ============ HERO ============ */}
      <section id="sec-hero" className="nz-ambient nz-ambient--drift" style={{ background: "var(--nz-white)", borderBottom: "1px solid var(--border-default)", overflow: "hidden" }}>
        <span className="nz-grain-layer" aria-hidden />
        <Container>
          <div style={{ padding: "76px 0 84px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 56, alignItems: "center" }}>
            <div className="anim-fade-up">
              <div className="badge badge--accent hero-message-badge" style={{ padding: "7px 16px", fontSize: 12, letterSpacing: "0.1em" }}>
                Empresa humana · crecimiento consciente
              </div>
              <h1 style={{ margin: "22px 0 0", fontSize: "clamp(36px,4.4vw,56px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.015em", textWrap: "balance" }}>
                Transformamos empresas poniendo a las <span style={{ color: "var(--nz-red)" }}>personas en el centro</span>
              </h1>
              <p style={{ margin: "20px 0 0", fontSize: "clamp(16px,1.6vw,19px)", lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 560, textWrap: "pretty" }}>
                Transformamos empresas a través de tecnología, formación y consultoría estratégica, impulsando un modelo de empresa humana donde el desarrollo de las personas y el bien común son motores del crecimiento sostenible.
              </p>
              <div style={{ marginTop: 32, display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Button size="lg" to={CTA_PATHS.contacto} placement="hero" className="btn--glow-pulse">{LABELS.diagnostico}</Button>
                <Button size="lg" variant="secondary" to="/contacto/demo">Ver demo</Button>
              </div>
              <div style={{ marginTop: 36, paddingTop: 22, borderTop: "1px solid var(--border-default)", display: "flex", alignItems: "center", gap: 12 }}>
                <img src={isotipo} alt="" style={{ height: 20, display: "block" }} />
                <span style={{ fontSize: 13.5, color: "var(--text-tertiary)" }}>
                  Venta directa · retail · e-commerce · franquicias · multinivel · punto de venta
                </span>
              </div>
            </div>
            <div className="anim-fade-up" style={{ animationDelay: "150ms" }}>
              <HeroEditorial />
            </div>
          </div>
        </Container>
      </section>

      <section className="home-identity-strip">
        <Container>
          <div className="home-identity-strip__grid">
            <div>
              <span className="eyebrow">Nuestra visión</span>
              <p>
                Ser referentes en crecimiento empresarial consciente en Latinoamérica, integrando innovación,
                desarrollo humano y ética empresarial para generar impacto económico y social.
              </p>
            </div>
            <Button variant="ghost" to="/nosotros/mision-vision-valores" trackLabel="Conocer la identidad de Netzen">
              Conoce nuestra identidad <Icon name="ArrowRight" size={16} />
            </Button>
          </div>
        </Container>
      </section>

      {/* ============ TRES NÚCLEOS ============ */}
      <Section id="sec-nucleos" bg="page" className="nz-ambient">
        <SectionHeading
          eyebrow="El ecosistema"
          title="Una solución, tres núcleos que trabajan juntos"
          lead="Cada núcleo entra cuando tu operación lo necesita — juntos cubren la tecnología, la educación y la estrategia de tu negocio."
        />
        <div className="grid-2" style={{ marginTop: 44, alignItems: "start" }}>
          <Reveal variant="left" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {Object.entries(NUCLEOS).map(([key, v]) => {
              const active = nucleo === key;
              return (
                <button
                  key={key}
                  onClick={() => setNucleo(key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 18, textAlign: "left", padding: "20px 22px",
                    borderRadius: 14, background: "var(--nz-grad-card)", cursor: "pointer",
                    transition: "all 220ms var(--ease-out)",
                    border: `1.5px solid ${active ? "var(--nz-red)" : "var(--nz-gray-200)"}`,
                    boxShadow: active ? "var(--nz-glow-red)" : "var(--shadow-xs)"
                  }}
                >
                  <span className="bubble"><Icon name={v.icon} size={22} /></span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--text-heading)" }}>{v.title}</span>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 12, color: "var(--nz-gray-400)" }}>{v.n}</span>
                    </span>
                    <span style={{ display: "block", marginTop: 3, fontSize: 13.5, color: "var(--text-secondary)" }}>{v.tagline}</span>
                  </span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: active ? "var(--nz-red)" : "var(--nz-gray-400)", transition: "color 220ms" }}>→</span>
                </button>
              );
            })}
            <p style={{ margin: "8px 4px 0", fontSize: 13, color: "var(--text-tertiary)" }}>
              Los tres núcleos se combinan en cada recorrido: no se venden piezas sueltas, se resuelve tu operación.
            </p>
          </Reveal>
          <Reveal variant="right" delay={120}>
            <div key={nucleo} className="anim-fade-up nz-glass nz-glass--liquid nz-glass--lg" style={{ padding: "32px 34px" }}>
              <div className="eyebrow">{N.overline}</div>
              <h3 style={{ margin: "8px 0 0", fontSize: 26, fontWeight: 800 }}>{N.title}</h3>
              <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.6, color: "var(--text-secondary)", textWrap: "pretty" }}>{N.desc}</p>
              <div style={{ marginTop: 22, display: "grid", gap: 12 }}>
                {N.bullets.map((b, i) => <div className="dotline" key={i}><span>{b}</span></div>)}
              </div>
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <Button variant="ghost" to={N.cta.to}>{N.cta.label} <Icon name="ArrowRight" size={16} /></Button>
                <span style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>{N.note}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ============ ROUTER POR ETAPA ============ */}
      <Section id="sec-router" bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
        <SectionHeading
          eyebrow="¿Dónde estás hoy?"
          title="Elige tu situación y entra a un recorrido a tu medida"
          lead="Cada visitante recorre Netzen distinto: según tu momento, el sitio te enruta a un recorrido que combina los tres núcleos — sin hacerte atravesar contenido que no te toca."
        />
        <div className="grid-2" style={{ marginTop: 44, alignItems: "start" }}>
          <Reveal style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.values(RUTAS).map((r) => {
              const active = ruta === r.letter;
              return (
                <button
                  key={r.letter}
                  onClick={() => setRuta(r.letter)}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 16, textAlign: "left", padding: "18px 20px",
                    borderRadius: 14, cursor: "pointer", transition: "all 220ms var(--ease-out)",
                    background: active ? "var(--nz-red-wash)" : "var(--nz-white)",
                    border: `1.5px solid ${active ? "var(--nz-red)" : "var(--nz-gray-200)"}`,
                    boxShadow: "var(--shadow-xs)"
                  }}
                >
                  <span style={{
                    width: 34, height: 34, borderRadius: "50%", border: "1.5px solid var(--nz-red)", color: active ? "#fff" : "var(--nz-red)",
                    background: active ? "var(--nz-red)" : "transparent",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, flexShrink: 0, transition: "all 220ms"
                  }}>{r.letter}</span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15.5, color: "var(--text-heading)" }}>{r.title}</span>
                      {r.isNew && <span className="badge badge--accent">Nuevo</span>}
                    </span>
                    <span style={{ display: "block", marginTop: 4, fontSize: 13.5, lineHeight: 1.5, color: "var(--text-secondary)" }}>{r.quote}</span>
                  </span>
                </button>
              );
            })}
          </Reveal>
          <Reveal delay={120}>
            <div key={ruta} className="anim-fade-up" style={{ background: "var(--surface-page)", border: "1px solid var(--border-default)", borderRadius: 20, padding: "30px 32px" }}>
              <div className="eyebrow">Tu recorrido</div>
              <h3 style={{ margin: "8px 0 0", fontSize: 22, fontWeight: 800 }}>{R.panelTitle}</h3>
              <p style={{ margin: "10px 0 22px", fontSize: 14.5, lineHeight: 1.6, color: "var(--text-secondary)" }}>{R.panelDesc}</p>
              <Steps items={R.steps} />
              <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <Button variant="ghost" to={R.cta.to}>{R.cta.label} <Icon name="ArrowRight" size={16} /></Button>
                <span style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>{R.note}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ============ MODELOS + OMNICANAL ============ */}
      <section className="bg-wash" style={{ borderTop: "1px solid var(--nz-red-tint)", borderBottom: "1px solid var(--nz-red-tint)", padding: "72px 0" }}>
        <Container>
          <SectionHeading align="center" eyebrow="Para tu giro" title="Se adapta a tu modelo de negocio" />
        </Container>
        <div className="marquee reveal" style={{ marginTop: 30 }}>
          <div className="marquee__track">
            {[...MODELOS, ...MODELOS, ...MODELOS, ...MODELOS].map((m, i) => (
              <Link to="/soluciones/por-modelo" key={i} className="tag tag--click" style={{ fontSize: 14.5, padding: "11px 22px" }}>{m}</Link>
            ))}
          </div>
        </div>
        <Container>
          <Reveal delay={140}>
            <div style={{ maxWidth: 840, margin: "32px auto 0", background: "var(--nz-white)", border: "1px solid var(--nz-red-tint-strong)", borderRadius: 20, padding: "24px 28px", display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span className="bubble" style={{ width: 42, height: 42 }}><Icon name="Globe" size={20} /></span>
              <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.65, textWrap: "pretty" }}>
                <b style={{ color: "var(--nz-red)" }}>Omnicanal de verdad:</b> integra canales y mercados —venta directa, retail, e-commerce,
                punto de venta y otros— en una sola operación conectada.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ============ CICLO DE VIDA ============ */}
      <Section id="sec-ciclo" bg="page">
        <SectionHeading
          eyebrow="De principio a fin"
          title="El mismo ciclo te acompaña de extremo a extremo"
          lead="Un solo recorrido; en cada etapa interviene el núcleo correspondiente. Recórrelo paso a paso."
        />
        <Reveal style={{ marginTop: 48, overflowX: "auto", paddingBottom: 6 }}>
          <div style={{ position: "relative", minWidth: 860 }}>
            <div style={{ position: "absolute", top: 22, left: 62, right: 62, height: 2, background: "var(--nz-gray-300)" }} />
            <div style={{ position: "absolute", top: 22, left: 62, height: 2, background: "var(--nz-red)", transition: "width 360ms var(--ease-out)", width: `calc((100% - 124px) * ${(step - 1) / 6})` }} />
            <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
              {CICLO.map((c) => {
                const active = c.n === step;
                const done = c.n < step;
                return (
                  <button key={c.n} onClick={() => { touched.current = true; setStep(c.n); }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: "0 8px", fontFamily: "var(--font-display)" }}>
                    <span style={{
                      width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: 15, transition: "all 220ms var(--ease-out)",
                      background: active || done ? "var(--nz-red)" : "var(--nz-white)",
                      color: active || done ? "#fff" : "var(--nz-gray-500)",
                      border: `1.5px solid ${active || done ? "var(--nz-red)" : "var(--nz-gray-300)"}`,
                      boxShadow: active ? "var(--shadow-md)" : "none"
                    }}>{c.n}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, textAlign: "center", transition: "color 220ms", color: active ? "var(--nz-red)" : "var(--text-body)" }}>{c.title}</span>
                    <span style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", fontWeight: 600 }}>{c.core}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div style={{ maxWidth: 860, margin: "36px auto 0", background: "var(--nz-white)", border: "1px solid var(--border-default)", borderRadius: 20, padding: "28px 32px", boxShadow: "var(--shadow-xs)", display: "flex", gap: 24, alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap" }}>
            <div key={step} className="anim-fade-up" style={{ flex: 1, minWidth: "min(260px, 100%)" }}>
              <div className="eyebrow">{cur.core === "Conversión" ? "Momento de conversión" : `Núcleo · ${cur.core}`}</div>
              <h3 style={{ margin: "8px 0 0", fontSize: 22, fontWeight: 800 }}>{cur.title}</h3>
              <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.6, color: "var(--text-secondary)" }}>{cur.desc}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "var(--text-tertiary)" }}>{step} / 7</span>
              <Button variant="ghost" size="sm" onClick={() => setStep((s) => Math.max(1, s - 1))}><Icon name="ArrowLeft" size={15} /> Anterior</Button>
              <Button variant="ghost" size="sm" onClick={() => setStep((s) => Math.min(7, s + 1))}>Siguiente <Icon name="ArrowRight" size={15} /></Button>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ============ AUTORIDAD ============ */}
      <section id="sec-autoridad" className="bg-dark nz-ambient nz-ambient--dark nz-ambient--drift" style={{ position: "relative", overflow: "hidden" }}>
        <span className="nz-grain-layer nz-grain-layer--dark" aria-hidden />
        <img src={isotipo} alt="" style={{ position: "absolute", right: -120, bottom: -150, width: 480, opacity: 0.11, pointerEvents: "none" }} />
        <Container>
          <div className="grid-2" style={{ padding: "88px 0", position: "relative", gap: 56, alignItems: "center" }}>
            <div>
              <SectionHeading
                on="dark"
                eyebrow="Desde 1996"
                title="Más de 30 años de experiencia en la industria"
                lead="Historia, liderazgo y trato humano: la confianza se construye antes de hablar de precio. Netzen no es una fábrica de software — la plataforma se configura mediante contrato de uso de licencia en modalidad de renta, con consultoría incluida."
              />
              <Reveal delay={120} style={{ marginTop: 30, display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Button variant="inverse" to="/nosotros">Conoce Netzen</Button>
                <Button variant="inverse" to="/recursos">Ver Recursos</Button>
              </Reveal>
            </div>
            <Reveal delay={160} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, alignItems: "stretch" }}>
              {[
                { value: 30, prefix: "+", label: "años de experiencia en venta directa y multinivel" },
                { value: 3, label: "núcleos: tecnología, educación y estrategia" },
                { value: 6, label: "modelos de negocio en una sola operación" }
              ].map((s) => (
                <div key={s.label} className="nz-glass nz-glass--dark nz-glass--thin" style={{ borderRadius: 20, padding: "20px 22px" }}>
                  <Stat value={s.value} prefix={s.prefix} label={s.label} dark />
                </div>
              ))}
              <div className="nz-glass nz-glass--dark nz-glass--thin" style={{ borderRadius: 20, padding: "20px 22px" }}>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "var(--nz-blue-300)" }}>
                  Recursos que educan al mercado: blog, casos, guías y glosario.
                </p>
                <Link to="/recursos" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--nz-chalk)" }}>
                  Ver Recursos <Icon name="ArrowRight" size={14} />
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <CTABand />
    </>
  );
}
