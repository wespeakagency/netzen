// /academy — hub del núcleo de educación
import React from "react";
import { Link } from "react-router-dom";
import { Icon, Button, Section, SectionHeading, Reveal, Badge, Stat } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { PROGRAMAS, PROGRAMAS_ORDER } from "./data.js";
import academyLogo from "../../assets/netzen-academy.png";

function AulaVisual() {
  return (
    <div className="card card--pad-lg" style={{ boxShadow: "var(--shadow-md)", position: "relative", overflow: "hidden" }}>
      <img src={academyLogo} alt="Netzen Academy" style={{ height: 34, display: "block" }} />
      <div style={{ marginTop: 22, display: "grid", gap: 12 }}>
        {[
          ["Award", "Alta Dirección", "Empresarios e inversionistas", "accent"],
          ["Users", "Distribuidor Independiente", "88 h · cohortes de 100–200", "info"],
          ["Presentation", "Talleres", "Formación puntual por tema", "success"]
        ].map(([ic, t, d, tone], i) => (
          <div key={t} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "13px 16px",
            border: "1px solid var(--border-default)", borderRadius: 14, background: "var(--nz-white)",
            animation: `nzFloat 6s ease-in-out ${i * 0.8}s infinite`
          }}>
            <span className="bubble" style={{ width: 40, height: 40 }}><Icon name={ic} size={18} /></span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>{t}</div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{d}</div>
            </div>
            <Badge tone={tone}>{i === 0 ? "B2C" : i === 1 ? "B2B" : "Flexible"}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AcademyHub() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Academy" }]}
        eyebrow="Núcleo 02 · Educación"
        title={<>Forma empresarios y <span style={{ color: "var(--nz-red)" }}>profesionaliza redes</span> de distribuidores</>}
        lead="El brazo formativo de Netzen: dos diplomados con públicos, currículo y economía diferentes, más talleres puntuales. De la dirección de la empresa a la fuerza comercial que la opera."
        actions={<>
          <Button size="lg" to="/contacto">Solicita información / inscripción</Button>
          <Button size="lg" variant="secondary" to="/consulting">Conoce Consulting</Button>
        </>}
        aside={<AulaVisual />}
      />

      <Section bg="page">
        <SectionHeading
          eyebrow="Nivel 2 · Programas"
          title="Programas de Academy"
          lead="Dos diplomados distintos —no son niveles del mismo programa—, más talleres y una modalidad multimarcas. Cada programa tiene su propia página de detalle."
        />
        <div className="grid-2" style={{ marginTop: 44 }}>
          {PROGRAMAS_ORDER.map((slug, i) => {
            const p = PROGRAMAS[slug];
            return (
              <Reveal key={slug} delay={(i % 2) * 100}>
                <Link to={`/academy/${slug}`} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 14, height: "100%", color: "inherit" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <span className="bubble"><Icon name={p.icon} size={21} /></span>
                    <Badge tone={p.tone}>{p.modelo}</Badge>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.25 }}>{p.name}</h3>
                    <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{p.lead.split(". ")[0]}.</p>
                  </div>
                  <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--nz-red)" }}>
                    Ver programa <Icon name="ArrowRight" size={14} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={120}>
          <div style={{ marginTop: 26, display: "flex", gap: 14, alignItems: "flex-start", background: "var(--nz-blue-tint)", border: "1px solid var(--nz-blue-300)", borderRadius: 16, padding: "18px 22px" }}>
            <span className="bubble bubble--blue" style={{ width: 38, height: 38 }}><Icon name="Lightbulb" size={17} /></span>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--nz-blue)" }}>
              <b>Dos embudos separados:</b> Alta Dirección es individual (B2C) y Distribuidor Independiente es un contrato de empresa (B2B).
              Públicos, currículo y modelo económico se gestionan por separado.
            </p>
          </div>
        </Reveal>
      </Section>

      <section className="bg-dark" style={{ position: "relative", overflow: "hidden" }}>
        <Section bg="dark" style={{ background: "transparent" }}>
          <div className="grid-2" style={{ alignItems: "center", gap: 56 }}>
            <SectionHeading
              on="dark"
              eyebrow="Experiencia que enseña"
              title="Formación con 30 años de industria detrás"
              lead="Los programas no salen de un manual genérico: nacen de operar venta directa y multinivel desde 1996 — lo que funciona, lo que falla y cómo se corrige."
            />
            <Reveal delay={140} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
              <Stat value={88} suffix=" h" label="del diplomado para la red de distribuidores" dark />
              <Stat value={200} prefix="hasta " label="participantes por cohorte B2B" dark />
              <Stat value={11} suffix=" sem" label="del programa de Alta Dirección" dark />
              <Stat value={6} label="talleres temáticos en catálogo" dark />
            </Reveal>
          </div>
        </Section>
      </section>

      <Section bg="wash" tight style={{ borderTop: "1px solid var(--nz-red-tint)", borderBottom: "1px solid var(--nz-red-tint)" }}>
        <SectionHeading eyebrow="El ecosistema" title="Cómo se conecta con los otros núcleos" />
        <div className="grid-2" style={{ marginTop: 32 }}>
          {[
            { icon: "Compass", text: <><b>Academy → Consulting</b>: del aula a la estrategia. Lo aprendido en los diplomados se aterriza con acompañamiento experto para estructurar y operar el modelo.</>, to: "/consulting", label: "Ver Consulting" },
            { icon: "MonitorSmartphone", text: <><b>Plataforma · Oficina Virtual → Academy · Distribuidor Independiente</b>: la red que opera la Oficina Virtual se profesionaliza en este diplomado.</>, to: "/academy/distribuidor-independiente", label: "Ver diplomado DI" }
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
        title="Solicita información / inscripción"
        description="Te orientamos sobre qué programa corresponde según tu rol: dirección de empresa o red de distribuidores."
        primaryLabel="Solicita información"
        primaryTo="/contacto"
        secondaryLabel="Ver Consulting"
        secondaryTo="/consulting"
      />
    </>
  );
}
