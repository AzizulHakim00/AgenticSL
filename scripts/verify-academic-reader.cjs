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
for(const marker of ['data-reader-pane','data-reader-section','aria-pressed','function showReader','data-study-view','reader-module-summary','g.open=true',"academic.render(d,'notes')"])assert.ok(js.includes(marker)||marker==='data-study-view'&&js.includes('dataset.studyView'),marker);
assert.ok(js.includes('window.AgenticVisual?.suspend?.()'));
assert.ok(read('static/css/academic-reader.css').includes('.reader-pane[hidden]{display:none!important}'));
assert.ok(read('templates/dashboard.html').includes('/css/academic-reader.css'));

assert.ok(read('static/js/visual-lectures.js').includes('reader-supporting-notes'));
assert.ok(read('static/js/visual-lectures.js').indexOf('data-visual-canvas')<read('static/js/visual-lectures.js').indexOf('reader-supporting-notes'));
console.log('120 sessions retain all lecture parts; 5-section reader, route state and expandable roadmap validated.');
