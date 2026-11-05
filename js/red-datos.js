/**
 * Datos de ejemplo del prototipo "Mapa de la red".
 * TODAS las organizaciones, personas, teléfonos y convocatorias son FICTICIOS:
 * sirven solo para mostrar cómo funcionaría la herramienta.
 */
(function () {
  /* Tipos de organización: los mismos del cuestionario de la red. */
  window.RED_TIPOS = {
    jardin:    { label: "Jardín comunitario",              icono: "🧸" },
    club:      { label: "Club de fútbol",                  icono: "⚽" },
    casaninx:  { label: "Casa del niñx",                   icono: "🏡" },
    centrodia: { label: "Centro de día / espacio comunitario", icono: "🤝" },
    hogar:     { label: "Hogar convivencial",              icono: "🏠" },
    biblioteca:{ label: "Biblioteca",                      icono: "📚" },
    cultural:  { label: "Centro cultural",                 icono: "🎨" },
    murga:     { label: "Murga",                           icono: "🥁" },
    comedor:   { label: "Comedor",                         icono: "🍲" },
    radio:     { label: "Radio",                           icono: "📻" },
    educativo: { label: "Centro educativo",                icono: "✏️" },
    otro:      { label: "Otro",                            icono: "📌" },
  };

  /* Opciones del cuestionario de la red (29/10). */
  window.RED_PERSONERIAS = {
    fundacion: "Fundación", asociacion: "Asociación civil", cooperativa: "Cooperativa",
    otra: "Otra personería", ninguna: "No tenemos", tramite: "En trámite", otrasit: "Otra situación",
  };
  window.RED_ACTIVIDADES = {
    deportivas: "Actividades deportivas", artisticas: "Actividades artísticas",
    apoyo: "Apoyo escolar y propuestas educativas", fines: "Terminalidad educativa (Plan FinEs)",
    oficios: "Capacitación laboral / oficios", biblioteca: "Biblioteca",
    medica: "Atención médica individual", terapeutico: "Espacio terapéutico individual o grupal",
    consumo: "Acompañamiento en consumo problemático", generos: "Géneros y diversidades",
    comunicacion: "Comunicación", habitat: "Hábitat y vivienda",
  };
  window.RED_ALCANCES = {
    barrial: "Barrial", local: "Local", intermunicipal: "Intermunicipal",
    municipal: "Municipal", provincial: "Provincial", nacional: "Nacional",
  };
  window.RED_REDES = {
    facebook: "Facebook", instagram: "Instagram", waCanal: "Canal de WhatsApp",
    youtube: "YouTube", web: "Sitio web", otra: "Otra red",
  };
  /* Solo para la red: lo ven las cuentas que ingresan, no los visitantes */
  window.RED_ESPACIOS = {
    alquilado: "Espacio alquilado", prestado: "Espacio prestado", cedido: "Espacio cedido / comodato",
    propio: "Espacio propio de la organización", ocupado: "Espacio ocupado",
    compartido: "Espacio compartido con otras organizaciones",
  };
  window.RED_SUELDOS = {
    todxs: "Todxs", masmitad: "Más de la mitad", mitad: "La mitad", algunxs: "Solo algunxs", ningunx: "Ningunx",
  };
  window.RED_FONDOS_PUBLICOS = {
    ninguno: "No recibimos recursos de fuentes públicas",
    udi: "Becas Unidad de Desarrollo Infantil",
    opnya: "Becas del organismo provincial de niñez y adolescencia (PBA)",
    envion: "Programa Envión", sedronar: "SEDRONAR", universidades: "Universidades",
    capitalhumano: "Ministerio de Capital Humano", alimprov: "Alimentos de la provincia",
    alimmuni: "Alimentos del municipio",
  };
  window.RED_FONDOS_PRIVADOS = {
    empresas: "Empresas", individuos: "Individuos / personas", fundaciones: "Fundaciones / asociaciones civiles",
    religiosas: "Instituciones religiosas", otros: "Otros", ninguno: "No recibimos",
  };

  /* Para las convocatorias de la agenda: qué clase de actividad es. */
  window.RED_CONVOCATORIAS = {
    encuentro:  "Encuentro o reunión",
    jornada:    "Jornada solidaria",
    taller:     "Taller o capacitación",
    marcha:     "Marcha o movilización",
    festival:   "Festival o actividad cultural",
    deporte:    "Torneo o actividad deportiva",
    colecta:    "Colecta o campaña",
  };

  window.RED_PROVINCIAS = [
    "Buenos Aires", "Chaco", "Chubut", "Córdoba", "La Pampa",
    "Mendoza", "Río Negro", "San Juan", "San Luis", "Santa Fe",
  ];

  /* Centro aproximado de cada localidad (para ubicar la zona). */
  window.RED_LOCALIDADES = {
    "Avellaneda":        { prov: "Buenos Aires", lat: -34.6625, lng: -58.3650 },
    "Florencio Varela":  { prov: "Buenos Aires", lat: -34.8068, lng: -58.2757 },
    "Quilmes":           { prov: "Buenos Aires", lat: -34.7206, lng: -58.2546 },
    "La Plata":          { prov: "Buenos Aires", lat: -34.9214, lng: -57.9545 },
    "Berazategui":       { prov: "Buenos Aires", lat: -34.7631, lng: -58.2112 },
    "Moreno":            { prov: "Buenos Aires", lat: -34.6509, lng: -58.7896 },
    "Paso del Rey":      { prov: "Buenos Aires", lat: -34.6450, lng: -58.7580 },
    "José C. Paz":       { prov: "Buenos Aires", lat: -34.5160, lng: -58.7680 },
    "Los Polvorines":    { prov: "Buenos Aires", lat: -34.5280, lng: -58.7040 },
    "San Miguel":        { prov: "Buenos Aires", lat: -34.5430, lng: -58.7120 },
    "González Catán":    { prov: "Buenos Aires", lat: -34.7700, lng: -58.6470 },
    "Lomas de Zamora":   { prov: "Buenos Aires", lat: -34.7600, lng: -58.4000 },
    "Mar del Plata":     { prov: "Buenos Aires", lat: -38.0055, lng: -57.5426 },
    "Bahía Blanca":      { prov: "Buenos Aires", lat: -38.7196, lng: -62.2724 },
    "Rosario":           { prov: "Santa Fe",     lat: -32.9442, lng: -60.6505 },
    "Santa Fe":          { prov: "Santa Fe",     lat: -31.6333, lng: -60.7000 },
    "Córdoba":           { prov: "Córdoba",      lat: -31.4201, lng: -64.1888 },
    "Villa María":       { prov: "Córdoba",      lat: -32.4075, lng: -63.2402 },
    "Mendoza":           { prov: "Mendoza",      lat: -32.8895, lng: -68.8458 },
    "Las Heras":         { prov: "Mendoza",      lat: -32.8500, lng: -68.8200 },
    "San Juan":          { prov: "San Juan",     lat: -31.5375, lng: -68.5364 },
    "San Luis":          { prov: "San Luis",     lat: -33.3017, lng: -66.3378 },
    "Resistencia":       { prov: "Chaco",        lat: -27.4606, lng: -58.9839 },
    "Santa Rosa":        { prov: "La Pampa",     lat: -36.6167, lng: -64.2833 },
    "Bariloche":         { prov: "Río Negro",    lat: -41.1335, lng: -71.3103 },
    "General Roca":      { prov: "Río Negro",    lat: -39.0333, lng: -67.5833 },
    "Trelew":            { prov: "Chubut",       lat: -43.2489, lng: -65.3051 },
    "Comodoro Rivadavia":{ prov: "Chubut",       lat: -45.8641, lng: -67.4966 },
  };

  var n = 0;
  /* Datos de ejemplo del cuestionario: se completan solos y siempre igual
     (a partir del número de cada organización), salvo que la ficha los traiga. */
  var ACT_POR_TIPO = {
    jardin: ["artisticas", "apoyo"], club: ["deportivas"], casaninx: ["apoyo", "artisticas", "deportivas"],
    centrodia: ["apoyo", "oficios", "terapeutico"], hogar: ["apoyo", "terapeutico", "oficios"],
    biblioteca: ["biblioteca", "apoyo"], cultural: ["artisticas", "comunicacion"], murga: ["artisticas"],
    comedor: ["apoyo"], radio: ["comunicacion", "artisticas"], educativo: ["apoyo", "fines"], otro: [],
  };
  var ROLES = ["Coordinación general", "Fundadorx", "Educadorx a cargo", "Presidencia de la asociación civil", "Equipo de conducción"];
  function elegir(lista, n, k) { return lista[(n * 7 + k * 13) % lista.length]; }
  function participantes(o, n) {
    var total = +o.chicos || 40;
    var m = String(o.edades || "").match(/(\d+)\D+(\d+)/);
    var min = m ? +m[1] : 0, max = m ? +m[2] : 30;
    var hastaDoce = Math.max(0, Math.min(max, 12) - min + 1), trece = Math.max(0, Math.min(max, 18) - Math.max(min, 13) + 1);
    var parteN = hastaDoce + trece ? hastaDoce / (hastaDoce + trece) : 0.5;
    var adultxs = m ? Math.round(total * (0.08 + (n % 4) * 0.03)) : Math.round(total * 0.3);
    var ninxs = Math.round(total * parteN);
    return { ninxs: ninxs, jovenes: total - ninxs, adultxs: adultxs };
  }
  function cuestionario(o, n) {
    var tipo = o.tipo;
    var acts = (ACT_POR_TIPO[tipo] || []).slice();
    var extra = ["generos", "consumo", "comunicacion", "habitat", "medica", "deportivas"][n % 6];
    if (n % 3 === 0 && acts.indexOf(extra) === -1) acts.push(extra);
    var educ = 3 + (n * 5) % 14, mujeres = Math.round(educ * 0.65), otrxs = n % 5 === 0 ? 1 : 0;
    var redes = { facebook: "", instagram: "", waCanal: "", youtube: "", web: "", otra: "" };
    if (o.redes) redes.instagram = o.redes;
    if (n % 4 === 1) redes.facebook = o.nombre;
    if (tipo === "radio") redes.youtube = "@" + o.nombre.toLowerCase().replace(/[^a-z]+/g, "");
    var publicos = ["udi", "opnya", "envion", "alimprov", "alimmuni", "sedronar", "universidades"];
    var fp = n % 6 === 0 ? ["ninguno"] : [elegir(publicos, n, 1), elegir(publicos, n, 4)].filter(function (v, i, a) { return a.indexOf(v) === i; });
    return {
      personeria: elegir(["asociacion", "asociacion", "fundacion", "tramite", "ninguna", "cooperativa"], n, 2),
      personeriaDetalle: "",
      actividades: acts,
      actividadesOtras: "",
      participantes: participantes(o, n),
      alcance: elegir(["barrial", "barrial", "local", "municipal", "intermunicipal"], n, 3),
      redes: redes,
      whatsappPublico: n % 3 === 1,
      educadorxs: { total: educ, mujeres: mujeres, varones: educ - mujeres - otrxs, otrxs: otrxs },
      // solo para la red: no lo ven los visitantes
      referenteRol: elegir(ROLES, n, 5),
      actividadesNuevas: n % 4 === 2 ? "Taller de huerta" : "",
      actividadesBaja: n % 7 === 3 ? "Torneo de fútbol de los sábados: no hay quien lo coordine" : "",
      espacio: elegir(["propio", "prestado", "cedido", "alquilado", "compartido", "propio"], n, 6),
      espacioInfo: "",
      sueldos: elegir(["ningunx", "algunxs", "algunxs", "ningunx", "mitad"], n, 7),
      sueldosInfo: "",
      fondosPublicos: fp,
      fondosPublicosDetalle: "",
      fondosPrivados: n % 5 === 2 ? ["ninguno"] : [elegir(["individuos", "fundaciones", "religiosas", "empresas"], n, 8)],
      fondosPrivadosDetalle: "",
    };
  }

  function org(o) {
    n += 1;
    var loc = window.RED_LOCALIDADES[o.localidad];
    // desplazamiento chico y determinístico para que las casas de una misma localidad no se pisen
    var dLat = (Math.sin(n * 12.9898) * 0.018);
    var dLng = (Math.cos(n * 78.233) * 0.022);
    var base = Object.assign({
      id: "org-" + n,
      provincia: loc.prov,
      lat: +(loc.lat + dLat).toFixed(5),
      lng: +(loc.lng + dLng).toFixed(5),
      // qué ubicación se muestra: "zona" (aproximada) o "exacta", por separado para
      // visitantes (público) y para las otras organizaciones de la red
      ubicacionPublica: "zona",
      ubicacionRed: "zona",
      direccion: "",
      tipoOtro: "",
      telefono: "(0" + (10 + (n % 80)) + ") 15-0000-" + String(1000 + n).slice(-4),
      correo: "contacto@ejemplo-" + n + ".org.ar",
      estado: "aprobada",
      actualizada: "2026-09-" + String(1 + (n * 7) % 24).padStart(2, "0"),
    }, cuestionario(o, n), o);
    if (typeof o.redes === "string") base.redes = cuestionario(o, n).redes;
    delete base.chicos; delete base.edades;
    return base;
  }


  window.RED_ORGS = [
    org({ nombre: "Casa del Niño Semillitas", tipo: "casaninx", localidad: "Avellaneda",
      referente: "Marta Giménez", edades: "4 a 14 años", chicos: 85,
      horarios: "Lunes a viernes de 8 a 18", redes: "@casasemillitas",
      descripcion: "Casa del niño con desayuno, almuerzo y merienda. Apoyo escolar a la tarde y taller de huerta los sábados.",
      direccion: "Pasaje Los Aromos 245", ubicacionRed: "exacta" }),
    org({ nombre: "Merendero Los Gurises", tipo: "comedor", localidad: "José C. Paz",
      referente: "Graciela Ortiz", edades: "2 a 12 años", chicos: 60,
      horarios: "Lunes, miércoles y viernes de 16 a 19", redes: "@merendero.losgurises",
      descripcion: "Merendero barrial que funciona en la casa de una vecina. Leche, pan casero y juegos después de la escuela."}),
    org({ nombre: "Comedor Juanito Laguna", tipo: "comedor", localidad: "Florencio Varela",
      referente: "Héctor Ramírez", edades: "Todas las edades", chicos: 140,
      horarios: "Lunes a sábado, almuerzo de 12 a 14",
      descripcion: "Comedor comunitario que da almuerzo a familias del barrio. Olla popular los sábados." }),
    org({ nombre: "Centro Cultural La Ronda", tipo: "cultural", localidad: "Quilmes",
      referente: "Lucía Paredes", edades: "8 a 18 años", chicos: 70,
      horarios: "Martes a sábado de 15 a 20", redes: "@laronda.cultural",
      descripcion: "Murga, teatro, radio y serigrafía. Los chicos arman su propio programa de radio cada viernes.",
      direccion: "Calle 844 N.º 1520", ubicacionPublica: "exacta", ubicacionRed: "exacta" }),
    org({ nombre: "Hogar Tres Veces Casa", tipo: "hogar", localidad: "La Plata",
      referente: "Padre Julián Moyano", edades: "6 a 17 años", chicos: 24,
      horarios: "Convivencial, 24 horas",
      descripcion: "Casa convivencial para chicos y chicas. Panadería y huerta como proyectos productivos." }),
    org({ nombre: "Apoyo Escolar Pizarrón Abierto", tipo: "educativo", localidad: "Berazategui",
      referente: "Noelia Sosa", edades: "6 a 15 años", chicos: 45,
      horarios: "Lunes a jueves de 14 a 17",
      descripcion: "Apoyo escolar primaria y secundaria. Biblioteca popular abierta al barrio." }),
    org({ nombre: "Club Social El Potrero", tipo: "club", localidad: "Moreno",
      referente: "Walter Benítez", edades: "5 a 17 años", chicos: 120,
      horarios: "Martes, jueves y sábados de 17 a 20",
      descripcion: "Fútbol mixto, hockey y merienda después del entrenamiento. Torneos con otros clubes de barrio.",
      direccion: "Av. del Potrero 3300", ubicacionRed: "exacta" }),
    org({ nombre: "Casa Abierta Paso del Rey", tipo: "hogar", localidad: "Paso del Rey",
      referente: "Silvia Acosta", edades: "0 a 12 años", chicos: 50,
      horarios: "Lunes a viernes de 7 a 17",
      descripcion: "Jardín comunitario y casa del niño. Acompañamiento a las familias en trámites." }),
    org({ nombre: "Merendero Pancitas Felices", tipo: "comedor", localidad: "Los Polvorines",
      referente: "Rosa Villalba", edades: "3 a 12 años", chicos: 55,
      horarios: "Martes y jueves de 16 a 18:30",
      descripcion: "Merienda y taller de lectura. Funciona en el salón de la parroquia del barrio." }),
    org({ nombre: "Taller de Oficios Manos del Barrio", tipo: "centrodia", localidad: "San Miguel",
      referente: "Jorge Almada", edades: "14 a 21 años", chicos: 35,
      horarios: "Lunes a viernes de 9 a 13",
      descripcion: "Carpintería, electricidad y herrería para adolescentes. Emprendimiento de muebles a pedido." }),
    org({ nombre: "Comedor Nuestra Señora del Barrio", tipo: "comedor", localidad: "González Catán",
      referente: "Carmen Duarte", edades: "Todas las edades", chicos: 200,
      horarios: "Lunes a viernes, almuerzo y cena",
      descripcion: "Comedor con más de 200 raciones diarias. Ropero comunitario los miércoles."}),
    org({ nombre: "Salita Comunitaria Ternura", tipo: "centrodia", localidad: "Lomas de Zamora",
      referente: "Dra. Paula Ferreyra", edades: "0 a 18 años", chicos: 300,
      horarios: "Lunes a viernes de 9 a 15",
      descripcion: "Controles de niño sano, vacunación y talleres de salud sexual integral junto a promotoras del barrio." }),
    org({ nombre: "Casa de Jóvenes Mar y Arena", tipo: "centrodia", localidad: "Mar del Plata",
      referente: "Federico Lagos", edades: "12 a 20 años", chicos: 40,
      horarios: "Lunes a viernes de 14 a 20",
      descripcion: "Espacio de encuentro para adolescentes: música, surf social y terminalidad educativa." }),
    org({ nombre: "Merendero Vientos del Sur", tipo: "comedor", localidad: "Bahía Blanca",
      referente: "Andrea Molina", edades: "3 a 14 años", chicos: 48,
      horarios: "Lunes a viernes de 16 a 18",
      descripcion: "Merienda, apoyo escolar y juegos. Hacemos colecta de abrigo todos los inviernos." }),
    org({ nombre: "Centro Comunitario Los Pibes del Sur", tipo: "centrodia", localidad: "Rosario",
      referente: "Matías Correa", edades: "6 a 17 años", chicos: 90,
      horarios: "Lunes a viernes de 14 a 19",
      descripcion: "Apoyo escolar, biblioteca y taller de rap. Articulamos con la escuela del barrio." }),
    org({ nombre: "Hogar Costa Litoral", tipo: "hogar", localidad: "Santa Fe",
      referente: "Hna. Beatriz Luján", edades: "4 a 16 años", chicos: 18,
      horarios: "Convivencial, 24 horas",
      descripcion: "Casa convivencial a orillas del Salado. Huerta y taller de cerámica." }),
    org({ nombre: "Comedor La Esperanza", tipo: "comedor", localidad: "Córdoba",
      referente: "Ramona Quiroga", edades: "Todas las edades", chicos: 160,
      horarios: "Lunes a sábado de 11:30 a 14",
      descripcion: "Comedor y copa de leche. Taller de costura para las mamás del barrio." }),
    org({ nombre: "Club de Barrio Los Algarrobos", tipo: "club", localidad: "Villa María",
      referente: "Diego Luna", edades: "6 a 16 años", chicos: 75,
      horarios: "Lunes a viernes de 17 a 20",
      descripcion: "Básquet, fútbol y vóley. Merienda después de cada entrenamiento." }),
    org({ nombre: "Casa de la Niñez Cerro Arco", tipo: "casaninx", localidad: "Las Heras",
      referente: "Estela Pérez", edades: "3 a 12 años", chicos: 65,
      horarios: "Lunes a viernes de 8 a 16",
      descripcion: "Casa de día con desayuno, almuerzo y talleres de arte." }),
    org({ nombre: "Centro Cultural Acequia", tipo: "radio", localidad: "Mendoza",
      referente: "Tomás Videla", edades: "10 a 18 años", chicos: 55,
      horarios: "Martes a viernes de 16 a 20",
      descripcion: "Folclore, audiovisual y radio comunitaria." }),
    org({ nombre: "Merendero Sol de Zonda", tipo: "comedor", localidad: "San Juan",
      referente: "Liliana Castro", edades: "2 a 12 años", chicos: 42,
      horarios: "Lunes a viernes de 17 a 19",
      descripcion: "Merienda y ludoteca. Festejamos juntos los cumpleaños del mes." }),
    org({ nombre: "Apoyo Escolar Las Chacras", tipo: "educativo", localidad: "San Luis",
      referente: "Mauricio Funes", edades: "6 a 14 años", chicos: 38,
      horarios: "Lunes a jueves de 14:30 a 17:30",
      descripcion: "Apoyo escolar y alfabetización digital con computadoras donadas." }),
    org({ nombre: "Comedor Comunitario Barrio Toba", tipo: "comedor", localidad: "Resistencia",
      referente: "Celestino Gómez", edades: "Todas las edades", chicos: 180,
      horarios: "Lunes a viernes, almuerzo",
      descripcion: "Comedor comunitario en barrio toba. Taller de lengua qom y artesanía." }),
    org({ nombre: "Casa del Niño Caldenes", tipo: "casaninx", localidad: "Santa Rosa",
      referente: "Ana Berardi", edades: "4 a 13 años", chicos: 52,
      horarios: "Lunes a viernes de 8 a 17",
      descripcion: "Casa de día, huerta agroecológica y cría de gallinas." }),
    org({ nombre: "Centro Juvenil Cordillera", tipo: "cultural", localidad: "Bariloche",
      referente: "Nahuel Epulef", edades: "12 a 20 años", chicos: 45,
      horarios: "Lunes a sábado de 15 a 21",
      descripcion: "Espacio joven en el Alto: música, murales y preparación para el primer empleo." }),
    org({ nombre: "Merendero Chacra y Manzana", tipo: "comedor", localidad: "General Roca",
      referente: "Soledad Pino", edades: "2 a 12 años", chicos: 50,
      horarios: "Lunes a viernes de 16:30 a 18:30",
      descripcion: "Merienda con fruta del Alto Valle y taller de cocina con las familias." }),
    org({ nombre: "Casa de Chicxs Valle Inferior", tipo: "casaninx", localidad: "Trelew",
      referente: "Gwen Roberts", edades: "6 a 16 años", chicos: 36,
      horarios: "Lunes a viernes de 14 a 18",
      descripcion: "Apoyo escolar, merienda y taller de ajedrez." }),
    org({ nombre: "Comedor Vientos del Golfo", tipo: "comedor", localidad: "Comodoro Rivadavia",
      referente: "Miguel Ángel Rojas", edades: "Todas las edades", chicos: 130,
      horarios: "Lunes a sábado, almuerzo y merienda",
      descripcion: "Comedor en barrio de la zona norte. Ropero y peluquería social una vez por mes." }),

    /* pedidos de acceso pendientes (aparecen en el panel de Coordinación) */
    org({ nombre: "Biblioteca Popular Letras al Viento", tipo: "biblioteca", localidad: "Avellaneda",
      referente: "Hernán Lucero", edades: "5 a 15 años", chicos: 30,
      horarios: "Sábados de 10 a 13",
      descripcion: "Biblioteca popular con cuentacuentos y apoyo escolar los sábados.", estado: "pendiente",
      emailSolicitud: "hernan.lucero@example.com",
      mensaje: "Participamos de los encuentros de zona sur desde 2024. Nos conoce Casa del Niño Semillitas." }),
    org({ nombre: "Olla Popular Barrio Obrero", tipo: "comedor", localidad: "Rosario",
      referente: "Carla Benítez", edades: "Todas las edades", chicos: 90,
      horarios: "Martes y viernes, cena",
      descripcion: "Olla popular que arrancó en 2024. Queremos sumarnos a la red.", estado: "pendiente",
      emailSolicitud: "olla.barrioobrero@example.com",
      mensaje: "Fuimos a la marcha de noviembre con el Centro Comunitario Los Pibes del Sur y queremos sumarnos a la red." }),
    org({ nombre: "Escuelita de Fútbol Los Cóndores", tipo: "club", localidad: "Mendoza",
      referente: "Raúl Aguirre", edades: "6 a 14 años", chicos: 60,
      horarios: "Lunes, miércoles y viernes de 18 a 20",
      descripcion: "Escuela de fútbol infantil gratuita con merienda.", estado: "pendiente",
      emailSolicitud: "raul.aguirre@example.com",
      mensaje: "Somos una escuelita de fútbol gratuita. Todavía no participamos de ningún encuentro de la red." }),
  ];

  /* Cuentas de Google habilitadas: qué mail pertenece a qué organización (o a la coordinación).
     En la versión real esta lista vive en el servidor y es el servidor el que la controla. */
  window.RED_USUARIOS = [
    { email: "graciela.ortiz@example.com", nombre: "Graciela Ortiz", rol: "org", orgId: "org-2" },
    { email: "merendero.losgurises@example.com", nombre: "Merendero Los Gurises", rol: "org", orgId: "org-2" },
    { email: "marta.gimenez@example.com", nombre: "Marta Giménez", rol: "org", orgId: "org-1" },
    { email: "lucia.paredes@example.com", nombre: "Lucía Paredes", rol: "org", orgId: "org-4" },
    { email: "coordinacion.red@example.com", nombre: "Coordinación de la red", rol: "coord" },
  ];

  /* Cuentas que aparecen en el selector simulado de "Ingresar con Google". */
  window.RED_CUENTAS_DEMO = [
    { email: "graciela.ortiz@example.com", nombre: "Graciela Ortiz", nota: "Merendero Los Gurises" },
    { email: "marta.gimenez@example.com", nombre: "Marta Giménez", nota: "Casa del Niño Semillitas" },
    { email: "coordinacion.red@example.com", nombre: "Coordinación de la red", nota: "Coordinación" },
    { email: "juan.perez@example.com", nombre: "Juan Pérez", nota: "Cuenta no habilitada" },
  ];

  /* respondieron: organizaciones que tocaron "Nos sumamos" */
  window.RED_AVISOS = [
    { id: "av-5", orgId: "org-1", clase: "encuentro", fecha: "2026-09-18",
      cuando: "2026-10-04", lugar: "Casa del Niño Semillitas, Avellaneda",
      titulo: "Encuentro de educadorxs de zona sur — sábado 4/10",
      detalle: "Nos juntamos a compartir experiencias de apoyo escolar. Traer algo para compartir. Hay espacio para 40 personas.",
      respondieron: ["org-6", "org-4", "org-3", "org-12", "org-8", "org-11", "org-9", "org-2", "org-7"] },
    { id: "av-9", orgId: "org-15", clase: "jornada", fecha: "2026-09-10",
      cuando: "2026-09-27", lugar: "Centro Comunitario Los Pibes del Sur, Rosario",
      titulo: "Jornada de pintura del centro comunitario",
      detalle: "Sábado 27/9 pintamos el salón. Invitamos a otras organizaciones de Rosario a sumarse con los chicos.",
      respondieron: ["org-16", "org-22", "org-17", "org-18", "org-20", "org-21"] },
  ];
})();
