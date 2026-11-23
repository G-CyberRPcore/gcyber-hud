// G-CyberRPcore - Modern Cyberpunk HUD Logic
// High-tech status rings, dynamic tachometer, and Web Audio synthesizer

const CIRCUMFERENCE = 157.0; // 2 * Math.PI * 25

// --- SYNTHESIZED CYBERPUNK AUDIO CUES ---
let audioCtx = null;
function playCyberBeep(frequency = 880, duration = 0.08, type = 'sine') {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context allowed after user interaction
  }
}

// --- CLOCK TICK ---
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const el = document.getElementById('hud-clock');
  if (el) el.textContent = `${hours}:${minutes} NC-ST`;
}
setInterval(updateClock, 1000);
updateClock();

// --- GAUGE CALCULATIONS ---
function setGaugePercent(circleId, percent) {
  const circle = document.getElementById(circleId);
  if (!circle) return;

  const clamped = Math.max(0, Math.min(100, percent));
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;
  circle.style.strokeDashoffset = offset;
}

// --- SYNC CITIZEN HUD DATA ---
function updateHUD(data) {
  if (!data) return;

  // Currencies
  if (data.cash !== undefined) {
    document.getElementById('hud-cash').textContent = '$E ' + Number(data.cash).toLocaleString();
  }
  if (data.bank !== undefined) {
    document.getElementById('hud-bank').textContent = '$E ' + Number(data.bank).toLocaleString();
  }
  if (data.crypto !== undefined) {
    document.getElementById('hud-crypto').textContent = `${data.crypto} $CR`;
  }

  // Citizen Identity
  if (data.name) {
    document.getElementById('hud-citizen-name').textContent = data.name;
  }
  if (data.citizenid) {
    document.getElementById('hud-citizen-id').textContent = `#${data.citizenid}`;
  }
  if (data.job) {
    const jobBadge = document.getElementById('hud-job-badge');
    const jobName = typeof data.job === 'string' ? data.job : (data.job.label || data.job.name);
    jobBadge.textContent = jobName;

    // Apply color class
    jobBadge.className = 'badge-tag ' + (data.job.name || 'civilian');
  }

  // Health
  if (data.health !== undefined) {
    setGaugePercent('circle-health', data.health);
    const healthGauge = document.getElementById('gauge-health');
    if (data.health <= 25) {
      healthGauge.classList.add('critical-pulse');
    } else {
      healthGauge.classList.remove('critical-pulse');
    }
  }

  // Armor
  if (data.armor !== undefined) {
    setGaugePercent('circle-armor', data.armor);
  }

  // Hunger & Thirst
  if (data.hunger !== undefined) {
    setGaugePercent('circle-hunger', data.hunger);
  }
  if (data.thirst !== undefined) {
    setGaugePercent('circle-thirst', data.thirst);
  }

  // Stress / Cyberpsychosis
  if (data.stress !== undefined) {
    setGaugePercent('circle-stress', data.stress);
  }

  // Voice Range
  if (data.voiceRange) {
    const range = String(data.voiceRange).toLowerCase();
    const circleVoice = document.getElementById('circle-voice');
    if (range === 'whisper') {
      setGaugePercent('circle-voice', 33);
      circleVoice.style.stroke = '#22c55e'; // Green
    } else if (range === 'shout') {
      setGaugePercent('circle-voice', 100);
      circleVoice.style.stroke = '#ff003c'; // Crimson
    } else {
      setGaugePercent('circle-voice', 66);
      circleVoice.style.stroke = '#fcee0a'; // Yellow
    }
  }

  // Location / District
  if (data.location) {
    document.getElementById('hud-location').textContent = data.location.toUpperCase();
  }
}

