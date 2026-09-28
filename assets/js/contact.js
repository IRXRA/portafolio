import { contact } from './config.js';

function addLink(container, { label, href, external = false, ariaLabel = '' }) {
  const anchor = document.createElement('a');
  anchor.textContent = label;
  anchor.href = href;
  if (ariaLabel) anchor.setAttribute('aria-label', ariaLabel);
  if (external) {
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
  }
  container.append(anchor);
}

function initContactLinks() {
  const container = document.getElementById('contactLinks');
  if (!container) return;

  const email = contact.email.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    addLink(container, {
      label: email,
      href: `mailto:${email}`,
      ariaLabel: `Enviar correo a ${email}`,
    });
  }

  const phoneHref = contact.phoneHref.trim();
  if (/^\+\d{8,15}$/.test(phoneHref)) {
    addLink(container, {
      label: contact.phoneDisplay.trim() || phoneHref,
      href: `tel:${phoneHref}`,
      ariaLabel: `Llamar al ${contact.phoneDisplay.trim() || phoneHref}`,
    });
  }

  try {
    const url = new URL(contact.linkedin);
    if (url.protocol === 'https:' && (url.hostname === 'linkedin.com' || url.hostname.endsWith('.linkedin.com'))) {
      addLink(container, {
        label: 'LinkedIn ↗',
        href: url.href,
        external: true,
        ariaLabel: 'Abrir perfil de LinkedIn de Raúl Guzmán en una pestaña nueva',
      });
    }
  } catch { /* Un enlace inválido simplemente no se muestra. */ }

  container.hidden = container.childElementCount === 0;
}

function setFormState(form, status, message) {
  const button = form.querySelector('button[type="submit"]');
  const statusNode = document.getElementById('contactFormStatus');
  if (button) {
    button.disabled = status === 'sending';
    button.textContent = status === 'sending' ? 'Enviando…' : 'Enviar mensaje';
  }
  if (statusNode) {
    statusNode.textContent = message;
    statusNode.dataset.state = status;
  }
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    if (!form.reportValidity()) return;
    event.preventDefault();

    setFormState(form, 'sending', 'Enviando tu mensaje…');
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.Origen = window.location.href;
    payload.Fecha = new Intl.DateTimeFormat('es-CL', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date());

    try {
      const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(contact.email)}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false || result.success === 'false') {
        throw new Error(result.message || 'No fue posible enviar el formulario.');
      }

      form.reset();
      setFormState(form, 'success', 'Mensaje enviado. Gracias por contactarme; responderé a la brevedad.');
    } catch {
      setFormState(
        form,
        'error',
        `No se pudo enviar automáticamente. Puedes escribirme directamente a ${contact.email}.`,
      );
    }
  });
}

/** Inicializa los canales públicos y el formulario de contacto. */
export function initContact() {
  initContactLinks();
  initContactForm();
}
