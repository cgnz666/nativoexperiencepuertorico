# Contexto para rediseñar el menú de servicios

Proyecto: Nativo Experience Puerto Rico · nativoexperiencepuertorico.com/services.html
Preparado: septiembre 2026 · Versión 2

---

**Archivo vigente.** En esta carpeta, un archivo que empieza con `z_` está desactualizado: lo sustituyó una versión nueva y se conserva solo por si hace falta volver atrás. Cuando salga un v3, este archivo pasa a llamarse `z_CONTEXTO_menu_servicios_v2.md`. La regla completa está en `CONVENCION_ARCHIVOS.md`, en la raíz de Nativo Experience.

Este proyecto tiene tres archivos que se leen juntos:

| En Mercadeo (Mac de C) | En el repositorio | Qué contiene |
|---|---|---|
| `CONTEXTO_menu_servicios_v2.md` | `contexto/menu-servicios.md` | Este archivo: qué se rediseña, la marca, el contenido y las reglas |
| `ESTILO_ilustracion_v2.md` | `contexto/estilo-ilustracion.md` | La dirección visual: estilo de línea, referencias y el encargo de cada ilustración |
| `PLAN_menu_servicios_v2.md` | `contexto/plan-menu-servicios.md` | El orden de los pasos y la verificación final |
| `_referencias/` | no se sube | Las cinco imágenes de referencia. Son plantillas de terceros y el repositorio es público: se quedan en `Mercadeo/proyectos/menu-servicios/_referencias/` y solo las abre una sesión local |

---

## 1. Qué se va a hacer

Rediseñar la página de servicios para que se lea como **una carta**: un menú limpio, ordenado en retícula, donde cada servicio tiene su propia ilustración lineal y se encuentra de un vistazo.

Hoy la página funciona, pero cada servicio es un bloque largo de texto con foto. El cliente tiene que leer para entender qué se ofrece. La meta es que en el celular, en dos o tres desplazamientos, el cliente vea los cinco servicios, entienda cada uno por su dibujo y su título, y sepa qué botón tocar.

**Este proyecto cambia la presentación, no la oferta.** Los servicios, los precios, las políticas y los textos aprobados se mantienen. Si hace falta acortar un texto para que quepa en la carta, se recorta; no se añade nada que no esté publicado hoy.

---

## 2. La marca en una página

| Campo | Dato |
|---|---|
| Nombre | Nativo Experience Puerto Rico |
| Sitio | nativoexperiencepuertorico.com |
| Redes | @nativoexperiencepr |
| Contacto | info@nativotourspr.com · +1 (939) 360-9002 · WhatsApp |
| Símbolo | Tortuga (resiliencia y diversidad cultural de Puerto Rico) |
| Tagline | Local guides. Real places. A deeper way to experience Puerto Rico. |
| Idioma de la web | Inglés, con palabras en español como toque cultural |

**Quién es.** Experiencias culturales, de naturaleza y bienestar, diseñadas y guiadas por locales, para grupos pequeños y privados. La promesa es mostrar el Puerto Rico que los guías le enseñarían a sus amigos, lejos del turismo masivo.

**A quién le habla.** Parejas de EE.UU. de 30 a 55 años; grupos pequeños y familias de 2 a 6 personas; viajero de bienestar. Deciden desde el celular, muchas veces de noche y ya en la isla.

**Cómo suena.** El amigo local cálido. Anfitrión, no vendedor. Frases que respiran. Muestra en vez de adjetivar.

**Línea roja: no exotizar.** Nada de "tropical paradise", "untouched", "exotic", "natives". No presentar comunidades como atracción. Esto aplica igual a las ilustraciones: nada de palmeras con coco y hamaca de postal, nada de loros ni cócteles con sombrillita.

### El logo ya define el estilo

El logo es una tortuga dibujada en **línea de grosor uniforme**, con el caparazón formado por **cuadrados superpuestos**. Es lineal, es cuadrado y es de un solo color. La nueva carta sale de ahí: las ilustraciones deben sentirse de la misma familia que la tortuga.

Archivos de logo (en `Mercadeo/proyectos/Logo Nativo Experience/`): `logo-teal.png`, `logo-white.png`, `logo-outline.png` y los `.ai` originales.

### Colores

Los del sitio, tal como están en `styles.css`. No se inventan colores nuevos.

| Variable | Valor | Uso en la carta |
|---|---|---|
| `--primary` | `#09a7c3` | Línea de las ilustraciones y acentos |
| `--primary-dark` | `#067b92` | Títulos de servicio, botones |
| `--boton-hover` | `#045a6b` | Estado hover del botón |
| `--ocean` | `#032833` | Fondo de secciones oscuras; línea sobre fondo claro si se quiere más contraste |
| `--ocean2` | `#021d26` | Fondo oscuro alterno |
| `--sand` | `#f7f4ef` | Fondo de la carta (el "papel") |
| `--white` | `#ffffff` | Relleno plano dentro de las ilustraciones |
| `--text` | `#14343b` | Texto |
| `--muted` | `#55666c` | Texto secundario, detalles |

El teal del logo impreso mide `#079db6` (letras) y `#0ca6ad` (tortuga). Son prácticamente el `--primary`; en la web se usa la variable.

### Tipografía

El sitio usa **Manrope**. Se mantiene para el texto. Para los títulos de la carta se puede usar Manrope en mayúsculas con espaciado amplio (como la referencia 2), sin traer una fuente nueva. Si se trae una segunda fuente para títulos, debe ser geométrica y recta, cercana a la del logo, y cargarse de Google Fonts.

---

