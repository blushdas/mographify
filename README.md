# MOGRAPHIFY

**Content brief → animated motion graphic → 1080×1920 60fps MP4**

No After Effects. No Premiere. Just a content brief and a command.

```
  MOGRAPHIFY  v1.0.0
  ──────────────────
  content → visual → 1080p 60fps MP4

  ◆ Input:    claude-chat-vs-runtime.html (5 scenes × 10s)
  ◆ Duration: 52.0s total
  ◆ Output:   ~/Desktop/

  ⟳ Recording 52s @ 60fps... done
  ⟳ Transcoding H.264... done

  ┌──────────────────────────────────────────┐
  │ ~/Desktop/claude-chat-vs-runtime.mp4     │
  │ 2.1MB · 52s · 60fps · 1080×1920         │
  └──────────────────────────────────────────┘
```

---

## What it does

Takes a structured content brief (HOOK / PREMISE / POINTS / WHY IT MATTERS) and produces a production-ready vertical video Reel — the kind you'd post on Instagram, TikTok, or YouTube Shorts.

The design system is strictly editorial:
- Black background, white text, one accent color per pillar
- Georgia italic for big statements, Helvetica Neue for labels
- Every scene holds 10s with animated entry and exit
- Accent element breathes (subtle opacity pulse) while on screen

**Pillar-aware color system:**
- Build / code / automation → `#FEF09A` butter yellow
- Mindset / mental models → `#7DD3FC` sky blue
- Process / systems → `#86EFAC` mint green
- Content / creation → `#FB923C` warm orange
- Strategy / positioning → `#C4B5FD` soft purple

---

## Sample

`samples/claude-chat-vs-runtime.html` — 5-scene reel on Claude Code as a runtime vs chat interface.

Record it yourself:

```bash
mographify record samples/claude-chat-vs-runtime.html
```

---

## Install

**Prerequisites:**
- Node.js 18+
- [Playwright](https://playwright.dev) with Chromium
- [ffmpeg](https://ffmpeg.org)

```bash
# Install prerequisites
npm install -g playwright
npx playwright install chromium
brew install ffmpeg   # macOS

# Install mographify
npm install -g mographify
```

Or run directly without installing:

```bash
npx mographify record path/to/file.html
```

---

## Usage

### Record an HTML mograph → MP4

```bash
mographify record <file.html>
mographify record <file.html> --out ~/Movies
```

### Screenshot every scene for QA review

```bash
mographify qa <file.html>
```

Screenshots land in `/tmp/mographify-qa/scene-N.png`. Open them to visually inspect before recording.

### Inspect a mograph file

```bash
mographify info <file.html>
```

---

## Full pipeline with Claude Code (content → MP4)

The CLI handles the **deterministic** parts: QA and recording.

The **generative** part (content brief → HTML) is handled by a Claude Code skill that uses Claude's AI to map your content to the right visual templates, pick the right pillar color, and generate the HTML.

**Install the Claude Code skill:**

```bash
cp claude-skill/SKILL.md ~/.claude/skills/mographify/SKILL.md
```

Then in Claude Code:

```
/mographify

## TOPIC
Your topic here

## HOOK
Your hook variant...

## PREMISE
Your core argument...

## CONTENT + POINTS
**Point 1:** ...
**Point 2:** ...

## WHY IT'S RELEVANT
...
```

Claude maps each section to a visual template, generates the HTML, runs the QA loop (screenshots → vision review → fix loop up to 3 passes), and records the final MP4.

---

## HTML format

Mographs are self-contained HTML files. They run in any browser. The format:

```html
<!-- Stage: 1080×1920 fixed -->
<main class="stage">
  <section class="scene active" data-scene="0">
    <div class="scene-label">HOOK</div>
    <div class="counter">1/5</div>
    <div class="visual">
      <svg viewBox="0 0 1000 1300">
        <!-- CSS-animated elements with .anim .pop .up .left .right .draw classes -->
        <!-- style="--d:300ms" sets the animation delay -->
        <!-- data-pulse marks the accent element for idle breathing -->
      </svg>
    </div>
  </section>
</main>
<script>
const DURATION = 10000;       // ms per scene
const EXIT_DURATION = 1200;   // ms for exit animation
// JS controller handles timing, exit transitions, keyboard nav
window._mographStop = () => clearInterval(timer); // QA hook
</script>
```

**Animation classes:**
- `.anim` — fade up entry
- `.pop` — scale from 0.72
- `.up` — translate from below
- `.left` / `.right` — translate from side
- `.draw` — stroke dash reveal
- `data-pulse` — marks accent element for idle breathing

**Exit:** When a scene's timer fires, `.exiting` class is added. CSS `!important` rules override entry animations with reverse-direction exits (translate up, scale down, undraw).

---

## Design rules

These are enforced by the QA loop:

- Background: `#000000` always
- Text/shapes: `#ffffff`
- Accent: exactly **one** pillar color per scene
- Fonts: `Helvetica Neue` 700 for labels, `Georgia` italic for statements
- SVG viewBox: `0 0 1000 1300` always
- Node labels: 1–4 words max
- All elements fully within SVG bounds
- No gradients, no decorative noise

---

## Architecture

```
content brief
    │
    ▼ (generative — Claude AI)
scene plan + template mapping
    │
    ▼ (generative — Claude AI)
HTML file (/tmp/mographify-*.html)
    │
    ▼ (deterministic — Playwright)
QA screenshots (per-scene PNGs)
    │
    ▼ (deterministic — vision review, up to 3 passes)
HTML fixes
    │
    ▼ (deterministic — Playwright + ffmpeg)
MP4 (~Desktop/slug.mp4)
```

---

## License

MIT
