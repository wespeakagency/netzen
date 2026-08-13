// /academy/:slug — plantilla de programa
import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Icon, Button, Section, SectionHeading, Reveal, Badge, CheckLine, Accordion, CountUp } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { PROGRAMAS } from "./data.js";
import academyLogo from "../../assets/netzen-academy.png";

function ProgramaAside({ p }) {
  return (
    <div className="card card--pad-lg" style={{ boxShadow: "var(--shadow-md)" }}>
      <img src={academyLogo} alt="Netzen Academy" style={{ height: 28, display: "block" }} />
      {p.stats ? (
        <div style={{ marginTop: 26, display: "grid", gap: 22 }}>
          {p.stats.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              {s.custom
                ? <span className="stat__value" style={{ fontSize: 38 }}>{s.custom}</span>
                : <span style={{ whiteSpace: "nowrap" }}><CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} /></span>}
              <span style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.4 }}>{s.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
          {p.paraQuien.map((q) => (
            <div key={q.title} style={{ display: "flex", gap: 12, alignItems: "center", border: "1px solid var(--border-default)", borderRadius: 12, padding: "11px 14px" }}>
              <span className="bubble bubble--sm"><Icon name={q.icon} size={15} /></span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5 }}>{q.title}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--border-default)", display: "flex", alignItems: "center", gap: 10 }}>
        <Badge tone={p.tone}>{p.modelo}</Badge>
      </div>
    </div>
  );
}

export default function AcademyPrograma() {
  const { slug } = useParams();
  const p = PROGRAMAS[slug];
  if (!p) return <Navigate to="/academy" replace />;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Academy", to: "/academy" }, { label: p.short }]}
        eyebrow={p.badge}
        badge={<Badge tone={p.tone}>{p.modelo}</Badge>}
        title={p.title}
        lead={p.lead}
        actions={<>
          <Button size="lg" to="/contacto">{p.cta.label}</Button>
          <Button size="lg" variant="secondary" to="/academy">Ver todos los programas</Button>
        </>}
        aside={<ProgramaAside p={p} />}
      />

      <Section bg="page">
        <SectionHeading eyebrow="Para quién es" title="Este programa está pensado para ti si…" lead={p.paraQuienNote} />
        <div className="grid-3" style={{ marginTop: 40 }}>
          {p.paraQuien.map((q, i) => (
            <Reveal key={q.title} delay={i * 90} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span className="bubble"><Icon name={q.icon} size={21} /></span>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>{q.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{q.desc}</p>
            </Reveal>
          ))}
        </div>
        {p.heroNote && (
          <Reveal delay={140}>
            <div style={{ marginTop: 26, display: "flex", gap: 14, alignItems: "flex-start", background: "var(--nz-blue-tint)", border: "1px solid var(--nz-blue-300)", borderRadius: 16, padding: "16px 20px" }}>
              <span className="bubble bubble--blue" style={{ width: 36, height: 36 }}><Icon name="Lightbulb" size={16} /></span>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--nz-blue)" }}><b>Importante:</b> {p.heroNote}</p>
            </div>
          </Reveal>
        )}
      </Section>

      {p.logras && (
        <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
          <div className="grid-2" style={{ gap: 56, alignItems: "start" }}>
            <div>
              <SectionHeading eyebrow={p.lograsTitle || "Qué logras"} title={p.lograsTitle === "Qué incluye y bajo qué condiciones" ? "Formación seria, con reglas claras" : p.lograsTitle === "Qué incluye" ? "Todo lo que recibe tu red" : "Al terminar, sabrás…"} />
              <Reveal delay={100} style={{ marginTop: 28, display: "grid", gap: 13 }}>
                {p.logras.map((x) => <CheckLine key={x}>{x}</CheckLine>)}
              </Reveal>
            </div>
            {p.temario ? (
              <Reveal variant="right">
                <div className="eyebrow" style={{ marginBottom: 14 }}>Temario</div>
                <Accordion items={p.temario} />
                <p style={{ marginTop: 14, fontSize: 12.5, color: "var(--text-tertiary)" }}>{p.temarioNote}</p>
              </Reveal>
            ) : (
              <Reveal variant="right">
                <div className="card card--pad-lg" style={{ background: "var(--surface-page)" }}>
                  <div className="eyebrow" style={{ marginBottom: 16 }}>Cómo se ve la formación</div>
                  <div style={{ display: "grid", gap: 12 }}>
                    {["Aula virtual de cohorte", "Material y ejercicios aplicados", "Tablero de avance por participante"].map((t, i) => (
                      <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--nz-white)", border: "1px solid var(--border-default)", borderRadius: 12, padding: "13px 16px" }}>
                        <span className="bubble bubble--sm"><Icon name={["Video", "NotebookPen", "BarChart3"][i]} size={15} /></span>
                        <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-display)" }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </Section>
      )}

      {p.catalogo && (
        <Section bg="card" style={{ borderTop: "1px solid var(--border-default)" }}>
          <SectionHeading eyebrow="Catálogo de talleres" title="Un taller por cada habilidad que quieras reforzar" lead={p.catalogoNote} />
          <div className="grid-3" style={{ marginTop: 40 }}>
            {p.catalogo.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 90} className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <span className="bubble"><Icon name={c.icon} size={21} /></span>
                <h3 style={{ fontSize: 16.5, fontWeight: 700 }}>{c.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{c.desc}</p>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {p.formato && (
        <Section bg="page">
          <SectionHeading eyebrow="Formato y duración" title="Cómo se cursa" />
          <div className="grid-3" style={{ marginTop: 36 }}>
            {p.formato.map((f, i) => (
              <Reveal key={f.title} delay={i * 90} className="card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span className="bubble" style={{ width: 42, height: 42 }}><Icon name={f.icon} size={19} /></span>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>{f.title}</h3>
                  <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <Section bg="wash" tight style={{ borderTop: "1px solid var(--nz-red-tint)", borderBottom: "1px solid var(--nz-red-tint)" }}>
        <SectionHeading eyebrow="El ecosistema" title="Conexión con el ecosistema" />
        <Reveal style={{ marginTop: 30 }}>
          <div className="card" style={{ borderColor: "var(--nz-red-tint-strong)", display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
            <span className="bubble"><Icon name={p.conexion.icon} size={21} /></span>
            <div style={{ flex: 1, minWidth: 260 }}>
              <p style={{ fontSize: 15, lineHeight: 1.65 }}>
                <b style={{ color: "var(--nz-red)" }}>{p.conexion.text[0]}</b>{p.conexion.text[1]}
              </p>
              <Link to={p.conexion.to} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>
                {p.conexion.linkLabel} <Icon name="ArrowRight" size={15} />
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section bg="page" tight>
        <SectionHeading eyebrow="Sigue explorando" title="Programas relacionados" />
        <div className="grid-3" style={{ marginTop: 32 }}>
          {p.related.map((r, i) => (
            <Reveal key={r.to} delay={i * 90}>
              <Link to={r.to} className="card card--hover" style={{ display: "flex", gap: 14, alignItems: "center", color: "inherit", height: "100%" }}>
                <span className="bubble" style={{ width: 42, height: 42 }}><Icon name={r.icon} size={19} /></span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{r.title}</span>
                  <span style={{ display: "block", marginTop: 3, fontSize: 12.5, color: "var(--text-tertiary)" }}>{r.desc}</span>
                </span>
                <Icon name="ArrowRight" size={17} style={{ color: "var(--nz-red)" }} />
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTABand title={p.cta.title} description={p.cta.desc} primaryLabel={p.cta.label} primaryTo="/contacto" secondaryLabel="Ver Academy" secondaryTo="/academy" />
    </>
  );
}
