# Entrega para implementar: rediseño de la página de tours

| Campo | Dato |
|---|---|
| Proyecto | Nativo Experience Puerto Rico |
| Qué se cambia | `tours.html`, `tours.js` y los estilos de `.tours-page` en `styles.css` |
| Páginas afectadas | Solo `tours.html` |
| Versión | 2 (reemplaza la 1: ventanas nuevas) |
| Fecha | 25 de septiembre de 2026 |
| Estado del diseño | Aprobado por C (propuesta 10) |
| Referencia visual | `referencia/tours.html` |
| Recursos nuevos | `assets/tours/mapa-relieve.jpg`, `assets/tours/mapa-relieve-movil.jpg` (ya copiados al repositorio) |
| Fuente nueva | JetBrains Mono 500 y 700 (Google Fonts), solo para los textos tipo pantalla |

---

## 1. Qué hay que hacer

La página de tours pasa a ser oscura de arriba abajo y se arma en dos piezas:

- **Hero con mapa de rutas:** relieve de Puerto Rico y su archipiélago, con las rutas dibujadas como líneas de metro que salen de San Juan. Debajo, botones para filtrar por ruta.
- **Catálogo en ventanas de avión:** cada tour es una ventana sólida y encendida: marco grueso con volumen, aro interior que brilla en teal y la foto adentro como si fuera una pantalla (líneas finas de pantalla, viñeta, reflejo y una línea de datos en letra de máquina abajo). Detrás de cada ventana hay un resplandor hecho con su propia foto. La cortinita de arriba lleva el nombre corto y los datos; al bajarla aparece el detalle y el botón de reserva.

La maqueta `referencia/tours.html` muestra el resultado a 390 px y a 1440 px (se ajusta al ancho de la ventana). Allí los datos están escritos a mano. En el sitio las ventanas se siguen generando desde `tours.json` con `tours.js`.

En la maqueta, las fotos que vienen de Bókun (`imgcdn.bokun.tools`) salen si el navegador puede cargarlas. Si no cargan, la ventana queda vacía; eso no es un error del diseño.

### Orden de trabajo

1. Poner la copia al día antes de tocar nada (sección 1.2 de `CLAUDE.md`). Al preparar esta entrega había cambios sin commit en `index.html`, `script.js` y `styles.css` que no son de este rediseño: preguntarle a C qué son antes de seguir, y no mezclarlos con este trabajo.
2. Leer este documento completo y abrir la maqueta.
3. Trabajar en una rama nueva.
4. Quitar lo que se va (sección 2).
5. Rehacer el hero con el mapa (secciones 3 y 4).
6. Rehacer el catálogo (secciones 5 a 7).
7. Revisar con la lista de la sección 10.
8. **No hacer commit ni push hasta que C lo autorice.**

---

## 2. Qué se quita

| Qué | Dónde |
|---|---|
| El video del mar de fondo (`.ocean-backdrop` y su `<video>`) | `tours.html` |
| El código que pausa ese video | Inicio de `tours.js` |
| Los estilos del video y los fondos transparentes que dependían de él (`.ocean-backdrop`, `.tours-page main`, `.tours-page footer` y similares) | `styles.css` |
| La frase "Every tour we run, in one place." | Hero |
| La tarjeta blanca de producto en esta página | `tours.js` (función `tarjetaDe`) |
| El conteo de reseñas ("X reviews on Tripadvisor") y el enlace `.product-rating` | Ventanas |
| "By {vendor}" | Ventanas |

Los archivos `assets/ocean-*` solo los usa `tours.html`. No borrarlos del repositorio sin que C lo pida; basta con dejar de cargarlos.

Las clases `.tour-card`, `.product-card` y `.featured-tour-card` también las usa el home para los tours destacados. **No tocar esos estilos.** Las ventanas nuevas llevan clases propias (sección 6) con alcance `.tours-page`.

---

## 3. Hero

### Contenido

