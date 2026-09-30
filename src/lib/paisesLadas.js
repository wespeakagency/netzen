// Catálogo país → lada. Fuente única de verdad para el formulario de contacto
// y para derivar el prefijo internacional del WhatsApp del lead.
// Orden: mercados prioritarios primero, después resto LATAM, después "Otro".

export const PAISES = [
  { name: "México", lada: "+52" },
  { name: "Colombia", lada: "+57" },
  { name: "Perú", lada: "+51" },
  { name: "Ecuador", lada: "+593" },
  { name: "Chile", lada: "+56" },
  { name: "Argentina", lada: "+54" },
  { name: "Brasil", lada: "+55" },
  { name: "Costa Rica", lada: "+506" },
  { name: "Panamá", lada: "+507" },
  { name: "Guatemala", lada: "+502" },
  { name: "El Salvador", lada: "+503" },
  { name: "Honduras", lada: "+504" },
  { name: "Nicaragua", lada: "+505" },
  { name: "República Dominicana", lada: "+1" },
  { name: "Puerto Rico", lada: "+1" },
  { name: "Uruguay", lada: "+598" },
  { name: "Paraguay", lada: "+595" },
  { name: "Bolivia", lada: "+591" },
  { name: "Venezuela", lada: "+58" },
  { name: "Estados Unidos", lada: "+1" },
  { name: "España", lada: "+34" },
  { name: "Otro", lada: "" }
];

export function getLada(paisName) {
  const found = PAISES.find((p) => p.name === paisName);
  return found ? found.lada : "";
}

// Concatena lada + número local en formato E.164-friendly. Limpia espacios,
// guiones y paréntesis del número local para evitar basura en el CRM.
export function buildWhatsappE164(lada, numeroLocal) {
  const digits = String(numeroLocal || "").replace(/\D/g, "");
  if (!lada || !digits) return "";
  return `${lada} ${digits}`;
}

// Ladas ordenadas de más larga a más corta para hacer longest-prefix-match
// (ej: "+593" gana sobre "+59" que no existe pero previene falsos matches con "+5").
const LADAS_SORTED = [...new Set(PAISES.map((p) => p.lada).filter(Boolean))].sort(
  (a, b) => b.length - a.length,
);

// Detecta la lada de un número. Acepta con o sin espacios, con o sin "+".
// Devuelve la lada con "+" (ej "+52") o "" si no matchea.
export function detectLadaFromPhone(phone) {
  const raw = String(phone || "").trim();
  if (!raw) return "";
  const normalized = raw.startsWith("+") ? raw : `+${raw.replace(/\D/g, "")}`;
  for (const lada of LADAS_SORTED) {
    if (normalized.startsWith(lada)) return lada;
  }
  return "";
}

// Devuelve el país (name) correspondiente a un teléfono. Si el prefijo mapea
// a varios países (ej +1), respeta el país actual si también lo comparte, para
// no pisar una selección válida del usuario.
export function detectCountryFromPhone(phone, currentCountry = "") {
  const lada = detectLadaFromPhone(phone);
  if (!lada) return "";
  const matches = PAISES.filter((p) => p.lada === lada);
  if (!matches.length) return "";
  if (currentCountry && matches.some((m) => m.name === currentCountry)) {
    return currentCountry;
  }
  return matches[0].name;
}

// Reemplaza (o agrega) la lada al inicio del número. Preserva el resto tal cual.
// Uso: cuando el usuario cambia el país, sincronizar el prefijo del WhatsApp.
export function replaceLadaInPhone(phone, newLada) {
  const raw = String(phone || "").trim();
  if (!newLada) return raw;
  const currentLada = detectLadaFromPhone(raw);
  if (currentLada) {
    const rest = raw.slice(currentLada.length).trimStart();
    return `${newLada} ${rest}`.trim();
  }
  const digits = raw.replace(/\D/g, "");
  return digits ? `${newLada} ${digits}` : newLada;
}
