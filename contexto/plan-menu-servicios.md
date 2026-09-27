# Plan del rediseño del menú de servicios

Proyecto: Nativo Experience Puerto Rico · Versión 2 · septiembre 2026

El detalle está en `contexto/menu-servicios.md` y `contexto/estilo-ilustracion.md` (en Mercadeo: `CONTEXTO_menu_servicios_v2.md` y `ESTILO_ilustracion_v2.md`).

**Cambio respecto a la versión 1:** el repositorio del sitio es público. Al repositorio solo suben los tres documentos de este proyecto. Las imágenes de referencia y los archivos de marca de `Mercadeo/_contexto/` se quedan en la Mac, porque tienen plantillas de terceros e información interna. Este archivo recoge el orden de los pasos y la verificación.

---

## 1. Decisiones tomadas

| Tema | Decisión | Por qué |
|---|---|---|
| Alcance | Se cambia la presentación, no la oferta | Los textos y precios ya están aprobados y publicados |
| Estilo | Ilustración lineal, cuadrada, con técnica de render de webtoon y sin rasgos de cómic | Sale del logo y de las referencias escogidas |
| Personas | No aparecen en las ilustraciones | Mantiene el estilo lejos del cómic y la marca no depende de una cara |
| Color | Solo la paleta del sitio | No se añaden colores nuevos |
| Formato | SVG | Liviano, nítido en cualquier pantalla y se le cambia el color con CSS |
| Esquinas | Rectas en la página de servicios | Acompañan el estilo cuadrado sin tocar el resto del sitio |

## 2. Orden de los pasos

1. **Actualizar la copia local del repositorio desde GitHub** antes de tocar nada (en PyCharm: Git y luego Pull). La copia local ha estado atrasada antes; si se edita sobre una copia vieja, se pisa lo publicado.
2. **Copiar los archivos de contexto al repositorio**, en la carpeta `contexto/` que el CLAUDE.md del proyecto manda a leer. Hecho el 24 de septiembre de 2026:
   - `contexto/menu-servicios.md` ← `CONTEXTO_menu_servicios_v2.md`
   - `contexto/estilo-ilustracion.md` ← `ESTILO_ilustracion_v2.md`
   - `contexto/plan-menu-servicios.md` ← este archivo
   - **No se copian** las referencias ni `contexto-marca.md`, `voz-marca.md` o `perfil-cliente-ideal.md`. Lo necesario de la marca ya está resumido en `contexto/menu-servicios.md`. El trabajo con las referencias a la vista se hace en sesión local.
   - Los archivos quedan sin commit. Se suben cuando C lo autorice.
3. **Primera entrega del agente de diseño: solo la propuesta.** La carta en celular y en escritorio, con la ilustración 05 terminada como muestra del estilo y las otras cuatro en boceto. Se revisa antes de seguir.
4. **Ajustar el estilo** sobre esa muestra. Es más barato corregir una ilustración que cinco.
5. **Terminar las cinco ilustraciones y los nueve íconos.**
6. **Implementar** en `services.html` y sus estilos.
7. **Revisar** con la lista de la sección 3.
8. **Publicar** y comprobar en un celular real, no solo en el navegador de la computadora.

## 3. Verificación antes de publicar

### Contenido

1. Los cinco servicios siguen ahí, con su número, título y subtítulo publicados.
2. Ningún texto nuevo añade algo a la oferta.
3. Los precios de la barra son $679.00, $799.00 y $899.00, con "hasta 8", "hasta 16" y "hasta 25".
4. El servicio 05 lleva al pago; los otros cuatro llevan a cotización por WhatsApp con el mensaje prellenado.
5. Ninguna ilustración muestra botellas, comida servida en la barra, músicos, decoración de fiesta ni un local propio.
6. Nada en la página sugiere que Nativo tiene un lugar propio para eventos.

### Estilo

7. Las cinco ilustraciones tienen el mismo grosor de trazo y el mismo nivel de detalle.
8. No hay personas, caras, globos, tramas ni líneas de acción.
9. Solo se usan los colores de `styles.css`.
10. Las ilustraciones se ven bien en teal sobre arena y en blanco sobre el azul oscuro.
11. Cada SVG pesa menos de 30 KB y tiene `aria-label`.

### Funcionamiento

12. En el celular, cada servicio cabe en una pantalla antes de abrir "See what's included".
13. El índice del principio muestra los cinco servicios en una sola pantalla y cada ícono lleva a su servicio.
14. Los botones de WhatsApp y de reserva funcionan de principio a fin.
15. El resto del sitio (tours, about, contacto) no cambió de aspecto.

## 4. Riesgos y qué hacer

| Riesgo | Qué hacer |
|---|---|
| Las ilustraciones salen con aire de cómic | Quitar primero lo narrativo (manos, gestos, brillos); después bajar detalle |
| Las cinco no se ven de la misma mano | Rehacerlas partiendo de la 05 aprobada, con la misma altura de horizonte y el mismo trazo |
| La carta queda bonita pero larga en el celular | Esconder más texto detrás de "See what's included"; nunca achicar el botón |
| Se edita sobre una copia vieja del repositorio | Hacer pull antes de empezar, siempre |

## 5. Estado de la carpeta

Carpeta: `Mercadeo/proyectos/menu-servicios/`

| Archivo | Estado | Qué es |
|---|---|---|
| `CONTEXTO_menu_servicios_v2.md` | **Vigente** | Qué se rediseña, marca, contenido y reglas |
| `ESTILO_ilustracion_v2.md` | **Vigente** | Dirección visual y encargo de cada ilustración |
| `PLAN_menu_servicios_v2.md` | **Vigente** | Este archivo |
| `_referencias/` | Fuente | Las cinco imágenes de referencia. No se suben al repositorio |
| `z_CONTEXTO_menu_servicios_v1.md` | Desactualizado | Primera versión, antes de saber que el repositorio es público |
| `z_ESTILO_ilustracion_v1.md` | Desactualizado | Primera versión |
| `z_PLAN_menu_servicios_v1.md` | Desactualizado | Mandaba a subir las referencias y la marca al repositorio |

Cuando salga una versión nueva de cualquiera de los tres, la anterior se renombra con `z_` el mismo día.
