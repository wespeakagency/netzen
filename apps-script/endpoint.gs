// endpoint.gs — sin cambios respecto a la version anterior. Se versiona en git.

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'leads';

    if (action === 'leads') {
      return jsonResponseGet_(getLeads_());
    }

    if (action === 'metrics') {
      return jsonResponseGet_(getMetrics_());
    }

    if (action === 'catalogs') {
      return jsonResponseGet_(getCatalogs_());
    }

    // Tracking de clicks desde los botones del correo de notificacion.
    // Devuelve HTML (redirect al destino real + estado "contactado" idempotente).
    if (action === 'trackContact') {
      return handleTrackContact_(e);
    }

    return jsonResponseGet_({ error: 'unknown_action', supported: ['leads', 'metrics', 'catalogs', 'trackContact'] });
  } catch (err) {
    return jsonResponseGet_({ error: 'internal_error', message: String(err) });
  }
}

function getLeads_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('01_LEADS');
  if (!sheet) return { leads: [] };

  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return { leads: [] };

  const headers = values[0];
  const leads = values.slice(1).map(function (row) {
    const obj = {};
    headers.forEach(function (h, i) { obj[h] = row[i]; });
    return obj;
  });

  return { leads: leads, count: leads.length, updated_at: new Date().toISOString() };
}

function getMetrics_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('05_METRICS');
  if (!sheet) return { metrics: [] };

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const metrics = values.slice(1).map(function (row) {
    const obj = {};
    headers.forEach(function (h, i) { obj[h] = row[i]; });
    return obj;
  });

  return { metrics: metrics };
}

function getCatalogs_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('03_CATALOGS');
  if (!sheet) return { catalogs: {} };

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const rows = values.slice(1);

  const catalogs = {};
  rows.forEach(function (row) {
    const obj = {};
    headers.forEach(function (h, i) { obj[h] = row[i]; });
    if (!catalogs[obj.catalog_name]) catalogs[obj.catalog_name] = [];
    if (obj.active) catalogs[obj.catalog_name].push({ code: obj.code, label: obj.label });
  });

  return { catalogs: catalogs };
}

function jsonResponseGet_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
