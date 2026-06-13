document.addEventListener('DOMContentLoaded', () => {
  // ── Active link highlight ──
  const current = window.location.pathname;
  document.querySelectorAll('.panel-link').forEach(link => {
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
  toggle.innerHTML = '<span></span><span></span><span></span>';
  document.body.appendChild(toggle);

  const overlay = document.createElement('div');
  overlay.id = 'nav-overlay';
  document.body.appendChild(overlay);

  function openNav() {
    sidepanel.classList.add('open');
    overlay.classList.add('open');
    toggle.setAttribute('aria-label', 'Close navigation');
  }

  function closeNav() {
    sidepanel.classList.remove('open');
    overlay.classList.remove('open');
    toggle.setAttribute('aria-label', 'Open navigation');
  }

  toggle.addEventListener('click', () => {
    sidepanel.classList.contains('open') ? closeNav() : openNav();
  });

  overlay.addEventListener('click', closeNav);

  sidepanel.querySelectorAll('.panel-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeNav();
    });
  });
});
