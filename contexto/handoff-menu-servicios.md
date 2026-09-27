# Entrega para implementar: menú de servicios

| Campo | Dato |
|---|---|
| Proyecto | Nativo Experience Puerto Rico |
| Página | `services.html` y sus estilos |
| Versión | 1 |
| Fecha | 25 de septiembre de 2026 |
| Estado del diseño | Aprobado por C |
| Se lee junto con | `contexto/menu-servicios.md`, `contexto/estilo-ilustracion.md`, `contexto/plan-menu-servicios.md` |

---

## 1. Qué hay que hacer

Rediseñar `services.html` para que se lea como una carta, siguiendo las dos páginas de referencia de esta entrega (`referencia/services-mobile.html` y `referencia/services-desktop.html`). Las referencias son maquetas estáticas con estilos en línea: sirven para copiar medidas, orden y jerarquía. La implementación final va con clases en la hoja de estilos del sitio, no con estilos en línea.

**Se cambia la presentación, no la oferta.** Los textos, precios, enlaces y mensajes prellenados de WhatsApp que ya están en `services.html` se mantienen. Donde la referencia dice `[Published text]`, va el texto que ya está publicado.

### Orden de trabajo

1. Hacer pull del repositorio antes de tocar nada.
2. Leer los tres archivos de `contexto/` del proyecto y este.
3. Copiar las imágenes de esta entrega a `assets/services/`.
4. Implementar la versión móvil primero y luego la de escritorio (punto de corte sugerido: 1024 px).
5. Revisar con la lista de la sección 9.
6. **No hacer commit ni push hasta que C lo autorice.** Dejar los cambios listos para revisión.

---

## 2. Archivos de esta entrega

| Archivo | Destino en el repo | Qué es |
|---|---|---|
| `HANDOFF_menu_servicios_v1.md` | `contexto/handoff-menu-servicios.md` | Este documento |
| `assets/services/*.svg` | `assets/services/` | 11 ilustraciones y 9 íconos |
| `referencia/services-mobile.html` | `contexto/referencia/services-mobile.html` | Maqueta de celular (390 px) |
| `referencia/services-desktop.html` | `contexto/referencia/services-desktop.html` | Maqueta de escritorio (1440 px) |

Las maquetas enlazan las imágenes con `../assets/services/` y la foto del hero con `../assets/island-story-bg.jpg`. Si se guardan en otra carpeta, hay que ajustar esas rutas para verlas.

---

## 3. Reglas

1. El repositorio es público. No se suben imágenes de referencia de terceros, documentos internos, costos, márgenes ni tarifas de aliados.
2. Nada nuevo en la oferta. Ningún texto ni dibujo añade algo que el servicio no incluya.
3. Precios con dos decimales: $679.00, $799.00, $899.00.
4. Solo los colores de `styles.css` (tabla de la sección 5). El tono de sombra de las ilustraciones sale del teal y ya viene dentro de los SVG.
5. En la página de servicios las esquinas van rectas (0 a 6 px). No se cambia el `--radius` global.
6. El resto del sitio (inicio, tours, about, contacto) no cambia de aspecto.
7. Botones y enlaces con área táctil mínima de 44 px.

---

## 4. Estructura de la página

De arriba abajo. Las medidas son las de las maquetas.

### 4.1 Hero fijo

| Elemento | Celular | Escritorio |
|---|---|---|
| Alto mínimo | 560 px | 640 px |
| Fondo | Foto de plantas `assets/island-story-bg` (webp con jpg de respaldo, como `.island-story`) con capa `rgba(5,28,34,.55)` | Igual |
| Título | "The island, around you." 42 px, 700 | 72 px, 700 |
| Botones | "Plan Your Stay" (fondo blanco, texto `--ocean`) y "See the Services" (borde blanco) apilados, 52 px de alto | En fila |
| Contenido | Alineado abajo | Alineado abajo |

**Comportamiento:** el hero queda fijo (`position: sticky; top: 0; z-index: 0`) y todo lo que viene después va dentro de un contenedor con `position: relative; z-index: 1` y fondo `--sand`. Al bajar, el contenido pasa por encima del hero y lo tapa. Cuidado: ningún ancestro del hero puede tener `overflow: hidden`, porque eso rompe el `sticky`.

### 4.2 Carta resumida (el antiguo índice 01 a 05)

