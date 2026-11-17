import { curriculum, modules } from './curriculum.mjs';
import { renderPage } from './ui.mjs';

export class HttpError extends Error { constructor(status,message){super(message);this.status=status;} }
const fail=(status,message)=>{throw new HttpError(status,message);};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const dayFor=n=>curriculum.find(d=>d.day===n)||fail(400,'Day must be an integer from 1 to 60.');
const str=(v,label,max=12000)=>typeof v==='string'&&v.trim()&&v.length<=max?v.trim():fail(400,`${label} is required and must be at most ${max} characters.`);
const num=(v,min,max,label)=>Number.isInteger(v)&&v>=min&&v<=max?v:fail(400,`${label} must be an integer from ${min} to ${max}.`);
const safeDay=d=>{const {questions,...rest}=d;return {...rest,questions:questions.map(({answer,explanation,...q})=>q)};};
export const safeCurriculum=()=>curriculum.map(safeDay);

export async function records(db){return (await db.prepare('SELECT id,kind,day,payload,actor,created_at FROM learning_records ORDER BY rowid ASC').all()).results.map(r=>({...r,payload:JSON.parse(r.payload)}));}

export function summarize(events){
  const days=curriculum.map(d=>({day:d.day,tasks:[false,false,false],submissions:[],attempts:[],minutes:0,confidence:null,notes:'',review:null,status:'not_started'}));
  const reflections=[];
  const skills=modules.map(m=>({module:m.id,name:m.name,baseline:0,current:0,target:4}));
  for(const e of events){const d=days[e.day-1],p=e.payload;
    if(e.kind==='skill'){Object.assign(skills[p.module-1],p);continue;}
    if(e.kind==='reflection'){reflections.push({...p,id:e.id,at:e.created_at});continue;}
    if(!d)continue;
    if(e.kind==='task')d.tasks[p.index]=p.checked;
    if(e.kind==='submission')d.submissions.push({...p,id:e.id,at:e.created_at});
    if(e.kind==='quiz')d.attempts.push({...p,id:e.id,at:e.created_at});
    if(e.kind==='study'){d.minutes+=p.minutes;d.confidence=p.confidence;d.notes=p.notes;}
    if(e.kind==='review')d.review={...p,id:e.id,at:e.created_at};
    if(e.kind==='approval')d.approval={...p,id:e.id,at:e.created_at};
  }
  for(const d of days){
    const latest=d.submissions.at(-1), best=Math.max(-1,...d.attempts.map(a=>a.score));
    d.quizBest=best<0?null:best;
    d.review=d.review?.submissionId===latest?.id?d.review:null;
    d.approval=d.approval?.reviewId===d.review?.id?d.approval:null;
    d.status=d.tasks.every(Boolean)&&best>=70&&latest&&d.approval?.approved&&d.review.score>=70?'completed':latest?(d.review&&d.review.score<70?'needs_revision':d.approval?.approved?'in_progress':d.review?'awaiting_approval':'awaiting_review'):d.tasks.some(Boolean)||d.attempts.length||d.minutes?'in_progress':'not_started';
  }
  const completed=days.filter(d=>d.status==='completed').length;
  const activeDays=[...new Set(events.filter(e=>['study','submission','quiz','task'].includes(e.kind)).map(e=>new Date(e.created_at).toLocaleDateString('en-CA',{timeZone:'Asia/Dhaka'})))];
  let streak=0;const now=new Date(),today=now.toLocaleDateString('en-CA',{timeZone:'Asia/Dhaka'});
  if(!activeDays.includes(today))now.setUTCDate(now.getUTCDate()-1);
  for(let i=0;i<366;i++){if(!activeDays.includes(now.toLocaleDateString('en-CA',{timeZone:'Asia/Dhaka'})))break;streak++;now.setUTCDate(now.getUTCDate()-1);}
  const scores=days.flatMap(d=>d.attempts.map(a=>a.score));
  return {days,reflections,skills,completed,percent:Math.round(completed/60*100),minutes:days.reduce((n,d)=>n+d.minutes,0),quizAverage:scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):null,streak,currentDay:days.find(d=>d.status!=='completed')?.day||60,
    modules:modules.map(m=>({...m,completed:days.filter(d=>d.day>=m.start&&d.day<=m.end&&d.status==='completed').length,total:m.end-m.start+1})),
    activity:events.slice(-12).reverse().map(e=>({id:e.id,kind:e.kind,day:e.day,at:e.created_at})),
    weakAreas:days.filter(d=>d.quizBest!==null&&d.quizBest<70).map(d=>({day:d.day,title:curriculum[d.day-1].title,score:d.quizBest})),
    updatedAt:events.at(-1)?.created_at||null};
}

