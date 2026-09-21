// /soluciones — capa de autoidentificación
import React from "react";
import { Link } from "react-router-dom";
import { Icon, Button, Section, SectionHeading, Reveal, Badge } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { RECORRIDOS, RECORRIDOS_ORDER, MODELOS_NEGOCIO, MODELOS_ORDER } from "./data.js";
import { LABELS, CTA_PATHS } from "../../lib/copy.js";

function MapaRecorridos() {
  return (
    <div className="card card--pad-lg" style={{ boxShadow: "var(--shadow-md)" }}>
      <div className="eyebrow" style={{ marginBottom: 16 }}>Cuatro puertas, un mismo destino</div>
      <div style={{ display: "grid", gap: 10 }}>
        {RECORRIDOS_ORDER.map((slug, i) => {
          const r = RECORRIDOS[slug];
          return (
            <Link key={slug} to={`/soluciones/${slug}`} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
              border: "1px solid var(--border-default)", borderRadius: 12, color: "inherit",
              background: "var(--nz-white)", transition: "all 180ms var(--ease-out)",
              animation: `nzFloat 6.5s ease-in-out ${i * 0.6}s infinite`
            }}>
              <span style={{
                width: 30, height: 30, borderRadius: "50%", border: "1.5px solid var(--nz-red)", color: "var(--nz-red)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, flexShrink: 0
              }}>{r.letter}</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, flex: 1 }}>{r.name}</span>
              <Icon name="ArrowRight" size={15} style={{ color: "var(--nz-red)" }} />
            </Link>
          );
        })}
      </div>
      <div style={{ marginTop: 14, fontSize: 12, color: "var(--text-tertiary)", textAlign: "center" }}>
        + una ruta de expansión para clientes actuales
      </div>
    </div>
  );
}

