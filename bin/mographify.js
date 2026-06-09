#!/usr/bin/env node
'use strict';

const path = require('node:path');
const fs   = require('node:fs');
const os   = require('node:os');
const { logo, step, ok, fail, spin, spinEnd, dim, resultBox, Y, W, B, R, D, G } = require('../lib/logo');
const { assertToolchain } = require('../lib/detect');
const { parseHtml } = require('../lib/parse');
const { record }    = require('../lib/record');
const { qa }        = require('../lib/screenshot');
const { assemble }  = require('../lib/assemble');
const { list }      = require('../lib/templates/index');

const args = process.argv.slice(2);
const cmd  = args[0];

logo();

// ── help ──────────────────────────────────────────────────────────────────────
if (!cmd || cmd === '--help' || cmd === '-h') {
  console.log(`  ${W}${B}USAGE${R}

  ${Y}mographify assemble <plan.json>${R}            JSON plan → HTML
  ${Y}mographify record   <file.html>${R}            HTML → MP4
  ${Y}mographify qa       <file.html>${R}            screenshot every scene
  ${Y}mographify info     <file.html>${R}            show metadata
  ${Y}mographify templates${R}                       list available templates

  ${D}FLAGS (assemble + record)${R}
  ${D}  --out <dir>       output directory (default: ~/Desktop)${R}
  ${D}  --duration <sec>  override seconds per scene (default: plan value or 10)${R}
  ${D}  --exit <sec>      override exit transition (default: 1.2)${R}
  ${D}  --accent <hex>    override accent color (default: pillar auto-detect)${R}
  ${D}  --pillar <name>   force pillar: build mindset process content strategy${R}

  ${D}CLAUDE CODE SKILL${R}
  ${D}  Copy claude-skill/SKILL.md to ~/.claude/skills/mographify/SKILL.md${R}
  ${D}  Then: /mographify  (paste content brief)${R}
`);
  process.exit(0);
}

// ── shared flag parsing ────────────────────────────────────────────────────────
function flag(name) {
  const i = args.indexOf('--' + name);
  return i !== -1 ? args[i + 1] : null;
}
function hasFlag(name) { return args.includes('--' + name); }

const outDir    = flag('out');
const durOverride = flag('duration') ? parseFloat(flag('duration')) * 1000 : null;
const exitOverride = flag('exit')    ? parseFloat(flag('exit')) * 1000 : null;
const accentOverride = flag('accent');
const pillarOverride = flag('pillar');

// ── templates ─────────────────────────────────────────────────────────────────
if (cmd === 'templates') {
  const { PALETTES } = require('../lib/palettes');
  console.log(`  ${W}${B}TEMPLATES  (${list().length} available)${R}\n`);
  list().forEach(t => {
    console.log(`  ${Y}${t.id}${R}`);
    console.log(`  ${D}${t.description}${R}`);
    console.log(`  ${D}slots: ${t.slots.join(', ')}${R}`);
    console.log('');
  });
  console.log(`  ${W}${B}PILLARS${R}\n`);
  Object.entries(PALETTES).forEach(([k, p]) => {
    console.log(`  ${p.ansi}${k}${R}  ${D}${p.color}${R}`);
  });
  console.log('');
  process.exit(0);
}

// ── info ──────────────────────────────────────────────────────────────────────
if (cmd === 'info') {
  const htmlPath = path.resolve(args[1]);
  if (!fs.existsSync(htmlPath)) { fail(`File not found: ${htmlPath}`); process.exit(1); }
  const { sceneCount, sceneDuration, exitDuration, movieMs } = parseHtml(htmlPath);
  step(`File:     ${htmlPath.replace(os.homedir(), '~')}`);
  step(`Scenes:   ${sceneCount}`);
  step(`Duration: ${sceneDuration / 1000}s per scene`);
  step(`Exit:     ${exitDuration / 1000}s transition`);
  step(`Total:    ${(movieMs / 1000).toFixed(1)}s`);
  console.log('');
  process.exit(0);
}

