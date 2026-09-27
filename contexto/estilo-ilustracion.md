# Dirección visual del menú de servicios

Proyecto: Nativo Experience Puerto Rico · Versión 2 · septiembre 2026

Se lee junto con `contexto/menu-servicios.md` (en Mercadeo: `CONTEXTO_menu_servicios_v2.md`). Si algo aquí choca con las reglas de contenido de ese archivo, mandan las reglas de contenido.

---

## 1. El estilo en una línea

**Ilustración lineal, minimalista y un poco cuadrada, con la limpieza de los fondos renderizados de los webtoons coreanos, pero sin nada que delate que viene del cómic.**

Dicho de otra forma: se toma la técnica (línea digital limpia, perspectiva arquitectónica correcta, sombra plana de un solo tono, luz suave) y se deja fuera todo lo narrativo del cómic (personajes, globos de diálogo, viñetas, tramas, líneas de acción).

---

## 2. Qué se toma del render de webtoon coreano

Los webtoons coreanos tienen fondos muy reconocibles: habitaciones, calles y paisajes dibujados a partir de modelos 3D y luego pasados a línea. Eso es lo que interesa.

| Rasgo | Cómo se aplica aquí |
|---|---|
| Línea digital limpia y constante | Un solo grosor de trazo en toda la ilustración, sin variación de pincel. Nada de trazo tembloroso ni de marcador |
| Perspectiva correcta, casi arquitectónica | Objetos y espacios con volumen real: una barra con profundidad, una terraza con piso en perspectiva, una mesa de masaje con sus patas bien puestas |
| Geometría simplificada | Todo se reduce a formas limpias. Una silla son cuatro rectángulos, no un dibujo detallado |
| Sombra plana de un tono | Una sola sombra, sin degradado, en un teal muy claro o en `--sand` oscurecido. Máximo dos rellenos por ilustración |
| Luz suave | Opcional: un solo halo muy tenue (ventana, atardecer) como degradado plano. Si distrae, se quita |
| Encuadre de "plano de ambiente" | Cada ilustración es un lugar con uno o dos objetos protagonistas, como el plano que abre una escena |

## 3. Qué se deja fuera para que no parezca cómic

- **Nada de personajes.** Ni caras, ni ojos grandes, ni cuerpos completos. Como mucho, unas manos sosteniendo algo, dibujadas con la misma línea que los objetos.
- Nada de globos de diálogo, onomatopeyas, líneas de velocidad, brillos de anime o estrellitas.
- Nada de tramas de puntos (screentone) de manga. La referencia 2 usa punteado, pero aquí se reemplaza por relleno plano.
- Nada de viñetas con márgenes blancos entre ellas como una tira. La retícula de la carta se construye con líneas divisorias continuas, como en las referencias 1 y 3.
- Nada de cielos saturados, atardeceres rosados ni paletas de color de cómic. La paleta es la de la marca y nada más.
- Nada de encuadres dramáticos (contrapicado extremo, ojo de pez). Vista frontal o tres cuartos, a la altura de los ojos o un poco desde arriba.

## 4. Qué lo hace "un poco cuadrado"

- **El encuadre de cada ilustración es un cuadrado** (1:1), o un rectángulo 4:3 si la retícula lo pide. La escena llena el cuadro y se corta limpio en el borde.
- Predominan las **líneas horizontales y verticales**: marcos de puertas, barandas, tablones, el borde de la barra, el tronco de los árboles. Las curvas se usan poco y con intención (hojas, agua, la tortuga).
- **Uniones en ángulo recto.** `stroke-linejoin: miter` para que las esquinas se vean cuadradas; `stroke-linecap: round` para que los finales de línea no se vean duros.
- **Guiño al logo:** los cuadrados superpuestos del caparazón de la tortuga pueden aparecer como detalle en una o dos ilustraciones (baldosas del piso, una ventana de cuadros, el patrón de una toalla). Sin forzarlo en todas.
- Los íconos pequeños del índice se construyen sobre una **cuadrícula de 24 x 24** con esquinas rectas.

## 5. Especificaciones técnicas

| Elemento | Especificación |
|---|---|
| Formato | SVG, un archivo por ilustración, sin imágenes incrustadas |
| Lienzo | 480 x 480 (ilustraciones de servicio), 24 x 24 (íconos) |
| Trazo | 2px a 480px de ancho, constante. Íconos: 1.5px |
| Color de línea | `currentColor`, para controlarlo desde CSS (`--primary` sobre `--sand`; blanco sobre `--ocean`) |
| Rellenos | Máximo dos: `--white` y un tono de sombra. Declarados como variables CSS, no como valores fijos |
| Esquinas | `stroke-linejoin: miter`, `stroke-linecap: round` |
| Peso | Menos de 30 KB por ilustración, sin metadatos de editor |
| Texto | Ninguna ilustración lleva texto dentro |
| Accesibilidad | `role="img"` y `aria-label` en inglés que describa la escena |

Las cinco ilustraciones deben verse hechas por la misma mano: mismo trazo, mismo nivel de detalle, misma altura de horizonte cuando aplique. Antes de terminar, se ponen las cinco juntas en una fila para comprobarlo.

---

## 6. Las referencias

Están en `~/Documents/Nativo Experience/Mercadeo/proyectos/menu-servicios/_referencias/`, en la Mac de C. **No se suben al repositorio**, porque es público y son plantillas de terceros. Solo una sesión local puede abrirlas; una sesión en la nube trabaja con la descripción de esta tabla. Ninguna se copia; de cada una se toma algo concreto.

