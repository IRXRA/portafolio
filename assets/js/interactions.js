/** Aparición progresiva y respuesta sutil al puntero, siempre opcionales. */
export function initInteractions(motion) {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const cards = [...document.querySelectorAll('.cap-card')];
  cards.forEach(card => {
    card.addEventListener('pointermove', event => {
      if (motion.stopped || !finePointer.matches) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--tilt-x', `${-((event.clientY - rect.top) / rect.height - .5) * 1.4}deg`);
      card.style.setProperty('--tilt-y', `${((event.clientX - rect.left) / rect.width - .5) * 1.4}deg`);
      card.classList.add('is-tilting');
    });
    card.addEventListener('pointerleave', () => card.classList.remove('is-tilting'));
  });
  motion.subscribe(stopped => {
    if (stopped) cards.forEach(card => card.classList.remove('is-tilting'));
  });

  if (!('IntersectionObserver' in window)) return;
  const movingSections = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('offscreen-motion', !entry.isIntersecting));
  }, { rootMargin: '150px' });
  document.querySelectorAll('#capacidades, #proyectos').forEach(section => movingSections.observe(section));

  if (motion.reduced) return;
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        reveal.unobserve(entry.target);
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px 30px 0px' });
  document.querySelectorAll('.section-head, .about-feature, .about-detail, .cap-card, .project, .credential-group').forEach(element => {
    element.classList.add('reveal');
    reveal.observe(element);
  });
  document.documentElement.classList.add('motion-ready');
}
