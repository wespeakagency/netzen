// Empaqueta el build standalone del DASHBOARD como entregable sin dependencias:
// incrusta las fuentes de Google Fonts (woff2 → base64) y el favicon.
// Resultado: NETZEN-dashboard.html, 100% offline y autocontenido.
//
// Uso: npm run entregable:dashboard
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = resolve(root, "standalone-dashboard/dashboard.html");
const OUT_DIR = resolve(root, "entregable");
const OUT = resolve(OUT_DIR, "NETZEN-dashboard.html");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

let html = readFileSync(SRC, "utf8");

// 1) URL de la hoja de Google Fonts referenciada en el HTML
const linkMatch = html.match(/<link[^>]*href="(https:\/\/fonts\.googleapis\.com\/css2[^"]*)"[^>]*>/s);
if (!linkMatch) throw new Error("No se encontró el <link> de Google Fonts en el dashboard standalone");
const cssUrl = linkMatch[1].replace(/&amp;/g, "&");

console.log("Descargando hoja de fuentes…");
const cssRes = await fetch(cssUrl, { headers: { "User-Agent": UA } });
if (!cssRes.ok) throw new Error(`Fuentes: HTTP ${cssRes.status}`);
const fontCss = await cssRes.text();

// 2) Conservar solo los bloques del subconjunto LATIN
const blocks = [...fontCss.matchAll(/\/\*\s*([a-z-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)];
const latin = blocks.filter(([, subset]) => subset === "latin");
if (!latin.length) throw new Error("No se encontraron bloques latin en la hoja de fuentes");

// 3) Descargar cada woff2 e incrustarlo como data URI
let inlined = "";
let totalKB = 0;
for (const [, , face] of latin) {
  const urlMatch = face.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/);
  if (!urlMatch) continue;
  const res = await fetch(urlMatch[1], { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`woff2: HTTP ${res.status} — ${urlMatch[1]}`);
  const buf = Buffer.from(await res.arrayBuffer());
  totalKB += buf.length / 1024;
  inlined += face.replace(urlMatch[1], `data:font/woff2;base64,${buf.toString("base64")}`) + "\n";
}
console.log(`Fuentes incrustadas: ${latin.length} caras, ${Math.round(totalKB)} KB (sin base64)`);

// 4) Reemplazar el <link> por el <style> con las fuentes, y quitar los preconnect
html = html.replace(linkMatch[0], `<style>/* Montserrat + Lato incrustadas (subconjunto latin) */\n${inlined}</style>`);
html = html.replace(/<link[^>]*rel="preconnect"[^>]*>\s*/g, "");

// 5) Favicon incrustado
const favicon = readFileSync(resolve(root, "public/assets/logo/netzen-isotipo-red.png"));
html = html.replace(
  /href="\.\/assets\/logo\/netzen-isotipo-red\.png"/,
  `href="data:image/png;base64,${favicon.toString("base64")}"`
);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT, html);

// 6) Verificación: no deben quedar dependencias externas
const leftovers = [...html.matchAll(/https:\/\/(fonts\.googleapis|fonts\.gstatic)[^"')\s]*/g)];
if (leftovers.length) throw new Error(`Quedaron referencias externas: ${leftovers.map((m) => m[0]).join(", ")}`);
console.log(`Dashboard entregable listo: ${OUT} (${Math.round(html.length / 1024)} KB)`);
