/**
 * Datos del prototipo "Mapa de la red": las organizaciones salen de la encuesta a organizaciones sociales.
 * Lo que la encuesta no traía se completó a mano para mostrar la herramienta:
 * esos campos están listados en "inventados" y el sitio los marca como inventados.
 * Al final están los datos de ejemplo anteriores, todos ficticios (ficticia: true).
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
    "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Ciudad Autónoma de Buenos Aires", "Córdoba", "Corrientes",
    "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro",
    "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán",
  ];

  window.RED_ORGS = [
    {
      "id": "org-1",
      "nombre": "Escuela Popular de Música",
      "tipos": [
        "otro"
      ],
      "tipoOtro": "Escuela de música",
      "personeria": "asociacion",
      "personeriaDetalle": "",
      "referente": "Gerónimo Ilardi",
      "referenteRol": "Referente de la organización",
      "descripcion": "Organización que trabaja con actividades artísticas.",
      "horarios": "Lunes a viernes de 9 a 17",
      "actividades": [
        "artisticas"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 1,
        "jovenes": 45,
        "adultxs": 24
      },
      "alcance": "provincial",
      "educadorxs": {
        "total": 24,
        "mujeres": 13,
        "varones": 11,
        "otrxs": ""
      },
      "localidad": "Villa Ballester",
      "provincia": "Buenos Aires",
      "direccion": "Alberdi 4449",
      "lat": -34.54563,
      "lng": -58.56282,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "telefono": "11 5846-4011",
      "correo": "contacto@organizacion-1.example",
      "whatsappPublico": false,
      "redes": {
        "facebook": "",
        "instagram": "Escuela.popular.musica",
        "waCanal": "",
        "youtube": "Escuela popular de musica",
        "web": "",
        "otra": ""
      },
      "actividadesNuevas": "No",
      "actividadesBaja": "No",
      "espacio": "prestado",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "ninguno"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "ninguno"
      ],
      "fondosPrivadosDetalle": "",
      "estado": "aprobada",
      "actualizada": "2026-09-25",
      "inventados": [
        "descripcion",
        "horarios",
        "referenteRol",
        "correo",
        "lat",
        "tipoOtro"
      ]
    },
    {
      "id": "org-2",
      "nombre": "Mesa Reconquista",
      "tipos": [
        "otro"
      ],
      "tipoOtro": "Mesa de organizaciones",
      "personeria": "ninguna",
      "personeriaDetalle": "",
      "referente": "Facundo Moyano",
      "referenteRol": "Referente de la organización",
      "descripcion": "Organización que trabaja con actividades deportivas, apoyo escolar y atención médica.",
      "horarios": "Lunes a viernes de 9 a 17",
      "actividades": [
        "deportivas",
        "apoyo",
        "medica",
        "terapeutico",
        "consumo",
        "fines",
        "generos",
        "comunicacion"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 20,
        "jovenes": 20,
        "adultxs": 15
      },
      "alcance": "municipal",
      "educadorxs": {
        "total": 10,
        "mujeres": 4,
        "varones": 6,
        "otrxs": ""
      },
      "localidad": "Villa José León Suárez",
      "provincia": "Buenos Aires",
      "direccion": "",
      "lat": -34.5265,
      "lng": -58.57139,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "telefono": "11 3643-6792",
      "correo": "contacto@organizacion-2.example",
      "whatsappPublico": false,
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "actividadesNuevas": "Taller de Barberia- Manicuria",
      "actividadesBaja": "No",
      "espacio": "prestado",
      "espacioInfo": "",
      "sueldos": "todxs",
      "sueldosInfo": "",
      "fondosPublicos": [],
      "fondosPublicosDetalle": "Otras",
      "fondosPrivados": [
        "otros"
      ],
      "fondosPrivadosDetalle": "",
      "estado": "aprobada",
      "actualizada": "2026-09-25",
      "inventados": [
        "descripcion",
        "horarios",
        "referenteRol",
        "correo",
        "lat",
        "tipoOtro"
      ]
    },
    {
      "id": "org-3",
      "nombre": "Biblioteca popular la Carcova",
      "tipos": [
        "biblioteca"
      ],
      "tipoOtro": "",
      "personeria": "asociacion",
      "personeriaDetalle": "",
      "referente": "Yair Rubio",
      "referenteRol": "Referente de la organización",
      "descripcion": "Organización que trabaja con actividades artísticas, apoyo escolar y terminalidad educativa.",
      "horarios": "Lunes a viernes de 9 a 17",
      "actividades": [
        "artisticas",
        "apoyo",
        "fines"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 60,
        "jovenes": 20,
        "adultxs": 60
      },
      "alcance": "local",
      "educadorxs": {
        "total": 20,
        "mujeres": 15,
        "varones": 5,
        "otrxs": ""
      },
      "localidad": "Villa Cárcova",
      "provincia": "Buenos Aires",
      "direccion": "Beltrán 92",
      "lat": -34.52527,
      "lng": -58.57993,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "telefono": "(011) 0000-0003",
      "correo": "contacto@organizacion-3.example",
      "whatsappPublico": false,
      "redes": {
        "facebook": "",
        "instagram": "Biblioteca popular la Carcova",
        "waCanal": "Biblioteca popular la Carcova",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "actividadesNuevas": "No",
      "actividadesBaja": "Ensamble musical para jovenes",
      "espacio": "propio",
      "espacioInfo": "",
      "sueldos": "mitad",
      "sueldosInfo": "",
      "fondosPublicos": [
        "ninguno"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "fundaciones"
      ],
      "fondosPrivadosDetalle": "",
      "estado": "aprobada",
      "actualizada": "2026-09-25",
      "inventados": [
        "telefono",
        "fondosPublicos",
        "descripcion",
        "horarios",
        "referenteRol",
        "correo",
        "lat"
      ]
    },
    {
      "id": "org-4",
      "nombre": "Los pingüinos Hakuna Matata",
      "tipos": [
        "jardin"
      ],
      "tipoOtro": "",
      "personeria": "otra",
      "personeriaDetalle": "",
      "referente": "Valdéz Patricia",
      "referenteRol": "Referente de la organización",
      "descripcion": "Organización que trabaja con actividades artísticas, apoyo escolar y espacio terapéutico.",
      "horarios": "Lunes a viernes de 9 a 17",
      "actividades": [
        "artisticas",
        "apoyo",
        "terapeutico",
        "consumo",
        "generos",
        "comunicacion"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 47,
        "jovenes": 20,
        "adultxs": 70
      },
      "alcance": "barrial",
      "educadorxs": {
        "total": 15,
        "mujeres": 5,
        "varones": 10,
        "otrxs": ""
      },
      "localidad": "Loma Hermosa",
      "provincia": "Buenos Aires",
      "direccion": "Paraná 6430",
      "lat": -34.56275,
      "lng": -58.60008,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "telefono": "(011) 0000-0004",
      "correo": "contacto@organizacion-4.example",
      "whatsappPublico": false,
      "redes": {
        "facebook": "Tienen, falta el dato",
        "instagram": "Tienen, falta el dato",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "prestado",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "ninguno"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "ninguno"
      ],
      "fondosPrivadosDetalle": "",
      "estado": "aprobada",
      "actualizada": "2026-09-25",
      "inventados": [
        "actividadesNuevas",
        "actividadesBaja",
        "telefono",
        "fondosPublicos",
        "descripcion",
        "horarios",
        "referenteRol",
        "correo",
        "lat"
      ]
    },
    {
      "id": "org-5",
      "nombre": "Asoc. Mujeres la Colmena",
      "tipos": [
        "jardin"
      ],
      "tipoOtro": "",
      "personeria": "asociacion",
      "personeriaDetalle": "",
      "referente": "Nancy Bonchet",
      "referenteRol": "Referente de la organización",
      "descripcion": "Organización que trabaja con actividades artísticas, apoyo escolar y terminalidad educativa.",
      "horarios": "Lunes a viernes de 9 a 17",
      "actividades": [
        "artisticas",
        "apoyo",
        "fines",
        "generos"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 400,
        "jovenes": 150,
        "adultxs": 20
      },
      "alcance": "barrial",
      "educadorxs": {
        "total": 30,
        "mujeres": 29,
        "varones": 1,
        "otrxs": ""
      },
      "localidad": "Villa Hidalgo",
      "provincia": "Buenos Aires",
      "direccion": "Mitre 284",
      "lat": -34.52587,
      "lng": -58.57652,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "telefono": "(011) 0000-0005",
      "correo": "contacto@organizacion-5.example",
      "whatsappPublico": false,
      "redes": {
        "facebook": "Tienen, falta el dato",
        "instagram": "Tienen, falta el dato",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": "Tienen, falta el dato"
      },
      "actividadesNuevas": "UNSAM",
      "actividadesBaja": "",
      "espacio": "cedido",
      "espacioInfo": "",
      "sueldos": "algunxs",
      "sueldosInfo": "",
      "fondosPublicos": [
        "udi",
        "opnya",
        "envion",
        "alimprov",
        "alimmuni"
      ],
      "fondosPublicosDetalle": "Pnud",
      "fondosPrivados": [
        "individuos"
      ],
      "fondosPrivadosDetalle": "",
      "estado": "aprobada",
      "actualizada": "2026-09-25",
      "inventados": [
        "actividadesBaja",
        "telefono",
        "descripcion",
        "horarios",
        "referenteRol",
        "correo",
        "lat"
      ]
    },
    {
      "id": "org-6",
      "nombre": "8 de Mayo",
      "tipos": [
        "biblioteca"
      ],
      "tipoOtro": "",
      "personeria": "asociacion",
      "personeriaDetalle": "",
      "referente": "Andrea Biscione",
      "referenteRol": "Referente de la organización",
      "descripcion": "Organización que trabaja con apoyo escolar, espacio terapéutico y acompañamiento en consumo problemático.",
      "horarios": "Lunes a viernes de 9 a 17",
      "actividades": [
        "apoyo",
        "terapeutico",
        "consumo",
        "generos",
        "habitat"
      ],
      "actividadesOtras": "Alimentación, educaión y tercera edad",
      "participantes": {
        "ninxs": 80,
        "jovenes": 10,
        "adultxs": 100
      },
      "alcance": "barrial",
      "educadorxs": {
        "total": 8,
        "mujeres": 7,
        "varones": 1,
        "otrxs": ""
      },
      "localidad": "El Libertador",
      "provincia": "Buenos Aires",
      "direccion": "Av Libertador 7914",
      "lat": -34.55201,
      "lng": -58.6144,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "telefono": "(011) 0000-0006",
      "correo": "contacto@organizacion-6.example",
      "whatsappPublico": false,
      "redes": {
        "facebook": "Centro comunitario 8 de mayo",
        "instagram": "8 de mayo",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "actividadesNuevas": "No",
      "actividadesBaja": "Campamentos",
      "espacio": "ocupado",
      "espacioInfo": "",
      "sueldos": "todxs",
      "sueldosInfo": "",
      "fondosPublicos": [
        "udi",
        "alimmuni"
      ],
      "fondosPublicosDetalle": "Otras",
      "fondosPrivados": [
        "ninguno"
      ],
      "fondosPrivadosDetalle": "",
      "estado": "aprobada",
      "actualizada": "2026-09-25",
      "inventados": [
        "telefono",
        "descripcion",
        "horarios",
        "referenteRol",
        "correo",
        "lat"
      ]
    },
    {
      "id": "org-7",
      "nombre": "Defensoria de Laburantes",
      "tipos": [
        "centrodia"
      ],
      "tipoOtro": "",
      "personeria": "tramite",
      "personeriaDetalle": "",
      "referente": "Lucia Daniela Fernandez",
      "referenteRol": "Referente de la organización",
      "descripcion": "Organización que trabaja con actividades artísticas, apoyo escolar y comunicación.",
      "horarios": "Lunes a viernes de 9 a 17",
      "actividades": [
        "artisticas",
        "apoyo",
        "comunicacion",
        "habitat"
      ],
      "actividadesOtras": "Asesoramiento legal",
      "participantes": {
        "ninxs": 20,
        "jovenes": 0,
        "adultxs": 20
      },
      "alcance": "barrial",
      "educadorxs": {
        "total": 8,
        "mujeres": 6,
        "varones": 2,
        "otrxs": ""
      },
      "localidad": "Balvanera",
      "provincia": "Ciudad Autónoma de Buenos Aires",
      "direccion": "Av. Corrientes 2925",
      "lat": -34.60774,
      "lng": -58.39853,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "telefono": "11 6724-4350",
      "correo": "contacto@organizacion-7.example",
      "whatsappPublico": false,
      "redes": {
        "facebook": "",
        "instagram": "Defendoria de laburantes/ Sembrando patria CC",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "actividadesNuevas": "Olla popular",
      "actividadesBaja": "",
      "espacio": "alquilado",
      "espacioInfo": "",
      "sueldos": "masmitad",
      "sueldosInfo": "",
      "fondosPublicos": [
        "ninguno"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "individuos"
      ],
      "fondosPrivadosDetalle": "",
      "estado": "aprobada",
      "actualizada": "2026-09-25",
      "inventados": [
        "actividadesBaja",
        "descripcion",
        "horarios",
        "referenteRol",
        "correo",
        "lat"
      ]
    },
    {
      "id": "org-8",
      "nombre": "Centro Cultural America Mestiza",
      "tipos": [
        "cultural"
      ],
      "tipoOtro": "",
      "personeria": "asociacion",
      "personeriaDetalle": "",
      "referente": "Natalia Quiñones",
      "referenteRol": "Referente de la organización",
      "descripcion": "Organización que trabaja con apoyo escolar y terminalidad educativa.",
      "horarios": "Lunes a viernes de 9 a 17",
      "actividades": [
        "apoyo",
        "fines"
      ],
      "actividadesOtras": "Olla popular y biblioteca",
      "participantes": {
        "ninxs": 10,
        "jovenes": 5,
        "adultxs": 30
      },
      "alcance": "local",
      "educadorxs": {
        "total": 10,
        "mujeres": 7,
        "varones": 3,
        "otrxs": ""
      },
      "localidad": "Barrio 9 de Julio",
      "provincia": "Buenos Aires",
      "direccion": "1 de agosto 7902",
      "lat": -34.53246,
      "lng": -58.58094,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "telefono": "11 2576-9461",
      "correo": "contacto@organizacion-8.example",
      "whatsappPublico": false,
      "redes": {
        "facebook": "América Mestiza",
        "instagram": "Americamestiza",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "actividadesNuevas": "Olla Popular",
      "actividadesBaja": "Talleres de teatro y oficios",
      "espacio": "ocupado",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "alimprov",
        "alimmuni"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "individuos"
      ],
      "fondosPrivadosDetalle": "",
      "estado": "aprobada",
      "actualizada": "2026-09-25",
      "inventados": [
        "descripcion",
        "horarios",
        "referenteRol",
        "correo",
        "lat"
      ]
    },
    {
      "id": "org-9",
      "nombre": "Radio Reconquista",
      "tipos": [
        "otro"
      ],
      "tipoOtro": "Radio comunitaria",
      "personeria": "asociacion",
      "personeriaDetalle": "",
      "referente": "Rafa",
      "referenteRol": "Referente de la organización",
      "descripcion": "Organización que trabaja con actividades artísticas, actividades deportivas y apoyo escolar.",
      "horarios": "Lunes a viernes de 9 a 17",
      "actividades": [
        "artisticas",
        "deportivas",
        "apoyo",
        "medica",
        "terapeutico",
        "consumo",
        "fines",
        "generos",
        "comunicacion",
        "habitat"
      ],
      "actividadesOtras": "Otras actividades",
      "participantes": {
        "ninxs": 20,
        "jovenes": 30,
        "adultxs": 30
      },
      "alcance": "provincial",
      "educadorxs": {
        "total": 5,
        "mujeres": 3,
        "varones": 2,
        "otrxs": ""
      },
      "localidad": "Villa Hidalgo",
      "provincia": "Buenos Aires",
      "direccion": "Villalba 1366",
      "lat": -34.53472,
      "lng": -58.57073,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "telefono": "(011) 0000-0009",
      "correo": "contacto@organizacion-9.example",
      "whatsappPublico": false,
      "redes": {
        "facebook": "Tienen, falta el dato",
        "instagram": "Tienen, falta el dato",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": "Tienen, falta el dato"
      },
      "actividadesNuevas": "No",
      "actividadesBaja": "",
      "espacio": "cedido",
      "espacioInfo": "",
      "sueldos": "mitad",
      "sueldosInfo": "",
      "fondosPublicos": [
        "alimmuni",
        "udi"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "otros"
      ],
      "fondosPrivadosDetalle": "",
      "estado": "aprobada",
      "actualizada": "2026-09-25",
      "inventados": [
        "actividadesBaja",
        "participantes",
        "educadorxs",
        "telefono",
        "descripcion",
        "horarios",
        "referenteRol",
        "correo",
        "lat",
        "tipoOtro"
      ]
    },
    {
      "id": "org-10",
      "nombre": "Mesa reconquista/ UNSAM",
      "tipos": [
        "otro"
      ],
      "tipoOtro": "Mesa de organizaciones",
      "personeria": "ninguna",
      "personeriaDetalle": "",
      "referente": "Ernesto Paret",
      "referenteRol": "Referente de la organización",
      "descripcion": "Organización que trabaja con actividades artísticas, actividades deportivas y apoyo escolar.",
      "horarios": "Lunes a viernes de 9 a 17",
      "actividades": [
        "artisticas",
        "deportivas",
        "apoyo",
        "terapeutico",
        "consumo",
        "fines",
        "generos",
        "comunicacion",
        "habitat"
      ],
      "actividadesOtras": "Otras actividades",
      "participantes": {
        "ninxs": 20,
        "jovenes": 300,
        "adultxs": 400
      },
      "alcance": "local",
      "educadorxs": {
        "total": 50,
        "mujeres": 30,
        "varones": 20,
        "otrxs": ""
      },
      "localidad": "General San Martín",
      "provincia": "Buenos Aires",
      "direccion": "",
      "lat": -34.58323,
      "lng": -58.54468,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "telefono": "(011) 0000-0010",
      "correo": "contacto@organizacion-10.example",
      "whatsappPublico": false,
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "actividadesNuevas": "No",
      "actividadesBaja": "No",
      "espacio": "propio",
      "espacioInfo": "",
      "sueldos": "masmitad",
      "sueldosInfo": "",
      "fondosPublicos": [
        "opnya",
        "envion",
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "ninguno"
      ],
      "fondosPrivadosDetalle": "",
      "estado": "aprobada",
      "actualizada": "2026-09-25",
      "inventados": [
        "telefono",
        "descripcion",
        "horarios",
        "referenteRol",
        "correo",
        "lat",
        "tipoOtro"
      ]
    },
    {
      "id": "org-11",
      "nombre": "Biblioteca popular de curita",
      "tipos": [
        "biblioteca"
      ],
      "tipoOtro": "",
      "personeria": "ninguna",
      "personeriaDetalle": "",
      "referente": "Nair Rodriguez-Micaela Dasilva",
      "referenteRol": "Referente de la organización",
      "descripcion": "Organización que trabaja con actividades artísticas y apoyo escolar.",
      "horarios": "Lunes a viernes de 9 a 17",
      "actividades": [
        "artisticas",
        "apoyo"
      ],
      "actividadesOtras": "Otras actividades",
      "participantes": {
        "ninxs": 12,
        "jovenes": 2,
        "adultxs": 10
      },
      "alcance": "local",
      "educadorxs": {
        "total": 6,
        "mujeres": 4,
        "varones": 2,
        "otrxs": ""
      },
      "localidad": "Barrio Lanzone",
      "provincia": "Buenos Aires",
      "direccion": "Gabriela Mistral 8056",
      "lat": -34.53699,
      "lng": -58.57046,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "telefono": "11 7004-5664",
      "correo": "contacto@organizacion-11.example",
      "whatsappPublico": false,
      "redes": {
        "facebook": "",
        "instagram": "Biblio.curita",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "actividadesNuevas": "Taller de fanzine - presentación de libros",
      "actividadesBaja": "taller de artes plasticas",
      "espacio": "cedido",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "opnya"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "ninguno"
      ],
      "fondosPrivadosDetalle": "",
      "estado": "aprobada",
      "actualizada": "2026-09-25",
      "inventados": [
        "descripcion",
        "horarios",
        "referenteRol",
        "correo",
        "lat"
      ]
    },
    {
      "id": "org-12",
      "nombre": "Escucha Activa Mujeres y Disidencias",
      "tipos": [
        "centrodia"
      ],
      "tipoOtro": "",
      "personeria": "otra",
      "personeriaDetalle": "",
      "referente": "Nair Rodriguez-Micaela Dasilva",
      "referenteRol": "Referente de la organización",
      "descripcion": "Organización que trabaja con actividades artísticas, apoyo escolar y acompañamiento en consumo problemático.",
      "horarios": "Lunes a viernes de 9 a 17",
      "actividades": [
        "artisticas",
        "apoyo",
        "consumo",
        "generos"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 0,
        "jovenes": 0,
        "adultxs": 30
      },
      "alcance": "local",
      "educadorxs": {
        "total": 10,
        "mujeres": 7,
        "varones": 3,
        "otrxs": ""
      },
      "localidad": "Barrio Lanzone",
      "provincia": "Buenos Aires",
      "direccion": "Gabriela Mistral 8056",
      "lat": -34.5366,
      "lng": -58.58145,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "telefono": "11 5972-8826",
      "correo": "contacto@organizacion-12.example",
      "whatsappPublico": false,
      "redes": {
        "facebook": "",
        "instagram": "puntosdeencuentro_ok",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "actividadesNuevas": "Cine debate",
      "actividadesBaja": "No",
      "espacio": "cedido",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "ninguno"
      ],
      "fondosPrivadosDetalle": "",
      "estado": "aprobada",
      "actualizada": "2026-09-25",
      "inventados": [
        "personeria",
        "participantes",
        "fondosPrivados",
        "descripcion",
        "horarios",
        "referenteRol",
        "correo",
        "lat"
      ]
    },
    {
      "id": "org-13",
      "nombre": "Orquesta estable Radio Reconquista",
      "tipos": [
        "centrodia"
      ],
      "tipoOtro": "",
      "personeria": "asociacion",
      "personeriaDetalle": "",
      "referente": "Daniela Saez Felué",
      "referenteRol": "Referente de la organización",
      "descripcion": "Organización que trabaja con actividades artísticas y géneros y diversidades.",
      "horarios": "Lunes a viernes de 9 a 17",
      "actividades": [
        "artisticas",
        "generos"
      ],
      "actividadesOtras": "Otras actividades",
      "participantes": {
        "ninxs": 6,
        "jovenes": 40,
        "adultxs": 15
      },
      "alcance": "municipal",
      "educadorxs": {
        "total": 11,
        "mujeres": 4,
        "varones": 7,
        "otrxs": ""
      },
      "localidad": "Villa José León Suárez",
      "provincia": "Buenos Aires",
      "direccion": "Villalba 1366",
      "lat": -34.53521,
      "lng": -58.57233,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "telefono": "(011) 0000-0013",
      "correo": "contacto@organizacion-13.example",
      "whatsappPublico": false,
      "redes": {
        "facebook": "Orquesta estable de radio Reconquista",
        "instagram": "La estable",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "propio",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "opnya",
        "envion"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "otros"
      ],
      "fondosPrivadosDetalle": "",
      "estado": "aprobada",
      "actualizada": "2026-09-25",
      "inventados": [
        "actividadesNuevas",
        "actividadesBaja",
        "telefono",
        "descripcion",
        "horarios",
        "referenteRol",
        "correo",
        "lat"
      ]
    }
  ];

  /* Cuentas habilitadas (simuladas): una por organización, más la coordinación. */
  window.RED_USUARIOS = [
    {
      "email": "org-1@example.com",
      "nombre": "Cuenta de ejemplo",
      "rol": "org",
      "orgId": "org-1"
    },
    {
      "email": "org-2@example.com",
      "nombre": "Cuenta de ejemplo",
      "rol": "org",
      "orgId": "org-2"
    },
    {
      "email": "org-3@example.com",
      "nombre": "Cuenta de ejemplo",
      "rol": "org",
      "orgId": "org-3"
    },
    {
      "email": "org-4@example.com",
      "nombre": "Cuenta de ejemplo",
      "rol": "org",
      "orgId": "org-4"
    },
    {
      "email": "org-5@example.com",
      "nombre": "Cuenta de ejemplo",
      "rol": "org",
      "orgId": "org-5"
    },
    {
      "email": "org-6@example.com",
      "nombre": "Cuenta de ejemplo",
      "rol": "org",
      "orgId": "org-6"
    },
    {
      "email": "org-7@example.com",
      "nombre": "Cuenta de ejemplo",
      "rol": "org",
      "orgId": "org-7"
    },
    {
      "email": "org-8@example.com",
      "nombre": "Cuenta de ejemplo",
      "rol": "org",
      "orgId": "org-8"
    },
    {
      "email": "org-9@example.com",
      "nombre": "Cuenta de ejemplo",
      "rol": "org",
      "orgId": "org-9"
    },
    {
      "email": "org-10@example.com",
      "nombre": "Cuenta de ejemplo",
      "rol": "org",
      "orgId": "org-10"
    },
    {
      "email": "org-11@example.com",
      "nombre": "Cuenta de ejemplo",
      "rol": "org",
      "orgId": "org-11"
    },
    {
      "email": "org-12@example.com",
      "nombre": "Cuenta de ejemplo",
      "rol": "org",
      "orgId": "org-12"
    },
    {
      "email": "org-13@example.com",
      "nombre": "Cuenta de ejemplo",
      "rol": "org",
      "orgId": "org-13"
    },
    {
      "email": "coordinacion.red@example.com",
      "nombre": "Coordinación de la red",
      "rol": "coord"
    }
  ];

  /* Cuentas que aparecen en el selector simulado de "Ingresar con Google". */
  window.RED_CUENTAS_DEMO = [
    {
      "email": "org-1@example.com",
      "nombre": "Cuenta de ejemplo",
      "nota": "Escuela Popular de Música"
    },
    {
      "email": "org-3@example.com",
      "nombre": "Cuenta de ejemplo",
      "nota": "Biblioteca popular la Carcova"
    },
    {
      "email": "coordinacion.red@example.com",
      "nombre": "Coordinación de la red",
      "nota": "Coordinación"
    },
    {
      "email": "no.habilitada@example.com",
      "nombre": "Cuenta no habilitada",
      "nota": "Cuenta no habilitada"
    }
  ];

  /* Convocatorias inventadas, para mostrar la agenda. respondieron: organizaciones que tocaron "Nos sumamos" */
  window.RED_AVISOS = [
    {
      "id": "av-1",
      "orgId": "org-3",
      "clase": "encuentro",
      "fecha": "2026-09-18",
      "cuando": "2026-10-04",
      "lat": -34.52527,
      "lng": -58.57993,
      "inventada": true,
      "titulo": "Encuentro de educadorxs de la zona",
      "detalle": "Convocatoria inventada para mostrar cómo funciona la agenda.",
      "respondieron": [
        "org-5",
        "org-8"
      ]
    },
    {
      "id": "av-2",
      "orgId": "org-5",
      "clase": "jornada",
      "fecha": "2026-09-10",
      "cuando": "2026-10-11",
      "lat": -34.52587,
      "lng": -58.57652,
      "inventada": true,
      "titulo": "Jornada de trabajo comunitario",
      "detalle": "Convocatoria inventada para mostrar cómo funciona la agenda.",
      "respondieron": [
        "org-11"
      ]
    }
  ];
  /* Datos de ejemplo anteriores a la encuesta: todo esto es FICTICIO y el sitio lo marca así. */
  window.RED_ORGS = window.RED_ORGS.concat([
    {
      "id": "demo-1",
      "provincia": "Buenos Aires",
      "lat": -34.6551,
      "lng": -58.38597,
      "ubicacionPublica": "zona",
      "ubicacionRed": "exacta",
      "direccion": "Pasaje Los Aromos 245",
      "tipoOtro": "",
      "telefono": "(011) 15-0000-1001",
      "correo": "contacto@ejemplo-1.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-08",
      "personeria": "tramite",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo",
        "artisticas",
        "deportivas"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 70,
        "jovenes": 15,
        "adultxs": 9
      },
      "alcance": "barrial",
      "redes": {
        "facebook": "Casa del Niño Semillitas",
        "instagram": "@casasemillitas",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": true,
      "educadorxs": {
        "total": 8,
        "mujeres": 5,
        "varones": 3,
        "otrxs": 0
      },
      "referenteRol": "Educadorx a cargo",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "prestado",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "empresas"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Casa del Niño Semillitas",
      "localidad": "Avellaneda",
      "referente": "Marta Giménez",
      "horarios": "Lunes a viernes de 8 a 18",
      "descripcion": "Casa del niño con desayuno, almuerzo y merienda. Apoyo escolar a la tarde y taller de huerta los sábados.",
      "tipos": [
        "casaninx"
      ],
      "ficticia": true
    },
    {
      "id": "demo-2",
      "provincia": "Buenos Aires",
      "lat": -34.50251,
      "lng": -58.75001,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(012) 15-0000-1002",
      "correo": "contacto@ejemplo-2.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-15",
      "personeria": "ninguna",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 60,
        "jovenes": 0,
        "adultxs": 8
      },
      "alcance": "municipal",
      "redes": {
        "facebook": "",
        "instagram": "@merendero.losgurises",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 13,
        "mujeres": 8,
        "varones": 5,
        "otrxs": 0
      },
      "referenteRol": "Equipo de conducción",
      "actividadesNuevas": "Taller de huerta",
      "actividadesBaja": "",
      "espacio": "cedido",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "ninguno"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Merendero Los Gurises",
      "tipos": [
        "comedor",
        "centrodia"
      ],
      "localidad": "José C. Paz",
      "referente": "Graciela Ortiz",
      "horarios": "Lunes, miércoles y viernes de 16 a 19",
      "descripcion": "Merendero barrial que funciona en la casa de una vecina. Leche, pan casero y juegos después de la escuela.",
      "ficticia": true
    },
    {
      "id": "demo-3",
      "provincia": "Buenos Aires",
      "lat": -34.78961,
      "lng": -58.28902,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(013) 15-0000-1003",
      "correo": "contacto@ejemplo-3.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-22",
      "personeria": "cooperativa",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo",
        "habitat"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 96,
        "jovenes": 44,
        "adultxs": 42
      },
      "alcance": "barrial",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 4,
        "mujeres": 3,
        "varones": 1,
        "otrxs": 0
      },
      "referenteRol": "Fundadorx",
      "actividadesNuevas": "",
      "actividadesBaja": "Torneo de fútbol de los sábados: no hay quien lo coordine",
      "espacio": "alquilado",
      "espacioInfo": "",
      "sueldos": "algunxs",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "fundaciones"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Comedor Juanito Laguna",
      "localidad": "Florencio Varela",
      "referente": "Héctor Ramírez",
      "horarios": "Lunes a sábado, almuerzo de 12 a 14",
      "descripcion": "Comedor comunitario que da almuerzo a familias del barrio. Olla popular los sábados.",
      "tipos": [
        "comedor"
      ],
      "ficticia": true
    },
    {
      "id": "demo-4",
      "provincia": "Buenos Aires",
      "lat": -34.70274,
      "lng": -58.24719,
      "ubicacionPublica": "exacta",
      "ubicacionRed": "exacta",
      "direccion": "Calle 844 N.º 1520",
      "tipoOtro": "",
      "telefono": "(014) 15-0000-1004",
      "correo": "contacto@ejemplo-4.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-05",
      "personeria": "asociacion",
      "personeriaDetalle": "",
      "actividades": [
        "artisticas",
        "comunicacion"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 32,
        "jovenes": 38,
        "adultxs": 6
      },
      "alcance": "local",
      "redes": {
        "facebook": "",
        "instagram": "@laronda.cultural",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": true,
      "educadorxs": {
        "total": 9,
        "mujeres": 6,
        "varones": 3,
        "otrxs": 0
      },
      "referenteRol": "Presidencia de la asociación civil",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "compartido",
      "espacioInfo": "",
      "sueldos": "mitad",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "individuos"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Centro Cultural La Ronda",
      "localidad": "Quilmes",
      "referente": "Lucía Paredes",
      "horarios": "Martes a sábado de 15 a 20",
      "descripcion": "Murga, teatro, radio y serigrafía. Los chicos arman su propio programa de radio cada viernes.",
      "tipos": [
        "cultural"
      ],
      "ficticia": true
    },
    {
      "id": "demo-5",
      "provincia": "Buenos Aires",
      "lat": -34.90602,
      "lng": -57.95531,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(015) 15-0000-1005",
      "correo": "contacto@ejemplo-5.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-12",
      "personeria": "asociacion",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo",
        "terapeutico",
        "oficios"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 14,
        "jovenes": 10,
        "adultxs": 3
      },
      "alcance": "intermunicipal",
      "redes": {
        "facebook": "Hogar Tres Veces Casa",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 14,
        "mujeres": 9,
        "varones": 4,
        "otrxs": 1
      },
      "referenteRol": "Coordinación general",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "propio",
      "espacioInfo": "",
      "sueldos": "algunxs",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "empresas"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Hogar Tres Veces Casa",
      "localidad": "La Plata",
      "referente": "Padre Julián Moyano",
      "horarios": "Convivencial, 24 horas",
      "descripcion": "Casa convivencial para chicos y chicas. Panadería y huerta como proyectos productivos.",
      "tipos": [
        "hogar"
      ],
      "ficticia": true
    },
    {
      "id": "demo-6",
      "provincia": "Buenos Aires",
      "lat": -34.75292,
      "lng": -58.21707,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(016) 15-0000-1006",
      "correo": "contacto@ejemplo-6.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-19",
      "personeria": "fundacion",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo",
        "fines",
        "generos"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 31,
        "jovenes": 14,
        "adultxs": 6
      },
      "alcance": "barrial",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 5,
        "mujeres": 3,
        "varones": 2,
        "otrxs": 0
      },
      "referenteRol": "Educadorx a cargo",
      "actividadesNuevas": "Taller de huerta",
      "actividadesBaja": "",
      "espacio": "propio",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "ninguno"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "religiosas"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Apoyo Escolar Pizarrón Abierto",
      "localidad": "Berazategui",
      "referente": "Noelia Sosa",
      "horarios": "Lunes a jueves de 14 a 17",
      "descripcion": "Apoyo escolar primaria y secundaria. Biblioteca popular abierta al barrio.",
      "tipos": [
        "educativo"
      ],
      "ficticia": true
    },
    {
      "id": "demo-7",
      "provincia": "Buenos Aires",
      "lat": -34.64772,
      "lng": -58.7776,
      "ubicacionPublica": "zona",
      "ubicacionRed": "exacta",
      "direccion": "Av. del Potrero 3300",
      "tipoOtro": "",
      "telefono": "(017) 15-0000-1007",
      "correo": "contacto@ejemplo-7.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-02",
      "personeria": "tramite",
      "personeriaDetalle": "",
      "actividades": [
        "deportivas"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 74,
        "jovenes": 46,
        "adultxs": 20
      },
      "alcance": "municipal",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": true,
      "educadorxs": {
        "total": 10,
        "mujeres": 7,
        "varones": 3,
        "otrxs": 0
      },
      "referenteRol": "Equipo de conducción",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "prestado",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "ninguno"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Club Social El Potrero",
      "localidad": "Moreno",
      "referente": "Walter Benítez",
      "horarios": "Martes, jueves y sábados de 17 a 20",
      "descripcion": "Fútbol mixto, hockey y merienda después del entrenamiento. Torneos con otros clubes de barrio.",
      "tipos": [
        "club"
      ],
      "ficticia": true
    },
    {
      "id": "demo-8",
      "provincia": "Buenos Aires",
      "lat": -34.64938,
      "lng": -58.77501,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(018) 15-0000-1008",
      "correo": "contacto@ejemplo-8.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-09",
      "personeria": "ninguna",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo",
        "terapeutico",
        "oficios"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 50,
        "jovenes": 0,
        "adultxs": 4
      },
      "alcance": "barrial",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 15,
        "mujeres": 10,
        "varones": 5,
        "otrxs": 0
      },
      "referenteRol": "Fundadorx",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "cedido",
      "espacioInfo": "",
      "sueldos": "algunxs",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "individuos"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Casa Abierta Paso del Rey",
      "localidad": "Paso del Rey",
      "referente": "Silvia Acosta",
      "horarios": "Lunes a viernes de 7 a 17",
      "descripcion": "Jardín comunitario y casa del niño. Acompañamiento a las familias en trámites.",
      "tipos": [
        "hogar"
      ],
      "ficticia": true
    },
    {
      "id": "demo-9",
      "provincia": "Buenos Aires",
      "lat": -34.53917,
      "lng": -58.68357,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(019) 15-0000-1009",
      "correo": "contacto@ejemplo-9.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-16",
      "personeria": "cooperativa",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo",
        "habitat"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 55,
        "jovenes": 0,
        "adultxs": 6
      },
      "alcance": "local",
      "redes": {
        "facebook": "Merendero Pancitas Felices",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 6,
        "mujeres": 4,
        "varones": 2,
        "otrxs": 0
      },
      "referenteRol": "Presidencia de la asociación civil",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "alquilado",
      "espacioInfo": "",
      "sueldos": "mitad",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "empresas"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Merendero Pancitas Felices",
      "localidad": "Los Polvorines",
      "referente": "Rosa Villalba",
      "horarios": "Martes y jueves de 16 a 18:30",
      "descripcion": "Merienda y taller de lectura. Funciona en el salón de la parroquia del barrio.",
      "tipos": [
        "comedor"
      ],
      "ficticia": true
    },
    {
      "id": "demo-10",
      "provincia": "Buenos Aires",
      "lat": -34.55898,
      "lng": -58.73394,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(020) 15-0000-1010",
      "correo": "contacto@ejemplo-10.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-23",
      "personeria": "asociacion",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo",
        "oficios",
        "terapeutico"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 0,
        "jovenes": 35,
        "adultxs": 5
      },
      "alcance": "intermunicipal",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": true,
      "educadorxs": {
        "total": 11,
        "mujeres": 7,
        "varones": 3,
        "otrxs": 1
      },
      "referenteRol": "Coordinación general",
      "actividadesNuevas": "Taller de huerta",
      "actividadesBaja": "Torneo de fútbol de los sábados: no hay quien lo coordine",
      "espacio": "compartido",
      "espacioInfo": "",
      "sueldos": "algunxs",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "religiosas"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Taller de Oficios Manos del Barrio",
      "localidad": "San Miguel",
      "referente": "Jorge Almada",
      "horarios": "Lunes a viernes de 9 a 13",
      "descripcion": "Carpintería, electricidad y herrería para adolescentes. Emprendimiento de muebles a pedido.",
      "tipos": [
        "centrodia"
      ],
      "ficticia": true
    },
    {
      "id": "demo-11",
      "provincia": "Buenos Aires",
      "lat": -34.78797,
      "lng": -58.6256,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(021) 15-0000-1011",
      "correo": "contacto@ejemplo-11.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-06",
      "personeria": "asociacion",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 137,
        "jovenes": 63,
        "adultxs": 60
      },
      "alcance": "barrial",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 16,
        "mujeres": 10,
        "varones": 6,
        "otrxs": 0
      },
      "referenteRol": "Educadorx a cargo",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "propio",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "fundaciones"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Comedor Nuestra Señora del Barrio",
      "localidad": "González Catán",
      "referente": "Carmen Duarte",
      "horarios": "Lunes a viernes, almuerzo y cena",
      "descripcion": "Comedor con más de 200 raciones diarias. Ropero comunitario los miércoles.",
      "tipos": [
        "comedor"
      ],
      "ficticia": true
    },
    {
      "id": "demo-12",
      "provincia": "Buenos Aires",
      "lat": -34.77679,
      "lng": -58.41887,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(022) 15-0000-1012",
      "correo": "contacto@ejemplo-12.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-13",
      "personeria": "fundacion",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo",
        "oficios",
        "terapeutico",
        "generos"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 205,
        "jovenes": 95,
        "adultxs": 24
      },
      "alcance": "municipal",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 7,
        "mujeres": 5,
        "varones": 2,
        "otrxs": 0
      },
      "referenteRol": "Equipo de conducción",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "propio",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "ninguno"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "ninguno"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Salita Comunitaria Ternura",
      "localidad": "Lomas de Zamora",
      "referente": "Dra. Paula Ferreyra",
      "horarios": "Lunes a viernes de 9 a 15",
      "descripcion": "Controles de niño sano, vacunación y talleres de salud sexual integral junto a promotoras del barrio.",
      "tipos": [
        "centrodia"
      ],
      "ficticia": true
    },
    {
      "id": "demo-13",
      "provincia": "Buenos Aires",
      "lat": -38.01814,
      "lng": -57.52803,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(023) 15-0000-1013",
      "correo": "contacto@ejemplo-13.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-20",
      "personeria": "tramite",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo",
        "oficios",
        "terapeutico"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 6,
        "jovenes": 34,
        "adultxs": 4
      },
      "alcance": "barrial",
      "redes": {
        "facebook": "Casa de Jóvenes Mar y Arena",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": true,
      "educadorxs": {
        "total": 12,
        "mujeres": 8,
        "varones": 4,
        "otrxs": 0
      },
      "referenteRol": "Fundadorx",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "prestado",
      "espacioInfo": "",
      "sueldos": "algunxs",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "empresas"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Casa de Jóvenes Mar y Arena",
      "localidad": "Mar del Plata",
      "referente": "Federico Lagos",
      "horarios": "Lunes a viernes de 14 a 20",
      "descripcion": "Espacio de encuentro para adolescentes: música, surf social y terminalidad educativa.",
      "tipos": [
        "centrodia"
      ],
      "ficticia": true
    },
    {
      "id": "demo-14",
      "provincia": "Buenos Aires",
      "lat": -38.72586,
      "lng": -62.28131,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(024) 15-0000-1014",
      "correo": "contacto@ejemplo-14.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-03",
      "personeria": "ninguna",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 40,
        "jovenes": 8,
        "adultxs": 7
      },
      "alcance": "local",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 3,
        "mujeres": 2,
        "varones": 1,
        "otrxs": 0
      },
      "referenteRol": "Presidencia de la asociación civil",
      "actividadesNuevas": "Taller de huerta",
      "actividadesBaja": "",
      "espacio": "cedido",
      "espacioInfo": "",
      "sueldos": "mitad",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "religiosas"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Merendero Vientos del Sur",
      "localidad": "Bahía Blanca",
      "referente": "Andrea Molina",
      "horarios": "Lunes a viernes de 16 a 18",
      "descripcion": "Merienda, apoyo escolar y juegos. Hacemos colecta de abrigo todos los inviernos.",
      "tipos": [
        "comedor"
      ],
      "ficticia": true
    },
    {
      "id": "demo-15",
      "provincia": "Santa Fe",
      "lat": -32.94297,
      "lng": -60.64808,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(025) 15-0000-1015",
      "correo": "contacto@ejemplo-15.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-10",
      "personeria": "cooperativa",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo",
        "oficios",
        "terapeutico",
        "habitat"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 53,
        "jovenes": 37,
        "adultxs": 15
      },
      "alcance": "intermunicipal",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 8,
        "mujeres": 5,
        "varones": 2,
        "otrxs": 1
      },
      "referenteRol": "Coordinación general",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "alquilado",
      "espacioInfo": "",
      "sueldos": "algunxs",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "fundaciones"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Centro Comunitario Los Pibes del Sur",
      "localidad": "Rosario",
      "referente": "Matías Correa",
      "horarios": "Lunes a viernes de 14 a 19",
      "descripcion": "Apoyo escolar, biblioteca y taller de rap. Articulamos con la escuela del barrio.",
      "tipos": [
        "centrodia"
      ],
      "ficticia": true
    },
    {
      "id": "demo-16",
      "provincia": "Santa Fe",
      "lat": -31.6248,
      "lng": -60.6957,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(026) 15-0000-1016",
      "correo": "contacto@ejemplo-16.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-17",
      "personeria": "asociacion",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo",
        "terapeutico",
        "oficios"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 12,
        "jovenes": 6,
        "adultxs": 1
      },
      "alcance": "barrial",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": true,
      "educadorxs": {
        "total": 13,
        "mujeres": 8,
        "varones": 5,
        "otrxs": 0
      },
      "referenteRol": "Educadorx a cargo",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "compartido",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "individuos"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Hogar Costa Litoral",
      "localidad": "Santa Fe",
      "referente": "Hna. Beatriz Luján",
      "horarios": "Convivencial, 24 horas",
      "descripcion": "Casa convivencial a orillas del Salado. Huerta y taller de cerámica.",
      "tipos": [
        "hogar"
      ],
      "ficticia": true
    },
    {
      "id": "demo-17",
      "provincia": "Córdoba",
      "lat": -31.40583,
      "lng": -64.19941,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(027) 15-0000-1017",
      "correo": "contacto@ejemplo-17.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-24",
      "personeria": "asociacion",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 109,
        "jovenes": 51,
        "adultxs": 48
      },
      "alcance": "municipal",
      "redes": {
        "facebook": "Comedor La Esperanza",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 4,
        "mujeres": 3,
        "varones": 1,
        "otrxs": 0
      },
      "referenteRol": "Equipo de conducción",
      "actividadesNuevas": "",
      "actividadesBaja": "Torneo de fútbol de los sábados: no hay quien lo coordine",
      "espacio": "propio",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "ninguno"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Comedor La Esperanza",
      "localidad": "Córdoba",
      "referente": "Ramona Quiroga",
      "horarios": "Lunes a sábado de 11:30 a 14",
      "descripcion": "Comedor y copa de leche. Taller de costura para las mamás del barrio.",
      "tipos": [
        "comedor"
      ],
      "ficticia": true
    },
    {
      "id": "demo-18",
      "provincia": "Córdoba",
      "lat": -32.38998,
      "lng": -63.22426,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(028) 15-0000-1018",
      "correo": "contacto@ejemplo-18.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-07",
      "personeria": "fundacion",
      "personeriaDetalle": "",
      "actividades": [
        "deportivas",
        "generos"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 48,
        "jovenes": 27,
        "adultxs": 11
      },
      "alcance": "barrial",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 9,
        "mujeres": 6,
        "varones": 3,
        "otrxs": 0
      },
      "referenteRol": "Fundadorx",
      "actividadesNuevas": "Taller de huerta",
      "actividadesBaja": "",
      "espacio": "propio",
      "espacioInfo": "",
      "sueldos": "algunxs",
      "sueldosInfo": "",
      "fondosPublicos": [
        "ninguno"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "religiosas"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Club de Barrio Los Algarrobos",
      "localidad": "Villa María",
      "referente": "Diego Luna",
      "horarios": "Lunes a viernes de 17 a 20",
      "descripcion": "Básquet, fútbol y vóley. Merienda después de cada entrenamiento.",
      "tipos": [
        "club"
      ],
      "ficticia": true
    },
    {
      "id": "demo-19",
      "provincia": "Mendoza",
      "lat": -32.83233,
      "lng": -68.83977,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(029) 15-0000-1019",
      "correo": "contacto@ejemplo-19.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-14",
      "personeria": "tramite",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo",
        "artisticas",
        "deportivas"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 65,
        "jovenes": 0,
        "adultxs": 11
      },
      "alcance": "local",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": true,
      "educadorxs": {
        "total": 14,
        "mujeres": 9,
        "varones": 5,
        "otrxs": 0
      },
      "referenteRol": "Presidencia de la asociación civil",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "prestado",
      "espacioInfo": "",
      "sueldos": "mitad",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "fundaciones"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Casa de la Niñez Cerro Arco",
      "localidad": "Las Heras",
      "referente": "Estela Pérez",
      "horarios": "Lunes a viernes de 8 a 16",
      "descripcion": "Casa de día con desayuno, almuerzo y talleres de arte.",
      "tipos": [
        "casaninx"
      ],
      "ficticia": true
    },
    {
      "id": "demo-20",
      "provincia": "Mendoza",
      "lat": -32.87479,
      "lng": -68.82404,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(030) 15-0000-1020",
      "correo": "contacto@ejemplo-20.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-21",
      "personeria": "ninguna",
      "personeriaDetalle": "",
      "actividades": [
        "comunicacion",
        "artisticas"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 18,
        "jovenes": 37,
        "adultxs": 4
      },
      "alcance": "intermunicipal",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "@centroculturalacequia",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 5,
        "mujeres": 3,
        "varones": 1,
        "otrxs": 1
      },
      "referenteRol": "Coordinación general",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "cedido",
      "espacioInfo": "",
      "sueldos": "algunxs",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "individuos"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Centro Cultural Acequia",
      "tipos": [
        "radio",
        "cultural"
      ],
      "localidad": "Mendoza",
      "referente": "Tomás Videla",
      "horarios": "Martes a viernes de 16 a 20",
      "descripcion": "Folclore, audiovisual y radio comunitaria.",
      "ficticia": true
    },
    {
      "id": "demo-21",
      "provincia": "San Juan",
      "lat": -31.52836,
      "lng": -68.55812,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(031) 15-0000-1021",
      "correo": "contacto@ejemplo-21.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-04",
      "personeria": "cooperativa",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo",
        "habitat"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 42,
        "jovenes": 0,
        "adultxs": 5
      },
      "alcance": "barrial",
      "redes": {
        "facebook": "Merendero Sol de Zonda",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 10,
        "mujeres": 7,
        "varones": 3,
        "otrxs": 0
      },
      "referenteRol": "Educadorx a cargo",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "alquilado",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "empresas"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Merendero Sol de Zonda",
      "localidad": "San Juan",
      "referente": "Liliana Castro",
      "horarios": "Lunes a viernes de 17 a 19",
      "descripcion": "Merienda y ludoteca. Festejamos juntos los cumpleaños del mes.",
      "tipos": [
        "comedor"
      ],
      "ficticia": true
    },
    {
      "id": "demo-22",
      "provincia": "San Luis",
      "lat": -33.29974,
      "lng": -66.31815,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(032) 15-0000-1022",
      "correo": "contacto@ejemplo-22.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-11",
      "personeria": "asociacion",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo",
        "fines"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 30,
        "jovenes": 8,
        "adultxs": 5
      },
      "alcance": "municipal",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": true,
      "educadorxs": {
        "total": 15,
        "mujeres": 10,
        "varones": 5,
        "otrxs": 0
      },
      "referenteRol": "Equipo de conducción",
      "actividadesNuevas": "Taller de huerta",
      "actividadesBaja": "",
      "espacio": "compartido",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "ninguno"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Apoyo Escolar Las Chacras",
      "localidad": "San Luis",
      "referente": "Mauricio Funes",
      "horarios": "Lunes a jueves de 14:30 a 17:30",
      "descripcion": "Apoyo escolar y alfabetización digital con computadoras donadas.",
      "tipos": [
        "educativo"
      ],
      "ficticia": true
    },
    {
      "id": "demo-23",
      "provincia": "Chaco",
      "lat": -27.46616,
      "lng": -58.99964,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(033) 15-0000-1023",
      "correo": "contacto@ejemplo-23.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-18",
      "personeria": "asociacion",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 123,
        "jovenes": 57,
        "adultxs": 54
      },
      "alcance": "barrial",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 6,
        "mujeres": 4,
        "varones": 2,
        "otrxs": 0
      },
      "referenteRol": "Fundadorx",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "propio",
      "espacioInfo": "",
      "sueldos": "algunxs",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "fundaciones"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Comedor Comunitario Barrio Toba",
      "localidad": "Resistencia",
      "referente": "Celestino Gómez",
      "horarios": "Lunes a viernes, almuerzo",
      "descripcion": "Comedor comunitario en barrio toba. Taller de lengua qom y artesanía.",
      "tipos": [
        "comedor"
      ],
      "ficticia": true
    },
    {
      "id": "demo-24",
      "provincia": "La Pampa",
      "lat": -36.6288,
      "lng": -64.27294,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(034) 15-0000-1024",
      "correo": "contacto@ejemplo-24.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-01",
      "personeria": "fundacion",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo",
        "artisticas",
        "deportivas",
        "generos"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 47,
        "jovenes": 5,
        "adultxs": 4
      },
      "alcance": "local",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 11,
        "mujeres": 7,
        "varones": 4,
        "otrxs": 0
      },
      "referenteRol": "Presidencia de la asociación civil",
      "actividadesNuevas": "",
      "actividadesBaja": "Torneo de fútbol de los sábados: no hay quien lo coordine",
      "espacio": "propio",
      "espacioInfo": "",
      "sueldos": "mitad",
      "sueldosInfo": "",
      "fondosPublicos": [
        "ninguno"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "individuos"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Casa del Niño Caldenes",
      "localidad": "Santa Rosa",
      "referente": "Ana Berardi",
      "horarios": "Lunes a viernes de 8 a 17",
      "descripcion": "Casa de día, huerta agroecológica y cría de gallinas.",
      "tipos": [
        "casaninx"
      ],
      "ficticia": true
    },
    {
      "id": "demo-25",
      "provincia": "Río Negro",
      "lat": -41.15001,
      "lng": -71.31432,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(035) 15-0000-1025",
      "correo": "contacto@ejemplo-25.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-08",
      "personeria": "tramite",
      "personeriaDetalle": "",
      "actividades": [
        "artisticas",
        "comunicacion"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 6,
        "jovenes": 39,
        "adultxs": 5
      },
      "alcance": "intermunicipal",
      "redes": {
        "facebook": "Centro Juvenil Cordillera",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": true,
      "educadorxs": {
        "total": 16,
        "mujeres": 10,
        "varones": 5,
        "otrxs": 1
      },
      "referenteRol": "Coordinación general",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "prestado",
      "espacioInfo": "",
      "sueldos": "algunxs",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "empresas"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Centro Juvenil Cordillera",
      "localidad": "Bariloche",
      "referente": "Nahuel Epulef",
      "horarios": "Lunes a sábado de 15 a 21",
      "descripcion": "Espacio joven en el Alto: música, murales y preparación para el primer empleo.",
      "tipos": [
        "cultural"
      ],
      "ficticia": true
    },
    {
      "id": "demo-26",
      "provincia": "Río Negro",
      "lat": -39.0513,
      "lng": -67.586,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(036) 15-0000-1026",
      "correo": "contacto@ejemplo-26.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-15",
      "personeria": "ninguna",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 50,
        "jovenes": 0,
        "adultxs": 7
      },
      "alcance": "barrial",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 7,
        "mujeres": 5,
        "varones": 2,
        "otrxs": 0
      },
      "referenteRol": "Educadorx a cargo",
      "actividadesNuevas": "Taller de huerta",
      "actividadesBaja": "",
      "espacio": "cedido",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "religiosas"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Merendero Chacra y Manzana",
      "localidad": "General Roca",
      "referente": "Soledad Pino",
      "horarios": "Lunes a viernes de 16:30 a 18:30",
      "descripcion": "Merienda con fruta del Alto Valle y taller de cocina con las familias.",
      "tipos": [
        "comedor"
      ],
      "ficticia": true
    },
    {
      "id": "demo-27",
      "provincia": "Chubut",
      "lat": -43.26521,
      "lng": -65.29593,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(037) 15-0000-1027",
      "correo": "contacto@ejemplo-27.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-22",
      "personeria": "cooperativa",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo",
        "artisticas",
        "deportivas",
        "habitat"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 23,
        "jovenes": 13,
        "adultxs": 6
      },
      "alcance": "municipal",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 12,
        "mujeres": 8,
        "varones": 4,
        "otrxs": 0
      },
      "referenteRol": "Equipo de conducción",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "alquilado",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "ninguno"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Casa de Chicxs Valle Inferior",
      "localidad": "Trelew",
      "referente": "Gwen Roberts",
      "horarios": "Lunes a viernes de 14 a 18",
      "descripcion": "Apoyo escolar, merienda y taller de ajedrez.",
      "tipos": [
        "casaninx"
      ],
      "ficticia": true
    },
    {
      "id": "demo-28",
      "provincia": "Chubut",
      "lat": -45.87584,
      "lng": -67.51138,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(038) 15-0000-1028",
      "correo": "contacto@ejemplo-28.org.ar",
      "estado": "aprobada",
      "actualizada": "2026-09-05",
      "personeria": "asociacion",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 89,
        "jovenes": 41,
        "adultxs": 39
      },
      "alcance": "barrial",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": true,
      "educadorxs": {
        "total": 3,
        "mujeres": 2,
        "varones": 1,
        "otrxs": 0
      },
      "referenteRol": "Fundadorx",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "compartido",
      "espacioInfo": "",
      "sueldos": "algunxs",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "individuos"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Comedor Vientos del Golfo",
      "localidad": "Comodoro Rivadavia",
      "referente": "Miguel Ángel Rojas",
      "horarios": "Lunes a sábado, almuerzo y merienda",
      "descripcion": "Comedor en barrio de la zona norte. Ropero y peluquería social una vez por mes.",
      "tipos": [
        "comedor"
      ],
      "ficticia": true
    },
    {
      "id": "demo-29",
      "provincia": "Buenos Aires",
      "lat": -34.66759,
      "lng": -58.34599,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(039) 15-0000-1029",
      "correo": "contacto@ejemplo-29.org.ar",
      "estado": "pendiente",
      "actualizada": "2026-09-12",
      "personeria": "asociacion",
      "personeriaDetalle": "",
      "actividades": [
        "biblioteca",
        "apoyo"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 22,
        "jovenes": 8,
        "adultxs": 3
      },
      "alcance": "local",
      "redes": {
        "facebook": "Biblioteca Popular Letras al Viento",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 8,
        "mujeres": 5,
        "varones": 3,
        "otrxs": 0
      },
      "referenteRol": "Presidencia de la asociación civil",
      "actividadesNuevas": "",
      "actividadesBaja": "",
      "espacio": "propio",
      "espacioInfo": "",
      "sueldos": "mitad",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "empresas"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Biblioteca Popular Letras al Viento",
      "localidad": "Avellaneda",
      "referente": "Hernán Lucero",
      "horarios": "Sábados de 10 a 13",
      "descripcion": "Biblioteca popular con cuentacuentos y apoyo escolar los sábados.",
      "emailSolicitud": "hernan.lucero@example.com",
      "mensaje": "Participamos de los encuentros de zona sur desde 2024. Nos conoce Casa del Niño Semillitas.",
      "tipos": [
        "biblioteca"
      ],
      "ficticia": true
    },
    {
      "id": "demo-30",
      "provincia": "Santa Fe",
      "lat": -32.94175,
      "lng": -60.67197,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(040) 15-0000-1030",
      "correo": "contacto@ejemplo-30.org.ar",
      "estado": "pendiente",
      "actualizada": "2026-09-19",
      "personeria": "fundacion",
      "personeriaDetalle": "",
      "actividades": [
        "apoyo",
        "generos"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 62,
        "jovenes": 28,
        "adultxs": 27
      },
      "alcance": "intermunicipal",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": false,
      "educadorxs": {
        "total": 13,
        "mujeres": 8,
        "varones": 4,
        "otrxs": 1
      },
      "referenteRol": "Coordinación general",
      "actividadesNuevas": "Taller de huerta",
      "actividadesBaja": "",
      "espacio": "propio",
      "espacioInfo": "",
      "sueldos": "algunxs",
      "sueldosInfo": "",
      "fondosPublicos": [
        "ninguno"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "religiosas"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Olla Popular Barrio Obrero",
      "localidad": "Rosario",
      "referente": "Carla Benítez",
      "horarios": "Martes y viernes, cena",
      "descripcion": "Olla popular que arrancó en 2024. Queremos sumarnos a la red.",
      "emailSolicitud": "olla.barrioobrero@example.com",
      "mensaje": "Fuimos a la marcha de noviembre con el Centro Comunitario Los Pibes del Sur y queremos sumarnos a la red.",
      "tipos": [
        "comedor"
      ],
      "ficticia": true
    },
    {
      "id": "demo-31",
      "provincia": "Mendoza",
      "lat": -32.87994,
      "lng": -68.82388,
      "ubicacionPublica": "zona",
      "ubicacionRed": "zona",
      "direccion": "",
      "tipoOtro": "",
      "telefono": "(041) 15-0000-1031",
      "correo": "contacto@ejemplo-31.org.ar",
      "estado": "pendiente",
      "actualizada": "2026-09-02",
      "personeria": "tramite",
      "personeriaDetalle": "",
      "actividades": [
        "deportivas"
      ],
      "actividadesOtras": "",
      "participantes": {
        "ninxs": 47,
        "jovenes": 13,
        "adultxs": 10
      },
      "alcance": "barrial",
      "redes": {
        "facebook": "",
        "instagram": "",
        "waCanal": "",
        "youtube": "",
        "web": "",
        "otra": ""
      },
      "whatsappPublico": true,
      "educadorxs": {
        "total": 4,
        "mujeres": 3,
        "varones": 1,
        "otrxs": 0
      },
      "referenteRol": "Educadorx a cargo",
      "actividadesNuevas": "",
      "actividadesBaja": "Torneo de fútbol de los sábados: no hay quien lo coordine",
      "espacio": "prestado",
      "espacioInfo": "",
      "sueldos": "ningunx",
      "sueldosInfo": "",
      "fondosPublicos": [
        "universidades",
        "alimprov"
      ],
      "fondosPublicosDetalle": "",
      "fondosPrivados": [
        "fundaciones"
      ],
      "fondosPrivadosDetalle": "",
      "nombre": "Escuelita de Fútbol Los Cóndores",
      "localidad": "Mendoza",
      "referente": "Raúl Aguirre",
      "horarios": "Lunes, miércoles y viernes de 18 a 20",
      "descripcion": "Escuela de fútbol infantil gratuita con merienda.",
      "emailSolicitud": "raul.aguirre@example.com",
      "mensaje": "Somos una escuelita de fútbol gratuita. Todavía no participamos de ningún encuentro de la red.",
      "tipos": [
        "club"
      ],
      "ficticia": true
    }
  ]);

  window.RED_USUARIOS = window.RED_USUARIOS.concat([
    {
      "email": "graciela.ortiz@example.com",
      "nombre": "Graciela Ortiz",
      "rol": "org",
      "orgId": "demo-2"
    },
    {
      "email": "merendero.losgurises@example.com",
      "nombre": "Merendero Los Gurises",
      "rol": "org",
      "orgId": "demo-2"
    },
    {
      "email": "marta.gimenez@example.com",
      "nombre": "Marta Giménez",
      "rol": "org",
      "orgId": "demo-1"
    },
    {
      "email": "lucia.paredes@example.com",
      "nombre": "Lucía Paredes",
      "rol": "org",
      "orgId": "demo-4"
    }
  ]);

  window.RED_CUENTAS_DEMO = window.RED_CUENTAS_DEMO.concat([
    {
      "email": "graciela.ortiz@example.com",
      "nombre": "Graciela Ortiz",
      "nota": "Merendero Los Gurises"
    },
    {
      "email": "marta.gimenez@example.com",
      "nombre": "Marta Giménez",
      "nota": "Casa del Niño Semillitas"
    }
  ]);

  window.RED_AVISOS = window.RED_AVISOS.concat([
    {
      "id": "av-5",
      "orgId": "demo-1",
      "clase": "encuentro",
      "fecha": "2026-09-18",
      "cuando": "2026-10-04",
      "lat": -34.6551,
      "lng": -58.38597,
      "titulo": "Encuentro de educadorxs de zona sur — sábado 4/10",
      "detalle": "Nos juntamos a compartir experiencias de apoyo escolar. Traer algo para compartir. Hay espacio para 40 personas.",
      "respondieron": [
        "demo-6",
        "demo-4",
        "demo-3",
        "demo-12",
        "demo-8",
        "demo-11",
        "demo-9",
        "demo-2",
        "demo-7"
      ],
      "inventada": true
    },
    {
      "id": "av-9",
      "orgId": "demo-15",
      "clase": "jornada",
      "fecha": "2026-09-10",
      "cuando": "2026-09-27",
      "lat": -32.94297,
      "lng": -60.64808,
      "titulo": "Jornada de pintura del centro comunitario",
      "detalle": "Sábado 27/9 pintamos el salón. Invitamos a otras organizaciones de Rosario a sumarse con los chicos.",
      "respondieron": [
        "demo-16",
        "demo-22",
        "demo-17",
        "demo-18",
        "demo-20",
        "demo-21"
      ],
      "inventada": true
    }
  ]);
})();
