import data from './guide.json';
import type { CulturalGuide } from './types';
import { withAssetBase } from '../paths';
import { reviewedMedia } from './media';
export const guide=withAssetBase(reviewedMedia(data as unknown as CulturalGuide));
export const guideCatalog=[guide];
export const guideBySlug=new Map([[guide.slug,guide]]);
