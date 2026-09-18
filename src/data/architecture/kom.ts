import { drawing, rect, strip, type RoomSpec } from './drawing';
const rooms:RoomSpec[]=[
 ['kom-river-stair','4 · 河岸台阶',[[360,339],[387,322],[392,328],[365,346]],[376,335],'原图标为Escalier的河岸阶梯；保留斜向位置，不从历史图推断当前可由河岸进出。',undefined,'passage'],
 ['kom-front-court','11 · 共同前庭',rect(148,279,117,53),[211,309],'前庭同时面向两条平行轴线；中间的祭坛基座与周边柱列不能误读为独立房间。先在这里辨认两个入口，再观察神庙的双重秩序。','kom-court','court'],
 ['kom-pronaos','6 · 外柱厅',rect(173,241,72,28),[209,254],'两列柱支撑的前柱厅，背后是第二柱厅。这里的柱位按原图逐个登记，不用装饰性网格代替。'],
 ['kom-hypostyle','5 · 内柱厅',rect(180,205,59,23),[209,217],'较深处的柱厅把共同空间导向双圣所。观察柱头、楣梁残留和两条轴线上相同位置的不同神祇。'],
 ['kom-foundation-hall','13 · 神庙奠基厅',rect(180,191,59,8),[211,195],'原图 Salle de la fondation du temple，位于内柱厅之后。该名称属于来源的房间识别，不宣称每个浮雕都在本模型中精确定位。'],
 ['kom-offering-hall','14 · 供奉厅',rect(180,177,59,8),[211,181],'原图 Salle des offrandes，处于连续横厅序列中。比较入口与中央隔断如何保持两组崇拜的联系和区分。'],
 ['kom-statue-hall','15 · 神像厅',rect(180,164,59,8),[211,168],'原图 Salle des statues。观看时把神像安置、供奉和进入至圣所的层级联系起来。'],
 ['kom-sanctuary-a','1 · 双至圣所之一',rect(188,143,13,14),[194,151],'原图编号1的独立圣所，与编号3成对。图上的两室始终保持两个独立地点；本图不把缺少原位证据的浮雕放进某一面墙。','kom-sanctuaries','sanctuary'],
 ['kom-sanctuary-b','3 · 双至圣所之二',rect(219,143,13,14),[225,151],'原图编号3的独立圣所。双重神庙分别服务索贝克和哈罗埃里斯及其神族；两个核心而非一个合并房间。',undefined,'sanctuary'],
 ['kom-ambulatory','2 · 外围通道',[[151,99],[258,99],[258,269],[270,269],[270,91],[143,91],[143,269],[151,269]],[263,163],'内外围护之间的通道在平面上环绕三面；该图可说明建筑关系，不承诺整圈现时都能连续通行。',undefined,'passage'],
 ['kom-hathor','7 · 哈托尔礼拜堂',rect(304,294,9,21),[308,306],'主庙外侧的小礼拜堂，是独立建筑，不与主庙内部侧室合并。其现时展陈和鳄鱼博物馆票务需现场核对。',undefined,'side-room'],
 ['kom-gateway','8 · 托勒密时期门址',rect(317,322,15,22),[325,334],'临河一侧的门址，原图文字注明托勒密统治时期。它不等于今天的检票入口。',undefined,'passage'],
 ['kom-well','9 · 井',[[242,380],[246,376],[254,376],[259,381],[259,389],[254,395],[247,395],[242,389]],[251,385],'圆形井口位于神庙与河岸之间。只标来源中的结构位置，不提供跨越围栏或靠近井缘的路线。'],
 ['kom-pylon','10 · 残存塔门',rect(198,331,21,9),[208,336],'前庭入口处的残存塔门位置。原图同时标出其严重残损，因此3D不复原一对想象的完整高塔。',undefined,'pylon'],
 ['kom-birth-house','12 · 诞生殿遗存',[[101,348],[128,348],[128,342],[145,342],[145,350],[173,350],[173,358],[103,358]],[138,353],'位于前庭外、接近河岸的诞生殿遗存；洪水与河岸变化造成损失，保留不规则遗存轮廓。'],
 ['kom-sobek-chapel','16 · 索贝克小礼拜堂',rect(115,103,8,21),[119,113],'原图Chapelle de Sobek的小型独立礼拜堂。不要与双圣所中的索贝克崇拜核心或现代鳄鱼博物馆混为一处。'],
];
const columns:Array<[number,number,number]>=[];
for(const y of [247,261])for(const x of [181,194,207,220,233])columns.push([x,y,1.7]);
for(const y of [210,221])for(const x of [190,201,212,224,235])columns.push([x,y,2.7]);
for(const y of [283,293,303,313,322])for(const x of [157,260])columns.push([x,y,2]);
for(const x of [169,179,190,222,232,243])columns.push([x,322,2]);
const walls=[strip([142,89],[278,89],5),strip([143,89],[143,272],5),strip([255,97],[255,274],5),strip([328,97],[328,284],8),strip([20,87],[323,64],8),strip([171,115],[247,115],4),strip([171,115],[171,269],4),strip([248,115],[248,269],4),strip([172,273],[200,273],4),strip([216,273],[248,273],4),strip([139,278],[139,335],4),strip([271,280],[271,338],4),strip([144,338],[197,338],4),strip([224,338],[272,338],4),...columns.filter(c=>c[1]>277).map(([x,y])=>rect(x-1,y-1,2,2)),strip([180,127],[239,127],3),strip([177,130],[177,203],3),strip([241,130],[241,203],3),strip([204,132],[204,160],3),strip([216,132],[216,160],3),strip([186,140],[203,140],3),strip([218,140],[233,140],3),strip([185,141],[185,161],3),strip([234,141],[234,161],3)];
// Printed 1–16 indices remain source identifiers, not visit-order numbering.
export const komArchitecture=drawing({id:'kom-double-temple',source:{id:'src-kom-labelled-plan',asset:'/maps/attractions/kom-ombo-labelled-plan.png',sha256:'d2dae28afd767b5e96e5b2e1a12d3f9f866528d0e806acede3fee1fec3b566f4',width:447,height:546,projection:'orthographic',review:'Janmad published plan, cross-checked against de Morgan 1894 plan held by the French Ministry of Culture. Independent rooms, columns, enclosure and subsidiary structures transcribed in original pixel orientation.'},drawingWidth:447,floor:'双重神庙 · 前庭、柱厅与圣所',bounds:[12,54,390,350],entry:'kom-front-court',entryBasis:'Source labels great court at temple front. Architectural entry, not modern ticket point.',rooms,walls,columns,labels:rooms.map(r=>[r[1].split(' · ')[0],r[3],r[0]]),limitations:['原图© Janmad，CC BY-SA 2.5；本重绘按同许可保留署名。建筑关系另对照法国文化部所藏1894年de Morgan平面。','原图1—16沿用原始索引；两圣所空间分别显示；源图左右神名与文物部门文字方位存在冲突，未据此硬绑具体神祇浮雕。','鳄鱼博物馆是单独的现代参观项目，来源未给其当代室内测绘，不拿哈托尔小堂冒充整个博物馆。']});
