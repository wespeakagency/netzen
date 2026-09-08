import React from "react";
import { Link } from "react-router-dom";
import { Section } from "../../components/ui.jsx";
import { CTABand, PageHero } from "../../components/chrome.jsx";
import { PRIVACY, TERMS, LAST_UPDATED } from "./content.js";

function scrollToSection(slug) {
  const el = document.getElementById(slug);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Block({ block }) {
  if (block.type === "p") return <p>{block.text}</p>;
  if (block.type === "ul") {
    return (
      <ul>
        {block.items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    );
  }
  if (block.type === "ol") {
    return (
      <ol>
        {block.items.map((it, i) => <li key={i}>{it}</li>)}
      </ol>
    );
  }
  if (block.type === "kv") {
    return (
      <dl className="legal-doc__kv">
        {block.items.map((it, i) => (
          <div key={i} className="legal-doc__kv-row">
            <dt>{it.k}</dt>
            <dd>{it.v}</dd>
          </div>
        ))}
      </dl>
    );
  }
  return null;
}

export default function Legal({ type = "privacy" }) {
  const isPrivacy = type === "privacy";
  const doc = isPrivacy ? PRIVACY : TERMS;
  const otherHref = isPrivacy ? "/legal/terminos" : "/legal/privacidad";
  const otherLabel = isPrivacy ? "Términos y condiciones" : "Aviso de privacidad";
  const eyebrow = isPrivacy ? "Legal · Privacidad" : "Legal · Términos";
  const shortTitle = isPrivacy ? "Aviso de privacidad" : "Términos y condiciones";

  return (
    <>
      <PageHero
        crumbs={[{ label: shortTitle }]}
        eyebrow={eyebrow}
        title={doc.title}
      />

      <Section bg="page">
        <div className="legal-doc">
          <aside className="legal-doc__toc" aria-label="Índice del documento">
            <div className="legal-doc__toc-title">Índice</div>
            <ol className="legal-doc__toc-list">
              {doc.sections.map((s, i) => (
                <li key={s.slug}>
                  <button type="button" onClick={() => scrollToSection(s.slug)}>
                    <span className="legal-doc__toc-num">{String(i + 1).padStart(2, "0")}</span>
                    <span>{s.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </aside>

          <article className="legal-doc__body">
            <p className="legal-doc__updated">Última actualización: {LAST_UPDATED}</p>
            <div className="legal-doc__intro">
              {doc.intro.map((p, i) => <p key={i}>{p}</p>)}
            </div>

            {doc.sections.map((s, i) => (
              <section key={s.slug} id={s.slug} className="legal-doc__section">
                <h2>
                  <span className="legal-doc__num">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                {s.blocks.map((b, j) => <Block key={j} block={b} />)}
              </section>
            ))}

            <div className="legal-doc__footnote">
              <p>
                Consulta también{" "}
                <Link to={otherHref}>{otherLabel}</Link>.
              </p>
            </div>
          </article>
        </div>
      </Section>

      <CTABand
        title="¿Necesitas hablar con el equipo?"
        description="Escríbenos para resolver dudas sobre el uso del sitio, servicios o tratamiento de una solicitud."
        primaryLabel="Ir a contacto"
        primaryTo="/contacto"
        secondaryLabel={`Ver ${otherLabel.toLowerCase()}`}
        secondaryTo={otherHref}
      />
    </>
  );
}
