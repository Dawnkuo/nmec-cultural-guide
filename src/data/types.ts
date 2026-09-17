export type VisitStatus = '已订' | '无需门票' | '未订' | '备选' | '待确认';
export type TripItemKind = 'transport' | 'hotel' | 'museum' | 'landmark' | 'district' | 'food' | 'rest';
export type GuideTier = 'major' | 'standard' | 'place';
export type SpatialMode = 'interactive-schematic' | 'official-plan-reference' | 'spatial-index' | 'omit';

export type GeoPoint = { lat: number; lng: number };

export type TripItem = {
  id: string;
  time: string;
  title: string;
  city: string;
  kind: TripItemKind;
  status: VisitStatus;
  routePoint: boolean;
  placeId?: string;
  guideSlug?: string;
  arrival?: string;
  note?: string;
  conflict?: string;
  sourceIds: string[];
};

export type TripDay = { id: string; date: string; label: string; region: string; summary: string; items: TripItem[] };

export type BookingRecord = {
  id: string;
  itemIds: string[];
  category: '交通' | '住宿' | '门票';
  title: string;
  date: string;
  status: VisitStatus;
  evidenceState: '已核对截图' | '仅见行程草表' | '未提供';
  note?: string;
  sourceIds: string[];
};

export type SourceRecord = {
  id: string;
  title: string;
  publisher: string;
  authority: 'user-primary' | 'official-primary' | 'authoritative' | 'media-repository';
  url?: string;
  externalFiles?: Array<{ fileName: string; sha256: string }>;
  verifiedAt: string;
  scopes: string[];
  note?: string;
};

export type JourneyPlace = {
  id: string;
  name: string;
  city: string;
  coordinates: GeoPoint;
  kind: 'airport' | 'hotel' | 'museum' | 'landmark' | 'district' | 'city';
  guideSlug?: string;
  precision: 'verified-entrance' | 'verified-site' | 'city-centroid';
  sourceIds: string[];
};

export type CoverRole = 'hero' | 'directory' | 'card' | 'thumbnail';
export type GuideMedia = {
  src: string; alt: string; caption?: string;
  dimensions?: { width: number; height: number };
  framing?: Record<CoverRole, 'contain' | 'cover'>;
  credit?: { author: string; sourcePage: string; license: string; licenseUrl: string; photographedAt: string };
};
export type OrientationNote = { title: string; body: string };

export type GuideVisitChapter = {
  id: 'exterior' | 'interior';
  label: string;
  title: string;
  summary: string;
  checkpoints: string[];
  accessNote: string;
  image: GuideMedia;
  sourceIds: string[];
};

export type SpatialNode = {
  id: string;
  name: string;
  originalName?: string;
  x: number;
  z: number;
  scale?: number;
  kind: 'pyramid' | 'temple' | 'gate' | 'hall' | 'statue' | 'tomb' | 'museum' | 'district' | 'water' | 'sanctuary' | 'chapel' | 'colonnade' | 'terrace' | 'reef';
  description: string;
  sourceIds: string[];
  renderBindings?: { twoDFeatureId: string; threeDFeatureId: string };
};

export type PlanPoint = readonly [number, number];

export type SpatialPlanArea = {
  id: string;
  nodeId?: string;
  label: string;
  floorId: string;
  kind: 'building' | 'court' | 'gallery' | 'sanctuary' | 'monument' | 'district' | 'terrain' | 'water' | 'reef' | 'service';
  polygon: PlanPoint[];
  height: number;
  sourceIds: string[];
};

export type SpatialPlanPath = {
  id: string;
  label: string;
  floorId: string;
  points: PlanPoint[];
  status: 'documented-axis' | 'reading-sequence' | 'context-only';
  sourceIds: string[];
};

export type SpatialPlanFloor = {
  id: string;
  label: string;
  level: number;
  scope: 'exterior' | 'interior' | 'site';
  outline: PlanPoint[];
  sourceIds: string[];
};

export type SpatialPlan = {
  kind: 'museum-floor' | 'temple-plan' | 'archaeological-site' | 'historic-district' | 'marine-site' | 'hybrid';
  fidelity: 'source-proportional' | 'topological';
  defaultFloorId: string;
  north?: 'up' | 'right' | 'down' | 'left';
  entry?: { floorId: string; point: PlanPoint; label: string; sourceIds: string[] };
  floors: SpatialPlanFloor[];
  areas: SpatialPlanArea[];
  paths: SpatialPlanPath[];
  sourceIds: string[];
  evidenceSummary: string;
};

export type SpatialReferenceImage = {
  id: string;
  label: string;
  src: string;
  alt: string;
  caption: string;
  sourceId: string;
  sha256: string;
  width: number;
  height: number;
  scope: 'interior' | 'site' | 'context';
  reviewedAt: string;
  nodeIds?: string[];
};

export type SpatialModel = {
  mode: SpatialMode;
  precision: 'relative' | 'topological';
  title: string;
  description: string;
  evidenceNote: string;
  sourceIds: string[];
  nodes: SpatialNode[];
  edges?: Array<{ from: string; to: string; label?: string }>;
  plan?: SpatialPlan;
  architecture?: import('./architecture/types').ArchitecturalModel;
  architectureLevels?: import('./architecture/types').ArchitecturalModel[];
  referenceImages?: SpatialReferenceImage[];
  limitations?: string[];
};

export type GuideHighlight = {
  id: string;
  nodeId?: string;
  title: string;
  originalTitle?: string;
  period: string;
  location: string;
  summary: string;
  whyItMatters: string;
  lookFor: string;
  image: GuideMedia;
  sourceIds: string[];
};

export type GuideSequenceStep = { nodeId?: string; title: string; body: string };

export type CulturalGuide = {
  slug: string;
  title: string;
  originalTitle: string;
  city: string;
  region: string;
  category: '博物馆' | '考古遗址' | '历史城区' | '自然体验';
  tier: GuideTier;
  itemIds: string[];
  coordinates: GeoPoint;
  hero: GuideMedia;
  deck: string;
  overview: string;
  orientation: OrientationNote[];
  visitChapters: [GuideVisitChapter, GuideVisitChapter];
  spatial: SpatialModel;
  highlights: GuideHighlight[];
  sequence: GuideSequenceStep[];
  practical: string[];
  sourceIds: string[];
  tags: string[];
};

export type CityProfile = {
  slug: string;
  name: string;
  originalName: string;
  region: string;
  coordinates: GeoPoint;
  hero: GuideMedia;
  thesis: string;
  chronology: Array<{ period: string; title: string; body: string }>;
  guideSlugs: string[];
};
