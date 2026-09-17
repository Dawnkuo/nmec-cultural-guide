import {chromium} from 'playwright';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const target=process.argv[2]??'http://127.0.0.1:4181/nmec-cultural-guide/';
const tag=process.argv[3]??'local';
const out=`artifacts/${tag}`;await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const guide=JSON.parse(await readFile('src/data/guide.json','utf8'));
const report={target,testedAt:new Date().toISOString(),viewports:[],offline:null};
try{
 for(const [width,height]of [[1440,1000],[1094,768],[390,844]]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(target,{waitUntil:'networkidle'});
  await page.locator('h1').waitFor();
  assert.match(await page.locator('h1').innerText(),/埃及国家文明博物馆/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.equal(await page.locator('.architecture-plan').getAttribute('data-active-floor'),'nmec-arrival');
  await page.screenshot({path:`${out}/${width}-hero.png`});
  const snapshots=[];
  for(const model of guide.spatial.architectureLevels){
   await page.getByRole('button',{name:model.floor.title,exact:true}).click();
   await page.getByRole('button',{name:'2D 平面',exact:true}).click();
   const plan=page.locator('.architecture-plan');
   assert.equal(await plan.getAttribute('data-active-floor'),model.floor.id);
   for(const zoom of [1,4]){
    if(zoom===4)for(let i=0;i<7;i++){const plus=page.getByRole('button',{name:'放大平面',exact:true});if(await plus.isEnabled())await plus.click();}
    const labels=await page.locator('[data-source-label-id]').evaluateAll(nodes=>nodes.map(n=>({id:n.getAttribute('data-source-label-id'),text:n.textContent})));
    assert.deepEqual(labels,model.labels.map(l=>({id:l.id,text:l.text})));
   }
   await page.getByRole('button',{name:'显示全图',exact:true}).click();
   for(const index of [...new Set([0,Math.floor(model.spaces.length/2),model.spaces.length-1])]){const space=model.spaces[index];await page.getByLabel('选择建筑空间',{exact:true}).selectOption(space.id);assert.equal(await page.locator('#spatial').getAttribute('data-active-place'),space.id);}
   await plan.scrollIntoViewIfNeeded();await plan.screenshot({path:`${out}/${width}-${model.id}-2d.png`});
   await page.getByRole('button',{name:'3D 剖切',exact:true}).click();
   await page.locator('.architecture-canvas canvas').waitFor();
   const canvas=page.locator('.architecture-canvas canvas');await canvas.scrollIntoViewIfNeeded();
   const box=await canvas.boundingBox();await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await page.mouse.down();await page.mouse.move(box.x+box.width*.7,box.y+box.height*.55,{steps:8});await page.mouse.up();
   await canvas.screenshot({path:`${out}/${width}-${model.id}-3d-drag.png`});
   await page.getByRole('button',{name:'显示全图',exact:true}).click();
   await canvas.screenshot({path:`${out}/${width}-${model.id}-3d.png`});
   snapshots.push(model.id);
  }
  await page.getByRole('button',{name:'建筑外观',exact:true}).click();await page.locator('.exterior-canvas canvas').waitFor();
  await page.getByLabel('选择外观观察点',{exact:true}).selectOption('nmec-entry-portico');
  for(const name of ['正面','斜视']){await page.getByRole('button',{name,exact:true}).click();await page.locator('.exterior-canvas').screenshot({path:`${out}/${width}-exterior-${name}.png`});}
  await page.getByRole('button',{name:'2D 外观俯视',exact:true}).click();await page.locator('.architecture-plan').screenshot({path:`${out}/${width}-exterior-2d.png`});
  await page.getByRole('button',{name:'内部／场地',exact:true}).click();await page.getByRole('button',{name:'入口层 · 主展厅',exact:true}).click();await page.getByRole('button',{name:'2D 平面',exact:true}).click();
  await page.locator('.search input').fill('皇家木乃伊');assert.ok(await page.locator('.highlight-grid article').count()>0);await page.locator('.search input').fill('');assert.equal(await page.locator('.highlight-grid article').count(),10);
  await page.locator('.image-button').first().click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'关闭 ×',exact:true}).click();
  await page.getByRole('button',{name:'进入现场模式',exact:true}).click();await page.getByRole('button',{name:'下一步',exact:true}).click();await page.getByRole('button',{name:'← 退出现场模式',exact:true}).click();
  await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
  assert.deepEqual(await page.evaluate(()=>[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)),[]);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.screenshot({path:`${out}/${width}-full.png`,fullPage:true});
  await page.waitForFunction(()=>document.querySelector('.offline-trigger')?.textContent.includes('已缓存'),{},{timeout:60000});
  if(width===1440){
   const cached=await page.evaluate(async()=>({keys:await caches.keys(),scopes:(await navigator.serviceWorker.getRegistrations()).map(r=>r.scope)}));
   await context.setOffline(true);
   await page.goto(target+'guides/national-museum-egyptian-civilization/#object-nmec-mummies',{waitUntil:'networkidle'});
   assert.equal(await page.locator('.architecture-plan').getAttribute('data-active-floor'),'nmec-arrival');
   await page.getByRole('button',{name:'地下层 · 皇家木乃伊厅',exact:true}).click();await page.getByRole('button',{name:'3D 剖切',exact:true}).click();await page.locator('.architecture-canvas canvas').waitFor();
   await page.getByRole('button',{name:'建筑外观',exact:true}).click();await page.locator('.exterior-canvas canvas').waitFor();
   await page.screenshot({path:`${out}/offline.png`});report.offline={passed:true,cached,deepLink:page.url(),maps:['mummies-3d','exterior-3d']};
  }
  assert.deepEqual(errors,[]);report.viewports.push({width,height,passed:true,floors:snapshots,errors});
  await context.close();
 }
 await writeFile(`${out}/browser-report.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{await browser.close();}
