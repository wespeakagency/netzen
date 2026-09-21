// Helper único para enviar formularios a Google Apps Script.
//
// Truco clave: usamos Content-Type "text/plain" para que el navegador NO haga
// preflight OPTIONS. Apps Script recibe el body en e.postData.contents y ahí
// hacemos JSON.parse del lado del script. Es el patrón estándar recomendado.
//
// El body incluye:
//   form_type: string · tipo de formulario (ej. "contacto", "newsletter", "guia").
//   fields: object   · datos capturados del usuario.
//   meta: object     · metadatos útiles para el CRM (ruta, referrer, timestamp).
//
// Nunca envía el honeypot (si viene lleno se aborta antes del fetch).

import { SHEETS_ENDPOINT, HAS_FORMS_BACKEND } from "./env.js";
import { getAttribution, getSessionId, getPreviousRoute } from "./attribution.js";

const MIN_FILL_MS = 1200; // debajo de esto lo tratamos como bot

export class FormSubmitError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "FormSubmitError";
    if (cause) this.cause = cause;
  }
}

/**
 * Envía un formulario al backend de Google Sheets.
 * @param {object} args
 * @param {string} args.formType — identificador del formulario (ej. "contacto_demo").
 * @param {Record<string, unknown>} args.fields — datos del usuario.
 * @param {string} [args.honeypot] — valor del campo trampa (debe venir vacío).
 * @param {number} [args.renderedAt] — timestamp cuando el form se montó.
 * @returns {Promise<void>}
 */
export async function submitLead({ formType, fields, honeypot = "", renderedAt }) {
  if (honeypot) {
    // Silencioso a propósito: el bot no debe enterarse.
    return;
  }

  if (renderedAt && Date.now() - renderedAt < MIN_FILL_MS) {
    throw new FormSubmitError("Envío demasiado rápido. Volvé a intentarlo.");
  }

  if (!HAS_FORMS_BACKEND) {
    throw new FormSubmitError(
      "El envío de formularios no está configurado en esta versión. Contactanos por WhatsApp o correo."
    );
  }

  const attribution = getAttribution();
  const lastTouch = attribution.last || {};

  const payload = {
    form_type: formType,
    fields,
    meta: {
      submitted_at: new Date().toISOString(),
      page_path: typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") || "/" : "/",
      referrer: typeof document !== "undefined" ? document.referrer || "" : "",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      // Atribución de campaña — first-touch (primer aterrizaje de la sesión)
      utm_source: attribution.utm_source || "",
      utm_medium: attribution.utm_medium || "",
      utm_campaign: attribution.utm_campaign || "",
      utm_content: attribution.utm_content || "",
      utm_term: attribution.utm_term || "",
      gclid: attribution.gclid || "",
      fbclid: attribution.fbclid || "",
      landing_page: attribution.landing_page || "",
      landing_referrer: attribution.landing_referrer || "",
      first_seen: attribution.first_seen_iso || "",
      // Last-touch: solo se llena si hubo un segundo aterrizaje con UTMs
      utm_source_last: lastTouch.utm_source || "",
      utm_medium_last: lastTouch.utm_medium || "",
      utm_campaign_last: lastTouch.utm_campaign || "",
      // Contexto de navegación interna
      previous_route: getPreviousRoute(),
      session_id: getSessionId()
    }
  };

  let response;
  try {
    response = await fetch(SHEETS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow"
    });
  } catch (err) {
    throw new FormSubmitError("No pudimos conectar con el servidor. Revisá tu conexión.", err);
  }

  if (!response.ok) {
    throw new FormSubmitError(`El servidor rechazó el envío (HTTP ${response.status}).`);
  }

  // Apps Script devuelve JSON como texto plano; parseamos con tolerancia.
  try {
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    if (data && data.ok === false) {
      throw new FormSubmitError(data.error || "El servidor rechazó los datos.");
    }
  } catch (err) {
    if (err instanceof FormSubmitError) throw err;
    // Respuesta no-JSON: no la consideramos fatal, el POST llegó bien.
  }
}
