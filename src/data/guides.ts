import { reviewedGuideImage } from './reviewed-guide-media';
import { guideCover } from './guide-covers';
import type { CulturalGuide, GuideHighlight, GuideVisitChapter, SpatialModel, SpatialNode } from './types';
import { spatialDeliveryByGuide } from './spatial-delivery';
import { architectureCatalog } from './architecture/catalog';

function node(slug: string, id: string, name: string, kind: SpatialNode['kind'], x: number, z: number, description: string, sourceIds: string[], scale = 1): SpatialNode {
  void slug;
  return { id, name, kind, x, z, scale, description, sourceIds };
}

function highlight(slug: string, id: string, title: string, period: string, location: string, summary: string, whyItMatters: string, lookFor: string, sourceIds: string[], nodeId?: string): GuideHighlight {
  return { id, nodeId, title, period, location, summary, whyItMatters, lookFor, image: reviewedGuideImage(slug, id), sourceIds: [...sourceIds, 'src-commons-media'] };
}

function visitChapter(slug: string, id: GuideVisitChapter['id'], label: string, title: string, summary: string, checkpoints: string[], accessNote: string, sourceIds: string[]): GuideVisitChapter {
  return {
    id,
    label,
    title,
    summary,
    checkpoints,
    accessNote,
    image: reviewedGuideImage(slug, id),
    sourceIds: [...sourceIds, 'src-commons-media'],
  };
}

function reviewedSpatial(slug: string, nodes: SpatialNode[]): SpatialModel {
  const levels=architectureCatalog[slug];
  if (levels) return {
    mode: 'interactive-schematic', precision: 'relative', title: '建筑平面与空间导览',
    description: '依据核对的建筑平面或地理要素建立原生空间图，默认到达层或场地总览 2D。',
    evidenceNote: '平面比例与房间位置来自已核对图件；3D 剖切高度仅为展示。',
    sourceIds: [...new Set([...spatialDeliveryByGuide[slug].sourceIds,...levels.map(l=>l.source.id)])], architecture: levels[0], architectureLevels:levels,
    limitations: [...new Set(levels.flatMap(l=>l.limitations))],
    nodes: nodes.map(n => {
      const mapped = levels.flatMap(l=>l.spaces).find(s => s.nodeId === n.id);
      return mapped ? {...n, renderBindings:{twoDFeatureId:`2d:${mapped.id}`,threeDFeatureId:`3d:${mapped.id}`}} : n;
    }),
  };
  return { ...spatialDeliveryByGuide[slug], nodes };
}

const visitChaptersBySlug: Record<string, [GuideVisitChapter, GuideVisitChapter]> = {
  'national-museum-egyptian-civilization': [
    visitChapter('national-museum-egyptian-civilization', 'exterior', '外观与抵达', '先把博物馆放回福斯塔特', '抵达时先看现代博物馆、艾因西拉湖与福斯塔特历史城区的关系。建筑不是一座脱离城市的容器：宽阔入口、水平展开的主体和上部金字塔形大厅共同提示，这里要把漫长文明史压缩进一座当代公共建筑。', ['在入口广场先辨认主入口，不把湖岸景观入口当作展厅入口。', '退后观察低矮横向体量与上部金字塔形大厅的层级。', '把湖面、福斯塔特遗址与新馆视为三个时代层，而不是一幅古代复原景观。'], '抵达后先按馆方标识找到游客入口与安检；落客位置以当天指引为准。', ['src-nmec']),
    visitChapter('national-museum-egyptian-civilization', 'interior', '内部参观', '从主展厅建立年代，再进入专题展厅', '内部先用主展厅建立从史前到近现代的时间骨架，再转向纺织、皇家木乃伊等专题。这样能避免一进馆就追逐王名，也能把日常材料、工艺和活态传统放回“文明延续”的主线。', ['先找主展厅的年代提示，选择农业、书写、王权或工艺作为贯穿线索。', '中段主动寻找纺织、日常器物和晚期古代材料，不让参观在法老时期中止。', '把皇家木乃伊展厅放在体力仍充足的后半段，先读人物生平，再慢慢观察。'], '主展厅与皇家木乃伊厅分层参观；换层时留意馆内标识，需要无障碍通行协助可询问工作人员。', ['src-nmec-main', 'src-nmec-mummies']),
  ],
  'giza-plateau': [
    visitChapter('giza-plateau', 'exterior', '外观与地景', '先看高地，再看三座主金字塔', '吉萨的第一层不是“打卡三座塔”，而是读懂高地、低地和三组王陵复合体。先用远景分辨胡夫、哈夫拉和孟卡拉，再把王后金字塔、墓园、神庙与甬道补回视野。', ['用胡夫金字塔建立尺度，再用哈夫拉较高地势和顶部包层校正“谁更高”的错觉。', '观察主塔周边较小金字塔与墓葬密度，确认它是一座制度化的亡者城市。', '从高地望向东侧低地，理解上升甬道、河谷神庙与狮身人面像的关系。'], '全国票与单座金字塔内部票并非同一范围；车辆、入口和现场动线须按当天票务与管理执行。', ['src-egypt-giza', 'src-digital-giza']),
    visitChapter('giza-plateau', 'interior', '内部与可进入空间', '把“进入金字塔”当作可选附加段', '金字塔内部不是壁画展厅，而是狭窄通道、坡度、石材接缝和封闭墓室构成的工程体验。若当日开放且票种包含，可用一座内部理解结构；若不进入，河谷神庙等开放石构空间仍能解释仪式如何从低地走向主塔。', ['进入前确认具体开放的是哪座金字塔、是否另购票，以及狭窄坡道是否适合自己的体力。', '内部重点看通道坡度、石块拼接、空间突然放大或收窄，不期待连续彩绘。', '在河谷神庙观察花岗岩包覆、浅色地面和柱位，把材料组织与葬祭过程联系起来。'], '内部开放、摄影、随身物品和健康限制会变化；幽闭、膝背不适或心肺风险者不应勉强进入。', ['src-egypt-giza', 'src-egypt-khufu', 'src-egypt-khafre']),
  ],
  'grand-egyptian-museum': [
    visitChapter('grand-egyptian-museum', 'exterior', '外观与抵达', '从悬吊方尖碑进入吉萨门户', 'GEM 的外部体验从入口广场、悬吊方尖碑、斜向展开的巨大立面和远处吉萨高地之间开始。不要把外观只当排队区；它先把现代国家工程与古代纪念物放在同一条观看轴线上。', ['在入口前先辨认悬吊方尖碑与主立面的尺度关系。', '观察立面如何控制阴影、开口与进入方向，而不是只拍正面全景。', '回望吉萨方向，理解博物馆为何被设置为高地的现代门户。'], '官方目前指引车辆从开罗—亚历山大沙漠路进入 Gate 2；具体落客、安检和团队入口以当天通知为准。', ['src-gem', 'src-gem-map']),
    visitChapter('grand-egyptian-museum', 'interior', '内部参观', '大堂—大楼梯—主展厅—专题馆', '内部先在大堂围绕拉美西斯二世巨像建立尺度，再沿大楼梯比较跨时期大型作品，之后进入十二个主展厅。图坦卡蒙展厅与胡夫船博物馆都是独立重点，不能当作经过式附加项。', ['在大堂先看巨像与建筑的尺度关系，再看梅伦普塔胜利柱等周边对象。', '大楼梯每一段只选一件雕塑细读，保留精力给主展厅。', '主展厅选择“社会、王权或信仰”一条主题横穿多个时期，再按时间补足另一条线。', '最后在图坦卡蒙展厅与胡夫船博物馆之间按票种、时间和体力排序。'], '下方提供到达层、十二个主展厅和图坦卡蒙展厅三层图。到达层与主展厅建筑轮廓来自2016年官方建设平面，馆号另据2025年现场导视；图坦卡蒙层采用展览设计方2025年平面。它们不替代当天的展柜与开放信息。', ['src-gem-map', 'src-gem-tickets', 'src-gem-experience']),
  ],
  'cairo-citadel': [
    visitChapter('cairo-citadel', 'exterior', '外观与高地', '先读城堡，再辨认清真寺轮廓', '从穆卡塔姆高地抵达时，先把城墙、坡度和城市眺望看成长期军政场址，再转向穆罕默德·阿里清真寺。中央穹顶、四个半穹顶、角部小穹顶与双尖塔共同构成十九世纪新加入的天际线。', ['先沿高差和城墙判断场址的防御优势，不把整个城堡等同于一座清真寺。', '退到能看到穹顶群和两座细长尖塔的距离，辨认横向与竖向体量。', '比较浅色石材表面、窗洞与修补，不仅凭“雪花石膏清真寺”的俗称判断材料。'], '城堡是复合遗址；开放建筑和可进入院落会受现场管理影响，本页不承诺完整绕行路线。', ['src-citadel', 'src-muhammad-ali']),
    visitChapter('cairo-citadel', 'interior', '庭院与内部', '从开放庭院进入中央穹顶礼拜厅', '清真寺采用开放庭院加方形礼拜厅的结构。先在庭院观察钟塔与进入节奏，再进入由中央大穹顶、四个半穹顶和角部小穹顶统摄的礼拜空间，最后比较木制与后加大理石讲坛。', ['在庭院先看钟塔、拱廊和礼拜厅入口如何围合开放空间。', '进入后抬头追踪中央穹顶向半穹顶、角部小穹顶和墙体的过渡。', '辨认两座讲坛的材料与年代差异，把后加构件视为建筑持续使用的证据。'], '这里仍具有宗教意义；衣着、脱鞋、音量、礼拜时段和摄影必须服从现场规则。', ['src-muhammad-ali']),
  ],
  'khan-el-khalili': [
    visitChapter('khan-el-khalili', 'exterior', '街区外观与进入', '用街宽、门洞和光线辨认历史城市', '哈利利市场不是一个有单一正立面的景区。外观来自街巷连续界面：石砌门洞、木格窗、店铺开口、遮棚、招牌和不断变化的人流共同构成历史开罗仍在运作的商业空间。', ['记录从较宽街道进入狭窄巷道时声音、光线和视线如何变化。', '抬头看木格窗、石雕门套与上层挑出部分，不只盯着一层商品。', '把手工制作、批发零售和游客纪念品店分开观察，不以外观判断真伪。'], '街区持续营业并有人居住；车辆、摊位和人流会改变通行条件，夜间不要依赖离线图寻找固定“入口”。', ['src-historic-cairo']),
    visitChapter('khan-el-khalili', 'interior', '可进入的内部空间', '这里没有统一“内部”，只有不同建筑类型', '市场街巷没有一条统一室内路线。可在开放且允许进入时观察商旅建筑的院落、店铺的进深与储藏关系，以及周边清真寺、经学院和施水亭的门槛；每种空间都有独立规则。', ['进入店铺先看狭长开间、货架与工作区怎样适应密集街巷。', '若院落式商旅建筑开放，观察中央院、上层廊道与仓储／住宿之间的垂直关系。', '接近宗教建筑时先停在门槛核对开放、衣着和摄影要求，不把商业街行为直接带入。'], '私人店铺、住宅和宗教空间不是公共展厅；未经允许不进入、不拍摄人物，也不把关闭门洞写成必看内部。', ['src-historic-cairo']),
  ],
  'abu-simbel': [
    visitChapter('abu-simbel', 'exterior', '外观与迁移地景', '两座立面与一座现代重组山体', '先从纳赛尔湖岸和重组山体理解迁移工程，再分别观看大神庙与小神庙。大神庙由四尊拉美西斯二世坐像控制尺度，其中一尊因古代地震倒塌；北侧小神庙让妮菲尔塔丽巨像与国王接近同等尺度。', ['先退到能同时看见山体与两座神庙的位置，辨认古代岩凿建筑和现代迁移地景。', '在大神庙立面比较四尊坐像、倒塌碎块和入口上方图像。', '转到小神庙比较国王与王后巨像尺度，理解这种并置为何罕见。'], '现址是 1960 年代国际迁移工程的结果；不要把人工重组山体误作未经改变的古代原位。', ['src-abu-simbel', 'src-unesco-nubian']),
    visitChapter('abu-simbel', 'interior', '内部参观', '沿柱像厅逐步收窄到至圣所', '大神庙内部从巨型柱像厅、次级厅室一路收窄到至圣所，空间、光线和图像共同把国王推向神化。随后再进入小神庙，用哈托尔主题和妮菲尔塔丽形象修正只看王权的一条线。', ['在大神庙柱像厅先看王像与柱体如何合为一体，再选择一侧浮雕细读。', '沿中轴向内时不断回望入口，记录自然光如何衰减、空间如何变窄。', '至圣所辨认四尊坐像，但不要把特定日期的阳光现象当作日常保证。', '小神庙重点看哈托尔柱头与王后形象，比较两座神庙的赞助主题。'], '内部可能限制摄影、停留或并行人数；特定日照日期、人流与开放安排必须按官方当日通知。', ['src-abu-simbel', 'src-unesco-nubian']),
  ],
  'kom-ombo': [
    visitChapter('kom-ombo', 'exterior', '外观与河岸', '从尼罗河岸先看“双重”结构', '康翁波位于尼罗河东岸的高地边缘，保存状态让内部轴线比完整外壳更突出。抵达时先观察神庙与河岸的关系，再从入口和残存柱列寻找两套平行结构的线索。', ['先看河岸、高台和神庙残墙如何共同形成临水场址。', '从正面辨认成对入口和柱列，不把双轴理解为简单镜像装饰。', '留意不同保存高度和后期修复，避免把整齐轮廓都当作原状。'], '临河边缘、台阶与夜间照明会改变观看条件；按围挡和现场动线进入。', ['src-kom-ombo', 'src-aswan-guide']),
    visitChapter('kom-ombo', 'interior', '内部参观', '左右两条轴线一直走到双至圣所', '内部的核心不是单一“医学浮雕”，而是两条平行轴线：南侧右手属于索贝克，北侧左手属于哈罗埃里斯。共同前庭、柱厅和后部双至圣所让两套崇拜在同一建筑中保持对称又彼此区分。', ['在前庭先确认南北方向和左右两条轴，不急着追浮雕。', '进入柱厅后比较同类位置上的不同神祇与祭祀图像。', '后部重点辨认日历、仪式场景及被谨慎解释为外科器械的图像。', '若开放与票务允许，再到鳄鱼博物馆用木乃伊化鳄鱼补足索贝克崇拜。'], '鳄鱼博物馆是否包含、开放与最后入场需现场确认；“外科器械”保持官方的审慎表述。', ['src-kom-ombo', 'src-aswan-guide']),
  ],
  'edfu-temple': [
    visitChapter('edfu-temple', 'exterior', '外观与塔门', '先退后读完整塔门与荷鲁斯像', '埃德富的保存使正面塔门仍具有强烈完整感。两座塔体、入口、王权征服图像和花岗岩荷鲁斯鹰像构成进入前的第一课：宏大外观不是终点，而是把城市空间压缩为受控制的仪式入口。', ['在广场后退到能同时看见两座塔体和中央门洞的位置。', '比较巨型王权场景与真人尺度，理解图像如何利用建筑放大统治。', '近看荷鲁斯鹰像的石材、冠饰和磨损，再回看其与塔门的守护关系。'], '入口广场常有人流与团队集合；不要为全景越过围挡或阻塞中央通道。', ['src-aswan-guide']),
    visitChapter('edfu-temple', 'interior', '内部参观', '庭院—两重柱厅—前室—至圣所', '穿过塔门后，开放柱廊庭院先把光线拉满；随后两重柱厅、横厅与前室逐步变暗变窄，最终抵达至圣所。完整参观应沿这种空间收紧阅读，而不是只在第一柱厅停留。', ['在周柱庭院绕看不同植物式柱头，并回望塔门形成的明暗框景。', '第一柱厅看建庙与祭祀图像；第二柱厅寻找荷鲁斯圣舟和与哈托尔相关的节庆场景。', '经过横厅和供奉准备空间时，理解侧室是仪式基础设施而非多余小房间。', '在至圣所按围挡观察神龛、轴线和环绕空间，不假设每扇门都开放。'], '建筑地图依据已核对的历史正俯视平面；它不等于现行游客开放图，侧室、楼梯与回游方向服从现场。', ['src-aswan-guide']),
  ],
  'luxor-temple': [
    visitChapter('luxor-temple', 'exterior', '外观与城市轴线', '从塔门、方尖碑和狮身人面像大道进入', '卢克索神庙的外观首先属于城市仪式。北端塔门、仅存原位的一座方尖碑、拉美西斯二世巨像与通向卡纳克的狮身人面像大道共同说明，建筑朝向来自奥佩特节的移动关系。', ['在北端同时看塔门、方尖碑空缺的一侧和王像，不把不对称误作原设计。', '沿狮身人面像大道方向回望，确认神庙与卡纳克的城市联系。', '比较白天可读浮雕细节与夜间照明强化的体量，按到访时段调整重点。'], '夜间照明不等于所有浮雕都更清楚；入口和大道开放范围以现场围挡为准。', ['src-luxor-temple', 'src-thebes']),
    visitChapter('luxor-temple', 'interior', '内部参观', '在同一轴线上穿过多个统治时期', '内部从拉美西斯二世庭院、大柱廊进入阿蒙霍特普三世庭院与柱厅，再抵达更内侧圣所。沿途必须同时阅读法老时期扩建、奥佩特节浮雕、后期宗教建筑与罗马绘画，而不是把它当成一次完成的纯粹新王国神庙。', ['在拉美西斯庭院观察轴线如何绕开并容纳更早与后期建筑。', '沿十四根巨柱组成的大柱廊寻找奥佩特节场景，把浮雕和节庆移动联系起来。', '进入阿蒙霍特普三世核心时比较庭院、柱厅和内室的尺度变化。', '在罗马圣所辨认覆盖于更早浮雕之上的绘画，理解再利用而非“破坏后失真”。'], '内部部分空间、宗教设施和修复区域可能限制进入；不以本页顺序代替现场单向流线。', ['src-luxor-temple', 'src-thebes']),
  ],
  'valley-of-the-kings': [
    visitChapter('valley-of-the-kings', 'exterior', '谷地外观与选择', '先在荒漠谷地决定看哪几座墓', '帝王谷的外观不是宏伟入口，而是干燥支谷、陡峭岩壁与近似金字塔轮廓的山峰。先在访客中心核对当日开放墓室与票种，再把体力、热度和墓室差异纳入选择。', ['从谷地入口看自然山峰与封闭地形，理解隐蔽选址而非纪念性外立面。', '在访客中心按 KV 编号核对普通票、附加票与当天开放名单。', '观察墓口在岩壁和支谷中的分布，不把现代道路与古代葬礼路线混为一谈。'], '开放墓室、接驳、附加票和摄影规则会变化；离线导览不能预先保证固定“三墓组合”。', ['src-valley-kings', 'src-thebes']),
    visitChapter('valley-of-the-kings', 'interior', '墓室内部', '用一座墓学会读轴线，再比较图像', '墓室内部应从工程和图像两条线同时读：通道坡度、转折、柱厅和墓室构成地下序列；天花与墙面文字把太阳运行、冥界旅程和国王再生组织成可行走的宇宙。', ['第一座墓先看通道是直轴、折轴还是多次转折，并记录高差与完成度。', '抬头辨认星空、太阳船或天体图像，再看墙面文本怎样配合空间阶段。', '第二座墓选择不同年代或完成状态，比较线描、上色、凿刻与未完成痕迹。', '离开前回看入口方向，理解地下空间如何切断谷地强光。'], '墓内闷热、坡道与台阶集中；严禁触摸壁画，并按每座墓当日的摄影与停留规定执行。', ['src-valley-kings']),
  ],
  'hatshepsut-temple': [
    visitChapter('hatshepsut-temple', 'exterior', '外观与悬崖', '三层平台不是贴在山前的布景', '哈特谢普苏特葬祭殿用三层水平平台、长坡道和柱廊回应代尔巴哈里垂直悬崖。外观应从远处开始：先看人造水平线如何进入地景，再逐层接近，而不是一到上层才拍正面。', ['在下层远景分清自然岩壁、平台、坡道和现代复原部分。', '沿中轴观察坡道如何把视线推向上层，同时比较两侧柱廊的水平延伸。', '到中层后回望谷地，理解建筑如何同时面向悬崖与尼罗河方向。'], '可见轮廓包含长期考古修复；不要把所有整齐构件都描述为原状保存。', ['src-hatshepsut', 'src-thebes']),
    visitChapter('hatshepsut-temple', 'interior', '柱廊、礼拜空间与圣所', '从中层叙事进入上层祭祀核心', '内部与半室外空间沿三层展开：中层柱廊保存庞特远征和神圣出生叙事，两侧分别通向哈托尔与阿努比斯礼拜单元；上层庭院以奥西里斯式王像和位于中轴尽端的阿蒙圣所收束。', ['中层一侧寻找庞特远征中的人物、房屋、植物和贡品，另一侧看神圣出生如何建构合法性。', '比较哈托尔礼拜空间的牛耳柱头与阿努比斯礼拜空间的图像主题。', '在上层看木乃伊形王像如何把在世法老转化为死后奥西里斯身份。', '沿中轴进入岩壁内的阿蒙圣所语境，注意自然光和开放边界。'], '各礼拜空间和岩凿圣所可能分时或限制进入；以围挡为准，不把重建轴线当成全开放承诺。', ['src-hatshepsut']),
  ],
  'colossi-of-memnon': [
    visitChapter('colossi-of-memnon', 'exterior', '外观与短停', '把两尊巨像重新放回一座失落神庙', '门农巨像是阿蒙霍特普三世葬祭殿入口前的成对坐像，不是两件孤立路边雕塑。短停时先同时看两像与朝向，再比较风化、修复和王座侧面，最后把视线移到背后考古区。', ['先站到能同时看到两像的位置，确认它们作为入口守卫的成对关系。', '比较北像与南像的表面、拼接和修复差异，不只拍正面。', '转到可见侧面寻找王座图像与小型人物，再看背后神庙遗址尺度。'], '停车和道路环境变化快；只能在允许区域观察，不为取景横穿车流或进入考古工作区。', ['src-thebes', 'src-colossi-research']),
    visitChapter('colossi-of-memnon', 'interior', '无室内空间', '这里没有可进入的“雕像内部”', '门农巨像本身没有游客内部空间。第二阶段应改为围绕雕像基座、王座侧面和背后葬祭殿考古区做近距离阅读，并用出土墙体、柱基、斯芬克斯与塞赫麦特像线索恢复原建筑语境。', ['近看基座与王座侧面，但不攀爬、不触摸石面。', '辨认修复块、古代风化与后期铭刻，分开原作和历史叠加。', '隔着允许边界观察背后柱基、墙体和复位构件，理解神庙远大于今天的两尊像。'], '背后区域属于持续考古与修复场地；没有开放证据时不得将其写成可进入室内或固定参观路线。', ['src-colossi-research']),
  ],
  'karnak': [
    visitChapter('karnak', 'exterior', '外观与复合体', '先接受这不是一座单体神庙', '卡纳克是由阿蒙、穆特、蒙图等围区和两条主要仪式轴构成的宗教城市。抵达时先用入口塔门和狮身人面像大道建立方向，再把围墙内外的多个神庙、礼拜堂与后勤空间看成长期增建的系统。', ['在入口确认阿蒙围区主轴，不把第一塔门当作整座卡纳克的正立面。', '寻找朝向卢克索的南北轴线，理解奥佩特节如何把两座神庙连起来。', '比较不同塔门、墙体和石材接缝，辨认多个统治时期留下的建造层。'], '穆特围区、露天博物馆和声光秀可能使用不同票种与时段；不要把它们自动并入日间主票。', ['src-karnak', 'src-thebes']),
    visitChapter('karnak', 'interior', '内部与开放空间', '从大柱厅进入宗教城市的多层结构', '内部参观不止大柱厅。先在 134 根柱构成的大厅理解尺度、采光和重刻，再看方尖碑、圣湖、孔苏神庙及南北轴；每一段都显示神庙同时是宇宙模型、祭祀机构和政治工程。', ['在大柱厅先找中央十二根更高巨柱与高窗，再比较两侧较低柱阵。', '选择一面浮雕区分塞提一世与拉美西斯二世时期的刻法和重刻，不追求看完全部柱子。', '在方尖碑与塔门之间读竖向纪念物和扩建层次。', '转到圣湖理解净化与日常祭祀，再视体力选择孔苏神庙等相对完整单体。'], '复合体巨大且开放边界会变化；相对模型只解释围区和轴线，不能替代当日游客地图。', ['src-karnak']),
  ],
  'orange-bay': [
    visitChapter('orange-bay', 'exterior', '抵达与海岸', '先确认这次船程实际包含什么', 'Orange Bay 是吉夫顿岛海域的海滩目的地，不是一座有固定城市入口的景点。外部体验从赫尔格达码头、船上安全说明、靠岸点和沙滩集合区开始；宣传中的海水与白沙不能替代订单核对。', ['出发前确认码头、船名、接送、保险、午餐、装备和返程集合时间。', '靠岸后先记住码头、遮阳区、洗手间与集合点的相对位置。', '观察沙滩、浅水与珊瑚区的边界，不把所有清澈水域都当作可下水区。'], '目的地官网不能证明本次运营商的项目包含；风浪、靠岸点和上岛时长均以当天船方安排为准。', ['src-orange-bay']),
    visitChapter('orange-bay', 'interior', '水下／场内体验', '没有建筑内部，核心是安全进入海洋', '这里没有需要编造的“室内参观”。第二阶段是沙滩和水下体验：先完成装备、健康与集合检查，再以不踩踏珊瑚、不追逐生物、不投喂的方式观察红海生态。', ['下水前分别确认浮潜与水肺项目，检查救生衣、面镜、呼吸管或潜水装备。', '入水后保持与珊瑚距离，用浮力和缓慢动作观察鱼群与礁体。', '体力下降、能见度变差或教练召回时立即结束，不为拍摄脱离伙伴。', '返船前预留更衣、清点物品和点名时间。'], '水肺潜水可能涉及资质、试潜、健康声明和教练配比；未取得订单前一律保持待确认。', ['src-orange-bay']),
  ],
};

