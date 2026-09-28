import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const errors = [];
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const known = new Set(ids);
const localFiles = [];
function walk(directory) {
  for (const item of readdirSync(directory, { withFileTypes: true })) {
    const file = resolve(directory, item.name);
    if (item.isDirectory()) walk(file);
    else localFiles.push(file);
  }
}
walk(resolve(root, 'assets'));
walk(resolve(root, 'scripts'));

if (ids.length !== known.size) errors.push('Hay identificadores HTML duplicados.');
if (/<style\b|\sstyle\s*=|\son[a-z]+\s*=/i.test(html)) errors.push('HTML contiene estilos o eventos inline.');
if (/<script\b(?![^>]*\bsrc=)[^>]*>\s*\S/i.test(html)) errors.push('HTML contiene un script inline.');
if ((html.match(/<h1\b/g) || []).length !== 1) errors.push('Debe existir un único título h1.');

for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  const target = match[1];
  if (target.startsWith('#') && !known.has(target.slice(1))) errors.push(`Ancla o símbolo inexistente: ${target}`);
  if (target.startsWith('./') && !existsSync(resolve(root, target))) errors.push(`Recurso inexistente: ${target}`);
}
for (const match of html.matchAll(/aria-(?:controls|labelledby|describedby)="([^"]+)"/g)) {
  for (const id of match[1].split(/\s+/)) if (!known.has(id)) errors.push(`Referencia accesible inexistente: ${id}`);
}
for (const file of localFiles) {
  const source = readFileSync(file, 'utf8');
  if (['.js', '.mjs'].includes(extname(file))) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.status !== 0) errors.push(result.stderr);
    for (const match of source.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
      if (!existsSync(resolve(dirname(file), match[1]))) errors.push(`Import faltante en ${relative(root, file)}: ${match[1]}`);
    }
  }
  if (extname(file) === '.css') {
    for (const match of source.matchAll(/url\(['"]?(\.[^)'"\s]+)['"]?\)/g)) {
      if (!existsSync(resolve(dirname(file), match[1]))) errors.push(`Recurso CSS faltante: ${match[1]}`);
    }
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Correcto: HTML, ${known.size} identificadores, recursos y sintaxis JavaScript.`);
}
