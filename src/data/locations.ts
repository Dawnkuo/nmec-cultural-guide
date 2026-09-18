import type { JourneyPlace } from './types';

export const journeyPlaces: JourneyPlace[] = [
  { id: 'hong-kong-airport', name: '香港国际机场', city: '香港', coordinates: { lat: 22.308, lng: 113.9185 }, kind: 'airport', precision: 'verified-site', sourceIds: ['src-flight-images', 'src-osm'] },
  { id: 'bangkok-airport', name: '曼谷素万那普机场', city: '曼谷', coordinates: { lat: 13.69, lng: 100.7501 }, kind: 'airport', precision: 'verified-site', sourceIds: ['src-flight-images', 'src-osm'] },
  { id: 'dubai-airport', name: '迪拜国际机场', city: '迪拜', coordinates: { lat: 25.2532, lng: 55.3657 }, kind: 'airport', precision: 'verified-site', sourceIds: ['src-flight-images', 'src-osm'] },
  { id: 'cairo-airport', name: '开罗国际机场', city: '开罗', coordinates: { lat: 30.1219, lng: 31.4056 }, kind: 'airport', precision: 'verified-site', sourceIds: ['src-flight-images', 'src-osm'] },
  { id: 'aswan-airport', name: '阿斯旺国际机场', city: '阿斯旺', coordinates: { lat: 23.9644, lng: 32.82 }, kind: 'airport', precision: 'verified-site', sourceIds: ['src-flight-images', 'src-osm'] },
  { id: 'nmec', name: '埃及国家文明博物馆', city: '开罗', coordinates: { lat: 30.0074, lng: 31.2483 }, kind: 'museum', guideSlug: 'national-museum-egyptian-civilization', precision: 'verified-site', sourceIds: ['src-nmec', 'src-osm'] },
  { id: 'khan-el-khalili', name: '哈利利市场', city: '开罗', coordinates: { lat: 30.0477, lng: 31.2624 }, kind: 'district', guideSlug: 'khan-el-khalili', precision: 'verified-site', sourceIds: ['src-historic-cairo', 'src-osm'] },
  { id: 'giza-plateau', name: '吉萨高地', city: '吉萨', coordinates: { lat: 29.9792, lng: 31.1342 }, kind: 'landmark', guideSlug: 'giza-plateau', precision: 'verified-site', sourceIds: ['src-egypt-giza', 'src-osm'] },
  { id: 'gem', name: '大埃及博物馆', city: '吉萨', coordinates: { lat: 29.9946, lng: 31.1197 }, kind: 'museum', guideSlug: 'grand-egyptian-museum', precision: 'verified-site', sourceIds: ['src-gem', 'src-osm'] },
  { id: 'cairo-citadel', name: '开罗城堡', city: '开罗', coordinates: { lat: 30.0299, lng: 31.2617 }, kind: 'landmark', guideSlug: 'cairo-citadel', precision: 'verified-site', sourceIds: ['src-citadel', 'src-osm'] },
  { id: 'aswan', name: '阿斯旺', city: '阿斯旺', coordinates: { lat: 24.0889, lng: 32.8998 }, kind: 'city', precision: 'city-centroid', sourceIds: ['src-osm'] },
  { id: 'abu-simbel', name: '阿布辛贝神庙', city: '阿布辛贝', coordinates: { lat: 22.3372, lng: 31.6258 }, kind: 'landmark', guideSlug: 'abu-simbel', precision: 'verified-site', sourceIds: ['src-abu-simbel', 'src-osm'] },
  { id: 'kom-ombo', name: '康翁波神庙', city: '康翁波', coordinates: { lat: 24.4521, lng: 32.9281 }, kind: 'landmark', guideSlug: 'kom-ombo', precision: 'verified-site', sourceIds: ['src-kom-ombo', 'src-osm'] },
  { id: 'edfu-temple', name: '埃德富神庙', city: '埃德富', coordinates: { lat: 24.9779, lng: 32.8734 }, kind: 'landmark', guideSlug: 'edfu-temple', precision: 'verified-site', sourceIds: ['src-aswan-guide', 'src-osm'] },
  { id: 'luxor-temple', name: '卢克索神庙', city: '卢克索', coordinates: { lat: 25.6995, lng: 32.6391 }, kind: 'landmark', guideSlug: 'luxor-temple', precision: 'verified-site', sourceIds: ['src-luxor-temple', 'src-osm'] },
  { id: 'valley-of-the-kings', name: '帝王谷', city: '卢克索西岸', coordinates: { lat: 25.7402, lng: 32.6014 }, kind: 'landmark', guideSlug: 'valley-of-the-kings', precision: 'verified-site', sourceIds: ['src-valley-kings', 'src-osm'] },
  { id: 'hatshepsut-temple', name: '哈特谢普苏特葬祭殿', city: '卢克索西岸', coordinates: { lat: 25.7382, lng: 32.6066 }, kind: 'landmark', guideSlug: 'hatshepsut-temple', precision: 'verified-site', sourceIds: ['src-hatshepsut', 'src-osm'] },
  { id: 'colossi-of-memnon', name: '门农巨像', city: '卢克索西岸', coordinates: { lat: 25.7206, lng: 32.6105 }, kind: 'landmark', guideSlug: 'colossi-of-memnon', precision: 'verified-site', sourceIds: ['src-thebes', 'src-osm'] },
  { id: 'karnak', name: '卡纳克神庙群', city: '卢克索东岸', coordinates: { lat: 25.7188, lng: 32.6573 }, kind: 'landmark', guideSlug: 'karnak', precision: 'verified-site', sourceIds: ['src-karnak', 'src-osm'] },
  { id: 'luxor', name: '卢克索', city: '卢克索', coordinates: { lat: 25.6872, lng: 32.6396 }, kind: 'city', precision: 'city-centroid', sourceIds: ['src-osm'] },
  { id: 'hurghada', name: '赫尔格达', city: '赫尔格达', coordinates: { lat: 27.2579, lng: 33.8116 }, kind: 'city', precision: 'city-centroid', sourceIds: ['src-osm'] },
  { id: 'orange-bay', name: 'Orange Bay', city: '赫尔格达', coordinates: { lat: 27.2091, lng: 33.9261 }, kind: 'landmark', guideSlug: 'orange-bay', precision: 'verified-site', sourceIds: ['src-orange-bay', 'src-osm'] },
];

export const journeyPlaceById = new Map(journeyPlaces.map((place) => [place.id, place]));

export const itemPointIds: Record<string, string[]> = {
  'flight-ek385': ['hong-kong-airport', 'bangkok-airport'],
  'flight-ek371': ['bangkok-airport', 'dubai-airport'],
  'flight-ek927': ['dubai-airport', 'cairo-airport'],
  'flight-ms284': ['cairo-airport', 'aswan-airport'],
  'hotel-aswan-checkin': ['aswan'],
  'aswan-felucca': ['aswan'],
  'hotel-luxor-checkin': ['luxor'],
  'hotel-spa': ['luxor'],
  'luxor-market': ['luxor'],
  'transfer-luxor-hurghada': ['luxor', 'hurghada'],
  'hotel-hurghada-checkin': ['hurghada'],
  'hurghada-city-center': ['hurghada'],
  'hurghada-pack': ['hurghada'],
  'return-cairo-transfer': ['hurghada', 'cairo-airport'],
  'flight-ek926': ['cairo-airport', 'dubai-airport'],
  'flight-ek380': ['dubai-airport', 'hong-kong-airport'],
};
