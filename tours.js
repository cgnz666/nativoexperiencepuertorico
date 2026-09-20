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
  /* El mar de fondo se detiene si el sistema pide menos
     movimiento, o si el visitante navega con ahorro de datos.
     En ambos casos queda el fotograma del póster. */
  const mar = document.querySelector(".ocean-video");

  if (mar) {
    const quietud =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      (navigator.connection && navigator.connection.saveData);

    if (quietud) {
      mar.autoplay = false;
      mar.removeAttribute("autoplay");
      mar.pause();
    }
  }

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

    const nota = Number(tour.rating);
    const resenas = Number(tour.reviews);

    /* Cinco estrellas como las de las reseñas. La nota se
       representa rellenando solo la parte que le toca, así un
       4.9 no se dibuja igual que un 5.0. */
    const relleno = Math.max(0, Math.min(100, (nota / 5) * 100));

    const valoracion =
      Number.isFinite(nota) && nota > 0 && Number.isFinite(resenas) && resenas > 0
        ? `
        <a
          class="product-rating"
          href="${escapar(tour.reviewUrl || "#")}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Rated ${escapar(nota.toFixed(1))} out of 5 by ${escapar(
            resenas
          )} travelers on Tripadvisor">
          <span class="product-stars" aria-hidden="true">
            <span class="product-stars-base">★★★★★</span>
            <span
              class="product-stars-fill"
              style="width:${relleno.toFixed(1)}%">★★★★★</span>
          </span>
          <span aria-hidden="true">${escapar(
            resenas
          )} reviews on Tripadvisor</span>
        </a>`
        : "";

    const duracion = tour.duration
      ? `<span class="product-duration">${escapar(tour.duration)}</span>`
      : "";

    return `
      <article class="tour-card featured-tour-card product-card" tabindex="-1">

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

    if (window.detenerCarruseles) {
      window.detenerCarruseles(rejilla);
    }

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
        boton.textContent = "View all experiences";
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
    /* Sin esta espera, cada tecla rehacía las diecinueve tarjetas */
    let esperaDeTecleo = null;

    buscador.addEventListener("input", function () {
      window.clearTimeout(esperaDeTecleo);
      esperaDeTecleo = window.setTimeout(pintar, 150);
    });
  }

  if (boton) {
    boton.addEventListener("click", function () {
      desplegado = true;
      pintar();

      /* El botón que se acaba de pulsar queda oculto, así que el
         foco se va con él. Se lleva a la primera tarjeta nueva,
         para no dejar sin sitio a quien navega con teclado. */
      const primeraNueva = rejilla.querySelectorAll(".product-card")[AL_PRINCIPIO];

      if (primeraNueva) {
        primeraNueva.focus({ preventScroll: true });
        primeraNueva.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    });
  }
});
