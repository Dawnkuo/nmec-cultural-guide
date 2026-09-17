import type { CulturalGuide, GuideMedia } from './types';
const folder='/images/guides/national-museum-egyptian-civilization/';
const licenseUrl='https://creativecommons.org/licenses/by-sa/4.0/';
const scenes:Record<string,string>={
 '01.jpg':'博物馆正门与入口广场，2017年。',
 '04.jpg':'馆内关于代尔巴哈里皇家木乃伊藏所的历史展板，2022年摄；不是皇家木乃伊本体照片。',
 '05.jpg':'主展厅展柜与高墙的整体环境，2022年摄；不用于鉴定具体织物或年代。',
 '06.jpg':'主展厅中的石刻与雕像陈列环境，2022年摄；不是科普特织物特写。',
 '07.jpg':'主展厅石刻、雕塑与陈列空间，2022年摄。',
 '08.jpg':'主展厅中央环形空间与木乃伊影像展示，2022年摄；不是2021年迁藏游行现场。',
 '09.jpg':'主展厅中央空间与影像展示，2022年摄；不是史前文物特写。',
 '10.jpg':'主展厅的展柜、宗教艺术与参观环境，2022年摄；不是某件王像特写。',
};
const titles:Record<string,string>={'01.jpg':'NMEC-MainEntrance.jpg','04.jpg':'National_Museum_of_Egyptian_Civilization_2022_03.jpg','05.jpg':'National_Museum_of_Egyptian_Civilization_2022_04.jpg','06.jpg':'National_Museum_of_Egyptian_Civilization_2022_05.jpg','07.jpg':'National_Museum_of_Egyptian_Civilization_2022_06.jpg','08.jpg':'National_Museum_of_Egyptian_Civilization_2022_07.jpg','09.jpg':'National_Museum_of_Egyptian_Civilization_2022_08.jpg','10.jpg':'National_Museum_of_Egyptian_Civilization_2022_96.jpg'};
function credit(media:GuideMedia){
 const file=media.src.split('/').at(-1)!;
 if(!titles[file])return media;
 const author=file==='01.jpg'?'Roland Unger':'Onceinawhile';
 return {...media,alt:scenes[file],caption:`${scenes[file]} ${author} · CC BY-SA 4.0。`,credit:{author,sourcePage:`https://commons.wikimedia.org/wiki/File:${titles[file]}`,license:'CC BY-SA 4.0',licenseUrl,photographedAt:file==='01.jpg'?'2017-03-05':'2022'}};
}
export function reviewedMedia(guide:CulturalGuide):CulturalGuide{
 // Retain the requested interpretation, but do not identify a general hall
 // photograph as a specific textile, ancient object or procession.
 const reassigned:Record<string,string>={'nmec-prehistory':'main-hall-reviewed.jpg','nmec-kingship':'07.jpg','nmec-textile-material':'10.jpg','nmec-coptic':'10.jpg','nmec-islamic-textile':'10.jpg','nmec-mummies-parade':'04.jpg'};
 const hall=guide.highlights.find(h=>h.id==='nmec-architecture')!.image;
 return {...guide,visitChapters:guide.visitChapters.map(c=>({...c,image:credit(c.image)})) as CulturalGuide['visitChapters'],highlights:guide.highlights.map(h=>{
   const replacement=reassigned[h.id];
   let photo=replacement==='main-hall-reviewed.jpg'?hall:replacement?{...h.image,src:folder+replacement}:h.image;
   photo=credit(photo);
   if(h.id==='nmec-prehistory')photo={...photo,caption:'2017年展厅中的器物与工艺陈列环境；不是本条所述史前对象的逐件鉴定图。 '+photo.caption};
   return {...h,image:photo};
 })};
}
