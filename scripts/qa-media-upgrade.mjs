import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const oldDist=process.argv[2];
if(!oldDist)throw Error('Pass the dist directory rebuilt from the previous published commit');
const base='/nmec-cultural-guide/';
const oldManifest=JSON.parse(await readFile(oldDist+'/offline-manifest.json','utf8'));
const current=JSON.parse(await readFile('dist/offline-manifest.json','utf8'));
let upgrade=false,block=false;
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(!url.pathname.startsWith(base)){res.writeHead(404).end();return;}let file=url.pathname.slice(base.length)||'index.html';if(file.endsWith('/'))file+='index.html';if(upgrade&&block&&file==='images/covers/giza-plateau.jpg'){res.writeHead(503).end('interrupted upgrade');return;}const body=await readFile((upgrade?'dist':oldDist)+'/'+file);const ext=file.split('.').at(-1);res.writeHead(200,{'content-type':({html:'text/html',js:'application/javascript',css:'text/css',json:'application/json',jpg:'image/jpeg',png:'image/png',svg:'image/svg+xml'})[ext]??'application/octet-stream','cache-control':'no-store'}).end(body);}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url=`http://127.0.0.1:${server.address().port}${base}`;
const browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext();const page=await context.newPage();
async function checkpoint(key,phase){const deadline=Date.now()+45000;while(Date.now()<deadline){const value=await page.evaluate(async({key,base})=>{if(!await caches.has(key))return null;const r=await(await caches.open(key)).match(base+'__offline-progress');return r?await r.json():null;},{key,base});if(value?.phase===phase)return value;await page.waitForTimeout(100);}throw Error(`Checkpoint not reached: ${key} ${phase}`);}
const report={scenario:'Upgrade the previous full-site release to subject-reviewed images; old cache survives partial failure',previousRelease:oldManifest.release,release:current.release,testedAt:new Date().toISOString(),offlineRoutes:[]};
try{
 await page.goto(url+'guides/grand-egyptian-museum/');assert.match(await page.locator('h1').innerText(),/大埃及博物馆/);assert.ok((await page.locator('#object-gem-stair img').getAttribute('src')).includes('/images/guides/'));await checkpoint(oldManifest.release,'ready');
 upgrade=true;block=true;await page.evaluate(async()=>{const r=await navigator.serviceWorker.ready;await r.update();});
 report.interrupted=await checkpoint(current.release,'failed');await checkpoint(oldManifest.release,'ready');
 await context.setOffline(true);await page.reload({waitUntil:'networkidle'});assert.match(await page.locator('h1').innerText(),/大埃及博物馆/);report.oldSiteRetained=true;
 block=false;await context.setOffline(false);await page.evaluate(async()=>{const r=await navigator.serviceWorker.ready;r.active.postMessage({type:'OFFLINE_RESUME'});});
 report.completed=await checkpoint(current.release,'ready');
 await page.reload({waitUntil:'networkidle'});assert.match(await page.locator('h1').innerText(),/大埃及博物馆/);assert.ok((await page.locator('#object-gem-stair img').getAttribute('src')).includes('/images/reviewed/'));report.newImagesActivated=true;
 await page.goto(url+'guides/',{waitUntil:'networkidle'});assert.equal(await page.locator('a[href*="/guides/"]').filter({has:page.locator('.guide-cover')}).count(),14);
 await context.setOffline(true);
 for(const route of current.routes){await page.goto(new URL(route,url).href,{waitUntil:'networkidle'});await page.locator('h1').waitFor();assert.doesNotMatch(await page.locator('h1').innerText(),/不存在/);report.offlineRoutes.push(route);}
 assert.equal(await page.evaluate(key=>caches.has(key),oldManifest.release),false);report.previousCacheRetired=true;report.passed=true;
 await mkdir('docs/qa',{recursive:true});await writeFile('docs/qa/media-upgrade-report.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:true,previous:oldManifest.release,current:current.release,offlineRoutes:report.offlineRoutes.length}));
}finally{await context.close();await browser.close();server.close();}