const nmecSources = ['src-nmec', 'src-nmec-main', 'src-nmec-mummies', 'src-nmec-hall-photo'];
const nmecSlug = 'national-museum-egyptian-civilization';
const nmecNodes = [
  node(nmecSlug, 'nmec-main', '主展厅', 'hall', -2.4, 0, '以时间与文明主题交叉组织埃及物质文化。', ['src-nmec-main']),
  node(nmecSlug, 'nmec-mummies', '皇家木乃伊展厅', 'hall', .2, -1.2, '独立地下展陈；平面范围依据馆方资料整理的公开研究图件，未绘制未知展柜。', ['src-nmec-mummies']),
  node(nmecSlug, 'nmec-textile', '纺织展览线索', 'hall', 2.2, .2, '用于识别材料、织造与社会生活的主题索引。', ['src-nmec']),
  node(nmecSlug, 'nmec-dye', '染坊遗存', 'museum', .8, 1.8, '场馆所在历史地景中的工艺遗存。', ['src-nmec']),
];

const nmec: CulturalGuide = {
  slug: nmecSlug, title: '埃及国家文明博物馆', originalTitle: 'National Museum of Egyptian Civilization', city: '开罗', region: '福斯塔特', category: '博物馆', tier: 'major', itemIds: ['visit-nmec'], coordinates: { lat: 30.0074, lng: 31.2483 },
  hero: guideCover(nmecSlug),
  deck: '先搭一条跨越史前至现代的文明主线，再进入皇家木乃伊与纺织、工艺等专题；这里的重点不是“追明星文物”，而是理解文明如何延续。',
  overview: 'NMEC 的独特之处在于以“文明”而非单一王朝或发掘地为组织原则。主展厅把政治、信仰、社会、材料和日常生活放在一条长时段中；皇家木乃伊展厅则要求放慢速度，以人的遗存、葬祭观念与现代保存伦理共同阅读。',
  orientation: [
    { title: '主展厅：从器物看生活', body: '这里从史前讲到近现代。水钟、假脚趾和战车，把计时、身体与王权变成看得见的故事。先看一件器物的材料与做法，再读它属于什么年代、由谁使用，比只记法老姓名更容易串起文明的变化。' },
    { title: '皇家木乃伊厅：先认识人', body: '哈特谢普苏特、图特摩斯三世等王名，在这里对应真实的人。先读姓名、年代与生平，再了解木乃伊的迁藏与保存。展厅借鉴帝王谷墓葬的氛围，适合放慢脚步，把人物与卢克索的神庙、王陵联系起来。' },
    { title: '先看通史，再看木乃伊', body: '建议先通览主展厅，挑几件感兴趣的器物细看；喜欢服饰与织造，可加看纺织专题。为皇家木乃伊厅留出一段完整时间，不要临近离馆才匆匆进入。时间有限时，先保留主展厅与皇家木乃伊这两个重点。' },
  ],
  visitChapters: visitChaptersBySlug[nmecSlug],
  spatial: reviewedSpatial(nmecSlug, nmecNodes),
  highlights: [
    highlight(nmecSlug, 'nmec-architecture', '从大厅先看“文明叙事”', '当代博物馆', '主展厅入口', '大厅的尺度与展柜关系把不同历史阶段放进同一视野，适合先建立整体时间感。', '它提示这不是某一王朝的专馆，而是一部跨时代的社会史。', '先找时间轴，再找同一主题在不同时期的材料变化。', nmecSources, 'nmec-main'),
    highlight(nmecSlug, 'nmec-prehistory', '史前生活：技术早于王朝', '史前时期', '主展厅早期章节', '石器、容器和生活工具应作为环境适应与技术积累来读，而不只是“最古老”的标签。', '王朝国家并非突然出现；长期的聚落、生产和交换构成前提。', '比较器物的磨制、穿孔与表面处理，想象制作步骤。', ['src-nmec-main'], 'nmec-main'),
    highlight(nmecSlug, 'nmec-kingship', '王权形象：固定程式中的选择', '法老时期', '主展厅国家与社会线索', '正面性、比例和冠饰让统治者超越个体肖像，成为秩序的可视符号。', '同一套视觉语法跨越漫长年代，却会因材料、尺度和政治语境而改变。', '看头饰、步姿、铭文位置与身体是否依附背柱。', ['src-nmec-main'], 'nmec-main'),
    highlight(nmecSlug, 'nmec-textile-material', '纺织物：最脆弱的社会档案', '法老时期至晚期传统', '纺织主题', '纤维、染色和补缀保留服饰、劳动与贸易的信息，其意义不低于石雕。', '柔软材料很少能长期保存，因此每一块残片都能补足日常生活史。', '找经纬密度、色线交界与磨损；避免把现代复原色当原状。', ['src-nmec'], 'nmec-textile'),
    highlight(nmecSlug, 'nmec-coptic', '科普特织物：图像在衣料上迁徙', '晚期古代', '纺织主题', '圆章、人物和植物纹样把地中海图像传统带入衣饰与室内织物。', '它把宗教、身份和跨文化交流放回可穿戴的日常媒介。', '留意图像边框怎样适应织物结构，以及不同色线的层次。', ['src-nmec'], 'nmec-textile'),
    highlight(nmecSlug, 'nmec-islamic-textile', '伊斯兰纺织：书写成为建筑尺度', '伊斯兰时期', '纺织与宗教工艺线索', '大型帷幕与带状书写把纺织技术、赞助制度和宗教空间联结起来。', '书法不仅是可读文字，也是控制尺度、节奏与观看距离的设计。', '先远看文字带的整体节奏，再近看针脚、金属线和修补。', ['src-nmec'], 'nmec-textile'),
    highlight(nmecSlug, 'nmec-mummies-parade', '从迁藏到新叙事', '2021 年迁藏 / 古代遗存', '皇家木乃伊展厅前置语境', '皇家木乃伊迁入 NMEC 的事件本身，改变了公众观看这些遗存的仪式与媒介环境。', '现代博物馆并不是中性的容器；运输、保存和展示方式也构成对象的新历史。', '进入展厅前先阅读馆方对保存与展示环境的说明。', ['src-nmec-mummies'], 'nmec-mummies'),
    highlight(nmecSlug, 'nmec-mummies', '皇家木乃伊：先看人，再看王名', '新王国等时期', '皇家木乃伊展厅', '展陈应同时理解个体身体、木乃伊制作、王室葬祭和现代科学研究。', '只把遗存当“名人面孔”会抹去死亡伦理和保存工作的复杂性。', '降低说话音量，先读墓葬迁移与身份判断证据，再观察包裹和保存差异。', ['src-nmec-mummies'], 'nmec-mummies'),
    highlight(nmecSlug, 'nmec-fustat', '福斯塔特：博物馆之外的城市层', '早期伊斯兰时期至今', '场馆外部与周边', '博物馆位于福斯塔特历史地景，而不是脱离城市的一座孤立新馆。', '场址把古代文明叙事连接到开罗持续生长的城市史。', '从外部辨认场馆、湖面与历史城区的关系，但不要把景观水体误作古代原貌。', ['src-nmec'], 'nmec-dye'),
    highlight(nmecSlug, 'nmec-living-heritage', '活态传统：文明仍在生产', '近现代', '主展厅末段', '工艺、服饰、音乐和日常实践把“文明”从古物转回仍在变化的社会。', '它防止参观在法老时代戛然而止，也让古代材料技术与今天形成连续问题。', '找一种延续至今的材料或动作，并比较其用途而非只找外形相似。', ['src-nmec-main'], 'nmec-main'),
  ],
  sequence: [
    { nodeId: 'nmec-main', title: '01｜用时间轴搭骨架', body: '先走主展厅一轮，选择农业、书写、信仰或工艺作为贯穿主题。' },
    { nodeId: 'nmec-textile', title: '02｜从硬质纪念物转向材料', body: '用纺织与工艺观察日常生活、劳动和跨文化交流。' },
    { nodeId: 'nmec-mummies', title: '03｜最后进入皇家木乃伊展厅', body: '保留充足精力，先读人物生平与迁藏经历，再慢慢观察；交谈时保持低声。' },
    { nodeId: 'nmec-dye', title: '04｜离馆前回到福斯塔特', body: '在外部重新理解博物馆与开罗历史地景的关系。' },
  ],
  practical: ['现有行程草表预留下午 1.5–2 小时，门票尚未确认；若沿用这个时段，建议优先主展厅与皇家木乃伊厅，想细看纺织等专题可延长停留。', '开放时间、临展、摄影和皇家木乃伊展厅规则可能变化；出发前查看 NMEC 官方页面。', '皇家木乃伊展陈涉及人体遗存；遵守现场摄影、音量与停留规则。', '展区关系示意，实际通行以现场指引为准。'],
  sourceIds: nmecSources, tags: ['文明通史', '皇家木乃伊', '纺织', '福斯塔特'],
};

