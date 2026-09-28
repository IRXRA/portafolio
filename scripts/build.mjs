import { mkdirSync, copyFileSync, cpSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');

// La salida conserva rutas relativas: funciona en / y en /nombre-del-repositorio/.
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
copyFileSync(resolve(root, 'index.html'), resolve(output, 'index.html'));
copyFileSync(resolve(root, '.nojekyll'), resolve(output, '.nojekyll'));
cpSync(resolve(root, 'assets'), resolve(output, 'assets'), { recursive: true });
console.log('Sitio estático preparado en dist/.');