export async function mutate(db,actor,input){
  if(!input||typeof input!=='object'||Array.isArray(input))fail(400,'An action object is required.');
  const type=input.type;const d=['reflection','skill'].includes(type)?null:dayFor(input.day);let p;
  if(type==='task'){
    num(input.index,0,2,'Objective index');if(typeof input.checked!=='boolean')fail(400,'checked must be a boolean.');p={index:input.index,checked:input.checked};
  }else if(type==='submission'){
    const evidenceUrl=typeof input.evidenceUrl==='string'?input.evidenceUrl.trim():'';
    if(evidenceUrl){try{const u=new URL(evidenceUrl);if(u.protocol!=='https:')fail(400,'Evidence must use HTTPS.');}catch{fail(400,'Provide a valid HTTPS evidence URL.');}}
    p={answer:str(input.answer,'Implementation explanation'),evidenceUrl,evidence:str(input.evidence,'Implementation evidence (output, tests or code)',20000)};
  }else if(type==='quiz'){
    if(!Array.isArray(input.answers)||input.answers.length!==d.questions.length)fail(400,'Answer both quiz questions.');
    input.answers.forEach(a=>num(a,0,3,'Answer'));
    const results=d.questions.map((q,i)=>({id:q.id,correct:input.answers[i]===q.answer,answer:q.answer,explanation:q.explanation}));
    p={answers:input.answers,score:Math.round(results.filter(q=>q.correct).length/results.length*100),results};
  }else if(type==='study'){
    p={minutes:num(input.minutes,1,720,'Study minutes'),confidence:num(input.confidence,1,5,'Confidence'),notes:typeof input.notes==='string'?input.notes.slice(0,12000):''};
  }else if(type==='skill'){
    p={module:num(input.module,1,8,'Module'),baseline:num(input.baseline,0,5,'Baseline'),current:num(input.current,0,5,'Current level'),target:num(input.target,1,5,'Target')};
  }else if(type==='approval'){
    const state=summarize(await records(db)),r=state.days[d.day-1].review;
    if(!r||input.reviewId!==r.id)fail(409,'Approve the current review of the latest submission.');
    if(typeof input.approved!=='boolean')fail(400,'approved must be a boolean.');
    if(input.approved&&r.score<70)fail(400,'A passing review is required before final approval.');
    p={reviewId:r.id,approved:input.approved};
  }else if(type==='review'){
    const all=await records(db),s=all.filter(e=>e.day===d.day&&e.kind==='submission').at(-1);
    if(!s||input.submissionId!==s.id)fail(409,'Review the latest assignment submission.');
    const score=num(input.score,0,100,'Review score');if(typeof input.approved!=='boolean')fail(400,'approved must be a boolean.');
    if(input.approved&&score<70)fail(400,'Approval requires a score of at least 70.');
    p={submissionId:s.id,score,approved:input.approved,feedback:str(input.feedback,'Review feedback'),reviewer:actor};
  }else if(type==='reflection'){
    p={week:num(input.week,1,9,'Week'),wins:str(input.wins,'What worked'),blockers:str(input.blockers,'What needs work'),next:str(input.next,'Next steps')};
  }else fail(400,'Unknown action.');
  const id=input.requestId||crypto.randomUUID();if(typeof id!=='string'||!/^[a-zA-Z0-9_-]{8,100}$/.test(id))fail(400,'Invalid request ID.');
  const existing=await db.prepare('SELECT kind,day,payload FROM learning_records WHERE id = ?').bind(id).first();
  if(existing){if(existing.kind!==type||existing.day!==(d?.day||0)||existing.payload!==JSON.stringify(p))fail(409,'Request ID already used for a different action.');return {id,deduplicated:true,result:p};}
  try{await db.prepare('INSERT INTO learning_records (id,kind,day,payload,actor,created_at) VALUES (?,?,?,?,?,?)').bind(id,type,d?.day||0,JSON.stringify(p),actor,new Date().toISOString()).run();}
  catch(error){const concurrent=await db.prepare('SELECT kind,day,payload FROM learning_records WHERE id = ?').bind(id).first();if(!concurrent)throw error;if(concurrent.kind!==type||concurrent.day!==(d?.day||0)||concurrent.payload!==JSON.stringify(p))fail(409,'Request ID already used for a different action.');return {id,deduplicated:true,result:p};}
  return {id,result:p};
}

