import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync } from 'node:fs';
import worker from '../src/server.mjs';
const file=p=>new URL('../'+p,import.meta.url);
mkdirSync(file('data'),{recursive:true});
const sqlite=new DatabaseSync(file('data/learning.sqlite'));
if(!sqlite.prepare("SELECT name FROM sqlite_master WHERE name='learning_records'").get())sqlite.exec(readFileSync(file('drizzle/0000_learning.sql'),'utf8'));
const DB={prepare(sql){const statement=sqlite.prepare(sql);let values=[];return {bind(...v){values=v;return this;},async all(){return {results:statement.all(...values)};},async first(){return statement.get(...values)||null;},async run(){return statement.run(...values);}};}};
const port=Number(globalThis.process?.env?.PORT)||4173;
export const server=http.createServer(async(req,res)=>{
  try{const chunks=[];for await(const chunk of req)chunks.push(chunk);const body=Buffer.concat(chunks);const headers=new Headers();for(const [k,v]of Object.entries(req.headers))if(v)headers.set(k,Array.isArray(v)?v.join(','):v);
    // This identity is only injected by this loopback-only development adapter.
    headers.set('oai-authenticated-user-id','local-development');
    const response=await worker.fetch(new Request(`http://127.0.0.1:${port}${req.url}`,{method:req.method,headers,...(body.length?{body}: {})}),{DB});
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch{res.writeHead(500);res.end('Local preview failed');}
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
