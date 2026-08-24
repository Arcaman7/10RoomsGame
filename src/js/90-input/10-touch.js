/* ================= СЕНСОРНОЕ УПРАВЛЕНИЕ (ТЕЛЕФОН/ПЛАНШЕТ) ================= */
const TOUCH=(window.matchMedia&&matchMedia('(pointer:coarse)').matches)||
((('ontouchstart' in window)||navigator.maxTouchPoints>0)&&Math.min(screen.width,screen.height)<=900);
if(TOUCH)document.body.classList.add('touch');
const tapT={left:-9,right:-9};
function nowS(){return performance.now()/1000;}
function bindHold(id,down,up){
const el=$(id);if(!el)return;
el.addEventListener('pointerdown',e=>{
e.preventDefault();e.stopPropagation();initAudio();
try{el.setPointerCapture(e.pointerId);}catch(_){}
el.classList.add('act');down&&down();
},{passive:false});
const off=e=>{if(e)e.stopPropagation();el.classList.remove('act');up&&up();};
['pointerup','pointercancel','lostpointercapture'].forEach(t=>el.addEventListener(t,off));
}
function moveBtn(id,key,dir,memo){
bindHold(id,()=>{
keys[key]=true;
/* на сенсоре двойное нажатие всегда работает независимо от настройки */
if(state==='playing'&&!paused){
if(nowS()-tapT[memo]<.30)tryStrafe(dir);
tapT[memo]=nowS();
}
},()=>{keys[key]=false;});
}
moveBtn('tLeft','KeyA',-1,'left');
moveBtn('tRight','KeyD',1,'right');
bindHold('tDown',()=>{keys.KeyS=true;},()=>{keys.KeyS=false;});
bindHold('tJump',()=>{if(state==='playing'&&!paused&&!player.dead){if((curCfg()||{}).flight)keys.KeyW=true;else player.jbuf=.12;}},()=>{keys.KeyW=false;});
bindHold('tAtk',()=>{holdAtk=true;attack();},()=>{holdAtk=false;});
bindHold('tSkill',()=>{tryAlt();});
bindHold('tRoll',()=>{tryStrafe(keys.KeyA?-1:(keys.KeyD?1:player.face));});
bindHold('tParry',()=>{tryParry();});
bindHold('tPause',()=>{togglePause();});
bindHold('tFull',()=>{toggleFull();});
function toggleFull(){
const st=$('stage');
try{
if(!document.fullscreenElement&&!document.webkitFullscreenElement){
const rq=st.requestFullscreen||st.webkitRequestFullscreen;
if(rq){const r=rq.call(st);if(r&&r.catch)r.catch(()=>{});}
if(screen.orientation&&screen.orientation.lock){const l=screen.orientation.lock('landscape');if(l&&l.catch)l.catch(()=>{});}
}else{(document.exitFullscreen||document.webkitExitFullscreen).call(document);}
}catch(_){}
}
function autoAim(){
if(!TOUCH||player.dead)return;
let best=null,bd=1e9;
for(const m of mobs){
const d=Math.hypot(m.x-player.x,(m.y-m.h*.5)-(player.y-30));
if(d<bd){bd=d;best=m;}
}
if(best){mouse.x=best.x;mouse.y=best.y-best.h*.5;}
else{mouse.x=player.x+player.face*220;mouse.y=player.y-40;}
}
let wasPausedByRot=false;
function checkOrient(){
if(!TOUCH)return;
const portrait=window.innerHeight>window.innerWidth;
document.body.classList.toggle('portrait',portrait);
if(portrait&&state==='playing'&&!paused){setPaused(true);wasPausedByRot=true;}
else if(!portrait&&wasPausedByRot){setPaused(false);wasPausedByRot=false;}
else $('pauseOv').classList.toggle('hidden',!paused);
}
addEventListener('resize',checkOrient);
addEventListener('orientationchange',()=>setTimeout(checkOrient,120));
checkOrient();
$('stage').addEventListener('touchstart',e=>{if(e.touches.length>1)e.preventDefault();},{passive:false});
document.addEventListener('gesturestart',e=>e.preventDefault());
document.addEventListener('dblclick',e=>e.preventDefault());
