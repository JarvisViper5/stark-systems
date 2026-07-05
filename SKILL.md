---
name: stark-systems
description: Stark Industries HUD status display for OpenClaw — cinematic arc-reactor interface showing live host and gateway telemetry. Localhost-only web UI. Use when you want a JARVIS-style status screen for the machine running the agent.
metadata: {"openclaw":{"emoji":"⚛️","version":"1.1.0","requires":{"bins":["node"]},"homepage":"https://github.com/jarvis-openclaw-assistant/stark-systems"}}
---

# ⚛️ STARK SYSTEMS

A cinematic arc-reactor HUD that doubles as a real status display for the
OpenClaw host: live gateway health, host uptime, CPU load, memory, and
host identity — wrapped in the boot sequence, themes, and sound design of
the original demo.

## Run

```bash
node server/index.js
```

Open http://127.0.0.1:9977

No dependencies, no build step. `PORT` and `GATEWAY_HEALTH_URL` env vars
override the defaults (port 9977, `http://127.0.0.1:18789/health`).

## Run at login (macOS LaunchAgent)

Copy `deploy/ai.openclaw.stark-systems.plist.example` to
`~/Library/LaunchAgents/ai.openclaw.stark-systems.plist`, fix the paths
for your machine, then:

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/ai.openclaw.stark-systems.plist
```

## Security

- The server binds **127.0.0.1 only** — it is a local display, never
  expose it to the LAN.
- Read-only: no auth tokens are read or served, and there is no agent
  control surface. The gateway is only probed via its public `/health`
  endpoint.
- Opened as a plain static page (no server), the HUD falls back to its
  original cinematic fake data.
