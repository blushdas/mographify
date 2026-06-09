---
name: mographify
description: >
  Content brief → JSON scene plan → HTML → QA → 1080×1920 60fps MP4.
  User pastes any content (brief, outline, bullet list, raw notes).
  Claude maps it to templates, outputs a JSON plan, assembler builds HTML.
  Say "/mographify" then paste your content. Optionally pass flags.
allowed-tools: Bash Write Read
---

# Mographify

Slot-filling pipeline. Claude writes JSON. Code builds the HTML. Faster, cheaper, deterministic.

---

## FLAGS (read from user input if present)

- `duration=N` — seconds per scene (default 10)
- `exit=N` — exit transition seconds (default 1.2)
- `pillar=NAME` — force pillar: `build` `mindset` `process` `content` `strategy`
- `scenes=N` — target number of scenes (default 4–6)
- `accent=#HEX` — custom accent color

---

## STEP 1 — Normalize input

Whatever the user pastes (structured brief, bullet notes, raw paragraphs, title + outline), extract:
- **HOOK** — tension or provocative opener
- **PREMISE** — core argument or reframe
- **POINTS** — 2–4 key supporting ideas
- **CLOSE** — why it matters / CTA

---

## STEP 2 — Detect pillar + accent

Scan HOOK + POINTS for keyword groups. Highest hit count wins.

- build → `#FEF09A` — claude code, code, deploy, ship, build, automation, mcp, hooks, runtime, agent
- mindset → `#7DD3FC` — mental model, mindset, belief, thinking, philosophy, reframe, insight
- process → `#86EFAC` — workflow, process, system, pipeline, step, framework, loop
- content → `#FB923C` — content, post, reel, hook, instagram, create, audience, video
- strategy → `#C4B5FD` — strategy, market, business, leverage, growth, positioning
- default → `#FEF09A`

---

## STEP 3 — Map scenes to templates

Target 4–6 scenes. Pick by semantic structure, not surface words.

**hook-line** — serif/sans contrast opener
slots: `context` `hero_italic` `hero_bold` `punchline`

**assumption-break** — wrong belief crossed → correct belief
slots: `context` `label_wrong` `label_right` `subtext`

**divide** — two-column comparison
slots: `left_label` `left_sub` `right_label` `right_sub` `insight`

**big-number** — massive stat with context
slots: `context` `number` `unit` `insight` `support`

**convergence** — 3 inputs → 1 output
slots: `input_1` `input_2` `input_3` `output` `clarifier`

**stack-reveal** — layers build up to output cap
slots: `context` `layers` (array 3–5) `output` `subtext`

**before-after** — old state → new state
slots: `before_label` `before_sub` `after_label` `after_sub` `insight`

**single-truth** — one giant centered statement
slots: `headline` `subtext`

**chain** — A → B → C linear steps
slots: `steps` (array 3–5) `accent_step` (must match one step exactly) `conclusion`

**why-it-matters** — closing scene with CTA
slots: `context` `line_1` `line_2` `insight` `cta`

---

## STEP 4 — Slot rules

- Most slots: **1–4 words max**
- `subtext` `insight` `clarifier` `conclusion` `cta` `punchline`: up to 8 words
- `layers` / `steps` arrays: 3–5 items, each 1–3 words
- `accent_step` must exactly match one value in `steps`

---

## STEP 5 — Write JSON plan

Write ONLY the JSON to `$TMPDIR/mographify-plan.json`. No HTML, no SVG, no explanation.

```json
{
  "topic": "short-slug",
  "pillar": "build",
  "accent": "#FEF09A",
  "duration": 10000,
  "exitDuration": 1200,
  "scenes": [
    {
      "id": 0,
      "label": "HOOK",
      "template": "hook-line",
      "slots": {
        "context": "YOU ARE HOLDING",
        "hero_italic": "the best AI",
        "hero_bold": "IN THE WORLD",
        "punchline": "and using it like Google."
      }
    }
  ]
}
```

Apply any flags from Step 0 to `duration`, `exitDuration`, `accent`.

---

## STEP 6 — Assemble HTML

```bash
node ~/Documents/GitHub/mographify/bin/mographify.js assemble $TMPDIR/mographify-plan.json
```

Note the HTML path from the output.

---

## STEP 7 — QA (dangerouslyDisableSandbox)

```bash
node ~/Documents/GitHub/mographify/bin/mographify.js qa <HTML_PATH>
```

Read each `scene-N.png` with the Read tool. Check:
1. Text overflow (touching edges)
2. Labels > 4 words
3. More than 1 accent element per scene
4. Crowding or collision

If fails → fix slot values in `mographify-plan.json` → re-assemble → re-QA. Max 2 iterations.

---

## STEP 8 — Record (dangerouslyDisableSandbox)

```bash
node ~/Documents/GitHub/mographify/bin/mographify.js record <HTML_PATH>
```

---

## STEP 9 — Report

- MP4 path + size
- Pillar + accent used
- QA: pass/fail/iterations
