import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { edfuArchitecture as model } from '../src/data/architecture/edfu';
import { ArchitecturePlan, ArchitectureMap } from '../src/components/ArchitectureMap';
import { guideBySlug } from '../src/data/guides';
import { hasInteractiveNodeBinding } from '../src/data/spatial-delivery';
import type { Ring, XY } from '../src/data/architecture/types';
import { architectureCatalog } from '../src/data/architecture/catalog';
import { sourceById } from '../src/data/sources';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { placePlanLabels } from '../src/data/architecture/labels';

function inside(p:XY,r:Ring) {let result=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const a=r[i],b=r[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])result=!result;}return result;}
const cross=(a:XY,b:XY,c:XY)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
function ringValid(r:Ring){if(r.length<3||r.flat().some(n=>!Number.isFinite(n)))return false;const area=r.reduce((sum,p,i)=>{const q=r[(i+1)%r.length];return sum+p[0]*q[1]-q[0]*p[1];},0);if(Math.abs(area)<.01)return false;for(let i=0;i<r.length;i++)for(let j=i+2;j<r.length;j++){if(i===0&&j===r.length-1)continue;const a=r[i],b=r[(i+1)%r.length],c=r[j],d=r[(j+1)%r.length];if(cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0)return false;}return true;}

describe('All native venue layers',()=>{
 it('restores an externally selected room and its floor when returning from onsite mode',()=>{
  const guide=guideBySlug.get('grand-egyptian-museum')!;
  const html=renderToString(<ArchitectureMap guide={guide} selectedId="gem-main-galleries" onSelect={()=>{}}/>);
  expect(html).toContain('data-active-floor="gem-upper-level"');
  expect(html).toContain('data-active-place="gem-g1"');
  expect(html).toContain('data-view="2d"');
 });
 it('locates Tutankhamun and Valley Temple objects in the detailed native layer rather than only the overview footprint',()=>{
  for(const [slug,nodeId,floor,space] of [['grand-egyptian-museum','gem-tut','gem-tut-current','gem-tut-north'],['giza-plateau','giza-valley-temple','giza-valley-interior','giza-valley-pillared']]){
   const guide=guideBySlug.get(slug)!;
   expect(hasInteractiveNodeBinding(guide.spatial,nodeId)).toBe(true);
   const html=renderToString(<ArchitectureMap guide={guide} selectedId={nodeId} onSelect={()=>{}}/>);
   expect(html).toContain(`data-active-floor="${floor}"`);
   expect(html).toContain(`data-active-place="${space}"`);
  }
 });
 for(const [slug,levels] of Object.entries(architectureCatalog))for(const layer of levels){
  it(`${slug}/${layer.id}: valid source-linked geometry and anchors`,()=>{
   expect(sourceById.has(layer.source.id)).toBe(true);
   expect(createHash('sha256').update(readFileSync(`public${layer.source.asset}`)).digest('hex')).toBe(layer.source.sha256);
   if(layer.contextAsset){const context=JSON.parse(readFileSync(`public${layer.contextAsset}`,'utf8'));expect(context.strokes.length+(context.areas?.length??0)).toBeGreaterThan(0);}
   for(const item of [...layer.spaces,...layer.walls])expect(ringValid(item.polygon),item.id).toBe(true);
   for(const space of layer.spaces)expect(inside(space.anchor,space.polygon),space.id).toBe(true);
   for(const space of layer.spaces)for(const hole of space.holes??[]){expect(ringValid(hole),`${space.id} hole`).toBe(true);expect(inside(space.anchor,hole),`${space.id} anchor not inside solid`).toBe(false);}
   const ids=new Set(layer.spaces.map(s=>s.id));
   for(const label of layer.labels)expect(ids.has(label.spaceId)).toBe(true);
   for(const portrait of [false,true]){const [bx,by,w,h]=layer.bounds,margin=Math.max(w,h)*.055,rotated=portrait?w>h*1.2:h>w*1.2;const box:readonly[number,number,number,number]=rotated?[-margin,-margin,h+margin*2,w+margin*2]:[bx-margin,by-margin,w+margin*2,h+margin*2];const unitsPerPixel=1/Math.min((portrait?350:960)/box[2],(portrait?660:550)/box[3]);const font=Math.max(Math.max(w,h)/(portrait?40:47),12*unitsPerPixel);const labels=placePlanLabels(layer.labels.map(l=>({...l,point:(rotated?[by+h-l.point[1],l.point[0]-bx]:l.point) as XY})),box,font);for(const l of labels)expect(l.collision,`${layer.id}/${l.text}`).toBe(false);}
   if(layer.entry.status==='mapped')expect(ids.has(layer.entry.spaceId)).toBe(true);
   const html=renderToString(<ArchitecturePlan model={layer} activeId={layer.spaces[0].id} onSelect={()=>{}}/>);
   for(const space of layer.spaces)expect(html).toContain(`2d:${space.id}`);
  });
 }
});