const gizaSlug = 'giza-plateau';
const gizaSources = ['src-egypt-giza', 'src-egypt-khufu', 'src-egypt-khafre', 'src-egypt-menkaure', 'src-egypt-sphinx', 'src-digital-giza', 'src-unesco-memphis'];
const gizaNodes = [
  node(gizaSlug, 'giza-khufu', '胡夫金字塔', 'pyramid', -2.7, -2.1, '吉萨三座主金字塔中最大者。', ['src-egypt-khufu', 'src-digital-giza'], 1),
  node(gizaSlug, 'giza-khafre', '哈夫拉金字塔', 'pyramid', 0, -.2, '位于高地中部，顶部仍保留部分外包石。', ['src-egypt-khafre', 'src-digital-giza'], .9),
  node(gizaSlug, 'giza-menkaure', '孟卡拉金字塔', 'pyramid', 2.7, 2.1, '三座主金字塔中最小者。', ['src-egypt-menkaure', 'src-digital-giza'], .58),
  node(gizaSlug, 'giza-sphinx', '大狮身人面像', 'statue', 1.45, -2.95, '以吉萨石灰岩基岩雕出的巨像。', ['src-egypt-sphinx', 'src-digital-giza'], .42),
  node(gizaSlug, 'giza-valley-temple', '哈夫拉河谷神庙', 'temple', .65, -3.2, '哈夫拉复合体的低地石构神庙；与狮身人面像是两个独立地点。', ['src-egypt-khafre', 'src-digital-giza'], .5),
  node(gizaSlug, 'giza-causeway', '哈夫拉上升甬道', 'colonnade', .25, -1.8, '连接高地葬祭建筑与低地河谷区域的复合体构件。', ['src-egypt-khafre', 'src-digital-giza'], .45),
  node(gizaSlug, 'giza-queens', '附属与王后金字塔', 'pyramid', 3.3, 2.1, '提醒观看者把王陵理解为成组的制度空间。', ['src-egypt-giza', 'src-digital-giza'], .3),
];

const giza: CulturalGuide = {
  slug: gizaSlug, title: '吉萨金字塔群', originalTitle: 'Giza Plateau', city: '吉萨', region: '吉萨高地', category: '考古遗址', tier: 'major', itemIds: ['visit-giza-plateau'], coordinates: { lat: 29.9792, lng: 31.1342 },
  hero: guideCover(gizaSlug), deck: '把金字塔、神庙、甬道、墓园与低地一起读成第四王朝王室葬祭复合体。',
  overview: '吉萨不是三座孤立的巨大几何体，而是一组由主金字塔、王后小金字塔、葬祭庙、河谷神庙、上升甬道与墓园共同构成的亡者城市。现场先建立体量与地形，再沿每个王陵复合体的关系观察，才能理解王权形象如何被建筑、材料和观看距离共同塑造。',
  orientation: [
    { title: '先分清高度与观看错觉', body: '胡夫金字塔最大；哈夫拉金字塔因地势更高且顶部保留外包石，现场经常显得更高。' },
    { title: '塔体只是复合体的核心', body: '把视线移向小金字塔、神庙和甬道；这些附属构件说明仪式、埋葬与场地组织。' },
    { title: '考古总平面不是游客导航', body: '下方保留经过目视核对的吉萨高原考古总平面，用于阅读遗址构成与相对位置；它不表示当日入口、车辆动线或步行许可边界。' },
  ],
  visitChapters: visitChaptersBySlug[gizaSlug],
  spatial: reviewedSpatial(gizaSlug, gizaNodes),
  highlights: [
    highlight(gizaSlug, 'giza-khufu-card', '胡夫金字塔：消失的光洁表面', '第四王朝，约公元前 26 世纪', '高地北部', '今天所见粗粝退台主要是内部石芯；塔体原有高质量石灰岩外包层。', '它让建筑从“巨石堆叠”变成精确处理表面的国家工程。', '比较基部残留外包石、石芯层次与棱线，不要只从正面判断坡度。', gizaSources, 'giza-khufu'),
    highlight(gizaSlug, 'giza-khafre-card', '哈夫拉金字塔：顶部外包石与高地错觉', '第四王朝', '高地中部', '塔体略小于胡夫金字塔，但地势与顶部包层改变了观看判断。', '尺度、表皮保存和视点共同构成王权形象。', '先找顶部光滑包层与粗糙石芯的界线，再退远比较基座地势。', gizaSources, 'giza-khafre'),
    highlight(gizaSlug, 'giza-menkaure-card', '孟卡拉金字塔：较小主塔与成组建筑', '第四王朝', '高地西南部', '较小主塔旁的附属建筑让复合体的家族与仪式结构更容易被看见。', '它打破“只看三座主塔”的缩略叙事。', '留意不同石材、未完成表面和相邻小金字塔的排列。', gizaSources, 'giza-menkaure'),
    highlight(gizaSlug, 'giza-sphinx-card', '大狮身人面像：基岩形成的守护形象', '通常归于哈夫拉时期', '高地东南低地', '巨像直接从当地石灰岩基岩雕出，位于高地向低地过渡的区域。', '它把王者形象、地质材料和复合体入口语境联系起来。', '比较头部与狮身比例、岩层风化，以及不同视点下与金字塔的叠合。', gizaSources, 'giza-sphinx'),
    highlight(gizaSlug, 'giza-valley-card', '哈夫拉河谷神庙：材料组织空间', '第四王朝', '狮身人面像旁的独立神庙地点', '巨型石灰岩结构、花岗岩包覆与浅色地面构成强烈材料对比。', '河谷神庙说明王陵仪式从低地开始，金字塔不是孤立终点。', '观察墙面、地面和柱位之间的接缝与反光；不要越过围挡。', ['src-egypt-khafre', 'src-digital-giza'], 'giza-valley-temple'),
    highlight(gizaSlug, 'giza-causeway-card', '上升甬道：把高地与河谷连成系统', '第四王朝', '哈夫拉复合体', '连接构件把低地神庙与高处葬祭空间组织在同一轴线上。', '它把地形变化转化为仪式顺序，而不只是交通通道。', '从远处辨认高差与延伸方向；地图不承诺该线今天可连续步行。', ['src-egypt-khafre', 'src-digital-giza'], 'giza-causeway'),
    highlight(gizaSlug, 'giza-queens-card', '王后与附属金字塔：主角之外的制度', '第四王朝', '主金字塔周边', '规模较小的附属金字塔与墓园揭示王室家庭、祭祀和行政组织。', '吉萨的历史由许多身份和劳动共同构成，不只是三位国王。', '比较小塔的尺度与朝向，同时留意周围墓葬密度。', ['src-egypt-giza', 'src-digital-giza'], 'giza-queens'),
    highlight(gizaSlug, 'giza-panorama-card', '全景视点：重建三组关系', '第四王朝至现代地景', '高地远眺', '远景最适合比较三座主塔的尺度、地势和成组关系。', '它把局部体验重新拼回场地整体，也暴露照片压缩距离的误导。', '移动几步观察塔体重叠如何变化，不把经典照片角度当唯一真相。', gizaSources, 'giza-khafre'),
  ],
  sequence: [
    { nodeId: 'giza-khufu', title: '01｜用胡夫建立尺度', body: '先看最大塔体与基部石块，辨认石芯和外包层。' },
    { nodeId: 'giza-khafre', title: '02｜用哈夫拉校正错觉', body: '比较地势、顶部包层与远近透视。' },
    { nodeId: 'giza-causeway', title: '03｜沿复合体关系转向低地', body: '把甬道、河谷神庙与狮身人面像作为独立但相关的地点阅读。' },
    { nodeId: 'giza-menkaure', title: '04｜从孟卡拉看附属建筑', body: '以较小主塔和王后金字塔收束复合体概念。' },
  ],
  practical: ['草表只写 08:00 或 08:30 出发，未提供门票、入内项目或园区交通凭证。', '官方不同页面对区域开放时间与单项票范围的表达可能不同；到访前通过官方售票入口复核。', '金字塔内部、个别墓葬和区域票是不同产品，不在无票据时承诺包含。', '地图不绘制未核实入口、摆渡路线或连续步行线；到场以官方标识为准。'],
  sourceIds: gizaSources, tags: ['第四王朝', '金字塔', '王陵复合体', '相对 3D'],
};

const gemSlug = 'grand-egyptian-museum';
const gemSources = ['src-gem', 'src-gem-map', 'src-gem-tickets', 'src-gem-experience'];
const gemNodes = [
  node(gemSlug, 'gem-grand-hall', '大堂', 'hall', -2.2, 1.2, '拉美西斯二世巨像与迎宾空间。', gemSources),
  node(gemSlug, 'gem-staircase', '大楼梯', 'colonnade', -.7, .1, '沿高差布置大型雕塑的核心序列。', gemSources),
  node(gemSlug, 'gem-main-galleries', '十二个主展厅', 'hall', 1.2, -.7, '按时代与社会、王权、信仰主题组织。', gemSources),
  node(gemSlug, 'gem-tut', '图坦卡蒙展厅', 'hall', 2.6, .6, '集中展示图坦卡蒙墓葬相关收藏。', gemSources),
  node(gemSlug, 'gem-boats', '胡夫船博物馆', 'hall', 1.1, 1.8, '保存与解释胡夫船的独立场馆部分。', gemSources),
];

