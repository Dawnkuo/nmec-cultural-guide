import {describe,it,expect} from 'vitest';
import {existsSync,readFileSync} from 'node:fs';
import {guide} from '../src/data/guides';
import {nmecExterior} from '../src/data/exteriors/catalog';
import {sources} from '../src/data/sources';
import {geometryForExterior} from '../src/components/exterior-geometry';
import {assetUrl} from '../src/paths';
describe('single-guide public export',()=>{
 it('contains only the selected guide and no private trip references',()=>{expect(guide.slug).toBe('national-museum-egyptian-civilization');expect(guide.itemIds).toEqual([]);expect(JSON.stringify([guide,sources,nmecExterior])).not.toMatch(/1150[4-8]\.jpg|EK\d{3}|MS\d{3}|行程草表|user-primary|externalFiles/);});
 it('keeps the reviewed hall photo and accurate visitor orientation',()=>{expect(guide.visitChapters[1].image.src).toContain('main-hall-reviewed.jpg');expect(guide.orientation.map(x=>x.body).join('')).toContain('哈特谢普苏特');expect(guide.highlights).toHaveLength(10);});
 it('has concrete media attribution and real local assets',()=>{for(const m of [guide.hero,...guide.visitChapters.map(c=>c.image),...guide.highlights.map(h=>h.image)]){expect(m.credit?.author).toBeTruthy();expect(m.credit?.licenseUrl).toContain('creativecommons.org');expect(existsSync('public/'+m.src.split('/nmec-cultural-guide/').at(-1))).toBe(true);}});
 it('retains both source-backed floors and the explicit entry room',()=>{expect(guide.spatial.architectureLevels).toHaveLength(2);for(const model of guide.spatial.architectureLevels!){expect(model.source.projection).toBe('orthographic');const entry=model.entry;expect(entry.status).toBe('mapped');if(entry.status==='mapped')expect(model.spaces.some(s=>s.id===entry.spaceId)).toBe(true);for(const label of model.labels)expect(model.spaces.some(s=>s.id===label.spaceId)).toBe(true);}});
 it('keeps the integrated model, pyramid, open portico and 200 components',()=>{const m=nmecExterior.models[0];expect(nmecExterior.models).toHaveLength(1);expect(m.parts).toHaveLength(200);expect(m.features.map(f=>f.id)).toEqual(expect.arrayContaining(['nmec-pyramid','nmec-entry-portico']));for(const part of m.parts){const geometry=geometryForExterior(part.geometry);geometry.computeBoundingBox();expect(Number.isFinite(geometry.boundingBox!.min.x)).toBe(true);geometry.dispose();}});
 it('uses scoped base paths and a private cache namespace',()=>{const sw=readFileSync('public/sw.js','utf8');expect(sw).toContain("'nmec-cultural-guide-'");expect(sw).not.toContain('egypt-journey-');expect(sw).toContain('self.registration.scope');expect(guide.hero.src).toBe(assetUrl('/images/covers/national-museum-egyptian-civilization.jpg'));});
});
