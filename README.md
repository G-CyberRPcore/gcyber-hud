# gcyber-hud
**Modular Cyberpunk HUD & Survival Metabolism Resource for G-CyberRPcore (CyberMP / Cyberpunk 2077)**

A futuristic in-game HUD interface featuring high-tech circular dials, dynamic spatial voice monitor, vehicle telemetry/speedometer, currency trackers, and server-side metabolism routines.

---

## Features
- **Neural HUD**: Real-time display of citizen name, ID, job badge, cash, bank balance, and crypto assets.
- **Circular Status Dials**: High-precision SVG circular gauges for Health, Armor, Hunger, Thirst, and Stress.
- **Dynamic Spatial Voice Gauge**: Visual feedback for voice chat volume ranges (Whisper, Normal, Shout).
- **Vehicle HUD**: Dynamic speedometer (KMH/MPH), RPM tachometer, gear indicators, and functional seatbelt (`B`).
- **Cinematic Mode**: Toggleable letterbox cinema mode (`/cinematic`).
- **HUD Settings Menu**: In-game customization panel (`/hudmenu`).

---

## Installation
1. Place `gcyber-hud` inside your server's `resources/` directory:
   ```
   D:\cybermpserver\resources\gcyber-hud\
   ```
2. Add `gcyber-hud` to your `server.toml`:
   ```toml
   resources = [
     "G-CyberRPcore",
     "gcyber-hud"
   ]
   ```

---

## License
MIT License. Part of the **G-CyberRPcore** ecosystem.
