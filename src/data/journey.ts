import type { BookingRecord, TripDay } from './types';

const itinerarySource = ['src-itinerary-image'];

export const tripDays: TripDay[] = [
  {
    id: 'day-2026-09-30', date: '2026-09-30', label: '9月30日', region: '香港 → 曼谷', summary: '晚间启程，在曼谷转机。',
    items: [
      { id: 'flight-ek385', time: '21:30–23:45', title: 'EK385 香港国际 T1 → 曼谷素万那普', city: '香港 / 曼谷', kind: 'transport', status: '已订', routePoint: true, note: '阿联酋航空；截图标记“未使用”。', sourceIds: ['src-flight-images'] },
    ],
  },
  {
    id: 'day-2026-10-01', date: '2026-10-01', label: '10月1日', region: '曼谷 → 迪拜 → 开罗', summary: '抵达开罗，办理入住后进入文明史与老城夜色。',
    items: [
      { id: 'flight-ek371', time: '03:40–06:50', title: 'EK371 曼谷素万那普 → 迪拜国际 T3', city: '曼谷 / 迪拜', kind: 'transport', status: '已订', routePoint: true, sourceIds: ['src-flight-images'] },
      { id: 'flight-ek927', time: '08:15–11:05', title: 'EK927 迪拜国际 T3 → 开罗国际 T2', city: '迪拜 / 开罗', kind: 'transport', status: '已订', routePoint: true, conflict: '行程草表写“12:05–15:00 落地与入住”；航班截图显示 11:05 抵达。这里保留截图时间，入境与入住耗时未确认。', sourceIds: ['src-flight-images', 'src-itinerary-image'] },
      { id: 'cairo-hotel-checkin', time: '抵达后', title: '开罗住宿办理入住', city: '开罗', kind: 'hotel', status: '待确认', routePoint: true, note: '10月1日至3日的酒店名称、地址与确认凭证尚未提供。', sourceIds: itinerarySource },
      { id: 'visit-nmec', time: '下午', title: '埃及国家文明博物馆', city: '开罗', kind: 'museum', status: '待确认', routePoint: true, placeId: 'nmec', guideSlug: 'national-museum-egyptian-civilization', note: '草表建议游览 1.5–2 小时；尚未提供门票。', sourceIds: itinerarySource },
      { id: 'visit-khan-el-khalili', time: '晚上', title: '哈利利市场夜市与抵达晚餐', city: '开罗', kind: 'district', status: '待确认', routePoint: true, placeId: 'khan-el-khalili', guideSlug: 'khan-el-khalili', sourceIds: itinerarySource },
    ],
  },
  {
    id: 'day-2026-10-02', date: '2026-10-02', label: '10月2日', region: '开罗 · 吉萨', summary: '从吉萨高地到大埃及博物馆。',
    items: [
      { id: 'visit-giza-plateau', time: '08:00 / 08:30 出发', title: '吉萨金字塔群', city: '吉萨', kind: 'landmark', status: '待确认', routePoint: true, placeId: 'giza-plateau', guideSlug: 'giza-plateau', note: '出发时间在草表中有两个备选；门票与入内项目未提供。', sourceIds: itinerarySource },
      { id: 'giza-view-lunch', time: '中午', title: '金字塔景观餐厅午餐', city: '吉萨', kind: 'food', status: '待确认', routePoint: true, note: '草表建议提前预约，具体餐厅未定。', sourceIds: itinerarySource },
      { id: 'visit-gem', time: '下午', title: '大埃及博物馆', city: '吉萨', kind: 'museum', status: '待确认', routePoint: true, placeId: 'gem', guideSlug: 'grand-egyptian-museum', arrival: '草表标注距金字塔约 2 公里，交通拟打车；距离尚未用当前入口点复核。', sourceIds: itinerarySource },
      { id: 'return-cairo-island', time: '约17:30', title: '离开景区，返回岛上', city: '开罗', kind: 'transport', status: '待确认', routePoint: true, note: '“岛上”所指住宿区域尚未确认。', sourceIds: itinerarySource },
    ],
  },
  {
    id: 'day-2026-10-03', date: '2026-10-03', label: '10月3日', region: '开罗 → 阿斯旺', summary: '开罗最后一段文化参观后飞往阿斯旺。',
    items: [
      { id: 'visit-citadel', time: '09:00 出发', title: '萨拉丁城堡与穆罕默德·阿里清真寺', city: '开罗', kind: 'landmark', status: '待确认', routePoint: true, placeId: 'cairo-citadel', guideSlug: 'cairo-citadel', sourceIds: itinerarySource },
      { id: 'old-cairo-option', time: '上午 / 备选', title: '老开罗城区闲逛', city: '开罗', kind: 'rest', status: '备选', routePoint: false, sourceIds: itinerarySource },
      { id: 'citystars-option', time: '午后 / 备选', title: 'Citystars 购物补给', city: '开罗', kind: 'rest', status: '备选', routePoint: false, sourceIds: itinerarySource },
      { id: 'flight-ms284', time: '17:35–19:00', title: 'MS284 开罗国际 T3 → 阿斯旺国际', city: '开罗 / 阿斯旺', kind: 'transport', status: '已订', routePoint: true, conflict: '行程草表写 17:50 起飞、19:15 抵达；航班截图显示 17:35–19:00。计划按截图保留，并需重算离开 Citystars 的时间。', sourceIds: ['src-flight-images', 'src-itinerary-image'] },
      { id: 'hotel-aswan-checkin', time: '抵达后', title: '阿斯旺方尖碑尼罗河酒店入住', city: '阿斯旺', kind: 'hotel', status: '已订', routePoint: true, note: '截图：10月3日至5日，1间花园景双人房。英文酒店身份仍需与原始确认单核对。', sourceIds: ['src-hotel-images'] },
    ],
  },
  {
    id: 'day-2026-10-04', date: '2026-10-04', label: '10月4日', region: '阿斯旺 · 阿布辛贝', summary: '清晨往返阿布辛贝，傍晚回到尼罗河。',
    items: [
      { id: 'visit-abu-simbel', time: '凌晨05:00–约15:30', title: '阿布辛贝神庙往返', city: '阿布辛贝', kind: 'landmark', status: '待确认', routePoint: true, placeId: 'abu-simbel', guideSlug: 'abu-simbel', note: '草表写提前包车往返；司机、车次与门票均待确认。', sourceIds: itinerarySource },
      { id: 'aswan-felucca', time: '傍晚', title: '尼罗河日落帆船、晚餐与河滨闲逛', city: '阿斯旺', kind: 'rest', status: '待确认', routePoint: true, note: '这是尚未确定运营商的休闲活动，不当作固定景点；日落前约半小时登船为行程建议，不是已订时段。', sourceIds: itinerarySource },
    ],
  },
  {
    id: 'day-2026-10-05', date: '2026-10-05', label: '10月5日', region: '阿斯旺 → 卢克索', summary: '沿尼罗河北上，经康翁波与埃德富抵达卢克索。',
    items: [
      { id: 'visit-kom-ombo', time: '09:00 出发', title: '康翁波神庙', city: '康翁波', kind: 'landmark', status: '待确认', routePoint: true, placeId: 'kom-ombo', guideSlug: 'kom-ombo', sourceIds: itinerarySource },
      { id: 'visit-edfu', time: '途中', title: '埃德富荷鲁斯神庙', city: '埃德富', kind: 'landmark', status: '待确认', routePoint: true, placeId: 'edfu-temple', guideSlug: 'edfu-temple', sourceIds: itinerarySource },
      { id: 'hotel-luxor-checkin', time: '约15:00', title: '卢克索阿赫提度假施柏阁酒店入住', city: '卢克索', kind: 'hotel', status: '已订', routePoint: true, note: '截图：10月5日至7日，1间尼罗河景特大床豪华间。', sourceIds: ['src-hotel-images'] },
      { id: 'visit-luxor-temple', time: '傍晚', title: '卢克索神庙日落与老集市夜市', city: '卢克索', kind: 'landmark', status: '待确认', routePoint: true, placeId: 'luxor-temple', guideSlug: 'luxor-temple', sourceIds: itinerarySource },
    ],
  },
  {
    id: 'day-2026-10-06', date: '2026-10-06', label: '10月6日', region: '卢克索东西岸', summary: '西岸陵墓群、午后休息与卡纳克傍晚场。',
    items: [
      { id: 'visit-valley-kings', time: '08:30 出发', title: '帝王谷', city: '卢克索西岸', kind: 'landmark', status: '待确认', routePoint: true, placeId: 'valley-of-the-kings', guideSlug: 'valley-of-the-kings', note: '草表提醒墓穴内禁拍、全程暴晒；以现场规则为准。', sourceIds: itinerarySource },
      { id: 'visit-hatshepsut', time: '上午', title: '哈特谢普苏特葬祭殿', city: '卢克索西岸', kind: 'landmark', status: '待确认', routePoint: true, placeId: 'hatshepsut-temple', guideSlug: 'hatshepsut-temple', sourceIds: itinerarySource },
      { id: 'visit-colossi', time: '上午', title: '门农巨像', city: '卢克索西岸', kind: 'landmark', status: '无需门票', routePoint: true, placeId: 'colossi-of-memnon', guideSlug: 'colossi-of-memnon', sourceIds: itinerarySource },
      { id: 'hotel-spa', time: '下午', title: '酒店午休与温泉', city: '卢克索', kind: 'rest', status: '待确认', routePoint: false, sourceIds: itinerarySource },
      { id: 'visit-karnak', time: '16:00后', title: '卡纳克神庙与声光秀', city: '卢克索东岸', kind: 'landmark', status: '待确认', routePoint: true, placeId: 'karnak', guideSlug: 'karnak', note: '草表建议 16:00 后错峰；声光秀场次与门票未核对。', sourceIds: itinerarySource },
      { id: 'luxor-market', time: '晚上', title: '晚餐与卢克索集市', city: '卢克索', kind: 'food', status: '待确认', routePoint: true, note: '未指定固定市场、餐厅或入口，不作为独立景点导览。', sourceIds: itinerarySource },
    ],
  },
  {
    id: 'day-2026-10-07', date: '2026-10-07', label: '10月7日', region: '卢克索 → 赫尔格达', summary: '包车穿越东部沙漠前往红海。',
    items: [
      { id: 'transfer-luxor-hurghada', time: '全天', title: '卢克索包车前往赫尔格达', city: '卢克索 / 赫尔格达', kind: 'transport', status: '待确认', routePoint: true, note: '草表估计约 4.5 小时并途中解决午餐；车辆未确认。', sourceIds: itinerarySource },
      { id: 'hotel-hurghada-checkin', time: '约15:00', title: '胡戈哈达广场希尔顿酒店入住', city: '赫尔格达', kind: 'hotel', status: '已订', routePoint: true, note: '截图：10月7日至10日，3晚，1间海景豪华双床房。英文酒店身份仍需与确认单核对。', sourceIds: ['src-hotel-images'] },
      { id: 'hurghada-city-center', time: '下午–晚上', title: '酒店休息与 City Center 用餐逛街', city: '赫尔格达', kind: 'food', status: '待确认', routePoint: true, note: '未指定固定餐厅或商场入口，不作为独立景点导览。', sourceIds: itinerarySource },
    ],
  },
  {
    id: 'day-2026-10-08', date: '2026-10-08', label: '10月8日', region: '红海', summary: '出海浮潜与潜水。',
    items: [
      { id: 'red-sea-boat-day', time: '全天', title: 'Orange Bay 浮潜与潜水', city: '赫尔格达', kind: 'landmark', status: '待确认', routePoint: true, placeId: 'orange-bay', guideSlug: 'orange-bay', note: '草表写“提前预订，含酒店接送”；运营商、潜水资质要求和实际包含项目未提供。', sourceIds: itinerarySource },
    ],
  },
  {
    id: 'day-2026-10-09', date: '2026-10-09', label: '10月9日', region: '红海', summary: '保留为二选一的弹性海滨日。',
    items: [
      { id: 'hurghada-beach-option', time: '全天 / 方案A', title: '酒店沙滩浮潜与市里闲逛', city: '赫尔格达', kind: 'rest', status: '备选', routePoint: false, sourceIds: itinerarySource },
      { id: 'hurghada-sea-option', time: '全天 / 方案B', title: '第二天出海浮潜、海钓或潜水', city: '赫尔格达', kind: 'rest', status: '备选', routePoint: false, note: '未指定运营商、目的地或项目，不作为独立景点。', sourceIds: itinerarySource },
    ],
  },
  {
    id: 'day-2026-10-10', date: '2026-10-10', label: '10月10日', region: '红海 → 开罗', summary: '整理行李并返回开罗。',
    items: [
      { id: 'hurghada-pack', time: '上午', title: '整理行李与酒店休闲', city: '赫尔格达', kind: 'rest', status: '待确认', routePoint: false, sourceIds: itinerarySource },
      { id: 'return-cairo-transfer', time: '日间', title: '赫尔格达返回开罗', city: '赫尔格达 / 开罗', kind: 'transport', status: '待确认', routePoint: true, conflict: '草表仍写“包车 / 飞机”，两种方式尚未择定；这会影响 10 月 11 日凌晨航班的安全衔接。', sourceIds: itinerarySource },
      { id: 'citystars-last-option', time: '途中 / 备选', title: '赫尔格达市区或开罗 Citystars 补货', city: '赫尔格达 / 开罗', kind: 'rest', status: '备选', routePoint: false, sourceIds: itinerarySource },
    ],
  },
  {
    id: 'day-2026-10-11', date: '2026-10-11', label: '10月11日', region: '开罗 → 迪拜 → 香港', summary: '凌晨离开开罗，经迪拜返回香港。',
    items: [
      { id: 'flight-ek926', time: '02:45–07:10', title: 'EK926 开罗国际 T2 → 迪拜国际 T3', city: '开罗 / 迪拜', kind: 'transport', status: '已订', routePoint: true, sourceIds: ['src-flight-images'] },
      { id: 'flight-ek380', time: '10:00–22:05', title: 'EK380 迪拜国际 T3 → 香港国际 T1', city: '迪拜 / 香港', kind: 'transport', status: '已订', routePoint: true, sourceIds: ['src-flight-images'] },
    ],
  },
];

