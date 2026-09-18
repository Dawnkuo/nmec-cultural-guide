import type { TripItem } from './types';
import { journeyPlaceById } from './locations';

export type CityMapId = 'cairo' | 'giza' | 'abu-simbel' | 'kom-ombo' | 'edfu' | 'luxor' | 'hurghada';

export type TripMapLocation = {
  cityMapId: CityMapId;
  coordinates: readonly [longitude: number, latitude: number];
  precision: 'verified-site' | 'area-representative';
  sourceIds: string[];
};

export const cityMapLabels: Record<CityMapId, string> = {
  cairo: '开罗历史城区',
  giza: '吉萨高地与博物馆区',
  'abu-simbel': '阿布辛贝神庙区',
  'kom-ombo': '康翁波',
  edfu: '埃德富',
  luxor: '卢克索东西岸',
  hurghada: '赫尔格达与吉夫顿岛',
};

const itemPlaceIds: Record<string, { placeId: string; cityMapId: CityMapId }> = {
  'visit-nmec': { placeId: 'nmec', cityMapId: 'cairo' },
  'visit-khan-el-khalili': { placeId: 'khan-el-khalili', cityMapId: 'cairo' },
  'visit-giza-plateau': { placeId: 'giza-plateau', cityMapId: 'giza' },
  'visit-gem': { placeId: 'gem', cityMapId: 'giza' },
  'visit-citadel': { placeId: 'cairo-citadel', cityMapId: 'cairo' },
  'visit-abu-simbel': { placeId: 'abu-simbel', cityMapId: 'abu-simbel' },
  'visit-kom-ombo': { placeId: 'kom-ombo', cityMapId: 'kom-ombo' },
  'visit-edfu': { placeId: 'edfu-temple', cityMapId: 'edfu' },
  'visit-luxor-temple': { placeId: 'luxor-temple', cityMapId: 'luxor' },
  'visit-valley-kings': { placeId: 'valley-of-the-kings', cityMapId: 'luxor' },
  'visit-hatshepsut': { placeId: 'hatshepsut-temple', cityMapId: 'luxor' },
  'visit-colossi': { placeId: 'colossi-of-memnon', cityMapId: 'luxor' },
  'visit-karnak': { placeId: 'karnak', cityMapId: 'luxor' },
  'red-sea-boat-day': { placeId: 'orange-bay', cityMapId: 'hurghada' },
};

export const unlocatedMapItems: Record<string, string> = {
  'giza-view-lunch': '餐厅尚未确定，不能用任意金字塔景观餐厅代替。',
  'luxor-market': '未指定市场或餐厅入口，保留在行程文字中。',
  'hurghada-city-center': '未指定商场或餐厅，不能用城市中心点冒充。',
};

export function mapLocationForTripItem(item: Pick<TripItem, 'id'>): TripMapLocation | undefined {
  const binding = itemPlaceIds[item.id];
  if (!binding) return undefined;
  const place = journeyPlaceById.get(binding.placeId);
  if (!place) return undefined;
  return {
    cityMapId: binding.cityMapId,
    coordinates: [place.coordinates.lng, place.coordinates.lat],
    precision: place.precision === 'city-centroid' ? 'area-representative' : 'verified-site',
    sourceIds: place.sourceIds,
  };
}

export function isMapEligibleTripItem(item: Pick<TripItem, 'kind'>) {
  return item.kind !== 'transport' && item.kind !== 'hotel' && item.kind !== 'rest';
}
