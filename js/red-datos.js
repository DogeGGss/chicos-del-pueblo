/**
 * Datos del prototipo "Mapa de la red": las organizaciones salen de la encuesta a organizaciones sociales.
 * Lo que la encuesta no traía se completó a mano para mostrar la herramienta:
 * esos campos están listados en "inventados" y el sitio los marca como inventados.
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
})();
