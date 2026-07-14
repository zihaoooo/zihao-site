/* ============================================================
   Teaching deck — shared carousel controller (factory standard)
   Page-agnostic: reads #deck data attributes.
     <div class="deck" id="deck" data-deck-id="w04" data-deck-title="Week 04">
   Include AFTER nav.js:  <script src="/teaching/_shared/deck.js"></script>
   Does NOT include buildChart (timeline) — that stays inline per page.
   ============================================================ */
// ── slide deck (carousel) ──────────────────────────────────────────────────
(function(){
  const deck = document.getElementById('deck');
  if(!deck) return;
  const DECK_ID = deck.dataset.deckId || 'deck';
  const DECK_TITLE = deck.dataset.deckTitle || '';
  const slides = [...deck.querySelectorAll('.slide')];
  const prev  = document.getElementById('deck-prev');
  const next  = document.getElementById('deck-next');
  const jump  = document.getElementById('deck-jump');
  const total = document.getElementById('deck-total');
  const capEl    = document.getElementById('deck-cap');
  const creditEl = document.getElementById('deck-credit');
  const notesEl = document.getElementById('deck-notes');
  const notesToggle = document.getElementById('deck-notes-toggle');
  const presentBtn = document.getElementById('deck-present');
  let i = 0, hot = false, bc = null, lbOpen = false;
  try { bc = new BroadcastChannel('laar61400-' + DECK_ID + '-deck'); } catch(e){}
  function render(){
    slides.forEach((s,n)=>s.classList.toggle('on', n===i));
    if(jump !== document.activeElement) jump.value = (i+1);
    total.textContent = ' / ' + slides.length;
    const s = slides[i];
    capEl.innerHTML    = s.getAttribute('data-cap') || '';
    creditEl.textContent = s.getAttribute('data-credit') || '';
    const note = (s.getAttribute('data-notes') || '').trim();
    notesEl.innerHTML = note ? note : '<span class="nn-empty">No notes for this slide yet.</span>';
    prev.disabled = (i === 0);
    next.disabled = (i === slides.length - 1);
    if(bc) bc.postMessage({ type:'idx', i:i });
  }
  function go(d){ i = Math.min(slides.length-1, Math.max(0, i+d)); render(); }
  function goTo(n){ i = Math.min(slides.length-1, Math.max(0, n)); render(); }
  prev.addEventListener('click', ()=>go(-1));
  next.addEventListener('click', ()=>go(1));
  function commitJump(){
    const n = parseInt(jump.value, 10);
    if(!isNaN(n)) goTo(n-1);
    jump.value = (i+1); // echo back the clamped/valid slide number
  }
  jump.addEventListener('keydown', e=>{
    if(e.key === 'Enter'){ commitJump(); jump.blur(); }
    e.stopPropagation(); // don't let ←/→ in the field drive the deck
  });
  jump.addEventListener('change', commitJump);
  jump.addEventListener('focus', ()=>jump.select());
  deck.addEventListener('mouseenter', ()=>hot=true);
  deck.addEventListener('mouseleave', ()=>hot=false);

  // ── fullscreen present mode ──
  const fsBtn = document.getElementById('deck-fs');
  deck.tabIndex = -1;
  function inFS(){ return (document.fullscreenElement || document.webkitFullscreenElement) === deck; }
  function toggleFS(){
    if(inFS()){ (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
    else {
      const r = (deck.requestFullscreen || deck.webkitRequestFullscreen).call(deck);
      if(r && r.catch) r.catch(()=>{}); // browser may refuse without a user gesture
    }
  }
  function onFS(){
    const f = inFS();
    fsBtn.innerHTML = f ? '&#x2715;' : '&#x26F6;';
    fsBtn.setAttribute('aria-label', f ? 'Exit full screen' : 'Present full screen');
    if(f && deck.focus) deck.focus();
  }
  fsBtn.addEventListener('click', toggleFS);
  document.addEventListener('fullscreenchange', onFS);
  document.addEventListener('webkitfullscreenchange', onFS);

  document.addEventListener('keydown', e=>{
    // typing in a field (e.g. a live-code editor on a slide) — let keys through, no deck shortcuts
    const t = e.target;
    if(t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if(lbOpen){
      if(e.key === 'Escape'){ e.preventDefault(); closeLightbox(); return; }
      // arrows/space still drive the deck — close the zoom and fall through
      if(['ArrowLeft','ArrowRight','PageUp','PageDown',' '].includes(e.key)) closeLightbox();
      else return;
    }
    if(!(hot || inFS())) return;
    if(e.key === 'ArrowLeft' || e.key === 'PageUp'){ e.preventDefault(); go(-1); }
    else if(e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' '){ e.preventDefault(); go(1); }
    else if(e.key === 'f' || e.key === 'F'){ e.preventDefault(); toggleFS(); }
  });

  // ── notes disclosure (collapsed by default) ──
  notesToggle.addEventListener('click', ()=>{
    const opening = notesEl.hasAttribute('hidden');
    if(opening) notesEl.removeAttribute('hidden'); else notesEl.setAttribute('hidden','');
    notesToggle.setAttribute('aria-expanded', String(opening));
  });

  // ── presenter view (synced second window) ──
  if(bc){
    bc.onmessage = (ev)=>{
      const m = ev.data || {};
      if(m.type === 'go'){ go(m.d); }
      else if(m.type === 'goto'){ i = Math.min(slides.length-1, Math.max(0, m.i)); render(); }
      else if(m.type === 'req'){ bc.postMessage({ type:'idx', i:i }); }
    };
  }
  const PRESENTER_DOC = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>Presenter — ${DECK_TITLE}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&display=swap');
  :root{color-scheme:dark;} *{box-sizing:border-box;}
  body{margin:0;height:100vh;display:flex;flex-direction:column;background:#0e0e0e;color:#e8e3da;
    font-family:'DM Sans',system-ui,sans-serif;}
  .pv-top{display:flex;gap:12px;padding:12px 14px 4px;}
  .pv-col{flex:1;min-width:0;}
  .pv-tag{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase;
    color:#8a847c;margin:0 0 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .pv-stage{aspect-ratio:16/9;width:100%;background:#1a1a1a;border:1px solid #333;border-radius:6px;
    overflow:hidden;display:flex;align-items:center;justify-content:center;}
  .pv-stage img{max-width:100%;max-height:100%;object-fit:contain;}
  /* mirror of /teaching/_shared/deck.css layout system, scoped + dark */
  .pv-stage .pv-deck{display:flex;align-items:center;justify-content:center;width:100%;height:100%;}
  .pv-stage .pv-deck.single>img{max-width:100%;max-height:100%;object-fit:contain;}
  .pv-stage .pv-deck.slide--title{flex-direction:column;gap:6px;}
  .pv-stage .pv-deck.two-3-3,.pv-stage .pv-deck.grid-4{display:grid;gap:2px;background:#333;}
  .pv-stage .pv-deck figure{margin:0;min-width:0;min-height:0;display:flex;align-items:center;
    justify-content:center;background:#1a1a1a;overflow:hidden;}
  .pv-stage .pv-deck figure img{width:100%;height:100%;object-fit:cover;}
  .pv-stage .pv-deck.sq{display:grid;grid-template-columns:repeat(12,1fr);align-items:center;gap:2px;}
  .pv-stage .pv-deck.sq figure{width:100%;aspect-ratio:1;overflow:hidden;margin:0;}
  .pv-stage .pv-deck.sq figure img{width:100%;height:100%;object-fit:cover;}
  .pv-stage .c1-4{grid-column:1/5;} .pv-stage .c5-8{grid-column:5/9;} .pv-stage .c9-12{grid-column:9/13;}
  .pv-stage .c1-6{grid-column:1/7;} .pv-stage .c7-12{grid-column:7/13;}
  .pv-stage .c2-5{grid-column:2/6;} .pv-stage .c8-11{grid-column:8/12;}
  .pv-stage .c2-6{grid-column:2/7;} .pv-stage .c7-11{grid-column:7/12;}
  .pv-stage .c3-6{grid-column:3/7;} .pv-stage .c7-10{grid-column:7/11;}
  .pv-stage .pv-deck.hero-l,.pv-stage .pv-deck.hero-r{display:grid;grid-template-columns:2fr 1fr;
    grid-template-rows:1fr 1fr;gap:2px;width:100%;height:100%;}
  .pv-stage .pv-deck.hero-l figure:nth-child(1){grid-column:1;grid-row:1/3;}
  .pv-stage .pv-deck.hero-l figure:nth-child(2){grid-column:2;grid-row:1;}
  .pv-stage .pv-deck.hero-l figure:nth-child(3){grid-column:2;grid-row:2;}
  .pv-stage .pv-deck.hero-r{grid-template-columns:1fr 2fr;}
  .pv-stage .pv-deck.hero-r figure:nth-child(1){grid-column:2;grid-row:1/3;}
  .pv-stage .pv-deck.hero-r figure:nth-child(2){grid-column:1;grid-row:1;}
  .pv-stage .pv-deck.hero-r figure:nth-child(3){grid-column:1;grid-row:2;}
  .pv-stage .pv-deck.hero-l figure,.pv-stage .pv-deck.hero-r figure{margin:0;overflow:hidden;}
  .pv-stage .pv-deck.hero-l figure img,.pv-stage .pv-deck.hero-r figure img{width:100%;height:100%;object-fit:cover;}
  .pv-stage .pv-deck.hero-l.fit figure:nth-child(1) img,.pv-stage .pv-deck.hero-r.fit figure:nth-child(1) img{object-fit:contain;}
  /* hero + rows (static approximation): hero column spans, .row divs stack in the other column */
  .pv-stage .pv-deck.hero-l:has(>.row)>figure:first-child{grid-column:1;grid-row:1/99;}
  .pv-stage .pv-deck.hero-r:has(>.row)>figure:first-child{grid-column:2;grid-row:1/99;}
  .pv-stage .pv-deck.hero-l:has(>.row)>.row{grid-column:2;}
  .pv-stage .pv-deck.hero-r:has(>.row)>.row{grid-column:1;}
  .pv-stage .pv-deck.hero-l>.row,.pv-stage .pv-deck.hero-r>.row{display:flex;gap:2px;align-items:center;justify-content:center;}
  .pv-stage .pv-deck.hero-l>.row img,.pv-stage .pv-deck.hero-r>.row img{width:100%;height:100%;object-fit:cover;}
  .pv-stage .pv-deck.auto-rows{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;height:100%;}
  .pv-stage .pv-deck.auto-rows .row{display:flex;align-items:center;justify-content:center;gap:2px;flex:1;min-height:0;}
  .pv-stage .pv-deck.auto-rows figure{height:100%;flex:0 1 auto;margin:0;}
  .pv-stage .pv-deck.auto-rows figure img{height:100%;width:auto;max-width:100%;object-fit:contain;}
  .pv-stage .pv-deck.auto{display:flex;align-items:center;justify-content:center;gap:2px;}
  .pv-stage .pv-deck.auto figure{height:100%;flex:0 1 auto;}
  .pv-stage .pv-deck.auto figure img{height:100%;width:auto;max-width:100%;object-fit:contain;}
  .pv-stage .pv-deck.two-3-3{grid-template-columns:3fr 3fr;}
  .pv-stage .pv-deck.grid-4{grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;}
  /* part TOC / agenda divider (dark mirror) */
  .pv-stage .pv-deck .toc{display:grid;grid-template-columns:auto 1fr;row-gap:5px;column-gap:12px;width:86%;text-align:left;}
  .pv-stage .pv-deck .toc .toc-row{display:grid;grid-template-columns:subgrid;grid-column:1/-1;
    align-items:baseline;padding-bottom:5px;border-bottom:1px solid #333;opacity:.4;}
  .pv-stage .pv-deck .toc .toc-row:last-child{border-bottom:0;padding-bottom:0;}
  .pv-stage .pv-deck .toc .toc-n{grid-column:1;grid-row:1;font-family:'DM Mono',monospace;font-size:8px;
    letter-spacing:.16em;text-transform:uppercase;color:#8a847c;}
  .pv-stage .pv-deck .toc .toc-h{grid-column:2;grid-row:1;margin:0;font-weight:700;font-size:14px;
    line-height:1.05;color:#e8e3da;}
  .pv-stage .pv-deck .toc .toc-row.active{opacity:1;}
  .pv-stage .pv-deck .toc .toc-row.active .toc-n,.pv-stage .pv-deck .toc .toc-row.active .toc-h{color:#d98a63;}
  .pv-stage .ph{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
    width:calc(100% - 16px);height:calc(100% - 16px);border:1.5px dashed #555;border-radius:6px;
    text-align:center;padding:10px;}
  .pv-stage .ph-tag{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.14em;
    text-transform:uppercase;color:#777;}
  .pv-stage .ph-desc{font-size:11px;color:#aaa;line-height:1.4;max-width:40ch;}
  .pv-stage .tt{font-family:'DM Sans';font-weight:700;font-size:clamp(13px,2.4vw,24px);color:#f5f3f0;
    text-align:center;line-height:1.12;}
  .pv-stage .ts{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.14em;
    text-transform:uppercase;color:#b0a898;text-align:center;}
  .pv-vid{font-family:'DM Mono',monospace;font-size:12px;color:#c98a3c;letter-spacing:.06em;}
  .pv-noteswrap{flex:1;min-height:0;padding:6px 16px 10px;display:flex;flex-direction:column;}
  .pv-cap{font-size:15px;font-style:italic;color:#cfc8bd;margin:4px 0 8px;}
  .pv-notes{flex:1;overflow:auto;font-size:19px;line-height:1.6;color:#efeae1;
    border-top:1px solid #2a2a2a;padding-top:10px;}
  .pv-notes .empty{color:#777;font-style:italic;font-size:15px;}
  .pv-bar{display:flex;align-items:center;gap:12px;padding:10px 16px;border-top:1px solid #222;background:#141414;}
  .pv-btn{appearance:none;background:#1f1f1f;border:1px solid #3a3a3a;color:#e8e3da;border-radius:7px;
    padding:7px 13px;font-size:13px;cursor:pointer;}
  .pv-btn:hover{background:#292929;}
  .pv-count{font-family:'DM Mono',monospace;font-size:13px;color:#b8b0a6;}
  .pv-mini{font-family:'DM Mono',monospace;font-size:10px;color:#6f6a62;}
  .pv-timer{font-family:'DM Mono',monospace;font-size:16px;color:#e8e3da;margin-left:auto;}
</style></head><body>
  <div class="pv-top">
    <div class="pv-col"><p class="pv-tag" id="pvCurTag">Current</p><div class="pv-stage" id="pvCur"></div></div>
    <div class="pv-col"><p class="pv-tag">Next &rarr;</p><div class="pv-stage" id="pvNext"></div></div>
  </div>
  <div class="pv-noteswrap">
    <div class="pv-cap" id="pvCap"></div>
    <div class="pv-notes" id="pvNotes"></div>
  </div>
  <div class="pv-bar">
    <button class="pv-btn" id="pvPrev">&lsaquo; Prev</button>
    <button class="pv-btn" id="pvNext2">Next &rsaquo;</button>
    <span class="pv-count" id="pvCount">&ndash; / &ndash;</span>
    <span class="pv-mini">&larr;&rarr; navigate &middot; synced with the page</span>
    <span class="pv-timer" id="pvTimer">00:00</span>
    <button class="pv-btn" id="pvReset">Reset timer</button>
  </div>
<script>
(function(){
  var op = window.opener;
  if(!op){ document.getElementById('pvNotes').textContent = 'Opener window lost — close this and reopen Presenter from the page.'; return; }
  var slides = [].slice.call(op.document.querySelectorAll('#deck-stage .slide')).map(function(s){
    return { era:s.getAttribute('data-era')||'', cap:s.getAttribute('data-cap')||'',
      notes:(s.getAttribute('data-notes')||'').trim(),
      html: s.querySelector('iframe') ? '<div class="pv-vid">&#9654; video slide</div>'
        : '<div class="pv-deck '+s.className.replace(/\bslide\b/g,'').replace(/\bon\b/g,'').trim()+'">'+s.innerHTML+'</div>' };
  });
  var total = slides.length, cur = 0;
  var bc = null; try{ bc = new BroadcastChannel('laar61400-${DECK_ID}-deck'); }catch(e){}
  var elCur=document.getElementById('pvCur'), elNext=document.getElementById('pvNext'),
      elCap=document.getElementById('pvCap'), elNotes=document.getElementById('pvNotes'),
      elCount=document.getElementById('pvCount'), elCurTag=document.getElementById('pvCurTag');
  function paint(){
    var s = slides[cur]||{}, n = slides[cur+1];
    elCur.innerHTML = s.html||'';
    elNext.innerHTML = n ? n.html : '<div class="pv-vid" style="color:#555">&mdash; end &mdash;</div>';
    elCap.textContent = s.cap||'';
    elCurTag.textContent = s.era || 'Current';
    elNotes.innerHTML = s.notes ? s.notes : '<span class="empty">No notes for this slide yet.</span>';
    elCount.textContent = (cur+1)+' / '+total;
  }
  function send(d){ if(bc) bc.postMessage({ type:'go', d:d }); }
  document.getElementById('pvPrev').onclick = function(){ send(-1); };
  document.getElementById('pvNext2').onclick = function(){ send(1); };
  document.addEventListener('keydown', function(e){
    if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key==='PageDown'||e.key===' '){ e.preventDefault(); send(1); }
    else if(e.key==='ArrowLeft'||e.key==='ArrowUp'||e.key==='PageUp'){ e.preventDefault(); send(-1); }
  });
  if(bc){ bc.onmessage = function(ev){ var m = ev.data||{}; if(m.type==='idx'){ cur = m.i; paint(); } }; bc.postMessage({ type:'req' }); }
  var t0 = Date.now(), tEl = document.getElementById('pvTimer');
  function tick(){ var s=Math.floor((Date.now()-t0)/1000); tEl.textContent = String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); }
  setInterval(tick,1000); tick();
  document.getElementById('pvReset').onclick = function(){ t0 = Date.now(); tick(); };
  paint();
})();
<\/script></body></html>`;
  presentBtn.addEventListener('click', ()=>{
    const w = window.open('', 'laar61400-' + DECK_ID + '-presenter', 'width=940,height=720');
    if(!w){ alert('Popup blocked — allow popups for this site to open Presenter view.'); return; }
    w.document.open(); w.document.write(PRESENTER_DOC); w.document.close();
  });

  // ── justified "fit-to-box" layout for .auto slides (equal height, no crop, PPT-style) ──
  const stage = document.getElementById('deck-stage');
  function layoutAuto(){
    if(!stage) return;
    const W = stage.clientWidth, H = stage.clientHeight;
    if(!W || !H) return;
    const FILL_W = 1.00;  // full-bleed left/right → width-bound groups align with the 12-col content edge
    const FILL_H = 0.90;  // breathing margin top/bottom
    deck.querySelectorAll('.slide.auto').forEach(s=>{
      const figs = [...s.querySelectorAll(':scope > figure')];
      if(!figs.length) return;
      const gap = parseFloat(getComputedStyle(s).columnGap) || 0;
      let sumA = 0;
      const ars = figs.map(fig=>{
        const im = fig.querySelector('img');
        const a = (im && im.naturalWidth && im.naturalHeight) ? im.naturalWidth/im.naturalHeight : 1;
        sumA += a; return a;
      });
      const n = figs.length;
      const hByW = (FILL_W*W - (n-1)*gap) / sumA;  // tallest row that fits the width budget
      const hByH = FILL_H*H;                        // tallest row that fits the height budget
      const h = Math.max(0, Math.min(hByW, hByH));
      figs.forEach((fig,k)=>{ fig.style.height = h+'px'; fig.style.width = (ars[k]*h)+'px'; });
    });
    // hero + stack: hero fills the frame (cover-cropped); two whole images stacked beside it
    const arOf = fig => { const im = fig.querySelector('img');
      return (im && im.naturalWidth && im.naturalHeight) ? im.naturalWidth/im.naturalHeight : 1; };
    deck.querySelectorAll('.slide.hero-l, .slide.hero-r').forEach(s=>{
      const heroLeft = s.classList.contains('hero-l');
      const fit = s.classList.contains('fit');   // hero reads whole (contained) vs. cover-cropped
      // hero + ROWS variant: the non-hero side is a multi-row gallery (each row wrapped in <div class="row">,
      // like auto-rows). Hero is the first <figure>; rows fill the other column, auto-rows-justified, the
      // block's total height matched to the hero height. Detected by the presence of .row children.
      const heroRows = [...s.querySelectorAll(':scope > .row')];
      if(heroRows.length){
        const hero = s.querySelector(':scope > figure');
        if(!hero) return;
        const colGapS = parseFloat(getComputedStyle(s).columnGap) || 0;
        const rowGapS = parseFloat(getComputedStyle(s).rowGap) || 0;
        const Ht0 = FILL_H*H;
        const rd = heroRows.map(r=>{
          const rfigs = [...r.querySelectorAll(':scope > figure')];
          const cg = parseFloat(getComputedStyle(r).columnGap) || 0;
          let sumA = 0; const ars = rfigs.map(f=>{ const a = arOf(f); sumA += a; return a; });
          return { figs:rfigs, ars, sumA, cg, n:rfigs.length };
        });
        // solve for the right-column width Wcol that makes the rows' stacked height == hero height Ht0
        const invSum = rd.reduce((t,d)=>t + 1/d.sumA, 0);
        const gapCorr = rd.reduce((t,d)=>t + (d.n-1)*d.cg/d.sumA, 0);
        const Wcol = (Ht0 - (heroRows.length-1)*rowGapS + gapCorr) / invSum;
        const heroW0 = fit ? arOf(hero)*Ht0 : Math.max(0, FILL_W*W - colGapS - Wcol);
        // scale down if the composite is wider than the width budget (keeps every aspect ratio)
        const composite = heroW0 + colGapS + Wcol;
        const sc = composite > FILL_W*W ? (FILL_W*W)/composite : 1;
        const Ht = Ht0*sc;
        hero.style.gridColumn = heroLeft ? '1' : '2';
        hero.style.gridRow = '1 / '+(heroRows.length+1);
        hero.style.width = (heroW0*sc)+'px'; hero.style.height = Ht+'px';
        rd.forEach((d,i)=>{
          const hr = ((Wcol*sc) - (d.n-1)*d.cg)/d.sumA;
          heroRows[i].style.gridColumn = heroLeft ? '2' : '1';
          heroRows[i].style.gridRow = (i+1)+'';
          d.figs.forEach((f,k)=>{ f.style.height = hr+'px'; f.style.width = (d.ars[k]*hr)+'px'; });
        });
        return;
      }
      const figs = [...s.querySelectorAll(':scope > figure')];
      if(figs.length < 3) return;
      const stack = figs.slice(1), n = stack.length;
      const gap = parseFloat(getComputedStyle(s).rowGap) || 0;
      const maxArS = Math.max(...stack.map(arOf));
      // hero fills the frame (cover-cropped); N stack cells keep their aspect (whole), equal height.
      // composite is the full width budget and the height budget; hero takes the leftover width.
      const Ht = FILL_H*H;                            // composite height (full height budget)
      const sH = (Ht-(n-1)*gap)/n, stackW = maxArS*sH;       // each stack cell: whole, aspect-sized
      // fit: hero sized to its own aspect (whole, contained); else fills leftover width (cover-cropped)
      const heroW = fit ? arOf(figs[0])*Ht : Math.max(0, FILL_W*W - gap - stackW);
      // placement: hero spans all rows of its column; stack fills the other column top→bottom
      figs[0].style.gridColumn = heroLeft ? '1' : '2';
      figs[0].style.gridRow = '1 / '+(n+1);
      figs[0].style.width = heroW+'px'; figs[0].style.height = Ht+'px';
      stack.forEach((f,i)=>{ f.style.gridColumn = heroLeft ? '2' : '1';
        f.style.gridRow = (i+1)+''; f.style.width = stackW+'px'; f.style.height = sH+'px'; });
    });
    // auto-rows: each .row justified to box width; rows stacked, whole block scaled to 90% height
    deck.querySelectorAll('.slide.auto-rows').forEach(s=>{
      const rows = [...s.querySelectorAll(':scope > .row')];
      if(!rows.length) return;
      const rowGap = parseFloat(getComputedStyle(s).rowGap) || 0;
      const data = rows.map(r=>{
        const figs = [...r.querySelectorAll(':scope > figure')];
        const colGap = parseFloat(getComputedStyle(r).columnGap) || 0;
        let sumA = 0; const ars = figs.map(f=>{ const a = arOf(f); sumA += a; return a; });
        const hFill = (FILL_W*W - (figs.length-1)*colGap) / sumA;  // row height to fill the width
        return { figs, ars, hFill };
      });
      const totalH = data.reduce((t,d)=>t+d.hFill, 0) + (rows.length-1)*rowGap;
      const scale = totalH > FILL_H*H ? (FILL_H*H)/totalH : 1;     // shrink if too tall
      data.forEach(d=>{ const h = d.hFill*scale;
        d.figs.forEach((f,k)=>{ f.style.height = h+'px'; f.style.width = (d.ars[k]*h)+'px'; }); });
    });
  }
  deck.querySelectorAll('.slide.auto img, .slide.hero-l img, .slide.hero-r img, .slide.auto-rows img').forEach(im=>{
    if(!im.complete) im.addEventListener('load', layoutAuto, {once:true});
  });
  let _lt; window.addEventListener('resize', ()=>{ clearTimeout(_lt); _lt=setTimeout(layoutAuto, 80); });
  document.addEventListener('fullscreenchange', ()=>setTimeout(layoutAuto, 60));
  document.addEventListener('webkitfullscreenchange', ()=>setTimeout(layoutAuto, 60));

  // ── click-to-zoom lightbox: click an image to fit-to-screen, scroll to zoom further, drag to pan ──
  let lbEl = null, lbImg = null;
  let lbScale = 1, lbTx = 0, lbTy = 0, lbDragging = false, lbMoved = false, lbLastX = 0, lbLastY = 0;
  const LB_MAX = 6;
  function lbApply(){
    lbImg.style.transform = 'translate(' + lbTx + 'px,' + lbTy + 'px) scale(' + lbScale + ')';
    lbImg.style.cursor = lbScale > 1 ? (lbDragging ? 'grabbing' : 'grab') : 'zoom-out';
  }
  function lbReset(){ lbScale = 1; lbTx = 0; lbTy = 0; }
  function buildLightbox(){
    const st = document.createElement('style');
    st.textContent =
      '.deck-lightbox{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;'
      + 'background:rgba(12,12,12,.92);cursor:zoom-out;padding:2.5%;overflow:hidden;}'
      + '.deck-lightbox.on{display:flex;}'
      + '.deck-lightbox img{max-width:100%;max-height:100%;object-fit:contain;transform-origin:0 0;'
      + 'box-shadow:0 10px 40px rgba(0,0,0,.5);border-radius:2px;}'
      + '#deck-stage img{cursor:zoom-in;}';
    deck.appendChild(st);
    lbEl = document.createElement('div');
    lbEl.className = 'deck-lightbox';
    lbEl.setAttribute('role', 'dialog');
    lbEl.setAttribute('aria-label', 'Image zoom — scroll to zoom, drag to pan, click to close');
    lbImg = document.createElement('img');
    lbImg.draggable = false;
    lbEl.appendChild(lbImg);

    // backdrop or unzoomed image → close; while zoomed, a click that wasn't a drag does nothing
    lbEl.addEventListener('click', e=>{
      if(lbMoved){ lbMoved = false; return; }
      if(e.target === lbEl || lbScale === 1) closeLightbox();
    });
    // scroll to zoom toward the cursor
    lbEl.addEventListener('wheel', e=>{
      e.preventDefault();
      const r = lbImg.getBoundingClientRect();
      const dx = e.clientX - r.left, dy = e.clientY - r.top;
      const s2 = Math.min(LB_MAX, Math.max(1, lbScale * (e.deltaY < 0 ? 1.15 : 1/1.15)));
      lbTx += dx * (1 - s2/lbScale);
      lbTy += dy * (1 - s2/lbScale);
      lbScale = s2;
      if(lbScale === 1){ lbTx = 0; lbTy = 0; }
      lbApply();
    }, {passive:false});
    // drag to pan when zoomed
    lbImg.addEventListener('mousedown', e=>{
      if(lbScale === 1) return;
      e.preventDefault(); lbDragging = true; lbMoved = false; lbLastX = e.clientX; lbLastY = e.clientY; lbApply();
    });
    window.addEventListener('mousemove', e=>{
      if(!lbDragging) return;
      lbTx += e.clientX - lbLastX; lbTy += e.clientY - lbLastY;
      lbLastX = e.clientX; lbLastY = e.clientY; lbMoved = true; lbApply();
    });
    window.addEventListener('mouseup', ()=>{ if(lbDragging){ lbDragging = false; lbApply(); } });
    deck.appendChild(lbEl);
  }
  function openLightbox(src, alt){
    if(!lbEl) buildLightbox();
    lbReset();
    lbImg.src = src; lbImg.alt = alt || '';
    lbApply();
    lbEl.classList.add('on'); lbOpen = true;
  }
  function closeLightbox(){
    if(!lbEl) return;
    lbEl.classList.remove('on'); lbImg.src = ''; lbOpen = false; lbReset();
  }
  if(stage){
    buildLightbox();
    stage.addEventListener('click', e=>{
      const im = e.target.closest('img');
      if(!im || !stage.contains(im)) return;
      openLightbox(im.currentSrc || im.src, im.alt);
    });
  }

  render();
  layoutAuto();
})();

/* Local-only editor auto-loader. Inert on the live site: the hostname check fails
   off localhost, and _local/ is gitignored so it never deploys. Open any deck page
   with ?edit on a local dev server to load the visual edit overlay. */
(function () {
  var h = location.hostname;
  if ((h === 'localhost' || h === '127.0.0.1') && /[?&]edit\b/.test(location.search)) {
    var s = document.createElement('script');
    s.src = '/_local/deck-editor.js?' + Date.now();
    document.body.appendChild(s);
  }
})();
