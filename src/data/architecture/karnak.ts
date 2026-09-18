import { drawing, rect, strip, type RoomSpec } from './drawing';
import type { Ring } from './types';
const rooms:RoomSpec[]=[
 ['kar-a','A · 第一塔门',rect(342,1959,39,67),[361,1990],'阿蒙主区西面入口。两翼厚墙与中间开口分开建模，不把可通行门洞填成方块。','karnak-amun','passage'],
 ['kar-b','B · 大前庭',[[66,1514],[271,1514],[271,1571],[297,1571],[297,1594],[330,1594],[330,1570],[373,1570],[373,1514],[645,1514],[645,1572],[550,1572],[550,1718],[644,1718],[644,1956],[238,1956],[238,1838],[146,1838],[146,1956],[66,1956]],[389,1816],'宽阔前庭包含柱列、三联圣舟小堂和拉美西斯三世小神庙。先识别建筑在前庭中的嵌入关系，再进入大柱厅。',undefined,'court'],
 ['kar-c','C · 第二塔门通道',rect(336,1423,38,90),[355,1470],'连接大前庭和大柱厅的第二塔门。经过此处，视野从露天院落收束到密集柱群。',undefined,'passage'],
 ['kar-d','D · 大柱厅',[[60,1142],[279,1142],[279,1184],[333,1184],[333,1163],[375,1163],[375,1185],[432,1185],[432,1142],[650,1142],[650,1423],[60,1423]],[355,1311],'大柱厅的134根柱在独立细图中逐号保留。中央高柱与两侧较矮柱形成的采光高差，不能仅靠一张均匀网格理解。','karnak-hypostyle'],
 ['kar-e','E · 第三塔门通道',rect(335,1069,35,94),[352,1118],'大柱厅东端通道。塔门墙体压缩中心通道，并把观看者引向图特摩斯一世庭院。',undefined,'passage'],
 ['kar-thut-court','图特摩斯一世庭院',rect(87,992,526,73),[352,1036],'方尖碑与历代扩建共同组织的庭院；通过纪念物尺度和题名辨认建筑赞助者。','karnak-obelisk','court'],
 ['kar-f','F · 第四塔门通道',rect(338,922,30,72),[353,958],'从开敞庭院进入较早神庙核心的第四塔门。',undefined,'passage'],
 ['kar-g-n','G · 北侧奥西里斯柱厅',[[171,866],[277,866],[277,883],[335,883],[335,916],[171,916]],[231,891],'原图G北半。柱像与方尖碑之间的关系体现此区复杂的增建历史；不把一切遗存归于同一位国王。'],
 ['kar-g-s','G · 南侧奥西里斯柱厅',[[375,866],[576,866],[576,917],[375,917],[375,909],[429,909],[429,883],[375,883]],[488,892],'原图G南半，与北半保持独立可选区域。'],
 ['kar-h','H · 花岗岩圣舟圣所',rect(335,581,25,115),[349,634],'石质圣舟圣所位于更早核心。神像、圣舟和节庆移动有不同功能，不把供奉空间当作王墓。',undefined,'sanctuary'],
 ['kar-i','I · 中部开敞区',rect(150,299,460,275),[381,446],'原图I标明的开敞区域。在此辨认消失建筑的基址与仍存构件，避免用想象的完整房间覆盖空白。',undefined,'court'],
 ['kar-k','K · 图特摩斯三世节庆厅',rect(223,202,245,76),[349,240],'东部阿赫门努节庆建筑的主要柱厅。不同柱形和柱列节奏，与西面拉美西斯时代大柱厅不相同。'],
 ['kar-l-court','L · 拉美西斯三世小庙庭院',rect(580,1599,167,104),[656,1651],'嵌入大前庭南侧的小庙。它有自己的入口、院落、柱厅与内室，不是前庭的一块装饰。',undefined,'court'],
 ['kar-l-hall','L · 小庙柱厅',rect(769,1598,49,105),[793,1650],'拉美西斯三世小庙较深处的柱厅。'],
 ['kar-m1','M · 塞提二世三联小堂北室',rect(158,1855,72,29),[193,1870],'三联圣舟小堂中的一室；三间分别保留，不合并成一个无门的大盒子。',undefined,'sanctuary'],
 ['kar-m2','M · 塞提二世三联小堂中室',rect(158,1896,72,15),[192,1904],'三联小堂中间的独立室，入口朝向大前庭。',undefined,'sanctuary'],
 ['kar-m3','M · 塞提二世三联小堂南室',rect(158,1921,72,15),[192,1929],'三联小堂南室；原图M作为整组三联建筑编号。',undefined,'sanctuary'],
];
const secondary:Array<[string,number,number,number,number]>=[];
secondary.push(['西北侧室',108,75,37,69],['东部北侧室',290,95,32,78],['东部第一小室',366,94,30,38],['东部第二小室',403,94,29,38],['东部第三小室',439,94,32,38],['东部第四小室',480,94,36,38],['东北侧室',531,92,39,27],['东端室1',533,131,39,17],['东端室2',533,160,39,15],['东端室3',533,183,39,14],['东端室4',533,206,39,16],['东端室5',533,229,39,16],['东端室6',533,253,39,17],['东端室7',533,278,39,15],['节庆厅北柱室',402,147,63,40],['节庆厅西侧柱室',202,153,76,34],['祖先厅',204,109,68,25],['圣所北前室',238,653,74,15],['圣所北西室',245,582,24,53],['圣所北东室',279,582,25,53],['圣所南侧柱室',406,772,78,59],['圣所北侧柱室',225,776,77,37],['圣所西北柱室',146,726,55,83],['圣所北横厅',227,697,77,58],['圣所南横厅',402,697,62,58],['小庙内室1',828,1600,46,25],['小庙内室2',828,1642,46,18],['小庙内室3',828,1669,46,29]);
for(const [i,r] of secondary.entries())rooms.push([`kar-detail-${i}`,r[0],rect(r[1],r[2],r[3],r[4]),[r[1]+r[3]/2,r[2]+r[4]/2],'按原图可见墙线保留的独立空间；没有名称的室不臆测供奉对象、展品或现时开放状态。',undefined,'side-room']);
const walls:Ring[]=[rect(49,1958,290,68),rect(382,1958,267,68),rect(44,1430,288,78),rect(378,1430,287,78),rect(45,1070,287,66),rect(373,1070,265,66),rect(109,935,223,53),rect(383,935,209,53),strip([69,1515],[69,1955],9),strip([650,1717],[650,1954],9),strip([54,1140],[54,1292],8),strip([54,1330],[54,1426],8),strip([658,1140],[658,1293],8),strip([658,1330],[658,1425],8),strip([72,42],[621,42],18),strip([73,42],[73,1032],18),strip([623,43],[623,1030],18),strip([147,298],[335,298],10),strip([351,298],[522,298],10),strip([580,1591],[886,1591],10),strip([885,1590],[885,1710],10),strip([578,1710],[885,1710],10),strip([756,1590],[756,1637],8),strip([756,1664],[756,1710],8)];
// Only source-visible partitions: independent wall strips, not extruded room polygons.
for(const [,x,y,w,h] of secondary){walls.push(strip([x-3,y-3],[x+w+3,y-3],5),strip([x-3,y-3],[x-3,y+h+3],5),strip([x+w+3,y-3],[x+w+3,y+h+3],5));}
const cols:Array<[number,number,number]>=[];
for(const x of [85,116,148,178,209,239])for(const y of [1162,1193,1222,1251,1280,1311,1343,1373,1404])cols.push([x,y,7]);
for(const x of [467,499,530,561,591,622])for(const y of [1162,1193,1222,1251,1280,1311,1343,1373,1404])cols.push([x,y,7]);
for(const x of [270,436])for(const y of [1222,1251,1280,1311,1343,1373,1404])cols.push([x,y,7]);
for(const x of [330,381])for(const y of [1198,1240,1282,1323,1363,1403])cols.push([x,y,10]);
for(const x of [88,626])for(const y of [1530,1552,1574,1598,1621,1644,1668,1695,1718,1742,1767,1789,1813,1838,1860,1884,1905,1929])if(x===88||y<1574||y>1718)cols.push([x,y,6]);
for(const x of [315,404])for(const y of [1636,1668,1700,1734,1769])cols.push([x,y,7]);
for(const x of [238,258,278,298,318,338,357,376,395,415,434,454])for(const y of [209,229,251,272])cols.push([x,y,3]);
export const karnakMain=drawing({id:'karnak-amun-core',source:{id:'src-karnak-eb-plan',asset:'/maps/attractions/karnak-amun-plan.png',sha256:'ebe6e77671b01355b9d92b611e1ee9d3571f890aa4dd500091ba37edae631fa3',width:975,height:2160,projection:'orthographic',review:'Encyclopaedia Britannica 1911, vol2 p372, archaeological plan. Reviewed original, retained A–M letter key and north orientation. Source is historical, not present visitor access.'},drawingWidth:924,floor:'阿蒙主庙 · 西入口至东部节庆厅',bounds:[40,30,862,2005],entry:'kar-a',entryBasis:'First pylon is western monumental entry; Memphis field project describes visitor approach from west.',rooms,walls,columns:cols,labels:rooms.filter(r=>/^[A-M] ·/.test(r[1])).map(r=>[r[1][0],r[3],r[0]]),limitations:['字母沿用1911年出版图；布局经Digital Karnak建筑研究对照。历史遗存图不用于判断当日开放。','本分图是阿蒙主庙，不包含北蒙图区、南穆特区及全部现代设施；围区总览另见对应分图。']});