| Nº | Archivo | Qué se toma | Qué no se toma |
|---|---|---|---|
| 1 | `ref_01_menu_rojo_iconos_lineales.png` | **La principal.** Íconos de línea de un solo color sobre fondo crema, retícula de cuatro con líneas divisorias gruesas en cruz, título de sección debajo de cada ícono, lista limpia | La tipografía de pincel y el rojo |
| 2 | `ref_02_tragos_de_autor.png` | Títulos en mayúsculas con espaciado muy amplio; línea fina bajo el título; la sensación de carta elegante | El punteado de las ilustraciones y la fila de vasos al pie |
| 3 | `ref_03_menu_verde_reticula.png` | La retícula de líneas que cruzan de borde a borde; encabezados de sección dentro de su franja; un solo color de marca sobre fondo claro | La tipografía redondeada |
| 4 | `ref_04_menu_restaurante_color.png` | Solo la alternancia de ilustración grande a un lado y texto al otro, útil en escritorio | Todo el estilo de dibujo: color plano saturado, sombras desplazadas, tipografía de cartel. Es lo contrario de lo que se busca |
| 5 | `ref_05_carta_columnas_fotos.png` | Las columnas verticales con el precio en una etiqueta sólida, útil para los tres paquetes de la barra | Las fotos recortadas en rombo y el fondo de mármol |

Resumen: **la referencia 1 da el sistema** (ícono lineal + retícula + un color), la 2 y la 3 dan la tipografía y las líneas, y la 4 y la 5 aportan solo ideas de composición.

---

## 7. El encargo de cada ilustración

Cada escena es un lugar donde se hospeda o visita el cliente, nunca un local de Nativo. Sin personas; como mucho, manos.

### 01 · Private Catering

- **Escena:** la cocina abierta de una villa de alquiler, vista de frente. Encimera con tabla de cortar, un sartén en la estufa con un hilo de vapor, un par de platos listos. Al fondo, una ventana de cuadros que deja ver montaña.
- **Detalle de marca:** la ventana en cuadros como guiño al caparazón.
- **Evitar:** gorro de chef, platos reconocibles de comida típica en primer plano, cualquier cosa que parezca un restaurante.

### 02 · Forest Yoga and Breathwork

- **Escena:** una plataforma de madera o una roca plana junto a un río, entre troncos verticales altos (bambú o ausubo). Una esterilla extendida y otra enrollada. El agua en líneas horizontales suaves.
- **Detalle de marca:** los troncos verticales dan el ritmo cuadrado.
- **Evitar:** una figura en postura de yoga, flores de loto, símbolos espirituales.

### 03 · Scenic Massage with a View

- **Escena:** una mesa de masaje en una terraza, con una toalla doblada y una pequeña pila de toallas al lado. Baranda de líneas rectas y, detrás, el horizonte (mar o montaña, uno solo).
- **Detalle de marca:** la toalla doblada puede llevar un borde de cuadros.
- **Evitar:** velas y piedras apiladas de spa genérico, orquídeas, cualquier persona en la mesa.

### 04 · Concierge Services

- **Escena:** una mesa de terraza vista un poco desde arriba. Encima: un teléfono con una conversación abierta (burbujas vacías, sin texto), una llave de casa, un mapa doblado de la isla y una taza de café.
- **Detalle de marca:** el contorno de Puerto Rico en el mapa, simplificado.
- **Evitar:** que las burbujas del teléfono parezcan globos de cómic (van dentro de la pantalla, rectangulares y pequeñas), íconos de apps reales, logos.

### 05 · Private Bartender at Your Villa

- **Escena:** la terraza de una casa al caer la tarde. Una barra montada con coctelera, colador, jigger, tres o cuatro vasos, un cuenco con limones y hierbas, y la nevera para el hielo a un lado.
- **Detalle de marca:** el halo tenue de la tarde es la única luz de las cinco ilustraciones; aquí sí se usa.
- **Evitar:** botellas de alcohol (el alcohol no está incluido), comida, música, carpas o decoración de fiesta, un local con letrero.

### Íconos pequeños (índice y How it works)

Nueve íconos de 24 x 24, con el mismo trazo:

| Uso | Ícono |
|---|---|
| Índice 01 | Sartén |
| Índice 02 | Esterilla enrollada |
| Índice 03 | Toalla doblada |
| Índice 04 | Teléfono con burbuja |
| Índice 05 | Coctelera |
| How it works 1 · Tell us the basics | Casa con un punto de ubicación |
| How it works 2 · We shape it | Hoja con líneas |
| How it works 3 · You confirm | Cuadrado con marca de visto |
| How it works 4 · We show up | La tortuga del logo, simplificada |

---

## 8. Prueba rápida antes de entregar

Mostrar las cinco ilustraciones juntas y responder:

1. ¿Alguien diría "esto es de un cómic"? Si sí, algo sobra (casi siempre un personaje, una trama o un color).
2. ¿Se ven de la misma familia que la tortuga del logo?
3. ¿Hay algo en algún dibujo que el servicio no incluya?
4. ¿Se entiende cada servicio por el dibujo solo, sin leer el título?
5. ¿Funcionan en `--primary` sobre `--sand` y en blanco sobre `--ocean`?
