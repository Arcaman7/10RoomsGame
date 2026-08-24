/* ================= СОСТОЯНИЕ ================= */
let difficulty='hard',menuDiff='hard',menuWpn='sword',menuEvo='';
const player={x:W/2,y:GROUND,vx:0,vy:0,face:1,hp:5,grounded:true,coyote:0,jbuf:0,anim:0,fall:0,inv:0,drop:0,dropCd:0,djCd:0,block:0,blockCd:0,parry:0,parryWin:0,parryCd:0,dash:0,dashDir:1,altCd:0,altMax:1,roll:0,rollCd:0,rollDir:1,armorRoll:0,armorRollDir:1,healT:0,healCol:'rgba(140,224,122,',weapon:'sword',cd:0,animT:0,animDur:.2,cast:null,dead:false,rot:0,aim:0,combo:0,comboT:0,comboShow:0,_thornHeal:0};
/* НОВОЕ: добавлен ключ fire для баффа «Огонь» */
const buffs={str:0,spd:0,vit:0,regen:0,haste:0,bleed:0,poison:0,frost:0,crit:0,vamp:0,armor:0,dodge:0,thorns:0,reach:0,berserk:0,shock:0,fire:0};
const S={maxHp:5,speed:330,cdMul:1,dmg:0,dmgMul:1,crit:0,critMul:2,block:0,dodge:0,regenInt:0,vampC:0,soulMul:1,takeMul:1,bossMul:1,healMul:1};
/* прокачка оружия */
let wLv={},wMods={};
function wpnLv(k){return wLv[k]||1;}
/* Формы Архимага наследуют уровень самого Посоха Архимага, а не неиспользуемых базовых посохов. */
function evoWpnLv(k){return player.weapon==='archmage'&&(k==='fire'||k==='ice'||k==='bolt')?wpnLv('archmage'):wpnLv(k);}
function wpnSlots(k){return Math.min(7,(wpnLv(k)>=5?3:(wpnLv(k)>=3?2:1))+unlockLv('p_mod'));}
function wpnMods(k){return wMods[k]||(wMods[k]=[]);}
function hasMod(k,m){return wpnMods(k).indexOf(m)>=0;}
function wPerk(k){
const lv=wpnLv(k);
return {reach:lv>=2?1.18:1, altCd:lv>=4?.7:1, crit:lv>=5?.2:0};
}
const LVPERK={2:'+18% размаха и дальности',3:'+1 слот модификатора',4:'умение на ПКМ откатывается на 30% быстрее',5:'+1 слот и +20% шанс крита этим оружием'};
function wStat(k){
const w=WEAPONS[k],lv=wpnLv(k),md=wpnMods(k);
let dmg=w.dmg*(1+.45*(lv-1)),cd=w.cd*Math.pow(.9,lv-1);
if(md.indexOf('heavy')>=0){dmg*=1.15;cd*=1.10;}
if(md.indexOf('swift')>=0){dmg*=.90;cd*=.82;}
return {dmg:Math.round(dmg*100)/100,cd:Math.round(cd*1000)/1000};
}
function wDmg(k){return wStat(k).dmg;}
function bestLv(){let b=1;for(const k in wLv)if(wLv[k]>b)b=wLv[k];return b;}
/* редкие дары и мастерство оружия */
let relics=[],mastery={},masteryPick=null,masteryKills={melee:0,ranged:0,magic:0},masteryQueue=[];
const MASTERY_STEPS=[12,32,64];
const MASTERY={
melee:[{id:'m_reach',name:'Длинная рука',icon:'📏',desc:'+20% размаха ближнего боя'},
{id:'m_combo',name:'Танец клинка',icon:'🌀',desc:'Окно комбо +60%, финишер бьёт ×2.8'},
{id:'m_rage', name:'Кровавый пир',icon:'🩸',desc:'Каждое убийство: +8% урона на 4 с (до 5 раз)'}],
ranged:[{id:'r_pierce',name:'Навылет',icon:'➶',desc:'Снаряды пробивают на одного врага больше'},
{id:'r_far',  name:'Дальний бой',icon:'🎯',desc:'+35% дальности и скорости снарядов'},
{id:'r_double',name:'Двойная тетива',icon:'🏹',desc:'25% шанс выстрелить дважды'},
{id:'r_kite', name:'Отход',icon:'💨',desc:'+15% скорости бега и рывок на 20% быстрее'}],
magic:[{id:'g_burst',name:'Расщепление',icon:'✴',desc:'Снаряды взрываются на 50% урона'},
{id:'g_cd',   name:'Поток маны',icon:'⏳',desc:'−22% кд умения на ПКМ'},
{id:'g_dot',  name:'Порча',icon:'🧪',desc:'Магия накладывает яд 2 уровня'},
{id:'g_chain',name:'Резонанс',icon:'⛓',desc:'Каждый 3-й снаряд бьёт цепью'}]
};
function hasM(id){return !!mastery[id];}
/* проклятия */
let curses=[];
function hasCurse(id){return curses.indexOf(id)>=0;}
/* валюта и режимы */
let souls=0,runSouls=0,bankedRewardBase=0;
let mode='normal',ascLevel=0,menuAsc=0,endless=false,dailySeed=0;
function ascOn(n){return ascLevel>=n;}
/* карта похода */
let pathHistory=[],nextNode='battle',pendingSite=null;
const ACT1_LEN=10;
const RUN_LEN=20;
const ABYSS_START=20;
let mobs=[],projs=[],particles=[],popups=[],fxList=[],strikes=[],bossEvents=[],queue=[],spawnT=0,minionPool=['walker'];
const CORPSES=[];
let rollGhosts=[],ghostT=0;
const ARMOR_ROLL_HITS=new Set();
let pickups=[];
let holdAtk=false;
let challengeSel=false,challengeRoom=false,extraReward=false,act2GatePassedRun=false;
let plats=[{x:-40,y:GROUND,w:W+80,h:80,ground:true}];
let room=1,kills=0,state='menu',paused=false,time=0,runTime=0,shakeAmp=0,redFlash=0,hitStop=0,clearT=0,overT=0,bossRef=null,bossDefeated=false,roomVac=false;
const RUNSTAT={damageDealt:0,damageTaken:0,hitsTaken:0,blocks:0,dodges:0,parries:0,bosses:0,thornRetaliations:0,armorRollHits:0,lastHit:'неизвестная причина'};
let dualBossT=6,dualBossWarn=0;
let theme=ROOMS[0];
/* g — множитель прироста за зал (в Бездне ×3) */
function roomScale(r,g){
const n=Math.max(0,r-1),k=g||1;
/* Комнаты 1–10 полностью сохраняют старую кривую. Изнанка продолжает её мягче:
   билд уже собран, но рост HP не должен превратить второй акт в губку для урона. */
if(r>ACT1_LEN){const a=r-ACT1_LEN,cap=roomScale(ACT1_LEN,k);return {
hp:cap.hp*Math.pow(1+.075*k,a),dmg:cap.dmg*Math.pow(1+.026*k,a),spd:cap.spd*(1+.012*k*a),
spawn:Math.max(.62,cap.spawn-.025*a),boss:Math.max(.55,cap.boss-.015*a),
bhp:cap.bhp*Math.pow(1+.10*k,a),extra:13+a
};}
return {
hp:Math.pow(1+.26*k,n),
dmg:Math.pow(1+.10*k,n),
spd:1+.028*k*n,
spawn:Math.max(.75,1.5-.07*n),
boss:Math.max(.7,1-.033*n),
bhp:Math.pow(1+.14*k,n),
extra:2*n /* НОВОЕ: +2 моба в волне за каждый новый зал */
};
}
/* БЕЗДНА: непрерывный рост от значений 10-й комнаты.
   Персонаж усиливается несколькими перемножающимися системами, поэтому HP врагов
   растёт быстрее урона. Скорость имеет потолок, чтобы бой оставался читаемым. */
