import {describe,it,expect} from 'vitest';
import {existsSync} from 'node:fs';
import * as T from 'three';
import {exteriorGuides} from '../src/data/exteriors/catalog';
import {architectureCatalog} from '../src/data/architecture/catalog';
import {sourceById} from '../src/data/sources';
import {createExteriorGroup,exteriorPlanPaths,geometryForExterior,exteriorPlanBounds} from '../src/components/exterior-geometry';
import {column} from '../src/data/exteriors/builders';
describe('Source-linked exterior model delivery',()=>{
 it('has a distinct exterior treatment for all fourteen itinerary venues',()=>{expect(exteriorGuides).toHaveLength(14);expect(new Set(exteriorGuides.map(g=>g.slug)).size).toBe(14);});
 it('caps solid stone columns at the axis instead of leaving hollow capitals',()=>{const g=column('test','test',[0,0],1,12).geometry;if(g.kind!=='lathe')throw Error('expected lathe');expect(g.profile[0]).toEqual([0,0]);expect(g.profile.at(-1)).toEqual([0,12]);});
 it('joins the wikala portal and courtyard as one open notch',()=>{const g=exteriorGuides.find(g=>g.slug==='khan-el-khalili')!.models[1].parts.find(p=>p.id==='wikala-lower-shell')!.geometry;if(g.kind!=='prism')throw Error('expected prism');expect(g.holes).toEqual([]);expect(g.footprint).toContainEqual([620,715]);expect(g.footprint).toContainEqual([620,583]);expect(g.footprint).toContainEqual([580,715]);});
 for(const g of exteriorGuides)for(const m of g.models)it(`${g.slug}/${m.id}: geometry, identity, sources and local assets`,()=>{
  expect(m.features.length).toBeGreaterThan(0);expect(m.parts.length).toBeGreaterThan(0);expect(m.limitations.length).toBeGreaterThan(0);expect(existsSync('public'+m.referenceImage),m.referenceImage).toBe(true);
  for(const s of m.sourceIds)expect(sourceById.has(s),s).toBe(true);
  const featureIds=new Set(m.features.map(f=>f.id));expect(featureIds.size).toBe(m.features.length);expect(new Set(m.parts.map(p=>p.id)).size).toBe(m.parts.length);
  const [bx,bz,bw,bd]=exteriorPlanBounds(m);
  for(const [x,z] of [...m.features.flatMap(f=>f.footprint),...m.parts.flatMap(p=>exteriorPlanPaths(p).flat())]){expect(x).toBeGreaterThanOrEqual(bx);expect(z).toBeGreaterThanOrEqual(bz);expect(x).toBeLessThanOrEqual(bx+bw+1e-6);expect(z).toBeLessThanOrEqual(bz+bd+1e-6);}
  for(const f of m.features){expect(f.description.length).toBeGreaterThan(30);expect(f.lookFor.length).toBeGreaterThan(1);if(f.nodeId)expect(architectureCatalog[g.slug].some(l=>l.spaces.some(s=>s.id===f.nodeId||s.nodeId===f.nodeId)),f.nodeId).toBe(true);}
  for(const p of m.parts){expect(featureIds.has(p.featureId),p.id).toBe(true);expect(p.sourceGeometryId.length).toBeGreaterThan(0);expect(p.verticalBasis.length).toBeGreaterThan(0);const geo=geometryForExterior(p.geometry);const pos=geo.getAttribute('position');expect(pos.count,p.id).toBeGreaterThan(0);expect(Array.from(pos.array).every(Number.isFinite),p.id).toBe(true);geo.computeBoundingBox();expect(geo.boundingBox?.isEmpty(),p.id).toBe(false);geo.dispose();expect(exteriorPlanPaths(p).every(r=>r.flat().every(Number.isFinite)),p.id).toBe(true);}
  const group=createExteriorGroup(m),box=new T.Box3().setFromObject(group);expect(box.isEmpty()).toBe(false);expect(group.children.length).toBeLessThan(50);for(const mesh of group.children as T.Mesh[]){mesh.geometry.dispose();(mesh.material as T.Material).dispose();}
 });
 it('keeps twelve tall and122 lower columns in the Karnak detail',()=>{const m=exteriorGuides.find(g=>g.slug==='karnak')!.models[1];expect(m.parts.filter(p=>p.featureId==='kh-nave')).toHaveLength(12);expect(m.parts.filter(p=>p.featureId!=='kh-nave')).toHaveLength(122);});
 it('uses actual sampled terrain without extruding underground tomb footprints',()=>{const m=exteriorGuides.find(g=>g.slug==='valley-of-the-kings')!.models[0];const dem=m.parts.find(p=>p.id==='valley-dem')!.geometry;expect(dem.kind).toBe('mesh');if(dem.kind==='mesh'){expect(dem.vertices.length).toBe(2601);expect(Math.max(...dem.vertices.map(v=>v[1]))).toBeGreaterThan(250);}expect(m.parts.some(p=>p.sourceGeometryId==='way/813718170')).toBe(false);});
});
