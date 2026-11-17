import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { curriculum,modules } from '../src/curriculum.mjs';
import { teachingNotes } from '../src/notes.mjs';
import { practicalChecks } from '../src/practice-questions.mjs';
import worker,{mutate,records,summarize,safeCurriculum} from '../src/server.mjs';
function database(){const sqlite=new DatabaseSync(':memory:');sqlite.exec(readFileSync('drizzle/0000_learning.sql','utf8'));return {prepare(sql){const s=sqlite.prepare(sql);let v=[];return {bind(...a){v=a;return this;},async all(){return {results:s.all(...v)};},async first(){return s.get(...v)||null;},async run(){return s.run(...v);}};}};}
const req=(path,body,identity='test-owner',origin='https://test.example')=>new Request('https://test.example'+path,{method:body?'POST':'GET',headers:{...(identity?{'oai-authenticated-user-id':identity}:{}),...(body?{'Content-Type':'application/json','Origin':origin}:{})},...(body?{body:JSON.stringify(body)}:{})});
test('60 ordered lessons, 8 module ranges and 120 valid questions',()=>{
 assert.equal(curriculum.length,60);assert.equal(modules.length,8);assert.equal(new Set(curriculum.map(d=>d.title)).size,60);
 assert.equal(teachingNotes.length,60);assert.equal(practicalChecks.length,60);assert.equal(new Set(curriculum.flatMap(d=>d.questions.map(q=>q.prompt))).size,120);
 for(const [i,d]of curriculum.entries()){assert.equal(d.day,i+1);assert.equal(d.questions.length,2);assert.equal(d.objectives.length,3);assert(d.questions.every(q=>q.options.length===4&&q.answer>=0&&q.answer<4));assert.equal(modules.filter(m=>d.day>=m.start&&d.day<=m.end).length,1);}
 assert(safeCurriculum().every(d=>d.questions.every(q=>!('answer'in q)&&!('explanation'in q))));
});
test('fresh profile has no invented progress or scores',()=>{const s=summarize([]);assert.equal(s.completed,0);assert.equal(s.quizAverage,null);assert.equal(s.streak,0);assert.equal(s.currentDay,1);assert.equal(s.minutes,0);assert.equal(s.activity.length,0);});
test('completion requires passing quiz, objectives, evidence and approved latest submission',async()=>{
 const db=database();for(let index=0;index<3;index++)await mutate(db,'owner',{type:'task',day:1,index,checked:true});
 await mutate(db,'owner',{type:'quiz',day:1,answers:curriculum[0].questions.map(q=>q.answer)});
 assert.equal(summarize(await records(db)).completed,0);
 const sub=await mutate(db,'owner',{type:'submission',day:1,answer:'Implemented task API',evidence:'POST /tasks returned 201; invalid JSON returned 400'});
 assert.equal(summarize(await records(db)).days[0].status,'awaiting_review');
 await mutate(db,'reviewer',{type:'review',day:1,submissionId:sub.id,score:85,approved:true,feedback:'Evidence matches the contract.'});
 assert.equal(summarize(await records(db)).completed,0);
 const review=summarize(await records(db)).days[0].review;
 await mutate(db,'owner',{type:'approval',day:1,reviewId:review.id,approved:true});
 assert.equal(summarize(await records(db)).completed,1);
 await mutate(db,'owner',{type:'submission',day:1,answer:'Revised API',evidence:'New behavior needs review'});
 assert.equal(summarize(await records(db)).completed,0);
 await assert.rejects(mutate(db,'reviewer',{type:'review',day:1,submissionId:sub.id,score:90,approved:true,feedback:'Stale review'}),/latest/);
});
test('server rejects invalid scores, quiz answers, insecure links and injection indices',async()=>{
 const db=database();await assert.rejects(mutate(db,'a',{type:'task',day:1,index:99,checked:true}),/index/);
 await assert.rejects(mutate(db,'a',{type:'quiz',day:1,answers:[0,5]}),/Answer/);
 await assert.rejects(mutate(db,'a',{type:'submission',day:1,answer:'x',evidence:'x',evidenceUrl:'javascript:alert(1)'}),/HTTPS/);
 await assert.rejects(mutate(db,'a',{type:'study',day:61,minutes:20,confidence:3}),/Day/);
 const s=await mutate(db,'a',{type:'submission',day:1,answer:'x',evidence:'x'});
 await assert.rejects(mutate(db,'a',{type:'review',day:1,submissionId:s.id,score:40,approved:true,feedback:'x'}),/at least 70/);
 assert.equal((await records(db)).length,1);
});
test('request IDs deduplicate equivalent writes and reject conflicting reuse',async()=>{
 const db=database(),a={type:'study',day:2,minutes:45,confidence:3,requestId:'example-request-123'};
 await mutate(db,'owner',a);assert.equal((await mutate(db,'owner',a)).deduplicated,true);
 await assert.rejects(mutate(db,'owner',{...a,minutes:60}),/different action/);
 assert.equal(summarize(await records(db)).minutes,45);
});
test('HTTP API requires identity and browser writes require same origin',async()=>{
 const env={DB:database()};assert.equal((await worker.fetch(req('/api/state',null,null),env)).status,401);
 assert.equal((await worker.fetch(req('/api/action',{type:'task',day:1,index:0,checked:true},'owner','https://evil.example'),env)).status,403);
 assert.equal((await worker.fetch(req('/api/action',{type:'task',day:1,index:0,checked:true}),env)).status,200);
 const s=await (await worker.fetch(req('/api/state'),env)).json();assert.equal(s.state.days[0].tasks[0],true);
});
test('MCP lists tools, persists submissions and returns errors for invalid arguments',async()=>{
 const env={DB:database()};const rpc=async(method,params={})=>(await worker.fetch(req('/mcp',{jsonrpc:'2.0',id:1,method,params}),env)).json();
 assert.equal((await rpc('tools/list')).result.tools.length,8);
 assert.equal((await rpc('server/discover')).result.supportedVersions[0],'2026-07-28');
 const sub=await rpc('tools/call',{name:'submit_assignment',arguments:{day:3,answer:'Token experiment',evidence:'Measured sample token counts'}});assert(!sub.result.isError);
 const d=await rpc('tools/call',{name:'get_day_details',arguments:{day:3}});assert.equal(d.result.structuredContent.progress.submissions.length,1);
 const bad=await rpc('tools/call',{name:'update_task_status',arguments:{day:1,index:0,checked:true,admin:true}});assert.equal(bad.result.isError,true);
 const review=await rpc('tools/call',{name:'evaluate_submission',arguments:{day:3,submissionId:sub.result.structuredContent.id,score:80,feedback:'The recorded output supports this suggested score.'}});assert(!review.result.isError);
 const state=await rpc('tools/call',{name:'get_learning_progress'});assert.equal(state.result.structuredContent.days[2].status,'awaiting_approval');
 const forbidden=await rpc('tools/call',{name:'evaluate_submission',arguments:{day:3,submissionId:sub.result.structuredContent.id,score:90,feedback:'Approve',approved:true}});assert.equal(forbidden.result.isError,true);
 assert.equal((await rpc('unknown')).error.code,-32601);
});

