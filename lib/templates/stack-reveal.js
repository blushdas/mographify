'use strict';
// Layers build from bottom up to an accent output cap. 3–5 layers supported.
module.exports = {
  id: 'stack-reveal',
  name: 'Stack Reveal',
  description: 'Layers appear bottom-to-top, capped by an accent output layer. Use for capability stacks, hierarchies.',
  slots: ['context', 'layers', 'output', 'subtext'],
  render({ context, layers, output, subtext }, { accent = '#FEF09A' } = {}) {
    const e = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const ls = Array.isArray(layers) ? layers.slice(0, 5) : [];
    const count = ls.length;
    const layerH = 82, gap = 2;
    const stackBottom = 820;
    // Build from bottom: first layer appears first (lowest y = last element)
    const layerEls = ls.map((label, i) => {
      const y = stackBottom - i * (layerH + gap);
      const op = 0.22 + (i / Math.max(count - 1, 1)) * 0.68;
      const delay = 200 + i * 280;
      return `
      <g class="up" style="--d:${delay}ms">
        <rect x="80" y="${y}" width="840" height="${layerH}" rx="12"
          fill="none" stroke="#fff" stroke-width="2.5" stroke-opacity="${op.toFixed(2)}"/>
        <text x="500" y="${y + 51}" text-anchor="middle"
          fill="#fff" fill-opacity="${op.toFixed(2)}"
          font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="36">${e(label)}</text>
      </g>`;
    }).join('');

    const outputY = stackBottom - count * (layerH + gap);
    const outputDelay = 200 + count * 280 + 80;
    const subtextDelay = outputDelay + 500;

    return `
      <text class="anim" style="--d:0ms" x="500" y="180" text-anchor="middle"
        fill="#fff" fill-opacity="0.32"
        font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="22" letter-spacing="7">${e(context)}</text>

      <g class="pop" style="--d:${outputDelay}ms">
        <rect x="80" y="${outputY}" width="840" height="${layerH + 4}" rx="16"
          fill="${e(accent)}" fill-opacity="0.07" stroke="${e(accent)}" stroke-width="4"/>
        <text x="500" y="${outputY + 52}" text-anchor="middle" data-pulse
          fill="${e(accent)}"
          font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="48">${e(output)}</text>
      </g>

${layerEls}

      <text class="anim" style="--d:${subtextDelay}ms" x="500" y="${stackBottom + layerH + 60}" text-anchor="middle"
        fill="#fff" fill-opacity="0.78"
        font-family="Georgia,serif" font-style="italic" font-size="42">${e(subtext)}</text>
    `;
  },
};
