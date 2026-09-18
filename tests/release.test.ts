import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {guideCatalog} from '../src/data/guides';
import {cityProfiles} from '../src/data/cities';
describe('full-site release scope',()=>{
 it('includes every guide, city, itinerary and booking route at the existing base path',()=>{
  const base='/nmec-cultural-guide/';
  const routes=JSON.parse(readFileSync('route-catalog.json','utf8'));
  const expected=[base,base+'itinerary/',base+'cities/',...cityProfiles.map(c=>base+'cities/'+c.slug+'/'),base+'guides/',...guideCatalog.map(g=>base+'guides/'+g.slug+'/'),base+'bookings/'];
  expect(routes).toEqual(expected);expect(new Set(routes).size).toBe(23);
 });
 it('keeps the review-corrected NMEC media and a real Nubian site cover',()=>{
  expect(cityProfiles.find(c=>c.slug==='aswan-nubia')?.hero.src).toContain('/covers/abu-simbel.jpg');
  const nmec=guideCatalog.find(g=>g.slug==='national-museum-egyptian-civilization')!;
  expect(nmec.highlights.find(h=>h.id==='nmec-mummies-parade')?.image.caption).toContain('黄金游行的新闻影像');
  expect(nmec.highlights.find(h=>h.id==='nmec-mummies-parade')?.image.src).toContain('/reviewed/');
 });
});
