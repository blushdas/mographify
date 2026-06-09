'use strict';

const PILLARS = {
  build: {
    color: '#FEF09A',
    name: 'Build',
    ansi: '\x1b[93m',
    keywords: ['claude code','code','deploy','ship','build','automation','mcp','hooks','runtime','agent','terminal','workflow engine','orchestrat'],
  },
  mindset: {
    color: '#7DD3FC',
    name: 'Mindset',
    ansi: '\x1b[96m',
    keywords: ['mental model','mindset','belief','thinking','philosophy','reframe','perspective','gap','insight'],
  },
  process: {
    color: '#86EFAC',
    name: 'Process',
    ansi: '\x1b[92m',
    keywords: ['workflow','process','system','pipeline','step','framework','checklist','structure','loop'],
  },
  content: {
    color: '#FB923C',
    name: 'Content',
    ansi: '\x1b[33m',
    keywords: ['content','post','reel','hook','instagram','create','audience','video','creator'],
  },
  strategy: {
    color: '#C4B5FD',
    name: 'Strategy',
    ansi: '\x1b[95m',
    keywords: ['strategy','position','market','business','leverage','growth','competitive','advantage'],
  },
};

const DEFAULT_PILLAR = PILLARS.build;

function detectPillar(text) {
  const lower = text.toLowerCase();
  const scores = {};
  for (const [key, p] of Object.entries(PILLARS)) {
    scores[key] = p.keywords.filter(k => lower.includes(k)).length;
  }
  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return winner[1] > 0 ? PILLARS[winner[0]] : DEFAULT_PILLAR;
}

module.exports = { PILLARS, DEFAULT_PILLAR, detectPillar };