function abyssScale(d){
const n=Math.max(0,d-ABYSS_START);
 return {
 mobHp:Math.pow(1.14,n),
 wallHp:Math.pow(1.14,n),
 mobDmg:Math.pow(1.055,n),
 bossHp:Math.pow(1.16,n),
 bossDmg:Math.pow(1.06,n),
 abilityPower:Math.min(2.2,Math.pow(1.03,n)),
 debuffPower:Math.min(1.75,Math.pow(1.025,n)),
atkSpeed:Math.min(1.75,Math.pow(1.022,n)),
moveSpeed:Math.min(1.6,1+.02*n),
controlResist:Math.min(.75,.025*n),
projSpeed:Math.min(1.7,Math.pow(1.018,n)),
warnMul:Math.max(.58,1-.01*n),
zoneMul:Math.min(1.8,1+.025*n)
 };
 }
function enemyDebuffPower(){return endless?(RS.debuffPower||1):1;}
function enemySlowMul(base){return Math.max(.12,1-(1-base)*enemyDebuffPower());}
/* компактный вывод больших множителей для HUD */
function fmtMul(v){
if(v<10)return v.toFixed(1);
if(v<1000)return String(Math.round(v));
if(v<1e6)return (Math.round(v/100)/10)+'k';
if(v<1e9)return (Math.round(v/1e5)/10)+'M';
return v.toExponential(1).replace('e+','e');
}
let RS=roomScale(1);
function threatMul(){return fmtMul(RS.hp);}
let decos=[],stars=[],tufts=[],flies=[];
let pickedWpn=null,pickedBuffs=[];
let hudHp=-99,hudKills=-1,hudRoom=-1,hudWpn='',hudDiff='',hudChal=false,hudSouls=-1,hudMods='';
const keys={};
const mouse={x:W/2,y:H/2};
const tapMemo={KeyA:-9,KeyD:-9};
function updMouse(e){const r=cvs.getBoundingClientRect();mouse.x=(e.clientX-r.left)/r.width*VW+CAM.x;mouse.y=(e.clientY-r.top)/r.height*VH+CAM.y;}
function calcStats(){
S.maxHp=5+buffs.vit+unlockLv('p_vigor');
S.speed=330*(1+.1*buffs.spd);
S.cdMul=Math.max(endless?.45:.35,1-.08*buffs.haste);
S.dmg=0;
S.dmgMul=1+.12*buffs.str;
S.crit=Math.min(.7,.1*buffs.crit);
S.critMul=synOn('exec')?(endless?Math.min(3.5,2+.35*synLv('exec')):(2+.35*synLv('exec'))):2;
S.block=Math.min(endless?.35:.45,.09*buffs.armor);
S.dodge=Math.min(endless?.25:.35,.06*buffs.dodge);
S.regenInt=buffs.regen>0?Math.max(endless?3:2.5,10-buffs.regen*1.5):0;
if(synOn('undying'))S.regenInt=S.regenInt>0?S.regenInt*Math.max(.3,.6-.08*synLv('undying')):0;
S.vampC=Math.min(endless?.55:.75,.22*buffs.vamp);
S.soulMul=1;S.takeMul=1;S.bossMul=1;S.healMul=1;
if(player.weapon==='thornarmor'){S.maxHp+=2;S.takeMul*=.82;}
if(hasCurse('bloodpact')){S.dmgMul*=1.35;S.maxHp-=2;}
if(hasCurse('glass')){S.cdMul*=.6;S.takeMul*=2;}
if(hasCurse('greed'))S.soulMul*=2;
if(hasCurse('rage')){S.speed*=1.25;S.dmgMul*=1.15;S.regenInt=0;}
if(hasCurse('blind'))S.crit=Math.min(.9,S.crit+.25);
if(hasCurse('brittle')){S.maxHp-=1;S.block*=.8;}
if(hasCurse('hunger')){S.bossMul*=1.35;S.healMul*=.5;}
S.maxHp=Math.max(1,S.maxHp);
if(player.hp>S.maxHp)player.hp=S.maxHp;
}
