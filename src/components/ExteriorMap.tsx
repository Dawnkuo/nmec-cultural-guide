import { useCallback,useEffect,useMemo,useRef,useState } from 'react';
import * as T from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ExteriorGuide, ExteriorModel } from '../data/exteriors/types';
import { sourceById } from '../data/sources';
import { ArchitecturePlan } from './ArchitectureMap';
import type { ArchitecturalModel, Ring } from '../data/architecture/types';
import {createExteriorGroup,directionVector,exteriorPalette,exteriorPlanPaths,exteriorPlanBounds} from './exterior-geometry';
import './exterior-map.css';

function ExteriorPlan({model,activeId,onSelect}:{model:ExteriorModel;activeId:string;onSelect:(id:string)=>void}){
 // Reuse tested input, zoom, collision-aware labels and selection semantics.
 const plan=useMemo<ArchitecturalModel>(()=>({id:model.id,version:model.version,source:{id:model.sourceIds[0],asset:model.referenceImage,sha256:'source-linked-exterior',width:model.bounds[2],height:model.bounds[3],projection:'orthographic',review:model.coordinateSystem},floor:{id:model.id,title:model.title+' · 外观俯视'},bounds:exteriorPlanBounds(model),entry:{status:'unmapped',notice:'外观平面不承担入口导航。',basis:'Exterior view'},spaces:model.features.map(f=>({id:f.id,nodeId:f.nodeId,title:f.title,description:f.description,kind:'court',polygon:f.footprint,anchor:f.anchor,evidenceId:f.sourceIds[0],geometryRole:'outline-region'})),walls:[],columns:[],stairs:[],openings:[],labels:model.features.map((f,i)=>({id:'exterior-label-'+f.id,text:String(i+1).padStart(2,'0'),point:f.anchor,spaceId:f.id})),evidence:[],display:{wallHeight:0,columnHeight:0,heightStatus:'display-only'},limitations:model.limitations}),[model]);
 const svgContext=useMemo(()=>({areas:model.parts.flatMap(p=>p.geometry.kind==='prism'?[{id:p.id,polygon:p.geometry.footprint,holes:p.geometry.holes,kind:p.material,color:exteriorPalette[p.material]}]:exteriorPlanPaths(p).map(r=>({id:p.id,polygon:r,holes:undefined,kind:p.material,color:exteriorPalette[p.material]}))),strokes:[]}),[model]);
 return <ArchitecturePlan model={plan} activeId={activeId} onSelect={onSelect} inlineContext={svgContext} exterior/>;
}

