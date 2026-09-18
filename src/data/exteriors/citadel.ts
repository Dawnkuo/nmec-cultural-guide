import { citadelArchitectureLevels } from '../architecture/citadel';
import type { ExteriorGuide, ExteriorPart } from './types';
import { circle,column,feature,model,part,prism,rect,sourceRoom } from './builders';
const mosque=citadelArchitectureLevels[1];
const sources=['src-muhammad-ali','src-muhammad-ali-wnf-plan','src-citadel'];
const features=[
 feature('ali-dome','中央穹顶、四半穹顶与四角小穹顶',sourceRoom(mosque,'ali-prayer').polygon,'轮廓的关键不是一个半球顶在盒子上，而是中央大穹顶向四个方向层层下落。四半穹顶与四角小穹顶把圆形屋盖过渡到方形礼拜空间。',['正面辨认中央穹顶与半穹顶的层次。','侧移后看穹顶如何覆盖方形主体。','内部抬头观察同一构成，不将模型当作结构施工图。'],sources,'文物部门明确记载1中央穹顶＋4半穹顶＋4角部小穹顶；平面由Hasan Abd al-Wahhab所载图核对。','citadel-prayer'),
 feature('ali-minarets','两座细长宣礼塔',rect(565,73,69,547),'两座带尖锥顶的细长宣礼塔位于礼拜殿与庭院交界，和宽展的穹顶群构成强烈对比。并非城堡中的所有尖塔都属于这座清真寺。',['从侧面确认双塔所在边界。','比较多层阳台与细长尖顶。'],sources,'原图两处旋梯圆形标记定位；层级与尖顶依据现存照片，竖向比例为示意。'),
 feature('ali-court-roof','有顶回廊围绕露天庭院',sourceRoom(mosque,'ali-court').polygon,'庭院中心露天，四边回廊有连续小穹顶。模型保留中间空白，不能把庭院盖成另一座大厅。',['从回廊下观察明暗分界。','比较小穹顶的重复与中央大穹顶。','礼拜与参观按现场管理。'],sources,'回廊边界和支柱位置来自平面；小穹顶只沿已登记回廊布置。','citadel-court'),
 feature('ali-fountain','庭院净身亭',sourceRoom(mosque,'ali-fountain').polygon,'庭院中央的八角形净身亭拥有自己的屋盖与支承体系，是小尺度的独立建筑，不是大殿的缩小复制。',['绕着看八角平面。','比较亭顶与周围回廊。','保持使用空间与拍照空间的区别。'],sources,'原图八角亭轮廓与外观照片；不据模型推断设施可使用状态。'),
 feature('ali-qibla','礼拜殿与米哈拉布突出部',sourceRoom(mosque,'ali-mihrab').polygon,'朝向礼拜方向的一侧有独立突出部。结合平面读外观，能避免把整个建筑误认为四面完全一样。',['在平面中辨认突出部。','入内后找米哈拉布与礼拜方向的联系。'],sources,'礼拜殿及突出部的实际边界继承核对平面。'),
];
const parts:ExteriorPart[]=[];
parts.push(prism('ali-main-shell','ali-dome',rect(110,101,480,496),178,0,'stone'),prism('ali-mihrab-shell','ali-qibla',sourceRoom(mosque,'ali-mihrab').polygon,140,0,'stone'));
parts.push(part('ali-drum','ali-dome',{kind:'lathe',center:[359,347],profile:[[152,0],[152,122],[146,128]],base:178},'stone'),part('ali-central-dome','ali-dome',{kind:'dome',center:[359,347],radius:148,height:132,base:306},'roof'));
for(const [i,[x,z,rotation]]of [[359,216,Math.PI],[359,478,0],[237,347,-Math.PI/2],[480,347,Math.PI/2]].entries())parts.push(part(`ali-semidome-${i+1}`,'ali-dome',{kind:'dome',center:[x,z],radius:124,height:91,base:181,half:rotation},'roof'));
for(const [i,[x,z]]of [[186,162],[532,162],[186,532],[532,532]].entries()){parts.push(part(`ali-corner-drum-${i}`,'ali-dome',{kind:'lathe',center:[x,z],base:177,profile:[[46,0],[46,18]]},'stone'),part(`ali-corner-dome-${i}`,'ali-dome',{kind:'dome',center:[x,z],radius:46,height:38,base:195},'roof'));}
for(const [i,z]of [101,592].entries())parts.push(part(`ali-minaret-${i+1}`,'ali-minarets',{kind:'lathe',center:[595,z],segments:16,profile:[[22,0],[22,170],[15,176],[15,331],[26,335],[26,347],[13,351],[12,475],[22,479],[22,493],[10,498],[9,563],[0,649]]},'stone'));
for(const id of ['ali-riwaq-top','ali-riwaq-bottom','ali-riwaq-west','ali-riwaq-between','ali-outer-top','ali-outer-bottom'])parts.push(prism(id+'-roof','ali-court-roof',sourceRoom(mosque,id).polygon,7,106,'stone'));
mosque.columns.forEach(c=>parts.push(column(c.id,'ali-court-roof',c.center,c.radius*1.1,106,0,false)));
for(const z of [72,625])for(const x of [707,750,792,835,878,920,960,1002,1045,1087,1128,1170])parts.push(part(`ali-riwaq-dome-${x}-${z}`,'ali-court-roof',{kind:'dome',center:[x,z],radius:20,height:19,base:113},'roof'));
for(const x of [626,1171])for(const z of [116,157,200,242,284,326,370,412,456,498,541,581])parts.push(part(`ali-riwaq-dome-${x}-${z}`,'ali-court-roof',{kind:'dome',center:[x,z],radius:18,height:18,base:113},'roof'));
const fountain=circle(897,347,52,8);parts.push(prism('ali-fountain-plinth','ali-fountain',fountain,5,0,'stone'),part('ali-fountain-roof','ali-fountain',{kind:'dome',center:[897,347],radius:57,height:24,base:85},'roof'));
fountain.forEach((p,i)=>parts.push(column(`ali-fountain-pier-${i}`,'ali-fountain',p,3.1,84,0,false)));
parts.push(prism('ali-court-floor','ali-court-roof',sourceRoom(mosque,'ali-court').polygon,1,0,'ground'));
export const citadelExterior:ExteriorGuide={slug:'cairo-citadel',intro:'城堡是复合遗址；这里详读主天际线穆罕默德·阿里清真寺，完整城堡关系另见“内部／场地”的总图。',models:[model('ali-exterior','穆罕默德·阿里清真寺：穹顶与双塔',[10,20,1205,655],sources,'/images/guides/cairo-citadel/01.jpg',features,parts,['本视图对象是清真寺外观，不把它标成整个城堡的测绘模型。','檐口、小穹顶与塔身竖向比例为资料支持的示意；不虚构窗饰与雕刻。'],[-.7,.5,1])]};
citadelExterior.models[0].frontDirection=[1,0,0];