## 3. Lo que hay hoy en la página

Estructura publicada, de arriba abajo:

1. **Hero:** "The island, around you." Botones "Plan Your Stay" y "See the Services".
2. **Índice numerado** del 01 al 05.
3. **Introducción:** "A trip here should feel like you have people on the island."
4. **Cinco tarjetas de servicio** (detalle en la sección 4).
5. **How it works:** cuatro pasos. Tell us the basics · We shape it · You confirm · We show up.
6. **Good to know:** cuatro bloques. Where we go · How far ahead · What it costs · Worth mentioning.
7. **Cierre:** "Tell us where you are staying." Botones "Chat on WhatsApp" y "Email Us".
8. **Pie de página** del sitio.

---

## 4. Los cinco servicios

El texto de cada tarjeta se toma del `services.html` publicado. Esta tabla es el inventario para diseñar, no un texto nuevo.

| Nº | Servicio | Subtítulo | Tipo de venta | Botón |
|---|---|---|---|---|
| 01 | Private Catering | Wherever You Are Staying | Cotización | Request a quote |
| 02 | Forest Yoga | and Breathwork | Cotización | Request a quote |
| 03 | Scenic Massage | With a View | Cotización | Request a quote |
| 04 | Concierge | Services | Cotización | Request a quote |
| 05 | Private Bartender | at Your Villa | Precio cerrado, reserva directa | Book this package |

Detalles cortos que ya existen en cada tarjeta y que sirven como "etiquetas" en la carta:

| Nº | Etiquetas publicadas |
|---|---|
| 01 | Breakfast, dinner or celebration · Your rental, hotel or villa · From couples to full groups |
| 02 | All levels · Forest and river valleys · Private or small group |
| 03 | Single or couples · Island-wide · In-room available |
| 04 | Before and during your stay · Island-wide · Direct WhatsApp line |
| 05 | Up to 8, 16 or 25 guests · 4 hours · Flat price |

### El servicio 05 es distinto a los demás

Es el único con precio publicado y reserva directa. En la carta tiene que verse esa diferencia: los tres paquetes con su precio visibles, y un botón que lleva al pago. Los otros cuatro llevan a cotización.

| Paquete | Hasta | Precio |
|---|---|---|
| Bar for the Crew | 8 invitados | $679.00 |
| Bar for the Squad | 16 invitados | $799.00 |
| Bar for the Whole Villa | 25 invitados | $899.00 |

La fuente única del texto y las reglas de la barra es `contexto/oferta-barra-movil.md` en el repositorio (copia de `CONTEXTO_oferta_barra_movil_v4.md`). Este rediseño no cambia nada de ese archivo; si hay conflicto, manda ese.

---

## 5. Reglas de contenido

1. **Nada nuevo en la oferta.** Una ilustración no puede mostrar algo que el servicio no incluye. Si el texto no lo dice, el dibujo tampoco.
2. **Barra móvil:** el alcohol no está incluido. La ilustración no muestra botellas como si vinieran con el servicio, ni comida, ni músicos, ni un lugar que parezca un local propio. Muestra herramientas de bartender, vasos, garnish, la nevera y la barra montada en la terraza de una casa.
3. **Nativo no tiene un lugar propio para eventos.** Los servicios pasan donde se hospeda el cliente (villa, casa, alquiler) o en la naturaleza. Ningún dibujo debe leerse como "el local de Nativo".
4. **Sin personas identificables.** Ni caras ni figuras protagonistas. La calidez viene de lugares, objetos y, como mucho, manos. Esto además protege el estilo (ver `contexto/estilo-ilustracion.md`).
5. **No se publican márgenes, costos, tarifas de aliados ni duraciones de recorridos.**
6. **Precios con formato de dos decimales** en español ($679.00). En la versión en inglés de la web se mantiene lo que ya está publicado.

---

## 6. Cómo debe funcionar la carta

1. **Mobile primero.** En el celular, cada servicio ocupa como máximo una pantalla: ilustración, número, título, subtítulo, tres etiquetas y botón. El texto largo (lista de lo que incluye) se abre con un "See what's included", no se muestra de entrada.
2. **Retícula visible.** En escritorio, los servicios van en una retícula de dos o tres columnas separada por líneas finas, como las referencias 1 y 3. La línea divisoria es parte del diseño, no un borde de tarjeta con sombra.
3. **Numeración grande y limpia** (01 a 05), heredada del índice actual.
4. **Un botón por servicio.** "Request a quote" abre WhatsApp con el mensaje prellenado que ya existe. "Book this package" lleva a la reserva de la barra.
5. **El índice del principio se convierte en la carta resumida:** cinco íconos lineales pequeños con su nombre, que llevan a cada servicio. Es la vista "menú" completa en una sola pantalla.
6. **How it works** usa cuatro íconos lineales del mismo sistema en vez de números solos.
7. **Rendimiento:** las ilustraciones van como SVG en línea o archivos `.svg` livianos, no como PNG pesados. Cada una con `aria-label` o `alt` en inglés que describa la escena.
8. **Esquinas:** la página de servicios usa esquinas rectas o casi rectas (0 a 6px), para acompañar el estilo cuadrado. No se cambia el `--radius` del resto del sitio.

---

## 7. Qué se le entrega a la persona que revisa

1. Una propuesta de la carta en celular y escritorio, antes de implementar.
2. Las ilustraciones de los cinco servicios y los íconos (índice y How it works) como archivos `.svg` separados, en `assets/services/`.
3. La página implementada en `services.html` con sus estilos.

La revisión se hace contra la lista de verificación de `contexto/plan-menu-servicios.md`.
