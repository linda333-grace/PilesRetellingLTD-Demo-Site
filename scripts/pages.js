/**
 * PILES RETELLING LTD — Subpage Interactive Tools & Simulators
 * Powers: Web Audio 8-Step Sequencer, Tech Benchmark & API Generator,
 * Brand Typography Sandbox, Venture Valuation Estimator, Academy Evaluator,
 * Project Configurator & FAQ Accordion.
 */

document.addEventListener('DOMContentLoaded', () => {
  initApiBenchmark();
  initBeatSequencer();
  initBrandTypographySandbox();
  initVentureCalculator();
  initAcademyEvaluator();
  initConfigurator();
  initFaqAccordion();
});

/* ==========================================================================
   1. TECHNOLOGY: LIVE API CODE GENERATOR & BENCHMARK
   ========================================================================== */
function initApiBenchmark() {
  const langBtns = document.querySelectorAll('[data-code-lang]');
  const codeBox = document.getElementById('apiTerminalCode');
  const runBtn = document.getElementById('runBenchmarkBtn');
  const latencyVal = document.getElementById('apiLatencyVal');

  if (!codeBox) return;

  const codeSnippets = {
    curl: `curl -X POST https://api.pilesretelling.com/v1/ventures/dispatch \\
  -H "Authorization: Bearer piles_live_sk_94827" \\
  -H "Content-Type: application/json" \\
  -d '{"fleet_id": "ug_kla_09", "task": "route_optimize", "ai_model": "piles-neural-v2"}'`,

    javascript: `import { PilesVentureSDK } from '@piles/engine';

const piles = new PilesVentureSDK({ apiKey: process.env.PILES_KEY });

const result = await piles.logistics.optimizeRoute({
  region: 'Kampala Metropolitan',
  telemetryStream: true,
  autoScaleFleet: true
});
console.log('Dispatch Assigned:', result.tripId);`,

    python: `from piles_retelling import PilesEngine

engine = PilesEngine(api_key="piles_live_sk_94827")
deployment = engine.autonomous_systems.launch_agent(
    model="neural-v2.1",
    parameters={"throughput": "10k_tps", "encryption": "aes_gcm_256"}
)
print(f"System Online: {deployment.cluster_ip}")`,

    swift: `import PilesCore

let client = PilesClient(token: "piles_live_sk_94827")
Task {
    let status = try await client.mobility.streamTelemetry(vehicleId: "UG-KLA-44")
    print("Telemetry 120Hz Latency: \\(status.latencyMs)ms")
}`
  };

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const lang = btn.getAttribute('data-code-lang');
      if (codeSnippets[lang]) {
        codeBox.textContent = codeSnippets[lang];
      }
    });
  });

  if (runBtn && latencyVal) {
    runBtn.addEventListener('click', () => {
      runBtn.textContent = 'Benchmarking...';
      setTimeout(() => {
        const ms = (Math.random() * 6 + 11).toFixed(1);
        latencyVal.textContent = `${ms}ms (Sub-second global edge)`;
        runBtn.textContent = 'Run Edge Benchmark';
      }, 500);
    });
  }
}

/* ==========================================================================
   2. PILES SOUNDS: 8-STEP WEB AUDIO SEQUENCER
   ========================================================================== */
function initBeatSequencer() {
  const startBtn = document.getElementById('startSequencerBtn');
  const stepButtons = document.querySelectorAll('.seq-step-btn');
  if (!startBtn || !stepButtons.length) return;

  let isSeqRunning = false;
  let currentStep = 0;
  let intervalId = null;
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playDrumSound(type) {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    if (type === 'kick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.35);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'snare') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'hihat') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'highpass' in osc ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(8000, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'synth') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const chord = [329.63, 392.00, 440.00, 523.25][currentStep % 4];
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(chord, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  }

  stepButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active-step');
    });
  });

  function stepClock() {
    stepButtons.forEach(b => b.classList.remove('playing-now'));

    const stepColButtons = document.querySelectorAll(`.seq-step-btn[data-step="${currentStep}"]`);
    stepColButtons.forEach(btn => {
      btn.classList.add('playing-now');
      if (btn.classList.contains('active-step')) {
        const track = btn.getAttribute('data-track');
        playDrumSound(track);
      }
    });

    currentStep = (currentStep + 1) % 8;
  }

  startBtn.addEventListener('click', () => {
    isSeqRunning = !isSeqRunning;
    if (isSeqRunning) {
      getAudioCtx();
      intervalId = setInterval(stepClock, 160);
      startBtn.textContent = 'Pause Beat Engine';
      startBtn.classList.add('btn-apple-primary');
    } else {
      clearInterval(intervalId);
      stepButtons.forEach(b => b.classList.remove('playing-now'));
      startBtn.textContent = 'Start Beat Engine';
    }
  });
}

/* ==========================================================================
   3. BRANDING: TYPOGRAPHY & SPECIMEN SANDBOX
   ========================================================================== */
