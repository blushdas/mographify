'use strict';

const fs = require('node:fs');

function parseHtml(htmlPath) {
  const src = fs.readFileSync(htmlPath, 'utf8');

  const sceneCount = (src.match(/data-scene=/g) || []).length;

  const durMatch  = src.match(/const\s+DURATION\s*=\s*(\d+)/);
  const exitMatch = src.match(/const\s+EXIT_DURATION\s*=\s*(\d+)/);

  const sceneDuration = durMatch  ? parseInt(durMatch[1],  10) : 4800;
  const exitDuration  = exitMatch ? parseInt(exitMatch[1], 10) : 0;

  const movieMs = sceneCount * sceneDuration + exitDuration + 800;

  return { sceneCount, sceneDuration, exitDuration, movieMs };
}

module.exports = { parseHtml };
