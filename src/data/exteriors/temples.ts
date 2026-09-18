import { edfuArchitecture as ed } from '../architecture/edfu';
import { luxorArchitecture as lu } from '../architecture/luxor';
import { komArchitecture as ko } from '../architecture/kom';
import { karnakArchitectureLevels } from '../architecture/karnak';
import type { ExteriorGuide, ExteriorPart } from './types';
import { center,column,extents,feature,model,obelisk,part,prism,rect,seated,sourceRoom } from './builders';

const edSources=['src-edfu-plan','src-edfu-official'];
const edFeatures=[
 feature('ed-pylon','双塔门与中央入口',rect(6,807,419,73),'两座向上收分的塔体并不是两根普通立柱。入口被压在中间，顶部线条、门洞与巨幅浮雕共同组织正面；从广场退后看完整轮廓，再近看王与神的比例。',['比较塔体收分与顶部檐口。','找中央门洞，不把模型的正面当作今日售票入口。','征服敌人的王权图像要结合神庙礼仪解读。'],edSources,'底面采用原图A/B；收分、中央门洞与檐口依据现存塔门照片。', 'edfu-pylon'),
 feature('ed-court','露天柱廊庭院',sourceRoom(ed,'edfu-court').polygon,'穿过塔门后突然开阔的是露天庭院，三面柱列又把视线收回中轴。外观层保留露天中心与周边有顶柱廊，不能给整个庭院盖屋顶。',['从塔门看柱列框景。','注意柱头植物形态。','区别庭院开放天空与后方封闭殿体。'],edSources,'原图C的32处柱位逐点继承，柱廊顶面为结构层级示意。','edfu-court'),
 feature('ed-halls','屋顶高低递进的两座柱厅',rect(84,294,255,211),'外部能读出柱厅体量的递进；内部光线和空间逐渐收紧。模型只表达现存屋盖的大层次，不把屋面画成获准登临的观景台。',['比较前厅与后厅高度。','观察柱厅正面的屏墙与柱头。','想象屋盖对内部光线的控制。'],edSources,'外柱厅D、内柱厅E的底面；竖向由实景体量保守派生。','edfu-hypostyle'),
 feature('ed-rear','内殿外壳与外围通道',rect(62,5,299,385),'内殿不是孤立小屋，侧室与外墙围成嵌套结构。外部绕行与内部圣所是两种不同阅读方式；外观图不显示虚构的现代门或完整屋顶交通。',['对照外围高墙与内殿墙体。','注意中轴向后收窄。','参观内部时切换“内部／场地”，不要透过屋顶猜房间。'],edSources,'围墙、侧室与H核心来自同一底图；不增加未画出的门窗。','edfu-sanctuary'),
];
const edParts:ExteriorPart[]=[];
for(const id of ['edfu-pylon-west','edfu-pylon-east']){const p=sourceRoom(ed,id).polygon;edParts.push(prism(id+'-shell','ed-pylon',p,174,0,'sandstone',.85),prism(id+'-cornice','ed-pylon',p,7,172,'sandstone',.91));}
edParts.push(prism('ed-entry-lintel','ed-pylon',rect(193,810,42,65),26,85),prism('ed-court-floor','ed-court',sourceRoom(ed,'edfu-court').polygon,1,0,'ground'));
ed.columns.filter(c=>c.evidenceId==='edfu-e-court').forEach(c=>edParts.push(column(c.id,'ed-court',c.center,c.radius,58)));
for(const p of [rect(73,507,35,296),rect(310,507,36,296),rect(100,770,216,35)])edParts.push(prism(`ed-colonnade-roof-${edParts.length}`,'ed-court',p,6,58));
ed.walls.filter(w=>w.id.includes('enclosure')).forEach(w=>edParts.push(prism(w.id,'ed-rear',w.polygon,61)));
for(const [id,p,h]of [['ed-outer-envelope',rect(84,390,253,115),110],['ed-inner-envelope',rect(106,294,210,99),85],['ed-rear-envelope',rect(105,45,211,251),69]] as const){edParts.push(prism(id,id.includes('rear')?'ed-rear':'ed-halls',p,h),prism(id+'-roof',id.includes('rear')?'ed-rear':'ed-halls',p,5,h,'stone'));}
// Front hall's six screen columns remain legible on the exterior face.
ed.columns.filter(c=>c.center[1]>480&&c.center[1]<505).forEach(c=>edParts.push(column(c.id+'-facade','ed-halls',[c.center[0],506],c.radius,103)));
export const edfuExterior:ExteriorGuide={slug:'edfu-temple',intro:'先读双塔门，再看露天庭院与逐渐收紧的有顶殿体。外观不是室内墙线的统一挤出。',models:[model('edfu-exterior','塔门、柱廊与完整殿体',[-18,-15,475,958],edSources,'/images/guides/edfu-temple/01.jpg',edFeatures,edParts,['屋面标高未取得完整测量剖面，保留高低关系，不提供可量测的高度或屋顶参观路线。'])]};

