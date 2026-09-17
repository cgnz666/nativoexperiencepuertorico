/* ==========================================
PRIVATE SERVICES — APARICIÓN AL HACER SCROLL
========================================== */

document.addEventListener("DOMContentLoaded", function () {
  const targets = document.querySelectorAll(
    ".svc-intro-grid, .svc-row-grid, .svc-head, .svc-steps li, .svc-notes-grid article, .svc-inquire-inner"
  );

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!targets.length || prefersReducedMotion || !("IntersectionObserver" in window)) {
    return;
  }

  targets.forEach(function (target) {
    target.classList.add("svc-reveal");
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.08
    }
  );

  targets.forEach(function (target) {
    observer.observe(target);
  });
});
