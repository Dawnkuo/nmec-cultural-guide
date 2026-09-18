import khanData from '../architecture/khan-outdoor.json';
import orangeData from '../architecture/orange-outdoor.json';
import khanContext from '../../../public/maps/attractions/khan-native-context.json';
import orangeContext from '../../../public/maps/attractions/orange-native-context.json';
import valleyTerrain from '../../../public/maps/exteriors/valley-terrain.json';
import valleyOsm from '../../../public/maps/exteriors/valley-osm.json';
import type {ArchitecturalModel,Ring,XY} from '../architecture/types';
import type {ExteriorGuide,ExteriorPart,XYZ} from './types';
import {circle,feature,model,part,prism,rect} from './builders';

const valleySources=['src-mapzen-terrain','src-osm','src-tmp-valley-plan','src-tmp-kv9','src-tmp-kv62'];
const tw=valleyTerrain.width,td=valleyTerrain.height;
function elevation(x:number,z:number){const n=valleyTerrain.size,i=Math.min(n-1,Math.max(0,Math.round(x/tw*(n-1)))),j=Math.min(n-1,Math.max(0,Math.round(z/td*(n-1))));return valleyTerrain.vertices[j*n+i][1];}
const vf=[feature('valley-landform','东谷：山脊与分支谷地',rect(0,0,tw,td),'帝王谷的外观首先是地形，而不是地上神庙。山脊之间的分支谷地容纳不同墓口；从外面只见入口和岩壁，墓室深入地下。',['斜视看谷底和山脊，再俯视看分支。','墓室平面切到内部图；不要把地下走廊当作地上建筑。','道路和围挡以现场为准。'],valleySources,'Mapzen公开高程瓦片，水平与垂直同一米制、无竖向夸张；51×51采样不意味着优于原始约30米地形精度。')];
const vp:ExteriorPart[]=[part('valley-dem','valley-landform',{kind:'mesh',vertices:valleyTerrain.vertices.map(p=>[p[0],p[1],p[2]] as XYZ),triangles:valleyTerrain.triangles},'sand','mapzen-terrarium-dem','高程来源于Terrarium/SRTM数据；相对于本框架最低高程，垂直比例1:1。')];
for(const [ref,id,node] of [['KV9','valley-kv9','kv9-a'],['KV62','valley-kv62','kv62-a']] as const){const f=valleyOsm.features.find(f=>f.id.startsWith('node/')&&f.tags.ref===ref)!;const [x,z]=f.points[0];const ft=feature(id,ref==='KV9'?'KV9 · 拉美西斯五世／六世墓所在位置':'KV62 · 图坦卡蒙墓所在位置',circle(x,z,13),ref==='KV9'?'从山体外观无法看出长而深入的墓道。这个点表示考古墓位，进入内部图才能看到独立核对的走廊与柱厅。':'小型墓葬与周围大墓有截然不同的内部规模。不要因地图上的标记大小一样，就认为墓室规模相同。',['本标记是墓位，不是实时入口或排队点。','当天开放、附加票与现场导视另行核对。'],valleySources,`OSM ${f.id} 地理点，墓名以Theban Mapping Project核对；圆形符号是定位标记，不是门洞几何。`,node);ft.anchor=[x,z];vf.push(ft);vp.push(part(id+'-marker',id,{kind:'lathe',center:[x,z],base:elevation(x,z)+2,profile:[[8,0],[8,5],[4,8],[4,15]]},'roof',f.id,'定位符号高度，不是建筑高度。'));}
for(const road of valleyOsm.features.filter(f=>!!f.tags.highway&&!f.closed)){for(let i=1;i<road.points.length;i++){const a=road.points[i-1],b=road.points[i],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);if(len<.1||[a,b].some(p=>p[0]<0||p[0]>tw||p[1]<0||p[1]>td))continue;const nx=-dz/len*1.2,nz=dx/len*1.2;vp.push(part(`${road.id}-${i}`,'valley-landform',{kind:'mesh',vertices:[[a[0]+nx,elevation(a[0],a[1])+1,a[1]+nz],[a[0]-nx,elevation(a[0],a[1])+1,a[1]-nz],[b[0]-nx,elevation(b[0],b[1])+1,b[1]-nz],[b[0]+nx,elevation(b[0],b[1])+1,b[1]+nz]],triangles:[0,1,2,0,2,3]},'ground',road.id,'道路中心线叠加到粗尺度地形；宽度仅为可读性，不生成导航。'));}}
const vm=model('valley-exterior','东谷地形与地下墓位',[0,0,tw,td],valleySources,'/images/guides/valley-of-the-kings/02.jpg',vf,vp,['不涵盖西谷；粗尺度高程无法表达门口台阶、岩檐、围挡或安全通行。','地形覆盖与OSM坐标统一；墓室图是另一个有测绘来源的层，不挤出到地表。'],[-.5,.85,1]);
vm.coordinateSystem=valleyOsm.projection+'；地形高差原比例，基准绝对高程 '+valleyTerrain.baseElevationMeters+' m。';vm.contextAsset='/maps/exteriors/valley-terrain.json';
export const valleyExterior:ExteriorGuide={slug:'valley-of-the-kings',intro:'能转动的真实高程地形，配合独立墓位标记；外部山谷与地下墓室明确分开。',models:[vm]};

