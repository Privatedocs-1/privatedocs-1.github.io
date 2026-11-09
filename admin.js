// =============================================================
//  Panel de edición de la página FBLA 3281.
//  Lee y guarda "contenido.yml" en GitHub usando una llave (token).
//  No necesitas editar este archivo.
// =============================================================

(function () {
  "use strict";

  // Opcional: escribe aquí el usuario y repositorio para que no haya
  // que escribirlos al entrar. Si se dejan vacíos, se adivinan solos.
  var CONFIG = { owner: "fbladcg", repo: "fbladcg.github.io" };

  var ARCHIVO = "contenido.yml";
  var CLAVE_LS = "fbla3281-panel";
  var CABECERA =
    "# ==============================================================\n" +
    "#   CONTENIDO DE LA PÁGINA WEB — FBLA Capítulo 3281\n" +
    "#   Este archivo se edita desde el Panel de edición (admin.html).\n" +
    "#   No hace falta editarlo a mano.\n" +
    "# ==============================================================\n\n";

  // ---------- Partes de la página y sus campos ----------
  var SECCIONES = [
    { key: "anuncios", titulo: "📢 Anuncios", tipo: "lista", item: "anuncio", nuevoArriba: true,
      ayuda: "Avisos para los miembros. El primero de la lista es el que sale primero en la página.",
      campos: [
        { k: "titulo", l: "Título" },
        { k: "fecha", l: "Fecha", ph: "15 de noviembre de 2026" },
        { k: "texto", l: "Mensaje", tipo: "area" }
      ] },
    { key: "eventos", titulo: "📅 Eventos", tipo: "lista", item: "evento",
      ayuda: "Próximas actividades. Ponlas en orden de fecha (la más cercana primero).",
      campos: [
        { k: "nombre", l: "Nombre del evento" },
        { k: "fecha", l: "Fecha", ph: "20 de noviembre de 2026" },
        { k: "hora", l: "Hora (opcional)", ph: "11:00 AM" },
        { k: "lugar", l: "Lugar (opcional)" },
        { k: "descripcion", l: "Descripción (opcional)", tipo: "area" }
      ] },
    { key: "directiva", titulo: "👥 Directiva", tipo: "lista", item: "oficial",
      ayuda: "Oficiales del capítulo y consejero(a). Si no hay foto, se muestran las iniciales.",
      campos: [
        { k: "nombre", l: "Nombre" },
        { k: "puesto", l: "Puesto", ph: "Presidente(a)" },
        { k: "foto", l: "Foto (mejor si es cuadrada)", tipo: "foto" }
      ] },
    { key: "logros", titulo: "🏆 Logros", tipo: "lista", item: "logro", nuevoArriba: true,
      ayuda: "Premios y reconocimientos del capítulo.",
      campos: [
        { k: "titulo", l: "Logro", ph: "1er lugar — Social Media Strategies" },
        { k: "detalle", l: "Detalle", ph: "Conferencia Estatal 2026" }
      ] },
    { key: "galeria", titulo: "📸 Galería", tipo: "lista", item: "foto", nuevoArriba: true,
      ayuda: "Fotos de actividades. Si no hay ninguna, la galería no aparece en la página. Pide permiso antes de publicar fotos de estudiantes.",
      campos: [
        { k: "foto", l: "Foto", tipo: "foto" },
        { k: "descripcion", l: "Descripción" }
      ] },
    { key: "capitulo", titulo: "🏫 Información general", tipo: "objeto",
      ayuda: "Lo que sale en la parte de arriba de la página.",
      campos: [
        { k: "nombre", l: "Nombre del capítulo" },
        { k: "escuela", l: "Escuela" },
        { k: "pueblo", l: "Pueblo" },
        { k: "lema", l: "Lema" },
        { k: "foto_portada", l: "Foto de portada (opcional)", tipo: "foto" },
        { k: "logo", l: "Logo (opcional)", tipo: "foto",
          nota: "Usa solo el logo oficial de FBLA para capítulos (fbla.org/brand-center). No uses el triángulo solo." }
      ] },
    { key: "sobre_nosotros", titulo: "ℹ️ Sobre nosotros", tipo: "objeto",
      ayuda: "Descripción del capítulo y los números grandes.",
      campos: [
        { k: "titulo", l: "Título" },
        { k: "texto", l: "Descripción", tipo: "area" },
        { k: "datos", l: "Números destacados", tipo: "lista", item: "número",
          campos: [
            { k: "numero", l: "Número", ph: "45" },
            { k: "etiqueta", l: "Qué representa", ph: "Miembros" }
          ] }
      ] },
    { key: "unete", titulo: "✋ Únete", tipo: "objeto",
      ayuda: "Invitación para nuevos miembros con el enlace al formulario de solicitud.",
      campos: [
        { k: "activo", l: "Mostrar el botón de unirse en la página", tipo: "check" },
        { k: "titulo", l: "Título" },
        { k: "texto", l: "Texto", tipo: "area" },
        { k: "boton", l: "Texto del botón", ph: "Llenar solicitud" },
        { k: "enlace", l: "Enlace del formulario", ph: "https://forms.gle/...", nota: "Pega el enlace de Google Forms (o el formulario que usen)." }
      ] },
    { key: "contacto", titulo: "✉️ Contacto", tipo: "objeto",
      ayuda: "Si dejas una red social vacía, no aparece en la página.",
      campos: [
        { k: "correo", l: "Correo electrónico" },
        { k: "instagram", l: "Enlace de Instagram", ph: "https://www.instagram.com/..." },
        { k: "facebook", l: "Enlace de Facebook", ph: "https://www.facebook.com/..." },
        { k: "tiktok", l: "Enlace de TikTok", ph: "https://www.tiktok.com/@..." }
      ] }
  ];

  // ---------- Estado ----------
  var datos = {};
  var sha = null;
  var modo = null;          // "github" | "prueba"
  var sesion = { owner: "", repo: "", token: "" };
  var vistas = {};          // ruta de foto -> imagen recién subida
  var actual = SECCIONES[0].key;
  var hayCambios = false;

  var $ = function (id) { return document.getElementById(id); };

  // ---------- Utilidades ----------
  function el(tag, attrs, hijos) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (a) {
      if (a === "texto") n.textContent = attrs[a];
      else if (a.indexOf("on") === 0) n.addEventListener(a.slice(2), attrs[a]);
      else if (attrs[a] !== undefined && attrs[a] !== null && attrs[a] !== false) n.setAttribute(a, attrs[a]);
    });
    (hijos || []).forEach(function (h) { if (h) n.appendChild(typeof h === "string" ? document.createTextNode(h) : h); });
    return n;
  }

  function guardarLS(v) { try { if (v) localStorage.setItem(CLAVE_LS, JSON.stringify(v)); else localStorage.removeItem(CLAVE_LS); } catch (e) {} }
  function leerLS() { try { return JSON.parse(localStorage.getItem(CLAVE_LS) || "null"); } catch (e) { return null; } }

  var tToast;
  function avisar(msg, error) {
    var t = $("toast");
    t.textContent = msg;
    t.className = "toast" + (error ? " toast--error" : "");
    t.hidden = false;
    clearTimeout(tToast);
    tToast = setTimeout(function () { t.hidden = true; }, error ? 7000 : 4000);
  }

  function ocupado(msg) {
    $("ocupado").textContent = msg || "";
    $("ocupado").hidden = !msg;
  }

  function marcarCambio() {
    hayCambios = true;
    $("guardar").disabled = false;
    $("estado").textContent = "● Cambios sin guardar";
  }

  function b64aTexto(b64) {
    var bin = atob(b64.replace(/\s/g, ""));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder("utf-8").decode(bytes);
  }
  function textoAb64(txt) {
    var bytes = new TextEncoder().encode(txt);
    var bin = "";
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }

  function adivinarRepo() {
    var h = location.hostname;
    if (/\.github\.io$/i.test(h)) {
      // Quita el nombre de la página (admin, admin.html, index.html) del final.
      var partes = location.pathname.split("/").filter(Boolean);
      if (partes.length && /^(admin|index)(\.html?)?$/i.test(partes[partes.length - 1])) partes.pop();
      return { owner: h.split(".")[0], repo: partes[0] || h };
    }
    return { owner: "", repo: "" };
  }

  // ---------- GitHub ----------
  function api(ruta, opciones) {
    opciones = opciones || {};
    var url = "https://api.github.com/repos/" + encodeURIComponent(sesion.owner) + "/" +
      encodeURIComponent(sesion.repo) + "/contents/" + ruta.split("/").map(encodeURIComponent).join("/");
    return fetch(url, {
      method: opciones.metodo || "GET",
      cache: "no-store",
      headers: {
        Authorization: "Bearer " + sesion.token,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      },
      body: opciones.cuerpo ? JSON.stringify(opciones.cuerpo) : undefined
    }).then(function (r) {
      if (r.ok) return r.json();
      var e = new Error(mensajeError(r.status));
      e.status = r.status;
      throw e;
    }, function () {
      throw new Error("No hay conexión con GitHub. Revisa tu internet.");
    });
  }

  function mensajeError(status) {
    if (status === 401) return "La llave (token) no es válida o ya expiró. Pide una nueva.";
    if (status === 403) return "La llave no tiene permiso para guardar. Debe tener permiso \"Contents: Read and write\".";
    if (status === 404) return "No se encontró el repositorio. Revisa el usuario y el nombre del repositorio, y que la llave tenga acceso a él.";
    if (status === 409 || status === 422) return "Alguien más guardó cambios hace poco. Recarga el panel (tus cambios no guardados se perderán) e inténtalo otra vez.";
    return "GitHub respondió con un error (" + status + "). Inténtalo otra vez en un momento.";
  }

  // ---------- Entrar / salir ----------
  function iniciar() {
    var g = leerLS();
    var adiv = adivinarRepo();
    $("owner").value = (g && g.owner) || CONFIG.owner || adiv.owner;
    $("repo").value = (g && g.repo) || CONFIG.repo || adiv.repo;
    if (!$("owner").value || !$("repo").value) $("detalles-repo").open = true;

    $("form-login").addEventListener("submit", function (ev) {
      ev.preventDefault();
      sesion = { owner: $("owner").value.trim(), repo: $("repo").value.trim(), token: $("token").value.trim() };
      if (!sesion.owner || !sesion.repo) {
        $("detalles-repo").open = true;
        return errorLogin("Escribe el usuario de GitHub y el nombre del repositorio.");
      }
      entrarGithub($("recordar").checked);
    });
    $("prueba").addEventListener("click", entrarPrueba);
    $("guardar").addEventListener("click", guardar);
    $("salir").addEventListener("click", function () {
      if (hayCambios && !confirm("Tienes cambios sin guardar. ¿Salir de todas formas?")) return;
      guardarLS(null);
      hayCambios = false;
      location.reload();
    });
    window.addEventListener("beforeunload", function (e) {
      if (hayCambios) { e.preventDefault(); e.returnValue = ""; }
    });

    if (g && g.token) {
      sesion = g;
      entrarGithub(true);
    }
  }

  function errorLogin(msg) {
    $("login-error").textContent = msg;
    $("login-error").hidden = false;
  }

  function entrarGithub(recordar) {
    $("login-error").hidden = true;
    ocupado("Cargando contenido…");
    api(ARCHIVO).then(function (r) {
      sha = r.sha;
      cargarTexto(b64aTexto(r.content));
      modo = "github";
      guardarLS(recordar ? sesion : null);
      abrirEditor();
    }).catch(function (e) {
      guardarLS(null);
      errorLogin(e.message);
    }).then(function () { ocupado(null); });
  }

  function entrarPrueba() {
    ocupado("Cargando contenido…");
    fetch(ARCHIVO + "?v=" + Date.now()).then(function (r) {
      if (!r.ok) throw new Error("No se encontró contenido.yml.");
      return r.text();
    }).then(function (txt) {
      cargarTexto(txt);
      modo = "prueba";
      abrirEditor();
    }).catch(function (e) { errorLogin(e.message); })
      .then(function () { ocupado(null); });
  }

  function cargarTexto(txt) {
    try {
      datos = jsyaml.load(txt) || {};
    } catch (e) {
      throw new Error("El archivo contenido.yml tiene un error y no se pudo leer (línea " +
        (e.mark ? e.mark.line + 1 : "?") + "). Pide ayuda para arreglarlo en GitHub.");
    }
  }

  function abrirEditor() {
    $("login").hidden = true;
    $("editor").hidden = false;
    $("botones").hidden = false;
    $("guardar").textContent = modo === "github" ? "💾 Guardar cambios" : "⬇ Descargar archivo";
    $("estado").textContent = modo === "github" ? "Todo guardado" : "Modo prueba";
    pintarPestanas();
    pintar();
  }

  // ---------- Pintar ----------
  function pintarPestanas() {
    var nav = $("pestanas");
    nav.innerHTML = "";
    SECCIONES.forEach(function (s) {
      nav.appendChild(el("button", {
        class: "pestana", role: "tab", "aria-selected": s.key === actual ? "true" : "false", texto: s.titulo,
        onclick: function () { actual = s.key; pintarPestanas(); pintar(); window.scrollTo(0, 0); }
      }));
    });
  }

  function pintar() {
    var s = SECCIONES.filter(function (x) { return x.key === actual; })[0];
    var panel = $("panel");
    panel.innerHTML = "";
    if (modo === "prueba") {
      panel.appendChild(el("div", { class: "aviso" }, [
        "Estás en modo prueba: los cambios no se publican. El botón de arriba descarga el archivo contenido.yml para subirlo a mano a GitHub."
      ]));
    }
    panel.appendChild(el("h2", { texto: s.titulo }));
    panel.appendChild(el("p", { class: "ayuda", texto: s.ayuda }));

    if (s.tipo === "lista") {
      if (!Array.isArray(datos[s.key])) datos[s.key] = [];
      panel.appendChild(lista(datos, s.key, s));
    } else {
      if (!datos[s.key] || typeof datos[s.key] !== "object") datos[s.key] = {};
      s.campos.forEach(function (c) { panel.appendChild(campo(datos[s.key], c)); });
    }
  }

  function lista(padre, key, def) {
    if (!Array.isArray(padre[key])) padre[key] = [];
    var arr = padre[key];
    var cont = el("div", { class: def.k ? "sublista" : null });

    function redibujar() {
      var nuevo = lista(padre, key, def);
      cont.replaceWith(nuevo);
      return nuevo;
    }

    var caja = el("div", { class: "lista" });
    if (!arr.length) {
      caja = el("div", { class: "vacio", texto: "No hay ningún " + def.item + " todavía." });
    }
    arr.forEach(function (obj, i) {
      if (!obj || typeof obj !== "object") obj = arr[i] = {};
      var resumen = def.campos.map(function (c) { return c.tipo === "foto" ? "" : obj[c.k]; }).filter(Boolean)[0] || "";
      var cab = el("div", { class: "item__cabeza" }, [
        el("span", { class: "item__nombre", texto: mayus(def.item) + " " + (i + 1) + (resumen ? " — " + resumen : "") }),
        el("button", { class: "btn btn--icono", type: "button", title: "Subir", "aria-label": "Mover arriba", disabled: i === 0,
          onclick: function () { arr.splice(i - 1, 0, arr.splice(i, 1)[0]); marcarCambio(); redibujar(); } }, ["↑"]),
        el("button", { class: "btn btn--icono", type: "button", title: "Bajar", "aria-label": "Mover abajo", disabled: i === arr.length - 1,
          onclick: function () { arr.splice(i + 1, 0, arr.splice(i, 1)[0]); marcarCambio(); redibujar(); } }, ["↓"]),
        el("button", { class: "btn btn--peligro btn--chico", type: "button",
          onclick: function () {
            if (!confirm("¿Eliminar " + (def.item === "foto" ? "esta foto" : "este " + def.item) + (resumen ? " (\"" + resumen + "\")" : "") + "?")) return;
            arr.splice(i, 1); marcarCambio(); redibujar();
          } }, ["🗑 Eliminar"])
      ]);
      var cuerpo = el("div", { class: "item__cuerpo" });
      def.campos.forEach(function (c) { cuerpo.appendChild(campo(obj, c)); });
      cuerpo.addEventListener("input", function () {
        var r = def.campos.map(function (c) { return c.tipo === "foto" || c.tipo === "lista" ? "" : obj[c.k]; }).filter(Boolean)[0] || "";
        cab.firstChild.textContent = mayus(def.item) + " " + (i + 1) + (r ? " — " + r : "");
      });
      caja.appendChild(el("div", { class: "item" }, [cab, cuerpo]));
    });
    cont.appendChild(caja);

    cont.appendChild(el("button", {
      class: "btn btn--grande", type: "button",
      onclick: function () {
        var nuevo = {};
        def.campos.forEach(function (c) { nuevo[c.k] = c.tipo === "check" ? true : ""; });
        if (def.nuevoArriba) arr.unshift(nuevo); else arr.push(nuevo);
        marcarCambio();
        var items = redibujar().querySelectorAll(":scope > .lista > .item");
        var objetivo = def.nuevoArriba ? items[0] : items[items.length - 1];
        if (objetivo) {
          objetivo.scrollIntoView({ block: "center" });
          var primer = objetivo.querySelector("input[type=text], textarea");
          if (primer) primer.focus();
        }
      }
    }, ["＋ Añadir " + def.item]));
    return cont;
  }

  function mayus(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  var contador = 0;
  function campo(obj, c) {
    var id = "c" + (++contador);
    var tipo = c.tipo || "texto";

    if (tipo === "lista") {
      return el("div", { class: "campo" }, [el("span", { class: "campo__titulo", texto: c.l }), lista(obj, c.k, c)]);
    }
    if (tipo === "check") {
      if (obj[c.k] === undefined) obj[c.k] = true;
      return el("div", { class: "campo" }, [el("label", { class: "check" }, [
        el("input", { type: "checkbox", id: id, checked: obj[c.k] !== false,
          onchange: function (e) { obj[c.k] = e.target.checked; marcarCambio(); } }),
        c.l
      ])]);
    }
    if (tipo === "foto") return campoFoto(obj, c);

    var valor = obj[c.k] === undefined || obj[c.k] === null ? "" : String(obj[c.k]);
    var entrada = tipo === "area"
      ? el("textarea", { id: id, placeholder: c.ph })
      : el("input", { type: "text", id: id, placeholder: c.ph });
    entrada.value = valor;
    entrada.addEventListener("input", function () { obj[c.k] = entrada.value; marcarCambio(); });
    return el("div", { class: "campo" }, [
      el("label", { for: id, texto: c.l }), entrada,
      c.nota ? el("p", { class: "campo__nota", texto: c.nota }) : null
    ]);
  }

  function campoFoto(obj, c) {
    var cont = el("div", { class: "campo" });
    function dibujar() {
      cont.innerHTML = "";
      var ruta = obj[c.k] || "";
      var vista = ruta
        ? el("img", { class: "foto__vista", src: vistas[ruta] || ruta, alt: "" })
        : el("div", { class: "foto__vista", texto: "Sin foto" });
      if (ruta) vista.addEventListener("error", function () {
        vista.replaceWith(el("div", { class: "foto__vista", texto: "Foto subida (aparece en unos minutos)" }));
      });
      var archivo = el("input", { type: "file", accept: "image/*", hidden: true });
      archivo.addEventListener("change", function () {
        if (archivo.files[0]) subirFoto(archivo.files[0]).then(function (r) {
          if (!r) return;
          obj[c.k] = r;
          marcarCambio();
          dibujar();
        });
      });
      cont.appendChild(el("span", { class: "campo__titulo", texto: c.l }));
      cont.appendChild(el("div", { class: "foto" }, [
        vista,
        el("div", { class: "foto__botones" }, [
          el("button", { class: "btn btn--azul btn--chico", type: "button", onclick: function () { archivo.click(); } },
            [ruta ? "Cambiar foto" : "Subir foto"]),
          ruta ? el("button", { class: "btn btn--borde btn--chico", type: "button",
            onclick: function () { obj[c.k] = ""; marcarCambio(); dibujar(); } }, ["Quitar foto"]) : null
        ]),
        archivo,
        ruta ? el("span", { class: "foto__ruta", texto: ruta }) : null
      ]));
      if (c.nota) cont.appendChild(el("p", { class: "campo__nota", texto: c.nota }));
    }
    dibujar();
    return cont;
  }

  // ---------- Fotos ----------
  function nombreSeguro(nombre, ext) {
    var base = nombre.replace(/\.[^.]+$/, "").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "foto";
    return base + "-" + Date.now().toString(36) + "." + ext;
  }

  function prepararImagen(file) {
    return new Promise(function (ok, mal) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var max = 1600;
        var s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        var c = document.createElement("canvas");
        c.width = Math.round(img.naturalWidth * s);
        c.height = Math.round(img.naturalHeight * s);
        var png = file.type === "image/png";
        var ctx = c.getContext("2d");
        if (!png) { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); }
        ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        ok({ dataUrl: c.toDataURL(png ? "image/png" : "image/jpeg", 0.85), ext: png ? "png" : "jpg" });
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        mal(new Error("No se pudo abrir la imagen. Usa una foto JPG o PNG."));
      };
      img.src = url;
    });
  }

  function subirFoto(file) {
    ocupado("Subiendo foto…");
    return prepararImagen(file).then(function (img) {
      var ruta = "fotos/" + nombreSeguro(file.name, img.ext);
      vistas[ruta] = img.dataUrl;
      if (modo !== "github") {
        avisar("Modo prueba: la foto no se sube. Súbela a mano a la carpeta fotos con el nombre " + ruta.slice(6));
        return ruta;
      }
      return api(ruta, { metodo: "PUT", cuerpo: { message: "Foto nueva: " + ruta, content: img.dataUrl.split(",")[1] } })
        .then(function () {
          avisar("Foto subida. No olvides darle a «Guardar cambios».");
          return ruta;
        });
    }).catch(function (e) {
      avisar(e.message, true);
      return null;
    }).then(function (r) { ocupado(null); return r; });
  }

  // ---------- Guardar ----------
  function vacio(v) {
    return v === undefined || v === null || (typeof v === "string" && v.trim() === "");
  }

  function limpiar(def, valor) {
    // Quita de las listas los elementos que quedaron completamente vacíos.
    if (def.tipo === "lista" || Array.isArray(valor)) {
      if (!Array.isArray(valor)) valor = [];
      return valor.map(function (o) { return limpiarObjeto(def.campos, o); })
        .filter(function (o) {
          return def.campos.some(function (c) {
            if (c.tipo === "check") return false;
            if (c.tipo === "lista") return o[c.k] && o[c.k].length;
            return !vacio(o[c.k]);
          });
        });
    }
    return limpiarObjeto(def.campos, valor || {});
  }
  function limpiarObjeto(campos, o) {
    var r = {};
    Object.keys(o || {}).forEach(function (k) { r[k] = o[k]; });
    campos.forEach(function (c) {
      if (c.tipo === "lista") r[c.k] = limpiar(c, r[c.k] || []);
      else if (c.tipo === "check") r[c.k] = r[c.k] !== false;
      else r[c.k] = vacio(r[c.k]) ? "" : String(r[c.k]).trim();
    });
    return r;
  }

  function generarYaml() {
    var salida = {};
    Object.keys(datos).forEach(function (k) { salida[k] = datos[k]; });
    SECCIONES.forEach(function (s) { salida[s.key] = limpiar(s, datos[s.key]); });
    return CABECERA + jsyaml.dump(salida, { lineWidth: -1, noRefs: true, quotingType: '"' });
  }

  function guardar() {
    var yaml = generarYaml();
    if (modo !== "github") {
      var a = el("a", { href: URL.createObjectURL(new Blob([yaml], { type: "text/yaml" })), download: "contenido.yml" });
      document.body.appendChild(a); a.click(); a.remove();
      avisar("Archivo descargado.");
      return;
    }
    ocupado("Guardando…");
    api(ARCHIVO, { metodo: "PUT", cuerpo: {
      message: "Contenido actualizado desde el panel",
      content: textoAb64(yaml),
      sha: sha
    } }).then(function (r) {
      sha = r.content.sha;
      hayCambios = false;
      $("guardar").disabled = true;
      $("estado").textContent = "Todo guardado";
      avisar("¡Guardado! La página se actualiza en 1 o 2 minutos.");
    }).catch(function (e) {
      avisar(e.message, true);
    }).then(function () { ocupado(null); });
  }

  iniciar();
})();
