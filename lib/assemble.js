'use strict';

const fs   = require('node:fs');
const path = require('node:path');
const os   = require('node:os');
const { TEMPLATES, validate } = require('./templates/index');

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildScene(scene, svgFragment, idx, total) {
  const active = idx === 0 ? ' active' : '';
  return `
<section class="scene${active}" data-scene="${idx}">
  <div class="scene-label">${esc(scene.label)}</div>
  <div class="counter">${idx + 1}/${total}</div>
  <div class="visual">
    <svg viewBox="0 0 1000 1300" role="img" aria-hidden="true">
${svgFragment}
    </svg>
  </div>
</section>`;
}

function buildHtml(plan, scenesHtml) {
  const accent      = plan.accent      || '#FEF09A';
  const duration    = plan.duration    || 10000;
  const exitDur     = plan.exitDuration || 1200;
  const title       = esc(plan.topic   || 'mograph');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
:root{--bg:#000;--white:#fff;--accent:${accent};}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);width:1080px;height:1920px;overflow:hidden;}
.stage{position:relative;width:1080px;height:1920px;}
.scene{position:absolute;inset:0;display:none;align-items:center;justify-content:center;}
.scene.active{display:flex;}
.scene-label{position:absolute;top:62px;left:70px;z-index:10;font-family:'Helvetica Neue',Arial,sans-serif;font-weight:700;font-size:17px;letter-spacing:5px;color:#fff;opacity:0.38;}
.counter{position:absolute;top:58px;right:70px;z-index:10;font-family:'Helvetica Neue',Arial,sans-serif;font-weight:700;font-size:26px;letter-spacing:0.06em;color:var(--accent);}
.visual{display:grid;place-items:center;width:1080px;height:1920px;}
svg{width:1000px;height:1300px;}

.anim {opacity:0;transform-box:fill-box;transform-origin:center;animation:entryFade  740ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:var(--d,0ms);}
.pop  {opacity:0;transform-box:fill-box;transform-origin:center;animation:entryPop   740ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:var(--d,0ms);}
.up   {opacity:0;transform-box:fill-box;transform-origin:center;animation:entryUp    740ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:var(--d,0ms);}
.left {opacity:0;transform-box:fill-box;transform-origin:center;animation:entryLeft  740ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:var(--d,0ms);}
.right{opacity:0;transform-box:fill-box;transform-origin:center;animation:entryRight 740ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:var(--d,0ms);}
.draw {stroke-dasharray:1600;stroke-dashoffset:1600;animation:entryDraw 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:var(--d,0ms);}
.scene.active .anim,.scene.active .pop,.scene.active .up,.scene.active .left,.scene.active .right,.scene.active .draw{animation-play-state:running;}

@keyframes entryFade {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes entryPop  {from{opacity:0;transform:scale(0.74)}     to{opacity:1;transform:scale(1)}}
@keyframes entryUp   {from{opacity:0;transform:translateY(46px)} to{opacity:1;transform:translateY(0)}}
@keyframes entryLeft {from{opacity:0;transform:translateX(-56px)}to{opacity:1;transform:translateX(0)}}
@keyframes entryRight{from{opacity:0;transform:translateX(56px)} to{opacity:1;transform:translateX(0)}}
@keyframes entryDraw {to{stroke-dashoffset:0}}

.scene.exiting .anim {animation:exitUp    1200ms cubic-bezier(.4,0,1,1) forwards!important;}
.scene.exiting .pop  {animation:exitPop   1200ms cubic-bezier(.4,0,1,1) forwards!important;}
.scene.exiting .up   {animation:exitUp    1200ms cubic-bezier(.4,0,1,1) forwards!important;}
.scene.exiting .left {animation:exitLeft  1200ms cubic-bezier(.4,0,1,1) forwards!important;}
.scene.exiting .right{animation:exitRight 1200ms cubic-bezier(.4,0,1,1) forwards!important;}
.scene.exiting .draw {animation:exitDraw  1000ms cubic-bezier(.4,0,1,1) forwards!important;}
@keyframes exitUp   {from{opacity:1;transform:translateY(0)}   to{opacity:0;transform:translateY(-28px)}}
@keyframes exitPop  {from{opacity:1;transform:scale(1)}        to{opacity:0;transform:scale(0.78)}}
@keyframes exitLeft {from{opacity:1;transform:translateX(0)}   to{opacity:0;transform:translateX(-60px)}}
@keyframes exitRight{from{opacity:1;transform:translateX(0)}   to{opacity:0;transform:translateX(60px)}}
@keyframes exitDraw {from{stroke-dashoffset:0;opacity:1}       to{stroke-dashoffset:1600;opacity:0}}

[data-pulse]{transform-box:fill-box;transform-origin:center;}
.idle-pulse{animation:idlePulse 3.8s ease-in-out infinite!important;}
@keyframes idlePulse{0%,100%{opacity:1}50%{opacity:0.55}}
</style>
</head>
<body>
<main class="stage">
${scenesHtml}
</main>
<script>
const DURATION=${duration},EXIT_DURATION=${exitDur},PULSE_DELAY=2600;
let cur=0;
const scenes=document.querySelectorAll('.scene'),total=scenes.length;
let pt=null;
function pulse(el){pt=setTimeout(()=>{el.querySelectorAll('.draw').forEach(d=>{d.style.strokeDashoffset='0';});const p=el.querySelector('[data-pulse]');if(p)p.classList.add('idle-pulse');},PULSE_DELAY);}
function exit(){if(pt)clearTimeout(pt);const c=scenes[cur];c.querySelectorAll('.idle-pulse').forEach(e=>e.classList.remove('idle-pulse'));c.classList.add('exiting');setTimeout(()=>{c.classList.remove('active','exiting');cur=(cur+1)%total;const n=scenes[cur];n.classList.add('active');pulse(n);},EXIT_DURATION);}
pulse(scenes[0]);
let t=setInterval(exit,DURATION);
window._mographStop=()=>clearInterval(t);
document.addEventListener('keydown',e=>{const go=d=>{clearInterval(t);if(pt)clearTimeout(pt);scenes[cur].classList.remove('active','exiting');scenes[cur].querySelectorAll('.idle-pulse').forEach(x=>x.classList.remove('idle-pulse'));cur=(cur+d+total)%total;scenes[cur].classList.add('active');pulse(scenes[cur]);t=setInterval(exit,DURATION);};if(e.key==='ArrowRight'||e.key==='ArrowDown')go(1);if(e.key==='ArrowLeft'||e.key==='ArrowUp')go(-1);if(e.key==='r'||e.key==='R')go(-cur);});
</script>
</body>
</html>`;
}

function assemble(plan, outputPath) {
  // Validate
  const errors = (plan.scenes || []).map((s, i) => {
    const e = validate(s);
    return e ? `Scene ${i} (${s.template}): ${e}` : null;
  }).filter(Boolean);
  if (errors.length) throw new Error('Validation failed:\n' + errors.join('\n'));

  const accent = plan.accent || '#FEF09A';
  const total  = plan.scenes.length;

  const scenesHtml = plan.scenes.map((scene, i) => {
    const tmpl = TEMPLATES[scene.template];
    const svg  = tmpl.render(scene.slots, { accent });
    return buildScene(scene, svg, i, total);
  }).join('\n');

  const html = buildHtml(plan, scenesHtml);

  const out = outputPath || path.join(os.tmpdir(), `mographify-${slugify(plan.topic)}.html`);
  fs.writeFileSync(out, html, 'utf8');
  return out;
}

function slugify(str) {
  return String(str || 'mograph')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

module.exports = { assemble, slugify };
