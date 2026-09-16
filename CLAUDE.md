# CLAUDE.md · Flujo de trabajo: construir, verificar, corregir

Este archivo es el "cerebro" del proyecto. Claude lo lee al comenzar cada sesión y debe seguirlo en toda tarea. El objetivo es que cada entrega llegue terminada y verificada, de modo que C solo tenga que hacer una revisión mínima.

## 1. Contexto del proyecto

| Campo | Valor |
|---|---|
| Proyecto | Sitio web de Nativo Experience Puerto Rico |
| Tipo | Sitio estático (HTML, CSS, JS) publicado con dominio propio (CNAME) |
| Archivos principales | `index.html`, `styles.css`, `script.js`, `assets/` |
| Idioma del contenido | Español (Puerto Rico) |
| Público | Visitantes y turistas, mayormente desde el celular |

Si existe una carpeta `contexto/` en el proyecto, leer sus archivos antes de empezar y aplicarlos.

## 2. Reglas generales

- Responder y redactar en español.
- No usar guiones largos pareados como paréntesis. Usar comas, paréntesis o reestructurar.
- Moneda siempre en formato `$000.00`.
- No borrar ni sobrescribir archivos sin que se pida. Cambios grandes van en una rama de git.
- Las notas internas (dudas, pendientes, cosas a verificar) van en el chat, nunca dentro del sitio ni de los entregables.
- No inventar datos del negocio (precios, horarios, teléfonos, direcciones). Si falta un dato, preguntar o dejarlo marcado en el chat.

## 3. El ciclo de trabajo

Toda tarea sigue estas cinco fases, en orden.

### Fase 1 · Entender y planificar

1. Leer este archivo y los archivos relevantes del proyecto.
2. Si la petición es ambigua, hacer las preguntas necesarias **antes** de construir (una sola ronda, concreta).
3. Escribir un plan corto: qué se va a cambiar, en qué archivos y cómo se sabrá que quedó bien (criterios de aceptación).
4. Si hay referencias de diseño (capturas, enlaces, textos dictados), anotarlas como el estándar contra el cual se compara el resultado.

### Fase 2 · Construir

1. Implementar el plan en pasos pequeños.
2. Reutilizar los estilos, colores, tipografías y componentes que ya existen en `styles.css`. No crear estilos duplicados.
3. Mantener el código limpio: sin código muerto, sin `console.log` olvidados, sin enlaces rotos.

### Fase 3 · Verificar con capturas (bucle visual)

Esta es la fase clave. Claude no da el trabajo por terminado sin haberlo **visto**.

1. Servir el sitio localmente (por ejemplo `python3 -m http.server 8000`).
2. Tomar capturas de pantalla completas con Playwright (o el navegador disponible) en al menos estos anchos:
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

Cuando C corrija algo, agregar aquí la regla correspondiente para que el error no se repita.

### Reglas aprendidas

- (vacío por ahora)
