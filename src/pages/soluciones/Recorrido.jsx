// /soluciones/:slug — plantilla de recorrido por situación (A/B/C/D/E)
import React, { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Icon, Button, Section, SectionHeading, Reveal, CheckLine, Badge, ConsentLine } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { RECORRIDOS } from "./data.js";
import { trackEvent } from "../../lib/analytics.js";

const CORE_COLOR = { Consulting: "info", Plataforma: "accent", Academy: "success", Cuenta: "neutral", Comunidad: "neutral" };

function CaminoTimeline({ camino }) {
  return (
    <div className="tl" style={{ maxWidth: 760 }}>
      {camino.map((c, i) => (
        <Reveal key={c.title} delay={i * 70} className="tl__item">
          <span className="tl__dot" />
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>{c.title}</h3>
            <Badge tone={CORE_COLOR[c.core] || "neutral"}>{c.core}</Badge>
            {c.tag && <Badge tone="warning">{c.tag}</Badge>}
          </div>
          <p style={{ marginTop: 6, fontSize: 14.5, lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 600 }}>{c.desc}</p>
        </Reveal>
      ))}
    </div>
  );
}

function FormRecorrido({ form, slug }) {
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <div className="card card--pad-lg" style={{ textAlign: "center" }}>
        <span style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--status-success-tint)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="Check" size={30} strokeWidth={2.4} style={{ color: "var(--status-success)" }} />
        </span>
        <h3 style={{ marginTop: 18, fontSize: 22, fontWeight: 700 }}>Solicitud validada</h3>
        <p style={{ marginTop: 10, fontSize: 15, lineHeight: 1.6, color: "var(--text-secondary)" }}>
          La experiencia de envío quedó completa. Al conectar esta versión con el CRM, un consultor podrá dar seguimiento por WhatsApp o correo.
        </p>
        <div style={{ marginTop: 22, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={() => setSent(false)}>Enviar otra solicitud</Button>
          <Button variant="ghost" to="/soluciones">Ver otros recorridos</Button>
        </div>
      </div>
    );
  }
  return (
    <form
      className="card card--pad-lg"
      onSubmit={(e) => {
        e.preventDefault();
        trackEvent("form_submit", { form_type: "solucion", route: slug });
        setSent(true);
      }}
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      <div style={{ display: "grid", gap: 18 }}>
        {form.fields.map((f) => (
          <div className="field" key={f.label}>
            <label>{f.label} {f.required && <span className="req">*</span>}</label>
            {f.textarea
              ? <textarea placeholder={f.placeholder} required={f.required} />
              : <input type={f.type || "text"} placeholder={f.placeholder} required={f.required} />}
          </div>
        ))}
        <ConsentLine />
        <Button size="lg" block onClick={undefined}>{form.submit}</Button>
        <p style={{ fontSize: 12, color: "var(--text-tertiary)", textAlign: "center", margin: 0 }}>
          Integración preparada para atribución «Soluciones · {slug}». La conexión final al CRM está pendiente.
        </p>
      </div>
    </form>
  );
}

