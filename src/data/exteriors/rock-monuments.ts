import { gizaArchitectureLevels } from '../architecture/giza';
import type { ExteriorGuide, ExteriorPart, XYZ } from './types';
import type { Ring, XY } from '../architecture/types';
import { center,column,feature,model,part,prism,ramp,rect,seated } from './builders';
const abuSources=['src-abu-simbel','src-abu-plan','src-abu-small-plan','src-unesco-nubian'];
function abuFacade(small=false){
 const id=small?'abu-small-exterior':'abu-great-exterior',width=small?30:38,height=small?12:30;
 const features=[
  feature(id+'-facade',small?'小神庙：六尊立像的岩凿立面':'大神庙：四尊坐像与倒塌的一尊',rect(-width/2,0,width,8),small?'六尊站立人物分列中央入口，王后与国王接近同尺度。立像和岩壁连在一起，不能把它做成四尊大神庙坐像的缩小版本。':'四尊拉美西斯二世坐像控制正面尺度，其中自左数第二尊的上部已经倒塌。这里保留损坏，不补成完整的四个国王；倒落石块也不是装饰。',small?['分别看王后与国王的并列。','比较立像、立壁和中央门洞。']:['先看坐像与入口的比例。','辨认缺损的一尊。','从轮廓阅读王权，不把简化人物当作雕刻复制。'],abuSources,'立面构成依据文物部门现状说明与实景；人物为姿態轮廓，非扫描，脸部与浮雕不复原。',small?'abu-small':'abu-great'),
  feature(id+'-entry','中央门洞与岩凿空间',rect(-1.4,0,2.8,8),small?'入口位于六像之间，进入后是独立的六柱厅，和大神庙不同。先在门外辨认王后与国王，再入内观察柱头上的哈托尔形象。':'门洞在巨像之间显得很小；它把外部强光与后方柱厅的暗环境连接起来。太阳照射圣所的现象属于特定日期，不等于普通到访都会出现。',['切到内部图看真实厅室。','中央黑色门洞不是整座山体的剖面。'],abuSources,'门洞与平面中轴核对；不伪造游客通行尺度。',small?'abu-small':'abu-first-hall'),
  feature(id+'-relocation','重组山体与迁移工程',rect(-width*.68,-9,width*1.36,10),'现址并非未经移动的古代原位。1960年代的国际工程将两座神庙迁移并重组到新位置；岩体背后的现代保护结构不能等同于古代天然山体。',['把现代迁移与古代岩凿分别理解。','不按本模型寻找山体后部施工空间。'],abuSources,'UNESCO与文物部门迁移记录；模型仅画局部承托岩壁，不臆造整座山体测量轮廓。'),
 ];
 const parts:ExteriorPart[]=[];
 parts.push(prism(id+'-rock-left',id+'-relocation',rect(-width*.65,-8,width*.65-1.35,small?11:13),height*.94,0,'sandstone',.85),prism(id+'-rock-right',id+'-relocation',rect(1.35,-8,width*.65-1.35,small?11:13),height*.94,0,'sandstone',.85));
 // The façade is continuous above the portal; tapering side masses must not create a slit through its top.
 parts.push(prism(id+'-lintel',id+'-entry',rect(-width*.46,0,width*.92,small?3:5),height*.94-(small?4.5:7),small?4.5:7),prism(id+'-cornice',id+'-facade',rect(-width/2,-.2,width,1.4),.9,height*.93));
 if(!small){[-13.3,-5.4,5.4,13.3].forEach((x,i)=>parts.push(...seated(`${id}-colossus-${i+1}`,id+'-facade',[x,5],7.4,20,0,i===1).map(p=>({...p,material:'sandstone' as const}))));parts.push(prism(id+'-fallen-fragments',id+'-facade',[[-8,7],[-5,6.5],[-2.7,8],[-3.5,9.7],[-6.9,10]],2.1));}
 else for(const [i,x]of [-12.2,-7.5,-3.4,3.4,7.5,12.2].entries()){
  const fid=id+'-facade';
  parts.push(prism(`${id}-figure-${i}-legs`,fid,rect(x-.67,3.5,1.34,.8),4.3,.3,'sandstone',.9),prism(`${id}-figure-${i}-body`,fid,[[x-.7,3.1],[x+.7,3.1],[x+.88,4.1],[x-.88,4.1]],3,4.5,'sandstone',1.15),prism(`${id}-figure-${i}-head`,fid,rect(x-.59,3.35,1.18,.85),1.2,7.8,'sandstone',.7),part(`${id}-figure-${i}-crown`,fid,{kind:'lathe',center:[x,3.8],profile:[[.5,0],[.38,.8],[.15,1.5]],base:9},'sandstone'));
 }
 const result=model(id,small?'小神庙岩凿立面':'大神庙岩凿立面',[-width*.75,-10,width*1.5,23],abuSources,small?'/images/guides/abu-simbel/02.jpg':'/images/guides/abu-simbel/03.jpg',features,parts,['两座立面为独立观察视图，不把不同尺度底图硬拼成可量测的两庙总平面。','雕像只表达有据的坐／立姿态、数量与缺损；细部请对照实景，不是考古雕刻复原。'],[.65,.45,1.8]);result.referenceCaption=small?'小神庙六立像实景；现存外观对照。':'现址航空照片：大神庙、小神庙与重组山体。';return result;
}
export const abuExterior:ExteriorGuide={slug:'abu-simbel',intro:'大神庙与小神庙分别建模；区分坐像、立像、缺损和现代迁移，不把岩凿建筑画成独立盒子。',models:[abuFacade(),abuFacade(true)]};

