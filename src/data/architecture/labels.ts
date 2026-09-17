import type { XY } from './types';
/** Deterministic display-only callouts. Physical anchors and polygons never move. */
export function placePlanLabels<T extends {id:string;text:string;point:XY}>(labels:T[],box:readonly[number,number,number,number],fontSize:number){
 const placed:Array<{x:number;y:number;w:number;h:number}>=[];
 return labels.map(label=>{
  const w=[...label.text].reduce((sum,c)=>sum+(/[\u3000-\u9fff]/.test(c)?1:.7),0)*fontSize+fontSize*.35,h=fontSize*1.3;
  const [ax,ay]=label.point;let best={x:ax,y:ay,w,h};let found=false;
  for(let radius=0;radius<12&&!found;radius++)for(let step=0;step<(radius?16:1);step++){
   const angle=step*Math.PI/8;const x=ax+Math.cos(angle)*radius*fontSize*.9,y=ay+Math.sin(angle)*radius*fontSize*.9;
   if(x-w/2<box[0]||x+w/2>box[0]+box[2]||y-h/2<box[1]||y+h/2>box[1]+box[3])continue;
   if(placed.some(p=>Math.abs(p.x-x)<(p.w+w)/2&&Math.abs(p.y-y)<(p.h+h)/2))continue;
   best={x,y,w,h};found=true;break;
  }
  placed.push(best);return {...label,display:[best.x,best.y] as XY,displaced:Math.hypot(best.x-ax,best.y-ay)>fontSize*.1,bounds:best,collision:!found};
 });
}
