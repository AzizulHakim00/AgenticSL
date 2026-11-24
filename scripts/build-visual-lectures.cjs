'use strict';
/* Rebuild the authored static visual lecture bundle. Requires only Node.js. */
const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function generate(course,sources,featuredIds){
 const typeCount={linear:5,cycle:5,guard:5,branch:5,retrieval:6,graph:6,fanout:6};
 const stage={
 linear:["Frame the example's incoming request and acceptance conditions.","Translate inputs to the next typed representation.","Inspect constraints metadata and state at this boundary.","Apply the bounded operation without skipping validation.","Compare the final artifact against the known expected result."],
 cycle:["Define the goal tool budget and safe stop conditions.","Select one permitted action in the illustrated process.","Inspect an external observation instead of guessing its content.","Check the available evidence and whether another action is justified.","Finish when the goal is verified or halt with a documented error."],
 guard:["Receive a proposed action along with authenticated context.","Parse the fields that determine the operation's scope.","Enforce the trust policy independently of the model's wording.","Perform this allowed operation only after permission checks pass.","Block a disallowed operation and record the reason without side effects."],
 branch:["Start with the task and the observable evidence available.","Evaluate the condition used to route between outcomes.","Explain this supported and authorized path.","Explain the alternate missing denied or failure path.","Return an auditable decision with its supporting state."],
 retrieval:["Define the exact information need and source scope.","Collect candidate records while retaining their provenance.","Inspect the first possible supporting passage.","Contrast an incomplete or distracting competing passage.","Check whether the candidate truly entails the claim.","Produce a cited answer or explicitly mark missing support."],
 graph:["Specify the initial state and dependency constraints.","Review the first independent component or branch.","Review the second component or alternate branch.","Check required inputs before taking the next step.","Resolve all validation errors and record state changes.","Report the resulting artifact and reproducible evidence."],
 fanout:["Establish the coordinator's task and permissions.","Split the goal into bounded typed subtasks.","Inspect the first worker's independent contribution.","Inspect the second worker's separate contribution.","Inspect the third worker's contribution with evidence IDs.","Merge only valid results and identify any missing evidence."]
 };
 const rows=sources.flatMap(src=>src.trim().split(/\r?\n/).slice(1).filter(Boolean).map(line=>{
  const p=line.split("|");
  if(p.length!==6)throw Error("Expected 6 columns: "+line);
  return{day:Number(p[0]),kind:p[1].trim(),nodes:p[2].split(",").map(x=>x.trim()),example:p[3].trim(),expected:p[4].trim(),failure:p[5].trim()};
 }));
 if(rows.length!==95)throw Error("Expected 95 authored additions, got "+rows.length);
 const ids=new Set(featuredIds);
 if(ids.size!==25)throw Error("The original 25 lectures must be preserved");
 const output=rows.map(r=>{
  const d=course[r.day-1],{day,kind,nodes,example,expected,failure}=r;
  if(!d||d.day!==day||ids.has(day)||ids.has(String(day))||nodes.length!==typeCount[kind]||!example||!expected||!failure)
   throw Error("Invalid authored visual lecture "+day);
  ids.add(day);
  const first=d.lesson.split(/\n\s*\n/)[0].replace(/\s+/g," ").trim();
  const principle=first.length<130?first+" Academic learning objective: "+d.outcome+".":first;
  const caseStudy="Illustrative classroom case: "+example+". The verified target is: "+expected+". Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.";
  const misconception="Failure investigation: "+failure+". Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.";
  const lab=d.assignment+" Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.";
  const steps=nodes.map((node,i)=>"Stage "+(i+1)+" — "+node+". "+stage[kind][i]+" Scenario: "+example+".");
  const choices=[expected,"Ignore the evidence and report success without verification","Continue even after a stated permission, source, or state validation failure"];
  const rotate=day%3;
  return{day,kind,nodes,principle,caseStudy,misconception,lab,steps,failure,packet:JSON.stringify({case:example,expected,source:"illustrative test fixture"}),check:{question:"In "+d.title+", which outcome demonstrates the intended result?",options:choices.slice(rotate).concat(choices.slice(0,rotate)),correct:(3-rotate)%3}};
 });
 if(ids.size!==120||!course.every(x=>ids.has(x.day)))throw Error("Missing or duplicated day coverage");
 return"/* AgenticSL Visual Lecture 2.1: additional authored scenarios for all 120 sessions. */\nwindow.AgenticVisualData.push(..."+JSON.stringify(output,null,2)+");\n";
}
const sources=['scripts/lecture-scenarios-foundations.tsv','scripts/lecture-scenarios-middle.tsv','scripts/lecture-scenarios-advanced.tsv'].map(read);
const course=JSON.parse(read('spring-app/src/main/resources/curriculum.json')).curriculum.concat(JSON.parse(read('spring-app/src/main/resources/advanced-curriculum.json')).curriculum);
const featured=[...read('spring-app/src/main/resources/static/js/visual-lectures-data.js').matchAll(/"day":\s*(\d+)/g)].map(x=>Number(x[1]));
const bundle=generate(course,sources,featured);
const target=path.join(root,'spring-app/src/main/resources/static/js/visual-lectures-expanded.js');
if(process.argv.includes('--check')){if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==bundle)throw Error('Visual lecture bundle is stale. Run node scripts/build-visual-lectures.cjs');console.log('Generated visual lecture bundle matches 95 authored scenarios.');}
else{fs.writeFileSync(target,bundle);console.log('Wrote '+target+' ('+bundle.length+' bytes).');}
