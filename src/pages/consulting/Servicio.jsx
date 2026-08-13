// /consulting/:slug — plantilla de servicio de consultoría
import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Icon, Button, Section, SectionHeading, Reveal, CheckLine, Steps } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { SERVICIOS } from "./data.js";

function ServicioAside({ s }) {
  return (
    <div className="card card--pad-lg" style={{ boxShadow: "var(--shadow-md)" }}>
      <div className="eyebrow" style={{ marginBottom: 16 }}>Qué te llevas</div>
      <div style={{ display: "grid", gap: 12 }}>
        {s.entregables.slice(0, 4).map((e) => (
          <div key={e} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, lineHeight: 1.5 }}>
            <Icon name="FileText" size={15} style={{ color: "var(--nz-red)", marginTop: 2, flexShrink: 0 }} />
            {e}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--border-default)", fontSize: 12.5, color: "var(--text-tertiary)" }}>
        …y acompañamiento en la ejecución.
      </div>
    </div>
  );
}

export default function ConsultingServicio() {
  const { slug } = useParams();
  const s = SERVICIOS[slug];
  if (!s) return <Navigate to="/consulting" replace />;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Consulting", to: "/consulting" }, { label: s.name }]}
        eyebrow={s.badge}
        title={s.title}
        lead={s.lead}
        actions={<>
          <Button size="lg" to="/contacto">Agenda tu diagnóstico</Button>
          <Button size="lg" variant="secondary" to="/consulting">Volver a Consulting</Button>
        </>}
        aside={<ServicioAside s={s} />}
      />

      <Section bg="page">
        <SectionHeading eyebrow="Qué resuelve" title="Para qué momento del negocio sirve" />
        <div className="grid-3" style={{ marginTop: 40 }}>
          {s.resuelve.map((r, i) => (
            <Reveal key={r.title} delay={i * 90} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span className="bubble"><Icon name={r.icon} size={21} /></span>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>{r.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{r.desc}</p>
            </Reveal>
          ))}
        </div>
        {s.heroNote && (
          <Reveal delay={140}>
            <div style={{ marginTop: 26, display: "flex", gap: 14, alignItems: "flex-start", background: "var(--nz-blue-tint)", border: "1px solid var(--nz-blue-300)", borderRadius: 16, padding: "16px 20px" }}>
              <span className="bubble bubble--blue" style={{ width: 36, height: 36 }}><Icon name="Lightbulb" size={16} /></span>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--nz-blue)" }}><b>Nota:</b> {s.heroNote}</p>
            </div>
          </Reveal>
        )}
      </Section>

      {s.proceso && (
        <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
          <SectionHeading
            eyebrow="El proceso, paso a paso"
            title="Un método con orden, no una propuesta improvisada"
            lead="Cuatro etapas que llevan el plan de una idea a una configuración probada y lista para operar."
          />
          <div className="grid-4" style={{ marginTop: 44 }}>
            {s.proceso.map((p, i) => (
              <Reveal key={p.title} delay={i * 100} className="card card--hover" style={{ position: "relative", paddingTop: 34 }}>
                <span style={{
                  position: "absolute", top: -22, left: 24, width: 44, height: 44, borderRadius: "50%",
                  background: "var(--nz-red)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, boxShadow: "var(--shadow-accent)"
                }}>{i + 1}</span>
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>{p.title}</h3>
                <p style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.6, color: "var(--text-secondary)" }}>{p.description}</p>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {s.riesgos && (
        <Section bg="page">
          <SectionHeading
            eyebrow="Por qué importa que el cálculo esté bien"
            title="Un plan mal calculado falla por uno de dos lados"
            lead="Y ambos son graves. El equilibrio entre estos dos riesgos es el corazón del servicio — cada plan se calcula caso por caso sobre los números reales del cliente."
          />
          <div className="grid-2" style={{ marginTop: 40 }}>
            {s.riesgos.map((r, i) => (
              <Reveal key={r.title} delay={i * 100}>
                <div className="card" style={{ borderTop: "4px solid var(--nz-red)", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="bubble"><Icon name={r.icon} size={20} /></span>
                    <h3 style={{ fontSize: 18, fontWeight: 800 }}>{r.title}</h3>
                  </div>
                  <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.65, color: "var(--text-secondary)" }}>{r.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {s.incluye && (
        <Section bg={s.proceso ? "page" : "card"} style={{ borderTop: "1px solid var(--border-default)" }}>
          <div className="grid-2" style={{ gap: 56, alignItems: "start" }}>
            <div>
              <SectionHeading eyebrow="Alcance" title="Qué incluye" />
              <Reveal delay={100} style={{ marginTop: 28, display: "grid", gap: 13 }}>
                {s.incluye.map((x) => <CheckLine key={x}>{x}</CheckLine>)}
              </Reveal>
            </div>
            <div>
              <SectionHeading eyebrow="Entregable" title="Qué te llevas" />
              <Reveal delay={160} style={{ marginTop: 28, display: "grid", gap: 13 }}>
                {s.entregables.map((x) => (
                  <div key={x} className="checkline">
                    <span className="ic"><Icon name="FileText" size={16} /></span><span>{x}</span>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </Section>
      )}

      {!s.incluye && s.entregables && (
        <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
          <SectionHeading eyebrow="Entregable" title="Qué te llevas" />
          <Reveal delay={100} style={{ marginTop: 28, display: "grid", gap: 13, maxWidth: 720 }}>
            {s.entregables.map((x) => <CheckLine key={x}>{x}</CheckLine>)}
          </Reveal>
        </Section>
      )}

      <Section bg="wash" tight style={{ borderTop: "1px solid var(--nz-red-tint)", borderBottom: "1px solid var(--nz-red-tint)" }}>
        <SectionHeading eyebrow="El ecosistema" title="Conexión con el ecosistema" />
        <div style={{ marginTop: 30, display: "grid", gap: 16 }}>
          {s.conexiones.map((c, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="card" style={{ borderColor: "var(--nz-red-tint-strong)", display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
                <span className="bubble"><Icon name={c.icon} size={21} /></span>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <p style={{ fontSize: 15, lineHeight: 1.65 }}>
                    <b style={{ color: "var(--nz-red)" }}>{c.text[0]}</b>{c.text[1]}
                  </p>
                  <Link to={c.to} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>
                    {c.linkLabel} <Icon name="ArrowRight" size={15} />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTABand title="Agenda tu diagnóstico" description={s.ctaDesc} primaryLabel="Agenda tu diagnóstico" primaryTo="/contacto" secondaryLabel="Ver Consulting" secondaryTo="/consulting" />
    </>
  );
}
