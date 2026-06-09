'use strict';
// Editorial opener: context label → hero italic → hero bold → accent line → punchline
module.exports = {
  id: 'hook-line',
  name: 'Hook Line',
  description: 'Editorial opener with big serif + sans contrast, accent separator line, punchline.',
  slots: ['context', 'hero_italic', 'hero_bold', 'punchline'],
  render({ context, hero_italic, hero_bold, punchline }, { accent = '#FEF09A' } = {}) {
    const e = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return `
      <text class="anim" style="--d:0ms" x="500" y="180" text-anchor="middle"
        fill="#fff" fill-opacity="0.32"
        font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="22" letter-spacing="7">${e(context)}</text>

      <text class="up" style="--d:220ms" x="500" y="390" text-anchor="middle"
        fill="#fff" font-family="Georgia,serif" font-style="italic" font-size="110">${e(hero_italic)}</text>

      <text class="up" style="--d:480ms" x="500" y="510" text-anchor="middle"
        fill="#fff" font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="76">${e(hero_bold)}</text>

      <line class="draw" style="--d:780ms" data-pulse
        x1="240" y1="600" x2="760" y2="600" stroke="${e(accent)}" stroke-width="3"/>

      <text class="up" style="--d:1000ms" x="500" y="740" text-anchor="middle"
        fill="${e(accent)}" font-family="Georgia,serif" font-style="italic" font-size="54">${e(punchline)}</text>
    `;
  },
};
