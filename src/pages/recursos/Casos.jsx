// /recursos/casos — casos de éxito y testimonios (con guardrail de permisos)
import React, { useState } from "react";
import { Icon, Button, Section, SectionHeading, Reveal, TagChip, Badge, Stat } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { CASOS } from "./data.js";
import { LABELS } from "../../lib/copy.js";

const FILTROS = ["Todos", "Venta directa", "Multinivel", "Retail", "Franquicias", "E-commerce"];

export default function Casos() {
  const [f, setF] = useState("Todos");
  const list = f === "Todos" ? CASOS : CASOS.filter((c) => c.modelo === f);
  return (
    <>
      <PageHero
        crumbs={[{ label: "Recursos", to: "/recursos" }, { label: "Casos de éxito" }]}
        eyebrow="Recursos · Casos de éxito"
        title={<>Relaciones de <span style={{ color: "var(--nz-red)" }}>10 a 15 años</span> como evidencia de resultados</>}
        lead="Empresas de venta directa y multinivel que operan con Netzen para escalar y profesionalizar su operación."
        aside={
          <div className="card card--pad-lg" style={{ boxShadow: "var(--shadow-md)" }}>
            <div className="eyebrow" style={{ marginBottom: 20 }}>La prueba está en la permanencia</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <Stat value={15} suffix=" años" label="la relación más larga con un cliente" />
              <Stat value={30} prefix="+" label="años operando en la industria" />
              <Stat value={6} label="modelos de negocio atendidos" />
              <Stat value={3} label="núcleos en cada caso de éxito" />
            </div>
          </div>
        }
      />

      <Section bg="page">
        <SectionHeading eyebrow="Casos destacados" title="Explora por modelo de negocio" />
        <div style={{ marginTop: 26, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {FILTROS.map((x) => <TagChip key={x} active={f === x} onClick={() => setF(x)}>{x}</TagChip>)}
        </div>
        <div key={f} className="grid-3 anim-fade-up" style={{ marginTop: 34 }}>
          {(list.length ? list : CASOS).map((c, i) => (
            <div key={c.title} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
              <div style={{
                aspectRatio: "16/7", borderRadius: 12, background: "var(--nz-chalk-2)", border: "1.5px dashed var(--nz-gray-300)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: "var(--text-tertiary)", fontSize: 12
              }}>
                <Icon name={c.icon} size={22} style={{ color: "var(--nz-gray-400)" }} />
                Identidad del cliente · pendiente de permiso
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge tone="info">{c.modelo}</Badge>
                <Badge tone="success">{c.years}</Badge>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.35 }}>{c.title}</h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text-secondary)" }}>{c.desc}</p>
              <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--nz-red)" }}>
                Leer caso <Icon name="ArrowRight" size={14} />
              </span>
            </div>
          ))}
        </div>
        {list.length === 0 && (
          <p style={{ marginTop: 18, fontSize: 13.5, color: "var(--text-tertiary)" }}>
            Aún no hay casos publicados de {f}; mostramos los destacados. Cada caso requiere permiso explícito del cliente.
          </p>
        )}
      </Section>

      <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
        <SectionHeading eyebrow="Testimonios" title="Lo que dicen quienes operan con Netzen" lead="Los testimonios se publican únicamente con consentimiento documentado del cliente." />
        <div className="grid-2" style={{ marginTop: 40 }}>
          {[0, 1].map((i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="card" style={{ height: "100%" }}>
                <Icon name="Quote" size={28} style={{ color: "var(--nz-red-tint-strong)" }} />
                <p style={{ marginTop: 12, fontSize: 15.5, lineHeight: 1.7, color: "var(--text-secondary)", fontStyle: "italic" }}>
                  «Testimonio en proceso de autorización: cada frase, nombre y cifra se publica solo con permiso por escrito del cliente.»
                </p>
                <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="bubble" style={{ width: 44, height: 44 }}><Icon name="CircleUser" size={20} /></span>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14.5 }}>Nombre del directivo</div>
                    <div style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>Cargo · Empresa (pendiente de permiso)</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTABand
        title="¿Quieres ser el próximo caso de éxito?"
        description="Agenda un diagnóstico y descubre tu recorrido recomendado."
        primaryLabel={LABELS.diagnostico}
        primaryTo="/contacto"
        secondaryLabel="Ver soluciones"
        secondaryTo="/soluciones"
      />
    </>
  );
}
