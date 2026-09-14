import React from "react";
import { Badge, Button, Icon, Reveal, Section, SectionHeading } from "../../components/ui.jsx";
import { CTABand, PageHero } from "../../components/chrome.jsx";
import identityImage from "../../assets/netzen-human-values-v2.jpg";
import { LABELS, CTA_PATHS } from "../../lib/copy.js";

const EXECUTIVE = {
  mission:
    "Transformamos empresas a través de tecnología, formación y consultoría estratégica, impulsando un modelo de empresa humana donde el desarrollo de las personas y el bien común son motores del crecimiento sostenible.",
  vision:
    "Ser referentes en crecimiento empresarial consciente en Latinoamérica, integrando innovación, desarrollo humano y ética empresarial para generar impacto económico y social."
};

const FULL = {
  mission: [
    "Promovemos un modelo de empresa humana, donde la dignidad de las personas, el desarrollo humano y el bien común son el centro de la estrategia empresarial. Impulsamos la transformación y expansión omnicanal de las empresas mediante tecnología, consultoría estratégica y formación especializada.",
    "Acompañamos a organizaciones de Venta Directa, Retail, e-Commerce y Franquicias a crecer de manera ética, inclusiva y sostenible, fortaleciendo el liderazgo, las capacidades y la conciencia de quienes las integran para generar impacto económico y social real."
  ],
  vision: [
    "Bajo un modelo de empresa humana, ser la plataforma referente en Latinoamérica para el crecimiento empresarial consciente, reconocida por integrar tecnología, conocimiento y desarrollo humano.",
    "Contribuir a la evolución de sus clientes y su expansión, formando empresarios y organizaciones que generen prosperidad, inclusión y mejores condiciones de vida, actuando como agentes de transformación económica y social en un entorno global."
  ]
};

const VALUES = [
  {
    icon: "ShieldCheck",
    title: "Integridad",
    evolution: "Evolución de Honestidad",
    body:
      "Actuamos con verdad, ética y coherencia entre lo que pensamos, decimos y hacemos. Construimos relaciones basadas en el respeto, la responsabilidad y el cumplimiento de los compromisos, entendiendo que el crecimiento empresarial solo es sostenible cuando honra la dignidad humana y el impacto positivo en nuestro entorno.",
    practice:
      "Comprometidos con la verdad, lo correcto, la ética y el desarrollo de nuestro entorno, con respeto, conciencia y foco en los resultados pactados."
  },
  {
    icon: "Users",
    title: "Desarrollo del talento humano",
    evolution: "Evolución de Talento",
    body:
      "Impulsamos el desarrollo integral de las personas mediante el conocimiento, la inteligencia, la creatividad y la conciencia. Creemos que el talento se forma, se acompaña y se expande cuando las personas crecen intelectual, profesional y humanamente."
  },
  {
    icon: "RefreshCw",
    title: "Evolución continua",
    evolution: "Evolución de Superación Continua",
    body:
      "Promovemos la mejora constante de nuestras capacidades, procesos, tecnología y modelos de negocio para anticiparnos al cambio y generar soluciones relevantes, éticas y sostenibles para nuestros clientes y la sociedad."
  },
  {
    icon: "BadgeCheck",
    title: "Confianza y excelencia",
    evolution: "Evolución de Confianza",
    body:
      "Construimos confianza a través de la excelencia operativa, la calidad de nuestros productos y servicios, y una experiencia consistente que genera valor real para nuestros clientes, aliados y colaboradores."
  },
  {
    icon: "HeartHandshake",
    title: "Actitud de servicio y colaboración",
    evolution: "Evolución de Actitud",
    body:
      "Actuamos con compromiso, respeto y vocación de servicio, fomentando el trabajo colaborativo y la corresponsabilidad. Creemos que los mejores resultados se logran cuando ponemos nuestras capacidades al servicio del bien común y del crecimiento colectivo."
  }
];

function IdentityCard({ icon, label, title, children }) {
  return (
    <article className="card identity-card">
      <div className="identity-card__head">
        <span className="bubble"><Icon name={icon} size={21} /></span>
        <div>
          <div className="eyebrow">{label}</div>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="identity-card__body">{children}</div>
    </article>
  );
}

