import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {guideCatalog} from '../src/data/guides';
import {reviewedGuideImage} from '../src/data/reviewed-guide-media';
import ledger from '../public/images/reviewed/manifest.json';

describe('All-guide subject-reviewed image registry',()=>{
 it('covers all 148 semantic positions in 14 guides, including 106 interpretations',()=>{
  expect(guideCatalog).toHaveLength(14);expect(ledger.items).toHaveLength(148);
  expect(guideCatalog.flatMap(g=>g.highlights)).toHaveLength(106);
  for(const guide of guideCatalog){
   for(const {id,image}of [{id:'cover',image:guide.hero},...guide.visitChapters,...guide.highlights]){
    const record=ledger.items.find(r=>r.guide===guide.slug&&r.id===id)!;
    expect(record,`${guide.slug}/${id}`).toBeTruthy();expect(image.src).toBe(record.current);
    expect(createHash('sha256').update(readFileSync('public'+image.src)).digest('hex')).toBe(record.sha256);
    expect(image.credit?.author).toBeTruthy();expect(image.credit?.sourcePage).toMatch(/^https:\/\//);
    expect(image.credit?.license).toMatch(/CC|Public domain/);
    expect(image.alt).not.toMatch(/现场或相关实物|占位/);
    if(id!=='cover')expect(image).toEqual(reviewedGuideImage(guide.slug,id));
   }
  }
 });
 it('rejects missing images rather than substituting the first search result',()=>{
  expect(()=>reviewedGuideImage('grand-egyptian-museum','not-reviewed')).toThrow(/Missing subject-reviewed/);
  const source=readFileSync('src/data/guides.ts','utf8');
  expect(source).not.toContain('items[index]');expect(source).not.toContain('items.find');
 });
 it('never shares an image between distinct interpretation cards',()=>{
  const highlights=ledger.items.filter(i=>!['cover','exterior','interior'].includes(i.id));
  expect(new Set(highlights.map(i=>i.sha256)).size).toBe(highlights.length);
 });
 it('keeps GEM periods separate from the Ramses statue and binds specific objects',()=>{
  const gem=guideCatalog.find(g=>g.slug==='grand-egyptian-museum')!;
  const at=(id:string)=>gem.highlights.find(h=>h.id===id)!.image;
  expect(at('gem-stair').caption).toContain('平台排列王像');
  expect(at('gem-old-kingdom').caption).toContain('书记员');
  expect(at('gem-new-kingdom').caption).toContain('埃赫那吞');
  expect(at('gem-greco-roman').caption).toContain('捐赠碑');
  expect(at('gem-tut-mask').caption).toContain('黄金面具');
  expect(at('gem-khufu-boat').caption).toContain('船体');
  for(const id of ['gem-old-kingdom','gem-middle-kingdom','gem-new-kingdom','gem-late-period','gem-greco-roman'])expect(at(id).src).not.toBe(at('gem-ramses').src);
 });
 it('distinguishes KV2, KV6, KV9 and KV62 instead of recycling the valley landscape',()=>{
  for(const [id,caption]of [['valley-kv2','KV2'],['valley-kv6','KV6'],['valley-kv9','KV9'],['valley-kv62','KV62']])expect(reviewedGuideImage('valley-of-the-kings',id).caption).toContain(caption);
 });
});
