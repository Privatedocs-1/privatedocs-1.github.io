// =============================================================
//  Panel de edición de la página FBLA 3281.
//  Lee y guarda "contenido.yml" y las fotos en GitHub usando una
//  llave (token). No necesitas editar este archivo.
// =============================================================

(function () {
  "use strict";

  // Usuario y repositorio de GitHub donde vive la página.
  var CONFIG = { owner: "fbladcg", repo: "fbladcg.github.io" };

  var ARCHIVO = "contenido.yml";
  var CLAVE_LS = "fbla3281-panel";
  var CLAVE_LS_APROBAR = "fbla3281-clave-aprobacion";
  var MAX_LADO = 2000;   // tamaño máximo (px) de las fotos que se suben
  var CABECERA =
    "# ==============================================================\n" +
    "#   CONTENIDO DE LA PÁGINA WEB — FBLA Capítulo 3281\n" +
    "#   Este archivo se edita desde el Panel de edición (admin.html).\n" +
    "#   No hace falta editarlo a mano.\n" +
    "# ==============================================================\n\n";

  var CAMPOS_FOTO_ALBUM = [
    { k: "foto", l: "Foto", tipo: "foto" },
    { k: "descripcion", l: "Descripción" },
    { k: "autor", l: "Autor" }
  ];

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
    { key: "albumes", titulo: "📸 Álbumes de fotos", tipo: "albumes", item: "álbum",
      ayuda: "Crea un álbum por cada evento, sube las fotos y márcalo como «Publicado» cuando esté listo. Los visitantes pueden ver y descargar las fotos.",
      campos: [
        { k: "id", tipo: "oculto" },
        { k: "titulo", l: "Nombre del evento" },
        { k: "fecha", l: "Fecha", ph: "20 de noviembre de 2026" },
        { k: "lugar", l: "Lugar (opcional)" },
        { k: "descripcion", l: "Descripción (opcional)", tipo: "area" },
        { k: "publicado", l: "Publicado (se ve en la página)", tipo: "check", def: false },
        { k: "portada", tipo: "oculto" },
        { k: "fotos", tipo: "lista", oculto: true, campos: CAMPOS_FOTO_ALBUM }
      ] },
    { key: "subidas", titulo: "📤 Fotos de miembros", tipo: "miembros",
      ayuda: "Los miembros pueden enviar fotos para un álbum. Llegan a una carpeta privada de Google Drive y solo se publican cuando las apruebas aquí.",
      campos: [
        { k: "activo", l: "Permitir que los miembros envíen fotos", tipo: "check", def: false },
        { k: "url", l: "Enlace del script de Google (termina en /exec)", ph: "https://script.google.com/macros/s/.../exec",
          nota: "Lo obtienes una sola vez al instalar el script. Las instrucciones están en GUIA.md." }
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
    { key: "instagram", titulo: "📷 Instagram", tipo: "objeto",
      ayuda: "La página muestra solas las publicaciones más recientes de Instagram usando el feed de Behold.so. No tienes que hacer nada cuando publiquen algo nuevo: aparece solo (Behold se actualiza una vez al día).",
      campos: [
        { k: "titulo", l: "Título de la sección", ph: "Síguenos en Instagram" },
        { k: "behold", l: "Enlace del feed de Behold", tipo: "behold", ph: "https://feeds.behold.so/...",
          nota: "En behold.so → tu feed → «Embed» / «JSON» → copia el enlace que empieza con https://feeds.behold.so/" },
        { k: "cantidad", l: "Cuántas publicaciones mostrar", ph: "2" },
        { k: "publicaciones", l: "Publicaciones de respaldo (opcional)", tipo: "lista", item: "publicación", nuevoArriba: true,
          nota: "Solo se usan si Behold no responde. En Instagram: «⋯» o «Compartir» → «Copiar enlace».",
          campos: [{ k: "enlace", l: "Enlace de la publicación", tipo: "instagram", ph: "https://www.instagram.com/p/..." }] }
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
  var rutasOriginales = {};  // fotos que había al cargar (para borrar las que se quiten)
  var sha = null;            // versión de contenido.yml que se cargó
  var rama = "main";
  var modo = null;           // "github" | "prueba"
  var sesion = { owner: "", repo: "", token: "" };
  var vistas = {};           // ruta de foto -> imagen en memoria (para verla antes de publicar)
  var porSubir = {};         // ruta de foto -> contenido (base64) que se sube al guardar
  var aprobadas = [];        // fotos de miembros aprobadas que se confirman al guardar
  var pendientes = null;     // fotos de miembros esperando aprobación
  var actual = SECCIONES[0].key;
  var albumAbierto = null;
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

  function ls(clave, v) {
    try {
      if (arguments.length === 1) return JSON.parse(localStorage.getItem(clave) || "null");
      if (v) localStorage.setItem(clave, JSON.stringify(v)); else localStorage.removeItem(clave);
    } catch (e) { return null; }
  }

  var tToast;
  function avisar(msg, error) {
    var t = $("toast");
    t.textContent = msg;
    t.className = "toast" + (error ? " toast--error" : "");
    t.hidden = false;
    clearTimeout(tToast);
    tToast = setTimeout(function () { t.hidden = true; }, error ? 8000 : 4500);
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

  function mayus(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function vacio(v) {
    return v === undefined || v === null || (typeof v === "string" && v.trim() === "");
  }

  function adivinarRepo() {
    var h = location.hostname;
    if (/\.github\.io$/i.test(h)) {
      var partes = location.pathname.split("/").filter(Boolean);
      if (partes.length && /^(admin|index)(\.html?)?$/i.test(partes[partes.length - 1])) partes.pop();
      return { owner: h.split(".")[0], repo: partes[0] || h };
    }
    return { owner: "", repo: "" };
  }

  // Todas las rutas "fotos/..." que se usan en el contenido.
  function rutasFotos(valor, acc) {
    acc = acc || {};
    if (typeof valor === "string") { if (/^fotos\//.test(valor)) acc[valor] = true; }
    else if (Array.isArray(valor)) valor.forEach(function (v) { rutasFotos(v, acc); });
    else if (valor && typeof valor === "object") Object.keys(valor).forEach(function (k) { rutasFotos(valor[k], acc); });
    return acc;
  }

  function enlaceInstagram(url) {
    var m = String(url || "").trim().match(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:[\w.]+\/)?(p|reel|tv)\/([\w-]+)/i);
    return m ? "https://www.instagram.com/" + m[1].toLowerCase() + "/" + m[2] + "/" : "";
  }

  // ---------- GitHub ----------
  function gh(ruta, metodo, cuerpo) {
    var url = "https://api.github.com/repos/" + encodeURIComponent(sesion.owner) + "/" +
      encodeURIComponent(sesion.repo) + (ruta ? "/" + ruta : "");
    return fetch(url, {
      method: metodo || "GET",
      cache: "no-store",
      headers: {
        Authorization: "Bearer " + sesion.token,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined
    }).then(function (r) {
      if (r.ok) return r.json();
      var e = new Error(mensajeError(r.status));
      e.status = r.status;
      throw e;
    }, function () {
      throw new Error("No hay conexión con GitHub. Revisa tu internet.");
    });
  }

  function rutaContenido(ruta, ref) {
    return "contents/" + ruta.split("/").map(encodeURIComponent).join("/") + (ref ? "?ref=" + encodeURIComponent(ref) : "");
  }

  function mensajeError(status) {
    if (status === 401) return "La llave (token) no es válida o ya expiró. Pide una nueva.";
    if (status === 403) return "La llave no tiene permiso para guardar. Debe tener permiso \"Contents: Read and write\" (y estar aprobada en la organización).";
    if (status === 404) return "No se encontró el repositorio. Revisa el usuario y el nombre del repositorio, y que la llave tenga acceso a él.";
    if (status === 409 || status === 422) return "Alguien más guardó cambios hace poco. Recarga el panel (tus cambios no guardados se perderán) e inténtalo otra vez.";
    return "GitHub respondió con un error (" + status + "). Inténtalo otra vez en un momento.";
  }

  // ---------- Script de Google (fotos de miembros) ----------
  function urlScript() {
    var u = String((datos.subidas || {}).url || "").trim();
    return /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(u) ? u : "";
  }

  function script(accion, extra) {
    var url = urlScript();
    if (!url) return Promise.reject(new Error("Primero pega el enlace del script de Google (termina en /exec)."));
    if (modo !== "github" || !sesion.token) return Promise.reject(new Error("Entra al panel con tu token de GitHub para ver las fotos de miembros."));
    // El script verifica con GitHub que este token puede editar la página.
    var cuerpo = { accion: accion, token: sesion.token };
    Object.keys(extra || {}).forEach(function (k) { cuerpo[k] = extra[k]; });
    return fetch(url, { method: "POST", body: JSON.stringify(cuerpo) })
      .then(function (r) { return r.json(); }, function () {
        throw new Error("No se pudo conectar con el script de Google. Revisa el enlace y tu internet.");
      })
      .then(function (j) {
        if (!j || !j.ok) throw new Error((j && j.error) || "El script de Google respondió con un error.");
        return j;
      });
  }

  // ---------- Entrar / salir ----------
  function iniciar() {
    var g = ls(CLAVE_LS);
    var adiv = adivinarRepo();
    $("owner").value = CONFIG.owner || (g && g.owner) || adiv.owner;
    $("repo").value = CONFIG.repo || (g && g.repo) || adiv.repo;
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
      ls(CLAVE_LS, null);
      ls(CLAVE_LS_APROBAR, null);
      hayCambios = false;
      location.reload();
    });
    window.addEventListener("beforeunload", function (e) {
      if (hayCambios) { e.preventDefault(); e.returnValue = ""; }
    });

    if (g && g.token) {
      sesion = { owner: $("owner").value, repo: $("repo").value, token: g.token };
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
    gh("").then(function (repo) {
      rama = repo.default_branch || "main";
      return gh(rutaContenido(ARCHIVO, rama));
    }).then(function (r) {
      sha = r.sha;
      cargarTexto(b64aTexto(r.content));
      modo = "github";
      ls(CLAVE_LS, recordar ? sesion : null);
      abrirEditor();
    }).catch(function (e) {
      ls(CLAVE_LS, null);
      errorLogin(e.message);
    }).then(function () { ocupado(null); });
  }

  function entrarPrueba() {
    ocupado("Cargando contenido…");
    fetch(ARCHIVO + "?v=" + Date.now(), { cache: "no-store" }).then(function (r) {
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
    // La galería vieja (sin álbumes) se convierte en un álbum.
    if (Array.isArray(datos.galeria)) {
      var viejas = datos.galeria.filter(function (g) { return g && g.foto; });
      if (viejas.length) {
        if (!Array.isArray(datos.albumes)) datos.albumes = [];
        datos.albumes.push({ id: "galeria", titulo: "Galería", fecha: "", lugar: "", descripcion: "", publicado: true, portada: "", fotos: viejas });
      }
      delete datos.galeria;
    }
    rutasOriginales = rutasFotos(datos);
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
        onclick: function () { actual = s.key; albumAbierto = null; pintarPestanas(); pintar(); window.scrollTo(0, 0); }
      }));
    });
  }

  function pintar() {
    var s = SECCIONES.filter(function (x) { return x.key === actual; })[0];
    var panel = $("panel");
    panel.innerHTML = "";
    if (modo === "prueba") {
      panel.appendChild(el("div", { class: "aviso" }, [
        "Estás en modo prueba: los cambios no se publican. El botón de arriba descarga el archivo contenido.yml (sin las fotos nuevas)."
      ]));
    }
    if (s.tipo === "albumes") return pintarAlbumes(panel, s);

    panel.appendChild(el("h2", { texto: s.titulo }));
    panel.appendChild(el("p", { class: "ayuda", texto: s.ayuda }));

    if (s.tipo === "lista") {
      if (!Array.isArray(datos[s.key])) datos[s.key] = [];
      panel.appendChild(lista(datos, s.key, s));
      return;
    }
    if (!datos[s.key] || typeof datos[s.key] !== "object") datos[s.key] = {};
    s.campos.forEach(function (c) { panel.appendChild(campo(datos[s.key], c)); });
    if (s.tipo === "miembros") pintarMiembros(panel);
  }

  function resumenDe(def, obj) {
    return def.campos.map(function (c) {
      return c.tipo === "foto" || c.tipo === "lista" || c.tipo === "oculto" ? "" : obj[c.k];
    }).filter(Boolean)[0] || "";
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
      var resumen = resumenDe(def, obj);
      var cab = el("div", { class: "item__cabeza" }, [
        el("span", { class: "item__nombre", texto: mayus(def.item) + " " + (i + 1) + (resumen ? " — " + resumen : "") }),
        el("button", { class: "btn btn--icono", type: "button", title: "Subir", "aria-label": "Mover arriba", disabled: i === 0,
          onclick: function () { arr.splice(i - 1, 0, arr.splice(i, 1)[0]); marcarCambio(); redibujar(); } }, ["↑"]),
        el("button", { class: "btn btn--icono", type: "button", title: "Bajar", "aria-label": "Mover abajo", disabled: i === arr.length - 1,
          onclick: function () { arr.splice(i + 1, 0, arr.splice(i, 1)[0]); marcarCambio(); redibujar(); } }, ["↓"]),
        el("button", { class: "btn btn--peligro btn--chico", type: "button",
          onclick: function () {
            if (!confirm("¿Eliminar " + (def.item === "publicación" ? "esta " : "este ") + def.item + (resumen ? " (\"" + resumen + "\")" : "") + "?")) return;
            arr.splice(i, 1); marcarCambio(); redibujar();
          } }, ["🗑 Eliminar"])
      ]);
      var cuerpo = el("div", { class: "item__cuerpo" });
      def.campos.forEach(function (c) { cuerpo.appendChild(campo(obj, c)); });
      cuerpo.addEventListener("input", function () {
        var r = resumenDe(def, obj);
        cab.firstChild.textContent = mayus(def.item) + " " + (i + 1) + (r ? " — " + r : "");
      });
      caja.appendChild(el("div", { class: "item" }, [cab, cuerpo]));
    });
    cont.appendChild(caja);

    cont.appendChild(el("button", {
      class: "btn btn--grande", type: "button",
      onclick: function () {
        var nuevo = {};
        def.campos.forEach(function (c) { nuevo[c.k] = c.tipo === "check" ? c.def !== false : ""; });
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

  var contador = 0;
  function campo(obj, c) {
    var id = "c" + (++contador);
    var tipo = c.tipo || "texto";

    if (tipo === "oculto" || c.oculto) return document.createDocumentFragment();
    if (tipo === "lista") {
      return el("div", { class: "campo" }, [
        el("span", { class: "campo__titulo", texto: c.l }),
        c.nota ? el("p", { class: "campo__nota", style: "margin:0 0 8px", texto: c.nota }) : null,
        lista(obj, c.k, c)
      ]);
    }
    if (tipo === "check") {
      if (obj[c.k] === undefined) obj[c.k] = c.def !== false;
      return el("div", { class: "campo" }, [el("label", { class: "check" }, [
        el("input", { type: "checkbox", id: id, checked: obj[c.k] === true,
          onchange: function (e) { obj[c.k] = e.target.checked; marcarCambio(); if (c.alCambiar) c.alCambiar(); } }),
        c.l
      ])]);
    }
    if (tipo === "foto") return campoFoto(obj, c);

    var valor = obj[c.k] === undefined || obj[c.k] === null ? "" : String(obj[c.k]);
    var entrada = tipo === "area"
      ? el("textarea", { id: id, placeholder: c.ph })
      : el("input", { type: "text", id: id, placeholder: c.ph });
    entrada.value = valor;
    var estado = null;
    if (tipo === "instagram" || tipo === "behold") {
      estado = el("p", { class: "campo__nota" });
      var valido = tipo === "behold"
        ? function (v) { return /^https:\/\/feeds\.behold\.so\/[\w-]+\/?$/.test(v); }
        : function (v) { return !!enlaceInstagram(v); };
      var error = tipo === "behold"
        ? "⚠ El enlace debe empezar con https://feeds.behold.so/"
        : "⚠ Este enlace no es de una publicación de Instagram (debe tener /p/ o /reel/).";
      var revisar = function () {
        var v = entrada.value.trim();
        estado.textContent = !v ? "" : valido(v) ? "✓ Enlace válido" : error;
        estado.style.color = valido(v) ? "#1d7a3a" : "#c0392b";
      };
      revisar();
      entrada.addEventListener("input", revisar);
    }
    entrada.addEventListener("input", function () { obj[c.k] = entrada.value; marcarCambio(); });
    return el("div", { class: "campo" }, [
      el("label", { for: id, texto: c.l }), entrada, estado,
      c.nota ? el("p", { class: "campo__nota", texto: c.nota }) : null
    ]);
  }

  function srcDe(ruta) { return vistas[ruta] || ruta; }

  function campoFoto(obj, c) {
    var cont = el("div", { class: "campo" });
    function dibujar() {
      cont.innerHTML = "";
      var ruta = obj[c.k] || "";
      var vista = ruta
        ? el("img", { class: "foto__vista", src: srcDe(ruta), alt: "" })
        : el("div", { class: "foto__vista", texto: "Sin foto" });
      if (ruta) vista.addEventListener("error", function () {
        vista.replaceWith(el("div", { class: "foto__vista", texto: "Foto guardada (aparece en unos minutos)" }));
      });
      var archivo = el("input", { type: "file", accept: "image/*", hidden: true });
      archivo.addEventListener("change", function () {
        if (!archivo.files[0]) return;
        ocupado("Preparando foto…");
        prepararFoto(archivo.files[0], "fotos").then(function (r) {
          obj[c.k] = r;
          marcarCambio();
          dibujar();
        }).catch(function (e) { avisar(e.message, true); })
          .then(function () { ocupado(null); });
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
        archivo
      ]));
      if (c.nota) cont.appendChild(el("p", { class: "campo__nota", texto: c.nota }));
    }
    dibujar();
    return cont;
  }

  // ---------- Álbumes ----------
  function defAlbum() { return SECCIONES.filter(function (s) { return s.key === "albumes"; })[0]; }

  function fotosDe(a) {
    if (!Array.isArray(a.fotos)) a.fotos = [];
    return a.fotos;
  }

  function portadaDe(a) {
    var fotos = fotosDe(a).filter(function (f) { return f && f.foto; });
    if (!fotos.length) return "";
    return fotos.some(function (f) { return f.foto === a.portada; }) ? a.portada : fotos[0].foto;
  }

  function pintarAlbumes(panel, s) {
    if (!Array.isArray(datos.albumes)) datos.albumes = [];
    var arr = datos.albumes;
    if (albumAbierto !== null && arr[albumAbierto]) return pintarAlbum(panel, arr[albumAbierto]);
    albumAbierto = null;

    panel.appendChild(el("h2", { texto: s.titulo }));
    panel.appendChild(el("p", { class: "ayuda", texto: s.ayuda }));
    panel.appendChild(el("button", {
      class: "btn btn--azul", type: "button", style: "margin-bottom:18px",
      onclick: function () {
        arr.unshift({ id: "album-" + Date.now().toString(36), titulo: "", fecha: "", lugar: "", descripcion: "", publicado: false, portada: "", fotos: [] });
        albumAbierto = 0;
        marcarCambio();
        pintar();
        var primero = $("panel").querySelector("input[type=text]");
        if (primero) primero.focus();
      }
    }, ["＋ Crear álbum"]));

    if (!arr.length) {
      panel.appendChild(el("div", { class: "vacio", texto: "Todavía no hay álbumes. Crea el primero con el botón de arriba." }));
      return;
    }
    var rejilla = el("div", { class: "albumes-panel" });
    arr.forEach(function (a, i) {
      var portada = portadaDe(a);
      var n = fotosDe(a).length;
      rejilla.appendChild(el("div", { class: "album-p" }, [
        portada ? el("img", { class: "album-p__img", src: srcDe(portada), alt: "" }) : el("div", { class: "album-p__img album-p__img--vacio", texto: "Sin fotos" }),
        el("div", { class: "album-p__info" }, [
          el("strong", { texto: a.titulo || "(Álbum sin nombre)" }),
          el("span", { texto: [a.fecha, n + (n === 1 ? " foto" : " fotos")].filter(Boolean).join(" · ") }),
          el("span", { class: a.publicado ? "insignia insignia--si" : "insignia", texto: a.publicado ? "Publicado" : "Borrador" })
        ]),
        el("div", { class: "album-p__botones" }, [
          el("button", { class: "btn btn--azul btn--chico", type: "button",
            onclick: function () { albumAbierto = i; pintar(); window.scrollTo(0, 0); } }, ["✏️ Editar"]),
          el("button", { class: "btn btn--icono", type: "button", "aria-label": "Mover antes", disabled: i === 0,
            onclick: function () { arr.splice(i - 1, 0, arr.splice(i, 1)[0]); marcarCambio(); pintar(); } }, ["↑"]),
          el("button", { class: "btn btn--icono", type: "button", "aria-label": "Mover después", disabled: i === arr.length - 1,
            onclick: function () { arr.splice(i + 1, 0, arr.splice(i, 1)[0]); marcarCambio(); pintar(); } }, ["↓"]),
          el("button", { class: "btn btn--peligro btn--chico", type: "button",
            onclick: function () {
              if (!confirm("¿Eliminar el álbum \"" + (a.titulo || "sin nombre") + "\" y sus " + n + " fotos? Al guardar, las fotos se borran de la página.")) return;
              arr.splice(i, 1); marcarCambio(); pintar();
            } }, ["🗑"])
        ])
      ]));
    });
    panel.appendChild(rejilla);
  }

  function pintarAlbum(panel, a) {
    var def = defAlbum();
    panel.appendChild(el("button", { class: "btn btn--borde btn--chico", type: "button", style: "margin-bottom:16px",
      onclick: function () { albumAbierto = null; pintar(); window.scrollTo(0, 0); } }, ["← Todos los álbumes"]));
    panel.appendChild(el("h2", { texto: a.titulo || "Álbum nuevo" }));
    panel.appendChild(el("p", { class: "ayuda", texto: "Llena los datos del evento, sube las fotos y marca «Publicado» cuando quieras que se vea en la página." }));
    def.campos.forEach(function (c) { panel.appendChild(campo(a, c)); });
    panel.querySelector("input[type=text]").addEventListener("input", function (e) {
      panel.querySelector("h2").textContent = e.target.value || "Álbum nuevo";
    });

    var fotos = fotosDe(a);
    var titulo = el("h3", { class: "subtitulo", texto: "Fotos (" + fotos.length + ")" });
    var archivo = el("input", { type: "file", accept: "image/*", multiple: true, hidden: true });
    archivo.addEventListener("change", function () {
      var archivos = Array.prototype.slice.call(archivo.files || []);
      if (!archivos.length) return;
      var hechas = 0, fallidas = 0;
      archivos.reduce(function (p, f, i) {
        return p.then(function () {
          ocupado("Preparando foto " + (i + 1) + " de " + archivos.length + "…");
          return prepararFoto(f, "fotos/albumes/" + a.id).then(function (ruta) {
            fotos.push({ foto: ruta, descripcion: "", autor: "" });
            hechas++;
          }, function () { fallidas++; });
        });
      }, Promise.resolve()).then(function () {
        ocupado(null);
        if (hechas) marcarCambio();
        avisar(hechas + (hechas === 1 ? " foto añadida" : " fotos añadidas") +
          (fallidas ? ". " + fallidas + " no se pudieron abrir (usa JPG o PNG)" : "") + ". Recuerda «Guardar cambios».", fallidas > 0);
        pintar();
      });
    });
    panel.appendChild(el("div", { class: "fila-titulo" }, [
      titulo,
      el("button", { class: "btn btn--oro", type: "button", onclick: function () { archivo.click(); } }, ["📤 Subir fotos"]),
      archivo
    ]));
    panel.appendChild(el("p", { class: "campo__nota", texto: "Puedes escoger muchas fotos a la vez. Se achican solas para que la página cargue rápido. Pide permiso antes de publicar fotos de estudiantes." }));

    if (!fotos.length) {
      panel.appendChild(el("div", { class: "vacio", texto: "Este álbum no tiene fotos todavía. Un álbum sin fotos no aparece en la página." }));
      return;
    }
    var rejilla = el("div", { class: "fotos-panel" });
    var portada = portadaDe(a);
    fotos.forEach(function (f, i) {
      var desc = el("input", { type: "text", placeholder: "Descripción (opcional)", "aria-label": "Descripción de la foto " + (i + 1) });
      desc.value = f.descripcion || "";
      desc.addEventListener("input", function () { f.descripcion = desc.value; marcarCambio(); });
      var esPortada = f.foto === portada;
      // Fotos enviadas por miembros: el nombre del autor se puede corregir.
      var autor = null;
      if (f.autor) {
        var idAutor = "autor-" + (++contador);
        var campoAutor = el("input", { type: "text", id: idAutor, maxlength: "80", placeholder: "Nombre del autor" });
        campoAutor.value = f.autor;
        campoAutor.addEventListener("input", function () { f.autor = campoAutor.value; marcarCambio(); });
        autor = el("div", { class: "foto-p__campo" }, [
          el("label", { for: idAutor, class: "foto-p__autor", texto: "📷 Enviada por (sale como crédito)" }),
          campoAutor
        ]);
      }
      rejilla.appendChild(el("div", { class: "foto-p" + (esPortada ? " foto-p--portada" : "") }, [
        el("img", { src: srcDe(f.foto), alt: "", loading: "lazy" }),
        autor,
        desc,
        el("div", { class: "foto-p__botones" }, [
          el("button", { class: "btn btn--icono", type: "button", title: "Usar como portada", disabled: esPortada,
            onclick: function () { a.portada = f.foto; marcarCambio(); pintar(); } }, [esPortada ? "★ Portada" : "☆ Portada"]),
          el("button", { class: "btn btn--icono", type: "button", "aria-label": "Mover antes", disabled: i === 0,
            onclick: function () { fotos.splice(i - 1, 0, fotos.splice(i, 1)[0]); marcarCambio(); pintar(); } }, ["←"]),
          el("button", { class: "btn btn--icono", type: "button", "aria-label": "Mover después", disabled: i === fotos.length - 1,
            onclick: function () { fotos.splice(i + 1, 0, fotos.splice(i, 1)[0]); marcarCambio(); pintar(); } }, ["→"]),
          el("button", { class: "btn btn--icono btn--rojo", type: "button", "aria-label": "Eliminar foto",
            onclick: function () {
              if (!confirm("¿Eliminar esta foto del álbum?")) return;
              fotos.splice(i, 1);
              if (a.portada === f.foto) a.portada = "";
              marcarCambio(); pintar();
            } }, ["🗑"])
        ])
      ]));
    });
    panel.appendChild(rejilla);
  }

  // ---------- Fotos de miembros ----------
  function pintarMiembros(panel) {
    var paginaSubir = location.origin + location.pathname.replace(/admin(\.html)?$/i, "") + "subir.html";
    panel.appendChild(el("div", { class: "aviso aviso--info" }, [
      "Enlace para compartir con los miembros: ",
      el("a", { href: paginaSubir, target: "_blank", rel: "noopener", texto: paginaSubir }),
      el("br"),
      "En cada álbum de la página también aparece el botón «Subir mis fotos» cuando esta opción está activa y el álbum está publicado."
    ]));

    var zona = el("div", { class: "pendientes" });
    panel.appendChild(el("div", { class: "fila-titulo" }, [
      el("h3", { class: "subtitulo", texto: "Fotos esperando aprobación" }),
      el("button", { class: "btn btn--azul", type: "button", onclick: function () { buscarPendientes(zona); } }, ["🔄 Buscar fotos nuevas"])
    ]));
    panel.appendChild(zona);
    if (pendientes) pintarPendientes(zona);
    else zona.appendChild(el("div", { class: "vacio", texto: "Haz clic en «Buscar fotos nuevas»." }));
  }

  function buscarPendientes(zona) {
    ocupado("Buscando fotos…");
    script("pendientes").then(function (r) {
      var ya = {};
      (pendientes || []).forEach(function (p) { ya[p.id] = p; });
      pendientes = (r.fotos || []).map(function (p) {
        var previa = ya[p.id];
        if (previa) return previa;
        p.estado = "pendiente";
        return p;
      });
      pintarPendientes(zona);
      cargarImagenesPendientes(zona);
    }).catch(function (e) { avisar(e.message, true); })
      .then(function () { ocupado(null); });
  }

  function cargarImagenesPendientes(zona) {
    (pendientes || []).filter(function (p) { return !p.datos; }).reduce(function (cadena, p) {
      return cadena.then(function () {
        return script("foto", { id: p.id }).then(function (r) {
          p.datos = r.datos;
          p.tipo = r.tipo;
          var img = zona.querySelector('[data-pendiente="' + p.id + '"] img');
          if (img) img.src = "data:" + p.tipo + ";base64," + p.datos;
        }).catch(function () {});
      });
    }, Promise.resolve());
  }

  function pintarPendientes(zona) {
    zona.innerHTML = "";
    var lista = (pendientes || []).filter(function (p) { return p.estado !== "rechazada"; });
    if (!lista.length) {
      zona.appendChild(el("div", { class: "vacio", texto: "No hay fotos nuevas. 🎉" }));
      return;
    }
    var albumes = (datos.albumes || []).filter(function (a) { return a && a.id; });
    var rejilla = el("div", { class: "fotos-panel" });
    lista.forEach(function (p) {
      var sel = el("select", { "aria-label": "Álbum para esta foto" });
      sel.appendChild(el("option", { value: "", texto: "— Escoge un álbum —" }));
      albumes.forEach(function (a) {
        var o = el("option", { value: a.id, texto: a.titulo || "(sin nombre)" });
        if (a.id === p.album) o.selected = true;
        sel.appendChild(o);
      });
      var aprobada = p.estado === "aprobada";
      var nombre = el("input", { type: "text", maxlength: "80", placeholder: "Nombre del autor", "aria-label": "Nombre del autor (crédito)" });
      nombre.value = p.nombre || "";
      var info = [p.albumTitulo ? "Para: " + p.albumTitulo : "", p.nombre ? "Enviada por: " + p.nombre : "", p.fecha ? new Date(p.fecha).toLocaleDateString("es-PR") : ""]
        .filter(Boolean).join(" · ");
      rejilla.appendChild(el("div", { class: "foto-p" + (aprobada ? " foto-p--aprobada" : ""), "data-pendiente": p.id }, [
        el("img", { src: p.datos ? "data:" + p.tipo + ";base64," + p.datos : "", alt: "Foto enviada" }),
        el("span", { class: "foto-p__info", texto: info }),
        p.nota ? el("span", { class: "foto-p__info", texto: "«" + p.nota + "»" }) : null,
        aprobada
          ? el("strong", { class: "foto-p__ok", texto: "✓ Aprobada — se publica al «Guardar cambios»" })
          : el("div", { class: "foto-p__aprobar" }, [
            sel,
            el("div", { class: "foto-p__campo" }, [el("span", { class: "foto-p__autor", texto: "📷 Crédito" }), nombre]),
            el("div", { class: "foto-p__botones" }, [
              el("button", { class: "btn btn--azul btn--chico", type: "button", onclick: function () { p.nombre = nombre.value.trim(); aprobar(p, sel.value, zona); } }, ["✓ Aprobar"]),
              el("button", { class: "btn btn--peligro btn--chico", type: "button", onclick: function () { rechazar(p, zona); } }, ["✕ Rechazar"])
            ])
          ])
      ]));
    });
    zona.appendChild(rejilla);
  }

  function aprobar(p, albumId, zona) {
    var a = (datos.albumes || []).filter(function (x) { return x.id === albumId; })[0];
    if (!a) return avisar("Escoge el álbum donde va la foto.", true);
    if (!p.datos) return avisar("La foto todavía se está cargando. Espera un momento.", true);
    if (modo !== "github") return avisar("En modo prueba no se pueden aprobar fotos.", true);
    var ext = /png/.test(p.tipo) ? "png" : "jpg";
    var ruta = "fotos/albumes/" + a.id + "/" + nombreSeguro(p.archivo || "foto-miembro", ext);
    porSubir[ruta] = p.datos;
    vistas[ruta] = "data:" + p.tipo + ";base64," + p.datos;
    fotosDe(a).push({ foto: ruta, descripcion: "", autor: p.nombre || "" });
    p.estado = "aprobada";
    aprobadas.push(p.id);
    marcarCambio();
    pintarPendientes(zona);
    avisar("Foto añadida a «" + (a.titulo || "álbum") + "». Recuerda «Guardar cambios».");
  }

  function rechazar(p, zona) {
    if (!confirm("¿Rechazar esta foto? Se borrará y no se publicará.")) return;
    ocupado("Rechazando…");
    script("resolver", { id: p.id, aprobar: false }).then(function () {
      p.estado = "rechazada";
      pintarPendientes(zona);
    }).catch(function (e) { avisar(e.message, true); })
      .then(function () { ocupado(null); });
  }

  // ---------- Fotos ----------
  function nombreSeguro(nombre, ext) {
    var base = String(nombre).replace(/\.[^.]+$/, "").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "foto";
    return base + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5) + "." + ext;
  }

  function prepararImagen(file) {
    return new Promise(function (ok, mal) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var s = Math.min(1, MAX_LADO / Math.max(img.naturalWidth, img.naturalHeight));
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

  // Prepara la foto y la deja lista para subir al guardar. Devuelve su ruta.
  function prepararFoto(file, carpeta) {
    return prepararImagen(file).then(function (img) {
      var ruta = carpeta + "/" + nombreSeguro(file.name, img.ext);
      vistas[ruta] = img.dataUrl;
      porSubir[ruta] = img.dataUrl.split(",")[1];
      return ruta;
    });
  }

  // ---------- Guardar ----------
  function esLista(def) { return def.tipo === "lista" || def.tipo === "albumes"; }

  function limpiar(def, valor) {
    // Quita de las listas los elementos que quedaron completamente vacíos.
    if (esLista(def) || Array.isArray(valor)) {
      if (!Array.isArray(valor)) valor = [];
      return valor.map(function (o) { return limpiarObjeto(def.campos, o); })
        .filter(function (o) {
          return def.campos.some(function (c) {
            if (c.tipo === "check" || c.tipo === "oculto") return false;
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
      else if (c.tipo === "check") r[c.k] = c.def === false ? r[c.k] === true : r[c.k] !== false;
      else r[c.k] = vacio(r[c.k]) ? "" : String(r[c.k]).trim();
    });
    return r;
  }

  function contenidoLimpio() {
    var salida = {};
    Object.keys(datos).forEach(function (k) { salida[k] = datos[k]; });
    SECCIONES.forEach(function (s) { salida[s.key] = limpiar(s, datos[s.key]); });
    return salida;
  }

  function generarYaml(salida) {
    return CABECERA + jsyaml.dump(salida, { lineWidth: -1, noRefs: true, quotingType: '"' });
  }

  function guardar() {
    var salida = contenidoLimpio();
    var yaml = generarYaml(salida);
    if (modo !== "github") {
      var a = el("a", { href: URL.createObjectURL(new Blob([yaml], { type: "text/yaml" })), download: "contenido.yml" });
      document.body.appendChild(a); a.click(); a.remove();
      avisar("Archivo descargado." + (Object.keys(porSubir).length ? " Las fotos nuevas no se incluyen en modo prueba." : ""));
      return;
    }

    var usadas = rutasFotos(salida);
    var nuevas = Object.keys(porSubir).filter(function (r) { return usadas[r]; });
    var quitadas = Object.keys(rutasOriginales).filter(function (r) { return !usadas[r]; });
    var head, arbolBase, entradas = [];

    ocupado("Guardando…");
    gh("git/ref/heads/" + encodeURIComponent(rama)).then(function (ref) {
      head = ref.object.sha;
      return gh(rutaContenido(ARCHIVO, head));
    }).then(function (actualYml) {
      if (actualYml.sha !== sha) {
        var e = new Error(mensajeError(409));
        throw e;
      }
      return gh("git/commits/" + head);
    }).then(function (commit) {
      arbolBase = commit.tree.sha;
      // 1) Subir las fotos nuevas, una por una.
      return nuevas.reduce(function (p, ruta, i) {
        return p.then(function () {
          ocupado("Subiendo foto " + (i + 1) + " de " + nuevas.length + "…");
          return gh("git/blobs", "POST", { content: porSubir[ruta], encoding: "base64" }).then(function (b) {
            entradas.push({ path: ruta, mode: "100644", type: "blob", sha: b.sha });
          });
        });
      }, Promise.resolve());
    }).then(function () {
      // 2) Borrar las fotos que ya no se usan.
      if (!quitadas.length) return;
      ocupado("Guardando…");
      return gh("git/trees/" + arbolBase + "?recursive=1").then(function (arbol) {
        var existe = {};
        (arbol.tree || []).forEach(function (x) { existe[x.path] = true; });
        quitadas.filter(function (r) { return existe[r]; }).forEach(function (r) {
          entradas.push({ path: r, mode: "100644", type: "blob", sha: null });
        });
      });
    }).then(function () {
      ocupado("Publicando…");
      entradas.push({ path: ARCHIVO, mode: "100644", type: "blob", content: yaml });
      return gh("git/trees", "POST", { base_tree: arbolBase, tree: entradas });
    }).then(function (arbol) {
      var msg = "Contenido actualizado desde el panel" + (nuevas.length ? " (" + nuevas.length + (nuevas.length === 1 ? " foto nueva)" : " fotos nuevas)") : "");
      return gh("git/commits", "POST", { message: msg, tree: arbol.sha, parents: [head] });
    }).then(function (commit) {
      return gh("git/refs/heads/" + encodeURIComponent(rama), "PATCH", { sha: commit.sha }).then(function () {
        return gh(rutaContenido(ARCHIVO, commit.sha));
      });
    }).then(function (y) {
      sha = y.sha;
      nuevas.forEach(function (r) { delete porSubir[r]; });
      rutasOriginales = usadas;
      hayCambios = false;
      $("guardar").disabled = true;
      $("estado").textContent = "Todo guardado";
      avisar("¡Guardado! La página se actualiza en 1 o 2 minutos.");
      // 3) Avisar al script de Google cuáles fotos de miembros se aprobaron.
      var confirmar = aprobadas.slice();
      aprobadas = [];
      return confirmar.reduce(function (p, id) {
        return p.then(function () { return script("resolver", { id: id, aprobar: true }).catch(function () {}); });
      }, Promise.resolve()).then(function () {
        if (pendientes) pendientes = pendientes.filter(function (p) { return p.estado === "pendiente"; });
      });
    }).catch(function (e) {
      avisar(e.message, true);
    }).then(function () { ocupado(null); });
  }

  iniciar();
})();
