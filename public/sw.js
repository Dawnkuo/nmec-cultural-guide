const CACHE_PREFIX = 'nmec-cultural-guide-';
const CACHE = `${CACHE_PREFIX}__OFFLINE_RELEASE__`;
const VERIFIED = 'X-Offline-Sha256';
const BASE = new URL(self.registration.scope).pathname;
const MANIFEST = `${BASE}offline-manifest.json`;
const CHECKPOINT = `${BASE}__offline-progress`;
let task;
let progress = { completed: 0, total: 0, phase: 'idle', version: CACHE };

async function broadcast(extra = {}) {
  progress = { ...progress, ...extra };
  const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  clients.filter(client=>client.url.startsWith(self.registration.scope)).forEach((client) => client.postMessage({ type: 'OFFLINE_PROGRESS', ...progress }));
}

async function sha256(buffer) {
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, '0')).join('');
}

async function readManifest(cache) {
  let response;
  try {
    response = await fetch(MANIFEST, { cache: 'no-store' });
    if (!response.ok) throw new Error(`manifest ${response.status}`);
    await cache.put(MANIFEST, response.clone());
  } catch {
    response = await cache.match(MANIFEST);
  }
  if (!response) throw new Error('离线清单不可用');
  const manifest = await response.json();
  if (manifest.version !== 1 || !Array.isArray(manifest.resources)) throw new Error('离线清单格式错误');
  return manifest;
}

async function saveOne(cache, resource, signal) {
  const existing = await cache.match(resource.path);
  if (existing?.status === 200 && existing.headers.get(VERIFIED) === resource.sha256) return false;
  const response = await fetch(resource.path, { cache: 'no-store', signal });
  if (!response.ok) throw new Error(`${resource.path} (${response.status})`);
  const body = await response.arrayBuffer();
  const actual = await sha256(body);
  if (actual !== resource.sha256) throw new Error(`${resource.path} 校验失败`);
  const headers = new Headers(response.headers);
  headers.set(VERIFIED, actual);
  await cache.put(resource.path, new Response(body, { status: 200, headers }));
  return true;
}

async function writeCheckpoint(cache) {
  await cache.put(CHECKPOINT, Response.json({ ...progress, savedAt: new Date().toISOString() }));
  await broadcast();
}

async function retireOldCaches(keys) {
  await Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE).map((key) => caches.delete(key)));
}

async function downloadAll() {
  if (task) return task;
  task = (async () => {
    const olderCaches = await caches.keys();
    const cache = await caches.open(CACHE);
    const controller = new AbortController();
    try {
      const manifest = await readManifest(cache);
      const missing = [];
      for (const resource of manifest.resources) {
        const saved = await cache.match(resource.path);
        if (saved?.status !== 200 || saved.headers.get(VERIFIED) !== resource.sha256) missing.push(resource);
      }
      progress = { completed: manifest.resources.length - missing.length, total: manifest.resources.length, phase: 'downloading', version: manifest.release };
      await writeCheckpoint(cache);
      let cursor = 0;
      let firstError;
      const workers = Array.from({ length: Math.min(4, missing.length) }, async () => {
        while (!firstError && cursor < missing.length) {
          const resource = missing[cursor++];
          try {
            await saveOne(cache, resource, controller.signal);
            progress.completed += 1;
            await writeCheckpoint(cache);
          } catch (error) {
            if (!firstError) firstError = error;
            controller.abort();
          }
        }
      });
      await Promise.allSettled(workers);
      if (firstError) throw firstError;
      progress.phase = 'ready';
      progress.error = undefined;
      await writeCheckpoint(cache);
      // An older worker completing late must not erase a newer worker's
      // partial package that appeared after this download started.
      await retireOldCaches(olderCaches);
    } catch (error) {
      progress.phase = 'failed';
      progress.error = error instanceof Error ? error.message : '下载中断';
      await writeCheckpoint(cache);
    } finally {
      task = undefined;
    }
  })();
  return task;
}

async function status() {
  if (task) return { ...progress };
  const cache = await caches.open(CACHE);
  const checkpoint = await cache.match(CHECKPOINT);
  // Reading status must never replace the live download state with an older
  // checkpoint while another message or worker advances that download.
  if (checkpoint) return checkpoint.json();
  return { ...progress };
}

async function cacheCandidates() {
  const keys = await caches.keys();
  return [CACHE, ...keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE).reverse()];
}

async function matchAcrossCaches(path) {
  const candidates=await cacheCandidates();
  // During an interrupted update serve one complete release, not a mixture
  // of the new partial package and an old document.
  let complete;
  for(const name of candidates){const cache=await caches.open(name);const checkpoint=await cache.match(CHECKPOINT);if(checkpoint&&(await checkpoint.json()).phase==='ready'){complete=name;break;}}
  for (const name of complete ? [complete] : [CACHE]) {
    const response = await (await caches.open(name)).match(path);
    if (response) return response;
  }
}

function navigationCandidates(url) {
  const clean = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
  return [url.pathname, clean, `${clean}index.html`, `${BASE}index.html`];
}

self.addEventListener('install', (event) => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', (event) => event.waitUntil((async () => {
  await self.clients.claim();
  await downloadAll();
})()));
self.addEventListener('message', (event) => {
  if (event.data?.type === 'OFFLINE_RESUME') event.waitUntil(downloadAll());
  if (event.data?.type === 'OFFLINE_STATUS') event.waitUntil(status().then((value) => event.source?.postMessage({ type: 'OFFLINE_STATUS', ...value })));
});
self.addEventListener('fetch', (event) => {
  const requestURL=new URL(event.request.url);
  if (event.request.method !== 'GET' || requestURL.origin !== self.location.origin || !requestURL.pathname.startsWith(BASE)) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(event.request);
      if (response.ok) return response;
      throw new Error(`network ${response.status}`);
    } catch {
      const url = new URL(event.request.url);
      if (event.request.mode === 'navigate') {
        for (const candidate of navigationCandidates(url)) {
          const cached = await matchAcrossCaches(candidate);
          if (cached) return cached;
        }
      }
      return await matchAcrossCaches(url.pathname) || Response.error();
    }
  })());
});