describe('Edfu semantic source-to-scene contract',()=>{
  it('uses reviewed orthographic coordinates and a documented ground entrance, not array order',()=>{
    expect(model.source.projection).toBe('orthographic');
    expect(model.entry.status).toBe('mapped');
    const entry=model.entry;if(entry.status==='mapped')expect(model.spaces.find(s=>s.id===entry.spaceId)?.title).toContain('B ·');
    expect(model.display.heightStatus).toBe('display-only');
  });
  it('has finite nonzero noncrossing geometry and room-contained anchors',()=>{
    for(const item of [...model.spaces,...model.walls])expect(ringValid(item.polygon),item.id).toBe(true);
    for(const space of model.spaces)expect(inside(space.anchor,space.polygon),space.id).toBe(true);
  });
  it('traces every feature to an evidence region and every door to valid rooms',()=>{
    const evidenceIds=new Set(model.evidence.map(e=>e.id));
    for(const item of [...model.spaces,...model.walls,...model.columns,...model.stairs,...model.openings])expect(evidenceIds.has(item.evidenceId),item.id).toBe(true);
    const ids=new Set(model.spaces.map(s=>s.id));
    for(const door of model.openings){expect(ids.has(door.from)).toBe(true);expect(ids.has(door.to)).toBe(true);const mid:XY=[(door.a[0]+door.b[0])/2,(door.a[1]+door.b[1])/2];expect(model.walls.some(w=>inside(mid,w.polygon)),door.id).toBe(false);}
    const all=[...model.spaces,...model.walls,...model.columns,...model.stairs,...model.openings,...model.labels].map(f=>f.id);expect(new Set(all).size).toBe(all.length);
  });
  it('renders all 14 printed labels including both A and every K, without using text as geometry',()=>{
    expect(model.labels.map(l=>l.text)).toEqual(['A','A','B','C','D','E','F','G','H','K','K','K','K','K']);
    const html=renderToString(<ArchitecturePlan model={model} activeId="edfu-entry" onSelect={()=>{}}/>);
    for(const label of model.labels)expect(html).toContain(`data-source-label-id="${label.id}"`);
    for(const space of model.spaces)expect(html).toContain(`data-feature-id="2d:${space.id}"`);
    expect(model.columns.filter(c=>c.id.includes('-court-'))).toHaveLength(32);
    expect(model.columns.filter(c=>c.id.includes('-outer-'))).toHaveLength(18);
    expect(model.columns.filter(c=>c.id.includes('-inner-'))).toHaveLength(12);
    expect(html).not.toContain('<image');expect(html).not.toContain('<polyline');
  });
  it('initializes in 2D and maps only supported guide objects',()=>{
    const guide=guideBySlug.get('edfu-temple')!;
    const html=renderToString(<ArchitectureMap guide={guide} selectedId="edfu-pylon" onSelect={()=>{}}/>);
    expect(html).toContain('data-view="2d"');expect(html).not.toContain('<canvas');
    expect(hasInteractiveNodeBinding(guide.spatial,'edfu-inner-hypostyle')).toBe(true);
    expect(hasInteractiveNodeBinding(guide.spatial,'not-a-real-place')).toBe(false);
    expect(guide.highlights.find(h=>h.id==='edfu-horus')?.nodeId).toBeUndefined();
    expect(guide.highlights.find(h=>h.id==='edfu-relief')?.nodeId).toBeUndefined();
    expect(guide.highlights.find(h=>h.id==='edfu-passage')?.nodeId).toBe('edfu-passage');
  });
});
