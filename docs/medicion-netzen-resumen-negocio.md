# Medición del sitio Netzen · Resumen para negocio

Documento pensado para stakeholders no técnicos (marketing, dirección, ventas). Explica **qué se está midiendo, dónde y para qué**, sin jerga innecesaria.

---

## 1. ¿Qué se hizo, en una frase?

Se conectó el sitio de Netzen con **Google Analytics 4** (analítica) y **Meta Pixel** (Facebook / Instagram Ads) a través de **Google Tag Manager**, respetando el consentimiento de cookies del usuario. Ahora podemos ver, por primera vez, qué hace la gente en el sitio y usar esos datos para decisiones de marketing y para optimizar campañas pagas.

---

## 2. Herramientas involucradas

| Herramienta | Para qué sirve |
|---|---|
| **Google Tag Manager (GTM)** | Es el "panel de control" donde se decide qué se mide y hacia dónde se envía. Nos permite cambiar mediciones sin tocar el código del sitio. |
| **Google Analytics 4 (GA4)** | Recibe los datos del sitio. Es donde marketing entra a ver reportes: cuánta gente visita, qué formularios envían, de dónde vienen, etc. |
| **Meta Pixel** | Le avisa a Facebook / Instagram cuándo alguien completó una acción importante (por ejemplo, envió un formulario). Sirve para optimizar campañas y hacer remarketing. |
| **Consent Mode v2** | Sistema de Google que ajusta la medición según si el usuario aceptó o rechazó cookies. Nos mantiene en regla con la Ley Federal de Protección de Datos Personales (México) y con GDPR (Europa). |

---

## 3. Qué se está midiendo (eventos del sitio)

Cada vez que un usuario hace una acción relevante, el sitio "avisa" a Analytics. Estas son las 8 acciones que hoy se registran:

### Prioridad ALTA (conversiones de negocio)

| Acción del usuario | Dónde ocurre | Qué información se guarda |
|---|---|---|
| **Envía un formulario** | Contacto, newsletter, webinar, guía destacada, formulario dentro de una solución | Tipo de formulario, ruta específica (ej: "consultoría estratégica") |
| **Hace click en WhatsApp** | Botón flotante en toda la web, tarjeta de contacto | Ubicación exacta del click (flotante o tarjeta) |
| **Hace click en un CTA** (botón de llamada a la acción) | En cualquier sección del sitio | Texto del botón, destino, ubicación en la página |

### Prioridad MEDIA (contenido y experiencia)

| Acción del usuario | Dónde ocurre | Qué información se guarda |
|---|---|---|
| **Abre un post del blog** | Sección Recursos → Blog | Título del post, link |
| **Llega a una página que no existe (404)** | Cualquier URL inválida | Ruta que intentó visitar (útil para detectar links rotos) |
| **Acepta o rechaza cookies** | Banner de consentimiento | Decisión (aceptado/rechazado) y origen del cambio |

### Prioridad BAJA (comportamiento secundario)

| Acción del usuario | Dónde ocurre | Qué información se guarda |
|---|---|---|
| **Hace click hacia Substack** | Blog (varios lugares) | Ubicación desde donde se hizo click |
| **Abre el menú de idioma** | Header del sitio | Idioma seleccionado |

---

## 4. Qué se puede responder ahora con estos datos

Preguntas concretas que antes no se podían responder y ahora sí:

1. **¿Cuántos leads reales estamos generando por semana?**
   Contando envíos de formulario y clicks a WhatsApp.

2. **¿Qué formulario convierte más?**
   Contacto vs newsletter vs webinar vs guías, comparados uno contra otro.

3. **¿Desde qué sección del sitio la gente contacta más por WhatsApp?**
   Botón flotante vs tarjeta de contacto.

4. **¿Qué CTAs se están clickeando más y cuáles no funcionan?**
   Vemos texto, destino y ubicación de cada uno.

5. **¿Qué contenido del blog atrae más tráfico?**
   Ranking de posts por clicks.

6. **¿Cuánta gente cae en páginas rotas (404)?**
   Para arreglar links y no perder oportunidades.

