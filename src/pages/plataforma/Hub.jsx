// /plataforma — hub del núcleo tecnológico
import React from "react";
import { Link } from "react-router-dom";
import { Icon, Button, Section, SectionHeading, Reveal, MockFrame, MockBars } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { MODULOS, MODULOS_ORDER } from "./data.js";
import { PlatformModuleCard } from "./components/PlatformModuleCards.jsx";
import { LABELS, CTA_PATHS } from "../../lib/copy.js";

function HeroMock() {
  return (
    <MockFrame url="app.netzen.mx/backoffice">
      <div style={{ padding: 18, display: "grid", gap: 14 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="bubble bubble--sm"><Icon name="Store" size={16} /></span>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13 }}>Ventas del mes · todos los canales</div>
            <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>Venta directa · retail · e-commerce · POS</div>
          </div>
          <span className="badge badge--success" style={{ marginLeft: "auto" }}>+12.4%</span>
        </div>
        <MockBars />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[["Pedidos", "1,284"], ["Comisiones", "$482k"], ["Distribuidores", "3,120"]].map(([k, v]) => (
            <div key={k} style={{ background: "var(--nz-chalk)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{k}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

export default function PlataformaHub() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Plataforma" }]}
        eyebrow="Núcleo 01 · Tecnología"
        title={<>Plataforma Netzen: software modular para <span style={{ color: "var(--nz-red)" }}>comercializar, operar y crecer</span></>}
        lead="Plataforma SaaS modular que se adapta a distintos modelos de negocio mediante contrato de uso de licencia en modalidad de renta, con consultoría incluida en cada implementación."
        actions={<>
          <Button size="lg" to={CTA_PATHS.demo} placement="hero">{LABELS.demo}</Button>
          <Button size="lg" variant="secondary" to={CTA_PATHS.contacto} placement="hero">{LABELS.diagnostico}</Button>
        </>}
        aside={<HeroMock />}
      />

      <Section bg="page">
        <SectionHeading
          eyebrow="Nivel 2 · Módulos"
          title="Todo lo que incluye la plataforma"
          lead="Cada módulo tiene su propia página de detalle. Explóralos: juntos cubren la operación completa, de la venta al servidor."
        />
        <div className="grid-3" style={{ marginTop: 44 }}>
          {MODULOS_ORDER.map((slug, i) => {
            const m = MODULOS[slug];
            return (
              <Reveal key={slug} delay={(i % 3) * 90}>
                <PlatformModuleCard module={m} to={`/plataforma/${slug}`} index={i} />
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
        <SectionHeading
          eyebrow="No es una fábrica de software"
          title="Plataforma configurable mediante contrato de uso"
          lead="Se configura y dimensiona para tu operación mediante un contrato de uso de licencia en modalidad de renta, con consultoría incluida; no es una venta de licencia ni una fábrica de software."
        />
        <div className="grid-3" style={{ marginTop: 36 }}>
          {[
            { icon: "Settings", t: "Configurable, no improvisada", d: "La plataforma se adapta a tu modelo y plan de compensación con la solidez de un producto probado." },
            { icon: "TrendingUp", t: "Escala contigo", d: "Usuarios, transacciones y mercados crecen sin cambiar de sistema ni contratar paquetes cerrados." },
            { icon: "HeartHandshake", t: "Consultoría incluida", d: "Cada implementación llega con consultoría tecnológica y un ejecutivo de cuenta dedicado." }
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 90} className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span className="bubble"><Icon name={c.icon} size={21} /></span>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>{c.t}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{c.d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section bg="wash" tight style={{ borderTop: "1px solid var(--nz-red-tint)", borderBottom: "1px solid var(--nz-red-tint)" }}>
        <SectionHeading eyebrow="El ecosistema" title="Cómo se conecta con los otros núcleos" />
        <div className="grid-3" style={{ marginTop: 32 }}>
          {[
            { icon: "Scale", text: <><b>Consulting · Planes de compensación</b> → el plan diseñado configura el motor de comisiones del software.</>, to: "/consulting/planes-de-compensacion" },
            { icon: "Wrench", text: <><b>Consulting · Consultoría tecnológica</b> → acompaña cada implementación y el contrato de uso de la plataforma.</>, to: "/consulting/tecnologia" },
            { icon: "GraduationCap", text: <><b>Oficina Virtual → Academy</b> → la red que la opera se profesionaliza en Academy · Distribuidor Independiente.</>, to: "/academy/distribuidor-independiente" }
          ].map((c, i) => (
            <Reveal key={i} delay={i * 90}>
              <Link to={c.to} className="card card--hover" style={{ display: "flex", gap: 14, alignItems: "flex-start", color: "inherit", height: "100%" }}>
                <span className="bubble" style={{ width: 42, height: 42 }}><Icon name={c.icon} size={19} /></span>
                <span style={{ fontSize: 14, lineHeight: 1.6 }}>{c.text}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTABand
        title={LABELS.demo}
        description="Teaser público + demo real controlado para prospectos calificados. Así protegemos la lógica premium de la plataforma."
        primaryLabel="Solicitar demo"
        primaryTo="/contacto/demo"
        secondaryLabel={LABELS.diagnostico}
        secondaryTo="/contacto"
      />
    </>
  );
}
