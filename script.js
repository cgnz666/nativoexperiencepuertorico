/* ==========================================
MENÚ MÓVIL
========================================== */

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  navigation.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => {
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    })
  );
}


/* ==========================================
CARRUSELES DE LAS TARJETAS

Lo usan las tarjetas destacadas del HTML y también
las tarjetas de tours que se crean desde tours.js,
por eso la función se expone en window.
========================================== */

function iniciarCarruseles(raiz) {
  const galerias = (raiz || document).querySelectorAll(
    "[data-featured-slideshow]"
  );

  /* Si el sistema pide menos movimiento, las tarjetas se quedan
     con su primera foto. Solas no se mueven. */
  const menosMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  galerias.forEach(function (galeria) {
    /* Una galería ya iniciada no se vuelve a iniciar:
       duplicaría los puntos y los temporizadores. */
    if (galeria.dataset.carruselIniciado === "si") {
      return;
    }

    const laminas = Array.from(
      galeria.querySelectorAll(".tour-card-slide")
    );

    const contenedorDePuntos = galeria.querySelector(
      ".tour-card-dots"
    );

    if (laminas.length < 2 || !contenedorDePuntos) {
      return;
    }

    galeria.dataset.carruselIniciado = "si";

    let actual = 0;
    let temporizador = null;

    /* Las láminas que no son la primera llegan sin src,
       con la dirección guardada en data-lazy. Así una
       tarjeta pide una sola foto hasta que el carrusel
       avanza, en vez de las ocho de golpe. */
    function cargar(lamina) {
      if (lamina && lamina.dataset.lazy) {
        lamina.addEventListener(
          "error",
          function () {
            lamina.dataset.rota = "si";
          },
          { once: true }
        );

        lamina.src = lamina.dataset.lazy;
        delete lamina.dataset.lazy;
      }
    }

    const retrasoInicial = Number(galeria.dataset.delay) || 0;

    const puntos = laminas.map(function (_, indice) {
      const punto = document.createElement("span");

      punto.className = "tour-card-dot";

      if (indice === 0) {
        punto.classList.add("is-active");
      }

      contenedorDePuntos.appendChild(punto);

      return punto;
    });

    function mostrar(siguiente) {
      cargar(laminas[siguiente]);
      cargar(laminas[(siguiente + 1) % laminas.length]);

      laminas[actual].classList.remove("is-active");
      puntos[actual].classList.remove("is-active");

      actual = siguiente;

      laminas[actual].classList.add("is-active");
      puntos[actual].classList.add("is-active");
    }

    function avanzar() {
      /* Se busca la siguiente lámina que esté lista. Una que
         falló se salta para siempre; una que todavía no llegó
         se salta solo esta vuelta, y le tocará más adelante.
         Así una foto lenta o rota nunca congela la tarjeta. */
      for (let salto = 1; salto <= laminas.length; salto++) {
        const siguiente = (actual + salto) % laminas.length;
        const lamina = laminas[siguiente];

        if (lamina.dataset.rota) {
          continue;
        }

        cargar(lamina);

        if (lamina.complete && lamina.naturalWidth > 0) {
          mostrar(siguiente);
          return;
        }
      }
    }

    function arrancar() {
      window.clearInterval(temporizador);
      temporizador = window.setInterval(avanzar, 4500);
      galeria.temporizadorDelCarrusel = temporizador;
    }

    function pausar() {
      window.clearInterval(temporizador);
    }

    const tarjeta = galeria.closest(".tour-card");

    if (tarjeta) {
      tarjeta.addEventListener("mouseenter", pausar);
      tarjeta.addEventListener("mouseleave", arrancar);
    }

    if (menosMovimiento) {
      return;
    }

    /* La segunda foto se adelanta, para que el primer
       cambio no se vea vacío */
    cargar(laminas[1]);

    galeria.arranqueDelCarrusel = window.setTimeout(function () {
      avanzar();
      arrancar();
    }, 4500 + retrasoInicial);
  });
}

/* Al repintar una lista, los carruseles anteriores hay que
   pararlos: si no, sus temporizadores siguen vivos apuntando
   a tarjetas que ya no están en la página. */
function detenerCarruseles(raiz) {
  (raiz || document)
    .querySelectorAll("[data-featured-slideshow]")
    .forEach(function (galeria) {
      window.clearInterval(galeria.temporizadorDelCarrusel);
      window.clearTimeout(galeria.arranqueDelCarrusel);
    });
}

window.iniciarCarruseles = iniciarCarruseles;
window.detenerCarruseles = detenerCarruseles;

document.addEventListener("DOMContentLoaded", function () {
  iniciarCarruseles(document);
});