const gem: CulturalGuide = {
  slug: gemSlug, title: '大埃及博物馆', originalTitle: 'Grand Egyptian Museum', city: '吉萨', region: '吉萨门户', category: '博物馆', tier: 'major', itemIds: ['visit-gem'], coordinates: { lat: 29.9946, lng: 31.1197 },
  hero: guideCover(gemSlug), deck: '用大堂、大楼梯、十二个主展厅、图坦卡蒙展厅与胡夫船博物馆五段结构，避免在巨量展品中失去方向。',
  overview: 'GEM 的参观难点不是“有没有明星文物”，而是如何在建筑尺度、跨时期主展厅与大型专题收藏之间分配注意力。官方信息将开放体验明确分为大堂、大楼梯、十二个主展厅、图坦卡蒙展厅和胡夫船博物馆等部分；本页按这一公开结构编排，不把未经核实的展柜位置画成楼层图。',
  orientation: [
    { title: '先用建筑建立尺度', body: '大堂与大楼梯不是等待区；巨像、采光与向吉萨方向的视觉轴线已经开始叙事。' },
    { title: '十二展厅采用交叉矩阵', body: '主展厅把古王国、中王国、新王国等时期与社会、王权、信仰主题交叉组织；先选一条主线再补另一条。' },
    { title: '专题馆要预留独立时间', body: '图坦卡蒙与胡夫船不是“顺路看一眼”；如果下午时段有限，应在二者与主展厅深看之间做取舍。' },
  ],
  visitChapters: visitChaptersBySlug[gemSlug],
  spatial: reviewedSpatial(gemSlug, gemNodes),
  highlights: [
    highlight(gemSlug, 'gem-ramses', '拉美西斯二世巨像：迎宾也是再语境化', '第十九王朝 / 当代迁置', '大堂', '巨像在现代大厅中获得新的观看距离与光线，身份从原建筑语境转向国家博物馆入口。', '迁置不是中性动作；尺度、基座与背景决定今天如何理解王权。', '先绕行比较正面与侧面，再看基座说明中的出土地与迁移史。', gemSources, 'gem-grand-hall'),
    highlight(gemSlug, 'gem-stair', '大楼梯：把雕塑变成时间剖面', '多时期', '大楼梯', '大型雕塑沿高差连续出现，适合比较姿态、王名与神祇组合的长期变化。', '楼梯把移动身体变成时间阅读工具，而不只是垂直交通。', '每上一段选择一件作品，比较背柱、冠饰、步姿与观看高度。', gemSources, 'gem-staircase'),
    highlight(gemSlug, 'gem-old-kingdom', '古王国：国家机器与理想身体', '约公元前 2686–2181 年', '主展厅古王国章节', '王像、官员像和墓葬器物共同呈现集中资源、书写行政与来世秩序。', '金字塔时代不只等于建筑；对象揭示支撑巨型工程的社会与图像制度。', '比较王者与非王者雕像的比例、材质和正面性。', gemSources, 'gem-main-galleries'),
    highlight(gemSlug, 'gem-middle-kingdom', '中王国：权力形象的另一种紧张', '约公元前 2055–1650 年', '主展厅中王国章节', '中王国王像常让理想化与更强烈的面部特征同时存在。', '它提醒“埃及风格不变”是错觉；相似程式内部存在政治选择。', '对比眼部、面颊与嘴角处理，再看铭文如何确认身份。', gemSources, 'gem-main-galleries'),
    highlight(gemSlug, 'gem-new-kingdom', '新王国：从埃赫那吞头像看王像变化', '新王国第十八王朝', '大楼梯／新王国主题', '先在大楼梯观察埃赫那吞头像，再把它与其他时期王像并置比较。修长的脸、眼部轮廓与嘴唇处理，提醒我们法老肖像并非千年不变。', '这件头像让时代和统治者之间的图像差异变得具体，不必只靠王名与年代表区分新王国。', '看额部、长脸、嘴唇和下颌的连续曲线，再比较邻近王像如何塑造力量与威严。', gemSources, 'gem-staircase'),
    highlight(gemSlug, 'gem-late-period', '晚期石棺：把保护图像刻进硬石', '约公元前 664–332 年', '主展厅晚期章节', 'Nesptah 人形石棺以棺盖上的面部和密集图文表达对亡者的保护。硬石表面既塑造身体轮廓，也承载成行铭文和神祇场景。', '石棺不是单纯的容器：图像、文字与材料共同参与葬祭，也让长期沿用的视觉传统得到新的组织。', '先看棺盖面部与交叠的双手，再沿长条铭文和侧面的神祇图像观察分区；最后读馆签核对棺主与年代。', gemSources, 'gem-main-galleries'),
    highlight(gemSlug, 'gem-greco-roman', '希腊统治下的埃及：捐赠石碑仍使用传统语言', '托勒密时期', '主展厅后期章节', '托勒密一世相关捐赠石碑以埃及式神祇图像和象形文字组织画面。政权变化没有让沿用已久的祭祀图像立即消失。', '这件石碑把“文化交汇”从笼统风格变成具体问题：新的统治者如何通过当地宗教与文字表达权威。', '先分辨上方图像区与下方文字区，再观察人物姿态、神祇冠饰和成行铭文如何安排观看次序。', gemSources, 'gem-main-galleries'),
    highlight(gemSlug, 'gem-tut-mask', '图坦卡蒙：从墓室组合而非单件出发', '第十八王朝', '图坦卡蒙展厅', '著名对象应放回成组墓葬设备、身体保护和来世仪式中阅读。', '完整组合能揭示材料层级、工坊协作与年轻国王死后的政治工程。', '先看对象类型之间的关系，再把注意力转向接合、镶嵌和使用痕迹。', gemSources, 'gem-tut'),
    highlight(gemSlug, 'gem-khufu-boat', '胡夫船：木材、绳索与保存工程', '第四王朝 / 现代保存', '胡夫船博物馆', '船体把古代木工、运输、仪式解释与现代迁藏保存集中在一个对象上。', '它用脆弱的有机材料补足金字塔石构叙事。', '观察构件连接而非只看船形；再读发掘、重组和迁移时间线。', gemSources, 'gem-boats'),
    highlight(gemSlug, 'gem-gallery-system', '十二展厅：用主题横切年代', '史前至希腊罗马时期', '主展厅', '社会、王权与信仰等主题让相邻时期可以横向比较。', '这种组织避免参观退化成只背王朝顺序。', '选择一个重复出现的对象类型，连续比较至少三个时期。', gemSources, 'gem-main-galleries'),
    highlight(gemSlug, 'gem-landscape', '建筑与吉萨：视线也是策展', '当代博物馆', '公共空间与景观', '建筑通过尺度、材料与对吉萨地景的视线，把收藏与遗址放在同一文化轴线上。', '博物馆自身参与塑造“古埃及如何被今天观看”。', '寻找框景与反射；区分真实遗址方向和室内图形暗示。', gemSources, 'gem-grand-hall'),
    highlight(gemSlug, 'gem-choice', '时间预算：完整不是走遍每个展柜', '现场方法', '全馆', '面对超大馆，完整体验应由结构清晰和重点深入组成，而不是疲惫地扫完。', '主动取舍能保留理解与记忆，也为返程交通留出缓冲。', '入馆时决定主展厅深看主题，并明确图坦卡蒙与胡夫船的优先级。', gemSources, 'gem-grand-hall'),
  ],
  sequence: [
    { nodeId: 'gem-grand-hall', title: '01｜大堂校准尺度', body: '围绕拉美西斯二世巨像建立迁置与观看语境。' },
    { nodeId: 'gem-staircase', title: '02｜大楼梯做跨时期比较', body: '每段只选一件作品，避免被大型雕塑数量淹没。' },
    { nodeId: 'gem-main-galleries', title: '03｜主展厅选一条主题主线', body: '沿社会、王权或信仰穿过多个时期，再补另一条线。' },
    { nodeId: 'gem-tut', title: '04｜专题收藏深看', body: '在图坦卡蒙与胡夫船之间按时间和体力明确优先级。' },
  ],
  practical: ['草表安排在吉萨高地之后的下午，尚无门票；两处大型景点连看会显著消耗体力。', '2026-09-15 核对时，官方票务页区分普通日与周三、周六延长时段，并注明闭馆前一小时停止入场；临行前必须再次核对。', '图坦卡蒙展厅、主展厅和胡夫船博物馆的票种或入场组合以购票页为准。', '馆内动线、电梯和临时关闭以官方地图与现场导视为准；本页不替代楼层图。'],
  sourceIds: gemSources, tags: ['图坦卡蒙', '胡夫船', '十二展厅', '大楼梯'],
};

const citadelSlug = 'cairo-citadel';
const citadelSources = ['src-citadel', 'src-muhammad-ali', 'src-historic-cairo'];
const citadelNodes = [
  node(citadelSlug, 'citadel-fort', '城堡高地', 'gate', -2.2, 1.2, '中世纪以来持续改造的防御与统治中心。', citadelSources),
  node(citadelSlug, 'citadel-mosque-exterior', '穆罕默德·阿里清真寺外观', 'temple', -.2, .1, '中央穹顶、半穹顶与双尖塔构成可辨识轮廓。', ['src-muhammad-ali']),
  node(citadelSlug, 'citadel-court', '庭院与钟塔', 'hall', 1.7, -1, '礼拜大厅前的开放庭院与后设钟塔。', ['src-muhammad-ali']),
  node(citadelSlug, 'citadel-prayer', '礼拜大厅', 'hall', 2.5, .8, '中央穹顶统摄四个半穹顶和角部小穹顶。', ['src-muhammad-ali']),
  node(citadelSlug, 'citadel-view', '城市眺望', 'district', -.8, 2.2, '从高地理解开罗城市层叠；不是考古平面的一部分。', citadelSources),
];

const citadel: CulturalGuide = {
  slug: citadelSlug, title: '开罗城堡与穆罕默德·阿里清真寺', originalTitle: 'Cairo Citadel & Muhammad Ali Mosque', city: '开罗', region: '穆卡塔姆高地', category: '考古遗址', tier: 'standard', itemIds: ['visit-citadel'], coordinates: { lat: 30.0299, lng: 31.2617 },
  hero: guideCover(citadelSlug), deck: '先辨认防御高地，再用穹顶、庭院与双尖塔理解十九世纪奥斯曼式国家形象。',
  overview: '开罗城堡不是单一时代的纪念物，而是从萨拉丁时期起反复改造的防御、军政与宗教空间。穆罕默德·阿里清真寺属于其中较晚的一层；它以奥斯曼式中央穹顶结构和高耸双尖塔重新定义了开罗天际线。',
  orientation: [
    { title: '先分开城堡与清真寺', body: '城堡是跨世纪复合体；清真寺是其中一座十九世纪建筑，不能用后者代替整个场地历史。' },
    { title: '外观轮廓来自结构', body: '中央穹顶、四个半穹顶、角部小穹顶和双尖塔共同构成可识别体量；3D 只表达这种层级，不复制测量尺寸。' },
    { title: '尊重仍具宗教意义的空间', body: '衣着、脱鞋、音量和摄影以现场规则为准；建筑导览不凌驾于礼拜活动。' },
  ],
  visitChapters: visitChaptersBySlug[citadelSlug],
  spatial: reviewedSpatial(citadelSlug, citadelNodes),
  highlights: [
    highlight(citadelSlug, 'citadel-layer', '高地要塞：权力首先选择地形', '十二世纪起', '城堡外部与高地边缘', '高位场址同时服务防御、监视和国家权力的可见性。', '地形解释了为什么多个统治时期都继续占用并改造这里。', '先观察坡度、城墙与城市的高差，再进入单体建筑。', citadelSources, 'citadel-fort'),
    highlight(citadelSlug, 'citadel-silhouette', '清真寺外观：十九世纪重写天际线', '十九世纪', '穆罕默德·阿里清真寺外部', '大型中央穹顶与双尖塔使用奥斯曼帝国清真寺的视觉语汇。', '它让新政权把现代国家工程嵌入中世纪城堡。', '从远处先读穹顶层级，再近看立面石材与窗洞。', ['src-muhammad-ali'], 'citadel-mosque-exterior'),
    highlight(citadelSlug, 'citadel-dome', '中央穹顶：空间由上方统摄', '十九世纪', '礼拜大厅', '中央穹顶通过半穹顶向四周扩展，形成集中式礼拜空间。', '结构、声学与光线共同营造统一中心，不只是表面装饰。', '站在允许区域观察穹顶如何通过半穹顶过渡到墙体。', ['src-muhammad-ali'], 'citadel-prayer'),
    highlight(citadelSlug, 'citadel-court-card', '庭院与钟塔：跨国礼物进入宗教建筑', '十九世纪', '开放庭院', '庭院把进入节奏从城堡的开阔转向礼拜大厅；钟塔是后来的政治与外交层。', '附加构件提醒我们建筑并非一次完成，而是持续累积象征。', '比较庭院尺度、洗礼设施与钟塔在轴线中的位置。', ['src-muhammad-ali'], 'citadel-court'),
    highlight(citadelSlug, 'citadel-minaret', '双尖塔：细长比例制造远距离识别', '十九世纪', '清真寺外部', '两座高尖塔与圆顶群形成垂直与水平体量的对比。', '从城市远处即可识别的轮廓把宗教建筑转为政权标志。', '不要只拍全景；找尖塔、主穹顶与半穹顶的比例关系。', ['src-muhammad-ali'], 'citadel-mosque-exterior'),
    highlight(citadelSlug, 'citadel-material', '“雪花石膏清真寺”：名称与材料', '十九世纪', '外墙与室内下部', '常用别称来自大量浅色石材饰面，但应区分通俗名称与具体石材判断。', '材料名称会影响公众想象；现场应以官方说明和可见加工为准。', '观察板材接缝、磨光与修补，不凭颜色断定全部材质。', ['src-muhammad-ali'], 'citadel-prayer'),
    highlight(citadelSlug, 'citadel-panorama', '眺望开罗：把纪念物放回城市', '当代城市视野', '城堡观景区', '高地视野让不同时代的穹顶、尖塔和城市密度同时出现。', '它揭示“伊斯兰开罗”不是冻结的古城，而是持续生活的都市层。', '用近、中、远三层辨认城堡、历史城区与现代扩张。', citadelSources, 'citadel-view'),
  ],
  sequence: [{ nodeId: 'citadel-fort', title: '01｜从城墙与高差开始', body: '先理解场址为何成为长期权力中心。' }, { nodeId: 'citadel-mosque-exterior', title: '02｜绕看穹顶与双尖塔', body: '从整体轮廓进入细部，而不是一开始只拍正面。' }, { nodeId: 'citadel-court', title: '03｜经过庭院调整节奏', body: '观察开放空间、钟塔和礼拜大厅入口。' }, { nodeId: 'citadel-prayer', title: '04｜进入穹顶空间', body: '服从礼拜与现场管理，观察结构和光线。' }, { nodeId: 'citadel-view', title: '05｜用城市眺望收束', body: '把建筑放回开罗长时段城市层。' }],
  practical: ['草表写 09:00 出发并安排随后前往机场，具体离馆与包车时间未确认。', '官方页面核对时列出城堡范围内开放与票务信息；门票覆盖范围仍以购票页和现场为准。', '进入清真寺应按现场要求着装、脱鞋并保持安静；礼拜时段可能限制参观。', '城市眺望受天气、扬尘与开放区域影响；本页不承诺固定拍摄点。'], sourceIds: citadelSources, tags: ['开罗天际线', '奥斯曼式建筑', '城堡', '穹顶'],
};

const khanSlug = 'khan-el-khalili';
const khanSources = ['src-historic-cairo'];
const khanNodes = [
  node(khanSlug, 'khan-threshold', '历史城区入口语境', 'gate', -2.2, .7, '从城市主路进入更细密街巷的转折。', khanSources),
  node(khanSlug, 'khan-spine', '市场街巷', 'district', -.5, 0, '商业、手工业与游人流线重叠的街巷网络。', khanSources),
  node(khanSlug, 'khan-wikala', '商旅建筑线索', 'hall', 1.5, -1, '以维卡拉等建筑类型理解历史商业基础设施。', khanSources),
  node(khanSlug, 'khan-edge', '清真寺与公共建筑边界', 'temple', 2.2, 1.2, '市场和宗教、教育、供水建筑相互嵌合。', khanSources),
];

const khan: CulturalGuide = {
  slug: khanSlug, title: '哈利利市场与历史开罗街巷', originalTitle: 'Khan el-Khalili & Historic Cairo', city: '开罗', region: '历史开罗', category: '历史城区', tier: 'place', itemIds: ['visit-khan-el-khalili'], coordinates: { lat: 30.0477, lng: 31.2624 },
  hero: guideCover(khanSlug), deck: '把“逛市场”升级为城市阅读：街巷尺度、商旅建筑、金属工艺、宗教边界与当代旅游经济同时存在。',
  overview: '哈利利不是一条封闭的购物街，而是历史开罗密集城市组织中的商业节点。可见空间不断在巷道、店面、院落式商旅建筑与宗教公共建筑之间切换；最有价值的观察是理解商业如何依赖城市结构，而不是寻找一个被想象为“纯古代”的市场。',
  orientation: [
    { title: '这里是城区，不是单一景区', body: '居民、店员、礼拜者和游客共享空间；导览不能把生活街区当布景。' },
    { title: '街区图不是夜游路线', body: '摊位、封路、人流和车辆会变化；本页只显示 UNESCO 图件支持的街区骨架，不声称某个入口或连续步行线始终可用。' },
    { title: '购买与观看分开', body: '先辨认工艺、材料和建筑类型，再决定消费；价格、真伪和退换规则需现场独立判断。' },
  ],
  visitChapters: visitChaptersBySlug[khanSlug],
  spatial: reviewedSpatial(khanSlug, khanNodes),
  highlights: [
    highlight(khanSlug, 'khan-grain', '街巷尺度：视线不断被折叠', '中世纪城市肌理至今', '市场街巷', '狭窄、弯折与遮棚让观看距离比纪念性大道更短。', '这种尺度让店铺展示、行走与社交紧密叠合。', '观察转角如何突然打开视野，同时把手机收好并注意脚下。', khanSources, 'khan-spine'),
    highlight(khanSlug, 'khan-lamps', '灯具与金属：当代商品也有工艺线索', '当代生产 / 历史工艺传统', '店铺界面', '穿孔、锤揲和焊接形成光影，但商品年代与生产地不可凭外观判断。', '区分“传统视觉语言”和“古董”能避免浪漫化与误购。', '看接缝、锤痕和材料厚度；购买前明确材质与退换。', khanSources, 'khan-spine'),
    highlight(khanSlug, 'khan-gate', '门与边界：市场嵌在更大城区', '历史开罗多时期', '街巷转折与门楼', '门洞、立面和道路收放把商业片区与城市其他功能连接。', '边界让“市场”从一个名字变成可读的城市结构。', '回头看进入前后街宽、噪声和光线的变化。', khanSources, 'khan-threshold'),
    highlight(khanSlug, 'khan-wikala-card', '维卡拉：贸易需要建筑基础设施', '马穆鲁克至奥斯曼时期类型', '商旅建筑线索', '围绕院落组织的商旅建筑曾容纳货物、交易与住宿。', '它说明市场繁荣依赖仓储、交通和信用网络，而不只是摊位。', '若开放参观，观察院落、入口控制和上下层功能差异。', khanSources, 'khan-wikala'),
    highlight(khanSlug, 'khan-sacred-edge', '宗教空间边界：先尊重再观看', '持续使用的宗教城区', '清真寺及周边', '商业活动与礼拜空间相邻，音量、衣着和摄影需要随边界变化。', '城市遗产的真实性来自持续使用，不是排除当代生活。', '留意鞋履、门槛和人流信号；不跟拍礼拜者。', khanSources, 'khan-edge'),
    highlight(khanSlug, 'khan-door', '门面细部：修复、磨损与再利用', '多时期', '历史建筑立面', '木门、石框和金属构件常同时包含原构件、修复与现代使用痕迹。', '不把所有旧感都认作同一年代，才能看见街区的持续维护。', '比较石材风化、现代固定件和店招如何共同占用立面。', khanSources, 'khan-spine'),
  ],
  sequence: [{ nodeId: 'khan-threshold', title: '01｜先记录进入转折', body: '从街宽、声音和光线判断自己进入了怎样的城市肌理。' }, { nodeId: 'khan-spine', title: '02｜沿主街观察工艺', body: '先看制作与材料，再决定购物。' }, { nodeId: 'khan-wikala', title: '03｜寻找商旅建筑线索', body: '理解贸易背后的院落、仓储与住宿基础设施。' }, { nodeId: 'khan-edge', title: '04｜在宗教边界放慢', body: '按现场规则调整音量、衣着和摄影。' }],
  practical: ['草表安排在抵达开罗当晚，航班、入境和入住耗时未确认；疲劳时应缩短停留。', '这是开放街区，商户营业、道路和人流实时变化；不要依赖离线索引作为回酒店导航。', '贵重物品贴身保管，议价前确认币种、总价和商品；导览不提供商户背书。', '宗教空间的开放与摄影以现场规定为准。'], sourceIds: khanSources, tags: ['历史开罗', '市场', '工艺', '城市阅读'],
};

