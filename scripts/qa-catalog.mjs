import {createServer} from 'vite';
import {mkdir,writeFile} from 'node:fs/promises';
const server=await createServer({configFile:false,base:'/',cacheDir:'node_modules/.vite-qa-catalog',server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true}});
try{
 const {guideCatalog}=await server.ssrLoadModule('/src/data/guides.ts');
 const {exteriorCatalog}=await server.ssrLoadModule('/src/data/exteriors/catalog.ts');
 const {tripDays}=await server.ssrLoadModule('/src/data/journey.ts');
 const guides=guideCatalog.map(g=>({slug:g.slug,title:g.title,hero:g.hero,highlights:g.highlights.length,spatialMode:g.spatial.mode,floors:(g.spatial.architectureLevels??[g.spatial.architecture]).filter(Boolean).map(m=>({id:m.floor.id,modelId:m.id,entry:m.entry,labels:m.labels,spaces:m.spaces.map(s=>({id:s.id,title:s.title}))})),exteriors:exteriorCatalog[g.slug].models.map(m=>({id:m.id,parts:m.parts.length,features:m.features.map(f=>({id:f.id,title:f.title}))}))}));
 await mkdir('artifacts/full',{recursive:true});
 await writeFile('artifacts/full/catalog.json',JSON.stringify({guides,days:tripDays.length},null,2)+'\n');
 console.log(`QA inventory: ${guides.length} guides, ${tripDays.length} days`);
}finally{await server.close();}
