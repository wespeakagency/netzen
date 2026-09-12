// /nosotros/historia — línea de tiempo
import React from "react";
import { Link } from "react-router-dom";
import { Icon, Button, Section, SectionHeading, Reveal, Badge } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { isRouteEnabled } from "../../lib/featureFlags.js";

const HITOS = [
  {
    era: "Años 90", icon: "Truck",
    title: "Inicios — «la computadora en el bochito»",
    desc: "Cuando la venta directa todavía operaba con papel, llevamos los primeros sistemas de cómputo a las empresas. La anécdota de la computadora transportada en el bochito resume el espíritu: poner la tecnología disponible donde hiciera falta, como fuera necesario."
  },
  {
    era: "2000s", icon: "Server",
    title: "Renta de equipo y los primeros sistemas web",
    desc: "Antes de que «la nube» fuera una palabra común, ofrecíamos esquemas de renta de equipo y los primeros sistemas web para administrar redes de distribuidores, comisiones y catálogos en línea."
  },
  {
    era: "2017–2018", icon: "CalendarDays",
    title: "Encuentros de industria",
    desc: "Organizamos eventos que reunieron a empresas, líderes y especialistas del sector para compartir prácticas correctas y tendencias de la venta directa y el multinivel.",
    link: { label: "Ver eventos", to: "/nosotros/eventos" }
  },
  {
    era: "La última década", icon: "Bot",
    title: "Analítica predictiva e inteligencia artificial",
    desc: "Incorporamos modelos de predicción, escenarios y reporteo en lenguaje natural, llevando a las empresas de venta directa al mismo nivel tecnológico que cualquier corporativo moderno."
  }
];

const APRENDIZAJES = [
  { icon: "Zap", title: "Adaptarse antes que nadie", desc: "Cada salto tecnológico —del escritorio a la web, de la web a la IA— lo adoptamos temprano para que nuestros clientes no se quedaran atrás." },
  { icon: "Compass", title: "Entender la industria, no solo el código", desc: "Décadas dentro de la venta directa nos dieron criterio sobre planes de compensación, genealogías y operación real, no solo sobre software." },
  { icon: "HeartHandshake", title: "Relaciones de largo plazo", desc: "Acompañar a una empresa durante años nos enseñó a construir tecnología que escala con el negocio, no que lo encierra." }
];

export default function Historia() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Nosotros", to: "/nosotros" }, { label: "Historia" }]}
        eyebrow="Nosotros · Historia"
        title={<>De la computadora en el bochito a la era de la <span style={{ color: "var(--nz-red)" }}>inteligencia artificial</span></>}
        lead="Más de tres décadas adaptando la tecnología al ritmo de la venta directa: empezamos cuando un equipo de cómputo era una rareza y hoy operamos con analítica predictiva e IA. Esta es la trayectoria que respalda cada implementación."
        actions={<>
          <Button size="lg" to="/contacto">Agenda tu diagnóstico</Button>
          <Button size="lg" variant="secondary" to="/nosotros/por-que-netzen">Por qué Netzen</Button>
        </>}
      />

      <Section bg="page">
        <SectionHeading eyebrow="La línea de tiempo" title="Cada etapa, un cambio tecnológico vivido con la industria" lead="La trayectoria se cuenta en hitos y épocas; las fechas finas se confirman en la etapa de contenido." />
        <div style={{ marginTop: 52, position: "relative", maxWidth: 820 }}>
          <div className="tl">
            {HITOS.map((h, i) => (
              <Reveal key={h.title} delay={i * 90} className="tl__item">
                <span className="tl__dot" />
                <div className="card card--hover" style={{ padding: 26 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span className="bubble" style={{ width: 42, height: 42 }}><Icon name={h.icon} size={19} /></span>
                    <Badge tone="accent">{h.era}</Badge>
                  </div>
                  <h3 style={{ marginTop: 14, fontSize: 19, fontWeight: 800 }}>{h.title}</h3>
                  <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.65, color: "var(--text-secondary)" }}>{h.desc}</p>
                  {h.link && isRouteEnabled(h.link.to) && (
                    <Link to={h.link.to} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>
                      {h.link.label} <Icon name="ArrowRight" size={14} />
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
        <SectionHeading eyebrow="Lo que aprendimos" title="Lo que aprendimos en cada etapa" />
        <div className="grid-3" style={{ marginTop: 40 }}>
          {APRENDIZAJES.map((a, i) => (
            <Reveal key={a.title} delay={i * 90} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span className="bubble"><Icon name={a.icon} size={21} /></span>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>{a.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{a.desc}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTABand
        title="Esa experiencia, al servicio de tu operación"
        description="Pon a trabajar 30 años de trayectoria en tu empresa. Empieza con un diagnóstico."
        primaryLabel="Agenda tu diagnóstico"
        primaryTo="/contacto"
        secondaryLabel="Por qué Netzen"
        secondaryTo="/nosotros/por-que-netzen"
      />
    </>
  );
}
