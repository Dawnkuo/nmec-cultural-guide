import { siteUrl } from '../paths';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { Mesh, MeshStandardMaterial, WebGLRenderer } from 'three';
import type { ArchitecturalModel, ArchitecturalSpace, Ring, XY } from '../data/architecture/types';
import type { CulturalGuide } from '../data/types';
import { sourceById } from '../data/sources';
import { placePlanLabels } from '../data/architecture/labels';
import { exteriorCatalog } from '../data/exteriors/catalog';
const ExteriorMap=lazy(()=>import('./ExteriorMap').then(m=>({default:m.ExteriorMap})));
import './architecture-map.css';
import './exterior-map.css';

const line = (points: readonly XY[]) => points.map(p => p.join(',')).join(' ');
const regionPath = (space: Pick<ArchitecturalSpace,'polygon'|'holes'>) => [space.polygon, ...(space.holes ?? [])].map(r => `M ${r.map(p=>p.join(' ')).join(' L ')} Z`).join(' ');
const floorColor = (kind: ArchitecturalSpace['kind']) => kind === 'court' ? '#243e4b' : kind === 'passage' ? '#263544' : kind === 'sanctuary' ? '#725933' : kind === 'side-room' ? '#304356' : '#3d5365';
type ViewBox = [number,number,number,number];
type PlanContext={strokes:Array<{points:XY[];color:string}>;labels?:Array<{text:string;point:XY}>;areas?:Array<{id:string;polygon:Ring;holes?:Ring[];kind:string;color:string;displayHeight?:number}>};
function usePlanContext(asset?:string){const [context,setContext]=useState<PlanContext>();const [error,setError]=useState(false);const [attempt,setAttempt]=useState(0);useEffect(()=>{setContext(undefined);setError(false);if(!asset)return;const abort=new AbortController();void fetch(siteUrl(asset),{signal:abort.signal}).then(r=>{if(!r.ok)throw new Error('context unavailable');return r.json();}).then(setContext).catch(()=>{if(!abort.signal.aborted)setError(true);});return()=>abort.abort();},[asset,attempt]);return {context,error,retry:()=>setAttempt(n=>n+1)};}

