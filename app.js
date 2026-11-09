// =============================================================
//  Este archivo construye la página a partir de contenido.yml.
//  No necesitas editarlo para cambiar textos, fotos o eventos.
// =============================================================

(function () {
  "use strict";

  var app = document.getElementById("app");
  var menu = document.getElementById("menu");
  var pie = document.getElementById("pie");

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

  function construir(d) {
    var cap = d.capitulo || {};
    document.title = (cap.nombre || "FBLA") + " — " + (cap.escuela || "");
    document.getElementById("marca-texto").textContent = cap.nombre || "FBLA";
    if (cap.logo) {
      var logo = document.getElementById("logo");
      logo.src = enlaceSeguro(cap.logo);
      logo.hidden = false;
    }

    var html = "";
    var nav = [];
    var unete = d.unete || {};
    var unirseActivo = unete.activo !== false && unete.enlace;

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
            "<h3>" + t(a.titulo) + "</h3><p>" + t(a.texto) + "</p></article>";
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

    // ---- Galería ----
    var galeria = lista(d.galeria).filter(function (g) { return g.foto; });
    if (galeria.length) {
      html += seccion("galeria", "Galería",
        '<div class="galeria">' + galeria.map(function (g) {
          return '<figure><img src="' + t(enlaceSeguro(g.foto)) + '" alt="' + t(g.descripcion) + '" loading="lazy">' +
            (g.descripcion ? "<figcaption>" + t(g.descripcion) + "</figcaption>" : "") + "</figure>";
        }).join("") + "</div>", "seccion--gris");
      nav.push(["galeria", "Galería"]);
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
    var c = d.contacto || {};
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
    menu.innerHTML = nav.map(function (n) {
      return '<a href="#' + n[0] + '">' + n[1] + "</a>";
    }).join("");
    pie.innerHTML = "<p>© " + new Date().getFullYear() + " " + t(cap.nombre) + " · " + t(cap.escuela) + "</p>" +
      '<p class="pie__nota">Capítulo local de Future Business Leaders of America.</p>' +
      '<p class="pie__nota"><a href="admin.html" class="pie__editar">Panel de edición</a></p>';
  }

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
  fetch("contenido.yml?v=" + Date.now())
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
