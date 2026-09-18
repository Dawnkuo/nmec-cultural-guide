import { drawing, rect, strip } from './drawing';
import type { RoomSpec } from './drawing';
const source=(floor:'ground'|'upper')=>({id:'src-gem-authority-plans',asset:`/maps/attractions/gem-${floor}-plan.png`,sha256:floor==='ground'?'ed638b8d57d21b049e3278e4df434234b2528594decf0fe53a3d2f3ecfa71fd0':'3326fd85d23be6579807a0956a991de69935a251fd1b03efd049b61cc5d6ff00',width:2200,height:1556,projection:'orthographic' as const,review:`GEM Authority facilities prequalification, Annex plan ${floor==='ground'?'62':'68'}, CAD sheet dated 2016-06-15. Top-down floor plan with north arrow; skew/fanning structural axes retained as drawn, not squared to a grid. Historical construction/facility plan, not present-day visitor circulation.`});
const limits=['建筑基底来自 GEM Authority 2016 年发布的楼层图，作为有日期的建筑参考；不把旧服务分区当作今天仍开放的商铺或通道。','展览开放范围采用现行馆方资料；旧图与现行陈列不是同一版本，单件文物不从旧图推定坐标。'];
export const gemGround=drawing({id:'gem-arrival-level',source:source('ground'),drawingWidth:1888,floor:'入口层 · 大堂与抵达',bounds:[366,130,901,876],entry:'gem-atrium-space',entryBasis:'GEM Authority ground floor identifies Atrium; current visitor guide marks Main Entrance opening into Grand Hall. This maps the arrival hall, not a guessed ticket gate.',rooms:[
 ['gem-atrium-space','大堂／中庭',[[551,584],[979,381],[1176,640],[1060,649],[1025,605],[934,605],[960,649],[910,648],[886,606],[817,606],[842,648],[793,648],[765,605],[723,605],[763,684],[672,730],[643,683],[587,683]],[856,532],'大堂位于商业翼与展览翼之间，是馆方导览确认的到达空间。拉美西斯二世巨像在这里建立第一重尺度；图形定位到大厅，不把旧建筑图中的结构点当作今日巨像坐标。','gem-grand-hall','court'],
 ['gem-stairs-space','大楼梯',[[725,606],[783,606],[807,650],[832,650],[815,606],[893,606],[918,650],[959,650],[935,606],[1029,606],[1059,655],[887,783],[958,923],[905,957]],[851,740],'楼梯由大堂向上方展览层展开。现行馆方导览把这里作为大型雕塑序列；本图仅保留建筑平面投影，不把楼梯踏步数量或层高推测为实测。','gem-staircase','passage'],
 ['gem-retail-corridor','商业翼连廊',[[512,224],[588,235],[726,501],[664,530]],[620,382],'在建筑图中连接多组商业空间，与大堂相接。购物、餐饮与展厅入口要分别识别，不因位于同一栋楼就假定无需检票。',undefined,'passage'],
 ['gem-food-hall','商业翼北端公共区',[[373,135],[791,135],[908,281],[843,281],[825,267],[723,267],[694,260],[611,260],[587,231],[512,222],[409,219]],[640,198],'原图 Food Court 区域。保留这个翼部轮廓以帮助辨认整体建筑，不把2016年用途清单作为当前店铺指南。'],
 ['gem-reception','到达服务区域',[[1063,644],[1179,644],[1223,690],[1084,690]],[1143,671],'原图 Visitor Reception；現行服务台位置应现场核实。这一建筑区域不是预订凭证或专属集合点。'],
 ['gem-conference-stair','会议中心楼梯区',[[767,345],[837,345],[890,417],[826,444]],[831,392],'建筑图明确分开的会议中心交通核；不要与展览翼的大楼梯混为一处。',undefined,'passage'],
 ],walls:[strip([370,134],[415,215],4),strip([417,220],[550,582],4),strip([792,135],[1227,688],4),strip([552,585],[675,730],4),strip([588,235],[725,497],4),strip([513,227],[657,526],4),strip([700,569],[788,730],4),strip([729,605],[906,955],4),strip([1179,642],[1227,690],4)],limitations:limits});