const props={day:{type:'integer',minimum:1,maximum:60}};
const tool=(name,description,properties={},required=[],readOnly=true)=>({name,description,inputSchema:{type:'object',properties,required,additionalProperties:false},annotations:{readOnlyHint:readOnly,destructiveHint:false,idempotentHint:readOnly,openWorldHint:false}});
export const toolList=[
  tool('get_learning_progress','Read the shared personal learning profile, real progress, scores and recent activity.'),
  tool('get_day_details','Read a day’s lesson, tasks, rubric, submissions and quiz history.',props,['day']),
  tool('update_task_status','Record a checked or unchecked learning objective. Does not approve the assignment.',{...props,index:{type:'integer',minimum:0,maximum:2},checked:{type:'boolean'}},['day','index','checked'],false),
  tool('submit_assignment','Save assignment explanation and real implementation evidence for review.',{...props,answer:{type:'string'},evidence:{type:'string'},evidenceUrl:{type:'string'}},['day','answer','evidence'],false),
  tool('submit_quiz','Grade and save two zero-based multiple-choice answers.',{...props,answers:{type:'array',items:{type:'integer',minimum:0,maximum:3},minItems:2,maxItems:2}},['day','answers'],false),
  tool('evaluate_submission','Save suggested scoring and feedback for the latest evidence. Inspect it first. Final approval must be made by the learner in the website. No code is executed.',{...props,submissionId:{type:'string'},score:{type:'integer',minimum:0,maximum:100},feedback:{type:'string'}},['day','submissionId','score','feedback'],false),
  tool('get_skill_report','Compare module completion and quiz performance. No proficiency claims without evidence.'),
  tool('generate_weekly_report','Return evidence, study time, review status, weak concepts and reflections for a week.',{week:{type:'integer',minimum:1,maximum:9}},['week'])
];

async function callTool(db,actor,name,args){
  const definition=toolList.find(t=>t.name===name);if(!definition)fail(400,'Unknown tool.');
  const a=args||{};if(typeof a!=='object'||Array.isArray(a))fail(400,'Arguments must be an object.');
  if(Object.keys(a).some(k=>!Object.hasOwn(definition.inputSchema.properties,k)))fail(400,'Unexpected tool argument.');
  if(definition.inputSchema.required.some(k=>a[k]===undefined))fail(400,'Missing required tool argument.');
  const map={update_task_status:'task',submit_assignment:'submission',submit_quiz:'quiz',evaluate_submission:'review'};
  if(map[name])return mutate(db,actor,{...a,type:map[name],...(name==='evaluate_submission'?{approved:false}:{})});
  const state=summarize(await records(db));
  if(name==='get_learning_progress')return state;
  if(name==='get_day_details')return {lesson:safeDay(dayFor(a.day)),progress:state.days[a.day-1]};
  if(name==='get_skill_report')return {modules:state.modules,skills:state.skills,weakAreas:state.weakAreas,assessment:'Skill levels are self-reported; completion and quiz evidence are indicators, not certification.'};
  const w=num(a.week,1,9,'Week');const days=state.days.filter(d=>d.day>=(w-1)*7+1&&d.day<=w*7);
  return {week:w,days,completed:days.filter(d=>d.status==='completed').length,minutes:days.reduce((s,d)=>s+d.minutes,0),reflections:state.reflections.filter(r=>r.week===w)};
}

async function mcp(request,db,actor){
  const body=await readJson(request),id=body.id??null;
  const result=r=>json({jsonrpc:'2.0',id,result:r});
  if(body.jsonrpc!=='2.0'||typeof body.method!=='string')return json({jsonrpc:'2.0',id,error:{code:-32600,message:'Invalid request'}},400);
  if(body.method==='server/discover')return result({supportedVersions:['2026-07-28'],capabilities:{tools:{}}});
  if(body.method==='initialize')return result({protocolVersion:['2026-07-28','2025-11-25','2025-06-18'].includes(body.params?.protocolVersion)?body.params.protocolVersion:'2025-06-18',serverInfo:{name:'AgenticSL',version:'1.0.0'},capabilities:{tools:{}}});
  if(body.method.startsWith('notifications/'))return new Response(null,{status:202});
  if(body.method==='ping')return result({});
  if(body.method==='tools/list')return result({tools:toolList});
  if(body.method==='tools/call'){
    try{const value=await callTool(db,actor,body.params?.name,body.params?.arguments);return result({content:[{type:'text',text:JSON.stringify(value)}],structuredContent:value});}
    catch(e){if(!(e instanceof HttpError))console.error('MCP storage failure');return result({content:[{type:'text',text:e instanceof HttpError?e.message:'The record could not be read or saved. Try again.'}],isError:true});}
  }
  return json({jsonrpc:'2.0',id,error:{code:-32601,message:'Method not found'}});
}