**Celular:** lista de cinco filas de 64 px. Cada fila lleva el ícono (28 px), el número, el nombre y una flecha, y enlaza a su servicio (`#s01` a `#s05`). Las cinco caben en una pantalla.

**Escritorio:** cinco franjas verticales iguales, separadas por líneas de 1.5 px en `--primary-dark`, con borde exterior del mismo color. Cada franja mide 560 px de alto mínimo. En las franjas 01, 03 y 05 va la imagen arriba y el texto abajo; en la 02 y la 04, al revés. Cada una tiene:

- La escena alterna del servicio (`service-0X-...-alt.svg`, o `service-05-bar-drinks.svg`) a 216 px, que enlaza al servicio.
- Número, título en mayúsculas (15 px, 800, espaciado 0.16em) y subtítulo.
- Un rectángulo sólido de acción en `--primary-dark`: "Request a quote" (abre WhatsApp) en la 01 a la 04 y "From $679.00" (lleva a `#s05`) en la 05.

### 4.3 Introducción

"A trip here should feel like you have people on the island." con su párrafo publicado. Una columna en celular y dos en escritorio.

### 4.4 Los cinco servicios

**Celular (una tarjeta por servicio):** número de 44 px, título en mayúsculas de 17 px, subtítulo, ilustración a lo ancho (348 px), tres etiquetas con viñeta cuadrada, botón de 52 px a lo ancho y "See what's included" plegado (`<details>`), con el texto de introducción y la lista de lo que incluye. Cada tarjeta cabe en una pantalla antes de abrirla.

**Escritorio (una fila por servicio):** cada servicio ocupa una fila completa, con las filas separadas por líneas de 1.5 px. La columna de texto y la de imágenes se alternan:

| Fila | Izquierda (5 fr) | Derecha (7 fr) |
|---|---|---|
| 01, 03, 05 | Texto | Imágenes |
| 02, 04 | Imágenes (7 fr) | Texto (5 fr) |

- **Texto:** número de 72 px (peso 300), título de 24 px en mayúsculas, subtítulo de 18 px, línea corta, párrafo de 19 px con interlineado 1.65, etiquetas de 17 px, "WHAT'S INCLUDED" visible (sin plegar, 16 px) y el botón.
- **Imágenes 01 a 04:** la ilustración principal a 396 px y la escena alterna a 216 px, alineada abajo.
- **Imágenes 05:** la escena de la piscina a 396 px y, al lado, la terraza y los tragos a 186 px, una encima de la otra.
- **Paquetes del 05:** tres columnas iguales con nombre, "Up to N guests" y el precio en un rectángulo sólido de ancho completo, alineado abajo, para que los tres queden a la misma altura. El botón es "Book this package".

### 4.5 How it works

Cuatro pasos con su ícono (32 px en celular, 40 px en escritorio). Filas en celular, cuatro columnas con líneas en escritorio.

### 4.6 Good to know

Los cuatro bloques con el texto publicado. En celular van plegados (`<details>`) y en escritorio en cuatro columnas.

### 4.7 Cierre

"Tell us where you are staying." sobre `--ocean`, con "Chat on WhatsApp" y "Email Us".

---

## 5. Tipografía y color

| Uso | Valor |
|---|---|
| Fuente | Manrope (la del sitio) |
| Títulos de sección | 13 px, 800, mayúsculas, espaciado 0.3em, `--primary-dark`, con una línea de 40 x 1.5 px debajo |
| Fondo de la carta | `--sand` `#f7f4ef` |
| Líneas de la retícula | `--primary-dark` `#067b92`, 1.5 px |
| Líneas finas internas | `rgba(20,52,59,0.16)`, 1 px |
| Botones y etiquetas de precio | `--primary-dark`, hover `--boton-hover` `#045a6b` |
| Texto | `--text` `#14343b` |
| Texto secundario | `--muted` `#55666c` |
| Viñetas cuadradas | `--primary` `#09a7c3`, 6 a 7 px |
| Fondos oscuros | `--ocean` `#032833` |

---

## 6. Imágenes

