/* ==========================================================
   Mapa de la red — lógica del prototipo (todo en memoria)
   ========================================================== */
(function () {
  "use strict";

  var TIPOS = window.RED_TIPOS;
  var CONVOCATORIAS = window.RED_CONVOCATORIAS;
  // opciones del cuestionario de la red
  var PERSONERIAS = window.RED_PERSONERIAS, ACTIVIDADES = window.RED_ACTIVIDADES, ALCANCES = window.RED_ALCANCES;
  var REDES = window.RED_REDES, ESPACIOS = window.RED_ESPACIOS, SUELDOS = window.RED_SUELDOS;
  var FONDOS_PUBLICOS = window.RED_FONDOS_PUBLICOS, FONDOS_PRIVADOS = window.RED_FONDOS_PRIVADOS;
  var LOC_AR = window.RED_LOC_AR;   // localidades oficiales por provincia (js/red-localidades.js)
  var INDICE_LOC = {};              // "provincia|nombre sin tildes" -> [nombre, lat, lng]
  var HOY = "2026-09-25";
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var CAMPOS_LABEL = {
    nombre: "Nombre", provincia: "Provincia", tipos: "Tipos", tipoOtro: "Tipo (otro)", personeria: "Personería", personeriaDetalle: "Personería (detalle)",
    referente: "Referente", referenteRol: "Rol del referente", descripcion: "Descripción", horarios: "Horarios",
    actividades: "Actividades", actividadesOtras: "Otras actividades", participantes: "Personas que participan",
    alcance: "Alcance", educadorxs: "Educadorxs", whatsappPublico: "Quién ve el WhatsApp", localidad: "Localidad",
    actividadesNuevas: "Actividades nuevas", actividadesBaja: "Actividades dadas de baja", espacio: "Espacio físico",
    espacioInfo: "Espacio (detalle)", sueldos: "Sueldos", sueldosInfo: "Sueldos (detalle)", fondosPublicos: "Fondos públicos",
    fondosPublicosDetalle: "Fondos públicos (detalle)", fondosPrivados: "Fondos privados", fondosPrivadosDetalle: "Fondos privados (detalle)",
    direccion: "Dirección", ubicacionPublica: "Ubicación para visitantes", ubicacionRed: "Ubicación para la red", lat: "Ubicación en el mapa",
    telefono: "Teléfono", correo: "Correo", redes: "Redes",
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
  var ordenAvisos = "cerca";   // para organizaciones: por cercanía (por defecto) o por fecha
  var avisosAbiertos = {};   // avisos con la lista completa de respuestas desplegada
  var ultimoPedido = null;       // nombre de la organización del último pedido enviado
  var emailRechazado = "";       // cuenta no habilitada con la que se intentó ingresar
  var nOrg = 1000;
  var filtro = { q: "", prov: "", tipos: {} };

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
  Object.keys(LOC_AR).forEach(function (p) {
    LOC_AR[p].l.forEach(function (l) { INDICE_LOC[p + "|" + norm(l[0])] = l; });
  });
  function localidadOficial(prov, nombre) { return INDICE_LOC[prov + "|" + norm(String(nombre || "").trim())] || null; }
  // centro de una localidad; null si es una que escribieron a mano y no está en la lista
  function centroLocalidad(prov, nombre) {
    var l = localidadOficial(prov, nombre);
    return l ? { lat: l[1], lng: l[2] } : null;
  }
  function llenarLocalidades(idLista, prov) {
    $(idLista).innerHTML = (LOC_AR[prov] ? LOC_AR[prov].l : []).map(function (l) { return '<option value="' + esc(l[0]) + '"></option>'; }).join("");
  }
  // lo que no estaba en la encuesta y se completó a mano figura en o.inventados
  function marcaInventado(o, campo) {
    return (o.inventados || []).indexOf(campo) !== -1 ? ' <span class="inventado" title="Dato inventado: no estaba en la encuesta">inventado</span>' : "";
  }
  function marcaFicticia(o) {
    return o.ficticia ? ' <span class="inventado" title="Organización de ejemplo: no es real">ficticia</span>' : "";
  }
  function fecha(iso) {
    var p = String(iso).split("-");
    return +p[2] + " " + MESES[+p[1] - 1];
  }
  // una organización puede ser de varios tipos; el ícono del mapa es el del primero
  function tipoLabel(o) {
    return (o.tipos || []).map(function (k) { return k === "otro" && o.tipoOtro ? o.tipoOtro : (TIPOS[k] || TIPOS.otro).label; }).join(", ");
  }
  function tipoIcono(o) { return (TIPOS[(o.tipos || [])[0]] || TIPOS.otro).icono; }
  function totalPersonas(p) { p = p || {}; return (+p.ninxs || 0) + (+p.jovenes || 0) + (+p.adultxs || 0); }
  // los datos internos del cuestionario los ve toda cuenta de la red que ingresó (organizaciones y coordinación), nunca los visitantes
  function veDatosRed() { return rol !== "visitante"; }
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
  var VISTAS = ["mapa", "agenda", "ficha", "acceso", "coord"];
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
    if (v === "agenda") initMapaAviso();
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
    else limpiarPinAviso();
    construirMarcadores();
    aplicarFiltros();
    renderAvisos();
    renderCoordinacion();
    var boton = document.querySelector('.nav-vista[data-vista="' + vista + '"]');
    if (!boton || boton.hidden) mostrarVista("mapa");
    else if (vista === "ficha") initMapaFicha();
    else if (vista === "agenda") initMapaAviso();
  }

  /* ---------------- estadísticas ---------------- */
  function renderStats() {
    var provs = {};
    var chicos = 0;
    orgs.forEach(function (o) { provs[o.provincia] = 1; chicos += (+(o.participantes || {}).ninxs || 0) + (+(o.participantes || {}).jovenes || 0); });
    $("statOrgs").textContent = orgs.length;
    $("statProv").textContent = Object.keys(provs).length;
    $("statChicos").textContent = chicos.toLocaleString("es-AR");
    $("statAvisos").textContent = avisos.length;
    $("cuentaAvisos").textContent = avisos.length;
    window.CDPSesion.guardarCuentaAvisos(avisos.length);
    $("cuentaPendientes").textContent = solicitudes.length || "";
    $("cuentaPedidos").textContent = solicitudes.length || "";
  }

  /* ---------------- filtros ---------------- */
  function initFiltros() {
    var selProv = $("fProvincia");
    window.RED_PROVINCIAS.forEach(function (p) {
      selProv.insertAdjacentHTML("beforeend", '<option value="' + esc(p) + '">' + esc(p) + "</option>");
    });

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
    $("btnLimpiar").addEventListener("click", function () {
      filtro = { q: "", prov: "", tipos: {} };
      $("fBuscar").value = ""; selProv.value = "";
      box.querySelectorAll("[data-tipo]").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      aplicarFiltros(true);
    });
  }

  function coincide(o) {
    if (filtro.prov && o.provincia !== filtro.prov) return false;
    var tiposOn = Object.keys(filtro.tipos);
    if (tiposOn.length && !(o.tipos || []).some(function (k) { return filtro.tipos[k]; })) return false;
    if (filtro.q) {
      var blob = norm([o.nombre, o.localidad, o.provincia, o.descripcion, rol !== "visitante" ? o.referente : "", tipoLabel(o),
        (o.actividades || []).map(function (k) { return ACTIVIDADES[k]; }).join(" "), o.actividadesOtras || ""].join(" "));
      var palabras = norm(filtro.q).split(/\s+/).filter(Boolean);
      for (var i = 0; i < palabras.length; i++) if (blob.indexOf(palabras[i]) === -1) return false;
    }
    return true;
  }

  function hayFiltros() {
    return !!(filtro.q || filtro.prov || Object.keys(filtro.tipos).length);
  }

  function aplicarFiltros(reencuadrar) {
    var visibles = orgs.filter(coincide).sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); });
    renderLista(visibles);
    actualizarMarcadores(visibles, reencuadrar);
    $("btnLimpiar").hidden = !hayFiltros();
  }

  /* ---------------- listado ---------------- */
  function renderLista(lista) {
    $("listCount").textContent = plural(lista.length, "organización", "organizaciones");
    var ul = $("orgList");
    if (!lista.length) {
      ul.innerHTML = '<li class="vacio">No encontramos organizaciones con esos filtros.</li>';
      return;
    }
    ul.innerHTML = lista.map(function (o) {
      return '<li class="org-card' + (o.id === seleccionId ? " is-selected" : "") + '" data-id="' + o.id + '">' +
        '<div class="org-icon" aria-hidden="true">' + tipoIcono(o) + "</div>" +
        '<h3><button type="button" data-ver="' + o.id + '">' + esc(o.nombre) + "</button></h3>" +
        '<div class="org-meta">' + esc(tipoLabel(o)) + " · " + esc(o.localidad) + ", " + esc(o.provincia) + marcaFicticia(o) + "</div>" +
        (o.descripcion ? '<p class="org-desc">' + esc(o.descripcion) + marcaInventado(o, "descripcion") + "</p>" : "") +
        '<div class="org-actions">' +
        '<button type="button" class="btn btn-sm btn-primary" data-ver="' + o.id + '" aria-label="Ver ficha de ' + esc(o.nombre) + '">Ver ficha</button>' +
        '<button type="button" class="btn btn-sm" data-en-mapa-lista="' + o.id + '" aria-label="Ver ' + esc(o.nombre) + ' en el mapa">📍 En el mapa</button>' +
        "</div>" +
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
      html: '<div class="pin' + (sel ? " is-selected" : "") + '"><span>' + tipoIcono(o) + "</span></div>",
      iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -32],
    });
  }

  function popupHtml(o) {
    return '<p class="popup-title">' + esc(o.nombre) + "</p>" +
      '<p class="popup-meta">' + esc(tipoLabel(o)) + " · " + esc(o.localidad) + marcaFicticia(o) + "</p>" +
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

    // Easter egg: un punto propio sobre las Islas Malvinas, fuera del listado, los filtros y los grupos
    L.marker([-51.75, -59.2], {
      icon: L.divIcon({ className: "", html: '<div class="pin-malvinas"><span></span></div>', iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -12] }),
      title: "Islas Malvinas", alt: "Islas Malvinas", keyboard: true, zIndexOffset: -100,
    }).bindPopup('<p class="popup-malvinas">Las Malvinas son argentinas</p>').addTo(mapa);
    $("mapa").addEventListener("click", function (e) {
      var b = e.target.closest("[data-ver]");
      if (b) abrirFicha(b.getAttribute("data-ver"));
    });
  }

  function construirMarcadores() {
    if (!mapa) return;
    marcadores = {};
    orgs.forEach(function (o) {
      var pv = posVisible(o);
      var m = L.marker([pv.lat, pv.lng], { icon: iconoPin(o, o.id === seleccionId), title: o.nombre, alt: o.nombre, keyboard: true });
      m.bindPopup(popupHtml(o));
      m.on("click", function () { seleccionar(o.id, { desdeMapa: true }); });
      marcadores[o.id] = m;
    });
  }

  // ¿quien está mirando puede ver la dirección exacta de esta organización?
  // (en la versión real lo decide el servidor: a quien no puede verla no le manda las coordenadas)
  function veExacta(o) {
    if (rol === "coord") return true;
    if (rol === "org" && sesion && o.id === sesion.orgId) return true;
    return (rol === "org" ? o.ubicacionRed : o.ubicacionPublica) === "exacta";
  }
  // si no puede verla, el punto se corre al centro de su localidad (con un pequeño desplazamiento propio)
  function posVisible(o) {
    if (veExacta(o)) return { lat: o.lat, lng: o.lng };
    // si la localidad no está en la lista, se redondea el punto para no revelar dónde está la casa
    var loc = centroLocalidad(o.provincia, o.localidad) || { lat: Math.round(o.lat * 50) / 50, lng: Math.round(o.lng * 50) / 50 };
    var h = 0;
    String(o.id).split("").forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) % 997; });
    return { lat: +(loc.lat + Math.sin(h) * 0.012).toFixed(5), lng: +(loc.lng + Math.cos(h) * 0.015).toFixed(5) };
  }

  function actualizarMarcadores(visibles, reencuadrar) {
    if (!mapa) return;
    cluster.clearLayers();
    zonas.clearLayers();
    cluster.addLayers(visibles.map(function (o) { return marcadores[o.id]; }).filter(Boolean));
    visibles.forEach(function (o) {
      if (!veExacta(o)) {
        var p = posVisible(o);
        L.circle([p.lat, p.lng], { radius: 1500, color: "#13739F", weight: 1.5, dashArray: "4 4", fillColor: "#63C2EB", fillOpacity: .18, interactive: false }).addTo(zonas);
      }
    });
    if (reencuadrar) encuadrar(visibles);
  }

  function encuadrar(lista) {
    if (!mapa || !lista.length) return;
    var b = L.latLngBounds(lista.map(function (o) { var p = posVisible(o); return [p.lat, p.lng]; }));
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
      var pv = posVisible(o);
      mapa.setView([pv.lat, pv.lng], 12);
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
    if (contacto) { toast("En el prototipo no se abre nada: acá se abriría " + contacto.getAttribute("data-contacto") + "."); return; }
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

  function detalleHtml(o, opts) {
    opts = opts || {};
    var ubic;
    if (opts.preview) {
      var txt = { zona: "solo la zona", exacta: "la dirección exacta" };
      ubic = (o.direccion ? esc(o.direccion) + ", " : "") + esc(o.localidad) +
        "<br><small>Visitantes ven " + txt[o.ubicacionPublica] + "; la red ve " + txt[o.ubicacionRed] + ".</small>";
    } else if (veExacta(o) && o.direccion) {
      ubic = esc(o.direccion) + ", " + esc(o.localidad);
    } else if (rol === "visitante" && o.ubicacionRed === "exacta") {
      ubic = "Zona de " + esc(o.localidad) + "<br><small>La dirección la ven solo las organizaciones de la red.</small>";
    } else {
      ubic = "Zona de " + esc(o.localidad) + " (dirección reservada)";
    }
    var html = '<button type="button" class="modal-close" data-cerrar aria-label="Cerrar">✕</button>';
    if (opts.preview) html += '<span class="preview-flag">Vista previa · así se verá en el mapa</span>';
    html += '<div class="det-head"><div class="org-icon" aria-hidden="true">' + tipoIcono(o) + "</div>" +
      '<div><h2 id="modalOrgTitulo">' + esc(o.nombre || "Sin nombre") + "</h2>" +
      '<div class="org-meta">' + esc(tipoLabel(o)) + marcaInventado(o, "tipoOtro") + " · " + esc(o.localidad) + ", " + esc(o.provincia) + marcaFicticia(o) + "</div></div></div>";
    if (o.descripcion) html += "<p>" + esc(o.descripcion) + marcaInventado(o, "descripcion") + "</p>";
    var p = o.participantes || {}, ed = o.educadorxs || {};
    var personas = totalPersonas(p)
      ? "≈ " + totalPersonas(p) + '<br><small>' + plural(+p.ninxs || 0, "niñx", "niñxs") + " · " + plural(+p.jovenes || 0, "joven", "jóvenes") + " · " + plural(+p.adultxs || 0, "adultx", "adultxs") + "</small>"
      : "—";
    var educ = +ed.total ? ed.total + '<br><small>' + plural(+ed.mujeres || 0, "mujer", "mujeres") + " · " + plural(+ed.varones || 0, "varón", "varones") + (+ed.otrxs ? " · " + plural(+ed.otrxs, "otrx", "otrxs") : "") + "</small>" : "—";
    var pers = PERSONERIAS[o.personeria] ? esc(PERSONERIAS[o.personeria]) + (o.personeriaDetalle ? " (" + esc(o.personeriaDetalle) + ")" : "") : "—";
    html += '<dl class="det-grid">' +
      "<div><dt>Ubicación</dt><dd>" + ubic + (marcaInventado(o, "lat") ? "<br><small>Punto del mapa" + marcaInventado(o, "lat") + "</small>" : "") + "</dd></div>" +
      "<div><dt>Días y horarios</dt><dd>" + esc(o.horarios || "—") + marcaInventado(o, "horarios") + "</dd></div>" +
      "<div><dt>Personas que participan</dt><dd>" + personas + marcaInventado(o, "participantes") + "</dd></div>" +
      "<div><dt>Educadorxs</dt><dd>" + educ + marcaInventado(o, "educadorxs") + "</dd></div>" +
      "<div><dt>Alcance</dt><dd>" + esc(ALCANCES[o.alcance] || "—") + "</dd></div>" +
      "<div><dt>Personería jurídica</dt><dd>" + pers + marcaInventado(o, "personeria") + "</dd></div>" +
      "<div><dt>Ficha actualizada</dt><dd>" + fecha(o.actualizada || HOY) + "</dd></div>" +
      "</dl>";
    var acts = (o.actividades || []).map(function (k) { return ACTIVIDADES[k]; }).filter(Boolean);
    if (o.actividadesOtras) acts.push(o.actividadesOtras);
    if (acts.length) {
      html += '<div class="det-sec"><h3>Actividades</h3><div class="org-tags" style="margin:0">' + acts.map(function (t) {
        return '<span class="tag tag--neutral">' + esc(t) + "</span>";
      }).join("") + "</div></div>";
    }
    if (!opts.preview) {
      var suyos = avisos.filter(function (a) { return a.orgId === o.id; });
      if (suyos.length) {
        html += '<div class="det-sec"><h3>Sus convocatorias en la agenda</h3><ul class="matches">' + suyos.map(function (a) {
          return "<li><strong>" + esc(etiquetaClase(a)) + ":</strong> " + esc(a.titulo) + (a.cuando ? " (" + fecha(a.cuando) + ")" : "") + "</li>";
        }).join("") + "</ul></div>";
      }
    }
    var redesTxt = Object.keys(REDES).filter(function (k) { return (o.redes || {})[k]; }).map(function (k) {
      return '<span class="red-item"><small>' + esc(REDES[k]) + ":</small> " + esc(o.redes[k]) + "</span>";
    }).join("");
    var veTodo = rol !== "visitante" || opts.preview;
    html += '<div class="det-sec"><h3>Contacto y redes</h3>';
    if (veTodo) {
      html += '<p style="margin:0;font-size:.9rem">💬 ' + esc(o.telefono || "—") + marcaInventado(o, "telefono") + (o.correo ? " · ✉️ " + esc(o.correo) + marcaInventado(o, "correo") : "") + "</p>";
      if (opts.preview) html += '<p class="card-text" style="margin:.3rem 0 0"><small>El WhatsApp lo ve ' + (o.whatsappPublico ? "cualquier persona" : "solo la red") + "; el correo, solo la red.</small></p>";
    } else if (o.whatsappPublico) {
      html += '<p style="margin:0;font-size:.9rem">💬 ' + esc(o.telefono || "—") + marcaInventado(o, "telefono") + '</p><p class="card-text" style="margin:.3rem 0 0"><small>El correo lo ven solo las organizaciones de la red.</small></p>';
    } else {
      html += '<p class="card-text" style="margin:0">El WhatsApp y el correo los ven solo las organizaciones de la red. Si sos parte de una, tocá <strong>“Ingresar”</strong> con tu cuenta habilitada.</p>';
    }
    if (redesTxt) html += '<div class="redes-lista">' + redesTxt + "</div>";
    html += "</div>";
    if (veDatosRed() || opts.preview) html += bloqueRedHtml(o);
    html += '<div class="det-actions">';
    if (opts.preview) {
      html += '<button type="button" class="btn btn-primary" data-enviar-ficha>Guardar y publicar</button>' +
        '<button type="button" class="btn" data-cerrar>Seguir editando</button>';
    } else {
      if (rol !== "visitante" || o.whatsappPublico) {
        html += '<button type="button" class="btn btn-primary" data-contacto="WhatsApp">💬 WhatsApp</button>';
      }
      if (rol !== "visitante") html += '<button type="button" class="btn" data-contacto="el correo">✉️ Escribir</button>';
      html += '<button type="button" class="btn" data-en-mapa="' + o.id + '">📍 Ver en el mapa</button>';
    }
    html += "</div>";
    return html;
  }

  // datos internos del cuestionario: no se publican, los ven solo las cuentas de la red
  function bloqueRedHtml(o) {
    function lista(keys, dic, detalle) {
      var t = (keys || []).map(function (k) { return dic[k]; }).filter(Boolean).join(", ");
      if (detalle) t += (t ? ". " : "") + detalle;
      return esc(t || "—");
    }
    function conInfo(v, info) { return esc(v || "—") + (info ? "<br><small>" + esc(info) + "</small>" : ""); }
    return '<div class="det-sec det-coord"><h3>🔒 Solo para la red</h3>' +
      '<p class="card-text"><small>Lo ven solo las organizaciones que ingresan con su cuenta. Los visitantes no.</small></p>' +
      '<dl class="det-grid">' +
      "<div><dt>Quien responde</dt><dd>" + esc(o.referente || "—") + (o.referenteRol ? "<br><small>" + esc(o.referenteRol) + marcaInventado(o, "referenteRol") + "</small>" : "") + "</dd></div>" +
      "<div><dt>Actividades nuevas</dt><dd>" + esc(o.actividadesNuevas || "No") + marcaInventado(o, "actividadesNuevas") + "</dd></div>" +
      "<div><dt>Actividades dadas de baja</dt><dd>" + esc(o.actividadesBaja || "No") + marcaInventado(o, "actividadesBaja") + "</dd></div>" +
      "<div><dt>Espacio físico</dt><dd>" + conInfo(ESPACIOS[o.espacio], o.espacioInfo) + "</dd></div>" +
      "<div><dt>Educadorxs con sueldo</dt><dd>" + conInfo(SUELDOS[o.sueldos], o.sueldosInfo) + "</dd></div>" +
      "<div><dt>Fondos públicos</dt><dd>" + lista(o.fondosPublicos, FONDOS_PUBLICOS, o.fondosPublicosDetalle) + marcaInventado(o, "fondosPublicos") + "</dd></div>" +
      "<div><dt>Financiamiento privado</dt><dd>" + lista(o.fondosPrivados, FONDOS_PRIVADOS, o.fondosPrivadosDetalle) + marcaInventado(o, "fondosPrivados") + "</dd></div>" +
      "</dl></div>";
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

  /* ---------------- agenda ---------------- */
  var HINT_AVISO = "Tocá el mapa para marcar dónde es.";
  var mapaAviso = null;
  var pinAviso = null;
  var avisoPos = null;

  function etiquetaClase(a) { return CONVOCATORIAS[a.clase] || "Actividad"; }
  function linkGoogleMaps(a) { return "https://www.google.com/maps/search/?api=1&query=" + a.lat + "," + a.lng; }

  function initMapaAviso() {
    if (typeof L === "undefined" || rol !== "org") return;
    if (!mapaAviso) {
      mapaAviso = L.map("mapaAviso", { scrollWheelZoom: false });
      L.tileLayer(TILE_URL, { attribution: TILE_ATTR, minZoom: 3, maxZoom: 18 }).addTo(mapaAviso);
      mapaAviso.on("click", function (e) {
        avisoPos = { lat: +e.latlng.lat.toFixed(5), lng: +e.latlng.lng.toFixed(5) };
        var icon = iconoPin(miOrg(), true);
        if (!pinAviso) pinAviso = L.marker([avisoPos.lat, avisoPos.lng], { icon: icon, keyboard: false }).addTo(mapaAviso);
        else pinAviso.setLatLng([avisoPos.lat, avisoPos.lng]);
        $("mapaAviso").removeAttribute("aria-invalid");
        $("mapaAvisoHint").textContent = "Punto marcado. Podés tocar de nuevo para corregirlo.";
      });
    }
    setTimeout(function () {
      mapaAviso.invalidateSize();
      // arranca en la zona de la organización que publica
      var yo = miOrg();
      if (avisoPos) mapaAviso.setView([avisoPos.lat, avisoPos.lng], 13);
      else if (yo) mapaAviso.setView([yo.lat, yo.lng], 12);
    }, 0);
  }

  function limpiarPinAviso() {
    avisoPos = null;
    if (pinAviso) { mapaAviso.removeLayer(pinAviso); pinAviso = null; }
    $("mapaAviso").removeAttribute("aria-invalid");
    $("mapaAvisoHint").textContent = HINT_AVISO;
  }

  // quiénes respondieron: lo ve cualquiera, también quien entra como visitante
  function respuestasHtml(a) {
    var quienes = (a.respondieron || []).map(orgById).filter(Boolean);
    if (!quienes.length) return '<p class="aviso-resp aviso-resp--vacio">Todavía ninguna organización respondió.</p>';
    var max = avisosAbiertos[a.id] ? quienes.length : 3;
    var html = quienes.slice(0, max).map(function (o) {
      return '<button type="button" data-ver="' + o.id + '">' + esc(o.nombre) + "</button>";
    }).join(", ");
    if (quienes.length > max) html += ' y <button type="button" class="aviso-mas" data-abrir-resp="' + a.id + '">' + plural(quienes.length - max, "más", "más") + "</button>";
    return '<p class="aviso-resp"><strong>Se suman (' + quienes.length + "):</strong> " + html + "</p>";
  }

  // distancia en km entre dos organizaciones (fórmula del haversine)
  function distanciaKm(a, b) {
    var R = 6371, rad = Math.PI / 180;
    var dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function textoDistancia(km) {
    if (km < 1) return "a menos de 1 km";
    return "a " + (km < 10 ? km.toFixed(1).replace(".", ",") : Math.round(km).toLocaleString("es-AR")) + " km";
  }

  function marcarFiltroAviso(f) {
    avisoFiltro = f;
    document.querySelectorAll("[data-av-filtro]").forEach(function (x) {
      x.setAttribute("aria-pressed", x.getAttribute("data-av-filtro") === f ? "true" : "false");
    });
  }

  function renderAvisos() {
    var ul = $("avisosList");
    var esOrg = rol === "org";
    $("avisosFiltros").hidden = !esOrg;
    if (!esOrg && avisoFiltro === "mias") marcarFiltroAviso("");
    if (esOrg) $("cuentaMias").textContent = avisos.filter(function (a) { return a.orgId === sesion.orgId; }).length || "";
    var lista = avisos.filter(function (a) { return avisoFiltro !== "mias" || a.orgId === sesion.orgId; });
    function porFecha(a, b) { return a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0; }
    // una organización ve primero las convocatorias de las casas más cercanas (los propios, al final)
    var yo = esOrg ? miOrg() : null;
    var porCercania = yo && avisoFiltro !== "mias" && ordenAvisos === "cerca";
    var dist = {};
    if (yo) avisos.forEach(function (a) { var o = orgById(a.orgId); if (o) dist[a.id] = distanciaKm(yo, posVisible(o)); });
    lista.sort(porCercania ? function (a, b) {
      var pa = a.orgId === yo.id ? 1 : 0, pb = b.orgId === yo.id ? 1 : 0;
      return pa - pb || (dist[a.id] || 0) - (dist[b.id] || 0) || porFecha(a, b);
    } : porFecha);
    $("avisosOrden").hidden = !yo || avisoFiltro === "mias";
    if (yo) {
      $("ordenAvisos").value = ordenAvisos;
      $("avisosOrdenTexto").innerHTML = porCercania
        ? "Ordenadas por cercanía a <strong>" + esc(yo.nombre) + "</strong> (" + esc(yo.localidad) + ")."
        : "Ordenadas por fecha de publicación.";
    }
    if (!lista.length) {
      ul.innerHTML = '<li class="vacio">' + (avisoFiltro === "mias"
        ? "Todavía no publicaron convocatorias. Usá el formulario “Publicar una convocatoria”."
        : "No hay convocatorias por ahora.") + "</li>";
      renderStats();
      return;
    }
    ul.innerHTML = lista.map(function (a) {
      var o = orgById(a.orgId);
      var propio = rol === "org" && a.orgId === sesion.orgId;
      var accion;
      if (rol === "coord") {
        accion = '<button type="button" class="btn btn-sm" data-cerrar-aviso="' + a.id + '">Quitar convocatoria</button>';
      } else if (propio) {
        accion = '<button type="button" class="btn btn-sm" data-cerrar-aviso="' + a.id + '">Cerrar convocatoria</button>';
      } else {
        var txt = "Nos sumamos";
        if (rol === "visitante") {
          // el visitante ve el botón, pero apagado y con la aclaración
          accion = '<span class="aviso-hint">Solo organizaciones de la red</span>' +
            '<button type="button" class="btn btn-sm btn-bloqueado" aria-disabled="true" data-responder="' + a.id + '">🔒 ' + txt + "</button>";
        } else {
          var hecho = (a.respondieron || []).indexOf(sesion.orgId) !== -1;
          accion = '<button type="button" class="btn btn-sm ' + (hecho ? "" : "btn-primary") + '" data-responder="' + a.id + '"' + (hecho ? " disabled" : "") + ">" +
            (hecho ? "✓ Avisado" : txt) + "</button>";
        }
      }
      return '<li class="aviso aviso--convoca' + (a.nuevo ? " is-new" : "") + '">' +
        '<div class="aviso-top"><span class="aviso-kind">Convocatoria</span><span class="tag tag--neutral">' + esc(etiquetaClase(a)) + "</span>" +
        (propio ? '<span class="tag tag--destacado">Tu convocatoria</span>' : "") +
        (a.inventada ? '<span class="inventado" title="Convocatoria inventada para mostrar la agenda">inventada</span>' : "") +
        (yo && a.orgId !== yo.id && dist[a.id] != null ? '<span class="aviso-dist">📍 ' + textoDistancia(dist[a.id]) + "</span>" : "") +
        '<span class="aviso-fecha">' + fecha(a.fecha) + "</span></div>" +
        "<h3>" + esc(a.titulo) + "</h3>" +
        '<div class="aviso-evento"><span>📅 ' + fecha(a.cuando) + "</span>" +
        (a.lat != null ? '<a class="btn btn-sm" href="' + linkGoogleMaps(a) + '" target="_blank" rel="noopener" aria-label="Ver en Google Maps: ' + esc(a.titulo) + ' (se abre en otra pestaña)">📍 Ver en Google Maps</a>' : "") +
        "</div>" +
        (a.detalle ? "<p>" + esc(a.detalle) + "</p>" : "") +
        respuestasHtml(a) +
        '<div class="aviso-foot"><span class="aviso-org">' +
        (o ? '<button type="button" data-ver="' + o.id + '">' + esc(o.nombre) + "</button> · " + esc(o.localidad) : "") +
        '</span><span class="aviso-actions">' + accion + "</span></div>" +
        "</li>";
    }).join("");
    avisos.forEach(function (a) { delete a.nuevo; });
    renderStats();
  }

  function initAgenda() {
    $("avClase").innerHTML = Object.keys(CONVOCATORIAS).map(function (k) {
      return '<option value="' + k + '">' + esc(CONVOCATORIAS[k]) + "</option>";
    }).join("");
    $("avCuando").min = HOY;
    $("ordenAvisos").addEventListener("change", function () { ordenAvisos = this.value; renderAvisos(); });
    document.querySelectorAll("[data-av-filtro]").forEach(function (b) {
      b.addEventListener("click", function () {
        marcarFiltroAviso(b.getAttribute("data-av-filtro"));
        renderAvisos();
      });
    });
    $("avisosList").addEventListener("click", function (e) {
      var ver = e.target.closest("[data-ver]");
      if (ver) { abrirFicha(ver.getAttribute("data-ver")); return; }
      var mas = e.target.closest("[data-abrir-resp]");
      if (mas) { avisosAbiertos[mas.getAttribute("data-abrir-resp")] = true; renderAvisos(); return; }
      var cerrar = e.target.closest("[data-cerrar-aviso]");
      if (cerrar) {
        var idc = cerrar.getAttribute("data-cerrar-aviso");
        avisos = avisos.filter(function (a) { return a.id !== idc; });
        renderAvisos();
        toast(rol === "coord" ? "La coordinación quitó la convocatoria de la agenda." : "Cerraste la convocatoria.");
        return;
      }
      var resp = e.target.closest("[data-responder]");
      if (!resp) return;
      if (rol === "visitante") { toast("Solo las organizaciones de la red pueden responder. Si sos parte de una, tocá “Ingresar”."); return; }
      if (rol !== "org") { toast("La coordinación modera la agenda, pero no se suma a las convocatorias."); return; }
      var id = resp.getAttribute("data-responder");
      var a = avisos.filter(function (x) { return x.id === id; })[0];
      var o = orgById(a.orgId);
      a.respondieron = (a.respondieron || []).concat(sesion.orgId);
      renderAvisos();
      var quien = miOrg().nombre;
      toast("Le avisamos a " + (o ? o.nombre : "la organización") + " que " + quien + " se suma.");
    });
    $("formAviso").addEventListener("submit", function (e) {
      e.preventDefault();
      var titulo = $("avTitulo").value.trim();
      var cuando = $("avCuando").value;
      var faltan = [];
      if (!cuando) faltan.push("avCuando");
      if (!avisoPos) faltan.push("mapaAviso");
      if (!titulo) faltan.push("avTitulo");
      if (!avisoPos) $("mapaAvisoHint").textContent = "Falta marcar la ubicación: tocá el mapa.";
      ["avCuando", "mapaAviso", "avTitulo"].forEach(function (id) {
        if (faltan.indexOf(id) !== -1) $(id).setAttribute("aria-invalid", "true"); else $(id).removeAttribute("aria-invalid");
      });
      if (faltan.length) { $(faltan[0]).focus(); return; }
      var aviso = {
        id: "av-" + Date.now(), orgId: sesion.orgId, clase: $("avClase").value,
        fecha: HOY, cuando: cuando, lat: avisoPos.lat, lng: avisoPos.lng, titulo: titulo, detalle: $("avDetalle").value.trim(), respondieron: [], nuevo: true,
      };
      avisos.push(aviso);
      this.reset();
      limpiarPinAviso();
      initMapaAviso();
      if (avisoFiltro !== "mias") marcarFiltroAviso("");   // en "Mis publicaciones" la convocatoria nueva ya se ve
      renderAvisos();
      toast("¡Publicada! Las organizaciones de la red ya la pueden ver.");
    });
  }

  /* ---------------- ficha: alta / mi organización ---------------- */
  var mapaFicha = null;
  var pinFicha = null;
  var fichaPos = null;
  var fichaPinManual = false;   // tocaron el mapa: elegir otra localidad ya no mueve el punto

  function initFormFicha() {
    ["oProvincia", "aProvincia"].forEach(function (id) {
      $(id).innerHTML = '<option value="">Elegí…</option>' + window.RED_PROVINCIAS.map(function (p) {
        return '<option value="' + esc(p) + '">' + esc(p) + "</option>";
      }).join("");
    });
    function opciones(id, dic, vacio) {
      $(id).innerHTML = (vacio ? '<option value="">' + vacio + "</option>" : "") + Object.keys(dic).map(function (k) {
        return '<option value="' + k + '">' + esc(dic[k]) + "</option>";
      }).join("");
    }
    function chips(id, name, dic) {
      $(id).innerHTML = Object.keys(dic).map(function (k) {
        return '<label><input type="checkbox" name="' + name + '" value="' + k + '"><span>' + esc(dic[k]) + "</span></label>";
      }).join("");
    }
    opciones("oPersoneria", PERSONERIAS, "Elegí…");
    opciones("oAlcance", ALCANCES, "Elegí…");
    opciones("oEspacio", ESPACIOS, "Elegí…");
    opciones("oSueldos", SUELDOS, "Elegí…");
    var etiquetasTipo = {};
    Object.keys(TIPOS).forEach(function (k) { etiquetasTipo[k] = TIPOS[k].icono + " " + TIPOS[k].label; });
    chips("oTipos", "tipos", etiquetasTipo);
    chips("aTipos", "aTipos", etiquetasTipo);
    chips("oActividades", "actividades", ACTIVIDADES);
    chips("oFondosPublicos", "fondosPublicos", FONDOS_PUBLICOS);
    chips("oFondosPrivados", "fondosPrivados", FONDOS_PRIVADOS);
    $("oRedes").innerHTML = Object.keys(REDES).map(function (k) {
      return '<label class="field"><span class="field-hint">' + esc(REDES[k]) + '</span><input class="field-control" data-red="' + k + '" maxlength="80" placeholder="' +
        (k === "web" ? "www…" : k === "facebook" ? "Nombre de la página" : "@usuario o link") + '"></label>';
    }).join("");
    ["oNinxs", "oJovenes", "oAdultxs", "oEducMujeres", "oEducVarones", "oEducOtrxs"].forEach(function (id) { $(id).addEventListener("input", actualizarTotal); });
    $("oTipos").addEventListener("change", mostrarOtros);
    ["oFondosPublicos", "oFondosPrivados"].forEach(function (id) {
      $(id).addEventListener("change", function () { sincronizarNegativa(this); });
    });
    $("oPersoneria").addEventListener("change", mostrarOtros);
    $("oProvincia").addEventListener("change", function () {
      llenarLocalidades("listaLocalidades", this.value);
      set("oLocalidad", "");
      fichaPos = null;
      fichaPinManual = false;
      moverPinFicha();
      var p = LOC_AR[this.value];
      if (p && mapaFicha) mapaFicha.setView(p.c, 7);
      $("mapaFichaHint").textContent = "Elegí la localidad y después tocá el mapa para ajustar el punto.";
    });
    $("oLocalidad").addEventListener("change", function () {
      var prov = $("oProvincia").value;
      var oficial = localidadOficial(prov, this.value);
      if (oficial) this.value = oficial[0];
      var centro = centroLocalidad(prov, this.value);
      if (centro) $("mapaFicha").removeAttribute("aria-invalid");
      if (fichaPinManual) return;
      fichaPos = centro;
      moverPinFicha();
      if (centro && mapaFicha) mapaFicha.setView([centro.lat, centro.lng], 13);
      $("mapaFichaHint").textContent = centro || !this.value.trim()
        ? "Elegí la localidad y después tocá el mapa para ajustar el punto."
        : "Esa localidad no está en la lista: tocá el mapa para marcar dónde están.";
    });
    $("formFicha").addEventListener("submit", function (e) { e.preventDefault(); enviarFicha(); });
    $("btnVistaPrevia").addEventListener("click", function () {
      var d = leerFicha();
      if (!validarFicha(d)) return;
      mostrarModal(detalleHtml(d, { preview: true }));
    });
    $("formFicha").addEventListener("input", function (e) {
      var marcado = e.target.closest("[aria-invalid]");   // en los grupos de chips la marca está en el contenedor
      if (marcado) marcado.removeAttribute("aria-invalid");
    });
  }

  function initMapaFicha() {
    if (typeof L === "undefined") return;
    if (!mapaFicha) {
      mapaFicha = L.map("mapaFicha", { scrollWheelZoom: false });
      L.tileLayer(TILE_URL, { attribution: TILE_ATTR, minZoom: 3, maxZoom: 18 }).addTo(mapaFicha);
      mapaFicha.on("click", function (e) {
        fichaPos = { lat: +e.latlng.lat.toFixed(5), lng: +e.latlng.lng.toFixed(5) };
        fichaPinManual = true;
        $("mapaFicha").removeAttribute("aria-invalid");
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
    var icon = iconoPin({ tipos: marcados($("formFicha"), "tipos") }, true);
    if (!pinFicha) pinFicha = L.marker([fichaPos.lat, fichaPos.lng], { icon: icon, keyboard: false }).addTo(mapaFicha);
    else pinFicha.setLatLng([fichaPos.lat, fichaPos.lng]).setIcon(icon);
  }
  $("oTipos").addEventListener("change", moverPinFicha);

  // si los visitantes ven la dirección exacta, las organizaciones de la red también
  function ajustarVisibilidad() {
    var f = $("formFicha");
    var publicaExacta = f.querySelector('input[name="oVisPublica"]:checked').value === "exacta";
    var redZona = f.querySelector('input[name="oVisRed"][value="zona"]');
    if (publicaExacta) f.querySelector('input[name="oVisRed"][value="exacta"]').checked = true;
    redZona.disabled = publicaExacta;
  }
  $("formFicha").addEventListener("change", function (e) {
    if (e.target.name === "oVisPublica" || e.target.name === "oVisRed") ajustarVisibilidad();
  });

  function set(id, v) { $(id).value = v == null ? "" : v; }
  function totalEducadorxs() {
    return (+$("oEducMujeres").value || 0) + (+$("oEducVarones").value || 0) + (+$("oEducOtrxs").value || 0);
  }
  function actualizarTotal() {
    $("oTotalPersonas").textContent = totalPersonas({ ninxs: $("oNinxs").value, jovenes: $("oJovenes").value, adultxs: $("oAdultxs").value });
    $("oEducTotal").textContent = totalEducadorxs();
  }
  function mostrarOtros() {
    $("oTipoOtroCampo").hidden = marcados($("formFicha"), "tipos").indexOf("otro") === -1;
    var pers = $("oPersoneria").value;
    $("oPersoneriaDetalleCampo").hidden = pers !== "otra" && pers !== "otrasit";
  }
  function marcar(f, name, valores) {
    f.querySelectorAll('input[name="' + name + '"]').forEach(function (c) { c.checked = (valores || []).indexOf(c.value) !== -1; });
  }
  function marcados(f, name) {
    return Array.prototype.map.call(f.querySelectorAll('input[name="' + name + '"]:checked'), function (c) { return c.value; });
  }
  // opción negativa ("No recibimos…"): mientras esté marcada, las demás quedan desmarcadas y apagadas
  function sincronizarNegativa(box) {
    var negativa = box.querySelector('input[value="ninguno"]');
    box.querySelectorAll("input").forEach(function (c) {
      if (c === negativa) return;
      if (negativa.checked) c.checked = false;
      c.disabled = negativa.checked;
    });
  }
  function num(id) { return $(id).value === "" ? "" : Math.max(0, Math.round(+$(id).value)); }

  function cargarFicha() {
    var f = $("formFicha");
    var o = miOrg();
    if (!o) return;
    f.reset();
    f.querySelectorAll("[aria-invalid]").forEach(function (x) { x.removeAttribute("aria-invalid"); });
    $("fichaError").hidden = true;
    $("fichaTitulo").textContent = o.nombre;
    set("oNombre", o.nombre); marcar(f, "tipos", o.tipos); set("oTipoOtro", o.tipoOtro); set("oReferente", o.referente);
    set("oReferenteRol", o.referenteRol); set("oPersoneria", o.personeria); set("oPersoneriaDetalle", o.personeriaDetalle);
    set("oDescripcion", o.descripcion); set("oHorarios", o.horarios); set("oProvincia", o.provincia); llenarLocalidades("listaLocalidades", o.provincia); set("oLocalidad", o.localidad); set("oDireccion", o.direccion);
    set("oTelefono", o.telefono); set("oCorreo", o.correo);
    var p = o.participantes || {}, ed = o.educadorxs || {};
    set("oNinxs", p.ninxs); set("oJovenes", p.jovenes); set("oAdultxs", p.adultxs);
    set("oEducMujeres", ed.mujeres); set("oEducVarones", ed.varones); set("oEducOtrxs", ed.otrxs); actualizarTotal();
    set("oAlcance", o.alcance); set("oActividadesOtras", o.actividadesOtras);
    marcar(f, "actividades", o.actividades);
    f.querySelectorAll("[data-red]").forEach(function (inp) { inp.value = (o.redes || {})[inp.getAttribute("data-red")] || ""; });
    f.querySelector('input[name="oWaVis"][value="' + (o.whatsappPublico ? "publico" : "red") + '"]').checked = true;
    set("oActNuevas", o.actividadesNuevas); set("oActBaja", o.actividadesBaja);
    set("oEspacio", o.espacio); set("oEspacioInfo", o.espacioInfo); set("oSueldos", o.sueldos); set("oSueldosInfo", o.sueldosInfo);
    marcar(f, "fondosPublicos", o.fondosPublicos); set("oFondosPublicosDetalle", o.fondosPublicosDetalle);
    marcar(f, "fondosPrivados", o.fondosPrivados); set("oFondosPrivadosDetalle", o.fondosPrivadosDetalle);
    sincronizarNegativa($("oFondosPublicos"));
    sincronizarNegativa($("oFondosPrivados"));
    mostrarOtros();
    f.querySelector('input[name="oVisPublica"][value="' + (o.ubicacionPublica === "exacta" ? "exacta" : "zona") + '"]').checked = true;
    f.querySelector('input[name="oVisRed"][value="' + (o.ubicacionRed === "exacta" ? "exacta" : "zona") + '"]').checked = true;
    ajustarVisibilidad();
    fichaPos = { lat: o.lat, lng: o.lng };
    fichaPinManual = true;
    var inventados = (o.inventados || []).map(function (k) { return CAMPOS_LABEL[k]; }).filter(Boolean);
    $("fichaInventados").hidden = !inventados.length && !o.ficticia;
    $("fichaInventados").textContent = o.ficticia ? "Esta es una organización ficticia, de ejemplo: todos sus datos son inventados."
      : "Estos datos son inventados porque no estaban en la encuesta: " + inventados.join(", ") + ". Al corregirlos dejan de estar marcados.";
    var estado = $("fichaEstado");
    estado.hidden = false;
    estado.innerHTML = "✅ Tu ficha está <strong>publicada</strong> en el mapa. Última actualización: " + fecha(o.actualizada) +
      ". Estás editando con <strong>" + esc(sesion.email) + "</strong>.";
    $("mapaFichaHint").textContent = "Elegí la localidad y después tocá el mapa para ajustar el punto.";
    moverPinFicha();
  }

  function leerFicha() {
    var f = $("formFicha");
    var loc = $("oLocalidad").value.trim();
    var base = miOrg() || {};
    var pos = fichaPos || { lat: null, lng: null };
    return {
      id: base.id || null,
      nombre: $("oNombre").value.trim(),
      tipos: marcados(f, "tipos"),
      tipoOtro: marcados(f, "tipos").indexOf("otro") !== -1 ? $("oTipoOtro").value.trim() : "",
      personeria: $("oPersoneria").value,
      personeriaDetalle: $("oPersoneriaDetalleCampo").hidden ? "" : $("oPersoneriaDetalle").value.trim(),
      referente: $("oReferente").value.trim(),
      referenteRol: $("oReferenteRol").value.trim(),
      descripcion: $("oDescripcion").value.trim(),
      horarios: $("oHorarios").value.trim(),
      actividades: marcados(f, "actividades"),
      actividadesOtras: $("oActividadesOtras").value.trim(),
      participantes: { ninxs: num("oNinxs"), jovenes: num("oJovenes"), adultxs: num("oAdultxs") },
      alcance: $("oAlcance").value,
      educadorxs: { total: totalEducadorxs() || "", mujeres: num("oEducMujeres"), varones: num("oEducVarones"), otrxs: num("oEducOtrxs") },
      localidad: loc,
      provincia: $("oProvincia").value,
      direccion: $("oDireccion").value.trim(),
      ubicacionPublica: f.querySelector('input[name="oVisPublica"]:checked').value,
      ubicacionRed: f.querySelector('input[name="oVisRed"]:checked').value,
      lat: pos.lat, lng: pos.lng,
      telefono: $("oTelefono").value.trim(),
      correo: $("oCorreo").value.trim(),
      whatsappPublico: f.querySelector('input[name="oWaVis"]:checked').value === "publico",
      redes: Array.prototype.reduce.call(f.querySelectorAll("[data-red]"), function (acc, inp) {
        acc[inp.getAttribute("data-red")] = inp.value.trim(); return acc;
      }, {}),
      actividadesNuevas: $("oActNuevas").value.trim(),
      actividadesBaja: $("oActBaja").value.trim(),
      espacio: $("oEspacio").value, espacioInfo: $("oEspacioInfo").value.trim(),
      sueldos: $("oSueldos").value, sueldosInfo: $("oSueldosInfo").value.trim(),
      fondosPublicos: marcados(f, "fondosPublicos"), fondosPublicosDetalle: $("oFondosPublicosDetalle").value.trim(),
      fondosPrivados: marcados(f, "fondosPrivados"), fondosPrivadosDetalle: $("oFondosPrivadosDetalle").value.trim(),
      actualizada: HOY,
    };
  }

  function validarFicha(d) {
    var faltan = [];
    [["oNombre", d.nombre], ["oTipos", d.tipos.length], ["oReferente", d.referente],
      ["oProvincia", d.provincia], ["oLocalidad", d.localidad], ["mapaFicha", d.lat != null], ["oTelefono", d.telefono]].concat(d.tipos.indexOf("otro") !== -1 ? [["oTipoOtro", d.tipoOtro]] : []).forEach(function (p) {
      if (!p[1]) { $(p[0]).setAttribute("aria-invalid", "true"); faltan.push(p[0]); }
      else $(p[0]).removeAttribute("aria-invalid");
    });
    var err = $("fichaError");
    var pideDireccion = (d.ubicacionPublica === "exacta" || d.ubicacionRed === "exacta") && !d.direccion;
    if (pideDireccion) { $("oDireccion").setAttribute("aria-invalid", "true"); faltan.push("oDireccion"); }
    else $("oDireccion").removeAttribute("aria-invalid");
    if (faltan.length) {
      err.textContent = pideDireccion && faltan.length === 1
        ? "Elegiste mostrar la dirección exacta: completá el campo Dirección."
        : "Completá los campos marcados con * (" + faltan.length + " sin completar).";
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
    var cambios = diferencias(o, d);
    if (!cambios.length) { toast("No hay cambios para guardar."); return; }
    o.inventados = (o.inventados || []).filter(function (k) { return cambios.indexOf(k) === -1; });
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
      if ((x && typeof x === "object") || (y && typeof y === "object")) {
        var ks = Object.keys(Object.assign({}, x, y));
        return ks.some(function (q) { return String((x || {})[q] == null ? "" : x[q]) !== String((y || {})[q] == null ? "" : y[q]); });
      }
      return String(x == null ? "" : x) !== String(y == null ? "" : y);
    });
  }

  /* ---------------- solicitar acceso (visitantes) ---------------- */
  function initAcceso() {
    $("aProvincia").addEventListener("change", function () { llenarLocalidades("listaLocalidadesAcceso", this.value); set("aLocalidad", ""); });
    $("formAcceso").addEventListener("input", function (e) {
      var marcado = e.target.closest("[aria-invalid]");   // en los grupos de chips la marca está en el contenedor
      if (marcado) marcado.removeAttribute("aria-invalid");
    });
    $("formAcceso").addEventListener("submit", function (e) {
      e.preventDefault();
      var d = {
        nombre: $("aNombre").value.trim(), tipos: marcados(this, "aTipos"), provincia: $("aProvincia").value, localidad: $("aLocalidad").value.trim(),
        referente: $("aReferente").value.trim(), email: $("aEmail").value.trim().toLowerCase(),
        mensaje: $("aMensaje").value.trim(),
      };
      var oficial = localidadOficial(d.provincia, d.localidad);
      if (oficial) d.localidad = oficial[0];
      var faltan = [];
      [["aNombre", d.nombre], ["aTipos", d.tipos.length], ["aProvincia", d.provincia], ["aLocalidad", d.localidad], ["aReferente", d.referente],
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
        datos: { nombre: d.nombre, tipos: d.tipos, localidad: d.localidad, provincia: d.provincia,
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
        '<div class="org-tags" style="margin:0"><span class="tag tag--destacado">Pedido de acceso</span><span class="tag tag--neutral">' + fecha(s.fecha) + "</span></div>" +
        "<h3>" + tipoIcono(d) + " " + esc(d.nombre) + marcaFicticia(d) + "</h3>" +
        '<p class="org-meta">' + esc(tipoLabel(d)) + " · " + esc(d.localidad) + ", " + esc(d.provincia) + " · Referente: " + esc(d.referente) + "</p>" +
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
      var c = LOC_AR[d.provincia] ? LOC_AR[d.provincia].c : [-35.5, -63.5];
      var loc = centroLocalidad(d.provincia, d.localidad) || { lat: c[0], lng: c[1] };
      nOrg += 1;
      var nueva = Object.assign({
        horarios: "", direccion: "", telefono: "",
        tipoOtro: "", personeria: "", personeriaDetalle: "", referenteRol: "", actividades: [], actividadesOtras: "",
        participantes: { ninxs: "", jovenes: "", adultxs: "" }, alcance: "", whatsappPublico: false,
        educadorxs: { total: "", mujeres: "", varones: "", otrxs: "" },
        redes: { facebook: "", instagram: "", waCanal: "", youtube: "", web: "", otra: "" },
        actividadesNuevas: "", actividadesBaja: "", espacio: "", espacioInfo: "", sueldos: "", sueldosInfo: "",
        fondosPublicos: [], fondosPublicosDetalle: "", fondosPrivados: [], fondosPrivadosDetalle: "",
        lat: +(loc.lat + Math.sin(nOrg) * 0.015).toFixed(5), lng: +(loc.lng + Math.cos(nOrg) * 0.02).toFixed(5),
        ubicacionPublica: "zona", ubicacionRed: "zona",
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
      if (!o || !window.confirm("¿Quitar “" + o.nombre + "” del mapa? También se desactivan sus cuentas y sus convocatorias.")) return;
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
  initAgenda();
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