| Elemento | Texto | Destino |
|---|---|---|
| Rótulo | `EVERY TOUR` | |
| Titular | `Adventures` + salto + `we offer.` (la segunda línea en `--primary`) | |
| Párrafo | `Pick a route on the map, search by town, or just scroll until something pulls you in.` (texto nuevo) | |
| Distintivo | `★★★★★ 5.0 on Tripadvisor` (estrellas en `--primary`, sin cifra de reseñas) | El mismo enlace de Tripadvisor del home, pestaña nueva |
| Mapa | Ver sección 4 | |
| Botones de ruta | Ver sección 4.4 | |

### Medidas

| Elemento | Celular (hasta 899 px) | Escritorio (900 px o más) |
|---|---|---|
| Fondo | `--ocean` `#032833` | Igual |
| Relleno vertical | 48 px arriba, 32 abajo | 88 px arriba, 48 abajo |
| Distribución del texto | Una columna | Dos columnas iguales separadas 64 px, alineadas abajo: titular a la izquierda, párrafo y distintivo a la derecha |
| Rótulo | 13 px, 800, mayúsculas, espaciado 0.3em, `--primary`, línea de 40 x 1.5 px debajo a 12 px | Igual |
| Titular | 42 px, 700, interlineado 1.02, espaciado -0.015em, blanco | 84 px |
| Párrafo | 17 px, interlineado 1.6, `rgba(255,255,255,.86)`, máximo 52ch | 19 px |
| Distintivo | 15 px, 700, blanco, alto mínimo 44 px, subrayado con borde inferior de 1 px `rgba(255,255,255,.35)` | Igual |
| Mapa | 8 px bajo el texto, a sangre (márgenes negativos de 20 px) | 40 px bajo el texto, dentro del contenedor |

---

## 4. Mapa de rutas

### 4.1 Dos versiones

| Versión | Cuándo | `viewBox` | Imagen de fondo |
|---|---|---|---|
| `.map-d` (plana) | 900 px o más | `-160 0 2060 660` | `assets/tours/mapa-relieve.jpg` (2060 x 660) |
| `.map-m` (en ángulo) | Hasta 899 px | `0 0 780 620` | `assets/tours/mapa-relieve-movil.jpg` (1560 x 1240) |

En el celular la isla va girada en diagonal, como un mapa visto de lado, para que quepa completa sin deslizar. **No usar desplazamiento horizontal.**

Los dos SVG se copian **tal cual** de la maqueta, en línea dentro de `tours.html`. Solo hay que cambiar las rutas de las imágenes. Las coordenadas de las líneas, los puntos y los rótulos ya están calculadas para cada relieve. Si se reescalan o se regeneran a mano, dejan de coincidir con la isla.

Las dos imágenes ya están en `assets/tours/` del repositorio (sin commit). Son dibujos propios: un relieve sintético con curvas de nivel, sin datos de terceros.

### 4.2 Qué muestra

- Relieve liso con curvas de nivel en teal y la costa en línea teal.
- Todo el archipiélago:
  - Vieques, Culebra y Caja de Muerto están en su lugar real.
  - Desecheo, Mona y Monito van al oeste de Rincón, más cerca de lo real para que quepan.
  - Todas llevan su nombre en gris suave (`.lbl-i`), sin ruta.
- Las rutas salen de San Juan, marcado con un anillo que pulsa.
- **No hay paradas de pueblos.** Solo se marca San Juan y el destino de cada ruta, porque las paradas cambian según el día.

### 4.3 Rutas

| Clave (`data-line`) | Botón | Color | Trazo | Rótulo en el mapa |
|---|---|---|---|---|
| `south` | South | `#09a7c3` | Sólido, 6 | PONCE & THE SOUTH |
| `west` | West Coast | `#ffffff` | Sólido, 6 | RINCÓN & THE WEST |
| `inland` | Mountains | `#eaf7f8` | Discontinuo `14 8`, 5 | CENTRAL MOUNTAINS |
| `coffee` | Coffee Hills | `#d9b98c` | Sólido, 5 | COFFEE HILLS |
| `east` | East Coast | `#09a7c3` con halo blanco al 70% | Sólido, 6 | LOÍZA & PIÑONES |
| `sj` | Old San Juan | `#09a7c3` | Recuadro discontinuo `6 5` alrededor de San Juan | (el de San Juan) |
| `island` | Around the Island | `#ffffff` | Punteado `2 10`, 3 | Sin rótulo |

