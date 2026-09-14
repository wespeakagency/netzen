// /recursos/guias — lead magnets con formulario
import React, { useMemo, useState } from "react";
import { Icon, Section, SectionHeading, Reveal, Badge, ConsentLine } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { GUIAS, GUIA_DESTACADA } from "./data.js";
import { trackEvent } from "../../lib/analytics.js";
import { submitLead, FormSubmitError } from "../../lib/forms.js";
import { LABELS } from "../../lib/copy.js";

function GuiaCover({ icon, small }) {
  return (
    <div style={{
      aspectRatio: small ? "16/9" : "4/5", borderRadius: 14, position: "relative", overflow: "hidden",
      background: "linear-gradient(150deg, var(--nz-blue) 0%, var(--nz-blue-600) 60%, var(--nz-red-deep) 140%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12
    }}>
      <span style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(245,245,245,0.12)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon || "FileText"} size={24} style={{ color: "#F5F5F5" }} />
      </span>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, letterSpacing: "0.2em", color: "var(--nz-blue-300)" }}>GUÍA · PDF</span>
    </div>
  );
}

function DescargaForm() {
  const renderedAt = useMemo(() => Date.now(), []);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    trackEvent("form_submit", { form_type: "guia_destacada" });
    try {
      await submitLead({
        formType: "guia_destacada",
        honeypot: website,
        renderedAt,
        fields: { nombre, email, empresa, guia: GUIA_DESTACADA.title }
      });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof FormSubmitError ? err.message : "Hubo un problema. Intentá de nuevo.");
    }
  };

  if (status === "sent") {
    return (
      <div style={{ textAlign: "center", padding: "18px 0" }}>
        <span style={{ width: 54, height: 54, borderRadius: "50%", background: "var(--status-success-tint)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="Check" size={26} style={{ color: "var(--status-success)" }} />
        </span>
        <h3 style={{ marginTop: 14, fontSize: 19, fontWeight: 700 }}>¡Recibimos tu solicitud!</h3>
        <p style={{ marginTop: 8, fontSize: 14, color: "var(--text-secondary)" }}>Te enviamos la guía a <strong>{email}</strong> en los próximos minutos.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "grid", gap: 14 }}>
      <div className="field">
        <label htmlFor="dg-nombre">Nombre <span className="req">*</span></label>
        <input id="dg-nombre" name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="María González" required autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="dg-email">Correo corporativo <span className="req">*</span></label>
        <input id="dg-email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@empresa.com" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="dg-empresa">Empresa</label>
        <input id="dg-empresa" name="empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Nombre de tu empresa" autoComplete="organization" />
      </div>
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>Sitio web (no llenar)<input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
      </div>
      <ConsentLine compact />
      {status === "error" && (
        <div role="alert" style={{ padding: "8px 12px", borderRadius: 8, background: "var(--status-danger-tint, #fdecec)", color: "var(--status-danger, #b3261e)", fontSize: 13 }}>
          {errorMsg}
        </div>
      )}
      <button type="submit" className="btn btn--primary btn--block" disabled={status === "sending"}>
        <Icon name="Download" size={16} /> {status === "sending" ? "Enviando..." : "Descargar guía"}
      </button>
    </form>
  );
}

export default function Guias() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Recursos", to: "/recursos" }, { label: "Guías" }]}
        eyebrow="Recursos · Guías y descargables"
        badge={<Badge tone="accent">Lead magnet</Badge>}
        title={<>Guías prácticas y descargables para <span style={{ color: "var(--nz-red)" }}>escalar tu operación</span></>}
        lead="Material accionable —checklists, plantillas y guías en PDF— para profesionalizar la venta directa y multinivel."
      />

      <Section bg="page">
        <SectionHeading eyebrow="Guía destacada" title="La lectura que más piden las empresas con software propio" />
        <Reveal style={{ marginTop: 36 }}>
          <div className="card card--pad-lg grid-3" style={{ gap: 40, alignItems: "center", boxShadow: "var(--shadow-md)" }}>
            <GuiaCover icon="RefreshCw" small />
            <div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge tone="info">{GUIA_DESTACADA.cat}</Badge>
                <Badge tone="neutral">{GUIA_DESTACADA.pages}</Badge>
              </div>
              <h3 style={{ marginTop: 12, fontSize: 22, fontWeight: 800, lineHeight: 1.25 }}>{GUIA_DESTACADA.title}</h3>
              <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.65, color: "var(--text-secondary)" }}>{GUIA_DESTACADA.desc}</p>
            </div>
            <div style={{ borderLeft: "1px solid var(--border-default)", paddingLeft: 34 }} className="guia-form-col">
              <DescargaForm />
            </div>
          </div>
        </Reveal>
      </Section>

      <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
        <SectionHeading eyebrow="Todas las guías" title="Elige tu tema y descarga" lead="Cada descarga abre un formulario corto antes de entregar el archivo." />
        <div className="grid-3" style={{ marginTop: 40 }}>
          {GUIAS.map((g, i) => (
            <Reveal key={g.title} delay={(i % 3) * 90}>
              <div className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
                <GuiaCover icon={g.icon} small />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Badge tone="neutral">{g.cat}</Badge>
                  <Badge tone="neutral">{g.pages}</Badge>
                </div>
                <h3 style={{ fontSize: 16.5, fontWeight: 700, lineHeight: 1.35 }}>{g.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text-secondary)" }}>{g.desc}</p>
                <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--nz-red)", cursor: "pointer" }}>
                  <Icon name="Download" size={14} /> Descargar
                </span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <p style={{ marginTop: 28, fontSize: 12.5, color: "var(--text-tertiary)" }}>
            Toda descarga con formulario respeta el aviso de privacidad y registra consentimiento.
          </p>
        </Reveal>
      </Section>

      <CTABand
        title="¿Prefieres hablar con un especialista?"
        description="Agenda un diagnóstico y recibe recomendaciones a la medida de tu operación."
        primaryLabel={LABELS.diagnostico}
        primaryTo="/contacto"
        secondaryLabel="Ver blog"
        secondaryTo="/recursos/blog"
      />
    </>
  );
}
