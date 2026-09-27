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
  const botonesDeRuta = Array.from(document.querySelectorAll(".tours-ruta[data-ruta]"));
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
  let habiaFiltro = false;

  const textoDeVacio = vacio ? vacio.innerHTML : "";

  const suave = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";


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
     tamaño que se le pida, y a 8 x 6 pesa unos cientos de bytes */
  const miniatura = (foto) =>
    foto ? String(foto).replace(/([?&])w=\d+&h=\d+/, "$1w=8&h=6") : "";


  /* ==========================================
  EL COLOR DEL RESPLANDOR

  Se lee la miniatura en un lienzo de 8 x 6 y se saca
  el tono de la mitad izquierda, de la derecha y de
  toda la foto. Cada píxel pesa según lo saturado que
  es: un promedio simple sale casi siempre gris pardo,
  y así manda el color que de verdad destaca (el cielo
  del atardecer, el mural). Luego se avivan un poco
  para que se lean como luz y no como mancha. Bókun permite
  leer sus fotos desde otra web (CORS); si algo falla,
  el resplandor se queda en teal.
  ========================================== */

  const TEAL = [9, 167, 195];

  /* Los colores ya calculados, por foto: al buscar o filtrar se
     repintan las ventanas y no hace falta volver a leerlas */
  const coloresPorFoto = new Map();

  function aviva([r, g, b]) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;

      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h =
        max === r
          ? (g - b) / d + (g < b ? 6 : 0)
          : max === g
            ? (b - r) / d + 2
            : (r - g) / d + 4;
      h /= 6;
    }

    /* Una foto casi gris no tiene color que derramar: sin esto
       el blanco o el gris salían rosados, porque su matiz es 0 */
    if (s < 0.12) {
      return TEAL.join(" ");
    }

    /* Más color para que cada ventana tenga el suyo. Los verdes
       se topan más bajo: saturados enseguida se ven neón */
    const verde = h > 0.14 && h < 0.45;

    s = Math.min(verde ? 0.42 : 0.85, s * 1.5 + 0.1);
    l = verde ? Math.min(0.48, Math.max(0.42, l)) : Math.min(0.6, Math.max(0.5, l));

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const canal = (t) => {
      t = (t + 1) % 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    /* Un toque (8 %) de teal de la marca: las ventanas siguen
       siendo de la misma familia sin perder su color */
    return [canal(h + 1 / 3), canal(h), canal(h - 1 / 3)]
      .map((v, i) => Math.round(v * 255 * 0.92 + TEAL[i] * 0.08))
      .join(" ");
  }

  function ponerColores(ventana, colores) {
    Object.keys(colores).forEach(function (lado) {
      ventana.style.setProperty("--brillo-" + lado, colores[lado]);
    });
  }

  function colorear(ventana) {
    const url = ventana.dataset.mini;

    if (!url) {
      return;
    }

    if (coloresPorFoto.has(url)) {
      ponerColores(ventana, coloresPorFoto.get(url));
      return;
    }

    const foto = new Image();

    foto.crossOrigin = "anonymous";

    foto.addEventListener("load", function () {
      try {
        const lienzo = document.createElement("canvas");
        lienzo.width = 8;
        lienzo.height = 6;

        const pincel = lienzo.getContext("2d");
        pincel.drawImage(foto, 0, 0, 8, 6);

        const px = pincel.getImageData(0, 0, 8, 6).data;
        const lados = { izq: [], der: [], medio: [] };

        for (let i = 0; i < px.length; i += 4) {
          const x = (i / 4) % 8;
          const max = Math.max(px[i], px[i + 1], px[i + 2]) / 255;
          const min = Math.min(px[i], px[i + 1], px[i + 2]) / 255;
          const luz = (max + min) / 2;
          const saturacion =
            max === min ? 0 : (max - min) / (1 - Math.abs(2 * luz - 1));

          /* Vivo es saturado y de luz media: lo casi negro o casi
             blanco apenas cuenta */
          const pixel = {
            rgb: [px[i], px[i + 1], px[i + 2]],
            viveza: saturacion * (luz > 0.08 && luz < 0.92 ? 1 : 0.1)
          };

          lados[x < 4 ? "izq" : "der"].push(pixel);
          lados.medio.push(pixel);
        }

        /* Los cuatro píxeles más vivos de cada lado, promediados:
           suelen ser del mismo color. Mezclar todos anulaba los
           colores opuestos y dejaba un gris */
        const colores = {};

        Object.keys(lados).forEach(function (lado) {
          const vivos = lados[lado]
            .sort((a, b) => b.viveza - a.viveza)
            .slice(0, 4);

          const media = [0, 1, 2].map(
            (canal) =>
              vivos.reduce((total, pixel) => total + pixel.rgb[canal], 0) /
              vivos.length
          );

          colores[lado] = aviva(media);
        });

        coloresPorFoto.set(url, colores);
        ponerColores(ventana, colores);
      } catch (error) {
        /* Sin permiso para leer la foto: se queda el teal */
      }
    });

    foto.src = url;
  }

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

  function estiloDeBrillo(url) {
    const colores = coloresPorFoto.get(url);

    return colores
      ? ` style="${Object.keys(colores)
          .map((lado) => `--brillo-${lado}:${colores[lado]}`)
          .join(";")}"`
      : "";
  }

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
        data-mini="${escapar(miniatura(fotos[0]))}"${estiloDeBrillo(
          miniatura(fotos[0])
        )}>

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
    const busqueda = sinAcentos(buscador ? buscador.value : "")
      .replace(/\s+/g, " ")
      .trim();

    /* Cada palabra tiene que aparecer, en cualquier orden:
       "rincon ponce" encuentra lo mismo que "ponce rincon" */
    const palabras = busqueda ? busqueda.split(" ") : [];

    const encontrados = tours.filter((tour) => {
      if (rutaElegida && datosDe(tour).ruta !== rutaElegida) {
        return false;
      }

      /* No solo el título: también los pueblos por los que pasa
         (los saca de Bókun la tarea que escribe tours.json), la
         ruta del mapa y su frase. Así "Arecibo" encuentra el tour
         de Rincón aunque su título no lo nombre. */
      const datos = datosDe(tour);
      const ruta = RUTAS[datos.ruta];

      const texto = sinAcentos(
        [
          tour.title,
          tour.excerpt,
          tour.duration,
          (tour.places || []).join(" "),
          ruta ? ruta.nombre : "",
          datos.frase,
          datos.etiqueta
        ].join(" ")
      );

      return palabras.every((palabra) => texto.includes(palabra));
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

    rejilla.querySelectorAll(".ventana-tour").forEach(colorear);

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
        : habiaFiltro
          ? `Showing all ${tours.length} tours`
          : "";
    }

    habiaFiltro = filtrando;

    /* Con una ruta elegida, el aviso de "prueba con Ponce" podía
       contradecirse (Ponce no está en Coffee Hills): se dice qué
       ruta está filtrando y se ofrece quitarla */
    if (vacio) {
      vacio.hidden = encontrados.length > 0;

      if (!vacio.hidden) {
        vacio.innerHTML = rutaElegida
          ? `Nothing on the ${escapar(
              RUTAS[rutaElegida].nombre
            )} route matches that search. <button type="button" class="tours-quitar-ruta">Search all routes</button>`
          : textoDeVacio;
      }
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
          hero.dataset.rutaActiva = rutaElegida;
        } else {
          delete hero.dataset.rutaActiva;
        }
      }

      pintar();
    });
  });


  /* Tocar el mapa es lo mismo que pulsar el botón de la ruta
     más cercana al dedo. Varias líneas salen juntas de San
     Juan, así que no vale "lo que haya debajo": se mide la
     distancia real a cada línea y gana la más cercana, hasta
     26 px en pantalla. Un rótulo elige su ruta, y el punto y
     el rótulo de San Juan eligen Old San Juan. Si la ruta se
     enciende, además baja al catálogo. */

  const mapa = document.querySelector(".tours-mapa");
  const catalogo = document.querySelector("#catalog");

  function distanciaA(trazo, x, y) {
    if (trazo.tagName === "rect") {
      const a = trazo.x.baseVal.value;
      const b = trazo.y.baseVal.value;
      const ancho = trazo.width.baseVal.value;
      const alto = trazo.height.baseVal.value;
      const dx = Math.max(a - x, 0, x - (a + ancho));
      const dy = Math.max(b - y, 0, y - (b + alto));

      return Math.hypot(dx, dy);
    }

    if (trazo.tagName === "circle") {
      const cx = trazo.cx.baseVal.value;
      const cy = trazo.cy.baseVal.value;

      return Math.max(0, Math.hypot(x - cx, y - cy) - trazo.r.baseVal.value);
    }

    const largo = trazo.getTotalLength();
    let menor = Infinity;

    for (let recorrido = 0; recorrido <= largo; recorrido += 4) {
      const punto = trazo.getPointAtLength(recorrido);

      menor = Math.min(menor, Math.hypot(x - punto.x, y - punto.y));
    }

    return menor;
  }

  function rutaTocada(svg, evento) {
    const rotulo = evento.target.closest("text");

    if (rotulo) {
      const grupo = rotulo.closest("[data-line]");

      if (grupo) {
        return grupo.dataset.line;
      }

      if (rotulo.classList.contains("hub")) {
        return "sj";
      }
    }

    const matriz = svg.getScreenCTM();

    if (!matriz) {
      return null;
    }

    const punto = new DOMPoint(evento.clientX, evento.clientY).matrixTransform(
      matriz.inverse()
    );
    const tope = 26 / matriz.a;

    let mejor = null;
    let menor = Infinity;

    svg
      .querySelectorAll(
        ".rt[data-line] path, .rt[data-line] rect, .rt[data-line] circle"
      )
      .forEach(function (trazo) {
        const distancia = distanciaA(trazo, punto.x, punto.y);

        if (distancia < menor) {
          menor = distancia;
          mejor = trazo.closest("[data-line]").dataset.line;
        }
      });

    /* El punto de San Juan es de todas: se lo queda Old San Juan */
    svg.querySelectorAll("circle:not(.rt circle)").forEach(function (centro) {
      if (distanciaA(centro, punto.x, punto.y) <= Math.min(menor, tope)) {
        mejor = "sj";
        menor = 0;
      }
    });

    return menor <= tope ? mejor : null;
  }

  if (mapa) {
    mapa.addEventListener("click", function (evento) {
      const svg = evento.target.closest("svg");
      const ruta = svg && rutaTocada(svg, evento);

      const botonDeRuta =
        ruta && botonesDeRuta.find((otro) => otro.dataset.ruta === ruta);

      if (!botonDeRuta) {
        return;
      }

      botonDeRuta.click();

      if (rutaElegida && catalogo) {
        catalogo.scrollIntoView({ behavior: suave(), block: "start" });
      }
    });
  }


  /* ==========================================
  LA CORTINA EN PANTALLAS TÁCTILES

  Con ratón baja sola (CSS). Con el dedo, el tirador
  la sube y la baja.
  ========================================== */

  if (vacio) {
    vacio.addEventListener("click", function (evento) {
      if (!evento.target.closest(".tours-quitar-ruta") || !rutaElegida) {
        return;
      }

      const activo = botonesDeRuta.find(
        (otro) => otro.dataset.ruta === rutaElegida
      );

      if (activo) {
        activo.click();
      }
    });
  }

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
    boton.addEventListener("click", function (evento) {
      desplegado = true;
      pintar();

      const primeraNueva = rejilla.querySelectorAll(".ventana-tour")[AL_PRINCIPIO];

      if (!primeraNueva) {
        return;
      }

      /* El botón que se acaba de pulsar queda oculto, así que con
         teclado el foco se va con él: se lleva al tirador de la
         primera ventana nueva. Con ratón o dedo no (detail > 0),
         porque el foco abriría esa cortina sin que nadie la toque. */
      if (evento.detail === 0) {
        primeraNueva.querySelector(".ventana-tirador").focus({ preventScroll: true });
      }

      primeraNueva.scrollIntoView({ block: "center", behavior: suave() });
    });
  }
});