function initBrandTypographySandbox() {
  const fontSelect = document.getElementById('specimenFontSelect');
  const sizeSlider = document.getElementById('specimenSizeSlider');
  const sampleText = document.getElementById('specimenSampleText');
  const weightSelect = document.getElementById('specimenWeightSelect');

  if (!sampleText) return;

  if (sizeSlider) {
    sizeSlider.addEventListener('input', (e) => {
      sampleText.style.fontSize = `${e.target.value}px`;
    });
  }

  if (weightSelect) {
    weightSelect.addEventListener('change', (e) => {
      sampleText.style.fontWeight = e.target.value;
    });
  }

  if (fontSelect) {
    fontSelect.addEventListener('change', (e) => {
      sampleText.style.fontFamily = e.target.value;
    });
  }
}

/* ==========================================================================
   4. VENTURES: VALUATION & TIMELINE CALCULATOR
   ========================================================================== */
function initVentureCalculator() {
  const stageSelect = document.getElementById('calcStageSelect');
  const techScopeSelect = document.getElementById('calcTechScope');
  const outputTimeline = document.getElementById('calcOutputTimeline');
  const outputModel = document.getElementById('calcOutputModel');

  if (!stageSelect || !outputTimeline) return;

  function recalculate() {
    const stage = stageSelect.value;
    const scope = techScopeSelect.value;

    let timeline = '90 Days to Live Market';
    let model = 'Full Turnkey Studio Incubation';

    if (stage === 'idea') {
      timeline = scope === 'enterprise' ? '120 Days (Concept to Enterprise Launch)' : '75 Days (Concept to Production MVP)';
      model = 'Turnkey Venture Co-Founding & Incubation';
    } else if (stage === 'scaling') {
      timeline = '45 Days (Architecture Modernization & Scale)';
      model = 'Venture Scaling & Growth Partnership';
    }

    outputTimeline.textContent = timeline;
    outputModel.textContent = model;
  }

  stageSelect.addEventListener('change', recalculate);
  techScopeSelect.addEventListener('change', recalculate);
}

/* ==========================================================================
   5. ACADEMY: ELIGIBILITY & COHORT EVALUATOR
   ========================================================================== */
function initAcademyEvaluator() {
  const form = document.getElementById('academyEvaluatorForm');
  const resultBox = document.getElementById('academyResultBox');
  if (!form || !resultBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    resultBox.style.display = 'block';
    resultBox.innerHTML = `
      <div style="background: rgba(48, 209, 88, 0.1); border: 1px solid rgba(48, 209, 88, 0.3); border-radius: 12px; padding: 20px; text-align: center;">
        <h4 style="color: #30d158; font-size: 18px; font-weight: 700; margin-bottom: 6px;">Eligibility Confirmed • 2026 Cohort</h4>
        <p style="color: #1d1d1f; font-size: 14px; margin-bottom: 14px;">Your profile matches our Innovation Fellowship track. Admissions team will dispatch prep materials via email.</p>
        <a href="contact.html" class="btn-apple-primary" style="display: inline-flex;">Complete Application Form ›</a>
      </div>
    `;
  });
}

/* ==========================================================================
   6. CONTACT: PROJECT CONFIGURATOR & BRIEF DISPATCH
   ========================================================================== */
function initConfigurator() {
  const chips = document.querySelectorAll('.service-option-chip');
  const form = document.getElementById('projectConfiguratorForm');
  const summaryEl = document.getElementById('configuratorSummary');

  if (!chips.length || !form) return;

  let selectedServices = ['Technology & Apps'];

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      const val = chip.getAttribute('data-service');
      
      if (chip.classList.contains('selected')) {
        if (!selectedServices.includes(val)) selectedServices.push(val);
      } else {
        selectedServices = selectedServices.filter(s => s !== val);
      }

      if (summaryEl) {
        summaryEl.textContent = selectedServices.length > 0
          ? selectedServices.join(', ')
          : 'Please select at least one capability';
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('clientName')?.value || 'Client';
    const email = document.getElementById('clientEmail')?.value || '';
    const phone = document.getElementById('clientPhone')?.value || '';
    const details = document.getElementById('projectNotes')?.value || '';

    const message = `Hello PILES Retelling! I'm interested in building a project with you:\n\nServices: ${selectedServices.join(', ')}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nDetails: ${details}`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/256700000000?text=${encoded}`;
    
    form.innerHTML = `
      <div style="text-align: center; padding: 36px 0;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(48, 209, 88, 0.15); color: #30d158; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px auto;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h3 style="font-size: 26px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.02em;">Project Brief Received</h3>
        <p style="color: #6e6e73; font-size: 15.5px; max-width: 440px; margin: 0 auto 28px auto; line-height: 1.5;">Thank you, ${name}. A PILES venture partner will review your requirements and reach out within 24 hours.</p>
        <a href="${whatsappUrl}" target="_blank" class="btn-apple-primary" style="display: inline-flex;">Continue on WhatsApp <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg></a>
      </div>
    `;
  });
}

/* ==========================================================================
   7. FAQ ACCORDION (Contact Page)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-question');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.toggle('active');
      const answer = item.querySelector('.faq-answer');
      if (answer) {
        answer.style.display = isOpen ? 'block' : 'none';
      }
    });
  });
}