const abuSlug = 'abu-simbel';
const abuSources = ['src-abu-simbel', 'src-unesco-nubian', 'src-aswan-guide'];
const abuNodes = [
  node(abuSlug, 'abu-great', '大神庙立面', 'temple', -2.2, .2, '四尊拉美西斯二世坐像形成岩凿立面。', abuSources),
  node(abuSlug, 'abu-axis', '大神庙内部轴线', 'hall', -.5, -.3, '柱厅、次厅与至圣所按轴向深入山体。', abuSources),
  node(abuSlug, 'abu-sanctuary', '至圣所', 'sanctuary', 1.3, -.3, '四尊坐像与特定日期的太阳照射现象。', abuSources),
  node(abuSlug, 'abu-small', '小神庙', 'temple', -1.4, 1.9, '献给哈托尔与妮菲尔塔丽的独立岩凿神庙。', abuSources),
  node(abuSlug, 'abu-relocation', '迁移地景', 'district', 2.4, 1.4, '1960 年代国际抢救工程塑造的现址。', abuSources),
];

const abu: CulturalGuide = {
  slug: abuSlug, title: '阿布辛贝神庙', originalTitle: 'Abu Simbel', city: '阿布辛贝', region: '努比亚 / 纳赛尔湖西岸', category: '考古遗址', tier: 'major', itemIds: ['visit-abu-simbel'], coordinates: { lat: 22.3372, lng: 31.6258 },
  hero: guideCover(abuSlug), deck: '两座岩凿神庙、一次世界级迁移工程：既看拉美西斯二世的王权图像，也看现代遗产保护如何改变场址。',
  overview: '阿布辛贝由大神庙与北侧小神庙构成。大神庙以四尊拉美西斯二世坐像统治立面，并沿柱厅深入至圣所；小神庙献给哈托尔与妮菲尔塔丽，其立面中王后与国王巨像同等尺度极为醒目。今天的山体与位置来自 1960 年代国际抢救迁移，古代建筑与现代保护必须一起理解。',
  orientation: [{ title: '两座神庙，不是一座', body: '先分清大神庙的王权—神化轴线与小神庙的哈托尔—妮菲尔塔丽主题。' }, { title: '山体也是现代工程', body: '神庙被切割、迁移并在新地形中重组；现址不是未经改变的古代原位。' }, { title: '太阳照射不等于日常体验', body: '官方注明特定日期现象；普通到访不能承诺同样光线，也不应为了“对齐”忽略人流管理。' }],
  visitChapters: visitChaptersBySlug[abuSlug],
  spatial: reviewedSpatial(abuSlug, abuNodes),
  highlights: [
    highlight(abuSlug, 'abu-facade', '四尊坐像：把山体变成王者身体', '第十九王朝，约公元前 1264 年', '大神庙立面', '四尊拉美西斯二世坐像以重复和尺度控制到访者的第一印象。', '立面让自然岩壁成为国家权力和神化王权的媒介。', '比较四像的保存差异；一尊因古代地震倒塌，碎块仍在地面。', abuSources, 'abu-great'),
    highlight(abuSlug, 'abu-small-card', '小神庙：妮菲尔塔丽与国王同尺度', '第十九王朝', '小神庙立面', '王后巨像与国王接近同等尺度，是官方资料强调的罕见视觉选择。', '尺度在这里表达王后、哈托尔崇拜与王室形象的特殊关系。', '先数立面巨像，再比较冠饰、铭文和腿侧小像。', abuSources, 'abu-small'),
    highlight(abuSlug, 'abu-hall', '柱厅：站立王像引向深处', '第十九王朝', '大神庙主厅', '奥西里斯式站立王像沿主厅形成强烈轴向节奏。', '参观者的移动被重复身体和柱列组织，王权图像从立面延续到内部。', '看柱像朝向、天花高度变化与侧室开口。', abuSources, 'abu-axis'),
    highlight(abuSlug, 'abu-sanctuary-card', '至圣所：太阳、日期与四尊坐像', '古代轴线 / 当代观测', '大神庙最深处', '官方资料记载每年特定日期，阳光深入并照亮其中三尊坐像。', '建筑朝向、季节和神学在同一现象中汇合，但现址迁移也使它成为现代保护讨论的一部分。', '普通日期先观察轴线层层收窄；不要把宣传照片的光线当现场承诺。', abuSources, 'abu-sanctuary'),
    highlight(abuSlug, 'abu-relief', '战役浮雕：叙事不是现场录像', '第十九王朝', '大神庙内部', '战役场面以尺度、分区和重复组织胜利叙事。', '它展示王权如何把复杂历史压缩成秩序清晰的图像。', '辨认国王尺度、敌方队列与铭文区，而非把场面逐字当纪实。', abuSources, 'abu-axis'),
    highlight(abuSlug, 'abu-relocation-card', '迁移接缝：现代工程成为遗产史', '1960 年代', '现址山体与外部', '为避开水库淹没，两座神庙被分块搬迁并重组。', '保存让建筑继续存在，却也改变地形、材料连续性与真实性讨论。', '寻找展板中的切割、编号和重组过程；现场不触摸或寻找隐蔽接缝。', ['src-unesco-nubian', 'src-abu-simbel'], 'abu-relocation'),
    highlight(abuSlug, 'abu-landscape', '纳赛尔湖地景：威胁与新背景', '二十世纪形成', '神庙外部', '今天的湖面与古代努比亚地景不同，却解释了抢救工程为何发生。', '水利、迁移和世界遗产制度共同塑造现代观看。', '把相机从立面转向湖与人工山体，理解二者的时间差。', abuSources, 'abu-relocation'),
  ],
  sequence: [{ nodeId: 'abu-relocation', title: '01｜先看迁移地景', body: '在进入前确认自己面对的是古代神庙与现代重组山体。' }, { nodeId: 'abu-great', title: '02｜从大神庙立面建立尺度', body: '比较四尊坐像及倒塌碎块。' }, { nodeId: 'abu-axis', title: '03｜沿轴线进入内部', body: '关注柱像、浮雕与空间收窄。' }, { nodeId: 'abu-sanctuary', title: '04｜在至圣所理解光线叙事', body: '区分特定日期现象与普通到访。' }, { nodeId: 'abu-small', title: '05｜用小神庙重读王后形象', body: '比较巨像尺度和哈托尔主题。' }],
  practical: ['草表写凌晨 05:00 出发、约 15:30 返回阿斯旺，司机、车辆、门票和实际停留均未确认。', '官方页面在 2026-09-15 核对时列出 06:00–17:00，并对太阳照射日期另列票价；临行前复核。', '长途公路、安检、炎热与早起会显著影响体力；携带饮水、防晒并为返程留缓冲。', '太阳照射日人流与管理可能特殊；无正式订单时不要把观测写成保证。'], sourceIds: abuSources, tags: ['拉美西斯二世', '妮菲尔塔丽', '太阳照射', 'UNESCO 迁移'],
};

const komSlug = 'kom-ombo';
const komSources = ['src-kom-ombo', 'src-aswan-guide'];
const komNodes = [
  node(komSlug, 'kom-court', '前庭与柱廊', 'hall', -2.2, 0, '进入双重秩序前的共同空间。', komSources),
  node(komSlug, 'kom-harwer', '北侧 Harwer 轴线', 'temple', -.2, -1, '面向鹰神 Harwer 的北侧平行轴。', komSources),
  node(komSlug, 'kom-sobek', '南侧 Sobek 轴线', 'temple', -.2, 1, '面向鳄鱼神 Sobek 的南侧平行轴。', komSources),
  node(komSlug, 'kom-sanctuaries', '双至圣所', 'sanctuary', 2.2, 0, '两条轴线分别终止于神圣核心。', komSources),
  node(komSlug, 'kom-crocodile', '鳄鱼博物馆', 'museum', 1.5, 2.2, '用木乃伊化鳄鱼补足 Sobek 崇拜语境。', ['src-aswan-guide']),
];

const kom: CulturalGuide = {
  slug: komSlug, title: '康翁波神庙', originalTitle: 'Kom Ombo Temple', city: '康翁波', region: '尼罗河东岸', category: '考古遗址', tier: 'standard', itemIds: ['visit-kom-ombo'], coordinates: { lat: 24.4521, lng: 32.9281 },
  hero: guideCover(komSlug), deck: '整座神庙最关键的不是某一幅“医学浮雕”，而是两位神祇、两条平行轴线和双至圣所构成的对称制度。',
  overview: '现存康翁波神庙主要形成于希腊罗马时期，并同时献给鳄鱼神 Sobek 与鹰神 Harwer。双重奉献不是装饰主题，而是直接进入建筑：南北两条平行轴穿过柱厅，最终抵达两个至圣所。理解这一点后，历法、仪式和所谓“外科器械”浮雕才有正确语境。',
  orientation: [{ title: '左右不是复制，而是双重奉献', body: '官方资料明确南侧为 Sobek，北侧为 Harwer；先确认方向，再读两边浮雕。' }, { title: '医学图像需要谨慎', body: '官方称画面“被认为”表现外科器械；导览保留这种不确定措辞，不把它宣传成现代手术室。' }, { title: '博物馆补足动物崇拜', body: '鳄鱼博物馆用木乃伊化鳄鱼解释 Sobek 崇拜，若票务和时间允许应与神庙联看。' }],
  visitChapters: visitChaptersBySlug[komSlug],
  spatial: reviewedSpatial(komSlug, komNodes),
  highlights: [
    highlight(komSlug, 'kom-river', '临河神庙：场址与水神', '希腊罗马时期', '神庙外部', '神庙紧邻尼罗河，水、洪泛、航行与 Sobek 崇拜在环境上互相强化。', '宗教建筑的意义来自场址，不只是墙面图像。', '从安全区域比较河岸、台地与神庙基础的高差。', komSources, 'kom-court'),
    highlight(komSlug, 'kom-double', '双入口与双轴：建筑贯彻神学', '希腊罗马时期', '前庭至柱厅', '两条平行通道分别服务 Harwer 与 Sobek 的崇拜。', '少见的双重结构让对称成为宗教制度，而非单纯形式美。', '站在共同区域辨认两条轴线，确认南北后再前进。', komSources, 'kom-court'),
    highlight(komSlug, 'kom-deities', 'Sobek 与 Harwer：两组神祇家庭', '希腊罗马时期', '双轴浮雕', '两位主神各自与配偶、子嗣构成地方神学体系。', '神庙通过并置而不是抹平差异来组织多重崇拜。', '用冠饰与动物头辨认神祇，再看供奉者朝向哪一侧。', komSources, 'kom-harwer'),
    highlight(komSlug, 'kom-medical', '“外科器械”浮雕：先保留解释距离', '罗马时期，约公元 2 世纪', '墙面场景', '官方资料谨慎称一组图形“被认为”是外科器械。', '这提醒我们识别对象与解释用途是两层证据。', '先看图形与周围仪式场面，再阅读现场说明，不直接套现代名称。', ['src-kom-ombo'], 'kom-sobek'),
    highlight(komSlug, 'kom-nilometer', '水位与历法：神庙也管理时间', '古代至希腊罗马时期', '场地水文线索', '尼罗河水位、节日历法与农业周期共同塑造祭祀秩序。', '神庙知识与行政、环境观察并不分离。', '只在开放区域观察刻度与水井结构，不把任何圆井都认作尼罗尺。', komSources, 'kom-court'),
    highlight(komSlug, 'kom-crocodile-card', '木乃伊鳄鱼：危险动物成为神圣媒介', '古代 / 现代博物馆', '鳄鱼博物馆', '动物遗存让 Sobek 崇拜从抽象神名回到饲养、死亡与保存实践。', '它揭示人类如何用仪式处理对水域、繁殖与危险的敬畏。', '比较包裹、体型和展签来源；保持人体与动物遗存观看礼仪。', ['src-aswan-guide'], 'kom-crocodile'),
    highlight(komSlug, 'kom-columns', '柱头：重复中没有两根完全相同', '希腊罗马时期', '柱厅', '植物式柱头通过比例、层叠与彩绘残迹制造节奏。', '建筑秩序并非机械复制；工匠变化与保存差异都可见。', '选择相邻两根柱子，比较植物形、刻痕深浅和残色。', komSources, 'kom-harwer'),
  ],
  sequence: [{ nodeId: 'kom-court', title: '01｜在前庭确认双轴', body: '先辨认南北两条平行通道。' }, { nodeId: 'kom-harwer', title: '02｜先读 Harwer 北轴', body: '辨认鹰神与其神祇家庭。' }, { nodeId: 'kom-sobek', title: '03｜再读 Sobek 南轴', body: '比较对称结构中的不同图像。' }, { nodeId: 'kom-sanctuaries', title: '04｜在双至圣所收束', body: '理解建筑如何维持两套崇拜。' }, { nodeId: 'kom-crocodile', title: '05｜用鳄鱼博物馆补充', body: '若现场开放与票务允许，完成动物崇拜语境。' }],
  practical: ['10月5日行程同时包含康翁波、埃德富并前往卢克索，包车和停留时长未确认。', '官方页面 2026-09-15 核对时列出 07:00–21:00；票价与鳄鱼博物馆包含关系出发前复核。', '遗址临河且日晒强，注意补水与台阶；不越过围挡寻找尼罗尺或浮雕角度。', '若时间不足，优先双轴结构与鳄鱼博物馆，不要只停在“外科器械”一处。'], sourceIds: komSources, tags: ['Sobek', 'Harwer', '双轴神庙', '鳄鱼博物馆'],
};

