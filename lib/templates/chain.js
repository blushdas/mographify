'use strict';
// A → B → C → D linear steps. One step is the accent. 3–5 steps supported.
module.exports = {
  id: 'chain',
  name: 'Chain',
  description: 'Linear A → B → C progression. One accent step marks the destination or key stage.',
  slots: ['steps', 'accent_step', 'conclusion'],
  render({ steps, accent_step, conclusion }, { accent = '#FEF09A' } = {}) {
    const e = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const ls = Array.isArray(steps) ? steps.slice(0, 5) : [];
    const count = ls.length;
    const boxH = 90, totalH = count * boxH + (count - 1) * 40;
    const startY = Math.round((900 - totalH) / 2) + 80;

    const items = ls.map((label, i) => {
      const y = startY + i * (boxH + 40);
      const isAccent = label === accent_step;
      const delay = 200 + i * 300;
      const boxFill = isAccent ? `fill="${e(accent)}" fill-opacity="0.1"` : '';
      const textFill = isAccent ? `fill="${e(accent)}"` : 'fill="#fff" fill-opacity="0.85"';
      const stroke = isAccent ? `stroke="${e(accent)}" stroke-width="4"` : 'stroke="#fff" stroke-width="2.5" stroke-opacity="0.6"';
      const pulse  = isAccent ? 'data-pulse' : '';

      let els = `
      <g class="up" style="--d:${delay}ms">
        <rect x="150" y="${y}" width="700" height="${boxH}" rx="16" fill="none" ${boxFill} ${stroke}/>
        <text x="500" y="${y + 56}" text-anchor="middle" ${pulse}
          ${textFill}
          font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="38">${e(label)}</text>
      </g>`;

      if (i < count - 1) {
        const arrowY = y + boxH;
        els += `
      <text class="anim" style="--d:${delay + 200}ms" x="500" y="${arrowY + 30}" text-anchor="middle"
        fill="#fff" fill-opacity="0.35" font-size="28">↓</text>`;
      }
      return els;
    }).join('');

    const conclusionY = startY + count * (boxH + 40) + 20;

    return `
${items}
      <text class="anim" style="--d:${200 + count * 300 + 200}ms" x="500" y="${conclusionY}" text-anchor="middle"
        fill="#fff" fill-opacity="0.55"
        font-family="Georgia,serif" font-style="italic" font-size="36">${e(conclusion)}</text>
    `;
  },
};
