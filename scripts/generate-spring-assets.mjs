import {mkdir,writeFile} from 'node:fs/promises';
import {curriculum,modules} from '../src/curriculum.mjs';
import {renderPage} from '../src/ui.mjs';
const base=new URL('../spring-app/src/main/resources/',import.meta.url);
for(const name of ['templates','static/css','static/js'])await mkdir(new URL(name+'/',base),{recursive:true});
await writeFile(new URL('curriculum.json',base),JSON.stringify({curriculum,modules},null,2));
let html=renderPage('unused','spring');
const css=html.match(/<style>([\s\S]*?)<\/style>/)[1];
let script=html.match(/<script nonce="unused">([\s\S]*?)<\/script>/)[1];
script=script.replace("  let data=null,view=", "  const api=location.pathname==='/demo'?'/api/demo':'/api';\n  let data=null,view=")
  .replace("fetch('/api/state')","fetch(api+'/state')")
  .replace("fetch('/api/action',","fetch(api+'/action',")
  .replaceAll("{'Content-Type':'application/json'}","{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=\"_csrf\"]').content}")
  .replace('GitHub commit, notebook or demo URL (optional)','Your pull request to the approved learner branch')
  .replace('and your final approval of the latest reviewed assignment with a score of 70 or more.','and admin approval of the latest assignment after a passing review and a merged pull request.')
  .replace('id="evidenceUrl" type="url"','id="evidenceUrl" required type="url"')
  .replace("function connections(){if(data.hosting", "function connections(){if(data.hosting==='spring')return springConnections();if(data.hosting");
const start=script.indexOf('  function review(d,p)'),end=script.indexOf('  function assessments(',start);
script=script.slice(0,start)+`  function review(d,p){return section('Admin review and feedback',\`<p>Your admin reviews the latest submitted commit and confirms the PR is merged into your learner branch before final approval. Changing the submission requires a new review.</p>\${p.review?\`<div class="score">\${p.review.score} / 100</div>\${pill(p.review.approved?'Approved by admin':'Needs review',p.review.approved)}<div class="callout">\${esc(p.review.feedback)}</div>\`:'<div class="empty"><b>Awaiting admin review.</b>Submit a pull request and implementation evidence to get feedback.</div>'}\${data.viewer.admin?'<a class="btn primary" href="/admin">Open admin review panel</a>':''}\`)+submissionHistory(p);}
  function springConnections(){return heading('Your learning workflow','GitHub submissions, deterministic quiz grading and reviewable feedback.')+section('Your repository',\`<p>Fork the official repository, clone your fork and create your assignment branch. Submit a PR to <strong>\${esc(data.enrollment.branch||'your approved learner branch')}</strong>. Main is reserved for platform administration.</p><a class="btn" href="https://github.com/\${esc(data.repository)}" target="_blank" rel="noopener noreferrer">Open official repository</a>\`)+section('Review with any ChatGPT account','<p>Export your records and share relevant evidence for manual ChatGPT feedback. Your admin records the score and final approval here. Automatic paid AI grading and direct ChatGPT MCP synchronization are not enabled.</p><div class="row wrap"><a class="btn" href="'+api+'/export">Export learning record</a><a class="btn" href="'+api+'/export?format=csv">Export progress CSV</a></div>');}
`+script.slice(end);
script=script.replace('    bindForms();',`    document.querySelectorAll('a[href^="/api/export"]').forEach(a=>a.setAttribute('href',api+a.getAttribute('href').slice(4)));
    if(data.viewer){$('.side-profile strong').textContent=data.viewer.login;$('.avatar').textContent=data.viewer.login.slice(0,2).toUpperCase();}
    $('#admin-link')?.remove();if(data.viewer?.admin)$('.side-bottom').insertAdjacentHTML('afterbegin','<a id="admin-link" class="btn full" href="/admin">Admin console</a>');
    if(!data.viewer?.demo&&!data.viewer?.admin&&data.enrollment?.status!=='APPROVED'){
      $('#page').insertAdjacentHTML('afterbegin','<div class="callout"><strong>Participation: '+esc(data.enrollment.status.toLowerCase().replaceAll('_',' '))+'</strong><br>Review the roadmap while your participation is approved. '+(data.enrollment.status==='PENDING'?'Your request is waiting for the admin.':'<button class="btn small" id="request-access">Request participation</button>')+'</div>');
      document.querySelectorAll('button[type=submit], [data-task]').forEach(b=>b.disabled=true);
      $('#request-access')?.addEventListener('click',async()=>{try{const r=await fetch('/api/enrollment',{method:'POST',headers:{'X-CSRF-TOKEN':document.querySelector('meta[name="_csrf"]').content}});if(!r.ok)throw Error('Participation request failed.');await load();render();}catch(e){toast(e.message,true);}});
    }
    bindForms();`);
html=html.replace('<html lang="en">','<html lang="en" xmlns:th="http://www.thymeleaf.org">')
  .replace('<head>','<head><meta name="_csrf" th:content="${_csrf.token}">')
  .replace(/<style>[\s\S]*?<\/style>/,'<link rel="stylesheet" href="/css/app.css">')
  .replace(/<script nonce="unused">[\s\S]*?<\/script>/,'<script src="/js/learning.js" defer></script>')
  .replace('<span class="private">Private workspace</span>','<span class="private" th:text="${demo ? \'Demo sandbox\' : \'Private workspace\'}">Workspace</span><a href="/" class="text-link">Home</a><form th:if="${!demo}" th:action="@{/logout}" method="post"><button class="btn small">Sign out</button></form>')
  .replace('<div class="content" id="page">','<div class="callout" style="margin:15px 20px" th:if="${demo}"><strong>Demo sandbox</strong> · Explore lessons, quizzes and submissions. This session is isolated and temporary. It does not enrol you or create real GitHub approvals.</div><div class="content" id="page">');
await writeFile(new URL('static/css/app.css',base),css);
await writeFile(new URL('static/js/learning.js',base),script);
await writeFile(new URL('templates/dashboard.html',base),html);
console.log('Generated Java curriculum and dashboard resources. No learning records included.');
