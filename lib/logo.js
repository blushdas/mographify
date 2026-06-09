'use strict';

const Y  = '\x1b[93m';   // bright yellow ~#FEF09A
const W  = '\x1b[97m';   // bright white
const D  = '\x1b[2m';    // dim
const B  = '\x1b[1m';    // bold
const R  = '\x1b[0m';    // reset
const G  = '\x1b[92m';   // green
const RD = '\x1b[91m';   // red
const C  = '\x1b[96m';   // cyan

const { version } = require('../package.json');

function logo() {
  console.log(`
${Y}${B}  MOGRAPHIFY${R}  ${D}v${version}${R}
${Y}  ──────────────${R}
${D}  content → visual → 1080p 60fps MP4${R}
`);
}

function step(msg)    { console.log(`  ${Y}◆${R} ${msg}`); }
function ok(msg)      { console.log(`  ${G}✓${R} ${msg}`); }
function fail(msg)    { console.log(`  ${RD}✗${R} ${msg}`); }
function spin(msg)    { process.stdout.write(`  ${C}⟳${R} ${msg}...`); }
function spinEnd()    { process.stdout.write(` done\n`); }
function dim(msg)     { console.log(`  ${D}${msg}${R}`); }

function resultBox(mp4, mb, duration, scenes) {
  const p = mp4.replace(process.env.HOME, '~');
  const line1 = ` ${p}`;
  const line2 = ` ${mb} · ${(duration / 1000).toFixed(1)}s · 60fps · 1080×1920`;
  const w = Math.max(line1.length, line2.length) + 2;
  const bar = '─'.repeat(w);
  console.log(`
${Y}  ┌${bar}┐${R}
${Y}  │${R}${W}${B}${line1.padEnd(w)}${R}${Y}│${R}
${Y}  │${R}${D}${line2.padEnd(w)}${R}${Y}│${R}
${Y}  └${bar}┘${R}
`);
}

module.exports = { logo, step, ok, fail, spin, spinEnd, dim, resultBox, Y, W, D, B, R, G, RD, C };
