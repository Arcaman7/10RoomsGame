/* ================= ЦИКЛ ================= */
let last=performance.now();
const OVIDS=['startOv','overOv','winOv','rewardOv','mapOv','siteOv','pauseOv','codexOv','merchantOv','helpOv'];
let noOvT=0;
function watchdog(dt){
if(state==='playing'||paused){noOvT=0;return;}
const anyOv=OVIDS.some(id=>{const e=$(id);return e&&!e.classList.contains('hidden');});
if(anyOv){noOvT=0;return;}
noOvT+=dt;
if(noOvT>1){noOvT=0;try{backToMenu();}catch(e){}}
}
function loop(now){
requestAnimationFrame(loop);
let dt=Math.min(.033,Math.max(0,(now-last)/1000));last=now;time+=dt;
shakeAmp*=Math.pow(.001,dt);if(shakeAmp<.05)shakeAmp=0;
try{
if(state==='playing'&&!paused){
if(hitStop>0){hitStop=Math.max(0,hitStop-Math.max(dt,.008));}else{update(dt);}
}
}catch(e){console.error('update',e);hitStop=0;}
try{render();}catch(e){console.error('render',e);}
try{syncHud();}catch(e){console.error('syncHud',e);}
watchdog(dt);
}
calcStats();buildMenu();syncHud();buildCodex();
requestAnimationFrame(loop);
