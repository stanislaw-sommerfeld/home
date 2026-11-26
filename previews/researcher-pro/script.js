(function () {
  "use strict";
  var root = document.documentElement;
  var KEY = "rp-theme";

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      var next = theme === "dark" ? "light" : "dark";
      btn.setAttribute("aria-label", "Switch to " + next + " theme");
    }
  }

  var stored;
  try { stored = localStorage.getItem(KEY); } catch (e) { stored = null; }
  if (stored === "light" || stored === "dark") {
    apply(stored);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    apply("dark");
  } else {
    apply("light");
  }

  document.addEventListener("click", function (e) {
    var el = e.target;
    if (!el || typeof el.closest !== "function") return;
    if (!el.closest(".theme-toggle")) return;
    var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    var next = current === "dark" ? "light" : "dark";
    apply(next);
    try { localStorage.setItem(KEY, next); } catch (err) {}
  });

  document.querySelectorAll(".year").forEach(function (e) {
    e.textContent = String(new Date().getFullYear());
  });

  // Placeholder links should not jump.
  document.querySelectorAll('a[href="#"]').forEach(function (a) {
    a.addEventListener("click", function (ev) { ev.preventDefault(); });
  });
})();
