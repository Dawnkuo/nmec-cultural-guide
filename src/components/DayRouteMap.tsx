import { siteUrl } from '../paths';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { TripDay, TripItem } from '../data/types';
import {
  cityMapLabels,
  isMapEligibleTripItem,
  mapLocationForTripItem,
  unlocatedMapItems,
  type CityMapId,
  type TripMapLocation,
} from '../data/trip-map-locations';

const MAP_WIDTH = 760;
const MAP_HEIGHT = 430;
const MAP_PADDING = 48;
const LAYERS = ['water', 'rail', 'road', 'majorRoad', 'pedestrian'] as const;

type MapLayer = Array<Array<readonly [number, number]>>;
type CityLinework = {
  bounds: readonly [number, number, number, number];
  layers: Record<(typeof LAYERS)[number], MapLayer>;
};
type LocatedItem = { item: TripItem; location: TripMapLocation; itemIndex: number };
export type DayMapGroup = {
  cityMapId: CityMapId;
  items: LocatedItem[];
  scheduled: LocatedItem[];
  alternatives: LocatedItem[];
};

const lineworkPromises = new Map<CityMapId, Promise<CityLinework>>();

export function groupMapItemsForDay(day: TripDay) {
  const groups = new Map<CityMapId, DayMapGroup>();
  const unlocated: Array<{ item: TripItem; reason: string }> = [];
  day.items.forEach((item, itemIndex) => {
    if (!isMapEligibleTripItem(item)) return;
    const location = mapLocationForTripItem(item);
    if (!location) {
      const reason = unlocatedMapItems[item.id];
      if (reason) unlocated.push({ item, reason });
      return;
    }
    const group = groups.get(location.cityMapId) ?? { cityMapId: location.cityMapId, items: [], scheduled: [], alternatives: [] };
    const entry = { item, location, itemIndex };
    group.items.push(entry);
    if (item.status === '备选' || !item.routePoint) group.alternatives.push(entry);
    else group.scheduled.push(entry);
    groups.set(location.cityMapId, group);
  });
  return { groups: [...groups.values()], unlocated };
}

function loadLinework(cityMapId: CityMapId) {
  const cached = lineworkPromises.get(cityMapId);
  if (cached) return cached;
  const request = fetch(siteUrl(`/map-data/${cityMapId}.json`))
    .then((response) => {
      if (!response.ok) throw new Error(`Map data returned ${response.status}`);
      return response.json() as Promise<{ map: CityLinework }>;
    })
    .then((payload) => payload.map);
  lineworkPromises.set(cityMapId, request);
  return request;
}

function useLinework(cityMapId: CityMapId) {
  const rootRef = useRef<HTMLElement>(null);
  const [linework, setLinework] = useState<CityLinework>();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    loadLinework(cityMapId).then((value) => { if (active) setLinework(value); }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [cityMapId]);
  return { rootRef, linework, failed };
}

type Projection = {
  project: (coordinates: readonly [number, number]) => [number, number];
  worldBounds: readonly [number, number, number, number];
  averageLatitude: number;
};

