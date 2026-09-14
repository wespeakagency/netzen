// /consulting — hub del núcleo de estrategia
import React from "react";
import { Link } from "react-router-dom";
import { Icon, Button, Section, SectionHeading, Reveal, Steps } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { SERVICIOS, SERVICIOS_ORDER } from "./data.js";
import { LABELS, CTA_PATHS } from "../../lib/copy.js";

function BrainVisual() {
  return (
    <div className="card card--pad-lg" style={{ boxShadow: "var(--shadow-md)" }}>
      <div className="eyebrow" style={{ marginBottom: 18 }}>Diagnóstico → plan → ejecución</div>
      <Steps
        items={[
          { title: "Diagnóstico", description: "Entendemos modelo, red y números." },
          { title: "Plan y estrategia", description: "Compensación, expansión y operación." },
          { title: "Ejecución conectada", description: "La plataforma y Academy lo aterrizan." }
        ]}
      />
      <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border-default)", display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "var(--text-tertiary)" }}>
        <Icon name="Compass" size={15} style={{ color: "var(--nz-red)" }} />
        La conversación empieza por valor, no por precio.
      </div>
    </div>
  );
}

export default function ConsultingHub() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Consulting" }]}
        eyebrow="Núcleo 03 · Estrategia"
        title={<>Consulting: el <span style={{ color: "var(--nz-red)" }}>cerebro estratégico</span> que conecta todo</>}
        lead="Diagnóstico, planes de compensación y estrategia de industria. Antes de instalar tecnología o formar a tu red, definimos el modelo que hace sostenible el negocio: cómo se vende, cómo se paga y hacia dónde se expande."
        actions={<>
          <Button size="lg" to={CTA_PATHS.contacto} placement="hero">{LABELS.diagnostico}</Button>
          <Button size="lg" variant="secondary" to={CTA_PATHS.demo} placement="hero">{LABELS.demo}</Button>
        </>}
        aside={<BrainVisual />}
      />

      <Section bg="page">
        <SectionHeading
          eyebrow="Nivel 2 · Servicios de consultoría"
          title="Cómo trabajamos contigo"
          lead="El diagnóstico es la puerta de entrada; de ahí se deriva el plan de compensación, la estrategia de expansión y el acompañamiento del modelo. Cada servicio tiene su propia página de detalle."
        />
        <div className="grid-2" style={{ marginTop: 44 }}>
          {SERVICIOS_ORDER.map((slug, i) => {
            const s = SERVICIOS[slug];
            return (
              <Reveal key={slug} delay={(i % 2) * 100}>
                <Link to={`/consulting/${slug}`} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 14, height: "100%", color: "inherit" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span className="bubble"><Icon name={s.icon} size={21} /></span>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 12, color: "var(--nz-gray-400)" }}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 19, fontWeight: 700 }}>{s.name}</h3>
                    <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{s.lead.split(". ")[0].split(":")[1] || s.lead.split(". ")[0]}.</p>
                  </div>
                  <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--nz-red)" }}>
                    Ver servicio <Icon name="ArrowRight" size={14} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section bg="wash" tight style={{ borderTop: "1px solid var(--nz-red-tint)", borderBottom: "1px solid var(--nz-red-tint)" }}>
        <SectionHeading
          eyebrow="El ecosistema"
          title="Consulting no es un servicio suelto"
          lead="Es la capa que da sentido a la tecnología y a la formación: el contrato de uso de la plataforma llega acompañado de criterio estratégico."
        />
        <div className="grid-2" style={{ marginTop: 32 }}>
          {[
            { icon: "Store", text: <><b>Planes de compensación → Plataforma</b>: el plan diseñado configura el motor de comisiones. Lo que aquí se define se vuelve la configuración del software.</>, to: "/plataforma/software-netzen", label: "Ver Software Netzen" },
            { icon: "Rocket", text: <><b>Consultoría tecnológica → Implementación</b>: acompaña cada implementación y el contrato de uso de la plataforma.</>, to: "/plataforma/implementacion", label: "Ver Implementación" }
          ].map((c, i) => (
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
        title={LABELS.diagnostico}
        description="El punto de partida: entendemos tu modelo, tu red y tus números antes de proponer cualquier plan o tecnología."
        primaryLabel={LABELS.diagnostico}
        primaryTo="/contacto"
        secondaryLabel={null}
      />
    </>
  );
}
