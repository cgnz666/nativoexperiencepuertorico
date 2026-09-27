# Entrega para implementar: cierre del home, cierre de servicios y pie

| Campo | Dato |
|---|---|
| Proyecto | Nativo Experience Puerto Rico |
| Qué se cambia | Let's Plan (`#contact`) de `index.html`, el cierre de `services.html` ("Tell us where you are staying.") y el pie compartido |
| Páginas afectadas | `index.html` (Let's Plan y pie), `services.html` (cierre y pie), `tours.html` (solo el pie) |
| Versión | 4 (sustituye a la 3) |
| Fecha | 25 de septiembre de 2026 |
| Estado del diseño | Aprobado por C |
| Referencias visuales | `referencia/cierre-home.html` y `referencia/cierre-services.html` |

---

## 1. Qué hay que hacer

Rediseñar el final del home para que Let's Plan y el pie se lean como dos piezas distintas:

- **Let's Plan** es la invitación final: titular muy grande, dos ilustraciones de la carta de servicios en versión blanca sobre azul oscuro y el contacto directo.
- **El pie** es una franja baja y discreta, de una sola fila: logo, frase y navegación.

La maqueta `referencia/cierre-home.html` muestra el resultado a 390 px y a 1440 px (se ajusta al ancho de la ventana). Tiene los estilos en la misma página para decidir rápido; en el sitio van en la hoja de estilos, con clases.

### Orden de trabajo

1. Hacer pull del repositorio antes de tocar nada.
2. Leer este documento y abrir la maqueta.
3. Rehacer Let's Plan en `index.html` y el cierre de `services.html` (sección 4b), compartiendo estilos donde se pueda.
4. Rehacer el pie en las tres páginas y sus estilos (`pie.css`).
5. Borrar los estilos que queden sin uso (filas `.contact-pills`, `.contact-pill`, `.footer-social` y la columna "Connect").
6. Revisar con la lista de la sección 8.
7. **No hacer commit ni push hasta que C lo autorice.**

---

## 2. Qué información va en cada pieza

Antes Let's Plan y el pie repetían Instagram, Tripadvisor, WhatsApp y el correo. Ahora cada dato sale una sola vez:

| Dato | Let's Plan | Pie |
|---|---|---|
| WhatsApp | Botón "Chat on WhatsApp" | No |
| Correo | Botón "Email Us" | No |
| Teléfono | Enlace "Call us" (sin el número a la vista) | No |
| Tripadvisor | Enlace "5-Star Rated Local Company" | No |
| Instagram | Enlace "@nativoexperiencepr" | No |
| Ubicación | "Island-wide, Puerto Rico" (texto, no enlace) | No |
| Logo y frase | No | Sí |
| Navegación (Tours, Services, About, Contact) | No | Sí |
| © | No | Sí |

---

## 3. Let's Plan

### Contenido

| Elemento | Texto | Destino |
|---|---|---|
| Rótulo | `LET'S PLAN` | |
| Titular | `Ready to experience Puerto Rico differently?` | |
| Párrafo | `An accessible trip or a completely customized itinerary, we'll help create unforgettable memories.` (**texto nuevo aprobado por C**) | |
| Botón 1 | `Chat on WhatsApp`, con ícono de WhatsApp | `https://wa.me/19393609002` (pestaña nueva) |
| Botón 2 | `Email Us` | `mailto:info@nativotourspr.com` |
| Lista, 1 | `Call us`, con ícono de teléfono (**texto nuevo aprobado por C**) | `tel:+19393609002` |
| Lista, 2 | `5-Star Rated Local Company`, con ícono de estrella | Reseñas de Tripadvisor (el mismo enlace de hoy, pestaña nueva) |
| Lista, 3 | `@nativoexperiencepr`, con ícono de Instagram | `https://www.instagram.com/nativoexperiencepr/` (pestaña nueva) |
| Lista, 4 | `Island-wide, Puerto Rico`, con ícono de ubicación | Sin enlace |

El enlace "Call us" lleva `aria-label="Call us at +1 (939) 360-9002"` para que el lector de pantalla diga el número.

### Medidas

| Elemento | Celular (hasta 899 px) | Escritorio (900 px o más) |
|---|---|---|
| Fondo | `--ocean` `#032833` | Igual |
| Relleno vertical | 56 px arriba, 48 abajo | 112 px arriba, 104 abajo |
| Márgenes laterales | 20 px | 80 px |
| Distribución | Una columna: texto y luego ilustraciones | Dos columnas `1.15fr` y `0.85fr`, separadas 64 px, centradas en vertical |
| Rótulo | 13 px, 800, mayúsculas, espaciado 0.3em, `--primary`, línea de 40 x 1.5 px debajo a 12 px | Igual |
| Titular | 44 px, 700, interlineado 1.02, espaciado -0.015em, blanco, 24 px bajo el rótulo | 84 px |
| Párrafo | 17 px, interlineado 1.6, `rgba(255,255,255,.86)`, máximo 48ch, 18 px bajo el titular | 19 px |
| Botones | Apilados a lo ancho, 52 px de alto, 12 px entre ellos, 32 px bajo el párrafo | En fila |
| Botón WhatsApp | Fondo blanco, texto `--ocean`, 700, 16 px, ícono de 20 px; hover fondo `--sand` | Igual |
| Botón Email | Contorno blanco de 1.5 px, texto blanco; hover fondo blanco y texto `--ocean` | Igual |
| Lista de contacto | Tres líneas, 28 px bajo los botones, con una línea fina `rgba(255,255,255,.16)` arriba y 12 px de relleno. Un dato por línea, en este orden: "Call us", "5-Star Rated Local Company", Instagram, "Island-wide, Puerto Rico" | Tres líneas: **línea 1** "Call us" y "5-Star Rated Local Company" juntos, separados 20 px; **línea 2** Instagram; **línea 3** "Island-wide, Puerto Rico" |
| Cada dato | Ícono de 18 px en `--primary` + texto de 14 px, peso 500, `rgba(255,255,255,.78)`; alto de 40 px por línea | Igual |
| Enlaces de la lista | Subrayado fino `rgba(255,255,255,.35)` con separación de 4 px | Igual |

La lista va más pequeña y más apagada a propósito, para que no compita con los botones ni con el párrafo. Cada línea mide 40 px; con el área del enlace se llega a los 44 px de toque (se puede dar `padding-block: 2px` al enlace).

Esquinas rectas en todo (botones y marcos).

### Ilustraciones

Dos ilustraciones de la carta de servicios, en su versión blanca sobre azul oscuro:

| Posición | Archivo | Celular | Escritorio |
|---|---|---|---|
| Grande, arriba a la izquierda | `assets/services/service-05-bar-drinks.svg` (tragos con flores de maga) | 250 x 250 | 420 x 420 |
| Pequeña, abajo a la derecha, montada sobre la grande | `assets/services/service-04-concierge-alt.svg` (llegada en avión) | 150 x 150 | 220 x 220 |
| Caja que las contiene | | 300 px de alto, 36 px bajo la línea de enlaces | 520 px de alto |

- Las dos llevan borde de 1 px `rgba(255,255,255,.22)`. La pequeña lleva fondo `--ocean` para tapar la esquina de la grande.
- Los archivos ya están en `assets/services/` (llegaron con la entrega del menú de servicios). Si no estuvieran, pedírselos a C.
- **Tienen que ir en línea** (el contenido del `.svg` dentro del HTML), porque con `<img>` no toman los colores oscuros. En la sección se definen:

```css
--il-line:#ffffff;
--il-fill:#032833;
--il-shade:#173943;
--il-bg:#032833;
--il-halo:rgba(255,255,255,.07);
```

- Conservar el `role="img"` y el `aria-label` que ya traen.
- Si los `.svg` traen un bloque `<metadata>`, quitarlo al insertarlos en el HTML; no hace falta en la página.

---

## 4. Pie (compartido por las tres páginas)

### Contenido

- Logo blanco (`assets/logo-white.png`) con `alt="Nativo Experience Puerto Rico"`.
- Frase: `Authentic cultural journeys across Puerto Rico.`
- Navegación: Tours · Services · About · Contact (en `tours.html` y `services.html`, About y Contact apuntan a `index.html#about` y `index.html#contact`).
- `© 2026 Nativo Experience Puerto Rico` (el año lo sigue poniendo el script que ya existe).

Se quitan los títulos "Explore" y "Connect", la columna Connect completa y las líneas entre enlaces.

### Medidas

| Elemento | Celular | Escritorio |
|---|---|---|
| Fondo | `#01161d` (el de hoy) | Igual |
| Borde superior | 3 px sólido `--primary` `#09a7c3`. Es la línea que marca dónde termina Let's Plan | Igual |
| Fila principal | Apilada: marca, luego navegación, 22 px entre bloques, relleno 36 px arriba y 24 abajo | Una fila: marca a la izquierda, navegación a la derecha, relleno 32 px arriba y 20 abajo |
| Logo | 120 px de ancho | 132 px |
| Frase | 14 px, `rgba(255,255,255,.78)`, al lado del logo, máximo 22ch | Igual |
| Enlaces de navegación | 14 px, 600, blancos, alto mínimo 44 px, 24 px entre ellos; hover `--primary` | Igual |
| Base | Línea de 1 px `rgba(255,255,255,.12)`, 13 px, `rgba(255,255,255,.6)`, relleno 16 px arriba y 20 abajo | Igual |


---

## 4b. Cierre de servicios ("Tell us where you are staying.")

Es el mismo diseño de Let's Plan **en espejo**, con sus propias ilustraciones.

### Contenido

| Elemento | Texto | Destino |
|---|---|---|
| Rótulo | `LET'S PLAN` | |
| Titular | `Tell us where you are staying.` | |
| Párrafo | `Send your dates, the hotel or address, and how many of you there are. We come back with a plan and a written quote.` (el publicado) | |
| Botones | `Chat on WhatsApp` y `Email Us`, iguales al home | Los mismos enlaces que hoy |
| Lista de contacto | Igual que en el home: en celular un dato por línea; en escritorio `Call us` y `5-Star Rated Local Company` juntos en la primera línea | Igual que en el home |

Se quita la línea de hoy con el correo y el número escritos.

### Diferencias con el home

| Elemento | Celular | Escritorio |
|---|---|---|
| Orden | Texto arriba, ilustraciones abajo (igual que el home) | Ilustraciones a la **izquierda** y texto a la **derecha**; columnas `0.85fr` y `1.15fr` |
| Alineación del texto | A la izquierda | A la **derecha**: rótulo (y su línea corta), titular, párrafo (con `margin-left:auto`), botones y lista (`justify-content` / `align-items: flex-end`) |
| Ilustración grande | 250 x 250, arriba a la izquierda | 420 x 420, arriba a la **derecha** de su columna |
| Ilustración pequeña | 150 x 150, abajo a la derecha | 220 x 220, abajo a la **izquierda**, montada sobre la grande |

Todo lo demás (fondo, tamaños de letra, botones, bordes, variables de color de las ilustraciones) es igual a la sección 3.

### Ilustraciones propias

| Posición | Archivo |
|---|---|
| Grande | `assets/services/service-close-villa.svg` (fachada de una casa de alquiler con balcón, persianas y trinitaria) |
| Pequeña | `assets/services/service-close-suitcase.svg` (maleta con etiqueta, sombrero y mata) |

Ya están copiadas en `assets/services/`. Van en línea, con las mismas variables oscuras de la sección 3.

---

## 5. Colores

Solo los de `styles.css`:

| Variable | Valor | Uso aquí |
|---|---|---|
| `--ocean` | `#032833` | Fondo de Let's Plan, texto del botón blanco |
| `--primary` | `#09a7c3` | Rótulo, íconos de la línea de enlaces, borde del pie, hover del pie |
| `--sand` | `#f7f4ef` | Hover del botón blanco |
| Pie | `#01161d` | Fondo del pie |

---

## 6. Íconos de la línea de enlaces

Trazo de 1.5 px, 24 x 24, `stroke="currentColor"`, sin relleno, `aria-hidden="true"`. Están en la maqueta: teléfono, estrella, Instagram, ubicación y el globo de WhatsApp del botón.

---

## 7. Qué se borra

- En Let's Plan: la lista de filas con ícono (`.contact-ways`, `.contact-pills`), el número de teléfono escrito y la fila del correo.
- En el pie: los títulos "Explore" y "Connect", la columna Connect (Instagram, Tripadvisor, WhatsApp) y sus estilos.

---

## 8. Verificación antes de pedir aprobación

### Contenido

1. Cada dato sale una sola vez en todo el cierre (tabla de la sección 2).
2. El párrafo dice exactamente el texto aprobado.
3. "Call us" marca el número al tocarlo en un celular.
4. Tripadvisor, Instagram y WhatsApp abren en pestaña nueva.

### Diseño

5. El titular mide 84 px en escritorio y 44 px en celular, y no se sale de la pantalla con la letra del sistema agrandada.
6. Las ilustraciones se ven con línea blanca sobre azul oscuro, no teal sobre blanco.
7. La pequeña queda montada sobre la esquina inferior derecha de la grande.
8. El pie queda en una sola fila en escritorio y con la línea teal de 3 px arriba.

### Funcionamiento

9. Todos los enlaces y botones miden 44 px de alto como mínimo.
10. Contraste AA en todo el texto.
11. El pie se ve bien en `index.html`, `tours.html` y `services.html`.
12. En escritorio, el cierre de servicios queda en espejo del home: ilustraciones a la izquierda y texto alineado a la derecha.
13. El resto del home y de servicios no cambió.
14. Se prueba en un celular real.