| Archivo | Servicio | Dónde va |
|---|---|---|
| `service-01-catering.svg` | 01 | Tarjeta en celular y principal de la fila en escritorio |
| `service-01-catering-alt.svg` | 01 | Carta resumida y secundaria de la fila en escritorio |
| `service-02-yoga.svg` | 02 | Tarjeta en celular y principal de la fila |
| `service-02-yoga-alt.svg` | 02 | Carta resumida y secundaria de la fila |
| `service-03-massage.svg` | 03 | Solo principal de la fila en escritorio |
| `service-03-massage-alt.svg` | 03 | Tarjeta en celular, carta resumida y secundaria de la fila |
| `service-04-concierge.svg` | 04 | Tarjeta en celular y principal de la fila |
| `service-04-concierge-alt.svg` | 04 | Carta resumida y secundaria de la fila |
| `service-05-bar-pool.svg` | 05 | Tarjeta en celular y principal de la fila |
| `service-05-bar-terrace.svg` | 05 | Secundaria de la fila (solo escritorio) |
| `service-05-bar-drinks.svg` | 05 | Carta resumida y secundaria de la fila |
| `icon-01-catering.svg` a `icon-05-bar.svg` | 01 a 05 | Carta resumida en celular |
| `icon-step-1-basics.svg` a `icon-step-4-show-up.svg` | Pasos | How it works |

En el celular, el servicio 03 usa la escena alterna (toallas y aceite), no la de la mesa.

### Cómo usar los SVG

- Cuadro de 480 x 480 (ilustraciones) y de 24 x 24 (íconos). Trazo de 2 px y de 1.5 px, uniones en ángulo recto. Todos pesan menos de 7 KB.
- Los colores salen de variables CSS con valores de respaldo, así que se ven bien como `<img>` sin tocar nada:

| Variable | Respaldo | Qué pinta |
|---|---|---|
| `--il-line` | `#09a7c3` | Línea |
| `--il-fill` | `#ffffff` | Relleno plano |
| `--il-shade` | `#d6e9e9` | Sombra de un tono |
| `--il-bg` | `#f7f4ef` | Huecos que muestran el fondo |
| `--il-halo` | `rgba(9,167,195,0.12)` | Luz del atardecer (solo la terraza del bar) |

- Con `<img>` las variables no pasan al SVG. Si se quiere la versión blanca sobre `--ocean`, hay que insertar el SVG en línea y definir `--il-line: #ffffff; --il-fill: #032833; --il-shade: #173943; --il-bg: #032833; --il-halo: rgba(255,255,255,0.07)` en el contenedor.
- Las ilustraciones ya traen `role="img"` y `aria-label` en inglés. En `<img>`, usar ese mismo texto como `alt`. Los íconos son decorativos (`alt=""`), porque el nombre del servicio va al lado.
- Mostrar las ilustraciones sobre `--sand`, con un borde fino `rgba(20,52,59,0.16)`.

---

## 7. Enlaces

| Botón | Destino |
|---|---|
| Request a quote (01 a 04) | WhatsApp con el mensaje prellenado que ya existe en `services.html` para cada servicio |
| Book this package y From $679.00 | Reserva de la barra que ya existe; "From $679.00" lleva a `#s05` |
| Chat on WhatsApp | El enlace general que ya existe |
| Email Us | `mailto:` que ya existe |

Las maquetas usan un enlace de WhatsApp genérico y `#` como marcadores. En el sitio se conservan los enlaces reales.

---

## 8. Texto nuevo

El único texto nuevo es "From $679.00", en la franja 05 de la carta resumida de escritorio. Todo lo demás es copia publicada.

---

## 9. Verificación antes de pedir aprobación

### Contenido

1. Los cinco servicios siguen con su número, título y subtítulo publicados.
2. Los precios de la barra son $679.00, $799.00 y $899.00, con "Up to 8", "Up to 16" y "Up to 25".
3. El 05 lleva a la reserva y los otros cuatro a WhatsApp con su mensaje prellenado.
4. Los textos de "Good to know" son los publicados.

### Diseño

5. En escritorio, la carta resumida alterna imagen arriba y abajo, y los cinco botones quedan alineados.
6. En escritorio, cada servicio ocupa su propia fila y los lados se alternan.
7. Los rectángulos de precio del 05 miden lo mismo y quedan a la misma altura.
8. Solo se usan los colores de la sección 5.

### Funcionamiento

9. El hero queda fijo y el contenido lo tapa al bajar, en celular y en escritorio.
10. En el celular, cada servicio cabe en una pantalla antes de abrir "See what's included".
11. La carta resumida del celular muestra los cinco servicios en una pantalla y cada fila lleva a su servicio.
12. Los botones de WhatsApp, reserva y correo funcionan de principio a fin.
13. El resto del sitio no cambió de aspecto.
14. Se prueba en un celular real, no solo en el navegador de la computadora.
