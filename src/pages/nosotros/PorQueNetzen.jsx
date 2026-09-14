// /nosotros/por-que-netzen — diferenciadores + certificaciones
import React from "react";
import { Link } from "react-router-dom";
import { Icon, Button, Section, SectionHeading, Reveal, Badge } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { LABELS, CTA_PATHS } from "../../lib/copy.js";

const RAZONES = [
  { icon: "Blocks", title: "Ecosistema integral", desc: "Plataforma, consultoría y formación en un mismo lugar. No tienes que coordinar a tres proveedores distintos: la solución es de principio a fin." },
  { icon: "HeartHandshake", title: "Contrato de uso acompañado", desc: "La plataforma se habilita mediante contrato de uso de licencia en modalidad de renta. Cada implementación incluye consultoría tecnológica para estructurar correctamente el plan y la operación.", link: { label: "Ver Consultoría", to: "/consulting/tecnologia" } },
  { icon: "Globe", title: "Omnicanalidad real", desc: "Integra canales y mercados —venta directa, retail, e-commerce, punto de venta y otros— en una sola operación conectada, no en sistemas sueltos que no se hablan entre sí." },
  { icon: "Map", title: "Multipaís", desc: "Operación pensada para más de un país: monedas, impuestos, idiomas y reglas locales dentro de la misma plataforma, lista para escalar la expansión." },
  { icon: "Users", title: "Trato humano", desc: "Un ejecutivo de cuenta y un equipo que responde. Construimos relaciones de largo plazo, no tickets anónimos." },
  { icon: "Compass", title: "Criterio de industria", desc: "Décadas dentro de la venta directa y el multinivel nos dan criterio sobre planes de compensación, genealogías y operación real, no solo sobre software." }
];

export default function PorQueNetzen() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Nosotros", to: "/nosotros" }, { label: "Por qué Netzen" }]}
        eyebrow="Nosotros · Por qué Netzen"
        title={<>Lo que nos hace <span style={{ color: "var(--nz-red)" }}>distintos</span> de cualquier proveedor de software</>}
        lead="Netzen no vende la licencia: habilita la plataforma mediante un contrato de uso en modalidad de renta y acompaña la implementación. El ecosistema integra tecnología, consultoría y formación con experiencia real en venta directa, retail, e-commerce, franquicias y multinivel."
        actions={<>
          <Button size="lg" to={CTA_PATHS.contacto} placement="hero">{LABELS.diagnostico}</Button>
          <Button size="lg" variant="secondary" to="/nosotros/historia">Nuestra historia</Button>
        </>}
      />

      <Section bg="page">
        <SectionHeading eyebrow="Diferenciadores" title="Seis razones para elegir Netzen" lead="El argumento de autoridad de cara a Soluciones: por qué confiar la operación a Netzen y no a un proveedor genérico." />
        <div className="grid-3" style={{ marginTop: 44 }}>
          {RAZONES.map((r, i) => (
            <Reveal key={r.title} delay={(i % 3) * 90}>
              <div className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="bubble"><Icon name={r.icon} size={21} /></span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 12, color: "var(--nz-gray-400)" }}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>{r.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{r.desc}</p>
                {r.link && (
                  <Link to={r.link.to} style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5 }}>
                    {r.link.label} <Icon name="ArrowRight" size={14} />
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
        <SectionHeading
          eyebrow="Calidad y estándares"
          title="Certificaciones"
          lead="Respaldamos el desarrollo con estándares de calidad reconocidos en la industria del software. Cada sello se publica solo con vigencia y alcance confirmados."
        />
        <div className="grid-3" style={{ marginTop: 40 }}>
          {[
            { name: "Moprosoft", desc: "Modelo de procesos para la industria de software. Pendiente de confirmar nivel y vigencia." },
            { name: "Estándar por confirmar", desc: "Espacio reservado para otra certificación o estándar de calidad / seguridad, sujeto a validación." },
            { name: "Estándar por confirmar", desc: "Espacio reservado para certificación adicional (calidad, seguridad de la información u operación)." }
          ].map((c, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 12, borderStyle: i === 0 ? "solid" : "dashed" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="bubble" style={{ background: i === 0 ? "var(--nz-red-tint)" : "var(--nz-chalk-2)", color: i === 0 ? "var(--nz-red)" : "var(--nz-gray-400)" }}>
                    <Icon name="Award" size={20} />
                  </span>
                  <Badge tone="warning">Por verificar</Badge>
                </div>
                <h3 style={{ fontSize: 16.5, fontWeight: 700, color: i === 0 ? "var(--text-heading)" : "var(--text-tertiary)" }}>{c.name}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text-secondary)" }}>{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTABand
        title="Compruébalo en una conversación"
        description="Te mostramos cómo el ecosistema completo resuelve tu operación. Agenda tu diagnóstico."
        primaryLabel={LABELS.diagnostico}
        primaryTo="/contacto"
        secondaryLabel="Ver soluciones"
        secondaryTo="/soluciones"
      />
    </>
  );
}
