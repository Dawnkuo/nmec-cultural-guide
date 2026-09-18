import { gemGround,gemUpper } from '../architecture/gem';
import type { Ring,XY } from '../architecture/types';
import type { ExteriorGuide,ExteriorPart,XYZ } from './types';
import {feature,model,part,prism,rect,sourceRoom} from './builders';

export {nmecExterior} from './nmec';

const gs=['src-gem-authority-plans','src-gem-architect','src-gem-visitor-guide'];
const f=1888/2200,toDrawing=(r:Ring)=>r.map(([x,z])=>[x*f,z*f] as XY);
const main:Ring=[[803,585],[1123,554],[1550,1106],[1168,1200]],tut=toDrawing(sourceRoom(gemUpper,'gem-tut-envelope').polygon),stairs=toDrawing(sourceRoom(gemUpper,'gem-upper-stairs').polygon),atrium=toDrawing(sourceRoom(gemGround,'gem-atrium-space').polygon);
const gf=[
 feature('gem-main-roof','主展厅扇形屋盖',main,'向金字塔展开的视觉轴线组织建筑，而不是将十二间展厅分别做成十二栋小屋。屋盖折面和较厚的服务墙把巨大展览层分成连续带状空间。',['俯视辨认向外张开的边界。','斜视看屋盖的折面，不把每条折线等同于展厅隔墙。','建筑师说的场地50米高差，不等于这栋楼高50米。'],gs,'底面为馆方2016年CAD外轮廓；扇形折面构成由建筑师说明与模型核对，折面竖向为解释性比例。','gem-main-galleries'),
 feature('gem-tut-roof','图坦卡蒙展览翼',tut,'大楼梯另一侧的长条展览翼与主展览翼一起形成扇形建筑。室内展陈设计另有2025年原图，不能把屋顶分带当作现时展柜分区。',['比较两侧展览翼的宽度。','入内后用独立展陈图找展区，不从屋盖猜文物位置。'],gs,'使用与主展厅同坐标框架的建筑外轮廓；不把独立展陈图拉伸拼接。','gem-tut'),
 feature('gem-grand-stair-band','大楼梯的建筑带',stairs,'大楼梯把到达空间引向高处展览层；它也是可识别的建筑主线。沿楼梯回望大厅，再从上端看向金字塔，能理解“逐层接近古代世界”的空间设计。',['区分入口高度与上部展览平台。','看两侧展览翼与楼梯的关系。'],gs,'平面来自馆方；标高只表达方向与层次，不绘制未经核对的踏步数。','gem-staircase'),
 feature('gem-entry-envelope','入口中庭与三角形构图',atrium,'巨大的到达空间处在展览翼之前，正面以斜向结构和三角形构图形成入口尺度。建筑本身在进馆之前就开始解释吉萨的几何主题。',['先远看展开的入口立面。','靠近后比较斜向构件、开口与人的比例。'],gs,'入口中庭轮廓来自馆方平面；屋顶几何延续建筑师明确的视觉轴线，不伪造逐块幕墙测绘。','gem-grand-hall'),
 feature('gem-public-wing','商业与会议公共翼',toDrawing(sourceRoom(gemGround,'gem-food-hall').polygon),'侧向延伸的公共翼容纳不同活动，和主展览翼并非同一个体量。看外观时把博物馆作为公共建筑群，而非只有一个展厅大厅。',['比较水平公共翼与扇形展览屋顶。','具体店铺与活动依现行馆方信息。'],gs,'有日期的馆方公共翼足迹，不据2016年用途图承诺今日营业。'),
];
const gp:ExteriorPart[]=[];
const mix=(a:XY,b:XY,t:number):XY=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
function folded(id:string,fid:string,quad:Ring,count:number,base:number,wall:number,rise:number){
 gp.push(prism(id+'-shell',fid,quad,wall,base,'stone'));
 for(let i=0;i<count;i++){const a=mix(quad[0],quad[1],i/count),b=mix(quad[0],quad[1],(i+1)/count),c=mix(quad[3],quad[2],(i+1)/count),d=mix(quad[3],quad[2],i/count),ab=mix(a,b,.45),dc=mix(d,c,.45);const vertices:XYZ[]=[[a[0],base+wall,a[1]],[b[0],base+wall,b[1]],[c[0],base+wall,c[1]],[d[0],base+wall,d[1]],[ab[0],base+wall+rise,ab[1]],[dc[0],base+wall+rise,dc[1]]];gp.push(part(id+'-fold-'+i,fid,{kind:'mesh',vertices,triangles:[0,3,5,0,5,4,4,5,2,4,2,1,0,4,1,3,2,5]},'roof',id+'-roof-band-'+i,'建筑师发布的折叠屋盖构成；折高和细分为可读性简化，不声称逐折测绘。'));}
}
folded('gem-main-roof','gem-main-roof',main,3,0,62,45);
folded('gem-tut-roof','gem-tut-roof',[[558,619],[701,617],[975,1234],[811,1234]],2,0,62,45);
gp.push(part('gem-stair-roof-band','gem-grand-stair-band',{kind:'mesh',vertices:stairs.map(([x,z])=>[x,45+(z-606)*.105,z]),triangles:[0,1,2,0,2,3]},'glass'));
gp.push(prism('gem-atrium-glazing','gem-entry-envelope',atrium,48,0,'glass'));
// Preserve the irregular atrium roof outline; this is not a substitute indoor plan.
gp.push(prism('gem-atrium-canopy','gem-entry-envelope',atrium,5,48,'roof'));
for(const id of ['gem-food-hall','gem-retail-corridor','gem-conference-stair']){const r=toDrawing(sourceRoom(gemGround,id).polygon);gp.push(prism(id+'-shell','gem-public-wing',r,35),prism(id+'-roof','gem-public-wing',r,3,35,'roof'));}
const gm=model('gem-exterior','扇形展览翼、折面屋盖与大楼梯',[347,115,1220,1150],gs,'/images/guides/grand-egyptian-museum/01.jpg',gf,gp,['五条展览带与大楼梯的构成依据建筑师说明；以三条主厅带和两条较窄翼带简化展示，不宣称这是完整竣工屋顶的逐折扫描。','主体建筑轮廓来自2016年馆方CAD；不扩充未经本次核对的太阳船馆、后勤和整个园区。'],[.8,.85,-1]);
gm.referencePage='https://www.hparc.com/work/the-grand-egyptian-museum/';
gm.frontDirection=[0,0,-1];
export const gemExterior:ExteriorGuide={slug:'grand-egyptian-museum',intro:'沿真实的斜轴底面读建筑师的扇形构图：两个展览翼、大楼梯、入口大厅与公共侧翼分别可选。',models:[gm]};
