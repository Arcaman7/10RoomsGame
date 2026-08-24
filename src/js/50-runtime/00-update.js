/* ================= ОБНОВЛЕНИЕ ================= */
let regenT=0,bulwarkUsed=false,abyssGuard=0;
function update(dt){
runTime+=dt;
const p=player;
autoAim();
p.aim=Math.atan2(mouse.y-(p.y-30),mouse.x-p.x);
const activeCfg=curCfg()||{};
if(activeCfg.focusLaser&&holdAtk)CTR.focusHold=Math.min(7,(CTR.focusHold||0)+dt);else CTR.focusHold=0;
if(holdAtk)attack();
p.cd-=dt;p.inv-=dt;p.drop-=dt;p.dropCd-=dt;p.coyote-=dt;p.jbuf-=dt;p.animT-=dt;p.djCd-=dt;p.block-=dt;p.blockCd-=dt;p.parry-=dt;p.parryWin-=dt;p.parryCd-=dt;p.dash-=dt;p.altCd-=dt;p.roll-=dt;p.rollCd-=dt;p.armorRoll-=dt;p.healT-=dt;p.comboT-=dt;p.webT=Math.max(0,(p.webT||0)-dt);p.webPop=Math.max(0,(p.webPop||0)-dt);
for(const f of fxList){
if(f.type==='timezone'&&Math.hypot(p.x-f.x,(p.y-24)-f.y)<f.r){const dp=enemyDebuffPower();p.cd+=dt*.6*dp;p.altCd+=dt*.6*dp;p.rollCd+=dt*.3*dp;}
if(f.type==='enemyweb'){
const vx=f.x2-f.x1,vy=f.y2-f.y1,wx=p.x-f.x1,wy=(p.y-24)-f.y1,L=vx*vx+vy*vy||1,q=clamp((wx*vx+wy*vy)/L,0,1);
if(Math.hypot(p.x-(f.x1+vx*q),(p.y-24)-(f.y1+vy*q))<18){p.webT=.45*enemyDebuffPower();if(p.webPop<=0){p.webPop=1;popup(p.x,p.y-62,'ОПУТАН','#d7b5ff');}}
}}
if(p.comboT<=0){p.combo=0;p.comboShow=0;}
if(rageT>0){rageT-=dt;if(rageT<=0)rageStacks=0;}
if(p.cast){p.cast.t+=dt;if(p.cast.t>p.cast.dur)p.cast=null;}
if(S.regenInt>0&&!p.dead){regenT+=dt;if(regenT>=S.regenInt){regenT=0;if(p.hp<S.maxHp){
p.hp++;popup(p.x,p.y-60,'+1 ♥','#7fae8a');
p.healT=.6;p.healCol='rgba(140,224,122,';
spawnParts(8,p.x+rnd(-8,8),p.y-16,'#8fe07a',80,.7,'spark',-120);
}}}
hazardUpdate(dt*((CTR.worldSlow||0)>0?.25:1));
updateBossEvents(dt*((CTR.worldSlow||0)>0?.25:1));
evoUpdate(dt); /* ЭВОЛЮЦИИ */
dualBossUpdate(dt);
if(!p.dead){
const ax=((keys.KeyD||keys.ArrowRight)?1:0)-((keys.KeyA||keys.ArrowLeft)?1:0);
const flightAy=((keys.KeyS||keys.ArrowDown)?1:0)-((keys.Space||keys.KeyW||keys.ArrowUp)?1:0);
const flightNorm=activeCfg.directionalFlight&&ax!==0&&flightAy!==0?Math.SQRT1_2:1;
if(p.armorRoll>0){
p.vx=p.armorRollDir*610;
ghostT-=dt;if(ghostT<=0){ghostT=.028;rollGhosts.push({x:p.x,y:p.y,face:p.face,life:.3,max:.3,armor:true});}
if(rand()<.75)dust(p.x,p.y,1);
for(const m of [...mobs]){if(ARMOR_ROLL_HITS.has(m.id))continue;
const armorReach=(25+8*buffs.reach)*wPerk('thornarmor').reach*(hasM('m_reach')?1.2:1);
if(Math.abs(m.x-p.x)<m.w*.5+armorReach&&Math.abs((m.y-m.h*.5)-(p.y-27))<m.h*.5+armorReach*.9){
ARMOR_ROLL_HITS.add(m.id);RUNSTAT.armorRollHits++;hitMob(m,wDmg('thornarmor')*1.65,{dir:p.armorRollDir,melee:true,wpn:true});
fxList.push({type:'thornretaliate',x:p.x,y:p.y-27,tx:m.x,ty:m.y-m.h*.5,col:'#d7e889',life:.3,max:.3});addShake(5);}}
}else if(p.dash>0){
p.vx=p.dashDir*860;
ghostT-=dt;
if(ghostT<=0){ghostT=.03;rollGhosts.push({x:p.x,y:p.y,face:p.face,life:.24,max:.24});}
}else if(p.roll>0){
p.vx=p.rollDir*400;
if(rand()<.5)dust(p.x,p.y,1);
ghostT-=dt;
if(ghostT<=0){ghostT=.035;rollGhosts.push({x:p.x,y:p.y,face:p.face,life:.26,max:.26});}
}else{
let enemyBogged=false,bogged=activeCfg.flight?false:onBogSurface(p);
if(!activeCfg.flight)for(const f of fxList)if(f.type==='mire'&&f.enemy&&p.grounded&&Math.abs(p.x-f.x)<86){bogged=true;enemyBogged=true;break;}
const iceGrip=HZ.iceT>0?Math.max(.7,2.1/enemyDebuffPower()):2.1;
const grip=activeCfg.directionalFlight?12:(p.grounded?((HZ.id==='slip'||HZ.iceT>0)?iceGrip:14):8);
let moveMul=activeCfg.flight?.5:1;
if(HZ.id==='slip'&&onUpperSurface(p))moveMul*=.5;
if(activeCfg.focusLaser&&holdAtk)moveMul*=CTR.focusHold>=6?.5:(CTR.focusHold>=3?.7:.9);
const targetVx=ax*flightNorm*S.speed*moveMul*(enemyBogged?enemySlowMul(.42):(bogged?.42:1));
if(activeCfg.directionalFlight)p.vx=targetVx;else p.vx+=(targetVx-p.vx)*Math.min(1,dt*grip);
const wpn=WEAPONS[p.weapon];
/* всё ближнее оружие теперь aimed — герой всегда смотрит на курсор */
if(wpn.cat!=='melee'||wpn.aimed)p.face=mouse.x>=p.x?1:-1;
else if(ax!==0)p.face=ax;
}
p.anim+=dt*(Math.abs(p.vx)/S.speed)*1.4;
if(activeCfg.flight){
const flightGrip=activeCfg.directionalFlight?12:8;
p.grounded=false;p.coyote=0;p.jbuf=0;
const targetVy=flightAy*flightNorm*S.speed*.5;
if(activeCfg.directionalFlight)p.vy=targetVy;else p.vy+=(targetVy-p.vy)*Math.min(1,dt*flightGrip);
/* physics() всегда добавляет гравитацию. В режиме полёта компенсируем её,
   иначе плавный полёт не может оторваться от земли. */
p.vy-=GRAV*dt;
physics(p,13,dt);
const flightY=clamp(p.y,55,GROUND-12);
if(flightY!==p.y)p.vy=0;
p.y=flightY;p.fall=0;
}else if(p.jbuf>0&&(p.grounded||p.coyote>0)){
p.vy=-JUMP*(onBogSurface(p)?.78:1);p.grounded=false;p.coyote=0;p.jbuf=0;dust(p.x,p.y,5);sfx.jump();
}else if(p.jbuf>0&&!p.grounded&&p.djCd<=0&&p.webT<=0){
p.vy=-JUMP*.92;p.djCd=DJ_CD;p.jbuf=0;
spawnParts(10,p.x,p.y-6,'#9ad0ff',180,.4,'spark',150);
sfx.djump();
}
if(!activeCfg.flight){
if((keys.KeyS||keys.ArrowDown)&&p.grounded&&p.y<GROUND-1&&p.dropCd<=0){p.drop=.22;p.dropCd=.45;p.grounded=false;}
const held=keys.Space||keys.KeyW||keys.ArrowUp;
p.vy+=GRAV*dt*(p.vy<0&&!held?1.8:1);
const wasG=p.grounded;
physics(p,13,dt);
if(p.grounded){p.coyote=.09;if(!wasG&&p.fall>500){dust(p.x,p.y,6);if(p.fall>800)addShake(3);}}
p.fall=p.grounded?0:Math.max(p.fall,p.vy);
}
}else{p.vy+=GRAV*dt;physics(p,13,dt);}
for(let i=strikes.length-1;i>=0;i--){
const s=strikes[i];s.t-=dt;
if(s.t<=0){
for(const m of [...mobs]){if(Math.abs(m.x-s.x)<55)hitMob(m,s.dmg||3,{dir:m.x>=s.x?1:-1,wpn:true});}
fxList.push({type:'beam',x:s.x,life:.3,max:.3});
spawnParts(12,s.x,GROUND-20,'#cfe0ff',300,.4,'spark',300);
addShake(6);noiseS(.2,.25,1500);
strikes.splice(i,1);
}
}
if(!p.dead&&queue.length>0){
spawnT-=dt;
if(spawnT<=0){
if(queue[0]==='boss'){
if(mobs.length===0)spawnFromQueue();else spawnT=.4;
}else if(mobs.length<maxConc())spawnFromQueue();
else spawnT=.4;
}
}
if(queue.length===0&&mobs.length===0&&!p.dead&&state==='playing'){
if(clearT===0){
if(challengeRoom){
banner('ИСПЫТАНИЕ ПРОЙДЕНО',endless?'силы возвращаются · усиленный дар':((room>ACT1_LEN?'частичное лечение':'силы возвращаются')+' · два дара'));
if(endless)p.hp=Math.min(S.maxHp,p.hp+Math.max(1,Math.ceil(S.maxHp*.6)));
else{p.hp=room>ACT1_LEN?Math.min(S.maxHp,p.hp+Math.max(3,Math.ceil(S.maxHp*.5))):S.maxHp;extraReward=true;}
p.healT=.9;p.healCol='rgba(140,224,122,';
popup(p.x,p.y-62,(!endless&&room>ACT1_LEN)?'ЛЕЧЕНИЕ ЭЛИТЫ':'ПОЛНОЕ ЛЕЧЕНИЕ','#7fae8a',true);
spawnParts(16,p.x,p.y-24,'#8fe07a',120,.8,'spark',-120);
}else banner('ЗАЛ ЗАЧИЩЕН','тьма отступает…');
sfx.wave();
roomVac=true;
}
clearT+=dt;
/* ждём, пока вся валюта долетит до игрока (но не дольше 4.5 с) */
const loot=pickups.some(it=>it.kind==='soul');
if(clearT>=1.1&&(!loot||clearT>=4.5)){
roomVac=false;clearT=0;
if(room>=RUN_LEN&&!endless)showWin();else openReward();}
}
for(const m of [...mobs])mobUpdate(m,dt*((CTR.worldSlow||0)>0?.25:1));
projUpdate(dt);
pickupsUpdate(dt);
for(const pt of particles){pt.life-=dt;pt.vy+=(pt.grav??500)*dt;pt.x+=pt.vx*dt;pt.y+=pt.vy*dt;}
particles=particles.filter(pt=>pt.life>0&&pt.y<H+30);
for(const g of rollGhosts)g.life-=dt;
rollGhosts=rollGhosts.filter(g=>g.life>0);
for(const pp of popups)pp.t+=dt;
popups=popups.filter(pp=>pp.t<.9);
for(const f of fxList)f.life-=dt;
fxList=fxList.filter(f=>f.life>0);
redFlash=Math.max(0,redFlash-dt);
if(p.dead&&overT>0){overT-=dt;if(overT<=0)showOver();}
}
