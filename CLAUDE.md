# CLAUDE.md · Flujo de trabajo: construir, verificar, corregir

Este archivo es el "cerebro" del proyecto. Claude lo lee al comenzar cada sesión. El objetivo es que cada entrega llegue terminada y verificada, de modo que C solo tenga que hacer una revisión mínima.

## 1. Contexto del proyecto

| Campo | Valor |
|---|---|
| Proyecto | Sitio web de Nativo Experience Puerto Rico |
| Tipo | Sitio estático (HTML, CSS, JS) publicado con dominio propio (CNAME) |
| Archivos principales | `index.html`, `styles.css`, `script.js`, `assets/` |
| Idioma del contenido | Se define por proyecto, nunca se asume. Este sitio: **inglés**. |
| Público | Visitantes y turistas, mayormente desde el celular |

La carpeta `contexto/` tiene un documento de referencia por tema (por ejemplo, la oferta de la barra móvil). Antes de escribir o revisar algo de ese tema, leer el documento que le corresponde.

## 1.1 Dónde vive cada cosa

| Qué | Dónde | Quién lo puede abrir |
|---|---|---|
| Código del sitio | este repositorio, `origin/main` en GitHub | todas las sesiones |
| Plantillas de diseño, fotos sin procesar, contexto de marca | `~/Documents/Nativo Experience/Mercadeo`, en la Mac de C | **solo las sesiones locales** |

`origin/main` es la fuente de verdad del código: de ahí sale el sitio publicado.

**Este repositorio es público.** Cualquiera puede leer todos sus archivos y
todo su historial, no solo lo que se ve en el sitio. Un archivo dentro del
repositorio no es una nota interna: es publicación. Los documentos de
contexto con tarifas del aliado, pisos de precio, márgenes o nombres de
terceros se quedan en la carpeta de Mercadeo, en la Mac de C, y se le pasan
a Claude adjuntos en el chat, nunca commiteados.

Una sesión en la nube no puede abrir la carpeta de Mercadeo. Si una tarea
depende de esas plantillas o de esas fotos, solo se puede hacer en sesión
local: decirlo y parar, nunca inventar el insumo que falta.

## 1.2 Antes de tocar un archivo, poner la copia al día

La copia local se queda atrás sin avisar, porque el trabajo entra por varios
lados: GitHub, sesiones en la nube en ramas `claude/*`, y esta máquina. Un
sitio atrasado se ve perfecto en local; simplemente le falta la mitad.

El hook de inicio hace `git fetch` y muestra el estado. Según lo que diga:

- **Solo `behind N`:** actualizar con `git merge --ff-only @{u}` antes de leer
  o editar nada, sin preguntar. Es seguro: si fuera a pisar un cambio local
  sin guardar, git se niega y no toca nada.
- **Si git se niega, o dice `ahead N` y `behind N` a la vez:** decírselo a C
  y no editar todavía.
- **Solo `ahead N`:** hay trabajo aquí que el remoto no tiene. Mencionarlo una
  vez.

## 2. Reglas generales

- Responder en el chat en español.
- El idioma del contenido de un entregable no se asume. Si no está definido en la tabla de arriba, preguntar a C antes de redactar. Si una petición choca con el idioma del sitio existente, preguntar antes de escribir una sola línea.
- No usar guiones largos pareados como paréntesis. Usar comas, paréntesis o reestructurar.
- Moneda siempre con dos decimales y con separador de millares cuando toque:
  `$90.00`, `$1,300.00`. Nunca `$90` ni `$1300.00`.
- No borrar ni sobrescribir archivos sin que se pida. Cambios grandes van en una rama de git.
- Las notas internas (dudas, pendientes, cosas a verificar) van en el chat, nunca dentro del sitio ni de los entregables.
- No inventar datos del negocio (precios, horarios, teléfonos, direcciones). Si falta un dato, preguntar o dejarlo marcado en el chat.
- Nunca trabajar a ciegas sobre algo que no se ha podido ver. Si hace falta cargar el sitio publicado, un widget de terceros o cualquier recurso externo, pedírselo a C antes de empezar, nombrando los dominios exactos y para qué se necesitan. Ver **Acceso a sitios externos**.

## 2.1 Acceso a sitios externos

Las sesiones en la nube salen a internet por una política de red del entorno.
Por defecto está en **Trusted**, que solo permite paquetes, GitHub y SDKs: ni el
sitio publicado ni los widgets de terceros se pueden cargar. Sin eso, Claude
trabaja a ciegas y adivina cómo se ve el resultado.