export function ArchitecturePlan({ model, activeId, onSelect, inlineContext, exterior=false }: { model: ArchitecturalModel; activeId: string; onSelect: (id:string)=>void;inlineContext?:PlanContext;exterior?:boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const {context:remoteContext,error:contextError,retry:retryContext}=usePlanContext(model.contextAsset);
  const context=inlineContext??remoteContext;
  const svg = useRef<SVGSVGElement>(null);
  const [portrait,setPortrait] = useState(false);
  const [containerWidth,setContainerWidth] = useState(960);
  const [zoom,setZoom] = useState(1);
  const [pan,setPan] = useState<XY>([0,0]);
  const gesture = useRef<{start: XY; initial: XY; distance?: number; moved: boolean} | null>(null);
  const pointers = useRef(new Map<number,XY>());
  const suppress = useRef(false);
  const [bx,by,w,h] = model.bounds;
  const rotated = portrait ? w>h*1.2 : h>w*1.2;
  const margin = Math.max(w,h)*.055;
  const base: ViewBox = rotated ? [-margin,-margin,h+margin*2,w+margin*2] : [bx-margin,by-margin,w+margin*2,h+margin*2];
  const viewBox: ViewBox = [base[0]+base[2]*(1-1/zoom)/2+pan[0],base[1]+base[3]*(1-1/zoom)/2+pan[1],base[2]/zoom,base[3]/zoom];
  const toDisplay = ([x,y]:XY):XY => rotated?[by+h-y,x-bx]:[x,y];
  const transform = rotated ? `translate(${by+h} ${-bx}) rotate(90)` : undefined;
  const sourceUnitsPerPixel=1/Math.min(containerWidth/base[2],(portrait?660:550)/base[3]);
  const labelFont=Math.max(Math.max(w,h)/(portrait?40:47),12*sourceUnitsPerPixel);
  const displayLabels=placePlanLabels(model.labels.map(l=>({...l,point:toDisplay(l.point)})),base,labelFont);
  const reset = () => {setZoom(1);setPan([0,0]);};
  const changeZoom = (factor:number) => setZoom(value=>{const next=Math.min(4,Math.max(1,value*factor));if(next===1)setPan([0,0]);return next;});
  const live = useRef({changeZoom});live.current={changeZoom};
  useEffect(()=>{
    const container=host.current;if(!container)return;
    const observer=new ResizeObserver(()=>{if(container.isConnected){setPortrait(container.clientWidth<600);setContainerWidth(container.clientWidth);}});observer.observe(container);
    return ()=>observer.disconnect();
  },[]);
  useEffect(()=>{setPan([0,0]);},[portrait]);
  useEffect(()=>{
    const element=svg.current;if(!element)return;
    const wheel=(event:WheelEvent)=>{event.preventDefault();live.current.changeZoom(event.deltaY<0?1.12:1/1.12);};
    element.addEventListener('wheel',wheel,{passive:false});return ()=>element.removeEventListener('wheel',wheel);
  },[]);
  const select=(id:string)=>{if(!suppress.current)onSelect(id);};
  return <div className="architecture-plan" ref={host} data-view="2d" data-active-floor={model.floor.id} data-model-version={model.version}>
    <div className="architecture-tools"><span>{exterior?'点选外观 · 同模型俯视':'点选厅室 · 拖动平移'}</span><div><button onClick={()=>changeZoom(1/1.25)} disabled={zoom===1} aria-label="缩小平面">−</button><output>{Math.round(zoom*100)}%</output><button onClick={()=>changeZoom(1.25)} disabled={zoom===4} aria-label="放大平面">＋</button><button onClick={reset}>显示全图</button></div></div>
    {contextError&&<p role="alert" className="evidence-note">场地细线暂未载入，当前只显示已保存的核心空间。<button onClick={retryContext}>重试背景数据</button></p>}
    <svg ref={svg} className={`architecture-svg ${portrait?'is-portrait':''}`} viewBox={viewBox.join(' ')} role="group" aria-label={`${model.floor.title}交互平面`} tabIndex={0}
      onKeyDown={e=>{if(e.key==='+'||e.key==='='){e.preventDefault();changeZoom(1.25);}if(e.key==='-'){e.preventDefault();changeZoom(1/1.25);}if(e.key==='Home'){e.preventDefault();reset();}if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();setPan(([x,y])=>[x+(e.key==='ArrowLeft'?-25:e.key==='ArrowRight'?25:0)/zoom,y+(e.key==='ArrowUp'?-25:e.key==='ArrowDown'?25:0)/zoom]);}}}
      onPointerDown={e=>{pointers.current.set(e.pointerId,[e.clientX,e.clientY]);suppress.current=false;gesture.current={start:[e.clientX,e.clientY],initial:pan,moved:false};if(pointers.current.size===2){const p=[...pointers.current.values()];gesture.current.distance=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]);gesture.current.moved=true;suppress.current=true;}e.currentTarget.setPointerCapture(e.pointerId);}}
      onPointerMove={e=>{if(!pointers.current.has(e.pointerId)||!gesture.current)return;pointers.current.set(e.pointerId,[e.clientX,e.clientY]);const state=gesture.current;if(pointers.current.size===2){const p=[...pointers.current.values()];const distance=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]);if(state.distance&&distance>0)changeZoom(distance/state.distance);state.distance=distance;state.moved=true;suppress.current=true;return;}const dx=e.clientX-state.start[0],dy=e.clientY-state.start[1];if(Math.hypot(dx,dy)>4){state.moved=true;suppress.current=true;}if(state.moved){const rect=e.currentTarget.getBoundingClientRect();const units=Math.max(viewBox[2]/rect.width,viewBox[3]/rect.height);setPan([state.initial[0]-dx*units,state.initial[1]-dy*units]);}}}
      onPointerUp={e=>{const state=gesture.current;pointers.current.delete(e.pointerId);if(state&&!state.moved&&pointers.current.size===0){const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-space-id]');if(target?.getAttribute('data-space-id'))onSelect(target.getAttribute('data-space-id')!);}if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);gesture.current=null;}}
      onPointerCancel={()=>{pointers.current.clear();gesture.current=null;suppress.current=true;}}
      onLostPointerCapture={()=>{pointers.current.clear();gesture.current=null;}}>
      <title>{model.floor.title} — 来源支持的原生空间与结构</title>
      <g transform={transform}>
        {context?.areas&&<g pointerEvents="none">{context.areas.map((a,i)=><path key={`${a.id}-${i}`} data-context-feature={a.id} d={regionPath(a)} fillRule="evenodd" fill={a.color} stroke="#607283" strokeWidth={Math.max(w,h)/1800}/>)}</g>}
        {model.spaces.map(space=><path key={space.id} d={regionPath(space)} fillRule="evenodd" fill={space.id===activeId?'#d6b86b':floorColor(space.kind)} fillOpacity={space.geometryRole==='outline-region'?.14:1} className={`architecture-space ${space.id===activeId?'selected':''}`} data-space-id={space.id} data-feature-id={`2d:${space.id}`} role="button" tabIndex={0} aria-label={space.title} aria-pressed={space.id===activeId} onClick={e=>{if(e.detail===0)select(space.id);}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(space.id);}}}><title>{space.title}</title></path>)}
        {context&&<g pointerEvents="none" className="architecture-context">{context.strokes.map((s,i)=><path key={i} d={s.points.map((p,n)=>`${n%2?'L':'M'}${p.join(' ')}`).join(' ')} fill="none" stroke={s.color} strokeWidth={Math.max(w,h)/2300}/>)}</g>}
        <g className="architecture-walls" aria-label="来源支持的墙体" pointerEvents="none">{model.walls.map(wall=><polygon key={wall.id} points={line(wall.polygon)} data-wall-id={wall.id}/>)}</g>
        <g pointerEvents="none" stroke="#cbb47d" strokeWidth={Math.max(w,h)/900}>{model.solids?.flatMap(s=>s.footprint.map((p,i)=><line key={`${s.id}-${i}`} x1={p[0]} y1={p[1]} x2={s.apex[0]} y2={s.apex[1]}/>))}</g>
        <g className="architecture-columns" pointerEvents="none">{model.columns.map(column=><circle key={column.id} cx={column.center[0]} cy={column.center[1]} r={column.radius} data-column-id={column.id}/>)}</g>
        <g className="architecture-stairs" pointerEvents="none">{model.stairs.map(stair=><g key={stair.id}><polygon points={line(stair.footprint)}/>{stair.treads.map(([a,b],i)=><line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}/>)}</g>)}</g>
      </g>
      <g pointerEvents="none">{context?.labels?.map((label,i)=>{const [x,y]=toDisplay(label.point);return <text key={i} x={x} y={y} fill="#b4c4d1" fontSize={Math.max(w,h)/120} textAnchor="middle">{label.text}</text>;})}</g>
      <g className="architecture-column-labels" pointerEvents="none">{model.columnLabels?.map(label=>{const [x,y]=toDisplay(label.point);return <text key={label.text} x={x} y={y} textAnchor="middle" dominantBaseline="central" style={{fontSize:Math.max(w,h)/120,fill:'#132334'}}>{label.text}</text>;})}</g>
      <g className="architecture-labels">{displayLabels.map(label=>{const [x,y]=label.display;return <g key={label.id} data-source-label-id={label.id} data-space-id={label.spaceId} aria-hidden="true" onClick={()=>select(label.spaceId)} className={label.spaceId===activeId?'selected':''}>{label.displaced&&<line x1={label.point[0]} y1={label.point[1]} x2={x} y2={y} stroke="#cdbb8a" strokeWidth={Math.max(w,h)/1000} pointerEvents="none"/>}<text x={x} y={y} style={{fontSize:labelFont,strokeWidth:Math.max(w,h)/375}} textAnchor="middle" dominantBaseline="central">{label.text}</text></g>;})}</g>
    </svg>
    <div className="architecture-legend">{exterior?<><span>外观构件的顶视投影</span><span>编号对应右侧外观解读</span></>:<><span><i/>墙体</span><span><i className="column"/>柱</span><span>编号说明见空间详情</span><span>着色空间均可点选</span></>}</div>
  </div>;
}

