import { siteUrl } from '../paths';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Material, Mesh, Object3D, WebGLRenderer } from 'three';
import type { CulturalGuide, PlanPoint, SpatialPlanArea, SpatialPlanFloor, SpatialReferenceImage } from '../data/types';
import { sourceById } from '../data/sources';
import { ArchitectureMap } from './ArchitectureMap';

const pointString = (points: PlanPoint[]) => points.map(([x, y]) => `${x},${y}`).join(' ');

function centerOf(points: PlanPoint[]) {
  const total = points.reduce((sum, [x, y]) => ({ x: sum.x + x, y: sum.y + y }), { x: 0, y: 0 });
  return { x: total.x / points.length, y: total.y / points.length };
}

function northRotation(north: 'up' | 'right' | 'down' | 'left' | undefined) {
  return north === 'right' ? 90 : north === 'down' ? 180 : north === 'left' ? 270 : 0;
}

function Plan2D({ guide, floor, selectedId, onSelect }: { guide: CulturalGuide; floor: SpatialPlanFloor; selectedId: string; onSelect: (id: string) => void }) {
  const plan = guide.spatial.plan!;
  const areas = plan.areas.filter((candidate) => candidate.floorId === floor.id);
  const paths = plan.paths.filter((candidate) => candidate.floorId === floor.id);
  const nodeNumber = new Map(guide.spatial.nodes.map((node, index) => [node.id, index + 1]));
  const entry = plan.entry?.floorId === floor.id ? plan.entry : undefined;
  return <div className="map-stage map-stage--2d attraction-plan-scroll" tabIndex={0} aria-label={`${guide.title}${floor.label}平面图；窄屏可横向滚动`}>
    <svg className="attraction-plan" viewBox="0 0 700 440" role="img" aria-label={`${guide.title}${floor.label}来源支持空间图`}>
      <title>{guide.title}｜{floor.label}</title>
      <desc>{plan.evidenceSummary}</desc>
      <rect className="plan-background" width="700" height="440"/>
      <g className="site-grid" aria-hidden="true">{[100, 200, 300, 400, 500, 600].map((x) => <line key={`x-${x}`} x1={x} x2={x} y1="34" y2="406"/>)}{[80, 160, 240, 320, 400].map((y) => <line key={`y-${y}`} x1="42" x2="658" y1={y} y2={y}/>)}</g>
      <polygon className="plan-outline" points={pointString(floor.outline)}/>
      {paths.map((route) => <g key={route.id} className={`plan-path plan-path--${route.status}`}><polyline points={pointString(route.points)}/><title>{route.label}</title></g>)}
      {areas.map((item) => {
        const active = item.nodeId === selectedId;
        const center = centerOf(item.polygon);
        const number = item.nodeId ? nodeNumber.get(item.nodeId) : undefined;
        return <g key={item.id} data-plan-area={item.id} className={`plan-area plan-area--${item.kind} ${active ? 'active' : ''}`} role={item.nodeId ? 'button' : undefined} tabIndex={item.nodeId ? 0 : undefined} aria-pressed={item.nodeId ? active : undefined} onClick={() => item.nodeId && onSelect(item.nodeId)} onKeyDown={(event) => { if (item.nodeId && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onSelect(item.nodeId); } }}>
          <polygon points={pointString(item.polygon)}/>
          {number && <g className="plan-marker" transform={`translate(${center.x} ${center.y})`}><circle r={active ? 15 : 13}/><text y="4">{String(number).padStart(2, '0')}</text></g>}
          <title>{item.label}</title>
        </g>;
      })}
      {entry && <g className="plan-entry" transform={`translate(${entry.point[0]} ${entry.point[1]})`}><circle r="8"/><path d="M -18 0 H 15 M 8 -7 L 15 0 L 8 7"/><text x="-2" y="-14">入口方向</text></g>}
      {plan.north && <g className="plan-north" transform={`translate(625 78) rotate(${northRotation(plan.north)})`}><path d="M 0 -24 L 8 7 L 0 2 L -8 7 Z"/><text y="-31">N</text></g>}
    </svg>
    <div className="plan-key" aria-label="图例"><span><i className="key-building"/>建筑／展区</span><span><i className="key-open"/>庭院／地景</span><span><i className="key-route"/>轴线／阅读关系</span></div>
    <p className="map-watermark">{plan.fidelity === 'source-proportional' ? '来源比例重绘' : '来源支持拓扑图'} · 非测绘 / 非导航</p>
  </div>;
}

