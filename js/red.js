/* ==========================================================
   Mapa de la red — lógica del prototipo (todo en memoria)
   ========================================================== */
(function () {
  "use strict";

  var TIPOS = window.RED_TIPOS;
  var RECURSOS = window.RED_RECURSOS;
  var LOCALIDADES = window.RED_LOCALIDADES;
  var HOY = "2026-09-25";
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var CAMPOS_LABEL = {
    nombre: "Nombre", tipo: "Tipo", referente: "Referente", descripcion: "Descripción",
    edades: "Edades", chicos: "Cantidad de chicxs", horarios: "Horarios", localidad: "Localidad",
    direccion: "Dirección", mostrarDireccion: "Visibilidad de la ubicación", lat: "Ubicación en el mapa",
    necesita: "Necesitan", ofrece: "Ofrecen", necesitaOtros: "Otras necesidades", ofreceOtros: "Otras ofertas", telefono: "Teléfono", correo: "Correo", redes: "Redes",
  };

  /* ---------------- estado ---------------- */
  var orgs = [];
  var solicitudes = [];   // pedidos de acceso de organizaciones que quieren sumarse
  window.RED_ORGS.forEach(function (o) {
    var copia = clone(o);
    if (copia.estado === "pendiente") {
      solicitudes.push({ id: "sol-" + copia.id, datos: copia, email: copia.emailSolicitud,
        mensaje: copia.mensaje, fecha: copia.actualizada });
    } else {
      orgs.push(copia);
    }
  });
  var avisos = window.RED_AVISOS.map(clone);
  var usuarios = window.RED_USUARIOS.map(clone);   // lista de cuentas habilitadas
  var sesion = null;      // { email, nombre, rol: "org" | "coord", orgId }
  var rol = "visitante";
  var vista = "mapa";
  var seleccionId = null;
  var avisoFiltro = "";
  var yaRespondidos = {};
  var ultimoPedido = null;       // nombre de la organización del último pedido enviado
  var emailRechazado = "";       // cuenta no habilitada con la que se intentó ingresar
  var nOrg = 1000;
  var filtro = { q: "", prov: "", recurso: "", tipos: {} };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function fecha(iso) {
    var p = String(iso).split("-");
    return +p[2] + " " + MESES[+p[1] - 1];
  }
  // "pañales, garrafa de gas" -> ["Pañales", "Garrafa de gas"] (sin repetidos, máx. 6)
  function separarOtros(texto) {
    var vistos = {};
    return String(texto || "").split(/[,;\n]/).map(function (t) { return t.trim().slice(0, 40); })
      .filter(function (t) {
        var k = norm(t);
        if (!k || vistos[k]) return false;
        vistos[k] = true;
        return true;
      }).slice(0, 6).map(function (t) { return t.charAt(0).toUpperCase() + t.slice(1); });
  }
  function plural(n, uno, varios) { return n + " " + (n === 1 ? uno : varios); }
  function orgById(id) {
    for (var i = 0; i < orgs.length; i++) if (orgs[i].id === id) return orgs[i];
    return null;
  }
  function miOrg() { return sesion && sesion.orgId ? orgById(sesion.orgId) : null; }
  function usuarioPorEmail(email) {
    email = String(email || "").trim().toLowerCase();
    for (var i = 0; i < usuarios.length; i++) if (usuarios[i].email === email) return usuarios[i];
    return null;
  }
  function emailValido(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

  /* ---------------- toast ---------------- */
  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 3200);
  }

  /* ---------------- vistas (botones de la barra celeste) ---------------- */
  var botonesVista = Array.prototype.slice.call(document.querySelectorAll(".nav-vista"));
  var VISTAS = ["mapa", "tablero", "ficha", "acceso", "coord"];
  function mostrarVista(v, sinHash) {
    var boton = document.querySelector('.nav-vista[data-vista="' + v + '"]');
    if (!boton || boton.hidden) v = "mapa";
    vista = v;
    botonesVista.forEach(function (b) {
      var on = b.getAttribute("data-vista") === v;
      if (on) {
        b.setAttribute("aria-current", "true");
        b.scrollIntoView({ block: "nearest", inline: "nearest" });
      } else b.removeAttribute("aria-current");
      $(b.getAttribute("aria-controls")).hidden = !on;
    });
    if (!sinHash) history.replaceState(null, "", v === "mapa" ? location.pathname : "#" + v);
    if (v === "mapa" && mapa) setTimeout(function () { mapa.invalidateSize(); }, 0);
    if (v === "ficha") initMapaFicha();
    window.scrollTo(0, 0);
  }
  botonesVista.forEach(function (b) {
    b.addEventListener("click", function () { mostrarVista(b.getAttribute("data-vista")); });
  });

  /* ---------------- sesión y roles ---------------- */
  // Prototipo: el ingreso con Google está simulado y la lista de cuentas vive en la página.
  // En la versión real, Google confirma la identidad y el servidor decide qué puede hacer cada cuenta.
  function iniciales(nombre) {
    return String(nombre || "?").split(/\s+/).slice(0, 2).map(function (p) { return p.charAt(0); }).join("").toUpperCase();
  }
  function renderSesion() {
    var box = $("navSesion");
    if (!sesion) {
      box.innerHTML = '<button type="button" id="btnIngresar"><span class="g-dot" aria-hidden="true">G</span>' +
        '<span>Ingresar<span class="g-texto"> con Google</span></span></button>';
      return;
    }
    box.innerHTML = window.CDPSesion.htmlSesion(datosSesion());
  }
  $("navSesion").addEventListener("click", function (e) {
    if (e.target.closest("#btnIngresar")) abrirIngreso();
    if (e.target.closest("#btnSalir")) {
      setSesion(null);
      toast("Cerraste sesión. Estás viendo la red como visitante.");
    }
  });

  function abrirIngreso() {
    var html = '<button type="button" class="modal-close" data-cerrar aria-label="Cerrar">✕</button>' +
      '<div class="g-head"><span class="g-dot" aria-hidden="true">G</span><h2 id="modalOrgTitulo">Ingresar con Google</h2></div>' +
      '<p class="g-sub">Elegí una cuenta para continuar a <strong>Mapa de la red · Chicxs del Pueblo</strong>.</p>' +
      '<ul class="g-cuentas">' + window.RED_CUENTAS_DEMO.map(function (c) {
        return '<li><button type="button" data-login="' + esc(c.email) + '"><span class="avatar" aria-hidden="true">' + esc(iniciales(c.nombre)) + "</span>" +
          "<span><strong>" + esc(c.nombre) + "</strong><small>" + esc(c.email) + "</small></span>" +
          '<span class="g-nota">' + esc(c.nota) + "</span></button></li>";
      }).join("") + "</ul>" +
      '<form class="g-otra" data-login-otra novalidate><label class="field"><span class="field-label">Usar otra cuenta</span>' +
      '<input type="email" class="field-control" name="email" placeholder="nombre@ejemplo.com" autocomplete="email"></label>' +
      '<button type="submit" class="btn">Continuar</button></form>' +
      '<p class="g-aviso">Simulación del prototipo: en la versión real se abre la ventana de Google, y es el servidor el que verifica si la cuenta está habilitada.</p>';
    mostrarModal(html);
  }

  function intentarIngreso(email) {
    email = String(email || "").trim().toLowerCase();
    if (!emailValido(email)) { toast("Escribí un mail válido."); return; }
    var u = usuarioPorEmail(email);
    if (u && (u.rol === "coord" || orgById(u.orgId))) {
      modal.close();
      setSesion({ email: u.email, nombre: u.nombre, rol: u.rol, orgId: u.orgId || null });
      toast(u.rol === "coord" ? "Entraste como coordinación de la red." : "Entraste como " + miOrg().nombre + ".");
      return;
    }
    emailRechazado = email;
    mostrarModal('<button type="button" class="modal-close" data-cerrar aria-label="Cerrar">✕</button>' +
      '<div class="rechazo"><div class="big" aria-hidden="true">🔒</div>' +
      '<h2 id="modalOrgTitulo">Tu cuenta no está habilitada</h2>' +
      "<p><strong>" + esc(email) + "</strong> no figura entre las cuentas de la red. Si sos parte de lxs Chicxs del Pueblo, pedile acceso a la coordinación.</p>" +
      '<div class="det-actions"><button type="button" class="btn btn-primary" data-ir-acceso>Solicitar acceso</button>' +
      '<button type="button" class="btn" data-cerrar>Seguir como visitante</button></div></div>');
  }

  // lo que se recuerda al pasar a Historia (y al volver)
  function datosSesion() {
    if (!sesion) return null;
    var o = miOrg();
    return { email: sesion.email, nombre: sesion.nombre, rol: sesion.rol, orgId: sesion.orgId, orgNombre: o ? o.nombre : "" };
  }

  function setSesion(s) {
    sesion = s;
    rol = s ? s.rol : "visitante";
    window.CDPSesion.guardar(datosSesion());
    aplicarRol();
  }

  // al entrar desde Historia con una sesión abierta, se retoma (si la cuenta sigue habilitada)
  function retomarSesion() {
    var g = window.CDPSesion.leer();
    if (!g) return;
    var u = usuarioPorEmail(g.email);
    if (u && (u.rol === "coord" || orgById(u.orgId))) setSesion({ email: u.email, nombre: u.nombre, rol: u.rol, orgId: u.orgId || null });
    else window.CDPSesion.guardar(null);
  }

  function aplicarRol() {
    $("tab-ficha").hidden = rol !== "org";
    $("tab-acceso").hidden = rol !== "visitante";
    $("tab-coord").hidden = rol !== "coord";
    $("publicarBloqueado").hidden = rol === "org";
    $("formAviso").hidden = rol !== "org";
    renderSesion();
    if (rol === "org") cargarFicha();
    renderAvisos();
    renderCoordinacion();
    var boton = document.querySelector('.nav-vista[data-vista="' + vista + '"]');
    if (!boton || boton.hidden) mostrarVista("mapa");
    else if (vista === "ficha") initMapaFicha();
  }

  /* ---------------- estadísticas ---------------- */
  function renderStats() {
    var provs = {};
    var chicos = 0;
    orgs.forEach(function (o) { provs[o.provincia] = 1; chicos += +o.chicos || 0; });
    $("statOrgs").textContent = orgs.length;
    $("statProv").textContent = Object.keys(provs).length;
    $("statChicos").textContent = chicos.toLocaleString("es-AR");
    $("statAvisos").textContent = avisos.length;
    $("cuentaAvisos").textContent = avisos.length;
    $("cuentaPendientes").textContent = solicitudes.length || "";
    $("cuentaPedidos").textContent = solicitudes.length || "";
  }

  /* ---------------- filtros ---------------- */
  function initFiltros() {
    var selProv = $("fProvincia");
    window.RED_PROVINCIAS.forEach(function (p) {
      selProv.insertAdjacentHTML("beforeend", '<option value="' + esc(p) + '">' + esc(p) + "</option>");
    });
    var selRec = $("fRecurso");
    var grpN = '<optgroup label="Necesitan…">';
    var grpO = '<optgroup label="Ofrecen…">';
    Object.keys(RECURSOS).forEach(function (k) {
      grpN += '<option value="necesita:' + k + '">Necesitan: ' + esc(RECURSOS[k]) + "</option>";
      grpO += '<option value="ofrece:' + k + '">Ofrecen: ' + esc(RECURSOS[k]) + "</option>";
    });
    selRec.insertAdjacentHTML("beforeend", grpN + "</optgroup>" + grpO + "</optgroup>");

    var box = $("fTipos");
    Object.keys(TIPOS).forEach(function (k) {
      box.insertAdjacentHTML("beforeend",
        '<button type="button" class="pill" aria-pressed="false" data-tipo="' + k + '">' +
        '<span aria-hidden="true">' + TIPOS[k].icono + "</span>" + esc(TIPOS[k].label) + "</button>");
    });
    box.addEventListener("click", function (e) {
      var b = e.target.closest("[data-tipo]");
      if (!b) return;
      var k = b.getAttribute("data-tipo");
      if (filtro.tipos[k]) delete filtro.tipos[k]; else filtro.tipos[k] = true;
      b.setAttribute("aria-pressed", filtro.tipos[k] ? "true" : "false");
      aplicarFiltros();
    });
    $("fBuscar").addEventListener("input", function () { filtro.q = this.value; aplicarFiltros(); });
    selProv.addEventListener("change", function () { filtro.prov = this.value; aplicarFiltros(true); });
    selRec.addEventListener("change", function () { filtro.recurso = this.value; aplicarFiltros(); });
    $("btnLimpiar").addEventListener("click", function () {
      filtro = { q: "", prov: "", recurso: "", tipos: {} };
      $("fBuscar").value = ""; selProv.value = ""; selRec.value = "";
      box.querySelectorAll("[data-tipo]").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      aplicarFiltros(true);
    });
  }

  function coincide(o) {
    if (filtro.prov && o.provincia !== filtro.prov) return false;
    var tiposOn = Object.keys(filtro.tipos);
    if (tiposOn.length && !filtro.tipos[o.tipo]) return false;
    if (filtro.recurso) {
      var p = filtro.recurso.split(":");
      if ((o[p[0]] || []).indexOf(p[1]) === -1) return false;
    }
    if (filtro.q) {
      var blob = norm([o.nombre, o.localidad, o.provincia, o.descripcion, o.referente, TIPOS[o.tipo].label,
        (o.necesita || []).map(function (k) { return RECURSOS[k]; }).join(" "),
        (o.ofrece || []).map(function (k) { return RECURSOS[k]; }).join(" "),
        (o.necesitaOtros || []).join(" "), (o.ofreceOtros || []).join(" ")].join(" "));
      var palabras = norm(filtro.q).split(/\s+/).filter(Boolean);
      for (var i = 0; i < palabras.length; i++) if (blob.indexOf(palabras[i]) === -1) return false;
    }
    return true;
  }

  function hayFiltros() {
    return !!(filtro.q || filtro.prov || filtro.recurso || Object.keys(filtro.tipos).length);
  }

  function aplicarFiltros(reencuadrar) {
    var visibles = orgs.filter(coincide).sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); });
    renderLista(visibles);
    actualizarMarcadores(visibles, reencuadrar);
    $("btnLimpiar").hidden = !hayFiltros();
  }

  /* ---------------- listado ---------------- */
  function tagsHtml(o, max) {
    var html = "";
    var n = 0;
    function tag(txt, clase) {
      if (max && n >= max) return;
      html += '<span class="tag ' + clase + '">' + txt + "</span>"; n++;
    }
    // primero todo lo que necesitan, después todo lo que ofrecen (lo escrito a mano va con borde punteado)
    (o.necesita || []).forEach(function (k) { tag("Necesita: " + esc(RECURSOS[k]), "tag--necesita"); });
    (o.necesitaOtros || []).forEach(function (t) { tag("Necesita: " + esc(t), "tag--necesita tag--otro"); });
    (o.ofrece || []).forEach(function (k) { tag("Ofrece: " + esc(RECURSOS[k]), "tag--ofrece"); });
    (o.ofreceOtros || []).forEach(function (t) { tag("Ofrece: " + esc(t), "tag--ofrece tag--otro"); });
    var total = (o.necesita || []).length + (o.ofrece || []).length + (o.necesitaOtros || []).length + (o.ofreceOtros || []).length;
    if (max && total > max) html += '<span class="tag tag--neutral">+' + (total - max) + "</span>";
    return html;
  }

  function renderLista(lista) {
    $("listCount").textContent = plural(lista.length, "organización", "organizaciones");
    var ul = $("orgList");
    if (!lista.length) {
      ul.innerHTML = '<li class="vacio">No encontramos organizaciones con esos filtros.</li>';
      return;
    }
    ul.innerHTML = lista.map(function (o) {
      return '<li class="org-card' + (o.id === seleccionId ? " is-selected" : "") + '" data-id="' + o.id + '">' +
        '<div class="org-icon" aria-hidden="true">' + TIPOS[o.tipo].icono + "</div>" +
        '<h3><button type="button" data-ver="' + o.id + '">' + esc(o.nombre) + "</button></h3>" +
        '<div class="org-meta">' + esc(TIPOS[o.tipo].label) + " · " + esc(o.localidad) + ", " + esc(o.provincia) + "</div>" +
        '<p class="org-desc">' + esc(o.descripcion) + "</p>" +
        '<div class="org-tags">' + tagsHtml(o, 3) + "</div>" +
        "</li>";
    }).join("");
  }

  $("orgList").addEventListener("click", function (e) {
    var ver = e.target.closest("[data-ver]");
    if (ver) { abrirFicha(ver.getAttribute("data-ver")); return; }
    var card = e.target.closest(".org-card");
    if (card) seleccionar(card.getAttribute("data-id"), { desdeLista: true });
  });

  /* ---------------- mapa principal ---------------- */
  var mapa = null;
  var cluster = null;
  var zonas = null;
  var marcadores = {};
  // Mapa base Argenmap del Instituto Geográfico Nacional: gratuito, sin API key y con la
  // toponimia oficial argentina (p. ej. "Islas Malvinas"). Es un servicio TMS: {-y} invierte la fila.
  var TILE_URL = "https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png";
  var TILE_ATTR = '<a href="https://www.ign.gob.ar/" target="_blank" rel="noopener">Instituto Geográfico Nacional</a> + <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';

  function iconoPin(o, sel) {
    return L.divIcon({
      className: "",
      html: '<div class="pin' + (sel ? " is-selected" : "") + '"><span>' + TIPOS[o.tipo].icono + "</span></div>",
      iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -32],
    });
  }

  function popupHtml(o) {
    return '<p class="popup-title">' + esc(o.nombre) + "</p>" +
      '<p class="popup-meta">' + esc(TIPOS[o.tipo].label) + " · " + esc(o.localidad) + "</p>" +
      '<button type="button" class="btn btn-sm btn-primary" data-ver="' + o.id + '">Ver ficha</button>';
  }

  function initMapa() {
    if (typeof L === "undefined") {
      $("mapa").innerHTML = '<p class="vacio" style="margin:1rem">No se pudo cargar el mapa.</p>';
      return;
    }
    mapa = L.map("mapa", { zoomControl: true, scrollWheelZoom: true, minZoom: 3 });
    L.tileLayer(TILE_URL, { attribution: TILE_ATTR, minZoom: 3, maxZoom: 18 }).addTo(mapa);
    mapa.setView([-35.5, -63.5], 4);
    zonas = L.layerGroup().addTo(mapa);
    cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 45,
      disableClusteringAtZoom: 11,
      iconCreateFunction: function (c) {
        var n = c.getChildCount();
        var s = n < 10 ? 36 : 44;
        return L.divIcon({ className: "", html: '<div class="cluster" style="width:' + s + "px;height:" + s + 'px">' + n + "</div>", iconSize: [s, s] });
      },
    });
    mapa.addLayer(cluster);
    $("mapa").addEventListener("click", function (e) {
      var b = e.target.closest("[data-ver]");
      if (b) abrirFicha(b.getAttribute("data-ver"));
    });
  }

  function construirMarcadores() {
    if (!mapa) return;
    marcadores = {};
    orgs.forEach(function (o) {
      var m = L.marker([o.lat, o.lng], { icon: iconoPin(o, o.id === seleccionId), title: o.nombre, alt: o.nombre, keyboard: true });
      m.bindPopup(popupHtml(o));
      m.on("click", function () { seleccionar(o.id, { desdeMapa: true }); });
      marcadores[o.id] = m;
    });
  }

  function actualizarMarcadores(visibles, reencuadrar) {
    if (!mapa) return;
    cluster.clearLayers();
    zonas.clearLayers();
    cluster.addLayers(visibles.map(function (o) { return marcadores[o.id]; }).filter(Boolean));
    visibles.forEach(function (o) {
      if (o.mostrarDireccion !== "exacta") {
        L.circle([o.lat, o.lng], { radius: 1500, color: "#13739F", weight: 1.5, dashArray: "4 4", fillColor: "#63C2EB", fillOpacity: .18, interactive: false }).addTo(zonas);
      }
    });
    if (reencuadrar) encuadrar(visibles);
  }

  function encuadrar(lista) {
    if (!mapa || !lista.length) return;
    var b = L.latLngBounds(lista.map(function (o) { return [o.lat, o.lng]; }));
    mapa.fitBounds(b.pad(0.15), { maxZoom: 11 });
  }

  function seleccionar(id, opts) {
    opts = opts || {};
    var anterior = seleccionId;
    seleccionId = id;
    var o = orgById(id);
    if (!o) return;
    [anterior, id].forEach(function (x) {
      var ox = orgById(x);
      if (ox && marcadores[x]) marcadores[x].setIcon(iconoPin(ox, x === id));
    });
    document.querySelectorAll(".org-card").forEach(function (c) {
      c.classList.toggle("is-selected", c.getAttribute("data-id") === id);
    });
    if (opts.desdeMapa) {
      var card = document.querySelector('.org-card[data-id="' + id + '"]');
      if (card && window.innerWidth > 980) card.scrollIntoView({ block: "nearest", behavior: "smooth" });
    } else if (mapa && marcadores[id]) {
      if (window.innerWidth <= 980) $("mapa").scrollIntoView({ block: "center", behavior: "smooth" });
      mapa.setView([o.lat, o.lng], 12);
      cluster.zoomToShowLayer(marcadores[id], function () { marcadores[id].openPopup(); });
    }
  }

  /* ---------------- ficha (modal) ---------------- */
  var modal = $("modalOrg");
  modal.addEventListener("click", function (e) {
    if (e.target === modal) { modal.close(); return; }
    var cerrar = e.target.closest("[data-cerrar]");
    if (cerrar) { modal.close(); return; }
    var ver = e.target.closest("[data-ver]");
    if (ver) { abrirFicha(ver.getAttribute("data-ver")); return; }
    var enMapa = e.target.closest("[data-en-mapa]");
    if (enMapa) {
      modal.close();
      mostrarVista("mapa");
      var id = enMapa.getAttribute("data-en-mapa");
      if (!coincide(orgById(id))) $("btnLimpiar").click();
      seleccionar(id);
      return;
    }
    var contacto = e.target.closest("[data-contacto]");
    if (contacto) { toast("En el prototipo los contactos son ficticios: acá se abriría " + contacto.getAttribute("data-contacto") + "."); return; }
    var enviar = e.target.closest("[data-enviar-ficha]");
    if (enviar) { modal.close(); enviarFicha(); return; }
    var login = e.target.closest("[data-login]");
    if (login) { intentarIngreso(login.getAttribute("data-login")); return; }
    if (e.target.closest("[data-ir-acceso]")) {
      modal.close();
      mostrarVista("acceso");
      $("aEmail").value = emailRechazado;
      $("aNombre").focus();
    }
  });
  modal.addEventListener("submit", function (e) {
    var f = e.target.closest("[data-login-otra]");
    if (!f) return;
    e.preventDefault();
    intentarIngreso(f.elements.email.value);
  });

  function coincidencias(o) {
    var leSirven = [];
    var lesSirve = [];
    orgs.forEach(function (x) {
      if (x.id === o.id) return;
      var dan = (x.ofrece || []).filter(function (k) { return (o.necesita || []).indexOf(k) !== -1; })
        .map(function (k) { return RECURSOS[k]; }).concat(cruceOtros(o.necesitaOtros, x.ofreceOtros));
      var reciben = (x.necesita || []).filter(function (k) { return (o.ofrece || []).indexOf(k) !== -1; })
        .map(function (k) { return RECURSOS[k]; }).concat(cruceOtros(o.ofreceOtros, x.necesitaOtros));
      var cerca = x.provincia === o.provincia ? 0 : 1;
      if (dan.length) leSirven.push({ org: x, recursos: dan, cerca: cerca });
      if (reciben.length) lesSirve.push({ org: x, recursos: reciben, cerca: cerca });
    });
    function orden(a, b) { return a.cerca - b.cerca || b.recursos.length - a.recursos.length || a.org.nombre.localeCompare(b.org.nombre, "es"); }
    return { leSirven: leSirven.sort(orden).slice(0, 4), lesSirve: lesSirve.sort(orden).slice(0, 4) };
  }

  // coincidencias entre textos libres: "pañales" cruza con "Pañales talle M"
  function cruceOtros(a, b) {
    return (a || []).filter(function (t) {
      var nt = norm(t);
      return (b || []).some(function (u) { var nu = norm(u); return nt.indexOf(nu) !== -1 || nu.indexOf(nt) !== -1; });
    });
  }

  function listaMatches(items) {
    return '<ul class="matches">' + items.map(function (m) {
      return '<li><button type="button" data-ver="' + m.org.id + '">' + esc(m.org.nombre) + "</button> · " +
        esc(m.org.localidad) + (m.cerca ? ", " + esc(m.org.provincia) : "") + " — " +
        esc(m.recursos.join(", ")) + "</li>";
    }).join("") + "</ul>";
  }

  function detalleHtml(o, opts) {
    opts = opts || {};
    var ubic = o.mostrarDireccion === "exacta" && o.direccion
      ? esc(o.direccion) + ", " + esc(o.localidad)
      : "Zona de " + esc(o.localidad) + " (dirección reservada)";
    var html = '<button type="button" class="modal-close" data-cerrar aria-label="Cerrar">✕</button>';
    if (opts.preview) html += '<span class="preview-flag">Vista previa · así se verá en el mapa</span>';
    html += '<div class="det-head"><div class="org-icon" aria-hidden="true">' + TIPOS[o.tipo].icono + "</div>" +
      '<div><h2 id="modalOrgTitulo">' + esc(o.nombre || "Sin nombre") + "</h2>" +
      '<div class="org-meta">' + esc(TIPOS[o.tipo].label) + " · " + esc(o.localidad) + ", " + esc(o.provincia) + "</div></div></div>";
    html += "<p>" + esc(o.descripcion) + "</p>";
    html += '<dl class="det-grid">' +
      "<div><dt>Referente</dt><dd>" + esc(o.referente || "—") + "</dd></div>" +
      "<div><dt>Ubicación</dt><dd>" + ubic + "</dd></div>" +
      "<div><dt>Edades</dt><dd>" + esc(o.edades || "—") + "</dd></div>" +
      "<div><dt>Chicxs que acompañan</dt><dd>" + (o.chicos ? "≈ " + esc(o.chicos) : "—") + "</dd></div>" +
      "<div><dt>Días y horarios</dt><dd>" + esc(o.horarios || "—") + "</dd></div>" +
      "<div><dt>Ficha actualizada</dt><dd>" + fecha(o.actualizada || HOY) + "</dd></div>" +
      "</dl>";
    if ((o.necesita || []).length || (o.ofrece || []).length || (o.necesitaOtros || []).length || (o.ofreceOtros || []).length) {
      html += '<div class="det-sec"><h3>Necesitan y ofrecen</h3><div class="org-tags" style="margin:0">' + tagsHtml(o) + "</div></div>";
    }
    if (!opts.preview) {
      var c = coincidencias(o);
      if (c.leSirven.length) html += '<div class="det-sec"><h3>Quiénes pueden ayudarles</h3>' + listaMatches(c.leSirven) + "</div>";
      if (c.lesSirve.length) html += '<div class="det-sec"><h3>A quiénes pueden ayudar</h3>' + listaMatches(c.lesSirve) + "</div>";
      var suyos = avisos.filter(function (a) { return a.orgId === o.id; });
      if (suyos.length) {
        html += '<div class="det-sec"><h3>Sus avisos en el tablero</h3><ul class="matches">' + suyos.map(function (a) {
          return "<li><strong>" + esc(etiquetaAviso(a.tipo)) + ":</strong> " + esc(a.titulo) + "</li>";
        }).join("") + "</ul></div>";
      }
    }
    html += '<div class="det-sec"><h3>Contacto</h3>';
    if (rol === "visitante" && !opts.preview) {
      html += '<p class="card-text" style="margin:0">Los datos de contacto solo los ven las organizaciones de la red. Si sos parte de una, tocá <strong>“Ingresar”</strong> con tu cuenta habilitada.</p></div>';
    } else {
      html += '<p style="margin:0;font-size:.9rem">📞 ' + esc(o.telefono || "—") + (o.correo ? " · ✉️ " + esc(o.correo) : "") + (o.redes ? " · " + esc(o.redes) : "") + "</p></div>";
    }
    html += '<div class="det-actions">';
    if (opts.preview) {
      html += '<button type="button" class="btn btn-primary" data-enviar-ficha>Guardar y publicar</button>' +
        '<button type="button" class="btn" data-cerrar>Seguir editando</button>';
    } else {
      if (rol !== "visitante") {
        html += '<button type="button" class="btn btn-primary" data-contacto="WhatsApp">💬 WhatsApp</button>' +
          '<button type="button" class="btn" data-contacto="el correo">✉️ Escribir</button>';
      }
      html += '<button type="button" class="btn" data-en-mapa="' + o.id + '">📍 Ver en el mapa</button>';
    }
    html += "</div>";
    return html;
  }

  function mostrarModal(html) {
    $("modalOrgBody").innerHTML = html;
    if (!modal.open) modal.showModal();
    $("modalOrgBody").scrollTop = 0;
    modal.scrollTop = 0;
    var cerrar = modal.querySelector(".modal-close");
    if (cerrar) cerrar.focus();
  }
  function abrirFicha(id) {
    var o = orgById(id);
    if (o) mostrarModal(detalleHtml(o));
  }

  /* ---------------- tablero ---------------- */
  function etiquetaAviso(t) { return { necesita: "Necesitan", ofrece: "Ofrecen", convoca: "Convocatoria" }[t]; }

  function renderAvisos() {
    var ul = $("avisosList");
    var lista = avisos.filter(function (a) { return !avisoFiltro || a.tipo === avisoFiltro; })
      .sort(function (a, b) { return a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0; });
    if (!lista.length) { ul.innerHTML = '<li class="vacio">No hay avisos de este tipo por ahora.</li>'; renderStats(); return; }
    ul.innerHTML = lista.map(function (a) {
      var o = orgById(a.orgId);
      var propio = rol === "org" && a.orgId === sesion.orgId;
      var accion;
      if (rol === "coord") {
        accion = '<button type="button" class="btn btn-sm" data-cerrar-aviso="' + a.id + '">Quitar aviso</button>';
      } else if (propio) {
        accion = '<button type="button" class="btn btn-sm" data-cerrar-aviso="' + a.id + '">Cerrar aviso</button>';
      } else {
        var txt = a.tipo === "necesita" ? "Podemos ayudar" : a.tipo === "ofrece" ? "Nos interesa" : "Nos sumamos";
        var hecho = yaRespondidos[a.id];
        accion = '<button type="button" class="btn btn-sm ' + (hecho ? "" : "btn-primary") + '" data-responder="' + a.id + '"' + (hecho ? " disabled" : "") + ">" +
          (hecho ? "✓ Avisado" : txt) + "</button>";
      }
      return '<li class="aviso aviso--' + a.tipo + (a.nuevo ? " is-new" : "") + '">' +
        '<div class="aviso-top"><span class="aviso-kind">' + etiquetaAviso(a.tipo) + '</span><span class="tag tag--neutral">' + esc(RECURSOS[a.recurso]) + "</span>" +
        (propio ? '<span class="tag tag--ofrece">Tu aviso</span>' : "") +
        '<span class="aviso-fecha">' + fecha(a.fecha) + "</span></div>" +
        "<h3>" + esc(a.titulo) + "</h3>" +
        (a.detalle ? "<p>" + esc(a.detalle) + "</p>" : "") +
        '<div class="aviso-foot"><span class="aviso-org">' +
        (o ? '<button type="button" data-ver="' + o.id + '">' + esc(o.nombre) + "</button> · " + esc(o.localidad) : "") +
        '</span><span class="aviso-actions"><span class="aviso-int">' + (a.interesados ? plural(a.interesados, "organización respondió", "organizaciones respondieron") : "") + "</span>" + accion + "</span></div>" +
        "</li>";
    }).join("");
    avisos.forEach(function (a) { delete a.nuevo; });
    renderStats();
  }

  function initTablero() {
    var sel = $("avRecurso");
    Object.keys(RECURSOS).forEach(function (k) {
      sel.insertAdjacentHTML("beforeend", '<option value="' + k + '">' + esc(RECURSOS[k]) + "</option>");
    });
    document.querySelectorAll("[data-av-filtro]").forEach(function (b) {
      b.addEventListener("click", function () {
        avisoFiltro = b.getAttribute("data-av-filtro");
        document.querySelectorAll("[data-av-filtro]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        renderAvisos();
      });
    });
    $("avisosList").addEventListener("click", function (e) {
      var ver = e.target.closest("[data-ver]");
      if (ver) { abrirFicha(ver.getAttribute("data-ver")); return; }
      var cerrar = e.target.closest("[data-cerrar-aviso]");
      if (cerrar) {
        var idc = cerrar.getAttribute("data-cerrar-aviso");
        avisos = avisos.filter(function (a) { return a.id !== idc; });
        renderAvisos();
        toast(rol === "coord" ? "La coordinación quitó el aviso del tablero." : "Cerraste el aviso. ¡Ojalá se haya resuelto!");
        return;
      }
      var resp = e.target.closest("[data-responder]");
      if (!resp) return;
      if (rol === "visitante") { toast("Para responder avisos tenés que ingresar con una cuenta habilitada."); return; }
      var id = resp.getAttribute("data-responder");
      var a = avisos.filter(function (x) { return x.id === id; })[0];
      var o = orgById(a.orgId);
      a.interesados = (a.interesados || 0) + 1;
      yaRespondidos[id] = true;
      renderAvisos();
      var quien = rol === "org" ? miOrg().nombre : "La coordinación";
      toast("Le avisamos a " + (o ? o.nombre : "la organización") + " que " + quien + " quiere ponerse en contacto.");
    });
    $("formAviso").addEventListener("submit", function (e) {
      e.preventDefault();
      var titulo = $("avTitulo").value.trim();
      if (!titulo) { $("avTitulo").setAttribute("aria-invalid", "true"); $("avTitulo").focus(); return; }
      $("avTitulo").removeAttribute("aria-invalid");
      var tipo = this.querySelector('input[name="avTipo"]:checked').value;
      avisos.push({
        id: "av-" + Date.now(), orgId: sesion.orgId, tipo: tipo, recurso: $("avRecurso").value,
        fecha: HOY, titulo: titulo, detalle: $("avDetalle").value.trim(), interesados: 0, nuevo: true,
      });
      this.reset();
      avisoFiltro = "";
      document.querySelectorAll("[data-av-filtro]").forEach(function (x) { x.setAttribute("aria-pressed", x.getAttribute("data-av-filtro") === "" ? "true" : "false"); });
      renderAvisos();
      toast("¡Publicado! Las organizaciones de la red ya lo pueden ver.");
    });
  }

  /* ---------------- ficha: alta / mi organización ---------------- */
  var mapaFicha = null;
  var pinFicha = null;
  var fichaPos = null;

  function initFormFicha() {
    var selTipo = $("oTipo");
    selTipo.innerHTML = '<option value="">Elegí…</option>';
    Object.keys(TIPOS).forEach(function (k) {
      selTipo.insertAdjacentHTML("beforeend", '<option value="' + k + '">' + TIPOS[k].icono + " " + esc(TIPOS[k].label) + "</option>");
    });
    var selLoc = $("oLocalidad");
    selLoc.innerHTML = '<option value="">Elegí…</option>';
    window.RED_PROVINCIAS.forEach(function (p) {
      var opts = Object.keys(LOCALIDADES).filter(function (l) { return LOCALIDADES[l].prov === p; }).sort();
      selLoc.insertAdjacentHTML("beforeend", '<optgroup label="' + esc(p) + '">' + opts.map(function (l) {
        return '<option value="' + esc(l) + '">' + esc(l) + "</option>";
      }).join("") + "</optgroup>");
    });
    ["oNecesita", "oOfrece"].forEach(function (id) {
      var name = id === "oNecesita" ? "necesita" : "ofrece";
      $(id).innerHTML = Object.keys(RECURSOS).map(function (k) {
        return '<label><input type="checkbox" name="' + name + '" value="' + k + '"><span>' + esc(RECURSOS[k]) + "</span></label>";
      }).join("");
    });
    selLoc.addEventListener("change", function () {
      var l = LOCALIDADES[this.value];
      if (!l) return;
      fichaPos = { lat: l.lat, lng: l.lng };
      if (mapaFicha) { mapaFicha.setView([l.lat, l.lng], 13); moverPinFicha(); }
    });
    $("formFicha").addEventListener("submit", function (e) { e.preventDefault(); enviarFicha(); });
    $("btnVistaPrevia").addEventListener("click", function () {
      var d = leerFicha();
      if (!validarFicha(d)) return;
      mostrarModal(detalleHtml(d, { preview: true }));
    });
    $("formFicha").addEventListener("input", function (e) {
      if (e.target.getAttribute("aria-invalid")) e.target.removeAttribute("aria-invalid");
    });
  }

  function initMapaFicha() {
    if (typeof L === "undefined") return;
    if (!mapaFicha) {
      mapaFicha = L.map("mapaFicha", { scrollWheelZoom: false });
      L.tileLayer(TILE_URL, { attribution: TILE_ATTR, minZoom: 3, maxZoom: 18 }).addTo(mapaFicha);
      mapaFicha.on("click", function (e) {
        fichaPos = { lat: +e.latlng.lat.toFixed(5), lng: +e.latlng.lng.toFixed(5) };
        moverPinFicha();
        $("mapaFichaHint").textContent = "Punto marcado. Podés tocar de nuevo para corregirlo.";
      });
    }
    setTimeout(function () {
      mapaFicha.invalidateSize();
      if (fichaPos) mapaFicha.setView([fichaPos.lat, fichaPos.lng], 13);
      else mapaFicha.setView([-35.5, -63.5], 4);
      moverPinFicha();
    }, 0);
  }

  function moverPinFicha() {
    if (!mapaFicha) return;
    if (!fichaPos) { if (pinFicha) { mapaFicha.removeLayer(pinFicha); pinFicha = null; } return; }
    var tipo = $("oTipo").value || "hogar";
    var icon = iconoPin({ tipo: tipo }, true);
    if (!pinFicha) pinFicha = L.marker([fichaPos.lat, fichaPos.lng], { icon: icon, keyboard: false }).addTo(mapaFicha);
    else pinFicha.setLatLng([fichaPos.lat, fichaPos.lng]).setIcon(icon);
  }
  $("oTipo") && $("oTipo").addEventListener("change", moverPinFicha);

  function set(id, v) { $(id).value = v == null ? "" : v; }

  function cargarFicha() {
    var f = $("formFicha");
    var o = miOrg();
    if (!o) return;
    f.reset();
    f.querySelectorAll("[aria-invalid]").forEach(function (x) { x.removeAttribute("aria-invalid"); });
    $("fichaError").hidden = true;
    $("fichaTitulo").textContent = o.nombre;
    set("oNombre", o.nombre); set("oTipo", o.tipo); set("oReferente", o.referente);
    set("oDescripcion", o.descripcion); set("oEdades", o.edades); set("oChicos", o.chicos);
    set("oHorarios", o.horarios); set("oLocalidad", o.localidad); set("oDireccion", o.direccion);
    set("oTelefono", o.telefono); set("oCorreo", o.correo); set("oRedes", o.redes);
    f.querySelector('input[name="oVisibilidad"][value="' + (o.mostrarDireccion === "exacta" ? "exacta" : "zona") + '"]').checked = true;
    f.querySelectorAll('input[name="necesita"]').forEach(function (c) { c.checked = (o.necesita || []).indexOf(c.value) !== -1; });
    f.querySelectorAll('input[name="ofrece"]').forEach(function (c) { c.checked = (o.ofrece || []).indexOf(c.value) !== -1; });
    set("oNecesitaOtros", (o.necesitaOtros || []).join(", "));
    set("oOfreceOtros", (o.ofreceOtros || []).join(", "));
    fichaPos = { lat: o.lat, lng: o.lng };
    var estado = $("fichaEstado");
    estado.hidden = false;
    estado.innerHTML = "✅ Tu ficha está <strong>publicada</strong> en el mapa. Última actualización: " + fecha(o.actualizada) +
      ". Estás editando con <strong>" + esc(sesion.email) + "</strong>.";
    $("mapaFichaHint").textContent = "Elegí la localidad y después tocá el mapa para ajustar el punto.";
    moverPinFicha();
  }

  function leerFicha() {
    var f = $("formFicha");
    var loc = $("oLocalidad").value;
    var base = miOrg() || {};
    var pos = fichaPos || (LOCALIDADES[loc] ? { lat: LOCALIDADES[loc].lat, lng: LOCALIDADES[loc].lng } : { lat: null, lng: null });
    return {
      id: base.id || null,
      nombre: $("oNombre").value.trim(),
      tipo: $("oTipo").value,
      referente: $("oReferente").value.trim(),
      descripcion: $("oDescripcion").value.trim(),
      edades: $("oEdades").value.trim(),
      chicos: $("oChicos").value ? +$("oChicos").value : "",
      horarios: $("oHorarios").value.trim(),
      localidad: loc,
      provincia: LOCALIDADES[loc] ? LOCALIDADES[loc].prov : "",
      direccion: $("oDireccion").value.trim(),
      mostrarDireccion: f.querySelector('input[name="oVisibilidad"]:checked').value,
      lat: pos.lat, lng: pos.lng,
      necesita: Array.prototype.map.call(f.querySelectorAll('input[name="necesita"]:checked'), function (c) { return c.value; }),
      ofrece: Array.prototype.map.call(f.querySelectorAll('input[name="ofrece"]:checked'), function (c) { return c.value; }),
      necesitaOtros: separarOtros($("oNecesitaOtros").value),
      ofreceOtros: separarOtros($("oOfreceOtros").value),
      telefono: $("oTelefono").value.trim(),
      correo: $("oCorreo").value.trim(),
      redes: $("oRedes").value.trim(),
      actualizada: HOY,
    };
  }

  function validarFicha(d) {
    var faltan = [];
    [["oNombre", d.nombre], ["oTipo", d.tipo], ["oReferente", d.referente], ["oDescripcion", d.descripcion],
      ["oLocalidad", d.localidad], ["oTelefono", d.telefono]].forEach(function (p) {
      if (!p[1]) { $(p[0]).setAttribute("aria-invalid", "true"); faltan.push(p[0]); }
      else $(p[0]).removeAttribute("aria-invalid");
    });
    var err = $("fichaError");
    if (faltan.length) {
      err.textContent = "Completá los campos marcados con * (" + faltan.length + " sin completar).";
      err.hidden = false;
      $(faltan[0]).focus();
      return false;
    }
    err.hidden = true;
    return true;
  }

  function enviarFicha() {
    var o = miOrg();
    if (rol !== "org" || !o) return;
    var d = leerFicha();
    if (!validarFicha(d)) return;
    if (!diferencias(o, d).length) { toast("No hay cambios para guardar."); return; }
    Object.keys(d).forEach(function (k) { if (k !== "id") o[k] = d[k]; });
    o.actualizada = HOY;
    construirMarcadores();
    aplicarFiltros();
    renderStats();
    window.CDPSesion.guardar(datosSesion());
    renderSesion();
    cargarFicha();
    window.scrollTo(0, 0);
    toast("¡Listo! Los cambios ya se ven en el mapa.");
  }

  function diferencias(a, b) {
    return Object.keys(CAMPOS_LABEL).filter(function (k) {
      if (k === "lat") return Math.abs((a.lat || 0) - (b.lat || 0)) > 1e-5 || Math.abs((a.lng || 0) - (b.lng || 0)) > 1e-5;
      var x = a[k], y = b[k];
      if (Array.isArray(x) || Array.isArray(y)) return (x || []).slice().sort().join() !== (y || []).slice().sort().join();
      return String(x == null ? "" : x) !== String(y == null ? "" : y);
    });
  }

  /* ---------------- solicitar acceso (visitantes) ---------------- */
  function initAcceso() {
    $("aTipo").innerHTML = $("oTipo").innerHTML;
    $("aLocalidad").innerHTML = $("oLocalidad").innerHTML;
    $("formAcceso").addEventListener("input", function (e) {
      if (e.target.getAttribute("aria-invalid")) e.target.removeAttribute("aria-invalid");
    });
    $("formAcceso").addEventListener("submit", function (e) {
      e.preventDefault();
      var d = {
        nombre: $("aNombre").value.trim(), tipo: $("aTipo").value, localidad: $("aLocalidad").value,
        referente: $("aReferente").value.trim(), email: $("aEmail").value.trim().toLowerCase(),
        mensaje: $("aMensaje").value.trim(),
      };
      var faltan = [];
      [["aNombre", d.nombre], ["aTipo", d.tipo], ["aLocalidad", d.localidad], ["aReferente", d.referente],
        ["aEmail", emailValido(d.email)]].forEach(function (p) {
        if (!p[1]) { $(p[0]).setAttribute("aria-invalid", "true"); faltan.push(p[0]); }
        else $(p[0]).removeAttribute("aria-invalid");
      });
      var err = $("accesoError");
      if (faltan.length) {
        err.textContent = "Completá los campos marcados con * (revisá también que el mail sea válido).";
        err.hidden = false;
        $(faltan[0]).focus();
        return;
      }
      err.hidden = true;
      if (usuarioPorEmail(d.email)) {
        err.textContent = "Ese mail ya está habilitado: tocá “Ingresar” arriba a la derecha.";
        err.hidden = false;
        return;
      }
      solicitudes.push({
        id: "sol-" + Date.now(), email: d.email, mensaje: d.mensaje, fecha: HOY,
        datos: { nombre: d.nombre, tipo: d.tipo, localidad: d.localidad, provincia: LOCALIDADES[d.localidad].prov,
          referente: d.referente, descripcion: "" },
      });
      ultimoPedido = d.nombre;
      this.reset();
      var estado = $("accesoEstado");
      estado.hidden = false;
      estado.innerHTML = "📨 Recibimos el pedido de <strong>" + esc(ultimoPedido) + "</strong>. Cuando la coordinación lo apruebe, vas a poder ingresar con <strong>" + esc(d.email) + "</strong>.";
      renderCoordinacion();
      toast("¡Gracias! La coordinación va a revisar tu pedido.");
    });
  }

  /* ---------------- coordinación ---------------- */
  function renderCoordinacion() {
    renderSolicitudes();
    renderCuentas();
    renderStats();
  }

  function renderSolicitudes() {
    var ul = $("solicitudesList");
    $("solicitudesVacio").hidden = solicitudes.length > 0;
    ul.innerHTML = solicitudes.map(function (s) {
      var d = s.datos;
      return '<li class="card solicitud">' +
        '<div class="org-tags" style="margin:0"><span class="tag tag--ofrece">Pedido de acceso</span><span class="tag tag--neutral">' + fecha(s.fecha) + "</span></div>" +
        "<h3>" + TIPOS[d.tipo].icono + " " + esc(d.nombre) + "</h3>" +
        '<p class="org-meta">' + esc(TIPOS[d.tipo].label) + " · " + esc(d.localidad) + ", " + esc(d.provincia) + " · Referente: " + esc(d.referente) + "</p>" +
        '<p class="pedido-mail">Cuenta a habilitar: <strong>' + esc(s.email) + "</strong></p>" +
        (s.mensaje ? "<blockquote>" + esc(s.mensaje) + "</blockquote>" : "") +
        '<div class="solicitud-actions">' +
        '<button type="button" class="btn btn-sm btn-primary" data-aprobar="' + s.id + '">Aprobar y habilitar</button>' +
        '<button type="button" class="btn btn-sm" data-rechazar="' + s.id + '">Rechazar</button>' +
        "</div></li>";
    }).join("");
  }

  function renderCuentas() {
    var q = norm($("cuentasBuscar").value);
    var lista = orgs.slice().sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); });
    $("cuentasBody").innerHTML = lista.map(function (o) {
      var mails = usuarios.filter(function (u) { return u.rol === "org" && u.orgId === o.id; });
      if (q && norm(o.nombre + " " + o.localidad + " " + mails.map(function (u) { return u.email; }).join(" ")).indexOf(q) === -1) return "";
      return "<tr><td><strong>" + esc(o.nombre) + '</strong><span class="org-meta">' + esc(o.localidad) + ", " + esc(o.provincia) + "</span></td>" +
        '<td><div class="mails">' +
        (mails.length ? mails.map(function (u) {
          return '<span class="mail">' + esc(u.email) + '<button type="button" data-quitar-mail="' + esc(u.email) + '" aria-label="Quitar ' + esc(u.email) + '">✕</button></span>';
        }).join("") : '<span class="sin-cuentas">Sin cuentas: nadie puede editarla</span>') +
        '<form class="mail-add" data-agregar-mail="' + o.id + '" novalidate><input type="email" name="email" placeholder="Agregar mail…" aria-label="Agregar mail a ' + esc(o.nombre) + '">' +
        '<button type="submit" class="btn btn-sm">Agregar</button></form></div></td>' +
        '<td><button type="button" class="btn btn-sm" data-baja="' + o.id + '">Quitar del mapa</button></td></tr>';
    }).join("") || '<tr><td colspan="3" class="vacio">No hay organizaciones que coincidan.</td></tr>';
    $("cuentasCoord").innerHTML = usuarios.filter(function (u) { return u.rol === "coord"; }).map(function (u) {
      return '<span class="mail mail--solo">' + esc(u.email) + "</span>";
    }).join("");
  }

  $("cuentasBuscar").addEventListener("input", renderCuentas);

  $("solicitudesList").addEventListener("click", function (e) {
    var b = e.target.closest("[data-aprobar],[data-rechazar]");
    if (!b) return;
    var id = b.getAttribute("data-aprobar") || b.getAttribute("data-rechazar");
    var s = solicitudes.filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    solicitudes = solicitudes.filter(function (x) { return x !== s; });
    if (b.hasAttribute("data-aprobar")) {
      var d = s.datos;
      var loc = LOCALIDADES[d.localidad];
      nOrg += 1;
      var nueva = Object.assign({
        edades: "", chicos: "", horarios: "", direccion: "", redes: "", telefono: "", necesita: [], ofrece: [], necesitaOtros: [], ofreceOtros: [],
        lat: +(loc.lat + Math.sin(nOrg) * 0.015).toFixed(5), lng: +(loc.lng + Math.cos(nOrg) * 0.02).toFixed(5),
        mostrarDireccion: "zona",
      }, clone(d), { id: "org-" + nOrg, estado: "aprobada", actualizada: HOY, correo: d.correo || s.email });
      if (!nueva.descripcion) nueva.descripcion = "Ficha en preparación: la organización todavía no completó su información.";
      orgs.push(nueva);
      if (!usuarioPorEmail(s.email)) usuarios.push({ email: s.email, nombre: d.referente, rol: "org", orgId: nueva.id });
      construirMarcadores();
      aplicarFiltros();
      toast("Aprobada: " + nueva.nombre + " ya está en el mapa y " + s.email + " puede ingresar.");
    } else {
      toast("Pedido rechazado. Se le avisará a " + s.email + " por correo.");
    }
    renderCoordinacion();
  });

  $("cuentasBody").addEventListener("click", function (e) {
    var quitar = e.target.closest("[data-quitar-mail]");
    if (quitar) {
      var email = quitar.getAttribute("data-quitar-mail");
      usuarios = usuarios.filter(function (u) { return u.email !== email; });
      renderCuentas();
      toast(email + " ya no puede ingresar como organización.");
      return;
    }
    var baja = e.target.closest("[data-baja]");
    if (baja) {
      var o = orgById(baja.getAttribute("data-baja"));
      if (!o || !window.confirm("¿Quitar “" + o.nombre + "” del mapa? También se desactivan sus cuentas y sus avisos.")) return;
      orgs = orgs.filter(function (x) { return x !== o; });
      usuarios = usuarios.filter(function (u) { return u.orgId !== o.id; });
      avisos = avisos.filter(function (a) { return a.orgId !== o.id; });
      if (seleccionId === o.id) seleccionId = null;
      construirMarcadores();
      aplicarFiltros();
      renderAvisos();
      renderCoordinacion();
      toast(o.nombre + " se quitó del mapa.");
    }
  });

  $("cuentasBody").addEventListener("submit", function (e) {
    var f = e.target.closest("[data-agregar-mail]");
    if (!f) return;
    e.preventDefault();
    var email = f.elements.email.value.trim().toLowerCase();
    if (!emailValido(email)) { toast("Escribí un mail válido."); f.elements.email.focus(); return; }
    var ya = usuarioPorEmail(email);
    if (ya) {
      toast(ya.rol === "coord" ? "Ese mail es de la coordinación." : "Ese mail ya está habilitado para " + (orgById(ya.orgId) || { nombre: "otra organización" }).nombre + ".");
      return;
    }
    var o = orgById(f.getAttribute("data-agregar-mail"));
    usuarios.push({ email: email, nombre: o.referente || o.nombre, rol: "org", orgId: o.id });
    renderCuentas();
    toast(email + " ahora puede ingresar como " + o.nombre + ".");
  });

  /* ---------------- arranque ---------------- */
  initFiltros();
  initTablero();
  initFormFicha();
  initAcceso();
  initMapa();
  construirMarcadores();
  aplicarFiltros(true);
  aplicarRol();
  renderStats();
  retomarSesion();
  var inicial = location.hash.replace("#", "");
  mostrarVista(VISTAS.indexOf(inicial) !== -1 ? inicial : "mapa", true);
  if (inicial === "ingresar") {
    history.replaceState(null, "", location.pathname);
    if (!sesion) abrirIngreso();
  }
})();
