import { drawing, rect, strip, type RoomSpec } from './drawing';
import type { Ring } from './types';
const siteRooms:RoomSpec[]=[
 ['citadel-public-gate','Bab al-Jabal · 图示游客入口',[[461,522],[482,522],[486,545],[466,548]],[475,533],'来源地图注明的游客入口，连接停车区域与城堡内部。此标注有来源，但当天开放门和安检安排仍以现场为准。','citadel-fort','passage'],
 ['citadel-mosque-footprint','穆罕默德·阿里清真寺',[[143,526],[245,424],[270,440],[251,466],[245,515],[289,568],[286,579],[293,590],[270,611],[250,607],[186,552]],[234,543],'外轮廓明确分成院落与穹顶礼拜殿两部分。请切换清真寺室内分图，看四根主墩、庭院柱廊和净礼喷泉，不用这个总图猜室内。','citadel-mosque-exterior'],
 ['citadel-nasir','纳西尔·穆罕默德清真寺',[[306,517],[353,465],[412,500],[360,562]],[359,512],'城堡内另一座独立清真寺，年代、赞助者和建筑语言不同；不与穆罕默德·阿里清真寺混淆。'],
 ['citadel-harim','军博／哈里姆宫外轮廓',[[466,248],[501,212],[552,224],[560,239],[632,280],[627,304],[666,258],[709,278],[690,326],[656,351],[622,420],[579,393],[550,423],[559,430],[546,447],[514,428],[576,358],[622,382],[640,349],[622,336],[543,303],[526,324],[505,313],[521,287]],[596,294],'复杂宫殿翼部属于北围区，显示真实外形而非一个通用盒子。馆内具体开放和展室未从总图推定。'],
 ['citadel-sulayman','苏莱曼帕夏清真寺',[[798,242],[819,220],[847,244],[842,250],[859,267],[845,282],[825,260],[818,272],[800,254]],[824,248],'北围区中的小型独立清真寺。图上位置帮助辨认城堡不是只有一座清真寺。'],
 ['citadel-gawhara','珠宝宫／Gawhara Palace',[[168,676],[243,677],[237,706],[270,710],[278,758],[379,770],[376,797],[268,785],[268,775],[160,768]],[220,738],'南围区宫殿的曲折轮廓，跟清真寺和军博分属不同建筑。展陈与开放需另核实。'],
 ['citadel-police','警察博物馆建筑',[[221,278],[279,236],[310,329],[270,370],[265,357],[221,390],[213,378],[235,354],[220,341],[242,319]],[266,309],'西侧建筑的位置根据场地图登记；不因看见建筑轮廓就假定室内当天可进入。'],
 ['citadel-carriage','马车博物馆建筑',[[501,506],[538,501],[568,485],[596,497],[628,505],[629,530],[545,525],[507,536]],[565,514],'游客入口以北的独立建筑。用它辨认南北围区的转折。'],
 ['citadel-well','萨拉丁井位置',[[353,586],[365,574],[377,587],[366,599]],[366,586],'来源地图标明井的位置，但未提供井内测绘或开放许可；不绘制向下的虚构游览路线。'],
];
const edge:Array<[number,number]>=[[474,531],[529,523],[625,539],[751,548],[868,578],[885,521],[909,507],[955,392],[943,372],[948,359],[948,379],[969,362],[1003,269],[1037,257],[1014,196],[915,237],[878,189],[821,205],[766,207],[765,221],[610,240],[499,193],[426,315],[383,399],[402,454]];
export const citadelSite=drawing({id:'citadel-site',source:{id:'src-citadel-map',asset:'/maps/attractions/cairo-citadel-map.jpg',sha256:'f76a66b5c8603a0c3fbf028937d16af50cabed862140cc35c057a95b2db46efa',width:1100,height:920,projection:'orthographic',review:'Present-day Citadel diagram, original feature identities and visitor-entrance label inspected. Outdoor building outlines distinct from mosque indoor plan.'},drawingWidth:1100,floor:'城堡总览 · 建筑与围区',bounds:[135,190,911,615],entry:'citadel-public-gate',entryBasis:'Published map explicitly labels Visitor Entrance (Bab al-Jabal).',rooms:siteRooms,walls:edge.slice(1).map((b,i)=>strip(edge[i],b,3)),limitations:['总图来源©Néfermaât / Malyszkz / Robert Prazeres，CC BY-SA 4.0；重绘保留原建筑位置、围墙和独立地点。','图上建筑外轮廓不代表各馆内部布局；清真寺室内有单独的建筑平面，不复用外轮廓。']});