const hatSources=['src-hatshepsut-whole-plan','src-hatshepsut-oic-plan','src-hatshepsut'];
const hatFeatures=[
 feature('hat-lower','下层前院与第一柱廊',rect(263,351,164,204),'长前院把观看距离拉开，第一柱廊横向铺展在台地前沿。三层不是三层封闭房间，而是逐级后退的院落与建筑带。',['先看整条水平线与中央轴。','观察前院的开放天空。'],hatSources,'全景平面7/8、ISAC最低柱廊；不由半页图镜像制造整个寺。','hat-east-ramp'),
 feature('hat-middle','中层台地与两侧柱廊',rect(263,190,165,162),'中层宽阔庭院把正面的柱廊抬升；庞特与诞生叙事分处两侧，外观先看对称节奏，内部再看不同叙事。',['分别辨认两侧柱廊。','模型不以颜色虚构壁画保存状态。'],hatSources,'全景平面9/10，中层独立柱廊在ISAC细图中交叉核对。','hat-punt'),
 feature('hat-upper','上层院落与柱像立面',rect(261,101,132,88),'上层柱像与柱廊面对前方台地；院落后部通向阿蒙圣所。上层不是叠在下层正上方的第三个整盒子，而是退后的建筑层。',['看上层如何后退。','比较柱像正面与普通支柱。','圣所是后方岩凿空间。'],hatSources,'全景平面13/14；上层院落、柱廊与圣所在ISAC细图可对应。','hat-amun-x'),
 feature('hat-ramps','两段中央坡道',rect(320,174,29,252),'坡道把三层台地连成一条视觉轴，但并不等于本图承诺了无障碍通行。站在侧面更容易读出坡道与支承平台的真实关系。',['从斜侧方向看高差。','留意每段坡道的起止平台。'],hatSources,'全景平面明确描画两段坡道；高差仅用外观比例表示。','hat-east-ramp'),
 feature('hat-side','哈托尔与阿努比斯侧殿',rect(225,126,202,65),'两侧附属礼拜空间位置与形态不同，不能镜像复制。左侧哈托尔和另一侧阿努比斯的细节，在内部图各有独立来源平面。',['区别侧殿与主立面的柱廊。','切换内部图读各自厅室。'],hatSources,'全景图11/12及ISAC对应细图；高处岩壁不随意生成。'),
];
const hatParts:ExteriorPart[]=[prism('hat-lower-ground','hat-lower',rect(263,351,164,204),1,0,'ground'),prism('hat-middle-platform','hat-middle',rect(263,187,165,162),19),prism('hat-upper-platform','hat-upper',rect(262,101,132,87),38)];
for(const [tier,z,x0,x1,base,count]of [[0,352,270,322,0,11],[1,352,349,420,0,12],[2,185,266,316,19,11],[3,185,349,389,19,11],[4,168,269,316,38,10],[5,168,347,389,38,10]] as const){const fid=base===0?'hat-lower':base===19?'hat-middle':'hat-upper';for(let n=0;n<count;n++){const x=x0+(x1-x0)*n/(count-1);hatParts.push(prism(`hat-colonnade-${tier}-pier-${n}`,fid,rect(x-1.25,z-3,2.5,3),15.5,base));if(base===38)hatParts.push(part(`hat-osiride-${tier}-${n}`,fid,{kind:'lathe',center:[x,z+.9],profile:[[1,0],[.8,6],[1.25,9],[.65,12],[.8,13.5],[.6,15]],base},'sandstone'));}hatParts.push(prism(`hat-colonnade-${tier}-roof`,fid,rect(x0-3,z-9,x1-x0+6,13),2.2,base+15.5));}
hatParts.push(ramp('hat-lower-ramp','hat-ramps',[[329,426],[345,426],[341,350],[325,350]],.7,19),ramp('hat-upper-ramp','hat-ramps',[[321,260],[339,260],[338,175],[320,175]],19,38));
hatParts.push(prism('hat-west-boundary','hat-upper',rect(261,100,132,4),18,38),prism('hat-west-side','hat-upper',rect(261,101,4,67),18,38),prism('hat-east-side','hat-upper',rect(389,103,4,65),18,38));
hatParts.push(prism('hat-hathor-side-shell','hat-side',rect(225,159,35,27),16,19),prism('hat-anubis-side-shell','hat-side',rect(397,162,27,22),16,19));
const hatModel=model('hatshepsut-exterior','三层台地、两段坡道与柱廊',[220,65,215,502],hatSources,'/images/guides/hatshepsut-temple/01.jpg',hatFeatures,hatParts,['水平布局依据完整总图，细节以ISAC核对；高度是层级示意，不是标高测绘。','不虚构背后悬崖高度与表面；实景照片保留建筑与岩壁的观看关系。'],[.8,.55,1]);
hatModel.referencePage='https://commons.wikimedia.org/wiki/File:Deir_el_Bahari-map.png';
hatModel.limitations.push('总图重绘：Gérard Ducher / Janmad，CC BY-SA 2.5；此衍生几何按同许可提供，已简化并添加三维层次。');
export const hatshepsutExterior:ExteriorGuide={slug:'hatshepsut-temple',intro:'台地后退、中央坡道和重复柱廊是外观识别的核心；室内分图继续保留独立平面尺度。',models:[hatModel]};

