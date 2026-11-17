import worker from './server.mjs';

const ACCESS='__Host-agenticsl_access', REFRESH='__Host-agenticsl_refresh';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=(value,status=200,headers={})=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});

export function configuration(env){
  const required=['SUPABASE_URL','SUPABASE_ANON_KEY','AGENTICSL_OWNER_ID','APP_ORIGIN'];
  const missing=required.filter(k=>!env[k]);
  if(missing.length)return {ready:false,missing};
  try{
    const db=new URL(env.SUPABASE_URL),app=new URL(env.APP_ORIGIN);
    if(db.protocol!=='https:'||!db.hostname.endsWith('.supabase.co')||db.username||db.password||db.search||db.hash||db.pathname!=='/')throw Error();
    if(app.protocol!=='https:'||app.username||app.password||app.search||app.hash||app.pathname!=='/')throw Error();
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(env.AGENTICSL_OWNER_ID))throw Error();
    if(env.SUPABASE_ANON_KEY.startsWith('sb_secret_'))throw Error();
    if(env.SUPABASE_ANON_KEY.startsWith('ey')){
      const claims=JSON.parse(Buffer.from(env.SUPABASE_ANON_KEY.split('.')[1],'base64url').toString());
      if(claims.role!=='anon')throw Error();
    }
    return {ready:true,supabase:db.origin,origin:app.origin,key:env.SUPABASE_ANON_KEY,owner:env.AGENTICSL_OWNER_ID};
  }catch{return {ready:false,missing:['valid Supabase URL, publishable/anon key, owner UUID and HTTPS application origin']};}
}

