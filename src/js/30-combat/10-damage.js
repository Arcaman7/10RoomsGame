/* ================= УРОН ================= */
let rageStacks=0,rageT=0;
function relicMul(m){
if(!endless){
let k=1;const p=player;
if(rareOn('airlord')&&!p.grounded)k*=1.45;
if(rareOn('opener')&&m.maxHp&&m.hp>=m.maxHp)k*=2.2;
if(rareOn('momentum')&&Math.abs(p.vx)>S.speed*.6)k*=1.3;
if(rareOn('punish')&&(m.state==='windup'||m.state==='cast'||m.state==='aim'))k*=1.8;
if(rareOn('greedy'))k*=1+Math.floor(souls/100)*.06;
if(rareOn('lastwill')&&p.hp<=1)k*=1.5;
if(hasM('m_rage')&&rageT>0)k*=1+.08*rageStacks;
return k;
}
let b=0;
const p=player;
if(rareOn('airlord')&&!p.grounded)b+=.45;
if(rareOn('opener')&&m.maxHp&&m.hp>=m.maxHp)b+=1.2;
if(rareOn('momentum')&&Math.abs(p.vx)>S.speed*.6)b+=.3;
if(rareOn('punish')&&(m.state==='windup'||m.state==='cast'||m.state==='aim'))b+=.8;
if(rareOn('greedy'))b+=Math.min(.9,Math.floor(souls/100)*.06);
if(rareOn('lastwill')&&p.hp<=1)b+=.5;
if(hasM('m_rage')&&rageT>0)b+=.08*rageStacks;
return Math.min(4,1+b);
}
function hitMob(m,dmg,o={}){
if(m.hp<=0)return;
const bers=(buffs.berserk>0&&player.hp<=S.maxHp/2)?(1+.15*buffs.berserk):1;
/* ЭВОЛЮЦИИ: множитель пробуждённого оружия + особые флаги */
let d=dmg*bers*S.dmgMul*relicMul(m)*(o.wpn?evoDmgMul():1);
if(o.wpn&&CTR.parryPow){CTR.parryPow=false;d*=2;popup(player.x,player.y-70,'КОНТРУДАР','#ffe9c9');}
if(o.wpn&&CTR.nextEmp>1){d*=CTR.nextEmp;CTR.nextEmp=1;}
if(m.mark&&o.wpn){m.mark=false;d*=1.6;}
if(m.curse)d*=1.35;
if(o.finisher&&m.brittle)d*=1.5;
{const c=curCfg();if(o.finisher&&c&&c.finBleed&&m.bleed>0)d*=c.finBleed;}
if(o.wpn&&m.type==='prism'&&WEAPONS[player.weapon].cat!=='melee'){
m.prismCharge=Math.min(3,(m.prismCharge||0)+1);popup(m.x,m.y-m.h-18,'ПРИЗМА '+m.prismCharge+'/3','#9ff3ff');
}
if(o.wpn&&hasVariant(m,'adaptive')){
const cat=WEAPONS[player.weapon].cat;
if(m.adaptCat===cat)m.adaptN=(m.adaptN||0)+1;else{m.adaptCat=cat;m.adaptN=1;}
if(m.adaptN>=4){d*=.55;popup(m.x,m.y-m.h-20,'АДАПТАЦИЯ','#ffd27a');}
}
if(m.crystalGuard&&(o.melee||o.finisher)){
m.crystalGuard=false;d*=.35;popup(m.x,m.y-m.h-20,'КРИСТАЛЛ РАЗБИТ','#9ff3ff');
for(let i=0;i<6;i++){const an=i*6.283/6;projs.push({x:m.x,y:m.y-m.h*.5,vx:Math.cos(an)*280,vy:Math.sin(an)*280,friendly:false,mob:true,type:'prismshard',dmg:.5,life:1.7,c:'#9ff3ff'});}
}
if(m.type==='boss'&&m.bossIndex===5&&m.iceArmor>0){d*=.65;if((o.finisher||o.parried)&&m.headCd<=0){m.headCd=.28;m.iceArmor--;popup(m.x,m.y-m.h-24,m.iceArmor?'ТРЕЩИНА БРОНИ '+m.iceArmor:'ЯДРО ОТКРЫТО','#bfeaff',true);spawnParts(12,m.x,m.y-m.h*.5,'#dff8ff',240,.5,'chunk',120);if(m.iceArmor<=0)m.exposeT=Math.max(m.exposeT,2.5);}}
if(m.type==='boss'&&m.bossIndex===8){if(o.fire||o.dot)m.searedT=Math.max(m.searedT,5);if(o.finisher&&m.headCd<=0&&m.headMask){m.headCd=1.2;const active=[1,2,4].filter(bit=>m.headMask&bit),bit=pick(active);m.headMask&=~bit;popup(m.x,m.y-m.h-28,['','ЛЬВИНАЯ ГОЛОВА ОТСЕЧЕНА','КОЗЬЯ ГОЛОВА ОТСЕЧЕНА','','ЗМЕИНАЯ ГОЛОВА ОТСЕЧЕНА'][bit],'#ffb0b0',true);fxList.push({type:'shieldbreak',x:m.x,y:m.y-m.h*.7,c:'#ff8a9d',life:.65,max:.65});d*=1.2;}}
if(m.type==='boss')d*=S.bossMul;
/* Версия XIV: берсерк — короткая головоломка, а не ещё одна толстая полоска HP. */
if(m.type==='boss')bossBerserkCounter(m,o);
if(m.type==='boss'&&m.rageShieldT>0)d*=.1;
else if(m.type==='boss'&&m.phase>=2)d*=2/3;
if(m.type==='boss'&&m.exposeT>0)d*=1.4;
if(o.mult)d*=o.mult;
if(m.guard&&!o.finisher&&!o.dot){
const fromFront=Math.sign(player.x-m.x)===m.face||m.face===0;
if(fromFront){d*=.3;popup(m.x+m.face*18,m.y-m.h*.7,'ЩИТ','#9ad0ff');
spawnParts(4,m.x+m.face*18,m.y-m.h*.6,'#9ad0ff',120,.25,'spark',80);}
}
if(m.guard&&o.finisher){m.guard=false;popup(m.x,m.y-m.h-14,'ЩИТ СЛОМАН!','#ffd23f',true);
spawnParts(14,m.x,m.y-m.h*.6,'#9ad0ff',280,.45,'chunk',400);addShake(5);}
if(m.ward>0&&!o.dot){m.ward--;d*=.35;popup(m.x,m.y-m.h*.8,'ОБЕРЕГ','#9ad0ff');}
if(!m.anchor){
for(const a of mobs){if(a===m||!a.anchor||a.hp<=0)continue;
if(Math.hypot(a.x-m.x,a.y-m.y)<240){d*=.75;break;}}
}
if(o.wpn&&hasMod(player.weapon,'exec')&&m.maxHp&&m.hp/m.maxHp<.3)d*=endless?2:2.5;
{const c=curCfg();if(o.wpn&&c&&c.exec&&m.maxHp&&m.hp/m.maxHp<c.exec.th)d*=c.exec.mult;}
let crit=false;
const critC=Math.min(endless?.7:1,S.crit+(o.wpn?wPerk(player.weapon).crit:0));
if(!o.dot&&rand()<critC){d*=S.critMul;crit=true;}
d=Math.max(.25,d);
if(difficulty==='easy'){if(m.type==='boss')d=Math.min(d,1);else d=m.hp;}
RUNSTAT.damageDealt+=Math.min(Math.max(0,m.hp),d);
m.hp-=d;m.flash=.14;
if(!(m.type==='boss'&&m.kbBlock)){
const kr=Math.max(.15,1-(m.ctrlRes||0));
m.vx=(o.dir||player.face)*(m.type==='boss'?(o.melee?70:40):(o.melee?320:230))*kr;
if(m.type!=='flyer'&&m.type!=='ghost'&&m.type!=='boss')m.vy=(o.melee?-190:-150)*kr;
}
if(o.melee&&m.type!=='boss'&&m.hp>0&&rand()>=(m.ctrlRes||0)){
if(m.state==='windup'||m.state==='lunge'||m.state==='cast'||m.state==='dive'){
m.state=m.type==='flyer'?'climb':'recover';
m.vy=m.type==='flyer'?-200:m.vy;
}
m.t=Math.max(m.t||0,.3);
m.atkCd=Math.max(m.atkCd,.45);
}
const shown=Math.abs(d-Math.round(d))<.01?String(Math.round(d)):String(Math.round(d*10)/10);
popup(m.x+rnd(-8,8),m.y-m.h-8,shown+(crit?'!':''),crit?'#ffd23f':'#ffe9c9');
spawnParts(crit?10:6,m.x,m.y-m.h*.6,crit?'#ffd23f':'#ffd98a',240,.3,'spark',500);
if(!o.dot){
if(buffs.bleed>0){m.bleed=Math.min(6,m.bleed+buffs.bleed);m.bleedT=3;}
if(buffs.poison>0){m.poison=Math.min(6,m.poison+buffs.poison);m.poisonT=4;}
if(buffs.frost>0&&rand()<.12*buffs.frost){m.slow=Math.max(m.slow,1.8);}
/* бафф ОГОНЬ */
if(buffs.fire>0){m.burnD=Math.max(m.burnD||0,.8+buffs.fire*.4);m.burnT=3;}
if(synOn('rot')&&(m.bleedT>0||m.poisonT>0)){if(!(m.rotT>0))m.rotT=0;m.rotT+=.6;}
/* ЭВОЛЮЦИИ: статусы и спец-эффекты пробуждённого оружия */
if(!o.noMods)evoOnHit(m,o);
}
if(!o.noMods&&m.hp>0)applyWeaponMods(m,d,o);
if(rareOn('echo')&&o.wpn&&!o.noMods&&!o.dot&&m.hp>0&&rand()<.20){
popup(m.x,m.y-m.h-18,'ЭХО','#c9a0ff');
hitMob(m,dmg*.85,{dir:o.dir,noMods:true,dot:true});
}
if(!o.dot&&!o.noMods&&buffs.shock>0&&rand()<Math.min(.6,.2*buffs.shock))shockZap(m,2+buffs.shock*.5);
if(m.hp<=0)killMob(m);
}
function applyWeaponMods(m,d,o){
if(!o.wpn)return;
const k=player.weapon,md=wpnMods(k);
if(!md.length)return;
if(md.indexOf('fire')>=0){m.burnD=Math.max(m.burnD||0,Math.max(.5,wDmg(k)*.35));m.burnT=3;}
if(md.indexOf('frost')>=0&&rand()<.25){m.slow=Math.max(m.slow,2.2);
spawnParts(5,m.x,m.y-m.h*.6,'#bfeaff',110,.35,'spark',60);}
if(md.indexOf('vamp')>=0&&rand()<.10&&player.hp<S.maxHp&&!player.dead){
player.hp=Math.min(S.maxHp,player.hp+1);popup(player.x,player.y-60,'+1 ♥','#ff8a9d');
player.healT=.6;player.healCol='rgba(255,138,157,';
}
if(md.indexOf('heavy')>=0&&!(m.type==='boss'&&m.kbBlock)){
const kd=o.dir||player.face,kr=Math.max(.15,1-(m.ctrlRes||0));m.vx=kd*(m.type==='boss'?110:480)*kr;
if(m.type!=='flyer'&&m.type!=='ghost'&&m.type!=='boss')m.vy=Math.min(m.vy,-250*kr);
}
if(md.indexOf('chain')>=0&&!(curCfg()||{}).noChain){
let nb=null,nd=1e9;
for(const x of mobs){if(x===m||x.hp<=0)continue;
const dd=Math.hypot(x.x-m.x,(x.y-x.h/2)-(m.y-m.h/2));if(dd<230&&dd<nd){nd=dd;nb=x;}}
if(nb){
fxList.push({type:'zap',a:{x:m.x,y:m.y-m.h/2},b:{x:nb.x,y:nb.y-nb.h/2},life:.16,max:.16});
hitMob(nb,Math.max(.5,d*.5),{dir:nb.x>=m.x?1:-1,noMods:true,dot:true});
}
}
}
function shockZap(m,dmg){
fxList.push({type:'zap',a:{x:m.x,y:m.y-m.h-24},b:{x:m.x,y:m.y-m.h/2},life:.14,max:.14});
hitMob(m,dmg,{dir:player.face,noMods:true,dot:true});
/* СИНЕРГИЯ «ПЕРЕГРУЗКА»: огонь + молния */
if(synOn('overload')&&m.burnT>0&&!m.ovCd){m.ovCd=true;explode(m.x,m.y-m.h*.5,3);
popup(m.x,m.y-m.h-18,'ПЕРЕГРУЗКА','#ffd23f',true);}
if(!synOn('fchain'))return;
let src=m;
for(let c=0;c<3;c++){
let nb=null,nd=1e9;
for(const x of mobs){if(x===src||x.hp<=0||!(x.slow>0))continue;
const dd=Math.hypot(x.x-src.x,x.y-src.y);if(dd<300&&dd<nd){nd=dd;nb=x;}}
if(!nb)break;
fxList.push({type:'zap',a:{x:src.x,y:src.y-src.h/2},b:{x:nb.x,y:nb.y-nb.h/2},life:.18,max:.18});
hitMob(nb,dmg,{dir:nb.x>=src.x?1:-1,noMods:true,dot:true});
src=nb;
}
}
function killMob(m){
if(!m.noLoot&&m.type!=='boss'&&!['cocoon','sporeling','bastion'].includes(m.type))CORPSES.push({type:m.type,x:m.x,y:m.y,time,used:false});
if(rareOn('deathmark')){
for(const x of mobs){if(x===m||x.hp<=0)continue;
if(Math.hypot(x.x-m.x,(x.y-x.h/2)-(m.y-m.h/2))<170)
hitMob(x,Math.max(1,m.maxHp*.3),{dir:x.x>=m.x?1:-1,noMods:true,dot:true});}
fxList.push({type:'blast',x:m.x,y:m.y-m.h/2,life:.3,max:.3});
}
if(hasM('m_rage')){rageStacks=Math.min(5,rageStacks+1);rageT=4;}
if(hasVariant(m,'zealot')){
spawnParts(24,m.x,m.y-m.h/2,'#ff8a3d',380,.6,'spark',300);
fxList.push({type:'blast',x:m.x,y:m.y-m.h/2,life:.35,max:.35});
addShake(7);noiseS(.25,.28,420);
if(!player.dead&&player.inv<=0&&Math.hypot(player.x-m.x,(player.y-26)-(m.y-m.h/2))<92)
 damagePlayer(player.x>=m.x?1:-1,m,1.5,m.type==='boss'&&m.phase>=2,false,false,true);
}
for(const x of mobs){
if(x===m||x.hp<=0||!hasVariant(x,'scavenger'))continue;
if(Math.hypot(x.x-m.x,x.y-m.y)<260){
x.hp=Math.min(x.maxHp,x.hp+Math.max(1,x.maxHp*.25));
popup(x.x,x.y-x.h-10,'+HP','#8fe07a');
spawnParts(6,x.x,x.y-x.h*.5,'#8fe07a',120,.4,'spark',-80);
}
}
if(hasVariant(m,'bonded')&&m.bondMate){const mate=mobs.find(x=>x.id===m.bondMate&&x.hp>0);if(mate){mate.ward=Math.max(mate.ward||0,2);mate.atkCd=0;mate.spd*=1.18;popup(mate.x,mate.y-mate.h-18,'СВЯЗЬ РАЗОРВАНА','#73e0ff');}}
if(m.type==='thief'&&m.stolen>0){dropSouls(m.x,m.y-m.h*.5,m.stolen);popup(m.x,m.y-m.h-18,'ДУШИ ВОЗВРАЩЕНЫ','#bfe6ff');m.stolen=0;}
spawnParts(16,m.x,m.y-m.h/2,m.color,300,.6,'chunk',900);
spawnParts(8,m.x,m.y-m.h/2,'#ffd23f',200,.4,'spark',300);
if(m.noLoot){mobs=mobs.filter(x=>x!==m);return;}
kills++;sfx.kill();addShake(m.type==='boss'?12:5);
if(m.type==='boss')RUNSTAT.bosses++;
/* ЭВОЛЮЦИИ: счётчики стиля + эффекты на убийство */
if(FL.finish)CTR.finishKills++;
if(CTR.comboNoHit)CTR.noHitKills++;
if(player.weapon==='summoner')CTR.summonKills++;
evoOnKill(m);
{
const cat=WEAPONS[player.weapon].cat;
masteryKills[cat]=(masteryKills[cat]||0)+(m.type==='boss'?6:1);
const owned=(MASTERY[cat]||[]).filter(x=>hasM(x.id)).length;
if(owned<3&&masteryKills[cat]>=MASTERY_STEPS[owned]&&!masteryQueue.some(q=>q.cat===cat)){
const free=MASTERY[cat].filter(x=>!hasM(x.id));
if(free.length){
masteryQueue.push({cat,options:shuffle(free.slice()).slice(0,2)});
popup(player.x,player.y-86,'МАСТЕРСТВО!','#c9a0ff',true);
banner('МАСТЕРСТВО · '+(CATNAME[cat]||''),'выбор откроется в конце зала');
tone(520,880,.2,'triangle',.12);
}
}
}
if(m.type==='boss')dropHeart(m.x,m.y-m.h/2,(!endless&&room>ACT1_LEN&&room<RUN_LEN)?1:2);
else if(m.variants&&m.variants.length&&rand()<.2&&!ascOn(10))dropHeart(m.x,m.y-m.h/2,1);
let sv=m.type==='boss'?Math.round(rnd(room>ACT1_LEN?25:20,room>ACT1_LEN?35:30)):(m.variants&&m.variants.length?3:2);
sv=Math.round(sv*S.soulMul*(challengeRoom?2:1)*(hasMod(player.weapon,'soul')?1.6:1));
dropSouls(m.x,m.y-m.h/2,sv);
if(m.type==='boss')popup(m.x,m.y-m.h-24,'БОСС ПОВЕРЖЕН','#ffd23f',true);
if(S.vampC>0&&rand()<S.vampC&&player.hp<S.maxHp&&!player.dead){
player.hp=Math.min(S.maxHp,player.hp+(synOn('undying')?2:1));popup(player.x,player.y-60,(synOn('undying')?'+2 ♥':'+1 ♥'),'#ff8a9d');
player.healT=.7;player.healCol='rgba(255,138,157,';
spawnParts(8,player.x+rnd(-8,8),player.y-16,'#ff8a9d',80,.7,'spark',-120);
}
if(m===bossRef){
bossRef=mobs.find(x=>x!==m&&x.type==='boss'&&x.hp>0)||null;
if(!bossRef)bossDefeated=true;
$('bossbar').style.display=bossRef?'block':'none';
if(bossRef)document.querySelector('#bossbar .bname').textContent=bossRef.name+(bossRef.abyssMods&&bossRef.abyssMods.length?' · '+bossRef.abyssMods.map(x=>x.icon).join(''):'');
}
mobs=mobs.filter(x=>x!==m);
}
function thornArmorSource(from,m,bossSource,mobSource){
if(m&&m.hp>0)return m;
if(bossSource&&bossRef&&bossRef.hp>0)return bossRef;
if(!mobSource)return null;
let best=null,bd=1e9;
for(const x of mobs){if(x.hp<=0)continue;
const side=((player.x-x.x)*(from||1)>=0)?0:180;
const d=Math.hypot(x.x-player.x,(x.y-x.h*.5)-(player.y-28))+side;
if(d<bd){bd=d;best=x;}}
return best;
}
function thornArmorRetaliate(from,m,bossSource,mobSource,blocked){
if(player.weapon!=='thornarmor'||player.dead)return;
const src=thornArmorSource(from,m,bossSource,mobSource);if(!src)return;
RUNSTAT.thornRetaliations++;
const c=curCfg()||{},D=wDmg('thornarmor')*(c.thornMul||1)*(blocked?.82:1);
hitMob(src,D,{dir:src.x>=player.x?1:-1,melee:true,wpn:true});
if(src.hp>0&&c.thornBleed){src.bleed=Math.min(6,(src.bleed||0)+c.thornBleed);src.bleedT=3;}
if(c.thornHeal&&player.hp<S.maxHp){player._thornHeal=(player._thornHeal||0)+c.thornHeal;
if(player._thornHeal>=1){player._thornHeal-=1;player.hp=Math.min(S.maxHp,player.hp+1);popup(player.x,player.y-62,'+1 ♥','#ff8a9d');}}
if(c.thornChain&&src.hp>0){let nb=null,nd=1e9;for(const x of mobs){if(x===src||x.hp<=0)continue;
const d=Math.hypot(x.x-src.x,x.y-src.y);if(d<230&&d<nd){nd=d;nb=x;}}
if(nb){fxList.push({type:'zap',a:{x:src.x,y:src.y-src.h*.5},b:{x:nb.x,y:nb.y-nb.h*.5},life:.18,max:.18});
hitMob(nb,D*.55,{dir:nb.x>=src.x?1:-1,noMods:true,dot:true});}}
if(c.thornStun&&src.hp>0){if(src.type==='boss')src.bT=Math.max(src.bT,c.thornStun*.5);else{src.state=src.type==='flyer'?'climb':'recover';src.t=Math.max(src.t||0,c.thornStun);src.atkCd=Math.max(src.atkCd,c.thornStun+.25);}}
fxList.push({type:'thornretaliate',x:player.x,y:player.y-28,tx:src.x,ty:src.y-src.h*.5,col:(findEvo(curEvoId())||{}).col||'#b8d08a',life:.38,max:.38});
popup(player.x,player.y-72,blocked?'ШИПЫ · БЛОК':'ШИПЫ ОТВЕЧАЮТ','#b8d08a');
}
function damagePlayer(from,m,dmg,rage,bossSource,mobSource,abilitySource,highImpact){
const p=player;
if(p.inv>0||p.dead)return;
/* ЭВОЛЮЦИИ: получение урона сбрасывает серии стиля */
CTR.rangedClean=0;CTR.comboNoHit=false;CTR.killStreak=0;
if(rareOn('bulwark')&&!bulwarkUsed){
bulwarkUsed=true;p.inv=1.2;
popup(p.x,p.y-64,'НЕСОКРУШИМЫЙ','#d8d3c0',true);
spawnParts(14,p.x,p.y-28,'#d8d3c0',220,.4,'spark',80);sfx.block();addShake(4);
return;
}
if(endless&&abyssGuard>0){
abyssGuard--;p.inv=1;
popup(p.x,p.y-64,'ПЕЧАТЬ ПОГЛОТИЛА УДАР','#bfe6ff',true);
spawnParts(14,p.x,p.y-28,'#bfe6ff',220,.45,'spark',60);sfx.block();addShake(4);buffChips();
return;
}
 const bossHit=(m&&m.type==='boss')||bossSource;
 const dmgScale=abilitySource?(bossHit?(RS.bossAbilityDmg||RS.bossDmg||RS.dmg||1):(RS.mobAbilityDmg||RS.mobDmg||RS.dmg||1)):
 (bossHit?(RS.bossDmg||RS.dmg||1):((m||mobSource)?(RS.mobDmg||RS.dmg||1):(RS.hazardDmg||RS.dmg||1)));
let DMG=(dmg===undefined?1:dmg)*dmgScale;
/* НОВОЕ: босс в ярости (фаза II+) бьёт на треть сильнее */
if(rage||(m&&m.type==='boss'&&m.phase>=2))DMG*=4/3;
if(p.parryWin>0){parryHit(from,m);return;}
if(p.parry>0){popup(p.x,p.y-58,'БЛОК','#9ad0ff');p.inv=.35;sfx.block();addShake(3);
RUNSTAT.blocks++;
spawnParts(6,p.x-from*14,p.y-28,'#9ad0ff',160,.3,'spark',150);return;}
if(!(curCfg()||{}).noEvade&&rand()<S.dodge){
popup(p.x,p.y-58,'УКЛОНЕНИЕ','#9ad0ff');p.inv=.4;
RUNSTAT.dodges++;
CTR.dodges++; /* счётчик для эволюций стиля */
if(synOn('phantom')){p.rollCd=0;p.inv=Math.max(p.inv,.5);
popup(p.x,p.y-76,'ФАНТОМ','#c9a0ff');spawnParts(8,p.x,p.y-28,'#c9a0ff',180,.35,'spark',60);}
return;
}
const melBlk=S.block;
if(rand()<melBlk){
popup(p.x,p.y-58,'БЛОК','#ffd23f');p.inv=.5;sfx.block();
RUNSTAT.blocks++;
CTR.wrath=Math.min(3,CTR.wrath+1); /* «гнев» Судного Молота */
if(synOn('reflect')&&m){
const back=Math.max(3,(2+buffs.thorns)*(1.6+.6*synLv('reflect')));
hitMob(m,back,{dir:-from,dot:true,noMods:true});
popup(p.x,p.y-76,'ОТРАЖЕНИЕ','#cfeaff');
spawnParts(10,p.x-from*16,p.y-28,'#cfeaff',220,.35,'spark',80);
}else if(buffs.thorns>0&&m)hitMob(m,buffs.thorns,{dir:-from,dot:true,noMods:true});
thornArmorRetaliate(from,m,bossSource,mobSource,true);
return;
}
let take=(difficulty==='easy'?DMG*.5:DMG)*S.takeMul;
const dep=endless?Math.max(0,room-ABYSS_START):0;
const hitCap=S.maxHp*(highImpact ? .9 : (endless?Math.min(.9,.55+dep*.01):.5));
take=Math.min(take,Math.max(1,hitCap));
p.hp-=take;
DMG=take;
if(m&&m.hp>0&&hasVariant(m,'vampiric')){m.hp=Math.min(m.maxHp,m.hp+Math.max(1,take*.8));popup(m.x,m.y-m.h-12,'КРОВОПИЙЦА +HP','#ff6f91');}
RUNSTAT.damageTaken+=take;RUNSTAT.hitsTaken++;
RUNSTAT.lastHit=deathCauseLabel(m,bossSource,mobSource);
p.inv=Math.max(.45,.7-DMG*.08); /* НОВОЕ: короче кадры неуязвимости после урона */
p.vx=from*(240+DMG*70);p.vy=-(260+DMG*50);p.grounded=false;
redFlash=Math.min(1,.45+DMG*.18);addShake(6+DMG*2.5);hitStop=.05+DMG*.02;sfx.hurt();
spawnParts(8,p.x,p.y-30,'#ff6b57',220,.4,'spark',500);
fxList.push({type:'claw',x:p.x,y:p.y-30,life:.25,max:.25});
p.combo=0;p.comboT=0;p.comboShow=0;
if(buffs.thorns>0&&m)hitMob(m,buffs.thorns,{dir:-from,dot:true,noMods:true});
thornArmorRetaliate(from,m,bossSource,mobSource,false);
if(p.hp<=0)playerDie(from);
}
function playerDie(from){
const p=player;p.dead=true;p.inv=0;p.cd=0;p.vx=from*160;p.vy=-430;overT=1.5;
p.cast=null;p.animT=0;p.dash=0;p.roll=0;p.armorRoll=0;p.parry=0;p.parryWin=0;
holdAtk=false;clearT=0;hitStop=Math.min(hitStop,.05);
document.querySelectorAll('.tbtn.act').forEach(e=>e.classList.remove('act'));
}
