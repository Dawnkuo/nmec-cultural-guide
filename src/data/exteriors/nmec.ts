import type { Ring, XY } from '../architecture/types';
import type { ExteriorGuide, ExteriorPart, XYZ } from './types';
import { feature, model, part, prism, rect } from './builders';

/** Source-proportional exterior, NOT an extrusion of the indoor research boundary.
 * Horizontal reference: Sustainability 2023, Fig.4(b), 314 × 490 source pixels.
 * Detailed exhibition footprint: architect's plan, CPAS Fig.17, uniform transform.
 * Vertical silhouette: museum maquette + actual facade + pavilion author's section.
 * Every height is a proportional reconstruction, not a measured elevation.
 */
const sources=['src-nmec-exterior-plan-2023','src-nmec-architect-plan-2024','src-nmec-model-photo','src-nmec-pavilion-section','src-nmec-facade-photo','src-nmec'];
const plan=(r:Ring):Ring=>r.map(([x,z])=>[26+(x-86)*273/628,7+(z-31)*273/628]);
const features=[
 feature('nmec-pyramid','金字塔顶、玻璃亭与四角石墩',rect(121,57,57,58),'标志性的顶部亭体并不是另一栋独立建筑：它立在展览楼内侧的中央结构上。上部为四坡玻璃金字塔，中段是玻璃围合，下段向内收束，四角石墩从屋顶层承托整个亭体。',['对照四角石墩、玻璃围合与金字塔顶三个层次。','转到侧面，观察玻璃亭下部向内收束的形状。'],sources,'建筑师平面四根中央柱与馆内建筑模型确定水平关系；Mahmoud Hussain 2019剖切图及馆方现状照片核对亭体层次。位置为图上比例推导，非实测配准。'),
 feature('nmec-wings','环形展览楼与分段屋顶',rect(26,7,273,273),'展览楼的外轮廓近于正方形，但屋顶并不是一块平板。周边展览翼形成环形体量，内侧退台围合中央展陈区；分段抬高的屋盖、石质立面与下缘开窗共同形成连续而有层次的建筑。',['俯视辨认环形展览翼与内侧较低屋面。','看分段屋盖及立面下缘窗带，不把屋顶分段当作现行展区边界。'],sources,'完整外包边界及内侧环廊由CPAS图17／2023图4(b)确定；分段屋盖和窗带由馆内建筑模型及真实外景交叉核对。','nmec-main'),
 feature('nmec-core','中央展陈体量与内侧退台',plan(rect(235,156,350,350)),'环形外翼包围着较内收的中央展陈体量。中央屋面、通向周边的连接部和上方亭体共同形成层次；这不是一个可以根据屋顶外形推断全部展柜、楼梯或游客权限的导航模型。',['比较周边高屋盖与内侧屋面之间的退台。','从俯视找到中央体量与周边外翼之间的关系。'],sources,'中央边界、连接部与柱位来自建筑师图17；屋顶高差和轮廓取馆内模型的保守层级，不生成地下房间。'),
 feature('nmec-link-shell','斜向连接廊',[[124,270],[147,265],[165,326],[142,332]],'展览楼与入口建筑并不共用一条正交轴线。连接廊把两栋建筑联系起来，弧形覆盖与两侧支承在馆内模型及通道实景中可识别；外观模型只解释这个连接，不承诺具体通行路线。',['从俯视观察连接廊与两栋楼的夹角。','比较廊道的轻型覆盖与两端厚重的石质体量。'],sources,'2023图4(b)的整体平面保留两栋建筑的夹角与连接；弧顶来自NMEC-Tunnel及馆内模型，曲率为比例示意。'),
 feature('nmec-arrival-shell','入口建筑与分级屋面',[[99,339],[215,310],[232,360],[247,365],[263,432],[208,447],[202,475],[111,486],[85,439],[114,420]],'入口建筑是位于展览楼之前的独立公共建筑，包含到达大厅、公共服务与活动空间。它的轴向相对展览楼转动，屋面由不同高度的体量组成；不能把室内研究图中选取的黄色区域当成完整外墙。',['对照入口建筑与主楼的方向差异。','看中央到达空间、侧翼和剧场的分级屋面。'],sources,'底面由2023图4(b)整体平面描绘；屋面层次由4(a)、馆内模型与真实正门照片核对；不以屋面分块声称真实房间数量。'),
 feature('nmec-entry-portico','正门开口与石质门廊',[[153,439],[203,426],[209,451],[159,464]],'真实正门不是封死的墙：厚重石柱与横梁围出连续入口开口，后方门面退入阴影。四根门廊石柱及台阶提供到达时最直接的尺度参照；此处不添加未定位的园林、雕塑或路边设施。',['正面看门廊的四根石柱与后退的玻璃门面。','看门廊上方横梁与两侧高低不同的屋盖。'],sources,'2023图4(c)标出的南侧主入口，与图4(b)旋转后整体图及正门实景核对；柱数取实景，深度与高度为保守比例。'),
 feature('nmec-theatre-shell','入口建筑的剧场侧翼',[[85,439],[139,426],[156,474],[111,486]],'剧场位于入口建筑的一侧，形成与到达大厅不同的建筑体量。它属于场馆活动设施，模型里的屋面与外墙不能用来判断当天活动、入口开放或普通门票的进入权限。',['俯视把剧场侧翼与公共大厅区分开。','侧视比较各体量高度，而不是把整栋楼视作一个盒子。'],sources,'2023图4(c) Auditorium平面对应整体图4(b)下侧翼；保留建筑外形，不补造未知屋架。'),
];
const parts:ExteriorPart[]=[];
const add=(id:string,fid:string,r:Ring,h:number,y=0,material:ExteriorPart['material']='stone',basis='Fig.4(b) / Fig.17 plan; model-photo + actual facade: proportional height, not measured')=>{
 const p=prism(id,fid,r,h,y,material);p.sourceGeometryId=`nmec-claim/${id}`;p.verticalBasis=basis;parts.push(p);return p;
};
// Low base and lower roof are NOT one tall solid plate obscuring the upper structure.
add('nmec-exhibition-base','nmec-wings',rect(26,7,273,273),10);
add('nmec-inner-lower-roof','nmec-core',rect(70,50,181,185),12,10);
const outer=rect(26,7,273,273),inner=rect(70,50,181,185);
parts.push(part('nmec-exhibition-ring','nmec-wings',{kind:'prism',footprint:outer,holes:[inner],height:23,base:10},'stone','nmec-claim/perimeter-ring','Fig.17 perimeter galleries; maquette roof hierarchy, height approximate'));
// Four perimeter bands, subdivided only at the documented principal roof breaks.
const roofBands:Ring[]=[rect(26,7,83,43),rect(110,7,101,43),rect(212,7,87,43),rect(26,50,44,67),rect(26,118,44,85),rect(26,204,44,76),rect(251,50,48,78),rect(251,129,48,79),rect(251,209,48,71),rect(70,235,55,45),rect(155,235,96,45)];
roofBands.forEach((r,i)=>{const high=[1,4,7,10].includes(i)?3:0;add(`nmec-ring-roof-${i}`,'nmec-wings',r,2+high,33,'stone');add(`nmec-roof-surface-${i}`,'nmec-wings',r,.3,35+high,'roof');});
// Thin horizontal parapets express real roof edges, not made-up decorative facades.
for(const [id,r]of [['west',rect(26,7,1.5,273)],['east',rect(297.5,7,1.5,273)],['north',rect(26,7,273,1.5)],['south',rect(26,278.5,273,1.5)]] as const)add(`nmec-parapet-${id}`,'nmec-wings',r,2,35);
// Lower window bands remain bands: pane counts are intentionally not asserted.
for(const [id,r]of [['west',rect(25.7,14,.3,258)],['east',rect(299,14,.3,258)],['north',rect(33,6.7,258,.3)],['south-left',rect(33,280,85,.3)],['south-right',rect(161,280,130,.3)]] as const)add(`nmec-window-band-${id}`,'nmec-wings',r,6,3,'glass');
// Simplified glazing rhythm, not a census of real facade piers or panes.
for(const x of [40,63,86,109,132,155,178,201,224,247,270,292])for(const z of [6.3,280])add(`nmec-window-pier-${x}-${z}`,'nmec-wings',rect(x,z,1.4,.65),7,2);
for(const z of [20,43,66,89,112,135,158,181,204,227,250,273])for(const x of [25.4,299])add(`nmec-window-pier-${x}-${z}`,'nmec-wings',rect(x,z,.65,1.4),7,2);
// Central footprint faithfully follows the architect's core, not a centered generic cube.
const core=plan([[235,270],[476,270],[476,506],[385,506],[385,475],[327,475],[327,506],[235,506]]);
add('nmec-core-shell','nmec-core',core,10,22);
for(const [i,r]of [plan(rect(235,270,92,94)),plan(rect(385,270,91,94)),plan(rect(235,380,92,126)),plan(rect(385,380,91,126))].entries()){add(`nmec-core-roof-${i}`,'nmec-core',r,2,32);add(`nmec-core-roof-surface-${i}`,'nmec-core',r,.3,34,'roof');}
add('nmec-pavilion-support-block','nmec-pyramid',rect(126,60,45,53),15,22);
// Pavilion: tapered lower glass bowl, glazed drum, four stone piers, glass pyramid.
add('nmec-pavilion-lower-glass','nmec-pyramid',rect(132,70,33,33),10,37,'glass').geometry={kind:'prism',footprint:rect(132,70,33,33),height:10,base:37,topScale:49/33};
add('nmec-pavilion-glass-drum','nmec-pyramid',rect(124,62,49,49),13,47,'glass');
add('nmec-pavilion-glass-pyramid','nmec-pyramid',rect(124,62,49,49),25,60,'glass').geometry={kind:'prism',footprint:rect(124,62,49,49),height:25,base:60,topScale:0};
for(const x of [121,172])for(const z of [59,110])add(`nmec-pavilion-stone-pier-${x}-${z}`,'nmec-pyramid',rect(x,z,4,4),40,22);
// Roof glazing divisions follow the author's section. The simplified lattice is not a pane census.
function beam(id:string,a:XYZ,b:XYZ,w:number,fid='nmec-pyramid'){
 const dx=b[0]-a[0],dz=b[2]-a[2],len=Math.hypot(dx,dz),nx=len? -dz/len*w/2:w/2,nz=len?dx/len*w/2:0;
 const verts:XYZ[]=[[a[0]+nx,a[1]-.15,a[2]+nz],[a[0]-nx,a[1]-.15,a[2]-nz],[b[0]-nx,b[1]-.15,b[2]-nz],[b[0]+nx,b[1]-.15,b[2]+nz],[a[0]+nx,a[1]+.15,a[2]+nz],[a[0]-nx,a[1]+.15,a[2]-nz],[b[0]-nx,b[1]+.15,b[2]-nz],[b[0]+nx,b[1]+.15,b[2]+nz]];
 parts.push(part(id,fid,{kind:'mesh',vertices:verts,triangles:[0,1,2,0,2,3,4,7,6,4,6,5,0,4,5,0,5,1,1,5,6,1,6,2,2,6,7,2,7,3,3,7,4,3,4,0]},'stone','nmec-claim/pavilion-frame','Section 2019: simplified glazing frame; no measured pane count'));
}
const peak:XYZ=[148.5,85.25,86.5],corners:XYZ[]=[[124,60.25,62],[173,60.25,62],[173,60.25,111],[124,60.25,111]];
const mix=(a:XYZ,b:XYZ,t:number):XYZ=>a.map((n,i)=>n+(b[i]-n)*t) as unknown as XYZ;
for(let side=0;side<4;side++){
 const a=corners[side],b=corners[(side+1)%4];
 for(let i=0;i<7;i++)beam(`nmec-pyramid-meridian-${side}-${i}`,mix(a,b,i/6),peak,.35);
 for(let i=0;i<6;i++)beam(`nmec-pyramid-ring-${side}-${i}`,mix(a,peak,i/6),mix(b,peak,i/6),.35);
 for(let i=1;i<7;i++){const p=mix(a,b,i/7);add(`nmec-drum-mullion-${side}-${i}`,'nmec-pyramid',rect(p[0]-.17,p[2]-.17,.34,.34),13,47);}
}
// The connection follows the integrated plan's angle. Semicircular cover, not a flat block.
const ca:XY=[136,270],cb:XY=[153,327],cw=22,cd=Math.hypot(cb[0]-ca[0],cb[1]-ca[1]),cx=-(cb[1]-ca[1])/cd,cz=(cb[0]-ca[0])/cd;
const strip=(t:number,y:number):XYZ[]=>[ca,cb].map(([x,z])=>[x+cx*t,y,z+cz*t] as XYZ);
const cv:XYZ[]=[];for(let i=0;i<=16;i++){const a=Math.PI*i/16;cv.push(...strip(Math.cos(a)*cw/2,13+Math.sin(a)*7));}
const ct:number[]=[];for(let i=0;i<16;i++)ct.push(i*2,i*2+1,i*2+3,i*2,i*2+3,i*2+2);
parts.push(part('nmec-link-arched-cover','nmec-link-shell',{kind:'mesh',vertices:cv,triangles:ct},'glass','nmec-claim/link','Fig.4(b), museum maquette + tunnel photograph; arch rise approximate'));
add('nmec-link-base','nmec-link-shell',features[3].footprint,13);
// Entry and theatre use the integrated plan, not independently normalized room polygons.
const entry:Ring=[[99,339],[215,310],[239,396],[253,395],[263,432],[210,446],[203,426],[153,439],[162,475],[111,488],[85,439],[110,432],[99,389],[111,385]];
add('nmec-arrival-lower-shell','nmec-arrival-shell',entry,22);
const entryRoofs:Ring[]=[[[99,339],[157,324],[169,369],[111,384]],[[157,324],[215,310],[226,353],[169,369]],[[112,387],[172,372],[185,418],[124,434]],[[172,372],[230,358],[241,400],[185,418]],[[230,404],[255,399],[263,432],[208,447],[202,427]]];
entryRoofs.forEach((r,i)=>{const h=i<2?12:i===4?3:7;add(`nmec-entry-raised-roof-${i}`,'nmec-arrival-shell',r,h,22);add(`nmec-entry-roof-surface-${i}`,'nmec-arrival-shell',r,.3,22+h,'roof');});
add('nmec-theatre-base','nmec-theatre-shell',features[6].footprint,24);
add('nmec-theatre-roof','nmec-theatre-shell',[[87,438],[137,427],[151,470],[109,482]],3,24,'roof');
// Fig.4(c) Main Entrance is the SOUTH recess, not the eastern snack-bar terrace.
// Keep its rotation from Fig.4(b); the facade normal also defines the front camera.
const pa:XY=[153,439],pb:XY=[203,426],normal:XY=[.252,.968];
const porticoPoint=(t:number,depth:number):XY=>[pa[0]+(pb[0]-pa[0])*t+normal[0]*depth,pa[1]+(pb[1]-pa[1])*t+normal[1]*depth];
const porticoRect=(t0:number,t1:number,d0:number,d1:number):Ring=>[porticoPoint(t0,d0),porticoPoint(t1,d0),porticoPoint(t1,d1),porticoPoint(t0,d1)];
add('nmec-entry-recessed-glass','nmec-entry-portico',porticoRect(0,1,-.5,0),15,1,'glass');
for(let i=0;i<4;i++)add(`nmec-entry-stone-column-${i}`,'nmec-entry-portico',porticoRect(i/3-.04,i/3+.04,4,7),18);
add('nmec-entry-portico-lintel','nmec-entry-portico',porticoRect(-.06,1.06,0,8),4,18);
for(let i=0;i<4;i++)add(`nmec-entry-step-${i}`,'nmec-entry-portico',porticoRect(-.09,1.09,8+i*1.4,9.4+i*1.4),.8-i*.16);

