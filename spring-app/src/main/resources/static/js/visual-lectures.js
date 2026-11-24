/* AgenticSL Visual Lecture 2.0: deterministic, offline, no paid APIs. */
(function () {
  'use strict';
  const catalogue = Array.isArray(window.AgenticVisualData) ? window.AgenticVisualData : [];
  const lessons = new Map(catalogue.map(item => [item.day, item]));
  const html = text => String(text ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[ch]);
  const positions = {
    linear: [[100,170],[285,170],[470,170],[655,170],[840,170]],
    guard: [[110,170],[322,170],[535,170],[805,92],[805,260]],
    cycle: [[105,155],[292,155],[479,155],[675,155],[479,287]],
    retrieval: [[90,180],[260,180],[450,88],[450,270],[652,180],[852,180]],
    graph: [[105,175],[305,95],[305,266],[552,95],[552,266],[832,175]],
    branch: [[105,175],[330,175],[630,95],[630,267],[842,175]],
    fanout: [[95,175],[278,175],[505,67],[505,175],[505,285],[840,175]]
  };
  const edges = {
    linear: [[0,1],[1,2],[2,3],[3,4]],
    guard: [[0,1],[1,2],[2,3],[2,4]],
    cycle: [[0,1],[1,2],[2,3],[3,4],[4,1]],
    retrieval: [[0,1],[1,2],[1,3],[2,4],[3,4],[4,5]],
    graph: [[0,1],[0,2],[1,3],[2,4],[3,5],[4,5]],
    branch: [[0,1],[1,2],[1,3],[2,4],[3,4]],
    fanout: [[0,1],[1,2],[1,3],[1,4],[2,5],[3,5],[4,5]]
  };
  let current = null;
  const prefersReducedMotion = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  function route(lesson, failure) {
    if (lesson.kind === 'guard') return failure ? [0,1,2,4] : [0,1,2,3];
    if (lesson.kind === 'branch') return failure ? [0,1,3,4] : [0,1,2,4];
    return lesson.nodes.map((_, i) => i);
  }
  function figure(lesson, frame, mode) {
    const layout = positions[lesson.kind], arc = edges[lesson.kind], seq = route(lesson, mode === 'failure');
    if (!layout || layout.length !== lesson.nodes.length) return '';
    const active = seq[frame];
    const earlier = new Set(seq.slice(0, frame + 1));
    const id = 'v-arrow-' + lesson.day;
    const arrows = arc.map(([a,b]) => {
      const [x1,y1] = layout[a], [x2,y2] = layout[b];
      const dx=x2-x1, dy=y2-y1, span=Math.sqrt(dx*dx+dy*dy) || 1;
      const fromX=x1+dx/span*79,fromY=y1+dy/span*37,
            toX=x2-dx/span*81,toY=y2-dy/span*38;
      const seen = earlier.has(a) && earlier.has(b) &&
        seq.indexOf(a) >= 0 && seq.indexOf(b) > seq.indexOf(a);
      const highlighted = seen ? ' visual-edge-seen' : '';
      let d='M '+fromX+' '+fromY+' L '+toX+' '+toY;
      if(lesson.kind === 'cycle' && a===4 && b===1)
        d='M 409 287 C 230 328, 205 257, 250 198';
      let label='';
      if ((lesson.kind==='guard'||lesson.kind==='branch') && a===2 && (b===3||b===4) ||
          lesson.kind==='branch' && a===1 && (b===2||b===3)) {
        if (lesson.kind==='guard' && a===2)
          label='<text x="668" y="'+(b===3?99:255)+'" class="visual-edge-tag">'+(b===3?'valid':'denied')+'</text>';
        if (lesson.kind==='branch' && a===1)
          label='<text x="467" y="'+(b===2?101:253)+'" class="visual-edge-tag">'+(b===2?'supported':'missing')+'</text>';
      }
      return '<path class="visual-edge'+highlighted+'" d="'+d+'" marker-end="url(#'+id+')" />'+label;
    }).join('');
    const cards=layout.map(([x,y],i)=>{
      const label=lesson.nodes[i].trim();
      const words=label.split(/\s+/),lines=[''];
      for(const word of words){
        const last=lines.length-1;
        if((lines[last]+' '+word).trim().length>17 && lines[last]) lines.push(word);
        else lines[last]=(lines[last]+' '+word).trim();
      }
      const coords=lines.slice(0,3).map((word,j)=>'<text x="'+x+'" y="'+(y+(j-(Math.min(lines.length,3)-1)/2)*18+5)+'" text-anchor="middle" class="visual-node-text">'+html(word)+'</text>').join('');
      const className='visual-node'+(i===active?' visual-node-active':'')+
        (earlier.has(i)&&i!==active?' visual-node-complete':'')+
        (mode==='failure' && frame===seq.length-1 && i===active?' visual-node-error':'');
      return '<g class="'+className+'"><rect x="'+(x-75)+'" y="'+(y-38)+'" width="150" height="76" rx="13" />'+
        '<text x="'+(x-59)+'" y="'+(y-21)+'" class="visual-node-index">'+String(i+1).padStart(2,'0')+'</text>'+coords+'</g>';
    }).join('');
    return '<svg viewBox="0 0 960 355" role="img" aria-label="'+html(lesson.nodes.join(' then '))+'" class="visual-svg">'+
      '<defs><marker id="'+id+'" markerWidth="8" markerHeight="8" refX="6.3" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6" class="visual-arrowhead" /></marker></defs>'+
      arrows+cards+'</svg>';
  }
  function render(day) {
    const lesson=lessons.get(Number(day.day));
    if(!lesson) return '';
    const terms=lesson.nodes.slice(0,5).map(x=>'<span>'+html(x)+'</span>').join('');
    const choices=lesson.check.options.map((x,i)=>
      '<button type="button" class="visual-choice" data-visual-choice="'+i+'">'+html(x)+'</button>').join('');
    return '<section class="visual-lecture panel" id="visual-lecture" data-visual-day="'+lesson.day+'" aria-label="Interactive visual lecture">'+
      '<header class="visual-head"><div><span class="eyebrow">VISUAL LECTURE 2.0 · CONCEPT STUDIO</span><h3>'+html(day.title)+'</h3>'+
      '<p>Walk through an evidence-based example and compare the successful and failure paths. This is a deterministic teaching simulation, not a live model call.</p></div>'+
      '<div class="visual-header-actions"><button type="button" class="btn small" data-visual-focus aria-pressed="false">Focus for 25 min</button>'+
      '<button type="button" class="btn small" data-visual-print>Print notes</button></div></header>'+
      '<div class="visual-note-grid"><article><span>01 · PRINCIPLE</span><h4>Understand the mechanism</h4><p>'+html(lesson.principle)+'</p></article>'+
      '<article><span>02 · WORKED CASE</span><h4>What happens in practice?</h4><p>'+html(lesson.caseStudy)+'</p></article>'+
      '<article><span>03 · COMMON MISTAKE</span><h4>Check your assumptions</h4><p>'+html(lesson.misconception)+'</p></article>'+
      '<article><span>04 · IMPLEMENTATION</span><h4>Try this in your lab</h4><p>'+html(lesson.lab)+'</p></article></div>'+
      '<div class="visual-heading"><div><span class="eyebrow">SYSTEM BEHAVIOR · INTERACTIVE DIAGRAM</span><h4>Follow a real engineering decision</h4></div>'+
      '<label class="visual-select-label">Simulation path <select data-visual-mode aria-label="Choose simulation scenario"><option value="success">Successful flow</option><option value="failure">Failure / rejection</option></select></label></div>'+
      '<figure class="visual-figure"><div class="visual-canvas" data-visual-canvas></div>'+
      '<figcaption>Conceptual architecture with topic-specific routing. Highlighted nodes show the currently explained stage. No actual APIs are called.</figcaption></figure>'+'<details class="visual-transcript"><summary>Read the complete walkthrough as text</summary><ol>'+lesson.steps.map((step,i)=>'<li><strong>'+html(lesson.nodes[i])+'</strong>: '+html(step)+'</li>').join('')+'</ol><p><strong>Failure scenario:</strong> '+html(lesson.failure)+'</p></details>'+
      '<div class="visual-controls"><button type="button" class="btn small" data-visual-back>Previous</button>'+
      '<button type="button" class="btn primary small" data-visual-next>Next step →</button>'+
      '<button type="button" class="btn small" data-visual-play>▶ Play</button>'+
      '<button type="button" class="btn small" data-visual-reset>Reset</button>'+
      '<span class="visual-step-count" data-visual-count aria-live="polite">Step 1</span></div>'+
      '<div class="visual-explanation" aria-live="polite" aria-atomic="true"><span data-visual-status class="eyebrow">OBSERVATION</span>'+
      '<h4 data-visual-title></h4><p data-visual-detail></p><pre data-visual-packet></pre></div>'+
      '<div class="visual-terms"><strong>Key components</strong><div>'+terms+'</div></div>'+
      '<div class="visual-knowledge"><span class="eyebrow">LECTURE CHECK · UNGRADED</span><h4>Can you explain the decision?</h4>'+
      '<p>'+html(lesson.check.question)+'</p><div class="visual-options" role="group" aria-label="Quick lecture question">'+choices+'</div>'+
      '<div data-visual-answer role="status" aria-live="polite" class="visual-answer"></div>'+
      '<small>This checks your understanding locally. Your official quiz score and learning-completion rules are unchanged.</small></div>'+
      '<div class="visual-focus-strip" data-visual-timer hidden>Focus session: <strong data-visual-clock>25:00</strong> · Not automatically logged as study time</div>'+
      '</section>';
  }
  function killTimers(){
    if(!current)return;
    if(current.playTimer)window.clearInterval(current.playTimer);
    if(current.focusTimer)window.clearInterval(current.focusTimer);
    current.playTimer=null;current.focusTimer=null;
  }
  function mount(){
    killTimers();
    document.body.classList.remove('lecture-focus');
    const root=document.getElementById('visual-lecture');
    if(!root){current=null;return;}
    const lesson=lessons.get(Number(root.dataset.visualDay));
    if(!lesson){current=null;return;}
    current={root,lesson,step:0,mode:'success',playTimer:null,focusTimer:null,remaining:25*60};
    update();
  }
  function update(){
    if(!current || !current.root.isConnected)return;
    const s=current,l=s.lesson,seq=route(l,s.mode==='failure'),step=Math.min(seq.length-1,s.step);
    s.step=step;
    const at=seq[step],finished=step===seq.length-1,failed=s.mode==='failure'&&finished;
    const canvas=s.root.querySelector('[data-visual-canvas]');
    if(canvas)canvas.innerHTML=figure(l,step,s.mode);
    s.root.querySelector('[data-visual-status]').textContent=failed?'REJECTED / RECOVERY REQUIRED':finished?'VERIFIED OUTPUT':'OBSERVATION '+(step+1);
    s.root.querySelector('[data-visual-title]').textContent=l.nodes[at];
    s.root.querySelector('[data-visual-detail]').textContent=failed?l.failure:l.steps[at];
    const example={stage:l.nodes[at],simulation:s.mode,step:step+1,status:failed?'rejected':finished?'verified':'in_progress',example:l.packet};
    s.root.querySelector('[data-visual-packet]').textContent=JSON.stringify(example,null,2);
    s.root.querySelector('[data-visual-count]').textContent='Step '+(step+1)+' of '+seq.length;
    s.root.querySelector('[data-visual-back]').disabled=step===0;
    s.root.querySelector('[data-visual-next]').disabled=finished;
    s.root.querySelector('[data-visual-play]').textContent=s.playTimer?'Ⅱ Pause':'▶ Play';
  }
  function pause(){
    if(current?.playTimer){window.clearInterval(current.playTimer);current.playTimer=null;}
  }
  function advance(increment){
    if(!current)return;
    const count=route(current.lesson,current.mode==='failure').length;
    current.step=Math.max(0,Math.min(count-1,current.step+increment));
    if(current.step>=count-1)pause();
    update();
  }
  function play(){
    if(!current)return;
    if(current.playTimer){pause();update();return;}
    const count=route(current.lesson,current.mode==='failure').length;
    if(current.step===count-1)current.step=0;
    current.playTimer=window.setInterval(()=>advance(1),prefersReducedMotion()?3200:2500);
    update();
  }
  function setScenario(mode){
    if(!current)return;
    pause();current.mode=mode==='failure'?'failure':'success';current.step=0;update();
  }
  function clock(){
    if(!current)return;
    const clockElement=current.root.querySelector('[data-visual-clock]');
    if(!clockElement)return;
    const mm=Math.floor(current.remaining/60),ss=current.remaining%60;
    clockElement.textContent=String(mm).padStart(2,'0')+':'+String(ss).padStart(2,'0');
  }
  function focus(){
    if(!current)return;
    const start=!document.body.classList.contains('lecture-focus');
    document.body.classList.toggle('lecture-focus',start);
    const button=current.root.querySelector('[data-visual-focus]');
    button.textContent=start?'Exit focus':'Focus for 25 min';
    button.setAttribute('aria-pressed',String(start));
    const strip=current.root.querySelector('[data-visual-timer]');
    strip.hidden=!start;
    if(current.focusTimer){window.clearInterval(current.focusTimer);current.focusTimer=null;}
    if(start){
      current.remaining=25*60;current.focusEndsAt=Date.now()+25*60*1000;clock();
      const s=current;
      s.focusTimer=window.setInterval(()=>{
        if(!s.root.isConnected){window.clearInterval(s.focusTimer);return;}
        s.remaining=Math.max(0,Math.ceil((s.focusEndsAt-Date.now())/1000));clock();
        if(s.remaining===0){
          window.clearInterval(s.focusTimer);s.focusTimer=null;
          strip.textContent='Focus session finished. Log time manually if you studied.';
        }
      },1000);
      current.root.scrollIntoView({behavior:prefersReducedMotion()?'auto':'smooth',block:'start'});
    }
  }
  function check(choice){
    if(!current)return;
    const l=current.lesson,answer=current.root.querySelector('[data-visual-answer]');
    const correct=choice===l.check.correct;
    current.root.querySelectorAll('[data-visual-choice]').forEach(btn=>{
      const i=Number(btn.dataset.visualChoice);
      btn.disabled=true;
      btn.classList.toggle('visual-choice-correct',i===l.check.correct);
      btn.classList.toggle('visual-choice-wrong',i===choice&&!correct);
    });
    answer.textContent=(correct?'Correct. ':'Not quite. ')+
      'The best answer is: '+l.check.options[l.check.correct]+'. '+l.principle;
  }
  document.addEventListener('click',event=>{
    const target=event.target.closest('[data-visual-next],[data-visual-back],[data-visual-play],[data-visual-reset],[data-visual-focus],[data-visual-print],[data-visual-choice]');
    if(!target||!current||!current.root.contains(target))return;
    if(target.hasAttribute('data-visual-next'))advance(1);
    else if(target.hasAttribute('data-visual-back')){pause();advance(-1);}
    else if(target.hasAttribute('data-visual-play'))play();
    else if(target.hasAttribute('data-visual-reset')){pause();current.step=0;update();}
    else if(target.hasAttribute('data-visual-focus'))focus();
    else if(target.hasAttribute('data-visual-print'))window.print();
    else if(target.hasAttribute('data-visual-choice'))check(Number(target.dataset.visualChoice));
  });
  document.addEventListener('change',event=>{
    if(event.target.matches('[data-visual-mode]')&&current&&current.root.contains(event.target))
      setScenario(event.target.value);
  });
  window.AgenticVisual={render,mount,available:day=>lessons.has(Number(day)),count:lessons.size,preview:(day,step=0,mode='success')=>{const d=lessons.get(Number(day));return d?figure(d,step,mode):'';}};
})();