const numbered:Array<[number,number,number,number]>=[];
const y9=[742,687,635,583,511,458,405,352,298];
for(const [x,start] of [[1074,13],[1016,22],[959,31],[902,40],[845,49],[788,58],[154,126],[210,117],[269,108],[326,99],[383,90],[440,81]])y9.forEach((y,i)=>numbered.push([start+i,x,y,15]));
for(const [x,start] of [[497,74],[732,67]])y9.slice(0,7).forEach((y,i)=>numbered.push([start+i,x,y,15]));
for(const [x,start] of [[566,1],[667,7]])[734,660,585,512,440,366].forEach((y,i)=>numbered.push([start+i,x,y,18]));
export const karnakHall=drawing({id:'karnak-134-columns',source:{id:'src-karnak-memphis-plan',asset:'/maps/attractions/karnak-hypostyle-plan.jpg',sha256:'2f388beecde8015cd5d2db8eeb1e17c5a6d50f20c898551b2827b330da760ce9',width:1223,height:1163,projection:'orthographic',review:'University of Memphis Great Hypostyle Hall project plan, all numbered column circles 1–134 transcribed; central 12 and two 7-column inner rows differ from outer rows.'},drawingWidth:1223,floor:'大柱厅细图 · 134根柱与墙面方位',bounds:[70,38,1095,1029],entry:'kar-hall-entry',entryBasis:'Second pylon, western gateway, bottom of source sheet. North points LEFT, not up.',rooms:[
 ['kar-hall-entry','第二塔门 · 西入口',[[584,780],[647,780],[647,921],[657,921],[657,945],[641,945],[641,1033],[589,1033],[589,946],[574,946],[574,921],[584,921]],[614,875],'从大前庭通过第二塔门进入大柱厅，抬头比较中央高柱与两侧柱群。',undefined,'passage'],
 ['kar-north-half','北半柱群 · 塞提一世墙面',[[112,260],[485,260],[485,372],[529,372],[529,780],[112,780]],[321,543],'地图北方在左。北半柱群与北墙的主要装饰传统关联塞提一世；柱号是研究索引，点击空间后可放大查柱号。'],
 ['kar-nave','中央高柱通道 · 1–12',rect(530,374,173,405),[617,558],'两列各六根大型柱夹持中央轴线。抬头看开花纸莎草柱头与高侧窗关系，再比较两侧闭合花苞柱头。','karnak-hypostyle','passage'],
 ['kar-south-half','南半柱群 · 拉美西斯二世墙面',[[745,261],[1116,261],[1116,780],[704,780],[704,373],[745,373]],[937,546],'地图南方在右。南墙、东西两端墙和柱身题刻需分开阅读；场景位置依据研究墙段，不将图像任意贴入模型。'],
 ['kar-east-vestibule','东端前室与第三塔门',[[584,97],[645,97],[645,260],[700,260],[700,318],[529,318],[529,261],[584,261]],[614,232],'柱厅东端的前室与第三塔门开口。建筑顺序和墙面方位比“第几站”更适合现场定位。',undefined,'passage'],
 ],walls:[strip([134,71],[576,71],7),strip([655,71],[1101,71],7),strip([112,260],[486,260],7),strip([745,260],[1115,260],7),strip([107,260],[107,526],7),strip([107,566],[107,778],7),strip([1120,260],[1120,526],7),strip([1120,566],[1120,778],7),strip([126,781],[582,781],8),strip([648,781],[1101,781],8),strip([126,952],[581,952],7),strip([649,952],[1101,952],7)],columns:numbered.map(([,x,y,r])=>[x,y,r]),labels:[['W',[615,870],'kar-hall-entry'],['N',[321,544],'kar-north-half'],['轴',[617,551],'kar-nave'],['S',[938,548],'kar-south-half'],['E',[615,232],'kar-east-vestibule']],limitations:['北向为原图左侧；W/E/N/S是方位，不是参观顺序。','全部134个研究柱号保留，可放大查找；原图淡线表示不同保存或研究状态，不凭线色重建完整柱高。']});