Cuando haga falta un dominio nuevo, Claude lo pide así: qué dominio, para qué, y
qué deja de poder verificar si no lo tiene.

C lo habilita en **claude.ai/code** → icono de nube sobre la caja de mensaje →
**Nube** → pasar el cursor sobre el entorno y pulsar el **engranaje** →
**Network access** a **Custom** → un dominio por línea, marcando
**"Also include default list of common package managers"** para no perder lo
que ya funciona.

Dominios ya habilitados en este proyecto:

| Dominio | Para qué |
|---|---|
| `*.bokun.io` | Cargar el widget de reservas y consultar la API de productos |
| `imgcdn.bokun.tools` | Fotos de los tours. Ojo, es `.tools`, no lo cubre el comodín de `.io` |
| `nativoexperiencepuertorico.com` | Ver el sitio publicado tal como lo ve un visitante |
| `cgnz666.github.io` | Ver la versión de GitHub Pages antes del dominio propio |

## 3. El ciclo de trabajo

Toda tarea que cambie el sitio sigue estas cinco fases, en orden. Una pregunta, una revisión o un informe no necesitan capturas ni lista de cotejo.

### Fase 1 · Entender y planificar

- Si la petición es ambigua, hacer las preguntas necesarias **antes** de construir (una sola ronda, concreta).
- Dejar claro cómo se sabrá que quedó bien (criterios de aceptación).
- Si hay referencias de diseño (capturas, enlaces, textos dictados), son el estándar contra el cual se compara el resultado.

### Fase 2 · Construir

1. Implementar el plan en pasos pequeños.
2. Reutilizar los estilos, colores, tipografías y componentes que ya existen en `styles.css`. No crear estilos duplicados.
3. Mantener el código limpio: sin código muerto, sin `console.log` olvidados, sin enlaces rotos.

### Fase 3 · Verificar con capturas (bucle visual)

Esta es la fase clave. Claude no da el trabajo por terminado sin haberlo **visto**.

1. Servir el sitio localmente (por ejemplo `python3 -m http.server 8000`).
2. Tomar capturas de pantalla completas con el navegador disponible (el navegador integrado, Chrome headless o Playwright, según la máquina) en al menos estos anchos:
   - Móvil: 390 px
   - Tableta: 768 px
   - Escritorio: 1440 px
3. Abrir y mirar cada captura. Compararla con el plan y con las referencias de diseño.
4. Revisar también la consola del navegador: cero errores.
5. Anotar cada problema encontrado y corregirlo.
6. Repetir capturas y revisión hasta que no quede ningún problema. **Mínimo dos rondas**, aunque la primera parezca correcta.

### Fase 4 · Control de calidad (lista de cotejo)

Antes de entregar, confirmar cada punto:

**Diseño**
- [ ] Se ve bien en móvil, tableta y escritorio; nada se sale de la pantalla ni hay scroll horizontal.
- [ ] Espaciados, alineaciones y tamaños de texto consistentes.
- [ ] Colores y tipografías iguales al resto del sitio.
- [ ] Imágenes cargan, no se ven estiradas y tienen texto `alt`.

**Contenido**
- [ ] Ortografía y acentos revisados.
- [ ] Sin textos de relleno ("Lorem ipsum", "TODO", "Texto aquí").
- [ ] Precios, teléfonos, correos y enlaces correctos y funcionando.
- [ ] Sin guiones largos pareados.

**Funcionamiento**
- [ ] Botones, menú y formularios funcionan.
- [ ] Enlaces internos y externos abren donde deben.
- [ ] Cero errores en la consola.
- [ ] La página carga rápido (imágenes optimizadas).

**Autocrítica**
- [ ] Revisar el trabajo como lo haría un diseñador exigente: ¿qué mejoraría? Si hay algo claro y dentro del alcance, corregirlo.
- [ ] Para cambios grandes, usar un subagente que revise el resultado de forma independiente y reporte fallos.

Si algún punto falla, volver a la Fase 2.

### Fase 4.1 · Antes de publicar: refrescar la versión de los archivos

Los navegadores guardan `styles.css` y los `.js` en caché, y en móvil
los estiran más de lo que dice `cache-control`. Si no se cambia el
nombre, C sigue viendo la versión vieja y parece que el arreglo no se
publicó.

Antes de cada publicación, subir el sufijo `?v=` de los enlaces a CSS
y JS en `index.html`, `tours.html` y `services.html`. El formato es
`?v=AAAAMMDD` más una letra si ya hubo una publicación ese día.

