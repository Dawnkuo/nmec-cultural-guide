import type { SpatialModel, SpatialReferenceImage } from './types';

type SpatialDelivery = Pick<SpatialModel, 'mode' | 'precision' | 'title' | 'description' | 'evidenceNote' | 'sourceIds' | 'referenceImages' | 'limitations'>;

const reviewedAt = '2026-09-16';
const reference = (value: SpatialReferenceImage) => value;

export const spatialDeliveryByGuide: Record<string, SpatialDelivery> = {
  'national-museum-egyptian-civilization': {
    mode: 'official-plan-reference', precision: 'relative', title: '主展厅与皇家木乃伊厅权威平面',
    description: '直接显示公开研究中经 NMEC 资料整理的两张真实平面，不再用任意矩形代替建筑。可放大核对入口、主厅和皇家木乃伊厅。',
    evidenceNote: '图件支持主厅与木乃伊厅的总体形状和入口方向；不支持消防疏散、无障碍路线、当日封闭区或逐展柜导航。',
    sourceIds: ['src-nmec-plan-study', 'src-nmec'],
    referenceImages: [reference({ id: 'nmec-plan', label: '主厅＋木乃伊厅', src: '/maps/attractions/nmec-floor-plan.png', alt: 'NMEC 主厅和皇家木乃伊厅公开研究平面', caption: 'Figure 5：左为主厅，右为皇家木乃伊厅；图源说明为作者依据 NMEC 资料整理。', sourceId: 'src-nmec-plan-study', sha256: '6cbaaf458028441e917205723289b90bbcfae0d721228a900d518500d5003e32', width: 4178, height: 1577, scope: 'interior', reviewedAt })],
    limitations: ['未找到馆方可下载的逐展柜楼层图。', '不把展览阅读顺序画成建筑通道。'],
  },
  'grand-egyptian-museum': {
    mode: 'official-plan-reference', precision: 'relative', title: 'GEM 官方园区图',
    description: '使用 GEM 官网实际发布的园区图，显示主馆、入口、悬挂方尖碑、胡夫船馆、文保中心、活动区和停车区。',
    evidenceNote: '官网当前提供的是园区图和航拍，不是馆内楼层图；因此本页不再伪造大楼梯、十二展厅或图坦卡蒙厅的室内平面。',
    sourceIds: ['src-gem-map', 'src-gem'],
    referenceImages: [reference({ id: 'gem-complex', label: '官方园区图', src: '/maps/attractions/gem-complex-map.jpg', alt: '大埃及博物馆官方园区地图', caption: 'GEM Complex Map：主馆外部园区与到达设施。', sourceId: 'src-gem-map', sha256: '143f2de82a185ff8480d093aaab2db2e51e1daaeca15bfee400acbced33854a0', width: 1920, height: 1374, scope: 'site', reviewedAt })],
    limitations: ['没有公开且已核验的馆内楼层几何，故不提供假 2D/3D。', '馆内分区保留为文字现场索引，实际参观以馆方当日导视为准。'],
  },
  'giza-plateau': {
    mode: 'official-plan-reference', precision: 'relative', title: '吉萨高原考古总平面',
    description: '显示三大金字塔、附属金字塔、墓园、神庙和甬道在高原中的真实相对位置。',
    evidenceNote: '原图用于遗址构成和相对位置阅读；不表示当前车辆入口、步行许可边界或现场关闭区域。',
    sourceIds: ['src-giza-plateau-plan', 'src-digital-giza', 'src-egypt-giza'],
    referenceImages: [reference({ id: 'giza-plan', label: '高原总平面', src: '/maps/attractions/giza-plan.jpg', alt: '吉萨高原遗址总平面', caption: 'Giza Plateau plan：高原上的金字塔复合体、墓园、神庙与甬道。', sourceId: 'src-giza-plateau-plan', sha256: '6371625976d5c656d7ac74e5811f1a5081f63a91edec617f6d55ee9b57b2726b', width: 4481, height: 5955, scope: 'site', reviewedAt })],
    limitations: ['不绘制未经核实的游客步行线路。', '各金字塔内部通道不在此场地图中。'],
  },
  'cairo-citadel': {
    mode: 'official-plan-reference', precision: 'relative', title: '开罗城堡现状场地图',
    description: '使用现状场地图辨认南北围区、穆罕默德·阿里清真寺、纳西尔·穆罕默德清真寺、博物馆和宫殿。',
    evidenceNote: '图件表达场地关系；清真寺内部以现场文字导览说明，不把未取得的室内图硬画成平面。',
    sourceIds: ['src-citadel-map', 'src-muhammad-ali', 'src-citadel'],
    referenceImages: [reference({ id: 'citadel-site', label: '城堡现状图', src: '/maps/attractions/cairo-citadel-map.jpg', alt: '开罗城堡现状场地图', caption: 'Cairo Citadel present-day layout，CC BY-SA 4.0。', sourceId: 'src-citadel-map', sha256: 'f76a66b5c8603a0c3fbf028937d16af50cabed862140cc35c057a95b2db46efa', width: 1100, height: 920, scope: 'site', reviewedAt })],
    limitations: ['不将场地图误作无障碍或实时通行图。', '穆罕默德·阿里清真寺室内目前仅提供文字空间索引。'],
  },
  'khan-el-khalili': {
    mode: 'official-plan-reference', precision: 'relative', title: '哈利利市场地理语境图',
    description: '用固定版本的 OpenStreetMap 线稿核对市场在历史开罗中的地理位置；不根据阅读顺序虚构街巷路线。',
    evidenceNote: '线稿由本地 OSM 数据生成，支持离线查看；商铺、安检、封路和夜间通行会变化。',
    sourceIds: ['src-osm', 'src-historic-cairo'],
    referenceImages: [reference({ id: 'khan-context', label: '历史开罗语境', src: '/maps/attractions/khan-el-khalili-context.svg', alt: '哈利利市场在历史开罗中的离线地理语境图', caption: '© OpenStreetMap contributors；固定数据线稿，非步行导航。', sourceId: 'src-osm', sha256: 'f77f7ffd8cbe53556bbfc1dc8a6add97f0c5578614ce643a5e455dfa27efaec6', width: 1200, height: 760, scope: 'context', reviewedAt })],
    limitations: ['没有稳定、权威的室内平面；这是开放街区而非单体建筑。', '不绘制未经实地复核的逛街路线。'],
  },
  'abu-simbel': {
    mode: 'official-plan-reference', precision: 'relative', title: '阿布辛贝大神庙历史平面',
    description: '显示立面之后的八柱厅、次厅、侧室和最深处至圣所，直接保留历史测绘图的空间关系。',
    evidenceNote: '历史平面支持建筑序列；小神庙和迁建后的外围到达环境不在同一张内部图中。',
    sourceIds: ['src-abu-plan', 'src-abu-simbel'],
    referenceImages: [reference({ id: 'abu-plan', label: '大神庙内部', src: '/maps/attractions/abu-simbel-plan.png', alt: '阿布辛贝大神庙历史平面', caption: 'Great Temple at Abu Simbel historic floor plan，公版历史测绘。', sourceId: 'src-abu-plan', sha256: '9ae53351cd99ae70d5769eb44d055f1c7ad6875e5ddf8b7f31f6c4758152abd4', width: 399, height: 560, scope: 'interior', reviewedAt })],
    limitations: ['不推断侧室当日开放状态。', '显示的是历史建筑平面，不是迁建工程测量图。'],
  },
  'kom-ombo': {
    mode: 'official-plan-reference', precision: 'relative', title: '康翁波双轴神庙测绘平面',
    description: '使用 Jacques de Morgan 档案测绘图查看共用庭院、平行双轴、成对厅室与双至圣所。',
    evidenceNote: '图上保留测绘比例、北针、尼罗河与地形语境；鳄鱼博物馆不在这张历史神庙平面内。',
    sourceIds: ['src-kom-plan', 'src-kom-ombo'],
    referenceImages: [reference({ id: 'kom-plan', label: '双轴神庙平面', src: '/maps/attractions/kom-ombo-plan.png', alt: '康翁波神庙历史测绘总平面', caption: 'Jacques de Morgan archive：Plan of the Temple of Kom Ombo。', sourceId: 'src-kom-plan', sha256: '67d2af63ed484b292039fe22f92718512bd4c4c9e722bbdb3b087927f1524fed', width: 1621, height: 2143, scope: 'site', reviewedAt })],
    limitations: ['不把历史门洞等同于当前开放通道。', '鳄鱼博物馆仅保留文字参观说明。'],
  },
  'edfu-temple': {
    mode: 'official-plan-reference', precision: 'relative', title: '埃德富神庙建筑平面',
    description: '真实平面完整显示塔门、露天庭院、两重柱厅、前室、至圣所和外围侧室。',
    evidenceNote: '历史建筑平面支持空间序列；字母编号沿用原图，不代表本项目自行编号。',
    sourceIds: ['src-edfu-plan', 'src-aswan-guide'],
    referenceImages: [reference({ id: 'edfu-plan', label: '神庙总平面', src: '/maps/attractions/edfu-plan.gif', alt: '埃德富神庙历史建筑平面', caption: 'University of South Florida / Encyclopaedia Britannica 1910 plan。', sourceId: 'src-edfu-plan', sha256: '9d08e3d506a012ede9f9447959a7f2a27061e1e7581428d206592f565e8214ea', width: 429, height: 900, scope: 'interior', reviewedAt })],
    limitations: ['不据此判断侧室实时开放。', '不叠加未经现场核实的单向参观路线。'],
  },
  'luxor-temple': {
    mode: 'official-plan-reference', precision: 'relative', title: '卢克索神庙 ISAC Key Plan',
    description: '用芝加哥大学 ISAC 出版的 Key Plan 阅读塔门、拉美西斯庭院、柱廊、阿蒙霍特普三世庭院和南端内室。',
    evidenceNote: '这是建筑与装饰定位用 Key Plan；不代表售票、无障碍或当日开放路线。',
    sourceIds: ['src-luxor-plan', 'src-luxor-temple'],
    referenceImages: [reference({ id: 'luxor-plan', label: '神庙 Key Plan', src: '/maps/attractions/luxor-key-plan.png', alt: '卢克索神庙 ISAC 建筑 Key Plan', caption: 'ISAC OIC 27，Plate 20：Temple of Luxor Key Plan。', sourceId: 'src-luxor-plan', sha256: '222bd9b02fc0921bb5c7b1862a4dee1460b602d3c35cf7393e36efc627e3e002', width: 1598, height: 2115, scope: 'site', reviewedAt })],
    limitations: ['图中装饰编号不是本项目的参观编号。', '不把历史轴线声明为当前游客动线。'],
  },
  'valley-of-the-kings': {
    mode: 'official-plan-reference', precision: 'relative', title: '底比斯西岸与帝王谷权威地形图',
    description: '使用 Theban Mapping Project 区域图辨认东谷、西谷、代尔巴哈里和周边山谷关系。',
    evidenceNote: '区域地形图不固定标注当日开放墓室；开放墓室和附加票随现场安排变化。',
    sourceIds: ['src-theban-map', 'src-valley-kings'],
    referenceImages: [reference({ id: 'theban-map-valley', label: '帝王谷区域', src: '/maps/attractions/theban-necropolis.png', alt: '底比斯墓地区域地图，含帝王谷', caption: 'Theban Mapping Project：Theban Necropolis central area map。', sourceId: 'src-theban-map', sha256: '99e06b4ec13ee535758e1578f9db7d8f71553acf1578b0b679853706859ec204', width: 1960, height: 1440, scope: 'context', reviewedAt })],
    limitations: ['不伪造轮换开放墓室清单。', '不把区域道路骨架当步行导航。'],
  },
  'hatshepsut-temple': {
    mode: 'official-plan-reference', precision: 'relative', title: '哈特谢普苏特神庙分层建筑平面',
    description: '出版图分为最低柱廊、南半与北半；南北分图各包含不同台地的空间，不把图版次序误当楼层。',
    evidenceNote: '平面用于识别台地、柱廊、礼拜空间与内院；每张图的原始方位标记和编号均予保留。',
    sourceIds: ['src-hatshepsut-oic-plan', 'src-hatshepsut'],
    referenceImages: [
      reference({ id: 'hat-lower', label: '最低柱廊 · 图版34左幅', src: '/maps/attractions/hatshepsut-plate-274.png', alt: '哈特谢普苏特神庙第一层和最低柱廊平面', caption: 'ISAC OIC 27，Plate 34左幅：最低柱廊；右幅见原生到达层。', sourceId: 'src-hatshepsut-oic-plan', sha256: '9e12c50dab8e23ee3b1ccb0118bb96e550f0fbe7dfb7bb4399fe132fcd405794', width: 1598, height: 2115, scope: 'site', reviewedAt }),
      reference({ id: 'hat-middle', label: '南半建筑 · 图版35左幅', src: '/maps/attractions/hatshepsut-plate-276.png', alt: '哈特谢普苏特神庙南半上层与哈托尔内室平面', caption: 'ISAC OIC 27，Plate 35左幅：南半上层及哈托尔内室；不是整个第二层。', sourceId: 'src-hatshepsut-oic-plan', sha256: '926e2de975cbcc3c7a5c8f2708cb39ef8279212b23dd89ecead5fed2a5525ded', width: 1598, height: 2115, scope: 'site', reviewedAt }),
      reference({ id: 'hat-upper', label: '北半建筑 · 图版36左幅', src: '/maps/attractions/hatshepsut-plate-278.png', alt: '哈特谢普苏特神庙上层庭院和阿蒙圣所平面', caption: 'ISAC OIC 27，Plate 36左幅：北半上层、太阳祭坛及阿蒙圣所。', sourceId: 'src-hatshepsut-oic-plan', sha256: 'f980e3c02f97648881e2d4305876641484c8a16834b1b609a429a707e94a3ac3', width: 1598, height: 2115, scope: 'interior', reviewedAt }),
    ],
    limitations: ['不同出版图页不强行拼接成测量级总图。', '不推断高差、坡度或无障碍路线。'],
  },
  'colossi-of-memnon': {
    mode: 'official-plan-reference', precision: 'relative', title: '门农巨像与底比斯西岸地理关系',
    description: '用 Theban Mapping Project 区域图核对巨像、阿蒙霍特普三世葬祭殿遗址和西岸主要遗址的相对位置。',
    evidenceNote: '巨像为开放地景标志；后方葬祭殿持续考古，本页不做未经证实的完整建筑复原。',
    sourceIds: ['src-theban-map', 'src-colossi-research', 'src-thebes'],
    referenceImages: [reference({ id: 'theban-map-colossi', label: '西岸区域图', src: '/maps/attractions/theban-necropolis.png', alt: '底比斯西岸区域地图，含门农巨像和葬祭殿区域', caption: 'Theban Mapping Project：Theban Necropolis central area map。', sourceId: 'src-theban-map', sha256: '99e06b4ec13ee535758e1578f9db7d8f71553acf1578b0b679853706859ec204', width: 1960, height: 1440, scope: 'context', reviewedAt })],
    limitations: ['不使用与本遗址无关的摄影集冒充考古平面。', '不复原持续发掘区的完整建筑体量。'],
  },
  'karnak': {
    mode: 'official-plan-reference', precision: 'relative', title: '卡纳克神庙群总体平面',
    description: '显示阿蒙区、穆特区、蒙图区、圣湖、东西太阳轴和通往卢克索的南北轴，并保留比例尺与北针。',
    evidenceNote: '总体平面适合辨认围区和轴线；复杂建筑内部需配合下方独立介绍，不把总图简化成八个矩形。',
    sourceIds: ['src-karnak-plan', 'src-karnak'],
    referenceImages: [reference({ id: 'karnak-overall', label: '神庙群总平面', src: '/maps/attractions/karnak-overall-plan.png', alt: '卡纳克神庙群总体建筑平面', caption: 'UCLA Digital Karnak：Karnak overall plan。', sourceId: 'src-karnak-plan', sha256: '57200e6c7d32fcbd37955a164551165fcdc19b9c961e5db5b0b9ebc29eef584b', width: 2880, height: 4320, scope: 'site', reviewedAt })],
    limitations: ['总图不等于当前开放边界。', '不虚构完整步行路线或建筑高度。'],
  },
  'orange-bay': {
    mode: 'official-plan-reference', precision: 'relative', title: 'Orange Bay 离线地理语境图',
    description: '显示 Orange Bay 在赫尔格达与吉夫顿岛区域中的真实位置；没有订单时不绘制船程。',
    evidenceNote: '点位和线稿来自固定版本 OpenStreetMap；目的地官网只支持身份与服务信息，不支持具体运营商码头、航道或浮潜点。',
    sourceIds: ['src-osm', 'src-orange-bay'],
    referenceImages: [reference({ id: 'orange-context', label: '岛屿地理语境', src: '/maps/attractions/orange-bay-context.svg', alt: 'Orange Bay 在赫尔格达与吉夫顿岛之间的离线地理语境图', caption: '© OpenStreetMap contributors；未连线的核实点位。', sourceId: 'src-osm', sha256: '5c8491eab8d77f990dc2f56ce89221f3c9244ae426a382fb81000053a6f7dd39', width: 1200, height: 760, scope: 'context', reviewedAt })],
    limitations: ['没有运营商订单，因此省略码头、接送、航道、下水点和返船路线。', '不把示意珊瑚区画成已核实的潜点。'],
  },
};

export function hasInteractiveNodeBinding(spatial: SpatialModel, nodeId?: string) {
  if (!nodeId || spatial.mode !== 'interactive-schematic') return false;
  const node = spatial.nodes.find(n => n.id === nodeId);
  if (spatial.architecture) return (spatial.architectureLevels??[spatial.architecture]).flatMap(level=>level.spaces).some(space => space.nodeId === nodeId && node?.renderBindings?.twoDFeatureId === `2d:${space.id}` && node?.renderBindings?.threeDFeatureId === `3d:${space.id}`);
  return spatial.plan?.areas.some((area) => area.nodeId === nodeId) ?? false;
}
