import { drawing, rect, strip } from './drawing';
import type { RoomSpec } from './drawing';
const rooms:RoomSpec[]=[
 ['luxor-door','北端塔门门道',rect(248,1453,21,47),[259,1476],'从北端中央门道进入拉美西斯二世庭院。塔门与后方十八王朝轴线并非完全重合；地图保留这处转折，而不是拉成一条直线。','luxor-pylon','passage'],
 ['luxor-court-r','A · 拉美西斯二世庭院',[[145,1139],[422,1139],[394,1454],[359,1454],[359,1380],[278,1380],[278,1454],[121,1451]],[266,1290],'较晚的庭院把已有三联舟祠和新建筑整合进来。两列柱廊与巨像构成边界，东侧上方仍可见阿布·哈加格清真寺的叠加历史。','luxor-rameses-court','court'],
 ['luxor-chapel-amun','B · 阿蒙舟祠',rect(310,1406,17,41),[318,1425],'原图B三联舟祠中央室，对应阿蒙；用三个并排空间理解底比斯三神，而不是把它当庭院中的装饰盒子。',undefined,'side-room'],
 ['luxor-chapel-mut','B · 穆特舟祠',rect(331,1407,14,42),[338,1426],'三联舟祠的一间，原图详图保留穆特名称。各室位置采用总图，不移植详图的独立比例。',undefined,'side-room'],
 ['luxor-chapel-khonsu','B · 孔苏舟祠',rect(285,1405,13,41),[291,1426],'三联舟祠的另一间，对应孔苏。入口开放情况以现场为准。',undefined,'side-room'],
 ['luxor-colonnade-space','十四柱廊',[[228,844],[328,844],[339,1110],[236,1110]],[281,974],'七对高柱形成纵向廊道。沿墙阅读奥佩特节相关仪式，再回望庭院与柱廊尺度的转换。这里不是随意复制的柱网，十四个柱位均按图记录。','luxor-colonnade','passage'],
 ['luxor-court-a','C · 阿蒙霍特普三世庭院',[[139,565],[404,560],[416,811],[337,816],[337,840],[285,840],[285,774],[265,774],[265,840],[213,840],[213,822],[140,822]],[272,692],'两列柱廊围合开敞庭院。它与前方柱廊合成更早的建筑轴线；比较这里的规整围合与拉美西斯庭院的转折。','luxor-amenhotep','court'],
 ['luxor-hypostyle','三十二柱厅',[[179,475],[357,470],[362,551],[184,558]],[273,515],'由露天庭院转入密集柱厅，八列四排柱位构成更强的围合。中轴留出参观与仪式阅读方向，不能据此承诺当前单向路线。'],
 ['luxor-roman','D · 内部厅室／罗马层叠',[[219,401],[310,398],[309,450],[276,450],[276,463],[259,463],[259,451],[219,451]],[265,428],'内厅可联系神庙后来的罗马时期使用。建筑墙面存在不同年代叠加，具体绘画与题刻需结合现场铭牌，不把所有画面统一解释为法老时代。','luxor-inner'],
 ['luxor-anterior','E · 圣舟圣所前室',rect(230,331,59,54),[260,359],'前室位于圣舟圣所之前。它与两侧房间分开，原图中的四处柱位保留为独立结构。'],
 ['luxor-sanctuary-space','圣舟圣所',[[237,262],[280,262],[282,316],[238,316]],[260,289],'中轴圣舟空间，后期重建与王权合法性的表达相连。定位到房间，不猜测圣舟陈设的当代坐标。','luxor-sanctuary','sanctuary'],
 ['luxor-rear-hall','F · 后部柱厅',[[193,207],[314,204],[314,248],[193,254]],[252,229],'圣舟圣所后方另有柱厅与末端小室，神庙并不止于一个孤立的“终点房间”。'],
 ['luxor-back-left','后端侧室',rect(196,160,29,36),[211,178],'原图后端的独立柱室，保留轮廓，不编造室名。',undefined,'side-room'],
 ['luxor-back-centre','后端中央室',rect(234,158,43,38),[255,178],'后部中轴的小型柱室，和前面的圣舟圣所不能混为一处。',undefined,'sanctuary'],
 ['luxor-back-right','后端另一侧室',rect(287,156,28,38),[301,176],'后部小室，开放以现场管理为准。',undefined,'side-room'],
 ['luxor-west-anterior','西侧柱室',[[177,266],[218,266],[222,327],[179,326]],[200,295],'图中清楚分开的侧向柱室。这里的柱数和后部房间不同，不按对称关系复制另一侧。',undefined,'side-room'],
 ['luxor-west-front','西侧前室',[[176,337],[220,337],[224,386],[178,386]],[200,361],'临近中轴前室的独立侧空间。',undefined,'side-room'],
 ['luxor-east-anterior','东侧内室',[[299,259],[346,258],[350,318],[299,319]],[326,287],'图中东侧的内室轮廓，与西侧不同。',undefined,'side-room'],
 ['luxor-east-front','东侧前室',[[300,328],[351,327],[351,369],[300,369]],[326,349],'圣舟区另一侧的前室；不推测室内主题或封闭状态。',undefined,'side-room'],
];
const columns:Array<[number,number,number]>=[];
// Explicit row/column sets transcribe repeated circles printed in the plate.
for(const y of [868,902,937,970,1005,1040,1078])for(const x of [257,299])columns.push([x,y,9]);
for(const y of [484,505,528,550])for(const x of [194,213,234,254,285,304,324,344])columns.push([x,y,4.7]);
for(const y of [582,603,624,645,665,685,706,727,749,781,802])for(const x of [157,179,374,397])columns.push([x,y,4.7]);
for(const y of [783,803])for(const x of [198,219,238,256,298,319,340,358])columns.push([x,y,4.7]);
for(const y of [1160,1181])for(const x of [164,185,204,224,244,326,346,365,385,404])columns.push([x,y,6]);
for(const y of [1203,1224,1247,1270])for(const x of [156,180,376,397])columns.push([x,y,6]);
for(const y of [1291,1314,1337,1360,1383,1405,1433])for(const x of [369,390])columns.push([x,y,6]);
for(const [x,y] of [[209,169],[209,187],[242,168],[267,168],[243,186],[267,186],[300,165],[301,184],[207,220],[226,220],[245,220],[266,220],[285,218],[304,218],[207,240],[226,240],[246,239],[266,238],[285,235],[304,236],[204,277],[205,292],[207,307],[206,345],[207,360],[209,375],[251,346],[272,346],[252,365],[272,365]])columns.push([x,y,4.7]);
export const luxorArchitecture=drawing({id:'luxor-ground',source:{id:'src-luxor-plan',asset:'/maps/attractions/luxor-key-plan.png',sha256:'222bd9b02fc0921bb5c7b1862a4dee1460b602d3c35cf7393e36efc627e3e002',width:1598,height:2115,projection:'orthographic',review:'ISAC OIC27 Luxor Key Plan, left figure only, displayed coordinates 1376 wide uniformly scaled to source. Right-hand section is separate detail scale, not pasted into main floor geometry.'},drawingWidth:1376,floor:'地面层 · 塔门至内殿',bounds:[89,134,351,1370],entry:'luxor-door',entryBasis:'Key Plan explicitly labels NORTH below north pylon; central opening is the historical temple arrival.',rooms,columns,walls:[strip([106,1480],[246,1485],15),strip([274,1487],[397,1493],16),strip([107,1461],[141,1125],12),strip([402,1476],[427,1130],12),strip([140,1130],[271,1130],11),strip([291,1129],[426,1130],11),strip([220,1114],[214,843],9),strip([345,1114],[337,838],9),strip([133,827],[128,557],8),strip([129,557],[176,557],8),strip([372,552],[414,552],8),strip([416,554],[424,820],8),strip([140,831],[209,831],7),strip([342,823],[416,823],7),strip([172,554],[165,391],7),strip([367,552],[360,386],7),strip([168,389],[354,380],7),strip([214,402],[214,463],7),strip([314,399],[314,464],7),strip([162,386],[150,145],7),strip([352,379],[351,140],7),strip([153,145],[352,138],7),strip([226,265],[228,327],7),strip([294,259],[296,329],7),strip([235,259],[278,257],6),strip([191,255],[228,254],6),strip([292,251],[349,249],6),strip([192,203],[314,199],5)],labels:[['A',[263,1289],'luxor-court-r'],['B',[318,1425],'luxor-chapel-amun'],['C',[272,692],'luxor-court-a'],['D',[265,428],'luxor-roman'],['E',[260,359],'luxor-anterior'],['F',[252,229],'luxor-rear-hall']],limitations:['沿用原图 Section A–F 的分区字母；原图G还包括围墙与外部装饰，不人为圈成一个封闭房间。','清真寺为跨时代叠加空间，不在本历史地面平面上虚构楼层几何。','柱位来自图上圆圈，方形结构与墙体另绘；不把空白地面整体拉成立方体。']});