test('old final approvals are invalidated by a fresh review',async()=>{
 const db=database();const s=await mutate(db,'owner',{type:'submission',day:2,answer:'API implementation',evidence:'401 returned for missing token'});
 const r=await mutate(db,'reviewer',{type:'review',day:2,submissionId:s.id,score:80,approved:false,feedback:'Good initial evidence'});
 await mutate(db,'owner',{type:'approval',day:2,reviewId:r.id,approved:true});
 await mutate(db,'reviewer',{type:'review',day:2,submissionId:s.id,score:60,approved:false,feedback:'Ownership check is missing'});
 assert.equal(summarize(await records(db)).days[1].approval,null);
 await assert.rejects(mutate(db,'owner',{type:'approval',day:2,reviewId:r.id,approved:true}),/current review/);
});

test('skill ratings stay separate from demonstrated progress and malformed JSON is rejected',async()=>{
 const db=database();await mutate(db,'owner',{type:'skill',module:1,baseline:1,current:3,target:5});
 const s=summarize(await records(db));assert.equal(s.skills[0].current,3);assert.equal(s.completed,0);
 const r=await worker.fetch(new Request('https://test.example/mcp',{method:'POST',headers:{'oai-authenticated-user-id':'owner'},body:'null'}),{DB:db});assert.equal(r.status,400);
});
test('exports reflect persisted records and generated UI has no seeded private data',async()=>{
 const env={DB:database()};await mutate(env.DB,'owner',{type:'study',day:1,minutes:30,confidence:2,notes:'Try <script>evil</script>'});
 const csv=await worker.fetch(req('/api/export?format=csv'),env);assert.equal(csv.status,200);assert((await csv.text()).includes('"30"'));
 const exported=await (await worker.fetch(req('/api/export'),env)).json();assert.equal(exported.records.length,1);
 const page=await worker.fetch(req('/'),env);assert(page.headers.get('Content-Security-Policy').includes('nonce-'));assert(!(await page.text()).includes('<script>evil</script>'));
});

test('specific REST day, week and skills endpoints read the same persisted state',async()=>{
 const env={DB:database()};await mutate(env.DB,'owner',{type:'study',day:8,minutes:50,confidence:4,notes:'Validated tool contracts'});
 const day=await (await worker.fetch(req('/api/days/8'),env)).json();assert.equal(day.progress.minutes,50);
 const week=await (await worker.fetch(req('/api/weeks/2'),env)).json();assert.equal(week.minutes,50);
 const skills=await (await worker.fetch(req('/api/skills'),env)).json();assert.equal(skills.skills.length,8);
 assert.equal((await worker.fetch(req('/api/days/61'),env)).status,400);
});
