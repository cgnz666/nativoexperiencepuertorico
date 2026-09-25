/* ==========================================
LISTADO DE TOURS · VENTANAS

Dibuja las ventanas a partir de tours.json, que
una tarea programada actualiza desde Bókun.

La reserva sigue siendo de Bókun: cada ventana
lleva un botón .bokunButton que su cargador
activa solo, incluso si se creó después de
cargar la página.
========================================== */

document.addEventListener("DOMContentLoaded", function () {
  const rejilla = document.querySelector("[data-tours-grid]");

  if (!rejilla) {
    return;
  }

  const hero = document.querySelector("[data-tours-hero]");
  const botonesDeRuta = Array.from(document.querySelectorAll("[data-ruta]"));
  const buscador = document.querySelector("[data-tours-search]");
  const contador = document.querySelector("[data-tours-count]");
  const vacio = document.querySelector("[data-tours-empty]");
  const zonaDeBoton = document.querySelector("[data-tours-more]");
  const boton = zonaDeBoton && zonaDeBoton.querySelector("button");
  const aviso = document.querySelector("[data-tours-error]");

  const AL_PRINCIPIO = 10;

  let tours = [];
  let desplegado = false;
  let rutaElegida = null;


  /* ==========================================
  RUTAS DEL MAPA

  Mismos colores y trazos que las líneas del mapa y
  sus botones.
  ========================================== */

  const RUTAS = {
    south: {
      nombre: "South",
      color: "#09a7c3",
      coordenadas: "18.01°N 66.61°W",
      muestra: '<path d="M2 5 H32" stroke="#09a7c3" stroke-width="4" stroke-linecap="round"/>'
    },
    west: {
      nombre: "West Coast",
      color: "#ffffff",
      coordenadas: "18.34°N 67.25°W",
      muestra: '<path d="M2 5 H32" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>'
    },
    inland: {
      nombre: "Mountains",
      color: "#eaf7f8",
      coordenadas: "18.16°N 66.72°W",
      muestra: '<path d="M2 5 H32" stroke="#eaf7f8" stroke-width="4" stroke-linecap="round" stroke-dasharray="7 4"/>'
    },
    coffee: {
      nombre: "Coffee Hills",
      color: "#d9b98c",
      coordenadas: "18.19°N 65.96°W",
      muestra: '<path d="M2 5 H32" stroke="#d9b98c" stroke-width="4" stroke-linecap="round"/>'
    },
    east: {
      nombre: "East Coast",
      color: "#09a7c3",
      coordenadas: "18.43°N 65.88°W",
      muestra: '<path d="M2 5 H32" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".7"/><path d="M2 5 H32" stroke="#09a7c3" stroke-width="4" stroke-linecap="round"/>'
    },
    sj: {
      nombre: "Old San Juan",
      color: "#09a7c3",
      coordenadas: "18.47°N 66.12°W",
      muestra: '<path d="M2 5 H32" stroke="#09a7c3" stroke-width="4" stroke-linecap="round" stroke-dasharray="5 5"/>'
    },
    island: {
      nombre: "Around the Island",
      color: "#ffffff",
      coordenadas: "360° · PR",
      muestra: '<path d="M2 5 H32" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 6"/>'
    }
  };


  /* ==========================================
  CURADURÍA

  tours.json lo reescribe una tarea programada, así que
  lo editorial vive aquí, por id: la ruta del mapa, la
  frase de ruta y la etiqueta. La nota (★) sale solo
  donde la etiqueta la lleva; nunca se calcula ni se
  muestra una cifra de reseñas.

  Un tour sin ruta no aparece bajo ningún botón de ruta
  y en su ventana se lee el resumen de tours.json.
  ========================================== */

  const CURADURIA = {
    "1196867": { ruta: "sj", frase: "Walking · Old San Juan", etiqueta: "★ 5.0" },
    "1213460": { ruta: "coffee", frase: "San Juan to the coffee hills", etiqueta: "Coffee & culture" },
    "1174842": { ruta: "south", frase: "San Juan to the south coast", etiqueta: "★ 5.0" },
    "1174841": { ruta: "west", frase: "Along the north coast to Rincón", etiqueta: "★ 5.0" },
    "1265967": { ruta: "east", frase: "San Juan to the east coast", etiqueta: "★ 5.0" },
    "1243165": { ruta: "inland", frase: "Forest and hot springs", etiqueta: "Wellness" },
    "1243154": { ruta: "west", frase: "San Juan and the north coast", etiqueta: "Music & food" },
    "1174843": { ruta: "island", frase: "Around the island in a day", etiqueta: "★ 4.9" },
    "1243144": { ruta: "south", frase: "Walking · Ponce", etiqueta: "Walking tour" },
    "1244586": { ruta: "sj", frase: "Around San Juan", etiqueta: "New route" },
    "1242779": { ruta: "south", frase: "San Juan to Ponce, private", etiqueta: "Private" },
    "1240411": { ruta: "island", frase: "Along the coast", etiqueta: "Coastal" },
    "903415": { ruta: "inland", frase: "Up the PR-10 through the mountains", etiqueta: "Mountain drive" },
    "1262125": { ruta: "island", frase: "Around the island in two days", etiqueta: "Two days" },
    "1263358": { ruta: "west", frase: "San Juan to Arecibo", etiqueta: "Waterfalls" },
    "1275712": { ruta: "sj", frase: "Around San Juan", etiqueta: "Nightlife" },
    "1261571": { etiqueta: "Beaches" },
    "1262284": { etiqueta: "Music" },
    "1263497": { etiqueta: "Adventure" }
  };

  /* Los diez primeros, en este orden, para que los de Ponce
     no salgan juntos. Después, el resto en el orden de
     tours.json. */
  const ORDEN = [
    "1196867",
    "1213460",
    "1174842",
    "1174841",
    "1265967",
    "1243165",
    "1243154",
    "1174843",
    "1243144",
    "1244586"
  ];


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

  /* "6 hours and 30 minutes" → "6 h 30 min" */
  const duracionCorta = (texto) =>
    String(texto || "")
      .replace(/\s*\band\b\s*/gi, " ")
      .replace(/\bhours?\b/gi, "h")
      .replace(/\bminutes?\b/gi, "min")
      .replace(/\s+/g, " ")
      .trim();

  const sinAcentos = (texto) =>
    String(texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");

  const datosDe = (tour) => CURADURIA[String(tour.id)] || {};

  /* La foto en miniatura para el resplandor: Bókun la sirve al
     tamaño que se le pida, y a 12 x 9 pesa unos cientos de bytes */
  const miniatura = (foto) =>
    foto ? String(foto).replace(/([?&])w=\d+&h=\d+/, "$1w=12&h=9") : "";

  function ordenar(lista) {
    const primeros = ORDEN.map((id) =>
      lista.find((tour) => String(tour.id) === id)
    ).filter(Boolean);

    const resto = lista.filter(
      (tour) => !ORDEN.includes(String(tour.id))
    );

    return primeros.concat(resto);
  }


  /* ==========================================
  UNA VENTANA
  ========================================== */

  function ventanaDe(tour, indice) {
    const datos = datosDe(tour);
    const ruta = RUTAS[datos.ruta];
    const fotos = (tour.photos || []).slice(0, 8);
    const id = escapar(tour.id);

    const laminas = fotos
      .map((foto, i) =>
        i === 0
          ? `
            <img
              class="tour-card-slide is-active"
              src="${escapar(foto)}"
              alt=""
              width="800"
              height="600"
              loading="${indice < 2 ? "eager" : "lazy"}"
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

    const hud = ruta
      ? `
            <div class="ventana-hud" aria-hidden="true">
              <span><b style="background:${ruta.color};color:${ruta.color}"></b>${escapar(
                ruta.nombre.toUpperCase()
              )}</span>
              <span>${escapar(ruta.coordenadas)}</span>
            </div>`
      : "";

    const linea = ruta
      ? `
                <div class="ventana-linea">
                  <svg width="34" height="10" aria-hidden="true">${ruta.muestra}</svg>
                  <span>${escapar(ruta.nombre)}</span>
                </div>`
      : "";

    /* La nota va solo en la etiqueta que la trae, y se lee
       como frase para no depender del símbolo */
    const conNota = /^★/.test(datos.etiqueta || "");

    const etiqueta = datos.etiqueta
      ? conNota
        ? `<span class="ventana-etiqueta con-nota"><span aria-hidden="true">${escapar(
            datos.etiqueta
          )}</span><span class="solo-lectores">Rated ${escapar(
            datos.etiqueta.replace(/^★\s*/, "")
          )} on Tripadvisor</span></span>`
        : `<span class="ventana-etiqueta">${escapar(datos.etiqueta)}</span>`
      : "";

    const piezas = [];

    if (tour.duration) {
      piezas.push(escapar(duracionCorta(tour.duration)));
    }

    piezas.push(`From ${precio(tour.price)}`);

    const datosEnLinea =
      etiqueta +
      piezas
        .map(
          (pieza, i) =>
            `<span class="nw">${
              etiqueta || i > 0 ? '<i aria-hidden="true">·</i> ' : ""
            }${pieza}</span>`
        )
        .join("");

    return `
      <article
        class="ventana-tour"
        data-line="${escapar(datos.ruta || "")}"
        style="--foto-mini:url('${escapar(miniatura(fotos[0]))}')">

        <div class="ventana">

          <div class="ventana-resplandor" aria-hidden="true"></div>

          <div class="ventana-marco">
            <div class="ventana-aro">
              <div
                class="ventana-pantalla"
                data-featured-slideshow
                data-delay="${(indice % 4) * 900}">

                ${laminas}
                <div class="tour-card-dots" aria-hidden="true"></div>

                <div class="ventana-crt" aria-hidden="true"></div>
                ${hud}

                <div class="ventana-cortina" id="cortina-${id}">
                  ${linea}

                  <h3 class="ventana-titulo">${escapar(tour.title)}</h3>

                  <div class="ventana-detalle">
                    <p class="ventana-frase">${escapar(
                      datos.frase || tour.excerpt
                    )}</p>

                    <button
                      class="bokunButton card-button"
                      type="button"
                      disabled
                      data-src="${escapar(tour.bookingUrl)}"
                      data-testid="widget-book-button">
                      Book Now
                    </button>
                  </div>

                  <div class="ventana-datos">${datosEnLinea}</div>

                  <button
                    class="ventana-tirador"
                    type="button"
                    aria-expanded="false"
                    aria-controls="cortina-${id}">
                    <span class="solo-lectores">Show details for ${escapar(
                      tour.title
                    )}</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>

      </article>`;
  }


  /* ==========================================
  PINTAR LO QUE TOQUE
  ========================================== */

  function pintar() {
    const busqueda = sinAcentos(buscador ? buscador.value.trim() : "");

    const encontrados = tours.filter((tour) => {
      if (rutaElegida && datosDe(tour).ruta !== rutaElegida) {
        return false;
      }

      return (
        !busqueda ||
        sinAcentos(
          [tour.title, tour.excerpt, tour.duration].join(" ")
        ).includes(busqueda)
      );
    });

    /* Al buscar o al elegir una ruta se muestran todos los
       resultados: esconder coincidencias tras un "ver más"
       sería justo lo contrario de lo que se pidió. */
    const filtrando = Boolean(busqueda || rutaElegida);

    const visibles =
      filtrando || desplegado
        ? encontrados
        : encontrados.slice(0, AL_PRINCIPIO);

    if (window.detenerCarruseles) {
      window.detenerCarruseles(rejilla);
    }

    rejilla.innerHTML = visibles
      .map((tour, indice) => ventanaDe(tour, indice))
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

    /* No se muestra ninguna cifra en pantalla. Este texto solo
       lo leen los lectores de pantalla, para que quien filtra
       sepa cuántos resultados salieron. */
    if (contador) {
      contador.textContent = filtrando
        ? `${encontrados.length} ${
            encontrados.length === 1 ? "tour" : "tours"
          } found`
        : "";
    }

    if (vacio) {
      vacio.hidden = encontrados.length > 0;
    }

    if (zonaDeBoton) {
      const hacenFalta =
        !filtrando && !desplegado && encontrados.length > AL_PRINCIPIO;

      zonaDeBoton.hidden = !hacenFalta;

      if (boton && hacenFalta) {
        boton.textContent = "View all tours";
      }
    }
  }


  /* ==========================================
  RUTAS: EL MAPA FILTRA EL CATÁLOGO

  Pulsar una ruta la enciende en el mapa y deja solo
  sus tours; pulsarla otra vez lo devuelve todo.
  ========================================== */

  botonesDeRuta.forEach(function (botonDeRuta) {
    botonDeRuta.addEventListener("click", function () {
      const ruta = botonDeRuta.dataset.ruta;

      rutaElegida = rutaElegida === ruta ? null : ruta;

      botonesDeRuta.forEach(function (otro) {
        otro.setAttribute(
          "aria-pressed",
          String(otro.dataset.ruta === rutaElegida)
        );
      });

      if (hero) {
        if (rutaElegida) {
          hero.dataset.ruta = rutaElegida;
        } else {
          delete hero.dataset.ruta;
        }
      }

      pintar();
    });
  });


  /* ==========================================
  LA CORTINA EN PANTALLAS TÁCTILES

  Con ratón baja sola (CSS). Con el dedo, el tirador
  la sube y la baja.
  ========================================== */

  rejilla.addEventListener("click", function (evento) {
    const tirador = evento.target.closest(".ventana-tirador");

    if (!tirador) {
      return;
    }

    const ventana = tirador.closest(".ventana-tour");
    const abierta = ventana.classList.toggle("abierta");

    tirador.setAttribute("aria-expanded", String(abierta));
  });


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
      tours = ordenar(datos.tours || []);

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
    /* Sin esta espera, cada tecla rehacía las diecinueve ventanas */
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
         foco se va con él. Se lleva al tirador de la primera
         ventana nueva, para no dejar sin sitio a quien navega
         con teclado. */
      const primeraNueva = rejilla.querySelectorAll(".ventana-tour")[AL_PRINCIPIO];

      if (primeraNueva) {
        primeraNueva.querySelector(".ventana-tirador").focus({ preventScroll: true });
        primeraNueva.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    });
  }
});
