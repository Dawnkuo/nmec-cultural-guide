import data from '../exterior.json';
import type { ExteriorGuide } from './types';
import { withAssetBase } from '../../paths';
export const nmecExterior=withAssetBase(data as unknown as ExteriorGuide);
export const exteriorGuides=[nmecExterior];
export const exteriorCatalog:Record<string,ExteriorGuide>={[nmecExterior.slug]:nmecExterior};
