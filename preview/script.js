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
      if (window.carruselesPausados) {
        return;
      }

      window.clearInterval(temporizador);
      temporizador = window.setInterval(avanzar, 4500);
      galeria.temporizadorDelCarrusel = temporizador;
    }

    galeria.reanudarCarrusel = arrancar;

    function pausar() {
      window.clearInterval(temporizador);
    }

    const tarjeta = galeria.closest(".tour-card");

    if (tarjeta) {
      tarjeta.addEventListener("mouseenter", pausar);
      tarjeta.addEventListener("mouseleave", arrancar);
    }

    if (menosMovimiento || window.carruselesPausados) {
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

/* Interruptor general de las fotos que rotan solas. Hace falta
   para quien necesita parar el movimiento para poder leer, y no
   tiene activada la preferencia del sistema. */
function alternarCarruseles(pausar) {
  window.carruselesPausados = pausar;

  document
    .querySelectorAll("[data-featured-slideshow]")
    .forEach(function (galeria) {
      if (pausar) {
        window.clearInterval(galeria.temporizadorDelCarrusel);
        window.clearTimeout(galeria.arranqueDelCarrusel);
      } else if (galeria.reanudarCarrusel) {
        galeria.reanudarCarrusel();
      }
    });
}

window.iniciarCarruseles = iniciarCarruseles;
window.detenerCarruseles = detenerCarruseles;
window.alternarCarruseles = alternarCarruseles;

document.addEventListener("DOMContentLoaded", function () {
  const interruptor = document.querySelector("[data-pausar-fotos]");

  if (!interruptor) {
    return;
  }

  interruptor.addEventListener("click", function () {
    const pausar = interruptor.getAttribute("aria-pressed") !== "true";

    alternarCarruseles(pausar);

    interruptor.setAttribute("aria-pressed", String(pausar));
    interruptor.textContent = pausar
      ? "Resume photo slideshows"
      : "Pause photo slideshows";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  iniciarCarruseles(document);
});


/* El año del pie se pone solo. En el HTML va escrito uno de
   verdad, así que si esto no llega a correr tampoco se ve un
   hueco. */

document.addEventListener("DOMContentLoaded", function () {
  const anio = String(new Date().getFullYear());

  document.querySelectorAll("[data-anio]").forEach(function (hueco) {
    hueco.textContent = anio;
  });
});


/* ==========================================
CARRUSEL DE RESEÑAS

La tira se mueve sola, pero el desplazamiento lo hace
el navegador: la tarjeta se puede arrastrar con el dedo
igual que si no hubiera JavaScript. Si todas las reseñas
caben a la vez, las flechas y los puntos se esconden.
========================================== */

function iniciarCarruselDeResenas() {
  const marco = document.querySelector("[data-review-carousel]");

  if (!marco) {
    return;
  }

  const pista = marco.querySelector(".review-track");
  const cajaDePuntos = marco.querySelector(".review-dots");
  const anterior = marco.querySelector(".review-arrow-prev");
  const siguiente = marco.querySelector(".review-arrow-next");
  const tarjetas = Array.from(pista.querySelectorAll(".review-card"));

  if (tarjetas.length < 2) {
    return;
  }

  const menosMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let temporizador = null;
  let puntos = [];
  let indice = 0;

  /* El paso es de tarjeta a tarjeta, hueco incluido. Se mide
     del DOM en vez de calcularlo, porque el ancho cambia con
     la pantalla y con el tamaño de letra del sistema. */
  function paso() {
    return tarjetas[1].offsetLeft - tarjetas[0].offsetLeft;
  }

  function ultimoIndice() {
    const salto = paso();

    if (salto <= 0) {
      return 0;
    }

    /* Cuántas tarjetas se ven enteras ahora mismo */
    const caben = Math.max(1, Math.round(pista.clientWidth / salto));

    return Math.max(0, tarjetas.length - caben);
  }

  function ir(destino) {
    const tope = ultimoIndice();

    indice = destino > tope ? 0 : destino < 0 ? tope : destino;

    pista.scrollTo({
      left: indice * paso(),
      behavior: menosMovimiento.matches ? "auto" : "smooth"
    });

    pintarPuntos();
  }

  function pintarPuntos() {
    puntos.forEach(function (punto, numero) {
      const activo = numero === indice;

      punto.classList.toggle("is-active", activo);
      punto.setAttribute("aria-current", activo ? "true" : "false");
    });
  }

  /* Los puntos se rehacen al cambiar el ancho, porque el
     número de posiciones alcanzables depende de cuántas
     tarjetas caben. */
  function armarPuntos() {
    const tope = ultimoIndice();

    cajaDePuntos.textContent = "";
    puntos = [];

    if (tope === 0) {
      cajaDePuntos.hidden = true;
      anterior.hidden = true;
      siguiente.hidden = true;
      return;
    }

    cajaDePuntos.hidden = false;
    anterior.hidden = false;
    siguiente.hidden = false;

    for (let numero = 0; numero <= tope; numero++) {
      const punto = document.createElement("button");

      punto.type = "button";
      punto.className = "review-dot";
      punto.setAttribute(
        "aria-label",
        "Show review " + (numero + 1) + " of " + (tope + 1)
      );

      punto.addEventListener("click", function () {
        ir(numero);
        arrancar();
      });

      cajaDePuntos.appendChild(punto);
      puntos.push(punto);
    }

    if (indice > tope) {
      indice = 0;
    }

    pintarPuntos();
  }

  function arrancar() {
    parar();

    if (menosMovimiento.matches || ultimoIndice() === 0) {
      return;
    }

    temporizador = window.setInterval(function () {
      ir(indice + 1);
    }, 5200);
  }

  function parar() {
    window.clearInterval(temporizador);
    temporizador = null;
  }

  anterior.addEventListener("click", function () {
    ir(indice - 1);
    arrancar();
  });

  siguiente.addEventListener("click", function () {
    ir(indice + 1);
    arrancar();
  });

  /* Mientras se lee o se arrastra, la tira no se mueve sola */
  marco.addEventListener("mouseenter", parar);
  marco.addEventListener("mouseleave", arrancar);
  marco.addEventListener("focusin", parar);
  marco.addEventListener("focusout", arrancar);
  pista.addEventListener("pointerdown", parar);

  /* Si el visitante arrastra a mano, el punto activo tiene que
     seguirle. Se espera a que el desplazamiento se asiente. */
  let reposo = null;

  pista.addEventListener("scroll", function () {
    window.clearTimeout(reposo);

    reposo = window.setTimeout(function () {
      const salto = paso();

      if (salto > 0) {
        indice = Math.min(
          Math.round(pista.scrollLeft / salto),
          ultimoIndice()
        );

        pintarPuntos();
      }
    }, 120);
  });

  /* Fuera de pantalla o con la pestaña escondida no tiene
     sentido gastar el temporizador. */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      parar();
    } else {
      arrancar();
    }
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            arrancar();
          } else {
            parar();
          }
        });
      },
      { threshold: 0.2 }
    ).observe(marco);
  }

  let reajuste = null;

  window.addEventListener("resize", function () {
    window.clearTimeout(reajuste);

    reajuste = window.setTimeout(function () {
      armarPuntos();
      ir(indice);
    }, 180);
  });

  menosMovimiento.addEventListener("change", arrancar);

  armarPuntos();
  arrancar();
}

document.addEventListener("DOMContentLoaded", function () {
  iniciarCarruselDeResenas();
});
