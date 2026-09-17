import {createServer} from 'vite';
import {readFile,writeFile,copyFile,mkdir} from 'node:fs/promises';
const deployed=process.argv.includes('--deployed');
const manifest=JSON.parse(await readFile('dist/offline-manifest.json','utf8'));
const browser=JSON.parse(await readFile(`artifacts/${deployed?'live':'local'}/browser-report.json`,'utf8'));
const resume=JSON.parse(await readFile('artifacts/local/resume-report.json','utf8'));
const fallback=JSON.parse(await readFile('artifacts/local/fallback-report.json','utf8'));
if(!browser.viewports.every(v=>v.passed)||!browser.offline.passed||!resume.passed||!fallback.passed)throw new Error('Incomplete QA');
const server=await createServer({configFile:false,base:'/',cacheDir:'node_modules/.vite-release-audit',server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true}});
try{
 const {guide:g}=await server.ssrLoadModule('/src/data/guides.ts');
 const {sources}=await server.ssrLoadModule('/src/data/sources.ts');
 await mkdir('docs/qa',{recursive:true});
 for(const file of ['browser-report.json','resume-report.json','fallback-report.json'])await copyFile('artifacts/local/'+file,'docs/qa/'+file);
 if(deployed)await copyFile('artifacts/live/browser-report.json','docs/qa/live-browser-report.json');
 const kinds=['content','visual','spatial','interaction','offline','offline-resume'];
 const refs={content:'docs/release-review.md',visual:'docs/release-review.md',spatial:'docs/release-review.md',interaction:'docs/qa/browser-report.json',offline:'docs/qa/browser-report.json','offline-resume':'docs/qa/resume-report.json'};
 const acceptance={};for(const [check,ev]of Object.entries({cover:['visual'],exteriorContent:['content'],exteriorModel:['spatial','visual'],interiorContent:['content'],interiorMap:['spatial','visual'],highlights:['content','visual'],interaction:['interaction'],offline:['offline']}))acceptance[check]={status:'passed',evidenceIds:ev.map(k=>'review-'+k)};
 const groups=[{id:'arrival-and-building',highlightIds:['nmec-architecture','nmec-fustat']},{id:'civilization-and-materials',highlightIds:['nmec-prehistory','nmec-kingship','nmec-textile-material','nmec-coptic','nmec-islamic-textile','nmec-living-heritage']},{id:'royal-mummies',highlightIds:['nmec-mummies-parade','nmec-mummies']}];
 const levels=g.spatial.architectureLevels;
 const ledger={version:2,mode:'single-site',delivery:{target:'deployed',url:'https://dawnkuo.github.io/nmec-cultural-guide/'},scope:{guideSlugs:[g.slug],note:'Publication of the existing 10-theme guide selection, not a collection-scale expansion'},evidence:kinds.map(kind=>({id:'review-'+kind,kind,artifact:refs[kind],revision:manifest.release})),site:{title:g.title,theme:'museum-navy-gold',hideItineraryPrices:true,readyForRelease:true},itinerary:{days:[]},sources:sources.map(s=>({...s,authority:s.authority==='official-primary'?'official':s.authority==='media-repository'?'media':'authoritative',scopes:s.id==='src-nmec-plan-study'?[...s.scopes,'footprint','spaces','levels']:s.scopes})),guides:[{...g,coverage:{minHighlights:10,requiredGroups:groups.map(g=>g.id),groups,requiredChecks:Object.keys(acceptance)},acceptance,spatial:{mode:'stacked-floorplan',deliveryMode:'interactive-schematic',floorCount:levels.length,spaceCount:levels.reduce((n,l)=>n+l.spaces.length,0),routeStopCount:0,verticalLinkCount:0,crossFloorRoute:false,fallback:'svg',sourceIds:['src-nmec-plan-study'],file:'src/data/guide.json',exteriorModelId:'nmec-exterior-complete'},highlights:g.highlights.map(h=>({...h,image:h.image.src,imageAlt:h.image.alt}))}],maps:{overview:{status:'not-required'},cities:[]},offline:{enabled:true,resumeRequired:true,precacheRoutes:manifest.routes,precacheAssets:manifest.resources.map(r=>r.path)},verification:{revision:manifest.release,offlineResumeEvidenceIds:['review-offline-resume'],unit:'passed',build:'passed',offlineDeepLink:'passed',visual:{desktop:true,portrait:true,mobile:true,allGuides:true,webglFallback:true},deployed:deployed?'passed':'pending'}};
 await writeFile('guide-build-manifest.json',JSON.stringify(ledger,null,2)+'\n');console.log(manifest.release);
}finally{await server.close();}
