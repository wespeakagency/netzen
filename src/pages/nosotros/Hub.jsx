// /nosotros — autoridad y trayectoria
import React from "react";
import { Link } from "react-router-dom";
import { Icon, Button, Section, SectionHeading, Reveal, Badge, Stat } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import isotipo from "../../assets/netzen-isotipo-red.png";
import { isRouteEnabled } from "../../lib/featureFlags.js";

const ALL_SUBPAGES = [
  { to: "/nosotros/historia", icon: "History", title: "Historia", desc: "De la computadora en el bochito a la última década de inteligencia artificial: el recorrido que respalda lo que hacemos hoy." },
  { to: "/nosotros/por-que-netzen", icon: "BadgeCheck", title: "Por qué Netzen", desc: "Ecosistema integral, consultoría incluida, omnicanalidad, multipaís y trato humano. Lo que nos hace distintos." },
  { to: "/nosotros/equipo", icon: "Users", title: "Liderazgo y equipo", desc: "Las personas detrás de la plataforma: experiencia técnica y de industria como respaldo de autoridad." },
  { to: "/nosotros/eventos", icon: "CalendarDays", title: "Eventos de industria", desc: "Encuentros que reunieron a la industria entre 2017 y 2018, con la intención de reactivarlos hacia 2027." },
  { to: "/nosotros/mision-vision-valores", icon: "Target", title: "Misión, visión y valores", desc: "Lo que nos mueve y los principios con los que operamos." },
  { to: "/nosotros/por-que-netzen", icon: "Award", title: "Certificaciones", desc: "Certificaciones y estándares de calidad del software. Se detallan dentro de «Por qué Netzen»." }
];
const SUBPAGES = ALL_SUBPAGES.filter((s) => isRouteEnabled(s.to));

function TimelineMini() {
  const hitos = [
    ["Años 90", "La computadora en el bochito"],
    ["2000s", "Renta de equipo y primeros sistemas web"],
    ["2017–18", "Encuentros de industria"],
    ["Hoy", "Analítica predictiva e IA"]
  ];
  return (
    <div className="card card--pad-lg" style={{ boxShadow: "var(--shadow-md)", position: "relative", overflow: "hidden" }}>
      <img src={isotipo} alt="" aria-hidden style={{ position: "absolute", right: -46, bottom: -56, width: 170, opacity: 0.07 }} />
      <div className="eyebrow" style={{ marginBottom: 18 }}>Tres décadas en cuatro hitos</div>
      <div className="tl">
        {hitos.map(([era, txt], i) => (
          <div className="tl__item" key={era} style={{ paddingBottom: i === hitos.length - 1 ? 0 : 22 }}>
            <span className="tl__dot" />
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, color: "var(--nz-red)" }}>{era}</div>
            <div style={{ fontSize: 14, color: "var(--text-body)", fontWeight: 600 }}>{txt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NosotrosHub() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Nosotros" }]}
        eyebrow="Nosotros · Autoridad antes que precio"
        title={<>Tecnología, conocimiento y desarrollo humano para <span style={{ color: "var(--nz-red)" }}>crecer con conciencia</span></>}
        lead="Netzen acompaña organizaciones de Venta Directa, Retail, e-Commerce, Franquicias y multinivel con una combinación difícil de separar: plataforma, consultoría estratégica y formación especializada."
        actions={<>
          <Button size="lg" to="/contacto">Agenda tu diagnóstico</Button>
          <Button size="lg" variant="secondary" to="/nosotros/historia">Conoce nuestra historia</Button>
        </>}
        aside={<TimelineMini />}
      />

      <Section bg="page">
        <SectionHeading eyebrow="Nivel 2 · Subpáginas" title="Conoce a Netzen por dentro" lead="La trayectoria es el principal diferenciador: cada página cuenta una parte." />
        <div className="grid-3" style={{ marginTop: 44 }}>
          {SUBPAGES.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 90}>
              <Link to={s.to} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12, color: "inherit", height: "100%" }}>
                <span className="bubble"><Icon name={s.icon} size={21} /></span>
                <h3 style={{ fontSize: 17.5, fontWeight: 700 }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{s.desc}</p>
                <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--nz-red)" }}>
                  Ver más <Icon name="ArrowRight" size={14} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="bg-dark" style={{ position: "relative", overflow: "hidden" }}>
        <img src={isotipo} alt="" aria-hidden style={{ position: "absolute", right: -120, top: -140, width: 420, opacity: 0.1 }} />
        <Section bg="dark" style={{ background: "transparent" }}>
          <div className="grid-2" style={{ alignItems: "center", gap: 56 }}>
            <SectionHeading
              on="dark"
              eyebrow="Trayectoria"
              title="La confianza se construye antes de hablar de precio"
              lead="Historia, liderazgo y trato humano. La trayectoria se cuenta en hitos y épocas; los números finos se validan antes de publicarse."
            />
            <Reveal delay={140} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
              <Stat value={30} prefix="+" label="años acompañando a la industria" dark />
              <Stat value={3} label="núcleos: tecnología, educación y estrategia" dark />
              <Stat value={6} label="modelos de negocio operados" dark />
              <Stat value={2027} label="reactivación del evento de industria (intención)" dark />
            </Reveal>
          </div>
        </Section>
      </section>

      <Section bg="wash" tight style={{ borderTop: "1px solid var(--nz-red-tint)", borderBottom: "1px solid var(--nz-red-tint)" }}>
        <SectionHeading eyebrow="El ecosistema" title="Cómo se conecta con los otros núcleos" />
        <div className="grid-2" style={{ marginTop: 32 }}>
          {[
            (isRouteEnabled("/nosotros/eventos") && isRouteEnabled("/recursos/webinars"))
              ? { icon: "Video", text: <><b>Nosotros · Eventos</b> → los encuentros de industria reviven como contenido en Recursos · Webinars y se vinculan al evento 2027.</>, to: "/recursos/webinars", label: "Ver Webinars" }
              : null,
            { icon: "Route", text: <><b>Nosotros · Historia y equipo</b> → la trayectoria sostiene el argumento de Soluciones: por qué confiar la operación a Netzen frente a una empresa nueva.</>, to: "/soluciones", label: "Ver Soluciones" }
          ].filter(Boolean).map((c, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <span className="bubble" style={{ width: 42, height: 42 }}><Icon name={c.icon} size={19} /></span>
                  <p style={{ fontSize: 14.5, lineHeight: 1.65 }}>{c.text}</p>
                </div>
                <Link to={c.to} style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>
                  {c.label} <Icon name="ArrowRight" size={15} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTABand
        title="Conversemos sobre tu operación"
        description="La autoridad la demostramos en una conversación: agenda tu diagnóstico sin costo."
        primaryLabel="Agenda tu diagnóstico"
        primaryTo="/contacto"
        secondaryLabel="Nuestra historia"
        secondaryTo="/nosotros/historia"
      />
    </>
  );
}