function createProjection(items: LocatedItem[], linework?: CityLinework): Projection {
  const coordinates = items.map(({ location }) => location.coordinates);
  const averageLatitude = coordinates.reduce((sum, point) => sum + point[1], 0) / coordinates.length;
  const longitudeScale = Math.cos((averageLatitude * Math.PI) / 180);
  const toWorld = ([longitude, latitude]: readonly [number, number]) => [longitude * longitudeScale, -latitude] as const;
  const itemPoints = coordinates.map(toWorld);
  const lineworkBounds = linework ? [
    linework.bounds[1] * longitudeScale,
    -linework.bounds[2],
    linework.bounds[3] * longitudeScale,
    -linework.bounds[0],
  ] as const : undefined;
  const xs = itemPoints.map(([x]) => x);
  const ys = itemPoints.map(([, y]) => y);
  let minX = Math.min(...xs); let maxX = Math.max(...xs); let minY = Math.min(...ys); let maxY = Math.max(...ys);
  if (lineworkBounds) {
    minX = Math.min(minX, lineworkBounds[0]); maxX = Math.max(maxX, lineworkBounds[2]);
    minY = Math.min(minY, lineworkBounds[1]); maxY = Math.max(maxY, lineworkBounds[3]);
  }
  const centerX = (minX + maxX) / 2; const centerY = (minY + maxY) / 2;
  let width = Math.max(maxX - minX, .004 * longitudeScale); let height = Math.max(maxY - minY, .003);
  const targetRatio = (MAP_WIDTH - MAP_PADDING * 2) / (MAP_HEIGHT - MAP_PADDING * 2);
  if (width / height > targetRatio) height = width / targetRatio; else width = height * targetRatio;
  const worldBounds = [centerX - width / 2, centerY - height / 2, centerX + width / 2, centerY + height / 2] as const;
  const scale = Math.min((MAP_WIDTH - MAP_PADDING * 2) / width, (MAP_HEIGHT - MAP_PADDING * 2) / height);
  return {
    averageLatitude,
    worldBounds,
    project: (coordinate) => {
      const [x, y] = toWorld(coordinate);
      return [Number((MAP_WIDTH / 2 + (x - centerX) * scale).toFixed(1)), Number((MAP_HEIGHT / 2 + (y - centerY) * scale).toFixed(1))];
    },
  };
}

function pathIntersects(path: Array<readonly [number, number]>, projection: Projection) {
  const longitudeScale = Math.cos((projection.averageLatitude * Math.PI) / 180);
  const xs = path.map(([longitude]) => longitude * longitudeScale);
  const ys = path.map(([, latitude]) => -latitude);
  return !(Math.max(...xs) < projection.worldBounds[0] || Math.min(...xs) > projection.worldBounds[2] || Math.max(...ys) < projection.worldBounds[1] || Math.min(...ys) > projection.worldBounds[3]);
}

function pathsToD(paths: MapLayer, projection: Projection) {
  return paths.filter((path) => pathIntersects(path, projection)).map((path) => path.map((coordinate, index) => {
    const [x, y] = projection.project(coordinate);
    return `${index ? 'L' : 'M'}${x} ${y}`;
  }).join('')).join('');
}

function markerOffsets(items: LocatedItem[]) {
  const buckets = new Map<string, LocatedItem[]>();
  const offsets = new Map<string, [number, number]>();
  items.forEach((entry) => {
    const key = entry.location.coordinates.join(',');
    buckets.set(key, [...(buckets.get(key) ?? []), entry]);
  });
  buckets.forEach((entries) => entries.forEach((entry, index) => {
    if (entries.length === 1) offsets.set(entry.item.id, [0, 0]);
    else {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / entries.length;
      offsets.set(entry.item.id, [Math.cos(angle) * 18, Math.sin(angle) * 18]);
    }
  }));
  return offsets;
}

