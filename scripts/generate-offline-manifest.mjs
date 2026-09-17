import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

async function walk(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(full));
    else output.push(full);
  }
  return output;
}

const resources = [];
for (const file of (await walk('dist')).sort()) {
  if (file.endsWith('.map') || file.endsWith('offline-manifest.json') || path.basename(file).startsWith('.')) continue;
  const body = await readFile(file);
  resources.push({ path: `/nmec-cultural-guide/${path.relative('dist', file).split(path.sep).join('/')}`, sha256: createHash('sha256').update(body).digest('hex'), bytes: body.byteLength });
}

const workerSource = await readFile('dist/sw.js', 'utf8');
const releaseMatch = workerSource.match(/const CACHE = `\$\{CACHE_PREFIX\}([a-f0-9]{16})`/);
if (!releaseMatch) throw new Error('Stamped service worker release was not found');
const routes = JSON.parse(await readFile('route-catalog.json', 'utf8'));
const manifest = { version: 1, release: `nmec-cultural-guide-${releaseMatch[1]}`, generatedAt: new Date().toISOString(), routes, resources };
await writeFile('dist/offline-manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