function page({title,message,login=false,error='',email=''}){
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · AgenticSL</title><style>\n:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#111313;color:#edf0e9;font:15px/1.65 system-ui,sans-serif;min-height:100vh;display:grid;place-items:center;padding:24px}.card{width:min(100%,480px);border:1px solid #30362f;border-radius:18px;padding:36px;background:#191c1b}.brand{color:#d0f58b;font-size:13px;letter-spacing:2px;font-weight:600}h1{font-size:31px;line-height:1.2;letter-spacing:-1px}p{color:#a8b1a7}label{display:block;margin:18px 0 7px;font-size:13px}input{width:100%;padding:12px;border:1px solid #424b40;border-radius:7px;background:#111313;color:inherit;font:inherit}button,a{display:inline-block;border:0;border-radius:7px;background:#d0f58b;color:#202b12;padding:12px 17px;font:600 13px system-ui;text-decoration:none;cursor:pointer}button{width:100%;margin-top:22px}.error{color:#ffa5a5}.note{font-size:12px;margin-top:22px}a:focus-visible,button:focus-visible,input:focus-visible{outline:2px solid #d0f58b;outline-offset:4px}</style></head><body><main class="card"><div class="brand">AGENTICSL / LEARNING HUB</div><h1>${esc(title)}</h1><p>${esc(message)}</p>${error?`<p class="error" role="alert">${esc(error)}</p>`:''}${login?`<form method="post" action="/auth/login"><label for="email">Email address</label><input id="email" name="email" type="email" maxlength="254" autocomplete="username" value="${esc(email)}" required><label for="password">Password</label><input id="password" name="password" type="password" maxlength="256" autocomplete="current-password" required><button type="submit">Sign in to your workspace</button></form><p class="note">Use your private workspace owner account. Your assignments and notes are only available after sign-in.</p>`:`<p>Login and saved progress need to be connected before you can begin.</p><a href="https://github.com/AzizulHakim00/AgenticSL/blob/main/VERCEL_SETUP.md" target="_blank" rel="noopener noreferrer">Open setup instructions</a><p class="note">Your workspace stays locked until setup is complete.</p>`}</main></body></html>`,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'self'",'X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'}});
}
function cookies(request){const out={};for(const entry of (request.headers.get('cookie')||'').split(';')){const n=entry.indexOf('=');if(n<0)continue;try{out[entry.slice(0,n).trim()]=decodeURIComponent(entry.slice(n+1));}catch{}}return out;}
const cookie=(name,value,age)=>`${name}=${encodeURIComponent(value)}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${age}`;
function addSession(response,session){
  if(!session)return response;
  const headers=new Headers(response.headers);
  headers.append('Set-Cookie',cookie(ACCESS,session.access_token||'',session.access_token?Math.max(1,Math.min(session.expires_in||3600,86400)):0));
  headers.append('Set-Cookie',cookie(REFRESH,session.refresh_token||'',session.refresh_token?2592000:0));
  return new Response(response.body,{status:response.status,headers});
}
async function authRequest(config,path,{token,body,method}={},fetcher){
  const response=await fetcher(config.supabase+'/auth/v1/'+path,{method:method||(body?'POST':'GET'),headers:{apikey:config.key,...(token?{Authorization:'Bearer '+token}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(12000)});
  return {ok:response.ok,status:response.status,data:await response.json().catch(()=>null)};
}
async function identity(request,config,fetcher){
  const bearer=/^Bearer\s+(\S+)$/i.exec(request.headers.get('Authorization')||'')?.[1];
  const jar=cookies(request),mcp=new URL(request.url).pathname==='/mcp';
  let token=bearer||(mcp?null:jar[ACCESS]),session=null;
  let result=token?await authRequest(config,'user',{token},fetcher):null;
  if(!bearer&&!mcp&&(!result||result.status===401||result.status===403)&&jar[REFRESH]){
    const refresh=await authRequest(config,'token?grant_type=refresh_token',{body:{refresh_token:jar[REFRESH]}},fetcher);
    if(refresh.ok&&refresh.data?.access_token&&refresh.data?.refresh_token){session=refresh.data;token=session.access_token;result=await authRequest(config,'user',{token},fetcher);}
  }
  if(result&&!result.ok&&![401,403].includes(result.status))throw Error('Identity provider unavailable');
  const user=result?.ok?result.data:null;
  if(!user)return {user:null,session:null};
  if(user.id!==config.owner||!user.email_confirmed_at)return {user:null,forbidden:true,session:null};
  return {user,token,session};
}

// Translate only the three fixed SQL contracts used by the learning service.
// Requests use the owner's verified access token, so PostgreSQL RLS stays active.
export function supabaseDatabase(config,token,fetcher=fetch){
  async function query(params,{method='GET',body,range}={}){
    const url=new URL(config.supabase+'/rest/v1/learning_records');
    for(const [k,v]of Object.entries(params))url.searchParams.set(k,v);
    url.searchParams.set('owner_id','eq.'+config.owner);
    const response=await fetcher(url,{method,headers:{apikey:config.key,Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json',Prefer:'return=minimal'}:{}),...(range?{'Range-Unit':'items',Range:range}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(12000)});
    if(!response.ok)throw Error('Learning database operation failed');
    return method==='GET'?await response.json():{success:true};
  }
  return {prepare(sql){let values=[];return {
    bind(...args){values=args;return this;},
    async all(){
      if(sql!=='SELECT id,kind,day,payload,actor,created_at FROM learning_records ORDER BY rowid ASC')throw Error('Unsupported query');
      const all=[];
      for(let start=0;start<100000;start+=1000){const rows=await query({select:'id,kind,day,payload,actor,created_at',order:'sequence.asc'},{range:`${start}-${start+999}`});all.push(...rows);if(rows.length<1000)return {results:all};}
      throw Error('Record history exceeds this release’s supported limit');
    },
    async first(){
      if(sql!=='SELECT kind,day,payload FROM learning_records WHERE id = ?')throw Error('Unsupported query');
      return (await query({select:'kind,day,payload',id:'eq.'+values[0],limit:'1'}))[0]||null;
    },
    async run(){
      if(sql!=='INSERT INTO learning_records (id,kind,day,payload,actor,created_at) VALUES (?,?,?,?,?,?)')throw Error('Unsupported query');
      const [id,kind,day,payload,actor,created_at]=values;
      return query({},{method:'POST',body:{id,kind,day,payload,actor,created_at,owner_id:config.owner}});
    }
  };}};
}

export function createVercelApp(env,fetcher=fetch){
  return {async fetch(request){
    const url=new URL(request.url),config=configuration(env);
    try{
      if(url.pathname==='/api/health')return json({app:'AgenticSL',ok:config.ready,configured:config.ready,platform:'vercel'},config.ready?200:503);
      if(!config.ready){
        if(url.pathname.startsWith('/api/')||url.pathname==='/mcp')return json({error:'Workspace setup is incomplete.'},503);
        return page({title:'Connect your learning workspace',message:'Your app is deployed. Private sign-in and progress storage are the next step.'});
      }
      const unsafe=!['GET','HEAD','OPTIONS'].includes(request.method);
      if(unsafe&&url.pathname!=='/mcp'&&request.headers.get('Origin')!==config.origin)return json({error:'A same-origin request is required.'},403);
      if(url.pathname==='/auth/login'&&request.method==='POST'){
        const raw=await request.text();if(raw.length>8192)return json({error:'Sign-in request is too large.'},413);
        const form=new URLSearchParams(raw),email=form.get('email')||'',password=form.get('password')||'';
        if(!email||email.length>254||!password||password.length>256)return page({title:'Welcome back',message:'Sign in to continue your learning.',login:true,error:'Enter your email and password.',email});
        const login=await authRequest(config,'token?grant_type=password',{body:{email,password}},fetcher);
        if(login.ok&&login.data?.access_token&&login.data?.refresh_token){
          const checked=await authRequest(config,'user',{token:login.data.access_token},fetcher);
          if(checked.ok&&checked.data?.id===config.owner&&checked.data.email_confirmed_at)return addSession(new Response(null,{status:303,headers:{Location:config.origin+'/', 'Cache-Control':'no-store'}}),login.data);
        }
        return page({title:'Welcome back',message:'Sign in to continue your learning.',login:true,error:'Sign-in failed. Check your owner account details and try again.',email});
      }
      const auth=await identity(request,config,fetcher);
      if(url.pathname==='/auth/logout'&&request.method==='POST'){
        if(auth.token)await authRequest(config,'logout?scope=local',{token:auth.token,method:'POST'},fetcher);
        return addSession(new Response(null,{status:303,headers:{Location:config.origin+'/', 'Cache-Control':'no-store'}}),{});
      }
      if(auth.forbidden)return json({error:'This account does not have access to this private workspace.'},403);
      if(!auth.user){
        if(['/', '/signin-with-chatgpt','/sign-in'].includes(url.pathname)&&request.method==='GET')return page({title:'Your learning, with evidence.',message:'Sign in to your private AgenticSL workspace.',login:true});
        return json({error:'Sign in to access this private workspace.'},401,{'WWW-Authenticate':'Bearer realm="AgenticSL"'});
      }
      const headers=new Headers(request.headers);
      for(const name of [...headers.keys()])if(name.startsWith('oai-authenticated-'))headers.delete(name);
      headers.set('oai-authenticated-user-id',auth.user.id);
      const secured=new Request(request,{headers});
      const result=await worker.fetch(secured,{DB:supabaseDatabase(config,auth.token,fetcher),PLATFORM:'vercel'});
      return addSession(result,auth.session);
    }catch{return json({error:'Could not connect to sign-in or learning storage. Your data has not been reported as saved. Please retry.'},503);}
  }};
}
