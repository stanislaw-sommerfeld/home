/* ============================================================
   main.js — theme toggle, mobile nav, small enhancements.
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "theme-preference";

  /* ---------- Theme ---------- */
  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeTheme(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      /* ignore (e.g. private mode) */
    }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      var next = theme === "dark" ? "light" : "dark";
      toggle.setAttribute("aria-label", "Switch to " + next + " theme");
    }
  }

  // Initial theme: stored preference, else system preference, else dark.
  var stored = getStoredTheme();
  if (stored === "dark" || stored === "light") {
    applyTheme(stored);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    applyTheme("light");
  } else {
    applyTheme("dark");
  }

  document.addEventListener("click", function (event) {
    var el = event.target;
    if (!el || typeof el.closest !== "function") return;
    var toggle = el.closest(".theme-toggle");
    if (!toggle) return;
    var current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    var next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    storeTheme(next);
  });

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector(".nav__toggle");
  var navMenu = document.getElementById("nav-menu");

  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close the menu after following an in-page link.
    navMenu.addEventListener("click", function (event) {
      if (event.target.tagName === "A") closeMenu();
    });

    // Close on Escape.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Guard placeholder links ---------- */
  // Links still using href="#" (contact/CV placeholders) should not jump.
  document.querySelectorAll('a[href="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
    });
  });
})();
