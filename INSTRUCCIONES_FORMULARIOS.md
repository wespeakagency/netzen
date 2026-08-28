# Conexión de formularios → Google Sheets

Esta guía te lleva de cero a tener los formularios del sitio guardando datos en un Google Sheet.
Tiempo estimado: **30 minutos**.

---

## Paso 1 · Crear el Google Sheet

1. Andá a [sheets.google.com](https://sheets.google.com) y creá un Sheet nuevo.
2. Renombralo a algo tipo `Netzen Leads`.
3. Renombrá la primera hoja (pestaña de abajo) a `Leads`.
4. En la fila 1, pegá estos encabezados **en el orden exacto** (una columna por celda, de A a N):

```
Timestamp | Form Type | Nombre | Empresa | Email | WhatsApp | País | Modelo | Tamaño | Situación | Webinar | Guía | Artículo | Mensaje | Page Path | Referrer | User Agent
```

Cada campo que no aplique a un formulario específico va a quedar vacío — es correcto.

---

## Paso 2 · Pegar el script de Apps Script

1. En el Sheet, andá a **Extensiones → Apps Script**. Se abre una pestaña con un editor.
2. **Borrá TODO** el código que aparece.
3. Pegá este código completo:

```javascript
// Netzen · endpoint que recibe formularios del sitio y los guarda en el Sheet activo.
// Publicado como Web App con acceso "Anyone" (incluye anónimos).

const SHEET_NAME = "Leads";

// Rate limit muy simple por IP: máximo N envíos por ventana de tiempo.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    const formType = String(payload.form_type || "").slice(0, 60);
    const fields = payload.fields || {};
    const meta = payload.meta || {};

    if (!formType) return jsonResponse({ ok: false, error: "form_type requerido" });
    if (!isValidEmail(fields.email)) return jsonResponse({ ok: false, error: "email inválido" });

    // Rate limit por IP (usa las propiedades del script como storage efímero).
    const ip = (e.parameter && e.parameter.ip) || "unknown";
    if (!checkRateLimit(ip)) {
      return jsonResponse({ ok: false, error: "Demasiadas solicitudes. Esperá un minuto." });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return jsonResponse({ ok: false, error: "Hoja 'Leads' no encontrada" });

    sheet.appendRow([
      new Date(),
      formType,
      truncate(fields.nombre),
      truncate(fields.empresa),
      truncate(fields.email),
      asText(fields.whatsapp), // prefijo ' para que Sheets no interprete +52... como fórmula
      truncate(fields.pais),
      truncate(fields.modelo),
      truncate(fields.tamanio),
      truncate(fields.situacion),
      truncate(fields.webinar),
      truncate(fields.guia),
      truncate(fields.articulo),
      truncate(fields.mensaje, 2000),
      truncate(meta.page_path),
      truncate(meta.referrer),
      truncate(meta.user_agent, 500)
    ]);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err && err.message || err) });
  }
}

function doGet() {
  return jsonResponse({ ok: true, service: "netzen-leads" });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function truncate(value, max = 500) {
  if (value === undefined || value === null) return "";
  const str = String(value);
  return str.length > max ? str.slice(0, max) : str;
}

// Fuerza el valor como texto para que Sheets no lo interprete como fórmula.
// Necesario para campos que empiezan con + = - @ (teléfonos internacionales, por ejemplo).
function asText(value) {
  const str = truncate(value);
  if (!str) return "";
  const first = str.charAt(0);
  return (first === "+" || first === "=" || first === "-" || first === "@") ? "'" + str : str;
}

function checkRateLimit(ip) {
  const key = "rl_" + ip;
  const props = PropertiesService.getScriptProperties();
  const now = Date.now();
  const stored = props.getProperty(key);
  let bucket = stored ? JSON.parse(stored) : { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  if (now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }

  bucket.count += 1;
  props.setProperty(key, JSON.stringify(bucket));
  return bucket.count <= RATE_LIMIT_MAX;
}
```

4. Guardá con **Ctrl+S** (o Cmd+S) y nombralo `Netzen Leads Endpoint`.

---

## Paso 3 · Publicar como Web App

1. Arriba a la derecha: botón azul **Deploy → New deployment**.
2. Click en la ruedita ⚙️ al lado de "Select type" → elegí **Web app**.
3. Configuración:
   - **Description**: `v1`
   - **Execute as**: `Me (tu-email@gmail.com)`
   - **Who has access**: `Anyone` ← IMPORTANTE, tiene que ser Anyone, no "Anyone with Google account"
4. Click **Deploy**.
5. Google te pide autorización → **Authorize access** → elegí tu cuenta → **Advanced → Go to (project name) → Allow**.
6. Copiá la **Web app URL** que aparece. Se ve así:
   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/exec
   ```

---

## Paso 4 · Configurar el sitio

1. En la raíz del proyecto, copiá el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
2. Abrí `.env` y pegá los valores:
   ```
   VITE_SHEETS_ENDPOINT=https://script.google.com/macros/s/AKfyc.../exec
   VITE_WHATSAPP_URL=https://wa.me/525512345678
   ```
   (dejá `VITE_WHATSAPP_URL` vacío si todavía no tenés el número real — los botones de WhatsApp se ocultan solos)

3. Buildeá el entregable:
   ```bash
   npm run entregable
   ```

4. El archivo `entregable/NETZEN-sitio-web.html` queda listo para subir al servidor.

---

## Paso 5 · Probar

1. Abrí el HTML entregado en el navegador (o subilo al servidor y andá a la URL).
2. Llená el formulario de contacto con datos de prueba.
3. Andá a tu Google Sheet — debería aparecer una fila nueva con los datos.

---

## Actualizar el script después

Si cambiás algo del código del Apps Script, **la URL cambia**:
- Deploy → Manage deployments → editá el existente y subí la versión, O
- Deploy → New deployment y usás la URL nueva (actualizás `.env` y rebuildeás).

**Recomendado**: editá el deployment existente para NO tener que rebuildear el sitio cada vez.

---

## Cosas a saber (importante)

- **La URL del Apps Script queda pública en el HTML del sitio**. Cualquiera puede verla en el código fuente. Por eso el rate limit del lado del script — no dejes esa protección afuera.
- **Google Apps Script tiene cuotas gratis**: 20,000 ejecuciones por día para cuenta personal, 90,000 para Workspace. Para un sitio de marketing es MUCHÍSIMO más que suficiente.
- **Si querés notificaciones por email** cuando llegue un lead, agregá al final de `doPost` (justo antes del `return jsonResponse({ ok: true })`):
  ```javascript
  MailApp.sendEmail("tu-email@dominio.com", "Nuevo lead: " + formType, JSON.stringify(fields, null, 2));
  ```
- **Backup**: descargá el Sheet como Excel cada tanto o compartilo con un email backup — Google no lo pierde, pero mejor prevenir.