7. **¿Cuánta gente acepta las cookies?**
   Métrica de compliance y base para saber qué porcentaje de tráfico podemos usar en campañas pagas.

---

## 5. Qué se configuró en Google Analytics

Además de recibir los datos, GA4 fue configurado para hacer útil esa información:

### Eventos Clave (conversiones)

Dos acciones fueron marcadas como **conversión** en GA4. Esto significa que GA las cuenta como objetivo de negocio y las prioriza en los reportes:

- Envío de formulario (`form_submit`)
- Click a WhatsApp (`whatsapp_click`)

### Dimensiones Personalizadas (13 en total)

Cada evento manda información contextual (ej: "qué formulario se envió", "en qué ubicación se hizo click"). Para que esa información aparezca como filtro en los reportes, se registraron 13 dimensiones personalizadas:

Form Type, Route, CTA Label, CTA Destination, Placement, Page Path, Blog Post Title, Blog Post Link, Blog Substack Source, Attempted Path, Consent Status, Consent Source, Language.

**Traducción práctica**: cuando marketing entre a un reporte, puede filtrar "muéstrame solo los envíos de formulario tipo webinar" o "muéstrame los clicks a WhatsApp desde el botón flotante".

---

## 6. Privacidad y consentimiento

El sitio arranca con **todas las cookies de medición desactivadas por defecto**. Nada se rastrea hasta que el usuario decide.

Cuando aparece el banner de cookies:
- Si acepta → se activa GA4 completo + Meta Pixel + cookies de personalización
- Si rechaza → solo se guardan las mediciones anónimas mínimas que permite Google (sin identificar al usuario)

Esto cumple con:
- **LFPDPPP** (Ley Federal de Protección de Datos Personales Mexicana)
- **GDPR** (regulación europea, por si hay tráfico de la UE)
- **Google Consent Mode v2** (requisito de Google para seguir usando GA4 y Ads en 2026)

---

## 7. Dónde vive cada cosa (para referencia técnica)

Si en algún momento un desarrollador necesita revisar o modificar la medición, esto es lo que hay:

| Componente | Ubicación |
|---|---|
| Contenedor de GTM | ID `GTM-N4BFLQTQ` — instalado en el `<head>` del sitio |
| Cuenta de GA4 | Property "Netzen Global" — ID `G-0T7BCZSYH0` |
| Meta Pixel | Configurado dentro de GTM (plantilla oficial) |
| Código que dispara los eventos | `src/lib/analytics.js` |
| Código del consentimiento | `src/lib/consent.js` + `src/components/ConsentBanner.jsx` |
| Documentación técnica detallada | `docs/gtm-events-implementation.md` |
| Setup de Meta Pixel | `docs/gtm-meta-pixel-setup.md` |

---

## 8. Qué queda por decidir (temas abiertos)

1. **Consent Mode geo-diferenciado**
   Hoy usamos el mismo comportamiento para todos los países. Se puede refinar: consentimiento implícito para México (permitido por LFPDPPP), explícito obligatorio para Europa. Requiere decisión de negocio y legal.

2. **Dashboard en Looker Studio**
   Una vez que tengamos una semana de datos limpios, conviene armar un dashboard visual (Looker Studio, gratis de Google) con los KPIs clave. Así marketing no necesita entrar a GA4 crudo.

3. **Integración con CRM**
   Los envíos de formulario hoy se registran en GA4 y Meta, pero no se están enviando automáticamente a un CRM. Si Netzen quiere trazabilidad de lead a venta, hay que conectarlo (HubSpot, Salesforce, Pipedrive, etc.).

---

## 9. Resumen ejecutivo (para leer en 30 segundos)

- El sitio Netzen ahora mide **8 tipos de acciones** de los usuarios, todas conectadas a **Google Analytics** y **Meta Pixel**.
- Se respeta el **consentimiento de cookies** de cada visitante y se cumple con la **ley mexicana y europea** de protección de datos.
- Se marcaron **dos conversiones clave**: envío de formulario y click a WhatsApp.
- Se registraron **13 dimensiones** para que marketing pueda filtrar y segmentar los datos.
- Todo está listo para empezar a **tomar decisiones basadas en datos** y **optimizar campañas pagas de Facebook / Instagram**.
