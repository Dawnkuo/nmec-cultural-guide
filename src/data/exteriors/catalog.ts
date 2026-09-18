import type {ExteriorGuide} from './types';
import {edfuExterior,luxorExterior,komExterior,karnakExterior} from './temples';
import {citadelExterior} from './citadel';
import {abuExterior,hatshepsutExterior,gizaExterior,memnonExterior} from './rock-monuments';
import {nmecExterior,gemExterior} from './museums';
import {valleyExterior,khanExterior,orangeExterior} from './landscapes';
export const exteriorGuides=[edfuExterior,luxorExterior,komExterior,karnakExterior,citadelExterior,abuExterior,hatshepsutExterior,gizaExterior,memnonExterior,nmecExterior,gemExterior,valleyExterior,khanExterior,orangeExterior];
export const exteriorCatalog:Record<string,ExteriorGuide>=Object.fromEntries(exteriorGuides.map(g=>[g.slug,g]));
