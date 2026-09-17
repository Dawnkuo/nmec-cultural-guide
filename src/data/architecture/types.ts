export type XY = readonly [number, number];
export type Ring = XY[];

/** Coordinates stay in the reviewed orthographic source, never in CSS/camera space. */
export type ArchitecturalSpace = {
  id: string;
  nodeId?: string;
  title: string;
  description: string;
  kind: 'court' | 'hall' | 'sanctuary' | 'passage' | 'side-room' | 'pylon';
  polygon: Ring;
  holes?: Ring[];
  anchor: XY;
  evidenceId: string;
  geometryRole?: 'point-marker' | 'outline-region';
};

export type ArchitecturalModel = {
  id: string;
  version: string;
  source: { id: string; asset: string; sha256: string; width: number; height: number; projection: 'orthographic'; review: string };
  floor: { id: string; title: string };
  entry: { status: 'mapped'; spaceId: string; basis: string } | { status: 'unmapped'; notice: string; basis: string };
  bounds: readonly [number, number, number, number];
  spaces: ArchitecturalSpace[];
  walls: Array<{ id: string; polygon: Ring; evidenceId: string }>;
  columns: Array<{ id: string; center: XY; radius: number; evidenceId: string }>;
  openings: Array<{ id: string; from: string; to: string; a: XY; b: XY; evidenceId: string }>;
  stairs: Array<{ id: string; footprint: Ring; treads: Array<readonly [XY, XY]>; evidenceId: string; access: 'unknown' }>;
  labels: Array<{ id: string; text: string; point: XY; spaceId: string }>;
  /** Source-derived 2D vector context, shared with the ground plane of 3D. */
  contextAsset?: string;
  columnLabels?: Array<{ text: string; point: XY }>;
  solids?: Array<{id:string;spaceId:string;footprint:Ring;apex:XY;height:number;heightBasis:string;evidenceId:string}>;
  evidence: Array<{ id: string; sourceId: string; bounds: readonly [number, number, number, number]; claim: string }>;
  display: { wallHeight: number; columnHeight: number; heightStatus: 'display-only' };
  limitations: string[];
};
