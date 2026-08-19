/**
 * PILES RETELLING LTD — Global Multimillion-Dollar Physics & Canvas Engine
 * Powers: Interactive Neural Particle Constellation, Cursor Spotlight Lighting,
 * 3D Holographic Card Tilt, Web Audio Synth Piano, Keynote Counters, Navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroParticleCanvas();
  initCursorSpotlight();
  initNavbarScroll();
  initMobileMenu();
  initDynamicPhysics();
  initLiveCounters();
  initMiniSynth();
  initBrandPalettePicker();
  initVentureSimulator();
  initTechTabs();
  initPilesAudioPlayer();
  initModals();
});

/* ==========================================================================
   1. HERO INTERACTIVE NEURAL PARTICLE CANVAS
   ========================================================================== */
function initHeroParticleCanvas() {
  const canvas = document.getElementById('heroParticleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  }, { passive: true });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
      this.baseAlpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion/glow
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 113, 227, ${this.baseAlpha})`;
      ctx.fill();
    }
  }

  const particleCount = Math.min(Math.floor(window.innerWidth / 16), 70);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Connect particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(41, 151, 255, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. CURSOR SPOTLIGHT LIGHTING EFFECT
   ========================================================================== */
function initCursorSpotlight() {
  const cards = document.querySelectorAll('.interactive-tilt-card, .spec-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   3. NAVBAR SCROLL & ACTIVE INDICATORS
   ========================================================================== */
function initNavbarScroll() {
  const nav = document.querySelector('.global-nav-container');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   4. MOBILE NAVIGATION
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('mobile-open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
  });
}

/* ==========================================================================
   5. 3D CARD PERSPECTIVE TILT
   ========================================================================== */
function initDynamicPhysics() {
  const heroWrapper = document.getElementById('heroVisualWrapper');
  const tiltCards = document.querySelectorAll('.interactive-tilt-card');

  window.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;

    if (heroWrapper) {
      heroWrapper.style.transform = `perspective(1200px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    }
  }, { passive: true });

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cardX = e.clientX - rect.left;
      const cardY = e.clientY - rect.top;
      const xPercent = (cardX / rect.width - 0.5) * 8;
      const yPercent = (cardY / rect.height - 0.5) * -8;

      card.style.transform = `perspective(1000px) rotateX(${yPercent}deg) rotateY(${xPercent}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   6. ANIMATED KEYNOTE STAT COUNTERS
   ========================================================================== */
function initLiveCounters() {
  const statNumbers = document.querySelectorAll('[data-counter]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseFloat(el.getAttribute('data-counter'));
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = targetVal % 1 !== 0;
        
        let startVal = 0;
        const duration = 1400;
        const startTime = performance.now();

        function updateCounter(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const current = startVal + (targetVal - startVal) * easeProgress;

          el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = targetVal + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  statNumbers.forEach(num => observer.observe(num));
}

/* ==========================================================================
   7. WEB AUDIO PIANO SYNTHESIZER
   ========================================================================== */
let globalAudioCtx = null;

function getAudioContext() {
  if (!globalAudioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    globalAudioCtx = new AudioContextClass();
  }
  if (globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume();
  }
  return globalAudioCtx;
}

function initMiniSynth() {
  const keys = document.querySelectorAll('.piano-key');
  if (!keys.length) return;

  function playSingleNote(frequency, keyEl) {
    const audioCtx = getAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.85);

    if (keyEl) {
      keyEl.classList.add('key-active');
      setTimeout(() => keyEl.classList.remove('key-active'), 250);
    }
  }

  keys.forEach(key => {
    key.addEventListener('mousedown', () => {
      const freq = parseFloat(key.getAttribute('data-note'));
      if (freq) playSingleNote(freq, key);
    });
  });

  const keyMap = {
    'a': 261.63,
    's': 293.66,
    'd': 329.63,
    'f': 349.23,
    'g': 392.00,
    'h': 440.00,
    'j': 493.88,
    'k': 523.25
  };

  window.addEventListener('keydown', (e) => {
    const keyLetter = e.key.toLowerCase();
    if (keyMap[keyLetter] && !e.repeat && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      const targetKeyEl = document.querySelector(`.piano-key[data-key="${keyLetter}"]`);
      playSingleNote(keyMap[keyLetter], targetKeyEl);
    }
  });
}

/* ==========================================================================
   8. BRAND PALETTE SWITCHER
   ========================================================================== */
function initBrandPalettePicker() {
  const swatches = document.querySelectorAll('.palette-swatch-btn');
  const brandImg = document.getElementById('brandingShowcaseImg');

  if (!swatches.length || !brandImg) return;

  const filters = {
    original: 'none',
    electric: 'hue-rotate(200deg) saturate(1.3)',
    amber: 'sepia(0.6) hue-rotate(330deg) saturate(1.6)',
    emerald: 'hue-rotate(90deg) saturate(1.4)'
  };

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const palette = swatch.getAttribute('data-palette');
      if (filters[palette]) {
        brandImg.style.filter = filters[palette];
      }
    });
  });
}

/* ==========================================================================
   9. VENTURE GROWTH SIMULATOR
   ========================================================================== */
const simulatorData = {
  1: {
    title: 'Phase 01: Concept Validation',
    desc: 'Interrogating market economics, user problem validation, and architecture blueprinting.',
    velocity: '0 – 30 Days',
    milestone: 'Architecture & UX',
    deliverable: 'System Blueprint',
    readiness: '25% (Validated)',
    color: '#2997ff'
  },
  2: {
    title: 'Phase 02: Full-Stack Engineering',
    desc: 'Engineering web/mobile software, training custom AI agents, and crafting brand identity.',
    velocity: '30 – 90 Days',
    milestone: 'Production MVP',
    deliverable: 'Tested Platform',
    readiness: '55% (Ready to Ship)',
    color: '#0071e3'
  },
  3: {
    title: 'Phase 03: Orchestrated Market Launch',
    desc: 'Go-to-market PR, sonic branding rollout, and aggressive acquisition campaigns.',
    velocity: '90 – 120 Days',
    milestone: 'User Acquisition',
    deliverable: 'Active Market Share',
    readiness: '80% (Launched)',
    color: '#bf5af2'
  },
  4: {
    title: 'Phase 04: Scale & Operations',
    desc: 'Automating enterprise systems, optimizing revenue loops, and scaling teams.',
    velocity: 'Day 120+',
    milestone: 'Sustainable Scale',
    deliverable: 'Autonomous Growth',
    readiness: '100% (Market Leader)',
    color: '#30d158'
  }
};

function initVentureSimulator() {
  const slider = document.getElementById('ventureTimelineSlider');
  const titleEl = document.getElementById('simPhaseTitle');
  const descEl = document.getElementById('simPhaseDesc');
  const velEl = document.getElementById('simVelocity');
  const mileEl = document.getElementById('simMilestone');
  const delivEl = document.getElementById('simDeliverable');
  const readEl = document.getElementById('simReadiness');

  if (!slider || !titleEl) return;

  function updateSimulator(val) {
    const data = simulatorData[val];
    if (!data) return;

    titleEl.textContent = data.title;
    descEl.textContent = data.desc;
    velEl.textContent = data.velocity;
    velEl.style.color = data.color;
    mileEl.textContent = data.milestone;
    delivEl.textContent = data.deliverable;
    readEl.textContent = data.readiness;
    readEl.style.color = data.color;
  }

  slider.addEventListener('input', (e) => {
    updateSimulator(e.target.value);
  });
}

/* ==========================================================================
   10. TECHNOLOGY TABS
   ========================================================================== */
const techData = {
  web: {
    badge: 'Web & Enterprise Platforms',
    title: 'High-Performance Web Applications',
    desc: 'From reactive client portals to mission-critical SaaS architectures. Engineered with sub-second response times, bank-grade encryption, and seamless database scaling.',
    bullets: [
      'Modern Single-Page & Server-Rendered Architectures',
      'Ultra-Fast Next-Gen Micro-frontends & API Gateways',
      'Integrated Stripe, Mobile Money & Crypto Checkout Flows',
      'Automated CI/CD Deployment Pipelines with 99.99% Uptime'
    ]
  },
  mobile: {
    badge: 'Native & Cross-Platform iOS/Android',
    title: 'Fluid Mobile Ecosystems',
    desc: 'Bespoke mobile experiences crafted with smooth 120Hz animations, real-time push notifications, offline caching, and instant biometric authentication.',
    bullets: [
      'Swift / Kotlin Native Performance & Flutter Cross-Platform',
      'Real-time Geolocation, Route Tracking & Fleet Telemetry',
      'In-App Subscriptions, Push Messaging & Secure Storage',
      'Zero-Latency WebSockets for Instant Chat & Transactions'
    ]
  },
  ai: {
    badge: 'AI & Autonomous Systems',
    title: 'Intelligent Enterprise Automation',
    desc: 'Custom fine-tuned LLM agents, predictive business analytics, intelligent dispatch algorithms, and document automation built directly into your workflow.',
    bullets: [
      'Tailored LLM Assistants & Knowledge Base Retrieval (RAG)',
      'Automated Customer Routing & Voice Intelligence',
      'Predictive Inventory & Revenue Forecasting Engines',
      'Autonomous Business Workflow Orchestration'
    ]
  },
  systems: {
    badge: 'Infrastructure & ERP Systems',
    title: 'Custom Business Operating Systems',
    desc: 'End-to-end ERPs, inventory tracking, multi-vendor marketplaces, and centralized financial dashboards tailored specifically to your organization.',
    bullets: [
      'Unified Multi-Branch Inventory & POS Synchronization',
      'Real-time Staff Performance & Payroll Automation',
      'Role-Based Granular Access Control & Security Auditing',
      'Custom Analytics Dashboards with Exportable Executive Reports'
    ]
  }
};

function initTechTabs() {
  const tabs = document.querySelectorAll('.tech-interactive-tabs .tab-btn');
  const badgeEl = document.getElementById('techPanelBadge');
  const titleEl = document.getElementById('techPanelTitle');
  const descEl = document.getElementById('techPanelDesc');
  const listEl = document.getElementById('techFeatureList');

  if (!tabs.length || !badgeEl || !titleEl || !descEl || !listEl) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const key = tab.getAttribute('data-tech');
      const data = techData[key];
      if (!data) return;

      badgeEl.textContent = data.badge;
      titleEl.textContent = data.title;
      descEl.textContent = data.desc;

      listEl.innerHTML = data.bullets.map(bullet => `
        <li>
          <svg class="check-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          <span>${bullet}</span>
        </li>
      `).join('');
    });
  });
}

/* ==========================================================================
   11. PILES SOUNDS AUDIO PLAYER
   ========================================================================== */
function initPilesAudioPlayer() {
  const canvas = document.getElementById('audioVisualizerCanvas');
  const playBtn = document.getElementById('playToggleBtn');
  if (!canvas || !playBtn) return;

  const ctx = canvas.getContext('2d');
  let isPlaying = false;
  let step = 0;

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.parentElement.clientHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function renderVisualizer() {
    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;

    ctx.clearRect(0, 0, width, height);

    const barCount = 48;
    const barWidth = (width - barCount * 3) / barCount;

    for (let i = 0; i < barCount; i++) {
      const x = i * (barWidth + 3);
      let barHeight;

      if (isPlaying) {
        const wave1 = Math.sin(step * 0.08 + i * 0.25);
        const wave2 = Math.cos(step * 0.04 + i * 0.15);
        barHeight = Math.abs(wave1 * 0.6 + wave2 * 0.4) * (height * 0.75) + 6;
      } else {
        barHeight = (Math.sin(i * 0.2) + 1.2) * 8 + 4;
      }

      const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
      gradient.addColorStop(0, '#2997ff');
      gradient.addColorStop(0.5, '#bf5af2');
      gradient.addColorStop(1, '#0071e3');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, height - barHeight, barWidth, barHeight, [3, 3, 0, 0]);
      ctx.fill();
    }

    step++;
    requestAnimationFrame(renderVisualizer);
  }

  renderVisualizer();

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    getAudioContext();
    playBtn.innerHTML = isPlaying
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
  });
}

/* ==========================================================================
   12. MODAL & SEARCH HANDLERS
   ========================================================================== */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('modal-open');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('modal-open');
  document.body.style.overflow = '';
}

function initModals() {
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      openModal(modalId);
    });
  });

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) closeModal(modal);
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.modal-open').forEach(modal => {
        closeModal(modal);
      });
    }
  });
}

