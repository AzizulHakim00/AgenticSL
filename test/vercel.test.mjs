import {test} from 'node:test';
import assert from 'node:assert/strict';
import {configuration,createVercelApp,supabaseDatabase} from '../src/vercel.mjs';

const owner='11111111-1111-4111-8111-111111111111';
const env={SUPABASE_URL:'https://testproject.supabase.co',SUPABASE_ANON_KEY:'sb_publishable_test',AGENTICSL_OWNER_ID:owner,APP_ORIGIN:'https://learning.example'};
const user={id:owner,email:'owner@example.test',email_confirmed_at:'2026-11-18T00:00:00Z'};
const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
function provider(){
  const calls=[],rows=[];
  const fetcher=async(input,options={})=>{
    const url=new URL(input);calls.push({url,options});
    if(url.pathname==='/auth/v1/user'){
      if(options.headers.Authorization==='Bearer owner-access')return reply(user);
      if(options.headers.Authorization==='Bearer other-access')return reply({...user,id:'22222222-2222-4222-8222-222222222222'});
      return reply({error:'Expired or invalid token'},401);
    }
    if(url.pathname==='/auth/v1/token'){
      const body=JSON.parse(options.body);
      if(body.password==='valid-test-password'||body.refresh_token==='valid-refresh')return reply({access_token:'owner-access',refresh_token:'rotated-refresh',expires_in:3600});
      return reply({error:'Invalid credentials'},400);
    }
    if(url.pathname==='/auth/v1/logout')return reply({});
    if(url.pathname==='/rest/v1/learning_records'){
      assert.equal(options.headers.Authorization,'Bearer owner-access');
      assert.equal(url.searchParams.get('owner_id'),'eq.'+owner);
      if(options.method==='POST'){const row=JSON.parse(options.body);rows.push(row);return new Response(null,{status:201});}
      const id=url.searchParams.get('id')?.slice(3);
      return reply(id?rows.filter(r=>r.id===id):rows);
    }
    throw Error('Unexpected provider request');
  };
  return {calls,rows,fetcher};
}
function request(path,{body,token,cookie,origin=env.APP_ORIGIN,method,extra={}}={}){
  return new Request(env.APP_ORIGIN+path,{method:method||(body?'POST':'GET'),headers:{...(token?{Authorization:'Bearer '+token}:{}),...(cookie?{Cookie:cookie}:{}),...(body?{Origin:origin,'Content-Type':'application/json'}:{}),...extra},...(body?{body:typeof body==='string'?body:JSON.stringify(body)}:{})});
}

test('Vercel without configuration shows honest setup and never a broken ChatGPT sign-in link',async()=>{
  const app=createVercelApp({},()=>{throw Error('No network should be attempted');});
  const page=await app.fetch(request('/'));const html=await page.text();
  assert(html.includes('Connect your learning workspace'));assert(!html.includes('signin-with-chatgpt'));
  assert.equal((await app.fetch(request('/api/state'))).status,503);
  assert.equal((await app.fetch(request('/api/health'))).status,503);
  assert.equal(configuration({...env,SUPABASE_ANON_KEY:'sb_secret_private'}).ready,false);
  assert.equal(configuration({...env,SUPABASE_URL:'http://localhost/'}).ready,false);
});

test('anonymous and spoofed hosting-identity headers cannot access Vercel learning records',async()=>{
  const p=provider(),app=createVercelApp(env,p.fetcher);
  const unauth=await app.fetch(request('/api/state',{extra:{'oai-authenticated-user-id':owner}}));
  assert.equal(unauth.status,401);assert.equal(p.calls.length,0);
  const root=await app.fetch(request('/'));assert((await root.text()).includes('autocomplete="current-password"'));
  const other=await app.fetch(request('/api/state',{token:'other-access'}));assert.equal(other.status,403);
  const invalid=await app.fetch(request('/api/state',{token:'invalid-access'}));assert.equal(invalid.status,401);
  assert(!p.calls.some(c=>c.url.pathname.includes('/rest/')));
});

