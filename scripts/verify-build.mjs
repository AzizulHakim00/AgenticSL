import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFile } from 'node:fs/promises';
import worker from '../dist/server/index.js';

// Exercise the compiled Worker without connecting to production or writing real progress.
const sqlite=new DatabaseSync(':memory:');
sqlite.exec(await readFile(new URL('../drizzle/0000_learning.sql',import.meta.url),'utf8'));
const DB={prepare(sql){const s=sqlite.prepare(sql);let values=[];return {
  bind(...v){values=v;return this;},
  async all(){return {results:s.all(...values)};},
  async first(){return s.get(...values)||null;},
  async run(){return s.run(...values);}
};}};
const origin='https://release-check.invalid';
const request=(path,body,authenticated=true)=>new Request(origin+path,{
  method:body?'POST':'GET',
  headers:{...(authenticated?{'oai-authenticated-user-id':'release-test'}:{}),...(body?{'Origin':origin,'Content-Type':'application/json'}:{})},
  ...(body?{body:JSON.stringify(body)}:{})
});
try{
  assert.equal((await worker.fetch(request('/api/state',null,false),{DB})).status,401);
  const initial=await (await worker.fetch(request('/api/state'),{DB})).json();
  assert.equal(initial.curriculum.length,60);
  assert.equal(initial.state.completed,0);
  const saved=await worker.fetch(request('/api/action',{type:'task',day:1,index:0,checked:true,requestId:'release-check-0001'}),{DB});
  assert.equal(saved.status,200);
  const rpc=await worker.fetch(request('/mcp',{jsonrpc:'2.0',id:1,method:'tools/call',params:{name:'get_day_details',arguments:{day:1}}}),{DB});
  assert.equal((await rpc.json()).result.structuredContent.progress.tasks[0],true);
  const page=await worker.fetch(request('/'),{DB});
  assert.equal(page.status,200);
  assert(page.headers.get('Content-Security-Policy').includes('nonce-'));
  const html=await page.text();
  const script=html.match(/<script nonce="[^"]+">([\s\S]*?)<\/script>/)?.[1];
  assert(script,'Compiled page must contain its application script');
  const {Script}=await import('node:vm');
  new Script(script); // Syntax check only; browser layout and interaction remain separate QA.
  console.log('Compiled release verified: private API, curriculum, saved objective, MCP read and client script syntax.');
}finally{sqlite.close();}
