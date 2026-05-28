document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const panel = document.getElementById('sidepanel');
  const overlay = document.querySelector('.panel-overlay');

  function openPanel() {
    panel.classList.add('open');
    overlay.classList.add('visible');
  }
  function closePanel() {
    panel.classList.remove('open');
    overlay.classList.remove('visible');
  }

  toggle.addEventListener('click', () =>
    panel.classList.contains('open') ? closePanel() : openPanel()
  );
  overlay.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

  const current = window.location.pathname;
  document.querySelectorAll('.panel-link').forEach(link => {
    if (link.getAttribute('href') && current.endsWith(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });
});
