import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const target=process.argv[2]||'https://dawnkuo.github.io/nmec-cultural-guide/';
const local=JSON.parse(await readFile('dist/offline-manifest.json','utf8'));
const root=new URL(target);
const response=await fetch(new URL('offline-manifest.json?release='+encodeURIComponent(local.release),root));
assert.equal(response.status,200);
const deployed=await response.json();
// CI rebuilds at a different time; generatedAt is not part of content identity.
const identity=m=>({version:m.version,release:m.release,routes:m.routes,resources:m.resources});
assert.deepEqual(identity(deployed),identity(local),'The deployed package is not the tested local revision');
const report={target,release:local.release,generatedAt:deployed.generatedAt,testedAt:new Date().toISOString(),files:[],passed:false};
const queue=[...local.resources];
await Promise.all(Array.from({length:6},async()=>{
 while(queue.length){const resource=queue.shift();const url=new URL(resource.path,root);url.searchParams.set('release',local.release);const r=await fetch(url,{signal:AbortSignal.timeout(60000)});assert.equal(r.status,200,resource.path);const buffer=Buffer.from(await r.arrayBuffer());const hash=createHash('sha256').update(buffer).digest('hex');assert.equal(hash,resource.sha256,resource.path);report.files.push({path:resource.path,status:r.status,sha256:hash,bytes:buffer.length});}
}));
report.files.sort((a,b)=>a.path.localeCompare(b.path));report.passed=true;
await mkdir('artifacts/full-live',{recursive:true});
await writeFile('artifacts/full-live/package-report.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({release:report.release,files:report.files.length,passed:report.passed}));
