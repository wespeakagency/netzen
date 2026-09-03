// /mapa — mapa del sitio (sustituye al índice de wireframes)
import React from "react";
import { Link } from "react-router-dom";
import { Icon, Section, SectionHeading, Reveal } from "../components/ui.jsx";
import { PageHero } from "../components/chrome.jsx";
import { NAV } from "../lib/nav.js";

const EXTRA = [
  { label: "Home", path: "/" },
  { label: "Contacto · Agenda tu diagnóstico", path: "/contacto" },
  { label: "Demo protegido", path: "/contacto/demo" }
];

export default function Mapa() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Mapa del sitio" }]}
        eyebrow="Arquitectura de información"
        title="Mapa del sitio"
        lead="Las 44 pantallas del prototipo, organizadas por núcleo. Cada enlace abre la página con el nuevo diseño."
      />
      <Section bg="page">
        <div className="grid-3">
          {NAV.map((g, gi) => (
            <Reveal key={g.label} delay={(gi % 3) * 80}>
              <div className="card" style={{ height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span className="bubble" style={{ width: 40, height: 40 }}><Icon name={g.icon} size={18} /></span>
                  <div>
                    <Link to={g.path} style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "var(--text-heading)" }}>{g.label}</Link>
                    <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>{g.desc} · <code style={{ fontSize: 10.5 }}>{g.path}</code></div>
                  </div>
                </div>
                <div style={{ display: "grid", gap: 2 }}>
                  <Link to={g.path} style={{ padding: "6px 10px", borderRadius: 8, fontSize: 13.5, fontWeight: 700 }}>Hub de {g.label} →</Link>
                  {g.children.map((c) => (
                    <Link key={c.path} to={c.path} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "6px 10px", borderRadius: 8, fontSize: 13.5, color: "var(--text-secondary)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--nz-red-wash)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal delay={160}>
            <div className="card" style={{ height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <span className="bubble" style={{ width: 40, height: 40 }}><Icon name="LayoutGrid" size={18} /></span>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16 }}>Capa global</div>
              </div>
              <div style={{ display: "grid", gap: 2 }}>
                {EXTRA.map((e) => (
                  <Link key={e.path} to={e.path} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "6px 10px", borderRadius: 8, fontSize: 13.5, color: "var(--text-secondary)" }}
                    onMouseEnter={(ev) => (ev.currentTarget.style.background = "var(--nz-red-wash)")}
                    onMouseLeave={(ev) => (ev.currentTarget.style.background = "transparent")}>
                    {e.label}<code style={{ fontSize: 10.5, color: "var(--text-tertiary)" }}>{e.path}</code>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
