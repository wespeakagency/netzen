import { getAttribution, getSessionId, getPreviousRoute } from "./attribution.js";

const canTrack = () => typeof window !== "undefined";

const cleanDetail = (detail = {}) =>
  Object.fromEntries(
    Object.entries(detail).filter(([, value]) =>
      ["string", "number", "boolean"].includes(typeof value)
    )
  );

// Solo enriquecemos form_submit con atribución. Los otros eventos (cta_click,
// whatsapp_click, page_view) no la necesitan — GA4 los correlaciona por session.
function attributionForFormSubmit() {
  const attribution = getAttribution();
  return cleanDetail({
    utm_source: attribution.utm_source || "",
    utm_medium: attribution.utm_medium || "",
    utm_campaign: attribution.utm_campaign || "",
    gclid: attribution.gclid || "",
    fbclid: attribution.fbclid || "",
    previous_route: getPreviousRoute(),
    session_id: getSessionId()
  });
}

export function trackEvent(name, detail = {}) {
  if (!canTrack()) return;

  const enrich = name === "form_submit" ? attributionForFormSubmit() : {};
  const cleanUserDetail = cleanDetail(detail);

  const payload = {
    event: `netzen_${name}`,
    page_path: window.location.hash.replace(/^#/, "") || "/",
    // enrich va PRIMERO para que el caller pueda sobreescribir campos si necesita
    ...enrich,
    ...cleanUserDetail
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent("netzen:analytics", { detail: payload }));
}

export function trackPageView(path) {
  trackEvent("page_view", { page_path: path || "/" });
}

