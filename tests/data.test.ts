import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { cityProfiles } from '../src/data/cities';
import { guideCatalog } from '../src/data/guides';
import { allItems, bookings, tripDays } from '../src/data/journey';
import { journeyPlaceById } from '../src/data/locations';
import { sources } from '../src/data/sources';

const unique = (values: string[]) => new Set(values).size === values.length;

describe('canonical journey data', () => {
  it('keeps stable IDs unique and alternatives outside route points', () => {
    expect(unique(tripDays.map((day) => day.id))).toBe(true);
    expect(unique(allItems.map((item) => item.id))).toBe(true);
    expect(unique(bookings.map((booking) => booking.id))).toBe(true);
    expect(allItems.filter((item) => item.status === '备选').every((item) => !item.routePoint)).toBe(true);
  });

  it('maps every scheduled attraction to a complete native guide', () => {
    const guideSlugs = new Set(guideCatalog.map((guide) => guide.slug));
    const attractions = allItems.filter((item) => ['museum', 'landmark'].includes(item.kind) && item.status !== '备选');
    expect(attractions.length).toBe(13);
    expect(attractions.every((item) => item.guideSlug && guideSlugs.has(item.guideSlug))).toBe(true);
  });

  it('keeps bookings and guide visits attached to real itinerary items', () => {
    const itemIds = new Set(allItems.map((item) => item.id));
    expect(bookings.flatMap((booking) => booking.itemIds).every((id) => itemIds.has(id))).toBe(true);
    expect(guideCatalog.flatMap((guide) => guide.itemIds).every((id) => itemIds.has(id))).toBe(true);
  });

  it('preserves evidence conflicts instead of silently merging them', () => {
    expect(allItems.find((item) => item.id === 'flight-ek927')?.conflict).toContain('11:05');
    expect(allItems.find((item) => item.id === 'flight-ms284')?.conflict).toContain('17:35');
    expect(allItems.find((item) => item.id === 'return-cairo-transfer')?.conflict).toContain('包车 / 飞机');
  });
});

