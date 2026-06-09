'use strict';
// Wrong belief (ghosted + struck) → arrow → correct belief (accent)
module.exports = {
  id: 'assumption-break',
  name: 'Assumption Break',
  description: 'Crossed-out wrong belief → arrow → correct belief in accent. Classic reframe.',
  slots: ['context', 'label_wrong', 'label_right', 'subtext'],
  render({ context, label_wrong, label_right, subtext }, { accent = '#FEF09A' } = {}) {
    const e = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return `
      <text class="anim" style="--d:0ms" x="500" y="180" text-anchor="middle"
        fill="#fff" fill-opacity="0.32"
        font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="22" letter-spacing="7">${e(context)}</text>

      <text class="pop" style="--d:200ms" x="500" y="360" text-anchor="middle"
        fill="#fff" fill-opacity="0.18"
        font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="90">${e(label_wrong)}</text>

      <line class="draw" style="--d:600ms"
        x1="130" y1="318" x2="870" y2="318" stroke="#fff" stroke-width="4" stroke-opacity="0.4"/>

      <text class="anim" style="--d:880ms" x="500" y="458" text-anchor="middle"
        fill="#fff" fill-opacity="0.4"
        font-family="'Helvetica Neue',Arial,sans-serif" font-size="46">↓</text>

      <text class="pop" style="--d:1060ms" data-pulse x="500" y="650" text-anchor="middle"
        fill="${e(accent)}"
        font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="112">${e(label_right)}</text>

      <text class="up" style="--d:1560ms" x="500" y="778" text-anchor="middle"
        fill="#fff" fill-opacity="0.48"
        font-family="Georgia,serif" font-style="italic" font-size="36">${e(subtext)}</text>
    `;
  },
};
