import {describe,it,expect} from 'vitest';
import {nmecExterior} from '../src/data/exteriors/nmec';
import {guideCatalog} from '../src/data/guides';
import {existsSync} from 'node:fs';
import evidence from '../docs/nmec-exterior-evidence-20260917.json';
import {geometryForExterior,exteriorPlanPaths} from '../src/components/exterior-geometry';
const m=nmecExterior.models[0];
describe('NMEC exterior: rejected flat slab regression',()=>{
 it('resolves every component to an explicit documented/derived/unknown evidence claim',()=>{
  for(const p of m.parts){
   expect(p.sourceGeometryId).toBe(`nmec-claim/${p.featureId}/${p.id}`);
   const claim=evidence.claims[p.featureId as keyof typeof evidence.claims];
   expect(claim.status).toBe('derived');expect(claim.sources.length).toBeGreaterThan(1);expect(claim.unknown.length).toBeGreaterThan(10);
  }
 });
 it('does not reuse the tourism sign as an interior photograph',()=>{
  const guide=guideCatalog.find(g=>g.slug==='national-museum-egyptian-civilization')!;
  const photos=[guide.visitChapters!.find(c=>c.id==='interior')!.image,guide.highlights.find(h=>h.id==='nmec-architecture')!.image];
  for(const photo of photos){
   expect(photo.src).toContain('main-hall-reviewed.jpg');
   expect(photo.caption).toContain('2017');
   expect(photo.credit?.sourcePage).toContain('NMEC-MainHall.jpg');
   expect(existsSync('public'+photo.src)).toBe(true);
  }
 });
 it('opens the whole building with its pavilion, not two disconnected model tabs',()=>{
  expect(nmecExterior.models).toHaveLength(1);
  expect(m.id).toBe('nmec-exterior-complete');
  expect(m.features.map(f=>f.id)).toContain('nmec-pyramid');
  expect(m.features.map(f=>f.id)).toContain('nmec-entry-portico');
  expect(m.parts.some(p=>p.id==='nmec-exhibition-flat-roof')).toBe(false);
 });
 it('keeps the inner setback of the ring rather than roofing it with one solid plate',()=>{
  const ring=m.parts.find(p=>p.id==='nmec-exhibition-ring')!.geometry;
  expect(ring.kind).toBe('prism');
  if(ring.kind==='prism')expect(ring.holes).toEqual([[[70,50],[251,50],[251,235],[70,235]]]);
  expect(m.parts.filter(p=>p.id.startsWith('nmec-ring-roof-'))).toHaveLength(11);
 });
 it('includes a pyramid, tapered glass underside, and exactly four main pavilion piers',()=>{
  const roof=m.parts.find(p=>p.id==='nmec-pavilion-glass-pyramid')!.geometry;
  const underside=m.parts.find(p=>p.id==='nmec-pavilion-lower-glass')!.geometry;
  expect(roof.kind==='prism'&&roof.topScale).toBe(0);
  expect(underside.kind==='prism'&&underside.topScale).toBeGreaterThan(1);
  expect(m.parts.filter(p=>p.id.startsWith('nmec-pavilion-stone-pier-'))).toHaveLength(4);
 });
 it('registers the pavilion inside the exhibition building in BOTH views',()=>{
  for(const p of m.parts.filter(p=>p.featureId==='nmec-pyramid')){
   for(const r of exteriorPlanPaths(p))for(const [x,z]of r){expect(x).toBeGreaterThan(26);expect(x).toBeLessThan(299);expect(z).toBeGreaterThan(7);expect(z).toBeLessThan(280);}
   const g=geometryForExterior(p.geometry);g.computeBoundingBox();expect(g.boundingBox!.min.y).toBeGreaterThanOrEqual(22);g.dispose();
  }
 });
 it('keeps the angled connection, instead of rotating the entrance to a different axis',()=>{
  const r=m.features.find(f=>f.id==='nmec-link-shell')!.footprint;
  expect(r[3][0]-r[0][0]).not.toBe(0);expect(r[3][1]-r[0][1]).not.toBe(0);
  expect(m.parts.find(p=>p.id==='nmec-link-arched-cover')!.geometry.kind).toBe('mesh');
 });
 it('models four real entrance columns and an open portico rather than a sealed front wall',()=>{
  expect(m.parts.filter(p=>p.id.startsWith('nmec-entry-stone-column-'))).toHaveLength(4);
  const lintel=m.parts.find(p=>p.id==='nmec-entry-portico-lintel')!.geometry;
  expect(lintel.kind==='prism'&&lintel.base).toBe(18);
  expect(m.parts.find(p=>p.id==='nmec-entry-recessed-glass')!.material).toBe('glass');
  const entrance=m.features.find(f=>f.id==='nmec-entry-portico')!;
  expect(entrance.anchor[1]).toBeGreaterThan(425);
  expect(m.frontDirection).toEqual([.252,0,.968]);
 });
 it('does not claim measured heights or use the OSM site boundary as a building',()=>{
  expect(m.sourceIds).not.toContain('src-osm');
  expect(m.coordinateSystem).toContain('不声称地理坐标或真实标高');
  expect(m.limitations.join(' ')).toContain('设计资料');
  expect(m.limitations.join(' ')).toContain('逐窗数量');
 });
});
