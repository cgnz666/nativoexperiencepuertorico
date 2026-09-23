# Convención de archivos de este repositorio

La misma regla que se usa en la carpeta Nativo Experience, adaptada a un repositorio de git.

---

## La regla

**Cuando una versión nueva sustituye a un documento, el documento viejo se renombra con `z_` al principio. Nada se borra sin que C lo diga.**

- Un archivo **sin** `z_` es el vigente. Es el que se lee y el que se le pasa a Claude Code.
- Un archivo **con** `z_` quedó desactualizado. Se puede borrar o archivar cuando se quiera.
- Como la `z` va de última en el abecedario, todos los desactualizados caen juntos al final del listado.
- El renombrado ocurre el mismo día en que se crea la versión nueva, no después.

## Dónde aplica y dónde no

| Tipo de archivo | ¿Lleva `z_`? | Por qué |
|---|---|---|
| Documentos de lectura: `.md` de contexto, briefs, especificaciones | **Sí** | Conviven en la carpeta y se revisan a ojo. Hay que ver cuál manda sin abrir ninguno |
| Capturas y comparaciones visuales (`Claude outputs/`) | **Sí** | Se acumulan por ronda de revisión |
| Código y archivos del sitio: `index.html`, `styles.css`, `script.js` | **No** | Se editan en su sitio. El historial de git guarda las versiones anteriores |
| Imágenes y assets que el sitio usa | **No** | El HTML los llama por nombre. Renombrarlos rompe la página |
| Un archivo de código que se deja de usar | **No**, se borra | Git lo recuerda. Dejarlo con `z_` ensucia el repositorio y confunde al que despliega |

Regla corta: **si el nombre del archivo aparece dentro de otro archivo, no se renombra.** Si solo lo lee una persona, sí.

## Ejemplo

```
CONTEXTO_oferta_barra_movil_v3.md      <- se usa
z_CONTEXTO_oferta_barra_movil_v2.md    <- no se usa
index.html                             <- nunca lleva z_, se edita y se hace commit
```

## Limpieza

Cuando se acumulen muchos `z_`, se borran (git guarda el historial de los que estuvieron en commit) o se mueven a una subcarpeta `z_archivo/`.
