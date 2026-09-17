import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const base='/nmec-cultural-guide/';
const originalManifest=JSON.parse(await readFile('dist/offline-manifest.json','utf8'));
const originalWorker=await readFile('dist/sw.js','utf8');
const alternateWorker=originalWorker.replace(originalManifest.release.replace('nmec-cultural-guide-',''),'abcdef1234567890');
const alternateManifest={...originalManifest,release:'nmec-cultural-guide-abcdef1234567890',resources:originalManifest.resources.map(r=>r.path===base+'sw.js'?{...r,sha256:createHash('sha256').update(alternateWorker).digest('hex'),bytes:Buffer.byteLength(alternateWorker)}:r)};
let block=true,update=false;const requests=[];
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(!url.pathname.startsWith(base)){res.writeHead(404).end();return;}const relative=url.pathname.slice(base.length)||'index.html';requests.push(relative);if(block&&relative.endsWith('/08.jpg')){res.writeHead(503).end('test interruption');return;}let body;
 if(relative==='sw.js')body=update?alternateWorker:originalWorker;else if(relative==='offline-manifest.json')body=JSON.stringify(update?alternateManifest:originalManifest);else body=await readFile('dist/'+(relative.endsWith('/')?relative+'index.html':relative));
 const extension=relative.split('.').at(-1);const type=({js:'application/javascript',css:'text/css',json:'application/json',jpg:'image/jpeg',png:'image/png',html:'text/html',svg:'image/svg+xml'})[extension]??'text/html';res.writeHead(200,{'content-type':type,'cache-control':'no-store'}).end(body);
 }catch{res.writeHead(404).end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url=`http://127.0.0.1:${server.address().port}${base}`;
const browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext();
const report={scenario:'Actual Service Worker network interruption, page reopen, resume and partial release update',originalRelease:originalManifest.release};
const snapshot=page=>page.evaluate(async()=>{const values=[];for(const key of await caches.keys()){if(!key.startsWith('nmec-cultural-guide-'))continue;const cache=await caches.open(key);const entries=await cache.keys();const checkpoint=entries.find(r=>r.url.endsWith('/__offline-progress'));values.push({key,progress:checkpoint?await(await cache.match(checkpoint)).json():null,verified:(await Promise.all(entries.map(async r=>({url:r.url,hash:(await cache.match(r)).headers.get('X-Offline-Sha256')})))).filter(x=>x.hash)});}return values;});
try{
 let page=await context.newPage();await page.goto(url);
 await page.waitForFunction(async()=>{for(const name of await caches.keys()){const c=await caches.open(name);const r=await c.match(location.pathname+'__offline-progress');if(r&&(await r.json()).phase==='failed')return true;}return false;},{},{timeout:30000});
 const partial=(await snapshot(page)).filter(v=>v.progress);assert.ok(partial.length,JSON.stringify(await snapshot(page)));assert.ok(partial[0].progress.completed>0&&partial[0].progress.completed<partial[0].progress.total);report.interrupted=partial;
 await page.close();block=false;const before=requests.length;page=await context.newPage();await page.goto(url,{waitUntil:'networkidle'});await page.locator('.offline-trigger').click();
 const initialResume=page.getByRole('button',{name:/^(继续下载|下载离线包)$/});if(await initialResume.isVisible()&&await initialResume.isEnabled())await initialResume.click();
 await page.waitForFunction(()=>document.querySelector('.offline-trigger')?.textContent.includes('已缓存'));
 const resumed=await snapshot(page);assert.equal(resumed[0].progress.phase,'ready');assert.equal(resumed[0].verified.length,originalManifest.resources.length);report.resumed={caches:resumed,requestsSinceReopen:requests.slice(before)};
 await page.evaluate(()=>caches.open('unrelated-guide-keep'));
 // Install a different SW release while one resource fails. The old complete
 // release must remain usable, and verified resources survive a page reopen.
 update=true;block=true;await page.evaluate(async()=>{const r=await navigator.serviceWorker.ready;await r.update();});
 await page.waitForFunction(async()=>{const c=await caches.open('nmec-cultural-guide-abcdef1234567890');const r=await c.match(new URL('__offline-progress',location.href).pathname);return r&&(await r.json()).phase==='failed';},{},{timeout:30000});
 const partialUpdate=await snapshot(page);assert.ok(partialUpdate.some(v=>v.key===originalManifest.release&&v.progress.phase==='ready'));report.partialUpdate=partialUpdate;
 await context.setOffline(true);await page.goto(url+'guides/national-museum-egyptian-civilization/',{waitUntil:'networkidle'});assert.match(await page.locator('h1').innerText(),/埃及国家文明博物馆/);assert.equal(await page.locator('.architecture-plan').getAttribute('data-active-floor'),'nmec-arrival');report.oldReleaseOffline=true;
 block=false;await context.setOffline(false);await page.reload({waitUntil:'networkidle'});await page.locator('.offline-trigger').click();const resumeButton=page.getByRole('button',{name:/^(继续下载|下载离线包)$/});if(await resumeButton.isVisible()&&await resumeButton.isEnabled())await resumeButton.click();
 try{await page.waitForFunction(()=>document.querySelector('.offline-trigger')?.textContent.includes('已缓存'),{},{timeout:5000});}catch(error){console.log('final diagnostic',await page.locator('.offline-widget').innerText(),JSON.stringify((await snapshot(page)).map(v=>({key:v.key,progress:v.progress,count:v.verified.length}))));throw error;}
 const final=await snapshot(page);assert.equal(final.length,1);assert.equal(final[0].key,'nmec-cultural-guide-abcdef1234567890');assert.ok(await page.evaluate(()=>caches.has('unrelated-guide-keep')));report.final=final;report.unrelatedCachePreserved=true;report.passed=true;
 await mkdir('artifacts/local',{recursive:true});await writeFile('artifacts/local/resume-report.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:true,partial:partial[0].progress.completed,total:partial[0].progress.total,reopened:true,updateRetainedPrevious:true,unrelatedCachePreserved:true}));
}finally{await context.close();await browser.close();server.close();}
