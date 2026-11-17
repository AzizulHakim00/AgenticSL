import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
const file=p=>new URL('../'+p,import.meta.url);
const sources = await Promise.all(['notes','practice-questions','curriculum','ui','server'].map(n=>readFile(file(`src/${n}.mjs`),'utf8')));
const bundled = sources.map(s=>s.replace(/^import .* from ['"].*['"];?\r?\n/gm,'').replace(/^export (const|function|async function) /gm,'$1 ')).join('\n');
await mkdir(file('dist/server'),{recursive:true});
await mkdir(file('dist/.openai'),{recursive:true});
await writeFile(file('dist/server/index.js'),bundled);
await cp(file('.openai/hosting.json'),file('dist/.openai/hosting.json'));
console.log('Built AgenticSL worker');
