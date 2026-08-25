/* ================= АТАКИ ИГРОКА ================= */
const COMBO_WIN=.85;
const COMBO=[
{mult:1.00,cdMul:.85,reach:1.00,kb:1,   dur:.17,name:''},
{mult:1.20,cdMul:.85,reach:1.08,kb:1.2, dur:.17,name:''},
{mult:2.30,cdMul:1.45,reach:1.30,kb:3.2,dur:.30,name:'ФИНИШЕР!'}
];
function cdMulNow(){
let c=S.cdMul;
if(synOn('inferno')&&player.hp<=S.maxHp/2)c*=.65;
return c;
}
function spawnSummonerSkull(x,y,ang,dmg,lifeMul=1,opt={}){
const w=WEAPONS.summoner,range=wPerk('summoner').reach,c=curCfg()||{};
let type=opt.type||'skull',pierce=!!opt.pierce,rad=opt.rad||7,col=opt.col||'#c9a0ff';
if(!opt.noDragon&&c.dragonEvery){
CTR.summonShot=(CTR.summonShot||0)+1;
if(CTR.summonShot>=c.dragonEvery){CTR.summonShot=0;type='dragonskull';pierce=true;rad=18;dmg*=2.2;lifeMul*=1.25;col='#f0e2c0';}
}
projs.push({x,y,vx:Math.cos(ang)*w.pspd,vy:Math.sin(ang)*w.pspd,
friendly:true,wpn:true,type,dmg,life:(w.life+.14*buffs.reach)*range*lifeMul,
hit:new Set(),homing:true,hturn:type==='dragonskull'?4.2:7.5,tcol:col,ph:rand()*6.28,pierce,rad,
targetId:opt.targetId,skullBounce:opt.bounce===undefined?(c.skullBounce||0):opt.bounce,
skullExec:opt.plain?null:(c.skullExec||null),soulReturn:opt.plain?false:!!c.soulReturn,devourActive:!!opt.devourActive});
}
function armorAwakenAttack(c){
const p=player,D=wDmg('thornarmor'),kind=c.lmb,dir=Math.cos(p.aim)>=0?1:-1;
p.face=dir;p.cd=wStat('thornarmor').cd*cdMulNow()*(c.lmbCd||1);
p.cast={kind:'armor-'+kind,t:0,dur:c.lmbDur||.42};p.animT=p.cast.dur;p.animDur=p.cast.dur;
if(kind==='spikebloom'){
for(const m of [...mobs])if(Math.hypot(m.x-p.x,(m.y-m.h*.5)-(p.y-28))<155)
hitMob(m,D*1.25,{dir:m.x>=p.x?1:-1,melee:true,wpn:true});
fxList.push({type:'spikebloom',x:p.x,y:p.y-28,life:.58,max:.58,col:'#d7e889'});
spawnParts(16,p.x,p.y-28,'#d7e889',260,.45,'spark',160);addShake(5);sfx.swing();
}else if(kind==='bloodvine'){
let hits=0;const ox=p.x,oy=p.y-30,dx=Math.cos(p.aim),dy=Math.sin(p.aim);
for(const m of [...mobs]){const mx=m.x-ox,my=(m.y-m.h*.5)-oy,t=mx*dx+my*dy,side=Math.abs(-mx*dy+my*dx);
if(t>-15&&t<230&&side<38+t*.16){hitMob(m,D*1.45,{dir,melee:true,wpn:true});
if(m.hp>0){m.bleed=Math.min(6,(m.bleed||0)+2);m.bleedT=3;}hits++;}}
if(hits>=2&&p.hp<S.maxHp){p.hp=Math.min(S.maxHp,p.hp+1);popup(p.x,p.y-62,'+1 ♥','#ff6680');}
fxList.push({type:'bloodvine',x:p.x+dir*8,y:p.y-30,dir,ang:p.aim,life:.62,max:.62});
spawnParts(12,p.x+dir*45,p.y-32,'#ff6680',230,.45,'spark',100);addShake(5);sfx.swing();
}else if(kind==='stormram'){
p.dash=.14;p.dashDir=dir;p.inv=Math.max(p.inv,.24);let n=0;
for(const m of [...mobs]){const dx=m.x-p.x;if(dx*dir>-20&&dx*dir<245&&Math.abs((m.y-m.h*.5)-(p.y-28))<70){
hitMob(m,D*1.75,{dir,melee:true,wpn:true});if(m.hp>0)m.slow=Math.max(m.slow,1);n++;}}
fxList.push({type:'stormram',x:p.x,y:p.y-28,dir,life:.48,max:.48});
if(n>=2)p.cd*=.72;spawnParts(14,p.x+dir*40,p.y-28,'#91b8ff',280,.4,'spark',100);addShake(7);sfx.zap();
}else if(kind==='fortressslam'){
for(const m of [...mobs])if(Math.hypot(m.x-p.x,(m.y-m.h*.5)-(p.y-24))<180){
hitMob(m,D*2.05,{dir:m.x>=p.x?1:-1,melee:true,wpn:true,finisher:true});
if(m.hp>0){if(m.type==='boss')m.bT=Math.max(m.bT,.35);else{m.state=m.type==='flyer'?'climb':'recover';m.t=Math.max(m.t||0,.8);m.atkCd=Math.max(m.atkCd,1.1);}}}
fxList.push({type:'fortressslam',x:p.x,y:GROUND-8,life:.72,max:.72});
spawnParts(24,p.x,GROUND-8,'#d8c8a2',320,.55,'chunk',650);addShake(11);hitStop=.08;tone(115,48,.22,'square',.14);
}
}
function attack(){
const p=player;
FL.finish=false;
if(state!=='playing'||paused||p.cd>0||p.dead||p.armorRoll>0)return;
const w=WEAPONS[p.weapon];
const st=wStat(p.weapon);
if(p.weapon==='thornarmor'){
const c=curCfg();
if(c&&c.lmb){skinCombatFx('base',{x:p.x,y:p.y-28,ang:p.aim,dir:p.face,weapon:p.weapon,armored:true});armorAwakenAttack(c);}
else{p.cd=.55;if(!p._armorHint||time-p._armorHint>1.4){p._armorHint=time;popup(p.x,p.y-72,'ЛКМ НЕТ · ПКМ — ТЯЖЁЛЫЙ ПЕРЕКАТ','#b8d08a');}}
return;
}
if(w.cat==='melee'){
if(p.comboT<=0)p.combo=0;
const ci=p.combo%3,C0=COMBO[ci];
const C=hasM('m_combo')&&ci===2?{...C0,mult:2.8}:C0;
p.combo=(ci+1)%3;p.comboT=COMBO_WIN*(hasM('m_combo')?1.6:1);p.comboShow=ci+1;
p.cd=st.cd*cdMulNow()*C.cdMul;
const finisher=ci===2;
p.cast={kind:finisher?(p.weapon==='axe'?'spin':'slam'):(p.weapon==='spear'?'thrust':'swing'),t:0,dur:finisher?C.dur:(p.weapon==='axe'?.26:C.dur)};
p.animT=p.cast.dur;p.animDur=p.cast.dur;
skinCombatFx('base',{x:p.x,y:p.y-30,ang:p.aim,dir:p.face,weapon:p.weapon,finisher,combo:ci});
sfx.swing();
if(finisher){
if(rareOn('shockwave')){
fxList.push({type:'blast',x:p.x,y:p.y-30,life:.32,max:.32});
for(const mm of [...mobs])if(Math.hypot(mm.x-p.x,(mm.y-mm.h/2)-(p.y-30))<160)
hitMob(mm,wDmg(p.weapon)*1.4,{dir:mm.x>=p.x?1:-1,melee:true,wpn:true,finisher:true});
addShake(10);
}
addShake(8);hitStop=.05;tone(160,60,.18,'square',.13);
spawnParts(16,p.x+p.face*40,p.y-30,'#ffd23f',300,.45,'spark',180);
fxList.push({type:'claw',x:p.x+p.face*44,y:p.y-32,life:.22,max:.22});
}
meleeHit(w,C,finisher);
return;
}
p.cd=st.cd*cdMulNow();
{
let dx=mouse.x-p.x,dy=mouse.y-(p.y-30);
const L=Math.hypot(dx,dy)||1;dx/=L;dy/=L;
p.face=dx>=0?1:-1;
skinCombatFx('base',{x:p.x,y:p.y-30,ang:Math.atan2(dy,dx),dir:p.face,weapon:p.weapon,category:w.cat});
if(w.cat==='ranged'){
p.cast={kind:'shoot',t:0,dur:.14};p.animT=.14;p.animDur=.14;
const px=p.x+dx*18,py=p.y-30+dy*10;
const FAR=hasM('r_far')?1.35:1;
const shots=(hasM('r_double')&&rand()<.25)?2:1;
/* ЭВОЛЮЦИИ: самонаводящиеся стрелы/болты (Лук Ловчей Стрелы, Арбалет Гончей) */
const HS=(curCfg()||{}).homingShot||null;
for(let q=0;q<shots;q++){
const sp=q?.09:0;
projs.push({x:px,y:py,vx:Math.cos(Math.atan2(dy,dx)+sp)*w.pspd*FAR,vy:Math.sin(Math.atan2(dy,dx)+sp)*w.pspd*FAR,
friendly:true,wpn:true,type:p.weapon==='bow'?'arrow':(p.weapon==='crossbow'?'bolt':'knife'),
dmg:st.dmg,life:(w.life+.12*buffs.reach)*FAR*(HS?1.6:1),
pierce:w.pierce||hasM('r_pierce')||!!(HS&&HS.pierce),hit:new Set(),
homing:!!HS,hturn:HS?HS.turn:0,tcol:HS?HS.col:null,onHitMark:(HS&&HS.mark)?1:0});
}
sfx.shoot();spawnParts(3,px,py,HS?(HS.col||'#7dffc4'):'#ffd98a',120,.2,'spark',200);
}else{
p.cast={kind:'cast',t:0,dur:.2};p.animT=.2;p.animDur=.2;
const EC=curCfg()||{};
/* Новые магические пробуждения и Посох Архимага меняют саму базовую атаку. */
let magicKind=p.weapon;
if(p.weapon==='archmage')magicKind=pick(['fire','ice','bolt']);
if(EC.gatling)p.cd/=1.8;
if(EC.focusLaser){
const charged=CTR.focusMax?6:(CTR.focusHold||0),tier=charged>=6?2.35:(charged>=3?1.45:.75);
const chainPower=(hasMod(p.weapon,'chain')?1:0)+(hasM('g_chain')?1:0);
const an=Math.atan2(dy,dx),range=470;
for(const m of [...mobs]){const mx=m.x-p.x,my=(m.y-m.h*.5)-(p.y-30),t=mx*dx+my*dy;
if(t>0&&t<range&&Math.abs(-mx*dy+my*dx)<30)hitMob(m,st.dmg*tier*(1+chainPower*.55),{dir:p.face,wpn:true,noMods:true});}
fxList.push({type:'stormray',a:{x:p.x,y:p.y-30},b:{x:p.x+dx*range,y:p.y-30+dy*range},life:.2,max:.2});
CTR.focusMax=false;sfx.zap();
}else if(EC.stormStrike){
const tx=clamp(mouse.x,30,W-30);fxList.push({type:'zapwarn',x:tx,life:.8,max:.8});
strikes.push({x:tx,t:.8,dmg:st.dmg});sfx.cast();
}else if(EC.meteorShot){
const tx=clamp(mouse.x,30,W-30);fxList.push({type:'meteorwarn',x:tx,life:.48,max:.48});
projs.push({x:tx,y:-30,vx:0,vy:560,friendly:true,type:'meteor',wpn:true,dmg:st.dmg*1.15,life:2,hit:new Set(),meteorTrap:true});sfx.cast();
}else if(EC.flameStream){
projs.push({x:p.x+dx*18,y:p.y-30+dy*10,vx:dx*440,vy:dy*440,friendly:true,wpn:true,type:'flamejet',dmg:st.dmg*.48,life:.38,pierce:true,hit:new Set(),rad:11,onHitBurn:true});
p.cd*=.38;sfx.cast();
}else if(EC.coldStream){
projs.push({x:p.x+dx*18,y:p.y-30+dy*10,vx:dx*430,vy:dy*430,friendly:true,wpn:true,type:'coldjet',dmg:1,life:.42,pierce:true,hit:new Set(),rad:10,onHitFrost:true});
p.cd*=.42;sfx.cast();
}else if(EC.shardVolley){
for(let i=-1;i<=1;i++){const an=Math.atan2(dy,dx)+i*.13;
projs.push({x:p.x,y:p.y-30,vx:Math.cos(an)*235,vy:Math.sin(an)*235,friendly:true,wpn:true,type:'ice',dmg:st.dmg*.65,life:.62,hit:new Set()});}sfx.cast();
}else if(magicKind==='summoner'){
spawnSummonerSkull(p.x+dx*20,p.y-30+dy*12,Math.atan2(dy,dx),st.dmg);
sfx.cast();tone(310,190,.1,'triangle',.07);
}else if(magicKind==='fire'){
projs.push({x:p.x+dx*20,y:p.y-30+dy*12,vx:dx*WEAPONS.fire.pspd,vy:dy*WEAPONS.fire.pspd,friendly:true,wpn:true,type:'fire',dmg:st.dmg,life:WEAPONS.fire.life+.12*buffs.reach,hit:new Set()});
if(EC.pyroChaos&&CTR.pyroShots&&CTR.pyroShots.length){const mode=CTR.pyroShots.shift(),an=Math.atan2(dy,dx);
if(mode===0)projs.push({x:p.x,y:p.y-30,vx:Math.cos(an+.18)*WEAPONS.fire.pspd,vy:Math.sin(an+.18)*WEAPONS.fire.pspd,friendly:true,wpn:true,type:'fire',dmg:st.dmg,life:1.4,hit:new Set()});
if(mode===1)projs.push({x:p.x,y:p.y-30,vx:-dx*WEAPONS.fire.pspd,vy:-dy*WEAPONS.fire.pspd,friendly:true,wpn:true,type:'fire',dmg:st.dmg,life:1.4,hit:new Set()});
if(mode===2)projs.push({x:p.x,y:p.y-38,vx:0,vy:-360,friendly:true,wpn:true,type:'fire',dmg:st.dmg,life:1.8,hit:new Set(),homing:true,hturn:7});}
sfx.cast();
}else if(magicKind==='ice'){
projs.push({x:p.x+dx*20,y:p.y-30+dy*12,vx:dx*WEAPONS.ice.pspd,vy:dy*WEAPONS.ice.pspd,friendly:true,wpn:true,type:'ice',dmg:st.dmg,life:WEAPONS.ice.life+.12*buffs.reach,hit:new Set()});
sfx.cast();
}else if((curCfg()||{}).ballShot){
/* ЭВОЛЮЦИЯ: Жезл Шаровых Молний — ЛКМ выпускает шаровую молнию вместо разряда */
const BS=curCfg().ballShot;
spawnBall(p.x+dx*22,p.y-30+dy*12,Math.atan2(dy,dx),st.dmg*1.05,BS);
sfx.cast();tone(520,90,.12,'sine',.08);
}else{
sfx.zap();
const R=320+20*buffs.reach;
let best=null,bd=1e9;
for(const m of mobs){
const mx=m.x-p.x,my=(m.y-m.h/2)-(p.y-30);
const dist=Math.hypot(mx,my);
if(dist>R)continue;
const dot=(mx*dx+my*dy)/dist;
if(dot<0.55)continue;
const score=dist*(2-dot);
if(score<bd){bd=score;best=m;}
}
if(best){
fxList.push({type:'zap',a:{x:p.x+dx*16,y:p.y-34},b:{x:best.x,y:best.y-best.h/2},life:.18,max:.18});
hitMob(best,st.dmg,{dir:Math.sign(dx)||1,wpn:true});addShake(4);hitStop=.04;
let src=best;
for(let c=0;c<1;c++){
let nb=null,nd=1e9;
for(const m of mobs){if(m===src||m.hp<=0)continue;
const d=Math.hypot(m.x-src.x,m.y-src.y);if(d<200&&d<nd){nd=d;nb=m;}}
if(nb){fxList.push({type:'zap',a:{x:src.x,y:src.y-src.h/2},b:{x:nb.x,y:nb.y-nb.h/2},life:.18,max:.18});
hitMob(nb,Math.max(1,st.dmg-1),{dir:Math.sign(dx)||1,noMods:true});src=nb;}
else break;
}
}else{
fxList.push({type:'zap',a:{x:p.x+dx*16,y:p.y-34},b:{x:p.x+dx*R*.7,y:p.y-30+dy*R*.7},life:.14,max:.14});
spawnParts(4,p.x+dx*40,p.y-30+dy*40,'#9db8ff',160,.25,'spark',100);
}
}
spawnParts(4,p.x+dx*20,p.y-30+dy*12,theme.accent,120,.25,'spark',100);
}
}
}
const PARRY_T=.34,PARRY_WIN=.15,PARRY_CD=1.2;
function tryParry(){
const p=player;
if(state!=='playing'||paused||p.dead||p.parryCd>0||p.roll>0||p.armorRoll>0||(curCfg()||{}).flight)return;
p.parry=PARRY_T;p.parryWin=PARRY_WIN;p.parryCd=PARRY_CD;
p.animT=PARRY_T;p.animDur=PARRY_T;p.cast=null;
skinCombatFx('parry',{x:p.x,y:p.y-28,ang:p.aim,dir:p.face,weapon:p.weapon,phase:'guard'});
sfx.block();
spawnParts(5,p.x+Math.cos(p.aim)*22,p.y-28+Math.sin(p.aim)*22,'#9ad0ff',110,.22,'spark',60);
}
function parryHit(from,m){
const p=player;
/* ЭВОЛЮЦИИ: считаем парирования и копим «гнев» */
CTR.parry++;
RUNSTAT.parries++;
{const c=curCfg();if(c&&c.parryPow)CTR.parryPow=true;if(c&&c.wrath)CTR.wrath=Math.min(3,CTR.wrath+1);}
p.inv=Math.max(p.inv,.45);
popup(p.x,p.y-66,'ПАРИРОВАНИЕ!','#9ad0ff',true);
skinCombatFx('parry',{x:p.x-from*18,y:p.y-28,ang:from>0?Math.PI:0,dir:-from,weapon:p.weapon,phase:'hit'});
spawnParts(16,p.x-from*18,p.y-28,'#cfeaff',280,.45,'spark',120);
sfx.parry();addShake(6);hitStop=.09;redFlash=0;
if(rareOn('parrydash')){p.rollCd=0;p.altCd=0;popup(p.x,p.y-84,'КОНТРАТАКА','#c9a0ff');}
if(m&&m.hp>0){
hitMob(m,2,{dir:-from,melee:true});
if(m.hp>0){
if(m.type==='boss'){const cr=m.ctrlRes||0;m.bossAtk='stun';m.t=.9*(1-cr);m.vx=0;m.bT=Math.max(m.bT,1.2*(1-cr));}
else{
m.state=m.type==='flyer'?'climb':'recover';
const kr=Math.max(.15,1-(m.ctrlRes||0));m.t=1.2*kr;m.atkCd=1.6*kr;m.slow=Math.max(m.slow,1.2*kr);
m.vx=-from*430*kr;
if(m.type!=='flyer'&&m.type!=='ghost')m.vy=-270*kr;
}
}
}
}
function tryStrafe(dir){
const p=player;
if(state!=='playing'||paused||p.dead||p.rollCd>0||p.roll>0||p.armorRoll>0||(curCfg()||{}).flight)return;
if(p.webT>0){popup(p.x,p.y-54,'ПАУТИНА БЛОКИРУЕТ РЫВОК','#d7b5ff');return;}
if(onBogSurface(p)){popup(p.x,p.y-54,'В ТРЯСИНЕ НЕЛЬЗЯ КУВЫРОК','#b6d94a');return;}
p.roll=ROLL_T;p.rollCd=ROLL_CD;p.rollDir=dir;p.face=dir;
p.inv=Math.max(p.inv,ROLL_INV);
p.cast=null;p.animT=0;
rollGhosts=[];ghostT=0;
dust(p.x,p.y,6);
spawnParts(6,p.x,p.y-22,'#9ad0ff',160,.3,'spark',80);
skinCombatFx('roll',{x:p.x,y:p.y-24,ang:dir>0?0:Math.PI,dir,weapon:p.weapon});
sfx.roll();
}
function tryAlt(){
const p=player;
if(state!=='playing'||paused||p.dead||p.armorRoll>0)return;
/* ЭВОЛЮЦИИ: пробуждённое оружие полностью меняет ПКМ */
if(p.altCd>0)return;
{const EC=curCfg();if(EC&&EC.alt){skinCombatFx('alt',{x:p.x,y:p.y-28,ang:p.aim,dir:p.face,weapon:p.weapon,evolved:true});evoAlt(EC);return;}}
const w=p.weapon;
const ALT=wPerk(w).altCd*(WEAPONS[w].cat==='magic'&&hasM('g_cd')?0.78:1);
if(w==='thornarmor'){
if(onBogSurface(p)){popup(p.x,p.y-54,'В ТРЯСИНЕ НЕЛЬЗЯ ПЕРЕКАТ','#b6d94a');return;}
const armorAltMod=(hasMod(w,'swift')?.82:1)*(hasMod(w,'heavy')?1.10:1);
p.altCd=1.65*ALT*armorAltMod;p.altMax=p.altCd;
const dir=Math.cos(p.aim)>=0?1:-1;
p.face=dir;p.armorRoll=ARMOR_ROLL_T;p.armorRollDir=dir;p.inv=Math.max(p.inv,ARMOR_ROLL_INV);
p.cast={kind:'armorroll',t:0,dur:ARMOR_ROLL_T};p.animT=ARMOR_ROLL_T;p.animDur=ARMOR_ROLL_T;
ARMOR_ROLL_HITS.clear();rollGhosts=[];ghostT=0;
dust(p.x,p.y,10);spawnParts(12,p.x,p.y-24,'#b8d08a',210,.45,'spark',100);sfx.roll();addShake(4);
}else if(w==='archmage'){
p.altCd=3*ALT;p.altMax=p.altCd;
const spell=pick(['meteor','shards','thunder']);
if(spell==='meteor'){
const tx=clamp(mouse.x,30,W-30);fxList.push({type:'meteorwarn',x:tx,life:.55,max:.55});
projs.push({x:tx,y:-30,vx:0,vy:540,friendly:true,type:'meteor',wpn:true,dmg:wDmg(w)*1.3,life:2,hit:new Set()});
}else if(spell==='shards'){
for(let i=0;i<10;i++){const an=i*6.283/10;projs.push({x:p.x,y:p.y-26,vx:Math.cos(an)*400,vy:Math.sin(an)*400,friendly:true,type:'ice',wpn:true,dmg:wDmg(w),life:.9,hit:new Set()});}
}else{const tx=clamp(mouse.x,30,W-30);fxList.push({type:'zapwarn',x:tx,life:.4,max:.4});strikes.push({x:tx,t:.4,dmg:wDmg(w)*1.6});}
popup(p.x,p.y-76,spell==='meteor'?'МЕТЕОРИТ':(spell==='shards'?'ОСКОЛКИ':'УДАР МОЛНИИ'),'#d6b8ff');sfx.cast();
}else if(w==='sword'){
p.altCd=2.4*ALT;p.altMax=p.altCd;
const dir=Math.cos(p.aim)>=0?1:-1;
p.face=dir;p.dash=.18;p.dashDir=dir;p.inv=Math.max(p.inv,.34);
p.cast={kind:'swing',t:0,dur:.3};p.animT=.3;p.animDur=.3;
rollGhosts=[];ghostT=0;
sfx.swing();addShake(5);
const x0=p.x,x1=p.x+dir*215;
for(const m of [...mobs]){
if(m.x+m.w/2>Math.min(x0,x1)-12&&m.x-m.w/2<Math.max(x0,x1)+12&&m.y>p.y-104&&m.y-m.h<p.y+12)
hitMob(m,wDmg('sword')*2,{dir,melee:true,wpn:true});
}
spawnParts(14,p.x+dir*46,p.y-28,'#ffe9c9',270,.4,'spark',110);
}else if(w==='katana'){
p.altCd=1.1*ALT;p.altMax=p.altCd;
const an=Math.atan2(mouse.y-(p.y-26),mouse.x-p.x),dx=Math.cos(an),dy=Math.sin(an);
p.face=dx>=0?1:-1;
projs.push({x:p.x+dx*20,y:p.y-26+dy*20,vx:dx*520,vy:dy*520,friendly:true,type:'arcwave',wpn:true,dmg:wDmg('katana')*1.6,life:.55,pierce:true,hit:new Set()});
sfx.swing();
spawnParts(6,p.x+dx*24,p.y-26+dy*24,'#ffe9c9',180,.25,'spark',100);
}else if(w==='spear'){
p.altCd=1.6*ALT;p.altMax=p.altCd;
projs.push({x:p.x+p.face*16,y:p.y-28,vx:p.face*560,vy:0,friendly:true,type:'trident',wpn:true,dmg:wDmg('spear')*1.4,life:6,pierce:true,hit:new Set(),t:0,ret:false});
sfx.throw();
}else if(w==='axe'){
p.altCd=2*ALT;p.altMax=p.altCd;
p.cast={kind:'spin',t:0,dur:.35};p.animT=.35;p.animDur=.35;
sfx.swing();addShake(5);
for(const m of [...mobs]){
if(Math.hypot(m.x-p.x,(m.y-m.h/2)-(p.y-26))<100){
hitMob(m,wDmg('axe'),{dir:m.x>=p.x?1:-1,melee:true,wpn:true});
if(!(m.type==='boss'&&m.kbBlock)){
const kd=m.x>=p.x?1:-1,kr=Math.max(.15,1-(m.ctrlRes||0));m.vx=kd*380*kr;
if(m.type!=='flyer'&&m.type!=='ghost'&&m.type!=='boss')m.vy=-260*kr;
}
}
}
spawnParts(12,p.x,p.y-26,'#ffd98a',300,.35,'spark',300);
}else if(w==='bow'){
p.altCd=3*ALT;p.altMax=p.altCd;
const side=mouse.x<W/2?0:1;
const x0=side===0?15:W/2+15;
for(let i=0;i<8;i++){
projs.push({x:rnd(x0,x0+W/2-40),y:-20,vx:rnd(-20,20),vy:rnd(380,470),friendly:true,type:'rainarrow',wpn:true,dmg:wDmg('bow'),life:3,hit:new Set()});
}
sfx.shoot();
}else if(w==='crossbow'){
p.altCd=3*ALT;p.altMax=p.altCd;
let dx=mouse.x-p.x,dy=mouse.y-(p.y-30);const L=Math.hypot(dx,dy)||1;dx/=L;dy/=L;
p.face=dx>=0?1:-1;
projs.push({x:p.x+dx*18,y:p.y-30+dy*10,vx:dx*840,vy:dy*840,friendly:true,type:'heavybolt',wpn:true,dmg:wDmg('crossbow')*1.7,life:1.5,pierce:true,hit:new Set()});
sfx.shoot();addShake(4);
p.cast={kind:'shoot',t:0,dur:.2};p.animT=.2;p.animDur=.2;
}else if(w==='knives'){
p.altCd=2.5*ALT;p.altMax=p.altCd;
const base=Math.atan2(mouse.y-(p.y-30),mouse.x-p.x);
for(let i=0;i<5;i++){const off=(i-2)*.16;
projs.push({x:p.x,y:p.y-30,vx:Math.cos(base+off)*540,vy:Math.sin(base+off)*540,friendly:true,type:'knife',wpn:true,dmg:wDmg('knives'),life:.8,hit:new Set()});}
sfx.shoot();
}else if(w==='fire'){
p.altCd=3*ALT;p.altMax=p.altCd;
const tx=clamp(mouse.x,30,W-30);
fxList.push({type:'meteorwarn',x:tx,life:.55,max:.55});
projs.push({x:tx,y:-30,vx:0,vy:540,friendly:true,type:'meteor',wpn:true,dmg:wDmg('fire')*1.3,life:2,hit:new Set()});
sfx.cast();
}else if(w==='ice'){
p.altCd=3*ALT;p.altMax=p.altCd;
for(let i=0;i<10;i++){const an=i*6.283/10;
projs.push({x:p.x,y:p.y-26,vx:Math.cos(an)*400,vy:Math.sin(an)*400,friendly:true,type:'ice',wpn:true,dmg:wDmg('ice'),life:.9,hit:new Set()});}
sfx.cast();
spawnParts(10,p.x,p.y-26,'#bfeaff',240,.4,'spark',100);
}else if(w==='summoner'){
p.altCd=3.2*ALT;p.altMax=p.altCd;
const base=Math.atan2(mouse.y-(p.y-30),mouse.x-p.x);
for(let i=0;i<4;i++)spawnSummonerSkull(p.x,p.y-30,base+(i-1.5)*.48,wDmg('summoner')*.65,1.15);
p.cast={kind:'cast',t:0,dur:.28};p.animT=.28;p.animDur=.28;
sfx.cast();tone(260,120,.18,'triangle',.1);
spawnParts(12,p.x,p.y-30,'#c9a0ff',190,.45,'spark',40);
}else if(w==='bolt'){
p.altCd=3.5*ALT;p.altMax=p.altCd;
const tx=clamp(mouse.x,30,W-30);
fxList.push({type:'zapwarn',x:tx,life:.4,max:.4});
strikes.push({x:tx,t:.4,dmg:wDmg('bolt')*1.6});
sfx.cast();
}
if(p.altCd>0)skinCombatFx('alt',{x:p.x,y:p.y-28,ang:Math.atan2(mouse.y-(p.y-28),mouse.x-p.x),dir:p.face,weapon:w});
}
function meleeHit(w,C,finisher){
const p=player,f=p.face;
FL.finish=!!finisher;
C=C||{mult:1,reach:1,kb:1};
const dmg=wDmg(p.weapon)*C.mult;
const reach=(p.weapon==='spear'?142+14*buffs.reach:96+10*buffs.reach)*C.reach*wPerk(p.weapon).reach*(hasM('m_reach')?1.2:1);
let hitAny=false;
const bash=(m,dir)=>{
if(!finisher)return;
if(m.type==='boss'){m.bT=Math.max(m.bT,.55);return;}
const kr=Math.max(.15,1-(m.ctrlRes||0));
m.vx=dir*640*kr;
if(m.type!=='flyer'&&m.type!=='ghost')m.vy=-380*kr;
if(m.type!=='boss'){m.state=m.type==='flyer'?'climb':'recover';m.t=Math.max(m.t||0,.55);m.atkCd=Math.max(m.atkCd,.8);}
else{m.bT=Math.max(m.bT,.5);}
spawnParts(8,m.x,m.y-m.h*.6,'#ffe9c9',260,.35,'spark',260);
};
/* ВСЁ БЛИЖНЕЕ ОРУЖИЕ ТЕПЕРЬ БЬЁТ В СТОРОНУ КУРСОРА (aimed=true у всех) */
if(w.aimed){
const ox=p.x,oy=p.y-30,ang=p.aim;
const dx=Math.cos(ang),dy=Math.sin(ang);
const half=p.weapon==='spear'?15:25;
const dir=dx>=0?1:-1;
/* РАЗМАХ: тонкая дуга показывает фактическую границу ближнего удара. */
if(buffs.reach>0)fxList.push({type:'reacharc',x:ox,y:oy,ang,r:reach,half,life:.22,max:.22});
for(const m of [...mobs]){
let hit=false;
for(let t=8;t<=reach&&!hit;t+=8){
const px=ox+dx*t,py=oy+dy*t;
const cx=clamp(px,m.x-m.w/2,m.x+m.w/2),cy=clamp(py,m.y-m.h,m.y);
if((px-cx)*(px-cx)+(py-cy)*(py-cy)<=half*half)hit=true;
}
if(hit){hitMob(m,dmg,{dir,melee:true,wpn:true,finisher});bash(m,dir);hitAny=true;}
}
}else{
const hx0=p.x+f*10,hx1=p.x+f*reach,hy0=p.y-88,hy1=p.y+6;
for(const m of [...mobs]){
if(Math.max(hx0,hx1)>m.x-m.w/2&&Math.min(hx0,hx1)<m.x+m.w/2&&hy1>m.y-m.h&&hy0<m.y){
hitMob(m,dmg,{dir:f,melee:true,wpn:true,finisher});bash(m,f);hitAny=true;
}
}
}
if(hitAny){
hitStop=finisher?.075:.045;addShake(finisher?9:(p.weapon==='axe'?7:4));
if(finisher){
popup(p.x,p.y-72,'ФИНИШЕР ×'+COMBO[2].mult.toFixed(1),'#ffd23f',true);
if(CTR.comboNoHit)CTR.combo3++; /* идеальные комбо для эволюций стиля */
}
}
}
