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

const hash = createHash('sha256');
for (const file of (await walk('dist')).sort()) {
  if (file.endsWith('.map') || file.endsWith('offline-manifest.json')) continue;
  hash.update(path.relative('dist', file));
  hash.update(await readFile(file));
}

const release = hash.digest('hex').slice(0, 16);
const workerPath = 'dist/sw.js';
const source = await readFile(workerPath, 'utf8');
if (!source.includes('__OFFLINE_RELEASE__')) throw new Error('Service worker release placeholder is missing');
await writeFile(workerPath, source.replace('__OFFLINE_RELEASE__', release));
console.log(`Stamped offline release ${release}`);
