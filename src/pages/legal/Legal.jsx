import React from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Icon, Reveal, Section, SectionHeading } from "../../components/ui.jsx";
import { CTABand, PageHero } from "../../components/chrome.jsx";

const PRIVACY_SECTIONS = [
  {
    title: "Datos que puede solicitar el sitio",
    body: "Nombre, cargo, empresa, país, correo, teléfono o WhatsApp, modelo de negocio y la información que decidas compartir sobre tu operación."
  },
  {
    title: "Finalidades",
    body: "Responder solicitudes, preparar diagnósticos o demostraciones, dar seguimiento comercial, entregar recursos solicitados y medir qué contenidos o canales ayudan a resolver mejor cada necesidad."
  },
  {
    title: "Medición sin datos sensibles",
    body: "La versión web registra vistas de página y acciones como clics en llamados a la acción, WhatsApp y formularios. Estos eventos no deben incluir el contenido escrito por la persona ni datos personales directos."
  },
  {
    title: "Consentimiento y derechos",
    body: "Cada formulario requiere aceptación antes de continuar. El mecanismo definitivo para ejercer derechos de acceso, rectificación, cancelación u oposición deberá completarse con el canal que valide el equipo legal de Netzen."
  }
];

const TERMS_SECTIONS = [
  {
    title: "Uso informativo",
    body: "El sitio explica el ecosistema Netzen y permite solicitar contacto. El contenido no constituye por sí mismo una oferta, cotización, compromiso de servicio ni asesoría legal, fiscal o financiera."
  },
  {
    title: "Propiedad intelectual",
    body: "Marcas, textos, interfaces, metodologías y materiales pertenecen a sus titulares. No se autoriza su reproducción o explotación fuera de los usos expresamente permitidos."
  },
  {
    title: "Servicios y alcance",
    body: "Las funcionalidades, implementaciones, tiempos, integraciones y condiciones comerciales se definen mediante diagnóstico, propuesta y contrato. La plataforma opera mediante contrato de uso de licencia en modalidad de renta; no implica la venta de la licencia."
  },
  {
    title: "Aprobación legal pendiente",
    body: "Jurisdicción, domicilio, canal de notificaciones, política de cookies y redacción contractual definitiva deben ser revisados y aprobados por el equipo legal de Netzen antes de publicar esta versión."
  }
];

export default function Legal({ type = "privacy" }) {
  const isPrivacy = type === "privacy";
  const title = isPrivacy ? "Aviso de privacidad" : "Términos y condiciones";
  const sections = isPrivacy ? PRIVACY_SECTIONS : TERMS_SECTIONS;

  return (
    <>
      <PageHero
        crumbs={[{ label: title }]}
        eyebrow="Legal · Versión para revisión"
        badge={<Badge tone="warning">Pendiente de aprobación legal</Badge>}
        title={<>{title}: una base clara antes de la publicación</>}
        lead="Esta página integra los mínimos funcionales solicitados en el checkpoint. Es un borrador de producto y no sustituye la versión que debe validar el equipo legal de Netzen."
        actions={
          <Button size="lg" variant="secondary" to="/contacto">
            Contactar a Netzen
          </Button>
        }
      />

      <Section bg="page">
        <SectionHeading
          eyebrow={isPrivacy ? "Tratamiento de datos" : "Condiciones de uso"}
          title={isPrivacy ? "Qué debe saber una persona antes de enviar sus datos" : "Reglas básicas para usar este sitio"}
          lead="La redacción evita promesas no validadas y deja identificados los apartados que aún requieren información corporativa y revisión jurídica."
        />
        <div className="grid-2" style={{ marginTop: 40 }}>
          {sections.map((section, index) => (
            <Reveal key={section.title} delay={(index % 2) * 80}>
              <article className="card" style={{ height: "100%", display: "flex", gap: 16 }}>
                <span className="bubble">
                  <Icon name={isPrivacy ? "ShieldCheck" : "FileText"} size={20} />
                </span>
                <div>
                  <div className="eyebrow">{String(index + 1).padStart(2, "0")}</div>
                  <h2 style={{ marginTop: 7, fontSize: 18, fontWeight: 700 }}>{section.title}</h2>
                  <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.7, color: "var(--text-secondary)" }}>
                    {section.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <div className="legal-review-note">
            <Icon name="Flag" size={20} />
            <p>
              Antes de publicar: completar responsable legal, domicilio, correo de privacidad, jurisdicción,
              transferencias, conservación, cookies y procedimiento de derechos. Consulta también{" "}
              <Link to={isPrivacy ? "/legal/terminos" : "/legal/privacidad"}>
                {isPrivacy ? "Términos y condiciones" : "Aviso de privacidad"}
              </Link>.
            </p>
          </div>
        </Reveal>
      </Section>

      <CTABand
        title="¿Necesitas hablar con el equipo?"
        description="Escríbenos para resolver dudas sobre el uso del sitio o el tratamiento de una solicitud."
        primaryLabel="Ir a contacto"
        primaryTo="/contacto"
        secondaryLabel={isPrivacy ? "Ver términos" : "Ver privacidad"}
        secondaryTo={isPrivacy ? "/legal/terminos" : "/legal/privacidad"}
      />
    </>
  );
}

