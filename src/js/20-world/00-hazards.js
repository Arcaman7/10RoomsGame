/* ================= ФИШКИ ЗАЛОВ ================= */
const GIMMICKS=[
{id:'springs', name:'ГРИБЫ-БАТУТЫ',  tip:'цепочки грибов перебрасывают между ярусами'},
{id:'stalac',  name:'ОБВАЛ',          tip:'частые сталактиты пролетают сквозь уступы до самого пола'},
{id:'bog',     name:'ТРЯСИНА',        tip:'все верхние платформы вязкие; в трясине нельзя кувырнуться'},
{id:'spikes',  name:'КОЛЬЯ',          tip:'секции кольев работают на земле и крепостной стене'},
{id:'dark',    name:'МРАК',           tip:'видно только вокруг себя'},
{id:'slip',    name:'ГОЛОЛЁД',        tip:'лёд покрывает все ярусы; верхние платформы замедляют вдвое'},
{id:'jets',    name:'СТРУИ ПЛАМЕНИ',  tip:'горны бьют огнём на трёх уровнях кузницы'},
{id:'portal',  name:'ПОРТАЛЫ',        tip:'каждый вход выбрасывает из случайного другого портала'},
{id:'lifts',   name:'ПОДЪЁМНИКИ',     tip:'каждые 4 секунды пол рушится до конца комнаты — уходи на платформы'},
{id:'firewave',name:'ВОЛНЫ ОГНЯ',     tip:'пламя идёт по земле и ступеням тронного зала'},
{id:'tide',name:'ПРИЛИВ',tip:'вода меняет высоту, плавучесть и траектории'},
{id:'ink',name:'ЖИВАЯ РУКОПИСЬ',tip:'чернильные росчерки проявляются после телеграфа'},
{id:'stage',name:'СМЕНА СЦЕНЫ',tip:'кулисы по очереди закрывают части сцены'},
{id:'honey',name:'ЛИПКИЕ СОТЫ',tip:'янтарные ячейки тормозят всех внутри'},
{id:'growth',name:'УСКОРЕННЫЙ РОСТ',tip:'семена вырастают в опасные цветы'},
{id:'wind',name:'НАПРАВЛЕНИЕ ВЕТРА',tip:'порывы сдвигают бойцов и искривляют снаряды'},
{id:'fragile',name:'ХРУПКОСТЬ',tip:'фарфоровые осколки падают по отмеченным дугам'},
{id:'conveyor',name:'КОНВЕЙЕР ПИРА',tip:'ленты меняют направление, ножи режут дорожки'},
{id:'gravity',name:'ЛОКАЛЬНАЯ ГРАВИТАЦИЯ',tip:'лунное ядро притягивает всё вокруг'},
{id:'threads',name:'НИТИ РЕАЛЬНОСТИ',tip:'красные стежки прошивают арену между узлами'}
];
let HZ={id:'none',t:0,list:[]};
function initHazard(i){
const g=GIMMICKS[i-1]||{id:'none'};
HZ={id:g.id,t:0,list:[],cool:0,pcd:0,bogs:[],bub:[],iceT:0,hotT:0,falls:[],fallCd:4};
if(g.id==='springs')HZ.list=[{x:170,y:GROUND,sq:0},{x:535,y:GROUND,sq:0},{x:900,y:GROUND,sq:0},{x:1245,y:GROUND,sq:0},{x:535,y:420,sq:0}];
else if(g.id==='stalac')HZ.cool=.9;
else if(g.id==='bog'){
HZ.bogs=[{x0:250,x1:480},{x0:625,x1:855},{x0:1030,x1:1265}];
for(const b of HZ.bogs)for(let k=0;k<6;k++)HZ.bub.push({x:rnd(b.x0+10,b.x1-10),ph:rand()*6.28,sp:rnd(.6,1.4),r:rnd(2,5)});
}
else if(g.id==='spikes'){
HZ.list=[{x:105,y:GROUND,w:150,t:rnd(.5,2.5),st:0},{x:385,y:GROUND,w:150,t:rnd(.5,2.5),st:0},
{x:690,y:GROUND,w:150,t:rnd(.5,2.5),st:0},{x:1010,y:GROUND,w:150,t:rnd(.5,2.5),st:0}];
/* В форте каждая третья надземная платформа целиком получает секцию кольев. */
plats.slice(1).forEach((pl,i)=>{if((i+1)%3===0)HZ.list.push({x:pl.x,y:pl.y,w:pl.w,t:rnd(.5,2.5),st:0,platform:true});});
}
else if(g.id==='jets')HZ.list=[{x:180,y:GROUND,t:rnd(.4,2),st:0},{x:720,y:GROUND,t:rnd(1.4,3),st:0},{x:1240,y:GROUND,t:rnd(.8,2.4),st:0},{x:525,y:385,t:rnd(1,2.8),st:0},{x:1180,y:350,t:rnd(.5,2.5),st:0}];
else if(g.id==='portal')HZ.list=[
{x:105,y:GROUND-34,pair:0},{x:1110,y:215,pair:0},
{x:505,y:420-34,pair:1},{x:1280,y:GROUND-34,pair:1},
{x:800,y:315-34,pair:2},{x:210,y:520-34,pair:2}];
else if(g.id==='firewave')HZ.cool=3.4;
else if(['tide','ink','stage','honey','growth','wind','fragile','conveyor','gravity','threads'].includes(g.id)){
 HZ.cool=1.2;HZ.waterY=GROUND-90;HZ.windDir=1;HZ.core={x:W/2,y:300};HZ.a2=[];
}
}
function inBog(x){
if(HZ.id!=='bog')return false;
for(const b of HZ.bogs)if(x>b.x0&&x<b.x1)return true;
return false;
}
function onUpperSurface(e){return !!(e&&e.grounded&&e.y<GROUND-4);}
function onBogSurface(e){return HZ.id==='bog'&&!!(e&&e.grounded)&&(onUpperSurface(e)||inBog(e.x));}
function floorGapAt(x){return HZ.id==='lifts'&&HZ.falls.some(f=>f.st==='open'&&x>f.x&&x<f.x+f.w);}
function hazardUpdate(dt){
const p=player;HZ.t+=dt;
if(HZ.iceT>0)HZ.iceT-=dt;
if(HZ.hotT>0){
HZ.hotT-=dt;
if(!p.dead&&p.inv<=0&&p.grounded&&rand()<dt*1.6)damagePlayer(p.face*-1,null,1);
if(rand()<dt*40)spawnParts(1,rnd(20,W-20),GROUND-2,'#ff8a3d',70,.5,'spark',-200);
}
if(HZ.id==='springs'){
for(const s of HZ.list){
s.sq+=(0-s.sq)*Math.min(1,dt*7);
const gy=s.y||GROUND;
if(!p.dead&&p.grounded&&p.vy>=0&&Math.abs(p.x-s.x)<26&&Math.abs(p.y-gy)<7){
p.vy=-2000;p.grounded=false;p.djCd=0;p.jbuf=0;s.sq=1;
dust(s.x,gy,6);sfx.djump();
spawnParts(10,s.x,gy-12,'#9fd67a',200,.45,'spark',180);
}
}
}else if(HZ.id==='stalac'){
HZ.cool-=dt;
if(HZ.cool<=0){
HZ.cool=rnd(.75,1.3);
const sx=clamp(p.x+rnd(-170,170),40,W-40);
HZ.list.push({x:sx,warn:.85,y:14,vy:0,floor:GROUND,gone:false,hitPlayer:false});
}
for(const s of HZ.list){
if(s.warn>0){s.warn-=dt;if(s.warn<=0)noiseS(.12,.12,700);continue;}
s.vy+=1900*dt;s.y+=s.vy*dt;
if(!s.hitPlayer&&!p.dead&&p.inv<=0&&Math.abs(p.x-s.x)<20&&Math.abs((p.y-24)-s.y)<30){
damagePlayer(p.x>=s.x?1:-1,null,1.5);s.hitPlayer=true;
}
if(s.y>=(s.floor||GROUND)-8){
const gy=s.floor||GROUND;s.gone=true;addShake(5);dust(s.x,gy,6);noiseS(.18,.2,400);
spawnParts(14,s.x,gy-8,'#8a97a8',300,.5,'chunk',700);
}
}
HZ.list=HZ.list.filter(s=>!s.gone);
}else if(HZ.id==='bog'){
if(!p.dead&&onBogSurface(p)&&rand()<dt*14)
spawnParts(1,p.x+rnd(-8,8),p.y-2,'#b6d94a',60,.4,'spark',180);
}else if(HZ.id==='spikes'){
for(const s of HZ.list){
s.t-=dt;
if(s.t<=0){
if(s.st===0){s.st=1;s.t=.5;}
else if(s.st===1){s.st=2;s.t=.7;noiseS(.1,.16,900);addShake(3);}
else {s.st=0;s.t=rnd(1.7,3.1);}
}
if(s.st===2){
const gy=s.y||GROUND;
if(!p.dead&&p.inv<=0&&p.y>gy-32&&p.y<gy+22&&p.x>s.x&&p.x<s.x+s.w)damagePlayer(p.x<s.x+s.w/2?-1:1,null,1.5);
}
}
}else if(HZ.id==='jets'){
for(const s of HZ.list){
s.t-=dt;
if(s.t<=0){
if(s.st===0){s.st=1;s.t=.6;}
else if(s.st===1){s.st=2;s.t=.85;noiseS(.5,.16,600);}
else {s.st=0;s.t=rnd(1.5,2.8);}
}
if(s.st===2){
const gy=s.y||GROUND;
if(!p.dead&&p.inv<=0&&Math.abs(p.x-s.x)<26&&p.y>gy-180&&p.y<gy+22)damagePlayer(p.x>=s.x?1:-1,null,1.5);
if(rand()<dt*36)spawnParts(1,s.x+rnd(-12,12),gy-rnd(0,165),'#ff9d45',70,.5,'spark',-220);
}
}
}else if(HZ.id==='portal'){
HZ.pcd-=dt;
if(!p.dead&&HZ.pcd<=0){
for(let i=0;i<HZ.list.length;i++){
const a=HZ.list[i];
if(Math.abs(p.x-a.x)<26&&Math.abs((p.y-24)-a.y)<36){
const exits=HZ.list.filter((q,j)=>j!==i),b=pick(exits);if(!b)break;
spawnParts(16,a.x,a.y,'#b48aff',280,.5,'spark',40);
p.x=b.x;p.y=b.y+24;p.grounded=false;p.coyote=0;HZ.pcd=.6;
spawnParts(16,b.x,b.y,'#b48aff',280,.5,'spark',40);
sfx.cast();addShake(3);
break;
}
}
}
}else if(HZ.id==='lifts'){
HZ.fallCd-=dt;
if(HZ.fallCd<=0){HZ.fallCd=4;
const centers=[170,440,720,1000,1270],free=centers.filter(cx=>!HZ.falls.some(f=>Math.abs((f.x+f.w/2)-cx)<90));
if(free.length){const cx=pick(free),w=170;HZ.falls.push({x:clamp(cx-w/2,20,W-w-20),w,st:'warn',t:1});
popup(cx,GROUND-55,'ПОЛ ТРЕЩИТ!','#ff9d6b',true);noiseS(.18,.14,260);}}
for(const f of HZ.falls)if(f.st==='warn'){f.t-=dt;
if(f.t<=0){f.st='open';f.t=0;addShake(6);noiseS(.3,.22,180);}}
for(const pl of plats){
if(!pl.mv)continue;
const ny=pl.mv.y0+Math.sin(HZ.t*pl.mv.sp+pl.mv.ph)*pl.mv.amp;
const dy=ny-pl.y;
if(!p.dead&&p.grounded&&Math.abs(p.y-pl.y)<3&&p.x>pl.x-14&&p.x<pl.x+pl.w+14)p.y+=dy;
pl.y=ny;
}
if(!p.dead&&p.y>H+18){
damagePlayer(p.x<W/2?-1:1,null,1.5);
/* Возвращаем героя над постоянной входной платформой, а не над уже разрушенным центром пола. */
const refuge=plats.find(pl=>!pl.ground&&!pl.mv)||plats[1];
if(refuge){p.x=refuge.x+refuge.w/2;p.y=refuge.y-48;}
else {p.x=W/2;p.y=GROUND-95;}
p.vy=-260;p.grounded=false;p.inv=Math.max(p.inv,.8);
}
}else if(HZ.id==='firewave'){
HZ.cool-=dt;
if(HZ.cool<=0){
HZ.cool=rnd(4.6,6.6);
const dir=rand()<.5?1:-1;
const lanes=[GROUND,455,365],lane=pick(lanes);
HZ.list.push({x:dir>0?-30:W+30,vx:dir*330,warn:.9,y:lane});
if(lane===GROUND)HZ.list.push({x:dir>0?W+30:-30,vx:-dir*275,warn:1.7,y:455});
popup(W/2,150,'ВОЛНА ОГНЯ!','#ff8a3d',true);
addShake(3);noiseS(.5,.14,300);
}
for(const f of HZ.list){
if(f.warn>0){f.warn-=dt;continue;}
f.x+=f.vx*dt;
const gy=f.y||GROUND;
if(!p.dead&&p.inv<=0&&Math.abs(p.x-f.x)<26&&p.y>gy-48&&p.y<gy+24)damagePlayer(Math.sign(f.vx),null,1.5);
if(rand()<dt*44)spawnParts(1,f.x+rnd(-14,14),gy-rnd(0,44),'#ff9d45',90,.5,'spark',-160);
}
HZ.list=HZ.list.filter(f=>f.x>-70&&f.x<W+70);
}else if(['tide','ink','stage','honey','growth','wind','fragile','conveyor','gravity','threads'].includes(HZ.id)){
 const id=HZ.id;HZ.cool-=dt;
 if(id==='tide'){
  HZ.waterY=GROUND-115-Math.sin(HZ.t*.55)*105;
  if(!p.dead&&p.y>HZ.waterY){p.vy-=GRAV*.72*dt;p.vx+=Math.sin(HZ.t*.9)*70*dt;if(rand()<dt*12)spawnParts(1,p.x+rnd(-12,12),p.y-rnd(0,45),'#9ff3ff',45,.5,'spark',-80);}
 }else if(id==='wind'){
  if(HZ.cool<=0){HZ.cool=4.5;HZ.windDir*=-1;popup(W/2,120,HZ.windDir>0?'ВЕТЕР →':'← ВЕТЕР','#bcecff',true);}
  const push=HZ.windDir*(p.grounded?75:190);p.vx+=push*dt;for(const pr of projs){pr.vx+=HZ.windDir*35*dt;}
 }else if(id==='gravity'){
  HZ.core.x=W/2+Math.sin(HZ.t*.45)*300;HZ.core.y=260+Math.cos(HZ.t*.6)*90;
  const dx=HZ.core.x-p.x,dy=HZ.core.y-(p.y-25),L=Math.hypot(dx,dy)||1;p.vx+=dx/L*180*dt;p.vy+=dy/L*150*dt;
  for(const pr of projs){const qx=HZ.core.x-pr.x,qy=HZ.core.y-pr.y,Q=Math.hypot(qx,qy)||1;pr.vx+=qx/Q*65*dt;pr.vy+=qy/Q*65*dt;}
 }else if(id==='conveyor'){
  if(HZ.cool<=0){HZ.cool=3.6;HZ.windDir*=-1;HZ.a2.push({kind:'knife',x:clamp(p.x+rnd(-160,160),40,W-40),warn:.8,life:1.1});}
  if(p.grounded)p.vx+=HZ.windDir*145*dt;
 }else{
  if(HZ.cool<=0){
   HZ.cool=id==='threads'?2.8:rnd(2.5,3.8);
   if(id==='ink')HZ.a2.push({kind:'line',x1:rand()<.5?0:rnd(80,W-80),y1:rand()<.5?p.y-25:70,x2:rand()<.5?W:rnd(80,W-80),y2:rand()<.5?p.y-25:GROUND,warn:.85,life:.8});
   else if(id==='stage')HZ.a2.push({kind:'curtain',x:rand()<.5?0:W*.58,w:W*.42,warn:.9,life:1.0});
   else if(id==='honey')HZ.a2.push({kind:'honey',x:clamp(p.x+rnd(-130,130),70,W-70),y:p.y-20,r:95,warn:.75,life:3.4});
   else if(id==='growth')HZ.a2.push({kind:'flower',x:clamp(p.x+rnd(-180,180),45,W-45),y:GROUND-8,r:58,warn:.9,life:1.2});
   else if(id==='fragile')for(let k=0;k<3;k++)HZ.a2.push({kind:'shard',x:clamp(p.x+(k-1)*95,35,W-35),warn:.7+k*.18,life:1.1});
   else if(id==='threads'){const x1=rnd(30,W-30),y1=rnd(90,GROUND-40),x2=rnd(30,W-30),y2=rnd(90,GROUND-40);HZ.a2.push({kind:'thread',x1,y1,x2,y2,warn:.9,life:1.6});}
  }
 }
 for(const e of HZ.a2||[]){
  if(e.warn>0){e.warn-=dt;continue;}e.life-=dt;
  if(p.dead||p.inv>0)continue;
  let hit=false;
  if(e.kind==='line'||e.kind==='thread')hit=segDist(p.x,p.y-25,e.x1,e.y1,e.x2,e.y2)<(e.kind==='thread'?15:24);
  else if(e.kind==='curtain')hit=p.x>e.x&&p.x<e.x+e.w;
  else if(e.kind==='honey'){hit=false;if(Math.hypot(p.x-e.x,(p.y-25)-e.y)<e.r)p.webT=.25;}
  else if(e.kind==='flower')hit=Math.hypot(p.x-e.x,p.y-e.y)<e.r;
  else if(e.kind==='shard'||e.kind==='knife')hit=Math.abs(p.x-e.x)<24;
  if(hit)damagePlayer(p.x<(e.x||W/2)?-1:1,null,e.kind==='honey'?.25:.55);
 }
 HZ.a2=(HZ.a2||[]).filter(e=>e.warn>0||e.life>0);
}
}
/* ---- отрисовка фишек ---- */
function hazardDrawBack(){
if(HZ.id==='bog'){
for(const b of HZ.bogs){
const w=b.x1-b.x0,top=GROUND+1;
ctx.fillStyle='#050904';ctx.fillRect(b.x0,top,w,H-top);
const g=ctx.createLinearGradient(0,top,0,top+42);
g.addColorStop(0,'#3f6a1a');g.addColorStop(.35,'#1f3c11');g.addColorStop(1,'#070d05');
ctx.fillStyle=g;
ctx.beginPath();ctx.moveTo(b.x0,top+46);
for(let i=0;i<=w;i+=6){const yy=top+Math.sin(time*1.5+i*.09)*2.5;i?ctx.lineTo(b.x0+i,yy):ctx.lineTo(b.x0,yy);}
ctx.lineTo(b.x1,top+46);ctx.closePath();ctx.fill();
ctx.strokeStyle='rgba(182,217,74,.38)';ctx.lineWidth=1.4;
ctx.beginPath();
for(let i=0;i<=w;i+=6){const yy=top+Math.sin(time*1.5+i*.09)*2.5;i?ctx.lineTo(b.x0+i,yy):ctx.moveTo(b.x0,yy);}
ctx.stroke();
for(const bb of HZ.bub){
const t0=(time*bb.sp+bb.ph)%1.8;
if(t0>1.2)continue;
ctx.globalAlpha=.5*(1-t0/1.2);
ctx.fillStyle='#c4e86a';
ctx.beginPath();ctx.arc(bb.x,top+12-t0*12,bb.r*(1-t0*.35),0,7);ctx.fill();
ctx.globalAlpha=1;
}
ctx.globalCompositeOperation='lighter';
const mg=ctx.createLinearGradient(0,top-34,0,top+4);
mg.addColorStop(0,'rgba(150,200,70,0)');mg.addColorStop(1,'rgba(150,200,70,.13)');
ctx.fillStyle=mg;ctx.fillRect(b.x0,top-34,w,38);
ctx.globalCompositeOperation='source-over';
ctx.fillStyle='rgba(0,0,0,.6)';
ctx.fillRect(b.x0-3,GROUND,5,14);ctx.fillRect(b.x1-2,GROUND,5,14);
ctx.fillStyle=theme.ground[0];
ctx.fillRect(b.x0-14,GROUND,14,3);ctx.fillRect(b.x1,GROUND,14,3);
}
}else if(HZ.id==='springs'){
for(const s of HZ.list){
const sq=s.sq;
const gy=s.y||GROUND;
const h=17*(1-sq*.55),rw=19*(1+sq*.3);
ctx.fillStyle='#6d5a3a';ctx.fillRect(s.x-4,gy-h*.5,8,h*.5);
const g=ctx.createLinearGradient(s.x,gy-h-8,s.x,gy-h*.4);
g.addColorStop(0,'#c85a5a');g.addColorStop(1,'#7d2f36');
ctx.fillStyle=g;
ctx.beginPath();ctx.ellipse(s.x,gy-h*.5,rw,h,0,Math.PI,0);ctx.fill();
ctx.fillStyle='rgba(255,235,200,.75)';
ctx.beginPath();ctx.arc(s.x-6,gy-h*.9,2.4,0,7);ctx.fill();
ctx.beginPath();ctx.arc(s.x+7,gy-h*1.1,2,0,7);ctx.fill();
ctx.beginPath();ctx.arc(s.x+1,gy-h*1.35,2.6,0,7);ctx.fill();
}
}else if(HZ.id==='portal'){
for(const a of HZ.list){
ctx.globalCompositeOperation='lighter';
const g=ctx.createRadialGradient(a.x,a.y,2,a.x,a.y,52);
g.addColorStop(0,'rgba(180,138,255,.28)');g.addColorStop(1,'rgba(180,138,255,0)');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(a.x,a.y,52,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';
}
}else if(HZ.id==='lifts'){
for(const f of HZ.falls){
if(f.st==='warn'){
const a=.35+.35*Math.sin(time*28);ctx.strokeStyle='rgba(255,130,85,'+a+')';ctx.lineWidth=3;
ctx.beginPath();ctx.moveTo(f.x,GROUND-2);ctx.lineTo(f.x+f.w*.22,GROUND-15);ctx.lineTo(f.x+f.w*.45,GROUND-3);
ctx.lineTo(f.x+f.w*.68,GROUND-18);ctx.lineTo(f.x+f.w,GROUND-2);ctx.stroke();
}else{
const g=ctx.createLinearGradient(0,GROUND-3,0,H);g.addColorStop(0,'#020304');g.addColorStop(1,'#14080c');
ctx.fillStyle=g;ctx.fillRect(f.x,GROUND-4,f.w,H-GROUND+8);
ctx.strokeStyle='rgba(255,93,107,.45)';ctx.lineWidth=2;ctx.strokeRect(f.x,GROUND-5,f.w,5);
}}
}
}
function drawBossFloor(){
if(HZ.iceT>0){
ctx.globalAlpha=Math.min(.55,HZ.iceT*.3);
const g=ctx.createLinearGradient(0,GROUND-14,0,GROUND+6);
g.addColorStop(0,'rgba(190,240,255,.55)');g.addColorStop(1,'rgba(120,190,230,.15)');
ctx.fillStyle=g;ctx.fillRect(0,GROUND-10,W,16);ctx.globalAlpha=1;
}
if(HZ.hotT>0){
ctx.globalAlpha=Math.min(.6,HZ.hotT*.32)*(.7+Math.sin(time*9)*.3);
const g=ctx.createLinearGradient(0,GROUND-16,0,GROUND+6);
g.addColorStop(0,'rgba(255,150,60,.6)');g.addColorStop(1,'rgba(180,50,10,.2)');
ctx.fillStyle=g;ctx.fillRect(0,GROUND-12,W,18);ctx.globalAlpha=1;
}
}
function drawAct2Hazard(){
if(HZ.id==='tide'){
 const y=HZ.waterY||GROUND;const g=ctx.createLinearGradient(0,y,0,H);g.addColorStop(0,'rgba(80,225,235,.22)');g.addColorStop(1,'rgba(5,35,55,.68)');ctx.fillStyle=g;ctx.fillRect(0,y,W,H-y);
 ctx.strokeStyle='rgba(190,250,255,.65)';ctx.lineWidth=3;ctx.beginPath();for(let x=0;x<=W;x+=18){const yy=y+Math.sin(time*2+x*.025)*5;x?ctx.lineTo(x,yy):ctx.moveTo(x,yy);}ctx.stroke();
}else if(HZ.id==='wind'){
 ctx.strokeStyle='rgba(190,236,255,.25)';ctx.lineWidth=2;for(let k=0;k<12;k++){const x=((time*180*(HZ.windDir||1)+k*137)%W+W)%W,y=90+(k*71)%430;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-(HZ.windDir||1)*70,y+Math.sin(k)*8);ctx.stroke();}
}else if(HZ.id==='gravity'&&HZ.core){
 const q=HZ.core;ctx.save();ctx.globalCompositeOperation='lighter';for(let k=0;k<4;k++){ctx.strokeStyle=`rgba(169,200,255,${.5-k*.09})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(q.x,q.y,20+k*16,time*(k%2?-.5:.5)+k,time*(k%2?-.5:.5)+k+4.8);ctx.stroke();}ctx.restore();
}else if(HZ.id==='conveyor'){
 ctx.fillStyle='rgba(20,15,15,.7)';ctx.fillRect(0,GROUND-10,W,14);ctx.strokeStyle='#d4a36a';ctx.lineWidth=2;for(let x=0;x<W;x+=55){const q=(x+time*80*(HZ.windDir||1))%W;ctx.beginPath();ctx.moveTo(q,GROUND-9);ctx.lineTo(q+(HZ.windDir||1)*24,GROUND-3);ctx.stroke();}
}
for(const e of HZ.a2||[]){const warning=e.warn>0,a=warning?.35+.35*Math.sin(time*20):clamp(e.life,0,1);ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(255,110,90,${a})`;ctx.fillStyle=`rgba(255,90,70,${a*.16})`;ctx.lineWidth=warning?2:8;ctx.setLineDash(warning?[9,7]:[]);
 if(e.kind==='line'||e.kind==='thread'){if(e.kind==='thread')ctx.strokeStyle=`rgba(243,207,114,${a})`;ctx.beginPath();ctx.moveTo(e.x1,e.y1);ctx.lineTo(e.x2,e.y2);ctx.stroke();}
 else if(e.kind==='curtain'){ctx.fillStyle=`rgba(120,15,55,${warning?a*.18:a*.58})`;ctx.fillRect(e.x,50,e.w,GROUND-50);ctx.strokeRect(e.x,50,e.w,GROUND-50);}
 else if(e.kind==='honey'||e.kind==='flower'){ctx.translate(e.x,e.y);ctx.scale(1,.35);ctx.beginPath();ctx.arc(0,0,e.r,0,7);ctx.fill();ctx.stroke();}
 else if(e.kind==='shard'||e.kind==='knife'){ctx.beginPath();ctx.moveTo(e.x-18,30);ctx.lineTo(e.x,warning?80:GROUND-10);ctx.lineTo(e.x+18,30);ctx.stroke();}
 ctx.setLineDash([]);ctx.restore();}
}
function hazardDrawFront(){
drawAct2Hazard();
if(HZ.id==='spikes'){
for(const s of HZ.list){
const gy=s.y||GROUND;
const out=s.st===2?1:(s.st===1?.14+.08*Math.sin(time*34):0);
ctx.fillStyle='rgba(10,10,12,.75)';ctx.fillRect(s.x,gy-2,s.w,5);
if(s.st===1){
ctx.strokeStyle='rgba(255,120,80,'+(.35+.35*Math.sin(time*22))+')';ctx.lineWidth=2;
ctx.strokeRect(s.x+1,gy-24,s.w-2,24);
}
if(out<=0)continue;
const H0=30*out;
for(let i=6;i<s.w;i+=17){
const g=ctx.createLinearGradient(0,gy-H0,0,gy);
g.addColorStop(0,'#e8eef0');g.addColorStop(1,'#5c6468');
ctx.fillStyle=g;
ctx.beginPath();ctx.moveTo(s.x+i-6,gy+2);ctx.lineTo(s.x+i,gy-H0);ctx.lineTo(s.x+i+6,gy+2);ctx.closePath();ctx.fill();
}
}
}else if(HZ.id==='stalac'){
for(const s of HZ.list){
if(s.warn>0){
const a=.3+.4*Math.sin(time*26);
ctx.strokeStyle='rgba(255,110,70,'+a+')';ctx.lineWidth=2;
ctx.beginPath();ctx.moveTo(s.x-16,10);ctx.lineTo(s.x,26);ctx.lineTo(s.x+16,10);ctx.stroke();
ctx.setLineDash([5,6]);ctx.lineWidth=1.5;
ctx.strokeStyle='rgba(255,110,70,'+(a*.6)+')';
ctx.beginPath();ctx.moveTo(s.x,28);ctx.lineTo(s.x,(s.floor||GROUND)-4);ctx.stroke();ctx.setLineDash([]);
ctx.fillStyle='rgba(255,110,70,'+(a*.35)+')';
ctx.beginPath();ctx.ellipse(s.x,(s.floor||GROUND)-2,20,5,0,0,7);ctx.fill();
continue;
}
const g=ctx.createLinearGradient(0,s.y-22,0,s.y+16);
g.addColorStop(0,'#5c6874');g.addColorStop(1,'#161c22');
ctx.fillStyle=g;
ctx.beginPath();ctx.moveTo(s.x-13,s.y-20);ctx.lineTo(s.x+13,s.y-20);ctx.lineTo(s.x,s.y+16);ctx.closePath();ctx.fill();
ctx.fillStyle='rgba(255,255,255,.18)';
ctx.beginPath();ctx.moveTo(s.x-5,s.y-18);ctx.lineTo(s.x-1,s.y-18);ctx.lineTo(s.x-3,s.y+6);ctx.closePath();ctx.fill();
}
}else if(HZ.id==='jets'){
for(const s of HZ.list){
const gy=s.y||GROUND;
if(s.st===1){
const a=.25+.35*Math.sin(time*24);
ctx.fillStyle='rgba(255,140,50,'+a+')';
ctx.beginPath();ctx.ellipse(s.x,gy-2,20,6,0,0,7);ctx.fill();
ctx.globalAlpha=a*.5;ctx.fillStyle='#ff8a3d';ctx.fillRect(s.x-16,gy-30,32,30);ctx.globalAlpha=1;
}else if(s.st===2){
ctx.globalCompositeOperation='lighter';
const g=ctx.createLinearGradient(0,gy,0,gy-170);
g.addColorStop(0,'rgba(255,240,180,.85)');g.addColorStop(.45,'rgba(255,140,50,.6)');g.addColorStop(1,'rgba(255,60,20,0)');
ctx.fillStyle=g;
ctx.beginPath();
ctx.moveTo(s.x-22,gy+4);
for(let y=0;y<=170;y+=17){const wob=Math.sin(time*13+y*.09)*5;ctx.lineTo(s.x-14+wob-6*(1-y/170),gy-y);}
for(let y=170;y>=0;y-=17){const wob=Math.sin(time*13+y*.09+1)*5;ctx.lineTo(s.x+14+wob+6*(1-y/170),gy-y);}
ctx.closePath();ctx.fill();
ctx.globalCompositeOperation='source-over';
}
}
}else if(HZ.id==='portal'){
for(let i=0;i<HZ.list.length;i++){
const a=HZ.list[i];
ctx.save();ctx.translate(a.x,a.y);
ctx.fillStyle='rgba(20,12,40,.85)';
ctx.beginPath();ctx.ellipse(0,0,20,34,0,0,7);ctx.fill();
for(let k=0;k<3;k++){
const r0=time*(1.6+k*.7)+i*2+k;
ctx.strokeStyle='rgba(180,138,255,'+(.75-k*.18)+')';ctx.lineWidth=2.5-k*.6;
ctx.beginPath();ctx.ellipse(0,0,20-k*5,34-k*8,0,r0,r0+4.2);ctx.stroke();
}
ctx.fillStyle='rgba(232,220,255,.9)';
ctx.beginPath();ctx.ellipse(0,0,4+Math.sin(time*5+i)*1.2,7+Math.sin(time*5+i)*1.6,0,0,7);ctx.fill();
ctx.restore();
}
}else if(HZ.id==='firewave'){
for(const f of HZ.list){
const gy=f.y||GROUND;
if(f.warn>0){
const a=.3+.4*Math.sin(time*24);
ctx.fillStyle='rgba(255,120,40,'+a+')';
const ex=f.vx>0?10:W-10;
ctx.beginPath();ctx.moveTo(ex,gy-50);ctx.lineTo(ex+(f.vx>0?26:-26),gy-26);ctx.lineTo(ex,gy-2);ctx.closePath();ctx.fill();
continue;
}
ctx.globalCompositeOperation='lighter';
const g=ctx.createLinearGradient(0,gy+4,0,gy-58);
g.addColorStop(0,'rgba(255,240,190,.9)');g.addColorStop(.4,'rgba(255,140,50,.75)');g.addColorStop(1,'rgba(255,60,20,0)');
ctx.fillStyle=g;
ctx.beginPath();ctx.moveTo(f.x-26,gy+6);
for(let y=0;y<=58;y+=8){const wob=Math.sin(time*15+y*.16+f.x*.05)*6;ctx.lineTo(f.x-18+wob-8*(1-y/58),gy-y);}
for(let y=58;y>=0;y-=8){const wob=Math.sin(time*15+y*.16+f.x*.05+1.4)*6;ctx.lineTo(f.x+18+wob+8*(1-y/58),gy-y);}
ctx.closePath();ctx.fill();
ctx.globalCompositeOperation='source-over';
}
}
}
let darkCvs=null,darkCtx=null;
function drawDarkness(){
if(HZ.id!=='dark')return;
const p=player;
if(!darkCvs){darkCvs=document.createElement('canvas');darkCvs.width=W;darkCvs.height=H;darkCtx=darkCvs.getContext('2d');}
const d2=darkCtx;
d2.setTransform(1,0,0,1,0,0);
d2.globalCompositeOperation='source-over';
d2.clearRect(0,0,W,H);
d2.fillStyle='rgba(3,4,8,.93)';d2.fillRect(0,0,W,H);
d2.globalCompositeOperation='destination-out';
const holes=[{x:p.x,y:p.y-26,r:172+Math.sin(time*3)*7}];
if(bossRef)holes.push({x:bossRef.x,y:bossRef.y-bossRef.h/2,r:115});
for(const d of decos)if(d.t==='candle')holes.push({x:d.x,y:GROUND-18,r:82});
for(const s of strikes)holes.push({x:s.x,y:GROUND-60,r:90});
for(const h of holes){
const g=d2.createRadialGradient(h.x,h.y,h.r*.2,h.x,h.y,h.r);
g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.55,'rgba(0,0,0,.8)');g.addColorStop(1,'rgba(0,0,0,0)');
d2.fillStyle=g;d2.beginPath();d2.arc(h.x,h.y,h.r,0,7);d2.fill();
}
d2.globalCompositeOperation='source-over';
ctx.drawImage(darkCvs,0,0,W,H);
}
function drawBlind(){
const p=player;
const g=ctx.createRadialGradient(p.x,p.y-26,120,p.x,p.y-26,340);
g.addColorStop(0,'rgba(2,3,6,0)');g.addColorStop(.6,'rgba(2,3,6,.55)');g.addColorStop(1,'rgba(2,3,6,.93)');
ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
}
