const canTrack = () => typeof window !== "undefined";

const cleanDetail = (detail = {}) =>
  Object.fromEntries(
    Object.entries(detail).filter(([, value]) =>
      ["string", "number", "boolean"].includes(typeof value)
    )
  );

export function trackEvent(name, detail = {}) {
  if (!canTrack()) return;

  const payload = {
    event: `netzen_${name}`,
    page_path: window.location.hash.replace(/^#/, "") || "/",
    ...cleanDetail(detail)
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent("netzen:analytics", { detail: payload }));
}

export function trackPageView(path) {
  trackEvent("page_view", { page_path: path || "/" });
}

