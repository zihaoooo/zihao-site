/* ============================================================
   Deck editor — LOCAL ONLY visual-adjustment overlay (Option B)
   Lives in _local/ (gitignored, never deployed). Loaded via a
   bookmarklet on a localhost page. Coexists with deck.js: it
   suppresses the lightbox while editing and re-runs nothing it
   doesn't own. It NEVER writes files — it records every change as
   a JSON log you copy to clipboard and hand to Claude to apply.

   Covers: caption/credit/notes text · visible slide text ·
   drag/resize positioned boxes · swap layout class · add/delete images.
   ============================================================ */
(function () {
  'use strict';
  if (window.__deckEditor) { window.__deckEditor.toggle(); return; }

  // hard guard: refuse to run anywhere but a local host
  var host = location.hostname;
  var LOCAL = host === 'localhost' || host === '127.0.0.1' || host === '' || host.endsWith('.local');
  if (!LOCAL) { alert('Deck editor is local-only. Open the page from your dev server (localhost) to edit.'); return; }

  var stage = document.getElementById('deck-stage');
  var deck  = document.getElementById('deck');
  if (!stage) { alert('No #deck-stage on this page.'); return; }

  var slides = [].slice.call(stage.querySelectorAll('.slide'));
  var LAYOUTS = ['single', 'auto', 'hero-l', 'hero-r', 'auto-rows', 'sq', 'two-3-3', 'grid-4'];
  var changes = [];            // the change log we export
  var on = false;

  // ---- helpers ---------------------------------------------------------------
  function curIndex() { var i = slides.indexOf(stage.querySelector('.slide.on')); return i < 0 ? 0 : i; }
  function curSlide() { return slides[curIndex()]; }
  function capOf(s) { return (s.getAttribute('data-cap') || '').replace(/<[^>]*>/g, '').slice(0, 40); }
  function pct(px, base) { return base ? +(px / base * 100).toFixed(2) + '%' : px + 'px'; }
  function record(c) { c.slide = curIndex(); c.slideCap = capOf(curSlide()); changes.push(c); flashCount(); }
  function layoutClass(s) { return s.className.replace(/\bslide\b/g, '').replace(/\bon\b/g, '').trim(); }
  function relayout() { window.dispatchEvent(new Event('resize')); } // deck.js re-runs layoutAuto on resize

  // ---- styles ----------------------------------------------------------------
  var css = document.createElement('style');
  css.textContent = [
    '#de-bar{position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:9999;display:flex;',
    'gap:6px;align-items:center;background:#1a1a1a;color:#eee;border:1px solid #444;border-radius:10px;',
    'padding:7px 10px;font:13px/1.2 system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.4);}',
    '#de-bar button,#de-bar select{appearance:none;background:#2a2a2a;color:#eee;border:1px solid #4a4a4a;',
    'border-radius:7px;padding:6px 10px;font-size:12px;cursor:pointer;}',
    '#de-bar button:hover{background:#383838;}',
    '#de-bar .de-on{background:#b87333;border-color:#b87333;color:#fff;}',
    '#de-bar .de-count{font-variant-numeric:tabular-nums;color:#b87333;font-weight:600;min-width:14px;text-align:center;}',
    '#de-dock{position:fixed;right:12px;top:64px;z-index:9999;width:300px;background:#fbfaf8;color:#1a1a1a;',
    'border:1px solid #ccc;border-radius:10px;padding:12px;font:13px system-ui,sans-serif;',
    'box-shadow:0 6px 24px rgba(0,0,0,.25);max-height:80vh;overflow:auto;}',
    '#de-dock h4{margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#8a847c;}',
    '#de-dock label{display:block;font-size:11px;color:#8a847c;margin:10px 0 3px;}',
    '#de-dock textarea{width:100%;box-sizing:border-box;font:12px/1.4 ui-monospace,monospace;',
    'border:1px solid #ccc;border-radius:6px;padding:6px;resize:vertical;}',
    'body.de-edit [data-de-box]{outline:1px dashed rgba(184,115,51,.5);cursor:move;}',
    'body.de-edit [data-de-box]:hover{outline:1.5px solid #b87333;}',
    '.de-handle{position:absolute;right:-5px;bottom:-5px;width:11px;height:11px;background:#b87333;',
    'border:2px solid #fff;border-radius:50%;cursor:se-resize;z-index:5;}',
    '.de-fig-del{position:absolute;top:2px;right:2px;z-index:6;width:20px;height:20px;line-height:18px;',
    'text-align:center;background:#c0392b;color:#fff;border:none;border-radius:50%;cursor:pointer;font-size:13px;}',
    '.de-tip{position:fixed;z-index:10000;background:#1a1a1a;color:#fff;font:11px ui-monospace,monospace;',
    'padding:3px 6px;border-radius:4px;pointer-events:none;}',
    'body.de-edit [contenteditable=true]{outline:1px dashed rgba(47,109,104,.6);}'
  ].join('');
  document.head.appendChild(css);

  // ---- toolbar ---------------------------------------------------------------
  var bar = document.createElement('div');
  bar.id = 'de-bar';
  bar.innerHTML =
    '<button id="de-toggle" class="de-on">✎ Editing</button>' +
    '<button id="de-text">Text</button>' +
    '<select id="de-layout" title="Swap layout class"></select>' +
    '<button id="de-addimg">+ Image</button>' +
    '<button id="de-copy">Copy changes (<span class="de-count">0</span>)</button>' +
    '<button id="de-reset" title="Discard recorded changes">Reset</button>' +
    '<button id="de-exit">Exit</button>';
  document.body.appendChild(bar);

  var sel = bar.querySelector('#de-layout');
  LAYOUTS.forEach(function (l) { var o = document.createElement('option'); o.value = l; o.textContent = l; sel.appendChild(o); });
  var countEl = bar.querySelector('.de-count');
  function flashCount() { countEl.textContent = changes.length; }

  // ---- dock (caption / credit / notes) --------------------------------------
  var dock = document.createElement('div');
  dock.id = 'de-dock';
  dock.innerHTML =
    '<h4>Slide <span id="de-sn"></span> text</h4>' +
    '<label>Caption (data-cap)</label><textarea id="de-cap" rows="2"></textarea>' +
    '<label>Credit (data-credit)</label><textarea id="de-credit" rows="1"></textarea>' +
    '<label>Notes (data-notes)</label><textarea id="de-notes" rows="5"></textarea>';
  document.body.appendChild(dock);
  var f = { cap: dock.querySelector('#de-cap'), credit: dock.querySelector('#de-credit'), notes: dock.querySelector('#de-notes') };
  var attrOf = { cap: 'data-cap', credit: 'data-credit', notes: 'data-notes' };

  function syncDock() {
    var s = curSlide();
    dock.querySelector('#de-sn').textContent = (curIndex() + 1);
    f.cap.value = s.getAttribute('data-cap') || '';
    f.credit.value = s.getAttribute('data-credit') || '';
    f.notes.value = s.getAttribute('data-notes') || '';
    sel.value = LAYOUTS.indexOf(layoutClass(s).split(/\s+/)[0]) >= 0 ? layoutClass(s).split(/\s+/)[0] : '';
  }
  Object.keys(f).forEach(function (k) {
    f[k].addEventListener('change', function () {
      var s = curSlide();
      s.setAttribute(attrOf[k], f[k].value);
      record({ op: 'text', field: k, value: f[k].value });
      relayout();
    });
  });

  // ---- layout swap -----------------------------------------------------------
  sel.addEventListener('change', function () {
    var s = curSlide(), from = layoutClass(s), to = sel.value;
    s.className = 'slide ' + to + (s.classList.contains('on') ? ' on' : '');
    record({ op: 'class', from: from, to: to });
    relayout();
  });

  // ---- visible-text contenteditable -----------------------------------------
  var textMode = false;
  // text blocks worth editing: anything that's text, not a figure/img/svg/iframe wrapper
  function textBlocks(s) {
    return [].slice.call(s.querySelectorAll('h1,h2,h3,h4,p,li,figcaption,span'))
      .filter(function (el) { return !el.querySelector('img,svg,iframe') && el.textContent.trim(); });
  }
  bar.querySelector('#de-text').addEventListener('click', function () {
    textMode = !textMode;
    this.classList.toggle('de-on', textMode);
    slides.forEach(function (s) {
      textBlocks(s).forEach(function (el) {
        if (textMode) {
          el.contentEditable = 'true';
          if (!el.__deBound) {
            el.__deBound = true;
            el.addEventListener('blur', function () {
              record({ op: 'html', selector: cssPath(el, s), value: el.innerHTML.trim() });
            });
          }
        } else { el.contentEditable = 'false'; }
      });
    });
  });

  // ---- add / delete images ---------------------------------------------------
  function decorateFigures() {
    stage.querySelectorAll('.de-fig-del').forEach(function (b) { b.remove(); });
    if (!on) return;
    curSlide().querySelectorAll(':scope > figure, :scope > .row > figure').forEach(function (fig) {
      fig.style.position = fig.style.position || 'relative';
      var del = document.createElement('button');
      del.className = 'de-fig-del'; del.textContent = '×'; del.title = 'Delete image';
      del.addEventListener('click', function (e) {
        e.stopPropagation();
        var img = fig.querySelector('img');
        record({ op: 'delImg', src: img ? img.getAttribute('src') : '', alt: img ? img.getAttribute('alt') : '' });
        fig.remove(); relayout(); decorateFigures();
      });
      fig.appendChild(del);
    });
  }
  bar.querySelector('#de-addimg').addEventListener('click', function () {
    var src = prompt('Image src (path under /teaching/... or a URL).\nClaude will optimize to WebP ≤1600px on apply:');
    if (!src) return;
    var alt = prompt('Alt text:') || '';
    var fig = document.createElement('figure');
    var im = document.createElement('img'); im.src = src; im.alt = alt; fig.appendChild(im);
    var host = curSlide().querySelector(':scope > .row:last-child') || curSlide();
    host.appendChild(fig);
    record({ op: 'addImg', src: src, alt: alt });
    relayout(); decorateFigures();
  });

  // ---- drag / resize positioned boxes ---------------------------------------
  function tagBoxes() {
    if (!on) { stage.querySelectorAll('[data-de-box]').forEach(function (el) { el.removeAttribute('data-de-box'); }); return; }
    curSlide().querySelectorAll('*').forEach(function (el) {
      if (/^(FIGURE|IMG|FIGCAPTION|svg|use|path)$/i.test(el.tagName)) return;
      if (el.closest('.de-fig-del')) return;
      if (getComputedStyle(el).position === 'absolute' && el.className) el.setAttribute('data-de-box', '1');
    });
  }
  var tip = document.createElement('div'); tip.className = 'de-tip'; tip.style.display = 'none';
  document.body.appendChild(tip);
  function showTip(el, x, y) {
    var p = el.offsetParent || el.parentElement, pr = p.getBoundingClientRect(), r = el.getBoundingClientRect();
    tip.textContent = 'top ' + pct(r.top - pr.top, pr.height) + '  left ' + pct(r.left - pr.left, pr.width) +
      '  w ' + pct(r.width, pr.width) + '  h ' + pct(r.height, pr.height);
    tip.style.left = (x + 12) + 'px'; tip.style.top = (y + 12) + 'px'; tip.style.display = 'block';
  }
  function commitBox(el) {
    var p = el.offsetParent || el.parentElement, pr = p.getBoundingClientRect(), r = el.getBoundingClientRect();
    record({ op: 'box', selector: cssPath(el, curSlide()),
      style: { top: pct(r.top - pr.top, pr.height), left: pct(r.left - pr.left, pr.width),
        width: pct(r.width, pr.width), height: pct(r.height, pr.height) } });
    tip.style.display = 'none';
  }
  var drag = null;
  stage.addEventListener('mousedown', function (e) {
    if (!on) return;
    var handle = e.target.classList && e.target.classList.contains('de-handle');
    var box = e.target.closest('[data-de-box]');
    if (!box && !handle) return;
    if (handle) box = handle.parentElement;
    e.preventDefault(); e.stopPropagation();
    var r = box.getBoundingClientRect();
    drag = { el: box, mode: handle ? 'resize' : 'move', sx: e.clientX, sy: e.clientY,
      ox: r.left, oy: r.top, ow: r.width, oh: r.height, p: (box.offsetParent || box.parentElement).getBoundingClientRect() };
    box.style.position = 'absolute';
  }, true);
  window.addEventListener('mousemove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy, el = drag.el, p = drag.p;
    if (drag.mode === 'move') {
      el.style.left = pct(drag.ox - p.left + dx, p.width);
      el.style.top = pct(drag.oy - p.top + dy, p.height);
      el.style.right = 'auto'; el.style.bottom = 'auto';
    } else {
      el.style.width = pct(drag.ow + dx, p.width);
      el.style.height = pct(drag.oh + dy, p.height);
    }
    showTip(el, e.clientX, e.clientY);
  });
  window.addEventListener('mouseup', function () { if (drag) { commitBox(drag.el); drag = null; } });

  // add a resize handle to the hovered box
  stage.addEventListener('mouseover', function (e) {
    if (!on) return;
    var box = e.target.closest('[data-de-box]');
    stage.querySelectorAll('.de-handle').forEach(function (h) { if (h.parentElement !== box) h.remove(); });
    if (box && !box.querySelector('.de-handle')) {
      box.style.position = 'absolute';
      var h = document.createElement('span'); h.className = 'de-handle'; box.appendChild(h);
    }
  });

  // ---- a stable-ish selector for the change log ------------------------------
  function cssPath(el, root) {
    var parts = [];
    while (el && el !== root && el !== document.body) {
      var seg = el.tagName.toLowerCase();
      if (el.className && typeof el.className === 'string') {
        var cls = el.className.split(/\s+/).filter(function (c) { return c && !/^de-|^on$/.test(c); });
        if (cls.length) seg += '.' + cls.join('.');
      }
      var sibs = [].slice.call(el.parentElement.children).filter(function (n) { return n.tagName === el.tagName; });
      if (sibs.length > 1) seg += ':nth-of-type(' + ([].indexOf.call(el.parentElement.children, el) + 1) + ')';
      parts.unshift(seg); el = el.parentElement;
    }
    return parts.join(' > ');
  }

  // ---- suppress lightbox while editing (capture phase, before deck.js) -------
  stage.addEventListener('click', function (e) {
    if (on && e.target.closest('img')) { e.stopPropagation(); }
  }, true);

  // ---- export ----------------------------------------------------------------
  bar.querySelector('#de-copy').addEventListener('click', function () {
    if (!changes.length) { alert('No changes recorded yet.'); return; }
    var out = JSON.stringify({ page: location.pathname, deckId: (deck && deck.dataset.deckId) || '', changes: changes }, null, 2);
    navigator.clipboard.writeText(out).then(
      function () { alert('Copied ' + changes.length + ' change(s) to clipboard. Paste them to Claude.'); },
      function () { console.log(out); alert('Clipboard blocked — JSON dumped to console (F12).'); }
    );
  });
  bar.querySelector('#de-reset').addEventListener('click', function () {
    if (confirm('Discard ' + changes.length + ' recorded change(s)? (the page edits stay; only the log clears)')) { changes = []; flashCount(); }
  });

  // ---- mode plumbing ---------------------------------------------------------
  function setOn(v) {
    on = v;
    document.body.classList.toggle('de-edit', on);
    bar.querySelector('#de-toggle').classList.toggle('de-on', on);
    bar.querySelector('#de-toggle').textContent = on ? '✎ Editing' : '✎ Paused';
    dock.style.display = on ? 'block' : 'none';
    tagBoxes(); decorateFigures(); if (on) syncDock();
  }
  bar.querySelector('#de-toggle').addEventListener('click', function () { setOn(!on); });
  bar.querySelector('#de-exit').addEventListener('click', function () {
    if (changes.length && !confirm('Exit with ' + changes.length + ' un-copied change(s)?')) return;
    css.remove(); bar.remove(); dock.remove(); tip.remove();
    document.body.classList.remove('de-edit');
    stage.querySelectorAll('.de-fig-del,.de-handle,[data-de-box]').forEach(function (n) {
      if (n.hasAttribute && n.hasAttribute('data-de-box')) n.removeAttribute('data-de-box'); else n.remove();
    });
    window.__deckEditor = null;
  });

  // refresh per-slide UI when the active slide changes
  var mo = new MutationObserver(function () { if (on) { syncDock(); tagBoxes(); decorateFigures(); } });
  slides.forEach(function (s) { mo.observe(s, { attributes: true, attributeFilter: ['class'] }); });

  window.__deckEditor = { toggle: function () { setOn(!on); } };
  setOn(true);
  console.log('[deck-editor] active — edits are recorded, not saved. Use "Copy changes" then paste to Claude.');
})();
