# Chicxs del Pueblo — historia interactiva y mapa de la red

Micrositio con dos páginas:

- **Historia** (`index.html`): recorre, en diez tramos, la historia del **Movimiento Nacional de los Chicos del Pueblo** en Argentina, desde la Ley Agote de 1919 hasta la red de más de 400 organizaciones que existe hoy.
- **Mapa de la red** (`red.html`): prototipo de herramienta para que las organizaciones de la red se ubiquen en un mapa, cuenten qué hacen y se comuniquen entre sí (qué necesitan, qué pueden ofrecer).

Trabajo elaborado para la materia **Laboratorio Interdisciplinario: Redes sociales y condiciones de vida — las organizaciones sociales en acción** (Universidad Nacional de General Sarmiento).

**Grupo 2:** Jonathan Berazza, Juan Tula, Ulises Fonseca y Valentina Arri.

## Contenido

### Historia

- Línea de tiempo en dos partes: el **contexto** previo (1919 – 1986) y la **historia del Movimiento** (desde 1987), con cada tramo encabezado por su fecha, scroll-spy y barra de progreso
- Estadísticas animadas (organizaciones, países, kilómetros recorridos, años de trayectoria)
- Tarjetas con las consignas históricas del movimiento (flip on click), con autor y fuente
- Títulos propios diferenciados de las citas; cada cita remite a una fuente numerada
- Fuentes divididas en primarias (charla de Paula Salinas en la materia) y secundarias, y créditos al pie

### Mapa de la red (prototipo)

- **Mapa y directorio**: listado con buscador y filtros (tipo de organización, provincia, qué necesitan u ofrecen) sincronizado con un mapa Leaflet. Las casas que no quieren mostrar su dirección aparecen como una zona aproximada.
- **Ficha de cada organización**: qué hacen, edades, horarios y el cruce automático con otras casas que pueden ayudarles o a las que pueden ayudar.
- **Tablero de la red**: avisos de "necesitamos", "ofrecemos" y convocatorias entre organizaciones.
- **Sumar organización / Mi organización**: formulario de autoalta y edición con vista previa y punto en el mapa.
- **Coordinación**: aprobación o rechazo de altas y cambios antes de publicarlos.
- Selector "Ver como" (Visitante, Organización, Coordinación) para mostrar los tres roles en la demo.

> Todos los datos del prototipo son **ficticios** (`js/red-datos.js`) y los cambios viven en memoria: se pierden al recargar. El guardado real es el paso siguiente.

La interfaz del mapa se basa en el prototipo "Portal de Talleres" de Ingeniería de Software (UNGS), adaptado a organizaciones sociales.

## Stack

HTML, CSS y JavaScript vanilla, sin frameworks ni dependencias de build.

- `css/marca.css`: identidad compartida (celeste `#63C2EB`, blanco y negro, logo de Organizaciones de lxs Chicxs del Pueblo), tomada de [chicxsdelpueblo.com.ar](https://chicxsdelpueblo.com.ar/).
- `red.html`, `css/red.css`, `js/red.js`, `js/red-datos.js`: mapa de la red.
- `vendor/`: [Leaflet](https://leafletjs.com/) 1.9.4 y Leaflet.markercluster 1.5.3, incluidos en el repo. Mapa base: [Argenmap](https://www.ign.gob.ar/) del Instituto Geográfico Nacional (sin API key, con la toponimia oficial argentina: "Islas Malvinas"), sobre datos de © OpenStreetMap.

## Ver el sitio

Abrir `index.html` en el navegador, o servirlo con GitHub Pages desde este repositorio. Para el mapa conviene usar un servidor local (por ejemplo `python3 -m http.server`) o GitHub Pages.
