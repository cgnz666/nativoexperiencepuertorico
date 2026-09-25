/* ==========================================
PRIVATE SERVICES — PLEGABLES SEGÚN EL ANCHO

En el celular, "See what's included" y los bloques de
Good to know van plegados. En escritorio van abiertos y
fijos: el mismo <details> se abre y su <summary> deja de
responder, para no tener el texto escrito dos veces.

Corre en cuanto se lee el archivo (va al final del body),
no en DOMContentLoaded, para que el escritorio no pinte
primero todo cerrado y luego salte. La clase svc-folds
avisa al CSS de que ya puede esconder los <summary>: sin
JS se quedan visibles y todo se puede abrir a mano.
========================================== */

(function () {
  const folds = document.querySelectorAll(".svc-fold");
  const desktop = window.matchMedia("(min-width: 1024px)");
  let wasDesktop = null;

  if (!folds.length) {
    return;
  }

  // Solo actúa al cruzar el corte: en el celular, esconder la barra
  // de direcciones también dispara resize y no debe cerrar nada.
  function sync() {
    if (desktop.matches === wasDesktop) {
      return;
    }

    wasDesktop = desktop.matches;

    folds.forEach(function (fold) {
      const summary = fold.querySelector("summary");

      fold.open = desktop.matches;

      if (desktop.matches) {
        summary.setAttribute("tabindex", "-1");
      } else {
        summary.removeAttribute("tabindex");
      }
    });
  }

  folds.forEach(function (fold) {
    fold.querySelector("summary").addEventListener("click", function (event) {
      if (desktop.matches) {
        event.preventDefault();
      }
    });
  });

  sync();
  document.documentElement.classList.add("svc-folds");

  // resize y no el change de matchMedia: en Safari 13 o anterior,
  // matchMedia no tiene addEventListener
  window.addEventListener("resize", sync);
})();


/* ==========================================
PRIVATE SERVICES — APARICIÓN AL HACER SCROLL

Las piezas entran escalonadas cuando llegan a la
pantalla. Sin IntersectionObserver, o si el visitante
pidió menos movimiento, todo se ve quieto desde el
principio: la clase svc-anim nunca se pone.
========================================== */

document.addEventListener("DOMContentLoaded", function () {
  const groups = [
    ".svc-carta-list li",
    ".svc-intro-grid > *",
    ".svc-item-head",
    ".svc-item-media .svc-fig",
    ".svc-steps li",
    ".svc-note-fold",
    ".cierre-texto > *",
    ".cierre-dibujo"
  ];

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || !("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );

  groups.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el, i, all) {
      // Escalonado dentro de cada grupo de hermanos, sin pasar de cinco pasos
      const siblings = Array.prototype.filter.call(all, function (other) {
        return other.parentElement === el.parentElement;
      });
      el.style.setProperty("--svc-i", Math.min(siblings.indexOf(el), 4));
      el.classList.add("svc-reveal");
      observer.observe(el);
    });
  });

  document.documentElement.classList.add("svc-anim");
});
