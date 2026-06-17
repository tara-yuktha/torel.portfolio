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
  '.about-card, .pub-card, .conf-card, .proj-cat-card, .phd-card, .unpub-card, .skill-group, .tl-item, .certs-row, .phd-target, .contact-item'
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



// ===== TYPING EFFECT for hero subtitle =====
const heroSub = document.querySelector('.hero-sub');
const phrases = [
  'Computational Geoscientist',
  'Reactive Transport Modeller',
  'Seismic Data Analyst'
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

// ===== PROJECT DATA =====
const projectData = {
  thesis: {
    title: 'MS Thesis', icon: '🎓',
    projects: [
      {
        id: 'thesis-1',
        name: 'Reactive Transport Model for CO\u2082 Mineralisation in Malwa Plateau Basalts (Deccan Traps)',
        location: 'IISER Bhopal',
        skills: ['Python', 'PHREEQC', 'Kozeny-Carman', 'TST Kinetics'],
        supervisor: 'Prof. Jyotirmoy Mallik', date: '2024 \u2013 2026',
        description: 'Built a 1D Python-PHREEQC reactive transport model simulating CO\u2082 mineralisation, porewater chemistry evolution, and porosity-permeability coupling in Deccan basalts. Compared three CO\u2082 injection strategies \u2014 Single-burst, Continuous, and Pulsed WAG \u2014 validated against Wallula pilot project datasets. The model (GeoRTM) enables rapid screening of CO\u2082 mineralisation potential in mafic and ultramafic systems, contributing to two submitted manuscripts.',
        viewLink: null, githubLink: null, category: 'MS Thesis'
      }
    ]
  },
  seismology: {
    title: 'Seismology', icon: '\uD83C\uDF0A',
    projects: [
      {
        id: 'seismo-1',
        name: 'Seismic Anisotropy: Shear Wave Splitting',
        location: 'IISER Bhopal',
        skills: ['SplitLab 1.9.0', 'SAC', 'GMT', 'Seismic Analysis'],
        supervisor: 'IISER Bhopal', date: 'Jun \u2013 Aug 2024',
        description: 'Research internship focused on seismic anisotropy analysis. Processed seismic datasets and extended analysis to real observational data to interpret shear wave splitting parameters \u2014 fast polarisation direction and delay time. Results contributed to understanding mantle deformation and seismic anisotropy structures. Findings were presented as a guest lecture at KUAS, Kyoto, Japan (Jul 2025).',
        viewLink: null, githubLink: null, category: 'Seismology'
      },
      {
        id: 'seismo-2',
        name: 'Bhuj Earthquake Seismic Data Analysis',
        location: 'EarthScope Consortium',
        skills: ['Linux', 'Python', 'GMT', 'SAC'],
        supervisor: 'EarthScope Consortium', date: 'Jan \u2013 Sep 2024',
        description: 'Completed a 70-hour EarthScope Consortium online short course analysing the 2001 Gujarat Bhuj Earthquake. Used Linux command-line tools, Python scripting, Generic Mapping Tools (GMT), and Seismic Analysis Code (SAC) for end-to-end seismic data processing, event characterisation, and ground motion interpretation.',
        viewLink: 'https://nbviewer.org/urls/www.iris.edu/hq/files/short_courses/2020/ssb/bhuj_earthquake.ipynb',
        githubLink: null, category: 'Seismology'
      },
      {
        id: 'seismo-3',
        name: 'Pre-processing of Earthquake Data & Automatic Detection using Python',
        location: 'IISER Bhopal',
        skills: ['Python', 'STA/LTA', 'ObsPy', 'Anaconda'],
        supervisor: 'IISER Bhopal', date: 'May \u2013 Jul 2023',
        description: 'Designed a complete Python-based seismic data processing workflow using data from the IRIS network. Applied digital band-pass filters for noise reduction and implemented the Short-Term Average / Long-Term Average (STA/LTA) algorithm for automated, real-time earthquake event detection. The pipeline handles raw waveform ingestion through event identification.',
        viewLink: null, githubLink: null, category: 'Seismology'
      }
    ]
  },
  gis: {
    title: 'Remote Sensing & GIS', icon: '\uD83D\uDEF0\uFE0F',
    projects: [
      {
        id: 'gis-1',
        name: 'GIS & Drone Technology for Geospatial Analysis',
        location: 'Geovigyan',
        skills: ['QGIS', 'Google Earth Engine', 'Remote Sensing', 'Google Maps'],
        supervisor: 'Geovigyan', date: 'Dec 2023 \u2013 Jan 2024',
        description: 'Internship at Geovigyan focusing on applied geospatial analysis. Gained hands-on experience with QGIS for spatial data management, map creation, and geospatial visualisation. Used Google Maps and Google Earth Engine (GEE) for multi-temporal remote sensing image analysis and land-use interpretation. Explored drone-based data acquisition workflows for high-resolution terrain and surface mapping.',
        viewLink: null, githubLink: null, category: 'Remote Sensing & GIS'
      },
      {
        id: 'gis-2',
        name: 'Drought Monitoring using Remote Sensing Data',
        location: 'IISER Bhopal',
        skills: ['Python', 'Remote Sensing', 'Drought Indices', 'Spatiotemporal Analysis'],
        supervisor: 'Dr. Somil Swarnkar', date: 'April 2025',
        description: 'Assessed and monitored drought conditions in the Palamu region using multi-source remote sensing datasets. Estimated relationships between different drought indicators (SPI, NDVI-based indices, soil moisture) to evaluate severity. Conducted spatiotemporal pattern analysis to identify drought-prone areas, providing a framework for drought risk assessment and early warning applications in semi-arid zones.',
        viewLink: null, githubLink: null, category: 'Remote Sensing & GIS'
      }
    ]
  },
  sustainability: {
    title: 'Sustainability', icon: '\uD83C\uDF31',
    projects: [
      {
        id: 'sustain-1',
        name: 'Aerosols in Occupational Environments (Mining Industries)',
        location: 'IISER Bhopal',
        skills: ['Literature Review', 'Aerosol Characterisation', 'Air Quality Analysis'],
        supervisor: 'Dr. Ramya Sundar Raman', date: 'Nov 2024',
        description: 'Conducted a comprehensive review of aerosol characteristics and particle size distribution in mining environments. Assessed air quality and particulate matter (PM2.5 / PM10) emissions, linking aerosol behaviour to occupational health risks. Developed practical exposure mitigation and engineering control recommendations aligned with occupational safety standards.',
        viewLink: null, githubLink: null, category: 'Sustainability'
      },
      {
        id: 'sustain-2',
        name: 'Life Cycle Analysis of Mobile Phones',
        location: 'IISER Bhopal',
        skills: ['Life Cycle Assessment', 'ISO 14040/14044', 'GHG Quantification'],
        supervisor: 'Dr. Ramya Sundar Raman', date: 'April 2024',
        description: 'Performed a cradle-to-grave Life Cycle Analysis (LCA) of the Samsung A25 5G using the ISO 14040/14044 framework. Conducted life cycle inventory (LCI) and impact assessment (LCIA), quantifying GHG emissions, energy consumption, and critical resource flows across battery production, IC fabrication, and OLED display manufacturing. Identified key emission hotspots and evaluated sustainable material recovery pathways.',
        viewLink: null, githubLink: null, category: 'Sustainability'
      }
    ]
  },
  datascience: {
    title: 'Data Science', icon: '\uD83D\uDCCA',
    projects: [
      {
        id: 'ds-1',
        name: 'Sales Prediction & Analysis',
        location: 'IISER Bhopal',
        skills: ['Python', 'Scikit-learn', 'Gradient Boosting', 'Feature Engineering', 'Regression Modeling'],
        supervisor: 'Dr. Samiran Das', date: 'Nov 2024',
        description: 'Developed and benchmarked a suite of supervised machine learning models \u2014 Linear Regression, K-Nearest Neighbours, Decision Tree, Random Forest, and Gradient Boosting \u2014 for retail sales forecasting. Performed data preprocessing, feature engineering, and cross-validated model evaluation. Identified Gradient Boosting Regressor (GBR) as the most effective model with superior generalisation performance.',
        viewLink: null, githubLink: null, category: 'Data Science'
      }
    ]
  }
};

// ===== DRAWER & MODAL FUNCTIONS =====
function openDrawer(category) {
  const data = projectData[category];
  if (!data) return;

  document.getElementById('drawer-title').textContent = data.icon + ' ' + data.title;

  const content = document.getElementById('drawer-content');
  content.innerHTML = '';
  data.projects.forEach((proj, i) => {
    const card = document.createElement('div');
    card.className = 'proj-mini-card';
    card.style.animationDelay = (i * 0.09) + 's';

    const viewBtn = proj.viewLink
      ? `<a href="${proj.viewLink}" class="btn-view" target="_blank" rel="noopener" id="view-${proj.id}">View Project \u2197</a>`
      : `<button class="btn-view disabled" disabled id="view-${proj.id}">View Project</button>`;

    const githubBtn = proj.githubLink
      ? `<a href="${proj.githubLink}" class="btn-github" target="_blank" rel="noopener" id="github-${proj.id}">GitHub \u2197</a>`
      : `<button class="btn-github disabled" disabled id="github-${proj.id}">GitHub</button>`;

    card.innerHTML = `
      <div class="mini-title">${proj.name}</div>
      <div class="mini-location">${proj.location}</div>
      <div class="mini-skills">${proj.skills.map(s => `<span class="mini-skill">${s}</span>`).join('')}</div>
      <div class="mini-actions">
        <button class="btn-details" onclick="openModal('${proj.id}')" id="details-${proj.id}">More Details</button>
        ${viewBtn}
        ${githubBtn}
      </div>`;
    content.appendChild(card);
  });

  document.getElementById('drawer-overlay').classList.add('active');
  document.getElementById('proj-drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  document.getElementById('drawer-overlay').classList.remove('active');
  document.getElementById('proj-drawer').classList.remove('open');
  document.body.style.overflow = '';
}

function openModal(projectId) {
  let proj = null;
  for (const cat of Object.values(projectData)) {
    proj = cat.projects.find(p => p.id === projectId);
    if (proj) break;
  }
  if (!proj) return;

  const viewBtn = proj.viewLink
    ? `<a href="${proj.viewLink}" class="btn-view" target="_blank" rel="noopener">View Project \u2197</a>`
    : `<button class="btn-view disabled" disabled>View Project</button>`;

  const githubBtn = proj.githubLink
    ? `<a href="${proj.githubLink}" class="btn-github" target="_blank" rel="noopener">GitHub \u2197</a>`
    : `<button class="btn-github disabled" disabled>GitHub</button>`;

  document.getElementById('modal-body').innerHTML = `
    <div class="modal-cat-label">${proj.category}</div>
    <h2 class="modal-title">${proj.name}</h2>
    <div class="modal-meta">
      <span class="modal-meta-item">\uD83D\uDCCD ${proj.location}</span>
      <span class="modal-meta-item">\uD83D\uDDD3 ${proj.date}</span>
      <span class="modal-meta-item">\uD83D\uDC69\u200D\uD83D\uDD2C ${proj.supervisor}</span>
    </div>
    <p class="modal-desc">${proj.description}</p>
    <div class="modal-skills">${proj.skills.map(s => `<span class="modal-skill">${s}</span>`).join('')}</div>
    <div class="modal-actions">${viewBtn} ${githubBtn}</div>`;

  document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

// Keyboard: Escape closes modal then drawer; Enter/Space activates category cards
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('modal-overlay').classList.contains('active')) {
      closeModal();
    } else if (document.getElementById('proj-drawer').classList.contains('open')) {
      closeDrawer();
    }
  }
});
document.querySelectorAll('.proj-cat-card').forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
  });
});