const edfuSlug = 'edfu-temple';
const edfuSources = ['src-aswan-guide', 'src-edfu-official', 'src-edfu-plan'];
const edfuNodes = [
  node(edfuSlug, 'edfu-pylon', '第一塔门', 'gate', -2.6, 0, '巨型塔门与国王击敌场景构成入口。', edfuSources),
  node(edfuSlug, 'edfu-court', '露天庭院', 'hall', -1.1, 0, '围柱庭院连接入口与室内柱厅。', edfuSources),
  node(edfuSlug, 'edfu-hypostyle', 'D · 外柱厅', 'colonnade', .5, 0, '庭院之后的第一座柱厅，定位到原图 D，而不是把两座柱厅合并。', edfuSources),
  node(edfuSlug, 'edfu-inner-hypostyle', 'E · 内柱厅', 'colonnade', 0, 0, '第二座柱厅，十二个柱位与两侧服务空间。', edfuSources),
  node(edfuSlug, 'edfu-offerings', '供奉与前室', 'hall', 1.6, 0, '祭祀准备与更神圣空间之间的过渡。', edfuSources),
  node(edfuSlug, 'edfu-sanctuary', '至圣所', 'sanctuary', 2.7, 0, '神庙轴线最深处的神龛与环绕小室。', edfuSources),
  node(edfuSlug, 'edfu-entry', 'B · 塔门门道', 'gate', 0, 0, '历史平面与官方介绍共同支持的建筑入口，不是现代售票口。', edfuSources),
  node(edfuSlug, 'edfu-vestibule', 'G · 中央前室', 'hall', 0, 0, '供奉厅与至圣所之间的独立横厅。', edfuSources),
  node(edfuSlug, 'edfu-inner-ambulatory', '圣所环绕通道', 'hall', 0, 0, '圣所外侧、附属侧室之间的内部通道。', edfuSources),
  node(edfuSlug, 'edfu-passage', '主体外环通道', 'hall', 0, 0, '围墙与主体之间的通道，不与圣所内环混为同一个定位。', edfuSources),
];

const edfu: CulturalGuide = {
  slug: edfuSlug, title: '埃德富荷鲁斯神庙', originalTitle: 'Temple of Horus at Edfu', city: '埃德富', region: '尼罗河西岸', category: '考古遗址', tier: 'standard', itemIds: ['visit-edfu'], coordinates: { lat: 24.9779, lng: 32.8734 },
  hero: guideCover(edfuSlug), deck: '从巨型塔门一路走向至圣所，用逐步变暗、变窄的空间理解托勒密神庙的仪式秩序。',
  overview: '埃德富神庙主要建于托勒密时期，献给荷鲁斯，以保存完整的塔门、庭院、柱厅和至圣所序列著称。建筑让开放、明亮、公共的入口逐步过渡到更封闭的神圣核心；墙面铭文和浮雕则记录仪式、神话与庙宇运作。',
  orientation: [{ title: '建筑顺序比“拍完塔门”更重要', body: '塔门只是起点；庭院、柱厅、供奉空间与至圣所共同构成层层收紧的仪式过程。' }, { title: '荷鲁斯神话嵌入地方节庆', body: '墙面图像与“美丽相会节”等仪式把埃德富和丹德拉等地联入宗教网络。' }, { title: '先用平面读结构，再用剖切看关系', body: '外柱厅 D、内柱厅 E、供奉厅 F、前室 G 和至圣所 H 分开定位。历史平面保留建筑关系，但不证明某个侧室或楼梯现在对游客开放。' }],
  visitChapters: visitChaptersBySlug[edfuSlug],
  spatial: reviewedSpatial(edfuSlug, edfuNodes),
  highlights: [
    highlight(edfuSlug, 'edfu-pylon-card', '第一塔门：宏大入口也是叙事屏幕', '托勒密时期', '神庙正面塔门入口', '塔门以巨大平面承载国王击敌等仪式化王权图像。', '入口把政治秩序与神庙保护结合，先决定来访者如何理解空间。', '远看两翼与中央门洞比例，近看人物尺度和铭文分区。', edfuSources, 'edfu-pylon'),
    highlight(edfuSlug, 'edfu-court-card', '露天庭院：公众与神圣内部的缓冲', '托勒密时期', '塔门之后', '围柱庭院仍有自然光，却已被连续柱廊和浮雕包围。', '空间从城市外部转入仪式秩序，但尚未完全封闭。', '在不阻挡人流处转一圈，比较日照面与阴影面浮雕的可读性。', edfuSources, 'edfu-court'),
    highlight(edfuSlug, 'edfu-horus', '花岗岩荷鲁斯像：神祇成为入口守护者', '托勒密时期', '塔门与庭院相关位置，以现场标牌辨认', '鹰形荷鲁斯以紧凑体量和王冠强化神庙身份。', '动物形象、王权符号和建筑门槛在一处相遇。', '比较喙、眼、羽毛和冠饰处理；不触摸抛光表面。本平面没有核定每尊鹰像的独立坐标。', edfuSources),
    highlight(edfuSlug, 'edfu-hypostyle-card', '柱厅：光线逐渐交给仪式', '托勒密时期', '外、内柱厅', '柱列压缩视线，天花与墙面让自然光逐渐减少。', '空间变化本身在制造神圣性，不只靠墙上文字说明。', '回望入口，感受同一轴线上亮度和高度的变化。', edfuSources, 'edfu-hypostyle'),
    highlight(edfuSlug, 'edfu-sanctuary-card', '至圣所与神龛：最深处不是“空房间”', '托勒密时期 / 更早神龛再利用', '神庙核心', '神龛与环绕小室服务神像安置、供奉和仪式准备。', '它把宏大的外部建筑收束到高度控制的神圣核心。', '按现场围挡观察神龛材质、轴线与侧室开口，不跨越限制。', edfuSources, 'edfu-sanctuary'),
    highlight(edfuSlug, 'edfu-relief', '神话浮雕：图像按墙面展开', '托勒密时期', '内外墙面，具体场景待现场铭牌核对', '荷鲁斯与塞特相关场景不是孤立插图，而是按仪式与建筑位置组织的连续叙事。', '位置决定图像的观众与功能；脱离墙面只看局部会失去顺序。', '先找场景分栏和人物朝向，再读现场图说。不把未确认的墙面场景定位到供奉厅。', edfuSources),
    highlight(edfuSlug, 'edfu-passage', '环廊与外墙：神庙有一层“皮肤”', '托勒密时期', '主体建筑周边', '狭长通道让游客近距离看到外墙铭文、排水与建筑接缝。', '维护、边界和仪式同样依赖外围空间。', '留意墙脚磨损和现代保护设施；通道狭窄时不要停留堵塞。', edfuSources, 'edfu-passage'),
  ],
  sequence: [{ nodeId: 'edfu-pylon', title: '01｜在塔门前读尺度与图像', body: '先远后近，确认入口如何制造王权叙事。' }, { nodeId: 'edfu-court', title: '02｜用庭院观察光线转换', body: '绕看柱廊，感受城市与内部之间的缓冲。' }, { nodeId: 'edfu-hypostyle', title: '03｜进入柱厅序列', body: '回望入口，记录光线和视线如何收窄。' }, { nodeId: 'edfu-offerings', title: '04｜理解供奉准备', body: '把侧室和前室视为仪式基础设施。' }, { nodeId: 'edfu-sanctuary', title: '05｜在至圣所收束', body: '依现场围挡观察轴线、神龛与环绕空间。' }],
  practical: ['10月5日为跨城包车日，康翁波、埃德富与卢克索酒店同日，实际到达时段未确认。', '文物部门阿斯旺指南曾列开放与票价，但票价可能落后于现行票务系统；出发前以官方售票页面为准。', '柱厅和通道会出现明暗差与高门槛；穿防滑鞋，不在狭窄通道长时间停拍。', '若时间有限，保留完整轴线体验，不要只在塔门拍照后离开。'], sourceIds: edfuSources, tags: ['荷鲁斯', '托勒密', '轴线神庙', '浮雕'],
};

const luxorSlug = 'luxor-temple';
const luxorSources = ['src-luxor-temple', 'src-thebes'];
const luxorNodes = [
  node(luxorSlug, 'luxor-pylon', '拉美西斯二世塔门', 'gate', -2.8, 0, '巨像、单座留存方尖碑与塔门构成北端入口。', luxorSources),
  node(luxorSlug, 'luxor-rameses-court', '拉美西斯二世庭院', 'hall', -1.4, .2, '围柱庭院与多时期建筑相互嵌合。', luxorSources),
  node(luxorSlug, 'luxor-colonnade', '大柱廊', 'colonnade', .1, 0, '两列各七根巨柱形成奥佩特节核心通道。', luxorSources),
  node(luxorSlug, 'luxor-amenhotep', '阿蒙霍特普三世庭院与柱厅', 'hall', 1.5, 0, '神庙核心向南延伸的主要空间。', luxorSources),
  node(luxorSlug, 'luxor-inner', '内室与罗马圣所层', 'sanctuary', 2.8, 0, '古埃及内室被后期军营与罗马绘画重新使用。', luxorSources),
];

const luxor: CulturalGuide = {
  slug: luxorSlug, title: '卢克索神庙', originalTitle: 'Luxor Temple', city: '卢克索', region: '尼罗河东岸', category: '考古遗址', tier: 'major', itemIds: ['visit-luxor-temple'], coordinates: { lat: 25.6995, lng: 32.6391 },
  hero: guideCover(luxorSlug), deck: '这是一座面向卡纳克、为奥佩特节服务的城市神庙；从塔门、庭院、大柱廊到罗马绘画，建筑记录不断改写的城市礼仪。',
  overview: '卢克索神庙古名意为“南方圣所”，其方向并非典型东西轴，而是指向北方卡纳克。奥佩特节期间，阿蒙、穆特与孔苏的神像沿仪式路线来到这里。现存核心由阿蒙霍特普三世建造，拉美西斯二世在北端增加塔门与庭院；罗马时期又把部分内室改作圣所。',
  orientation: [{ title: '先理解它为何朝向卡纳克', body: '约 2.7 公里的狮身人面像大道将两座神庙连接；神庙方向来自城市仪式，不只是太阳方位。' }, { title: '不同统治者沿轴线接力', body: '阿蒙霍特普三世、图坦卡蒙、霍伦海布与拉美西斯二世的工程在一条序列上相互叠加。' }, { title: '傍晚不是静态“最佳光线”', body: '夜游能看到照明下的体量，却可能牺牲浮雕细节；导览同时提示白天与夜间的观察差异。' }],
  visitChapters: visitChaptersBySlug[luxorSlug],
  spatial: reviewedSpatial(luxorSlug, luxorNodes),
  highlights: [
    highlight(luxorSlug, 'luxor-pylon-card', '塔门、巨像与单座方尖碑', '第十九王朝', '北端入口', '拉美西斯二世以塔门、巨像与一对方尖碑建立宏大入口，如今仅一座方尖碑仍在原位。', '缺席的另一座提醒遗产也有近代外交与迁移史。', '先看左右是否对称，再用空缺想象原来成对构图。', luxorSources, 'luxor-pylon'),
    highlight(luxorSlug, 'luxor-court-card', '拉美西斯二世庭院：轴线为旧建筑让路', '第十九王朝', '第一庭院', '庭院在既有神圣建筑与城市条件中展开，并非完全抽象的几何。', '“不规则”常是历史协商的证据。', '比较柱廊方向、雕像位置与穿越视线，不急着追求绝对对称。', luxorSources, 'luxor-rameses-court'),
    highlight(luxorSlug, 'luxor-colonnade-card', '大柱廊：两列七柱承载节庆', '第十八王朝', '大柱廊', '阿蒙霍特普三世建立两列各七根巨柱，后由图坦卡蒙与霍伦海布完成奥佩特节装饰。', '柱廊既是建筑通道也是节庆叙事的石质舞台。', '沿柱列看尽端透视，再靠近辨认节庆场面和后刻王名。', luxorSources, 'luxor-colonnade'),
    highlight(luxorSlug, 'luxor-amenhotep-card', '阿蒙霍特普三世庭院：尺度转入核心', '第十八王朝', '南部庭院与柱厅', '连续柱列将开放庭院和更深的神庙空间连接。', '这里能清楚看见建筑如何用重复与收窄控制仪式推进。', '回望大柱廊，比较柱式、开间和地面高差。', luxorSources, 'luxor-amenhotep'),
    highlight(luxorSlug, 'luxor-roman', '罗马绘画：征服者也借用旧神圣空间', '公元 3 世纪末', '内室', '罗马军营时期，古代浮雕上覆盖灰泥并绘制戴克里先及共治者。', '再利用不是简单破坏；它揭示新政权如何占用既有神圣权威。', '寻找不同材料层和画面边界，不把所有墙面归于法老时期。', luxorSources, 'luxor-inner'),
    highlight(luxorSlug, 'luxor-avenue', '狮身人面像大道：一座城市级仪式基础设施', '古代 / 现代修复开放', '神庙北端城市连接', '大道把卡纳克与卢克索神庙连接成约 2.7 公里的节庆轴。', '它把两个景点重新理解为同一城市礼仪系统。', '在入口辨认大道方向，但不要把文化轴线当成当日必须步行的路线。', ['src-thebes', 'src-luxor-temple'], 'luxor-pylon'),
    highlight(luxorSlug, 'luxor-night', '夜间观看：轮廓增强，细节减弱', '当代参观环境', '全场', '照明强化柱列、巨像和墙体层次，但颜色与浅浮雕更难准确判断。', '承认观看条件能避免把灯光效果误当古代原貌。', '先用夜景读体量；需要研究细节时依靠展签和白天图像。', luxorSources, 'luxor-colonnade'),
  ],
  sequence: [{ nodeId: 'luxor-pylon', title: '01｜在北端建立城市轴线', body: '把方尖碑空缺与狮身人面像大道一起看。' }, { nodeId: 'luxor-rameses-court', title: '02｜观察庭院的历史协商', body: '注意轴线如何容纳更早建筑。' }, { nodeId: 'luxor-colonnade', title: '03｜沿大柱廊读奥佩特节', body: '用柱列和浮雕重建节庆移动。' }, { nodeId: 'luxor-amenhotep', title: '04｜进入阿蒙霍特普三世核心', body: '比较庭院、柱厅和内室的尺度变化。' }, { nodeId: 'luxor-inner', title: '05｜以罗马层收束', body: '识别再利用，让神庙历史跨出法老时代。' }],
  practical: ['草表安排 10月5日傍晚，抵达卢克索酒店时间与体力取决于当日长途包车。', '官方页面 2026-09-15 核对时列出 06:00–20:00；节庆、维护或票务变化需临行再查。', '夜间适合看体量，白天更适合浅浮雕；本行程只能择一时，应按兴趣取舍。', '老集市晚餐是同日另一个活动，不属于神庙门票或导览范围。'], sourceIds: luxorSources, tags: ['奥佩特节', '狮身人面像大道', '拉美西斯二世', '夜游'],
};

const valleySlug = 'valley-of-the-kings';
const valleySources = ['src-valley-kings', 'src-thebes'];
const valleyNodes = [
  node(valleySlug, 'valley-east', '东谷墓葬群', 'tomb', -1.5, 0, '多数著名王墓集中区；开放组合轮换。', valleySources),
  node(valleySlug, 'valley-west', '西谷', 'tomb', 1.8, -.8, '另一支谷地与少量王墓；不把它并入默认票面假设。', valleySources),
  node(valleySlug, 'valley-visitor', '访客中心与现场规则', 'museum', 0, 1.8, '实时开放墓室、票种、交通与摄影规定的唯一可靠入口。', valleySources),
];

