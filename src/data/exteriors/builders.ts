import type { ArchitecturalModel, Ring, XY } from '../architecture/types';
import type { ExteriorFeature, ExteriorGeometry, ExteriorModel, ExteriorPart, XYZ } from './types';

export const rect=(x:number,z:number,w:number,d:number):Ring=>[[x,z],[x+w,z],[x+w,z+d],[x,z+d]];
export const circle=(x:number,z:number,r:number,n=32):Ring=>Array.from({length:n},(_,i)=>[x+r*Math.cos(i*Math.PI*2/n),z+r*Math.sin(i*Math.PI*2/n)]);
export const center=(r:Ring):XY=>[r.reduce((s,p)=>s+p[0],0)/r.length,r.reduce((s,p)=>s+p[1],0)/r.length];
export const extents=(r:Ring):[number,number,number,number]=>{const xs=r.map(p=>p[0]),ys=r.map(p=>p[1]);return [Math.min(...xs),Math.min(...ys),Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys)];};
export const sourceRoom=(m:ArchitecturalModel,id:string)=>{const s=m.spaces.find(s=>s.id===id);if(!s)throw Error(`Missing canonical space ${id}`);return s;};
export const feature=(id:string,title:string,footprint:Ring,description:string,lookFor:string[],sourceIds:string[],basis:string,nodeId?:string):ExteriorFeature=>({id,title,footprint,description,lookFor,sourceIds,basis,nodeId,anchor:center(footprint),precision:'derived'});
export const part=(id:string,featureId:string,geometry:ExteriorGeometry,material:ExteriorPart['material']='sandstone',sourceGeometryId=id,verticalBasis='轮廓与构成有资料支持；未给出测量标高，竖向比例按外观参照保守表达，非测绘复原。'):ExteriorPart=>({id,featureId,geometry,material,sourceGeometryId,verticalBasis});
export const prism=(id:string,fid:string,footprint:Ring,height:number,base=0,material:ExteriorPart['material']='sandstone',topScale=1)=>part(id,fid,{kind:'prism',footprint,height,base,topScale},material);
export const column=(id:string,fid:string,p:XY,r:number,h:number,base=0,open=true)=>part(id,fid,{kind:'lathe',center:p,base,profile:[[0,0],[r*1.16,0],[r*1.16,h*.035],[r,h*.06],[r*.85,h*.78],[r*(open?1.55:1.1),h*.93],[r*(open?1.55:1.1),h*.98],[r*1.08,h],[0,h]]});
export const obelisk=(id:string,fid:string,p:XY,w:number,h:number,base=0):ExteriorPart[]=>[prism(id+'-shaft',fid,rect(p[0]-w/2,p[1]-w/2,w,w),h*.88,base,'granite',.65),prism(id+'-pyramidion',fid,rect(p[0]-w*.325,p[1]-w*.325,w*.65,w*.65),h*.12,base+h*.88,'granite',0)];
export const ramp=(id:string,fid:string,p:Ring,low:number,high:number)=>part(id,fid,{kind:'mesh',vertices:[[p[0][0],low,p[0][1]],[p[1][0],low,p[1][1]],[p[2][0],high,p[2][1]],[p[3][0],high,p[3][1]]],triangles:[0,1,2,0,2,3]});
/** Seated silhouette from documented posture, not a claimed scan or restored face. */
export function seated(id:string,fid:string,p:XY,w:number,h:number,angle=0,damaged=false):ExteriorPart[]{
 const parts:ExteriorPart[]=[];
 const box=(suffix:string,x:number,z:number,bw:number,bd:number,y:number,bh:number)=>parts.push(prism(id+suffix,fid,rect(x,z,bw,bd),bh,y,'granite'));
 box('-plinth',-.6,-.52,1.2,1.12,0,.11);
 box('-throne',-.43,-.35,.86,.64,.1,.53);
 // Continuous shoulder, chest and waist profile; headcloth is a trapezoid, not a sphere.
 const profile=(suffix:string,outline:XY[],depth:number,z:number)=>{const n=outline.length,vertices:XYZ[]=outline.flatMap(([x,y])=>[[x,y,z] as XYZ]);vertices.push(...outline.map(([x,y])=>[x,y,z+depth] as XYZ));const triangles:number[]=[];for(let i=1;i<n-1;i++)triangles.push(0,i,i+1,n,n+i+1,n+i);for(let i=0;i<n;i++){const j=(i+1)%n;triangles.push(i,j,n+j,i,n+j,n+i);}parts.push(part(id+suffix,fid,{kind:'mesh',vertices,triangles},'granite'));};
 if(!damaged){profile('-torso',[[-.38,.54],[-.4,.7],[-.32,.78],[-.2,.8],[.2,.8],[.32,.78],[.4,.7],[.38,.54]],.32,-.21);profile('-headcloth',[[-.25,.79],[-.24,.91],[-.15,.99],[.15,.99],[.24,.91],[.25,.79]],.29,-.22);profile('-face',[[-.14,.81],[-.17,.87],[-.13,.94],[.12,.94],[.16,.87],[.12,.81],[0,.79]],.13,.01);}
 for(const sign of [-1,1]){box(`-thigh-${sign}`,sign>0?.045:-.34,-.02,.29,.51,.39,.16);box(`-shin-${sign}`,sign>0?.09:-.3,.29,.21,.2,.12,.31);box(`-foot-${sign}`,sign>0?.07:-.33,.3,.26,.32,.11,.09);if(!damaged)profile(`-arm-${sign}`,[[sign*.39,.71],[sign*.45,.66],[sign*.42,.48],[sign*.18,.48],[sign*.18,.53],[sign*.31,.55]],.13,.02);}
 const transform=([x,y,z]:XYZ):XYZ=>[p[0]+Math.cos(angle)*x*w-Math.sin(angle)*z*w,y*h,p[1]+Math.sin(angle)*x*w+Math.cos(angle)*z*w];
 return parts.map(pt=>{const g=pt.geometry;if(g.kind==='mesh')return {...pt,geometry:{...g,vertices:g.vertices.map(transform)}};if(g.kind==='prism')return {...pt,geometry:{...g,footprint:g.footprint.map(([x,z])=>{const q=transform([x,0,z]);return [q[0],q[2]];}),height:g.height*h,base:(g.base??0)*h}};return pt;});
}
export function model(id:string,title:string,bounds:ExteriorModel['bounds'],sourceIds:string[],image:string,features:ExteriorFeature[],parts:ExteriorPart[],limitations:string[]=[],direction:XYZ=[.75,.7,1]):ExteriorModel{return {id,title,version:'2026-09-16-exterior-1',coordinateSystem:'以登记的建筑平面为水平基准，X/Z等比例；竖向为注明来源的外观层。',bounds,sourceIds,referenceImage:image,referenceCaption:'实景／图件对照：用于识别形体，不替代测绘；历史图像另标明年代。',features,parts,limitations:['这是可旋转的建筑外观解读模型，不是激光扫描、精确测绘或古代完整复原。','保留有证据的主要结构；不编造浮雕、铭文、窗饰与已不存在的完整屋顶。',...limitations],defaultDirection:direction};}