- Todas llevan el filtro de brillo `glow` (desenfoque de 4) que ya trae el SVG.
- Rótulos: 800, espaciado 0.16em, blancos, con contorno `#032833` (`paint-order: stroke`). San Juan va en `--primary`: `SAN JUAN · START`.
- En la versión del celular los rótulos son más grandes en unidades del `viewBox` (19 y 16) para que se lean.

### 4.4 Botones de ruta

- Una fila con los siete botones de la tabla, en ese orden. Cada uno lleva una muestra de 34 x 10 de su línea (mismo color y trazo; East Coast con su halo blanco).
- Estilo: alto mínimo 44 px, relleno 0 16 px, borde 1.5 px `rgba(255,255,255,.4)`, texto blanco 14 px 700, sin esquinas redondeadas.
- Celular: una sola fila que se desliza de lado (sin barra visible). Escritorio: se reparten en renglones.
- Son `<button type="button">` dentro de un `role="group"` con `aria-label="Tour routes"`, y llevan `aria-pressed`.

**Comportamiento:**

1. Al pulsar un botón, queda activo (`aria-pressed="true"`, fondo `rgba(255,255,255,.12)`, borde blanco).
2. En el mapa, esa ruta se queda al 100% y las demás bajan a 15% de opacidad (transición de 0.25 s).
3. El catálogo muestra solo los tours de esa ruta, todos, sin el "View all tours".
4. Pulsar el mismo botón otra vez lo apaga y vuelve todo.
5. El filtro de ruta y el buscador se combinan: si hay texto y ruta, se muestran los que cumplen ambos.

### 4.5 Movimiento

- El anillo de San Juan pulsa (`scale` de 0.6 a 1.8 y opacidad a 0, 2.4 s, infinito). `transform-box: fill-box; transform-origin: center`.
- Con `prefers-reduced-motion: reduce`, el anillo se queda quieto.

### 4.6 Accesibilidad del mapa

Cada SVG lleva `role="img"` y su `aria-label` (ya vienen en la maqueta). Los rótulos van dentro del dibujo; el lector de pantalla usa el `aria-label`.

---

## 5. Catálogo: orden y datos por tour

### 5.1 Orden

Primero van estos diez, en este orden, para que los tours de Ponce no salgan juntos. Después, los demás en el orden de `tours.json`. Al cargar se muestran los diez primeros (`AL_PRINCIPIO = 10`) y el botón "View all tours" despliega el resto.

`tours.json` lo reescribe una tarea programada, así que los datos editoriales de esta sección **no van en `tours.json`**. Van en un objeto dentro de `tours.js`, indexado por `id`, por ejemplo `const CURADURIA = { "1196867": { corto, linea, ruta, etiqueta }, ... }`, y un arreglo `ORDEN` con los diez primeros.

### 5.2 Datos editoriales

| Orden | id | Título corto (cortina) | Ruta (`linea`) | Frase de ruta | Etiqueta |
|---|---|---|---|---|---|
| 1 | 1196867 | La Perla | `sj` | Walking · Old San Juan | ★ 5.0 |
| 2 | 1213460 | Hacienda Muñoz | `coffee` | San Juan to the coffee hills | Coffee & culture |
| 3 | 1174842 | Ponce Road Trip | `south` | San Juan to the south coast | ★ 5.0 |
| 4 | 1174841 | Rincón Day Tour | `west` | Along the north coast to Rincón | ★ 5.0 |
| 5 | 1265967 | Piñones & Loíza | `east` | San Juan to the east coast | ★ 5.0 |
| 6 | 1243165 | Forest Bathing | `inland` | Forest and hot springs | Wellness |
| 7 | 1243154 | Bad Bunny Origins | `west` | San Juan and the north coast | Music & food |
| 8 | 1174843 | Island Day Trip | `island` | Around the island in a day | ★ 4.9 |
| 9 | 1243144 | Parque de Bombas | `south` | Walking · Ponce | Walking tour |
| 10 | 1244586 | Cigars & Island Vibes | `sj` | Around San Juan | New route |
| | 1242779 | Ponce Private Tour | `south` | San Juan to Ponce, private | Private |
| | 1240411 | Coastal Towns | `island` | Along the coast | Coastal |
| | 903415 | PR-10 Mountain Drive | `inland` | Up the PR-10 through the mountains | Mountain drive |
| | 1262125 | Island in Two Days | `island` | Around the island in two days | Two days |
| | 1263358 | Arecibo Expedition | `west` | San Juan to Arecibo | Waterfalls |
| | 1275712 | Cocktail Bar Hop | `sj` | Around San Juan | Nightlife |
| | 1261571 | Hidden Gem Beaches | Por confirmar | Por confirmar | Beaches |
| | 1262284 | Bad Bunny DTMF | Por confirmar | Por confirmar | Music |
| | 1263497 | Waterfall & Cave | Por confirmar | Por confirmar | Adventure |