type Context={areas:Array<{id:string;polygon:number[][];holes?:number[][][];kind:string;displayHeight:number}>;strokes:Array<{id:string;points:number[][]}>};
function contextParts(ctx:Context,spaces:ArchitecturalModel['spaces'],backgroundId:string){const result:ExteriorPart[]=[];
 for(const a of ctx.areas){const s=spaces.find(s=>s.id.endsWith(a.id.replace('/','-')));const fid=s?.id??backgroundId;const height=a.kind==='building'?a.displayHeight:a.kind==='pier'?1:.3;result.push(part(a.id,fid,{kind:'prism',footprint:a.polygon.map(p=>[p[0],p[1]] as XY),holes:a.holes as Ring[]|undefined,height,base:a.kind==='sand'?.5:0},a.kind==='building'?'stone':a.kind==='pier'?'timber':a.kind==='sand'?'sand':'ground',a.id,'无测量标高的环境足迹，建筑高度只作识别，不代表测绘。'));}
 for(const s of ctx.strokes)for(let i=1;i<s.points.length;i++){const a=s.points[i-1],b=s.points[i],d=Math.hypot(b[0]-a[0],b[1]-a[1]);if(d<.1)continue;const nx=-(b[1]-a[1])/d*1.4,nz=(b[0]-a[0])/d*1.4;result.push(part(s.id+'-'+i,backgroundId,{kind:'prism',footprint:[[a[0]+nx,a[1]+nz],[a[0]-nx,a[1]-nz],[b[0]-nx,b[1]-nz],[b[0]+nx,b[1]+nz]],height:.2,base:.5},'roof',s.id,'线宽为显示符号，不是道路测量宽度。'));}return result;
}
const kh=khanData as unknown as ArchitecturalModel,ks=['src-osm','src-historic-cairo','src-unesco-khan-map','src-ghuri-wikala','src-ghuri-plans'];
const kf=kh.spaces.map(s=>feature(s.id,s.title,s.polygon,s.nodeId==='khan-spine'?'市场是密集街巷构成的城市片区，不是一栋封闭购物中心。主街、窄巷和临街立面共同形成从明到暗的空间节奏。':s.nodeId==='khan-wikala'?'这座商旅建筑与沿街市集功能不同：货物储存、居住和交易围绕一个露天庭院组织。切换“古里维卡拉”看实际平面支持的独立外观。':s.nodeId==='khan-edge'?'侯赛因清真寺边缘是认识市场方位的公共地标，但宗教建筑、广场和商业窄巷有不同使用规则。':'街区中的独立历史建筑，位置保留原始地理足迹；这层不伪造其内部或精确屋顶。',['先辨认街道与建筑边界。','停在不阻挡通行的位置观察门框、檐部和石材。','服装、摄影与室内进入规则按现场要求。'],ks,'OSM登记足迹＋UNESCO街区范围；环境建筑只保留占地与可读性高度。',s.nodeId));
const kp=contextParts(khanContext,kh.spaces,kf[0].id).map((p,i)=>({...p,id:p.id+'-fragment-'+i}));
const km=model('khan-exterior-context','市场与历史街区 · 地理环境',kh.bounds,ks,'/images/guides/khan-el-khalili/01.jpg',kf,kp,['街区层是地理环境，不声称所有九处建筑都已有精细外观；已核对的古里维卡拉单独建模。','环境底面遵循OpenStreetMap ODbL署名；此处不承诺店铺、铺位或宗教建筑开放。']);
// Independent source drawing, page 3 left orthographic plan. Not a guessed geo-registration.
const wo:Ring=[[333,715],[338,596],[354,596],[354,432],[366,432],[366,379],[430,379],[430,290],[442,290],[442,218],[505,218],[505,124],[822,124],[823,210],[868,221],[839,350],[845,355],[836,573],[808,577],[805,715]];
const wc:Ring=[[531,245],[683,245],[670,584],[526,584]];
const wf=[feature('wikala-court','露天院落与两层石拱廊',wc,'开放院落是商旅生活的共同核心：储藏、出入与交往围绕它发生。模型保留院落空白、柱墩和尖拱，不能用一个实心盒子把它填满。',['看石墩和尖拱的节奏。','比较下部石构与上部居住窗面。'],ks,'Benha大学课程所载平面与现场照片，页3左图逐点读取院落和柱位。','khan-wikala'),feature('wikala-upper','上部居住层与木格窗',wo,'突出的木格窗既控制视线，也让居民能观察院落。石材与木构形成上下层次；格栅不是贴在墙上的随机装饰。',['侧看木格窗伸出墙面的深度。','比较下部公共交易空间和上部私密空间。'],ks,'MWNF记录与大学资料立面；窗饰只保留主要轮廓，不复制未核对的木格纹样。'),feature('wikala-street','临街正面与居中入口',rect(350,590,455,130),'入口从街道直接引向内部院落，临街正面的木格窗与院内呼应。先读整面墙，再靠近门户的石材和拱形细节。',['对照九处临街木格窗与中间入口。','进入院落后回望，理解街道到庭院的转换。'],ks,'MWNF明确正面九处木格窗；平面与立面资料保留直通入口位置。')];
const wp:ExteriorPart[]=[part('wikala-lower-shell','wikala-court',{kind:'prism',footprint:wo,holes:[[[503,222],[704,222],[697,583],[502,583]]],height:110},'stone'),part('wikala-upper-shell','wikala-upper',{kind:'prism',footprint:wo,holes:[wc],height:137,base:110},'sandstone'),prism('wikala-open-court','wikala-court',wc,1,0,'ground')];
// Stone arcade openings are expressed by piers and spandrels rather than a solid courtyard wall.
function arch(id:string,a:XY,b:XY){const dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz),nx=-dz/l*4,nz=dx/l*4;for(let storey=0;storey<2;storey++){const verts:XYZ[]=[],tri:number[]=[],base=storey*55;const archY=(t:number)=>base+29.5+21.5*Math.sqrt(1-(1-Math.min(t,1-t))**2)/Math.sqrt(.75);for(let i=0;i<=16;i++){const t=i/16,x=a[0]+dx*t,z=a[1]+dz*t;verts.push([x+nx,archY(t),z+nz],[x+nx,base+55,z+nz],[x-nx,archY(t),z-nz],[x-nx,base+55,z-nz]);if(i){const q=(i-1)*4,r=i*4;tri.push(q,r,r+1,q,r+1,q+1,q+2,r+3,r+2,q+2,q+3,r+3,q+1,r+1,r+3,q+1,r+3,q+3);}}wp.push(part(id+'-storey-'+storey,'wikala-court',{kind:'mesh',vertices:verts,triangles:tri},'stone'));}}
for(const x of [530,681]){const zs=[245,293,340,382,424,468,514,554];zs.forEach((z,i)=>{wp.push(prism(`wikala-pier-${x}-${i}`,'wikala-court',rect(x-4,z-4,8,8),110));if(i)arch(`wikala-arch-${x}-${i}`,[x,zs[i-1]],[x,z]);});}
for(const z of [245,554]){const xs=[530,582,632,681];for(const x of xs.slice(1,-1))wp.push(prism(`wikala-end-pier-${z}-${x}`,'wikala-court',rect(x-4,z-4,8,8),110));for(let i=1;i<xs.length;i++)arch(`wikala-end-arch-${z}-${i}`,[xs[i-1],z],[xs[i],z]);}
for(let i=0;i<9;i++){const x=360+i*50;wp.push(prism('wikala-front-mashrabiyya-'+i,'wikala-street',rect(x,710,28,12),36,195,'timber'));}
for(const x of [526,668])for(let i=0;i<7;i++)wp.push(prism(`wikala-court-mashrabiyya-${x}-${i}`,'wikala-upper',rect(x-6,262+i*43,14,24),34,197,'timber'));
// Portal is cut out of the frontage as an explicit void, not painted onto a solid wall.
const front=wp.find(p=>p.id==='wikala-lower-shell')!;if(front.geometry.kind==='prism'){
 // An entrance connected to the courtyard is an open notch, never a hole
 // crossing the outer ring (invalid for both SVG fills and mesh triangulation).
 front.geometry.footprint=[...wo,[620,715],[620,583],[697,583],[704,222],[503,222],[502,583],[580,583],[580,715]];
 front.geometry.holes=[];
}
wp.push(prism('wikala-portal-lintel','wikala-street',rect(579,694,42,22),48,62),prism('wikala-fountain','wikala-court',circle(605,418,20,8),8,0,'stone'));
const wm=model('wikala-exterior','古里维卡拉 · 院落与临街立面',[325,110,550,630],ks,'/images/guides/khan-el-khalili/01.jpg',wf,wp,['独立建筑绘图坐标未伪装成街区的测量配准；街区模型中的位置仍用OSM原点位。','院落比例、柱位和临街窗数量有图件支持；层高为实景比例解读，非逐层测量。'],[.8,.8,1]);wm.referencePage='https://islamicart.museumwnf.org/database_item.php?id=monument;ISL;eg;Mon01;17;en';wm.referenceCaption='市场街巷实景；古里维卡拉的专门平面及立面见来源中的大学资料页2–5。';
export const khanExterior:ExteriorGuide={slug:'khan-el-khalili',intro:'先看街区真实轮廓，再细看一座与街区贸易历史相关的独立建筑；两种尺度不混成一张假地图。',models:[km,wm]};

