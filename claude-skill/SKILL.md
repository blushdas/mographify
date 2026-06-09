---
name: mographify
description: >
  Full mograph pipeline: content brief → scene mapping → HTML generation → QA
  screenshot review → 1080×1920 60fps MP4. OR legacy mode: pass an HTML path to
  just record it. Pillar-aware color palettes. Internal QA loop catches overflow,
  spacing, and color violations before recording.
  Say "/mographify", "mographify this", "make a mograph from this content",
  "record this HTML", or "export to mp4".
allowed-tools: Bash Write Read Edit
---

# Mographify — Full Pipeline

Two modes, detected automatically:
- **Content mode** — user provides a content brief (text with TOPIC/HOOK/PREMISE/etc.) → full pipeline → MP4
- **HTML mode** — user provides a `.html` file path → record only → MP4

---

## COLOR PALETTE SYSTEM

Replace `--accent: #FEF09A` in generated HTML with the pillar color.

### Pillar Detection Keywords

- **build** → `#FEF09A` (butter yellow) — keywords: claude code, code, deploy, ship, build, automation, mcp, hooks, runtime, agent, terminal, workflow engine, orchestrat
- **mindset** → `#7DD3FC` (sky blue) — keywords: mental model, mindset, belief, thinking, philosophy, reframe, perspective, gap, insight
- **process** → `#86EFAC` (mint green) — keywords: workflow, process, system, pipeline, step, framework, checklist, structure, loop
- **content** → `#FB923C` (warm orange) — keywords: content, post, reel, hook, instagram, create, audience, video, creator
- **strategy** → `#C4B5FD` (soft purple) — keywords: strategy, position, market, business, leverage, growth, competitive, advantage
- **default** → `#FEF09A` (butter yellow) — fallback when no strong pillar signal

Scan TOPIC + first CONTENT POINT for keywords. Most frequent pillar wins.

---

## DESIGN RULES (enforced at QA stage)

- Background: `#000000` always
- Text/shapes: `#ffffff` always
- Accent: exactly one pillar color. NEVER more than 1 accent element per scene
- Fonts: `Helvetica Neue, Arial, sans-serif` weight 700 for labels; `Georgia, serif` italic bold for accent labels
- SVG viewBox: `0 0 1000 1300` always
- Node labels: 1–4 words max
- Counter: top-right `X/TOTAL` in accent color
- No gradients, no decorative elements, no gray text
- All elements must be fully inside the SVG bounds — no clipping, no overflow

---

## TEMPLATE REFERENCE (50 templates, 10 categories)

Use for semantic mapping — pick the template whose **structure** matches the content's logic, not the surface words.

### Thought Flows
1. **Chain** — A → B → C linear progression
2. **Branching** — one source splits into multiple outputs
3. **Converging** — multiple sources collapse to one output
4. **Ladder** — sequential levels climbing upward
5. **Web** — nodes with mutual connections (complex dependency)

### Transformations
6. **Before/After** — old state left, new state right, arrow between
7. **Assumption Break** — MYTH label crossed out, REALITY revealed
8. **Model Swap** — bad model struck, good model highlighted
9. **Signal Extraction** — many inputs, one extracted output
10. **Assembly** — parts combine into a whole

### Processes
11. **Linear Workflow** — steps A→B→C→D in a row
12. **Pipeline** — horizontal stages with data flowing through
13. **Conveyor** — items moving through processing stages
14. **Handoff** — relay baton passes between agents/roles
15. **Relay** — multiple actors passing a single object
16. **Checklist** — items ticking off sequentially
17. **Queue** — items waiting, one being processed
18. **Parser** — raw input → structured output
19. **Composer** — assembles final output from ingredients
20. **Trigger** — event fires → action executes

### Cycles
21. **Basic Cycle** — A → B → C → back to A
22. **Feedback Loop** — output feeds back as input
23. **Learning Spiral** — each cycle improves on the last
24. **Flywheel** — momentum builds with each turn
25. **Iteration Spiral** — same loop but tighter each time
26. **Review Loop** — produce → review → improve → repeat
27. **Agent Observe** — sense → plan → act → observe
28. **Content Loop** — create → post → learn → refine
29. **Memory Loop** — store → retrieve → apply → update
30. **Quality Loop** — build → check → fix → ship

### Hierarchies
31. **Stack** — layers stacking from base to top
32. **Pyramid** — wide base, narrow peak
33. **Nested Context** — boxes within boxes (scope/containment)
34. **Tree** — parent node branches to children
35. **Org Chart** — hierarchical roles layout
36. **Dependency Map** — node requires multiple prerequisites
37. **Layer Reveal** — layers appear one by one (onion peel)
38. **Priority Stack** — items ordered by importance top-to-bottom
39. **Systems Map** — interconnected subsystems
40. **Concept Container** — abstract container holds concrete items

