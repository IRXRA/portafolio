import { createMotionController } from './motion.js';
import { initNavigation } from './navigation.js';
import { initJourney } from './journey.js';
import { initInteractions } from './interactions.js';
import { initContact } from './contact.js';

// Entrada única. Cada módulo tiene una responsabilidad concreta.
const motion = createMotionController();
initNavigation(motion);
initJourney(motion);
initInteractions(motion);
initContact();
document.documentElement.classList.add('js-ready');
