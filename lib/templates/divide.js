'use strict';
// Two-column comparison. Left dim, right accent. Vertical divider. Bottom insight.
module.exports = {
  id: 'divide',
  name: 'Divide',
  description: 'Two-column split: left (dim/wrong) vs right (accent/right). Insight line below.',
  slots: ['left_label', 'left_sub', 'right_label', 'right_sub', 'insight'],
  render({ left_label, left_sub, right_label, right_sub, insight }, { accent = '#FEF09A' } = {}) {
    const e = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return `
      <line class="draw" style="--d:80ms"
        x1="500" y1="180" x2="500" y2="640" stroke="#fff" stroke-width="1" stroke-opacity="0.18"/>

      <text class="left" style="--d:260ms" x="250" y="440" text-anchor="middle"
        fill="#fff" fill-opacity="0.28"
        font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="108">${e(left_label)}</text>

      <text class="left" style="--d:420ms" x="250" y="520" text-anchor="middle"
        fill="#fff" fill-opacity="0.22"
        font-family="Georgia,serif" font-style="italic" font-size="32">${e(left_sub)}</text>

      <text class="right" style="--d:260ms" data-pulse x="750" y="440" text-anchor="middle"
        fill="${e(accent)}"
        font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="108">${e(right_label)}</text>

      <text class="right" style="--d:420ms" x="750" y="520" text-anchor="middle"
        fill="${e(accent)}" fill-opacity="0.62"
        font-family="Georgia,serif" font-style="italic" font-size="32">${e(right_sub)}</text>

      <line class="draw" style="--d:680ms"
        x1="120" y1="640" x2="880" y2="640" stroke="#fff" stroke-width="1" stroke-opacity="0.16"/>

      <text class="up" style="--d:900ms" x="500" y="780" text-anchor="middle"
        fill="#fff" fill-opacity="0.60"
        font-family="Georgia,serif" font-style="italic" font-size="42">${e(insight)}</text>
    `;
  },
};
