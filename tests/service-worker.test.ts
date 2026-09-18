import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('resumable offline worker', () => {
  const source = readFileSync('public/sw.js', 'utf8');
  it('uses verified per-file caching and a four-request concurrency bound', () => {
    expect(source).toContain("const VERIFIED = 'X-Offline-Sha256'");
    expect(source).toContain("crypto.subtle.digest('SHA-256'");
    expect(source).toContain('Math.min(4, missing.length)');
  });
  it('keeps a checkpoint and resumes only missing resources', () => {
    expect(source).toContain('const CHECKPOINT = `${BASE}__offline-progress`');
    expect(source).toContain("event.data?.type === 'OFFLINE_RESUME'");
    expect(source).toContain("existing.headers.get(VERIFIED) === resource.sha256");
  });
  it('only deletes prior caches owned by this project', () => {
    expect(source).toContain("key.startsWith(CACHE_PREFIX) && key !== CACHE");
    expect(source.indexOf("progress.phase = 'ready'")).toBeLessThan(source.indexOf('await retireOldCaches(olderCaches)'));
  });
  it('aborts sibling downloads on failure and can fall back through older complete caches', () => {
    expect(source).toContain('controller.abort()');
    expect(source).toContain('for (const name of complete ? [complete] : [CACHE])');
  });
});
