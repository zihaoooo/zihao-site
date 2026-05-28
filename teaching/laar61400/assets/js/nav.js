document.addEventListener('DOMContentLoaded', () => {
  const current = window.location.pathname;
  document.querySelectorAll('.panel-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && current.endsWith(href)) {
      link.classList.add('active');
    }
  });
});
