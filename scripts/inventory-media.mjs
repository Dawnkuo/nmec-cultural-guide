import {createServer} from 'vite';
import {chromium} from 'playwright';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const out=process.argv[2]||'artifacts/media-before';await mkdir(out,{recursive:true});
const server=await createServer({configFile:false,base:'/',cacheDir:'node_modules/.vite-media-inventory',server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true}});
let records;
try{const {guideCatalog}=await server.ssrLoadModule('/src/data/guides.ts');records=guideCatalog.map(g=>({slug:g.slug,title:g.title,images:[{id:'cover',title:'封面',image:g.hero},...g.visitChapters.map(c=>({id:c.id,title:c.title,image:c.image})),...g.highlights.map(h=>({id:h.id,title:h.title,summary:h.summary,lookFor:h.lookFor,image:h.image}))]}));}finally{await server.close();}
for(const g of records)for(const item of g.images){const bytes=await readFile('public'+item.image.src);item.sha256=createHash('sha256').update(bytes).digest('hex');}
await writeFile(out+'/inventory.json',JSON.stringify(records,null,2)+'\n');
const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1680,height:1200},deviceScaleFactor:1});
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
for(const g of records){for(let start=0;start<g.images.length;start+=12){const items=await Promise.all(g.images.slice(start,start+12).map(async item=>{const image=await readFile('public'+item.image.src);return `<article><header>${escape(item.id)} · ${escape(item.title)}</header><img src="data:image/jpeg;base64,${image.toString('base64')}"><p>${escape(item.image.src)}</p><small>${escape(item.image.caption??'')}</small></article>`;}));await page.setContent(`<style>body{margin:0;font:14px Arial;background:#ddd}h1{margin:12px;font-size:24px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:8px}article{background:white;height:366px;overflow:hidden}header{height:42px;padding:6px}img{width:100%;height:234px;object-fit:contain;background:#222}p{font-size:10px;margin:3px}small{display:block;font-size:11px;padding:3px}</style><h1>${escape(g.title)} / ${start+1}–${Math.min(start+12,g.images.length)}</h1><div class="grid">${items.join('')}</div>`);await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));await page.screenshot({path:`${out}/${g.slug}-${start/12}.jpg`,type:'jpeg',quality:90,fullPage:true});}}
await browser.close();console.log(JSON.stringify(records.map(g=>({slug:g.slug,uses:g.images.length,unique:new Set(g.images.map(i=>i.sha256)).size}))));
