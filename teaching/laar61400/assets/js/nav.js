document.addEventListener('DOMContentLoaded', () => {
  // ── Active link highlight ──
  const current = window.location.pathname;
  document.querySelectorAll('.panel-link, .panel-announce').forEach(link => {
    const href = link.getAttribute('href');
    if (href && current.endsWith(href)) {
      link.classList.add('active');
    }
  });

  // ── Collapsible nav sections ──
  document.querySelectorAll('.panel-section-label').forEach(label => {
    const section = label.parentElement;
    const key = 'nav-collapsed-' + label.textContent.trim();
    if (localStorage.getItem(key) === '1') section.classList.add('collapsed');
    label.addEventListener('click', () => {
      const collapsed = section.classList.toggle('collapsed');
      localStorage.setItem(key, collapsed ? '1' : '0');
    });
  });

  // ── Mobile hamburger ──
  const sidepanel = document.getElementById('sidepanel');
  if (!sidepanel) return;

  const toggle = document.createElement('button');
  toggle.id = 'nav-toggle';
  toggle.setAttribute('aria-label', 'Open navigation');
  toggle.innerHTML = '<span></span><span></span><span></span>'
    + '<svg class="nav-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M14 8H3M7.5 3.5 3 8l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(toggle);

  const overlay = document.createElement('div');
  overlay.id = 'nav-overlay';
  document.body.appendChild(overlay);

  function openNav() {
    sidepanel.classList.add('open');
    overlay.classList.add('open');
    toggle.setAttribute('aria-label', 'Close navigation');
    toggle.classList.add('is-open');
  }

  function closeNav() {
    sidepanel.classList.remove('open');
    overlay.classList.remove('open');
    toggle.setAttribute('aria-label', 'Open navigation');
    toggle.classList.remove('is-open');
  }

  // Desktop: hide/show the panel; shown by default, choice remembered
  const root = document.documentElement;
  const isMobile = () => window.innerWidth <= 768;
  function setDesktopLabel() {
    if (isMobile()) return;
    const hidden = root.classList.contains('nav-hidden');
    toggle.setAttribute('aria-label', hidden ? 'Show navigation' : 'Hide navigation');
    toggle.classList.toggle('is-open', !hidden);
  }
  try { if (localStorage.getItem('nav-hidden') === '1') root.classList.add('nav-hidden'); } catch (e) {}
  setDesktopLabel();
  requestAnimationFrame(() => root.classList.add('nav-ready'));

  toggle.addEventListener('click', () => {
    if (isMobile()) {
      sidepanel.classList.contains('open') ? closeNav() : openNav();
      return;
    }
    const hidden = root.classList.toggle('nav-hidden');
    try { localStorage.setItem('nav-hidden', hidden ? '1' : '0'); } catch (e) {}
    setDesktopLabel();
    // let decks and carousels re-measure once the slide finishes
    setTimeout(() => window.dispatchEvent(new Event('resize')), 260);
  });

  overlay.addEventListener('click', closeNav);

  sidepanel.querySelectorAll('.panel-link, .panel-announce').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeNav();
    });
  });
});
