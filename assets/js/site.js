// Personal site nav — mark active link by current path
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  document.querySelectorAll('.site-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && path.startsWith(href) && href !== '/') {
      link.classList.add('active');
    }
    if (href === '/' && (path === '/' || path === '/index.html')) {
      link.classList.add('active');
    }
  });
});
