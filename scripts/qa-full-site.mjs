import {chromium} from 'playwright';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const target=process.argv[2]||'http://127.0.0.1:4181/nmec-cultural-guide/';
const tag=process.argv[3]||'full-local';
const out=`artifacts/${tag}`;await mkdir(out,{recursive:true});
const routes=JSON.parse(await readFile('route-catalog.json','utf8'));
const inventory=JSON.parse(await readFile('artifacts/full/catalog.json','utf8'));
const base='/nmec-cultural-guide/';
const manifest=JSON.parse(await readFile('dist/offline-manifest.json','utf8'));
const report={target,release:manifest.release,testedAt:new Date().toISOString(),routes:[],offline:[],errors:[],phone:'Chrome emulation, not physical hardware'};
const browser=await chromium.launch({channel:'chrome',headless:true});
const frames=page=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
async function capture(page,locator,name){await locator.scrollIntoViewIfNeeded();await frames(page);await locator.screenshot({path:`${out}/${name}.png`});}
try{
 for(const [width,height]of [[1440,1000],[1094,768],[390,844]]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});const page=await context.newPage();page.setDefaultTimeout(20000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const route of routes){
   const relative=route.slice(base.length);const slug=relative.split('/')[1];const guide=relative.startsWith('guides/')?inventory.guides.find(g=>g.slug===slug):undefined;
   const name=relative.replaceAll('/','-')||'home';
   console.log(`${tag}: ${width} ${route}`);
   const response=await page.goto(new URL(relative,target).href,{waitUntil:'networkidle'});assert.equal(response.status(),200);
   await page.locator('h1').waitFor();assert.doesNotMatch(await page.locator('h1').innerText(),/不存在/);
   if(guide)assert.equal(await page.locator('h1').innerText(),guide.title);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${name} overflow`);
   const badLinks=await page.locator('a[href]').evaluateAll(as=>as.filter(a=>a.origin===location.origin&&!a.pathname.startsWith('/nmec-cultural-guide/')).map(a=>a.href));assert.deepEqual(badLinks,[]);
   await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
   assert.deepEqual(await page.evaluate(()=>[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)),[],`${name} broken images`);
   await page.screenshot({path:`${out}/${width}-${name}-hero.png`});
   const checked={width,route,title:await page.locator('h1').innerText(),floors:[],exteriors:[],passed:false};
   if(guide){
    assert.equal(await page.locator('.highlight-grid article').count(),guide.highlights);
    assert.equal(await page.locator('.architecture-plan').getAttribute('data-active-floor'),guide.floors[0].id);
    for(const [index,model]of guide.floors.entries()){
     if(guide.floors.length>1)await page.locator('[aria-label="建筑楼层与区域"] button').nth(index).click();
     await page.getByRole('button',{name:'2D 平面',exact:true}).click();const plan=page.locator('.architecture-plan');assert.equal(await plan.getAttribute('data-active-floor'),model.id);
     const expected=model.labels.map(l=>({id:l.id,text:l.text}));
     for(const zoom of [1,4]){
      if(zoom===4)for(let i=0;i<7;i++){const plus=page.getByRole('button',{name:'放大平面',exact:true});if(await plus.isEnabled())await plus.click();}
      assert.deepEqual(await page.locator('[data-source-label-id]').evaluateAll(ns=>ns.map(n=>({id:n.getAttribute('data-source-label-id'),text:n.textContent}))),expected,`${slug} ${model.id} labels`);
     }
     await page.getByRole('button',{name:'显示全图',exact:true}).click();
     for(const n of [...new Set([0,Math.floor(model.spaces.length/2),model.spaces.length-1])]){const s=model.spaces[n];await page.getByLabel('选择建筑空间',{exact:true}).selectOption(s.id);assert.equal(await page.locator('#spatial').getAttribute('data-active-place'),s.id);}
     await capture(page,plan,`${width}-${slug}-${model.id}-2d`);
     await page.getByRole('button',{name:'3D 剖切',exact:true}).click();const canvas=page.locator('.architecture-canvas canvas');await canvas.waitFor();
     await capture(page,canvas,`${width}-${slug}-${model.id}-3d`);
     if(index===0){const box=await canvas.boundingBox();await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await page.mouse.down();await page.mouse.move(box.x+box.width*.65,box.y+box.height*.55,{steps:6});await page.mouse.up();await page.getByRole('button',{name:'显示全图',exact:true}).click();}
     checked.floors.push({id:model.id,labels:expected.length,views:['2d','3d'],selection:true});
    }
    await page.getByRole('button',{name:'建筑外观',exact:true}).click();
    for(const [index,model]of guide.exteriors.entries()){
     if(guide.exteriors.length>1)await page.locator('[aria-label="外观范围"] button').nth(index).click();
     await page.getByRole('button',{name:'3D 外观',exact:true}).click();await page.locator('.exterior-canvas canvas').waitFor();
     await page.getByLabel('选择外观观察点',{exact:true}).selectOption(model.features.at(-1).id);assert.equal(await page.locator('.exterior-map').getAttribute('data-active-exterior-feature'),model.features.at(-1).id);
     await page.getByRole('button',{name:'正面',exact:true}).click();await capture(page,page.locator('.exterior-canvas'),`${width}-${slug}-${model.id}-front`);
     await page.getByRole('button',{name:'斜视',exact:true}).click();await capture(page,page.locator('.exterior-canvas'),`${width}-${slug}-${model.id}-exterior`);
     await page.getByRole('button',{name:'2D 外观俯视',exact:true}).click();await capture(page,page.locator('.architecture-plan'),`${width}-${slug}-${model.id}-exterior2d`);
     checked.exteriors.push({id:model.id,parts:model.parts,views:['front','oblique','2d'],selection:true});
    }
    await page.getByRole('button',{name:'内部／场地',exact:true}).click();await page.getByRole('button',{name:'2D 平面',exact:true}).click();
    await page.locator('.search input').fill('不存在的关键词000');assert.equal(await page.locator('.highlight-grid article').count(),0);await page.locator('.search input').fill('');assert.equal(await page.locator('.highlight-grid article').count(),guide.highlights);
    await page.locator('.image-button').first().click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'关闭 ×',exact:true}).click();
    await page.getByRole('button',{name:'进入现场模式',exact:true}).click();await page.getByRole('button',{name:'下一步',exact:true}).click();await page.getByRole('button',{name:'← 退出现场模式',exact:true}).click();
   }
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${name} postinteraction overflow`);
   await page.screenshot({path:`${out}/${width}-${name}-full.png`,fullPage:true});checked.passed=true;report.routes.push(checked);
   assert.deepEqual(errors,[]);await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
  }
  if(width===1440){
   await page.waitForFunction(()=>document.querySelector('.offline-trigger')?.textContent.includes('已缓存'),{},{timeout:60000});
   await context.setOffline(true);
   for(const route of routes){const relative=route.slice(base.length);await page.goto(new URL(relative,target).href,{waitUntil:'networkidle'});await page.locator('h1').waitFor();assert.doesNotMatch(await page.locator('h1').innerText(),/不存在/);await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});assert.deepEqual(await page.evaluate(()=>[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)),[]);if(relative.startsWith('guides/')&&relative!=='guides/'){await page.getByRole('button',{name:'3D 剖切',exact:true}).click();await page.locator('.architecture-canvas canvas').waitFor();await page.getByRole('button',{name:'建筑外观',exact:true}).click();await page.locator('.exterior-canvas canvas').waitFor();}report.offline.push({route,passed:true});}
   await context.setOffline(false);
  }
  await context.close();
 }
 report.passed=true;
}catch(e){report.passed=false;report.errors.push(e.stack);throw e;}
finally{await writeFile(`${out}/report.json`,JSON.stringify(report,null,2)+'\n');await browser.close();console.log(JSON.stringify({tag,passed:report.passed,views:report.routes.length,offline:report.offline.length,errors:report.errors}));}
