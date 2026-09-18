import {chromium} from 'playwright';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const target=process.argv[2]||'http://127.0.0.1:4181/nmec-cultural-guide/';
const tag=process.argv[3]||'media-local';
const out='artifacts/'+tag;await mkdir(out,{recursive:true});
const ledger=JSON.parse(await readFile('public/images/reviewed/manifest.json','utf8')).items;
const slugs=[...new Set(ledger.map(i=>i.guide))];
const browser=await chromium.launch({channel:'chrome',headless:true});
const report={target,testedAt:new Date().toISOString(),views:[],errors:[],device:'Chrome desktop/tablet/phone emulation, not physical device'};
try{
 for(const width of [1440,1094,390]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();page.setDefaultTimeout(20000);
  page.on('pageerror',e=>report.errors.push(e.message));
  for(const slug of slugs){
   console.log(tag,width,slug);
   await page.goto(target+'guides/'+slug+'/',{waitUntil:'networkidle'});
   await page.locator('.highlight-grid article').first().waitFor();
   await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode()));});
   const checked={width,slug,images:0,lightboxes:0};
   for(const item of ledger.filter(i=>i.guide===slug)){
    const root=item.id==='cover'?page.locator('.guide-hero'):['exterior','interior'].includes(item.id)?page.locator('#visit-'+item.id):page.locator('#object-'+item.id);
    const img=root.locator('img').first();
    assert.equal(new URL(await img.getAttribute('src'),target).pathname,'/nmec-cultural-guide'+item.current);
    assert.ok(await img.evaluate(i=>i.naturalWidth>0));
    assert.equal(await img.evaluate(i=>getComputedStyle(i).objectFit),'contain');
    if(item.id!=='cover'){
     assert.equal(await img.getAttribute('alt'),item.subject);
     assert.equal(await root.locator('.media-attribution a').first().getAttribute('href'),item.credit.sourcePage);
     assert.ok((await root.locator('.media-caption').innerText()).includes(item.subject));
    }
    if(!['cover','exterior','interior'].includes(item.id)&&width===1440){
     await root.locator('.image-button').click();
     const dialog=page.getByRole('dialog');await dialog.waitFor();
     assert.equal(await dialog.locator('img').getAttribute('src'),await img.getAttribute('src'));
     assert.equal(await dialog.locator('.media-attribution a').first().getAttribute('href'),item.credit.sourcePage);
     await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});checked.lightboxes++;
    }
    if(width===1440&&['grand-egyptian-museum','national-museum-egyptian-civilization'].includes(slug)){
     await root.scrollIntoViewIfNeeded();await root.screenshot({path:`${out}/${width}-${slug}-${item.id}.jpg`,type:'jpeg',quality:80});
    }
    checked.images++;
   }
   await page.locator('#visit-scope').screenshot({path:`${out}/${width}-${slug}-chapters.jpg`,type:'jpeg',quality:75});
   await page.locator('.highlight-grid').screenshot({path:`${out}/${width}-${slug}-highlights.jpg`,type:'jpeg',quality:75});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'Horizontal overflow '+slug);
   report.views.push(checked);await writeFile(out+'/report.json',JSON.stringify(report,null,2));
  }
  await context.close();
 }
 assert.deepEqual(report.errors,[]);report.passed=true;
}catch(e){report.passed=false;report.errors.push(e.stack);throw e;}
finally{await writeFile(out+'/report.json',JSON.stringify(report,null,2)+'\n');await browser.close();console.log(JSON.stringify({passed:report.passed,views:report.views.length,images:report.views.reduce((s,v)=>s+v.images,0),lightboxes:report.views.reduce((s,v)=>s+v.lightboxes,0)}));}
