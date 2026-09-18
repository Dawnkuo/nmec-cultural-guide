import { siteUrl } from '../paths';
import { useId, useMemo, useState } from 'react';
import { egyptOutline, nationalJourneyOrder, nationalJourneyRegions } from '../data/map-data';

const width = 760;
const height = 590;
const bounds = { minLng: 23.6, maxLng: 37.6, minLat: 21.5, maxLat: 32.2 };
const project = (lng: number, lat: number) => ({
  x: 55 + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (width - 110),
  y: 45 + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * (height - 90),
});

const regionById = new Map(nationalJourneyRegions.map((region) => [region.id, region]));

export function EgyptMap() {
  const [selectedId, setSelectedId] = useState('cairo-giza');
  const selected = regionById.get(selectedId) ?? nationalJourneyRegions[0];
  const arrowId = `egypt-route-arrow-${useId().replaceAll(':', '')}`;
  const outline = useMemo(() => egyptOutline.map(([lng, lat]) => {
    const point = project(lng, lat);
    return `${point.x},${point.y}`;
  }).join(' '), []);
  const routePoints = nationalJourneyOrder.map((id) => {
    const region = regionById.get(id)!;
    return { id, ...project(region.coordinates[0], region.coordinates[1]) };
  });
  const routeLegs = routePoints.slice(1).map((to, index) => {
    const from = routePoints[index];
    const dx = to.x - from.x; const dy = to.y - from.y;
    const length = Math.max(1, Math.hypot(dx, dy));
    const returning = nationalJourneyOrder[index + 1] === 'cairo-giza';
    const bend = returning ? -34 : nationalJourneyOrder[index] === 'abu-simbel' ? 20 : 0;
    const control = { x: (from.x + to.x) / 2 - dy / length * bend, y: (from.y + to.y) / 2 + dx / length * bend };
    const mid = { x: from.x * .25 + control.x * .5 + to.x * .25, y: from.y * .25 + control.y * .5 + to.y * .25 };
    return { from, to, path: `M${from.x} ${from.y} Q${control.x} ${control.y} ${to.x} ${to.y}`, arrow: `M${mid.x - dx / length * 5} ${mid.y - dy / length * 5} L${mid.x + dx / length * 5} ${mid.y + dy / length * 5}` };
  });

  return <section className="national-map" aria-labelledby="national-map-title">
    <header className="map-section-heading"><div><p className="eyebrow">National journey map</p><h2 id="national-map-title">九段埃及旅程，不把景点挤进全国图</h2><p>全国层级只显示城市与区域；箭头表达排期先后，独立景点进入逐日地图和景点章节。</p></div><a href={siteUrl("/itinerary/")}>进入逐日地图 →</a></header>
    <div className="national-map-layout">
      <div className="national-map-scroll" tabIndex={0} aria-label="全国地图；窄屏可横向滚动">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="埃及全国行程城市与排期顺序地图">
        <desc>{nationalJourneyOrder.map((id, index) => `${index + 1}. ${regionById.get(id)!.shortName}`).join(' → ')}</desc>
        <defs>
          <linearGradient id="egypt-fill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#17304b"/><stop offset="1" stopColor="#0a1727"/></linearGradient>
          <marker id={arrowId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L8,4 L0,8 Z" className="national-arrow-head"/></marker>
        </defs>
        <rect width={width} height={height} className="map-ocean"/>
        {[24, 26, 28, 30, 32].map((lat) => { const point = project(22, lat); return <line key={lat} className="graticule" x1="35" x2={width - 35} y1={point.y} y2={point.y}/>; })}
        {[24, 28, 32].map((lng) => { const point = project(lng, 22); return <line key={lng} className="graticule" y1="30" y2={height - 30} x1={point.x} x2={point.x}/>; })}
        <polygon points={outline} fill="url(#egypt-fill)" className="country-outline"/>
        {routeLegs.map((leg, index) => <g key={`${leg.from.id}-${leg.to.id}-${index}`} data-route-leg={index + 1}><path d={leg.path} className="national-route"/><path d={leg.arrow} className="national-route-arrow" markerEnd={`url(#${arrowId})`}/></g>)}
        {nationalJourneyRegions.map((region) => {
          const point = project(region.coordinates[0], region.coordinates[1]);
          const active = region.id === selected.id;
          const labelWidth = Math.max(128, region.shortName.length * 17 + region.visits.length * 26 + 28);
          return <g key={region.id} className={`national-region ${active ? 'active' : ''}`} role="button" tabIndex={0} aria-pressed={active} aria-label={`查看${region.name}`} onClick={() => setSelectedId(region.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelectedId(region.id); }}>
            <line className="national-region-leader" x1={point.x} y1={point.y} x2={region.label[0]} y2={region.label[1]}/>
            <circle className="national-region-anchor" cx={point.x} cy={point.y} r={active ? 8 : 6}/>
            <g transform={`translate(${region.label[0]} ${region.label[1]})`}>
              <rect className="national-region-label" x={-labelWidth / 2} y="-20" width={labelWidth} height="40" rx="2"/>
              <text className="national-region-steps" x={-labelWidth / 2 + 12} y="5">{region.visits.map((visit) => String(visit).padStart(2, '0')).join(' · ')}</text>
              <text className="national-region-name" x={labelWidth / 2 - 12} y="5" textAnchor="end">{region.shortName}</text>
            </g>
          </g>;
        })}
        <text x="40" y={height - 24} className="map-disclaimer">WGS84 区域点位 · Natural Earth 1:50m 轮廓 · 排期顺序，非导航</text>
      </svg>
      </div>
      <aside className="map-inspector"><span>已选择区域</span><h3>{selected.name}</h3><p>{selected.dates}</p><strong>第 {selected.visits.map((visit) => String(visit).padStart(2, '0')).join('、')} 站</strong><small>{selected.guideCount ? `${selected.guideCount} 个独立景点导览` : '本区域景点按当前确定资料整理'}；全国图不显示单个景点。</small><a href={siteUrl(selected.cityHref)}>打开区域章节 →</a></aside>
    </div>
  </section>;
}