Estado de los textos:

- Los títulos cortos, las frases de ruta y las etiquetas son **texto nuevo pendiente de aprobación de C**. No publicar hasta que C los apruebe o los cambie.
- Las filas "Por confirmar" las define C. Mientras tanto, esos tours no tienen ruta: no aparecen bajo ningún botón de ruta y en la cortina se muestra el `excerpt` de `tours.json` en lugar de la frase de ruta.
- Si llega un tour nuevo a `tours.json` sin datos editoriales:
  - En la cortina se usa su título completo, recortado con `…` si pasa de dos líneas.
  - No lleva ruta ni etiqueta.
  - Avisarle a C en el chat para que le ponga sus datos.

### 5.3 Reseñas: regla fija

- **Nunca mostrar una cifra de reseñas en ningún lugar de la página.**
- En `tours.json`, los tours con `reviews: 27` tienen el total de la empresa, no reseñas propias. Nunca mostrar ese número.
- La estrella con nota (`★ 5.0`, `★ 4.9`) sale **solo** en los tours cuya etiqueta en la tabla lo dice. No se calcula desde `tours.json`.
- El distintivo del hero es el de la empresa, sin cifra.

### 5.4 Formatos

| Dato | Formato | Ejemplo |
|---|---|---|
| Precio | `From $` + dos decimales y separador de millares (la función `precio()` actual ya lo hace) | `From $150.00`, `From $1,300.00` |
| Duración | Corta: `hours` → `h`, `minutes` → `min`, sin "and" | `6 hours and 30 minutes` → `6 h 30 min`; `1 hour` → `1 h` |
| Título corto | Tal cual la tabla, sin mayúsculas forzadas | `La Perla` |

---

## 6. La ventana

### 6.1 Estructura

```html
<article class="ventana-tour" data-line="{linea}" style="--foto:url('{primera foto}')">
  <div class="ventana">
    <div class="ventana-resplandor" aria-hidden="true"></div>
    <div class="ventana-marco">
      <div class="ventana-aro">
        <div class="ventana-pantalla">
          <!-- fotos del carrusel actual -->
          <div class="ventana-crt" aria-hidden="true"></div>
          <div class="ventana-hud" aria-hidden="true">
            <span><b style="background:{color de la ruta}"></b>{NOMBRE DE LA RUTA}</span>
            <span>{coordenadas}</span>
          </div>
          <div class="ventana-cortina" id="cortina-{id}">
            <div class="ventana-detalle">
              <div class="ventana-linea">{muestra de la ruta} {nombre de la ruta}</div>
              <h3>{título completo de tours.json}</h3>
              <p>{frase de ruta}</p>
              <button class="bokunButton ..." data-src="{bookingUrl}">Book Now</button>
            </div>
            <p class="ventana-nombre">{título corto}</p>
            <div class="ventana-datos">
              <span>{etiqueta}</span>
              <span>· {duración}</span>
              <span>· From {precio}</span>
            </div>
            <button class="ventana-tirador" type="button" aria-expanded="false"
                    aria-controls="cortina-{id}">
              <span class="solo-lectores">Show details for {título}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</article>
```

