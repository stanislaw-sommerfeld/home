(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  document.querySelectorAll(".year").forEach(function (e) {
    e.textContent = String(new Date().getFullYear());
  });

  /* ---------- Reading-progress bar ---------- */
  var bar = document.querySelector(".scroll-progress span");
  function updateProgress() {
    if (!bar) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop || window.pageYOffset) / max : 0;
    bar.style.width = (pct * 100).toFixed(2) + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  /* ---------- Nav scrolled state ---------- */
  var nav = document.querySelector(".nav");
  function updateNav() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", (window.pageYOffset || 0) > 20);
  }
  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  /* ---------- Section reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Projects carousel ---------- */
  var carousel = document.querySelector("[data-carousel]");
  var track = document.querySelector("[data-carousel-track]");
  var prevBtn = document.querySelector("[data-carousel-prev]");
  var nextBtn = document.querySelector("[data-carousel-next]");

  function scrollAmount() {
    var item = track && track.querySelector(".carousel__item");
    if (!item) return 300;
    var gap = 21; // ~1.3rem
    return item.getBoundingClientRect().width + gap;
  }
  function updateArrows() {
    if (!carousel || !prevBtn || !nextBtn) return;
    var maxScroll = carousel.scrollWidth - carousel.clientWidth - 2;
    prevBtn.disabled = carousel.scrollLeft <= 2;
    nextBtn.disabled = carousel.scrollLeft >= maxScroll;
  }
  if (carousel && prevBtn && nextBtn) {
    prevBtn.addEventListener("click", function () {
      carousel.scrollBy({ left: -scrollAmount(), behavior: reduceMotion ? "auto" : "smooth" });
    });
    nextBtn.addEventListener("click", function () {
      carousel.scrollBy({ left: scrollAmount(), behavior: reduceMotion ? "auto" : "smooth" });
    });
    carousel.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    updateArrows();
  }

  /* ---------- Project detail modals ---------- */
  var lastFocused = null;

  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    // Force reflow so the transition runs, then flip the open class.
    void modal.offsetWidth;
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
    var closeBtn = modal.querySelector(".modal__close");
    if (closeBtn) closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", onKeydown);
    var finish = function () {
      modal.hidden = true;
      modal.removeEventListener("transitionend", finish);
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    };
    if (reduceMotion) { finish(); }
    else { modal.addEventListener("transitionend", finish); }
  }

  function onKeydown(e) {
    var open = document.querySelector(".modal.is-open");
    if (!open) return;
    if (e.key === "Escape") { closeModal(open); return; }
    if (e.key === "Tab") {
      // Simple focus trap within the open panel.
      var focusables = open.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  // Open from project cards (click + Enter/Space for keyboard users).
  document.querySelectorAll("[data-project]").forEach(function (card) {
    var id = "modal-" + card.getAttribute("data-project");
    card.addEventListener("click", function () { openModal(id); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(id); }
    });
  });

  // Close via backdrop or close button.
  document.querySelectorAll("[data-modal-close]").forEach(function (el) {
    el.addEventListener("click", function () {
      closeModal(el.closest(".modal"));
    });
  });

  /* ---------- Placeholder links don't jump ---------- */
  document.querySelectorAll('a[href="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });
})();