export default function SolucionesHub() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Soluciones" }]}
        eyebrow="Soluciones por perfil"
        title={<>¿Dónde estás hoy? <span style={{ color: "var(--nz-red)" }}>Encuentra tu recorrido.</span></>}
        lead="No importa si apenas exploras el modelo, si ya tienes una empresa establecida que busca escalar, o si quieres profesionalizar la red de distribuidores con la que trabajas: elige tu situación y entra a un recorrido a tu medida que combina Plataforma, Academy y Consulting."
        actions={<>
          <Button size="lg" to={CTA_PATHS.contacto} placement="hero">{LABELS.diagnostico}</Button>
          <Button size="lg" variant="secondary" to={CTA_PATHS.demo} placement="hero">{LABELS.demo}</Button>
        </>}
        aside={<MapaRecorridos />}
      />

      <Section bg="page">
        <SectionHeading
          eyebrow="Por situación · ¿en qué punto estás?"
          title="Elige tu situación de entrada"
          lead="Cuatro recorridos, cada uno con su propia página y formulario dedicado. Selecciona el que te describe hoy."
        />
        <div className="grid-2" style={{ marginTop: 44 }}>
          {RECORRIDOS_ORDER.map((slug, i) => {
            const r = RECORRIDOS[slug];
            return (
              <Reveal key={slug} delay={(i % 2) * 100}>
                <Link to={`/soluciones/${slug}`} className="card card--hover" style={{ display: "flex", gap: 18, color: "inherit", height: "100%" }}>
                  <span style={{
                    width: 44, height: 44, borderRadius: "50%", background: "var(--nz-red)", color: "#fff",
                    display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, boxShadow: "var(--shadow-accent)"
                  }}>{r.letter}</span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700 }}>{r.name}</h3>
                      {r.isNew && <Badge tone="accent">Nuevo</Badge>}
                    </span>
                    <p style={{ marginTop: 7, fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{r.lead.split(". ")[0]}.</p>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--nz-red)" }}>
                      {slug === "empezar" ? "Empezar" : slug === "empresa-establecida" ? "Escalar" : slug === "red-de-distribuidores" ? "Profesionalizar" : "Modernizar"} <Icon name="ArrowRight" size={14} />
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
        <div className="grid-2" style={{ alignItems: "center", gap: 56 }}>
          <div>
            <SectionHeading
              eyebrow="¿Ya eres cliente de Netzen?"
              title="Expansión y actualización para clientes actuales"
              lead="Si ya operas con Netzen, esta es tu ruta para crecer: actualizar tu versión, activar módulos y extras, capacitar a tu red y revisar tu plan."
            />
            <Reveal delay={120} style={{ marginTop: 26, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Button to="/soluciones/cliente-actual">Ver ruta de expansión <Icon name="ArrowRight" size={15} /></Button>
              <Button variant="secondary" to="/contacto">Acceso y soporte</Button>
            </Reveal>
          </div>
          <Reveal variant="right">
            <Link to="/soluciones/cliente-actual" className="card card--hover" style={{ display: "flex", gap: 18, color: "inherit", borderColor: "var(--nz-red-tint-strong)", background: "var(--nz-red-wash)" }}>
              <span style={{
                width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--nz-red)", color: "var(--nz-red)",
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17
              }}>E</span>
              <span>
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>Cliente actual / expansión</h3>
                <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>
                  Customer success y expansión: actualización de versión, módulos y extras, capacitación continua y revisión de plan.
                </p>
              </span>
            </Link>
          </Reveal>
        </div>
      </Section>

      <Section bg="page">
        <SectionHeading
          eyebrow="Por modelo de negocio"
          title="Netzen no es solo multinivel: se adapta a tu modelo"
          lead="Seis modelos, seis recorridos. Cada uno con su propia landing para campañas y SEO."
        />
        <div className="grid-3" style={{ marginTop: 44 }}>
          {MODELOS_ORDER.map((slug, i) => {
            const m = MODELOS_NEGOCIO[slug];
            return (
              <Reveal key={slug} delay={(i % 3) * 90}>
                <Link to={`/soluciones/por-modelo?modelo=${slug}`} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12, color: "inherit", height: "100%" }}>
                  <span className="bubble"><Icon name={m.icon} size={21} /></span>
                  <h3 style={{ fontSize: 17, fontWeight: 700 }}>{m.name}</h3>
                  <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--text-secondary)" }}>{m.tagline}</p>
                  <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--nz-red)" }}>
                    Ver modelo <Icon name="ArrowRight" size={14} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section bg="wash" tight style={{ borderTop: "1px solid var(--nz-red-tint)", borderBottom: "1px solid var(--nz-red-tint)" }}>
        <SectionHeading align="center" eyebrow="Cómo funciona" title="Cómo funciona un recorrido" />
        <div className="grid-4" style={{ marginTop: 40 }}>
          {[
            ["CircleUser", "1 · Te identificas", "Eliges tu situación o tu modelo de negocio."],
            ["Search", "2 · Diagnóstico", "Alcance y necesidad real, sin precio aún."],
            ["Route", "3 · Recorrido", "Un plan que combina Plataforma, Academy y Consulting."],
            ["TrendingUp", "4 · Opera y crece", "Implementación, capacitación y soporte continuo."]
          ].map(([ic, t, d], i) => (
            <Reveal key={t} delay={i * 90} className="card" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <span className="bubble"><Icon name={ic} size={20} /></span>
              <h3 style={{ fontSize: 15.5, fontWeight: 700 }}>{t}</h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--text-secondary)" }}>{d}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <p style={{ textAlign: "center", marginTop: 26, fontSize: 13.5, color: "var(--text-tertiary)" }}>
            Cada recorrido combina núcleos: Consulting (diagnóstico y estrategia) → Plataforma (operación) → Academy (capacitación de la empresa y su red).
          </p>
        </Reveal>
      </Section>

      <CTABand
        title="¿Ya sabes en qué punto estás?"
        description="La conversación empieza por valor y alcance, no por precio."
        primaryLabel={LABELS.diagnostico}
        primaryTo="/contacto"
        secondaryLabel="Demo"
        secondaryTo="/contacto/demo"
      />
    </>
  );
}
