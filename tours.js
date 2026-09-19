/* ==========================================
LISTADO DE TOURS

Dibuja las tarjetas a partir de tours.json, que
una tarea programada actualiza desde Bókun.

La reserva sigue siendo de Bókun: cada tarjeta
lleva un botón .bokunButton que su cargador
activa solo, incluso si la tarjeta se creó
después de cargar la página.
========================================== */

document.addEventListener("DOMContentLoaded", function () {
  const rejilla = document.querySelector("[data-tours-grid]");

  if (!rejilla) {
    return;
  }

  const buscador = document.querySelector("[data-tours-search]");
  const contador = document.querySelector("[data-tours-count]");
  const vacio = document.querySelector("[data-tours-empty]");
  const zonaDeBoton = document.querySelector("[data-tours-more]");
  const boton = zonaDeBoton && zonaDeBoton.querySelector("button");
  const aviso = document.querySelector("[data-tours-error]");

  const AL_PRINCIPIO = 6;

  let tours = [];
  let desplegado = false;


  /* ==========================================
  UTILIDADES
  ========================================== */

  const escapar = (texto) =>
    String(texto == null ? "" : texto).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));

  const precio = (valor) =>
    "$" +
    Number(valor).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  const sinAcentos = (texto) =>
    String(texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");


  /* ==========================================
  UNA TARJETA
  ========================================== */

  function tarjetaDe(tour, indice) {
    const fotos = (tour.photos || []).slice(0, 8);

    const laminas = fotos
      .map((foto, i) =>
        i === 0
          ? `
        <img
          class="tour-card-slide is-active"
          src="${escapar(foto)}"
          alt="${escapar(tour.title)}"
          width="800"
          height="600"
          loading="${indice < 3 ? "eager" : "lazy"}"
          decoding="async"
        >`
          : `
        <img
          class="tour-card-slide"
          data-lazy="${escapar(foto)}"
          alt=""
          width="800"
          height="600"
          decoding="async"
        >`
      )
      .join("");

    const valoracion =
      tour.rating && tour.reviews
        ? `
        <a
          class="product-rating"
          href="${escapar(tour.reviewUrl || "#")}"
          target="_blank"
          rel="noopener noreferrer">
          <span class="product-stars" aria-hidden="true">★</span>
          <strong>${escapar(tour.rating.toFixed(1))}</strong>
          <span>${escapar(tour.reviews)} reviews on Tripadvisor</span>
        </a>`
        : "";

    const duracion = tour.duration
      ? `<span class="product-duration">${escapar(tour.duration)}</span>`
      : "";

    return `
      <article class="tour-card featured-tour-card product-card">

        <div
          class="tour-card-gallery"
          data-featured-slideshow
          data-delay="${(indice % 4) * 900}"
        >
          ${laminas}
          <div class="tour-card-image-overlay"></div>
          <div class="tour-card-dots" aria-hidden="true"></div>
        </div>

        <div class="tour-content">

          <h3>${escapar(tour.title)}</h3>

          <p class="product-vendor">By ${escapar(tour.vendor)}</p>

          ${valoracion}

          <p class="product-excerpt">${escapar(tour.excerpt)}</p>

          <div class="product-meta">
            ${duracion}
            <span class="product-price">
              From <strong>${precio(tour.price)}</strong>
            </span>
          </div>

          <button
            class="bokunButton card-button"
            type="button"
            disabled
            data-src="${escapar(tour.bookingUrl)}"
            data-testid="widget-book-button"
          >
            Book Now
          </button>

        </div>

      </article>`;
  }


  /* ==========================================
  PINTAR LO QUE TOQUE
  ========================================== */

  function pintar() {
    const busqueda = sinAcentos(buscador ? buscador.value.trim() : "");

    const encontrados = busqueda
      ? tours.filter((tour) =>
          sinAcentos(
            [tour.title, tour.excerpt, tour.duration].join(" ")
          ).includes(busqueda)
        )
      : tours;

    /* Al buscar se muestran todos los resultados:
       esconder coincidencias tras un "ver más" sería
       justo lo contrario de lo que pide quien busca. */
    const visibles =
      busqueda || desplegado
        ? encontrados
        : encontrados.slice(0, AL_PRINCIPIO);

    rejilla.innerHTML = visibles
      .map((tour, indice) => tarjetaDe(tour, indice))
      .join("");

    if (window.iniciarCarruseles) {
      window.iniciarCarruseles(rejilla);
    }

    /* El cargador de Bókun activa los botones nuevos
       por su cuenta, pero si expone su función la
       llamamos para no depender de su temporizador. */
    if (typeof window.initializeBokunWidgets === "function") {
      window.initializeBokunWidgets();
    }

    if (contador) {
      contador.textContent = busqueda
        ? `${encontrados.length} of ${tours.length} experiences`
        : `${tours.length} experiences across Puerto Rico`;
    }

    if (vacio) {
      vacio.hidden = encontrados.length > 0;
    }

    if (zonaDeBoton) {
      const hacenFalta =
        !busqueda && !desplegado && encontrados.length > AL_PRINCIPIO;

      zonaDeBoton.hidden = !hacenFalta;

      if (boton && hacenFalta) {
        boton.textContent = `Show all ${tours.length} experiences`;
      }
    }
  }


  /* ==========================================
  ARRANQUE
  ========================================== */

  fetch("tours.json", { cache: "no-cache" })
    .then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error("No se pudo leer tours.json");
      }
      return respuesta.json();
    })
    .then((datos) => {
      tours = datos.tours || [];

      if (!tours.length) {
        throw new Error("tours.json llegó vacío");
      }

      pintar();
    })
    .catch(() => {
      /* Si los datos fallan, la sección no se queda muda:
         se ofrece el contacto directo. */
      if (aviso) {
        aviso.hidden = false;
      }
      if (contador) {
        contador.textContent = "";
      }
    });

  if (buscador) {
    buscador.addEventListener("input", pintar);
  }

  if (boton) {
    boton.addEventListener("click", function () {
      desplegado = true;
      pintar();

      /* Dejar el foco donde estaba la lista, no al final */
      const nuevas = rejilla.querySelectorAll(".product-card");
      const primeraNueva = nuevas[AL_PRINCIPIO];
      if (primeraNueva) {
        primeraNueva.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    });
  }
});
