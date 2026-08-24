/* ================= ЭФФЕКТЫ ================= */
function setPaused(v){
paused=!!v;
$('pauseOv').classList.toggle('hidden',!paused);
document.body.classList.toggle('gpaused',paused);
if(paused){holdAtk=false;for(const k in keys)keys[k]=false;
document.querySelectorAll('.tbtn.act').forEach(e=>e.classList.remove('act'));}
}
function togglePause(){if(state==='playing')setPaused(!paused);}
function addShake(a){shakeAmp=Math.min(14,Math.max(shakeAmp,a));}
function spawnParts(n,x,y,color,spd,life,type,grav){
for(let i=0;i<n;i++){const a=rand()*6.28,s=rnd(spd*.3,spd);
particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-(type==='chunk'?120:40),life:rnd(life*.5,life),max:life,c:color,type,grav});}
}
function dust(x,y,n){for(let i=0;i<n;i++)particles.push({x:x+rnd(-10,10),y:y-2,vx:rnd(-60,60),vy:rnd(-70,-10),life:rnd(.25,.5),max:.5,c:'#9aa89b',type:'dust',grav:150});}
function popup(x,y,txt,color,big){popups.push({x,y,txt,color,t:0,big});}
