'use strict';
// Closer scene: context → 2-line statement → accent bar → insight → CTA
module.exports = {
  id: 'why-it-matters',
  name: 'Why It Matters',
  description: 'Closing scene. Context label → bold 2-line statement → accent bar → insight → CTA.',
  slots: ['context', 'line_1', 'line_2', 'insight', 'cta'],
  render({ context, line_1, line_2, insight, cta }, { accent = '#FEF09A' } = {}) {
    const e = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return `
      <text class="anim" style="--d:0ms" x="500" y="180" text-anchor="middle"
        fill="#fff" fill-opacity="0.32"
        font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="22" letter-spacing="7">${e(context)}</text>

      <text class="up" style="--d:220ms" x="500" y="380" text-anchor="middle"
        fill="#fff"
        font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="88">${e(line_1)}</text>

      <text class="up" style="--d:400ms" x="500" y="490" text-anchor="middle"
        fill="#fff"
        font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="88">${e(line_2)}</text>

      <rect class="pop" style="--d:720ms" data-pulse
        x="100" y="550" width="800" height="10" rx="5" fill="${e(accent)}"/>

      <text class="up" style="--d:960ms" x="500" y="706" text-anchor="middle"
        fill="${e(accent)}"
        font-family="Georgia,serif" font-style="italic" font-size="70">${e(insight)}</text>

      <text class="up" style="--d:1300ms" x="500" y="822" text-anchor="middle"
        fill="#fff" fill-opacity="0.40"
        font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="26" letter-spacing="3">${e(cta)}</text>
    `;
  },
};