const materialColor = (kind: SpatialPlanArea['kind']) => kind === 'water' ? 0x176a87 : kind === 'reef' ? 0x278b91 : kind === 'terrain' || kind === 'district' || kind === 'court' ? 0x6c765e : kind === 'sanctuary' || kind === 'monument' ? 0xc6a252 : 0x9e854d;

function Scene3D({ guide, floor, selectedId, onSelect, onFail }: { guide: CulturalGuide; floor: SpatialPlanFloor; selectedId: string; onSelect: (id: string) => void; onFail: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const selection = useRef(selectedId);
  const selectRef = useRef(onSelect);
  const objects = useRef(new Map<string, Object3D[]>());
  const renderRef = useRef<(() => void) | null>(null);
  const resetRef = useRef<(() => void) | null>(null);
  const [state, setState] = useState<'loading' | 'ready'>('loading');
  const areas = useMemo(() => guide.spatial.plan!.areas.filter((candidate) => candidate.floorId === floor.id), [floor.id, guide]);

  useEffect(() => { selection.current = selectedId; selectRef.current = onSelect; renderRef.current?.(); }, [selectedId, onSelect]);
  useEffect(() => {
    let disposed = false;
    let renderer: WebGLRenderer | undefined;
    let cleanup: (() => void) | undefined;
    const container = host.current;
    if (!container) return;
    setState('loading');
    objects.current.clear();
    void Promise.all([import('three'), import('three/examples/jsm/controls/OrbitControls.js')]).then(([THREE, controlModule]) => {
      if (disposed) return;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x06111e);
      scene.fog = new THREE.Fog(0x06111e, 14, 30);
      const camera = new THREE.PerspectiveCamera(42, 1, .1, 80);
      const initialCamera = new THREE.Vector3(8.5, 8, 10.5);
      camera.position.copy(initialCamera);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);
      renderer.domElement.tabIndex = 0;
      renderer.domElement.setAttribute('aria-label', `${guide.title}${floor.label}可旋转空间模型`);
      const controls = new controlModule.OrbitControls(camera, renderer.domElement);
      controls.target.set(0, .35, 0);
      controls.enableDamping = !matchMedia('(prefers-reduced-motion: reduce)').matches;
      controls.minDistance = 6;
      controls.maxDistance = 22;
      controls.maxPolarAngle = Math.PI * .48;
      resetRef.current = () => { camera.position.copy(initialCamera); controls.target.set(0, .35, 0); controls.update(); };
      scene.add(new THREE.HemisphereLight(0xffe7ad, 0x0b263e, 2.5));
      const sun = new THREE.DirectionalLight(0xffd276, 3.2); sun.position.set(-5, 10, 7); sun.castShadow = true; scene.add(sun);
      const base = new THREE.Mesh(new THREE.PlaneGeometry(12.3, 7.6), new THREE.MeshStandardMaterial({ color: 0x132c44, roughness: 1, transparent: true, opacity: .92 }));
      base.rotation.x = -Math.PI / 2; base.receiveShadow = true; scene.add(base);
      const toWorld = ([x, y]: PlanPoint): [number, number] => [(x - 350) / 52, (y - 220) / 52];
      areas.forEach((item) => {
        const shape = new THREE.Shape();
        item.polygon.forEach((point, index) => { const [x, z] = toWorld(point); if (index === 0) shape.moveTo(x, -z); else shape.lineTo(x, -z); });
        const depth = Math.max(.08, item.height * 1.35);
        const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, steps: 1 });
        geometry.rotateX(-Math.PI / 2);
        const material = new THREE.MeshStandardMaterial({ color: materialColor(item.kind), roughness: .82, metalness: .04 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true; mesh.receiveShadow = true; mesh.userData.nodeId = item.nodeId; mesh.userData.baseColor = materialColor(item.kind);
        if (item.nodeId) objects.current.set(item.nodeId, [...(objects.current.get(item.nodeId) ?? []), mesh]);
        scene.add(mesh);
      });
      const ray = new THREE.Raycaster(); const pointer = new THREE.Vector2(); let pointerStart: [number, number] | undefined;
      const pick = (event: PointerEvent) => { const bounds = renderer!.domElement.getBoundingClientRect(); pointer.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1); ray.setFromCamera(pointer, camera); const hit = ray.intersectObjects(scene.children, false).find((candidate) => candidate.object.userData.nodeId); const id = hit?.object.userData.nodeId as string | undefined; if (id) selectRef.current(id); };
      const down = (event: PointerEvent) => { pointerStart = [event.clientX, event.clientY]; };
      const up = (event: PointerEvent) => { if (pointerStart && Math.hypot(event.clientX - pointerStart[0], event.clientY - pointerStart[1]) < 5) pick(event); pointerStart = undefined; };
      const cancel = () => { pointerStart = undefined; };
      renderer.domElement.addEventListener('pointerdown', down); renderer.domElement.addEventListener('pointerup', up); renderer.domElement.addEventListener('pointercancel', cancel);
      const update = () => objects.current.forEach((items, id) => items.forEach((object) => object.traverse((child) => { const mesh = child as Mesh; if (!mesh.isMesh) return; const material = mesh.material as import('three').MeshStandardMaterial; material.color.setHex(id === selection.current ? 0xf0cd73 : Number(mesh.userData.baseColor)); material.emissive.setHex(id === selection.current ? 0x4a3308 : 0); })));
      const resize = () => { const bounds = container.getBoundingClientRect(); const width = Math.max(1, Math.min(Math.round(bounds.width), 2048)); const height = Math.max(1, Math.min(Math.round(bounds.height), 1200)); camera.aspect = width / height; camera.updateProjectionMatrix(); renderer!.setSize(width, height, false); update(); renderer!.render(scene, camera); };
      const observer = new ResizeObserver(resize); observer.observe(container); let frame = 0;
      const animate = () => { if (disposed) return; controls.update(); update(); renderer!.render(scene, camera); frame = requestAnimationFrame(animate); };
      renderRef.current = resize; resize(); animate(); setState('ready');
      cleanup = () => { observer.disconnect(); cancelAnimationFrame(frame); renderer?.domElement.removeEventListener('pointerdown', down); renderer?.domElement.removeEventListener('pointerup', up); renderer?.domElement.removeEventListener('pointercancel', cancel); controls.dispose(); scene.traverse((object) => { const mesh = object as Mesh; mesh.geometry?.dispose?.(); const material = mesh.material as Material | Material[] | undefined; if (Array.isArray(material)) material.forEach((item) => item.dispose()); else material?.dispose?.(); }); };
    }).catch(() => onFail());
    return () => { disposed = true; cleanup?.(); resetRef.current = null; objects.current.clear(); renderer?.dispose(); renderer?.domElement.remove(); };
  }, [areas, floor, guide, onFail]);

  return <div className="map-stage map-stage--3d" ref={host}>{state === 'loading' && <p className="map-loading">正在加载本地 3D 空间图…</p>}<button className="map-reset" type="button" onClick={() => resetRef.current?.()}>重置视角</button><p className="map-watermark">与 2D 共用同一组多边形 · 拖动旋转 · 滚轮／双指缩放</p></div>;
}

