(function () {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tutorial = day => window.AgenticTutorials[day - 1];
  function highlight(source) {
    // Tokenize the original text once, then escape each token before adding markup.
    const pattern = /#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:def|return|if|else|elif|for|in|import|from|with|as|try|except|raise|assert|and|or|not|is|lambda|break|True|False|None)\b|\b\d+(?:\.\d+)?\b/g;
    let html = '', end = 0;
    for (const match of source.matchAll(pattern)) {
      html += esc(source.slice(end, match.index));
      const token = match[0], kind = token.startsWith('#') ? 'comment' : /^["']/.test(token) ? 'string' : /^\d/.test(token) ? 'number' : 'keyword';
      html += '<span class="syntax-' + kind + '">' + esc(token) + '</span>';
      end = match.index + token.length;
    }
    return html + esc(source.slice(end));
  }
  function codeWindow(t, compact = false) {
    const source = compact ? t.code.split('\n').slice(0, 8).join('\n') : t.code;
    return '<div class="editor-window"><div class="editor-title"><div class="window-dots" aria-hidden="true"><i></i><i></i><i></i></div><span>' + esc(t.filename) + '</span><span class="language-label">PYTHON</span>' + (!compact ? '<button class="lab-copy" data-copy-example="' + t.day + '">Copy code</button>' : '') + '</div><pre class="highlighted-code" tabindex="0" aria-label="Python worked example"><code>' + highlight(source).split('\n').map((line, i) => '<span class="code-line"><span class="line-number" aria-hidden="true">' + (i + 1) + '</span><span>' + (line || ' ') + '</span></span>').join('') + '</code></pre></div>';
  }
  function previewSource(d, t) {
    return '<!doctype html>\n<html lang="en">\n<head>\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<style>\n  * { box-sizing: border-box; }\n  body { margin: 0; padding: 28px; background: #f1f5f3; color: #182b27;\n         font: 17px/1.6 system-ui, sans-serif; }\n  article { max-width: 620px; margin: auto; padding: 28px; background: white;\n            border: 1px solid #dce6df; border-radius: 18px; }\n  .tag { color: #426f40; font-size: 13px; font-weight: 700; letter-spacing: 2px; }\n  h1 { font-size: 28px; line-height: 1.2; }\n  pre { padding: 18px; overflow: auto; background: #12231d; color: #d2f69a;\n        border-radius: 10px; font-size: 14px; white-space: pre-wrap; }\n  details { border-top: 1px solid #dce6df; padding-top: 16px; }\n  summary, label { cursor: pointer; }\n  .done { display: none; color: #3b7035; }\n  input:checked ~ .done { display: block; }\n</style>\n</head>\n<body>\n<article>\n  <span class="tag">DAY ' + String(d.day).padStart(2, '0') + ' / LEARNING LAB</span>\n  <h1>' + esc(d.title) + '</h1>\n  <p>' + esc(d.outcome) + '.</p>\n  <pre>' + esc(t.output) + '</pre>\n  <details>\n    <summary>Why does this work?</summary>\n    <p>' + esc(t.explanation) + '</p>\n  </details>\n  <p>Try changing the heading, colors and spacing in the editor.</p>\n  <input type="checkbox" id="understood">\n  <label for="understood">I can explain this example</label>\n  <p class="done">Nice. Now test the failure case in your local Python file.</p>\n</article>\n</body>\n</html>';
  }
  function render(d) {
    const t = tutorial(d.day);
    return '<section class="lab-intro"><div><span class="eyebrow">READ IT. TRACE IT. BUILD IT.</span><h2>See the concept in code.</h2><p>One focused example, a visible flow and a place to experiment.</p></div><span class="lab-badge">Day ' + d.day + ' coding lab</span></section>' +
      '<section class="panel coding-panel" id="worked-example"><div class="section-head"><div><span class="eyebrow">01 / WORKED EXAMPLE</span><h3>' + esc(t.title) + '</h3></div><span class="pill">No API credits needed</span></div><p class="example-environment">' + esc(t.environment) + '</p>' + codeWindow(t) + '<div class="terminal"><div class="terminal-label"><span class="terminal-dot"></span>Expected output · local Python run</div><pre>' + esc(t.output) + '</pre></div><div class="example-explanation"><span class="explanation-icon" aria-hidden="true">i</span><p>' + esc(t.explanation) + '</p></div><p class="hint">Copy into ' + esc(t.filename) + ' and run <code>python ' + esc(t.filename) + '</code>. The output above is a checked example, not a run of your assignment.</p></section>' +
      '<section class="panel flow-panel"><div class="section-head"><div><span class="eyebrow">02 / VISUAL WALKTHROUGH</span><h3>Follow the flow</h3></div><button class="btn small" data-trace-reset>Reset</button></div><p>Step through the example’s three stages. This illustrates the flow; it does not execute Python.</p><ol class="trace-flow" aria-label="Example execution stages">' + t.stages.map((s, i) => '<li class="trace-node' + (i === 0 ? ' current' : '') + '" data-trace-node="' + i + '"><span class="trace-number">0' + (i + 1) + '</span><strong>' + esc(s) + '</strong><span class="trace-node-status">' + (i === 0 ? 'Current stage' : 'Up next') + '</span></li>').join('') + '</ol><div class="trace-detail" role="status" aria-live="polite"><strong>' + esc(t.stages[0]) + '</strong><span>Start with the input shown in the worked example.</span></div><button class="btn primary" data-trace-next data-stage="0" data-day="' + d.day + '">Next stage <span aria-hidden="true">→</span></button></section>' +
      '<section class="panel browser-lab" id="browser-playground"><div class="section-head"><div><span class="eyebrow">03 / TRY IT IN YOUR BROWSER</span><h3>Your editable website preview</h3></div><span class="pill">HTML + CSS</span></div><p>Edit the markup or styles, then press Run preview. Open the explanation and toggle the checkbox in the rendered page. Python runs locally; this sandbox renders HTML and CSS only.</p><div class="playground-actions"><button class="btn primary" data-preview-run>Run preview <span aria-hidden="true">▶</span></button><button class="btn" data-preview-reset data-day="' + d.day + '">Reset example</button><span class="preview-status" role="status" aria-live="polite">Ready to experiment</span></div><div class="playground-grid"><div class="playground-editor"><label class="editor-label" for="html-source">index.html <span>EDITABLE</span></label><textarea id="html-source" spellcheck="false" autocapitalize="off" autocomplete="off" aria-describedby="preview-help">' + esc(previewSource(d, t)) + '</textarea></div><div class="playground-result"><div class="browser-chrome"><div class="window-dots" aria-hidden="true"><i></i><i></i><i></i></div><span>your-local-preview / day-' + d.day + '</span></div><iframe id="html-preview" sandbox="" title="Day ' + d.day + ' HTML and CSS preview" referrerpolicy="no-referrer"></iframe></div></div><p id="preview-help" class="hint">The preview is isolated. Scripts, forms, popups and network requests are disabled. Edits stay in this page and do not count as submitted work.</p></section>' +
      '<section class="lab-challenge"><div class="challenge-number">04</div><div><span class="eyebrow">BREAK IT TO UNDERSTAND IT</span><h3>Try a failure case</h3><p>' + esc(t.challenge) + '</p><span class="hint">Record the actual result in your assignment evidence below.</span></div></section>';
  }
  function showPreview() {
    const frame = document.querySelector('#html-preview'), source = document.querySelector('#html-source');
    if (!frame || !source) return;
    // CSP is prepended before any user markup. Sandbox grants no capabilities.
    frame.srcdoc = '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; img-src data:; script-src \'none\'; connect-src \'none\'; form-action \'none\'; base-uri \'none\'">' + source.value;
    const status = document.querySelector('.preview-status');
    frame.onload = () => { if (status?.isConnected) status.textContent = 'Preview updated'; };
    if (status) status.textContent = 'Rendering preview…';
  }
  function mount() { showPreview(); }
  function showcase(day) {
    const t = tutorial(day);
    return '<section class="code-showcase"><div><span class="eyebrow">A WORKSPACE FOR BUILDERS</span><h2>Less guessing.<br>More working code.</h2><p>Read a worked example, trace the data flow, then experiment with a real browser preview.</p><button class="btn primary" data-go="day" data-day="' + day + '" data-tab="lesson" data-study-view="practice">Open today’s coding lab →</button><div class="showcase-tags"><span>60 worked examples</span><span>Editable previews</span><span>Failure cases</span></div></div>' + codeWindow(t, true) + '</section>';
  }
  document.addEventListener('click', async event => {
    const copy = event.target.closest('[data-copy-example]');
    if (copy) {
      try { await navigator.clipboard.writeText(tutorial(Number(copy.dataset.copyExample)).code); copy.textContent = 'Copied'; }
      catch { copy.textContent = 'Select code to copy'; }
      setTimeout(() => { if (copy.isConnected) copy.textContent = 'Copy code'; }, 2000);
    }
    const next = event.target.closest('[data-trace-next]'), reset = event.target.closest('[data-trace-reset]');
    if (next || reset) {
      const button = document.querySelector('[data-trace-next]'), t = tutorial(Number(button.dataset.day));
      const stage = reset ? 0 : (Number(button.dataset.stage) + 1) % 3;
      button.dataset.stage = stage;
      document.querySelectorAll('[data-trace-node]').forEach((node, i) => { node.classList.toggle('current', i === stage); node.classList.toggle('visited', i < stage); node.querySelector('.trace-node-status').textContent = i < stage ? 'Visited' : i === stage ? 'Current stage' : 'Up next'; });
      const detail = document.querySelector('.trace-detail'); detail.replaceChildren();
      const strong = document.createElement('strong'); strong.textContent = t.stages[stage];
      const span = document.createElement('span'); span.textContent = stage === 0 ? 'Start with the input shown in the worked example.' : stage === 1 ? t.explanation : 'Compare the expected output, then try the failure case: ' + t.challenge;
      detail.append(strong, span); button.innerHTML = stage === 2 ? 'Replay flow ↺' : 'Next stage →';
    }
    if (event.target.closest('[data-preview-run]')) showPreview();
    const previewReset = event.target.closest('[data-preview-reset]');
    if (previewReset) { const day = Number(previewReset.dataset.day), t = tutorial(day); const d = window.AgenticLessonMeta[day - 1]; document.querySelector('#html-source').value = previewSource(d, t); showPreview(); }
  });
  document.documentElement.style.fontSize = '18px';
  window.AgenticLessons = { render, mount, showcase };
})();
