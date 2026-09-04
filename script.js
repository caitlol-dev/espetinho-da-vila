const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

function syncHeader() {
  header.classList.toggle('scrolled', window.scrollY > 20);
}

syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const open = !nav.classList.contains('open');
  nav.classList.toggle('open', open);
  menuButton.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', (event) => {
  if (!nav.classList.contains('open')) return;
  if (!nav.contains(event.target) && !menuButton.contains(event.target)) {
    nav.classList.remove('open');
    menuButton.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

document.getElementById('year').textContent = new Date().getFullYear();

const revealTargets = document.querySelectorAll('.intro, .feature-card, .menu-panel, .menu-steps article, .gallery-item, .location-grid, .hours-panel');
revealTargets.forEach((element) => element.classList.add('reveal'));

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealTargets.forEach((element) => observer.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add('visible'));
}
