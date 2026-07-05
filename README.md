# STARK SYSTEMS — AI Command Interface

A cinematic AI interface inspired by Iron Man's J.A.R.V.I.S. HUD. Built with pure HTML, CSS, and vanilla JavaScript — no frameworks.

![Stark Systems Interface](https://img.shields.io/badge/Status-Online-00d4ff?style=for-the-badge)

## 🎬 Concept

This project recreates the feeling of a futuristic holographic command system. It features a cinematic boot sequence, an animated arc reactor centerpiece, floating HUD panels with live data, and interactive elements — all rendered in the browser with zero dependencies.

As of v1.1 it is also a working **OpenClaw status display**: served by the bundled zero-dependency Node server, the panels show live host and gateway telemetry instead of movie props (see [OpenClaw Integration](#-openclaw-integration)). Opened as a plain static page, it falls back to the original cinematic fake data.

## 🛠 Technologies

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, animations, transforms, backdrop-filter, responsive design
- **Vanilla JavaScript** — DOM manipulation, `requestAnimationFrame`, Web Audio API

## 📁 Folder Structure

```
stark-systems/
├── index.html          # Main entry point
├── css/
│   └── style.css       # All styles, organized by section
├── js/
│   └── script.js       # Boot sequence, animations, live telemetry
├── server/
│   └── index.js        # Zero-dep local server + /api/status (OpenClaw)
├── deploy/             # macOS LaunchAgent example
├── assets/             # Optional sound files
├── SKILL.md            # OpenClaw skill manifest
└── README.md           # This file
```

## 🚀 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/jarvis-openclaw-assistant/stark-systems.git
   ```
2. With live telemetry (recommended):
   ```bash
   cd stark-systems
   node server/index.js
   # open http://127.0.0.1:9977
   ```
   Or open `index.html` directly in a browser for the original static demo — no server, cinematic fake data only.

## 🦾 OpenClaw Integration

Install as an [OpenClaw](https://github.com/openclaw/openclaw) workspace skill:

```bash
git clone https://github.com/jarvis-openclaw-assistant/stark-systems.git \
  ~/.openclaw/workspace/skills/stark-systems
node ~/.openclaw/workspace/skills/stark-systems/server/index.js
```

To keep it running at login, use the LaunchAgent example in `deploy/`.

When served this way the HUD goes live:

| Panel | Live source |
|---|---|
| **System Status** | OpenClaw gateway `/health` (Core Online/OFFLINE, Integrity), real host uptime |
| **Energy Output** | CPU load (1-min average vs. cores) + memory usage |
| **Host System** | Hostname, LAN address, OS version |
| **System Messages** | Gateway link established / lost announcements |

Environment variables: `PORT` (default `9977`), `GATEWAY_HEALTH_URL` (default `http://127.0.0.1:18789/health`).

**Security:** the server binds `127.0.0.1` only, reads no tokens or secrets, and exposes no agent control surface — it is strictly a read-only display. Do not bind it to the LAN.

## 🌐 Live Demo

👉 [View on GitHub Pages](https://jarvis-openclaw-assistant.github.io/stark-systems/)

## ✨ Features

| Feature | Description |
|---|---|
| **Boot Sequence** | Cinematic typing animation with progress bar |
| **Arc Reactor** | Rotating ring (rAF-driven), pulsing core, radial glow |
| **HUD Panels** | 4 floating panels with staggered slide-in animations |
| **Live Telemetry** | Real gateway health, uptime, CPU/memory, host info via `/api/status` |
| **Live Clock** | Real-time digital clock |
| **System Messages** | Rotating status messages every 5 seconds |
| **Engage AI** | Interactive button — reactor intensifies, panels brighten |
| **Theme Toggle** | Cycle between Blue, Red, and Gold color schemes |
| **System Failure** | Hidden easter egg — press F three times to trigger |
| **UI Sounds** | Subtle synthesized audio feedback (Web Audio API) |
| **Responsive** | Adapts from desktop to mobile |

## 📸 Screenshot

> _Replace with an actual screenshot after deployment._

```
[Screenshot placeholder — capture the interface after boot completes]
```

## 🎥 Demo

> _Add a screen recording link or GIF after deployment._

## 📄 License

MIT