const oct=(x:number,y:number,r:number):Ring=>Array.from({length:8},(_,i)=>[x+r*Math.cos(i*Math.PI/4),y+r*Math.sin(i*Math.PI/4)]);
const mosqueRooms:RoomSpec[]=[
 ['ali-court','露天庭院',rect(655,98,486,497),[1000,438],'开敞庭院与礼拜殿是两个相邻但气氛不同的方形空间。先辨认中央净礼喷泉、周边有顶柱廊，再进入礼拜殿看穹顶与主墩。','citadel-court','court'],
 ['ali-prayer','穹顶礼拜殿',rect(144,116,436,459),[354,350],'礼拜殿不是一串展室：中央穹顶由四根巨大方墩承托，半穹顶向四周展开。关注采光、吊灯、书法圆牌和雪花石膏饰面；礼拜优先，不穿越限制区域。','citadel-prayer'],
 ['ali-mihrab','米哈拉布一侧的凸出空间',rect(49,263,92,161),[ ninety(),344],'位于礼拜方向一侧的凸出部。看壁龛与宣讲台组织的朝向，不把它解释成额外的独立展厅。',undefined,'sanctuary'],
 ['ali-fountain','八角净礼喷泉',oct(897,346,54),[897,346],'庭院中心的八角形净礼设施；石材、柱环、檐部与穹顶构成层次。图中只按平面记录，不根据平面猜穹顶精确高度。'],
 ['ali-riwaq-top','庭院上侧柱廊',rect(655,51,534,42),[920,72],'露天庭院外围的有顶柱廊，重复小穹顶与柱间形成水平节奏。方向沿来源图，不暗示图上方是北。',undefined,'passage'],
 ['ali-riwaq-bottom','庭院下侧柱廊',rect(656,605,533,40),[920,625],'与对侧柱廊对应的有顶空间；庭院与廊道分开着色，不填实中间的露天空地。',undefined,'passage'],
 ['ali-riwaq-west','庭院外端柱廊',rect(1153,95,36,507),[1171,450],'庭院远离礼拜殿的一边，包含钟楼侧的柱廊关系；钟楼外立面的高度不从此平面猜测。',undefined,'passage'],
 ['ali-riwaq-between','院落与礼拜殿之间的柱廊',rect(609,137,34,422),[627,349],'连接庭院与礼拜殿的一侧柱廊；两端与细长尖塔楼梯相关，但不据图推断塔楼开放。',undefined,'passage'],
 ['ali-outer-top','礼拜殿外侧上廊',rect(120,44,445,43),[354,66],'沿礼拜殿外墙的柱廊，是外部过渡空间，不与主殿内部合并。',undefined,'passage'],
 ['ali-outer-bottom','礼拜殿外侧下廊',rect(117,608,446,38),[351,627],'外廊与殿内地面在来源中明确分开，别把窗口或柱间误画成贯通通道。',undefined,'passage'],
];
function ninety(){return 90;}
const mosqueCols:Array<[number,number,number]>=[];
for(const x of [648,727,771,814,857,899,939,981,1024,1065,1107,1148])for(const y of [89,603])mosqueCols.push([x,y,3.5]);
for(const y of [130,175,219,264,309,388,429,474,518,561])for(const x of [647,1149])mosqueCols.push([x,y,3.5]);
for(const x of [125,158,199,241,282,323,398,440,482,524,565])mosqueCols.push([x,45,3.5]);
for(const x of [117,156,197,236,278,317,396,437,479,519,560])mosqueCols.push([x,644,3.5]);
for(const y of [131,174,219,264,386,429,473,517])mosqueCols.push([524,y,3.5]);
for(let i=0;i<8;i++){const a=i*Math.PI/4;mosqueCols.push([897+47*Math.cos(a),346+47*Math.sin(a),3]);}
const pier=(x:number,y:number):Ring=>[[x,y],[x+8,y],[x+8,y-5],[x+15,y-5],[x+15,y],[x+28,y],[x+28,y-5],[x+35,y-5],[x+35,y],[x+41,y],[x+41,y+7],[x+36,y+7],[x+36,y+29],[x+41,y+29],[x+41,y+36],[x+35,y+36],[x+35,y+41],[x+28,y+41],[x+28,y+36],[x+15,y+36],[x+15,y+41],[x+8,y+41],[x+8,y+36],[x,y+36],[x,y+29],[x+5,y+29],[x+5,y+7],[x,y+7]];
const piers=[pier(217,198),pier(458,198),pier(217,449),pier(458,449)];
export const aliMosque=drawing({id:'citadel-ali-mosque',source:{id:'src-muhammad-ali-wnf-plan',asset:'/maps/attractions/citadel-mosque-plan.jpg',sha256:'16ed251a96f109becc803dcf18b7b7fcd13df8365d409a9ae24fe3bea41525c4',width:1241,height:700,projection:'orthographic',review:'Plan reproduced from Hasan Abd al-Wahhab, History of Historic Mosques / Museum With No Frontiers, public Arabic Wikimedia file. Court, fountain, four main piers and colonnades visually cross-checked against MWNF architectural description. No north arrow was invented.'},drawingWidth:1241,floor:'穆罕默德·阿里清真寺 · 地面层',bounds:[15,22,1198,650],entry:'ali-court',entryBasis:'Single ground-floor architectural court and prayer-hall relationship established by plan and MWNF; exact modern admission door not asserted.',rooms:mosqueRooms,columns:mosqueCols,walls:[...piers,strip([649,25],[1209,25],12),strip([1205,25],[1205,671],12),strip([648,663],[1205,663],12),strip([116,94],[326,94],12),strip([400,95],[572,95],12),strip([143,111],[143,255],8),strip([142,432],[142,570],8),strip([142,587],[323,587],14),strip([398,587],[577,587],14),strip([42,265],[42,323],8),strip([42,363],[42,417],8),strip([590,135],[590,327],12),strip([590,366],[590,557],12)],limitations:['来源原图没有北箭头；保持院落、礼拜殿与朝向壁的关系，不凭页面方向发明地理方位。','四根主墩按十字状平面独立建模；庭院和礼拜殿地面不会被整块挤出。','此层是室内低墙剖切；外部穹顶和尖塔只在有立面与尺寸依据时另行表达。']});
aliMosque.spaces.find(s=>s.id==='ali-court')!.holes=[mosqueRooms.find(r=>r[0]==='ali-fountain')![2]];
aliMosque.spaces.find(s=>s.id==='ali-prayer')!.holes=piers;
export const citadelArchitectureLevels=[citadelSite,aliMosque];
