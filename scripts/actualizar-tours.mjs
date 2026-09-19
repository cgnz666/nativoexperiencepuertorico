/* ==========================================
ACTUALIZAR TOURS DESDE BÓKUN

Consulta el mismo endpoint público que usa el
widget de Bókun y guarda una versión reducida en
tours.json, que es lo que lee la página.

Se ejecuta desde GitHub Actions. No necesita
credenciales: la lista de producto es pública,
igual que el UUID que ya está en el HTML.
========================================== */

import { writeFile, readFile } from "node:fs/promises";

const UUID = "7fab5ffc-1687-4220-aff5-7a5a1f460898";
const LISTA_DE_PRODUCTO = 110434;
const MAXIMO_DE_FOTOS = 8;
const DESTINO = "tours.json";

const URL_BUSQUEDA =
  `https://widgets.bokun.io/widgets/${UUID}/search?currency=USD&lang=en_GB`;

const enlaceDeReserva = (id) =>
  `https://widgets.bokun.io/online-sales/${UUID}/experience/${id}?partialView=1`;

/* Las fotos vienen del CDN de Bókun. Pedimos el
   recorte que necesita la tarjeta en vez del
   original, que pesa mucho más. */
function fotosDe(producto) {
  const lista = producto.photos?.length ? producto.photos : [producto.keyPhoto];

  return lista
    .filter(Boolean)
    .slice(0, MAXIMO_DE_FOTOS)
    .map((foto) => {
      if (foto.fileName) {
        return `https://imgcdn.bokun.tools${foto.fileName}?w=800&h=600&mode=crop`;
      }
      const grande = foto.derived?.find((d) => d.name === "large");
      return grande?.url || foto.originalUrl || null;
    })
    .filter(Boolean);
}

function limpiar(producto) {
  const ta = producto.tripadvisorReview || {};

  return {
    id: producto.id,
    title: (producto.title || "").trim(),
    excerpt: (producto.excerpt || "").trim(),
    duration: (producto.durationText || "").trim(),
    price: producto.price ?? null,
    currency: "USD",
    vendor: (producto.vendor?.title || "").trim(),
    rating: ta.rating ?? null,
    reviews: ta.numReviews ?? null,
    reviewUrl: ta.url || null,
    photos: fotosDe(producto),
    bookingUrl: enlaceDeReserva(producto.id)
  };
}

async function main() {
  const respuesta = await fetch(URL_BUSQUEDA, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      textFilter: { text: "", wildcard: true },
      page: 1,
      pageSize: 100,
      sortOrder: "ASC",
      sortField: "PRODUCT_LIST_ORDER",
      productListIds: [LISTA_DE_PRODUCTO]
    })
  });

  if (!respuesta.ok) {
    throw new Error(`Bókun respondió ${respuesta.status}`);
  }

  const datos = await respuesta.json();
  const productos = datos.items || [];

  if (!productos.length) {
    throw new Error("Bókun devolvió cero productos, no se sobrescribe nada");
  }

  const tours = productos.map(limpiar);

  /* Si un tour se queda sin precio, no lo publicamos:
     una tarjeta sin precio confunde más que ayudar. */
  const publicables = tours.filter((t) => t.price !== null && t.price > 0);
  const descartados = tours.length - publicables.length;

  const salida = {
    updated: new Date().toISOString(),
    source: `Bókun · lista de producto ${LISTA_DE_PRODUCTO}`,
    count: publicables.length,
    tours: publicables
  };

  /* Conservamos la fecha anterior si nada cambió, para
     que la tarea no genere commits vacíos cada noche. */
  let anterior = null;
  try {
    anterior = JSON.parse(await readFile(DESTINO, "utf8"));
  } catch {
    /* primera ejecución */
  }

  if (anterior && JSON.stringify(anterior.tours) === JSON.stringify(salida.tours)) {
    console.log(`Sin cambios: ${publicables.length} tours.`);
    return;
  }

  await writeFile(DESTINO, JSON.stringify(salida, null, 2) + "\n", "utf8");
  console.log(
    `Guardados ${publicables.length} tours` +
      (descartados ? `, ${descartados} descartados por no tener precio` : "")
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
