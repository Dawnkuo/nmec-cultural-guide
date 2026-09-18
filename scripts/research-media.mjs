import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {chromium} from 'playwright';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile);
const spec=JSON.parse(await readFile(process.argv[2],'utf8'));
const root='artifacts/media-research';await mkdir(root,{recursive:true});
const clean=s=>(s??'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const exists=async p=>{try{await access(p);return true;}catch{return false;}};
async function request(url){const parsed=new URL(url);if(parsed.hostname.includes('wikimedia.org')&&!parsed.pathname.endsWith('api.php'))parsed.search='';if(parsed.hostname==='upload.wikimedia.org'&&!parsed.pathname.includes('/thumb/')&&/\.(jpg|jpeg|png)$/i.test(parsed.pathname)){const name=parsed.pathname.split('/').at(-1);parsed.hostname='thumb.wikimedia.org';parsed.pathname=parsed.pathname.replace('/commons/','/commons/thumb/')+'/960px-'+name;}const {stdout}=await run('curl',['-fLsS','--retry','3','--retry-all-errors','--retry-max-time','650','--max-time','35',parsed.href],{encoding:'buffer',maxBuffer:25e6});return {json:()=>JSON.parse(stdout.toString()),arrayBuffer:()=>stdout};}
for(const [id,q] of Object.entries(process.argv[3]==='--sheets'?{}:spec)){
 const dir=root+'/'+id;await mkdir(dir,{recursive:true});
 if(!await exists(dir+'/results.json')){
  const u=new URL('https://commons.wikimedia.org/w/api.php');
  for(const[k,v]of Object.entries({action:'query',format:'json',...(typeof q==='string'?{generator:'search',gsrsearch:q+' -filetype:pdf -filetype:djvu',gsrnamespace:'6',gsrlimit:'4'}:{titles:q.titles.join('|')}),prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'960'}))u.searchParams.set(k,v);
  const r=await request(u);
  const data=await r.json();if(data.error)throw Error(JSON.stringify(data.error));
  const items=Object.values(data.query?.pages??{}).sort((a,b)=>a.index-b.index).filter(p=>p.imageinfo?.[0].thumburl).map((p,i)=>{const n=p.imageinfo[0],m=n.extmetadata;return {id,index:i,title:p.title,url:n.url,thumburl:n.thumburl,sourcePage:n.descriptionurl,author:clean(m.Artist?.value),license:clean(m.LicenseShortName?.value),licenseUrl:m.LicenseUrl?.value??'https://creativecommons.org/publicdomain/mark/1.0/',date:clean(m.DateTimeOriginal?.value),description:clean(m.ImageDescription?.value)};});
  await writeFile(dir+'/results.json',JSON.stringify(items,null,2));
 }
 const items=JSON.parse(await readFile(dir+'/results.json','utf8'));
 await Promise.all(items.map(async item=>{const path=dir+'/'+item.index+'.jpg';if(await exists(path))return;try{const r=await request(item.thumburl);await writeFile(path,Buffer.from(await r.arrayBuffer()));}catch(e){console.log('DOWNLOAD FAILED',id,item.index,String(e));}}));
 console.log(id,items.length);
}
const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1600,height:1000}});
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const keys=Object.keys(spec);for(let start=0;start<keys.length;start+=4){const cards=[];for(const id of keys.slice(start,start+4)){const items=JSON.parse(await readFile(root+'/'+id+'/results.json','utf8'));for(const item of items){const f=root+'/'+id+'/'+item.index+'.jpg';cards.push(`<article><b>${id} [${item.index}]</b><img src="${await exists(f)?'data:image/jpeg;base64,'+(await readFile(f)).toString('base64'):''}"><p>${esc(item.title)}</p><small>${esc(item.description).slice(0,250)}</small></article>`);}for(let i=items.length;i<4;i++)cards.push('<article>NO RESULT</article>');}await page.setContent(`<style>body{margin:0;background:#ddd;font:12px Arial}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:6px}article{background:white;height:325px;overflow:hidden}b{display:block;height:22px;padding:3px}img{width:100%;height:208px;object-fit:contain;background:#222}p{margin:2px;font-size:12px}small{font-size:10px}</style><div class="grid">${cards.join('')}</div>`);await page.evaluate(()=>Promise.all([...document.images].filter(i=>i.src).map(i=>i.decode().catch(()=>{}))));await page.screenshot({path:`${root}/${process.argv[2].split('/').at(-1).replace('.json','')}-${start/4}.jpg`,fullPage:true,quality:85});}
await browser.close();
