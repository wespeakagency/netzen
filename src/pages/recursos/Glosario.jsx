// /recursos/glosario — términos A–Z con búsqueda
import React, { useMemo, useState } from "react";
import { Icon, Button, Section, SectionHeading, Reveal } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { GLOSARIO } from "./data.js";
import { LABELS } from "../../lib/copy.js";

export default function Glosario() {
  const [q, setQ] = useState("");
  const letras = useMemo(() => [...new Set(GLOSARIO.map((g) => g.letra))], []);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return GLOSARIO;
    return GLOSARIO.filter((g) => g.term.toLowerCase().includes(t) || g.def.toLowerCase().includes(t));
  }, [q]);
  const grouped = useMemo(() => {
    return list.reduce((acc, g) => { (acc[g.letra] = acc[g.letra] || []).push(g); return acc; }, {});
  }, [list]);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Recursos", to: "/recursos" }, { label: "Glosario" }]}
        eyebrow="Recursos · Glosario"
        title={<>El lenguaje de la industria, <span style={{ color: "var(--nz-red)" }}>de la A a la Z</span></>}
        lead="Definiciones claras de los términos clave de la venta directa y el multinivel. Una referencia pensada para resolver dudas del mercado y posicionar a Netzen en buscadores."
        aside={
          <div className="card card--pad-lg" style={{ boxShadow: "var(--shadow-md)" }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Busca un término</div>
            <div className="field">
              <div style={{ position: "relative" }}>
                <Icon name="Search" size={17} style={{ position: "absolute", left: 14, top: 14, color: "var(--text-tertiary)" }} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="omnicanalidad, genealogía, CRM…"
                  style={{ paddingLeft: 42, width: "100%" }}
                />
              </div>
            </div>
            <p style={{ marginTop: 12, fontSize: 12.5, color: "var(--text-tertiary)" }}>
              {list.length} término{list.length !== 1 ? "s" : ""} {q ? `para «${q}»` : "en el glosario"}
            </p>
          </div>
        }
      />

      <Section bg="page">
        <div className="cols-gloss">
          <div className="glosslet" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {letras.map((l) => (
              <a
                key={l}
                href={`#letra-${l}`}
                onClick={(e) => { e.preventDefault(); document.getElementById(`letra-${l}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                style={{
                  width: 44, height: 44, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
                  border: "1.5px solid var(--border-strong)", color: grouped[l] ? "var(--nz-red)" : "var(--text-tertiary)",
                  background: "var(--nz-white)", opacity: grouped[l] ? 1 : 0.4
                }}
              >{l}</a>
            ))}
          </div>
          <div>
            {Object.keys(grouped).length === 0 && (
              <div className="card" style={{ textAlign: "center", padding: 44 }}>
                <Icon name="Search" size={26} style={{ color: "var(--nz-gray-400)" }} />
                <h3 style={{ marginTop: 12, fontSize: 18, fontWeight: 700 }}>Sin resultados para «{q}»</h3>
                <p style={{ marginTop: 8, fontSize: 14, color: "var(--text-secondary)" }}>Prueba con otro término o agenda un diagnóstico para resolverlo con un especialista.</p>
              </div>
            )}
            {Object.entries(grouped).map(([letra, terms]) => (
              <div key={letra} id={`letra-${letra}`} style={{ scrollMarginTop: 130, marginBottom: 34 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <span style={{
                    width: 46, height: 46, borderRadius: "50%", background: "var(--nz-red)", color: "#fff",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, boxShadow: "var(--shadow-accent)"
                  }}>{letra}</span>
                  <hr className="hr-soft" style={{ flex: 1 }} />
                </div>
                <div className="grid-2">
                  {terms.map((t) => (
                    <Reveal key={t.term} className="card card--hover" style={{ height: "100%" }}>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--nz-red-deep)" }}>{t.term}</h3>
                      <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.65, color: "var(--text-secondary)" }}>{t.def}</p>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <CTABand
        title="¿Te faltó un término?"
        description="Escríbenos o agenda un diagnóstico para resolver tus dudas con un especialista."
        primaryLabel={LABELS.diagnostico}
        primaryTo="/contacto"
        secondaryLabel="Ver recursos"
        secondaryTo="/recursos"
      />
    </>
  );
}
