import { drawing, rect, strip, type RoomSpec } from './drawing';
const rooms:RoomSpec[]=[
 ['giza-khufu-base','01 · 胡夫金字塔',rect(893,728,234,234),[1010,845],'最大主塔与周围小塔、东侧墓园构成完整王陵体系。3D使用官方原始高度146.5米作为几何参照，不把完整尖顶当作今日保存状态。','giza-khufu'],
 ['giza-khafre-base','02 · 哈夫拉金字塔',rect(539,397,215,215),[646.5,504.5],'以葬祭殿、斜向甬道和河谷神庙读取完整复合体。3D原始高度143.5米，不含真实高地起伏，因此不能拿屏幕高度判断现地视觉。','giza-khafre'],
 ['giza-menkaure-base','03 · 孟卡拉金字塔',rect(203,212,105,105),[255.5,264.5],'较小主塔、三座附属塔、葬祭殿与延伸向低地的甬道分开表示。3D采用官方原始高度65米。','giza-menkaure'],
 ['giza-sphinx-body','04 · 狮身人面像',[[563,1147],[570,1144],[577,1150],[578,1159],[572,1169],[573,1196],[579,1196],[579,1223],[574,1223],[573,1203],[567,1203],[565,1222],[560,1222],[560,1197],[563,1197],[563,1170],[558,1162],[558,1154]],[568,1185],'依考古总图描绘基岩雕像投影。它与狮身人面像神庙及哈夫拉河谷神庙是三个独立对象；这里不以球体或长方体伪装雕像外观。','giza-sphinx'],
 ['giza-valley-footprint','05 · 哈夫拉河谷神庙',rect(481,1226,46,55),[504,1253],'位于甬道低地端的独立神庙。切换“河谷神庙内部”可看T形柱厅、16根方柱、前室与双门。'],
 ['giza-sphinx-temple','06 · 狮身人面像神庙',rect(536,1227,53,49),[562,1251],'位于巨像前方的独立石构神庙，不等于左侧的哈夫拉河谷神庙。保存、开放与可进入范围须现场核对。'],
 ['giza-khafre-causeway','07 · 哈夫拉上升甬道',[[633,742],[650,742],[527,1225],[516,1225]],[584,989],'从葬祭殿斜向连接河谷神庙的考古结构；保留源图方向与宽度，不将它画成承诺开放的步行导航。','giza-causeway','passage'],
 ['giza-khafre-mortuary','08 · 哈夫拉葬祭殿',rect(625,630,43,111),[646,688],'主塔旁的葬祭殿与低地河谷神庙分开登记。祭祀不是只在塔内发生，而是分布于整条复合体。'],
 ['giza-menkaure-mortuary','孟卡拉葬祭殿',rect(231,332,50,55),[257,360],'总图中主塔东侧的葬祭空间，与远处河谷神庙以细长甬道关联。'],
 ['giza-menkaure-valley','孟卡拉河谷神庙',rect(251,1038,52,76),[277,1079],'孟卡拉复合体低地端，不能与哈夫拉的河谷神庙合并。'],
 ['giza-menkaure-causeway','孟卡拉甬道遗迹',[[253,387],[260,387],[274,1038],[263,1038]],[262,707],'源图部分以虚线表示遗迹。这里只保留遗址关系，不推断路面保存与现时通行。',undefined,'passage'],
 ...([[143,163,31],[143,207,31],[139,253,39],[837,1020,47],[889,1020,49],[947,1020,49]] as const).map(([x,y,s],i):RoomSpec=>[`giza-queen-${i+1}`,`${i<3?'孟卡拉':'胡夫'}附属金字塔 ${i%3+1}`,rect(x,y,s,s),[x+s/2,y+s/2],'附属塔在来源中保留各自基址；没有将一组建筑压成一个点。',i===3?'giza-queens':undefined]),
 ['giza-khafre-satellite','哈夫拉卫星金字塔',rect(493,493,23,23),[504.5,504.5],'与主塔分立的小型附属建筑，沿用源图投影轮廓。'],
 ['giza-khufu-satellite','胡夫卫星金字塔',rect(868,990,22,22),[879,1001],'总图可见的小型附属塔，未为缺少尺寸资料的遗迹补造屋顶。'],
 ...([[842,1089,30,17],[876,1089,29,17],[916,1088,34,19],[959,1089,36,18],[842,1110,30,20],[876,1110,30,20],[916,1113,34,19],[959,1112,35,19],[842,1136,30,20],[876,1136,30,20],[916,1138,34,19],[959,1138,35,19],[896,1189,104,49]] as const).map(([x,y,w,h],i):RoomSpec=>[`giza-east-mastaba-${i+1}`,i===12?'东部墓园 · G7510':'东部墓园可辨墓址 '+(i+1),rect(x,y,w,h),[x+w/2,y+h/2],'按总图可见墓址轮廓登记，不推断内部房间、归属或游客开放。']),
];
const plateau=drawing({id:'giza-plateau-native',source:{id:'src-giza-plateau-plan',asset:'/maps/attractions/giza-plan.jpg',sha256:'6371625976d5c656d7ac74e5811f1a5081f63a91edec617f6d55ee9b57b2726b',width:4481,height:5955,projection:'orthographic',review:'Giza Archives orthographic plateau plan. Source north points to the right. Pyramid bases, independent temples, causeways and individually visible subsidiary bases traced without moving landmarks.'},drawingWidth:1372,floor:'高原总图 · 金字塔、神庙与甬道',bounds:[120,150,1130,1160],entry:null,entryBasis:'Archaeological plan does not establish current visitor gates.',rooms,labels:rooms.slice(0,8).map((r,i)=>[String(i+1).padStart(2,'0'),r[3],r[0]]),limitations:['北向为源图右方；本图不是地形测绘，也不是当前游客交通图。','三座主塔以原始高度构造理想几何参照；不伪装现状表面、包层损失或高地地形。','墓园仅登记图中可辨的部分墓址；未把空白区域解释为没有遗迹。']});
plateau.entry={status:'unmapped',notice:'考古总图不标定当前检票口，请使用当日官方入口信息。',basis:'Source is archaeological plan, not current access plan.'};
const factor=4481/1372;
plateau.solids=[['giza-khufu-base',146.5,'src-egypt-khufu'],['giza-khafre-base',143.5,'src-egypt-khafre'],['giza-menkaure-base',65,'src-egypt-menkaure']].map(([spaceId,meters,sourceId])=>{const s=plateau.spaces.find(r=>r.id===spaceId)!;const evidenceId=`${spaceId}-original-height`;plateau.evidence.push({id:evidenceId,sourceId:String(sourceId),bounds:plateau.bounds,claim:`Ministry of Tourism and Antiquities: original height ${meters} m. Source scale bar 300 m = 306 drawing units; flat datum, no claim to surveyed terrain or present envelope.`});return {id:`${spaceId}-ideal`,spaceId:String(spaceId),footprint:s.polygon,apex:s.anchor,height:Number(meters)*1.02*factor,heightBasis:'官方原始高度；理想几何参照，不是现状复原',evidenceId};});