- Ya no hay título en arco sobre la ventana. El nombre corto va en la cortina.
- "See details" no se implementa: el sitio no tiene página de detalle por tour.
- `--foto` es la primera foto del tour; alimenta el resplandor.

### 6.2 Capas y medidas

La ventana entera mantiene la proporción `260 / 320`.

| Capa | Valor |
|---|---|
| Resplandor | Detrás de todo. `inset: 4% 6% 0`, `border-radius: 40% / 30%`, fondo `var(--foto)` centrado y a cubrir (con `#09a7c3` de respaldo), `filter: blur(34px) saturate(1.7) brightness(1.15)`, opacidad 0.5, bajado un 5%. Con mouse, sube a 0.75 en 0.4 s |
| Marco | `border-radius: 27% / 22%`, relleno 6%. Fondo: `radial-gradient(110% 80% at 72% 108%, rgba(9,167,195,.38), transparent 58%)` sobre `linear-gradient(160deg, #1a4f5c 0%, #0b2f39 42%, #041820 100%)`. Sombras: `inset 0 1.5px 0 rgba(255,255,255,.22)`, `inset 0 -3px 8px rgba(0,0,0,.55)`, `inset 0 0 0 1px rgba(255,255,255,.07)`, `0 28px 60px rgba(0,0,0,.55)` |
| Aro encendido | `border-radius: 25% / 20%`, relleno 3.4%, fondo `linear-gradient(205deg, #0b2d37, #01121a)`. Sombras: `inset 0 0 0 1.5px rgba(9,167,195,.7)`, `inset 0 0 26px rgba(9,167,195,.45)`, `0 0 22px rgba(9,167,195,.28)`, `inset 0 3px 6px rgba(0,0,0,.6)` |
| Pantalla | `border-radius: 23% / 18.5%`, `overflow: hidden`, fondo `--ocean`. Sombras: `0 0 0 1.5px rgba(170,240,255,.55)`, `0 0 14px rgba(9,167,195,.5)` |
| Foto | Cubre la pantalla (`object-fit: cover`), `filter: saturate(1.08) contrast(1.05)` |
| Efecto pantalla (`.ventana-crt`) | Encima de la foto, sin eventos. Tres fondos: líneas `repeating-linear-gradient(0deg, rgba(0,0,0,.14) 0 1px, transparent 1px 3px)`; reflejo `linear-gradient(128deg, transparent 30%, rgba(255,255,255,.13) 40%, transparent 50%)`; viñeta `radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(2,22,29,.7) 100%)`. Más `box-shadow: inset 0 0 44px rgba(9,167,195,.38)` |
| Línea de datos (HUD) | Abajo, a 8% del borde y 13% de los lados. JetBrains Mono 700, 10 px en celular y 11 px en escritorio, espaciado 0.12em, `#9ff3ff`, `text-shadow: 0 0 8px rgba(9,167,195,.95), 0 0 2px rgba(0,0,0,.8)`. A la izquierda un punto de 8 px del color de la ruta con brillo y el nombre de la ruta; a la derecha las coordenadas. Hasta 420 px de ancho solo se ve la ruta |

| Rejilla | Celular | Escritorio |
|---|---|---|
| Columnas | Una, ventana de hasta 440 px centrada | Dos, ventana de hasta 500 px |
| Separación | 56 px entre ventanas | 72 px entre filas y 96 px entre columnas |

### 6.3 Coordenadas por ruta (texto nuevo)

| Ruta | Coordenadas |
|---|---|
| `south` | 18.01°N 66.61°W |
| `west` | 18.34°N 67.25°W |
| `inland` | 18.16°N 66.72°W |
| `coffee` | 18.19°N 65.96°W |
| `east` | 18.43°N 65.88°W |
| `sj` | 18.47°N 66.12°W |
| `island` | 360° · PR |

Si el tour no tiene ruta, la línea de datos no se muestra.

### 6.4 La cortina

| Estado | Alto | Qué se ve |
|---|---|---|
| Subida (por defecto) | 30% de la pantalla | Nombre corto, línea de datos y tirador |
| Bajada | 80% de la pantalla | Ruta, título completo, frase de ruta y Book Now; debajo la línea de datos y el tirador. El nombre corto se esconde para no repetir |

