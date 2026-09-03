// /recursos/blog · feed de Substack (Netzen Publication)
import React from "react";
import { Icon, Button, Section, SectionHeading, Reveal, Container } from "../../components/ui.jsx";
import { PageHero, CTABand } from "../../components/chrome.jsx";
import { Newsletter } from "./Hub.jsx";
import { useSubstackFeed, SUBSTACK_URL } from "../../hooks/useSubstackFeed.js";
import { trackEvent } from "../../lib/analytics.js";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}

function PostCard({ post, i }) {
  return (
    <Reveal delay={(i % 3) * 80} style={{ height: "100%" }}>
      <a
        href={post.link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("blog_post_click", { title: post.title, link: post.link })}
        className="card card--hover"
        style={{ display: "flex", flexDirection: "column", gap: 0, color: "inherit", height: "100%", padding: 0, overflow: "hidden" }}
      >
        <div style={{
          aspectRatio: "16/8",
          background: post.thumbnail
            ? `center / cover no-repeat url(${post.thumbnail})`
            : "linear-gradient(145deg, var(--nz-red-wash) 0%, var(--nz-red-tint) 66%, var(--nz-blue-tint) 100%)",
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative"
        }}>
          {!post.thumbnail && (
            <span className="bubble bubble--lg" style={{ background: "rgba(255,255,255,0.85)" }}>
              <Icon name="Newspaper" size={26} />
            </span>
          )}
        </div>
        <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          <span style={{ fontSize: 12, color: "var(--text-tertiary)", fontFamily: "var(--font-display)", fontWeight: 600 }}>
            {formatDate(post.pubDate)}
          </span>
          <h3 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.35 }}>{post.title}</h3>
          {post.excerpt && (
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text-secondary)" }}>
              {post.excerpt}...
            </p>
          )}
          <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--nz-red)" }}>
            Leer en Substack <Icon name="ExternalLink" size={14} />
          </span>
        </div>
      </a>
    </Reveal>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid-3" style={{ marginTop: 34 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ aspectRatio: "16/8", background: "var(--nz-red-wash)" }} />
          <div style={{ padding: "20px 22px 22px", display: "grid", gap: 10 }}>
            <div style={{ height: 12, width: "40%", background: "var(--border-default)", borderRadius: 4 }} />
            <div style={{ height: 16, background: "var(--border-default)", borderRadius: 4 }} />
            <div style={{ height: 16, width: "80%", background: "var(--border-default)", borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card card--pad-lg" style={{ textAlign: "center", marginTop: 34, padding: "56px 24px" }}>
      <span className="bubble bubble--lg" style={{ background: "var(--nz-red-wash)" }}>
        <Icon name="Newspaper" size={28} />
      </span>
      <h3 style={{ marginTop: 18, fontSize: 22, fontWeight: 800 }}>Muy pronto publicaremos contenido</h3>
      <p style={{ marginTop: 10, fontSize: 15, lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 520, margin: "10px auto 0" }}>
        Estamos preparando artículos sobre venta directa, retail, e-commerce y crecimiento comercial. Suscríbete para no perderte el primero.
      </p>
      <div style={{ marginTop: 22, display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href={SUBSTACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--primary"
          onClick={() => trackEvent("blog_substack_click", { source: "empty_state" })}
        >
          <Icon name="ExternalLink" size={16} /> Visitar Substack de Netzen
        </a>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="card card--pad-lg" style={{ textAlign: "center", marginTop: 34, padding: "40px 24px" }}>
      <Icon name="AlertCircle" size={28} style={{ color: "var(--status-warning, #b3800e)" }} />
      <h3 style={{ marginTop: 12, fontSize: 18, fontWeight: 700 }}>No pudimos cargar los artículos</h3>
      <p style={{ marginTop: 8, fontSize: 14, color: "var(--text-secondary)" }}>
        Puedes visitarlos directamente en nuestro Substack.
      </p>
      <div style={{ marginTop: 18 }}>
        <a
          href={SUBSTACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--secondary"
          onClick={() => trackEvent("blog_substack_click", { source: "error_state" })}
        >
          <Icon name="ExternalLink" size={16} /> Ir a Substack
        </a>
      </div>
    </div>
  );
}

function SubstackEmbed() {
  return (
    <div className="card card--pad-lg" style={{ boxShadow: "var(--shadow-md)", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span className="bubble"><Icon name="Rss" size={20} /></span>
        <h3 style={{ fontSize: 19, fontWeight: 700 }}>Suscríbete directo en Substack</h3>
      </div>
      <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>
        Recibe cada publicación en tu correo apenas se publica, directamente desde nuestro Substack.
      </p>
      <div style={{ marginTop: "auto", paddingTop: 18 }}>
        <a
          href={`${SUBSTACK_URL}/subscribe`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--primary btn--block"
          onClick={() => trackEvent("blog_substack_click", { source: "subscribe_card" })}
        >
          <Icon name="ExternalLink" size={16} /> Suscribirme en Substack
        </a>
      </div>
    </div>
  );
}

export default function Blog() {
  const { posts, status } = useSubstackFeed({ limit: 6 });

  return (
    <>
      <PageHero
        crumbs={[{ label: "Recursos", to: "/recursos" }, { label: "Blog" }]}
        eyebrow="Recursos · Blog"
        title={<>Ideas para <span style={{ color: "var(--nz-red)" }}>escalar y profesionalizar</span> la venta directa</>}
        lead="Análisis, guías prácticas y tendencias para venta directa, retail, e-commerce, franquicias y multinivel. Publicamos en Substack para que puedas leer y suscribirte donde ya consumes contenido."
      />

      <Section bg="page">
        {status === "loading" && <LoadingSkeleton />}
        {status === "error" && <ErrorState />}
        {status === "empty" && <EmptyState />}
        {status === "ok" && (
          <>
            <div className="grid-3 anim-fade-up" style={{ marginTop: 8 }}>
              {posts.map((post, i) => <PostCard post={post} i={i} key={post.guid} />)}
            </div>
            <div style={{ marginTop: 34, display: "flex", justifyContent: "center" }}>
              <a
                href={SUBSTACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--secondary"
                onClick={() => trackEvent("blog_substack_click", { source: "view_all" })}
              >
                Ver todas las publicaciones en Substack <Icon name="ExternalLink" size={14} />
              </a>
            </div>
          </>
        )}
      </Section>

      <Section bg="card" tight style={{ borderTop: "1px solid var(--border-default)" }}>
        <SectionHeading
          eyebrow="Boletín"
          title="No te pierdas una publicación"
          lead="Elige el canal que prefieras: recibe el boletín interno de Netzen o suscríbete directo al Substack."
        />
        <div className="grid-2" style={{ alignItems: "stretch", gap: 32, marginTop: 32 }}>
          <Reveal style={{ height: "100%" }}><Newsletter compact /></Reveal>
          <Reveal variant="right" style={{ height: "100%" }}><SubstackEmbed /></Reveal>
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
