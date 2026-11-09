/**
 * =============================================================
 *  FBLA 3281 — Recibir fotos de miembros y contar visitas
 *  Este script vive en Google Apps Script (script.google.com).
 *  Guarda las fotos que envían los miembros en una carpeta
 *  PRIVADA de Google Drive hasta que el admin las aprueba en el
 *  Panel de edición.
 *
 *  INSTALACIÓN (una sola vez): ver GUIA.md, parte D.
 *
 *  ¿Quién puede aprobar? Solo quien entre al panel con un token de
 *  GitHub que tenga permiso para escribir en el repositorio de la
 *  página. El script se lo pregunta a GitHub; no hay claves extra.
 *
 *  Opcional (Configuración del proyecto ⚙ → Propiedades de la
 *  secuencia de comandos):
 *    CODIGO_MIEMBROS = código que los miembros deben escribir para
 *                      enviar fotos. Si no existe, no se pide código.
 * =============================================================
 */

var REPO = 'fbladcg/fbladcg.github.io';       // repositorio de la página
var NOMBRE_CARPETA = 'FBLA 3281 - Fotos de miembros';
var MAX_PENDIENTES = 300;                     // límite de fotos esperando aprobación

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.accion === 'visita') {
    registrarVisita(p.p);
    return salida({ ok: true });
  }
  var codigo = PropertiesService.getScriptProperties().getProperty('CODIGO_MIEMBROS');
  return salida({ ok: true, servicio: 'Fotos de FBLA 3281', pideCodigo: !!(codigo && codigo.trim()) });
}

// ---------- Conteo de visitas (sin cookies ni datos personales) ----------
// Se guarda: total, visitas por día (último año) y visitas por página.
function registrarVisita(pagina) {
  pagina = String(pagina || 'inicio').replace(/[^\w:\-]/g, '').slice(0, 60) || 'inicio';
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;
  try {
    var props = PropertiesService.getScriptProperties();
    var v = leerVisitas(props);
    var hoy = Utilities.formatDate(new Date(), 'America/Puerto_Rico', 'yyyy-MM-dd');
    if (pagina === 'inicio') {
      v.total = (v.total || 0) + 1;
      v.dias[hoy] = (v.dias[hoy] || 0) + 1;
    }
    v.paginas[pagina] = (v.paginas[pagina] || 0) + 1;
    // Guardar solo los últimos 400 días y las 60 páginas más vistas
    var dias = Object.keys(v.dias).sort();
    while (dias.length > 400) delete v.dias[dias.shift()];
    var pags = Object.keys(v.paginas).sort(function (a, b) { return v.paginas[b] - v.paginas[a]; });
    pags.slice(60).forEach(function (k) { delete v.paginas[k]; });
    props.setProperty('VISITAS', JSON.stringify(v));
  } finally {
    lock.releaseLock();
  }
}

function leerVisitas(props) {
  var v = {};
  try { v = JSON.parse(props.getProperty('VISITAS') || '{}'); } catch (e) {}
  v.total = v.total || 0; v.dias = v.dias || {}; v.paginas = v.paginas || {};
  return v;
}

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var r;
    if (d.accion === 'subir') {
      r = subir(d);
    } else {
      verificarAdmin(d.token);
      if (d.accion === 'pendientes') r = pendientes();
      else if (d.accion === 'foto') r = foto(d.id);
      else if (d.accion === 'resolver') r = resolver(d.id, d.aprobar === true);
      else if (d.accion === 'visitas') r = { visitas: leerVisitas(PropertiesService.getScriptProperties()),
        hoy: Utilities.formatDate(new Date(), 'America/Puerto_Rico', 'yyyy-MM-dd') };
      else throw new Error('Acción desconocida.');
    }
    r = r || {};
    r.ok = true;
    return salida(r);
  } catch (err) {
    return salida({ ok: false, error: String((err && err.message) || err) });
  }
}

