import data from './sources.json';
import type { SourceRecord } from './types';
export const sources=data as SourceRecord[];
export const sourceById=new Map(sources.map(s=>[s.id,s]));
