'use strict';
// Left: before (dim). Arrow. Right: after (accent). Bottom insight.
module.exports = {
  id: 'before-after',
  name: 'Before / After',
  description: 'Old state (dim, left) → arrow → new state (accent, right). Transformation pattern.',
  slots: ['before_label', 'before_sub', 'after_label', 'after_sub', 'insight'],
  render({ before_label, before_sub, after_label, after_sub, insight }, { accent = '#FEF09A' } = {}) {
    const e = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return `
      <g class="left" style="--d:200ms">
        <rect x="40" y="280" width="360" height="200" rx="20"
          fill="none" stroke="#fff" stroke-width="2.5" stroke-opacity="0.3"/>
        <text x="220" y="368" text-anchor="middle"
          fill="#fff" fill-opacity="0.35"
          font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="52">${e(before_label)}</text>
        <text x="220" y="432" text-anchor="middle"
          fill="#fff" fill-opacity="0.22"
          font-family="Georgia,serif" font-style="italic" font-size="28">${e(before_sub)}</text>
      </g>

      <g class="anim" style="--d:600ms">
        <line x1="430" y1="380" x2="570" y2="380" stroke="#fff" stroke-width="3" stroke-opacity="0.5"/>
        <polygon points="558,368 582,380 558,392" fill="#fff" fill-opacity="0.5"/>
      </g>

      <g class="right" style="--d:800ms">
        <rect x="600" y="280" width="360" height="200" rx="20"
          fill="${e(accent)}" fill-opacity="0.07" stroke="${e(accent)}" stroke-width="4"/>
        <text x="780" y="368" text-anchor="middle" data-pulse
          fill="${e(accent)}"
          font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="52">${e(after_label)}</text>
        <text x="780" y="432" text-anchor="middle"
          fill="${e(accent)}" fill-opacity="0.65"
          font-family="Georgia,serif" font-style="italic" font-size="28">${e(after_sub)}</text>
      </g>

      <line class="draw" style="--d:1100ms"
        x1="120" y1="560" x2="880" y2="560" stroke="#fff" stroke-width="1" stroke-opacity="0.16"/>

      <text class="up" style="--d:1300ms" x="500" y="700" text-anchor="middle"
        fill="#fff" fill-opacity="0.65"
        font-family="Georgia,serif" font-style="italic" font-size="42">${e(insight)}</text>
    `;
  },
};
