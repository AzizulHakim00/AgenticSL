/* Textbook figure atlas: original semantic HTML and vector iconography. */
(function(){
'use strict';
const figures=new Map((window.AgenticFigureData||[]).map(f=>[f.module,f]));
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={
 user:'<circle cx="12" cy="7" r="3"/><path d="M5 20v-2a7 7 0 0 1 14 0v2"/>',
 data:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
 graph:'<rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v5H5v5M12 12h7v5"/>',
 check:'<path d="M12 2 3 6v6c0 5 5 8 9 10 4-2 9-5 9-10V6zM8 12l3 3 5-6"/>',
 search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
 file:'<path d="M5 2h9l5 5v15H5zM14 2v6h5M8 12h8M8 16h8"/>',
 tool:'<path d="M14 6a5 5 0 0 0-6 6L2 18l4 4 6-6a5 5 0 0 0 6-6l-4 2-2-2z"/>',
 model:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h6v6H9zM8 1v3m8-3v3M8 20v3m8-3v3M1 8h3m-3 8h3m16-8h3m-3 8h3"/>',
 chart:'<path d="M3 3v18h18M7 16v-4M12 16V8M17 16V5"/>',
 loop:'<path d="M20 8a8 8 0 1 0 0 8M20 3v5h-5M20 21v-5h-5"/>',
 network:'<circle cx="12" cy="4" r="3"/><circle cx="4" cy="18" r="3"/><circle cx="20" cy="18" r="3"/><path d="m10 7-5 8m9-8 5 8M7 18h10"/>'
};
function icon(label){
 const s=label.toLowerCase();
 const type=/verify|validat|check|authoriz|consent|approve|permit|policy|security|scope|denied|risk/.test(s)?'check':/query|retriev|search|evidence/.test(s)?'search':/index|store|database|checkpoint|persist|memory|cache/.test(s)?'data':/graph|plan|coordinat|route|workflow|depend/.test(s)?'graph':/retry|recover|loop|repeat|restart|resume/.test(s)?'loop':/model|llm|token|transform|decod|agent configuration/.test(s)?'model':/tool|execut|worker|implement|action/.test(s)?'tool':/metric|score|grade|evaluat|benchmark|monitor|analy/.test(s)?'chart':/user|client|host|caller|identity/.test(s)?'user':/connect|network|transport|server|queue/.test(s)?'network':'file';
 return '<svg class="atlas-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[type]+'</svg>';
}
const arrow='<span class="atlas-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2v19m-6-6 6 6 6-6"/></svg></span>';
function node(s,extra=''){return '<div class="atlas-node '+extra+'">'+icon(s.label)+'<div><strong>'+e(s.label)+'</strong><small>'+e(s.detail)+'</small></div></div>';}
function branch(items){return '<div class="atlas-branch">'+items.map(s=>node(s)).join('')+'</div>';}
function lane(f,c,i){
 let content='';
 if(f.module===13&&i===2){
  content=branch(c.steps.slice(0,2))+arrow+node(c.steps[2])+arrow+node(c.steps[3]);
 }else if(f.module===10&&i===2){
  content=node(c.steps[0],'atlas-prep')+'<div class="atlas-phase">Query time · prebuilt index</div>'+node(c.steps[1])+arrow+
  branch([{label:'Local search',detail:'Entities, linked graph context and text chunks'},{label:'Global search',detail:'Community reports; map and reduce'}])+arrow+node(c.steps[c.steps.length-1]);
 }else if(f.module===6&&i===1){
  content=node(c.steps[0])+arrow+node(c.steps[1])+arrow+
  branch([{label:'Research',detail:'Source evidence'},{label:'Analysis',detail:'Check data'},{label:'Review',detail:'Check claims'}])+arrow+node(c.steps[3]);
 }else if(f.module===12&&i===1){
  content=node(c.steps[0])+arrow+branch([{label:'Tools',detail:'Callable operations'},{label:'Resources',detail:'Context data'},{label:'Prompts',detail:'Reusable templates'}])+arrow+node(c.steps[2])+arrow+node(c.steps[3]);
 }else{
  content=c.steps.map((s,n)=>{
   const prep=f.module===10&&n===0;
   const prefix=n===0?'':(c.mode==='options'?'':(f.module===10&&n===1?'<div class="atlas-phase">Query time · prebuilt index</div>':arrow));
   return prefix+node(s,prep?'atlas-prep':'');
  }).join('');
 }
 const loop=(f.module===3&&i===2)?'Observation → next action if needed':(f.module===9&&i===0)?'Observation → next decision':(f.module===9&&i===1)?'Failed check → replan':(f.module===9&&i===2)?'Feedback memory → next trial':(f.module===10&&i===1)?'Insufficient evidence → replan / retrieve':(f.module===6&&i===2)?'Review → delegate again if needed':(f.module===11&&i===2)?'New observation → next action':(f.module===15&&i===2)?'Retry → check committed effects first':'';
 return '<section class="atlas-lane atlas-tone-'+i+'" aria-label="'+e(c.name)+'"><h4>'+e(c.name)+'</h4><div class="atlas-tag">'+e(c.tag)+'</div><div class="atlas-flow">'+content+'</div>'+(loop?'<div class="atlas-loop">'+icon('retry')+'<span>'+e(loop)+'</span></div>':'')+'</section>';
}
function render(module,day){
 const f=figures.get(Number(module));if(!f)return '';
 const isRoadmap=day===undefined,open=!isRoadmap&&f.days.includes(Number(day));
 const n=String(f.module).padStart(2,'0');
 const source=f.sources.filter(url=>/^https:\/\//.test(url)).map((url,i)=>'<a href="'+e(url)+'" target="_blank" rel="noopener noreferrer">Reference '+(i+1)+' · '+e(new URL(url).hostname.replace(/^www\./,''))+'</a>').join('');
 return '<details class="atlas-figure '+(isRoadmap?'atlas-roadmap':'atlas-lesson')+'" data-academic-figure="'+f.module+'"'+(open?' open':'')+'><summary><span class="atlas-summary-icon">'+icon('graph')+'</span><span><small>MODULE '+n+' · ACADEMIC FIGURE</small><strong>'+e(f.title)+'</strong></span><span class="atlas-disclosure" aria-hidden="true">⌄</span></summary><figure class="atlas-paper"><header class="atlas-title"><span>AGENTICSL · CONCEPT ATLAS / '+n+'</span><h3>'+e(f.title)+'</h3><p>'+e(f.intro)+'</p></header>'+(f.module===12?'<div class="atlas-crosslink">MCP host contains client · client ↔ server · separate A2A agent endpoint</div>':'')+(f.module===4?'<div class="atlas-crosslink">Offline index → online retrieval → grounded generation</div>':'')+'<div class="atlas-columns">'+f.columns.map((c,i)=>lane(f,c,i)).join('')+'</div><figcaption><strong>Figure '+n+'. '+e(f.title)+'.</strong> '+e(f.caption)+' <span>Original AgenticSL teaching illustration; simplified conceptual architecture.</span></figcaption><div class="atlas-sources"><strong>Further reading</strong>'+source+'</div></figure></details>';
}
window.AgenticFigures={render,count:figures.size};
})();
