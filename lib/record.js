'use strict';

const fs   = require('node:fs');
const path = require('node:path');
const os   = require('node:os');
const { spawnSync, execSync } = require('node:child_process');
const { findPlaywright, findFfmpeg } = require('./detect');
const { parseHtml } = require('./parse');

function record(htmlPath, opts = {}) {
  const { pw, ff } = opts.toolchain || { pw: findPlaywright(), ff: findFfmpeg() };

  const { sceneCount, sceneDuration, exitDuration, movieMs } = parseHtml(htmlPath);

  const slug = path.basename(htmlPath, '.html').replace(/^mographify-/, '');
  const outDir = opts.outputDir || path.join(os.homedir(), 'Desktop');
  const mp4Path = path.join(outDir, slug + '.mp4');

  const workDir = path.join(os.tmpdir(), 'mographify-export');
  const rawWebm = path.join(workDir, 'raw.webm');

  // Write temp record script
  const script = `
'use strict';
const { chromium } = require(${JSON.stringify(pw)});
const { mkdirSync, rmSync, renameSync, statSync } = require('node:fs');
const { spawnSync } = require('node:child_process');

const htmlPath = ${JSON.stringify(htmlPath)};
const workDir  = ${JSON.stringify(workDir)};
const rawWebm  = ${JSON.stringify(rawWebm)};
const mp4Path  = ${JSON.stringify(mp4Path)};
const MOVIE_MS = ${movieMs};

(async () => {
  mkdirSync(workDir, { recursive: true });
  try { rmSync(rawWebm); } catch {}
  try { rmSync(mp4Path); } catch {}

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
    recordVideo: { dir: workDir, size: { width: 1080, height: 1920 } },
  });
  const page = await context.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'load' });
  await page.waitForTimeout(MOVIE_MS);

  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  if (!video) throw new Error('No video recorded');
  renameSync(await video.path(), rawWebm);

  const ff = spawnSync(${JSON.stringify(ff)}, [
    '-y', '-i', rawWebm,
    '-vf', 'fps=60,scale=1080:1920:flags=lanczos,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16',
    '-movflags', '+faststart', '-an',
    mp4Path,
  ], { encoding: 'utf8' });

  if (ff.status !== 0) { process.stderr.write(ff.stderr); process.exit(ff.status || 1); }

  const s = statSync(mp4Path);
  process.stdout.write(JSON.stringify({
    mp4: mp4Path,
    mb: (s.size / 1024 / 1024).toFixed(1) + 'MB',
    scenes: ${sceneCount},
    sceneDuration: ${sceneDuration},
    durationMs: MOVIE_MS,
  }) + '\\n');
})().catch(e => { process.stderr.write(e.message + '\\n'); process.exit(1); });
`;

  const scriptPath = path.join(os.tmpdir(), 'mographify-run.cjs');
  fs.writeFileSync(scriptPath, script);

  const result = spawnSync('node', [scriptPath], { encoding: 'utf8', stdio: 'pipe' });
  if (result.status !== 0) throw new Error(result.stderr || 'Recording failed');

  return JSON.parse(result.stdout.trim());
}

module.exports = { record };
