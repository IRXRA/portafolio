import { contact } from './config.js';

/** Muestra únicamente canales reales y evita enlaces vacíos o ficticios. */
export function initContact() {
  const container = document.getElementById('contactLinks');
  const links = [];
  const email = contact.email.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    links.push({ label: 'Escríbeme ↗', href: `mailto:${email}` });
  }
  try {
    const url = new URL(contact.linkedin);
    if (url.protocol === 'https:' && (url.hostname === 'linkedin.com' || url.hostname.endsWith('.linkedin.com'))) {
      links.push({ label: 'LinkedIn ↗', href: url.href, external: true });
    }
  } catch { /* Un campo vacío mantiene el contacto pendiente de configuración. */ }
  links.forEach(({ label, href, external }) => {
    const anchor = document.createElement('a');
    anchor.textContent = label;
    anchor.href = href;
    if (external) { anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; }
    container.append(anchor);
  });
  container.hidden = links.length === 0;
}
