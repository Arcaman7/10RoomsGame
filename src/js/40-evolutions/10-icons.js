/* ================= НОВОЕ: РИСОВАННЫЕ ИКОНКИ ПРОБУЖДЁННОГО ОРУЖИЯ ================= */
/* силуэт по базовому оружию (линейная графика, viewBox 24x24) */
const WSIL={
sword:'<path d="M12 2l2 4.5V13h-4V6.5z"/><path d="M8 13.6h8M12 13.6v6.6M10.4 20.6h3.2"/>',
katana:'<path d="M19.6 2.6C11.6 6 6.4 12.6 5 20.6"/><path d="M5 20.8L2.4 22.8M8.6 15.4l2.8 1.8"/>',
knives:'<path d="M4 3l8 11M20 3l-8 11"/><path d="M9 15.2h6M12 15.2v5"/>',
axe:'<path d="M11 3.2v18"/><path d="M11 4.8l6.8-1.6c2 2.4 2 5.6 0 8L11 12.6z"/>',
spear:'<path d="M12 6.6V22"/><path d="M12 1.4l2.7 4.3L12 8.2 9.3 5.7z"/>',
thornarmor:'<path d="M12 2.2l7 3v6.2c0 5.2-3.3 8.6-7 10.4-3.7-1.8-7-5.2-7-10.4V5.2z"/><path d="M5 8L1.8 6M19 8l3.2-2M5.4 13l-3.6 1.4M18.6 13l3.6 1.4M9 4L7.4.8M15 4L16.6.8"/>',
bow:'<path d="M7 2.4C14 6 14 18 7 21.6"/><path d="M7 2.6v18.8"/><path d="M4 12h11M15 12l-3-2.4M15 12l-3 2.4"/>',
crossbow:'<path d="M12 5.6v16"/><path d="M3.4 8.6C7 5 17 5 20.6 8.6"/><path d="M3.6 8.8h16.8M12 3.6v6"/>',
fire:'<path d="M7.6 21.8L13.4 8.4"/><circle cx="15.2" cy="5.4" r="3.2"/>',
ice:'<path d="M7.6 21.8L13 9.6"/><path d="M14.6 1.8l3.2 4-3.2 4.4-3.2-4.4z"/>',
summoner:'<path d="M7.2 21.8L13.2 9.4"/><circle cx="15.2" cy="6" r="4"/><path d="M12.7 8.4v2.2h5V8.4M13.8 5.5h.1M16.6 5.5h.1"/>',
bolt:'<path d="M6 21.6L13.8 10.4"/><circle cx="15.6" cy="8.4" r="2"/><path d="M15.6 4.6v1.4M19.4 8.4H18M18.4 5.6l-1 1"/>'
};
/* уникальный мотив-эмблема для каждой эволюции (локальный бокс 10x10) */
const EMOT={
crown:'<path d="M1 8h8l.8-5.6L7 5 5 1.4 3 5 .2 2.4z" fill="C"/>',
shieldChev:'<path d="M5 .8l3.8 1.6v3.2C8.8 8 5 9.4 5 9.4S1.2 8 1.2 5.6V2.4z" fill="C"/>',
ring:'<circle cx="5" cy="5" r="4.2" fill="none" stroke="C" stroke-width="1.4"/><circle cx="5" cy="5" r="2" fill="none" stroke="C" stroke-width="1"/>',
flame:'<path d="M5 .6C6.8 3 8.4 4.2 8.4 6.2A3.4 3.4 0 011.6 6.2C1.6 4 3.4 3 5 .6z" fill="C"/>',
echoRings:'<path d="M3 1.4a5 5 0 010 7.2M6 2.4a3.4 3.4 0 010 5.2M8.6 3.6a1.8 1.8 0 010 2.8" fill="none" stroke="C" stroke-width="1.2"/>',
droplet:'<path d="M5 .8c2.4 3 3.6 4.4 3.6 6A3.6 3.6 0 011.4 6.8c0-1.6 1.2-3 3.6-6z" fill="C"/>',
spiral:'<path d="M5 1.2a3.8 3.8 0 103.4 5.4A2.6 2.6 0 105 3.6" fill="none" stroke="C" stroke-width="1.4"/>',
skull:'<path d="M5 .8a3.8 3.8 0 013.8 3.8c0 1.6-.8 2-.8 3.2 0 .8-1.2 1.4-3 1.4s-3-.6-3-1.4c0-1.2-.8-1.6-.8-3.2A3.8 3.8 0 015 .8z" fill="C"/><circle cx="3.6" cy="4.7" r=".9" fill="#07100c"/><circle cx="6.4" cy="4.7" r=".9" fill="#07100c"/>',
claw:'<path d="M1.4 1c1.6 2.4 2.4 5 2.4 8M4.6 .6c1.6 2.6 2.2 5.2 2.2 8.4M7.8 1.2c1.4 2.4 1.8 4.6 1.8 7.4" fill="none" stroke="C" stroke-width="1.3"/>',
fang:'<path d="M1 1h8L7.4 5.4 5 9.6 2.6 5.4z" fill="C"/>',
boltZig:'<path d="M6.4 .6L2 5.4h2.6L3.4 9.6 8.2 4H5.6z" fill="C"/>',
burst:'<path d="M5 0l1.4 3.2 3.4-.6L7.6 5.2l2.2 2.6-3.4-.6L5 10.4 3.6 7.2.2 7.8 2.4 5.2.2 2.6l3.4.6z" fill="C"/>',
hammerhead:'<rect x="1" y="1.6" width="8" height="3.6" rx=".8" fill="C"/><rect x="4.2" y="5.2" width="1.6" height="4.6" fill="C"/>',
crack:'<path d="M5 .4l1.4 2.6-2 1.6 2.2 1.8-1 3.6" fill="none" stroke="C" stroke-width="1.4"/><path d="M3 2.2l1.2 1.6M6.6 6.4l1.8.8" stroke="C" stroke-width="1" fill="none"/>',
moon:'<path d="M6.6 .8a4.4 4.4 0 100 8.4A4.6 4.6 0 016.6 .8z" fill="C"/>',
splash:'<circle cx="5" cy="5.6" r="2.6" fill="C"/><path d="M5 .4v2M1.2 1.8l1.4 1.6M8.8 1.8L7.4 3.4M.6 6.8l2 .4M9.4 6.8l-2 .4" stroke="C" stroke-width="1.1" fill="none"/>',
chain:'<rect x=".8" y="2.4" width="4.4" height="3.2" rx="1.6" fill="none" stroke="C" stroke-width="1.3"/><rect x="4.8" y="4.4" width="4.4" height="3.2" rx="1.6" fill="none" stroke="C" stroke-width="1.3"/>',
snowflake:'<path d="M5 .6v8.8M1.2 2.6l7.6 4.4M8.8 2.6L1.2 7" stroke="C" stroke-width="1.2" fill="none"/><path d="M5 2.6L3.8 1.4M5 2.6l1.2-1.2M5 7.4L3.8 8.6M5 7.4l1.2 1.2" stroke="C" stroke-width="1" fill="none"/>',
thunder2:'<path d="M4.4 .6L1.2 5H3L2 9.4 5.6 4.4H3.8z" fill="C"/><path d="M8.6 .8L6.2 4.2h1.4L6.8 8 9.6 3.8H8.2z" fill="C" opacity=".8"/>',
eclipse:'<circle cx="5" cy="5" r="4.2" fill="C"/><circle cx="5" cy="5" r="2.4" fill="#07100c"/>',
arrows3:'<path d="M.6 8.4L8.4 .6M6 .6h2.6V3M.4 5.2L5.6 0M3.2 9.6L9.6 3.2" fill="none" stroke="C" stroke-width="1.2"/>',
crosshair:'<circle cx="5" cy="5" r="3.4" fill="none" stroke="C" stroke-width="1.3"/><path d="M5 0v2.2M5 7.8V10M0 5h2.2M7.8 5H10" stroke="C" stroke-width="1.2" fill="none"/><circle cx="5" cy="5" r="1" fill="C"/>',
chaos:'<path d="M5 .6a4.4 4.4 0 014.4 4.4M9.4 5A4.4 4.4 0 015 9.4M5 9.4A4.4 4.4 0 01.6 5" fill="none" stroke="C" stroke-width="1.3"/><path d="M2.6 2.6l4.8 4.8M7.4 2.6L2.6 7.4" stroke="C" stroke-width="1" fill="none"/>',
sunrays:'<circle cx="5" cy="5" r="2.4" fill="C"/><path d="M5 0v1.8M5 8.2V10M0 5h1.8M8.2 5H10M1.5 1.5l1.3 1.3M8.5 1.5L7.2 2.8M1.5 8.5l1.3-1.3M8.5 8.5L7.2 7.2" stroke="C" stroke-width="1.1" fill="none"/>',
voidRing:'<circle cx="5" cy="5" r="4.2" fill="none" stroke="C" stroke-width="1.6"/><circle cx="5" cy="5" r="1.8" fill="#04080a"/>',
shard3:'<path d="M2.4 9.4L1 4l3-3.4 1.4 5.4z" fill="C"/><path d="M8.8 8.6L6.4 4.2 9 1.6l.8 4z" fill="C" opacity=".8"/>',
frostStar:'<path d="M5 0l1.2 3.8L10 5 6.2 6.2 5 10 3.8 6.2 0 5l3.8-1.2z" fill="C"/>',
avalMot:'<path d="M.6 9.6L5 1.2l4.4 8.4z" fill="C" opacity=".85"/><circle cx="3.4" cy="7.4" r="1.5" fill="#eaf7ff"/><circle cx="6.4" cy="8.4" r="1.1" fill="#eaf7ff"/>',
ballMot:'<circle cx="5" cy="5" r="3.4" fill="none" stroke="C" stroke-width="1.4"/><path d="M5 1.6l-1.4 2.6h2.4L4.6 8.4" fill="none" stroke="C" stroke-width="1.1"/>',
sparks3:'<path d="M2.4 1l1 2-1 2-1-2z" fill="C"/><path d="M7.4 2l1.1 2.2-1.1 2.2-1.1-2.2z" fill="C"/><path d="M4.8 5.4L6 7.8 4.8 10.2 3.6 7.8z" fill="C" opacity=".85"/>',
book:'<path d="M1 1.6h3.4c.4 0 .6.2.6.6v6.2H1.6c-.4 0-.6-.2-.6-.6z" fill="C"/><path d="M9 1.6H5.6c-.4 0-.6.2-.6.6v6.2h3.4c.4 0 .6-.2.6-.6z" fill="C" opacity=".65"/>',
tornado:'<path d="M.8 1.6h8.4M1.8 4h6.4M3 6.4h4.4M4 8.8h2.4" stroke="C" stroke-width="1.3" fill="none"/>',
seekArrow:'<circle cx="5" cy="5" r="4.2" fill="none" stroke="C" stroke-width="1.1" opacity=".7"/><path d="M.8 9.2C3 5.6 5.6 3.4 9.2.8" fill="none" stroke="C" stroke-width="1.4"/><path d="M6.2 .8h3v3" fill="none" stroke="C" stroke-width="1.3"/>',
compass:'<circle cx="5" cy="5" r="4.4" fill="none" stroke="C" stroke-width="1.2"/><path d="M7.4 2.6L5.8 5.8 2.6 7.4 4.2 4.2z" fill="C"/><circle cx="5" cy="5" r=".8" fill="C"/>',
legionMot:'<circle cx="2.2" cy="5" r="1.6" fill="C"/><circle cx="5" cy="2.2" r="1.6" fill="C"/><circle cx="7.8" cy="5" r="1.6" fill="C"/><circle cx="5" cy="7.8" r="1.6" fill="C"/>',
choirMot:'<path d="M3 1v6.2a1.5 1.5 0 11-1-1.4V2.2L8 1v5.2a1.5 1.5 0 11-1-1.4V1.8z" fill="C"/>',
mawMot:'<path d="M1 2.2L3 4l2-2 2 2 2-1.8M1 7.8L3 6l2 2 2-2 2 1.8" fill="none" stroke="C" stroke-width="1.5"/>',
armorBloom:'<circle cx="5" cy="5" r="2" fill="C"/><path d="M5 0v3M5 7v3M0 5h3M7 5h3M1.5 1.5l2.1 2.1M6.4 6.4l2.1 2.1M8.5 1.5L6.4 3.6M3.6 6.4L1.5 8.5" stroke="C" stroke-width="1.25"/>',
briarMot:'<path d="M1 9C2 4 5 7 5 3S8 2 9 1" fill="none" stroke="C" stroke-width="1.5"/><path d="M3 6L1.2 4.8M5 4.3l2-1.3M6.8 2.7l-.6-2" stroke="C" stroke-width="1.1"/>',
ramMot:'<path d="M1 5h6M5 2l3 3-3 3" fill="none" stroke="C" stroke-width="1.6"/><path d="M1 2.2l1.4 1.4L1 5M1 5l1.4 1.4L1 7.8" fill="none" stroke="C" stroke-width="1"/>',
fortressMot:'<path d="M1 9V3h2V1h2v2h2V1h2v8z" fill="C"/><path d="M4 9V6h2v3" fill="#07100c"/>',
dragonMot:'<path d="M1 8C2 3 5 1 9 2 7 3 8 5 5.8 5.5 7.8 7 5 9 1 8z" fill="C"/><circle cx="6.3" cy="3.2" r=".7" fill="#111"/>'
};
/* закрепление мотива за конкретным пробуждением */
const EVOMOT={ashKing:'crown',answer:'shieldChev',guard:'ring',ash:'flame',
echo:'echoRings',red:'droplet',whip:'spiral',
rotsick:'skull',rotclaw:'claw',devour:'fang',stormaxe:'boltZig',
berserk:'burst',judge:'hammerhead',bonebreak:'crack',reaper:'moon',bloodaxe:'splash',flail:'chain',
iceglaive:'snowflake',thunder:'thunder2',
shadow:'eclipse',stormbow:'arrows3',seeker:'seekArrow',
execxbow:'crosshair',huntxbow:'compass',
chaos:'chaos',sun:'sunrays',abyss:'voidRing',
icedeep:'shard3',icerapier:'frostStar',iceaval:'avalMot',
ballstorm:'ballMot',
stormgaunt:'sparks3',book:'book',broom:'tornado',
bonelegion:'legionMot',gravechoir:'choirMot',souleaterstaff:'mawMot',bonedragon:'dragonMot',
ironbloom:'armorBloom',bloodbriar:'briarMot',stormshell:'ramMot',worldfortress:'fortressMot'};
/* сборка SVG-иконки: подложка + силуэт базового оружия + мотив эволюции */
function evoIcon(e,size){
const s=size||34,c=e.col,gid='eg_'+e.id;
const mot=(EMOT[EVOMOT[e.id]]||EMOT.flame).split('C').join(c);
return '<svg class="evoIco" viewBox="0 0 24 24" width="'+s+'" height="'+s+'" aria-hidden="true">'
+'<defs><radialGradient id="'+gid+'" cx="34%" cy="26%" r="82%">'
+'<stop offset="0" stop-color="'+hexA(c,.42)+'"/><stop offset="1" stop-color="rgba(4,8,10,.96)"/>'
+'</radialGradient></defs>'
+'<rect x=".8" y=".8" width="22.4" height="22.4" rx="6" fill="url(#'+gid+')" stroke="'+hexA(c,.75)+'" stroke-width="1"/>'
+'<g fill="none" stroke="#e9f2f6" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" opacity=".94" transform="translate(-1.1,-1.3) scale(.92)">'
+(WSIL[e.base]||WSIL.sword)+'</g>'
+'<circle cx="17.4" cy="17.4" r="6.1" fill="rgba(4,9,7,.9)" stroke="'+hexA(c,.35)+'" stroke-width=".7"/>'
+'<g transform="translate(11.9,11.9) scale(1.1)">'+mot+'</g>'
+'</svg>';
}
/* иконка неизвестного пробуждения — только силуэт базы и знак вопроса */
function evoIconLocked(base,size){
const s=size||34;
return '<svg class="evoIco" viewBox="0 0 24 24" width="'+s+'" height="'+s+'" aria-hidden="true">'
+'<rect x=".8" y=".8" width="22.4" height="22.4" rx="6" fill="rgba(10,16,13,.9)" stroke="#2c443a" stroke-width="1"/>'
+'<g fill="none" stroke="#54685e" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" transform="translate(-1.1,-1.3) scale(.92)">'
+(WSIL[base]||WSIL.sword)+'</g>'
+'<circle cx="17.4" cy="17.4" r="6.1" fill="rgba(4,9,7,.92)" stroke="#2c443a" stroke-width=".7"/>'
+'<text x="17.4" y="20.5" font-size="8.6" text-anchor="middle" fill="#8fa79b" font-family="monospace">?</text>'
+'</svg>';
}
/* НОВОЕ: все пробуждения попадают в общий список святилища */
const EVO_COST={legend:340,secret:300,awaken:240};
EVOS.forEach(e=>META_UNLOCKS.push({id:'e_'+e.id,kind:'evo',ref:e.id,icon:e.icon,
name:e.name,cost:EVO_COST[e.rar]||240}));
function findEvo(id){return EVOS.find(x=>x.id===id);}
function curEvoId(){return evoActive[player.weapon]||null;}
function curCfg(){const id=curEvoId();const e=id?findEvo(id):null;return e?e.cfg:null;}
/* проверка условий — срабатывает первый подходящий вариант по базе */
function checkEvo(){
if(state!=='playing'||paused||player.dead)return;
const w=player.weapon;
if(evoActive[w])return;
/* Архимаг после трёх комнат гарантированно выбирает включённую форму.
   Выполненные условия имеют приоритет, но пустой список условий больше не блокирует пробуждение. */
if(w==='archmage'&&room>=4){
const forms=EVOS.filter(e=>(e.base==='fire'||e.base==='ice'||e.base==='bolt')&&!evoOff(e.id));
const eligible=forms.filter(e=>{try{return !!e.need();}catch(_){return false;}});
const pool=eligible.length?eligible:forms;
if(pool.length){const e=pick(pool);evoActive.archmage=e.id;markEvoSeen(e.id);hitStop=Math.max(hitStop,1.05);
banner('АРХИМАГ ПРОБУДИЛСЯ',evoIcon(e,26)+' Случайная форма: '+e.name);spawnParts(46,player.x,player.y-30,e.col,340,.9,'spark',120);sfx.reward();}
return;
}
/* Покупка больше не обходит условие: срабатывают только включённые комбинации бафов. */
for(const e of EVOS){
if(e.base!==w||evoOff(e.id))continue;
let ok=false;try{ok=e.need();}catch(_){}
if(ok){triggerEvo(e);return;}
}
}
/* сцена пробуждения: пауза, вспышка, баннер, временный бафф силы */
function triggerEvo(e,activeBase){
const base=activeBase||e.base;
evoActive[base]=e.id;
markEvoSeen(e.id); /* НОВОЕ: запись открывается в кодексе */
hitStop=Math.max(hitStop,1.05);
addShake(9);
banner('ОРУЖИЕ ПРОБУДИЛОСЬ',evoIcon(e,26)+' '+WEAPONS[base].name+' → '+e.name+
'<br><span style="color:#ffd9a0">Новое умение: '+e.abil.split('—')[0].trim()+'</span>');
spawnParts(46,player.x,player.y-30,e.col,340,.9,'spark',120);
fxList.push({type:'blast',x:player.x,y:player.y-30,life:.5,max:.5});
evoBuffT=6;CTR.static=0;CTR.parryPow=false;
sfx.reward();sfx.boss();
}
/* В лёгком режиме первая комната сразу запускается с открытым и включённым
   пробуждением выбранного оружия. Обычные условия комбинации баффов не нужны. */
