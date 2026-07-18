const menuButton=document.querySelector('.menu-toggle');const navigation=document.querySelector('.primary-nav');if(menuButton&&navigation){menuButton.addEventListener('click',()=>{const isOpen=navigation.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(isOpen));});navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{navigation.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}));}


/* ==========================================
FEATURED EXPERIENCES — IMAGE SLIDESHOW
========================================== */

document.addEventListener("DOMContentLoaded", function () {
  const galleries = document.querySelectorAll(
    "[data-featured-slideshow]"
  );

  galleries.forEach(function (gallery) {
    const slides = Array.from(
      gallery.querySelectorAll(".tour-card-slide")
    );

    const dotsContainer = gallery.querySelector(
      ".tour-card-dots"
    );

    if (slides.length < 2 || !dotsContainer) {
      return;
    }

    let currentSlide = 0;
    let slideshowTimer = null;

    const startingDelay =
      Number(gallery.dataset.delay) || 0;

    const dots = slides.map(function (_, index) {
      const dot = document.createElement("span");

      dot.className = "tour-card-dot";

      if (index === 0) {
        dot.classList.add("is-active");
      }

      dotsContainer.appendChild(dot);

      return dot;
    });

    function showSlide(nextIndex) {
      slides[currentSlide].classList.remove("is-active");
      dots[currentSlide].classList.remove("is-active");

      currentSlide = nextIndex;

      slides[currentSlide].classList.add("is-active");
      dots[currentSlide].classList.add("is-active");
    }

    function nextSlide() {
      const nextIndex =
        (currentSlide + 1) % slides.length;

      showSlide(nextIndex);
    }

    function startSlideshow() {
      window.clearInterval(slideshowTimer);

      slideshowTimer = window.setInterval(
        nextSlide,
        4500
      );
    }

    function pauseSlideshow() {
      window.clearInterval(slideshowTimer);
    }

    const card = gallery.closest(".featured-tour-card");

    if (card) {
      card.addEventListener("mouseenter", pauseSlideshow);
      card.addEventListener("mouseleave", startSlideshow);
    }

    window.setTimeout(function () {
      nextSlide();
      startSlideshow();
    }, 4500 + startingDelay);
  });
});