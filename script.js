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
CARRUSEL DE RESEÑAS · CINTA

La tira corre sola, despacio y sin parar, como una
cinta transportadora. Detrás de las reseñas va una
copia de todas (oculta a lectores de pantalla y al
teclado); al terminar la primera vuelta, el scroll
salta hacia atrás exactamente una vuelta y el salto
no se ve, porque la copia es idéntica.

El desplazamiento sigue siendo el del navegador: la
tira se arrastra con el dedo. Al leer (ratón encima,
foco, dedo) se para, y retoma al soltar. Con
"reducir movimiento" no corre sola.
========================================== */

function iniciarCarruselDeResenas() {
  const marco = document.querySelector("[data-review-carousel]");

  if (!marco) {
    return;
  }

  const pista = marco.querySelector(".review-track");
  const anterior = marco.querySelector(".review-arrow-prev");
  const siguiente = marco.querySelector(".review-arrow-next");
  const tarjetas = Array.from(pista.querySelectorAll(".review-card"));

  if (tarjetas.length < 2) {
    return;
  }

  const menosMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  /* Píxeles por segundo: lo bastante lento para leer al paso */
  const VELOCIDAD = 32;

  tarjetas.forEach(function (tarjeta) {
    const copia = tarjeta.cloneNode(true);

    copia.setAttribute("aria-hidden", "true");
    copia.inert = true;
    pista.appendChild(copia);
  });

  let posicion = 0;
  let ultimoCuadro = null;
  let cuadro = null;
  let enPantalla = true;
  let pausas = 0;
  let pausaDeFlecha = null;

  /* Una vuelta es la distancia de la primera reseña a su copia.
     Se mide del DOM, porque el ancho cambia con la pantalla y
     con el tamaño de letra del sistema. */
  function vuelta() {
    return pista.children[tarjetas.length].offsetLeft - tarjetas[0].offsetLeft;
  }

  function paso() {
    return tarjetas[1].offsetLeft - tarjetas[0].offsetLeft;
  }

  function envolver(valor) {
    const largo = vuelta();

    if (largo <= 0) {
      return valor;
    }

    return ((valor % largo) + largo) % largo;
  }

  function mover(ahora) {
    /* Si otra cosa movió la tira (una flecha, la rueda), la
       cinta sigue desde ahí en vez de devolverla a su sitio */
    if (Math.abs(pista.scrollLeft - posicion) > 2) {
      posicion = pista.scrollLeft;
    }

    if (ultimoCuadro !== null) {
      const segundos = Math.min((ahora - ultimoCuadro) / 1000, 0.1);

      posicion = envolver(posicion + VELOCIDAD * segundos);
      pista.scrollLeft = posicion;
    }

    ultimoCuadro = ahora;
    cuadro = window.requestAnimationFrame(mover);
  }

  function corre() {
    return (
      !menosMovimiento.matches &&
      enPantalla &&
      !document.hidden &&
      pausas === 0 &&
      pausaDeFlecha === null
    );
  }

  function actualizar() {
    if (corre()) {
      if (cuadro === null) {
        posicion = pista.scrollLeft;
        ultimoCuadro = null;
        cuadro = window.requestAnimationFrame(mover);
      }
    } else if (cuadro !== null) {
      window.cancelAnimationFrame(cuadro);
      cuadro = null;
    }
  }

  /* Cada motivo para pararse suma uno y resta uno al acabar,
     así el ratón encima y el foco no se pisan entre sí. */
  function pausar() {
    pausas += 1;
    actualizar();
  }

  function soltar() {
    pausas = Math.max(0, pausas - 1);
    actualizar();
  }

  /* Las flechas mueven una reseña con un deslizamiento suave y
     la cinta retoma cuando termina. Hacia atrás desde el
     principio, se salta antes una vuelta hacia delante para
     que haya reseñas a la izquierda. */
  function mover1(sentido) {
    window.clearTimeout(pausaDeFlecha);
    pausaDeFlecha = 0;
    actualizar();

    if (sentido < 0 && pista.scrollLeft < paso()) {
      pista.scrollLeft += vuelta();
    }

    pista.scrollBy({
      left: sentido * paso(),
      behavior: menosMovimiento.matches ? "instant" : "smooth"
    });

    pausaDeFlecha = window.setTimeout(function () {
      pausaDeFlecha = null;
      actualizar();
    }, 1600);
  }

  anterior.addEventListener("click", function () {
    mover1(-1);
  });

  siguiente.addEventListener("click", function () {
    mover1(1);
  });

  marco.addEventListener("mouseenter", pausar);
  marco.addEventListener("mouseleave", soltar);
  marco.addEventListener("focusin", pausar);
  marco.addEventListener("focusout", soltar);

  /* Con el dedo no hay mouseleave: al soltar, la cinta espera
     un momento antes de retomar, para acabar la frase. */
  pista.addEventListener("pointerdown", function (evento) {
    if (evento.pointerType !== "mouse") {
      pausar();
    }
  });

  function retomarTrasTocar(evento) {
    if (evento.pointerType !== "mouse") {
      window.setTimeout(soltar, 2500);
    }
  }

  pista.addEventListener("pointerup", retomarTrasTocar);
  pista.addEventListener("pointercancel", retomarTrasTocar);

  /* Si el visitante arrastra más allá de la primera vuelta, la
     tira salta atrás una vuelta para que nunca se acabe. */
  pista.addEventListener("scroll", function () {
    const largo = vuelta();

    /* Mientras corre una flecha no se toca: la flecha hacia
       atrás parte justo de más allá de la vuelta */
    if (
      cuadro === null &&
      pausaDeFlecha === null &&
      largo > 0 &&
      pista.scrollLeft >= largo
    ) {
      pista.scrollLeft -= largo;
    }
  });

  document.addEventListener("visibilitychange", actualizar);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          enPantalla = entrada.isIntersecting;
        });

        actualizar();
      },
      { threshold: 0.2 }
    ).observe(marco);
  }

  /* Al cambiar el ancho cambia la vuelta: se reencaja la posición */
  window.addEventListener("resize", function () {
    posicion = envolver(pista.scrollLeft);
    pista.scrollLeft = posicion;
  });

  menosMovimiento.addEventListener("change", actualizar);

  actualizar();
}

