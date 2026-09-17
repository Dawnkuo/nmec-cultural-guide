import type { Ring, XY } from '../architecture/types';

export type XYZ = readonly [number,number,number];
export type ExteriorGeometry =
  | {kind:'prism';footprint:Ring;holes?:Ring[];height:number;base?:number;topScale?:number}
  | {kind:'lathe';center:XY;profile:XY[];base?:number;segments?:number}
  | {kind:'dome';center:XY;radius:number;height:number;base:number;half?:number}
  | {kind:'mesh';vertices:XYZ[];triangles:number[]};
export type ExteriorFeature = {
  id:string;title:string;description:string;lookFor:string[];nodeId?:string;
  footprint:Ring;anchor:XY;sourceIds:string[];
  basis:string;precision:'documented'|'derived';
};
export type ExteriorPart = {
  id:string;featureId:string;geometry:ExteriorGeometry;material:'stone'|'sandstone'|'granite'|'roof'|'glass'|'sand'|'water'|'ground'|'timber';
  /** Source feature/drawing entity, not a renderer-generated building identity. */
  sourceGeometryId:string;verticalBasis:string;
};
export type ExteriorModel = {
  id:string;title:string;version:string;
  coordinateSystem:string;
  bounds:readonly[number,number,number,number];
  features:ExteriorFeature[];parts:ExteriorPart[];
  sourceIds:string[];limitations:string[];
  referenceImage:string;referenceCaption:string;
  referencePage?:string;
  defaultDirection:XYZ;
  /** Source drawing front, not geographic north; side view is perpendicular. */
  frontDirection?:XYZ;
  /** Optional immutable local geometry, used for DEMs and OSM context. */
  contextAsset?:string;
};
export type ExteriorGuide={slug:string;intro:string;models:ExteriorModel[]};
