import {readFile,writeFile} from 'node:fs/promises';
const file='public/images/guides/media-manifest.json';
const manifest=JSON.parse(await readFile(file,'utf8'));
const entries=Object.values(manifest).filter(Array.isArray).flat();
const clean=v=>(v??'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const normalized=v=>v.replaceAll('_',' ').normalize();
// The file pages contain these credits even though their machine-readable
// Artist fields are empty. Rechecked against the linked Commons pages.
const reviewedCredits={
 'File:Egypt.AbuSimbel.03.jpg':{artist:'Hajor',photographedAt:'2002-12'},
 'File:Birds-eye view of restored Temple of Deir-El-Bahari Wellcome M0002693.jpg':{artist:'Wellcome Library, London / Wellcome Images'},
 'File:Line illustration of Temple of Deir-El-Bahari, restored Wellcome M0002866.jpg':{artist:'Wellcome Library, London / Wellcome Images'},
};
for(const entry of entries)if(!entry.commonsTitle.startsWith('File:'))entry.commonsTitle='File:'+entry.commonsTitle+'.jpg';
const exactGiza={
 '04.jpg':'File:Great Sphinx of Giza (close up side view). Cairo, Egypt, North Africa.jpg',
 '05.jpg':'File:Valley Temple of Khafre 卡夫勒谷廟 - panoramio.jpg',
 '06.jpg':'File:Pyramid of Khafre (Cheprhen) Causeway, Giza, GG, EGY (47113244694).jpg',
 '07.jpg':'File:Giza Pyramids Panorama.jpg',
};
for(const entry of manifest['giza-plateau'])if(exactGiza[entry.file.split('/').at(-1)])entry.commonsTitle=exactGiza[entry.file.split('/').at(-1)];
const missing=[];
for(let n=0;n<entries.length;n+=20){
 const batch=entries.slice(n,n+20);const u=new URL('https://commons.wikimedia.org/w/api.php');
 for(const[k,v]of Object.entries({action:'query',format:'json',redirects:'1',prop:'imageinfo',iiprop:'extmetadata|url',titles:batch.map(e=>e.commonsTitle).join('|')}))u.searchParams.set(k,v);
 const response=await fetch(u,{signal:AbortSignal.timeout(25000)});if(!response.ok)throw Error('Commons '+response.status);const data=await response.json();
 for(const e of batch){const redirects=data.query.redirects??[];const to=redirects.find(r=>normalized(r.from)===normalized(e.commonsTitle))?.to??e.commonsTitle;const p=Object.values(data.query.pages).find(p=>normalized(p.title)===normalized(to));const info=p?.imageinfo?.[0];const m=info?.extmetadata;if(!m?.LicenseShortName?.value){missing.push(e.commonsTitle);continue;}
  const reviewed=reviewedCredits[normalized(p.title)];
  e.commonsTitle=p.title;e.sourcePage=info.descriptionurl;e.artist=clean(m.Artist?.value)||reviewed?.artist||'';e.license=m.LicenseShortName.value;e.licenseUrl=m.LicenseUrl?.value??(e.license.toLowerCase().includes('public domain')?'https://creativecommons.org/publicdomain/mark/1.0/':undefined);e.photographedAt=clean(m.DateTimeOriginal?.value)||reviewed?.photographedAt||'';e.subject=clean(m.ImageDescription?.value);e.checkedAt=new Date().toISOString();e.transformations='Wikimedia resized source image for offline delivery; no AI alteration';
 }
 console.log(`Media metadata ${Math.min(n+20,entries.length)}/${entries.length}`);
}
await writeFile(file,JSON.stringify(manifest,null,2)+'\n');
// Keep positional indices: NMEC's retired sign occupies the original slot but
// is never selected; remap verified metadata by asset filename, not by index.
const runtimeFile='src/data/media-manifest.generated.json';const runtime=JSON.parse(await readFile(runtimeFile,'utf8'));const byFile=new Map(entries.map(e=>[e.file,e]));for(const group of Object.values(runtime))if(Array.isArray(group))for(let i=0;i<group.length;i++)if(byFile.has(group[i].file))group[i]=byFile.get(group[i].file);
await writeFile(runtimeFile,JSON.stringify(runtime,null,2)+'\n');
if(missing.length)throw Error('Missing exact media metadata: '+missing.join(' | '));
console.log(`Verified ${entries.length} image source records`);
