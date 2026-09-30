// /plataforma/:slug — plantilla de detalle de módulo
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { Button, Section, SectionHeading, Reveal, CheckLine, Steps } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { MODULOS } from "./data.js";
import { ModuleMock, getAlternateModuleMock } from "./components/ModuleMock.jsx";
import { EcosystemConnectionCard, RelatedModuleCard } from "./components/PlatformModuleCards.jsx";
import { ProblemCard, CatalogItemCard } from "./components/PlatformDetailCards.jsx";
import { LABELS, CTA_PATHS } from "../../lib/copy.js";

export default function PlataformaModulo() {
  const { slug } = useParams();
  const m = MODULOS[slug];
  if (!m) return <Navigate to="/plataforma" replace />;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Plataforma", to: "/plataforma" }, { label: m.short }]}
        eyebrow={m.badge}
        title={m.title}
        lead={m.lead}
        actions={<>
          <Button size="lg" to={CTA_PATHS.demo} placement="hero">{LABELS.demo}</Button>
          <Button size="lg" variant="secondary" to={CTA_PATHS.contacto} placement="hero">{LABELS.diagnostico}</Button>
        </>}
        aside={<ModuleMock module={m} />}
      />

      <Section bg="page">
        <SectionHeading eyebrow="Qué resuelve" title="Tres problemas que este módulo elimina" />
        <div className="grid-3" style={{ marginTop: 40 }}>
          {m.resuelve.map((r, i) => (
            <Reveal key={r.title} delay={i * 90}>
              <ProblemCard problem={r} />
            </Reveal>
          ))}
        </div>
      </Section>

      {m.ciclo && (
        <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
          <SectionHeading eyebrow="El ciclo de instalación" title="Del contrato a la operación, acompañado" lead="Un proceso ordenado, no un evento de un día. Las etapas se afinan con el equipo de Netzen." />
          <div className="grid-2" style={{ marginTop: 40, alignItems: "start" }}>
            <Reveal><Steps items={m.ciclo.slice(0, 3)} /></Reveal>
            <Reveal delay={120}><Steps items={m.ciclo.slice(3)} /></Reveal>
          </div>
        </Section>
      )}

      {m.catalogo && (
        <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
          <SectionHeading eyebrow="Catálogo" title="Qué incluye este catálogo de extras" lead="Cada complemento se contrata según lo que tu operación necesita; su etiqueta indica cómo se ofrece." />
          <div className="grid-2" style={{ marginTop: 40 }}>
            {m.catalogo.map((c, i) => (
              <Reveal key={c.name} delay={(i % 2) * 90}>
                <CatalogItemCard item={c} />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {m.incluye.length > 0 && (
        <Section bg={m.ciclo ? "page" : "card"} style={{ borderTop: "1px solid var(--border-default)" }}>
          <div className="grid-2" style={{ alignItems: "center", gap: 56 }}>
            <div>
              <SectionHeading eyebrow="Alcance" title="Qué incluye este módulo" />
              <Reveal delay={100} style={{ marginTop: 28, display: "grid", gap: 13 }}>
                {m.incluye.map((x) => <CheckLine key={x}>{x}</CheckLine>)}
              </Reveal>
            </div>
            <Reveal variant="right">
              <ModuleMock module={getAlternateModuleMock(m)} />
            </Reveal>
          </div>
        </Section>
      )}

      <Section bg="wash" tight style={{ borderTop: "1px solid var(--nz-red-tint)", borderBottom: "1px solid var(--nz-red-tint)" }}>
        <SectionHeading eyebrow="El ecosistema" title="Conexión con el ecosistema" />
        <div style={{ marginTop: 30, display: "grid", gap: 16 }}>
          <EcosystemConnectionCard connection={m.conexion} />
          {m.conexion2 && <EcosystemConnectionCard connection={m.conexion2} />}
        </div>
      </Section>

      <Section bg="page" tight>
        <SectionHeading eyebrow="Sigue explorando" title="Módulos relacionados" />
        <div className="grid-3" style={{ marginTop: 32 }}>
          {m.related.map((slug2, i) => {
            const r = MODULOS[slug2];
            return (
              <Reveal key={slug2} delay={i * 90}>
                <RelatedModuleCard module={r} to={`/plataforma/${slug2}`} />
              </Reveal>
            );
          })}
        </div>
      </Section>

      <CTABand
        title={m.ctaTitle}
        description="Demo para prospectos calificados: teaser público + acceso restringido, guiado por un consultor."
        primaryLabel="Solicitar demo"
        primaryTo="/contacto/demo"
        secondaryLabel={LABELS.diagnostico}
        secondaryTo="/contacto"
      />
    </>
  );
}