const gi=gizaArchitectureLevels[0];
const gizaSources=['src-giza-plateau-plan','src-egypt-giza','src-digital-giza','src-sphinx-dimensions'];
const gizaFeatures=[
 ...['khufu','khafre','menkaure'].map((name,i)=>{const s=gi.spaces.find(s=>s.id===`giza-${name}-base`)!;return feature('gz-'+name,['胡夫：最高主塔与磨蚀顶部','哈夫拉：顶部包层与高地错觉','孟卡拉：较小尺度与花岗岩下部'][i],s.polygon,['胡夫塔原始光滑外皮大多已失；模型用轮廓和顶部截平区分今天与理想尖顶。石块细节用实景观察，不添加随机砖缝冒充测绘。','顶部仍能看到较光滑包层，这是远处辨认哈夫拉的重要线索。它与胡夫的视觉高低还受地势影响；本模型不虚构精确地形高差。','第三座主塔规模较小，下部花岗岩与上部石灰岩的材质变化值得近看。正面破口是后世损坏，不应被误解为原设计入口。'][i],['从远景比较三塔尺度。','再看顶部与基部材料。'],gizaSources,'底面和轴向继承Giza Archives总图；原始塔高为文物部门记录，顶部缺损与包层按外观分层表示。',s.nodeId);}),
 feature('gz-necropolis','王后塔与墓园',rect(450,500,2860,3540),'三座主塔不是孤立雕塑。小塔、马斯塔巴墓园与神庙—甬道共同构成王陵复合体；本图不把每一个墓园矩形恢复成确定高度的完整陵墓。',['把主塔与附属墓分开。','看墓园密度与有序排列。'],gizaSources,'附属塔与墓园足迹采用总图登记实体；未测量的高度只表达低矮层次。'),
 feature('gz-sphinx','狮身人面像与谷地建筑',gi.spaces.find(s=>s.id==='giza-sphinx-body')!.polygon,'狮身、人头和长伸前爪构成独特轮廓，不是金字塔旁的一颗球。可切到近景独立观察，旁边的河谷神庙和狮身人面像神庙也不是同一座建筑。',['对比侧面躯干与头部比例。','区分两座谷地神庙。'],gizaSources,'狮身人面像外轮廓来自总图；近景依据官方尺寸与侧面实景示意。','giza-sphinx'),
 feature('gz-causeways','神庙、甬道与高低关系',rect(750,1070,1440,3110),'甬道连接高地葬祭殿与河谷神庙。路线在考古总图上存在，不意味着今日游客能沿所有甬道走通。',['将上殿、甬道、下殿看成一组。','区别历史礼仪线与现代游客路。'],gizaSources,'每条甬道和神庙分别沿用来源足迹，不拼接成现代导航。'),
];
const gizaParts:ExteriorPart[]=[];
gi.solids?.forEach(s=>{const name=s.id.includes('khufu')?'khufu':s.id.includes('khafre')?'khafre':s.id.includes('menkaure')?'menkaure':undefined;const fid=name?'gz-'+name:'gz-necropolis';const h=s.height;
 if(name==='khafre'){gizaParts.push(prism(s.id+'-core',fid,s.footprint,h*.8,0,'sandstone',.2));const c=center(s.footprint),top=s.footprint.map(([x,y])=>[c[0]+(x-c[0])*.2,c[1]+(y-c[1])*.2] as XY);gizaParts.push(prism(s.id+'-casing',fid,top,h*.18,h*.8,'stone',.045));}
 else gizaParts.push(prism(s.id,fid,s.footprint,h*(name==='khufu'?.95:1),0,'sandstone',name==='khufu'?.05:0));
});
gi.spaces.filter(s=>s.id.includes('queen')||s.id.includes('satellite')).forEach(s=>gizaParts.push(prism(s.id+'-exterior','gz-necropolis',s.polygon,35,0,'sandstone',.16)));
gi.spaces.filter(s=>!s.id.endsWith('-base')&&!s.id.includes('queen')&&!s.id.includes('satellite')).forEach(s=>{if(s.id==='giza-sphinx-body')return;gizaParts.push(prism(s.id,s.id.includes('mastaba')?'gz-necropolis':'gz-causeways',s.polygon,s.id.includes('causeway')?3:s.id.includes('mastaba')?20:11,0,'sandstone'));});
/** Longitudinal rings preserve feline haunch/body; front paws and human headdress separate. */
function sphinxParts():ExteriorPart[]{
 const parts:ExteriorPart[]=[],fid='gz-sphinx';const vertices:XYZ[]=[],triangles:number[]=[];
 const rings=[[-34,4,3],[-26,8,7],[-15,7.5,7.7],[0,6.4,8.5],[12,5.8,8.8],[18,3,6]];
 for(const [z,r,h]of rings)for(let i=0;i<13;i++){const a=i*Math.PI/12;vertices.push([r*Math.cos(a),1+h*Math.sin(a),z]);}
 for(let j=0;j<rings.length-1;j++)for(let i=0;i<12;i++){const a=j*13+i;triangles.push(a,a+13,a+1,a+1,a+13,a+14);}
 parts.push(part('sphinx-body-profile',fid,{kind:'mesh',vertices,triangles},'sandstone'));
 for(const side of [-1,1])parts.push(prism('sphinx-paw-'+side,fid,rect(side>0?2:-6,12,4,25),3.3,0,'sandstone',.86));
 parts.push(prism('sphinx-chest',fid,[[-4.8,9],[4.8,9],[4,18],[-4,18]],9.5,2,'sandstone',.78));
 const head:XYZ[]=[[-4,11,13],[4,11,13],[-4.2,17,11],[4.2,17,11],[-2.6,20,9],[2.6,20,9],[-2.5,20,15],[2.5,20,15],[-3,14,18],[3,14,18],[-1.9,11.8,18],[1.9,11.8,18]];
 parts.push(part('sphinx-human-headcloth',fid,{kind:'mesh',vertices:head,triangles:[0,2,4,0,4,6,0,6,8,0,8,10,1,5,3,1,7,5,1,9,7,1,11,9,4,5,7,4,7,6,6,7,9,6,9,8,8,9,11,8,11,10,2,3,5,2,5,4]},'sandstone'));
 return parts;
}
const sphinx=sphinxParts();
// Scale the independent metric near-view into the registered plateau footprint.
const sphinxAnchor=gi.spaces.find(s=>s.id==='giza-sphinx-body')!.anchor;
gizaParts.push(...sphinx.map(p=>{const conv=([x,y,z]:XYZ):XYZ=>[sphinxAnchor[0]+x*3.5,y*3.5,3858+z*3.5];const g=p.geometry;return {...p,id:'plateau-'+p.id,geometry:g.kind==='mesh'?{...g,vertices:g.vertices.map(conv)}:g.kind==='prism'?{...g,footprint:g.footprint.map(([x,z])=>{const q=conv([x,0,z]);return[q[0],q[2]] as XY;}),height:g.height*3.5,base:(g.base??0)*3.5}:g};}));
const sphinxFeature=feature('gz-sphinx','狮身、人头、伸出的前爪',rect(-10,-36,20,73.5),'从侧面先读狮体，再看头巾和人脸。缺鼻、侵蚀和修复属于对象历史；本模型没有给它补上未经核实的鼻子或胡须。',['用长前爪辨认朝向。','比较头部与庞大身体的尺度。','浮雕细节以实景为准。'],gizaSources,'政府资料长约73.5m、宽19.3m、高约20m；轮廓作保守解释，不声称扫描复原。','giza-sphinx');
export const gizaExterior:ExteriorGuide={slug:'giza-plateau',intro:'塔体、包层、附属墓园、甬道与狮身人面像分别建模；历史原始高度与现存损坏不混为一谈。',models:[model('giza-exterior','三座主塔与王陵复合体',gi.bounds,gizaSources,'/images/guides/giza-plateau/02.jpg',gizaFeatures,gizaParts,['没有采用高地测量高程；三塔底面统一展示，不能据此比较真实海拔。','主塔整体形态与附属实体有来源；不复原石块、损坏洞口及整座墓园原高。']),model('sphinx-exterior','狮身人面像近景',[-12,-38,24,79],gizaSources,'/images/guides/giza-plateau/04.jpg',[sphinxFeature],sphinx,['人脸与石块细节未重建；本模型为姿态解读，不冒充公开激光扫描。'],[1,.35,.6])]};

