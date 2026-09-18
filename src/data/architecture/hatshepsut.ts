import { drawing, rect, strip } from './drawing';
import type { RoomSpec } from './drawing';
const hashes:Record<number,string>={275:'22328812648a9fab7b8f082ff24276529ad14f928130d699c8fa656355d91958',277:'15213a164ef831ee08f070558bd8dc8158c56bdea52fd9acb92ec566205fa3ab',279:'c0d4c136e5b5eb8975f1e3155ca688be5c7414a0d5ef26fd68ec6f32f92968b2',276:'926e2de975cbcc3c7a5c8f2708cb39ef8279212b23dd89ecead5fed2a5525ded',278:'f980e3c02f97648881e2d4305876641484c8a16834b1b609a429a707e94a3ac3'};
const src=(page:number)=>({id:'src-hatshepsut-oic-plan',asset:`/maps/attractions/hatshepsut-plate-${page}.png`,sha256:hashes[page],width:page%2?1209:1598,height:page%2?1600:2115,projection:'orthographic' as const,review:`ISAC OIC27 PDF page ${page}, inspected full spread and caption. Plates 34 (274–275), 35 south half (276–277), 36 north half (278–279). Separate detail scales are not silently joined or assigned storey numbers.`});
const limits=['按出版图页的原比例分别显示；图版34、35、36不是第一、第二、第三层的编号。','跨页细部没有强行拼接成测量级总图；点击空间与分图区签核对对应位置。','不推断坡度、高差与当前通行权限。'];
const lowerCols:Array<[number,number,number]>=[];
for(const y of [315,334,352,369,388,404,422,439,456,475,490,584,602,619,636,655,673,690,707,724,741,758])lowerCols.push([577,y,5.5]);
export const hatArrival=drawing({id:'hat-arrival-plan',source:src(275),drawingWidth:1209,floor:'东段 · 最低柱廊与坡道',bounds:[113,137,753,678],entry:'hat-east-ramp',entryBasis:'Plate34 Fig1 explicitly locates eastern approach and lowest colonnade divided by central ramp. Mapped to architectural approach, not ticket gates.',rooms:[
 ['hat-east-ramp','东侧中央坡道',rect(610,507,249,58),[746,536],'从东侧进入层层上升的建筑序列。图件中坡道把南北最低柱廊分开；这里定位的是建筑轴线，不是现代检票口。','hat-lower','passage'],
 ['hat-lower-n','C · 最低柱廊北半',rect(563,307,39,193),[581,409],'原图Section C北半，与南半分列坡道两侧。圆柱与前排方柱采用不同形状；下方另有放大细部，不能当成第二组建筑。'],
 ['hat-lower-s','C · 最低柱廊南半',rect(563,574,38,202),[582,678],'最低柱廊南半；入口的水平重复线条与背后的悬崖形成对照。'],
 ['hat-middle-court','中层开敞台地',[[217,170],[555,170],[555,776],[217,776]],[389,425],'最低柱廊之后的开敞台地，中央继续向西接入更高层级。庭院是露天空地，不用房间体块填满它。','hat-middle','court'],
 ['hat-central-link','中轴西向坡道口',rect(117,507,100,61),[171,538],'总平面右页继续向左页的轴线连接；跨图段只说明关系，不绘制凭空测得的坡度。',undefined,'passage'],
 ],walls:[strip([214,169],[600,169],3),strip([215,170],[215,502],3),strip([215,568],[215,779],3),strip([214,783],[601,783],4),strip([560,306],[605,306],3),strip([558,307],[558,501],3),strip([605,306],[605,484],3),strip([558,504],[861,504],3),strip([558,570],[860,568],3),strip([558,574],[558,775],3),strip([603,576],[602,815],3),...lowerCols.map(([,y])=>rect(591,y-3,7,6))],columns:lowerCols,limitations:limits});