// Resolve every part through the feature-level evidence register. These are
// claim IDs, never falsely presented as IDs from a measured source dataset.
for(const p of parts)p.sourceGeometryId=`nmec-claim/${p.featureId}/${p.id}`;

const whole=model('nmec-exterior-complete','文明博物馆 · 主楼、屋顶亭与入口建筑',[20,0,290,490],sources,'/images/covers/national-museum-egyptian-civilization.jpg',features,parts,[
 '平面保持2023年发表的整体图比例；2024年发表的建筑师主楼图以等比变换补充中央体量。整体图是设计资料，不是2026竣工测绘。',
 '亭体、分段屋顶、窗带和门廊由馆内建筑模型、2019亭体剖切图及实景交叉核对；竖向、弧顶曲率和窗格为保守比例。立面窗带及玻璃分格仅表达节奏，不声明逐窗数量、位置或实测尺寸。',
 '仅表现主要公共建筑。不推测后勤地下空间、完整园林、临时设施或外观到室内楼层的测量配准；不据此绘制游客导航。',
], [1,.8,1]);
whole.version='2026-09-17-nmec-structure-2';
whole.frontDirection=[.252,0,.968];
whole.coordinateSystem='统一采用2023图4(b)的无透视图面坐标，横纵等比。2024图17主楼图映射为 x=26+(u−86)×273/628，z=7+(v−31)×273/628；不声称地理坐标或真实标高。';
whole.referencePage='https://commons.wikimedia.org/wiki/File:NMEC-MainEntrance.jpg';
whole.referenceCaption='真实正门对照：Roland Unger，2017-03-05，CC BY-SA 4.0。模型保留门廊、屋顶亭和主体关系；研究图、馆内模型与现状照片的年代和精度分别登记。';
export const nmecExterior:ExteriorGuide={slug:'national-museum-egyptian-civilization',intro:'把环形展览楼、内侧退台、顶部玻璃亭、斜向连接廊和入口建筑放回同一整体，分别观察正面、侧面与屋顶。',models:[whole]};