function ReferencePlan({ reference: item }: { reference: SpatialReferenceImage }) {
  const [zoom, setZoom] = useState(1);
  useEffect(() => setZoom(1), [item.id]);
  return <div className="reference-plan">
    <div className="reference-plan__toolbar" aria-label="平面图缩放工具">
      <span>原始图件 · {item.width} × {item.height}</span>
      <div><button type="button" onClick={() => setZoom((value) => Math.max(1, Number((value - .25).toFixed(2))))} disabled={zoom <= 1} aria-label="缩小地图">−</button><output aria-live="polite">{Math.round(zoom * 100)}%</output><button type="button" onClick={() => setZoom((value) => Math.min(3, Number((value + .25).toFixed(2))))} disabled={zoom >= 3} aria-label="放大地图">＋</button><button type="button" onClick={() => setZoom(1)}>适合窗口</button></div>
    </div>
    <div className="reference-plan__viewport" tabIndex={0} aria-label={`${item.label}；放大后可双向滚动`} style={{ aspectRatio: `${item.width} / ${item.height}` }}>
      <img src={siteUrl(item.src)} alt={item.alt} draggable={false} style={{ width: `${zoom * 100}%` }}/>
    </div>
    <div className="reference-plan__caption"><p>{item.caption}</p><a href={siteUrl(item.src)} target="_blank" rel="noreferrer">打开本地原图 ↗</a></div>
  </div>;
}

