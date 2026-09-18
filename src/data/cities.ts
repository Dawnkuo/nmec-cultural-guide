import type { CityProfile } from './types';
import { guideCover } from './guide-covers';

export const cityProfiles: CityProfile[] = [
  {
    slug: 'cairo-giza', name: '开罗与吉萨', originalName: 'Cairo & Giza', region: '下埃及 / 大开罗', coordinates: { lat: 30.02, lng: 31.21 }, hero: guideCover('cairo-citadel'),
    thesis: '一边是延续千年的国家纪念物，一边是持续生长的伊斯兰与现代都市；不要把开罗压缩成“去金字塔的入口”。',
    chronology: [
      { period: '古王国', title: '孟菲斯王权与吉萨王陵', body: '金字塔群把王室葬祭、国家资源与尼罗河谷地景组织为纪念性复合体。' },
      { period: '早期伊斯兰至中世纪', title: '福斯塔特与历史开罗', body: '城市重心、宗教建筑、市场和防御设施持续北移与扩展。' },
      { period: '十九世纪至今', title: '新国家与博物馆城市', body: '城堡天际线、殖民与民族国家工程、NMEC 与 GEM 继续重写古物如何被展示。' },
    ], guideSlugs: ['national-museum-egyptian-civilization', 'giza-plateau', 'grand-egyptian-museum', 'cairo-citadel', 'khan-el-khalili'],
  },
  {
    slug: 'aswan-nubia', name: '阿斯旺与努比亚', originalName: 'Aswan & Nubia', region: '埃及南部', coordinates: { lat: 23.7, lng: 32.4 }, hero: guideCover('abu-simbel'),
    thesis: '这里既是古代南方门户，也是现代水利与国际遗产抢救改变地景的核心区域。',
    chronology: [
      { period: '古代', title: '边界、采石与尼罗河交通', body: '阿斯旺连接埃及与努比亚，石材、贸易和军事交通塑造城市角色。' },
      { period: '希腊罗马时期', title: '沿河神庙网络', body: '康翁波与埃德富把地方神祇、节庆和尼罗河交通连成区域体系。' },
      { period: '二十世纪', title: '水坝、迁移与世界遗产', body: '阿布辛贝抢救工程既保存神庙，也永久改变其地理语境。' },
    ], guideSlugs: ['abu-simbel', 'kom-ombo', 'edfu-temple'],
  },
  {
    slug: 'luxor-thebes', name: '卢克索与古底比斯', originalName: 'Luxor & Ancient Thebes', region: '上埃及', coordinates: { lat: 25.71, lng: 32.63 }, hero: guideCover('luxor-temple'),
    thesis: '尼罗河东岸的神庙城市与西岸的王室葬祭地景构成一个整体；逐个景点打卡会丢失这条最重要的空间关系。',
    chronology: [
      { period: '中王国起', title: '底比斯成为权力中心', body: '地方王朝统一埃及，阿蒙崇拜与城市地位同步上升。' },
      { period: '新王国', title: '东岸仪式、西岸葬祭', body: '卡纳克—卢克索神庙与帝王谷—葬祭殿共同组织生者与死者的城市。' },
      { period: '后期至现代', title: '重用、发掘与旅游城市', body: '罗马军营、古典旅行、考古修复和现代照明不断改变观看方式。' },
    ], guideSlugs: ['luxor-temple', 'valley-of-the-kings', 'hatshepsut-temple', 'colossi-of-memnon', 'karnak'],
  },
  {
    slug: 'hurghada-red-sea', name: '赫尔格达与红海', originalName: 'Hurghada & the Red Sea', region: '红海沿岸', coordinates: { lat: 27.23, lng: 33.85 }, hero: guideCover('orange-bay'),
    thesis: '红海章节的核心不是把项目排满，而是把海况、运营商责任、潜水资质与珊瑚保护放在同一决策里。',
    chronology: [
      { period: '地质长时段', title: '裂谷海域与珊瑚环境', body: '高盐度、清澈水体与复杂礁体塑造今天的潜水与浮潜景观。' },
      { period: '二十世纪', title: '港口与滨海城市扩张', body: '赫尔格达从沿海聚落发展为大型旅游城市，海洋活动成为主要产业。' },
      { period: '今天', title: '旅游承载与生态边界', body: '船只、沙滩设施和水上项目必须服从海洋安全与保护规则。' },
    ], guideSlugs: ['orange-bay'],
  },
];

export const cityBySlug = new Map(cityProfiles.map((city) => [city.slug, city]));
