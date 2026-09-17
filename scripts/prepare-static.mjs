import {mkdir,copyFile,writeFile,readFile} from 'node:fs/promises';
const routes=JSON.parse(await readFile('route-catalog.json','utf8'));
for(const route of routes.slice(1)){const directory='dist/'+route.replace('/nmec-cultural-guide/','');await mkdir(directory,{recursive:true});await copyFile('dist/index.html',directory+'index.html');}
await copyFile('dist/index.html','dist/404.html');
await writeFile('dist/.nojekyll','');