const memSources=['src-colossi-research','src-amenhotep-photo-study','src-osm','src-memnon-scan'];
const memFeatures=[
 feature('mem-north','北巨像：破坏与修复痕迹',rect(-14,-4,7,8),'北像经历破坏和古代修复。今天表面的拼接、断裂与风化是阅读对象的重点；不要用光滑完美脸庞替代它的现状。',['比较胸腹与腿部接缝。','从侧面看王座厚度。','公开扫描来源独立列明，本站不是该扫描的副本。'],memSources,'两像位置关系基于OSM；姿态由现存影像支持。轮廓比例非逐石测绘。','colossi-north'),
 feature('mem-south','南巨像：坐姿与王座',rect(7,-4,7,8),'另一尊同样表现阿蒙霍特普三世端坐、双手置于膝上。两尊不是两个不同神的随意配对，而是曾经共同控制神庙入口的王像。',['看双手、膝部、王座构成的坐姿。','与北像比较保存状态。'],memSources,'并列坐像身份由文物部门资料核对；不把北像扫描复制成南像。','colossi-south'),
 feature('mem-axis','曾经的葬祭殿入口',rect(-18,-17,36,14),'今天看见的是庞大葬祭殿入口前的两尊巨像，背后遗址远大于眼前的双像。外观近景不补画已消失的大塔门；场地总图另看其真实范围。',['退后将两像一起看。','再看背后遗址，而不只拍人物正面。'],memSources,'神庙遗址范围另有OSM场地图，本近景仅按已知双像关系作局部观看。','colossi-temple'),
];
const memParts=[...seated('memnon-northern','mem-north',[-10.5,0],6.4,18),...seated('memnon-southern','mem-south',[10.5,0],6.5,18)];
// The northern repaired torso is articulated; do not clone identical surfaces.
memParts.filter(p=>p.id.includes('northern')&&p.geometry.kind==='prism').forEach(p=>{p.material='sandstone';});
// Surface erosion is not synthesized with random noise; the photographed damage remains the authority.
memParts.push(prism('memnon-viewing-ground','mem-axis',rect(-18,-9,36,15),.15,-.2,'ground'));
export const memnonExterior:ExteriorGuide={slug:'colossi-of-memnon',intro:'双坐像近景与背后葬祭殿场地图分开；人物姿态、王座与损坏用实景对照，不以两个定位圆点代替外观。',models:[model('memnon-exterior','门农双坐像与失去的入口',[-20,-13,40,27],memSources,'/images/guides/colossi-of-memnon/01.jpg',memFeatures,memParts,['局部双像图为姿态与尺度示意；间距和表面不作可量测声明，确切地理定位见场地图。','已发现INSIGHT的CC BY扫描，下载需要登录，未下载或接入；本站形体为独立简化模型。'],[.7,.38,1.6])]};
