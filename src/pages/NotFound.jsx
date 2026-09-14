// Página 404 — se muestra cuando la ruta no matchea con ninguna del router.
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Icon, Button, Section, Reveal } from "../components/ui.jsx";
import { CTABand } from "../components/chrome.jsx";
import { trackEvent } from "../lib/analytics.js";
import { LABELS } from "../lib/copy.js";

const SUGERENCIAS = [
  { to: "/", icon: "Compass", title: "Inicio", desc: "Vuelve a la página principal y arranca de cero." },
  { to: "/plataforma", icon: "Cpu", title: "Plataforma", desc: "Explora el core comercial y todos los módulos." },
  { to: "/soluciones", icon: "Route", title: "Soluciones", desc: "Recorridos por situación y modelo de negocio." },
  { to: "/contacto", icon: "CalendarCheck", title: "Contacto", desc: "Agenda tu diagnóstico con un especialista." }
];

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    trackEvent("not_found", { attempted_path: location.pathname });
  }, [location.pathname]);

  return (
    <>
      <div className="phero nz-grain" style={{ borderBottom: "1px solid var(--border-default)" }}>
        <div className="phero__ring" style={{ width: 520, height: 520, right: -180, top: -220, opacity: 0.7 }} />
        <div className="phero__ring" style={{ width: 320, height: 320, right: -60, top: -120 }} />
        <Container>
          <div style={{ padding: "80px 0 88px", maxWidth: 720 }} className="anim-fade-up">
            <span className="eyebrow">Error 404</span>
            <h1 style={{ marginTop: 16, fontSize: "clamp(38px, 5vw, 56px)", fontWeight: 800, lineHeight: 1.08 }}>
              Esta página <span style={{ color: "var(--nz-red)" }}>no existe</span> o fue movida
            </h1>
            <p className="lead" style={{ marginTop: 18 }}>
              La ruta <code style={{ background: "var(--nz-red-wash)", padding: "2px 8px", borderRadius: 6, fontSize: "0.9em", color: "var(--nz-red)" }}>{location.pathname}</code> no coincide con ninguna sección del sitio. Puede que el enlace esté desactualizado o que hayas escrito mal la dirección.
            </p>
            <div style={{ marginTop: 30, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Button size="lg" to="/">Volver al inicio</Button>
              <Button size="lg" variant="secondary" to="/mapa">Ver mapa del sitio</Button>
            </div>
          </div>
        </Container>
      </div>

      <Section bg="page">
        <div className="eyebrow" style={{ marginBottom: 20 }}>¿Quizás buscabas alguna de estas?</div>
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {SUGERENCIAS.map((s, i) => (
            <Reveal key={s.to} delay={i * 80}>
              <Link to={s.to} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12, color: "inherit", height: "100%" }}>
                <span className="bubble"><Icon name={s.icon} size={21} /></span>
                <h3 style={{ fontSize: 16.5, fontWeight: 700 }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--text-secondary)" }}>{s.desc}</p>
                <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--nz-red)" }}>
                  Ir <Icon name="ArrowRight" size={14} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTABand
        title="¿No encuentras lo que buscabas?"
        description="Cuéntanos qué estabas intentando lograr y te guiamos al recurso correcto."
        primaryLabel={LABELS.diagnostico}
        primaryTo="/contacto"
        secondaryLabel="Ver mapa del sitio"
        secondaryTo="/mapa"
      />
    </>
  );
}
