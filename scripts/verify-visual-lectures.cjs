/* No-install offline validation for AgenticSL visual classroom. */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const base='spring-app/src/main/resources/static/';
const academic=JSON.parse(read('spring-app/src/main/resources/curriculum.json'));
const advanced=JSON.parse(read('spring-app/src/main/resources/advanced-curriculum.json'));
const days=academic.curriculum.concat(advanced.curriculum);
const sandbox={
 window:{matchMedia:()=>({matches:false}),setInterval,clearInterval,print:()=>{}},
 document:{addEventListener:()=>{},getElementById:()=>null,body:{classList:{remove:()=>{},toggle:()=>{}}}},
 console,Date,Map,Set,String,Number
};
vm.createContext(sandbox);
vm.runInContext(read(base+'js/visual-lectures-data.js'),sandbox,{timeout:1000});
vm.runInContext(read(base+'js/visual-lectures.js'),sandbox,{timeout:1000});
const config=sandbox.window.AgenticVisualData;
const ui=sandbox.window.AgenticVisual;
assert.equal(config.length,25,'Exactly 25 curated visual lectures');
assert.equal(ui.count,25);
assert.equal(new Set(config.map(d=>d.day)).size,25,'Unique lesson IDs');
assert.equal(new Set(config.map(d=>days[d.day-1].module)).size,16,'All 16 modules are represented');
assert.ok(new Set(config.map(d=>d.kind)).size>=7,'At least 7 diagram topologies');
let checks=0;
for(const d of config){
 assert.equal(days[d.day-1].day,d.day,'Preserve original day IDs');
 assert.ok(d.principle.length>=80&&d.caseStudy.length>=80&&d.misconception.length>=80);
 assert.ok(d.steps.length===d.nodes.length);
 assert.ok(d.check.options.length===3&&d.check.options[d.check.correct]);
 assert.ok(d.packet.length>10);
 const out=ui.render(days[d.day-1]);
 assert.match(out,/data-visual-next/);
 assert.match(out,/data-visual-mode/);
 assert.match(out,/data-visual-play/);
 assert.match(out,/data-visual-focus/);
 assert.match(out,/visual-note-grid/);
 assert.match(out,/visual-transcript/);
 assert.match(out,/UN GRADED|UNGRADED/);
 assert.ok(!out.includes('<script'),'No executable tags in user-facing diagram');
 const regular=ui.preview(d.day,0,'success'),fail=ui.preview(d.day,100,'failure');
 assert.match(regular,/<svg /);
 assert.match(regular,/role="img"/);
 assert.match(regular,/visual-node-active/);
 assert.match(fail,/visual-node-error|visual-node-active/);
 assert.ok(regular.includes('visual-edge'),'Real connections are present');
 if(d.kind==='guard'||d.kind==='branch') assert.notEqual(regular,fail,'Failure path branches to different node');
 checks++;
}
assert.equal(ui.render(days[1]),'','Ordinary lessons remain unchanged');
assert.equal(ui.preview(999),'');
const dashboard=read('spring-app/src/main/resources/templates/dashboard.html');
const order=[
 '/js/visual-lectures-data.js','/js/visual-lectures.js','/js/academic-lessons.js','/js/learning.js'
].map(v=>dashboard.indexOf(v));
assert.ok(order.every(v=>v>0)&&order.every((v,i)=>i===0||v>order[i-1]),'Load visual scripts in dependency order');
assert.ok(dashboard.includes('/css/visual-lectures.css'));
assert.ok(read(base+'js/academic-lessons.js').includes('window.AgenticVisual.render(d)'));
assert.ok(read(base+'js/learning.js').includes('window.AgenticVisual.mount()'));
const css=read(base+'css/visual-lectures.css');
assert.ok(css.includes('prefers-reduced-motion')&&css.includes('@media print'));
assert.ok(css.includes('lecture-focus')&&css.includes('visual-transcript'));
console.log('25 curated lectures verified across 16 modules, 7 graph types and '+checks+' accessible simulation views.');