- **Pieza:**
  - Fondo `linear-gradient(180deg, #0f3d49 0%, #0a3039 70%, #082832 100%)`.
  - Sombras `0 6px 14px rgba(0,0,0,.45)` e `inset 0 -1px 0 rgba(170,240,255,.35)`.
  - Pliegues cada 34 px en `rgba(255,255,255,.05)`.
  - Relleno lateral 12% y 24 px abajo; el contenido se apila hacia abajo.
- **Tirador encendido:**
  - Pestaña del 26% del ancho y 9 px de alto, esquinas de 3 px, que sobresale 5 px por debajo de la cortina.
  - Fondo `linear-gradient(180deg, #5fe0f5, #09a7c3)` y brillo `0 0 14px rgba(9,167,195,.9), 0 0 3px rgba(255,255,255,.6)`.
  - El botón que la cubre ocupa todo el ancho y 44 px de alto.
- **Nombre corto:** Manrope 800, 21 px en celular y 25 px en escritorio, interlineado 1.15, blanco, centrado, `text-shadow: 0 0 12px rgba(9,167,195,.55)`, 6 px sobre los datos.
- **Datos:**
  - Manrope 700, 13 px en celular y 14 px en escritorio, blanco y centrado.
  - Los puntos separadores van en `--primary`.
  - La etiqueta de estrella va en `#5fe0f5` con brillo teal.
  - En celular el precio baja a su propio renglón y pierde el punto de delante, para que ningún renglón empiece con un punto suelto.
- **Detalle:**
  - Ruta en JetBrains Mono 700, 10 px, mayúsculas, espaciado 0.14em, `#9ff3ff`, con la muestra de su línea de 26 px.
  - Título: 19 px en celular y 23 px en escritorio, 700, blanco.
  - Frase: 15 px en celular y 16 px en escritorio, `rgba(255,255,255,.82)`.
  - Separado de los datos por 1 px `rgba(170,240,255,.22)`.
- **Book Now:**
  - Fondo blanco, texto `--ocean`, 700, 14 px, alto 44 px, relleno 0 20 px, sin esquinas redondeadas.
  - Brillo `0 0 18px rgba(9,167,195,.45)`.
  - Hover: fondo `--sand`.
  - Tiene que seguir siendo el `.bokunButton` con `data-src` que abre la reserva de Bókun, como hoy.

**Cómo baja:**

| Dónde | Qué la baja |
|---|---|
| Con mouse (`@media (hover:hover)`) | `:hover` y `:focus-within` de la ventana |
| En pantallas táctiles | Tocar el tirador: alterna la clase `.abierta` en la ventana y el `aria-expanded` del botón |

- Movimiento: alto con transición de 0.6 s `cubic-bezier(.2,.7,.2,1)`. El detalle aparece con opacidad a los 0.15 s.
- Con `prefers-reduced-motion: reduce`, sin transiciones.
- Mientras la cortina está subida, el detalle lleva `visibility: hidden`, para que el teclado no entre a un botón invisible.

### 6.5 Fotos

- Se conserva el carrusel actual (`iniciarCarruseles` en `script.js`) dentro de la pantalla: las fotos van pasando como el paisaje por la ventana. El efecto de pantalla y la línea de datos quedan encima de todas.
- Se conserva el botón "Pause photo slideshows", con estilo para fondo oscuro: borde 1.5 px `rgba(255,255,255,.4)`, texto blanco.
- Si el carrusel no encaja con la pantalla redondeada, basta con la primera foto. Decírselo a C.

---

## 7. Resto del catálogo