function ArchitectureScene({ model, activeId, onSelect, onFail }: { model:ArchitecturalModel;activeId:string;onSelect:(id:string)=>void;onFail:()=>void }) {
  const host=useRef<HTMLDivElement>(null);
  const current=useRef({activeId,onSelect,onFail});current.current={activeId,onSelect,onFail};
  const actions=useRef<{reset:()=>void;zoom:(n:number)=>void;orbit:(n:number)=>void;redraw:()=>void}|null>(null);
  const [ready,setReady]=useState(false);
  const {context,error:contextError,retry:retryContext}=usePlanContext(model.contextAsset);
  useEffect(()=>{actions.current?.redraw();},[activeId]);
  useEffect(()=>{
    const container=host.current;if(!container)return;
    // Do not mount a provisional scene and replace its focused canvas when the
    // required source linework arrives. One scene, one initial camera fit.
    setReady(false);
    if(model.contextAsset&&!context&&!contextError)return;
    let disposed=false;let renderer:WebGLRenderer|undefined;let cleanup=()=>{};
    void Promise.all([import('three'),import('three/examples/jsm/controls/OrbitControls.js')]).then(([T,{OrbitControls}])=>{
      if(disposed)return;
      renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setClearColor(0x071522);container.appendChild(renderer.domElement);
      const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('aria-label','建筑剖切 3D；拖动旋转，双指或滚轮缩放，方向键转动，Home 复位');
      const scene=new T.Scene(),group=new T.Group();scene.add(group);
      scene.add(new T.HemisphereLight(0xfff5dc,0x38465d,2.5));const sun=new T.DirectionalLight(0xfff3dc,3);sun.position.set(-8,14,5);scene.add(sun);
      const camera=new T.OrthographicCamera(-10,10,6,-6,.1,200);
      const controls=new OrbitControls(camera,canvas);controls.enableDamping=false;controls.minZoom=1;controls.maxZoom=5;controls.maxPolarAngle=Math.PI*.49;controls.minPolarAngle=.08;
      const scale=Math.max(model.bounds[2],model.bounds[3])/16;const sourceWide=model.bounds[2]>=model.bounds[3];const toWorld=([x,y]:XY):XY=>sourceWide?[(x-model.bounds[0]-model.bounds[2]/2)/scale,(y-model.bounds[1]-model.bounds[3]/2)/scale]:[(model.bounds[1]+model.bounds[3]/2-y)/scale,(x-model.bounds[0]-model.bounds[2]/2)/scale];
      const shape=(polygon:Ring,holes:Ring[]=[])=>{const result=new T.Shape();polygon.forEach((p,i)=>{const [x,z]=toWorld(p);if(i===0)result.moveTo(x,-z);else result.lineTo(x,-z);});result.closePath();holes.forEach(r=>{const hole=new T.Path();r.forEach((p,i)=>{const [x,z]=toWorld(p);if(i===0)hole.moveTo(x,-z);else hole.lineTo(x,-z);});hole.closePath();result.holes.push(hole);});return result;};
      const floors=new Map<string,Mesh>();
      if(context){for(const color of new Set(context.strokes.map(s=>s.color))){const points=context.strokes.filter(s=>s.color===color).flatMap(s=>s.points.map(p=>{const [x,z]=toWorld(p);return new T.Vector3(x,.015,z);}));const geometry=new T.BufferGeometry().setFromPoints(points);group.add(new T.LineSegments(geometry,new T.LineBasicMaterial({color:color==='#465f72'?'#8a9aa2':color})));}}
      for(const area of context?.areas??[]){const extruded=!!area.displayHeight;const geometry=extruded?new T.ExtrudeGeometry(shape(area.polygon,area.holes),{depth:area.displayHeight!/scale,bevelEnabled:false}):new T.ShapeGeometry(shape(area.polygon,area.holes));geometry.rotateX(-Math.PI/2);const mesh=new T.Mesh(geometry,new T.MeshStandardMaterial({color:area.color,roughness:.9,side:T.DoubleSide}));mesh.position.y=area.kind==='land'?-.08:area.kind==='site'?-.06:-.04;mesh.userData.sourceFeatureId=area.id;group.add(mesh);}
      for(const space of model.spaces){const geometry=new T.ShapeGeometry(shape(space.polygon,space.holes));geometry.rotateX(-Math.PI/2);const mesh=new T.Mesh(geometry,new T.MeshStandardMaterial({color:floorColor(space.kind),roughness:.95,side:T.DoubleSide,transparent:space.geometryRole==='outline-region',opacity:space.geometryRole==='outline-region'?.14:1,depthWrite:space.geometryRole!=='outline-region'}));mesh.userData.spaceId=space.id;mesh.userData.featureId=`3d:${space.id}`;group.add(mesh);floors.set(space.id,mesh);}
      for(const wall of model.walls){const geometry=new T.ExtrudeGeometry(shape(wall.polygon),{depth:model.display.wallHeight/scale,bevelEnabled:false});geometry.rotateX(-Math.PI/2);const mesh=new T.Mesh(geometry,new T.MeshStandardMaterial({color:0xd4c299,roughness:.93}));mesh.userData.wallId=wall.id;group.add(mesh);}
      for(const column of model.columns){const [x,z]=toWorld(column.center);const height=model.display.columnHeight/scale;const mesh=new T.Mesh(new T.CylinderGeometry(column.radius/scale,column.radius/scale,height,16),new T.MeshStandardMaterial({color:0xdfcc9f,roughness:.9}));mesh.position.set(x,height/2,z);mesh.userData.columnId=column.id;group.add(mesh);}
      for(const solid of model.solids??[]){const [ax,az]=toWorld(solid.apex);const vertices:number[]=[];solid.footprint.forEach((p,i)=>{const [x,z]=toWorld(p),[nx,nz]=toWorld(solid.footprint[(i+1)%solid.footprint.length]);vertices.push(x,0,z,nx,0,nz,ax,solid.height/scale,az);});const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();const mesh=new T.Mesh(geometry,new T.MeshStandardMaterial({color:0xc7b17e,roughness:1,side:T.DoubleSide}));mesh.userData.spaceId=solid.spaceId;group.add(mesh);}
      // Treads are source symbols on the ground plane, never an invented stair flight.
      const stairPoints=model.stairs.flatMap(s=>s.treads.flatMap(([a,b])=>{const p=toWorld(a),q=toWorld(b);return [new T.Vector3(p[0],.015,p[1]),new T.Vector3(q[0],.015,q[1])];}));
      const stairGeometry=new T.BufferGeometry().setFromPoints(stairPoints);group.add(new T.LineSegments(stairGeometry,new T.LineBasicMaterial({color:0xd4c299})));
      const bounds=new T.Box3().setFromObject(group),center=bounds.getCenter(new T.Vector3());
      const initialDirection=(container.clientWidth<600?new T.Vector3(1,1.25,.15):new T.Vector3(.15,1.25,1)).normalize();camera.position.copy(center).addScaledVector(initialDirection,28);controls.target.copy(center);
      const labelLayer=document.createElement('div');labelLayer.className='architecture-three-labels';container.appendChild(labelLayer);
      const sceneLabels=model.labels.map(label=>{const button=document.createElement('button');button.type='button';button.textContent=label.text;button.title=model.spaces.find(s=>s.id===label.spaceId)?.title??label.text;button.setAttribute('aria-label',button.title);button.dataset.featureId=`3d:${label.spaceId}`;button.onclick=()=>current.current.onSelect(label.spaceId);labelLayer.appendChild(button);return {label,button};});
      let fitting=false;let width=1,height=1;
      const render=()=>{if(disposed||!renderer)return;floors.forEach((mesh,id)=>{const material=mesh.material as MeshStandardMaterial;const item=model.spaces.find(s=>s.id===id)!;material.color.set(id===current.current.activeId?0xd6b86b:floorColor(item.kind));});renderer.render(scene,camera);const occupied:Array<[number,number]>=[];for(const {label,button} of [...sceneLabels].sort((a,b)=>Number(b.label.spaceId===current.current.activeId)-Number(a.label.spaceId===current.current.activeId))){const [x,z]=toWorld(label.point);const solid=model.solids?.find(s=>s.spaceId===label.spaceId);const p=new T.Vector3(x,solid?solid.height/scale+.22:.22,z).project(camera);const px=(p.x+1)*width/2,py=(1-p.y)*height/2;const visible=px>16&&px<width-16&&py>14&&py<height-14&&!occupied.some(([a,b])=>Math.abs(a-px)<31&&Math.abs(b-py)<26);button.style.display=visible?'block':'none';if(visible){occupied.push([px,py]);button.style.transform=`translate(${px}px,${py}px) translate(-50%,-50%)`;button.setAttribute('aria-pressed',String(label.spaceId===current.current.activeId));}}};
      const fit=()=>{if(disposed||!container.isConnected||fitting)return;fitting=true;const rect=container.getBoundingClientRect();if(rect.width<1||rect.height<1){fitting=false;return;}width=rect.width;height=rect.height;renderer!.setSize(width,height,false);camera.lookAt(controls.target);camera.updateMatrixWorld();const corners=[];for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z])corners.push(new T.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse));const extentX=Math.max(...corners.map(p=>Math.abs(p.x))),extentY=Math.max(...corners.map(p=>Math.abs(p.y)));const halfHeight=Math.max(extentY,extentX/(width/height))*1.15;camera.left=-halfHeight*width/height;camera.right=-camera.left;camera.top=halfHeight;camera.bottom=-halfHeight;camera.updateProjectionMatrix();fitting=false;render();};
      const reset=()=>{camera.zoom=1;controls.target.copy(center);camera.position.copy(center).addScaledVector(initialDirection,28);camera.updateProjectionMatrix();controls.update();fit();};
      const zoom=(factor:number)=>{camera.zoom=Math.max(1,Math.min(5,camera.zoom*factor));if(camera.zoom===1){const direction=camera.position.clone().sub(controls.target);controls.target.copy(center);camera.position.copy(center).add(direction);}camera.updateProjectionMatrix();controls.update();render();};
      const orbit=(angle:number)=>{const delta=camera.position.clone().sub(controls.target).applyAxisAngle(new T.Vector3(0,1,0),angle);camera.position.copy(controls.target).add(delta);controls.update();render();};
      actions.current={reset,zoom,orbit,redraw:render};
      let previousZoom=1;const change=()=>{if(camera.zoom===1&&previousZoom>1){previousZoom=1;const direction=camera.position.clone().sub(controls.target);controls.target.copy(center);camera.position.copy(center).add(direction);controls.update();fit();}else{previousZoom=camera.zoom;render();}};controls.addEventListener('change',change);
      const ray=new T.Raycaster(),pointer=new T.Vector2();let start:{x:number;y:number;id:number}|null=null;let wasMulti=false;
      const down=(e:PointerEvent)=>{if(start){wasMulti=true;return;}start={x:e.clientX,y:e.clientY,id:e.pointerId};wasMulti=false;};
      const up=(e:PointerEvent)=>{const origin=start;start=null;if(!origin||wasMulti||e.pointerId!==origin.id||Math.hypot(e.clientX-origin.x,e.clientY-origin.y)>5)return;const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(group.children).find(item=>!!item.object.userData.spaceId);if(hit)current.current.onSelect(hit.object.userData.spaceId);};
      const cancel=()=>{start=null;wasMulti=true;};
      const key=(e:KeyboardEvent)=>{if(['ArrowLeft','ArrowRight','+','=','-','Home'].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft')orbit(-.18);if(e.key==='ArrowRight')orbit(.18);if(e.key==='+'||e.key==='=')zoom(1.25);if(e.key==='-')zoom(1/1.25);if(e.key==='Home')reset();};
      const loss=(e:Event)=>{e.preventDefault();current.current.onFail();};
      canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',cancel);canvas.addEventListener('lostpointercapture',cancel);canvas.addEventListener('keydown',key);canvas.addEventListener('webglcontextlost',loss);window.addEventListener('blur',cancel);document.addEventListener('visibilitychange',cancel);
      const observer=new ResizeObserver(fit);observer.observe(container);reset();setReady(true);
      cleanup=()=>{observer.disconnect();controls.removeEventListener('change',change);controls.dispose();canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',cancel);canvas.removeEventListener('lostpointercapture',cancel);canvas.removeEventListener('keydown',key);canvas.removeEventListener('webglcontextlost',loss);window.removeEventListener('blur',cancel);document.removeEventListener('visibilitychange',cancel);group.traverse(item=>{const mesh=item as Mesh;mesh.geometry?.dispose();if(mesh.material){const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];materials.forEach(m=>m.dispose());}});};
    }).catch(()=>{if(!disposed)current.current.onFail();});
    return ()=>{disposed=true;cleanup();actions.current=null;renderer?.dispose();renderer?.domElement.remove();container.querySelector('.architecture-three-labels')?.remove();};
  },[model,context,contextError]);
  return <div className="architecture-three" data-view="3d" data-active-floor={model.floor.id} data-active-space={activeId} data-model-version={model.version}>
    <div className="architecture-tools"><span>剖切模型 · 点选地面</span><div><button aria-label="向左旋转" onClick={()=>actions.current?.orbit(-.2)}>↶</button><button aria-label="向右旋转" onClick={()=>actions.current?.orbit(.2)}>↷</button><button aria-label="缩小模型" onClick={()=>actions.current?.zoom(1/1.25)}>−</button><button aria-label="放大模型" onClick={()=>actions.current?.zoom(1.25)}>＋</button><button onClick={()=>actions.current?.reset()}>显示全图</button></div></div>
    {contextError&&<p role="alert" className="evidence-note">场地细线暂未载入，当前只显示已保存的核心空间。<button onClick={retryContext}>重试背景数据</button></p>}
    <div className="architecture-canvas" ref={host}>{!ready&&<p>正在加载本地建筑模型…</p>}</div>
    <p className="architecture-legend">拖动旋转 · 右键平移 · 滚轮／双指缩放 · 剖切高度仅为展示</p>
  </div>;
}

