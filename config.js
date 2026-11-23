// gcyber-hud - Central Configuration File
// Decoupled resource configuration for G-CyberRPcore

module.exports = {
  // HUD Display & Layout
  display: {
    theme: 'neon-cyberpunk', // 'neon-cyberpunk' | 'minimal'
    cinematicBars: false,
    showClock: true,
    showLocation: true,
    showCurrency: true,
    showIdentity: true
  },

  // Gauge Suite Settings
  gauges: {
    health: { enabled: true, color: '#00ff75' },
    armor: { enabled: true, color: '#00f0ff' },
    hunger: { enabled: true, color: '#fcee0a' },
    thirst: { enabled: true, color: '#00b4d8' },
    stress: { enabled: true, color: '#ff003c' },
    voice: { enabled: true, defaultRange: 'normal' }
  },

  // Survival Metabolism Settings
  metabolism: {
    enabled: true,
    intervalMs: 60000, // Check and degrade every 60 seconds
    hungerDrain: 1,
    thirstDrain: 1,
    damageOnStarvation: 2
  },

  // Vehicle Telemetry
  vehicle: {
    speedometerUnit: 'KMH', // 'KMH' | 'MPH'
    refreshRateMs: 100,
    enableSeatbeltWarning: true
  }
};
