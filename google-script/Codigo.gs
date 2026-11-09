/**
 * =============================================================
 *  FBLA 3281 — Recibir fotos de miembros
 *  Este script vive en Google Apps Script (script.google.com).
 *  Guarda las fotos que envían los miembros en una carpeta
 *  PRIVADA de Google Drive hasta que el admin las aprueba en el
 *  Panel de edición.
 *
 *  INSTALACIÓN (una sola vez): ver GUIA.md, parte D.
 *
 *  Configuración (Configuración del proyecto ⚙ → Propiedades
 *  de la secuencia de comandos):
 *    CLAVE_ADMIN      = clave secreta para aprobar fotos (obligatoria)
 *    CODIGO_MIEMBROS  = código que se comparte con los miembros (opcional,
 *                       recomendado para evitar fotos de desconocidos)
 * =============================================================
 */

var NOMBRE_CARPETA = 'FBLA 3281 - Fotos de miembros';
var MAX_BYTES = 8 * 1024 * 1024;   // 8 MB por foto
var MAX_PENDIENTES = 300;          // límite de fotos esperando aprobación

function doGet() {
  return salida({ ok: true, mensaje: 'Servicio de fotos de FBLA 3281 activo.' });
}

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var props = PropertiesService.getScriptProperties();
    var r;
    if (d.accion === 'subir') {
      r = subir(d, props);
    } else {
      var clave = props.getProperty('CLAVE_ADMIN');
      if (!clave) throw new Error('Falta configurar CLAVE_ADMIN en el script.');
      if (String(d.clave || '') !== clave) throw new Error('La clave de aprobación no es correcta.');
      if (d.accion === 'pendientes') r = pendientes();
      else if (d.accion === 'foto') r = foto(d.id);
      else if (d.accion === 'resolver') r = resolver(d.id, d.aprobar === true);
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

function subir(d, props) {
  var codigo = props.getProperty('CODIGO_MIEMBROS');
  if (codigo && limpio(d.codigo, 100).toLowerCase() !== codigo.trim().toLowerCase()) {
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
    if (bytes.length > MAX_BYTES) throw new Error('La foto es demasiado grande.');

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

function resolver(id, aprobar) {
  var f = archivoPendiente(id);
  if (aprobar) f.moveTo(carpeta('Aprobadas'));
  else f.setTrashed(true);
  return {};
}
