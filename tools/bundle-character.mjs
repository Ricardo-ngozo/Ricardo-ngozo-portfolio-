import {build} from "esbuild";import {mkdir,copyFile,readFile,writeFile} from "node:fs/promises";import path from "node:path";
const root=process.cwd();await mkdir("assets/character",{recursive:true});
const result=await build({stdin:{contents:await readFile("character/viewer.js","utf8"),resolveDir:root+"/character",sourcefile:"viewer.js"},bundle:true,format:"esm",target:"es2022",minify:true,legalComments:"linked",write:false,outfile:"assets/character/viewer.js",plugins:[{name:"explicit-module-files",setup(api){api.onResolve({filter:/.*/},args=>{
let file;if(args.path==="three")file=path.join(root,"node_modules/three/build/three.module.js");else if(args.path.startsWith("three/addons/"))file=path.join(root,"node_modules/three/examples/jsm",args.path.slice(13));else file=path.resolve(args.importer?path.dirname(args.importer):args.resolveDir,args.path);
return{path:file,namespace:"source"};});api.onLoad({filter:/.*/,namespace:"source"},async args=>({contents:await readFile(args.path,"utf8"),loader:"js"}));}}]});
for(const out of result.outputFiles)await writeFile(out.path,out.contents);
await copyFile("node_modules/three/LICENSE","assets/character/THREE-LICENSE.txt");
console.log("Character viewer bundled.",result.outputFiles.map(f=>f.contents.length));

