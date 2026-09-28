/** Un único estado de movimiento para SVG, canvas e interacciones. */
export function createMotionController() {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const listeners = new Set();
  const controls = [...document.querySelectorAll('#motionToggle, #motionMaster')];
  let paused = false;

  try {
    paused = localStorage.getItem('raul-portfolio:motion') === 'paused';
  } catch {
    // La navegación privada o el bloqueo de almacenamiento no impiden usar el sitio.
  }

  const controller = {
    get stopped() { return paused || preference.matches; },
    get reduced() { return preference.matches; },
    subscribe(listener) {
      listeners.add(listener);
      listener(controller.stopped);
      return () => listeners.delete(listener);
    },
  };

  function synchronize() {
    document.body.classList.toggle('motion-paused', controller.stopped);
    controls.forEach(button => {
      button.setAttribute('aria-pressed', String(controller.stopped));
      button.disabled = preference.matches;
      button.setAttribute('aria-label', preference.matches
        ? 'Movimiento reducido según la configuración del dispositivo'
        : controller.stopped ? 'Reanudar todas las animaciones' : 'Pausar todas las animaciones');
    });
    document.getElementById('motionToggle').textContent = preference.matches
      ? 'Movimiento reducido' : paused ? 'Reanudar animación' : 'Pausar animación';
    document.getElementById('motionMasterLabel').textContent = preference.matches
      ? 'Sin movimiento' : paused ? 'Reanudar' : 'Pausar';
    listeners.forEach(listener => listener(controller.stopped));
  }

  controls.forEach(button => button.addEventListener('click', () => {
    paused = !paused;
    try {
      localStorage.setItem('raul-portfolio:motion', paused ? 'paused' : 'playing');
    } catch { /* La preferencia sigue funcionando en la sesión actual. */ }
    synchronize();
  }));
  preference.addEventListener('change', synchronize);
  synchronize();
  return controller;
}
