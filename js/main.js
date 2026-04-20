/* ============================================
   NEXGEN DEV — Main JavaScript
   ============================================ */

/* ---- Custom Cursor ---- */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .svc-card, .price-card, .testi-card, .channel-link').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); cursorRing.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); cursorRing.classList.remove('hover'); });
});

/* ---- Navbar scroll behavior ---- */
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);

  // active link highlight
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

/* ---- Smooth scroll for all anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ---- Reveal on scroll ---- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('visible');
      revealObs.unobserve(en.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ---- Process steps stagger reveal ---- */
const procObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      const steps = en.target.querySelectorAll('.proc-step');
      steps.forEach((s, i) => {
        setTimeout(() => s.classList.add('visible'), i * 120);
      });
      procObs.unobserve(en.target);
    }
  });
}, { threshold: 0.2 });

const processTrack = document.querySelector('.process-track');
if (processTrack) procObs.observe(processTrack);

/* ---- Animated counter ---- */
function animateCount(el) {
  const raw    = el.getAttribute('data-count');
  const isFloat = raw.includes('.');
  const target  = parseFloat(raw);
  const suffix  = el.getAttribute('data-suffix') || '';
  const prefix  = el.getAttribute('data-prefix') || '';
  const dur     = 1800;
  const start   = performance.now();

  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = isFloat
      ? (target * ease).toFixed(1)
      : Math.round(target * ease);
    el.textContent = prefix + val + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(performance.now());
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      animateCount(en.target);
      counterObs.unobserve(en.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

/* ---- Contact form ---- */
const form   = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<span>Enviando</span><span class="arrow">⏳</span>';

    setTimeout(() => {
      sendBtn.innerHTML = '<span>Mensagem enviada! ✓</span>';
      sendBtn.style.background = 'linear-gradient(135deg,#00f5a0,#00d4ff)';
      form.reset();
      setTimeout(() => {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<span>Enviar mensagem</span><span class="arrow">→</span>';
        sendBtn.style.background = '';
      }, 4000);
    }, 1200);
  });
}

/* ---- Pricing toggle (monthly / annual) ---- */
const toggleBtn = document.getElementById('priceToggle');
const prices = {
  starter: { monthly: 'R$ 497', annual: 'R$ 397' },
  pro:     { monthly: 'R$ 997', annual: 'R$ 797' },
  premium: { monthly: 'R$ 1.997', annual: 'R$ 1.597' },
};
let annual = false;

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    annual = !annual;
    toggleBtn.classList.toggle('annual', annual);
    toggleBtn.querySelector('.toggle-label').textContent = annual ? 'Anual  (20% OFF)' : 'Mensal';
    Object.keys(prices).forEach(k => {
      const el = document.querySelector(`[data-plan="${k}"] .price-value`);
      if (el) el.textContent = annual ? prices[k].annual : prices[k].monthly;
    });
  });
}

/* ---- Floating cards live animation ---- */
document.querySelectorAll('.float-card').forEach((card, i) => {
  card.style.animation = `cardFloat${i % 2 === 0 ? 'A' : 'B'} ${5 + i}s ease-in-out infinite`;
});

const floatStyle = document.createElement('style');
floatStyle.textContent = `
  @keyframes cardFloatA { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-8px) translateX(-3px)} }
  @keyframes cardFloatB { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(8px) translateX(3px)} }
`;
document.head.appendChild(floatStyle);