async function readJson(request){const text=await request.text();if(text.length>150000)fail(413,'Request is too large.');let data;try{data=JSON.parse(text);}catch{fail(400,'Invalid JSON.');}if(!data||typeof data!=='object'||Array.isArray(data))fail(400,'A JSON object is required.');return data;}
const csvCell=v=>'"'+String(v??'').replace(/^[=+@\-\t\r]/,"'$&").replaceAll('"','""')+'"';

export default {
  async fetch(request,env){
    try{
      const url=new URL(request.url);
      if(url.pathname==='/api/health')return json({ok:true,app:'AgenticSL',version:'1.0.0'});
      const actor=request.headers.get('oai-authenticated-user-id');
      if(!actor){if(url.pathname==='/'&&request.method==='GET')return new Response('<!doctype html><title>AgenticSL</title><style>body{background:#111314;color:#eee;font:20px system-ui;padding:12vw}a{color:#c4f06d}</style><h1>Your learning, with evidence.</h1><p>Sign in to your private AgenticSL workspace.</p><a target="_top" href="/signin-with-chatgpt?return_to=%2F">Sign in with ChatGPT →</a>',{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});return json({error:'Sign in to access this learning workspace.'},401);}
      if(url.pathname==='/mcp'){if(request.method!=='POST')return new Response(null,{status:405,headers:{Allow:'POST'}});return await mcp(request,env.DB,actor);}
      if(url.pathname==='/api/action'&&request.method==='POST'){
        if(request.headers.get('Origin')!==url.origin)return json({error:'Same-origin browser requests are required.'},403);
        const r=await mutate(env.DB,actor,await readJson(request));return json({...r,state:summarize(await records(env.DB))});
      }
      if(url.pathname==='/api/state'&&request.method==='GET')return json({hosting:env.PLATFORM||'sites',curriculum:safeCurriculum(),modules,state:summarize(await records(env.DB))});
      if(request.method==='GET'&&/^\/api\/days\/\d+$/.test(url.pathname))return json(await callTool(env.DB,actor,'get_day_details',{day:Number(url.pathname.split('/').at(-1))}));
      if(request.method==='GET'&&/^\/api\/weeks\/\d+$/.test(url.pathname))return json(await callTool(env.DB,actor,'generate_weekly_report',{week:Number(url.pathname.split('/').at(-1))}));
      if(request.method==='GET'&&url.pathname==='/api/skills')return json(await callTool(env.DB,actor,'get_skill_report',{}));
      if(url.pathname==='/api/export'&&request.method==='GET'){
        const events=await records(env.DB),state=summarize(events);
        if(url.searchParams.get('format')==='csv'){
          const rows=[['Day','Lesson','Status','Objectives completed','Best quiz score','Study minutes','Assignment review score'],...state.days.map(d=>[d.day,curriculum[d.day-1].title,d.status,d.tasks.filter(Boolean).length,d.quizBest,d.minutes,d.review?.score])];
          return new Response(rows.map(r=>r.map(csvCell).join(',')).join('\r\n'),{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="AgenticSL-progress.csv"','Cache-Control':'no-store'}});
        }
        return new Response(JSON.stringify({app:'AgenticSL',version:1,exportedAt:new Date().toISOString(),records:events,state},null,2),{headers:{'Content-Type':'application/json','Content-Disposition':'attachment; filename="AgenticSL-learning-records.json"','Cache-Control':'no-store'}});
      }
      if(url.pathname==='/'&&request.method==='GET'){
        const nonce=crypto.randomUUID().replaceAll('-','');
        return new Response(renderPage(nonce,env.PLATFORM||'sites'),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','Content-Security-Policy':`default-src 'self'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'self'`}});
      }
      return json({error:'Not found'},404);
    }catch(e){if(!(e instanceof HttpError))console.error('AgenticSL request failed');return json({error:e instanceof HttpError?e.message:'Could not read or save your learning records. Please retry.'},e instanceof HttpError?e.status:500);}
  }
};
