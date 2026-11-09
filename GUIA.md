# 📘 Guía para editar la página web de FBLA 3281

Esta guía es para la **Vicepresidenta de Mercadeo**. No necesitas saber programar:
todo se hace con formularios en el **Panel de edición**.

---

## 1. Entrar al panel

1. Abre la página del capítulo y añade **`/admin.html`** al final de la dirección.
   Ejemplo: `https://fbla3281.github.io/admin.html`
   (También hay un enlace **"Panel de edición"** al final de la página.)
2. Pega la **llave de GitHub** (token) que te dieron y haz clic en **Entrar**.
3. Si es tu computadora o celular personal, deja marcado **"Recordarme"** y no tendrás que pegar la llave otra vez.

> 🔒 La llave es como una contraseña. No la compartas ni la publiques.
> En computadoras de la escuela, **no** marques "Recordarme" y usa el botón **Salir** al terminar.

---

## 2. Usar el panel

A la izquierda (o arriba en el celular) están las partes de la página:

| Parte | Qué puedes hacer |
|---|---|
| 📢 **Anuncios** | Añadir, editar, mover y eliminar anuncios |
| 📅 **Eventos** | Añadir, editar, mover y eliminar eventos |
| 👥 **Directiva** | Añadir o quitar oficiales y subir sus fotos |
| 🏆 **Logros** | Añadir o quitar premios |
| 📸 **Galería** | Subir o quitar fotos de actividades |
| 🏫 **Información general** | Nombre, escuela, lema, foto de portada y logo |
| ℹ️ **Sobre nosotros** | Descripción y los números grandes |
| ✋ **Únete** | Texto y enlace del formulario de solicitud |
| ✉️ **Contacto** | Correo y redes sociales |

- **＋ Añadir…**: crea un espacio nuevo para llenar.
- **🗑 Eliminar**: borra ese elemento (te pregunta antes).
- **↑ ↓**: cambia el orden en que salen en la página.
- **Subir foto**: escoge una foto de tu computadora o celular. El panel la achica sola para que la página cargue rápido.

### ⚠️ Muy importante: GUARDAR
Cuando termines, haz clic en el botón dorado **💾 Guardar cambios** (arriba).
Si no guardas, los cambios se pierden. Arriba dice **"● Cambios sin guardar"** mientras falte guardar.

Después de guardar, la página pública se actualiza en **1 o 2 minutos**.

---

## 3. Consejos

- Si dejas una lista vacía (por ejemplo, sin anuncios), esa parte no aparece en la página.
- Las redes sociales vacías no aparecen.
- Para esconder el botón de unirse, quita la marca de **"Mostrar el botón de unirse"** en ✋ Únete.
- Pide permiso antes de publicar fotos de estudiantes.
- **Logo:** usa solo un logo oficial de FBLA para capítulos (del
  [Brand Center de FBLA](https://www.fbla.org/brand-center/)). FBLA **no permite** usar el triángulo solo ni cambiarle los colores.
- Los colores y la letra son los **oficiales de FBLA** y ya vienen puestos.

---

## 4. Si algo sale mal

| Mensaje | Qué hacer |
|---|---|
| "La llave (token) no es válida o ya expiró" | Pide una llave nueva (ver parte B abajo). |
| "Alguien más guardó cambios hace poco" | Otra persona guardó al mismo tiempo. Recarga la página del panel y vuelve a hacer tu cambio. |
| "No se encontró el repositorio" | Abre "Datos del repositorio" en la pantalla de entrada y revisa el usuario y el nombre. |
| La página pública no cambió | Espera 2 minutos y recarga. En el celular, cierra y abre el navegador. |

GitHub guarda **todas** las versiones anteriores, así que siempre se puede volver atrás.

---
---

# 🛠️ Para quien prepara la página (una sola vez)

Esto lo hace el consejero(a) o quien administre la cuenta.

## A. Publicar la página en GitHub Pages

1. Crea una cuenta gratis en [github.com](https://github.com) para el capítulo (por ejemplo `fbla3281`).
2. Clic en **"+" → "New repository"**.
   - Nombre recomendado: **`fbla3281.github.io`** (cambia `fbla3281` por el usuario de la cuenta).
     Así la dirección queda corta: `https://fbla3281.github.io`
   - Márcalo como **Public** y clic en **"Create repository"**.
3. Clic en **"uploading an existing file"**, arrastra **todos los archivos y la carpeta `fotos`**, y haz clic en **"Commit changes"**.
4. Ve a **Settings → Pages**. En **Branch** escoge **`main`** y **`/ (root)`**, y haz clic en **Save**.
5. En 1 o 2 minutos la página estará en línea. La dirección aparece en esa misma pantalla.

## B. Crear la llave (token) para la Vicepresidenta de Mercadeo

Hazlo **desde la cuenta dueña del repositorio** (la del capítulo).

1. En GitHub: foto de perfil → **Settings** → **Developer settings** (abajo a la izquierda)
   → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. Llena:
   - **Token name:** `Panel VP Mercadeo`
   - **Expiration:** escoge una fecha al final del año escolar.
   - **Repository access:** **Only select repositories** → escoge el repositorio de la página.
   - **Permissions → Repository permissions → Contents:** **Read and write**.
3. Clic en **Generate token** y **copia la llave** (solo se muestra una vez).
4. Dásela a la Vicepresidenta de Mercadeo en persona o por un mensaje privado.

Cuando cambie la directiva o la llave expire: borra la llave vieja en esa misma pantalla y crea una nueva.

> Si el repositorio no es de la cuenta del capítulo sino de otra persona, la llave tiene que crearla esa persona.

## C. (Opcional) Editar a mano
Todo el contenido está en el archivo `contenido.yml`. Se puede editar en GitHub con el lápiz ✏️,
pero el panel es más fácil y evita errores.
