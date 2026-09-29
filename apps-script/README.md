# Apps Script — CRM Netzen (V1 spec-compliant)

Código versionado del proyecto de Apps Script bound al Google Sheet del CRM.

## Archivos

- `setupCRM.gs` — bootstrap de las pestañas del Sheet. Incluye V1 nueva `04_SCORE_WEIGHTS` y `08_INTENT_MAP`.
- `Code.gs` — endpoint POST + motor de scoring V1 spec-compliant.
- `endpoint.gs` — endpoint GET (leads, metrics, catalogs). Sin cambios V1.
- `emailLead.html` — template HTML del correo de notificación (vive en Apps Script, no está en este repo).

## Cambios V1 respecto a la versión anterior (heur_v1)

| | Antes (`heur_v1`) | Ahora (V1 spec) |
|---|---|---|
| Pesos | Hardcoded en `Code.gs` | Pestaña `04_SCORE_WEIGHTS`, versionable |
| Ruta | Ignorada | A/B/C/D con pesos distintos por ruta (spec 12.2) |
| Fórmula ejes | Heurística 0-100 directa | `axis = round(100 × Σ(score×w) / (3×Σw))` (spec 12.2) |
| Confidence | `filled/4 × 100` | `Σ(w answered) / Σ(w applicable)` (spec 12.2) |
| Threshold P1 | priority ≥ 75 | priority ≥ 80 **y** confidence ≥ 70 (spec 12.3) |
| Threshold P2 | priority ≥ 55 | priority 60-79 y confidence ≥ 60 (spec 12.3) |
| Threshold PENDIENTE | confidence < 25 | confidence < 60 (spec 12.3) |
| Intent | Sumado a mano en Code.gs | Pestaña `08_INTENT_MAP` por form_type |
| NO_SCORABLE | No existía | newsletter/guía/webinar/artículo → NO_SCORABLE |
| Route E | Se scoreaba mal | Marcada PENDIENTE con flag `route_E_requires_expansion_scoring` |
| Model version en flags | `heur_v1` | `v1` (leído de la pestaña, cambia solo con nueva versión) |

## Pasos de deploy (una sola vez)

1. **Copiar los 3 archivos** al editor de Apps Script (el proyecto bound al Sheet nuevo):
   - `setupCRM.gs` → reemplaza el contenido del archivo actual con el mismo nombre.
   - `Code.gs` → reemplaza.
   - `endpoint.gs` → reemplaza (sin cambios funcionales, sirve como snapshot).
   - `emailLead.html` **NO tocar**, sigue igual.

2. **Correr `setupCRMTabs()` una vez** desde el editor (Run → `setupCRMTabs`). Va a:
   - Recrear todas las pestañas (⚠️ **borra data**, correr solo en Sheet limpio).
   - Sembrar los 40 pesos del spec en `04_SCORE_WEIGHTS`.
   - Sembrar 10 form_types en `08_INTENT_MAP`.

   **Si el Sheet ya tiene leads reales**, en vez de `setupCRMTabs()` correr `rebuildScoreConfig()` que solo crea/recarga `04_SCORE_WEIGHTS` y `08_INTENT_MAP` sin tocar el resto.

3. **Deploy → Manage deployments → New version** (misma URL, no cambia `.env`).

4. **Test end-to-end**: mandar un lead desde el sitio con `?utm_source=test_v1` y verificar en `01_LEADS`:
   - Columna `flags` dice `form_web - v1`
   - Columnas `score_alignment`, `score_potential`, `score_intent`, `score_priority`, `score_confidence`, `category` pobladas con la nueva fórmula.
   - Casos a probar:
     - Contacto ruta B con 4 campos completos → debería dar P1 o P2.
     - Contacto ruta B con solo 1 campo → PENDIENTE (confidence < 60).
     - Newsletter → NO_SCORABLE (intent 20, resto vacío).
     - Ruta E → PENDIENTE con flag `route_E_requires_expansion_scoring`.

## Cómo cambiar pesos sin código (para Marketing)

1. Abrir la pestaña `04_SCORE_WEIGHTS` en el Sheet.
2. Para retocar un peso puntual: editar la celda `weight_pct` de la fila correspondiente. **Los cambios se aplican en 5 min** (TTL del cache).
3. Para forzar refresh inmediato: correr `rebuildScoreConfig()` desde Apps Script (invalida el cache).

## Cómo publicar una nueva versión de pesos (v2)

1. En `04_SCORE_WEIGHTS`, duplicar las 40 filas cambiando `version` a `v2`, `is_active = TRUE`, `valid_from = <hoy>`.
2. En las 40 filas v1: `is_active = FALSE`, `valid_to = <hoy>`.
3. Correr `rebuildScoreConfig()` para invalidar cache.
4. Nuevos leads guardan `flags = form_web - v2`. Los históricos mantienen `v1`. Auditable.

## Limitaciones conocidas de V1

- **5 dimensiones del spec no capturadas todavía por el form**: `stage_fit`, `need_severity`, `solution_match`, `process_openness`, `expansion_scope`. Aparecen en `04_SCORE_WEIGHTS` con su peso, pero como el form no las pregunta, no cuentan para la fórmula (numerador ni denominador de confidence). Cuando Fase 2A agregue esos campos al form, empiezan a pesar automáticamente sin tocar código.
- **Route E (`ACCOUNT_EXPANSION`)**: el spec sección 8 pide fórmula distinta (`0.20×account_health + 0.65×expansion_potential + 0.15×intent` + gate por `critical_ticket` y `account_health<50`). V1 no lo implementa, marca esos leads como PENDIENTE con flag `route_E_requires_expansion_scoring` para calificación humana.
- **Hard stops** (`privacy_missing`, `spam_suspected`, competidor, dominio bloqueado) no están implementados todavía. Fase 2A los agrega.

## Estructura de `04_SCORE_WEIGHTS`

| Columna | Tipo | Descripción |
|---|---|---|
| `version` | string | Identificador de versión del modelo (v1, v2, ...) |
| `route_code` | A/B/C/D | Ruta a la que aplica el peso |
| `axis` | alignment/potential | Eje |
| `dimension` | string | Nombre de la dimensión spec 12.1 |
| `weight_pct` | int 0-100 | Peso relativo (suma 100 dentro de axis×route) |
| `is_active` | bool | Si esta versión está activa |
| `valid_from` | date | Fecha de inicio de vigencia |
| `valid_to` | date | Fecha de fin de vigencia (vacío si activa) |
| `notes` | string | Comentarios |

## Estructura de `08_INTENT_MAP`

| Columna | Tipo | Descripción |
|---|---|---|
| `version` | string | Versión del modelo |
| `form_type` | string | Slug del form_type (diagnostico, demo, newsletter, ...) |
| `intent_value` | int 0-100 | Valor fijo de intent (spec 12.1) |
| `scorable` | bool | Si `false`, el form dispara NO_SCORABLE (no calcula P1-P4) |
| `is_active` | bool | Si esta versión está activa |
| `valid_from` | date | Inicio de vigencia |
| `valid_to` | date | Fin de vigencia |
| `notes` | string | Comentarios |
