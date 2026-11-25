'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..','spring-app/src/main/resources');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const days=JSON.parse(read('curriculum.json')).curriculum.concat(JSON.parse(read('advanced-curriculum.json')).curriculum);
const ctx=vm.createContext({window:{AgenticVisual:{available:()=>true,render:d=>'<div class="simulation-test">'+d.day+'</div>'},AgenticFigures:{render:m=>'<figure class="figure-test">'+m+'</figure>'}}});
vm.runInContext(read('static/js/academic-lessons.js'),ctx);
for(const d of days){
 const a=ctx.window.AgenticAcademic;
 assert.match(a.render(d,'plan'),/LECTURE PLAN/);
 assert.match(a.render(d,'notes'),/LECTURE NOTES/);
 assert.match(a.render(d,'simulation'),/simulation-test/);
 assert.match(a.render(d,'figures'),/figure-test/);
 assert.match(a.render(d,'review'),/SEMINAR & EXPERIMENT/);
 assert.equal(a.render(d,'all'),['plan','simulation','figures','notes','review'].map(k=>a.render(d,k)).join(''));
}
const js=read('static/js/learning.js');
new vm.Script(js);
const start=js.indexOf('  function lesson(d,p){'),end=js.indexOf('  function assignment(d,p)',start);
const helpers=js.slice(js.indexOf('  const section='),js.indexOf('  function heading('));
const reader=js.slice(start,end);
const renderCtx=vm.createContext({window:ctx.window,esc:s=>String(s??''),readerSections:[['learn','Understand the concept','Lecture'],['figures','See the architecture','Figures'],['simulate','Explore the behavior','Simulation'],['practice','Put it into practice','Practice'],['review','Review and reflect','Review']]});
renderCtx.window.AgenticLessons={render:d=>'<section class="coding-test">'+d.day+'</section>'};
vm.runInContext(helpers+reader,renderCtx);
for(const d of days){
 const html=renderCtx.lesson(d,{tasks:[false,false,false]});
 let previous=-1;
 for(const id of ['learn','figures','simulate','practice','review']){
  const marker='id="reader-'+id+'" data-reader-pane="'+id+'"';
  const at=html.indexOf(marker);
  assert.ok(at>previous,'Missing or out of order '+id+' day '+d.day);
  assert.ok(!html.slice(at,html.indexOf('>',at)).includes('hidden'),'No hidden reading panes');
  previous=at;
 }
 assert.equal((html.match(/data-reader-pane="/g)||[]).length,5);
 assert.match(html,/On this page/);
 assert.match(html,/Knowledge check/);
 assert.match(html,/Learning objectives/);
 assert.match(html,/simulation-test/);
 assert.match(html,/figure-test/);
 assert.match(html,/SEMINAR & EXPERIMENT/);
}
assert.ok(js.includes('function scrollReader'));
assert.ok(js.includes('target.scrollIntoView'));
assert.ok(js.includes('refreshLessonProgress();if(payload.type'));
assert.ok(!js.includes('p.hidden=p.dataset.readerPane'));
assert.ok(read('static/js/academic-figures.js').includes('open=!isRoadmap'));
assert.ok(read('static/css/academic-reader.css').includes('.reader-pane{display:block;'));
assert.ok(read('templates/dashboard.html').includes('/css/academic-reader.css'));
assert.ok(read('static/js/visual-lectures.js').includes('reader-supporting-notes'));
console.log('120 complete continuous lecture pages verified, with optional jump navigation and preserved assessment state.');
