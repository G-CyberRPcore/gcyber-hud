// G-CyberRPcore - Modern Cyberpunk HUD Client Module
// Manages real-time vehicle telemetry, voice range hooks, and CEF interface

mp.cef.setUrl('./ui/index.html');

let seatbeltBuckled = false;
let cinematicActive = false;

// Toggle HUD Settings Menu
mp.commands.add('hudmenu', () => {
  mp.cef.setFocus(true, true);
  mp.events.emitCef('g-cyber:hud:openSettings');
});

// Toggle Cinematic Letterbox
mp.commands.add('cinematic', () => {
  cinematicActive = !cinematicActive;
  mp.events.emitCef('g-cyber:hud:toggleCinematic', cinematicActive);
});

// Toggle Seatbelt
mp.commands.add('seatbelt', () => {
  const localPlayer = mp.players.local;
  if (!localPlayer || !localPlayer.vehicle || localPlayer.vehicle.id === 0) return;

  seatbeltBuckled = !seatbeltBuckled;
  const statusMsg = seatbeltBuckled ? 'Seatbelt buckled.' : 'Seatbelt unbuckled!';
  mp.events.emitCef('g-cyber:hud:notify', 'Vehicle Safety', statusMsg, seatbeltBuckled ? 'success' : 'warning');
});

// Release mouse focus when settings modal closes
mp.events.onCef('g-cyber:hud:closeSettings', () => {
  mp.cef.setFocus(false, false);
});

// Forward HUD Sync Packets from Server to CEF
mp.events.onServer('g-cyber:client:syncHUD', (data) => {
  mp.events.emitCef('g-cyber:hud:sync', data);
});

// Forward Notifications from Server to CEF
mp.events.onServer('g-cyber:client:notify', (title, message, type = 'info') => {
  mp.events.emitCef('g-cyber:hud:notify', title, message, type);
});

// Vehicle Telemetry Sync Loop (Every 100ms)
setInterval(() => {
  const localPlayer = mp.players.local;
  if (!localPlayer) return;

  if (localPlayer.vehicle && localPlayer.vehicle.id !== 0) {
    const veh = localPlayer.vehicle;
    const vel = veh.velocity || [0, 0, 0];
    const speed = Math.sqrt(vel[0] * vel[0] + vel[1] * vel[1] + vel[2] * vel[2]) * 3.6;

    // Approximate gear based on speed
    let gear = '1';
    if (speed > 160) gear = '6';
    else if (speed > 120) gear = '5';
    else if (speed > 80) gear = '4';
    else if (speed > 50) gear = '3';
    else if (speed > 25) gear = '2';
    else if (speed < 1) gear = 'P';

    // Simulated RPM rev curve
    const rpm = Math.min(100, (speed % 40) * 2.5 + 20);

    mp.events.emitCef('g-cyber:hud:vehicle', {
      inVehicle: true,
      speed: speed,
      gear: gear,
      rpm: rpm,
      fuel: 88,
      seatbelt: seatbeltBuckled
    });
  } else {
    seatbeltBuckled = false;
    mp.events.emitCef('g-cyber:hud:vehicle', { inVehicle: false });
  }
}, 100);

console.log('[g-cyber-hud] Modular HUD Client initialized.');
