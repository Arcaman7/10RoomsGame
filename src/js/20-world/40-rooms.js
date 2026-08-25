/* ================= КОМНАТЫ ================= */
function buildDeco(r){
decos=[];stars=[];tufts=[];flies=[];
const d=r.deco;
if(d==='forest'||d==='lair'){const n=d==='forest'?9:8;
for(let i=0;i<n;i++)decos.push({t:'tree',x:rnd(20,W-20),h:rnd(60,120)});
if(d==='lair')for(let i=0;i<4;i++)decos.push({t:'spike',x:rnd(20,W-20),h:rnd(20,50)});
for(let x=6;x<W;x+=rnd(14,30))tufts.push({x,h:rnd(5,11),ph:rand()*6.28});
}else if(d==='cave'){
for(let i=0;i<14;i++)decos.push({t:'stal',x:rnd(10,W-10),h:rnd(24,100)});
for(let i=0;i<9;i++)decos.push({t:'stal2',x:rnd(10,W-10),h:rnd(12,40)});
for(let i=0;i<8;i++)decos.push({t:'cryst',x:rnd(10,W-10),h:rnd(8,22),c:'#7fb4d8'});
}else if(d==='swamp'){
for(let i=0;i<10;i++)decos.push({t:'reed',x:rnd(10,W-10),h:rnd(20,44),ph:rand()*6.28});
for(let i=0;i<3;i++)decos.push({t:'pool',x:rnd(80,W-80),w:rnd(70,150)});
for(let i=0;i<3;i++)decos.push({t:'tree',x:rnd(20,W-20),h:rnd(80,130)});
}else if(d==='ruins'||d==='crypt'){
for(let i=0;i<5;i++)decos.push({t:'pil',x:rnd(30,W-30),w:rnd(14,24),h:rnd(40,95),j:[rnd(-3,3),rnd(-3,3)]});
if(d==='crypt'){for(let i=0;i<7;i++)decos.push({t:'grave',x:rnd(30,W-30),h:rnd(18,30)});
for(let i=0;i<5;i++)decos.push({t:'candle',x:rnd(40,W-40)});}
else decos.push({t:'arch',x:rnd(200,W-300)});
}else if(d==='ice'){
for(let i=0;i<7;i++)decos.push({t:'stal',x:rnd(10,W-10),h:rnd(20,70)});
for(let i=0;i<8;i++)decos.push({t:'cryst',x:rnd(10,W-10),h:rnd(12,34),c:'#8fe0ff'});
}else if(d==='forge'){
decos.push({t:'furnace',x:190});decos.push({t:'furnace',x:720});decos.push({t:'furnace',x:1250});
decos.push({t:'anvil',x:rnd(560,880)});
for(let i=0;i<5;i++)decos.push({t:'chain',x:rnd(100,W-100)});
}else if(d==='tower'){
for(let i=0;i<3;i++)decos.push({t:'shelf',x:rnd(60,W-160)});
for(let i=0;i<4;i++)decos.push({t:'rune',x:rnd(40,W-40),ph:rand()*6.28});
for(let i=0;i<5;i++)decos.push({t:'book',x:rnd(60,W-60),y:rnd(140,520),ph:rand()*6.28});
}else if(d==='throne'){
decos.push({t:'throne',x:W/2});
decos.push({t:'banner',x:350});decos.push({t:'banner',x:1090});
decos.push({t:'pil',x:150,w:26,h:150,j:[0,0]});decos.push({t:'pil',x:1290,w:26,h:150,j:[0,0]});
}else if(['tide','ink','stage','hive','garden','shipyard','porcelain','kitchen','moon','loom'].includes(d)){
 const k=['tide','ink','stage','hive','garden','shipyard','porcelain','kitchen','moon','loom'].indexOf(d);
 for(let i=0;i<7;i++){
  const x=70+i*215+rnd(-25,25);
  if(d==='tide')decos.push({t:i%2?'cryst':'chain',x,h:rnd(20,55),c:'#65e3e6'});
  else if(d==='ink')decos.push({t:i%2?'book':'shelf',x,y:rnd(170,500),ph:rand()*6.28});
  else if(d==='stage')decos.push({t:i%2?'banner':'candle',x});
  else if(d==='hive')decos.push({t:'rune',x,ph:i*.9});
  else if(d==='garden')decos.push({t:i%2?'reed':'tree',x,h:rnd(45,115),ph:rand()*6.28});
  else if(d==='shipyard')decos.push({t:i%2?'chain':'banner',x});
  else if(d==='porcelain')decos.push({t:i%2?'pil':'cryst',x,w:18,h:rnd(40,100),j:[0,0],c:'#8fbce8'});
  else if(d==='kitchen')decos.push({t:i%2?'furnace':'chain',x});
  else if(d==='moon')decos.push({t:i%2?'rune':'cryst',x,ph:i,c:'#a9c8ff'});
  else decos.push({t:i%2?'rune':'chain',x,ph:k+i});
 }
}
const hasSky=!(d==='cave'||d==='crypt'||d==='tower');
if(hasSky)for(let i=0;i<105;i++)stars.push({x:rand()*W,y:rand()*400,r:rand()*1.3+.3,ph:rand()*6.28,sp:rnd(.6,2.2)});
for(let i=0;i<9;i++)flies.push({x:rnd(60,W-60),y:rnd(GROUND-220,GROUND-20),ph:rand()*6.28,r1:rnd(14,40),r2:rnd(8,20),s1:rnd(.2,.6),s2:rnd(.3,.7)});
}
function cyc(i){return ((i-1)%RUN_LEN+RUN_LEN)%RUN_LEN;}
function loadRoom(i){
 theme=ROOMS[cyc(i)];
 RS=roomScale(i,1);
 RS.wallHp=RS.hp;RS.mobDmg=RS.dmg;RS.bossDmg=RS.dmg;
 RS.mobAbilityDmg=RS.dmg;RS.bossAbilityDmg=RS.dmg;RS.debuffPower=1;
 if(endless){
/* БЕЗДНА: одна плавная кривая без скачков на границах десятков. */
const cap=roomScale(ABYSS_START,1),a=abyssScale(i),n=Math.max(0,i-ABYSS_START);
 RS.hp=cap.hp*a.mobHp;RS.wallHp=cap.hp*a.wallHp;RS.bhp=cap.bhp*a.bossHp;
 RS.mobDmg=cap.dmg*a.mobDmg;RS.bossDmg=cap.dmg*a.bossDmg;
 RS.mobAbilityDmg=RS.mobDmg*a.abilityPower;RS.bossAbilityDmg=RS.bossDmg*a.abilityPower;
 RS.debuffPower=a.debuffPower;
RS.hazardDmg=cap.dmg*Math.pow(1.055,n);RS.dmg=RS.mobDmg;
RS.spd=cap.spd*a.moveSpeed;RS.atkSpeed=a.atkSpeed;RS.controlResist=a.controlResist;
RS.projSpeed=a.projSpeed;RS.warnMul=a.warnMul;RS.zoneMul=a.zoneMul;
RS.spawn=Math.max(.55,cap.spawn/a.atkSpeed);
RS.extra=cap.extra+Math.floor(n*1.2);
RS.boss=Math.max(.38,cap.boss/a.atkSpeed);}
 if(challengeRoom){const a2=!endless&&i>ACT1_LEN;RS.hp*=a2?1.35:1.5;RS.wallHp*=a2?1.35:1.5;RS.spawn=Math.max(.45,RS.spawn*(a2?.9:.85));RS.extra+=1;}
 if(ascOn(4)){RS.hp*=1.2;RS.wallHp*=1.2;}
if(ascOn(1))RS.boss*=.8;
 if(hasCurse('greed')){RS.hp*=1.25;RS.wallHp*=1.25;}
buildDeco(theme);
plats=[{x:-40,y:GROUND,w:W+80,h:80,ground:true},...LAYOUTS[theme.layout].map(p=>({...p}))];
initHazard(cyc(i)+1);
if(HZ.id==='conveyor')plats.forEach((pl,k)=>{if(!pl.ground)pl.convDir=k%2?1:-1;});
if(HZ.id==='lifts'){
/* Первая низкая платформа — постоянная точка входа; остальные пять работают как подъёмники. */
plats.forEach((pl,k)=>{if(k>1)pl.mv={y0:pl.y,amp:k===2?60:88,sp:.6+k*.13,ph:k*2.1};});
}
mobs=[];projs=[];particles=[];popups=[];fxList=[];strikes=[];bossEvents=[];bossRef=null;bossDefeated=false;rollGhosts=[];pickups=[];CORPSES.length=0;
minionPool=theme.monsters.map(a=>a[0]);
queue=[];
for(const [t,n] of theme.monsters)for(let k=0;k<n;k++)queue.push(t);
for(let k=0;k<RS.extra;k++)queue.push(theme.monsters[Math.floor(rand()*theme.monsters.length)][0]);
for(let k=queue.length-1;k>0;k--){const j=Math.floor(rand()*(k+1));[queue[k],queue[j]]=[queue[j],queue[k]];}
queue.push('boss');
queue.push('clear');
spawnT=RS.spawn;bulwarkUsed=false;rageStacks=0;rageT=0;dualBossT=6;dualBossWarn=0;
player.x=W/2;player.y=GROUND-2;player.vx=0;player.vy=0;player.grounded=false;
CAM.x=clamp(player.x-VW/2,0,W-VW);CAM.y=clamp(player.y-VH*.62,0,H-VH);
$('bossbar').style.display='none';
const gm=GIMMICKS[cyc(i)];
banner(endless?('БЕЗДНА · ГЛУБИНА '+i):('КОМНАТА '+i+' / '+RUN_LEN+(challengeRoom?' · ЭЛИТНЫЙ':'')),
theme.name+(gm?'<br><span style="color:#ffb45e">✦ '+gm.name+' — '+gm.tip+'</span>':''));
}
/* НОВОЕ: лимит одновременных тварей растёт с залом, иначе лишние мобы просто ждут в очереди */
function maxConc(){
const n=Math.max(0,room-1);
if(endless){const dep=Math.max(0,room-ABYSS_START);return Math.min(26,14+Math.floor((dep+2)/3))+(challengeRoom?2:0);}
const base=[5,5,7,7,7,9,9,9,10,11,10,10,11,11,12,12,13,13,14,14][cyc(room)];
return Math.min(26,base)+(challengeRoom?2:0);
}
function spawnFromQueue(){
const t=queue.shift();
if(t==='clear')return;
if(t==='boss'){
spawnBoss();
if(endless&&room>=RUN_LEN*2){
spawnBoss(room+3,.7);
banner('ДВА СТРАЖА','Бездна не разменивается по одному');
}
spawnT=RS.spawn;return;
}
spawnMob(t);
const burst=(!endless&&room>ACT1_LEN)?(room<=15?3:4):((room<3?2:(room<7?3:4))+Math.floor(room/6)+(challengeRoom?1:0));
for(let i=0;i<burst;i++){
const nx=queue[0];
if(!nx||nx==='boss'||nx==='clear')break;
if(mobs.length>=maxConc())break;
spawnMob(queue.shift());
}
spawnT=RS.spawn;
}
function spawnRoomMinion(){
spawnMob(minionPool[Math.floor(rand()*minionPool.length)]);
}