const southCols:Array<[number,number,number]>=[];
for(const y of [421,479,532,584,638,693,746,800,854,905,958])southCols.push([151,y,15]);
for(const [x,ys] of [[128,[1084,1138,1190,1257,1306,1354]],[190,[1084,1138,1257,1306,1354]],[242,[1138,1257,1306]],[285,[1084,1138,1306,1354]],[336,[1084,1138,1306,1354]]] as Array<[number,number[]]>)for(const y of ys)southCols.push([x,y,14]);
const southPillars=[...Array.from({length:11},(_,i)=>rect(299,447+i*50,19,19)),...Array.from({length:11},(_,i)=>rect(351,447+i*50,19,19)),...Array.from({length:11},(_,i)=>rect(196,412+i*54,18,18))];
export const hatSouth=drawing({id:'hat-middle-south',source:src(277),drawingWidth:1209,floor:'中层南侧 · 庞特与哈托尔',bounds:[91,344,359,1092],entry:null,entryBasis:'Detail sheet, not arrival floor.',rooms:[
 ['hat-punt','庞特远征柱廊',rect(264,414,135,591),[329,723],'原图明确标注 Expedition to Punt / Middle Colonnade。先看船与货物组织的远征叙事，再辨认植物、人物和铭文；浮雕不是单纯旅行写生，而是王权成功的视觉证据。'],
 ['hat-south-upper-col','上层南半柱廊投影',rect(107,414,137,591),[173,706],'同一分图同时画出上层柱廊与中层柱廊的平面关系；这不是两个并列展厅，不在3D中猜测其真实高差。'],
 ['hat-hathor-hall','哈托尔柱厅',[[100,1055],[228,1055],[228,1102],[263,1102],[263,1055],[371,1055],[371,1392],[263,1392],[263,1345],[229,1345],[229,1392],[100,1392]],[226,1228],'南侧独立哈托尔礼拜单元的柱厅。注意圆柱与方柱、哈托尔面孔柱头和相邻内室；它不在阿蒙中央圣所内。','hat-hathor'],
 ],walls:[strip([103,416],[104,1007],3),strip([248,413],[248,1005],4),strip([264,412],[399,412],4),strip([400,417],[400,1100],4),strip([261,416],[261,1007],3),strip([263,1008],[398,1008],3),strip([100,1051],[225,1051],3),strip([94,1051],[94,1392],4),strip([98,1395],[229,1395],4),strip([263,1395],[372,1395],4),strip([374,1104],[374,1392],4),...southPillars],columns:southCols,limitations:[...limits,'此细图同时投影上下柱廊，3D仅为同平面剖切，不当作真实同层步行空间。']});

const northCols:Array<[number,number,number]>=[];
for(const x of [271,322,373])for(const y of [387,437,491,542])northCols.push([x,y,14]);
for(const x of [446,495,542,588,635,683,731,778,827,873,920,967,1014,1062,1109])northCols.push([x,322,12]);
for(const y of [724,771,822,873,924,975,1026,1076,1127,1179,1228])northCols.push([182,y,14]);
export const hatNorth=drawing({id:'hat-middle-north',source:src(279),drawingWidth:1209,floor:'中层北侧 · 诞生与阿努比斯',bounds:[57,303,371,946],entry:null,entryBasis:'North detail is not an arrival diagram.',rooms:[
 ['hat-anubis-hall','阿努比斯十二柱厅',[[231,352],[394,352],[394,511],[418,511],[418,576],[232,576]],[324,466],'原图 Shrine of Anubis 的十二柱厅。把葬祭神祇语境与整座葬祭殿相联系，观察此处与开敞台地不同的围合与采光。','hat-anubis'],
 ['hat-anubis-passage','阿努比斯内室前廊',[[119,443],[225,443],[225,477],[119,477]],[178,461],'从柱厅通往岩凿内室的折转连接。图上窄门与转折保留；现场是否允许进入另行核对。',undefined,'passage'],
 ['hat-anubis-inner','阿努比斯内室',rect(118,321,23,122),[130,388],'相对于柱厅更深、更窄的独立空间。题刻编号属于研究定位系统，不改成自造的参观编号。',undefined,'sanctuary'],
 ['hat-anubis-rear','阿努比斯后侧室',rect(66,332,49,18),[90,341],'原图后端转折的小室，不与前廊合并。',undefined,'side-room'],
 ['hat-birth','神圣出生柱廊',rect(280,679,137,550),[349,957],'原图 Royal Birth Scenes / Middle Colonnade。神圣出生叙事建立统治的神意依据；先按场景分区观察，再阅读人物与神祇关系。'],
 ['hat-north-upper-col','上层北半柱廊投影',rect(143,679,119,551),[202,962],'原图标Upper Colonnade，与相邻Middle Colonnade不是同一高度；此分图说明建筑关系，不绘制臆测楼层高差。'],
 ],columns:northCols.filter(c=>c[0]<420),walls:[strip([231,350],[398,350],4),strip([230,353],[231,573],4),strip([399,351],[399,511],4),strip([418,513],[418,576],4),strip([232,578],[391,578],4),strip([117,322],[117,432],4),strip([147,315],[149,432],4),strip([110,488],[229,488],4),strip([281,676],[397,676],4),strip([279,679],[279,1231],4),strip([420,678],[420,1195],4),strip([280,1235],[427,1235],4),...Array.from({length:11},(_,i)=>rect(322,699+i*48,18,18)),...Array.from({length:11},(_,i)=>rect(371,699+i*48,18,18)),...Array.from({length:11},(_,i)=>rect(223,713+i*50,18,18))],limitations:[...limits,'右侧延伸的开敞地面在原图没有封闭边界，因此不虚构围墙。']});

