/* ==========================================================
   Mapa de la red — lógica del prototipo (todo en memoria)
   ========================================================== */
(function () {
  "use strict";

  var TIPOS = window.RED_TIPOS;
  var RECURSOS = window.RED_RECURSOS;
  var LOCALIDADES = window.RED_LOCALIDADES;
  var ORG_DEMO_ID = window.RED_ORG_DEMO_ID;
  var HOY = "2026-09-25";
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var CAMPOS_LABEL = {
    nombre: "Nombre", tipo: "Tipo", referente: "Referente", descripcion: "Descripción",
    edades: "Edades", chicos: "Cantidad de chicxs", horarios: "Horarios", localidad: "Localidad",
    direccion: "Dirección", mostrarDireccion: "Visibilidad de la ubicación", lat: "Ubicación en el mapa",
    necesita: "Necesitan", ofrece: "Ofrecen", telefono: "Teléfono", correo: "Correo", redes: "Redes",
  };

  /* ---------------- estado ---------------- */
  var orgs = [];
  var solicitudes = [];
  window.RED_ORGS.forEach(function (o) {
    var copia = clone(o);
    if (copia.estado === "pendiente") {
      solicitudes.push({ id: "sol-" + copia.id, kind: "alta", datos: copia, fecha: copia.actualizada });
    } else {
      orgs.push(copia);
    }
  });
  var avisos = window.RED_AVISOS.map(clone);
  var rol = "visitante";
  var vista = "mapa";
  var seleccionId = null;
  var avisoFiltro = "";
  var yaRespondidos = {};
  var miAltaEnviada = null;   // nombre de la última alta enviada como visitante
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
  function plural(n, uno, varios) { return n + " " + (n === 1 ? uno : varios); }
  function orgById(id) {
    for (var i = 0; i < orgs.length; i++) if (orgs[i].id === id) return orgs[i];
    return null;
  }
  function miOrg() { return orgById(ORG_DEMO_ID); }

  /* ---------------- toast ---------------- */
  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 3200);
  }

  /* ---------------- vistas / pestañas ---------------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  function mostrarVista(v, sinHash) {
    var tab = document.querySelector('.tab[data-vista="' + v + '"]');
    if (!tab || tab.hidden) v = "mapa";
    vista = v;
    tabs.forEach(function (t) {
      var on = t.getAttribute("data-vista") === v;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      $(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (!sinHash) history.replaceState(null, "", v === "mapa" ? location.pathname : "#" + v);
    if (v === "mapa" && mapa) setTimeout(function () { mapa.invalidateSize(); }, 0);
    if (v === "ficha") initMapaFicha();
    window.scrollTo(0, 0);
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { mostrarVista(t.getAttribute("data-vista")); });
    t.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var visibles = tabs.filter(function (x) { return !x.hidden; });
      var idx = visibles.indexOf(t) + (e.key === "ArrowRight" ? 1 : -1);
      var next = visibles[(idx + visibles.length) % visibles.length];
      next.focus();
      mostrarVista(next.getAttribute("data-vista"));
    });
  });

  /* ---------------- roles ---------------- */
  $("rolSelect").addEventListener("change", function () {
    rol = this.value;
    aplicarRol();
    var msg = { visitante: "Estás viendo el sitio como visitante.",
      org: "Entraste como Merendero Los Gurises.",
      coord: "Entraste como coordinación de la red." }[rol];
    toast(msg);
  });
  function aplicarRol() {
    $("tab-coord").hidden = rol !== "coord";
    $("tab-ficha").hidden = rol === "coord";
    $("tabFichaLabel").textContent = rol === "org" ? "Mi organización" : "Sumar organización";
    $("publicarBloqueado").hidden = rol === "org";
    $("formAviso").hidden = rol !== "org";
    cargarFicha();
    renderAvisos();
    renderSolicitudes();
    if ((vista === "coord" && rol !== "coord") || (vista === "ficha" && rol === "coord")) mostrarVista("mapa");
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
        (o.ofrece || []).map(function (k) { return RECURSOS[k]; }).join(" ")].join(" "));
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
    (o.necesita || []).forEach(function (k) {
      if (max && n >= max) return;
      html += '<span class="tag tag--necesita">Necesita: ' + esc(RECURSOS[k]) + "</span>"; n++;
    });
    (o.ofrece || []).forEach(function (k) {
      if (max && n >= max) return;
      html += '<span class="tag tag--ofrece">Ofrece: ' + esc(RECURSOS[k]) + "</span>"; n++;
    });
    var total = (o.necesita || []).length + (o.ofrece || []).length;
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
    if (enviar) { modal.close(); enviarFicha(); }
  });

  function coincidencias(o) {
    var leSirven = [];
    var lesSirve = [];
    orgs.forEach(function (x) {
      if (x.id === o.id) return;
      var dan = (x.ofrece || []).filter(function (k) { return (o.necesita || []).indexOf(k) !== -1; });
      var reciben = (x.necesita || []).filter(function (k) { return (o.ofrece || []).indexOf(k) !== -1; });
      var cerca = x.provincia === o.provincia ? 0 : 1;
      if (dan.length) leSirven.push({ org: x, recursos: dan, cerca: cerca });
      if (reciben.length) lesSirve.push({ org: x, recursos: reciben, cerca: cerca });
    });
    function orden(a, b) { return a.cerca - b.cerca || b.recursos.length - a.recursos.length || a.org.nombre.localeCompare(b.org.nombre, "es"); }
    return { leSirven: leSirven.sort(orden).slice(0, 4), lesSirve: lesSirve.sort(orden).slice(0, 4) };
  }

  function listaMatches(items) {
    return '<ul class="matches">' + items.map(function (m) {
      return '<li><button type="button" data-ver="' + m.org.id + '">' + esc(m.org.nombre) + "</button> · " +
        esc(m.org.localidad) + (m.cerca ? ", " + esc(m.org.provincia) : "") + " — " +
        esc(m.recursos.map(function (k) { return RECURSOS[k]; }).join(", ")) + "</li>";
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
    if ((o.necesita || []).length || (o.ofrece || []).length) {
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
      html += '<p class="card-text" style="margin:0">Los datos de contacto solo los ven las organizaciones de la red. <em>(En la demo: “Ver como: Organización”.)</em></p></div>';
    } else {
      html += '<p style="margin:0;font-size:.9rem">📞 ' + esc(o.telefono || "—") + (o.correo ? " · ✉️ " + esc(o.correo) : "") + (o.redes ? " · " + esc(o.redes) : "") + "</p></div>";
    }
    html += '<div class="det-actions">';
    if (opts.preview) {
      html += '<button type="button" class="btn btn-primary" data-enviar-ficha>Enviar a revisión</button>' +
        '<button type="button" class="btn" data-cerrar>Seguir editando</button>';
    } else if (opts.revision) {
      html += '<button type="button" class="btn" data-cerrar>Cerrar</button>';
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
      var propio = rol === "org" && a.orgId === ORG_DEMO_ID;
      var accion;
      if (propio) {
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
        toast("Cerraste el aviso. ¡Ojalá se haya resuelto!");
        return;
      }
      var resp = e.target.closest("[data-responder]");
      if (!resp) return;
      if (rol === "visitante") { toast("Para responder avisos tenés que entrar como organización."); return; }
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
        id: "av-" + Date.now(), orgId: ORG_DEMO_ID, tipo: tipo, recurso: $("avRecurso").value,
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
    f.reset();
    f.querySelectorAll("[aria-invalid]").forEach(function (x) { x.removeAttribute("aria-invalid"); });
    $("fichaError").hidden = true;
    var estado = $("fichaEstado");
    if (rol === "org") {
      var o = miOrg();
      var pendiente = solicitudPendienteDe(o.id);
      var d = pendiente ? pendiente.datos : o;
      $("fichaEyebrow").textContent = "Tu ficha en la red";
      $("fichaTitulo").textContent = o.nombre;
      $("fichaLead").textContent = "Mantené tus datos al día: horarios, qué necesitan y qué pueden ofrecer. Los cambios los revisa la coordinación.";
      $("btnEnviarFicha").textContent = "Guardar cambios";
      set("oNombre", d.nombre); set("oTipo", d.tipo); set("oReferente", d.referente);
      set("oDescripcion", d.descripcion); set("oEdades", d.edades); set("oChicos", d.chicos);
      set("oHorarios", d.horarios); set("oLocalidad", d.localidad); set("oDireccion", d.direccion);
      set("oTelefono", d.telefono); set("oCorreo", d.correo); set("oRedes", d.redes);
      f.querySelector('input[name="oVisibilidad"][value="' + (d.mostrarDireccion === "exacta" ? "exacta" : "zona") + '"]').checked = true;
      f.querySelectorAll('input[name="necesita"]').forEach(function (c) { c.checked = d.necesita.indexOf(c.value) !== -1; });
      f.querySelectorAll('input[name="ofrece"]').forEach(function (c) { c.checked = d.ofrece.indexOf(c.value) !== -1; });
      fichaPos = { lat: d.lat, lng: d.lng };
      estado.hidden = false;
      estado.innerHTML = pendiente
        ? "⏳ Tenés <strong>cambios pendientes de revisión</strong>. Mientras tanto, en el mapa se ve la versión anterior."
        : "✅ Tu ficha está <strong>publicada</strong> en el mapa. Última actualización: " + fecha(o.actualizada) + ".";
    } else {
      $("fichaEyebrow").textContent = "Sumate a la red";
      $("fichaTitulo").textContent = "Sumá tu organización";
      $("fichaLead").textContent = "Completá la ficha de tu casa. La coordinación de la red la revisa antes de publicarla en el mapa.";
      $("btnEnviarFicha").textContent = "Enviar a revisión";
      fichaPos = null;
      estado.hidden = !miAltaEnviada;
      if (miAltaEnviada) estado.innerHTML = "📨 Recibimos la solicitud de <strong>" + esc(miAltaEnviada) + "</strong>. La coordinación la va a revisar pronto.";
    }
    $("mapaFichaHint").textContent = "Elegí la localidad y después tocá el mapa para ajustar el punto.";
    moverPinFicha();
  }

  function leerFicha() {
    var f = $("formFicha");
    var loc = $("oLocalidad").value;
    var base = rol === "org" ? miOrg() : {};
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

  function solicitudPendienteDe(orgId) {
    for (var i = 0; i < solicitudes.length; i++) if (solicitudes[i].kind === "cambio" && solicitudes[i].orgId === orgId) return solicitudes[i];
    return null;
  }

  function enviarFicha() {
    var d = leerFicha();
    if (!validarFicha(d)) return;
    if (rol === "org") {
      var o = miOrg();
      if (!diferencias(o, d).length) { toast("No hay cambios para guardar."); return; }
      var previa = solicitudPendienteDe(o.id);
      if (previa) { previa.datos = d; previa.fecha = HOY; }
      else solicitudes.push({ id: "sol-" + Date.now(), kind: "cambio", orgId: o.id, datos: d, fecha: HOY });
      toast("Cambios enviados. La coordinación los va a revisar.");
    } else {
      d.id = "org-nueva-" + Date.now();
      solicitudes.push({ id: "sol-" + d.id, kind: "alta", datos: d, fecha: HOY });
      miAltaEnviada = d.nombre;
      toast("¡Gracias! Tu solicitud quedó pendiente de revisión.");
    }
    renderStats();
    renderSolicitudes();
    cargarFicha();
    window.scrollTo(0, 0);
  }

  function diferencias(a, b) {
    return Object.keys(CAMPOS_LABEL).filter(function (k) {
      if (k === "lat") return Math.abs((a.lat || 0) - (b.lat || 0)) > 1e-5 || Math.abs((a.lng || 0) - (b.lng || 0)) > 1e-5;
      var x = a[k], y = b[k];
      if (Array.isArray(x) || Array.isArray(y)) return (x || []).slice().sort().join() !== (y || []).slice().sort().join();
      return String(x == null ? "" : x) !== String(y == null ? "" : y);
    });
  }

  /* ---------------- coordinación ---------------- */
  function renderSolicitudes() {
    var ul = $("solicitudesList");
    $("solicitudesVacio").hidden = solicitudes.length > 0;
    ul.innerHTML = solicitudes.map(function (s) {
      var d = s.datos;
      var extra = "";
      if (s.kind === "cambio") {
        var campos = diferencias(orgById(s.orgId), d);
        extra = '<ul class="cambios">' + campos.map(function (k) { return "<li>Cambió: " + esc(CAMPOS_LABEL[k]) + "</li>"; }).join("") + "</ul>";
      }
      return '<li class="card solicitud">' +
        '<div class="org-tags" style="margin:0"><span class="tag ' + (s.kind === "alta" ? "tag--ofrece" : "tag--pendiente") + '">' + (s.kind === "alta" ? "Alta nueva" : "Cambio de ficha") + '</span><span class="tag tag--neutral">' + fecha(s.fecha) + "</span></div>" +
        "<h3>" + TIPOS[d.tipo].icono + " " + esc(d.nombre) + "</h3>" +
        '<p class="org-meta">' + esc(TIPOS[d.tipo].label) + " · " + esc(d.localidad) + ", " + esc(d.provincia) + " · Referente: " + esc(d.referente) + "</p>" +
        "<p>" + esc(d.descripcion) + "</p>" + extra +
        '<div class="solicitud-actions">' +
        '<button type="button" class="btn btn-sm btn-primary" data-aprobar="' + s.id + '">Aprobar</button>' +
        '<button type="button" class="btn btn-sm" data-rechazar="' + s.id + '">Rechazar</button>' +
        '<button type="button" class="btn btn-sm" data-revisar="' + s.id + '">Ver ficha</button>' +
        "</div></li>";
    }).join("");
    renderStats();
  }

  $("solicitudesList").addEventListener("click", function (e) {
    var b = e.target.closest("[data-aprobar],[data-rechazar],[data-revisar]");
    if (!b) return;
    var id = b.getAttribute("data-aprobar") || b.getAttribute("data-rechazar") || b.getAttribute("data-revisar");
    var s = solicitudes.filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    if (b.hasAttribute("data-revisar")) { mostrarModal(detalleHtml(s.datos, { revision: true })); return; }
    solicitudes = solicitudes.filter(function (x) { return x !== s; });
    if (b.hasAttribute("data-aprobar")) {
      if (s.kind === "alta") {
        var nueva = clone(s.datos);
        nueva.estado = "aprobada";
        nueva.actualizada = HOY;
        orgs.push(nueva);
        toast("Aprobada: " + nueva.nombre + " ya aparece en el mapa.");
      } else {
        var o = orgById(s.orgId);
        Object.keys(s.datos).forEach(function (k) { if (k !== "id") o[k] = s.datos[k]; });
        o.actualizada = HOY;
        toast("Cambios aprobados: la ficha de " + o.nombre + " está actualizada.");
      }
      construirMarcadores();
      aplicarFiltros();
    } else {
      toast("Solicitud rechazada. Se le avisará a " + s.datos.nombre + " por correo.");
    }
    renderSolicitudes();
    cargarFicha();
  });

  /* ---------------- arranque ---------------- */
  initFiltros();
  initTablero();
  initFormFicha();
  initMapa();
  construirMarcadores();
  aplicarFiltros(true);
  aplicarRol();
  renderStats();
  var inicial = location.hash.replace("#", "");
  mostrarVista(["tablero", "ficha", "coord"].indexOf(inicial) !== -1 ? inicial : "mapa", true);
})();