### Fase 5 · Entregar

El mensaje de entrega en el chat es breve e incluye:

1. Qué se hizo (una o dos oraciones).
2. Capturas finales en móvil y escritorio.
3. Lo único que C debe revisar o decidir, si hay algo (datos faltantes, decisiones de gusto).

No hacer commit ni publicar sin autorización de C.

## 4. Cuándo detenerse y preguntar

- Falta información del negocio que no se puede deducir.
- El cambio afectaría la estructura general del sitio o borraría contenido.
- Después de tres rondas del bucle visual el mismo problema sigue sin resolverse.

## 5. Mejora continua

Cuando C corrija algo, agregar aquí la regla si vale más allá de ese caso: si habría ayudado en la mayoría de las sesiones, no solo en la que la escribió. Un arreglo puntual se queda en el código.

### Reglas aprendidas

- Antes de opinar o rediseñar algo que depende de un recurso externo, comprobar si se puede cargar de verdad. Si no, pedir el dominio y esperar, en vez de trabajar sobre un simulacro.
- Medir un espaciado no basta para darlo por bueno. En un teléfono, dos bloques que ocupan todo el ancho necesitan mucha más separación que los mismos elementos en escritorio, aunque el número de píxeles sea idéntico. Mirar la captura de móvil preguntándose si parecen dos piezas o una sola.
- Si C dice que un arreglo publicado no le funciona, comprobar primero qué está sirviendo el dominio de verdad, antes de tocar código.
- Aclarar un fondo de video obliga a revisar todo el texto blanco que va encima. Un velo oscuro fijo al viewport no distingue el titular de las tarjetas, así que el velo se queda ligero y cada texto blanco lleva su propio respaldo (una franja degradada, una pastilla o un panel). Medir el contraste contra el fotograma más claro del video, no contra el color promedio.
- Un borde de 1 px sobre fondo propio blanco es invisible sobre fondo claro y se convierte en una línea blanca sobre fondo oscuro. Al reutilizar una tarjeta en una página con otro fondo, revisar sus bordes.
- Los números de teléfono no se parten: `white-space:nowrap` en el enlace, o el subrayado queda cortado a mitad del número. La regla va **una sola vez** y por selector de atributo (`a[href^="tel:"]`), no pegada a la sección de turno, o el fallo sigue vivo en las otras páginas.
- Un arreglo que vale para un tipo de elemento se escribe una vez para todos. Antes de dar por cerrado un arreglo puntual, buscar en todo el proyecto los demás sitios donde aparece lo mismo (`grep`) y decidir si la regla debe ser global. Dos mecanismos distintos para lo mismo acaban sumándose o contradiciéndose, como pasó con los anclajes bajo la barra fija.
- El repositorio es público y el historial de git no se olvida. Un documento
  de contexto con márgenes o tarifas del aliado no se sube "para que la
  sesión en la nube lo lea": una vez commiteado queda visible para siempre,
  aunque después se borre el archivo. Si una sesión necesita ese contexto, se
  adjunta en el chat. Si hace falta dejar algo en el repositorio, se sube solo
  la parte publicable: el texto aprobado y las reglas de qué no se puede
  ofrecer, nunca los números de costo. No dar por hecho que un contexto
  privado está en `contexto/`: no está, y no debe estar.
- **Una reseña se publica verbatim o no se publica.** Un testimonio firmado
  con el nombre real de un cliente no se reescribe, aunque suene mejor: poner
  palabras en boca de alguien
  con su nombre y su foto de perfil detrás no es redactar, es inventar una
  cita. Si una reseña es muy larga se recorta por frases completas, quitando
  del principio o del final, nunca cosiendo trozos ni cambiando palabras. Lo
  mismo vale para cualquier cosa atribuida a una persona con nombre.
- **Nada de capas `position:fixed` a pantalla completa para fondos.** Safari 26 tiñe su barra superior con el color de los elementos fijos que tiene debajo, y la franja se queda tapando la cabecera al volver arriba. Un fondo que se queda quieto va en una capa `sticky` dentro de su sección (ver `.island-story::after`), y esa sección lleva `overflow:clip`, no `hidden`, o el sticky deja de pegarse.
- Al buscar texto visible, **no limitar el `grep` por extensión**. Parte del copy del sitio no está en los `.html`: el botón de "View all tours" y el mensaje para lectores de pantalla los escribe `tours.js` al vuelo. Comprobar el resultado en el navegador, no en el código.