export const bookings: BookingRecord[] = [
  ...tripDays.flatMap((day) => day.items).filter((item) => item.id.startsWith('flight-')).map((item) => ({ id: `booking-${item.id}`, itemIds: [item.id], category: '交通' as const, title: item.title, date: tripDays.find((day) => day.items.includes(item))!.date, status: '已订' as const, evidenceState: '已核对截图' as const, sourceIds: ['src-flight-images'] })),
  { id: 'booking-hotel-aswan', itemIds: ['hotel-aswan-checkin'], category: '住宿', title: '阿斯旺方尖碑尼罗河酒店', date: '2026-10-03—10-05', status: '已订', evidenceState: '已核对截图', note: '1间花园景双人房；英文身份待与原始确认单核对。', sourceIds: ['src-hotel-images'] },
  { id: 'booking-hotel-luxor', itemIds: ['hotel-luxor-checkin'], category: '住宿', title: '卢克索阿赫提度假施柏阁酒店', date: '2026-10-05—10-07', status: '已订', evidenceState: '已核对截图', note: '1间尼罗河景特大床豪华间。', sourceIds: ['src-hotel-images'] },
  { id: 'booking-hotel-hurghada', itemIds: ['hotel-hurghada-checkin'], category: '住宿', title: '胡戈哈达广场希尔顿酒店', date: '2026-10-07—10-10', status: '已订', evidenceState: '已核对截图', note: '3晚，1间海景豪华双床房；英文身份待与确认单核对。', sourceIds: ['src-hotel-images'] },
];

export const knownConflicts = tripDays.flatMap((day) => day.items.filter((item) => item.conflict).map((item) => ({ day: day.label, itemId: item.id, conflict: item.conflict! })));
export const allItems = tripDays.flatMap((day) => day.items);
