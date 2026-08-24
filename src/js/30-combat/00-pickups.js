/* ================= ХИЛКИ ================= */
function dropHeart(x,y,n){
for(let i=0;i<n;i++)pickups.push({kind:'heart',x:x+rnd(-12,12),y:y-8,vx:rnd(-110,110),vy:rnd(-330,-190),life:14,t:rand()*6});
}
function dropSouls(x,y,total){
if(total<=0)return;
const n=clamp(Math.round(total/3),1,7);
const per=Math.max(1,Math.round(total/n));
for(let i=0;i<n;i++)pickups.push({kind:'soul',val:per,x:x+rnd(-14,14),y:y-8,vx:rnd(-150,150),vy:rnd(-320,-160),life:16,t:rand()*6});
}
function pickupsUpdate(dt){
const p=player;
const vac=roomVac&&!p.dead;
for(const it of pickups){
it.life-=dt;it.t+=dt;
if(vac){
/* ЗАЧИСТКА ЗАЛА: вся валюта притягивается к игроку и собирается */
const dx=p.x-it.x,dy=(p.y-26)-it.y,d=Math.hypot(dx,dy)||1;
it.vacV=Math.min((it.vacV||300)+2200*dt,1500);
it.x+=dx/d*it.vacV*dt;it.y+=dy/d*it.vacV*dt;
it.vx=0;it.vy=0;
if(it.kind==='soul'){
it.life=Math.max(it.life,.6);
if(d<30){souls+=it.val;runSouls+=it.val;it.life=0;tone(680,980,.08,'triangle',.05);
spawnParts(4,p.x,p.y-26,'#bfe6ff',120,.3,'spark',-60);}
}else if(d<28&&p.hp<S.maxHp){
p.hp=Math.min(S.maxHp,p.hp+1*S.healMul);it.life=0;
popup(p.x,p.y-60,(S.healMul<1?'+½ ♥':'+1 ♥'),'#ff8a9d');
p.healT=.7;p.healCol='rgba(255,138,157,';
spawnParts(10,p.x,p.y-24,'#ff8a9d',140,.6,'spark',-100);
tone(520,780,.14,'triangle',.1);
}
continue;
}
it.vy+=1500*dt;
it.x+=it.vx*dt;it.y+=it.vy*dt;
it.x=clamp(it.x,12,W-12);
if(it.y>=GROUND-8){it.y=GROUND-8;it.vy=Math.abs(it.vy)>90?-it.vy*.42:0;it.vx*=.72;}
if(!p.dead){
const dx=p.x-it.x,dy=(p.y-26)-it.y,d=Math.hypot(dx,dy);
const mag=it.kind==='soul'?150:86;
if(d<mag){const L=d||1;it.vx+=dx/L*900*dt;it.vy+=dy/L*900*dt;}
if(it.kind==='soul'){
if(d<26){souls+=it.val;runSouls+=it.val;it.life=0;tone(680,980,.08,'triangle',.05);}
}else if(d<24&&p.hp<S.maxHp){
p.hp=Math.min(S.maxHp,p.hp+1*S.healMul);it.life=0;
popup(p.x,p.y-60,(S.healMul<1?'+½ ♥':'+1 ♥'),'#ff8a9d');
p.healT=.7;p.healCol='rgba(255,138,157,';
spawnParts(10,p.x,p.y-24,'#ff8a9d',140,.6,'spark',-100);
tone(520,780,.14,'triangle',.1);
}
}
}
pickups=pickups.filter(it=>it.life>0);
}
function drawPickups(){
for(const it of pickups){
if(it.life<3&&Math.floor(it.life*10)%2===0)continue;
if(it.kind==='soul'){
const y2=it.y+Math.sin(it.t*4)*3;
ctx.save();ctx.translate(it.x,y2);
ctx.globalCompositeOperation='lighter';
const gs=ctx.createRadialGradient(0,0,1,0,0,14);
gs.addColorStop(0,'rgba(150,220,255,.55)');gs.addColorStop(1,'rgba(120,190,255,0)');
ctx.fillStyle=gs;ctx.beginPath();ctx.arc(0,0,14,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';
ctx.fillStyle='#bfe6ff';
ctx.beginPath();ctx.moveTo(0,-6);ctx.quadraticCurveTo(5,-1,3,4);
ctx.quadraticCurveTo(0,7,-3,4);ctx.quadraticCurveTo(-5,-1,0,-6);ctx.fill();
ctx.fillStyle='rgba(20,40,60,.8)';
ctx.fillRect(-2.2,-2.6,1.4,1.6);ctx.fillRect(.9,-2.6,1.4,1.6);
ctx.restore();
continue;
}
const s0=1+Math.sin(it.t*6)*.12,y=it.y+Math.sin(it.t*3)*2;
ctx.save();ctx.translate(it.x,y);ctx.scale(s0,s0);
ctx.globalCompositeOperation='lighter';
const g=ctx.createRadialGradient(0,0,1,0,0,18);
g.addColorStop(0,'rgba(255,90,120,.5)');g.addColorStop(1,'rgba(255,90,120,0)');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,18,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';
ctx.fillStyle='#ff5d6b';
ctx.beginPath();
ctx.moveTo(0,6);ctx.bezierCurveTo(-9,-2,-6,-9,0,-4);ctx.bezierCurveTo(6,-9,9,-2,0,6);
ctx.closePath();ctx.fill();
ctx.fillStyle='rgba(255,255,255,.7)';
ctx.beginPath();ctx.ellipse(-3,-3,1.6,2.2,-.5,0,7);ctx.fill();
ctx.restore();
}
}
