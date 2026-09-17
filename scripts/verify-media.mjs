import {readFile,writeFile} from 'node:fs/promises';
const file='public/images/guides/media-manifest.json';
const manifest=JSON.parse(await readFile(file,'utf8'));
const entries=manifest['national-museum-egyptian-civilization'];
const u=new URL('https://commons.wikimedia.org/w/api.php');
for(const [k,v]of Object.entries({action:'query',format:'json',prop:'imageinfo',iiprop:'extmetadata',titles:entries.map(e=>e.commonsTitle).join('|')}))u.searchParams.set(k,v);
const response=await fetch(u,{signal:AbortSignal.timeout(20000)});if(!response.ok)throw new Error('Commons metadata unavailable');
const result=await response.json();
const plain=value=>value?.replace(/<[^>]+>/g,'')??'';
for(const entry of entries){const record=Object.values(result.query.pages).find(p=>p.title.replaceAll('_',' ')===entry.commonsTitle.replaceAll('_',' '));const metadata=record?.imageinfo?.[0]?.extmetadata;if(!metadata?.LicenseUrl?.value)throw new Error('Missing license');entry.artist=plain(metadata.Artist.value);entry.license=metadata.LicenseShortName.value;entry.licenseUrl=metadata.LicenseUrl.value;entry.photographedAt=metadata.DateTimeOriginal.value;entry.checkedAt=new Date().toISOString();entry.transformations='Resized for offline delivery; no generated modification';}
manifest.cover={...entries[0],file:'/images/covers/national-museum-egyptian-civilization.jpg'};
manifest.reviewedInterior.licenseUrl='https://creativecommons.org/licenses/by-sa/4.0/';
await writeFile(file,JSON.stringify(manifest,null,2)+'\n');
console.log('Verified attribution and licenses for '+entries.length+' entries');