export default function SolucionRecorrido() {
  const { slug } = useParams();
  const r = RECORRIDOS[slug];
  if (!r) return <Navigate to="/soluciones" replace />;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Soluciones", to: "/soluciones" }, { label: r.name }]}
        eyebrow={r.badge}
        badge={r.isNew ? <Badge tone="accent">Rubro nuevo</Badge> : null}
        title={r.title}
        lead={r.lead}
        actions={r.heroActions.map((a) => (
          <Button key={a.label} size="lg" variant={a.variant || "primary"} to={a.to}>{a.label}</Button>
        ))}
        aside={
          <div className="card card--pad-lg" style={{ boxShadow: "var(--shadow-md)" }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Recorrido resumido</div>
            <div style={{ display: "grid", gap: 10 }}>
              {r.camino.slice(0, 3).map((step, index) => (
                <div key={step.title} style={{ display: "flex", gap: 12, alignItems: "center", border: "1px solid var(--border-default)", borderRadius: 12, padding: "11px 14px" }}>
                  <span className="route-summary__number">{index + 1}</span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5 }}>{step.title}</span>
                    <span style={{ display: "block", marginTop: 2, fontSize: 11.5, color: "var(--text-tertiary)" }}>{step.core}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        }
      />

      <Section bg="page">
        <SectionHeading eyebrow="Perfil" title="Esto es para ti si…" />
        <div className="grid-3" style={{ marginTop: 40 }}>
          {r.paraTi.map((p, i) => (
            <Reveal key={p.title} delay={i * 90} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span className="bubble"><Icon name={p.icon} size={21} /></span>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>{p.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{p.desc}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {r.beneficios && (
        <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
          <div className="grid-2" style={{ gap: 56, alignItems: "start" }}>
            <div>
              <SectionHeading eyebrow="Qué obtienes" title={r.beneficiosTitle} />
              <Reveal delay={100} style={{ marginTop: 28, display: "grid", gap: 13 }}>
                {r.beneficios.map((b) => <CheckLine key={b}>{b}</CheckLine>)}
              </Reveal>
            </div>
            {r.nota && (
              <Reveal variant="right">
                <div className="card" style={{ background: "var(--nz-blue-tint)", border: "1px solid var(--nz-blue-300)" }}>
                  <span className="bubble bubble--blue"><Icon name={r.nota.icon} size={20} /></span>
                  <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.7, color: "var(--nz-blue)" }}>{r.nota.text}</p>
                </div>
              </Reveal>
            )}
          </div>
        </Section>
      )}

      <Section bg={r.beneficios ? "page" : "card"} style={!r.beneficios ? { borderTop: "1px solid var(--border-default)" } : undefined}>
        <SectionHeading eyebrow={r.caminoEyebrow} title={r.caminoTitle} />
        <div style={{ marginTop: 44 }}>
          <CaminoTimeline camino={r.camino} />
        </div>
      </Section>

      {r.oportunidades && (
        <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
          <SectionHeading eyebrow="Oportunidades de expansión" title="Todo lo que puedes activar desde tu cuenta" />
          <div className="grid-3" style={{ marginTop: 40 }}>
            {r.oportunidades.map((o, i) => (
              <Reveal key={o.title} delay={(i % 3) * 90}>
                <Link to={o.to} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12, color: "inherit", height: "100%" }}>
                  <span className="bubble"><Icon name={o.icon} size={21} /></span>
                  <h3 style={{ fontSize: 16.5, fontWeight: 700 }}>{o.title}</h3>
                  <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--text-secondary)" }}>{o.desc}</p>
                  <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, color: "var(--nz-red)" }}>
                    Ver más <Icon name="ArrowRight" size={13} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {r.conexiones.length > 0 && (
        <Section bg="wash" tight style={{ borderTop: "1px solid var(--nz-red-tint)", borderBottom: "1px solid var(--nz-red-tint)" }}>
          <SectionHeading eyebrow="El ecosistema" title="Núcleos que intervienen en tu recorrido" />
          <div className="grid-2" style={{ marginTop: 30 }}>
            {r.conexiones.map((c, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="card" style={{ borderColor: "var(--nz-red-tint-strong)", height: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", gap: 14 }}>
                    <span className="bubble" style={{ width: 42, height: 42 }}><Icon name={c.icon} size={19} /></span>
                    <p style={{ fontSize: 14.5, lineHeight: 1.65 }}>{c.text}</p>
                  </div>
                  <Link to={c.to} style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>
                    {c.linkLabel} <Icon name="ArrowRight" size={15} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
        <div className="grid-2" style={{ gap: 56, alignItems: "start" }}>
          <div>
            <SectionHeading eyebrow={r.form.eyebrow} title={r.form.title} lead={r.form.note} />
            <Reveal delay={120} style={{ marginTop: 26, display: "grid", gap: 13 }}>
              <CheckLine>Respuesta por WhatsApp o correo en horario hábil</CheckLine>
              <CheckLine>Atribución por canal para darte seguimiento correcto</CheckLine>
              <CheckLine>La conversación empieza por valor, no por precio</CheckLine>
            </Reveal>
          </div>
          <Reveal variant="right" delay={80}>
            <FormRecorrido form={r.form} slug={r.name} />
          </Reveal>
        </div>
      </Section>

      <CTABand
        title={r.cta.title}
        description={r.cta.desc}
        primaryLabel={r.cta.primary}
        primaryTo={r.cta.primaryTo || "/contacto"}
        secondaryLabel={r.cta.secondary}
        secondaryTo={r.cta.secondaryTo || "/contacto/demo"}
      />
    </>
  );
}
