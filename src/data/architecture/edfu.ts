import type { ArchitecturalModel, ArchitecturalSpace, Ring, XY } from './types';

// Manual semantic transcription of the inspected 429 × 900 orthographic plate.
// Rectangles below describe straight-edged source rooms/wall strips, NOT inferred
// subdivisions. Irregular room edges, shared corridors, and door gaps are explicit.
const rect = (x: number, y: number, w: number, h: number): Ring => [[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
const space = (id: string, title: string, polygon: Ring, anchor: XY, kind: ArchitecturalSpace['kind'], description: string, evidenceId: string, nodeId?: string): ArchitecturalSpace => ({ id, title, polygon, anchor, kind, description, evidenceId, nodeId });
const spaces: ArchitecturalSpace[] = [
  space('edfu-entry', 'B · 塔门中央门道', rect(195,810,37,67), [213,840], 'passage', '两翼塔门之间的建筑入口，通向露天庭院。这里定位的是历史平面所示门道，不是现代售票口或停车场入口。', 'edfu-e-pylon', 'edfu-entry'),
  space('edfu-pylon-west', 'A · 塔门西翼', [[7,810],[193,810],[193,877],[7,877]], [100,859], 'pylon', '两翼塔门之一，厚重墙体中包含小室与楼梯。先退后观察双塔与中央门道的比例，再看国王击敌场景如何放大王权形象。内部楼梯与塔顶开放以现场为准。', 'edfu-e-pylon', 'edfu-pylon'),
  space('edfu-pylon-east', 'A · 塔门东翼', [[234,810],[423,810],[423,877],[234,877]], [331,859], 'pylon', '与另一翼塔门共同围合中央门道。入口的巨大尺度与门道的收窄形成对比；墙内的楼梯说明塔体不只是实心立面。内部是否开放以现场为准。', 'edfu-e-pylon', 'edfu-pylon'),
  space('edfu-court', 'C · 露天庭院', rect(72,506,276,301), [211,638], 'court', '进入塔门后抵达开阔庭院。三侧柱列围绕露天中心，与后方外柱厅形成明暗对比。停在阴影边缘，比较植物式柱头，再回望塔门如何把外部世界框成一个入口。', 'edfu-e-court', 'edfu-court'),
  space('edfu-hall-outer', 'D · 外柱厅', rect(103,408,218,86), [210,449], 'hall', '大庭院之后的第一座柱厅。前排柱与屏墙共同构成半开放界面，接着进入更暗的有顶空间。按官方介绍，这里可留意建庙和国王祭祀相关图像；具体画面以现场图说核对。', 'edfu-e-d', 'edfu-hypostyle'),
  space('edfu-hall-inner', 'E · 内柱厅', [[155,300],[271,300],[271,389],[154,389],[154,352],[150,352],[150,323],[155,323]], [210,343], 'hall', '第二座柱厅，原图 E。十二处柱位形成两侧各六柱，中轴留空。祭祀空间进一步收紧，侧面服务小室与中央厅分别建模。', 'edfu-e-e', 'edfu-inner-hypostyle'),
  space('edfu-hall-offering', 'F · 供奉厅', [[165,253],[253,253],[253,271],[272,271],[272,281],[163,281]], [209,267], 'hall', '内柱厅之后的横向厅室，原图 F（Hall of the Altar）。由这里继续向前室与至圣所方向阅读，不把相邻楼梯当作已开放游客路线。', 'edfu-e-fg', 'edfu-offerings'),
  space('edfu-hall-centre', 'G · 中央前室', [[174,214],[247,214],[247,225],[257,225],[257,240],[168,240],[168,228],[174,228]], [208,228], 'hall', '原图 G 位于供奉厅与圣所之间。短而横向展开的空间改变了由柱厅一路前进的节奏。', 'edfu-e-fg', 'edfu-vestibule'),
  space('edfu-sanctuary', 'H · 至圣所', [[189,135],[226,135],[226,198],[216,198],[216,211],[205,211],[205,198],[189,198]], [209,167], 'sanctuary', '沿中轴抵达独立围合的神圣核心。侧边狭窄环绕通道与周围附属小室把它和外围分开。按现场围挡观察神龛与圣舟陈设；本图定位到圣所空间，不标示单件陈设的精确坐标。', 'edfu-e-core', 'edfu-sanctuary'),
  space('edfu-inner-ambulatory', '至圣所环绕通道', [[167,109],[250,109],[250,213],[242,213],[242,203],[236,203],[236,122],[180,122],[180,203],[173,203],[173,211],[166,211],[166,205],[159,205],[159,197],[165,197]], [175,151], 'passage', '圣所外侧的狭长空间连接周围侧室。原图未单独编号；只显示它已有的形状，不在地图上添加未经核实的游客通行箭头。', 'edfu-e-core', 'edfu-inner-ambulatory'),
  space('edfu-outer-passage', '主体外环通道', [[73,19],[348,19],[348,390],[337,390],[337,380],[321,380],[321,44],[102,44],[102,381],[84,381],[84,391],[73,391]], [333,204], 'passage', '围墙与主体之间的外环通道。它与圣所内侧环绕通道不是同一地点；墙面图像需结合现场铭牌再判断具体位置。', 'edfu-e-enclosure', 'edfu-passage'),
];

// Five distinct K labels are preserved. Remaining visible compartments have no
// printed label; their compass/order suffixes are descriptive IDs, not old room numbers.
const sideRooms: Array<[string,string,Ring,XY]> = [
  ['nw','K · 后部西侧室',rect(127,61,31,35),[142,79]],
  ['n1','未编号后室（西中）',rect(173,62,18,35),[182,80]],
  ['n2','K · 后部中央室',rect(204,60,22,38),[215,79]],
  ['n3','未编号后室（东中）',rect(239,59,15,31),[246,76]],
  ['ne','K · 后部东侧室',[[269,59],[294,59],[294,95],[260,95],[260,85],[269,85]],[282,78]],
  ['w1','未编号西侧室（后段）',rect(129,111,25,21),[141,123]],
  ['w2','未编号西侧室（中段）',rect(129,146,25,20),[141,156]],
  ['w3','K · 西侧小室',rect(130,178,24,22),[142,188]],
  ['w4','未编号西侧室（前段）',rect(130,216,24,25),[142,229]],
  ['e1','未编号东侧室（后段）',[[268,110],[294,110],[294,134],[269,134],[269,127],[260,127],[260,119],[268,119]],[281,122]],
  ['e2','未编号东侧室（中段）',rect(268,148,26,21),[281,158]],
  ['e3','K · 东侧小室',[[269,181],[294,181],[294,204],[283,204],[283,199],[269,199]],[282,191]],
  ['e4','未编号东侧室（前段）',rect(268,216,26,26),[281,229]],
  ['f-west','供奉厅西侧室',[[121,254],[155,254],[155,280],[122,280]],[139,267]],
  ['e-west-rear','内柱厅西侧室（后）',rect(121,300,20,30),[131,315]],
  ['e-west-front','内柱厅西侧室（前）',rect(120,354,21,36),[131,372]],
  ['e-east','内柱厅东侧室',[[284,321],[300,321],[300,390],[284,390]],[292,355]],
];
for (const [id,title,polygon,anchor] of sideRooms) spaces.push(space(`edfu-room-${id}`, title, polygon, anchor, 'side-room', title.startsWith('K') ? '原图以 K 统称这组附属储藏空间。分别保留其位置、轮廓和开口；不把每一个 K 解释为同一房间，也不推断当前用途或开放权限。' : '历史平面可确认这个独立空间，但没有给出可采用的专名。保留建筑轮廓，不编造祭祀功能、展品或开放状态。', 'edfu-e-core-rooms'));

const wallSpecs: Array<[string,Ring]> = [
  ['enclosure-n',rect(62,5,299,13)],['enclosure-w',rect(62,18,10,789)],['enclosure-e',rect(348,18,13,789)],
  ['core-n',[[104,45],[321,43],[316,58],[109,62]]],['core-w',rect(105,60,15,192)],['core-e',rect(300,57,16,252)],
  ['rear-w1',rect(158,60,13,46)],['rear-w2',rect(192,58,11,48)],['rear-e1',rect(227,58,11,47)],['rear-e2',rect(254,58,15,26)],
  ['rear-lintel-w',rect(121,98,36,11)],['rear-lintel-c1',rect(174,99,20,9)],['rear-lintel-c2',rect(205,99,36,10)],['rear-lintel-e',rect(269,96,32,13)],
  ['west-room-spine1',rect(154,110,12,9)],['west-room-spine2',rect(154,134,12,18)],['west-room-spine3',rect(154,165,12,18)],['west-room-spine4',rect(154,197,13,14)],['west-room-spine5',rect(154,230,12,24)],
  ['west-room-walls1',rect(122,133,32,12)],['west-room-walls2',rect(122,167,32,11)],['west-room-walls3',rect(122,202,33,13)],['west-room-walls4',rect(122,242,31,11)],
  ['east-room-spine1',rect(250,109,18,11)],['east-room-spine2',rect(253,132,16,21)],['east-room-spine3',rect(252,166,16,16)],['east-room-spine4',rect(253,200,15,16)],['east-room-spine5',rect(253,230,15,40)],
  ['east-room-walls1',rect(268,135,33,12)],['east-room-walls2',rect(268,170,33,11)],['east-room-walls3',rect(282,204,18,12)],['east-room-walls4',rect(268,243,31,12)],
  ['sanctuary-n',rect(180,122,58,13)],['sanctuary-w',rect(180,135,10,67)],['sanctuary-e',rect(226,135,12,67)],['sanctuary-s1',rect(172,200,34,13)],['sanctuary-s2',rect(216,200,30,13)],
  ['vestibule-s1',rect(162,241,46,12)],['vestibule-s2',rect(218,241,37,12)],
  ['offering-west',rect(155,254,10,28)],['offering-nw',rect(113,244,42,10)],['offering-outer-w',rect(106,253,15,30)],
  ['offering-s1',[[107,282],[204,282],[204,297],[152,297],[152,307],[143,307],[143,297],[110,297]]],
  ['offering-s2',[[218,282],[310,282],[310,298],[283,298],[283,307],[270,307],[270,298],[218,298]]],
  ['hall-e-w-rear',rect(106,298,15,40)],['hall-e-w-front',rect(107,352,13,40)],
  ['hall-e-inner-w1',rect(142,297,11,26)],['hall-e-inner-w2',rect(142,329,11,23)],['hall-e-inner-w3',rect(142,356,12,34)],['hall-e-room-cross',rect(116,332,25,11)],
  ['hall-e-inner-e1',rect(271,310,12,23)],['hall-e-inner-e2',rect(271,345,12,45)],['hall-e-outer-e',rect(301,322,16,71)],
  ['hall-d-n1',[[84,383],[104,388],[151,389],[151,389],[207,389],[207,407],[97,407],[96,449],[84,449]]],
  ['hall-d-n2',[[218,391],[319,391],[319,383],[337,385],[340,449],[325,449],[324,408],[218,408]]],
  ['hall-d-w2',rect(83,455,20,24)],['hall-d-w3',rect(82,483,21,20)],['hall-d-e2',rect(323,455,17,48)],
  ['hall-d-s1',[[101,491],[187,491],[187,485],[199,486],[200,505],[102,505]]],
  ['hall-d-s2',[[225,487],[238,488],[239,493],[323,493],[323,504],[224,504]]],
  // Pylon chambers: outer fabric, transverse walls, and source-supported gaps.
  ['pylon-west-n',rect(6,807,188,16)],['pylon-west-s',rect(6,859,188,19)],['pylon-west-end1',rect(6,823,11,10)],['pylon-west-end2',rect(6,851,11,8)],
  ['pylon-west-core',rect(58,821,16,38)],['pylon-west-stair-n',rect(72,823,34,7)],['pylon-west-stair-s',rect(72,854,34,6)],['pylon-west-stair-e1',rect(105,821,10,17)],['pylon-west-stair-e2',rect(105,847,10,12)],
  ['pylon-west-room',rect(114,821,10,12)],['pylon-west-room2',rect(114,843,10,16)],['pylon-west-inner',rect(166,822,28,37)],
  ['pylon-east-n',rect(234,807,191,16)],['pylon-east-s',rect(234,859,191,19)],['pylon-east-inner',rect(234,822,28,37)],
  ['pylon-east-room1',rect(300,821,12,12)],['pylon-east-room2',rect(300,844,12,15)],['pylon-east-stair-n',rect(319,823,34,7)],['pylon-east-stair-s',rect(319,854,34,6)],['pylon-east-stair-w1',rect(313,821,7,17)],['pylon-east-stair-w2',rect(313,847,7,12)],['pylon-east-core',rect(353,821,13,38)],['pylon-east-end1',rect(412,823,13,10)],['pylon-east-end2',rect(412,851,13,8)],
];
// A repeated vertex in the historical outline is not a separate feature.
wallSpecs.forEach(([,points]) => { for (let i=points.length-1;i>0;i--) if (points[i][0]===points[i-1][0] && points[i][1]===points[i-1][1]) points.splice(i,1); });
const columns: ArchitecturalModel['columns'] = [];
const column = (group: string, x: number, y: number, radius: number) => columns.push({id:`edfu-column-${group}-${columns.length+1}`,center:[x,y],radius,evidenceId:group==='court'?'edfu-e-court':group==='outer'?'edfu-e-d':'edfu-e-e'});
// Positions transcribed individually from the printed circles, not a room-fill grid.
[526,549,572,595,618,643,667,690,713,735,760,783].forEach(y=>column('court',95,y,5.5));
[526,550,575,596,617,642,666,690,714,738,761,784].forEach(y=>column('court',325,y,5.5));
[119,142,168,189,234,256,279,302].forEach(x=>column('court',x,784,5.5));
[[128,435],[157,435],[188,435],[236,435],[267,435],[297,435],[127,466],[157,466],[186,466],[234,466],[268,467],[298,467],[126,494],[157,494],[190,494],[233,494],[267,495],[298,495]].forEach(([x,y])=>column('outer',x,y,5.5));
[[170,320],[192,320],[231,320],[252,320],[170,343],[192,343],[230,343],[252,343],[170,365],[192,365],[230,365],[252,365]].forEach(([x,y])=>column('inner',x,y,4.5));

const labelSpecs: Array<[string,string,XY,string]> = [
  ['a-w','A',[99,889],'edfu-pylon-west'],['a-e','A',[334,889],'edfu-pylon-east'],['b','B',[213,842],'edfu-entry'],['c','C',[211,638],'edfu-court'],['d','D',[210,450],'edfu-hall-outer'],['e','E',[210,342],'edfu-hall-inner'],['f','F',[210,267],'edfu-hall-offering'],['g','G',[210,228],'edfu-hall-centre'],['h','H',[209,167],'edfu-sanctuary'],
  ['k-nw','K',[142,79],'edfu-room-nw'],['k-nc','K',[215,79],'edfu-room-n2'],['k-ne','K',[282,78],'edfu-room-ne'],['k-w','K',[142,188],'edfu-room-w3'],['k-e','K',[282,191],'edfu-room-e3'],
];

export const edfuArchitecture: ArchitecturalModel = {
  id: 'edfu-ground-plan', version: '2026-09-16-semantic-1',
  source: { id:'src-edfu-plan',asset:'/maps/attractions/edfu-plan.gif',sha256:'9d08e3d506a012ede9f9447959a7f2a27061e1e7581428d206592f565e8214ea',width:429,height:900,projection:'orthographic',review:'Reviewed as a top-down wall-section plan. Source-site period heading is erroneous; construction dates use MoTA. No scale or north adopted from this sheet. Native pixel coordinates; no independent x/y stretch.' },
  floor: { id:'edfu-ground',title:'神庙地面层' },
  entry: { status:'mapped',spaceId:'edfu-entry',basis:'Plate B is explicitly keyed as entrance door; MoTA describes pylon → peristyle court → two hypostyle halls. This is the historic temple arrival level, not a modern ticket entrance.' },
  bounds: [0,0,429,900], spaces,
  walls: wallSpecs.map(([id,polygon])=>({id:`edfu-wall-${id}`,polygon,evidenceId:id.startsWith('pylon')?'edfu-e-pylon':id.startsWith('enclosure')?'edfu-e-enclosure':id.startsWith('hall-d')?'edfu-e-d':id.startsWith('hall-e')?'edfu-e-e':'edfu-e-core-rooms'})), columns,
  openings: [
    {id:'edfu-door-b-c',from:'edfu-entry',to:'edfu-court',a:[195,807],b:[233,807],evidenceId:'edfu-e-pylon'},
    {id:'edfu-door-c-d',from:'edfu-court',to:'edfu-hall-outer',a:[201,501],b:[222,501],evidenceId:'edfu-e-d'},
    {id:'edfu-door-d-e',from:'edfu-hall-outer',to:'edfu-hall-inner',a:[208,398],b:[217,398],evidenceId:'edfu-e-e'},
    {id:'edfu-door-e-f',from:'edfu-hall-inner',to:'edfu-hall-offering',a:[205,290],b:[217,290],evidenceId:'edfu-e-fg'},
    {id:'edfu-door-f-g',from:'edfu-hall-offering',to:'edfu-hall-centre',a:[209,247],b:[217,247],evidenceId:'edfu-e-fg'},
    {id:'edfu-door-g-h',from:'edfu-hall-centre',to:'edfu-sanctuary',a:[207,207],b:[215,207],evidenceId:'edfu-e-core'},
  ],
  stairs: [
    {id:'edfu-west-long-stair',footprint:rect(113,60,7,188),treads:Array.from({length:42},(_,i)=>[[113,63+i*4.3],[120,63+i*4.3]] as const),evidenceId:'edfu-e-core-rooms',access:'unknown'},
    {id:'edfu-east-stair-1',footprint:rect(278,251,28,13),treads:Array.from({length:7},(_,i)=>[[279+i*4,251],[279+i*4,264]] as const),evidenceId:'edfu-e-core-rooms',access:'unknown'},
    {id:'edfu-east-stair-2',footprint:rect(277,271,28,10),treads:Array.from({length:7},(_,i)=>[[279+i*4,271],[279+i*4,281]] as const),evidenceId:'edfu-e-core-rooms',access:'unknown'},
    {id:'edfu-pylon-west-stair',footprint:rect(74,831,31,22),treads:Array.from({length:8},(_,i)=>[[76+i*3.5,831],[76+i*3.5,853]] as const),evidenceId:'edfu-e-pylon',access:'unknown'},
    {id:'edfu-pylon-east-stair',footprint:rect(321,831,31,22),treads:Array.from({length:8},(_,i)=>[[322+i*3.5,831],[322+i*3.5,853]] as const),evidenceId:'edfu-e-pylon',access:'unknown'},
  ],
  labels: labelSpecs.map(([id,text,point,spaceId])=>({id:`edfu-label-${id}`,text,point,spaceId})),
  evidence: [
    {id:'edfu-e-pylon',sourceId:'src-edfu-plan',bounds:[4,805,423,95],claim:'Two pylon footprints, internal partitions/stair marks, A labels and central B doorway.'},
    {id:'edfu-e-court',sourceId:'src-edfu-plan',bounds:[70,503,280,305],claim:'C court and all 32 visible peristyle column circles. C typography is not geometry.'},
    {id:'edfu-e-d',sourceId:'src-edfu-plan',bounds:[82,383,259,124],claim:'D outer hall, 18 drawn circles/semicircles (including screen-wall engaged columns), screen-wall fragments and central openings.'},
    {id:'edfu-e-e',sourceId:'src-edfu-plan',bounds:[105,297,213,100],claim:'E inner hall and 12 column circles; side service rooms kept separate.'},
    {id:'edfu-e-fg',sourceId:'src-edfu-plan',bounds:[118,211,184,87],claim:'F and G transverse spaces; central gaps survive transcription.'},
    {id:'edfu-e-core',sourceId:'src-edfu-plan',bounds:[157,108,100,108],claim:'H sanctuary and surrounding corridor; not a single solid block.'},
    {id:'edfu-e-core-rooms',sourceId:'src-edfu-plan',bounds:[103,43,216,352],claim:'Five K labels; unnumbered side cells, wall strips, stair symbols. Tread counts/heights are display-only; no roof geometry is inferred.'},
    {id:'edfu-e-enclosure',sourceId:'src-edfu-plan',bounds:[61,3,301,805],claim:'Outer enclosure and U-shaped external corridor separated from sanctuary ambulatory.'},
  ],
  display:{wallHeight:10,columnHeight:17,heightStatus:'display-only'},
  limitations:['依据历史建筑平面重绘；墙高与柱高为剖切展示参数，不是复原高度。','图中楼梯只保留位置，不推断塔顶、屋顶的完整平面或当前开放权限。','室内图用于理解建筑，不提供实时通行、无障碍或现场导航。'],
};
