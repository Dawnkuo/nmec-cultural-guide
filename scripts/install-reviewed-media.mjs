import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
const inventory=JSON.parse(await readFile('docs/qa/media-audit/baseline.json','utf8'));
const research=JSON.parse(await readFile('docs/qa/media-audit/research-index.json','utf8'));
const selected=JSON.parse(await readFile('scripts/media-selection.json','utf8'));
const legacy=JSON.parse(await readFile('public/images/guides/media-manifest.json','utf8'));
const legacyByPath=new Map(Object.values(legacy).filter(Array.isArray).flat().map(m=>[m.file,m]));
const originalByPath=new Map(inventory.flatMap(g=>g.images.map(i=>[i.image.src,i.image])));
const registry={},ledger=[],missing=[];
for(const guide of inventory){registry[guide.slug]={};for(const item of guide.images){
 const key=['exterior','interior'].includes(item.id)?guide.slug+'/'+item.id:item.id;
 const selection=item.id==='cover'?{keep:true,subject:item.image.alt}:selected[key];
 if(!selection){missing.push(key);continue;}
 let media,source;
 if(selection.candidate){
  const dir='artifacts/media-research/'+selection.candidate;
  // Pinned candidates were visually reviewed. Never rerun a search and silently
  // bind today's result at the same numeric position to yesterday's object.
  const candidates=research[selection.candidate];
  source=candidates[selection.index];if(!source)throw Error('Missing reviewed candidate '+key);
  if(!source.author||!/^(CC|Public domain)/i.test(source.license))throw Error('Unresolved rights '+key);
  const cached=dir+'/'+selection.index+'.jpg';
  const existing=['jpg','png'].map(ext=>`public/images/reviewed/${guide.slug}/${item.id}.${ext}`).find(existsSync);
  const input=existsSync(cached)?cached:existing;
  if(!input)throw Error('Missing pinned local image for '+key+'; retrieve the exact source URL and visually review before installing.');
  const bytes=await readFile(input);
  const extension=bytes[0]===0x89?'png':'jpg';
  const path=`/images/reviewed/${guide.slug}/${item.id}.${extension}`;
  await mkdir('public/images/reviewed/'+guide.slug,{recursive:true});if(input!=='public'+path)await copyFile(input,'public'+path);
  media={src:path,alt:selection.subject,caption:selection.subject,credit:{author:source.author,sourcePage:source.sourcePage,license:source.license,licenseUrl:source.licenseUrl,photographedAt:source.date||'原始来源未注明拍摄日期'}};
 }else{
  const path=selection.local??item.image.src;
  const old=originalByPath.get(path),entry=legacyByPath.get(path);
  const credit=entry?{author:entry.artist,sourcePage:entry.sourcePage,license:entry.license,licenseUrl:entry.licenseUrl,photographedAt:entry.photographedAt||'原始来源未注明拍摄日期'}:old?.credit;
  if(!credit?.sourcePage||!credit.author)throw Error('Unresolved local rights '+path);
  media={...(old??{}),src:path,alt:selection.subject,caption:selection.subject,credit};source=entry??old;
 }
 const sha256=createHash('sha256').update(await readFile('public'+media.src)).digest('hex');
 registry[guide.slug][item.id]=media;
 ledger.push({guide:guide.slug,id:item.id,title:item.title,previous:item.image.src,current:media.src,subject:selection.subject,sha256,credit:media.credit,sourceTitle:source.title??source.commonsTitle,sourceDescription:source.description??source.subject,review:'visual-subject-match',transformation:'Source-provided resized image; no generative changes',checkedAt:new Date().toISOString().slice(0,10)});
}}
console.log('Reviewed',ledger.length,'of',inventory.reduce((s,g)=>s+g.images.length,0));
if(missing.length){console.log('STILL TO REVIEW\n'+missing.join('\n'));process.exitCode=1;}else{
 await writeFile('src/data/reviewed-guide-media.generated.json',JSON.stringify(registry,null,2)+'\n');
 await writeFile('public/images/reviewed/manifest.json',JSON.stringify({checkedAt:new Date().toISOString(),scope:'14 guides: cover, exterior/interior and all 106 interpretation images',items:ledger},null,2)+'\n');
 console.log('Installed complete reviewed registry');
}