### Comparisons
41. **Myth/Reality Split** — false belief vs truth, side by side
42. **Old Way/New Way** — outdated approach vs modern approach
43. **Tradeoff Scale** — balance beam, two competing values
44. **Decision Matrix** — grid with criteria vs options
45. **Ranking** — ordered list with relative weights
46. **Filter Gate** — many inputs, only qualified pass through
47. **Cost of Delay** — timeline showing what's lost by waiting
48. **Leverage Comparison** — low leverage vs high leverage paths
49. **Bottleneck Finder** — wide flow → narrow point → wide again
50. **Final Synthesis** — all threads collapse to one conclusion

---

## PIPELINE: CONTENT MODE

### Stage 0 — Detect Mode

If user argument is a path ending in `.html` → skip to HTML mode.
Otherwise → run Content mode pipeline.

### Stage 1 — Parse Content Brief

Extract from the user's input:
- `TOPIC` — the subject/title
- `HOOK` — the tension or provocative framing
- `PREMISE` — the core insight/argument
- `CONTENT_POINTS` — list of supporting points (usually 3–5)
- `WHY_RELEVANT` — the stakes/why it matters
- `CTA` — call to action (if present)

### Stage 2 — Classify Pillar & Color

Scan TOPIC + CONTENT_POINTS for pillar keywords (see Color Palette System above).
Assign `ACCENT_COLOR` from the matching pillar.
If tie or unclear → default `#FEF09A`.

### Stage 3 — Scene Plan

Map content → scenes (target 4–6 scenes):
- **Scene 1**: The tension/hook (what most people are doing wrong, or the gap)
- **Scene 2**: The premise/reframe (the core insight)
- **Scene 3**: Content Point 1 (most structural)
- **Scene 4**: Content Point 2 (most surprising or counterintuitive)
- **Scene 5**: Content Point 3 or synthesis (optional, skip if content is tight)
- **Scene N**: CTA / final synthesis (converging or Final Synthesis template)

For each scene, output:
```
Scene N: [template name] (#/50)
Why: [semantic reason]
Labels: [node names, 1-4 words each]
Accent: [one element label]
Motion: [animation sequence summary]
```

### Stage 4 — Generate HTML

Read the AI Mograph Template System at:
`/Users/troy/Desktop/Files/AI_Mograph_Template_System_For_Claude_Web.md`

Then generate a complete, self-contained HTML file following the template system conventions:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>[TOPIC]</title>
<style>
:root {
  --bg: #000;
  --white: #fff;
  --accent: [ACCENT_COLOR];
}
/* ... full styles ... */
</style>
</head>
<body>
<main class="stage">
  <section class="scene active" data-scene="0" aria-label="[scene label]">
    <div class="counter">1/[TOTAL]</div>
    <div class="visual">
      <svg viewBox="0 0 1000 1300" role="img" aria-hidden="true">
        <!-- animated scene -->
      </svg>
    </div>
  </section>
  <!-- additional scenes without .active -->
</main>
<script>
const DURATION = 4800;
// scene advancement script
</script>
</body>
</html>
```

Write the HTML to: `$TMPDIR/mographify-[slug].html`
where `[slug]` is the TOPIC lowercased, spaces→hyphens, truncated to 30 chars.

### Stage 5 — QA Loop (max 3 iterations)

#### Step A — Screenshot each scene

Write to `$TMPDIR/mographify-screenshot.cjs`:

```javascript
'use strict';
const { chromium } = require('/Users/troy/.npm/_npx/705bc6b22212b352/node_modules/playwright');
const { mkdirSync } = require('node:fs');
const { join } = require('node:path');

const htmlPath = process.argv[2];
const outDir = (process.env.TMPDIR || '/tmp') + '/mographify-qa';
mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'load' });
  await page.waitForTimeout(600);

  const count = await page.evaluate(() => document.querySelectorAll('[data-scene]').length);
  const results = [];

  for (let i = 0; i < count; i++) {
    await page.evaluate((idx) => {
      document.querySelectorAll('[data-scene]').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('[data-scene]')[idx].classList.add('active');
    }, i);
    await page.waitForTimeout(900);
    const p = join(outDir, 'scene-' + i + '.png');
    await page.screenshot({ path: p });
    results.push({ scene: i, path: p });
  }

  await ctx.close();
  await browser.close();
  console.log(JSON.stringify(results));
})();
```

Run with dangerouslyDisableSandbox:
```bash
node $TMPDIR/mographify-screenshot.cjs [HTML_PATH]
```

#### Step B — Review screenshots

Parse the JSON output → array of `{ scene, path }`.

For each screenshot, use the Read tool to view the image file at `path`.

Review each scene image for these violations:
1. **Overflow** — any text or shape touching or outside the visible frame edges
2. **Crowding** — elements overlapping when they shouldn't, labels colliding
3. **Spacing** — uneven or very tight gaps between sibling elements
4. **Label length** — any label longer than 4 words
5. **Accent overuse** — more than 1 element using accent color in a scene
6. **Color violation** — any color that isn't `#000`, `#fff`, or the accent
7. **Alignment** — elements visually misaligned (asymmetric when symmetry is intended)

