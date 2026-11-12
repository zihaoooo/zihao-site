/* ============================================
   Lightbox — click any img in #site-main to
   enlarge; arrow keys / buttons to navigate.
   ============================================ */
(function () {
  'use strict';

  let imgs = [];
  let current = 0;
  let opener = null;   /* element focused before opening; focus returns there */

  /* ── Build overlay DOM ── */
  const overlay = document.createElement('div');
  overlay.id = 'lb';
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('role', 'dialog');
  overlay.innerHTML =
    '<button class="lb-close" aria-label="Close">&times;</button>' +
    '<button class="lb-prev" aria-label="Previous">&#8249;</button>' +
    '<img class="lb-img" src="" alt="">' +
    '<button class="lb-next" aria-label="Next">&#8250;</button>' +
    '<p class="lb-counter"></p>';
  document.body.appendChild(overlay);

  const lbImg     = overlay.querySelector('.lb-img');
  const lbCounter = overlay.querySelector('.lb-counter');
  const lbClose   = overlay.querySelector('.lb-close');
  const lbPrev    = overlay.querySelector('.lb-prev');
  const lbNext    = overlay.querySelector('.lb-next');

  /* ── Open / close ── */
  function open(index) {
    current = ((index % imgs.length) + imgs.length) % imgs.length;
    lbImg.src = imgs[current].src;
    lbImg.alt = imgs[current].alt || '';
    lbCounter.textContent = (current + 1) + ' / ' + imgs.length;
    if (!overlay.classList.contains('lb-visible')) {
      opener = document.activeElement;
      overlay.classList.add('lb-visible');
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    }
  }

  function close() {
    overlay.classList.remove('lb-visible');
    document.body.style.overflow = '';
    lbImg.src = ''; /* free memory */
    if (opener && opener.focus) opener.focus();
    opener = null;
  }

  /* ── Navigation ── */
  lbPrev.addEventListener('click', function (e) { e.stopPropagation(); open(current - 1); });
  lbNext.addEventListener('click', function (e) { e.stopPropagation(); open(current + 1); });
  lbClose.addEventListener('click', close);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('lb-visible')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   open(current - 1);
    if (e.key === 'ArrowRight')  open(current + 1);
    if (e.key === 'Tab') {        /* keep focus on the three buttons while open */
      const btns = [lbClose, lbPrev, lbNext];
      const i = btns.indexOf(document.activeElement);
      e.preventDefault();
      btns[(i + (e.shiftKey ? btns.length - 1 : 1)) % btns.length].focus();
    }
  });

  /* ── Init: collect images after DOM ready ── */
  document.addEventListener('DOMContentLoaded', function () {
    var main = document.getElementById('site-main');
    if (!main) return;
    imgs = Array.from(main.querySelectorAll('img'));
    imgs.forEach(function (img, i) {
      img.classList.add('lb-trigger');
      /* images inside a link keep the link's behavior */
      if (!img.closest('a, button')) {
        img.tabIndex = 0;
        img.setAttribute('role', 'button');
        img.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
        });
      }
      img.addEventListener('click', function () { open(i); });
    });
  });
})();