const valley: CulturalGuide = {
  slug: valleySlug, title: '帝王谷', originalTitle: 'Valley of the Kings', city: '卢克索西岸', region: '底比斯西岸', category: '考古遗址', tier: 'major', itemIds: ['visit-valley-kings'], coordinates: { lat: 25.7402, lng: 32.6014 },
  hero: guideCover(valleySlug), deck: '这里不是一座“陵墓”，而是超过六十座墓葬与未完成工程组成的山谷；完整导览的核心是会选墓、会读平面、也会尊重轮换与摄影规则。',
  overview: '帝王谷由东谷和西谷构成，已知超过六十座墓葬及未完成工程。不同墓室在尺度、轴线、装饰与保存上差异巨大，而且开放名单与票种会轮换。可靠的现场策略不是预先承诺固定三座墓，而是掌握选择框架：优先保存状态、图像主题、拥挤程度与额外票预算。',
  orientation: [{ title: '开放墓室不是恒定目录', body: '现场公告决定当日可进入哪些墓；任何离线导览都不能把历史开放名单写成保证。' }, { title: '墓号比王名更可靠', body: 'KV 编号用于识别地点；同一国王可能有复杂归属史，先核对墓号再买附加票。' }, { title: '地面与墓内是两种环境', body: '谷地暴晒、墓内闷热且陡坡集中；体力预算决定你能否真正看懂第三座墓。' }],
  visitChapters: visitChaptersBySlug[valleySlug],
  spatial: reviewedSpatial(valleySlug, valleyNodes),
  highlights: [
    highlight(valleySlug, 'valley-landscape', '山谷地形：隐藏取代金字塔可见性', '新王国', '东谷与西谷', '王墓切入干燥谷地岩壁，以隐蔽和受控通道替代巨型地上陵墓。', '葬制改变同时反映安全、宗教与西岸神圣地景。', '从入口远看山体形态和支谷，不离开开放路径寻找墓口。', valleySources, 'valley-east'),
    highlight(valleySlug, 'valley-kv62', 'KV62 图坦卡蒙：小墓与巨大现代名声', '第十八王朝', '东谷 / 额外票与开放以现场为准', '墓室规模并不宏大，重要性来自近乎完整的墓葬组合与现代发掘史。', '它揭示“最著名”与“建筑最壮观”并非同一概念。', '若开放并购票，关注空间紧凑与保存展示，不期待 GEM 式完整器物组合。', valleySources, 'valley-east'),
    highlight(valleySlug, 'valley-kv2', 'KV2 拉美西斯四世：用长轴读来世文本', '第二十王朝', '东谷 / 开放轮换', '较直的通道与大面积彩绘让宗教文本的顺序更易辨认。', '墓室是三维书卷；移动方向决定图像阅读。', '从天花、墙面到门楣分层看，不只追逐颜色最鲜艳的一面。', valleySources, 'valley-east'),
    highlight(valleySlug, 'valley-kv6', 'KV6 拉美西斯九世：图像密度与快速建造', '第二十王朝', '东谷 / 开放轮换', '通道覆盖多种来世书图像，空间与完成程度反映建造时间压力。', '未完成或变化不是缺陷，而是死亡时间与工程组织的证据。', '比较不同区段线刻、上色与抛光完成度。', valleySources, 'valley-east'),
    highlight(valleySlug, 'valley-kv9', 'KV9：一座墓的再占用与扩建', '第二十王朝', '东谷 / 常见附加票，现场确认', '墓葬先后与拉美西斯五世、六世相关，扩建改变了空间和装饰。', '王墓不是永远固定的个人容器，也会被继承、改写和重新解释。', '寻找轴线变化、星空天花与不同文本体系的转换。', valleySources, 'valley-east'),
    highlight(valleySlug, 'valley-heat', '谷地表面：环境也是保护条件', '当代遗址管理', '墓外步道', '干燥有利保存，却给游客与墓内微环境带来热量、尘土和湿气压力。', '参观管理是在开放与保存之间做取舍。', '减少墓内停留时的拥堵，不触墙，不用身体倚靠。', valleySources, 'valley-visitor'),
    highlight(valleySlug, 'valley-centre', '访客中心：当日信息优先于攻略', '当代', '入口区域', '开放墓室、普通票包含数、附加票和摄影规则必须以当天公告为准。', '这不是行政细节，而是避免错误行程和失望的核心证据点。', '拍下当日开放表供离线查看，再决定三座墓的组合。', valleySources, 'valley-visitor'),
  ],
  sequence: [{ nodeId: 'valley-visitor', title: '01｜先在访客中心做选择', body: '核对当日开放、普通票与附加票，不预设固定三墓。' }, { nodeId: 'valley-east', title: '02｜第一座选“结构清楚”', body: '用一座轴线清晰的墓学习阅读方法。' }, { nodeId: 'valley-east', title: '03｜第二座选“图像差异”', body: '比较不同王朝阶段、文本与完成度。' }, { nodeId: 'valley-east', title: '04｜第三座按体力决定', body: '不要为了票面数量在高温与陡坡中勉强。' }, { nodeId: 'valley-west', title: '05｜西谷只在票务明确时加入', body: '不把分支谷地和额外交通假设进主线。' }],
  practical: ['草表写 08:30 出发并提醒禁拍、暴晒；摄影规则必须以 2026 年现场公告为准。', '官方页面 2026-09-15 核对时列出 06:00–17:00 与基础票价，但具体墓室组合和附加票会变化。', '带水、帽子、防晒与抓地鞋；墓内台阶、坡道和闷热对膝盖与心肺有压力。', '不要触摸壁画或倚墙；即使允许手机摄影，也应关闭闪光并避免阻塞狭窄通道。'], sourceIds: valleySources, tags: ['新王国王墓', '开放轮换', '来世文本', '保存伦理'],
};

const hatshepsutSlug = 'hatshepsut-temple';
const hatshepsutSources = ['src-hatshepsut', 'src-thebes'];
const hatshepsutNodes = [
  node(hatshepsutSlug, 'hat-lower', '下层庭院', 'terrace', -2.5, 0, '从平地进入三层上升构图的起点。', hatshepsutSources),
  node(hatshepsutSlug, 'hat-middle', '中层平台与柱廊', 'terrace', -.8, 0, '庞特远征、神圣出生与专门礼拜空间集中层。', hatshepsutSources),
  node(hatshepsutSlug, 'hat-hathor', '哈托尔礼拜空间', 'chapel', -.4, 1.5, '与西岸山体和哈托尔崇拜相连。', hatshepsutSources),
  node(hatshepsutSlug, 'hat-anubis', '阿努比斯礼拜空间', 'chapel', -.4, -1.5, '葬祭神祇相关的独立礼拜单元。', hatshepsutSources),
  node(hatshepsutSlug, 'hat-upper', '上层庭院与阿蒙圣所', 'sanctuary', 2, 0, '奥西里斯式王像与切入岩壁的核心空间。', hatshepsutSources),
];

const hatshepsut: CulturalGuide = {
  slug: hatshepsutSlug, title: '哈特谢普苏特葬祭殿', originalTitle: 'Temple of Hatshepsut at Deir el-Bahari', city: '卢克索西岸', region: '代尔巴哈里', category: '考古遗址', tier: 'major', itemIds: ['visit-hatshepsut'], coordinates: { lat: 25.7382, lng: 32.6066 },
  hero: guideCover(hatshepsutSlug), deck: '三层平台、长坡道与悬崖把建筑变成地景；庞特远征、神圣出生与多神礼拜共同建构一位女法老的合法性。',
  overview: '哈特谢普苏特的葬祭殿古名“圣中之圣”，由森穆特设计，三层平台逐级向悬崖上升。它不仅服务女法老死后崇拜，也包含其父图特摩斯一世、哈托尔、阿努比斯、太阳神与阿蒙的礼拜空间。中层柱廊的庞特远征与神圣出生图像，是建筑、政治叙事与仪式空间结合的关键。',
  orientation: [{ title: '先看建筑如何借用悬崖', body: '三层人造平台没有模仿自然，却通过水平柱廊和长坡道回应垂直岩壁。' }, { title: '“女王”不足以解释她', body: '哈特谢普苏特以完整法老身份统治；图像中的男性王权符号是政治身份表达，不是简单伪装。' }, { title: '重建部分必须被看见', body: '今天的整洁轴线包含现代考古修复；不要把所有可见构件都当原状保存。' }],
  visitChapters: visitChaptersBySlug[hatshepsutSlug],
  spatial: reviewedSpatial(hatshepsutSlug, hatshepsutNodes),
  highlights: [
    highlight(hatshepsutSlug, 'hat-landscape', '悬崖与平台：建筑控制地景而不复制地景', '第十八王朝', '全景', '水平柱廊、长坡道与垂直悬崖形成强烈几何对话。', '王权不只通过雕像表达，也通过把自然地形纳入秩序。', '在进入前停留全景，分清三层平台与后方自然岩壁。', hatshepsutSources, 'hat-lower'),
    highlight(hatshepsutSlug, 'hat-ramps', '长坡道：移动本身就是仪式', '第十八王朝 / 现代修复', '平台中央轴线', '坡道将上升过程公开化，使到访者逐层接近神圣核心。', '身体的疲劳、视野变化和轴线对齐共同制造庄严。', '每上一层回头一次，记录尼罗河谷方向如何被框取。', hatshepsutSources, 'hat-middle'),
    highlight(hatshepsutSlug, 'hat-osiride', '奥西里斯式王像：死后王权的身体', '第十八王朝', '上层柱廊', '哈特谢普苏特以奥西里斯式姿态依附柱体出现。', '图像把法老死后状态、神祇身份与建筑承重节奏结合。', '比较面部、假胡须、交叉双臂与柱体连接。', hatshepsutSources, 'hat-upper'),
    highlight(hatshepsutSlug, 'hat-hathor-card', '哈托尔礼拜堂：女神与西岸山体', '第十八王朝', '中层南侧', '哈托尔以母性、王权养育和西岸地景相关形象进入建筑。', '专门礼拜空间证明神庙并非只围绕哈特谢普苏特个人。', '寻找哈托尔柱头、牛形图像与空间方向关系。', hatshepsutSources, 'hat-hathor'),
    highlight(hatshepsutSlug, 'hat-anubis-card', '阿努比斯礼拜堂：葬祭保护的独立章节', '第十八王朝', '中层北侧', '阿努比斯相关空间把墓地保护与献祭仪式纳入整座神庙。', '对称位置不意味着内容相同；不同神祇承担不同仪式角色。', '比较与哈托尔一侧的尺度、柱式和图像主题。', hatshepsutSources, 'hat-anubis'),
    highlight(hatshepsutSlug, 'hat-punt', '庞特远征：外交、物产与王权叙事', '第十八王朝', '中层柱廊', '图像记录前往庞特的人员、环境、货物与带回资源。', '它既是跨红海交流的珍贵图像，也经过王权叙事选择。', '分辨船只、异域植物、人物与货物，不把每个细节当中性纪录片。', hatshepsutSources, 'hat-middle'),
    highlight(hatshepsutSlug, 'hat-ceiling', '残色与天花：别让白色石材欺骗你', '第十八王朝', '礼拜堂与柱廊', '局部保存的蓝色、黄色和红色提醒神庙曾是高度着色的环境。', '现代游客熟悉的浅石色不是古代完整视觉经验。', '在阴影处寻找残色，避免闪光和触摸。', hatshepsutSources, 'hat-anubis'),
  ],
  sequence: [{ nodeId: 'hat-lower', title: '01｜在下层先看悬崖关系', body: '用全景分清自然与建筑。' }, { nodeId: 'hat-middle', title: '02｜上升至中层叙事柱廊', body: '优先庞特远征与神圣出生主题。' }, { nodeId: 'hat-hathor', title: '03｜比较两侧礼拜单元', body: '从哈托尔到阿努比斯，理解多神功能。' }, { nodeId: 'hat-upper', title: '04｜以上层奥西里斯式王像收束', body: '进入阿蒙圣所语境，认识死后王权。' }],
  practical: ['10月6日与帝王谷、门农巨像同属西岸上午，包车顺序与停留时间未确认。', '官方页面 2026-09-15 核对时列出 06:00–17:00；门票与开放范围出发前复核。', '长坡道、反射日晒和高温明显，需补水、防晒并为膝盖留余量。', '现代修复区域与原构件并存；遵守围挡，不为寻找残色进入关闭区域。'], sourceIds: hatshepsutSources, tags: ['哈特谢普苏特', '三层平台', '庞特远征', '代尔巴哈里'],
};

const colossiSlug = 'colossi-of-memnon';
const colossiSources = ['src-thebes', 'src-colossi-research'];
const colossiNodes = [
  node(colossiSlug, 'colossi-north', '北侧巨像', 'statue', -1.1, 0, '阿蒙霍特普三世坐像之一，古代“鸣响”传统主要与北像相关。', colossiSources),
  node(colossiSlug, 'colossi-south', '南侧巨像', 'statue', 1.1, 0, '与北像成对立于葬祭殿入口。', colossiSources),
  node(colossiSlug, 'colossi-temple', '阿蒙霍特普三世葬祭殿遗址', 'temple', 0, 2, '巨像原本守卫的大型神庙地景，持续考古与保护中。', colossiSources),
];

const colossi: CulturalGuide = {
  slug: colossiSlug, title: '门农巨像', originalTitle: 'Colossi of Memnon', city: '卢克索西岸', region: '阿蒙霍特普三世葬祭殿前', category: '考古遗址', tier: 'standard', itemIds: ['visit-colossi'], coordinates: { lat: 25.7206, lng: 32.6105 },
  hero: guideCover(colossiSlug), deck: '两尊巨像不是孤立路边雕塑，而是阿蒙霍特普三世巨大葬祭殿的入口守卫；从王座侧面、修复痕迹与失落建筑重建它们的语境。',
  overview: '门农巨像是阿蒙霍特普三世的两尊巨型坐像，原本立于其葬祭殿入口。后世将北像清晨发声现象与希腊神话中的 Memnon 联系，留下大量旅行与铭刻记忆；现代考古和修复则逐步揭示两像背后曾经庞大的神庙。',
  orientation: [{ title: '先看“门”而不是“像”', body: '两像成对、朝向同一侧，说明它们原是建筑入口构件。' }, { title: '希腊名称是后来的解释层', body: '“Memnon”并非阿蒙霍特普三世原名；发声传说属于古典时代再解释。' }, { title: '短停也能完整阅读', body: '用十到二十分钟完成正面、侧面王座、修复和背后遗址四层观察，不必虚构长路线。' }],
  visitChapters: visitChaptersBySlug[colossiSlug],
  spatial: reviewedSpatial(colossiSlug, colossiNodes),
  highlights: [
    highlight(colossiSlug, 'colossi-pair', '成对坐像：缺失建筑的入口仍可读', '第十八王朝', '葬祭殿东侧入口', '两尊阿蒙霍特普三世坐像原本守卫通往神庙的入口。', '成对关系让孤立地标重新成为建筑构件。', '退到安全区域同时纳入两像，判断原入口中心线。', colossiSources, 'colossi-north'),
    highlight(colossiSlug, 'colossi-north-card', '北像与“鸣响”：自然现象变成跨文化神话', '罗马时期记载 / 更早雕像', '北侧巨像', '地震损伤后的清晨声响被希腊罗马来访者解释为 Memnon 向黎明致意。', '一尊埃及王像由此获得第二套古典神话身份。', '看修复与断裂层次；不要期待今天仍固定发声。', colossiSources, 'colossi-north'),
    highlight(colossiSlug, 'colossi-south-card', '南像：比较才能看出修复与风化', '第十八王朝至现代', '南侧巨像', '两像材料、姿态相近，却经历不同损伤和修复。', '配对比较比单独拍一尊更能揭示保存史。', '比较面部、王冠、膝部和基座轮廓。', colossiSources, 'colossi-south'),
    highlight(colossiSlug, 'colossi-throne', '王座侧面：尼罗河统一图像', '第十八王朝', '巨像王座侧面', '王座侧面的象征图像把国王身体与两地统一观念联系。', '巨像意义不仅在正面人像，侧面才保存政治图像结构。', '从允许角度观察侧面人物、植物与绑结构图。', colossiSources, 'colossi-south'),
    highlight(colossiSlug, 'colossi-excavation', '神庙考古：巨像背后仍在恢复语境', '现代考古保护', '两像后方遗址区', '持续项目揭示、修复并重新竖立神庙雕像与构件。', '遗址不是“已经研究完”的废墟，新的保护也会改变可见地景。', '只从开放区域识别基座、构件和现代支护。', ['src-colossi-research'], 'colossi-temple'),
    highlight(colossiSlug, 'colossi-floodplain', '洪泛平原：材料损伤来自环境史', '古代至今', '西岸低地', '神庙选址、地下水与历史洪泛共同影响保存。', '建筑消失不只来自人为破坏，也来自长期环境过程。', '观察地势与周边农田，不进入考古围挡。', colossiSources, 'colossi-temple'),
  ],
  sequence: [{ nodeId: 'colossi-north', title: '01｜先同时看两像', body: '把它们恢复为入口构件。' }, { nodeId: 'colossi-north', title: '02｜辨认北像修复与发声传说', body: '区分雕像原身份和后世 Memnon 解释。' }, { nodeId: 'colossi-south', title: '03｜转到侧面与南像比较', body: '看王座图像、风化和修复差异。' }, { nodeId: 'colossi-temple', title: '04｜最后看背后神庙遗址', body: '用考古区重建巨像原来的建筑尺度。' }],
  practical: ['草表把门农巨像列为西岸上午第三站并标注无需门票；停车、开放边界和现场管理仍以当天为准。', '靠近公路，拍摄时不要后退进入车道；包车上下客位置由司机和现场管理决定。', '背后区域持续考古保护，不越过围挡或踩踏构件。', '短停重点是成对关系、王座侧面和神庙语境，不必追求所有角度。'], sourceIds: colossiSources, tags: ['阿蒙霍特普三世', '巨像', '古典接受史', '遗址修复'],
};