const luxSources=['src-luxor-plan','src-luxor-temple'];
const luxFeatures=[
 feature('lu-front','塔门、方尖碑与王像',rect(108,1686,366,132),'北端正面今天呈不对称：一座方尖碑留在原位，另一座已迁往巴黎。前方王像与塔门仍共同放大入口，不能把空缺补成一套“完美对称复原”。',['辨认仅存的一座方尖碑。','看塔门表面图像与石块接缝。','先从正面远看，再靠近王像。'],luxSources,'塔门底面来自ISAC，现存方尖碑与坐像的位置层级参照实景；人物不是扫描。','luxor-pylon'),
 feature('lu-ramesses','拉美西斯二世庭院',sourceRoom(lu,'luxor-court-r').polygon,'前庭与后方旧殿的中轴存在偏转，不应把整个建筑拉直。柱廊环绕开敞空间，东侧保留长期宗教使用的叠加背景。',['从庭院回望塔门。','辨认前后轴线的折转。','寺院、清真寺与神庙不是同一时期。'],luxSources,'保持原图前院斜向边界，柱位逐点沿用。','luxor-rameses-court'),
 feature('lu-colonnade','阿蒙霍特普三世大柱廊',sourceRoom(lu,'luxor-colonnade-space').polygon,'两列高大的开花纸莎草柱控制狭长通道，和宽庭院形成节奏差异。遗址现状不应被一片新屋顶遮住。',['从端部看柱列透视。','比较高柱与身旁墙上的浮雕尺度。','留意顶梁与已消失屋盖的区别。'],luxSources,'柱廊位置与十四柱来自ISAC平面；柱形依据现场记录。','luxor-colonnade'),
 feature('lu-old-court','较早的开敞庭院与柱厅',sourceRoom(lu,'luxor-court-a').polygon,'向南进入阿蒙霍特普三世庭院后，横向展开再次占据主导。成组柱列、残墙和更深处小房间的节奏，可以从整体外观先读一遍。',['把露天庭院与密集柱厅分开。','观察柱列间距与轴线。','不要把修补与断裂当成原始设计。'],luxSources,'空间和柱位采用核对后的历史图，不复原全部失去的构件。','luxor-inner'),
 feature('lu-sanctuary','内殿与多时期使用',rect(195,180,225,470),'深处空间经过不同时期使用与改造，残墙和门洞并不对应一个未经改变的原始建筑。外观层保留低墙与局部殿体，细读请进入内部图。',['观察由柱列转向小室的尺度变化。','把不同时期图像与建筑改动联系起来。'],luxSources,'原图内殿边界；残存高度做保守表达，不复原假屋顶。','luxor-sanctuary'),
];
const luxParts:ExteriorPart[]=[];
lu.walls.forEach((w,i)=>{const z=center(w.polygon)[1];const fid=i<2?'lu-front':z>1300?'lu-ramesses':z>975?'lu-colonnade':z>648?'lu-old-court':'lu-sanctuary';const factor=1598/1376;const p=i===0?([[90,1448],[121,1448],[121,1454],[244,1456],[244,1494],[90,1492]] as const).map(([x,y])=>[x*factor,y*factor] as const):i===1?([[270,1456],[396,1458],[397,1452],[424,1454],[424,1501],[270,1497]] as const).map(([x,y])=>[x*factor,y*factor] as const):w.polygon;luxParts.push(prism(w.id,fid,p,i<2?142:z>648?20:30,0,'sandstone',i<2?.84:1));if(i<2)luxParts.push(prism(w.id+'-cornice',fid,p,6,139));});
lu.columns.forEach(c=>{const z=c.center[1],fid=z>1300?'lu-ramesses':z>975?'lu-colonnade':z>648?'lu-old-court':'lu-sanctuary';luxParts.push(column(c.id,fid,c.center,c.radius,z>975&&z<1300?106:z>648?65:58,0,z>975&&z<1300));});
luxParts.push(...obelisk('lu-surviving-obelisk','lu-front',[353,1785],13,145),...seated('lu-west-colossus','lu-front',[267,1765],24,83),...seated('lu-east-colossus','lu-front',[323,1770],24,83));
lu.spaces.filter(s=>s.kind==='court').forEach(s=>luxParts.push(prism(s.id+'-ground',s.id==='luxor-court-r'?'lu-ramesses':'lu-old-court',s.polygon,.7,0,'ground')));
export const luxorExterior:ExteriorGuide={slug:'luxor-temple',intro:'一座不完全同轴的城市神庙：塔门的不对称、两座庭院与十四高柱都保留各自身份。',models:[model('luxor-exterior','现存塔门与露天柱列',[95,150,430,1695],luxSources,'/images/guides/luxor-temple/01.jpg',luxFeatures,luxParts,['不补回已迁走的方尖碑，不把散失屋顶封闭复原；王像只作姿态与尺度解读。'],[1,.8,.65])]};

