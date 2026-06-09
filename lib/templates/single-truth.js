'use strict';
// One big centered statement. Minimal. Maximum negative space.
module.exports = {
  id: 'single-truth',
  name: 'Single Truth',
  description: 'One large centered statement in Georgia italic. Maximum breathing room. Use for punchy one-liners.',
  slots: ['headline', 'subtext'],
  render({ headline, subtext }, { accent = '#FEF09A' } = {}) {
    const e = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return `
      <text class="pop" style="--d:200ms" data-pulse x="500" y="560" text-anchor="middle"
        fill="${e(accent)}"
        font-family="Georgia,serif" font-style="italic" font-weight="700" font-size="96">${e(headline)}</text>

      <text class="up" style="--d:900ms" x="500" y="700" text-anchor="middle"
        fill="#fff" fill-opacity="0.50"
        font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="32">${e(subtext)}</text>
    `;
  },
};
