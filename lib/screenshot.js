'use strict';

const fs   = require('node:fs');
const path = require('node:path');
const os   = require('node:os');
const { spawnSync } = require('node:child_process');
const { findPlaywright } = require('./detect');
const { parseHtml } = require('./parse');

function qa(htmlPath, opts = {}) {
  const pw = opts.pw || findPlaywright();
  const { sceneCount } = parseHtml(htmlPath);
  const outDir = path.join(os.tmpdir(), 'mographify-qa');

  const script = `
'use strict';
const { chromium } = require(${JSON.stringify(pw)});
const { mkdirSync } = require('node:fs');
const { join } = require('node:path');

const htmlPath = ${JSON.stringify(htmlPath)};
const outDir   = ${JSON.stringify(outDir)};
mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx  = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  if (typeof page.evaluate === 'function') {
    await page.evaluate(() => { if (window._mographStop) window._mographStop(); });
  }

  const count = await page.evaluate(() => document.querySelectorAll('[data-scene]').length);
  const results = [];
  for (let i = 0; i < count; i++) {
    await page.evaluate(idx => {
      document.querySelectorAll('[data-scene]').forEach(s => s.classList.remove('active','exiting'));
      document.querySelectorAll('[data-scene]')[idx].classList.add('active');
    }, i);
    await page.waitForTimeout(2200);
    const p = join(outDir, 'scene-' + i + '.png');
    await page.screenshot({ path: p });
    results.push({ scene: i, path: p });
  }
  await ctx.close();
  await browser.close();
  process.stdout.write(JSON.stringify(results) + '\\n');
})().catch(e => { process.stderr.write(e.message + '\\n'); process.exit(1); });
`;

  const scriptPath = path.join(os.tmpdir(), 'mographify-qa.cjs');
  fs.writeFileSync(scriptPath, script);

  const result = spawnSync('node', [scriptPath], { encoding: 'utf8', stdio: 'pipe' });
  if (result.status !== 0) throw new Error(result.stderr || 'QA failed');

  return JSON.parse(result.stdout.trim());
}

module.exports = { qa };