// --- VEHICLE TELEMETRY & TACHOMETER ---
let currentRpm = 0;
function updateVehicleHUD(data) {
  const dash = document.getElementById('vehicle-dashboard');
  if (!data || !data.inVehicle) {
    dash.classList.remove('active');
    return;
  }

  dash.classList.add('active');

  // Digital Speed (KM/H)
  const speed = Math.round(data.speed || 0);
  document.getElementById('speed-number').textContent = String(speed).padStart(3, '0');

  // Gear Indicator
  const gear = data.gear || (speed === 0 ? 'P' : 'D');
  document.getElementById('gear-indicator').textContent = gear;

  // RPM Tachometer Bar
  const rpmPercent = Math.min(100, Math.max(10, (data.rpm || (speed / 2.5))));
  document.getElementById('rpm-fill').style.width = `${rpmPercent}%`;

  // Fuel / Battery
  const fuel = Math.round(data.fuel !== undefined ? data.fuel : 92);
  document.getElementById('veh-fuel-value').textContent = `${fuel}%`;

  // Seatbelt
  const beltEl = document.getElementById('veh-seatbelt-indicator');
  if (data.seatbelt) {
    beltEl.classList.remove('danger');
    beltEl.classList.add('active');
    beltEl.querySelector('span').textContent = '✔ BUCKLED';
  } else {
    beltEl.classList.remove('active');
    beltEl.classList.add('danger');
    beltEl.querySelector('span').textContent = '🔒 BELT';
  }
}

// --- TOAST NOTIFICATIONS ---
function showNotification(title, message, type = 'info') {
  const container = document.getElementById('hud-notifications');
  const toast = document.createElement('div');
  toast.className = `hud-toast ${type}`;

  const header = document.createElement('div');
  header.className = 'toast-header-text';
  header.textContent = title;

  const msg = document.createElement('div');
  msg.className = 'toast-message-text';
  msg.textContent = message;

  toast.appendChild(header);
  toast.appendChild(msg);
  container.appendChild(toast);

  // Play Cyberpunk audio cue
  if (type === 'error' || type === 'dispatch') {
    playCyberBeep(320, 0.12, 'sawtooth');
  } else {
    playCyberBeep(980, 0.08, 'sine');
  }

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(120%)';
    toast.style.transition = 'all 0.35s ease';
    setTimeout(() => toast.remove(), 350);
  }, 4800);
}

// --- SETTINGS MODAL & CUSTOMIZATION ---
function toggleSettingsModal(open) {
  const modal = document.getElementById('hud-settings-modal');
  if (open) {
    modal.classList.add('active');
  } else {
    modal.classList.remove('active');
    if (window.mp && mp.events) {
      mp.events.emit('g-cyber:hud:closeSettings');
    }
  }
}

function toggleCinematicMode(active) {
  if (active) {
    document.body.classList.add('cinematic-active');
  } else {
    document.body.classList.remove('cinematic-active');
  }
}

function toggleGauge(gaugeId, show) {
  const el = document.getElementById(gaugeId);
  if (el) el.style.display = show ? 'flex' : 'none';
}

function toggleAutoFade(enabled) {
  // Option to hide health/armor when at 100%
}

// --- CYBERMP EVENT RECEIVERS ---
if (window.mp && mp.events) {
  mp.events.on('g-cyber:hud:sync', (data) => updateHUD(data));
  mp.events.on('g-cyber:hud:vehicle', (data) => updateVehicleHUD(data));
  mp.events.on('g-cyber:hud:notify', (title, message, type) => showNotification(title, message, type));
  mp.events.on('g-cyber:hud:openSettings', () => toggleSettingsModal(true));
  mp.events.on('g-cyber:hud:voiceActive', (speaking) => {
    const waves = document.getElementById('voice-waves');
    if (speaking) waves.classList.add('is-speaking');
    else waves.classList.remove('is-speaking');
  });
}

// Initial demonstration setup
updateHUD({
  name: 'Valerie Street',
  citizenid: 'NC-481924',
  cash: 5000,
  bank: 25000,
  crypto: 150,
  job: { name: 'civilian', label: 'Civilian Citizen' },
  health: 100,
  armor: 85,
  hunger: 90,
  thirst: 75,
  stress: 15,
  voiceRange: 'normal',
  location: 'Watson // Little China'
});
