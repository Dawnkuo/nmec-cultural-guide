import {chromium} from 'playwright';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const target=process.argv[2]||'https://dawnkuo.github.io/nmec-cultural-guide/';
const manifest=JSON.parse(await readFile('dist/offline-manifest.json','utf8'));
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1094,height:768}});
const page=await context.newPage();const report={target,release:manifest.release,testedAt:new Date().toISOString(),online:[],offline:[],errors:[]};
page.on('pageerror',e=>report.errors.push(e.message));
async function visit(route,offline){
 const response=await page.goto(new URL(route,target).href,{waitUntil:'networkidle'});
 assert.equal(response.status(),200);await page.locator('h1').waitFor();assert.doesNotMatch(await page.locator('h1').innerText(),/不存在/);
 await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode()));});
 assert.deepEqual(await page.evaluate(()=>[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)),[]);
 if(route.includes('/guides/')&&!route.endsWith('/guides/')){
  const expected=JSON.parse(await readFile('src/data/reviewed-guide-media.generated.json','utf8'))[route.split('/').at(-2)];
  for(const id of Object.keys(expected).filter(id=>!['cover','exterior','interior'].includes(id)))assert.equal(new URL(await page.locator('#object-'+id+' img').getAttribute('src'),target).pathname,'/nmec-cultural-guide'+expected[id].src);
 }
 report[offline?'offline':'online'].push({route,title:await page.locator('h1').innerText(),passed:true});
}
try{
 for(const route of manifest.routes){console.log('online',route);await visit(route,false);}
 await page.waitForFunction(()=>document.querySelector('.offline-trigger')?.textContent.includes('已缓存'),{},{timeout:60000});
 assert.equal(await page.evaluate(release=>caches.has(release),manifest.release),true);
 await context.setOffline(true);
 for(const route of manifest.routes){console.log('offline',route);await visit(route,true);}
 assert.deepEqual(report.errors,[]);report.passed=true;
}catch(e){report.passed=false;report.errors.push(e.stack);throw e;}
finally{await mkdir('artifacts/media-live',{recursive:true});await writeFile('artifacts/media-live/routes-report.json',JSON.stringify(report,null,2)+'\n');await context.close();await browser.close();console.log(JSON.stringify({passed:report.passed,online:report.online.length,offline:report.offline.length}));}
