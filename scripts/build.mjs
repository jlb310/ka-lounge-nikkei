// Copia el sitio estático a dist/ (no requiere bundler).
import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = `${root}dist`;

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const entry of ['index.html', 'styles.css', 'src']) {
  await cp(`${root}${entry}`, `${dist}/${entry}`, { recursive: true });
}
console.log('✓ build listo en dist/');