function salida(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Le pregunta a GitHub si el token puede escribir en el repositorio de la página.
// El resultado se recuerda 10 minutos para no preguntar en cada foto.
function verificarAdmin(token) {
  token = String(token || '').trim();
  if (!token) throw new Error('No autorizado: entra al panel con tu token de GitHub.');
  var huella = Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token));
  var cache = CacheService.getScriptCache();
  if (cache.get('ok_' + huella)) return;

  var r = UrlFetchApp.fetch('https://api.github.com/repos/' + REPO, {
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    muteHttpExceptions: true
  });
  var permisos = null;
  if (r.getResponseCode() === 200) {
    try { permisos = JSON.parse(r.getContentText()).permissions; } catch (e) {}
  }
  if (!permisos || !(permisos.push || permisos.maintain || permisos.admin)) {
    throw new Error('No autorizado: tu token de GitHub no tiene permiso para editar la página.');
  }
  cache.put('ok_' + huella, '1', 600);
}

function carpeta(nombre) {
  var raiz = obtener(DriveApp.getRootFolder(), NOMBRE_CARPETA);
  return nombre ? obtener(raiz, nombre) : raiz;
}

function obtener(padre, nombre) {
  var it = padre.getFoldersByName(nombre);
  return it.hasNext() ? it.next() : padre.createFolder(nombre);
}

function limpio(texto, max) {
  return String(texto || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}

function subir(d) {
  var codigo = PropertiesService.getScriptProperties().getProperty('CODIGO_MIEMBROS');
  if (codigo && codigo.trim() && limpio(d.codigo, 100).toLowerCase() !== codigo.trim().toLowerCase()) {
    throw new Error('El código del capítulo no es correcto.');
  }
  if (!/^image\/(jpeg|png)$/.test(String(d.tipo))) throw new Error('Solo se aceptan fotos JPG o PNG.');
  if (!limpio(d.nombre, 80)) throw new Error('Escribe tu nombre.');

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var dest = carpeta('Pendientes');
    var n = 0, it = dest.getFiles();
    while (it.hasNext()) { it.next(); n++; }
    if (n >= MAX_PENDIENTES) throw new Error('Hay demasiadas fotos esperando aprobación. Inténtalo más tarde.');

    var bytes = Utilities.base64Decode(String(d.datos || ''));
    if (!bytes.length) throw new Error('La foto llegó vacía.');

    var nombre = Utilities.formatDate(new Date(), 'America/Puerto_Rico', 'yyyyMMdd-HHmmss') + '-' +
      limpio(d.archivo, 60).replace(/[^\w.\-]/g, '_');
    var archivo = dest.createFile(Utilities.newBlob(bytes, d.tipo, nombre));
    archivo.setDescription(JSON.stringify({
      album: limpio(d.album, 80),
      albumTitulo: limpio(d.albumTitulo, 120),
      nombre: limpio(d.nombre, 80),
      nota: limpio(d.nota, 300),
      archivo: limpio(d.archivo, 80),
      fecha: new Date().toISOString()
    }));
  } finally {
    lock.releaseLock();
  }
  return {};
}

function pendientes() {
  var fotos = [];
  var it = carpeta('Pendientes').getFiles();
  while (it.hasNext()) {
    var f = it.next();
    var meta = {};
    try { meta = JSON.parse(f.getDescription() || '{}'); } catch (e) {}
    meta.id = f.getId();
    meta.tamano = f.getSize();
    fotos.push(meta);
  }
  fotos.sort(function (a, b) { return String(a.fecha).localeCompare(String(b.fecha)); });
  return { fotos: fotos };
}

function archivoPendiente(id) {
  var f = DriveApp.getFileById(String(id));
  var padres = f.getParents();
  var pend = carpeta('Pendientes').getId();
  while (padres.hasNext()) if (padres.next().getId() === pend) return f;
  throw new Error('Esa foto ya no está pendiente.');
}

function foto(id) {
  var f = archivoPendiente(id);
  var blob = f.getBlob();
  return { tipo: blob.getContentType(), datos: Utilities.base64Encode(blob.getBytes()) };
}

// Aprobada o rechazada, la foto sale de Drive (va a la papelera; Google la borra a los 30 días).
// Las aprobadas ya quedaron guardadas en la página, así que no hace falta conservarlas aquí.
function resolver(id, aprobar) {
  var f = archivoPendiente(id);
  f.setTrashed(true);
  return { aprobada: aprobar };
}

// Ejecuta esta función UNA VEZ desde el editor (▷ Ejecutar) para darle al
// script los permisos de Drive y de conectarse con GitHub.
function autorizar() {
  UrlFetchApp.fetch('https://api.github.com/zen');
  carpeta('Pendientes');
  Logger.log('¡Listo! Permisos concedidos.');
}