| Elemento | Valor |
|---|---|
| Fondo de la sección | `--ocean2` `#021d26`, con un borde superior de 1 px `rgba(255,255,255,.08)` |
| Relleno | 56 px arriba y 72 abajo en celular; 88 y 104 en escritorio |
| Rótulo | `ALL TOURS`, mismo estilo que el rótulo del hero |
| Buscador | Alto 52 px, fondo `rgba(255,255,255,.04)`, borde 1 px `rgba(255,255,255,.28)`, texto blanco, marcador de posición `rgba(255,255,255,.6)`, lupa en `--primary`. En escritorio va a la derecha del rótulo y mide 420 px |
| "View all tours" | Contorno blanco de 1.5 px, texto blanco; hover fondo blanco y texto `--ocean`. Centrado, 48 px bajo las ventanas |
| Textos de vacío, error y WhatsApp | Los mismos de hoy, en blanco al 80%, con los enlaces subrayados en blanco |
| Fondo de la página (`body.tours-page`) | `--ocean2`, para que no se vea claro al estirar la página |

El pie compartido no cambia.

---

## 8. Colores

Los del sitio, más los tonos propios de la ventana y la ruta del café:

| Variable o valor | Uso |
|---|---|
| `--ocean` `#032833` | Hero, cristal, cortina |
| `--ocean2` `#021d26` | Catálogo y fondo de página |
| `#1a4f5c` → `#041820` | Degradado del marco de la ventana |
| `#0f3d49` → `#082832` | Degradado de la cortina |
| `#5fe0f5` | Tirador encendido y estrellas de la cortina |
| `#9ff3ff` | Textos tipo pantalla (JetBrains Mono) |
| `--primary` `#09a7c3` | Rótulos, estrellas, separadores, rutas South, East y Old San Juan |
| `#eaf7f8` | Ruta Mountains |
| `#d9b98c` | Ruta Coffee Hills (nuevo, solo en el mapa y su botón) |
| `--sand` `#f7f4ef` | Hover de Book Now |

---

## 9. Accesibilidad

- Todo el texto sobre `--ocean` y `--ocean2` es blanco o blanco al 62% como mínimo (los nombres de las islas). Comprobar contraste AA en todo lo que no sea decorativo.
- Todos los botones y enlaces miden 44 px de alto como mínimo.
- El título completo está en el `<h3>` de la cortina. Como el detalle lleva `visibility: hidden` con la cortina subida, repetir el título en un `.solo-lectores` fuera del detalle, para que el lector de pantalla lo lea siempre.
- La línea de datos tipo pantalla y el efecto CRT son decorativos (`aria-hidden`).
- Revisar el contraste de la línea de datos sobre fotos claras; si no llega a AA, oscurecer un poco más la viñeta de abajo.
- El contador de resultados para lectores de pantalla (`data-tours-count`) se mantiene y cuenta también el filtro de ruta.
- Foco visible en botones de ruta, tirador, Book Now y buscador.

---

## 10. Verificación antes de pedir aprobación

### Contenido

1. No aparece ninguna cifra de reseñas en la página, ni siquiera en `aria-label`.
2. La estrella solo sale en los cinco tours de la tabla que la llevan.
3. Precios con dos decimales y separador de millares; duraciones en formato corto.
4. No queda la frase "Every tour we run, in one place".
5. Los diez primeros salen en el orden de la tabla y los de Ponce no quedan juntos.

### Mapa

6. En escritorio, el mapa plano se ve completo con todas las islas y sus nombres.
7. En un celular de 390 px, el mapa en ángulo cabe entero sin deslizar de lado y ningún rótulo queda cortado.
8. Cada botón de ruta resalta su línea y filtra el catálogo; al pulsarlo otra vez vuelve todo.
9. Filtro y buscador funcionan juntos.

### Ventanas

10. Cada ventana se ve sólida y encendida: marco con volumen, aro teal brillante, resplandor con los colores de su foto y líneas finas sobre la foto.
11. El nombre corto y los datos se leen en la cortina subida; en celular ningún renglón empieza con un punto.
12. Con mouse, la cortina baja al pasar por encima y al llegar con el teclado.
13. En celular, tocar el tirador la baja y la sube.
14. Book Now abre la reserva de Bókun como hoy.
15. El home no cambió (los tours destacados usan las clases viejas).

### Funcionamiento

16. Sin video de fondo y sin errores en la consola.
17. Con movimiento reducido, nada pulsa ni se desliza.
18. JetBrains Mono carga (y si no, cae a una letra monoespaciada del sistema).
19. Se prueba en un celular real.
