# Trazabilidad de leads · Atribución de campaña

Fecha: 2026-09-21
Rama: v2.1

## Estado por fase

| Fase | Alcance | Estado |
|---|---|---|
| **Fase 1 · Sitio** | Captura UTMs/gclid/fbclid en sessionStorage, enriquece payload de Sheets y eventos dataLayer | ✅ Completa |
| **Fase 2 · Google Sheets + Apps Script** | Sheet nuevo con 39 columnas (Y-AM atribución), Apps Script persiste todo el meta | 🟡 En curso |
| **Fase 3 · GTM + Meta Pixel + GA4** | Variables dataLayer, params en tags, Enhanced Conversions con fbclid | ⏳ Pendiente |

## Objetivo

Que cada lead que llega al Google Sheet tenga suficiente contexto para responder:
- ¿De qué campaña vino? (Meta Ads, Google Ads, orgánico, referral, directo)
- ¿En qué landing aterrizó?
- ¿Qué ruta navegó antes de convertir?
- ¿Es la misma sesión que otro lead? (correlación multi-formulario)

## Fase 2 · Estado detallado (en curso)

**Bloqueante actual**: verificación de cuenta Google por SMS pendiente. Sin eso no se puede correr `setupCRMTabs()` ni deployar el Web App del Sheet nuevo.

**Lo que ya está hecho**:
- Nuevo Google Sheet creado desde cero (sin data legacy).
- Apps Script bound al Sheet con 3 archivos:
  - `Code.gs` con `doPost` actualizado. Incluye `route_code` poblado con `fields.situacion` y 15 columnas nuevas Y-AM con toda la atribución.
  - `setupCRM.gs` versión limpia (sin acentos, sin `seedExampleLeads` opcional). 39 headers al correr `setupLeads_`.
  - `endpoint.gs` sin cambios (mapea por header, absorbe columnas nuevas automáticamente).

**Pendiente cuando se destrabe la verificación**:
1. Correr `setupCRMTabs()` una vez → crea las 6 pestañas (`00_README`, `01_LEADS`, `02_SUBMISSIONS`, `03_CATALOGS`, `04_SCORE_MAP`, `05_METRICS`).
2. Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone) → copiar URL nuevo.
3. Actualizar `VITE_SHEETS_ENDPOINT` en `.env` local (solo dev por ahora).
4. Reiniciar `npm run dev` (Vite lee env solo al arranque).
5. Test end-to-end con URL de prueba (ver sección Verificación abajo).

**Gotcha descubierto**: Apps Script rechaza smart quotes (`"` `"` curly) al pegar desde clipboard. Solución: usar ASCII plano en strings (sin acentos, sin `>=`, sin `·`). La función `seedExampleLeads` original tenía este problema y se removió.

## Qué se captura

### First-touch (primer aterrizaje de la sesión, nunca se sobreescribe)

| Campo | De dónde sale |
|---|---|
| `utm_source` | Query param `?utm_source=` en la URL de aterrizaje |
| `utm_medium` | Query param `?utm_medium=` |
| `utm_campaign` | Query param `?utm_campaign=` |
| `utm_content` | Query param `?utm_content=` |
| `utm_term` | Query param `?utm_term=` |
| `gclid` | Query param `?gclid=` (Google Ads click ID) |
| `fbclid` | Query param `?fbclid=` (Meta Ads click ID) |
| `landing_page` | Ruta de aterrizaje (contenido del hash, ej. `/academy/distribuidor-independiente`) |
| `landing_referrer` | `document.referrer` en el primer render |
| `first_seen_iso` | Timestamp ISO del aterrizaje |

### Last-touch (opcional, se pisa cada vez que el usuario vuelve con UTMs nuevas)

| Campo | Notas |
|---|---|
| `utm_source_last` | Solo se llena si hubo un segundo aterrizaje con parámetros de campaña |
| `utm_medium_last` | idem |
| `utm_campaign_last` | idem |

Si un lead entra directo desde una campaña por primera vez, first-touch = last-touch.

### Contexto de navegación interna

| Campo | De dónde sale |
|---|---|
| `previous_route` | La ruta anterior dentro del sitio antes de aterrizar en el formulario. Responde: "¿venía de /academy? ¿de /consulting?" |
| `session_id` | UUID v4 generado en el primer request, persistido en la sesión. Correlaciona múltiples formularios llenados por el mismo lead. |

## Persistencia · sessionStorage keys

| Key | Contenido |
|---|---|
| `netzen_attribution` | JSON con first-touch |
| `netzen_attribution_last` | JSON con last-touch (solo si hubo UTMs en un aterrizaje posterior) |
| `netzen_session_id` | UUID v4 |
| `netzen_current_route` | Ruta actual (se usa para calcular la previa) |
| `netzen_previous_route` | Ruta anterior dentro del sitio |