export function ArchitectureMap({guide,selectedId,onSelect,locateRequest=0}:{guide:CulturalGuide;selectedId:string;onSelect:(id:string)=>void;locateRequest?:number}) {
  const exterior=exteriorCatalog[guide.slug];
  const [subject,setSubject]=useState<'interior'|'exterior'>('interior');
  const levels=guide.spatial.architectureLevels??[guide.spatial.architecture!];
  const initialModel=levels.find(level=>level.spaces.some(s=>s.nodeId===selectedId||s.id===selectedId))??guide.spatial.architecture!;
  const [modelId,setModelId]=useState(initialModel.id);
  const model=levels.find(level=>level.id===modelId)??levels[0];
  const entryId=model.entry.status==='mapped'?model.entry.spaceId:model.spaces[0].id;
  const [activeId,setActiveId]=useState(()=>model.spaces.find(s=>s.nodeId===selectedId||s.id===selectedId)?.id??entryId);
  const [view,setView]=useState<'2d'|'3d'>('2d');
  const [failure,setFailure]=useState(false);
  const lastNode=useRef(selectedId);
  const lastLocateRequest=useRef(locateRequest);
  useEffect(()=>{if(selectedId===lastNode.current&&locateRequest===lastLocateRequest.current)return;lastNode.current=selectedId;lastLocateRequest.current=locateRequest;const target=levels.find(level=>level.spaces.some(s=>s.nodeId===selectedId||s.id===selectedId));const space=target?.spaces.find(s=>s.nodeId===selectedId||s.id===selectedId);if(space&&target){setModelId(target.id);setActiveId(space.id);setSubject('interior');}},[selectedId,levels,locateRequest]);
  const select=useCallback((id:string)=>{const space=model.spaces.find(s=>s.id===id);if(!space)return;setActiveId(id);const canonicalId=space.nodeId??space.id;lastNode.current=canonicalId;onSelect(canonicalId);},[model,onSelect]);
  const failed=useCallback(()=>{setFailure(true);setView('2d');},[]);
  const active=model.spaces.find(s=>s.id===activeId)??model.spaces[0];
  const related=guide.highlights.filter(item=>item.nodeId&&item.nodeId===active.nodeId);
  const source=sourceById.get(model.source.id);
  return <section id="spatial" className="spatial-shell architecture-shell spatial-mode-shell" data-active-place={activeId} data-spatial-subject={subject}>
    {exterior&&<div className="spatial-subject-tabs" aria-label="内部与外观"><button aria-pressed={subject==='interior'} onClick={()=>setSubject('interior')}>内部／场地</button><button aria-pressed={subject==='exterior'} onClick={()=>setSubject('exterior')}>建筑外观</button><span>内部默认入口层 2D · 外观独立 2D／3D · 切换保留室内选择</span></div>}
    {subject==='exterior'&&exterior?<Suspense fallback={<p role="status">载入本地外观模块…</p>}><ExteriorMap exterior={exterior} onLocate={id=>{const target=levels.find(l=>l.spaces.some(s=>s.nodeId===id||s.id===id));const space=target?.spaces.find(s=>s.nodeId===id||s.id===id);if(target&&space){setModelId(target.id);setActiveId(space.id);}lastNode.current=id;onSelect(id);setSubject('interior');}}/></Suspense>:<>
    <header className="spatial-heading"><div><p className="eyebrow">Architecture, room by room</p><h2>{guide.spatial.title}</h2><p>点击空间查看建筑与参观介绍。2D 与 3D 使用同一份来源核对数据；展柜和开放状态不从图形推断。</p></div><div className="segmented" aria-label="地图视图"><button type="button" className={view==='2d'?'active':''} aria-pressed={view==='2d'} onClick={()=>setView('2d')}>2D 平面</button><button type="button" className={view==='3d'?'active':''} aria-pressed={view==='3d'} onClick={()=>{setFailure(false);setView('3d');}}>3D 剖切</button></div></header>
    {levels.length>1&&<div className="architecture-levels" aria-label="建筑楼层与区域">{levels.map(level=><button key={level.id} aria-pressed={level.id===model.id} onClick={()=>{const id=level.entry.status==='mapped'?level.entry.spaceId:level.spaces[0].id;const s=level.spaces.find(s=>s.id===id)!;setModelId(level.id);setActiveId(id);lastNode.current=s.nodeId??id;onSelect(lastNode.current);}}>{level.floor.title}</button>)}</div>}
    <div className="architecture-floor"><span>{model.floor.title}</span><span>来源支持的空间 · 非现场导航</span></div>
    {failure&&<p role="status" className="evidence-note">3D 暂时无法显示，已保留所选地点并切回同模型 2D。</p>}
    {model.entry.status==='unmapped'&&<p className="evidence-note">{model.entry.notice}</p>}
    <div className="spatial-layout architecture-layout"><div>{view==='2d'?<ArchitecturePlan key={model.id} model={model} activeId={activeId} onSelect={select}/>:<ArchitectureScene key={model.id} model={model} activeId={activeId} onSelect={select} onFail={failed}/>}</div><aside className="place-inspector architecture-inspector"><small>当前空间</small><h3 aria-live="polite">{active.title}</h3><p>{active.description}</p>{related.length>0&&<div className="architecture-related"><strong>在这里看什么</strong>{related.map(item=><a key={item.id} href={siteUrl(`#object-${item.id}`)}>{item.title} ↗</a>)}</div>}<label className="architecture-select">选择空间<select aria-label="选择建筑空间" value={active.id} onChange={e=>select(e.target.value)}>{model.spaces.map(space=><option key={space.id} value={space.id}>{space.title}</option>)}</select></label><div className="architecture-shortcuts">{model.labels.filter((label,i,all)=>all.findIndex(l=>l.spaceId===label.spaceId)===i).map(label=><button key={label.id} type="button" aria-pressed={activeId===label.spaceId} onClick={()=>select(label.spaceId)}><span>{label.text}</span>{model.spaces.find(s=>s.id===label.spaceId)!.title.replace(/^[A-Z] · /,'')}</button>)}</div></aside></div>
    <details className="architecture-evidence"><summary>平面依据与图示边界</summary><p>依据 {source?.publisher} 所载平面逐项重绘；{model.spaces.length} 个可操作空间、{model.walls.length} 段墙体、{model.columns.length} 处柱位。空间编号不等于推荐行走顺序。</p><ul>{model.limitations.map(note=><li key={note}>{note}</li>)}</ul><a href={siteUrl(source?.url)} target="_blank" rel="noreferrer">查看平面来源 ↗</a> · <a href={siteUrl(model.source.asset)} target="_blank" rel="noreferrer">核对本地来源文件 ↗</a></details>
    </>}
  </section>;
}
