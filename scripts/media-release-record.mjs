import {createServer} from 'vite';
import {readFile,writeFile,copyFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const live=process.argv.includes('--deployed');
const read=async path=>JSON.parse(await readFile(path,'utf8'));
const offline=await read('dist/offline-manifest.json');
const media=await read('artifacts/media-local/report.json');
const local=await read('artifacts/media-full-local/report.json');
const fallback=await read('artifacts/full/fallback-report.json');
const resume=await read('artifacts/local/resume-report.json');
assert.ok(media.passed&&local.passed&&fallback.passed&&resume.passed);
assert.equal(media.views.length,42);assert.equal(local.routes.length,69);assert.equal(local.offline.length,23);
assert.equal(local.release,offline.release);assert.equal(fallback.release,offline.release);assert.equal(resume.originalRelease,offline.release);
await copyFile('artifacts/media-full-local/report.json','docs/qa/media-full-local-report.json');
await copyFile('artifacts/full/fallback-report.json','docs/qa/media-fallback-report.json');
let deployed;
if(live){
 deployed=await read('artifacts/media-live/report.json');const pkg=await read('artifacts/full-live/package-report.json');
 assert.ok(deployed.passed&&pkg.passed);assert.equal(deployed.views.length,42);assert.equal(pkg.release,offline.release);assert.equal(pkg.files.length,offline.resources.length);
 await copyFile('artifacts/media-live/report.json','docs/qa/media-live-report.json');
 await copyFile('artifacts/full-live/package-report.json','docs/qa/media-live-package-report.json');
}
const manifest=await read('guide-build-manifest.json');
const server=await createServer({configFile:false,base:'/',cacheDir:'node_modules/.vite-media-release',server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true}});
try{
 const {guideCatalog}=await server.ssrLoadModule('/src/data/guides.ts');
 manifest.guides=manifest.guides.map(old=>{const now=guideCatalog.find(g=>g.slug===old.slug);return {...old,hero:now.hero,visitChapters:now.visitChapters,highlights:now.highlights.map(h=>({...h,image:h.image.src,imageAlt:h.image.alt}))};});
 manifest.evidence=manifest.evidence.filter(e=>!e.id.startsWith('media-release-'));
 for(const [id,kind,artifact]of [['visual','visual','docs/media-review-20260918.md'],['interaction','interaction','docs/qa/media-full-local-report.json'],['offline','offline','docs/qa/media-full-local-report.json'],['offline-resume','offline-resume','docs/qa/media-resume-summary.json']])manifest.evidence.push({id:'media-release-'+id,kind,artifact,revision:offline.release});
 manifest.offline.precacheAssets=offline.resources.map(r=>r.path.replace('/nmec-cultural-guide/','/'));
 manifest.verification={...manifest.verification,revision:offline.release,offlineResumeEvidenceIds:['media-release-offline-resume'],deployed:live?'passed':'pending'};
 manifest.deploymentVerification={...manifest.deploymentVerification,resourceCount:offline.resources.length,liveBrowser:live?'passed':'pending'};
 manifest.mediaReview={revision:offline.release,scope:'All 14 guide covers, 28 visit chapters, 106 interpretation images; other cultural/geometry acceptance remains unchanged',status:'passed',positions:148,changedPositions:113,registry:'public/images/reviewed/manifest.json',localViews:42,lightboxes:106,liveViews:deployed?.views.length??0};
 await writeFile('guide-build-manifest.json',JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({release:offline.release,mediaReviewed:148,deployed:live,overallContentAcceptance:manifest.site.readyForRelease}));
}finally{await server.close();}