**Por qué `sessionStorage` y no `localStorage`**: privacidad, no queremos cruzar pestañas ni persistir entre sesiones. Si el usuario cierra el tab, se pierde. Aceptable para el use case.

**Fallbacks**: todo el módulo `src/lib/attribution.js` está envuelto en `try/catch`. Si `sessionStorage` no está disponible (modo privado, cookies bloqueadas), las funciones devuelven strings vacíos y los formularios siguen funcionando.

## Cómo verificar en dev tools

En DevTools → Console:
```js
// Ver first-touch
JSON.parse(sessionStorage.getItem('netzen_attribution'))

// Ver last-touch (puede ser null)
JSON.parse(sessionStorage.getItem('netzen_attribution_last'))

// Ver session_id
sessionStorage.getItem('netzen_session_id')

// Ver navegación
sessionStorage.getItem('netzen_previous_route')
sessionStorage.getItem('netzen_current_route')
```

Para probar UTMs, aterrizar con:
```
http://localhost:5173/?utm_source=meta&utm_medium=cpc&utm_campaign=q4-diagnostico&fbclid=ABC123#/contacto
```
(los query params van ANTES del `#` porque HashRouter).

Luego enviar el formulario y en Network ver el payload POST al endpoint de Sheets. En `meta` deben venir todos los campos poblados.

## Cambios en el sitio (Fase 1 — ya aplicados)

- `src/lib/attribution.js` nuevo, módulo self-contained.
- `src/main.jsx` llama `initAttribution()` una vez al boot, antes del render.
- `src/App.jsx` llama `trackPreviousRoute(pathname)` en el effect de useLocation, antes de trackPageView.
- `src/lib/forms.js` extiende el objeto `meta` del payload que se manda a Sheets con los 16 campos nuevos.
- `src/lib/analytics.js` enriquece SOLO el evento `netzen_form_submit` con utm_source, utm_medium, utm_campaign, gclid, fbclid, previous_route, session_id. El resto de eventos (cta_click, whatsapp_click, page_view) no se modifican.
- `src/pages/contacto/Contacto.jsx` renombra `form_type: "demo_protegido"` → `"demo"` para consistencia con el rename de copy que ya se hizo.

## Fase 2 · Apps Script (pendiente)

El backend de Google Sheets recibe el `meta` expandido pero **no lo persiste** hasta que se actualice el Apps Script. El owner del script debe agregar columnas al final del Sheet:

**Columnas nuevas requeridas**:
1. `utm_source`
2. `utm_medium`
3. `utm_campaign`
4. `utm_content`
5. `utm_term`
6. `gclid`
7. `fbclid`
8. `landing_page`
9. `landing_referrer`
10. `first_seen`
11. `utm_source_last`
12. `utm_medium_last`
13. `utm_campaign_last`
14. `previous_route`
15. `session_id`

Todos son strings, longitud libre. Agregar al final para no romper reportes ya armados sobre las columnas actuales.

## Fase 3 · GTM (pendiente)

Los campos ya llegan al dataLayer en `netzen_form_submit`. Para exponerlos como dimensiones filtrables en GA4 y como parámetros en Meta Pixel Lead:

- Crear en GTM variables dataLayer: `dlv - utm_source`, `dlv - utm_medium`, `dlv - utm_campaign`, `dlv - gclid`, `dlv - fbclid`, `dlv - previous_route`, `dlv - session_id`.
- Agregarlas como parámetros del tag GA4 event `form_submit`.
- En Meta Pixel Lead, agregar `fbclid` para Enhanced Conversions.
- En GA4 → Definiciones personalizadas, crear las dimensiones `UTM Source`, `UTM Medium`, `UTM Campaign`, `Previous Route`.

Detalle completo en `docs/gtm-events-implementation.md` (guía original de GTM).

## Nota sobre `form_type: demo_protegido`

Registros históricos en el Sheet tienen `form_type = "demo_protegido"`. A partir de este cambio los nuevos vienen como `"demo"`. Reporting: filtrar por ambos valores o hacer un mapeo en la vista de análisis. No se retropoblan los registros anteriores.

## Nota sobre Consent Mode v2

`sessionStorage` NO cuenta como cookie de tracking bajo GDPR — es storage técnico de sesión, se pierde al cerrar el tab. No requiere consentimiento explícito. Los datos que se envían a Sheets se procesan bajo la relación con el usuario (llenó un formulario). Los que llegan a GA4/Meta vía GTM sí respetan Consent Mode v2 (ya implementado en `src/lib/consent.js`).
