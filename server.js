// G-CyberRPcore - Modern Cyberpunk HUD Server Module
// Manages survival metabolism routines (Hunger, Thirst, Stress)

console.log('[g-cyber-hud] Server HUD module initializing...');

// Metabolism Degradation Loop (Every 60 seconds)
setInterval(() => {
  if (!global.G_CyberCore) return;

  global.G_CyberCore.Functions.GetPlayers().forEach(player => {
    const meta = player.PlayerData.metadata;
    if (!meta || meta.isDead || meta.isDowned) return;

    // Slowly reduce hunger and thirst
    let hunger = Math.max(0, (meta.hunger || 100) - 1);
    let thirst = Math.max(0, (meta.thirst || 100) - 1);

    player.PlayerData.metadata.hunger = hunger;
    player.PlayerData.metadata.thirst = thirst;

    // Starvation / Dehydration health penalty
    if (hunger <= 0 || thirst <= 0) {
      const currentHealth = player.mp.health || 100;
      player.mp.health = Math.max(10, currentHealth - 2);
      player.Notify('Physical Exhaustion', 'You are severely dehydrated or starving! Find sustenance immediately.', 'error');
    }

    player.SyncHUD();
  });
}, 60 * 1000);

console.log('[g-cyber-hud] Survival metabolism routines active.');