// The 2016 architectural partitions are displayed as a dated reference layer.
// Present-day 01–12 thematic labels come from the 2025 photographed museum sign;
// the sign is NOT used directly as an oblique floor geometry.
const mainRooms:RoomSpec[]=[
 ['gem-g1','01 · 社会：史前至第一中间期',[[1017,1018],[1094,1018],[1149,1123],[1128,1123],[1168,1201],[1128,1201],[1120,1180],[1101,1180]],[1100,1114],'现场主展厅导览牌01：社会主题的早期部分。把生产、聚落、文字与国家组织联系起来；房形来自独立建筑平面，展柜不在本图中。','gem-main-galleries'],
 ['gem-g2','02 · 王权：史前至第一中间期',[[1075,963],[1216,963],[1252,1026],[1198,1026],[1239,1103],[1120,1103]],[1160,1040],'现场编号02。通过王像、王名与仪式器物，比较权力如何形成可重复的视觉符号。'],
 ['gem-g3','03 · 信仰：史前至第一中间期',[[1248,966],[1380,966],[1549,1104],[1410,1104],[1383,1060],[1303,1060]],[1403,1045],'现场编号03。关注墓葬设备与祭祀物之间的关系；不要把对象年代直接当作展厅建筑年代。'],
 ['gem-g4','04 · 信仰：中王国与第二中间期',[[1197,868],[1348,868],[1415,960],[1250,960]],[1302,915],'现场编号04。将来世观念、地方传统和王室信仰并置；展品位置可能调整。'],
 ['gem-g5','05 · 王权：中王国与第二中间期',[[1063,866],[1160,866],[1211,962],[1114,962]],[1140,919],'现场编号05。比较中王国王像的面部塑造和更早理想形式；具体作品以现场铭牌核对。'],
 ['gem-g6','06 · 社会：中王国与第二中间期',[[957,919],[1046,919],[1096,1016],[1008,1016]],[1020,968],'现场编号06。以工艺、行政与日常材料追踪社会变化。'],
 ['gem-g7','07 · 社会：新王国',[[862,709],[946,709],[1046,914],[956,914]],[944,820],'现场编号07。比较帝国时期的材料来源、生产组织与日常对象。'],
 ['gem-g8','08 · 王权：新王国',[[975,709],[1082,709],[1156,861],[1056,861],[996,751],[972,751]],[1070,793],'现场编号08。王权、军事与神庙赞助的视觉语言可以在这一主题线上交叉阅读。'],
 ['gem-g9','09 · 信仰：新王国',[[1100,709],[1229,709],[1286,756],[1212,813],[1342,868],[1212,866],[1188,826]],[1194,755],'现场编号09在导览牌上跨两个相接展区；不要把重复09误算成第十三展厅。采光庭院不是可穿越的展厅地面。'],
 ['gem-g10','10 · 信仰：第三中间期至希腊罗马',[[1015,554],[1123,554],[1225,693],[1093,693]],[1120,635],'现场编号10。留意传统埃及神祇形象与地中海文化交流，不把融合描述为单向替代。'],
 ['gem-g11','11 · 王权：第三中间期至希腊罗马',[[937,617],[1029,617],[1074,692],[965,692]],[1006,659],'现场编号11。不同政权借用既有符号表达统治合法性。'],
 ['gem-g12','12 · 社会：第三中间期至希腊罗马',[[804,585],[893,585],[945,693],[856,693]],[877,641],'现场编号12。对照另一端早期社会章节，观察数千年中保持与改变的生活方式。'],
 ['gem-upper-stairs','展览层楼梯平台',[[728,606],[782,606],[1042,1110],[988,1110]],[886,884],'大楼梯在展览翼中轴向上展开。展厅位于同一展览层，图坦卡蒙厅在楼梯另一侧；本图不据历史图推断当前检票与单向行进。',undefined,'passage'],
 ['gem-tut-envelope','图坦卡蒙展厅建筑范围',[[560,618],[615,618],[625,640],[652,640],[642,618],[701,618],[925,1089],[916,1115],[975,1234],[920,1234],[902,1200],[914,1234],[811,1234]],[754,887],'与主展厅分列大楼梯两侧。这里是2016年建筑图上的范围；2025年展陈设计方平面在独立分图中，不能把旧图分隔等同于当今展柜。'],
];
export const gemUpper=drawing({id:'gem-upper-level',source:source('upper'),drawingWidth:1888,floor:'展览层 · 十二主展厅',bounds:[548,540,1016,706],entry:'gem-upper-stairs',entryBasis:'Upper Grand Stairs position explicitly keyed by GEM Authority; this is not the ground arrival floor.',rooms:mainRooms,walls:[strip([558,619],[811,1234],5),strip([701,617],[975,1234],5),strip([803,585],[1168,1200],4),strip([1123,554],[1550,1106],4),strip([803,585],[892,585],4),strip([937,617],[1029,617],4),strip([1015,553],[1123,553],4),strip([866,704],[946,704],4),strip([984,704],[1076,704],4),strip([1105,704],[1214,704],4),strip([948,918],[1037,918],4),strip([1062,865],[1142,865],4),strip([1214,866],[1333,866],4),strip([1014,1018],[1085,1018],4),strip([1116,963],[1201,963],4),strip([1260,963],[1379,963],4)],labels:mainRooms.slice(0,12).map((r,i)=>[String(i+1).padStart(2,'0'),r[3],r[0]]),limitations:[...limits,'主展厅主题编号依据2025年现场导览牌，照片© Richard Mortel，CC BY 2.0；建筑边界依据馆方有日期的CAD图。此版本对照不是现时展柜测绘。']});
const tutRooms:RoomSpec[]=[
 ['gem-tut-north','图坦卡蒙厅 · 北侧长展廊',[[119,251],[164,158],[1127,79],[1057,212]],[668,171],'2025年展陈设计方平面中的北侧开放展廊。地面上的细线来自原始CAD，分别表示展柜、构件与展示设施；没有实物标签的柜不猜测器物身份。','gem-tut'],
 ['gem-tut-east','图坦卡蒙厅 · 东段开放展区',[[1131,63],[1943,0],[1863,213],[1696,226],[1644,344],[1581,344],[1617,227],[1468,235],[1412,368],[1327,366],[1364,240],[1290,240],[1248,332],[1153,336],[1190,242],[1124,241],[1109,212]],[1485,151],'东段展区在真实的斜轴建筑中展开；保留扇形边界与服务核心，不把这些房形校正成虚假的直角房间。'],
 ['gem-tut-south','图坦卡蒙厅 · 南侧长展廊',[[73,362],[1156,361],[1156,341],[1319,341],[1319,359],[1648,359],[1648,356],[1929,355],[1872,495],[12,495]],[1016,424],'南侧连续展廊与北侧展廊通过中间多个开放区域相连。棺椁、葬具及生活器物必须按现场展签核对；本图展示展陈空间，不把原墓室位置冒充博物馆展柜位置。'],
 ['gem-tut-central','中央开放连接区',[[360,270],[737,270],[715,347],[781,347],[814,271],[1009,258],[951,376],[328,385]],[646,354],'中间连接地带包含展陈岛和交通核。白色楼梯、卫生设施和后勤核心不是可任意穿越的展厅，不纳入可点选地面。',undefined,'passage'],
 ['gem-tut-display-a','西段独立展陈岛',[[444,286],[532,281],[534,338],[445,341]],[487,314],'设计图中的独立展陈岛，保留独立轮廓。对象身份未在这张公开平面上注明，因此不写成某件已确认文物的精确坐标。'],
 ['gem-tut-display-b','中央方形展陈岛',[[584,281],[671,276],[673,334],[585,339]],[629,308],'设计图中的另一组独立展陈构筑物，不以章节顺序替代其实际位置。'],
];
export const gemTut=drawing({id:'gem-tut-current',source:{id:'src-gem-tut-designer',asset:'/maps/attractions/gem-tut-drawing.png',sha256:'3adb44eff1db53871f3784938c05c06701fe00dc8692e68f704b61e281a1c494',width:2000,height:535,projection:'orthographic',review:'ATELIER BRÜCKNER 251222_TUT_floorplan_clean.pdf, 2025 exhibition-design floor plan. Long sloping structural axes are part of actual plan, not perspective rectification. CAD detail paths extracted; partitions and open spaces read independently.'},drawingWidth:2000,floor:'图坦卡蒙展厅 · 2025展陈平面',bounds:[8,0,1940,503],entry:null,entryBasis:'Designer sheet is exhibition arrangement, not current visitor entry signage.',rooms:tutRooms,walls:[strip([154,137],[1940,0],4),strip([1940,1],[1857,214],4),strip([12,498],[1871,498],4),strip([1872,493],[1928,356],4),strip([153,138],[98,286],4),strip([96,288],[359,279],3),strip([64,364],[327,361],3),strip([239,290],[204,356],3),strip([361,279],[328,357],3),strip([1005,253],[977,335],3),strip([977,338],[1108,331],3),strip([1140,246],[1109,329],3),strip([1182,244],[1144,333],3),strip([1144,335],[1234,333],3),strip([1271,240],[1235,332],3),strip([1339,237],[1303,328],3),strip([1304,331],[1371,328],3),strip([1397,237],[1372,326],3)],limitations:['来源：ATELIER BRÜCKNER发布的图坦卡蒙展陈设计平面，保留署名与原图链接；不是2016年旧建筑分区。','底层展柜线稿为原始PDF矢量路径，小于0.8来源像素的细碎制图笔画省略，不将它们挤出为墙。','设计图未逐柜标注全部文物身份，柜位与对象解释不能无证据绑定；入口检票位置按现场导视。']});
gemTut.contextAsset='/maps/attractions/gem-tut-context.json';
gemTut.spaces.find(s=>s.id==='gem-tut-central')!.holes=gemTut.spaces.filter(s=>s.id.startsWith('gem-tut-display-')).map(s=>s.polygon);
gemTut.entry={status:'unmapped',notice:'本分图是展陈设计平面；当天的展厅入口与行进方向按馆内导视。',basis:'Published design plan has no verified present entry arrow.'};
export const gemArchitectureLevels=[gemGround,gemUpper,gemTut];
