import registryJson from './reviewed-guide-media.generated.json';
import type { GuideMedia } from './types';

const registry = registryJson as Record<string, Record<string, GuideMedia>>;

/** Bind images to semantic object IDs, never search-result order or array indices. */
export function reviewedGuideImage(slug: string, objectId: string): GuideMedia {
  const image = registry[slug]?.[objectId];
  if (!image?.src || !image.credit?.sourcePage) {
    throw new Error(`Missing subject-reviewed image: ${slug}/${objectId}`);
  }
  return image;
}
