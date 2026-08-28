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

// Contraseña simple del dashboard interno (SOLO para la prueba del viernes).
// Si se define, el dashboard exige la contraseña antes de mostrar leads.
// Si queda vacía, el dashboard se abre sin gate (útil solo en desarrollo).
// NOTA: esta contraseña queda inlineada en el HTML del dashboard. No es auth de producción.
export const DASHBOARD_PASSWORD = raw("VITE_DASHBOARD_PASSWORD");

export const HAS_WHATSAPP = WHATSAPP_URL.length > 0;
export const HAS_FORMS_BACKEND = SHEETS_ENDPOINT.length > 0;
export const HAS_DASHBOARD_PASSWORD = DASHBOARD_PASSWORD.length > 0;

if (import.meta.env?.DEV) {
  if (!HAS_FORMS_BACKEND) {
    console.warn("[netzen] VITE_SHEETS_ENDPOINT no configurado — los formularios no envían datos.");
  }
  if (!HAS_WHATSAPP) {
    console.warn("[netzen] VITE_WHATSAPP_URL no configurado — los botones de WhatsApp quedan ocultos.");
  }
  if (!HAS_DASHBOARD_PASSWORD) {
    console.warn("[netzen] VITE_DASHBOARD_PASSWORD no configurado — el dashboard queda abierto sin contraseña.");
  }
}
