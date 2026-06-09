'use strict';
// 3 input nodes converge to 1 accent output node via drawn lines.
module.exports = {
  id: 'convergence',
  name: 'Convergence',
  description: '3 source nodes converge to 1 accent output. Assembly / combination pattern.',
  slots: ['input_1', 'input_2', 'input_3', 'output', 'clarifier'],
  render({ input_1, input_2, input_3, output, clarifier }, { accent = '#FEF09A' } = {}) {
    const e = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return `
      <g class="left" style="--d:200ms">
        <rect x="38" y="195" width="362" height="116" rx="16"
          fill="none" stroke="#fff" stroke-width="3" stroke-opacity="0.8"/>
        <text x="219" y="262" text-anchor="middle"
          fill="#fff" font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="38">${e(input_1)}</text>
      </g>

      <g class="right" style="--d:340ms">
        <rect x="600" y="195" width="362" height="116" rx="16"
          fill="none" stroke="#fff" stroke-width="3" stroke-opacity="0.8"/>
        <text x="781" y="262" text-anchor="middle"
          fill="#fff" font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="38">${e(input_2)}</text>
      </g>

      <g class="up" style="--d:480ms">
        <rect x="319" y="410" width="362" height="116" rx="16"
          fill="none" stroke="#fff" stroke-width="3" stroke-opacity="0.8"/>
        <text x="500" y="477" text-anchor="middle"
          fill="#fff" font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="38">${e(input_3)}</text>
      </g>

      <line class="draw" style="--d:760ms" x1="300" y1="253" x2="500" y2="716"
        stroke="#fff" stroke-width="1.5" stroke-opacity="0.28"/>
      <line class="draw" style="--d:810ms" x1="700" y1="253" x2="500" y2="716"
        stroke="#fff" stroke-width="1.5" stroke-opacity="0.28"/>
      <line class="draw" style="--d:860ms" x1="500" y1="526" x2="500" y2="716"
        stroke="#fff" stroke-width="1.5" stroke-opacity="0.28"/>

      <g class="pop" style="--d:1120ms">
        <rect x="78" y="726" width="844" height="130" rx="20"
          fill="${e(accent)}" fill-opacity="0.07" stroke="${e(accent)}" stroke-width="4"/>
        <text x="500" y="806" text-anchor="middle" data-pulse
          fill="${e(accent)}"
          font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="54">${e(output)}</text>
      </g>

      <text class="anim" style="--d:1680ms" x="500" y="972" text-anchor="middle"
        fill="#fff" fill-opacity="0.78"
        font-family="Georgia,serif" font-style="italic" font-size="40">${e(clarifier)}</text>
    `;
  },
};