function ExteriorScene({model,activeId,onSelect,onFail}:{model:ExteriorModel;activeId:string;onSelect:(id:string)=>void;onFail:()=>void}){
 const host=useRef<HTMLDivElement>(null),current=useRef({activeId,onSelect,onFail});current.current={activeId,onSelect,onFail};
 const actions=useRef<{preset:(id:string)=>void;zoom:(factor:number)=>void;render:()=>void}|undefined>(undefined);
 const [ready,setReady]=useState(false),[preset,setPreset]=useState('oblique');
 useEffect(()=>actions.current?.render(),[activeId]);
 useEffect(()=>{
  const el=host.current;if(!el)return;let renderer:T.WebGLRenderer|undefined;let cleanup=()=>{};let disposed=false;setReady(false);
  try{
   renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor('#071522');renderer.outputColorSpace=T.SRGBColorSpace;el.appendChild(renderer.domElement);
   const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('aria-label','外观三维模型：拖动旋转，滚轮缩放，方向键转动，Home复位');
   const scene=new T.Scene(),group=createExteriorGroup(model);scene.add(group);scene.add(new T.HemisphereLight(0xfff4dd,0x384d66,2.6));const sun=new T.DirectionalLight(0xffedd1,3.1);sun.position.set(-10,19,13);scene.add(sun);
   const camera=new T.OrthographicCamera(-10,10,7,-7,.01,250);const controls=new OrbitControls(camera,canvas);controls.enableDamping=false;controls.maxPolarAngle=Math.PI*.5;controls.minPolarAngle=.001;controls.minZoom=1;controls.maxZoom=8;
   const box=new T.Box3().setFromObject(group),center=box.getCenter(new T.Vector3());
   const units=Math.max(model.bounds[2],model.bounds[3])/16;
   const world=(x:number,z:number,y=0)=>new T.Vector3((x-model.bounds[0]-model.bounds[2]/2)/units,y/units,(z-model.bounds[1]-model.bounds[3]/2)/units);
   const layer=document.createElement('div');layer.className='architecture-three-labels exterior-three-labels';el.appendChild(layer);
   const labels=model.features.map((f,i)=>{const button=document.createElement('button');button.textContent=String(i+1).padStart(2,'0');button.title=f.title;button.setAttribute('aria-label',f.title);button.dataset.exteriorFeature=f.id;button.onclick=()=>current.current.onSelect(f.id);layer.appendChild(button);const featureBox=new T.Box3();group.children.filter(p=>p.userData.featureId===f.id).forEach(p=>featureBox.expandByObject(p));return {button,f,y:featureBox.isEmpty()?0:featureBox.max.y};});
   const materials=new Map<string,T.MeshStandardMaterial>();const originals=new Set<T.Material>();for(const obj of group.children){const mesh=obj as T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>;originals.add(mesh.material);mesh.material=mesh.material.clone();materials.set(mesh.uuid,mesh.material);}originals.forEach(m=>m.dispose());
   let width=1,height=1,fitting=false;
   const render=()=>{if(disposed||!renderer)return;for(const obj of group.children){const mesh=obj as T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>;mesh.material.color.set(mesh.userData.baseColor);mesh.material.emissive.set(mesh.userData.featureId===current.current.activeId?'#534016':'#000000');mesh.material.emissiveIntensity=.33;}
    renderer.render(scene,camera);const occupied:Array<[number,number]>=[];for(const {button,f,y}of [...labels].sort((a,b)=>Number(b.f.id===current.current.activeId)-Number(a.f.id===current.current.activeId))){const p=world(...f.anchor);p.y=y+.12;p.project(camera);const x=(p.x+1)*width/2,z=(1-p.y)*height/2,visible=x>20&&x<width-20&&z>20&&z<height-20&&!occupied.some(([a,b])=>Math.abs(a-x)<38&&Math.abs(b-z)<30);button.hidden=!visible;if(visible){occupied.push([x,z]);button.style.transform=`translate(${x}px,${z}px) translate(-50%,-50%)`;button.setAttribute('aria-pressed',String(f.id===current.current.activeId));}}
    canvas.dataset.camera=[...camera.position.toArray(),camera.zoom].map(n=>n.toFixed(3)).join(',');canvas.dataset.ready='true';
   };
   const fit=()=>{if(fitting||!el.isConnected||disposed)return;const r=el.getBoundingClientRect();if(r.width<1||r.height<1)return;fitting=true;width=r.width;height=r.height;renderer!.setSize(width,height,false);camera.lookAt(controls.target);camera.updateMatrixWorld();const pts:T.Vector3[]=[];for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])pts.push(new T.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse));const ex=Math.max(...pts.map(p=>Math.abs(p.x))),ey=Math.max(...pts.map(p=>Math.abs(p.y))),half=Math.max(ey,ex/(width/height)) *1.16;camera.left=-half*width/height;camera.right=-camera.left;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();fitting=false;render();};
   const presetView=(id:string)=>{const forward=directionVector(model.defaultDirection),front=directionVector(model.frontDirection??[0,0,1]);front.y=.07;const side=new T.Vector3(front.z,.07,-front.x);const direction=id==='top'?new T.Vector3(0,1,.001):id==='front'?front:id==='side'?side:forward;camera.zoom=1;controls.target.copy(center);camera.position.copy(center).addScaledVector(direction.normalize(),40);controls.update();fit();setPreset(id);};
   const zoom=(factor:number)=>{camera.zoom=Math.min(8,Math.max(1,camera.zoom*factor));camera.updateProjectionMatrix();controls.update();render();};
   actions.current={preset:presetView,zoom,render};
   controls.addEventListener('change',render);
   let start:{x:number;y:number;id:number}|undefined,multi=false;
   const down=(e:PointerEvent)=>{if(start){multi=true;return;}start={x:e.clientX,y:e.clientY,id:e.pointerId};multi=false;};
   const cancel=()=>{start=undefined;multi=true;};
   const up=(e:PointerEvent)=>{const s=start;start=undefined;if(!s||multi||s.id!==e.pointerId||Math.hypot(e.clientX-s.x,e.clientY-s.y)>5)return;const r=canvas.getBoundingClientRect(),ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const hit=ray.intersectObjects(group.children).find(h=>model.features.some(f=>f.id===h.object.userData.featureId));if(hit)current.current.onSelect(hit.object.userData.featureId);};
   const key=(e:KeyboardEvent)=>{if(['Home','+','=','-','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))e.preventDefault();if(e.key==='Home')presetView('oblique');if(e.key==='+'||e.key==='=')zoom(1.25);if(e.key==='-')zoom(1/1.25);if(e.key.startsWith('Arrow')){const delta=camera.position.clone().sub(controls.target),s=new T.Spherical().setFromVector3(delta);if(e.key==='ArrowLeft')s.theta-=.15;if(e.key==='ArrowRight')s.theta+=.15;if(e.key==='ArrowUp')s.phi=Math.max(.01,s.phi-.15);if(e.key==='ArrowDown')s.phi=Math.min(Math.PI/2,s.phi+.15);camera.position.copy(controls.target).add(new T.Vector3().setFromSpherical(s));controls.update();render();}};
   const loss=(e:Event)=>{e.preventDefault();current.current.onFail();};
   canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',cancel);canvas.addEventListener('lostpointercapture',cancel);canvas.addEventListener('keydown',key);canvas.addEventListener('webglcontextlost',loss);window.addEventListener('blur',cancel);
   const resize=new ResizeObserver(fit);resize.observe(el);presetView('oblique');setReady(true);
   cleanup=()=>{resize.disconnect();controls.removeEventListener('change',render);controls.dispose();canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',cancel);canvas.removeEventListener('lostpointercapture',cancel);canvas.removeEventListener('keydown',key);canvas.removeEventListener('webglcontextlost',loss);window.removeEventListener('blur',cancel);group.traverse(obj=>{if(obj instanceof T.Mesh){obj.geometry.dispose();const ms=Array.isArray(obj.material)?obj.material:[obj.material];ms.forEach(m=>m.dispose());}});materials.clear();layer.remove();};
  }catch{current.current.onFail();}
  return()=>{disposed=true;cleanup();actions.current=undefined;renderer?.dispose();renderer?.domElement.remove();};
 },[model]);
 return <div className="exterior-scene" data-exterior-model={model.id} data-view="3d"><div className="architecture-tools"><span>拖动旋转 · 点选建筑</span><div><button aria-label="缩小外观" onClick={()=>actions.current?.zoom(1/1.25)}>−</button><button aria-label="放大外观" onClick={()=>actions.current?.zoom(1.25)}>＋</button><button onClick={()=>actions.current?.preset('oblique')}>显示全貌</button></div></div><div className="exterior-presets" aria-label="外观观察方向">{[['oblique','斜视'],['front','正面'],['side','侧面'],['top','俯视']].map(([id,title])=><button key={id} aria-pressed={preset===id} onClick={()=>actions.current?.preset(id)}>{title}</button>)}</div><div className="architecture-canvas exterior-canvas" ref={host}>{!ready&&<p>载入本地外观模型…</p>}</div><p className="architecture-legend">实体可点选 · 右键平移 · 滚轮／双指缩放 · Home 复位</p></div>;
}

export function ExteriorMap({exterior,onLocate}:{exterior:ExteriorGuide;onLocate:(nodeId:string)=>void}){
 const [modelId,setModelId]=useState(exterior.models[0].id),[view,setView]=useState<'2d'|'3d'>('3d'),[failure,setFailure]=useState(false);
 const model=exterior.models.find(m=>m.id===modelId)??exterior.models[0];
 const [selected,setSelected]=useState(model.features[0].id);const active=model.features.find(f=>f.id===selected)??model.features[0];
 const fail=useCallback(()=>{setFailure(true);setView('2d');},[]);
 return <section className="exterior-map" data-active-exterior={model.id} data-active-exterior-feature={active.id}>
  <header className="spatial-heading"><div><p className="eyebrow">Exterior · Form and place</p><h2>{model.title}</h2><p>{exterior.intro}</p></div><div className="segmented" aria-label="外观视图"><button aria-pressed={view==='3d'} className={view==='3d'?'active':''} onClick={()=>{setView('3d');setFailure(false);}}>3D 外观</button><button aria-pressed={view==='2d'} className={view==='2d'?'active':''} onClick={()=>setView('2d')}>2D 外观俯视</button></div></header>
  {exterior.models.length>1&&<div className="architecture-levels" aria-label="外观范围">{exterior.models.map(m=><button key={m.id} aria-pressed={m.id===model.id} onClick={()=>{setModelId(m.id);setSelected(m.features[0].id);}}>{m.title}</button>)}</div>}
  <p className="exterior-precision">主要形体解读 · 有来源的底面与构成 · 未测量标高以比例示意 · 非导航</p>
  {failure&&<p role="status" className="evidence-note">3D 无法显示，已切回同一模型的 2D 外观俯视；所选对象保留。</p>}
  <div className="spatial-layout architecture-layout"><div>{view==='3d'?<ExteriorScene key={model.id} model={model} activeId={active.id} onSelect={setSelected} onFail={fail}/>:<ExteriorPlan model={model} activeId={active.id} onSelect={setSelected}/>}</div><aside className="place-inspector architecture-inspector exterior-inspector"><small>外观观察点 {String(model.features.indexOf(active)+1).padStart(2,'0')}</small><h3 aria-live="polite">{active.title}</h3><p>{active.description}</p><strong>现场怎么看</strong><ul>{active.lookFor.map(s=><li key={s}>{s}</li>)}</ul>{active.nodeId&&<button className="exterior-locate" onClick={()=>onLocate(active.nodeId!)}>转到内部／场地对应位置</button>}<label className="architecture-select">选择外观观察点<select aria-label="选择外观观察点" value={active.id} onChange={e=>setSelected(e.target.value)}>{model.features.map((f,i)=><option value={f.id} key={f.id}>{String(i+1).padStart(2,'0')} · {f.title}</option>)}</select></label><p className="exterior-feature-basis">形体依据：{active.basis}</p></aside></div>
  <div className="exterior-bottom"><figure><a href={model.referenceImage} target="_blank" rel="noreferrer"><img src={model.referenceImage} alt={`${model.title}的来源外观对照`} loading="lazy"/></a><figcaption>{model.referenceCaption} <a href={model.referencePage??`#sources`}>来源与署名 ↗</a></figcaption></figure><details className="architecture-evidence"><summary>外观来源、精度与边界</summary><p>{model.coordinateSystem}</p><ul>{model.limitations.map(s=><li key={s}>{s}</li>)}</ul>{[...new Set(model.sourceIds)].map(id=>{const s=sourceById.get(id);return s?.url?<a key={id} href={s.url} target="_blank" rel="noreferrer">{s.publisher}：{s.title} ↗</a>:<p key={id}>来源待核对：{id}</p>;})}<small>{model.parts.length} 个结构构件 · {model.features.length} 个解读观察点 · {model.version}</small></details></div>
 </section>;
}
