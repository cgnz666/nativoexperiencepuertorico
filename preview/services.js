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
    ".svc-note-fold"
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
