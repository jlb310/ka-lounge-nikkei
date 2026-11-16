// Verificaciones del prototipo: sintaxis, referencias, integridad de datos y reglas de contenido.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (f) => readFileSync(`${root}${f}`, 'utf8');
const errors = [];
const fail = (msg) => errors.push(msg);

// 1. Sintaxis JS
for (const file of ['src/main.js', 'src/data.js']) {
  try {
    execFileSync(process.execPath, ['--check', `${root}${file}`], { stdio: 'pipe' });
  } catch (e) {
    fail(`Sintaxis inválida en ${file}: ${e.stderr}`);
  }
}

// 2. Referencias locales en el HTML
const html = read('index.html');
for (const [, ref] of html.matchAll(/(?:href|src)="(?!https?:|tel:|#)([^"]+)"/g)) {
  if (!existsSync(`${root}${ref}`)) fail(`index.html referencia un archivo inexistente: ${ref}`);
}

// 3. IDs requeridos por main.js presentes en el HTML
const js = read('src/main.js');
for (const [, id] of js.matchAll(/\$\('#([\w-]+)'/g)) {
  if (!html.includes(`id="${id}"`)) fail(`main.js usa #${id} pero no existe en index.html`);
}

// 4. Integridad de la carta
const { MENU, ALLERGENS, AVAILABILITY, PHONE } = await import(`${root}src/data.js`);
const ids = new Set();
for (const cat of MENU) {
  if (!cat.items.length) fail(`Categoría vacía: ${cat.id}`);
  for (const item of cat.items) {
    if (ids.has(item.id)) fail(`ID duplicado: ${item.id}`);
    ids.add(item.id);
    if (!item.ingredients?.length) fail(`${item.id} sin ingredientes`);
    for (const a of item.allergens) if (!(a in ALLERGENS)) fail(`${item.id}: alérgeno desconocido ${a}`);
    if (!(item.availability in AVAILABILITY)) fail(`${item.id}: disponibilidad inválida`);
    if (cat.kind === 'cocktail') {
      if (!item.explanation) fail(`${item.id}: cóctel sin explicación`);
      for (const v of Object.values(item.profile)) if (v < 1 || v > 5) fail(`${item.id}: perfil fuera de 1–5`);
    }
  }
}
if (!MENU.some((c) => c.kind === 'cocktail')) fail('Falta la categoría de cócteles');

// 5. Reglas de contenido de la demo
if (PHONE.label !== 'Canal por confirmar') fail('El teléfono debe rotularse «Canal por confirmar»');
if (PHONE.href !== 'tel:+56993969210') fail('Número de teléfono incorrecto');
if (!html.includes('Canal por confirmar') || !html.includes('+56 9 9396 9210')) fail('Teléfono no visible en el HTML');
if (!/<a[^>]+href="https:\/\/spacehost\.cl"[^>]*>Prototipo de SpaceHost<\/a>/.test(html)) {
  fail('Falta el footer «Prototipo de SpaceHost» enlazado a https://spacehost.cl');
}
const source = html + js + read('src/data.js');
const forbidden = [/whatsapp/i, /wa\.me/i, /instagram/i, /facebook/i, /mailto:/i, /[\w.+-]+@[\w-]+\.[a-z]{2,}/i, /reserv/i, /pedido|delivery/i];
for (const re of forbidden) if (re.test(source)) fail(`Contenido no permitido (canal inventado): ${re}`);
if (/\b(fetch|XMLHttpRequest|sendBeacon)\b/.test(js) || /<form[^>]+action=/.test(html)) {
  fail('El formulario no debe enviar datos');
}

if (errors.length) {
  console.error(`✗ ${errors.length} problema(s):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`✓ check OK: ${MENU.length} categorías, ${ids.size} ítems, reglas de contenido cumplidas`);