const upperRooms:RoomSpec[]=[
 ['hat-upper-court-n','上层庭院北半',[[630,1014],[1207,1014],[1207,1417],[1199,1590],[627,1590]],[921,1260],'上层开敞庭院的北半，围柱与西侧岩凿圣所共同形成核心。庭院在跨页南半继续，不能把本页裁边当墙。','hat-upper','court'],
 ['hat-altar-court','VII · 太阳祭坛庭院',[[716,721],[1051,721],[1051,817],[1080,817],[1080,847],[1051,847],[1051,943],[716,943]],[971,826],'原图VII环绕中央祭坛。它是敞开的礼拜庭院，祭坛与其台阶单独作为构筑物，不把整个庭院拉成建筑。',undefined,'court'],
 ['hat-altar-hall','VI · 祭坛庭院前柱室',[[1109,721],[1206,721],[1206,943],[1192,943],[1192,1002],[1168,1002],[1168,945],[1109,945]],[1157,837],'原图VI，三柱前室，连接祭坛庭院。'],
 ['hat-room-viii','VIII · 祭坛北侧室',[[862,564],[893,564],[893,693],[881,693],[881,717],[870,717],[870,693],[862,693]],[877,624],'原图VIII，保留原室号；不根据方向猜测供奉对象。',undefined,'side-room'],
 ['hat-room-ix','IX · 祭坛西侧室',rect(620,722,43,213),[642,823],'原图IX，独立长形室，旁边窄连接通向祭坛庭院。',undefined,'side-room'],
 ['hat-amun-x','X · 阿蒙圣所前段',rect(350,1411,205,67),[451,1448],'原图X，西向深入岩壁的圣所前段；别把开敞庭院、横向柱廊与岩凿内室当作同一空间。',undefined,'sanctuary'],
 ['hat-amun-xi','XI · 阿蒙圣所中段',[[243,1426],[319,1426],[320,1438],[349,1438],[349,1458],[320,1458],[320,1471],[242,1471]],[281,1448],'原图XI，与前段通过窄口连接。',undefined,'sanctuary'],
 ['hat-amun-xiv','XIV · 阿蒙圣所末段',rect(142,1426,69,45),[175,1449],'原图XIV最西侧内室，室号保留原文，不编号成现场参观次序。',undefined,'sanctuary'],
 ['hat-amun-xii','XII · 圣所北侧室',rect(270,1352,27,51),[284,1378],'原图XII，小室与中央内室相通；非任意装饰盒子。',undefined,'side-room'],
 ['hat-amun-xiii','XIII · 圣所南侧室',rect(271,1497,27,38),[284,1516],'原图XIII，开放状态不由历史图推断。',undefined,'side-room'],
];
const upperColumns:Array<[number,number,number]>=[];
for(const y of [1056,1104])for(const x of [657,718,779,841,904,966,1029,1091,1155])upperColumns.push([x,y,16]);
for(const y of [1156,1206,1255,1306,1354,1406,1501,1548])for(const x of [658,719,1095,1155])upperColumns.push([x,y,16]);
for(const y of [752,808,899])upperColumns.push([1155,y,16]);
export const hatUpper=drawing({id:'hat-upper-north-sanctuary',source:src(278),drawingWidth:1376,floor:'上层 · 太阳祭坛与阿蒙圣所',bounds:[135,550,1093,1054],entry:null,entryBasis:'Upper courtyard and sanctuary detail; arrival remains lowest colonnade.',rooms:upperRooms,columns:upperColumns,walls:[strip([614,1004],[1197,1004],8),strip([620,1021],[619,1402],6),strip([1211,1008],[1215,1423],7),strip([717,717],[1055,717],5),strip([713,720],[713,944],5),strip([716,944],[1055,944],5),strip([1057,722],[1057,811],5),strip([1057,850],[1057,944],5),rect(850,773,82,111),strip([1105,720],[1105,814],5),strip([1106,848],[1106,943],5),strip([1208,719],[1208,941],5),strip([862,553],[907,553],5),strip([858,555],[858,694],5),strip([907,555],[907,694],5),strip([618,720],[618,941],5),strip([666,720],[666,941],5),strip([352,1408],[556,1408],7),strip([352,1481],[556,1481],7),strip([241,1421],[317,1421],7),strip([242,1478],[317,1478],7),strip([140,1422],[213,1422],6),strip([140,1476],[214,1476],6)],labels:upperRooms.map(r=>[r[1].match(/^[IVX]+/)?.[0]??'院',r[3],r[0]]),limitations:limits});
const southUpperRooms:RoomSpec[]=[
 ['hat-upper-court-s','上层庭院南半',rect(622,419,616,363),[910,565],'与北半庭院连续的开敞空间。西侧岩壁圣所与南侧供奉室分别进入，图页裁边不视为建筑墙体。',undefined,'court'],
 ['hat-offering-i','I · 南侧供奉区外廊',[[1197,799],[1233,799],[1240,861],[1240,1092],[1169,1092],[1169,977],[1135,977],[1135,861],[1141,861],[1141,834],[1168,834],[1168,861],[1197,861]],[1209,996],'原图I，南侧供奉区入口外廊；从庭院进入更围合的礼仪建筑。',undefined,'passage'],
 ['hat-offering-ii','II · 供奉区前室',[[994,861],[1107,861],[1107,1092],[994,1092],[994,1047],[1006,1047],[1006,1006],[994,1006]],[1050,960],'原图II，向两组供奉室分配的前室。分隔墙与门口保留，不把整个南翼画成一个房间。'],
 ['hat-offering-iii','III · 哈特谢普苏特供奉室',[[624,965],[945,965],[945,1010],[991,1010],[991,1044],[944,1044],[944,1092],[624,1092]],[790,1035],'原图明确标Offerings to Hatshepsut。墙面祭品列队、仪式和王名把供奉组织为持续发生的行为，而非一张食物清单。',undefined,'sanctuary'],
 ['hat-offering-iv','IV · 图特摩斯一世供奉室',[[755,861],[875,861],[875,876],[934,876],[934,861],[991,861],[991,925],[934,925],[934,907],[874,907],[874,925],[755,925]],[817,891],'原图明确标Offerings to Thutmose I。比较与女王供奉室的尺度和主题，理解王室血统在葬祭建筑中的呈现。',undefined,'sanctuary'],
 ['hat-offering-v','V · 南侧小室',rect(622,862,71,62),[657,892],'原图V。保留独立房号与边界，不猜测没有来源支持的具体陈设。',undefined,'side-room'],
 ['hat-hathor-inner-hall','哈托尔双柱内厅',rect(1142,1263,89,155),[1182,1343],'哈托尔礼拜堂的双柱内厅；东边连接另一分图中的外柱厅，西侧进入岩凿空间。','hat-hathor'],
 ['hat-hathor-sanctuary','哈托尔岩凿内室',[[912,1324],[977,1324],[977,1290],[987,1290],[987,1325],[1031,1325],[1031,1304],[1040,1304],[1040,1326],[1072,1326],[1072,1305],[1080,1305],[1080,1326],[1137,1326],[1137,1352],[1080,1352],[1080,1375],[1072,1375],[1072,1353],[1040,1353],[1040,1375],[1031,1375],[1031,1353],[987,1353],[987,1393],[977,1393],[977,1354],[912,1354]],[1060,1340],'柱厅后方的岩凿内室带有凹入侧室；不将岩壁外形当作室内地面。',undefined,'sanctuary'],
 ['hat-hathor-north-room','哈托尔北侧小室',rect(1207,1203,22,56),[1218,1232],'双柱厅北侧的独立小室，门槛与通道位置依据原图。',undefined,'side-room'],
 ['hat-hathor-south-room','哈托尔南侧小室',rect(1207,1420,22,64),[1218,1450],'双柱厅南侧的独立小室，不推断现时开放。',undefined,'side-room'],
];
const upperSouthCols:Array<[number,number,number]>=[];
for(const y of [430,482,535,585,638,690,742])for(const x of [659,724,1119,1182])upperSouthCols.push([x,y,18]);
for(const y of [690,742])for(const x of [793,861,925,986,1057])upperSouthCols.push([x,y,18]);
upperSouthCols.push([1182,1307,18],[1182,1374,18]);
export const hatUpperSouth=drawing({id:'hat-upper-south',source:src(276),drawingWidth:1376,floor:'上层南侧 · 供奉室与哈托尔内室',bounds:[607,416,654,1087],entry:null,entryBasis:'Plate35 left half is upper court southern section and Hathor inner chapel, not ground entrance.',rooms:southUpperRooms,columns:upperSouthCols,walls:[strip([611,421],[611,1098],7),strip([622,788],[1014,788],7),strip([661,794],[661,855],5),strip([660,859],[872,859],5),strip([620,959],[946,959],7),strip([619,1103],[1108,1103],8),strip([1109,861],[1109,1097],6),strip([945,965],[945,1004],6),strip([948,1048],[948,1093],6),strip([1199,791],[1199,860],5),strip([1245,800],[1245,1101],6),strip([914,1316],[968,1316],6),strip([913,1360],[969,1360],6),strip([1141,1264],[1141,1320],6),strip([1140,1357],[1140,1417],6)],labels:southUpperRooms.map(r=>[r[1].match(/^[IVX]+/)?.[0]??(r[0].includes('hathor')?'H':'院'),r[3],r[0]]),limitations:limits});
export const hatshepsutArchitectureLevels=[hatArrival,hatSouth,hatNorth,hatUpper,hatUpperSouth];
