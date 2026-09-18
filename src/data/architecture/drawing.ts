import type { ArchitecturalModel, ArchitecturalSpace, Ring, XY } from './types';

export const rect=(x:number,y:number,w:number,h:number):Ring=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
/** Only explicit source wall segments; never extrude room boundary polygons. */
export const strip=(a:XY,b:XY,width:number):Ring=>{const d=Math.hypot(b[0]-a[0],b[1]-a[1]);const dx=(b[1]-a[1])*width/d/2,dy=(a[0]-b[0])*width/d/2;return [[a[0]+dx,a[1]+dy],[b[0]+dx,b[1]+dy],[b[0]-dx,b[1]-dy],[a[0]-dx,a[1]-dy]];};
export type RoomSpec=[id:string,title:string,polygon:Ring,anchor:XY,description:string,nodeId?:string,kind?:ArchitecturalSpace['kind']];
export function drawing(options:{id:string;source:ArchitecturalModel['source'];drawingWidth:number;floor:string;bounds:ArchitecturalModel['bounds'];entry:string|null;entryBasis:string;rooms:RoomSpec[];walls?:Ring[];columns?:Array<[number,number,number]>;labels?:Array<[string,XY,string]>;limitations:string[]}):ArchitecturalModel {
  const factor=options.source.width/options.drawingWidth;
  const xy=(p:XY):XY=>[p[0]*factor,p[1]*factor];const ring=(r:Ring):Ring=>r.map(xy);
  const box=(r:ArchitecturalModel['bounds']):ArchitecturalModel['bounds']=>[r[0]*factor,r[1]*factor,r[2]*factor,r[3]*factor];
  const evidenceId=`${options.id}-plate`;
  const spaces=options.rooms.map(([id,title,polygon,anchor,description,nodeId,kind])=>({id,title,polygon:ring(polygon),anchor:xy(anchor),description,nodeId,kind:kind??'hall',evidenceId}));
  return {id:options.id,version:'2026-09-16-trace-1',source:options.source,floor:{id:options.id,title:options.floor},bounds:box(options.bounds),
    entry:options.entry?{status:'mapped',spaceId:options.entry,basis:options.entryBasis}:{status:'unmapped',notice:'此分图不是到达层；入口位置以现场导视为准。',basis:options.entryBasis},
    spaces,walls:(options.walls??[]).map((polygon,i)=>({id:`${options.id}-wall-${i+1}`,polygon:ring(polygon),evidenceId})),
    columns:(options.columns??[]).map(([x,y,r],i)=>({id:`${options.id}-column-${i+1}`,center:xy([x,y]),radius:r*factor,evidenceId})),openings:[],stairs:[],
    labels:(options.labels??options.rooms.map(([id,,,anchor],i)=>[String(i+1),anchor,id] as [string,XY,string])).map(([text,point,spaceId],i)=>({id:`${options.id}-label-${i+1}`,text,point:xy(point),spaceId})),
    evidence:[{id:evidenceId,sourceId:options.source.id,bounds:box(options.bounds),claim:'Manually inspected orthographic source: individually transcribed visible spatial outlines and wall/column marks. Source pixel frame retained by uniform scaling; no inferred route, room subdivision or room-wall extrusion.'}],
    display:{wallHeight:8*factor,columnHeight:12*factor,heightStatus:'display-only'},limitations:['3D 为同平面的低墙剖切读图；墙高、柱高只为可读性，不是实测复原。','数字为本导览索引，原图已有字母或房号另行保留；不表示游览先后。',...options.limitations]};
}
