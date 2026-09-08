# Configuración de GTM + Meta Pixel — Netzen

Guía paso a paso para el marketer / responsable de tracking. El código del sitio ya está listo: envía eventos al `dataLayer` y respeta el consentimiento del usuario. Todo lo demás se configura desde el panel de Google Tag Manager.

**Container GTM:** `GTM-N4BFLQTQ`

---

## 1. Habilitar Consent Mode v2 en el container

En GTM, ve a **Admin > Container Settings > Additional Settings** y activa:

- **Consent Overview**: habilita el panel de consentimiento (icono de escudo en la barra superior de Tags).

El sitio ya está enviando comandos `consent default` y `consent update` al dataLayer, no requiere plantilla adicional.

---

## 2. Crear el Tag de Meta Pixel

### 2.1. Agregar la plantilla desde Community Gallery

1. Ve a **Tags > New > Tag Configuration > Discover more tag types in the Community Template Gallery**.
2. Busca **"Facebook Pixel"** o **"Meta Pixel"** (autor: `facebookincubator` u otro reconocido).
3. Agrega la plantilla al workspace.

### 2.2. Crear el Tag principal de PageView

- **Tag Name:** `Meta Pixel — PageView`
- **Tag Type:** Meta Pixel (la plantilla instalada)
- **Pixel ID:** _pega aquí el ID de Meta que te pasaron (16 dígitos)_
- **Event:** `PageView`
- **Trigger:** `All Pages` (built-in de GTM)

### 2.3. Configuración de consentimiento del Tag

En **Advanced Settings > Consent Settings > Require additional consent for tag to fire**, marca:

- `ad_storage`
- `analytics_storage`
- `ad_user_data`
- `ad_personalization`

Con esto, el pixel NO dispara hasta que el usuario acepte el banner del sitio.

---

## 3. Mapeo de eventos de conversión

El sitio dispara estos eventos al `dataLayer`. Para cada uno, crea un Tag adicional de Meta Pixel apuntando al evento estándar de Meta correspondiente.

### 3.1. Crear Data Layer Variables reutilizables

Ve a **Variables > User-Defined Variables > New > Data Layer Variable**:

| Variable Name | Data Layer Variable Name |
|---|---|
| `dlv_form_type` | `form_type` |
| `dlv_placement` | `placement` |
| `dlv_label` | `label` |
| `dlv_destination` | `destination` |

### 3.2. Crear Triggers para cada evento del sitio

Ve a **Triggers > New > Custom Event**:

| Trigger Name | Event Name | Condiciones |
|---|---|---|
| `CE — Form Submit (Diagnóstico)` | `netzen_form_submit` | `dlv_form_type equals diagnostico` |
| `CE — Form Submit (Demo)` | `netzen_form_submit` | `dlv_form_type equals demo_protegido` |
| `CE — Form Submit (Newsletter)` | `netzen_form_submit` | `dlv_form_type equals newsletter` |
| `CE — Form Submit (Contenido)` | `netzen_form_submit` | `dlv_form_type matches RegEx guia_destacada\|lead_magnet_articulo\|webinar` |
| `CE — WhatsApp Click` | `netzen_whatsapp_click` | `All Custom Events` |

### 3.3. Crear los Tags de Meta Pixel por conversión

Duplica el Tag `Meta Pixel — PageView` una vez por cada conversión y ajusta:

| Tag Name | Meta Event | Trigger |
|---|---|---|
| `Meta Pixel — Lead (Diagnóstico)` | `Lead` | `CE — Form Submit (Diagnóstico)` |
| `Meta Pixel — Lead (Demo)` | `Lead` | `CE — Form Submit (Demo)` |
| `Meta Pixel — Subscribe (Newsletter)` | `Subscribe` | `CE — Form Submit (Newsletter)` |
| `Meta Pixel — CompleteRegistration (Contenido)` | `CompleteRegistration` | `CE — Form Submit (Contenido)` |
| `Meta Pixel — Contact (WhatsApp)` | `Contact` | `CE — WhatsApp Click` |

**Importante:** todos los Tags de Meta Pixel deben tener las mismas `Consent Settings` que el Tag principal (paso 2.3).

---

## 4. Probar antes de publicar

1. En GTM, click en **Preview** (arriba a la derecha). Se abre Tag Assistant.
2. Ingresa la URL del sitio (ej: `https://netzen.global/` o `http://localhost:5173/` en desarrollo).
3. Verifica que:
   - Al cargar, aparece el banner de cookies. El Tag `Meta Pixel — PageView` NO debe dispararse todavía.
   - Al hacer click en **"Aceptar todo"**, el Tag `Meta Pixel — PageView` sí dispara.
   - Al enviar un formulario, dispara el Tag correspondiente (`Lead`, `Subscribe`, etc).
   - Al hacer click en el botón flotante de WhatsApp, dispara `Meta Pixel — Contact`.
4. En paralelo, en Meta Events Manager > Test Events, verifica que los eventos lleguen con el mismo Pixel ID.

Cuando todo funcione, click en **Submit** en GTM para publicar la versión.

---

## 5. Eventos del sitio (referencia rápida)

Estos son los eventos que dispara el sitio al `dataLayer`. No requieren cambios en el código.

| Event Name | Detalle en dataLayer | Cuándo se dispara |
|---|---|---|
| `netzen_page_view` | `page_path` | Cambio de ruta (SPA con HashRouter) |
| `netzen_form_submit` | `form_type`, `page_path` | Envío exitoso de cualquier formulario del sitio |
| `netzen_whatsapp_click` | `placement`, `page_path` | Click en botón flotante o tarjeta de WhatsApp |
| `netzen_cta_click` | `label`, `destination`, `page_path` | Click en cualquier CTA (uso general, no mapeado a Meta) |
| `netzen_language_menu_open` | `language` | Apertura del selector de idioma |
| `netzen_not_found` | `page_path` | Página 404 |
| `netzen_consent_update` | `consent_status`, `consent_source` | Usuario acepta o rechaza el banner |

---

## 6. Agregar otro pixel a futuro (TikTok, LinkedIn, GA4)

El sitio no necesita cambios. Solo:

1. Instala la plantilla del pixel deseado desde Community Gallery.
2. Crea el Tag con las mismas Consent Settings (paso 2.3).
3. Reutiliza los Triggers ya creados en el paso 3.2 para mapear conversiones.
4. Publica.

Ese es el motivo por el que usamos GTM en lugar de hardcodear cada pixel: cero rebuilds del sitio para agregar tracking nuevo.
