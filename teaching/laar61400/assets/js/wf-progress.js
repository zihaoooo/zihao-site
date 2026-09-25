/* Workflow progress: a "done" check on each step of a .wf-doc page.
   Checking a step folds it to its title line; clicking the title opens it again.
   State lives in the student's own browser (localStorage), keyed by page and step
   position, so it survives a reload but never leaves the device. Every step starts
   open; printing opens them all (see workflow-shared.css). */
(function () {
  var doc = document.querySelector('.wf-doc');
  if (!doc) return;
  // steps are the blocks with a title line; week dividers reuse .wf-step without one,
  // and the Hint cards (.wf-examples) already open and close on their own
  var steps = [].slice.call(doc.querySelectorAll('.wf-step')).filter(function (s) {
    return s.querySelector('.wf-step-head') && !s.classList.contains('wf-examples');
  });
  if (!steps.length) return;

  var KEY = 'wf-done:' + location.pathname;
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  var state = load();

  // progress line above the steps
  var bar = document.createElement('div');
  bar.className = 'wf-progress';
  bar.innerHTML = '<span class="wf-progress-count"></span>' +
    '<button type="button" class="wf-progress-btn" data-act="open">Expand all</button>' +
    '<button type="button" class="wf-progress-btn" data-act="reset">Clear checks</button>';
  var list = doc.querySelector('.wf-steps');
  list.parentNode.insertBefore(bar, list);
  var count = bar.querySelector('.wf-progress-count');

  function refresh() {
    var n = steps.filter(function (s) { return s.classList.contains('wf-done'); }).length;
    count.textContent = n + ' / ' + steps.length + ' steps done';
  }

  steps.forEach(function (step, i) {
    var head = step.querySelector('.wf-step-head');
    if (!head) return;
    var box = document.createElement('button');
    box.type = 'button';
    box.className = 'wf-check';
    box.setAttribute('aria-label', 'Mark step done');
    head.appendChild(box);

    function set(done) {
      step.classList.toggle('wf-done', done);
      step.classList.remove('wf-open');
      box.setAttribute('aria-pressed', done ? 'true' : 'false');
      if (done) state[i] = 1; else delete state[i];
      save(state); refresh();
    }
    box.addEventListener('click', function (e) {
      e.stopPropagation();
      set(!step.classList.contains('wf-done'));
    });
    // a folded step opens (and closes again) from its title line
    head.addEventListener('click', function () {
      if (step.classList.contains('wf-done')) step.classList.toggle('wf-open');
    });
    if (state[i]) { step.classList.add('wf-done'); box.setAttribute('aria-pressed', 'true'); }
    else box.setAttribute('aria-pressed', 'false');
  });

  bar.addEventListener('click', function (e) {
    var act = e.target.getAttribute('data-act');
    if (act === 'open') steps.forEach(function (s) { if (s.classList.contains('wf-done')) s.classList.add('wf-open'); });
    if (act === 'reset') {
      state = {}; save(state);
      steps.forEach(function (s) {
        s.classList.remove('wf-done', 'wf-open');
        var b = s.querySelector('.wf-check'); if (b) b.setAttribute('aria-pressed', 'false');
      });
    }
    refresh();
  });
  refresh();
})();
