import {chromium} from 'playwright';
import {readFile,readdir,mkdir} from 'node:fs/promises';
const dir=process.argv[2]||'artifacts/full-local';
const prefix=process.argv[3]||'1440';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const paths=(await readdir(dir)).filter(f=>f.startsWith(prefix)&&f.endsWith('.png')&&!f.endsWith('-full.png')&&!f.endsWith('-front.png')&&!f.endsWith('-exterior2d.png'));
 const page=await browser.newPage({viewport:{width:1800,height:1300}});
 await mkdir(dir+'/sheets',{recursive:true});
 for(let start=0;start<paths.length;start+=12){const files=paths.slice(start,start+12);const imgs=await Promise.all(files.map(async f=>`<figure><figcaption>${f}</figcaption><img src="data:image/png;base64,${(await readFile(dir+'/'+f)).toString('base64')}"></figure>`));await page.setContent(`<style>body{background:#eee;margin:0;display:grid;grid-template-columns:repeat(3,600px)}figure{margin:0;height:325px;padding:5px;box-sizing:border-box}figcaption{font:13px sans-serif;height:30px}img{width:590px;height:280px;object-fit:contain;background:#081726}</style>${imgs.join('')}`);await page.screenshot({path:`${dir}/sheets/${prefix}-${start/12}.jpg`,type:'jpeg',quality:85});}
}finally{await browser.close();}