describe('guide coverage and evidence contract', () => {
  it('ships every independent guide with complete authored sections', () => {
    expect(guideCatalog).toHaveLength(14);
    expect(unique(guideCatalog.map((guide) => guide.slug))).toBe(true);
    for (const guide of guideCatalog) {
      expect(guide.orientation.length).toBeGreaterThanOrEqual(3);
      expect(guide.visitChapters.map((chapter) => chapter.id)).toEqual(['exterior', 'interior']);
      expect(guide.highlights.length).toBeGreaterThanOrEqual(6);
      expect(guide.sequence.length).toBeGreaterThanOrEqual(4);
      expect(guide.practical.length).toBeGreaterThanOrEqual(4);
      expect(guide.overview.length).toBeGreaterThan(80);
      expect(unique(guide.highlights.map((item) => item.id))).toBe(true);
      for (const chapter of guide.visitChapters) {
        expect(chapter.summary.length).toBeGreaterThanOrEqual(70);
        expect(chapter.checkpoints.length).toBeGreaterThanOrEqual(3);
        expect(chapter.checkpoints.every((checkpoint) => checkpoint.length >= 18)).toBe(true);
        expect(chapter.accessNote.length).toBeGreaterThanOrEqual(25);
        expect(chapter.image.src.startsWith('/')).toBe(true);
        expect(existsSync(`public${chapter.image.src}`), `${guide.slug}: ${chapter.image.src}`).toBe(true);
      }
      for (const item of guide.highlights) {
        expect(item.summary.length).toBeGreaterThanOrEqual(18);
        expect(item.whyItMatters.length).toBeGreaterThanOrEqual(15);
        expect(item.lookFor.length).toBeGreaterThanOrEqual(15);
        expect(item.image.src.startsWith('/')).toBe(true);
        expect(existsSync(`public${item.image.src}`), `${guide.slug}: ${item.image.src}`).toBe(true);
      }
      expect(existsSync(`public${guide.hero.src}`), `${guide.slug}: ${guide.hero.src}`).toBe(true);
    }
  });

  it('qualifies the two museum map sources instead of inventing floor geometry', () => {
    const nmec = guideCatalog.find((guide) => guide.slug === 'national-museum-egyptian-civilization');
    const gem = guideCatalog.find((guide) => guide.slug === 'grand-egyptian-museum');
    expect(nmec?.spatial.mode).toBe('interactive-schematic');
    expect(gem?.spatial.mode).toBe('interactive-schematic');
    expect(nmec?.spatial.architectureLevels?.map(item=>item.source.id)).toEqual(['src-nmec-plan-study','src-nmec-plan-study']);
    expect(gem?.spatial.architectureLevels?.every(item=>item.source.id !== 'src-gem-map')).toBe(true);
    expect(nmec?.spatial.plan).toBeUndefined();
    expect(gem?.spatial.plan).toBeUndefined();
    expect(gem?.spatial.architecture?.entry.status).toBe('mapped');
  });

  it('gives the Khafre valley temple its own spatial identity', () => {
    const giza = guideCatalog.find((guide) => guide.slug === 'giza-plateau')!;
    const valley = giza.spatial.nodes.find((node) => node.id === 'giza-valley-temple');
    const sphinx = giza.spatial.nodes.find((node) => node.id === 'giza-sphinx');
    expect(valley).toBeTruthy();
    expect(valley?.id).not.toBe(sphinx?.id);
    expect(valley?.renderBindings?.twoDFeatureId).toBe('2d:giza-valley-pillared');
    expect(sphinx?.renderBindings?.twoDFeatureId).toBe('2d:giza-sphinx-body');
    expect(valley?.renderBindings?.threeDFeatureId).not.toBe(sphinx?.renderBindings?.threeDFeatureId);
    expect(giza.highlights.find((item) => item.id === 'giza-valley-card')?.nodeId).toBe('giza-valley-temple');
  });

  it('keeps guide indexes and delivered spatial references attached to valid sources', () => {
    const sourceIds = new Set(sources.map((source) => source.id));
    for (const guide of guideCatalog) {
      expect(guide.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
      expect(guide.visitChapters.flatMap((chapter) => chapter.sourceIds).every((id) => sourceIds.has(id))).toBe(true);
      expect(guide.spatial.nodes.length).toBeGreaterThanOrEqual(3);
      expect(guide.spatial.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
      if (guide.spatial.architecture) {
        expect(sourceIds.has(guide.spatial.architecture.source.id)).toBe(true);
      } else {
        expect(guide.spatial.referenceImages?.length, `${guide.slug}: references`).toBeGreaterThan(0);
        expect(guide.spatial.referenceImages?.every((item) => sourceIds.has(item.sourceId))).toBe(true);
      }
      for (const node of guide.spatial.nodes) {
        expect(node.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
      }
      expect(guide.highlights.filter((item) => item.nodeId).every((item) => guide.spatial.nodes.some((node) => node.id === item.nodeId))).toBe(true);
    }
  });

  it('keeps source relationships but excludes private originals from the public release', () => {
    const privateSources = sources.filter((source) => source.authority === 'user-primary');
    expect(privateSources.every((source) => !('localPath' in source))).toBe(true);
    expect(privateSources).toHaveLength(3);
    expect(privateSources.flatMap((source) => source.externalFiles ?? [])).toEqual([]);
  });
});

describe('map hierarchy and city structure', () => {
  it('covers all guide coordinates with national map places', () => {
    for (const guide of guideCatalog) {
      const place = [...journeyPlaceById.values()].find((candidate) => candidate.guideSlug === guide.slug);
      expect(place, guide.slug).toBeTruthy();
      expect(place?.coordinates).toEqual(guide.coordinates);
    }
  });

  it('provides four cultural city chapters covering all guides', () => {
    expect(cityProfiles).toHaveLength(4);
    const cityGuideSlugs = cityProfiles.flatMap((city) => city.guideSlugs);
    expect(new Set(cityGuideSlugs)).toEqual(new Set(guideCatalog.map((guide) => guide.slug)));
  });
});
