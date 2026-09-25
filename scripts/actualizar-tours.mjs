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
  `https://widgets.bokun.io/online-sales/${UUID}/experience/${Number(id)}?partialView=1`;

/* Todo lo que acabe en un href o en un src pasa por aquí:
   una dirección con esquema javascript: no debe llegar a la página. */
function direccionSegura(valor) {
  if (!valor) return null;
  try {
    const url = new URL(valor);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

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
    .map(direccionSegura)
    .filter(Boolean);
}

/* ==========================================
LUGARES POR LOS QUE PASA CADA TOUR

El buscador de la página encuentra un tour por los
pueblos de su ruta aunque el título no los nombre.
Aquí se sacan de lo que el propio Bókun dice del
tour: título, resumen, descripción completa, paradas
y ubicación. Solo se guardan nombres de esta lista,
para no inventar nada ni colar texto suelto.
========================================== */

// LUGARES-INICIO
const LUGARES = [
  // Los 78 municipios, menos Florida: se confunde con el estado
  "Adjuntas", "Aguada", "Aguadilla", "Aguas Buenas", "Aibonito", "Añasco",
  "Arecibo", "Arroyo", "Barceloneta", "Barranquitas", "Bayamón", "Cabo Rojo",
  "Caguas", "Camuy", "Canóvanas", "Carolina", "Cataño", "Cayey", "Ceiba",
  "Ciales", "Cidra", "Coamo", "Comerío", "Corozal", "Culebra", "Dorado",
  "Fajardo", "Guánica", "Guayama", "Guayanilla", "Guaynabo", "Gurabo",
  "Hatillo", "Hormigueros", "Humacao", "Isabela", "Jayuya", "Juana Díaz",
  "Juncos", "Lajas", "Lares", "Las Marías", "Las Piedras", "Loíza",
  "Luquillo", "Manatí", "Maricao", "Maunabo", "Mayagüez", "Moca", "Morovis",
  "Naguabo", "Naranjito", "Orocovis", "Patillas", "Peñuelas", "Ponce",
  "Quebradillas", "Rincón", "Río Grande", "Sabana Grande", "Salinas",
  "San Germán", "San Juan", "San Lorenzo", "San Sebastián", "Santa Isabel",
  "Toa Alta", "Toa Baja", "Trujillo Alto", "Utuado", "Vega Alta",
  "Vega Baja", "Vieques", "Villalba", "Yabucoa", "Yauco",
  // Sitios que la gente busca por su nombre
  "Old San Juan", "La Perla", "Piñones", "Guavate", "El Yunque", "Condado",
  "Santurce", "Isla Verde", "Guajataca", "Toro Negro", "Coamo Hot Springs"
];

/* Otras formas de escribir el mismo lugar que aparecen en Bókun */
const VARIANTES = {
  "Quebradillas": ["quebradilla"],
  "Old San Juan": ["viejo san juan"]
};

const plano = (texto) =>
  String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/g, " ")
    .replace(/[^a-z0-9]+/g, " ");

function lugaresDe(producto) {
  const paradas = (producto.places || []).map((p) =>
    typeof p === "string" ? p : p?.title
  );

  const texto =
    " " +
    plano(
      [
        producto.title,
        producto.excerpt,
        producto.summary,
        producto.description,
        ...paradas,
        producto.googlePlace?.name,
        producto.locationCode?.country === "PR" ? producto.locationCode?.name : ""
      ].join(" ")
    ) +
    " ";

  /* "La Perla del Sur" es Ponce, no el barrio de San Juan */
  const limpio = texto.replace(/ la perla del sur /g, " ponce ");

  return LUGARES.filter((lugar) =>
    [plano(lugar), ...(VARIANTES[lugar] || [])].some((forma) =>
      limpio.includes(" " + forma.trim() + " ")
    )
  );
}
// LUGARES-FIN

/* Bókun podría mandar un número como texto. Si no es un
   número utilizable, mejor nulo que reventar la página. */
function numero(valor) {
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

function limpiar(producto) {
  const ta = producto.tripadvisorReview || {};

  return {
    id: producto.id,
    title: (producto.title || "").trim(),
    excerpt: (producto.excerpt || "").trim(),
    duration: (producto.durationText || "").trim(),
    price: numero(producto.price),
    currency: "USD",
    vendor: (producto.vendor?.title || "").trim(),
    rating: numero(ta.rating),
    reviews: numero(ta.numReviews),
    reviewUrl: direccionSegura(ta.url),
    photos: fotosDe(producto),
    places: lugaresDe(producto),
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

  if (!publicables.length) {
    throw new Error(
      "Ningún tour tiene precio utilizable, no se sobrescribe nada"
    );
  }

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

  /* Perder de golpe media lista suele ser un fallo de Bókun,
     no una decisión de negocio. Preferimos dejar el archivo
     viejo y que el flujo se ponga rojo. */
  const antes = anterior?.tours?.length || 0;

  if (antes && publicables.length < antes * 0.6) {
    throw new Error(
      `El catálogo cae de ${antes} a ${publicables.length} tours. ` +
        `Se deja el archivo anterior. Si el recorte es a propósito, ` +
        `bórralo a mano y vuelve a ejecutar.`
    );
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
