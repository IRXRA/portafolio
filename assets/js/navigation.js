/** Menú móvil, navegación por capítulos e indicador de lectura. */
export function initNavigation(motion) {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('navLinks');
  const world = document.querySelector('.world-svg');
  const progress = document.getElementById('readingLine');
  const chapters = [...document.querySelectorAll('#perfil, #capacidades, #recorrido, #proyectos, #formacion, #contacto')];
  const links = [...nav.querySelectorAll('a')];
  let frame = 0;

  function closeMenu(restoreFocus = false) {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Menú';
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Cerrar' : 'Menú';
    nav.classList.toggle('open', open);
  });
  links.forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav')) closeMenu();
  });
  document.addEventListener('focusin', event => {
    if (!event.target.closest('.nav')) closeMenu();
  });
  window.matchMedia('(min-width: 981px)').addEventListener('change', () => closeMenu());

  function update() {
    frame = 0;
    const y = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty('--read-progress', total > 0 ? Math.min(1, Math.max(0, y / total)) : 0);
    world.style.setProperty('--world-y', `${motion.stopped ? 0 : Math.min(90, y * .014)}px`);
    let current = '';
    chapters.forEach(section => {
      if (section.getBoundingClientRect().top <= window.innerHeight * .35) current = section.id;
    });
    links.forEach(link => {
      if (link.getAttribute('href') === `#${current}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  document.querySelectorAll('details').forEach(item => item.addEventListener('toggle', schedule));
  motion.subscribe(schedule);
  schedule();
}