test('verified owner sees dashboard and writes are read back through MCP using the same database',async()=>{
  const p=provider(),app=createVercelApp(env,p.fetcher),token='owner-access';
  const state=await (await app.fetch(request('/api/state',{token}))).json();assert.equal(state.hosting,'vercel');
  assert.equal(state.curriculum.length,60);assert.equal(state.state.completed,0);
  const saved=await app.fetch(request('/api/action',{token,body:{type:'task',day:1,index:0,checked:true,requestId:'vercel-test-00001'},extra:{'oai-authenticated-user-id':'spoofed'}}));
  assert.equal(saved.status,200);assert.equal(p.rows[0].actor,owner);assert.equal(p.rows[0].owner_id,owner);
  const mcp=await app.fetch(request('/mcp',{token,body:{jsonrpc:'2.0',id:1,method:'tools/call',params:{name:'get_day_details',arguments:{day:1}}}}));
  assert.equal((await mcp.json()).result.structuredContent.progress.tasks[0],true);
  const root=await app.fetch(request('/',{cookie:'__Host-agenticsl_access=owner-access'}));
  assert((await root.text()).includes('action="/auth/logout"'));
});

test('login verifies owner and sets secure HttpOnly cookies without returning tokens in page content',async()=>{
  const p=provider(),app=createVercelApp(env,p.fetcher);
  const login=await app.fetch(request('/auth/login',{body:'email=owner%40example.test&password=valid-test-password',extra:{'Content-Type':'application/x-www-form-urlencoded'}}));
  assert.equal(login.status,303);assert.equal(login.headers.get('Location'),env.APP_ORIGIN+'/');
  const values=login.headers.getSetCookie();assert.equal(values.length,2);
  assert(values.every(c=>c.includes('HttpOnly')&&c.includes('Secure')&&c.includes('SameSite=Lax')&&c.includes('Path=/')));
  assert(!(await login.text()).includes('owner-access'));
  const bad=await app.fetch(request('/auth/login',{body:'email=owner%40example.test&password=wrong'}));
  assert.equal(bad.headers.getSetCookie().length,0);assert((await bad.text()).includes('Sign-in failed'));
});

test('cross-origin login and browser writes fail before reaching Supabase',async()=>{
  const p=provider(),app=createVercelApp(env,p.fetcher);
  for(const path of ['/auth/login','/auth/logout','/api/action']){
    const result=await app.fetch(request(path,{body:{type:'task',day:1,index:0,checked:true},origin:'https://untrusted.example',token:'owner-access'}));assert.equal(result.status,403);
  }
  assert.equal(p.calls.length,0);
});

test('expired browser access can rotate refresh cookies but MCP requires bearer authentication',async()=>{
  const p=provider(),app=createVercelApp(env,p.fetcher);
  const cookie='__Host-agenticsl_access=expired; __Host-agenticsl_refresh=valid-refresh';
  const refreshed=await app.fetch(request('/api/state',{cookie}));assert.equal(refreshed.status,200);
  assert(refreshed.headers.getSetCookie().some(c=>c.includes('rotated-refresh')));
  const calls=p.calls.length;
  const rpc=await app.fetch(request('/mcp',{cookie,body:{jsonrpc:'2.0',id:1,method:'tools/list'}}));
  assert.equal(rpc.status,401);assert.equal(p.calls.length,calls);
});

test('logout revokes the local Supabase session and clears both browser cookies',async()=>{
  const p=provider(),app=createVercelApp(env,p.fetcher);
  const r=await app.fetch(request('/auth/logout',{method:'POST',cookie:'__Host-agenticsl_access=owner-access',extra:{Origin:env.APP_ORIGIN}}));
  assert.equal(r.status,303);assert(r.headers.getSetCookie().every(c=>c.includes('Max-Age=0')));
  assert(p.calls.some(c=>c.url.pathname==='/auth/v1/logout'&&c.url.searchParams.get('scope')==='local'));
});

test('storage pagination preserves complete history and rejects unsupported SQL',async()=>{
  const ranges=[];
  const fetcher=async(input,options)=>{
    const url=new URL(input);assert.equal(url.searchParams.get('order'),'sequence.asc');
    ranges.push(options.headers.Range);return reply(Array.from({length:ranges.length===1?1000:1},(_,i)=>({id:String(i)})));
  };
  const db=supabaseDatabase(configuration(env),'owner-access',fetcher);
  const all=await db.prepare('SELECT id,kind,day,payload,actor,created_at FROM learning_records ORDER BY rowid ASC').all();
  assert.equal(all.results.length,1001);assert.deepEqual(ranges,['0-999','1000-1999']);
  await assert.rejects(db.prepare('DELETE FROM learning_records').run(),/Unsupported/);
});

test('provider failure does not open the dashboard or claim a successful save',async()=>{
  const app=createVercelApp(env,async()=>{throw Error('Provider is offline');});
  const result=await app.fetch(request('/api/state',{token:'owner-access'}));assert.equal(result.status,503);
  assert(!(await result.text()).includes('Provider is offline'));
});
