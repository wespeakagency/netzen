// /recursos/guias — lead magnets con formulario
import React, { useState } from "react";
import { Icon, Button, Section, SectionHeading, Reveal, Badge, ConsentLine } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { GUIAS, GUIA_DESTACADA } from "./data.js";
import { trackEvent } from "../../lib/analytics.js";

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
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "18px 0" }}>
        <span style={{ width: 54, height: 54, borderRadius: "50%", background: "var(--status-success-tint)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="Check" size={26} style={{ color: "var(--status-success)" }} />
        </span>
        <h3 style={{ marginTop: 14, fontSize: 19, fontWeight: 700 }}>Descarga validada</h3>
        <p style={{ marginTop: 8, fontSize: 14, color: "var(--text-secondary)" }}>El envío del PDF y la atribución al CRM se activarán al conectar esta versión.</p>
      </div>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        trackEvent("form_submit", { form_type: "guia_destacada" });
        setSent(true);
      }}
      style={{ display: "grid", gap: 14 }}
    >
      <div className="field"><label>Nombre <span className="req">*</span></label><input placeholder="Nombre y apellido" required /></div>
      <div className="field"><label>Correo corporativo <span className="req">*</span></label><input type="email" placeholder="tucorreo@empresa.com" required /></div>
      <div className="field"><label>Empresa</label><input placeholder="Nombre de tu empresa" /></div>
      <ConsentLine compact />
      <Button block><Icon name="Download" size={16} /> Descargar guía</Button>
      <p style={{ fontSize: 11.5, color: "var(--text-tertiary)", margin: 0, textAlign: "center" }}>
        Integración preparada para atribuir el origen en el CRM.
      </p>
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
        primaryLabel="Agenda tu diagnóstico"
        primaryTo="/contacto"
        secondaryLabel="Ver blog"
        secondaryTo="/recursos/blog"
      />
    </>
  );
}
