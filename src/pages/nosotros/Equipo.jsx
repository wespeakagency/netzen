// /nosotros/equipo — liderazgo y áreas
import React from "react";
import { Icon, Button, Section, SectionHeading, Reveal } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { LABELS, CTA_PATHS } from "../../lib/copy.js";

const LIDERES = [
  { rol: "Dirección general", icon: "Compass", desc: "Trayectoria y especialidad por confirmar con dirección. Años de experiencia en el sector y rol en la visión de Netzen." },
  { rol: "Dirección de tecnología", icon: "Cpu", desc: "Trayectoria y especialidad por confirmar con dirección. Responsable de la arquitectura y evolución de la plataforma." },
  { rol: "Dirección de consultoría", icon: "Scale", desc: "Trayectoria y especialidad por confirmar con dirección. Liderazgo en planes de compensación y estrategia de industria." }
];

const AREAS = [
  { icon: "Blocks", title: "Desarrollo", desc: "Construye y evoluciona la plataforma." },
  { icon: "Compass", title: "Consultoría", desc: "Diseña planes y estrategia de negocio." },
  { icon: "LifeBuoy", title: "Implementación y soporte", desc: "Instala, acompaña y responde día a día." },
  { icon: "GraduationCap", title: "Academia", desc: "Forma empresarios y redes de distribuidores." }
];

export default function Equipo() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Nosotros", to: "/nosotros" }, { label: "Liderazgo y equipo" }]}
        eyebrow="Nosotros · Liderazgo y equipo"
        title={<>Las <span style={{ color: "var(--nz-red)" }}>personas</span> detrás de la plataforma</>}
        lead="La tecnología la hace la gente. Detrás de Netzen hay un equipo que combina décadas de experiencia técnica con un conocimiento profundo de la venta directa y el multinivel. Esa mezcla es nuestro mejor respaldo de autoridad."
        actions={<>
          <Button size="lg" to={CTA_PATHS.contacto} placement="hero">{LABELS.diagnostico}</Button>
          <Button size="lg" variant="secondary" to="/nosotros/historia">Nuestra historia</Button>
        </>}
      />

      <Section bg="page">
        <SectionHeading eyebrow="Liderazgo" title="Dirección con trayectoria en tecnología y en la industria" lead="Nombres, cargos y fotos se validan con dirección antes de publicar." />
        <div className="grid-3" style={{ marginTop: 44 }}>
          {LIDERES.map((l, i) => (
            <Reveal key={l.rol} delay={i * 90} className="card card--hover" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 108, height: 108, borderRadius: "50%",
                background: "linear-gradient(140deg, var(--nz-blue-tint), var(--nz-red-tint))",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "3px solid var(--nz-white)", boxShadow: "var(--shadow-sm)"
              }}>
                <Icon name="CircleUser" size={44} style={{ color: "var(--nz-blue-500)" }} />
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>Nombre del líder</h3>
                <div style={{ marginTop: 4, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--nz-red)" }}>{l.rol}</div>
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text-secondary)" }}>{l.desc}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
        <SectionHeading eyebrow="El equipo" title="Áreas que acompañan al cliente de principio a fin" />
        <div className="grid-4" style={{ marginTop: 40 }}>
          {AREAS.map((a, i) => (
            <Reveal key={a.title} delay={i * 80} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span className="bubble"><Icon name={a.icon} size={20} /></span>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>{a.title}</h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--text-secondary)" }}>{a.desc}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTABand
        title="Conoce al equipo en una sesión"
        description="La gente de Netzen se presenta mejor en una conversación. Agenda tu diagnóstico."
        primaryLabel={LABELS.diagnostico}
        primaryTo="/contacto"
        secondaryLabel="Nuestra historia"
        secondaryTo="/nosotros/historia"
      />
    </>
  );
}
