// =============================================================
//  Este archivo construye la página a partir de contenido.yml.
//  No necesitas editarlo para cambiar textos, fotos o eventos.
// =============================================================

(function () {
  "use strict";

  var app = document.getElementById("app");
  var menu = document.getElementById("menu");
  var pie = document.getElementById("pie");
  var DATOS = {};

  // Evita que el texto se interprete como código.
  function t(valor) {
    if (valor === null || valor === undefined) return "";
    return String(valor)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function lista(valor) {
    return Array.isArray(valor) ? valor.filter(Boolean) : [];
  }

  function enlaceSeguro(url) {
    url = String(url || "").trim();
    if (/^www\./i.test(url)) url = "https://" + url;
    if (/^(https?:|mailto:)/i.test(url) || /^[\w\-./ ]+$/.test(url)) return url;
    return "";
  }

  function iniciales(nombre) {
    return String(nombre || "?")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (p) { return p.charAt(0).toUpperCase(); })
      .join("");
  }

  function seccion(id, titulo, contenido, clase) {
    return (
      '<section id="' + id + '" class="seccion ' + (clase || "") + '">' +
      '<div class="contenedor">' +
      (titulo ? '<h2 class="seccion__titulo">' + t(titulo) + "</h2>" : "") +
      contenido +
      "</div></section>"
    );
  }

  // Convierte un enlace de Instagram en su forma oficial, o "" si no es válido.
  function enlaceInstagram(url) {
    var m = String(url || "").trim().match(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:[\w.]+\/)?(p|reel|tv)\/([\w-]+)/i);
    return m ? "https://www.instagram.com/" + m[1].toLowerCase() + "/" + m[2] + "/" : "";
  }

  function albumesPublicados() {
    return lista(DATOS.albumes).filter(function (a) {
      return a.publicado !== false && a.id && lista(a.fotos).some(function (f) { return f.foto; });
    });
  }

  function fotosDe(album) {
    return lista(album.fotos).filter(function (f) { return f.foto; });
  }

  function portadaDe(album) {
    var fotos = fotosDe(album);
    var p = album.portada && fotos.some(function (f) { return f.foto === album.portada; }) ? album.portada : fotos[0].foto;
    return enlaceSeguro(p);
  }

  function subidasActivas() {
    var s = DATOS.subidas || {};
    return s.activo === true && /^https:\/\/script\.google\.com\//.test(String(s.url || ""));
  }

  function construir(d) {
    DATOS = d;
    var cap = d.capitulo || {};
    document.title = (cap.nombre || "FBLA") + " — " + (cap.escuela || "");
    document.getElementById("marca-texto").textContent = cap.nombre || "FBLA";
    if (cap.logo) {
      var logo = document.getElementById("logo");
      logo.src = enlaceSeguro(cap.logo);
      logo.alt = "FBLA";
      logo.hidden = false;
      document.querySelector(".marca").classList.add("marca--con-logo");
    }

    var html = "";
    var nav = [];
    var unete = d.unete || {};
    var unirseActivo = unete.activo !== false && unete.enlace;
    var c = d.contacto || {};

    // ---- Portada ----
    var fondo = cap.foto_portada
      ? ' style="background-image:linear-gradient(rgba(5,20,45,.72),rgba(5,20,45,.72)),url(\'' + t(enlaceSeguro(cap.foto_portada)) + '\')"'
      : "";
    html +=
      '<section id="inicio" class="portada"' + fondo + '>' +
      '<div class="contenedor portada__contenido">' +
      '<p class="portada__escuela">' + t(cap.escuela) + (cap.pueblo ? " · " + t(cap.pueblo) : "") + "</p>" +
      "<h1>" + t(cap.nombre) + "</h1>" +
      '<p class="portada__lema">' + t(cap.lema) + "</p>" +
      (unirseActivo
        ? '<a class="boton boton--acento" href="' + t(enlaceSeguro(unete.enlace)) + '" target="_blank" rel="noopener">' + t(unete.boton || "Únete") + "</a>"
        : "") +
      "</div></section>";

    // ---- Sobre nosotros ----
    var sobre = d.sobre_nosotros;
    if (sobre) {
      var datos = lista(sobre.datos).map(function (x) {
        return '<div class="dato"><span class="dato__numero">' + t(x.numero) + '</span><span class="dato__etiqueta">' + t(x.etiqueta) + "</span></div>";
      }).join("");
      html += seccion("nosotros", sobre.titulo || "Sobre nosotros",
        '<p class="texto-grande">' + t(sobre.texto) + "</p>" +
        (datos ? '<div class="datos">' + datos + "</div>" : ""));
      nav.push(["nosotros", "Nosotros"]);
    }

    // ---- Anuncios ----
    var anuncios = lista(d.anuncios);
    if (anuncios.length) {
      html += seccion("anuncios", "Anuncios",
        '<div class="rejilla rejilla--2">' + anuncios.map(function (a) {
          return '<article class="tarjeta anuncio">' +
            (a.fecha ? '<p class="etiqueta">' + t(a.fecha) + "</p>" : "") +
            "<h3>" + t(a.titulo) + "</h3>" + (a.texto ? "<p>" + t(a.texto) + "</p>" : "") + "</article>";
        }).join("") + "</div>", "seccion--gris");
      nav.push(["anuncios", "Anuncios"]);
    }

    // ---- Eventos ----
    var eventos = lista(d.eventos);
    if (eventos.length) {
      html += seccion("eventos", "Próximos eventos",
        '<ol class="eventos">' + eventos.map(function (e) {
          var meta = [e.hora, e.lugar].filter(Boolean).map(t).join(" · ");
          return '<li class="evento"><div class="evento__fecha">' + t(e.fecha) + "</div>" +
            '<div class="evento__info"><h3>' + t(e.nombre) + "</h3>" +
            (meta ? '<p class="evento__meta">' + meta + "</p>" : "") +
            (e.descripcion ? "<p>" + t(e.descripcion) + "</p>" : "") +
            "</div></li>";
        }).join("") + "</ol>");
      nav.push(["eventos", "Eventos"]);
    }

    // ---- Directiva ----
    var directiva = lista(d.directiva);
    if (directiva.length) {
      html += seccion("directiva", "Nuestra directiva",
        '<div class="rejilla rejilla--personas">' + directiva.map(function (p) {
          var foto = p.foto
            ? '<img class="persona__foto" src="' + t(enlaceSeguro(p.foto)) + '" alt="' + t(p.nombre) + '" loading="lazy">'
            : '<div class="persona__foto persona__foto--iniciales" aria-hidden="true">' + t(iniciales(p.nombre)) + "</div>";
          return '<div class="persona">' + foto + "<h3>" + t(p.nombre) + '</h3><p class="persona__puesto">' + t(p.puesto) + "</p></div>";
        }).join("") + "</div>", "seccion--gris");
      nav.push(["directiva", "Directiva"]);
    }

    // ---- Logros ----
    var logros = lista(d.logros);
    if (logros.length) {
      html += seccion("logros", "Logros",
        '<ul class="logros">' + logros.map(function (l) {
          return '<li class="logro"><span class="logro__icono" aria-hidden="true">★</span><div><h3>' + t(l.titulo) + "</h3><p>" + t(l.detalle) + "</p></div></li>";
        }).join("") + "</ul>");
      nav.push(["logros", "Logros"]);
    }

    // ---- Álbumes de fotos ----
    var albumes = albumesPublicados();
    if (albumes.length) {
      html += seccion("albumes", "Álbumes de fotos",
        '<div class="albumes">' + albumes.map(function (a) {
          var meta = [a.fecha, a.lugar].filter(Boolean).map(t).join(" · ");
          var n = fotosDe(a).length;
          return '<a class="album-tarjeta" href="#album/' + encodeURIComponent(a.id) + '">' +
            '<div class="album-tarjeta__img"><img src="' + t(portadaDe(a)) + '" alt="" loading="lazy">' +
            '<span class="album-tarjeta__n">' + n + (n === 1 ? " foto" : " fotos") + "</span></div>" +
            '<div class="album-tarjeta__info"><h3>' + t(a.titulo) + "</h3>" +
            (meta ? "<p>" + meta + "</p>" : "") + "</div></a>";
        }).join("") + "</div>", "seccion--gris");
      nav.push(["albumes", "Fotos"]);
    }

    // ---- Instagram ----
    var ig = d.instagram || {};
    var fijas = lista(ig.publicaciones).map(function (p) { return enlaceInstagram(p.enlace); }).filter(Boolean);
    var feed = feedBehold(ig.behold);
    if (feed || fijas.length) {
      var perfil = enlaceSeguro(c.instagram);
      html += seccion("instagram", ig.titulo || "Síguenos en Instagram",
        '<div class="instagram" id="instagram-posts"></div>' +
        (perfil ? '<p class="instagram__mas"><a class="boton boton--borde" href="' + t(perfil) + '" target="_blank" rel="noopener">Ver más en Instagram</a></p>' : ""));
      nav.push(["instagram", "Instagram"]);
    }

    // ---- Únete ----
    if (unirseActivo) {
      html += '<section id="unete" class="seccion unete"><div class="contenedor unete__caja">' +
        "<h2>" + t(unete.titulo || "¡Únete!") + "</h2><p>" + t(unete.texto) + "</p>" +
        '<a class="boton boton--acento" href="' + t(enlaceSeguro(unete.enlace)) + '" target="_blank" rel="noopener">' + t(unete.boton || "Únete") + "</a>" +
        "</div></section>";
      nav.push(["unete", "Únete"]);
    }

    // ---- Contacto ----
    var redes = [
      ["Instagram", c.instagram], ["Facebook", c.facebook], ["TikTok", c.tiktok]
    ].filter(function (r) { return r[1]; });
    if (c.correo || redes.length) {
      html += seccion("contacto", "Contacto",
        '<div class="contacto">' +
        (c.correo ? '<a class="boton boton--borde" href="mailto:' + t(c.correo) + '">✉ ' + t(c.correo) + "</a>" : "") +
        redes.map(function (r) {
          return '<a class="boton boton--borde" href="' + t(enlaceSeguro(r[1])) + '" target="_blank" rel="noopener">' + r[0] + "</a>";
        }).join("") + "</div>");
      nav.push(["contacto", "Contacto"]);
    }

    app.innerHTML = html;
    // FBLA Connect (portal de miembros) en el menú. Si no se ha configurado, se usa el portal oficial.
    var connect = enlaceSeguro(c.fbla_connect === undefined ? "https://connect.fbla.org/" : c.fbla_connect);
    menu.innerHTML = nav.map(function (n) {
      return '<a href="#' + n[0] + '">' + n[1] + "</a>";
    }).join("") +
      (subidasActivas() ? '<a class="menu__subir" href="subir.html">📤 Subir fotos</a>' : "") +
      (connect ? '<a class="menu__connect" href="' + t(connect) + '" target="_blank" rel="noopener">FBLA Connect ↗</a>' : "");
    pie.innerHTML = "<p>© " + new Date().getFullYear() + " " + t(cap.nombre) + " · " + t(cap.escuela) + "</p>" +
      '<p class="pie__nota">Capítulo local de Future Business Leaders of America.</p>' +
      '<p class="pie__nota"><a href="admin.html" class="pie__editar">Panel de edición</a></p>';

    if (feed || fijas.length) mostrarInstagram(feed, fijas, cantidadInstagram(ig.cantidad));
    revisarRuta();
  }

  // ---------- Instagram ----------
  var CACHE_IG = "fbla3281-instagram";
  var HORAS_CACHE_IG = 3;

  function feedBehold(url) {
    var u = String(url || "").trim();
    return /^https:\/\/feeds\.behold\.so\/[\w-]+\/?$/.test(u) ? u : "";
  }

  function cantidadInstagram(n) {
    n = parseInt(n, 10);
    return n >= 1 && n <= 12 ? n : 2;
  }

  // Lee las publicaciones más recientes del feed de Behold.
  // Guarda una copia por 3 horas en el navegador para no gastar el límite gratis.
  function ultimasPublicaciones(feed) {
    var guardado = null;
    try { guardado = JSON.parse(localStorage.getItem(CACHE_IG) || "null"); } catch (e) {}
    if (guardado && guardado.feed === feed && Date.now() - guardado.hora < HORAS_CACHE_IG * 3600000 && guardado.enlaces.length) {
      return Promise.resolve(guardado.enlaces);
    }
    return fetch(feed).then(function (r) {
      if (!r.ok) throw new Error("Behold " + r.status);
      return r.json();
    }).then(function (j) {
      var posts = Array.isArray(j) ? j : (j && (j.posts || j.media)) || [];
      var enlaces = posts.map(function (p) { return enlaceInstagram(p && p.permalink); }).filter(Boolean);
      if (!enlaces.length) throw new Error("Feed vacío");
      try { localStorage.setItem(CACHE_IG, JSON.stringify({ feed: feed, hora: Date.now(), enlaces: enlaces })); } catch (e) {}
      return enlaces;
    }).catch(function (e) {
      if (guardado && guardado.feed === feed && guardado.enlaces.length) return guardado.enlaces;  // copia vieja
      throw e;
    });
  }

  function mostrarInstagram(feed, fijas, cantidad) {
    var cont = document.getElementById("instagram-posts");
    var pintar = function (enlaces) {
      if (!enlaces.length) {
        var sec = document.getElementById("instagram");
        if (sec) sec.querySelector(".instagram").innerHTML = "";
        return;
      }
      cont.innerHTML = enlaces.slice(0, cantidad).map(function (url) {
        return '<div class="instagram__post"><blockquote class="instagram-media" data-instgrm-permalink="' + t(url) +
          '?utm_source=ig_embed" data-instgrm-version="14"><a href="' + t(url) + '" target="_blank" rel="noopener">Ver esta publicación en Instagram</a></blockquote></div>';
      }).join("");
      cargarInstagram();
    };
    if (!feed) return pintar(fijas);
    ultimasPublicaciones(feed).then(pintar, function () { pintar(fijas); });
  }

  function cargarInstagram() {
    if (window.instgrm) { window.instgrm.Embeds.process(); return; }
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.instagram.com/embed.js";
    document.body.appendChild(s);
  }

  // ---------- Vista de un álbum ----------
  var vista = null;      // contenedor del álbum abierto
  var visor = null;      // visor de una foto
  var fotosAbiertas = [];
  var posVisor = 0;
  var scrollAntes = 0;

  function revisarRuta() {
    var m = location.hash.match(/^#album\/(.+)$/);
    if (m) {
      var id = decodeURIComponent(m[1]);
      var album = albumesPublicados().filter(function (a) { return String(a.id) === id; })[0];
      if (album) return abrirAlbum(album);
    }
    cerrarAlbum();
  }

  function nombreArchivo(ruta) {
    return String(ruta).split("/").pop();
  }

  function abrirAlbum(a) {
    cerrarVisor();
    if (!vista) scrollAntes = window.scrollY;
    if (vista) vista.remove();
    fotosAbiertas = fotosDe(a);
    var meta = [a.fecha, a.lugar].filter(Boolean).map(t).join(" · ");
    vista = document.createElement("div");
    vista.className = "album-vista";
    vista.setAttribute("role", "dialog");
    vista.setAttribute("aria-modal", "true");
    vista.setAttribute("aria-label", a.titulo || "Álbum");
    vista.innerHTML =
      '<div class="album-vista__barra"><div class="contenedor album-vista__fila">' +
      '<a class="boton boton--claro" href="#albumes">← Álbumes</a>' +
      '<div class="album-vista__acciones">' +
      (subidasActivas() ? '<a class="boton boton--claro" href="subir.html?album=' + encodeURIComponent(a.id) + '">📤 Subir mis fotos</a>' : "") +
      '<button class="boton boton--acento" type="button" data-zip title="Descarga cada foto por separado (JPG o PNG)">⬇ Descargar todas</button>' +
      "</div></div></div>" +
      '<div class="contenedor album-vista__cuerpo">' +
      "<h2>" + t(a.titulo) + "</h2>" +
      (meta ? '<p class="album-vista__meta">' + meta + "</p>" : "") +
      (a.descripcion ? '<p class="album-vista__desc">' + t(a.descripcion) + "</p>" : "") +
      '<div class="album-fotos">' + fotosAbiertas.map(function (f, i) {
        return '<button type="button" class="album-foto" data-i="' + i + '" aria-label="Ver foto ' + (i + 1) + '">' +
          '<img src="' + t(enlaceSeguro(f.foto)) + '" alt="' + t(f.descripcion || "") + '" loading="lazy"></button>';
      }).join("") + "</div></div>";
    document.body.appendChild(vista);
    document.body.classList.add("sin-scroll");
    vista.scrollTop = 0;

    vista.addEventListener("click", function (e) {
      var b = e.target.closest("[data-i]");
      if (b) abrirVisor(Number(b.getAttribute("data-i")));
      if (e.target.closest("[data-zip]")) descargarTodas(a, e.target.closest("[data-zip]"));
    });
    var volver = vista.querySelector(".boton--claro");
    if (volver) volver.focus();
  }

  function cerrarAlbum() {
    cerrarVisor();
    if (!vista) return;
    vista.remove();
    vista = null;
    document.body.classList.remove("sin-scroll");
    var sec = document.getElementById("albumes");
    if (location.hash === "#albumes" && sec) sec.scrollIntoView();
    else window.scrollTo(0, scrollAntes);
  }

  // ---------- Visor de fotos ----------
  function abrirVisor(i) {
    posVisor = i;
    if (!visor) {
      visor = document.createElement("div");
      visor.className = "visor";
      visor.setAttribute("role", "dialog");
      visor.setAttribute("aria-modal", "true");
      visor.innerHTML =
        '<button class="visor__btn visor__cerrar" type="button" aria-label="Cerrar">✕</button>' +
        '<button class="visor__btn visor__ant" type="button" aria-label="Foto anterior">‹</button>' +
        '<figure class="visor__fig"><img alt=""><figcaption></figcaption></figure>' +
        '<button class="visor__btn visor__sig" type="button" aria-label="Foto siguiente">›</button>' +
        '<div class="visor__pie"><span class="visor__cuenta"></span>' +
        '<a class="boton boton--acento visor__descargar" download>⬇ Descargar</a></div>';
      document.body.appendChild(visor);
      visor.querySelector(".visor__cerrar").addEventListener("click", cerrarVisor);
      visor.querySelector(".visor__ant").addEventListener("click", function () { moverVisor(-1); });
      visor.querySelector(".visor__sig").addEventListener("click", function () { moverVisor(1); });
      visor.addEventListener("click", function (e) { if (e.target === visor) cerrarVisor(); });
      var x0 = null;
      visor.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      visor.addEventListener("touchend", function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 50) moverVisor(dx < 0 ? 1 : -1);
        x0 = null;
      });
    }
    pintarVisor();
    visor.querySelector(".visor__cerrar").focus();
  }

  function pintarVisor() {
    var f = fotosAbiertas[posVisor];
    var src = enlaceSeguro(f.foto);
    visor.querySelector("img").src = src;
    visor.querySelector("img").alt = f.descripcion || "";
    var pie = [f.descripcion, f.autor ? "📷 " + f.autor : ""].filter(Boolean).join(" · ");
    visor.querySelector("figcaption").textContent = pie;
    visor.querySelector(".visor__cuenta").textContent = (posVisor + 1) + " de " + fotosAbiertas.length;
    var d = visor.querySelector(".visor__descargar");
    d.href = src;
    d.setAttribute("download", nombreArchivo(src));
    var varias = fotosAbiertas.length > 1;
    visor.querySelector(".visor__ant").hidden = !varias;
    visor.querySelector(".visor__sig").hidden = !varias;
  }

  function moverVisor(paso) {
    posVisor = (posVisor + paso + fotosAbiertas.length) % fotosAbiertas.length;
    pintarVisor();
  }

  function cerrarVisor() {
    if (!visor) return;
    visor.remove();
    visor = null;
  }

  document.addEventListener("keydown", function (e) {
    if (visor) {
      if (e.key === "Escape") cerrarVisor();
      else if (e.key === "ArrowRight") moverVisor(1);
      else if (e.key === "ArrowLeft") moverVisor(-1);
    } else if (vista && e.key === "Escape") {
      location.hash = "albumes";
    }
  });

  // ---------- Descargar todas (cada foto en su formato: JPG o PNG) ----------
  function esperar(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }

  function descargarTodas(album, boton) {
    if (boton.disabled) return;
    var textoOriginal = boton.textContent;
    var fotos = fotosDe(album);
    boton.disabled = true;
    fotos.reduce(function (p, f, i) {
      return p.then(function () {
        boton.textContent = "Descargando " + (i + 1) + " de " + fotos.length + "…";
        return fetch(enlaceSeguro(f.foto)).then(function (r) {
          if (!r.ok) throw new Error("No se pudo bajar " + nombreArchivo(f.foto));
          return r.blob();
        }).then(function (b) {
          var a = document.createElement("a");
          a.href = URL.createObjectURL(b);
          a.download = nombreArchivo(f.foto);
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(function () { URL.revokeObjectURL(a.href); }, 20000);
          return esperar(600);   // pausa para que el navegador acepte varias descargas
        });
      });
    }, Promise.resolve()).catch(function (e) {
      alert("No se pudieron descargar las fotos. " + e.message);
    }).then(function () {
      boton.disabled = false;
      boton.textContent = textoOriginal;
    });
  }

  window.addEventListener("hashchange", revisarRuta);

  function mostrarError(mensaje) {
    app.innerHTML =
      '<section class="seccion"><div class="contenedor error">' +
      "<h2>⚠ Hay un error en contenido.yml</h2>" +
      "<p>La página no pudo leer el archivo de contenido. Revisa el último cambio que hiciste. " +
      "Lo más común es: un espacio de más o de menos al principio de la línea, o una comilla \" que falta.</p>" +
      "<pre>" + t(mensaje) + "</pre>" +
      "<p>Consejo: en GitHub, abre <strong>contenido.yml</strong>, ve a la pestaña <em>History</em> y compara con la versión anterior.</p>" +
      "</div></section>";
  }

  // Menú en celulares
  var botonMenu = document.querySelector(".menu-boton");
  botonMenu.addEventListener("click", function () {
    var abierto = menu.classList.toggle("menu--abierto");
    botonMenu.setAttribute("aria-expanded", abierto ? "true" : "false");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      menu.classList.remove("menu--abierto");
      botonMenu.setAttribute("aria-expanded", "false");
    }
  });

  // "?v=" evita que el navegador muestre una versión vieja del contenido.
  fetch("contenido.yml?v=" + Date.now(), { cache: "no-store" })
    .then(function (r) {
      if (!r.ok) throw new Error("No se encontró el archivo contenido.yml (código " + r.status + ").");
      return r.text();
    })
    .then(function (texto) {
      var datos;
      try {
        datos = jsyaml.load(texto);
      } catch (err) {
        var linea = err.mark ? "Error cerca de la línea " + (err.mark.line + 1) + ":\n\n" : "";
        throw new Error(linea + (err.reason || err.message));
      }
      construir(datos || {});
    })
    .catch(function (err) { mostrarError(err.message); });
})();