function CityMapPanel({ day, group }: { day: TripDay; group: DayMapGroup }) {
  const { rootRef, linework, failed } = useLinework(group.cityMapId);
  const projection = useMemo(() => createProjection(group.items, linework), [group.items, linework]);
  const offsets = useMemo(() => markerOffsets(group.items), [group.items]);
  const scheduledNumbers = new Map(group.scheduled.map((entry, index) => [entry.item.id, index + 1]));
  const routeD = group.scheduled.map((entry, index) => {
    const [x, y] = projection.project(entry.location.coordinates);
    return `${index ? 'L' : 'M'}${x} ${y}`;
  }).join('');
  return <article className="day-route-map__city" data-city-map={group.cityMapId} ref={rootRef}>
    <header className="day-route-map__city-header"><div><p>城市地图</p><h4>{cityMapLabels[group.cityMapId]}</h4></div><span>{group.scheduled.length} 个主项{group.alternatives.length ? ` · ${group.alternatives.length} 个备选` : ''}</span></header>
    <div className="day-route-map__layout">
      <div className="day-route-map__stage">
        <p className="day-route-map__pan-hint">横向滑动查看完整线网</p>
        <svg className="day-route-map__svg" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} role="img" aria-labelledby={`${day.id}-${group.cityMapId}-title`}>
          <title id={`${day.id}-${group.cityMapId}-title`}>{`${day.label}${cityMapLabels[group.cityMapId]}排期地点`}</title>
          <rect className="day-route-map__paper" width={MAP_WIDTH} height={MAP_HEIGHT}/>
          {linework && LAYERS.map((layer) => <path key={layer} className={`day-route-map__${layer.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`} d={pathsToD(linework.layers[layer] ?? [], projection)}/>)}
          {group.scheduled.length > 1 && <><path className="day-route-map__route-casing" d={routeD}/><path className="day-route-map__route" d={routeD}/></>}
          {group.items.map((entry) => {
            const [anchorX, anchorY] = projection.project(entry.location.coordinates);
            const [dx, dy] = offsets.get(entry.item.id) ?? [0, 0];
            const x = anchorX + dx; const y = anchorY + dy;
            const alternative = entry.item.status === '备选' || !entry.item.routePoint;
            return <g key={entry.item.id}>
              {(dx !== 0 || dy !== 0) && <line className="day-route-map__marker-leader" x1={anchorX} y1={anchorY} x2={x} y2={y}/>}
              <a className="day-route-map__marker-link" data-map-item={entry.item.id} data-route-kind={alternative ? 'alternative' : 'scheduled'} href={siteUrl(`#${entry.item.id}`)} aria-label={`跳到行程：${entry.item.title}`}>
                <title>{`${entry.item.time} · ${entry.item.title}`}</title>
                <circle className={`day-route-map__marker ${alternative ? 'day-route-map__marker--alternative' : ''}`} cx={x} cy={y} r="16"/>
                <text x={x} y={y + 4}>{alternative ? '备' : scheduledNumbers.get(entry.item.id)}</text>
              </a>
            </g>;
          })}
          <g className="day-route-map__north" aria-hidden="true"><text x="716" y="35">N</text><path d="M716 44 L708 63 L716 58 L724 63 Z"/></g>
        </svg>
        <p className="day-route-map__load-state">{!linework && !failed ? '正在加载本地城市线稿…' : failed ? '城市线稿不可用；已核实点位仍可查看' : '本地城市线稿已加载'}</p>
        <p className="day-route-map__attribution">© OpenStreetMap contributors · 排期连线，非步行导航</p>
      </div>
      <ol className="day-route-map__legend" aria-label={`${cityMapLabels[group.cityMapId]}地点`}>
        {group.scheduled.map((entry, index) => <li key={entry.item.id}><a href={siteUrl(`#${entry.item.id}`)}><span>{String(index + 1).padStart(2, '0')}</span><div><time>{entry.item.time}</time><strong>{entry.item.title}</strong></div></a></li>)}
        {group.alternatives.map((entry) => <li className="day-route-map__legend-alternative" key={entry.item.id}><a href={siteUrl(`#${entry.item.id}`)}><span>备</span><div><time>不加入连线</time><strong>{entry.item.title}</strong></div></a></li>)}
      </ol>
    </div>
  </article>;
}

export function DayRouteMap({ day }: { day: TripDay }) {
  const { groups, unlocated } = useMemo(() => groupMapItemsForDay(day), [day]);
  if (!groups.length && !unlocated.length) return null;
  return <section className="day-route-map" aria-labelledby={`${day.id}-map-heading`}>
    <header className="day-route-map__heading"><div><span aria-hidden="true">⌖</span><h3 id={`${day.id}-map-heading`}>当日地点地图</h3></div><p>同一城市内仅连接已排主项；跨城交通由全国路线表达。</p></header>
    <div className="day-route-map__cities">{groups.map((group) => <CityMapPanel day={day} group={group} key={group.cityMapId}/>)}</div>
    {!!unlocated.length && <div className="day-route-map__unlocated"><strong>无固定地图点</strong>{unlocated.map(({ item, reason }) => <a href={siteUrl(`#${item.id}`)} key={item.id}>{item.title}：{reason}</a>)}</div>}
  </section>;
}
