'use strict';

const TEMPLATES = {
  'hook-line':       require('./hook-line'),
  'assumption-break':require('./assumption-break'),
  'divide':          require('./divide'),
  'big-number':      require('./big-number'),
  'why-it-matters':  require('./why-it-matters'),
  'convergence':     require('./convergence'),
  'stack-reveal':    require('./stack-reveal'),
  'before-after':    require('./before-after'),
  'single-truth':    require('./single-truth'),
  'chain':           require('./chain'),
};

function validate(scene) {
  if (!scene.template) return 'missing template';
  const tmpl = TEMPLATES[scene.template];
  if (!tmpl) return `unknown template "${scene.template}". Available: ${Object.keys(TEMPLATES).join(', ')}`;
  const required = tmpl.slots.filter(s => s !== 'layers' && s !== 'steps'); // arrays handled separately
  const missing  = required.filter(s => scene.slots == null || !(s in scene.slots));
  if (missing.length) return `missing slots: ${missing.join(', ')}`;
  return null;
}

function list() {
  return Object.values(TEMPLATES).map(t => ({
    id: t.id,
    name: t.name,
    description: t.description,
    slots: t.slots,
  }));
}

module.exports = { TEMPLATES, validate, list };