const or=orangeData as unknown as ArchitecturalModel,os=['src-osm','src-orange-bay'];
const of=or.spaces.map(s=>feature(s.id,s.title,s.polygon,s.nodeId==='orange-beach'?'海湾由曲折沙岸、浅水边缘和服务设施共同构成，不是一座四面围合的建筑。看外观时先分清海与陆，再确认集合栈桥。':s.title.includes('栈桥')?'栈桥从岸边伸向水面；它是会随运营安排使用的设施，不代表每天同一条船在同一位置靠泊。':'这些是有地理足迹的岸边服务设施。现有来源没有可靠屋顶及室内测绘，不把它们画成虚构的茅草度假村。',['集合地点由当天船方确认。','模型不表达水深、潮位或可安全下水范围。'],os,'OSM逐点岸线、沙滩和栈桥；与经营方海岛位置核对，高度不作测量承诺。',s.nodeId));
const op=contextParts(orangeContext,or.spaces,of[0].id);op.unshift(prism('orange-water','orange-way-596985543',rect(0,0,or.bounds[2],or.bounds[3]),.4,-.6,'water'));
const om=model('orange-exterior','Orange Bay · 沙岸、栈桥与海面',or.bounds,os,'/images/guides/orange-bay/02.jpg',of,op,['场地外观，不是海床或建筑施工模型；没有伪造珊瑚礁、海深和救生通道。','OSM岸线与运营设施可能变化；不把显示高度写成测量值。'],[.45,.9,1]);om.referenceCaption='红海海岛环境对照；沙滩与栈桥的具体几何以登记OSM来源为准，照片不承担设施定位。';
export const orangeExterior:ExteriorGuide={slug:'orange-bay',intro:'海岛采用有来源的海岸场地模型，不套用博物馆室内或神庙外观模板。',models:[om]};
