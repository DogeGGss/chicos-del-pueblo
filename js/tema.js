/* ==========================================================
   Modo claro / oscuro. Se carga en el <head> para aplicar el
   tema antes de pintar la página (sin parpadeo) y recordarlo
   entre visitas. Claro es el modo por defecto.
   ========================================================== */
(function () {
  "use strict";
  var CLAVE = "cdp_tema";
  var raiz = document.documentElement;

  function leer() {
    try { return window.localStorage.getItem(CLAVE) === "dark" ? "dark" : "light"; } catch (e) { return "light"; }
  }
  function aplicar(tema) {
    if (tema === "dark") raiz.setAttribute("data-theme", "dark");
    else raiz.removeAttribute("data-theme");
    var t = document.getElementById("temaToggle");
    if (t) {
      t.checked = tema !== "dark";   // como en el prototipo original: tildado = modo claro
      t.setAttribute("aria-label", tema === "dark" ? "Modo oscuro activado. Cambiar a modo claro" : "Modo claro activado. Cambiar a modo oscuro");
    }
  }

  aplicar(leer());

  document.addEventListener("DOMContentLoaded", function () {
    var t = document.getElementById("temaToggle");
    if (!t) return;
    aplicar(leer());
    t.addEventListener("change", function () {
      var tema = t.checked ? "light" : "dark";
      try { window.localStorage.setItem(CLAVE, tema); } catch (e) { /* sin almacenamiento: dura hasta recargar */ }
      aplicar(tema);
    });
  });
})();
