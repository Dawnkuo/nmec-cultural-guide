import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DayRouteMap, groupMapItemsForDay } from '../src/components/DayRouteMap';
import { guideCatalog } from '../src/data/guides';
import { tripDays } from '../src/data/journey';
import { egyptBoundarySource, egyptOutline, nationalJourneyOrder, nationalJourneyRegions } from '../src/data/map-data';
import { cityMapLabels } from '../src/data/trip-map-locations';
import { sourceById } from '../src/data/sources';

const day = (date: string) => tripDays.find((entry) => entry.date === date)!;

describe('national map hierarchy', () => {
  it('uses region-level stops and preserves the return sequence', () => {
    expect(nationalJourneyRegions.map((region) => region.id)).toEqual(['cairo-giza', 'aswan', 'abu-simbel', 'kom-ombo', 'edfu', 'luxor', 'hurghada']);
    expect(nationalJourneyOrder).toEqual(['cairo-giza', 'aswan', 'abu-simbel', 'aswan', 'kom-ombo', 'edfu', 'luxor', 'hurghada', 'cairo-giza']);
    expect(nationalJourneyRegions.find((region) => region.id === 'cairo-giza')?.visits).toEqual([1, 9]);
  });

  it('uses the pinned Natural Earth 1:50m ring and keeps every region anchor on land', () => {
    const inside = ([x, y]: readonly [number, number]) => {
      let contained = false;
      for (let current = 0, previous = egyptOutline.length - 1; current < egyptOutline.length; previous = current++) {
        const [currentX, currentY] = egyptOutline[current];
        const [previousX, previousY] = egyptOutline[previous];
        if ((currentY > y) !== (previousY > y) && x < ((previousX - currentX) * (y - currentY)) / (previousY - currentY) + currentX) contained = !contained;
      }
      return contained;
    };
    expect(egyptBoundarySource.scale).toBe('1:50m');
    expect(egyptOutline.length).toBeGreaterThan(200);
    expect(nationalJourneyRegions.every((region) => inside(region.coordinates))).toBe(true);
  });
});

describe('daily city maps', () => {
  it('keeps the Luxor route in itinerary order and leaves the unspecified market unlocated', () => {
    const result = groupMapItemsForDay(day('2026-10-06'));
    expect(result.groups).toHaveLength(1);
    expect(result.groups[0].cityMapId).toBe('luxor');
    expect(result.groups[0].scheduled.map(({ item }) => item.id)).toEqual(['visit-valley-kings', 'visit-hatshepsut', 'visit-colossi', 'visit-karnak']);
    expect(result.unlocated.map(({ item }) => item.id)).toEqual(['luxor-market']);
  });

  it('does not draw transport-only days as fake city maps', () => {
    expect(renderToString(<DayRouteMap day={day('2026-09-30')}/>)).toBe('');
    expect(renderToString(<DayRouteMap day={day('2026-10-11')}/>)).toBe('');
  });

  it('links numbered markers to the same itinerary item IDs', () => {
    const html = renderToString(<DayRouteMap day={day('2026-10-02')}/>);
    expect(html).toContain('data-map-item="visit-giza-plateau"');
    expect(html).toContain('data-map-item="visit-gem"');
    expect(html).toContain('href="#visit-giza-plateau"');
    expect(html).toContain('金字塔景观餐厅午餐');
  });

  it('ships bounded local linework for every declared city map', () => {
    for (const cityId of Object.keys(cityMapLabels)) {
      const payload = JSON.parse(readFileSync(`public/map-data/${cityId}.json`, 'utf8'));
      expect(payload.source).toContain('OpenStreetMap');
      expect(payload.map.bounds).toHaveLength(4);
      expect(Object.keys(payload.map.layers).sort()).toEqual(['majorRoad', 'pedestrian', 'rail', 'road', 'water']);
      expect(payload.map.layers.road.length).toBeLessThanOrEqual(900);
      expect(payload.map.layers.pedestrian.length).toBeLessThanOrEqual(420);
    }
  });
});

describe('attraction spatial claims', () => {
  it('never promotes a reference image or text index to an interactive 2D/3D model', () => {
    for (const guide of guideCatalog) {
      if (guide.spatial.mode === 'interactive-schematic') {
        expect(guide.spatial.plan ?? guide.spatial.architecture, guide.slug).toBeTruthy();
        expect(guide.spatial.referenceImages, guide.slug).toBeUndefined();
      } else {
        expect(guide.spatial.plan, guide.slug).toBeUndefined();
      }
    }
  });

  it('ships a reviewed, hash-verified local plan or geospatial context for every guide', () => {
    expect(guideCatalog).toHaveLength(14);
    for (const guide of guideCatalog) {
      if (guide.spatial.architecture) {
        const source = guide.spatial.architecture.source;
        expect(createHash('sha256').update(readFileSync(`public${source.asset}`)).digest('hex')).toBe(source.sha256);
        expect(sourceById.has(source.id)).toBe(true);
        continue;
      }
      expect(guide.spatial.mode, guide.slug).toBe('official-plan-reference');
      expect(guide.spatial.referenceImages?.length, guide.slug).toBeGreaterThan(0);
      expect(guide.spatial.limitations?.length, guide.slug).toBeGreaterThan(0);
      for (const reference of guide.spatial.referenceImages ?? []) {
        expect(reference.src.startsWith('/maps/attractions/'), `${guide.slug}:${reference.id}`).toBe(true);
        const path = `public${reference.src}`;
        expect(existsSync(path), path).toBe(true);
        const hash = createHash('sha256').update(readFileSync(path)).digest('hex');
        expect(hash, path).toBe(reference.sha256);
        expect(reference.width, path).toBeGreaterThan(300);
        expect(reference.height, path).toBeGreaterThan(300);
        expect(reference.reviewedAt).toBe('2026-09-16');
        expect(sourceById.has(reference.sourceId), reference.sourceId).toBe(true);
      }
    }
  });

  it('does not mislabel the GEM exterior complex map as an indoor floor plan', () => {
    const gem = guideCatalog.find((guide) => guide.slug === 'grand-egyptian-museum')!;
    expect(gem.spatial.mode).toBe('interactive-schematic');
    expect(gem.spatial.architectureLevels?.every(level=>level.source.asset !== '/maps/attractions/gem-complex-map.jpg')).toBe(true);
    expect(gem.spatial.architecture?.source.id).toBe('src-gem-authority-plans');
    expect(sourceById.get('src-gem-map')?.scopes).not.toContain('official-floor-map');
  });
});
