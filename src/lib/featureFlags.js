// Feature flags para ocultar temporalmente secciones con data mockeada.
// Reactivar = poner el flag en true.

export const FEATURES = {
  recursos_casos: false,
  recursos_guias: false,
  recursos_webinars: false,
  nosotros_eventos: false,
  nosotros_certificaciones: false,
  nosotros_liderazgo: false,
};

const ROUTE_FLAG_MAP = {
  "/recursos/casos": "recursos_casos",
  "/recursos/guias": "recursos_guias",
  "/recursos/webinars": "recursos_webinars",
  "/nosotros/eventos": "nosotros_eventos",
};

export function isRouteEnabled(path) {
  const flag = ROUTE_FLAG_MAP[path];
  if (!flag) return true;
  return FEATURES[flag] === true;
}

export function isFeatureEnabled(key) {
  return FEATURES[key] === true;
}
