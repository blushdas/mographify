'use strict';

const fs   = require('node:fs');
const path = require('node:path');
const os   = require('node:os');
const { execSync } = require('node:child_process');

function findPlaywright() {
  // 1. Installed as project/global dependency
  try { return require.resolve('playwright'); } catch {}

  // 2. Scan npx cache (macOS ~/.npm/_npx/*)
  const npxCache = path.join(os.homedir(), '.npm', '_npx');
  if (fs.existsSync(npxCache)) {
    for (const hash of fs.readdirSync(npxCache)) {
      const p = path.join(npxCache, hash, 'node_modules', 'playwright');
      if (fs.existsSync(p)) return p;
    }
  }

  // 3. Common global paths
  for (const p of [
    '/usr/local/lib/node_modules/playwright',
    '/opt/homebrew/lib/node_modules/playwright',
    path.join(os.homedir(), '.local', 'lib', 'node_modules', 'playwright'),
  ]) {
    if (fs.existsSync(p)) return p;
  }

  return null;
}

function findFfmpeg() {
  try { return execSync('which ffmpeg', { encoding: 'utf8', stdio: ['pipe','pipe','pipe'] }).trim(); } catch {}
  for (const p of ['/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg', '/usr/bin/ffmpeg']) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function assertToolchain() {
  const pw = findPlaywright();
  const ff = findFfmpeg();
  const missing = [];
  if (!pw) missing.push('playwright  →  npm install -g playwright && npx playwright install chromium');
  if (!ff) missing.push('ffmpeg      →  brew install ffmpeg');
  if (missing.length) {
    console.error('\n  Missing dependencies:\n');
    missing.forEach(m => console.error('    ' + m));
    console.error('');
    process.exit(1);
  }
  return { pw, ff };
}

module.exports = { findPlaywright, findFfmpeg, assertToolchain };