export default function MVV() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Nosotros", to: "/nosotros" }, { label: "Misión, visión y valores" }]}
        eyebrow="Nosotros · Identidad"
        badge={<Badge tone="success">Textos oficiales recibidos</Badge>}
        title={<>Empresa humana, crecimiento <span style={{ color: "var(--nz-red)" }}>consciente</span></>}
        lead="La identidad de Netzen integra tecnología, conocimiento y desarrollo humano para generar crecimiento sostenible e impacto económico y social."
        actions={
          <>
            <Button size="lg" to={CTA_PATHS.contacto} placement="hero">{LABELS.diagnostico}</Button>
            <Button size="lg" variant="secondary" to="/nosotros/por-que-netzen">Por qué Netzen</Button>
          </>
        }
        aside={
          <figure className="identity-hero-media">
            <img src={identityImage} alt="Equipo latinoamericano colaborando en una sesión de trabajo" />
            <figcaption>Las personas y el bien común, en el centro de la estrategia.</figcaption>
          </figure>
        }
      />

      <Section bg="page">
        <SectionHeading
          eyebrow="Versión ejecutiva"
          title="La identidad en una lectura breve"
          lead="Esta versión comunica la identidad de Netzen en superficies de contacto rápido como Home, presentaciones y materiales comerciales."
        />
        <div className="grid-2" style={{ marginTop: 40, alignItems: "stretch" }}>
          <Reveal>
            <IdentityCard icon="Target" label="Misión ejecutiva" title="Lo que hacemos hoy">
              <p>{EXECUTIVE.mission}</p>
            </IdentityCard>
          </Reveal>
          <Reveal delay={90}>
            <IdentityCard icon="Eye" label="Visión ejecutiva" title="La referencia que queremos ser">
              <p>{EXECUTIVE.vision}</p>
            </IdentityCard>
          </Reveal>
        </div>
        <Reveal delay={130}>
          <div className="identity-note">
            <span>La misión y visión completas definen identidad.</span>
            <span>La versión ejecutiva comunica identidad.</span>
          </div>
        </Reveal>
      </Section>

      <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
        <SectionHeading
          eyebrow="Versión completa"
          title="La definición íntegra de nuestra identidad"
          lead="La versión completa conserva el alcance institucional y el propósito que guía la estrategia."
        />
        <div className="grid-2" style={{ marginTop: 40, alignItems: "stretch" }}>
          <Reveal>
            <IdentityCard icon="Target" label="Misión completa" title="Transformar con sentido humano">
              {FULL.mission.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </IdentityCard>
          </Reveal>
          <Reveal delay={90}>
            <IdentityCard icon="Eye" label="Visión completa" title="Ser plataforma de prosperidad consciente">
              {FULL.vision.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </IdentityCard>
          </Reveal>
        </div>
      </Section>

      <Section bg="page" style={{ borderTop: "1px solid var(--border-default)" }}>
        <SectionHeading
          eyebrow="Valores"
          title="Cinco principios que se convierten en conducta"
          lead="No son conceptos decorativos: orientan cómo diseñamos, acompañamos, cumplimos y crecemos junto con clientes, aliados y colaboradores."
        />
        <div className="values-grid" style={{ marginTop: 40 }}>
          {VALUES.map((value, index) => (
            <Reveal key={value.title} delay={(index % 3) * 80}>
              <article className="card value-card">
                <div className="value-card__top">
                  <span className="bubble"><Icon name={value.icon} size={21} /></span>
                  <span className="value-card__number">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="eyebrow">{value.evolution}</div>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
                {value.practice && <div className="value-card__practice"><b>En la práctica:</b> {value.practice}</div>}
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTABand
        title="Crecer de manera consciente también es una decisión operativa"
        description="Conoce cómo tecnología, formación y consultoría estratégica se convierten en un recorrido para tu organización."
        primaryLabel={LABELS.diagnostico}
        primaryTo="/contacto"
        secondaryLabel="Conoce el ecosistema"
        secondaryTo="/soluciones"
      />
    </>
  );
}

