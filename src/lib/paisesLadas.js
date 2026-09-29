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