const komSources=['src-kom-labelled-plan','src-kom-ombo'];
const komFeatures=[
 feature('ko-front','河岸高台与前庭',sourceRoom(ko,'kom-front-court').polygon,'今天的入口视野以露出的柱厅和残墙为主。原先完整的塔门已不在，模型不把历史平面上的足迹自动恢复为两座完整高塔。',['先看前庭与后方柱厅的层次。','识别残迹，不把残墙读成完整外墙。'],komSources,'历史前庭平面与现存照片联合判断；不复原消失的前塔门。','kom-court'),
 feature('ko-columns','成对入口与残存柱梁',sourceRoom(ko,'kom-pronaos').polygon,'两套并行礼仪空间的关系，在入口分隔、柱列与上方残存横梁中已经可以看见。柱头的植物形态不同于简单直筒柱。',['比较两个入口。','从柱头看上方残梁。','侧移几步观察前后柱列。'],komSources,'原图柱位；柱头与门楣的形态层级依据现状照片，非浮雕复制。','kom-pronaos'),
 feature('ko-twin','双轴内殿遗迹',rect(173,138,76,93),'两座圣所并列的结构是本庙最关键的特征。现在多为低残墙，不能用两个完整方盒盖住中间的真实空间关系。',['沿两条轴线分别望向后部。','比较门槛和低墙，不把所有空间当成同一长廊。'],komSources,'双轴与圣所独立足迹源自已核对图件；残高示意。','kom-sanctuaries'),
 feature('ko-surround','周边通道与附属建筑',rect(93,85,239,312),'主殿之外还有回廊、井与附属殿堂。看外围时先分清“神庙主体”和周围后增或独立结构，再读局部图像。',['对照外墙与核心的间距。','遗迹边缘和临河台阶以现场围挡为准。'],komSources,'外围来源实体逐项继承；未确认屋盖不补画。','kom-ambulatory'),
];
const komParts:ExteriorPart[]=[];
ko.walls.forEach(w=>{const [x,z,wid,depth]=extents(w.polygon);const near=z>233&&z<276&&x>165&&x<253;komParts.push(prism(w.id,near?'ko-columns':z<231&&x>169&&x<254?'ko-twin':'ko-surround',w.polygon,near?14:wid>150||depth>150?5:3.5));});
ko.columns.forEach(c=>{const z=c.center[1];komParts.push(column(c.id,z>230&&z<280?'ko-columns':'ko-twin',c.center,c.radius,z>230&&z<280?37:z>200?22:4));});
// The two standing front architraves are separate, not an invented continuous roof.
komParts.push(prism('ko-west-door-beam','ko-columns',rect(179,267,21,5),6,33),prism('ko-east-door-beam','ko-columns',rect(215,267,21,5),6,33),prism('ko-court-slab','ko-front',sourceRoom(ko,'kom-front-court').polygon,1,0,'ground'));
export const komExterior:ExteriorGuide={slug:'kom-ombo',intro:'以现存残迹阅读双轴神庙：不把历史平面自动补成一座完整有顶建筑。',models:[model('kom-exterior','双轴、残柱与低墙',[90,80,253,318],komSources,'/images/guides/kom-ombo/01.jpg',komFeatures,komParts,['残墙与残柱仅表达保存层次，不声称每块石头的现存标高。'])]};