function ReferenceSpatial({ guide, selectedId, onSelect }: { guide: CulturalGuide; selectedId: string; onSelect: (id: string) => void }) {
  const references = guide.spatial.referenceImages ?? [];
  const [referenceId, setReferenceId] = useState(references[0]?.id ?? '');
  useEffect(() => setReferenceId(references[0]?.id ?? ''), [guide.slug, references]);
  const activeReference = references.find((item) => item.id === referenceId) ?? references[0];
  const selected = guide.spatial.nodes.find((node) => node.id === selectedId) ?? guide.spatial.nodes[0];
  const sourceIds = [...new Set([...guide.spatial.sourceIds, ...references.map((item) => item.sourceId)])];
  const sourceLinks = sourceIds.map((id) => sourceById.get(id)).filter((source) => source?.url);
  if (!activeReference) return <section className="spatial-shell" id="spatial"><header className="spatial-heading"><div><p className="eyebrow">Spatial evidence status</p><h2>{guide.spatial.title}</h2><p>{guide.spatial.description}</p></div></header><p className="evidence-note">当前没有可离线交付的平面原图；页面只保留下方文字空间索引，不声称地图已经完成。</p></section>;
  return <section className="spatial-shell spatial-shell--reference" id="spatial">
    <header className="spatial-heading"><div><p className="eyebrow">Reviewed plan reference</p><h2>{guide.spatial.title}</h2><p>{guide.spatial.description}</p></div><span className="precision-badge">核验图件 · 已本地化</span></header>
    {references.length > 1 && <div className="floor-tabs" role="tablist" aria-label="平面图页">{references.map((item) => <button type="button" role="tab" aria-selected={item.id === activeReference.id} className={item.id === activeReference.id ? 'active' : ''} key={item.id} onClick={() => setReferenceId(item.id)}>{item.label}</button>)}</div>}
    <div className="spatial-layout"><ReferencePlan reference={activeReference}/><aside className="place-inspector"><small>参观空间索引 · 不冒充坐标定位</small><h3>{selected.name}</h3><p>{selected.description}</p><div className="stop-picker">{guide.spatial.nodes.map((node, index) => <button key={node.id} type="button" aria-pressed={node.id === selected.id} onClick={() => onSelect(node.id)}><span>{String(index + 1).padStart(2, '0')}</span>{node.name}<em>文字索引</em></button>)}</div></aside></div>
    <div className="map-evidence"><p>{guide.spatial.evidenceNote}</p>{!!guide.spatial.limitations?.length && <ul>{guide.spatial.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>}<div>{sourceLinks.map((source) => <a key={source!.id} href={siteUrl(source!.url)} target="_blank" rel="noreferrer">{source!.publisher}：{source!.title} ↗</a>)}</div><small>文件校验：SHA-256 {activeReference.sha256}</small></div>
  </section>;
}

function SpatialIndex({ guide, selectedId, onSelect }: { guide: CulturalGuide; selectedId: string; onSelect: (id: string) => void }) {
  return <section className="spatial-shell" id="spatial"><header className="spatial-heading"><div><p className="eyebrow">Spatial index</p><h2>{guide.spatial.title}</h2><p>{guide.spatial.description}</p></div><span className="precision-badge">仅文字索引</span></header><div className="spatial-index">{guide.spatial.nodes.map((node, index) => <article key={node.id} className={node.id === selectedId ? 'active' : ''}><button type="button" onClick={() => onSelect(node.id)}><span>{String(index + 1).padStart(2, '0')}</span><h3>{node.name}</h3><p>{node.description}</p></button></article>)}</div><p className="evidence-note">{guide.spatial.evidenceNote}</p></section>;
}

export function GuideSpatial({ guide, selectedId, onSelect, locateRequest=0 }: { guide: CulturalGuide; selectedId: string; onSelect: (id: string) => void; locateRequest?:number }) {
  if (guide.spatial.architecture) return <ArchitectureMap key={guide.slug} guide={guide} selectedId={selectedId} onSelect={onSelect} locateRequest={locateRequest}/>;
  if (guide.spatial.mode === 'official-plan-reference') return <ReferenceSpatial guide={guide} selectedId={selectedId} onSelect={onSelect}/>;
  if (guide.spatial.mode === 'spatial-index') return <SpatialIndex guide={guide} selectedId={selectedId} onSelect={onSelect}/>;
  if (guide.spatial.mode === 'omit') return <section className="spatial-shell" id="spatial"><header className="spatial-heading"><div><p className="eyebrow">Spatial evidence status</p><h2>{guide.spatial.title}</h2><p>{guide.spatial.description}</p></div></header><p className="evidence-note">{guide.spatial.evidenceNote}</p></section>;
  return <LegacyInteractiveSpatial key={guide.slug} guide={guide} selectedId={selectedId} onSelect={onSelect}/>;
}

function LegacyInteractiveSpatial({ guide, selectedId, onSelect }: { guide: CulturalGuide; selectedId: string; onSelect: (id: string) => void }) {
  const plan = guide.spatial.plan;
  const [view, setView] = useState<'2d' | '3d'>('2d');
  const [floorId, setFloorId] = useState(plan?.defaultFloorId ?? '');
  const handleSceneFail = useCallback(() => setView('2d'), []);
  const selected = guide.spatial.nodes.find((node) => node.id === selectedId) ?? guide.spatial.nodes[0];
  const handleFloorChange = useCallback((nextFloorId: string) => {
    if (!plan) return;
    setFloorId(nextFloorId);
    const firstMappedNode = plan.areas.find((candidate) => candidate.floorId === nextFloorId && candidate.nodeId)?.nodeId;
    if (firstMappedNode) onSelect(firstMappedNode);
  }, [onSelect, plan]);

  useEffect(() => {
    if (!plan) return;
    const matchingArea = plan.areas.find((candidate) => candidate.nodeId === selected.id);
    if (matchingArea) setFloorId(matchingArea.floorId);
  }, [plan, selected.id]);

  if (!plan) return <section className="spatial-shell" id="spatial"><p className="evidence-note">该景点尚无可验收的空间模型。</p></section>;
  const floor = plan.floors.find((candidate) => candidate.id === floorId) ?? plan.floors[0];
  const sourceLinks = plan.sourceIds.map((id) => sourceById.get(id)).filter((source) => source?.url);
  const mappedNodeIds = new Set(plan.areas.filter((candidate) => candidate.floorId === floor.id).map((candidate) => candidate.nodeId));
  const allMappedNodeIds = new Set(plan.areas.map((candidate) => candidate.nodeId));

  return <section className="spatial-shell" id="spatial">
    <header className="spatial-heading"><div><p className="eyebrow">Evidence-backed attraction map</p><h2>{guide.spatial.title}</h2><p>{guide.spatial.description}</p></div><div className="segmented" aria-label="地图视图"><button aria-pressed={view === '2d'} className={view === '2d' ? 'active' : ''} onClick={() => setView('2d')} type="button">2D 平面</button><button aria-pressed={view === '3d'} className={view === '3d' ? 'active' : ''} onClick={() => setView('3d')} type="button">3D 体量</button></div></header>
    {plan.floors.length > 1 && <div className="floor-tabs" role="tablist" aria-label="场地与楼层">{plan.floors.map((candidate) => <button type="button" role="tab" aria-selected={candidate.id === floor.id} className={candidate.id === floor.id ? 'active' : ''} key={candidate.id} onClick={() => handleFloorChange(candidate.id)}>{candidate.label}</button>)}</div>}
    <div className="spatial-layout"><div>{view === '2d' ? <Plan2D guide={guide} floor={floor} selectedId={selected.id} onSelect={onSelect}/> : <Scene3D guide={guide} floor={floor} selectedId={selected.id} onSelect={onSelect} onFail={handleSceneFail}/>}</div><aside className="place-inspector"><small>当前地点 · {floor.label}</small><h3>{selected.name}</h3><p>{selected.description}</p><div className="stop-picker">{guide.spatial.nodes.map((node, index) => { const mappedHere = mappedNodeIds.has(node.id); const mappedElsewhere = allMappedNodeIds.has(node.id); return <button key={node.id} type="button" aria-pressed={node.id === selected.id} className={!mappedHere ? 'off-floor' : ''} onClick={() => onSelect(node.id)}><span>{String(index + 1).padStart(2, '0')}</span>{node.name}{!mappedHere && <em>{mappedElsewhere ? '切换图层' : '资料不足，未定位'}</em>}</button>; })}</div></aside></div>
    <div className="map-evidence"><p>{plan.evidenceSummary}</p><div>{sourceLinks.map((source) => <a key={source!.id} href={siteUrl(source!.url)} target="_blank" rel="noreferrer">{source!.publisher}：{source!.title} ↗</a>)}</div></div>
  </section>;
}