function triggerEasyStartEvo(){
if(difficulty!=='easy'||room!==1)return;
const w=player.weapon;
const bases=w==='archmage'?['fire','ice','bolt']:[w];
const available=EVOS.filter(x=>bases.includes(x.base)&&evoBought(x.id)&&!evoOff(x.id));
const e=available.find(x=>x.id===menuEvo)||available[0];
if(e)triggerEvo(e,w);
}
function evoDmgMul(){
const c=curCfg();if(!c)return 1;
let m=(c.dmgMul||1)*(evoBuffT>0?1.25:1)*CTR.nextEmp;
if(c.lowHp&&player.hp<=S.maxHp*.5)m*=1+c.lowHp.dmg;
return m;
}
/* статусы и спец-эффекты пробуждённого оружия при попадании */
function evoOnHit(m,o){
if(!o.wpn||o.dot)return;
if(player.weapon==='knives')CTR.throws++;
if(player.weapon==='fire')CTR.fireDmg+=Math.round(o.d||1);
const c=curCfg();if(!c)return;
CTR.hitCount++;
if(c.st){
if(c.st.bleed){m.bleed=Math.min(6,(m.bleed||0)+c.st.bleed);m.bleedT=3;}
if(c.st.poison){m.poison=Math.min(6,(m.poison||0)+c.st.poison);m.poisonT=4;}
if(c.st.burn){m.burnD=Math.max(m.burnD||0,1.2);m.burnT=3;m.burnSt=(m.burnSt||0)+1;}
if(c.st.frost){m.frostSt=(m.frostSt||0)+c.st.frost;
if(c.freezeAt&&m.frostSt>=c.freezeAt){m.slow=Math.max(m.slow,2.5);popup(m.x,m.y-m.h-14,'ЗАМОРОЗКА','#bfeaff');}
else if(m.frostSt>=4){m.slow=Math.max(m.slow,1.6);m.brittle=true;}
if(c.deepFreeze&&m.frostSt>=8){m.frozen=true;m.slow=Math.max(m.slow,99);
if(m.type!=='boss'){popup(m.x,m.y-m.h-18,'ЗАСТЫЛ','#e8fbff',true);m.hp=0;}}
spawnParts(2,m.x,m.y-m.h*.6,'#bfeaff',80,.3,'spark',40);}
}
/* взрыв при полном стаке статуса */
if(c.expl){for(const s in c.expl){const E=c.expl[s];
const val=s==='bleed'?m.bleed:(s==='burn'?m.burnSt:m.poison);
if(val>=E.cap&&!m['ex_'+s]){m['ex_'+s]=1;
hitMob(m,wDmg(player.weapon)*E.mult,{dir:player.face,noMods:true,dot:true});
fxList.push({type:'blast',x:m.x,y:m.y-m.h*.5,life:.3,max:.3});
spawnParts(12,m.x,m.y-m.h*.5,E.col,220,.4,'spark',200);addShake(4);}
}}
/* статический заряд: каждый N-й удар — цепная молния */
if(c.staticc){CTR.static++;
if(CTR.static>=c.staticc){CTR.static=0;
chainAt(m,wDmg(player.weapon)*1.2,3);
m.slow=Math.max(m.slow||0,1.4);
if(c.frozenDouble&&m.slow>1)hitMob(m,wDmg(player.weapon),{dir:player.face,noMods:true,dot:true});
popup(m.x,m.y-m.h-16,'РАЗРЯД','#9db8ff');}}
/* гниль: 5 ударов по одной цели */
if(c.gnaw){m.gnaw=(m.gnaw||0)+1;
if(m.gnaw>=5&&!m.rotOn){m.rotOn=true;m.brittle=true;popup(m.x,m.y-m.h-14,'ГНИЛЬ','#b6d94a');}}
/* вампиризм за каждый удар */
if(c.healHit&&!player.dead&&player.hp<S.maxHp){
player._hAcc=(player._hAcc||0)+c.healHit;
if(player._hAcc>=1){player._hAcc-=1;player.hp=Math.min(S.maxHp,player.hp+1);
popup(player.x,player.y-60,'+1 ♥','#ff8a9d');}}
/* эхо-удар */
if(c.echo&&o.melee&&CTR.hitCount%c.echo.every===0){
ECHOQ.push({t:c.echo.delay,x:player.x,face:player.face,mult:c.echo.mult,r:130});
popup(player.x,player.y-78,'ЭХО','#9db8ff');}
/* метка бездны */
if(c.abyssMark)m.abMark=true;
}
/* ЭВОЛЮЦИЯ: шаровая молния — медленный самонаводящийся шар, рвётся цепью */
function spawnBall(x,y,an,dmg,BS){
const c=BS||{};
projs.push({x,y,vx:Math.cos(an)*(c.spd||250),vy:Math.sin(an)*(c.spd||250),
friendly:true,wpn:true,type:'ball',dmg,life:c.life||2.6,hit:new Set(),
homing:true,hturn:c.turn||2.2,bcol:c.col||'#a9c4ff',ph:rand()*6.28,onHitZap:true});
spawnParts(4,x,y,c.col||'#a9c4ff',120,.25,'spark',60);
}
/* ЭВОЛЮЦИЯ: лавина — снежный вал, растёт на ходу и сносит всё в выбранную сторону */
function spawnAvalanche(dir,dmg){
const p=player;
projs.push({x:p.x+dir*30,y:GROUND-14,vx:dir*270,vy:0,friendly:true,wpn:true,type:'aval',
dmg,life:2.8,grow:0,hit:new Set(),reHit:0});
addShake(7);noiseS(.5,.35,260);
spawnParts(18,p.x+dir*40,GROUND-20,'#dff2ff',260,.6,'chunk',260);
}
function chainAt(m,dmg,jumps){
let src=m;
fxList.push({type:'zap',a:{x:player.x,y:player.y-34},b:{x:m.x,y:m.y-m.h/2},life:.16,max:.16});
hitMob(m,dmg,{dir:Math.sign(m.x-player.x)||1,noMods:true,dot:true});
for(let c=0;c<jumps;c++){
let nb=null,nd=1e9;
for(const x of mobs){if(x===src||x.hp<=0)continue;
const dd=Math.hypot(x.x-src.x,x.y-src.y);if(dd<240&&dd<nd){nd=dd;nb=x;}}
if(!nb)break;
fxList.push({type:'zap',a:{x:src.x,y:src.y-src.h/2},b:{x:nb.x,y:nb.y-nb.h/2},life:.18,max:.18});
hitMob(nb,dmg*.8,{dir:Math.sign(nb.x-src.x)||1,noMods:true,dot:true});src=nb;}
}
/* эффекты при убийстве пробуждённым оружием */
function evoOnKill(m){
const c=curCfg();if(!c)return;
if(c.transferDots){
for(const x of mobs){if(x===m||x.hp<=0||Math.hypot(x.x-m.x,x.y-m.y)>180)continue;
if(m.bleedT>0){x.bleed=Math.max(x.bleed||0,m.bleed||1);x.bleedT=3;}
if(m.poisonT>0){x.poison=Math.max(x.poison||0,m.poison||1);x.poisonT=4;}
if(m.burnT>0){x.burnD=Math.max(x.burnD||0,m.burnD||1);x.burnT=3;}
if(m.slow>0){x.slow=Math.max(x.slow||0,2);}}
fxList.push({type:'blast',x:m.x,y:m.y-m.h*.5,life:.28,max:.28});
}
if(c.pyroChaos){
CTR.pyroShots=CTR.pyroShots||[];for(let i=0;i<3;i++)CTR.pyroShots.push(Math.floor(rand()*3));
popup(player.x,player.y-78,'НЕКОНТРОЛИРУЕМОСТЬ','#ff9d45');
}
if(FL.finish&&c.healFinish&&player.hp<S.maxHp){player.hp++;popup(player.x,player.y-60,'+1 ♥','#ff5d3a');}
if(c.healKill&&!player.dead&&player.hp<S.maxHp){player.hp++;popup(player.x,player.y-60,'+1 ♥','#aef2b0');}
if(c.soulKill){souls++;runSouls++;}
if(c.killStreak){CTR.killStreak++;
if(CTR.killStreak>=3){CTR.killStreak=0;
fxList.push({type:'blast',x:player.x,y:player.y-30,life:.35,max:.35});
for(const x of [...mobs])if(Math.hypot(x.x-player.x,x.y-player.y)<180)
hitMob(x,wDmg(player.weapon),{dir:Math.sign(x.x-player.x)||1,noMods:true,dot:true});}}
if(c.ghost&&m.abMark){
projs.push({x:m.x,y:m.y-m.h*.5,vx:0,vy:-60,friendly:true,type:'ghostshot',wpn:true,
dmg:Math.max(1,wDmg(player.weapon)*1.2),life:3,hit:new Set(),homing:true});}
if(c.explodeKill){for(const x of [...mobs])if(Math.hypot(x.x-m.x,x.y-m.y)<90){x.burnD=Math.max(x.burnD||0,1.5);x.burnT=3;}
fxList.push({type:'blast',x:m.x,y:m.y-m.h*.5,life:.3,max:.3});}
if(c.bounceKill){let nb=null,nd=1e9;
for(const x of mobs){if(x.hp<=0)continue;const dd=Math.hypot(x.x-m.x,x.y-m.y);if(dd<260&&dd<nd){nd=dd;nb=x;}}
if(nb)hitMob(nb,wDmg(player.weapon)*1.2,{dir:Math.sign(nb.x-m.x)||1,noMods:true});}
if(c.summonEvery){CTR.summonK++;
if(CTR.summonK>=3){CTR.summonK=0;popup(player.x,player.y-80,'ПРИЗРАК','#8fe07a');
let n=0;for(const x of [...mobs]){if(n>=2)break;
hitMob(x,wDmg(player.weapon)*1.5,{dir:1,noMods:true,dot:true});
fxList.push({type:'zap',a:{x:player.x,y:player.y-60},b:{x:x.x,y:x.y-x.h/2},life:.3,max:.3});n++;}}}
if(c.legionKill){CTR.legionKills=(CTR.legionKills||0)+1;
if(CTR.legionKills>=4){CTR.legionKills=0;
const an=rand()*6.283;SUMMONS.push({ang:an,r:54+rnd(0,18),life:8,max:8,shot:.25,spin:rand()<.5?-1:1});
popup(player.x,player.y-78,'В ЛЕГИОН','#c9a0ff');
fxList.push({type:'legiongate',x:m.x,y:m.y-m.h*.5,life:.5,max:.5});}}
}
/* универсальные помощники умений */
function evoApplySt(m,st){
if(st.bleed){m.bleed=Math.min(6,(m.bleed||0)+st.bleed);m.bleedT=3;}
if(st.poison){m.poison=Math.min(6,(m.poison||0)+st.poison);m.poisonT=4;}
if(st.burn){m.burnD=Math.max(m.burnD||0,1.4);m.burnT=3;}
if(st.frost){m.slow=Math.max(m.slow||0,1.8);m.frostSt=(m.frostSt||0)+2;}
}
function arcHit(mult,r,st,behind){
let n=0;
for(const m of [...mobs]){
const dx=m.x-player.x,dy=(m.y-m.h*.5)-(player.y-30);
if(Math.hypot(dx,dy)<r&&(behind||dx*player.face>-30)){
hitMob(m,wDmg(player.weapon)*mult,{dir:Math.sign(dx)||player.face,melee:true,wpn:true});
if(st)evoApplySt(m,st);n++;}
}
return n;
}
function stunMobs(t,r){
for(const m of mobs){
if(Math.hypot(m.x-player.x,m.y-player.y)>(r||200))continue;
if(m.type==='boss'){m.bT=Math.max(m.bT,t);continue;}
m.state=m.type==='flyer'?'climb':'recover';m.t=Math.max(m.t||0,t);m.atkCd=Math.max(m.atkCd,t+.4);}
}
/* Отдельные сигнатурные анимации для пробуждённых ПКМ, которым раньше не хватало собственного визуала. */
const AWAKEN_ALT_FX=new Set(['exec','wave','echodash','dash','spinfire','boomerang','slam','lunge',
'shadowvolley','seekfan','volley','nail','huntvolley','energyburst','giantmeteor','wildfire','hole',
'desperado','icespikes','icebite','glacier','flurry','vortex','saturation','ballnova']);
/* ГЛАВНОЕ: переопределение ПКМ для пробуждённого оружия */
function evoAlt(c){
const p=player,D=wDmg(p.weapon);
const CD={dash:1.4,wave:2.2,spinfire:2.2,spinpoison:2.2,slam:2.6,crush:2.4,cleave:2.4,whirl:3,
lunge:1.8,volley:2.6,shadowvolley:3,harvest:2.6,counter:1.2,bastion:2.6,roar:3,echodash:1.6,
bite:1.4,boomerang:1.8,ringcold:2.4,glacier:2.8,flurry:1.8,ray:2.6,sentence:3,chaoszone:3.5,
hole:3.5,beam:3,nail:2.8,whirlwind:2.4,exec:3,crescent:2.2,
seekfan:2.8,huntvolley:3,avalanche:3.2,ballnova:3,bonelegion:4,gravechoir:4.2,
souleater:3.6,bonedragon:4,energyburst:2.8,giantmeteor:4,wildfire:2.4,desperado:4,
icespikes:3,icebite:3,vortex:3,saturation:2.2}[c.alt]||2.4;
p.altCd=CD*wPerk(p.weapon).altCd*(WEAPONS[p.weapon].cat==='magic'&&hasM('g_cd')?0.78:1);p.altMax=p.altCd;
const evoCastKind={counter:'swing',bastion:'swing',crescent:'shoot',spinpoison:'shoot',bite:'shoot',
roar:'spin',crush:'swing',harvest:'spin',cleave:'swing',whirl:'spin',ringcold:'thrust',
chaoszone:'cast',ray:'cast',sentence:'cast',whirlwind:'cast',bonelegion:'cast',gravechoir:'cast',
souleater:'cast',bonedragon:'cast',energyburst:'cast',giantmeteor:'cast',wildfire:'cast',
desperado:'cast',icespikes:'cast',icebite:'cast',vortex:'cast',saturation:'cast'}[c.alt]||'swing';
const evoCastDur=evoCastKind==='spin'?.48:evoCastKind==='cast'?.42:.34;
p.cast={kind:evoCastKind,alt:c.alt,t:0,dur:evoCastDur};p.animT=evoCastDur;p.animDur=evoCastDur;
const dir=Math.cos(p.aim)>=0?1:-1;
if(AWAKEN_ALT_FX.has(c.alt)){
const longFx=c.alt==='giantmeteor'||c.alt==='desperado'||c.alt==='icespikes'?1.15:.85;
fxList.push({type:'awakenAlt',alt:c.alt,x:p.x,y:p.y-30,tx:mouse.x,ty:mouse.y,dir,life:longFx,max:longFx,seed:rand()*6.283});
}
switch(c.alt){
case 'energyburst':{let removed=0;
for(const m of [...mobs]){if(Math.hypot(m.x-p.x,(m.y-m.h*.5)-(p.y-30))>330)continue;
const n=(m.bleedT>0?1:0)+(m.poisonT>0?1:0)+(m.burnT>0?1:0);if(!n)continue;removed+=n;
m.bleed=0;m.bleedT=0;m.poison=0;m.poisonT=0;m.burnD=0;m.burnT=0;
hitMob(m,D*(.8+n*.75),{dir:Math.sign(m.x-p.x)||1,noMods:true,dot:true});}
popup(p.x,p.y-80,'ВЫБРОС · DOT ×'+removed,'#ff6b35',true);fxList.push({type:'blast',x:p.x,y:p.y-30,life:.45,max:.45});addShake(6);break;}
case 'giantmeteor':{const n=Math.max(1,mobs.filter(m=>m.hp>0).length);p.altCd+=n;p.altMax=p.altCd;
for(let i=0;i<7;i++){const x=50+i*(W-100)/6;fxList.push({type:'meteorwarn',x,life:.55,max:.55});}
for(const m of [...mobs])hitMob(m,D*(2.1+n*.18),{dir:Math.sign(m.x-W/2)||1,wpn:true});
fxList.push({type:'blast',x:W/2,y:GROUND-80,life:.65,max:.65});popup(W/2,120,'ГИГАНТСКИЙ МЕТЕОРИТ · '+n,'#ffd27a',true);addShake(14);break;}
case 'wildfire':{CTR.pyroShots=CTR.pyroShots||[];for(let i=0;i<3;i++)CTR.pyroShots.push(Math.floor(rand()*3));
popup(p.x,p.y-80,'НЕКОНТРОЛИРУЕМОСТЬ ×3','#ff9d45',true);spawnParts(18,p.x,p.y-30,'#ff9d45',230,.5,'spark',80);break;}
case 'desperado':CTR.worldSlow=4;popup(p.x,p.y-80,'ДЕСПЕРАДО','#79ddff',true);fxList.push({type:'blast',x:p.x,y:p.y-30,life:.45,max:.45});break;
case 'icespikes':{let n=0;for(const m of [...mobs])if(m.grounded!==false){hitMob(m,D*2.2,{dir:Math.sign(m.x-p.x)||1,wpn:true});evoApplySt(m,{frost:2});n++;}
for(let x=35;x<W;x+=70)spawnParts(3,x,GROUND-8,'#dff6ff',170,.45,'chunk',420);popup(p.x,p.y-80,'ЛЕДЯНЫЕ ШИПЫ · '+n,'#dff6ff',true);addShake(8);break;}
case 'icebite':{let n=0;for(const m of [...mobs])if(m.frozen||m.frostSt>=8){n++;m.frozen=false;hitMob(m,D*3.2,{dir:Math.sign(m.x-p.x)||1,noMods:true,dot:true});explode(m.x,m.y-m.h*.5,D*1.2);}
popup(p.x,p.y-80,'УКУС ЛЬДА · '+n,'#9de7ff',true);addShake(7);break;}
case 'vortex':HOLES.push({x:clamp(mouse.x,60,W-60),y:clamp(mouse.y,80,GROUND-40),t:2.2,ch:0,kind:'vortex'});popup(mouse.x,mouse.y-30,'ВОРОНКА','#b9d8ff',true);sfx.cast();break;
case 'saturation':CTR.focusMax=true;popup(p.x,p.y-80,'НАСЫЩЕНИЕ','#7fb8ff',true);spawnParts(14,p.x,p.y-30,'#7fb8ff',180,.5,'spark',40);break;
case 'exec':{ /* Казнь Короля */
const hurt=redFlash>0;
for(const m of [...mobs]){const dx=m.x-p.x,dy=(m.y-m.h*.5)-(p.y-30);
if(dx*p.face>-20&&Math.abs(dx)<200&&Math.abs(dy)<90){
hitMob(m,D*(hurt?4.5:3),{dir:p.face,melee:true,wpn:true,finisher:true});evoApplySt(m,{burn:2});}}
addShake(10);fxList.push({type:'blast',x:p.x+p.face*80,y:p.y-30,life:.35,max:.35});
fxList.push({type:'fstrip',x:p.x+p.face*90,w:160,life:2,max:2});
spawnParts(20,p.x+p.face*70,p.y-30,'#ff9d45',300,.5,'spark',200);break;}
case 'counter':{p.inv=Math.max(p.inv,.5);p.vx=-p.face*260;CTR.parryPow=true;
for(const m of [...mobs])if(Math.hypot(m.x-p.x,m.y-p.y)<120&&(m.state==='windup'||m.state==='attack'))
hitMob(m,D*2.4,{dir:p.face,melee:true,wpn:true});
stunMobs(1.2,130);fxList.push({type:'countercut',x:p.x+p.face*38,y:p.y-34,dir:p.face,life:.42,max:.42});
popup(p.x,p.y-70,'КОНТРУДАР','#ffe9c9',true);break;}
case 'bastion':{let n=0;
for(const pr of projs)if(!pr.friendly&&Math.hypot(pr.x-p.x,pr.y-(p.y-26))<170){pr.life=0;n++;}
p.inv=Math.max(p.inv,1);arcHit(1.5+n*.4,190,null,true);addShake(6);
fxList.push({type:'blast',x:p.x,y:p.y-30,life:.3,max:.3});
fxList.push({type:'bastion',x:p.x,y:p.y-32,dir:p.face,life:.82,max:.82});
popup(p.x,p.y-70,'БАСТИОН','#ffd23f',true);break;}
case 'wave':arcHit(1.8,150,{burn:1});
fxList.push({type:'fstrip',x:p.x+p.face*80,w:150,life:2,max:2});
spawnParts(16,p.x+p.face*60,p.y-30,'#ff9d45',260,.45,'spark',160);break;
case 'dash':{ /* Алый разрез */
p.face=dir;p.dash=.16;p.dashDir=dir;p.inv=Math.max(p.inv,.3);
const wide=p.parryWin>0;let healed=false;
for(const m of [...mobs]){
const inL=(Math.abs(m.x-p.x)<(wide?260:220)&&(Math.sign(m.x-p.x)||dir)===dir)||(wide&&Math.hypot(m.x-p.x,m.y-p.y)<140);
if(inL&&m.y>p.y-110&&m.y-m.h<p.y+10){
hitMob(m,D*1.6,{dir,melee:true,wpn:true});evoApplySt(m,{bleed:2});
if(m.bleed>0&&!healed&&p.hp<S.maxHp){healed=true;p.hp++;popup(p.x,p.y-60,'+1 ♥','#ff5d6b');}}}
fxList.push({type:'claw',x:p.x+dir*60,y:p.y-30,life:.25,max:.25});
spawnParts(14,p.x+dir*50,p.y-30,'#ff5d6b',260,.4,'spark',120);break;}
case 'echodash':{p.face=dir;p.dash=.16;p.dashDir=dir;p.inv=Math.max(p.inv,.25);
ECHOQ.push({t:.3,x:p.x+dir*120,face:dir,mult:.9,r:130});
spawnParts(10,p.x,p.y-28,'#9db8ff',200,.4,'spark',80);break;}
case 'spinfire':{for(const pr of projs)if(!pr.friendly&&Math.hypot(pr.x-p.x,pr.y-(p.y-26))<150)pr.life=0;
arcHit(1.7,130,{burn:1},true);
fxList.push({type:'fstrip',x:p.x,w:220,life:2,max:2});
spawnParts(18,p.x,p.y-28,'#ff8a3d',280,.5,'spark',200);addShake(5);break;}
case 'crescent':{arcHit(1.8,150,{poison:1,bleed:1});
fxList.push({type:'rotcrescent',x:p.x+p.face*50,y:p.y-34,dir:p.face,life:.5,max:.5});
for(const m of [...mobs])if(m.bleed>0&&m.poison>0&&Math.hypot(m.x-p.x,m.y-p.y)<160){
hitMob(m,D*1.5,{dir:Math.sign(m.x-p.x)||1,noMods:true,dot:true});
fxList.push({type:'mire',x:m.x,life:4,max:4});}break;}
case 'spinpoison':{arcHit(1.5,120,{poison:1},true);
for(const m of [...mobs])if(m.poison>0&&Math.hypot(m.x-p.x,m.y-p.y)<130){
hitMob(m,D*.8*m.poison,{dir:1,noMods:true,dot:true});m.poison=0;m.poisonT=0;}
fxList.push({type:'rotspin',x:p.x,y:p.y-30,life:.58,max:.58});
spawnParts(16,p.x,p.y-28,'#b6d94a',240,.45,'spark',150);break;}
case 'bite':{let tgt=null,bd=1e9;
for(const m of mobs){const dx=m.x-p.x;
if(dx*p.face>-20&&Math.abs(dx)<150&&Math.hypot(dx,m.y-p.y)<bd){bd=Math.hypot(dx,m.y-p.y);tgt=m;}}
fxList.push({type:'devourbite',x:tgt?tgt.x:p.x+p.face*78,y:tgt?tgt.y-tgt.h*.5:p.y-34,dir:p.face,life:.46,max:.46});
if(tgt){hitMob(tgt,D*1.8,{dir:p.face,melee:true,wpn:true});
if(p.hp<S.maxHp){p.hp++;popup(p.x,p.y-60,'+1 ♥','#ff8a9d');}
if(tgt.hp<=0)p.inv=Math.max(p.inv,.9);}break;}
case 'boomerang':projs.push({x:p.x+p.face*16,y:p.y-28,vx:p.face*640,vy:0,friendly:true,type:'trident',
wpn:true,dmg:D*1.4,life:6,pierce:true,hit:new Set(),t:0,ret:false,onHitZap:true});sfx.throw();break;
case 'slam':{arcHit(2.2,180,null,true);
if(CTR.wrath>=3){stunMobs(1.4,200);CTR.wrath=0;popup(p.x,p.y-80,'ГНЕВ ×3','#ffd23f',true);}
addShake(10);fxList.push({type:'blast',x:p.x,y:GROUND-10,life:.4,max:.4});
spawnParts(20,p.x,GROUND-8,'#ffd23f',300,.5,'chunk',600);break;}
case 'crush':{let tgt=null,bd=1e9;
for(const m of mobs){const dx=m.x-p.x;
if(dx*p.face>-20&&Math.abs(dx)<160&&Math.hypot(dx,m.y-p.y)<bd){bd=Math.hypot(dx,m.y-p.y);tgt=m;}}
if(tgt)hitMob(tgt,D*3.2,{dir:p.face,melee:true,wpn:true,finisher:true});
stunMobs(1,150);arcHit(.8,120,null,true);addShake(9);
fxList.push({type:'bonecrush',x:tgt?tgt.x:p.x+p.face*72,y:GROUND-8,dir:p.face,life:.55,max:.55});break;}
case 'harvest':{const before=mobs.length;
arcHit(2,160,null,true);
if(mobs.length<before){p.altCd*=.45;p.inv=Math.max(p.inv,.8);
popup(p.x,p.y-70,'ЖАТВА','#aef2b0',true);}
fxList.push({type:'harvest',x:p.x,y:p.y-34,dir:p.face,life:.62,max:.62});break;}
case 'cleave':{const before=mobs.length;
arcHit(2.4,170,{bleed:3});addShake(8);
fxList.push({type:'bloodcleave',x:p.x+p.face*36,y:p.y-34,dir:p.face,life:.5,max:.5});
if(mobs.length<before){CTR.nextEmp=1.6;popup(p.x,p.y-74,'УСИЛЕН!','#ff5d5d');}break;}
case 'whirl':{for(const pr of projs)if(!pr.friendly&&Math.hypot(pr.x-p.x,pr.y-(p.y-26))<200)pr.life=0;
arcHit(1.6,190,null,true);addShake(7);
fxList.push({type:'flailwhirl',x:p.x,y:p.y-30,dir:p.face,life:.72,max:.72});break;}
case 'ringcold':{const n=arcHit(1.8,160,{frost:1},true);
fxList.push({type:'frostring',x:p.x,y:p.y-24,life:.65,max:.65});
if(n>=3){for(const m of [...mobs])if(Math.hypot(m.x-p.x,m.y-p.y)<170){
m.slow=Math.max(m.slow,2.5);hitMob(m,D,{dir:1,noMods:true,dot:true});}
fxList.push({type:'blast',x:p.x,y:p.y-30,life:.35,max:.35});popup(p.x,p.y-80,'СТУЖА','#bfeaff',true);}break;}
case 'lunge':{p.face=dir;p.dash=.22;p.dashDir=dir;p.inv=Math.max(p.inv,.35);
const hit=[];
for(const m of [...mobs]){const dx=m.x-p.x;
if(dx*dir>-20&&Math.abs(dx)<250&&Math.abs((m.y-m.h*.5)-(p.y-30))<80){
hitMob(m,D*1.8,{dir,melee:true,wpn:true});hit.push(m);}}
if(hit.length>1)for(let i=1;i<hit.length;i++)
fxList.push({type:'zap',a:{x:hit[i-1].x,y:hit[i-1].y-hit[i-1].h/2},b:{x:hit[i].x,y:hit[i].y-hit[i].h/2},life:.25,max:.25});
break;}
case 'shadowvolley':for(let i=0;i<3;i++)
projs.push({x:p.x,y:p.y-30,vx:rnd(-120,120),vy:-rnd(260,340),friendly:true,type:'arrow',wpn:true,
dmg:D*1.5,life:3,hit:new Set(),homing:true});break;
case 'seekfan':{ /* Ловчий Веер — 5 самонаводящихся стрел */
const base=Math.atan2(mouse.y-(p.y-30),mouse.x-p.x);
for(let i=0;i<5;i++){const off=(i-2)*.36;
projs.push({x:p.x,y:p.y-30,vx:Math.cos(base+off)*520,vy:Math.sin(base+off)*520,friendly:true,
type:'arrow',wpn:true,dmg:D*1.4,life:2.6,hit:new Set(),homing:true,hturn:10,tcol:'#7dffc4',onHitMark:1});}
sfx.shoot();addShake(4);spawnParts(12,p.x,p.y-30,'#7dffc4',220,.4,'spark',80);
popup(p.x,p.y-80,'ЛОВЧИЙ ВЕЕР','#7dffc4');break;}
case 'huntvolley':{ /* Гончий Залп — 3 самонаводящихся тяжёлых болта */
const base=Math.atan2(mouse.y-(p.y-30),mouse.x-p.x);
for(let i=0;i<3;i++){const off=(i-1)*.3;
projs.push({x:p.x,y:p.y-30,vx:Math.cos(base+off)*700,vy:Math.sin(base+off)*700,friendly:true,
type:'heavybolt',wpn:true,dmg:D*1.9,life:2.2,pierce:true,hit:new Set(),
homing:true,hturn:6,tcol:'#8fe0ff',onHitBleed:2});}
sfx.shoot();addShake(6);spawnParts(10,p.x,p.y-30,'#8fe0ff',220,.4,'spark',80);
popup(p.x,p.y-80,'ГОНЧИЙ ЗАЛП','#8fe0ff');break;}
case 'volley':{const base=Math.atan2(mouse.y-(p.y-30),mouse.x-p.x);
for(let i=0;i<5;i++){const off=(i-2)*.16;
projs.push({x:p.x,y:p.y-30,vx:Math.cos(base+off)*640,vy:Math.sin(base+off)*640,friendly:true,
type:'arrow',wpn:true,dmg:D,life:1.1,hit:new Set(),pierce:true,onHitZap:true});}break;}
case 'nail':{let dx=mouse.x-p.x,dy=mouse.y-(p.y-30);const L=Math.hypot(dx,dy)||1;
projs.push({x:p.x+dx/L*18,y:p.y-30+dy/L*10,vx:dx/L*880,vy:dy/L*880,friendly:true,type:'heavybolt',
wpn:true,dmg:D*2.5,life:1.5,pierce:true,hit:new Set(),onHitBleed:3});
addShake(5);break;}
case 'bonelegion':{
for(let i=0;i<6;i++)SUMMONS.push({ang:i*1.047,r:58+(i%2)*24,life:7,max:7,shot:.12+i*.09,spin:i%2?-1:1});
while(SUMMONS.length>10)SUMMONS.shift();
fxList.push({type:'legiongate',x:p.x,y:p.y-34,life:.9,max:.9});
popup(p.x,p.y-82,'КОСТЯНОЙ ЛЕГИОН','#c9a0ff',true);spawnParts(24,p.x,p.y-30,'#c9a0ff',260,.65,'spark',40);break;}
case 'gravechoir':{
TOTEMS.length=0;const cx=clamp(mouse.x,150,W-150);
for(let i=-1;i<=1;i++)TOTEMS.push({x:clamp(cx+i*120,42,W-42),y:GROUND-8,life:7,max:7,shot:.25+(i+1)*.18,phase:(i+1)*2.1});
fxList.push({type:'choirwave',x:cx,y:GROUND-38,life:.8,max:.8});
popup(cx,GROUND-120,'МОГИЛЬНЫЙ ХОР','#8fe0ff',true);spawnParts(22,cx,GROUND-24,'#8fe0ff',230,.6,'spark',-80);break;}
case 'souleater':{
const an=Math.atan2(mouse.y-(p.y-30),mouse.x-p.x);
spawnSummonerSkull(p.x+Math.cos(an)*24,p.y-30+Math.sin(an)*16,an,D*2.6,1.45,
{type:'mawskull',pierce:true,rad:25,col:'#ff8ac8',noDragon:true,bounce:0,devourActive:true});
fxList.push({type:'mawgate',x:p.x+Math.cos(an)*34,y:p.y-30+Math.sin(an)*20,ang,life:.65,max:.65});
popup(p.x,p.y-82,'НЕНАСЫТНАЯ ПАСТЬ','#ff8ac8',true);addShake(5);break;}
case 'bonedragon':{
const d=Math.cos(p.aim)>=0?1:-1;
DRAGONS.push({x:d>0?-110:W+110,y:clamp(mouse.y,100,GROUND-90),dir:d,life:2,max:2,dmg:D*3.2,hit:new Set(),phase:rand()*6.28});
fxList.push({type:'dragongate',x:d>0?18:W-18,y:clamp(mouse.y,100,GROUND-90),dir:d,life:.85,max:.85});
popup(p.x,p.y-82,'ПОЛЁТ ПРАРОДИТЕЛЯ','#f0e2c0',true);addShake(8);break;}
case 'chaoszone':fxList.push({type:'chaos',x:clamp(mouse.x,60,W-60),y:GROUND-50,life:3,max:3,ph:rnd(0,6.28)});sfx.cast();break;
case 'beam':{const an=Math.atan2(mouse.y-(p.y-30),mouse.x-p.x);
for(const m of [...mobs]){const mx=m.x-p.x,my=(m.y-m.h*.5)-(p.y-30);
const t=mx*Math.cos(an)+my*Math.sin(an);
if(t>0&&t<440&&Math.abs(-mx*Math.sin(an)+my*Math.cos(an))<40){
hitMob(m,D*2.2,{dir:Math.sign(Math.cos(an))||1,wpn:true});evoApplySt(m,{burn:2});}}
fxList.push({type:'sunray',a:{x:p.x,y:p.y-30},b:{x:p.x+Math.cos(an)*440,y:p.y-30+Math.sin(an)*440},life:.34,max:.34});
addShake(6);break;}
case 'hole':HOLES.push({x:clamp(mouse.x,60,W-60),y:GROUND-70,t:1.6,ch:0,kind:'singularity'});sfx.cast();break;
case 'glacier':projs.push({x:p.x-24,y:GROUND-8,vx:-300,vy:0,friendly:true,type:'gwave',wpn:true,
dmg:D*1.5,life:2.2,onHitFrost:true});
projs.push({x:p.x+24,y:GROUND-8,vx:300,vy:0,friendly:true,type:'gwave',wpn:true,
dmg:D*1.5,life:2.2,onHitFrost:true});addShake(5);break;
case 'avalanche':{ /* ЛАВИНА — вал в сторону курсора */
p.face=dir;spawnAvalanche(dir,D*1.6);
popup(p.x,p.y-78,'ЛАВИНА!','#dff2ff',true);break;}
case 'ballnova':{ /* ШАРОВОЙ ШКВАЛ — веер шаровых молний */
const BS=(curCfg()||{}).ballShot||{};
const an0=Math.atan2(mouse.y-(p.y-30),mouse.x-p.x);
for(let i=-2;i<=2;i++)spawnBall(p.x+Math.cos(an0+i*.4)*30,p.y-30+Math.sin(an0+i*.4)*18,an0+i*.4,D*1.25,
Object.assign({},BS,{spd:(BS.spd||250)*(i&1?1.24:1)}));
popup(p.x,p.y-78,'ШАРОВОЙ ШКВАЛ','#a9c4ff',true);sfx.cast();addShake(5);break;}
case 'flurry':ECHOQ.push({t:0,x:p.x,face:p.face,mult:1,r:140});
ECHOQ.push({t:.14,x:p.x,face:p.face,mult:1.2,r:140,st:{frost:1}});
ECHOQ.push({t:.28,x:p.x,face:p.face,mult:1.6,r:150,st:{frost:2}});break;
case 'ray':{const an=Math.atan2(mouse.y-(p.y-30),mouse.x-p.x);
for(const m of [...mobs]){const mx=m.x-p.x,my=(m.y-m.h*.5)-(p.y-30);
const t=mx*Math.cos(an)+my*Math.sin(an);
if(t>0&&t<460&&Math.abs(-mx*Math.sin(an)+my*Math.cos(an))<46){
hitMob(m,D*2,{dir:Math.sign(Math.cos(an))||1,wpn:true});m.slow=Math.max(m.slow,1.8);}}
fxList.push({type:'stormray',a:{x:p.x,y:p.y-30},b:{x:p.x+Math.cos(an)*460,y:p.y-30+Math.sin(an)*460},life:.38,max:.38});
spawnParts(10,p.x+Math.cos(an)*30,p.y-30+Math.sin(an)*30,'#9db8ff',180,.4,'spark',0);break;}
case 'sentence':{arcHit(1.2,210,null,true);
for(const m of mobs)if(Math.hypot(m.x-p.x,m.y-p.y)<210){m.curse=true;
popup(m.x,m.y-m.h-12,'ПРОКЛЯТ','#8fe07a');}
fxList.push({type:'sentence',x:p.x,y:p.y-30,life:.9,max:.9});break;}
case 'whirlwind':{for(const pr of projs)if(!pr.friendly&&Math.hypot(pr.x-p.x,pr.y-(p.y-26))<180)pr.life=0;
arcHit(1.3,170,{frost:1},true);
for(const m of mobs)if(Math.hypot(m.x-p.x,m.y-p.y)<170&&m.type!=='boss')m.vy=Math.min(m.vy,-320);
fxList.push({type:'whirlwind',x:p.x,y:GROUND-12,life:.85,max:.85});break;}
case 'roar':evoBuffT=4;popup(p.x,p.y-80,'РЁВ КРОВИ','#ff5d3a',true);addShake(7);
fxList.push({type:'bloodroar',x:p.x,y:p.y-36,life:.8,max:.8});
spawnParts(20,p.x,p.y-30,'#ff5d3a',300,.6,'spark',150);break;
}
}
/* апдейт эволюций: эхо, чёрные дыры, полосы огня, зоны хаоса */
function evoUpdate(dt){
evoBuffT=Math.max(0,evoBuffT-dt);
CTR.worldSlow=Math.max(0,(CTR.worldSlow||0)-dt);
evoChkT-=dt;if(evoChkT<=0){evoChkT=.4;checkEvo();}
for(let i=METEOR_TRAPS.length-1;i>=0;i--){const t=METEOR_TRAPS[i];t.life-=dt;
let hit=false;for(const m of mobs)if(m.hp>0&&Math.hypot(m.x-t.x,(m.y-m.h*.5)-t.y)<115){hit=true;break;}
if(hit||t.life<=0){if(hit){explode(t.x,t.y,t.dmg);addShake(6);}METEOR_TRAPS.splice(i,1);}
else if(rand()<dt*10)spawnParts(1,t.x+rnd(-22,22),t.y-rnd(0,20),'#ffd27a',45,.4,'spark',-30);}
for(let i=ECHOQ.length-1;i>=0;i--){const e=ECHOQ[i];e.t-=dt;
if(e.t<=0){ECHOQ.splice(i,1);
const sx=player.x,sf=player.face;player.x=e.x;player.face=e.face;
arcHit(e.mult,e.r||120,e.st,true);player.x=sx;player.face=sf;
fxList.push({type:'claw',x:e.x+e.face*40,y:player.y-30,life:.2,max:.2});}}
for(let i=HOLES.length-1;i>=0;i--){const h=HOLES[i];h.t-=dt;
for(const m of mobs){if(m.type==='boss')continue;
const dx=h.x-m.x,dy=h.y-(m.y-m.h*.5),L=Math.hypot(dx,dy)||1;
if(L<440){m.vx+=dx/L*1400*dt;if(m.type!=='flyer'&&m.type!=='ghost')m.vy+=dy/L*520*dt;}}
if(rand()<dt*30)spawnParts(1,h.x+rnd(-30,30),h.y+rnd(-30,30),'#b48aff',60,.5,'spark',-40);
if(h.t<=0){HOLES.splice(i,1);addShake(8);noiseS(.3,.3,220);
fxList.push({type:'blast',x:h.x,y:h.y,life:.4,max:.4});
for(const m of [...mobs])if(Math.hypot(m.x-h.x,(m.y-m.h*.5)-h.y)<260)
hitMob(m,wDmg(player.weapon)*(1.6+h.ch*.4),{dir:Math.sign(m.x-h.x)||1,noMods:true});}}
for(let i=SUMMONS.length-1;i>=0;i--){const s=SUMMONS[i];s.life-=dt;s.ang+=dt*1.9*s.spin;
s.x=player.x+Math.cos(s.ang)*s.r;s.y=player.y-38+Math.sin(s.ang)*s.r*.42;s.shot-=dt;
if(s.shot<=0&&mobs.length){s.shot=.82+rnd(0,.22);let nb=null,nd=1e9;
for(const m of mobs){const dd=Math.hypot(m.x-s.x,(m.y-m.h*.5)-s.y);if(dd<nd){nd=dd;nb=m;}}
if(nb){const an=Math.atan2((nb.y-nb.h*.5)-s.y,nb.x-s.x);
spawnSummonerSkull(s.x,s.y,an,wDmg('summoner')*.48,.72,{noDragon:true,bounce:0,targetId:nb.id,plain:true,col:'#c9a0ff'});
fxList.push({type:'legionlink',a:{x:s.x,y:s.y},b:{x:nb.x,y:nb.y-nb.h*.5},life:.16,max:.16});}}
if(s.life<=0)SUMMONS.splice(i,1);}
for(let i=TOTEMS.length-1;i>=0;i--){const t=TOTEMS[i];t.life-=dt;t.shot-=dt;
if(t.shot<=0&&mobs.length){t.shot=.72+rnd(0,.18);let nb=null,nd=1e9;
for(const m of mobs){const dd=Math.hypot(m.x-t.x,(m.y-m.h*.5)-(t.y-54));if(dd<nd){nd=dd;nb=m;}}
if(nb){const an=Math.atan2((nb.y-nb.h*.5)-(t.y-54),nb.x-t.x);
spawnSummonerSkull(t.x,t.y-54,an,wDmg('summoner')*.42,.8,{noDragon:true,bounce:1,targetId:nb.id,plain:true,col:'#8fe0ff'});
fxList.push({type:'choirnote',a:{x:t.x,y:t.y-54},b:{x:nb.x,y:nb.y-nb.h*.5},life:.24,max:.24});}}
if(t.life<=0)TOTEMS.splice(i,1);}
for(let i=DRAGONS.length-1;i>=0;i--){const d=DRAGONS[i];d.life-=dt;d.t=(d.t||0)+dt;
if(d.baseY===undefined)d.baseY=d.y;d.x+=d.dir*620*dt;d.y=d.baseY+Math.sin(d.t*7+d.phase)*34;
for(const m of [...mobs]){if(d.hit.has(m.id))continue;
if(Math.hypot(m.x-d.x,(m.y-m.h*.5)-d.y)<62){d.hit.add(m.id);hitMob(m,d.dmg,{dir:d.dir,wpn:true});
fxList.push({type:'boneburst',x:m.x,y:m.y-m.h*.5,life:.35,max:.35});}}
if(d.life<=0||d.x<-150||d.x>W+150)DRAGONS.splice(i,1);}
for(const f of fxList){
if(f.type==='fstrip'){
for(const m of mobs)if(m.grounded!==false&&Math.abs(m.x-f.x)<f.w/2&&!m.burnT){m.burnD=Math.max(m.burnD||0,1.2);m.burnT=2;}
if(rand()<dt*20)spawnParts(1,f.x+rnd(-f.w/2,f.w/2),GROUND-4,'#ff9d45',80,.5,'spark',-150);}
if(f.type==='chaos'){f.acc=(f.acc||0)+dt;
if(f.acc>.5){f.acc=0;
for(const m of [...mobs])if(Math.hypot(m.x-f.x,(m.y-m.h*.5)-f.y)<90){
if(rand()<.5){m.burnD=Math.max(m.burnD||0,1.5);m.burnT=3;}
else chainAt(m,wDmg(player.weapon)*.8,1);}}
if(Math.hypot(player.x-f.x,(player.y-26)-f.y)<60)player.inv=Math.max(player.inv,.2);}
}
}
function drawHoles(){
for(const h of HOLES){
ctx.save();ctx.translate(h.x,h.y);
const vortex=h.kind==='vortex',pulse=Math.sin(time*6)*6;
ctx.fillStyle=vortex?'rgba(7,25,55,.72)':'rgba(10,4,18,.92)';
ctx.beginPath();ctx.arc(0,0,36+pulse,0,7);ctx.fill();
for(let k=0;k<4;k++){ctx.strokeStyle=vortex?'rgba(125,205,255,'+(.72-k*.12)+')':'rgba(180,138,255,'+(.72-k*.12)+')';ctx.lineWidth=4-k*.45;
const spin=time*(vortex?-2.4:1.4+k*.35)+k;
ctx.beginPath();ctx.ellipse(0,0,52+k*18,20+k*8,spin,0,5.15);ctx.stroke();}
if(vortex){for(let k=0;k<6;k++){const an=-time*3+k*1.047,rr=54+k*8;ctx.fillStyle='rgba(185,230,255,.72)';ctx.beginPath();ctx.arc(Math.cos(an)*rr,Math.sin(an)*rr*.42,3,0,7);ctx.fill();}}
ctx.restore();}
}
function drawSummonerEntities(){
for(const s of SUMMONS){const a=clamp(s.life/Math.min(1,s.max),0,1);
ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(201,160,255,${a*.22})`;ctx.lineWidth=1;
ctx.beginPath();ctx.moveTo(player.x,player.y-34);ctx.quadraticCurveTo((player.x+s.x)/2,Math.min(player.y,s.y)-28,s.x,s.y);ctx.stroke();
ctx.translate(s.x,s.y);ctx.rotate(-s.ang*s.spin);ctx.fillStyle=`rgba(232,220,244,${a})`;ctx.beginPath();ctx.arc(0,-1,7,0,7);ctx.fill();ctx.fillRect(-4,3,8,4);
ctx.fillStyle=`rgba(40,23,51,${a})`;ctx.beginPath();ctx.arc(-2,-2,1.5,0,7);ctx.arc(2,-2,1.5,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';ctx.restore();}
for(const t of TOTEMS){const a=clamp(t.life/Math.min(1,t.max),0,1),pulse=.5+.5*Math.sin(time*7+t.phase);
ctx.save();ctx.translate(t.x,t.y);ctx.globalCompositeOperation='lighter';
for(let k=0;k<3;k++){ctx.strokeStyle=`rgba(143,224,255,${a*(.38-k*.09)})`;ctx.lineWidth=1.5;
ctx.beginPath();ctx.ellipse(0,-52,18+pulse*8+k*13,6+pulse*2+k*4,0,0,7);ctx.stroke();}
ctx.globalCompositeOperation='source-over';ctx.fillStyle=`rgba(65,78,92,${a})`;ctx.fillRect(-8,-48,16,48);
ctx.fillStyle=`rgba(225,239,245,${a})`;ctx.beginPath();ctx.arc(0,-55,11,0,7);ctx.fill();ctx.fillRect(-6,-48,12,7);
ctx.fillStyle=`rgba(28,45,58,${a})`;ctx.beginPath();ctx.arc(-3,-57,2,0,7);ctx.arc(3,-57,2,0,7);ctx.fill();
ctx.font='700 14px serif';ctx.textAlign='center';ctx.fillStyle=`rgba(143,224,255,${a*(.55+.4*pulse)})`;ctx.fillText((Math.floor(time*3+t.phase)%2)?'♪':'♫',16,-72-pulse*8);
ctx.restore();}
for(const d of DRAGONS){const a=clamp(d.life/Math.min(.35,d.max),0,1);
ctx.save();ctx.globalCompositeOperation='lighter';
for(let k=9;k>=1;k--){const xx=d.x-d.dir*k*24,yy=d.y+Math.sin(d.t*8+d.phase-k*.65)*22,rr=5+k*.7;
ctx.strokeStyle=`rgba(240,226,192,${a*(.28+k*.045)})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(xx,yy,rr,-1.15,1.15);ctx.stroke();
if(k%2===0){ctx.beginPath();ctx.moveTo(xx,yy-rr);ctx.lineTo(xx-d.dir*7,yy-rr-9);ctx.moveTo(xx,yy+rr);ctx.lineTo(xx-d.dir*7,yy+rr+9);ctx.stroke();}}
ctx.translate(d.x,d.y);ctx.scale(d.dir,1);ctx.fillStyle=`rgba(240,226,192,${a})`;
ctx.beginPath();ctx.moveTo(30,0);ctx.lineTo(12,-20);ctx.lineTo(-15,-15);ctx.lineTo(-28,0);ctx.lineTo(-15,15);ctx.lineTo(12,20);ctx.closePath();ctx.fill();
ctx.fillStyle=`rgba(56,39,25,${a})`;ctx.beginPath();ctx.arc(10,-7,3.5,0,7);ctx.arc(10,7,3.5,0,7);ctx.fill();
ctx.strokeStyle=`rgba(255,249,226,${a*.85})`;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(24,-3);ctx.lineTo(35,-8);ctx.moveTo(24,3);ctx.lineTo(35,8);ctx.stroke();
ctx.globalCompositeOperation='source-over';ctx.restore();}
}
function drawEvoAura(){
const id=curEvoId();if(!id||player.dead)return;
const e=findEvo(id),a=.16+.07*Math.sin(time*4);
ctx.globalCompositeOperation='lighter';
const g=ctx.createRadialGradient(player.x,player.y-26,4,player.x,player.y-26,40);
g.addColorStop(0,hexA(e.col,a));g.addColorStop(1,hexA(e.col,0));
ctx.fillStyle=g;ctx.beginPath();ctx.arc(player.x,player.y-26,40,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';
if(rand()<.15)spawnParts(1,player.x+rnd(-12,12),player.y-rnd(6,40),e.col,40,.6,'spark',-60);
}