// ── assemble ──────────────────────────────────────────────────────────────────
if (cmd === 'assemble') {
  const jsonPath = path.resolve(args[1]);
  if (!fs.existsSync(jsonPath)) { fail(`File not found: ${jsonPath}`); process.exit(1); }

  let plan;
  try { plan = JSON.parse(fs.readFileSync(jsonPath, 'utf8')); }
  catch (e) { fail(`Invalid JSON: ${e.message}`); process.exit(1); }

  // Apply flag overrides
  if (durOverride)   plan.duration     = durOverride;
  if (exitOverride)  plan.exitDuration = exitOverride;
  if (accentOverride) plan.accent      = accentOverride;
  if (pillarOverride) {
    const { PALETTES } = require('../lib/palettes');
    if (!PALETTES[pillarOverride]) { fail(`Unknown pillar: ${pillarOverride}. Use: ${Object.keys(PALETTES).join(' ')}`); process.exit(1); }
    plan.accent = PALETTES[pillarOverride].color;
    plan.pillar = pillarOverride;
  }

  step(`Plan:   ${jsonPath.replace(os.homedir(), '~')}`);
  step(`Scenes: ${plan.scenes?.length || 0}`);
  step(`Pillar: ${plan.pillar || 'default'}  accent: ${plan.accent || '#FEF09A'}`);
  console.log('');

  let htmlPath;
  try {
    const dest = outDir ? path.join(outDir, path.basename(jsonPath, '.json') + '.html') : undefined;
    htmlPath = assemble(plan, dest);
  } catch (e) {
    fail(e.message);
    process.exit(1);
  }

  ok(`HTML → ${htmlPath.replace(os.homedir(), '~')}`);
  console.log('');
  dim(`Next: mographify qa ${htmlPath}`);
  dim(`      mographify record ${htmlPath}`);
  console.log('');
  process.exit(0);
}

// ── qa ────────────────────────────────────────────────────────────────────────
if (cmd === 'qa') {
  const htmlPath = path.resolve(args[1]);
  if (!fs.existsSync(htmlPath)) { fail(`File not found: ${htmlPath}`); process.exit(1); }
  const toolchain = assertToolchain();
  const { sceneCount } = parseHtml(htmlPath);
  step(`Input: ${htmlPath.replace(os.homedir(), '~')} (${sceneCount} scenes)`);
  console.log('');
  spin('Capturing screenshots');
  let scenes;
  try { scenes = qa(htmlPath, { pw: toolchain.pw }); }
  catch (e) { process.stdout.write(' failed\n'); fail(e.message); process.exit(1); }
  spinEnd();
  scenes.forEach(s => ok(`Scene ${s.scene} → ${s.path.replace(os.homedir(), '~')}`));
  console.log('');
  process.exit(0);
}

// ── record ────────────────────────────────────────────────────────────────────
if (cmd === 'record') {
  const htmlPath = path.resolve(args[1]);
  if (!fs.existsSync(htmlPath)) { fail(`File not found: ${htmlPath}`); process.exit(1); }
  const toolchain = assertToolchain();

  // Apply overrides by patching the HTML in a temp copy
  let finalHtmlPath = htmlPath;
  if (durOverride || exitOverride) {
    let src = fs.readFileSync(htmlPath, 'utf8');
    if (durOverride)  src = src.replace(/const DURATION=\d+/, `const DURATION=${durOverride}`);
    if (exitOverride) src = src.replace(/EXIT_DURATION=\d+/, `EXIT_DURATION=${exitOverride}`);
    finalHtmlPath = path.join(os.tmpdir(), 'mographify-override.html');
    fs.writeFileSync(finalHtmlPath, src);
  }

  const { sceneCount, sceneDuration, exitDuration, movieMs } = parseHtml(finalHtmlPath);
  step(`Input:    ${htmlPath.replace(os.homedir(), '~')}`);
  step(`Scenes:   ${sceneCount} × ${sceneDuration / 1000}s`);
  step(`Duration: ${(movieMs / 1000).toFixed(1)}s total`);
  console.log('');

  spin(`Recording ${(movieMs / 1000).toFixed(0)}s @ 60fps`);
  let result;
  try { result = record(finalHtmlPath, { toolchain, outputDir: outDir || os.homedir() + '/Desktop' }); }
  catch (e) { process.stdout.write(' failed\n\n'); fail(e.message); process.exit(1); }
  spinEnd();
  spin('Transcoding H.264'); spinEnd();

  resultBox(result.mp4, result.mb, result.durationMs, result.scenes);
  process.exit(0);
}

fail(`Unknown command: ${cmd}  (run mographify --help)`);
process.exit(1);
