'use strict';
// Massive stat with unit, accent separator, insight, support line.
module.exports = {
  id: 'big-number',
  name: 'Big Number',
  description: 'Massive stat (10×, 47%, etc.) with unit label, accent line, insight phrase.',
  slots: ['context', 'number', 'unit', 'insight', 'support'],
  render({ context, number, unit, insight, support }, { accent = '#FEF09A' } = {}) {
    const e = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return `
      <text class="anim" style="--d:0ms" x="500" y="180" text-anchor="middle"
        fill="#fff" fill-opacity="0.32"
        font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="22" letter-spacing="7">${e(context)}</text>

      <text class="pop" style="--d:200ms" x="500" y="500" text-anchor="middle"
        fill="#fff"
        font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="200">${e(number)}</text>

      <text class="anim" style="--d:680ms" x="500" y="580" text-anchor="middle"
        fill="#fff" fill-opacity="0.42"
        font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="22" letter-spacing="7">${e(unit)}</text>

      <line class="draw" style="--d:900ms" data-pulse
        x1="240" y1="650" x2="760" y2="650" stroke="${e(accent)}" stroke-width="3"/>

      <text class="up" style="--d:1100ms" x="500" y="790" text-anchor="middle"
        fill="${e(accent)}"
        font-family="Georgia,serif" font-style="italic" font-size="56">${e(insight)}</text>

      <text class="up" style="--d:1400ms" x="500" y="886" text-anchor="middle"
        fill="#fff" fill-opacity="0.40"
        font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="26">${e(support)}</text>
    `;
  },
};
