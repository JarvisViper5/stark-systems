/* ============================================
   STARK SYSTEMS — OpenClaw integration server

   Zero-dependency static server + live telemetry API.

   Security posture (deliberate):
   - Binds 127.0.0.1 ONLY. This HUD is a local status
     display; never expose it to the LAN.
   - No auth tokens are read or served. The gateway is
     only probed via its public /health endpoint.
   - No agent control surface: the API is read-only.
   ============================================ */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFile } = require('child_process');

const HOST = '127.0.0.1';
const PORT = parseInt(process.env.PORT || '9977', 10);
const ROOT = path.join(__dirname, '..');
const GATEWAY_HEALTH_URL =
  process.env.GATEWAY_HEALTH_URL || 'http://127.0.0.1:18789/health';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.woff2': 'font/woff2',
};

/* --- Cached once at startup (values never change while running) --- */
let osVersion = os.type() + ' ' + os.release();
let openclawVersion = null;

execFile('sw_vers', ['-productVersion'], (err, stdout) => {
  if (!err && stdout.trim()) osVersion = 'macOS ' + stdout.trim();
});
execFile('openclaw', ['--version'], { timeout: 10000 }, (err, stdout) => {
  if (err) return;
  const line = stdout
    .split('\n')
    .map((l) => l.trim())
    .find((l) => /^OpenClaw \d/.test(l));
  if (line) openclawVersion = line;
});

function lanIPv4() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return '127.0.0.1';
}

async function gatewayHealth() {
  try {
    const res = await fetch(GATEWAY_HEALTH_URL, {
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return { reachable: false };
    const body = await res.json().catch(() => ({}));
    return { reachable: body.ok === true, status: body.status || 'unknown' };
  } catch (e) {
    return { reachable: false };
  }
}

async function apiStatus(res) {
  const gateway = await gatewayHealth();
  const total = os.totalmem();
  const payload = {
    host: os.hostname(),
    ip: lanIPv4(),
    os: osVersion,
    openclaw: openclawVersion,
    uptimeSec: os.uptime(),
    load1: os.loadavg()[0],
    cores: os.cpus().length,
    memUsedPct: Math.round(((total - os.freemem()) / total) * 100),
    gateway,
    time: new Date().toISOString(),
  };
  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(payload));
}

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream',
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET') {
    res.writeHead(405);
    return res.end('Method not allowed');
  }
  if (req.url.split('?')[0] === '/api/status') return apiStatus(res);
  serveStatic(req, res);
});

server.listen(PORT, HOST, () => {
  console.log(`STARK SYSTEMS online at http://${HOST}:${PORT}`);
});