const karnakSlug = 'karnak';
const karnakSources = ['src-karnak', 'src-thebes'];
const karnakNodes = [
  node(karnakSlug, 'karnak-amun', '阿蒙区主轴', 'temple', -1.8, 0, '卡纳克最大区域的东西向太阳轴。', karnakSources),
  node(karnakSlug, 'karnak-hypostyle', '大柱厅', 'colonnade', -.4, 0, '134 根柱构成的核心建筑体验。', karnakSources),
  node(karnakSlug, 'karnak-obelisk', '方尖碑区', 'statue', .9, -.2, '哈特谢普苏特等统治者的高耸纪念物。', karnakSources),
  node(karnakSlug, 'karnak-lake', '圣湖', 'water', .9, 1.5, '与祭司净化和神庙仪式相关。', karnakSources),
  node(karnakSlug, 'karnak-khonsu', '孔苏神庙', 'temple', -1.3, 1.8, '阿蒙区西南角的相对完整神庙。', karnakSources),
  node(karnakSlug, 'karnak-mut', '穆特区', 'temple', 2.4, 1.5, '主区南侧的独立围区，票务与开放另查。', karnakSources),
  node(karnakSlug, 'karnak-montu', '蒙图区', 'temple', -1.3, -2, '主区北侧围区。', karnakSources),
  node(karnakSlug, 'karnak-luxor-axis', '通往卢克索的南北轴', 'gate', .2, 2.6, '奥佩特节城市方向与狮身人面像大道相连。', karnakSources),
];

const karnak: CulturalGuide = {
  slug: karnakSlug, title: '卡纳克神庙群', originalTitle: 'Karnak Temple Complex', city: '卢克索', region: '尼罗河东岸', category: '考古遗址', tier: 'major', itemIds: ['visit-karnak'], coordinates: { lat: 25.7188, lng: 32.6573 },
  hero: guideCover(karnakSlug), deck: '不要把卡纳克缩成一座大柱厅：阿蒙、穆特、蒙图围区，东西太阳轴与南北城市轴，共同构成两千年不断扩建的宗教城市。',
  overview: '卡纳克古称“最精选之地”，是多座神庙、礼拜堂、塔门、方尖碑与仪式设施构成的复合体。最大的阿蒙区以东西轴为主，又有面向卢克索神庙的南北轴；南侧是穆特区，北侧是蒙图区，东侧还有与阿吞相关的历史层。几乎每位新王国统治者都留下工程，使这里成为不断覆盖、重刻和调整的建筑档案。',
  orientation: [{ title: '先接受“不可能一次看完”', body: '卡纳克规模巨大；完整方法是掌握轴线、选择重点与辨认增建层，而不是扫遍每块石头。' }, { title: '大柱厅不是全站', body: '134 根柱确实震撼，但方尖碑、圣湖、孔苏神庙和南北仪式轴能解释它为何属于更大的宗教城市。' }, { title: '声光秀是另一产品', body: '草表写“神庙与声光秀”，但日间门票、闭馆和声光秀场次不可合并假设。' }],
  visitChapters: visitChaptersBySlug[karnakSlug],
  spatial: reviewedSpatial(karnakSlug, karnakNodes),
  highlights: [
    highlight(karnakSlug, 'karnak-complex', '宗教城市：围区而不是单殿', '中王国至罗马时期', '全场', '阿蒙、穆特、蒙图等围区与大量小神庙共同构成卡纳克。', '多中心结构解释了扩建为何持续两千年。', '入场先在官方图上确认阿蒙区边界，不把远处所有遗址都当同一票面。', karnakSources, 'karnak-amun'),
    highlight(karnakSlug, 'karnak-hypostyle-card', '大柱厅：134 根柱形成石质森林', '第十九王朝为主', '阿蒙大神庙', '中央十二根柱高于两侧，形成采光层；塞提一世与拉美西斯二世完成主要建造与装饰。', '结构、光线与王权铭刻在同一空间叠合。', '沿中央高柱看采光窗，再比较两位国王浮雕风格。', karnakSources, 'karnak-hypostyle'),
    highlight(karnakSlug, 'karnak-obelisk-card', '哈特谢普苏特方尖碑：一块石头制造垂直政治', '第十八王朝', '阿蒙区内', '近 30 米高的方尖碑以单体石材、铭文和太阳象征穿透周围水平建筑。', '它把采石、运输、竖立与王权合法性集中在一个极端工程中。', '从基座读铭文方向，再抬头看尖端与周围塔门的遮挡关系。', karnakSources, 'karnak-obelisk'),
    highlight(karnakSlug, 'karnak-lake-card', '圣湖：仪式净化与神庙后勤', '新王国及后期', '阿蒙区南侧', '圣湖与祭司净化相关，也属于神庙日常运作环境。', '水体让卡纳克从纪念建筑转回有人工作、准备和重复仪式的机构。', '观察水体、岸线与周边建筑关系，不把现代景观维护当古代原状。', karnakSources, 'karnak-lake'),
    highlight(karnakSlug, 'karnak-avenue', '公羊首狮身像：神祇形象组成仪式边界', '多时期', '入口与轴线', '成列雕像控制接近方向，并以阿蒙相关公羊形象界定神圣通道。', '重复雕像既是装饰也是城市级人流和仪式秩序。', '比较每尊保存、修复和基座铭文差异。', karnakSources, 'karnak-amun'),
    highlight(karnakSlug, 'karnak-khonsu-card', '孔苏神庙：在巨型复合体中看一座相对完整神庙', '新王国及后期', '阿蒙区西南角', '较清晰的塔门—庭院—柱厅序列有助于理解埃及神庙基本结构。', '它为被卡纳克复杂扩建打乱的空间提供一个可比较的参照结构。', '若开放且体力允许，比较其轴线与阿蒙大神庙。', karnakSources, 'karnak-khonsu'),
    highlight(karnakSlug, 'karnak-open-air', '露天博物馆：拆散构件也有建筑记忆', '多时期 / 现代重组', '阿蒙区内露天博物馆', '重组礼拜堂和构件揭示后代如何拆用、填充和覆盖前代建筑。', '建筑史不仅是增建，也包括拆解、再利用和考古复原。', '票务和开放先确认；阅读构件编号与复原说明。', karnakSources, 'karnak-amun'),
    highlight(karnakSlug, 'karnak-pylons', '多重塔门：每一次穿越都是年代切换', '多时期', '阿蒙区主轴与南北轴', '塔门并非一次建成的连续序号，而是不同工程阶段的边界。', '穿越顺序让两千年建造史被压缩在一次步行中。', '在每道塔门前回望，寻找轴线偏移、未完成表面与重刻。', karnakSources, 'karnak-luxor-axis'),
    highlight(karnakSlug, 'karnak-relief', '浮雕重刻：胜利图像也会被继承', '新王国及后期', '墙面与塔门', '后来的统治者可能覆盖、补刻或重新署名既有图像。', '王名不是简单作者签名，而是持续争夺纪念物权威的工具。', '找轮廓重叠、凿除和深浅不同的王名框。', karnakSources, 'karnak-amun'),
  ],
  sequence: [{ nodeId: 'karnak-amun', title: '01｜入口先建立阿蒙区主轴', body: '用官方图确认今天实际开放范围。' }, { nodeId: 'karnak-hypostyle', title: '02｜在大柱厅看结构与重刻', body: '先看中央高柱采光，再选一面浮雕细读。' }, { nodeId: 'karnak-obelisk', title: '03｜比较方尖碑与塔门层次', body: '从竖向纪念物理解统治者增建。' }, { nodeId: 'karnak-lake', title: '04｜转向圣湖与后勤空间', body: '让神庙从纪念碑回到日常仪式机构。' }, { nodeId: 'karnak-khonsu', title: '05｜有余力再看孔苏神庙', body: '用相对完整单殿校准复杂复合体。' }, { nodeId: 'karnak-luxor-axis', title: '06｜以南北轴连接卢克索', body: '把奥佩特节与狮身人面像大道带回城市尺度。' }],
  practical: ['草表建议 16:00 后错峰并加声光秀，尚未核对声光秀日期、语言、票种与返程。', '官方页面 2026-09-15 核对时列出 06:00–17:00，并把穆特区另列票价；临行前核实季节时间。', '日间闭馆与夜间声光秀可能是分开的入场流程，不能以一张票或连续开放为前提。', '场地巨大且遮阴有限；先保留大柱厅、方尖碑和圣湖，体力不足时放弃边缘围区。'], sourceIds: karnakSources, tags: ['阿蒙', '大柱厅', '双轴', '宗教城市'],
};

const orangeSlug = 'orange-bay';
const orangeSources = ['src-orange-bay'];
const orangeNodes = [
  node(orangeSlug, 'orange-transfer', '船程与运营商环节', 'water', -2, 0, '具体码头、船公司、停靠和接送尚未由订单确认。', orangeSources),
  node(orangeSlug, 'orange-beach', '岛上沙滩设施', 'district', 0, 0, '目的地官网展示的沙滩与休闲服务；实际包含以船票为准。', orangeSources),
  node(orangeSlug, 'orange-reef', '红海珊瑚环境', 'reef', 2, -1, '浮潜与潜水依赖当天海况、运营商许可与环保规则。', orangeSources),
  node(orangeSlug, 'orange-safety', '安全与返船节点', 'gate', 2, 1.4, '集合时间、装备、潜水资质和返船必须由运营商现场确认。', orangeSources),
];

const orange: CulturalGuide = {
  slug: orangeSlug, title: 'Orange Bay 与红海海洋体验', originalTitle: 'Orange Bay, Giftun Island', city: '赫尔格达', region: '吉夫顿岛海域', category: '自然体验', tier: 'place', itemIds: ['red-sea-boat-day'], coordinates: { lat: 27.2091, lng: 33.9261 },
  hero: guideCover(orangeSlug), deck: '把“网红沙滩”放回红海生态与船程安全：先确认运营商和实际包含，再用不触礁、不追鱼、不留下垃圾的方式进入海洋。',
  overview: 'Orange Bay 是吉夫顿岛海域的海滩目的地，但用户材料没有提供具体运营商、码头、船型、浮潜点、潜水资质要求或保险。完整导览因此不虚构航线，而把重点放在目的地识别、珊瑚礁观看方法、装备检查、潜水与浮潜边界以及返船纪律。',
  orientation: [{ title: '目的地官网不等于订单', body: '官网能证明地点与一般服务，不能证明本次船票包含接送、潜水、午餐、装备或上岛时长。' }, { title: '浮潜和水肺潜水不是同一活动', body: '水肺潜水涉及资质、试潜、健康声明与教练安排；未拿到订单前全部保持待确认。' }, { title: '海洋地图不能预画路线', body: '船程和下水点受运营商与海况决定；地图只标岛岸、沙滩和海洋环境，并明确省略未确认的码头、航道与下水点。' }],
  visitChapters: visitChaptersBySlug[orangeSlug],
  spatial: reviewedSpatial(orangeSlug, orangeNodes),
  highlights: [
    highlight(orangeSlug, 'orange-island', '吉夫顿岛海域：先辨认保护环境', '当代海洋目的地', '赫尔格达外海', '沙岛、浅海和珊瑚礁共同构成脆弱环境，船只与游客活动会带来压力。', '把生态承载力放在拍照与项目数量之前，才能避免“体验”反过来破坏目的地。', '听从划定区域和环保提示，不带走贝壳或珊瑚。', orangeSources, 'orange-beach'),
    highlight(orangeSlug, 'orange-beach-card', '沙滩设施：确认票面包含再消费', '当代', 'Orange Bay 岛上区域', '遮阳、座位、餐饮与水上项目可能按不同产品提供。', '官网展示与船公司套餐之间存在信息边界。', '上岛先拍集合点和返船时间，再确认储物、饮水与额外付费。', orangeSources, 'orange-beach'),
    highlight(orangeSlug, 'orange-shallows', '浅水区：清澈不等于没有风险', '当代海洋环境', '沙滩与浅海', '阳光、反射、海胆、礁石碎片与流速都可能在浅水造成伤害。', '风险管理应在下水前完成，而不是发生问题后再找装备。', '检查鞋具、防晒方式、救生衣和可见边界；不赤脚踩未知底质。', orangeSources, 'orange-safety'),
    highlight(orangeSlug, 'orange-coral', '珊瑚礁：保持水平、保持距离', '现代生态 / 长期生长', '浮潜点由运营商决定', '珊瑚是缓慢生长的活体生态结构，不是可站立的平台。', '一次脚蹼或手部接触就可能造成真实损伤。', '身体保持水平，脚蹼远离礁顶；不触摸、不喂鱼、不追逐。', orangeSources, 'orange-reef'),
    highlight(orangeSlug, 'orange-fish', '鱼群观察：颜色来自生态角色', '现代红海生态', '珊瑚与开阔水域', '不同体型、嘴形和游动层次反映觅食和栖息关系。', '把鱼当生态成员而非合影道具，观看会更丰富也更安全。', '慢速呼吸、保持距离，观察鱼在礁面、沙地与水柱的位置差异。', orangeSources, 'orange-reef'),
    highlight(orangeSlug, 'orange-boat', '船上纪律：返船时间比“再拍一张”重要', '当代运营安全', '码头、船上与集合点', '船程安全依赖点名、装备管理、天气判断和统一返航。', '个人迟到会影响整船，也可能在陌生海域造成风险。', '拍下船名、联系人、集合点与时间；手机离线保存并设置提前提醒。', orangeSources, 'orange-transfer'),
  ],
  sequence: [{ nodeId: 'orange-transfer', title: '01｜出发前核对运营商', body: '确认码头、接送、船名、保险、取消规则与项目包含。' }, { nodeId: 'orange-safety', title: '02｜船上完成装备与健康检查', body: '浮潜与潜水分别确认，不把宣传用语当资质安排。' }, { nodeId: 'orange-beach', title: '03｜上岛先确定集合点', body: '再安排休息、餐饮和下水。' }, { nodeId: 'orange-reef', title: '04｜以无接触方式观察珊瑚', body: '保持浮力和距离，服从当天海况管理。' }, { nodeId: 'orange-transfer', title: '05｜提前返船', body: '为更衣、清点物品和点名留足时间。' }],
  practical: ['草表只写“提前预订，含酒店接送”，未提供运营商或订单；接送、餐食、浮潜、潜水、装备和保险均待确认。', '水肺潜水需单独确认资质、健康条件、深度、教练比例与保险；不要把“潜水”自动理解为包含。', '使用对珊瑚更友好的防晒与防晒衣，带饮水、防水袋和防滑水鞋；不触摸或站立珊瑚。', '风浪或能见度可能改变当天项目；以船长和合规运营商决定为准。'], sourceIds: orangeSources, tags: ['红海', '浮潜', '珊瑚保护', '订单待确认'],
};

export const guideCatalog: CulturalGuide[] = [nmec, giza, gem, citadel, khan, abu, kom, edfu, luxor, valley, hatshepsut, colossi, karnak, orange];

export const guideBySlug = new Map(guideCatalog.map((guide) => [guide.slug, guide]));