const ka=karnakArchitectureLevels[0],kh=karnakArchitectureLevels[1];
const karSources=['src-karnak-eb-plan','src-karnak-memphis-plan','src-karnak','src-karnak-column-heights'];
const karFeatures=[
 feature('ka-pylons','连续塔门与未完成的第一塔门',rect(44,1508,659,631),'卡纳克不是一次建成。入口处巨大的第一塔门未完成，两侧高度并不整齐；继续向内可读到另一座塔门及更早建筑的插入。',['比较第一塔门两侧的高低。','看后方建筑如何沿主轴层层出现。'],karSources,'保留EB1911塔门底面；高低与缺损依现存航空照片，不恢复完整对称。','kar-a'),
 feature('ka-court','大庭院及插入建筑',sourceRoom(ka,'kar-b').polygon,'大庭院容纳独立小神庙与后期构筑物，不能把它清空成一块对称大广场。来源平面中的偏置，正是长期叠加的证据。',['比较中轴与侧边小神庙。','先辨认庭院露天，再进入密集柱林。'],karSources,'庭院、三联小祠与拉美西斯三世小庙足迹各自保留。','kar-b'),
 feature('ka-hall','大多柱厅：高低两类柱',sourceRoom(ka,'kar-d').polygon,'中间12根高柱采用开放的纸莎草花形柱头，两侧122根较低柱采用花苞形柱头。屋盖大多已失去，柱林与现存横梁因此暴露在日光下。',['看中轴高柱高出两翼。','比较开放花冠与闭合花苞。','切到“134柱细看”逐点阅读。'],karSources,'孟菲斯大学记录12根约21米与122根约12米；总图比例仅按同平面比例统一换算。','karnak-hypostyle'),
 feature('ka-core','方尖碑与神庙深部',rect(152,78,482,1052),'越向深部，空间越破碎，也越能看出多位国王的增建。方尖碑是明确的竖向地标，但不应靠补造整片屋盖掩盖保存状态。',['比较碑与残塔门的关系。','不要按建筑完整度判断时代早晚。'],karSources,'深部墙线来自历史图；仅保守表达遗迹层次。','karnak-obelisk'),
];
const karParts:ExteriorPart[]=[];
ka.walls.forEach((w,i)=>{const z=center(w.polygon)[1],fid=i<4?'ka-pylons':z>1598?'ka-court':z>1200?'ka-hall':'ka-core';karParts.push(prism(w.id,fid,w.polygon,i===0?140:i===1?210:i<4?150:i<8?65:z>1200?55:18,0,'sandstone',i<8?.86:1));});
ka.columns.forEach(c=>{const [x,z]=c.center;const hall=z>1200&&z<1503,fid=hall?'ka-hall':z>1598?'ka-court':'ka-core';karParts.push(column(c.id,fid,c.center,c.radius,hall?(x>328&&x<425?139:80):55,0,hall&&x>328&&x<425));});
karParts.push(...obelisk('ka-hatshepsut-obelisk','ka-core',[341,922],13,184),...obelisk('ka-thutmose-obelisk','ka-core',[300,1090],12,138));
ka.spaces.filter(s=>s.kind==='court').forEach(s=>karParts.push(prism(s.id+'-floor',center(s.polygon)[1]>1500?'ka-court':'ka-core',s.polygon,.8,0,'ground')));
const karHallFeatures=[
 feature('kh-nave','12根开放花冠高柱',sourceRoom(kh,'kar-nave').polygon,'高柱构成中轴天窗带的结构基础。孟菲斯大学给出的约21米，是柱体层级依据；不要把高柱与整座厅房总高混为一谈。',['沿中轴仰看展开的柱头。','找高柱与两翼低柱顶部的差异。'],karSources,'柱位继承独立134柱研究平面；柱高采用大学研究数据。','karnak-hypostyle'),
 feature('kh-north','北半厅较低柱列',sourceRoom(kh,'kar-north-half').polygon,'较矮、花苞形柱头的柱列与高柱共同承托过屋盖。外观层展示柱林，不虚构完整屋顶或恢复所有横梁。',['从侧面看柱高差。','比较柱面浮雕而非只数柱子。'],karSources,'研究平面逐点柱位；122根低柱约12米。'),
 feature('kh-south','南半厅较低柱列',sourceRoom(kh,'kar-south-half').polygon,'两翼的建筑节奏相近，但装饰阶段与损坏情况不必对称。可在内部图按研究编号比较，不把一侧的图像复制到另一侧。',['留意不同保存状态。','将建筑柱位与浮雕解释分开。'],karSources,'保留独立柱位与左右半厅身份；无浮雕贴图复原。'),
];
const hallParts:ExteriorPart[]=kh.columns.map(c=>{const central=c.center[0]>530&&c.center[0]<704;return column(c.id,central?'kh-nave':c.center[0]<530?'kh-north':'kh-south',c.center,c.radius,central?252:144,0,central);});
hallParts.forEach(p=>p.verticalBasis='孟菲斯大学：中央12柱约21m、侧翼122柱约12m；水平图以同一比例绘制，单柱风化与断裂不逐块复原。');
export const karnakExterior:ExteriorGuide={slug:'karnak',intro:'从主庙整体到134柱细部：未完成塔门、露天大院、高低柱林和残破内殿分层表达。',models:[model('karnak-exterior','阿蒙主庙现存轮廓',[30,30,931,2135],karSources,'/images/guides/karnak/01.jpg',karFeatures,karParts,['采用遗址现存层次，不是某一朝代完整复原；附属神域见内部／场地总图。'],[1,.75,.55]),model('karnak-columns-exterior','134柱：柱高与柱头',[90,240,1050,580],karSources,'/images/guides/karnak/01.jpg',karHallFeatures,hallParts,['柱位、柱数与两类柱高可核对；不把高度简化图当作现况逐石测绘。'])]};
