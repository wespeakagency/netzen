// /nosotros/eventos — ediciones 2017–2018 y reactivación 2027
import React from "react";
import { Link } from "react-router-dom";
import { Icon, Button, Section, SectionHeading, Reveal, Badge } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";

export default function Eventos() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Nosotros", to: "/nosotros" }, { label: "Eventos de industria" }]}
        eyebrow="Nosotros · Eventos de industria"
        title={<>Encuentros que <span style={{ color: "var(--nz-red)" }}>reunieron a la industria</span></>}
        lead="Entre 2017 y 2018 organizamos eventos que juntaron a empresas, líderes y especialistas de la venta directa y el multinivel para compartir tendencias y prácticas correctas. Hoy trabajamos para reactivarlos con patrocinadores hacia 2027."
        actions={<>
          <Button size="lg" to="/contacto">Quiero participar o patrocinar</Button>
          <Button size="lg" variant="secondary" to="/recursos/webinars">Ver webinars</Button>
        </>}
      />

      <Section bg="page">
        <SectionHeading eyebrow="Ediciones 2017–2018" title="Una selección de los encuentros que organizamos" lead="Cifras de asistencia, ponentes y patrocinadores se publican solo con validación y autorización." />
        <div className="grid-2" style={{ marginTop: 40 }}>
          {[
            { year: "2017", desc: "Empresas y líderes reunidos en torno a las tendencias tecnológicas de la venta directa." },
            { year: "2018", desc: "Segunda edición con foco en profesionalización y prácticas correctas del modelo." }
          ].map((e, i) => (
            <Reveal key={e.year} delay={i * 100}>
              <div className="card card--hover" style={{ padding: 0, overflow: "hidden", height: "100%" }}>
                <div style={{
                  aspectRatio: "16/7", background: "linear-gradient(140deg, var(--nz-blue), var(--nz-blue-600))",
                  display: "flex", alignItems: "center", justifyContent: "center", position: "relative"
                }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 54, color: "rgba(245,245,245,0.16)", letterSpacing: "0.06em" }}>{e.year}</span>
                  <span className="badge badge--accent" style={{ position: "absolute", top: 14, left: 14 }}>Edición {e.year}</span>
                </div>
                <div style={{ padding: "22px 24px" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>Encuentro de industria · {e.year}</h3>
                  <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{e.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
        <SectionHeading
          eyebrow="Hacia 2027 · Reactivación"
          title="Queremos volver a reunir a la industria"
          lead="Buscamos patrocinadores y aliados para una nueva edición. La reactivación 2027 es una intención en convocatoria — sin sede ni programa definitivo aún."
        />
        <div className="grid-3" style={{ marginTop: 40 }}>
          {[
            { icon: "Building2", title: "Para empresas", desc: "Un espacio para conocer tendencias, herramientas y aliados de la venta directa y el multinivel." },
            { icon: "Star", title: "Para patrocinadores", desc: "Visibilidad ante un público calificado de líderes y empresas del sector. Propuesta de patrocinio en preparación." },
            { icon: "Globe", title: "Para la industria", desc: "Promover prácticas correctas y la profesionalización del modelo en la región." }
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 90} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span className="bubble"><Icon name={c.icon} size={21} /></span>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>{c.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{c.desc}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={140}>
          <div style={{ marginTop: 30, display: "flex", gap: 14, alignItems: "flex-start", background: "var(--nz-red-wash)", border: "1px solid var(--nz-red-tint-strong)", borderRadius: 16, padding: "18px 22px" }}>
            <span className="bubble" style={{ width: 38, height: 38 }}><Icon name="Video" size={17} /></span>
            <p style={{ fontSize: 14, lineHeight: 1.65 }}>
              <b style={{ color: "var(--nz-red)" }}>Mientras se reactiva el evento presencial, el contenido vive en línea:</b>{" "}
              webinars y grabaciones que reutilizan demos y academia, vinculados al evento de industria 2027.{" "}
              <Link to="/recursos/webinars" style={{ fontWeight: 700 }}>Ver Webinars →</Link>
            </p>
          </div>
        </Reveal>
      </Section>

      <CTABand
        title="¿Te interesa patrocinar o participar?"
        description="Conversemos sobre la próxima edición y cómo sumarte. Agenda una llamada."
        primaryLabel="Agenda una llamada"
        primaryTo="/contacto"
        secondaryLabel="Ver webinars"
        secondaryTo="/recursos/webinars"
      />
    </>
  );
}