Produce a report:
```
QA Pass [N]:
Scene 0: PASS / FAIL — [issue description if fail]
Scene 1: PASS / FAIL — [issue description if fail]
...
Overall: PASS (proceed) / FAIL (fix required)
```

#### Step C — Fix or proceed

- If all scenes PASS → proceed to Stage 6
- If any scene FAILS → edit the HTML file to fix each reported issue, then loop back to Step A
- Maximum 3 iterations. After 3rd fail → proceed with best version and note remaining issues.

### Stage 6 — Record

Write to `$TMPDIR/mographify-run.cjs` (replacing all `_PLACEHOLDER` tokens):

```javascript
'use strict';
const { chromium } = require('/Users/troy/.npm/_npx/705bc6b22212b352/node_modules/playwright');
const { mkdirSync, rmSync, renameSync, statSync } = require('node:fs');
const { spawnSync } = require('node:child_process');

const htmlPath = 'HTML_PATH_PLACEHOLDER';
const workDir  = 'WORK_DIR_PLACEHOLDER';
const rawWebm  = workDir + '/raw.webm';
const mp4Path  = 'MP4_PATH_PLACEHOLDER';
const MOVIE_MS = MOVIE_MS_PLACEHOLDER;

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

  if (!video) throw new Error('No video object');
  renameSync(await video.path(), rawWebm);

  const ff = spawnSync('/opt/homebrew/bin/ffmpeg', [
    '-y', '-i', rawWebm,
    '-vf', 'fps=60,scale=1080:1920:flags=lanczos,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16',
    '-movflags', '+faststart', '-an',
    mp4Path,
  ], { encoding: 'utf8' });

  if (ff.status !== 0) { console.error(ff.stderr); process.exit(ff.status || 1); }

  const s = statSync(mp4Path);
  console.log(JSON.stringify({
    mp4: mp4Path,
    mb: (s.size / 1024 / 1024).toFixed(1) + 'MB',
    durationMs: MOVIE_MS,
    fps: 60,
    resolution: '1080x1920',
  }));
})();
```

**Path resolution**:
- `HTML_PATH` — the generated (or user-provided) HTML file path
- `MP4_PATH` — Desktop path: `/Users/troy/Desktop/[slug].mp4`
- `WORK_DIR` — `$TMPDIR/mographify-export`
- `MOVIE_MS` — `SCENE_COUNT * SCENE_MS + EXIT_MS + 800` where:
  - `SCENE_MS` from `const DURATION =` in HTML (default 4800, new standard 10000)
  - `EXIT_MS` from `const EXIT_DURATION =` in HTML (default 0 for legacy, 1200 for new scenes with exit animations)
  - If `EXIT_DURATION` not found in HTML, use 0

Run with dangerouslyDisableSandbox:
```bash
node $TMPDIR/mographify-run.cjs
```

### Stage 7 — Report

Output:
- MP4 path
- File size
- Duration
- Pillar + accent color used
- QA summary (passes/iterations taken)
- Any unresolved QA issues (if max iterations hit)

---

## PIPELINE: HTML MODE (LEGACY)

When argument is a `.html` file path:

1. Resolve paths: `HTML_PATH`, `MP4_PATH` (same dir as HTML, `.mp4` ext)
2. Count `data-scene=` → `SCENE_COUNT`
3. Read `const DURATION =` → `SCENE_MS` (default 4800)
4. Compute `MOVIE_MS = SCENE_COUNT * SCENE_MS + 800`
5. Write and run `$TMPDIR/mographify-run.cjs` (Stage 6 script above)
6. Report result

No QA loop in legacy mode unless user explicitly asks for it.

---

## TOOLCHAIN (pre-installed, no npm install needed)

- Playwright: `/Users/troy/.npm/_npx/705bc6b22212b352/node_modules/playwright` (v1.60.0)
- Chromium: `/Users/troy/Library/Caches/ms-playwright/chromium_headless_shell-1223/`
- ffmpeg: `/opt/homebrew/bin/ffmpeg`

`dangerouslyDisableSandbox: true` required for both scripts — Chromium on macOS needs Mach port access.
