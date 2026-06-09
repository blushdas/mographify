#!/usr/bin/env node
'use strict';

const path = require('node:path');
const fs   = require('node:fs');
const { logo, step, ok, fail, spin, spinEnd, dim, resultBox, D, R, Y, W, B } = require('../lib/logo');
const { assertToolchain } = require('../lib/detect');
const { parseHtml } = require('../lib/parse');
const { record } = require('../lib/record');
const { qa }     = require('../lib/screenshot');

const args = process.argv.slice(2);
const cmd  = args[0];
const input = args[1] || args[0];

logo();

// ── help ──────────────────────────────────────────────
if (!cmd || cmd === '--help' || cmd === '-h') {
  console.log(`  ${W}${B}USAGE${R}

  ${Y}mographify record <file.html>${R}
    Record an existing mograph HTML → MP4

  ${Y}mographify qa <file.html>${R}
    Screenshot every scene for visual QA

  ${Y}mographify info <file.html>${R}
    Show scene count, duration, detected settings

  ${D}OPTIONS${R}
  ${D}  --out <dir>   Output directory (default: ~/Desktop)${R}
  ${D}  --help        Show this help${R}

  ${D}CLAUDE CODE SKILL${R}
  ${D}  Full pipeline (content brief → HTML → QA → MP4):${R}
  ${D}  Copy claude-skill/SKILL.md to ~/.claude/skills/mographify/${R}
  ${D}  Then: /mographify <paste your content brief>${R}
`);
  process.exit(0);
}

// ── parse flags ───────────────────────────────────────
const outFlag = args.indexOf('--out');
const outputDir = outFlag !== -1 ? args[outFlag + 1] : undefined;

// ── info ──────────────────────────────────────────────
if (cmd === 'info') {
  const htmlPath = path.resolve(input);
  if (!fs.existsSync(htmlPath)) { fail(`File not found: ${htmlPath}`); process.exit(1); }
  const { sceneCount, sceneDuration, exitDuration, movieMs } = parseHtml(htmlPath);
  step(`File:     ${htmlPath.replace(process.env.HOME, '~')}`);
  step(`Scenes:   ${sceneCount}`);
  step(`Duration: ${sceneDuration}ms per scene`);
  step(`Exit:     ${exitDuration}ms transition`);
  step(`Total:    ${(movieMs / 1000).toFixed(1)}s`);
  console.log('');
  process.exit(0);
}

// ── qa ────────────────────────────────────────────────
if (cmd === 'qa') {
  const htmlPath = path.resolve(input);
  if (!fs.existsSync(htmlPath)) { fail(`File not found: ${htmlPath}`); process.exit(1); }
  const toolchain = assertToolchain();

  const { sceneCount } = parseHtml(htmlPath);
  step(`Input: ${htmlPath.replace(process.env.HOME, '~')} (${sceneCount} scenes)`);
  console.log('');
  spin('Capturing screenshots');

  let scenes;
  try {
    scenes = qa(htmlPath, { pw: toolchain.pw });
  } catch (e) {
    process.stdout.write(' failed\n');
    fail(e.message);
    process.exit(1);
  }
  spinEnd();

  scenes.forEach(s => ok(`Scene ${s.scene} → ${s.path.replace(process.env.HOME, '~')}`));
  console.log('');
  dim(`Open screenshots to review, or pass to Claude for AI QA review.`);
  console.log('');
  process.exit(0);
}

// ── record ────────────────────────────────────────────
if (cmd === 'record') {
  const htmlPath = path.resolve(input);
  if (!fs.existsSync(htmlPath)) { fail(`File not found: ${htmlPath}`); process.exit(1); }
  const toolchain = assertToolchain();

  const { sceneCount, sceneDuration, exitDuration, movieMs } = parseHtml(htmlPath);

  step(`Input:    ${htmlPath.replace(process.env.HOME, '~')}`);
  step(`Scenes:   ${sceneCount} × ${(sceneDuration / 1000).toFixed(0)}s`);
  step(`Duration: ${(movieMs / 1000).toFixed(1)}s total`);
  step(`Output:   ${(outputDir || process.env.HOME + '/Desktop').replace(process.env.HOME, '~')}/`);
  console.log('');

  spin(`Recording ${(movieMs / 1000).toFixed(0)}s @ 60fps`);
  let result;
  try {
    result = record(htmlPath, { toolchain, outputDir });
  } catch (e) {
    process.stdout.write(' failed\n\n');
    fail(e.message);
    process.exit(1);
  }
  spinEnd();

  spin('Transcoding H.264');
  // (already done inside record() — spinEnd shows immediately)
  spinEnd();

  resultBox(result.mp4, result.mb, result.durationMs, result.scenes);
  process.exit(0);
}

fail(`Unknown command: ${cmd}  (run mographify --help)`);
process.exit(1);