document.addEventListener("DOMContentLoaded", function () {
  iniciarCarruselDeResenas();
});


/* ==========================================
LÁMINAS: SECCIONES CON FONDO QUE SE QUEDAN QUIETAS

El hero y el bloque de la selva se quedan fijos y la
sección siguiente les pasa por encima, como el hero de
servicios. Muchas son más altas que la pantalla: si se
fijaran arriba desde el principio, la siguiente taparía
su parte de abajo antes de verla. Por eso cada una se
fija cuando su borde de abajo toca el de la pantalla
(top negativo), y las que caben, bajo la cabecera.

Ese top depende del alto de la sección y de la pantalla,
así que lo calcula JS. Sin JS no hay clase "laminas" y
todo se desplaza normal.
========================================== */

(function () {
  const laminas = document.querySelectorAll(".lamina");
  const cabecera = document.querySelector(".site-header");

  if (!laminas.length) {
    return;
  }

  function ajustar() {
    const alto = cabecera ? cabecera.offsetHeight : 0;

    laminas.forEach(function (lamina) {
      const top = Math.min(alto, window.innerHeight - lamina.offsetHeight);
      lamina.style.setProperty("--lamina-top", top + "px");
    });
  }

  ajustar();
  document.documentElement.classList.add("laminas");

  window.addEventListener("resize", ajustar);
  window.addEventListener("load", ajustar);

  // Las fotos y las fuentes que llegan tarde cambian el alto
  if ("ResizeObserver" in window) {
    const observador = new ResizeObserver(ajustar);
    laminas.forEach(function (lamina) {
      observador.observe(lamina);
    });
  }
})();


/* ==========================================
APARICIONES Y VIDEO DE ABOUT

Las piezas con data-aparece reciben is-visible la
primera vez que entran en pantalla (la tortuga que se
arma, el marco del video). La clase animar en <html>
activa esas transiciones en CSS; sin IntersectionObserver
o con "reducir movimiento" no se pone y todo se ve quieto.

El video de About no lleva autoplay: se reproduce solo
mientras se ve y se pausa al salir, para no gastar datos
ni batería. Con "reducir movimiento" se queda en su
imagen fija.
========================================== */

(function () {
  const menosMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  // El cierre (Let's Plan) sube escalonado en el home y en servicios
  const piezas = document.querySelectorAll(
    "[data-aparece], .cierre-texto > *, .cierre-dibujo"
  );
  const video = document.querySelector(".about-video");

  if (!("IntersectionObserver" in window)) {
    if (video && !menosMovimiento) {
      video.play().catch(function () {});
    }
    return;
  }

  if (!menosMovimiento && piezas.length) {
    document.documentElement.classList.add("animar");

    const alEntrar = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("is-visible");
            alEntrar.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    piezas.forEach(function (pieza) {
      // Escalonado entre hermanos, sin pasar de cinco pasos
      const hermanos = Array.prototype.indexOf.call(
        pieza.parentElement.children,
        pieza
      );
      pieza.style.setProperty("--aparece-i", Math.min(hermanos, 4));
      alEntrar.observe(pieza);
    });
  }

  if (video && !menosMovimiento) {
    new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            video.play().catch(function () {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.15 }
    ).observe(video);
  }
})();
