import * as T from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { ExteriorGeometry, ExteriorModel, ExteriorPart, XYZ } from '../data/exteriors/types';
import type { Ring } from '../data/architecture/types';
export const exteriorPalette={stone:'#d2c4a7',sandstone:'#c3a376',granite:'#977f69',roof:'#78908f',glass:'#6c9dad',sand:'#bba47c',water:'#24576a',ground:'#8c826a',timber:'#816345'};
export function geometryForExterior(g:ExteriorGeometry){
 if(g.kind==='mesh'){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(g.vertices.flat(),3));geo.setIndex(g.triangles);geo.computeVertexNormals();return geo;}
 if(g.kind==='lathe'){const geo=new T.LatheGeometry(g.profile.map(([r,y])=>new T.Vector2(r,y)),g.segments??24);geo.translate(g.center[0],g.base??0,g.center[1]);return geo;}
 if(g.kind==='dome'){const geo=new T.SphereGeometry(1,32,16,g.half??0,g.half===undefined?Math.PI*2:Math.PI,0,Math.PI/2);geo.scale(g.radius,g.height,g.radius);geo.translate(g.center[0],g.base,g.center[1]);return geo;}
 const polygon=(ring:Ring)=>{const shape=new T.Shape();ring.forEach(([x,z],i)=>{if(i===0)shape.moveTo(x,-z);else shape.lineTo(x,-z);});shape.closePath();return shape;};
 const shape=polygon(g.footprint);g.holes?.forEach(r=>shape.holes.push(polygon(r)));
 const geo=new T.ExtrudeGeometry(shape,{depth:Math.max(.001,g.height),bevelEnabled:false});geo.rotateX(-Math.PI/2);
 if(g.topScale!==undefined&&g.topScale!==1){const bounds=new T.Box2().setFromPoints(g.footprint.map(p=>new T.Vector2(...p)));const c=bounds.getCenter(new T.Vector2()),positions=geo.getAttribute('position');for(let i=0;i<positions.count;i++){const t=Math.max(0,Math.min(1,positions.getY(i)/g.height));const factor=1+(g.topScale-1)*t;positions.setX(i,c.x+(positions.getX(i)-c.x)*factor);positions.setZ(i,c.y+(positions.getZ(i)-c.y)*factor);}positions.needsUpdate=true;geo.computeVertexNormals();}
 geo.translate(0,g.base??0,0);return geo;
}
export function createExteriorGroup(model:ExteriorModel){
 const group=new T.Group(),batches=new Map<string,{parts:ExteriorPart[];geometries:T.BufferGeometry[]}>();
 for(const p of model.parts){let geo=geometryForExterior(p.geometry);if(geo.index){const raw=geo;geo=raw.toNonIndexed();raw.dispose();}for(const name of Object.keys(geo.attributes))if(!['position','normal'].includes(name))geo.deleteAttribute(name);const key=p.featureId+':'+p.material,batch=batches.get(key)??{parts:[],geometries:[]};batch.parts.push(p);batch.geometries.push(geo);batches.set(key,batch);}
 for(const {parts,geometries}of batches.values()){const p=parts[0],geo=mergeGeometries(geometries)!;geometries.forEach(g=>g.dispose());const material=new T.MeshStandardMaterial({color:exteriorPalette[p.material],roughness:p.material==='glass'?.35:.9,metalness:p.material==='roof'?.18:0,side:T.DoubleSide});const mesh=new T.Mesh(geo,material);mesh.userData={partIds:parts.map(p=>p.id),featureId:p.featureId,sourceGeometryIds:parts.map(p=>p.sourceGeometryId),baseColor:exteriorPalette[p.material]};group.add(mesh);}
 const units=Math.max(model.bounds[2],model.bounds[3])/16;group.scale.setScalar(1/units);group.position.set(-(model.bounds[0]+model.bounds[2]/2)/units,0,-(model.bounds[1]+model.bounds[3]/2)/units);group.updateMatrixWorld(true);return group;
}
/** A plan is a top-down view of the same parts, never a second invented layout. */
export function exteriorPlanPaths(part:ExteriorPart):Ring[]{
 const g=part.geometry;
 if(g.kind==='prism')return [g.footprint,...g.holes??[]];
 if(g.kind==='dome'||g.kind==='lathe'){const radius=g.kind==='dome'?g.radius:Math.max(...g.profile.map(p=>p[0]));if(g.kind==='dome'&&g.half!==undefined)return [Array.from({length:33},(_,i)=>[g.center[0]-radius*Math.cos(g.half!+i*Math.PI/32),g.center[1]+radius*Math.sin(g.half!+i*Math.PI/32)])];return [Array.from({length:32},(_,i)=>[g.center[0]+radius*Math.cos(i*Math.PI/16),g.center[1]+radius*Math.sin(i*Math.PI/16)])];}
 // Mesh triangles retain roof ridges, ramps and terrain footprints.
 const rings:Ring[]=[];for(let i=0;i<g.triangles.length;i+=3)rings.push(g.triangles.slice(i,i+3).map(n=>[g.vertices[n][0],g.vertices[n][2]]));return rings;
}
export function directionVector(direction:XYZ){return new T.Vector3(...direction).normalize();}
/** Fit the actual geometry, including detached context and selectable regions. */
export function exteriorPlanBounds(model:ExteriorModel):ExteriorModel['bounds']{
 const points=[...model.features.flatMap(f=>f.footprint),...model.parts.flatMap(p=>exteriorPlanPaths(p).flat())];
 let minX=Infinity,minZ=Infinity,maxX=-Infinity,maxZ=-Infinity;
 for(const [x,z]of points){minX=Math.min(minX,x);minZ=Math.min(minZ,z);maxX=Math.max(maxX,x);maxZ=Math.max(maxZ,z);}
 return [minX,minZ,Math.max(1,maxX-minX),Math.max(1,maxZ-minZ)];
}
