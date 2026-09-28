/**
 * Contenido del recorrido y configuración pública.
 * Completa los enlaces reales para mostrarlos en la sección de contacto.
 * No incluyas contraseñas ni datos corporativos en este archivo.
 */
export const contact = Object.freeze({
  email: 'raul.guzman.manriquez@gmail.com',
  linkedin: 'https://www.linkedin.com/in/raúl-guzmán-cl/',
  phoneDisplay: '+56 9 7830 4302',
  phoneHref: '+56978304302',
});

export const stages = Object.freeze([
  {
    title: 'Captación',
    text: 'Todo comienza en el origen. Así como el agua se capta desde una fuente, el análisis comienza reuniendo información confiable y comprendiendo su contexto.',
    badge: '01 · EL ORIGEN',
    description: 'Captar el agua. Comprender el dato.',
  },
  {
    title: 'Control',
    text: 'Una válvula permite regular el flujo. La trazabilidad cumple una función similar en la gestión: conocer el activo, seguir su historia y reconocer dónde intervenir.',
    badge: '02 · DAR CONTEXTO',
    description: 'Seguir cada activo para orientar la gestión.',
  },
  {
    title: 'Impulsión',
    text: 'Las bombas dan energía al recorrido. Las herramientas digitales impulsan la información hacia su uso: un análisis, un dashboard o una aplicación que ayude a actuar.',
    badge: '03 · PASAR A LA ACCIÓN',
    description: 'Convertir información en una herramienta útil.',
  },
  {
    title: 'Telemetría',
    text: 'La red envía señales. Observar sus cambios permite formular preguntas, explorar patrones y dar seguimiento a lo que necesita atención.',
    badge: '04 · ESCUCHAR LA RED',
    description: 'Observar los cambios y hacer visibles las señales.',
  },
  {
    title: 'Distribución',
    text: 'El agua llega a las personas. La información también necesita llegar a quien decide, con una presentación clara y el contexto necesario para utilizarla.',
    badge: '05 · LLEGAR A LA DECISIÓN',
    description: 'Llevar la información hasta donde aporta valor.',
  },
]);

// Las coordenadas comparten el sistema de referencia del dibujo original.
export const networkGeometry = Object.freeze({
  width: 560,
  height: 480,
  nodes: [[92, 328], [230, 275], [355, 218], [445, 154], [500, 92]],
});
