import { stages, networkGeometry } from './config.js';
import { drawRiver, drawNetwork } from './water-renderer.js';

/** Selección de etapas y ciclo de animación; el dibujo vive en water-renderer.js. */
export function initJourney(motion) {
  const buttons = [...document.querySelectorAll('.stage')];
  const assets = [...document.querySelectorAll('.scene-asset')];
  const hits = [...document.querySelectorAll('.scene-hit')];
  const heroCanvas = document.getElementById('heroWater');
  const systemCanvas = document.getElementById('systemCanvas');
  let activeStage = 0;
  let elapsed = 0;
  let lastFrame = 0;
  let frame = 0;
  let resizeFrame = 0;
  let heroVisible = true;
  let systemVisible = true;

  function surface(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const value = { ctx, width: 1, height: 1 };
    value.resize = () => {
      const rect = canvas.getBoundingClientRect();
      value.width = Math.max(1, rect.width);
      value.height = Math.max(1, rect.height);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(value.width * ratio);
      canvas.height = Math.round(value.height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    value.resize();
    return value;
  }
  const hero = surface(heroCanvas);
  const system = surface(systemCanvas);

  function schedule() {
    if (!frame && !document.hidden && (hero || system)) frame = requestAnimationFrame(render);
  }
  function render(now) {
    frame = 0;
    if (document.hidden) return;
    const delta = Math.min(40, lastFrame ? now - lastFrame : 16);
    lastFrame = now;
    if (!motion.stopped) elapsed += delta * .75;
    if (hero && (heroVisible || motion.stopped)) {
      hero.ctx.clearRect(0, 0, hero.width, hero.height);
      drawRiver(hero.ctx, hero.width, hero.height, elapsed, true);
    }
    if (system && (systemVisible || motion.stopped)) {
      drawNetwork(system.ctx, system.width, system.height, elapsed, activeStage);
    }
    if (!motion.stopped && (heroVisible || systemVisible)) schedule();
  }

  function selectStage(index) {
    if (!Number.isInteger(index) || !stages[index]) return;
    activeStage = index;
    const stage = stages[index];
    document.getElementById('stageTitle').textContent = stage.title;
    document.getElementById('stageText').textContent = stage.text;
    document.getElementById('stageNumber').textContent = `ETAPA ${String(index + 1).padStart(2, '0')} / 05`;
    document.getElementById('flowBadge').textContent = stage.badge;
    document.getElementById('sceneDescription').textContent = stage.description;
    systemCanvas.setAttribute('aria-label', `Recorrido ilustrativo del agua: etapa ${stage.title} seleccionada.`);
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    hits.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    assets.forEach((asset, i) => asset.classList.toggle('is-visible', i === index));
    schedule();
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => selectStage(index));
    button.addEventListener('keydown', event => {
      let next;
      if (['ArrowDown', 'ArrowRight'].includes(event.key)) next = (index + 1) % stages.length;
      else if (['ArrowUp', 'ArrowLeft'].includes(event.key)) next = (index + stages.length - 1) % stages.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = stages.length - 1;
      else return;
      event.preventDefault();
      selectStage(next);
      buttons[next].focus();
    });
  });
  document.querySelectorAll('[data-select-stage]').forEach(control => {
    control.addEventListener('click', () => selectStage(Number(control.dataset.selectStage)));
  });

  function positionControls() {
    if (!system) return;
    const scale = Math.min(system.width / networkGeometry.width, system.height / networkGeometry.height);
    const offsetX = (system.width - networkGeometry.width * scale) / 2;
    const offsetY = (system.height - networkGeometry.height * scale) / 2;
    hits.forEach((button, index) => {
      button.style.setProperty('--node-x', `${offsetX + networkGeometry.nodes[index][0] * scale}px`);
      button.style.setProperty('--node-y', `${offsetY + networkGeometry.nodes[index][1] * scale}px`);
    });
  }
  function resize() {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      hero?.resize();
      system?.resize();
      positionControls();
      // Draw once even when a resized canvas is outside the viewport.
      if (hero) drawRiver(hero.ctx, hero.width, hero.height, elapsed, true);
      if (system) drawNetwork(system.ctx, system.width, system.height, elapsed, activeStage);
      schedule();
    });
  }
  window.addEventListener('resize', resize, { passive: true });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(resize);
    observer.observe(document.querySelector('.hero-visual'));
    observer.observe(document.querySelector('.journey-scene'));
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === heroCanvas) heroVisible = entry.isIntersecting;
        if (entry.target === systemCanvas) systemVisible = entry.isIntersecting;
      });
      lastFrame = 0;
      schedule();
    }, { rootMargin: '120px' });
    observer.observe(heroCanvas);
    observer.observe(systemCanvas);
  }
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('document-hidden', document.hidden);
    lastFrame = 0;
    if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
    else schedule();
  });
  motion.subscribe(() => { lastFrame = 0; schedule(); });
  positionControls();
  selectStage(0);
}
