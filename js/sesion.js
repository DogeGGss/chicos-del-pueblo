/* ==========================================================
   Sesión simulada compartida entre Historia y Mapa de la red.
   Solo para el prototipo: se guarda en la pestaña (sessionStorage)
   para que el rol se mantenga al pasar de una página a la otra.
   ========================================================== */
(function () {
  "use strict";

  var CLAVE = "cdp_sesion";

  function leer() {
    try {
      var v = window.sessionStorage.getItem(CLAVE);
      return v ? JSON.parse(v) : null;
    } catch (e) { return null; }
  }
  function guardar(s) {
    try {
      if (s) window.sessionStorage.setItem(CLAVE, JSON.stringify(s));
      else window.sessionStorage.removeItem(CLAVE);
    } catch (e) { /* sin almacenamiento: la sesión dura hasta recargar */ }
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function iniciales(nombre) {
    return String(nombre || "?").split(/\s+/).slice(0, 2).map(function (p) { return p.charAt(0); }).join("").toUpperCase();
  }
  // HTML de la sesión iniciada (lo usan las dos páginas, así se ve igual)
  function htmlSesion(s) {
    var sub = s.rol === "coord" ? "Coordinación" : (s.orgNombre || "");
    return '<span class="avatar" aria-hidden="true">' + esc(iniciales(s.nombre)) + "</span>" +
      '<span class="sesion-quien"><strong>' + esc(s.nombre) + "</strong><small>" + esc(sub) + "</small></span>" +
      '<button type="button" class="btn-salir" id="btnSalir">Salir</button>';
  }

  window.CDPSesion = { leer: leer, guardar: guardar, iniciales: iniciales, htmlSesion: htmlSesion, esc: esc };

  /* En las páginas que no son el mapa (Historia), la barra celeste muestra
     el botón del rol y la sesión; red.js maneja la suya. */
  var box = document.getElementById("navSesion");
  if (!box || document.body.hasAttribute("data-app")) return;

  function render() {
    var s = leer();
    var rol = s ? s.rol : "visitante";
    document.querySelectorAll("[data-rol-link]").forEach(function (a) {
      a.hidden = a.getAttribute("data-rol-link") !== rol;
    });
    box.innerHTML = s ? htmlSesion(s)
      : '<a class="btn-ingresar" href="red.html#ingresar"><span class="g-dot" aria-hidden="true">G</span>' +
        '<span>Ingresar<span class="g-texto"> con Google</span></span></a>';
  }
  box.addEventListener("click", function (e) {
    if (e.target.closest("#btnSalir")) { guardar(null); render(); }
  });
  render();
})();