const valleyRooms:RoomSpec[]=[
 ['giza-valley-pillared','T 形柱厅 · 16 根方柱',[[248,362],[332,362],[332,497],[392,497],[392,556],[191,556],[191,497],[248,497]],[292,481],'十六根花岗岩方柱支承原有顶盖；T形厅把材料、光线与王像安置组织为仪式空间。柱位来自平面，柱高未作实测复原。','giza-valley-temple'],
 ['giza-valley-vestibule','横向前室',rect(213,586,152,32),[288,603],'两端入口经横向前室连通，再通过中部短通道进入柱厅。注意空间转折，而不是把所有门想成一条直轴。',undefined,'hall'],
 ['giza-valley-link','前室与柱厅连接',rect(280,556,23,30),[291,571],'前室中央通向T形厅的窄通道。',undefined,'passage'],
 ['giza-valley-left-entry','左侧入口廊',rect(160,586,25,81),[172,632],'历史平面记录的双入口之一，不代表当日指定游客入口。',undefined,'passage'],
 ['giza-valley-right-entry','右侧入口廊',rect(402,584,25,83),[414,634],'历史平面记录的另一个入口廊，左右结构分别保留。',undefined,'passage'],
 ['giza-valley-left-link','左端连接廊',rect(185,596,28,11),[199,601],'双入口通向横向前室的连接。',undefined,'passage'],
 ['giza-valley-right-link','右端连接廊',rect(365,596,37,11),[382,601],'右端入口与前室连接。',undefined,'passage'],
 ...[165,190,214].map((x,i):RoomSpec=>[`giza-valley-side-${i+1}`,`侧室 ${i+1}`,rect(x,418,10,44),[x+5,440],'源图可见的狭长侧室，未推断原陈设与现时开放。',undefined,'side-room']),
 ['giza-valley-side-link','侧室横向连接',rect(165,465,60,10),[198,470],'三间侧室的横向连接空间。',undefined,'passage'],
 ['giza-valley-upper-side','上部侧室',rect(357,362,20,37),[367,382],'柱厅侧后方的小空间，沿用历史平面。',undefined,'side-room'],
 ['giza-valley-causeway-link','通向甬道的斜廊',[[402,407],[421,411],[450,297],[431,297]],[426,353],'斜向甬道连接高原葬祭殿，保持源图斜角，不拉直成普通房间。',undefined,'passage'],
];
const piers=[...[385,412,439,466,493].flatMap(y=>[273,303].map(x=>rect(x-4,y-4,8,8))),...[213,244,274,304,335,365].map(x=>rect(x-4,529-4,8,8))];
const valley=drawing({id:'giza-valley-interior',source:{id:'src-giza-valley-plan',asset:'/maps/attractions/khafre-valley-plan.jpg',sha256:'0268cfc6cbad9735cac27800bc45c805fa9f7d15d6ea81322fa1f2697fa4d482',width:1000,height:782,projection:'orthographic',review:'Harvard Digital Giza reproduction of Maragioglio & Rinaldi volume V plate 14 with material annotations. Native layer traces only left-hand Khafre Valley Temple; right-hand Sphinx Temple and photographic inset are excluded.'},drawingWidth:1000,floor:'河谷神庙内部 · T 形厅与双入口',bounds:[152,290,307,390],entry:'giza-valley-vestibule',entryBasis:'Architectural arrival vestibule on historical plan, not assertion of current ticket entrance.',rooms:valleyRooms,walls:[...piers,strip([244,358],[335,358],5),strip([244,358],[244,494],5),strip([335,358],[335,494],5),strip([186,494],[244,494],5),strip([335,494],[396,494],5),strip([187,494],[187,559],5),strip([396,494],[396,559],5),strip([187,559],[278,559],5),strip([304,559],[397,559],5),strip([209,583],[279,583],5),strip([304,583],[367,583],5),strip([210,621],[368,621],5)],limitations:['原图左侧为河谷神庙，右侧为狮身人面像神庙；此层只重绘左侧，不将两座庙拼成一座。','材料着色参考和照片插图未被当作墙体；16根方柱是来源支持的独立结构。']});
valley.spaces[0].holes=piers;
export const gizaArchitectureLevels=[plateau,valley];
