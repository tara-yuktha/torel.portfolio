// ===== PARTICLES =====
const particleContainer = document.getElementById('particles');
for (let i = 0; i < 28; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 6 + 3;
  p.style.cssText = `
    width:${size}px; height:${size}px;
    left:${Math.random() * 100}%;
    animation-duration:${Math.random() * 12 + 8}s;
    animation-delay:${Math.random() * 10}s;
    opacity:${Math.random() * 0.5 + 0.1};
  `;
  particleContainer.appendChild(p);
}

// ===== MOBILE NAV =====
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.background = window.scrollY > 50
    ? 'rgba(13,9,6,0.96)' : 'rgba(13,9,6,0.88)';
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(
  '.about-card, .pub-card, .conf-card, .proj-card, .phd-card, .unpub-card, .skill-group, .tl-item, .certs-row, .phd-target, .contact-item'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// ===== SKILL BAR ANIMATION =====
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.fill').forEach(f => f.classList.add('animated'));
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-group').forEach(g => barObserver.observe(g));

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const activateNav = () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--teal)' : '';
  });
};
window.addEventListener('scroll', activateNav);

// ===== CONTACT FORM =====
function handleForm(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('form-success').style.display = 'block';
    document.getElementById('contact-form').reset();
    btn.textContent = 'Send Message';
    btn.disabled = false;
  }, 1200);
}

// ===== TYPING EFFECT for hero subtitle =====
const heroSub = document.querySelector('.hero-sub');
const phrases = [
  'CO₂ Sequestration · Reactive Transport Modelling',
  'Carbon Capture & Storage · Geomechanics',
  'Structural Geology · Seismology',
  'PhD Aspirations · Europe · UK · Australia'
];
let pi = 0, ci = 0, deleting = false;
function typeWriter() {
  const phrase = phrases[pi];
  if (!deleting) {
    heroSub.textContent = phrase.slice(0, ci + 1);
    ci++;
    if (ci === phrase.length) { deleting = true; setTimeout(typeWriter, 2200); return; }
  } else {
    heroSub.textContent = phrase.slice(0, ci - 1);
    ci--;
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(typeWriter, deleting ? 40 : 65);
}
setTimeout(typeWriter, 1500);

// ===== SMOOTH COUNTER ANIMATION =====
function animateCount(el, target, suffix = '') {
  let start = 0; const duration = 1500;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const val = parseFloat((progress * target).toFixed(2));
    el.textContent = Number.isInteger(target) ? Math.floor(val) + suffix : val.toFixed(2) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const stats = document.querySelectorAll('.stat span');
      stats.forEach(s => {
        const text = s.textContent.trim();
        const num = parseFloat(text);
        if (!isNaN(num)) {
          const suffix = text.replace(num.toString(), '');
          animateCount(s, num, suffix);
        }
      });
      statObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);

// ===== SEISMOGRAM CANVAS ANIMATION =====
const canvas = document.getElementById('strata-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let animationId;
  let time = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  window.addEventListener('resize', resize);
  resize();

  function draw() {
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    const centerY = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Draw grid
    ctx.strokeStyle = 'rgba(200, 121, 65, 0.08)';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0; // Disable shadow for grid

    // Vertical lines
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    // Horizontal lines
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw seismogram wave
    ctx.strokeStyle = '#38bdf8'; // Cyan seismic accent
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.moveTo(0, centerY);

    for (let x = 0; x < w; x++) {
      // Physical wave packets representing P-wave, S-wave, surface wave, and ambient noise
      const pWave = Math.sin(x * 0.08 - time * 3) * Math.exp(-Math.pow(x - w * 0.22, 2) / 800) * 14;
      const sWave = Math.sin(x * 0.04 - time * 2) * Math.exp(-Math.pow(x - w * 0.45, 2) / 1800) * 32;
      const surfaceWave = Math.sin(x * 0.015 - time * 1) * Math.exp(-Math.pow(x - w * 0.70, 2) / 3600) * 18;
      const noise = (Math.sin(x * 0.4 + time * 1.5) * 0.4 + Math.cos(x * 0.9 - time * 0.8) * 0.3) * 1.5;

      const y = centerY + pWave + sWave + surfaceWave + noise;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw active pen dot
    const lastX = w - 2;
    const lastPWave = Math.sin(lastX * 0.08 - time * 3) * Math.exp(-Math.pow(lastX - w * 0.22, 2) / 800) * 14;
    const lastSWave = Math.sin(lastX * 0.04 - time * 2) * Math.exp(-Math.pow(lastX - w * 0.45, 2) / 1800) * 32;
    const lastSurfWave = Math.sin(lastX * 0.015 - time * 1) * Math.exp(-Math.pow(lastX - w * 0.70, 2) / 3600) * 18;
    const lastNoise = (Math.sin(lastX * 0.4 + time * 1.5) * 0.4 + Math.cos(lastX * 0.9 - time * 0.8) * 0.3) * 1.5;
    const penY = centerY + lastPWave + lastSWave + lastSurfWave + lastNoise;

    ctx.fillStyle = '#38bdf8';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(lastX, penY, 4, 0, Math.PI * 2);
    ctx.fill();

    time += 0.03;
    animationId = requestAnimationFrame(draw);
  }
  draw();
}