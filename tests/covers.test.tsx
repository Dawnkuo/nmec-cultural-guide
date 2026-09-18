import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { guideCatalog } from '../src/data/guides';
import { coverSlugs, guideCover } from '../src/data/guide-covers';
import { GuideCover, CoverCredit } from '../src/components/GuideCover';
import provenance from '../public/images/covers/provenance.json';

describe('reviewed attraction covers', () => {
  it('covers the exact canonical attraction set, with no fallback photograph', () => {
    expect(coverSlugs.sort()).toEqual(guideCatalog.map(g => g.slug).sort());
    expect(() => guideCover('unknown-attraction')).toThrow('No reviewed cover');
    expect(new Set(guideCatalog.map(g => g.hero.src)).size).toBe(guideCatalog.length);
  });
  it.each(guideCatalog)('$slug has a dedicated photograph and auditable credit', guide => {
    const cover = guide.hero;
    expect(cover).toEqual(guideCover(guide.slug));
    expect(existsSync(`public${cover.src}`)).toBe(true);
    expect(cover.src).toBe(`/images/covers/${guide.slug}.jpg`);
    expect(cover.alt.length).toBeGreaterThan(12);
    expect(cover.credit?.sourcePage).toMatch(/^https:\/\/commons.wikimedia.org\/wiki\/File:/);
    expect(cover.credit?.author).not.toMatch(/contributor|贡献者/);
    expect(cover.credit?.license).toMatch(/CC BY|Public domain/);
    expect(cover.dimensions?.width).toBeGreaterThanOrEqual(1280);
    for (const role of ['hero', 'directory', 'card', 'thumbnail'] as const) {
      const html = renderToStaticMarkup(<GuideCover media={cover} role={role}/>);
      expect(html).toContain(`guide-cover--${role}`);
      expect(html).toContain('object-fit:contain');
      expect(html).toContain(cover.src);
    }
    expect(renderToStaticMarkup(<CoverCredit media={cover}/>)).toContain('封面摄影');
  });
  it('keeps the known wrong subjects out of the selected cover records', () => {
    expect(provenance['national-museum-egyptian-civilization'].title).toBe('File:NMEC-MainEntrance.jpg');
    expect(provenance['abu-simbel'].title).not.toMatch(/copy|relocation/);
    expect(provenance['orange-bay'].title).toContain('Orange bay');
    expect(provenance['luxor-temple'].width).toBeGreaterThan(provenance['luxor-temple'].height);
  });
  it('uses the shared cover renderer in every attraction-cover consumer', () => {
    const app = readFileSync('src/App.tsx', 'utf8');
    for (const role of ['hero', 'directory', 'card', 'thumbnail']) expect(app).toContain(`role="${role}"`);
    expect(app).not.toContain('<img src={guide.hero.src}');
  });
});
