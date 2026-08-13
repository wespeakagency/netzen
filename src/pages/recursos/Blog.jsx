// /recursos/blog — listado con filtros por categoría
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Button, Section, SectionHeading, Reveal, TagChip, Container } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { ARTICULOS, CATEGORIAS } from "./data.js";
import { Newsletter } from "./Hub.jsx";

function ArticleCard({ a, i }) {
  return (
    <Reveal delay={(i % 3) * 80} style={{ height: "100%" }}>
      <Link to="/recursos/blog/articulo" className="card card--hover" style={{ display: "flex", flexDirection: "column", gap: 0, color: "inherit", height: "100%", padding: 0, overflow: "hidden" }}>
        <div style={{
          aspectRatio: "16/8", background: "linear-gradient(145deg, var(--nz-red-wash) 0%, var(--nz-red-tint) 66%, var(--nz-blue-tint) 100%)",
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative"
        }}>
          <span className="blog-card__accent" aria-hidden />
          <span className="bubble bubble--lg" style={{ background: "rgba(255,255,255,0.85)" }}><Icon name={a.icon} size={26} /></span>
          <span className="badge badge--accent" style={{ position: "absolute", top: 14, left: 14 }}>{a.cat}</span>
        </div>
        <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.35 }}>{a.title}</h3>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text-secondary)" }}>{a.desc}</p>
          <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--nz-red)" }}>
            Leer artículo <Icon name="ArrowRight" size={14} />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export default function Blog() {
  const [cat, setCat] = useState("Todas");
  const list = cat === "Todas" ? ARTICULOS : ARTICULOS.filter((a) => a.cat === cat);
  return (
    <>
      <PageHero
        crumbs={[{ label: "Recursos", to: "/recursos" }, { label: "Blog" }]}
        eyebrow="Recursos · Blog"
        title={<>Ideas para <span style={{ color: "var(--nz-red)" }}>escalar y profesionalizar</span> la venta directa</>}
        lead="Análisis, guías prácticas y tendencias para venta directa, retail, e-commerce, franquicias y multinivel. Filtra por categoría para encontrar lo que necesitas."
      />

      <Section bg="page">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13.5, color: "var(--text-tertiary)", marginRight: 4 }}>
            <Icon name="Filter" size={14} style={{ verticalAlign: -2 }} /> Filtra:
          </span>
          {CATEGORIAS.map((c) => (
            <TagChip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</TagChip>
          ))}
        </div>
        <div key={cat} className="grid-3 anim-fade-up" style={{ marginTop: 34 }}>
          {list.map((a, i) => <ArticleCard a={a} i={i} key={a.title} />)}
        </div>
        <div style={{ marginTop: 34, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13.5, color: "var(--text-tertiary)" }}>Mostrando {list.length} de 48 artículos</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Button variant="ghost" size="sm"><Icon name="ArrowLeft" size={14} /> Anteriores</Button>
            {["1", "2", "3", "…", "8"].map((n, i) => (
              <button key={i} className={`pill ${n === "1" ? "is-active" : ""}`} style={{ background: n === "1" ? "var(--nz-white)" : "transparent", minWidth: 36 }}>{n}</button>
            ))}
            <Button variant="ghost" size="sm">Siguientes <Icon name="ArrowRight" size={14} /></Button>
          </div>
        </div>
      </Section>

      <Section bg="card" tight style={{ borderTop: "1px solid var(--border-default)" }}>
        <div className="grid-2" style={{ alignItems: "center", gap: 56 }}>
          <SectionHeading
            eyebrow="Boletín"
            title="No te pierdas un artículo"
            lead="Suscríbete y recibe el contenido nuevo en tu correo."
          />
          <Reveal variant="right"><Newsletter compact /></Reveal>
        </div>
      </Section>

      <CTABand
        title="¿Quieres aplicar esto a tu operación?"
        description="Agenda un diagnóstico y convierte la teoría en un plan."
        primaryLabel="Agenda tu diagnóstico"
        primaryTo="/contacto"
        secondaryLabel="Ver guías"
        secondaryTo="/recursos/guias"
      />
    </>
  );
}