karnakHall.columnLabels=numbered.map(([n,x,y])=>({text:String(n),point:[x,y]}));
const precinct=drawing({id:'karnak-precincts',source:{id:'src-karnak-plan',asset:'/maps/attractions/karnak-overall-plan.png',sha256:'57200e6c7d32fcbd37955a164551165fcdc19b9c961e5db5b0b9ebc29eef584b',width:2880,height:4320,projection:'orthographic',review:'Digital Karnak overall orthographic plan. Source PDF vector context retained; only individually identified monuments and precincts selected. No terrain or modern access inferred.'},drawingWidth:1280,floor:'围区总览 · 阿蒙、穆特、蒙图与圣湖',bounds:[660,145,453,785],entry:null,entryBasis:'Research plan, not modern public gate plan.',rooms:[
 ['kar-precinct-amun','阿蒙主围区',[[700,298],[946,325],[946,562],[700,577],[704,461],[724,460],[724,358],[700,356]],[904,344],'阿蒙围区不等于单座主殿；圣湖、孔苏神庙、南轴塔门和祭祀设施共同形成宗教城市。'],
 ['kar-precinct-montu','蒙图区',[[830,227],[900,229],[898,301],[828,300]],[864,262],'主围区北侧独立神庙围区，献给蒙图；是否开放与票务须另查，不能从图上连接线推定自由进入。','karnak-montu'],
 ['kar-precinct-mut','穆特区',[[787,748],[900,731],[900,919],[778,881]],[820,858],'主围区南侧独立围区，马蹄形圣湖围绕穆特神庙。面积和相对位置按研究图保留，现时开放不在本图中推断。','karnak-mut'],
 ['kar-sacred-lake','阿蒙圣湖',[[834,447],[895,451],[891,487],[832,482]],[862,465],'圣湖与祭司净化和仪式有关；它位于主轴南侧，而非大柱厅内部。','karnak-lake'],
 ['kar-khonsu-temple','孔苏神庙',[[732,521],[747,522],[744,562],[730,562]],[739,540],'位于阿蒙围区西南一角，保留自己的塔门、院落与殿堂序列；本层显示外轮廓，不虚构未经描摹的室内布局。','karnak-khonsu'],
 ['kar-south-axis','南向仪式轴',[[790,429],[807,429],[813,482],[827,523],[833,567],[800,571],[796,524],[789,482]],[810,503],'一连串塔门与庭院把阿蒙主区向穆特区延伸，连接奥佩特节的城市方向。不是当天可连续穿行的保证。','karnak-luxor-axis'],
 ['kar-main-temple-overview','阿蒙主庙建筑轴',rect(721,380,173,49),[830,405],'放大后的主庙层提供塔门、庭院、柱厅与圣所；此层用于把建筑轴放回整个围区。'],
 ],labels:[['阿蒙',[903,344],'kar-precinct-amun'],['蒙图',[864,262],'kar-precinct-montu'],['穆特',[820,858],'kar-precinct-mut'],['湖',[862,465],'kar-sacred-lake'],['孔苏',[739,540],'kar-khonsu-temple'],['南轴',[810,503],'kar-south-axis']],limitations:['研究总平面提供围区、圣湖和建筑关系，不把全部围区都标为游客已获准进入。','源PDF细线在2D和3D地面共同保留；围区不是高墙盒，3D不捏造实测地形。']});
for(const s of precinct.spaces)s.geometryRole='outline-region';
precinct.entry={status:'unmapped',notice:'围区总览不是现代检票与开放地图；到达主庙请切换西入口层。',basis:'Research source does not establish present-day entry.'};
precinct.contextAsset='/maps/attractions/karnak-precinct-context.json';
export const karnakArchitectureLevels=[karnakMain,karnakHall,precinct];
