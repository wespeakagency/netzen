// Fuente única de verdad para variables de entorno del cliente.
// Todas se inyectan en tiempo de build (Vite) y quedan inlineadas en el HTML final.

const raw = (key) => {
  const value = import.meta.env?.[key];
  return typeof value === "string" ? value.trim() : "";
};

// URL del endpoint de Google Apps Script Web App que recibe los formularios.
// Se debe publicar el script como "Anyone" (incluso anónimo) y pegar acá la URL /exec.
export const SHEETS_ENDPOINT = raw("VITE_SHEETS_ENDPOINT");

// URL de WhatsApp comercial. Formato completo: https://wa.me/525512345678
// Si no se define, los botones de WhatsApp se ocultan en lugar de apuntar a un placeholder.
export const WHATSAPP_URL = raw("VITE_WHATSAPP_URL");

export const HAS_WHATSAPP = WHATSAPP_URL.length > 0;
export const HAS_FORMS_BACKEND = SHEETS_ENDPOINT.length > 0;

if (import.meta.env?.DEV) {
  if (!HAS_FORMS_BACKEND) {
    console.warn("[netzen] VITE_SHEETS_ENDPOINT no configurado — los formularios no envían datos.");
  }
  if (!HAS_WHATSAPP) {
    console.warn("[netzen] VITE_WHATSAPP_URL no configurado — los botones de WhatsApp quedan ocultos.");
  }
}
