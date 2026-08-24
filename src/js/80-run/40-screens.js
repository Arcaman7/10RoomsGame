/* ================= ЭКРАНЫ ================= */
function bankSouls(win){
/* Начисляем только прирост базовой награды после последнего банковского события.
   Это не позволяет повторно получить души за пройденные комнаты после ухода в Бездну. */
const rewardBase=Math.floor(runSouls*.35)+room*8+(endless?room*4:0);
const gain=Math.max(0,rewardBase-bankedRewardBase)+(win?150:0);
bankedRewardBase=Math.max(bankedRewardBase,rewardBase);
META.souls=(META.souls|0)+gain;
if(room>(META.bestRoom||1))META.bestRoom=room;
if(endless&&room>(META.bestEndless||0))META.bestEndless=room;
if(win){META.wins=(META.wins|0)+1;if((META.asc||0)<10&&ascLevel>=(META.asc||0))META.asc=Math.min(10,(META.asc||0)+1);}
saveMeta();
return gain;
}
function recordDaily(win){
if(mode!=='daily')return;
const key='halls-daily-'+todayKey();
let list=[];try{list=JSON.parse(localStorage.getItem(key)||'[]');}catch(e){}
list.forEach(r=>r.me=false);
list.push({room,kills,time:Math.round(runTime),win:!!win,me:true});
try{localStorage.setItem(key,JSON.stringify(list.slice(-50)));}catch(e){}
}
function deathCauseLabel(m,bossSource,mobSource){
if(m){const n=m.name||({walker:'бродяга',flyer:'летун',shooter:'стрелок',ghost:'призрак',spore:'спороносец',slime:'делящийся слизень',weaver:'ткач',binder:'могильный связующий',prism:'призматический зверь',mimic:'подражатель',thief:'похититель душ',chrono:'хронофаг',magnet:'магнитный панцирник',builder:'строитель бастионов',sporeling:'споровик'}[m.type])||'враг';return (m.type==='boss'?'босс «':'враг «')+n+'»';}
if(bossSource)return bossRef&&bossRef.name?'атака босса «'+bossRef.name+'»':'атака босса';
if(mobSource)return 'вражеская атака';
const hz={spikes:'колья зала',fall:'обвал',bog:'трясина',jets:'струя пламени',firewave:'волна огня',dark:'опасность во мраке',ice:'гололёд',portal:'портал'};
return hz[(typeof HZ!=='undefined'&&HZ&&HZ.id)||'']||'опасность зала';
}
function fmtRunTime(v){return Math.floor(v/60)+':'+String(Math.floor(v%60)).padStart(2,'0');}
function n1(v){return (Math.round((v||0)*10)/10).toLocaleString('ru-RU');}
function deathDetailsHtml(gain){
const w=WEAPONS[player.weapon],ev=findEvo(curEvoId()),mods=wpnMods(player.weapon).map(id=>WMODS[id]&&WMODS[id].name).filter(Boolean);
const buffList=BUFFS.filter(b=>(buffs[b.id]||0)>0).map(b=>b.name+' '+buffs[b.id]);
const relicList=[...RARE,...LEGEND].filter(r=>rareOn(r.id)).map(r=>r.name);
const modeName=mode==='daily'?'Ежедневный':(endless?'Бездна':'Обычный');
const diffName=difficulty==='easy'?'Лёгкая':'Тяжёлая';
const armor=w&&player.weapon==='thornarmor';
return '<div class="deathBlock"><div class="deathHead">ПОСЛЕДНИЕ МГНОВЕНИЯ</div>'+
'<div class="deathLine"><span>Причина гибели</span><b>'+RUNSTAT.lastHit+'</b></div>'+
'<div class="deathLine"><span>Время похода</span><b>'+fmtRunTime(runTime)+'</b></div>'+
'<div class="deathLine"><span>Режим</span><b>'+modeName+' · '+diffName+(ascLevel?' · Тьма '+ascLevel:'')+'</b></div></div>'+
'<div class="deathBlock"><div class="deathHead">БОЙ</div>'+
'<div class="deathLine"><span>Нанесено урона</span><b>'+n1(RUNSTAT.damageDealt)+'</b></div>'+
'<div class="deathLine"><span>Получено урона</span><b>'+n1(RUNSTAT.damageTaken)+' · '+RUNSTAT.hitsTaken+' уд.</b></div>'+
'<div class="deathLine"><span>Защита</span><b>'+RUNSTAT.blocks+' блок. · '+RUNSTAT.dodges+' укл. · '+RUNSTAT.parries+' парир.</b></div></div>'+
'<div class="deathBlock"><div class="deathHead">РЕЗУЛЬТАТ</div>'+
'<div class="deathLine"><span>Боссы</span><b>'+RUNSTAT.bosses+'</b></div>'+
'<div class="deathLine"><span>Душ собрано</span><b>'+runSouls+' 👻</b></div>'+
'<div class="deathLine"><span>Перенесено в банк</span><b>+'+gain+' 👻</b></div>'+
(armor?'<div class="deathLine"><span>Доспех</span><b>'+RUNSTAT.thornRetaliations+' ответов · '+RUNSTAT.armorRollHits+' таранов</b></div>':'')+'</div>'+
'<div class="deathBlock deathWide"><div class="deathHead">БИЛД НА МОМЕНТ ГИБЕЛИ</div><div class="deathBuild">'+
'<b>'+w.icon+' '+(ev?ev.name:w.name)+'</b> · уровень '+wpnLv(player.weapon)+(ev?' · пробуждение':'')+'<br>'+
'Модификаторы: <b>'+(mods.join(', ')||'нет')+'</b> · Дары: <b>'+(buffList.join(', ')||'нет')+'</b><br>'+
'Реликвии: <b>'+(relicList.join(', ')||'нет')+'</b> · Проклятия: <b>'+(curses.map(id=>(CURSES.find(c=>c.id===id)||{}).name||id).join(', ')||'нет')+'</b></div></div>';
}
let journeyLoading=false,journeyTimer=0;
function beginJourney(){
if(state!=='menu'||journeyLoading||helpOpen||codexOpen||merchantOpen)return;
journeyLoading=true;initAudio();
const loader=$('journeyLoader'),btn=$('btnStart');
btn.disabled=true;loader.setAttribute('aria-hidden','false');loader.classList.remove('hidden');
journeyTimer=setTimeout(()=>{journeyTimer=0;loader.classList.add('hidden');loader.setAttribute('aria-hidden','true');startGame();},1050);
}
function startGame(){
if(state==='playing')return;
journeyLoading=false;$('btnStart').disabled=false;$('journeyLoader').classList.add('hidden');$('journeyLoader').setAttribute('aria-hidden','true');
switching=false;hitStop=0;holdAtk=false;for(const k in keys)keys[k]=false;
difficulty=menuDiff;
leaderboardRunSubmittedFloor=0;
ascLevel=menuAsc;
endless=false;
if(mode==='daily'){
dailySeed=hashStr('halls-'+todayKey());
seedRng(dailySeed);
}else unseedRng();
for(const k in buffs)buffs[k]=0;
curses=[];wLv={};wMods={};relics=[];mastery={};masteryKills={melee:0,ranged:0,magic:0};masteryQueue=[];rageStacks=0;rageT=0;bulwarkUsed=false;abyssGuard=0;
/* ЭВОЛЮЦИИ: сброс пробуждений и счётчиков стиля */
evoActive={};evoBuffT=0;evoChkT=0;HOLES.length=0;ECHOQ.length=0;SUMMONS.length=0;TOTEMS.length=0;DRAGONS.length=0;METEOR_TRAPS.length=0;
Object.assign(CTR,{parry:0,finishKills:0,combo3:0,noHitKills:0,rangedClean:0,throws:0,
dodges:0,fireDmg:0,static:0,magicChain:0,wrath:0,killStreak:0,summonK:0,hitCount:0,summonHits:0,summonKills:0,
summonShot:0,legionKills:0,devourKills:0,
parryPow:false,nextEmp:1,comboNoHit:true});
CTR.pyroShots=[];CTR.worldSlow=0;CTR.focusHold=0;CTR.focusMax=false;
souls=60*unlockLv('p_purse');runSouls=0;bankedRewardBase=0;
Object.assign(RUNSTAT,{damageDealt:0,damageTaken:0,hitsTaken:0,blocks:0,dodges:0,parries:0,bosses:0,thornRetaliations:0,armorRollHits:0,lastHit:'неизвестная причина'});
pathHistory=[];pendingSite=null;
if(ascOn(6))curses.push(pick(CURSES).id);
player.weapon=wpnUnlocked(menuWpn)?menuWpn:'sword';
wLv[player.weapon]=Math.min(MAXLV,1+unlockLv('p_smith'));
calcStats();
Object.assign(player,{x:W/2,y:GROUND,vx:0,vy:0,face:1,hp:S.maxHp,grounded:true,coyote:0,jbuf:0,anim:0,fall:0,inv:0,drop:0,dropCd:0,djCd:0,block:0,blockCd:0,altCd:0,roll:0,rollCd:0,armorRoll:0,armorRollDir:1,healT:0,cd:0,animT:0,cast:null,dead:false,rot:0,combo:0,comboT:0,comboShow:0,webT:0,webPop:0,_thornHeal:0});
ARMOR_ROLL_HITS.clear();
room=1;kills=0;runTime=0;regenT=0;clearT=0;roomVac=false;overT=0;redFlash=0;paused=false;
prophecyBeginRun();
pickups=[];challengeSel=false;challengeRoom=false;extraReward=false;act2GatePassedRun=false;pickedBuffs=[];
hudHp=-99;hudKills=-1;hudRoom=-1;hudWpn='';hudDiff='';hudSouls=-1;hudMods='';
loadRoom(1);
state='playing';
/* Локальный стенд художника/баланса: game_{{VERSION_NUMBER}}.html?testboss=1..20. */
const testBoss=+(new URLSearchParams(location.search).get('testboss')||0);
if(testBoss>=1&&testBoss<=RUN_LEN){room=testBoss;loadRoom(room);mobs=[];projs=[];bossEvents=[];queue=[];spawnBoss();player.hp=Math.max(player.hp,20);S.maxHp=Math.max(S.maxHp,20);if(new URLSearchParams(location.search).has('testberserk'))bossRef.hp=bossRef.maxHp*.24;}
const testQ=new URLSearchParams(location.search),localTest=location.protocol==='file:'||location.hostname==='localhost'||location.hostname==='127.0.0.1';
if(localTest&&!testBoss){const tr=+(testQ.get('testroom')||0),tm=testQ.get('testmob')||'';
 if(tr>=1&&tr<=RUN_LEN){room=tr;loadRoom(room);player.hp=Math.max(player.hp,20);S.maxHp=Math.max(S.maxHp,20);}
 if(tm&&MOBS[tm]){mobs=[];queue=[];spawnMob(tm,{x:W*.68,y:ACT2_MOB_AI[tm]&&ACT2_MOB_AI[tm].fly?260:GROUND,noVariants:true});}
 if(testQ.has('testclear')){mobs=[];queue=[];pickups=[];bossEvents=[];clearT=1.15;}
}
$('startOv').classList.add('hidden');$('overOv').classList.add('hidden');
$('winOv').classList.add('hidden');$('pauseOv').classList.add('hidden');
$('rewardOv').classList.add('hidden');$('mapOv').classList.add('hidden');$('siteOv').classList.add('hidden');
$('codexOv').classList.add('hidden');codexOpen=false;$('merchantOv').classList.add('hidden');merchantOpen=false;$('helpOv').classList.add('hidden');helpOpen=false;
triggerEasyStartEvo();
buffChips();
}
function backToMenu(){
if(journeyTimer){clearTimeout(journeyTimer);journeyTimer=0;}journeyLoading=false;$('btnStart').disabled=false;
$('journeyLoader').classList.add('hidden');$('journeyLoader').setAttribute('aria-hidden','true');
state='menu';unseedRng();endless=false;setPaused(false);
clearT=0;overT=0;hitStop=0;holdAtk=false;for(const k in keys)keys[k]=false;
mobs=[];projs=[];pickups=[];particles=[];popups=[];fxList=[];strikes=[];bossEvents=[];queue=[];bossRef=null;CORPSES.length=0;
HOLES.length=0;ECHOQ.length=0;SUMMONS.length=0;TOTEMS.length=0;DRAGONS.length=0;METEOR_TRAPS.length=0;
$('bossbar').style.display='none';
$('buffRow').innerHTML='';$('modRow').innerHTML='';$('comboBar').style.display='none';
hudRoom=-1;hudWpn='';hudSouls=-1;
if(menuAsc>(META.asc||0))menuAsc=META.asc||0;
$('overOv').classList.add('hidden');$('winOv').classList.add('hidden');
$('codexOv').classList.add('hidden');codexOpen=false;$('merchantOv').classList.add('hidden');merchantOpen=false;$('helpOv').classList.add('hidden');helpOpen=false;
$('startOv').classList.remove('hidden');
buildMenu();
}
function showOver(){
state='over';
prophecyFinishRun(false);prophecyRotateAfterDeath();
const prophecyResult=PROPHECY_API.consumeEvent();
let best=1;try{best=+localStorage.getItem('halls-best')||1;}catch(e){}
if(room>best){best=room;try{localStorage.setItem('halls-best',best);}catch(e){}}
recordDaily(false);
submitPublicRecord(room);
const gain=bankSouls(false);
$('fRoom').textContent=room+(endless?' (бездна)':'/'+RUN_LEN);
$('fKills').textContent=kills;$('fBest').textContent=best;$('fSouls').textContent='+'+gain;
$('fDetails').innerHTML=deathDetailsHtml(gain);
$('fNote').innerHTML=(prophecyResult?'<b style="color:#ffcc85">✦ Предначертание исполнено'+(prophecyResult.skinUnlocked?' — открыт скин «Рыцарь Предначертания»':'')+'.</b><br>':'')+'Часть душ осела в святилище: всего <b style="color:#bfe6ff">'+(META.souls|0)+'</b> 👻 — трать их на новое оружие, уровни перков и пробуждения.';
$('overOv').classList.remove('hidden');
}
function showWin(){
state='win';
prophecyFinishRun(true);
const prophecyResult=PROPHECY_API.consumeEvent();
recordDaily(true);
submitPublicRecord(room);
const gain=bankSouls(true);
$('wKills').textContent=kills;
$('wTime').textContent=Math.floor(runTime/60)+':'+String(Math.floor(runTime%60)).padStart(2,'0');
$('wSouls').textContent='+'+gain;
$('winKicker').textContent='ВСЕ 20 ЗАЛОВ ПРОЙДЕНЫ';$('winTitle').textContent='ПОЗДРАВЛЯЕМ!';$('winMedal').textContent='🏅';$('winMedalNote').textContent='Оба уровня покорены — Бездна открыта!';
$('btnEndless').innerHTML='⬇ В БЕЗДНУ<span>бесконечный босс-раш</span>';
$('btnEndless').style.display=(mode==='daily')?'none':'';
$('wNote').innerHTML=(prophecyResult?'<b style="color:#ffcc85">✦ Предначертание исполнено'+(prophecyResult.skinUnlocked?' — открыт скин «Рыцарь Предначертания»':'')+'.</b><br>':'')+'В святилище <b style="color:#bfe6ff">'+(META.souls|0)+'</b> 👻 · открыт <b style="color:#ff9d7a">уровень Тьмы '+(META.asc|0)+'</b>';
$('winOv').classList.remove('hidden');
}
function showActPass(){
if(endless||room!==ACT1_LEN||act2GatePassedRun)return;
state='actpass';META.act2Pass=1;saveMeta();
$('winKicker').textContent='ПЕРВЫЙ УРОВЕНЬ ПРОЙДЕН';$('winTitle').textContent='ПРОПУСК В ИЗНАНКУ';$('winMedal').textContent='🎟';
$('winMedalNote').textContent='За троном открылся путь во второй уровень. Бездна остаётся запечатана.';
$('wKills').textContent=kills;$('wTime').textContent=fmtRunTime(runTime);$('wSouls').textContent='—';
$('wNote').innerHTML='Билд, души и статистика сохраняются · перед комнатой 11 здоровье восстановится полностью.';
$('btnEndless').innerHTML='ВОЙТИ ВО ВТОРОЙ УРОВЕНЬ<span>комнаты 11–20</span>';$('btnEndless').style.display='';
$('winOv').classList.remove('hidden');
}
function continueAct2(){
if(state!=='actpass'||room!==ACT1_LEN||act2GatePassedRun)return;
act2GatePassedRun=true;player.hp=S.maxHp;player.healT=.9;player.healCol='rgba(100,225,230,';
$('winOv').classList.add('hidden');state='playing';openMap();
}
function goEndless(){
if(state==='actpass'){continueAct2();return;}
if(state!=='win'||room<ABYSS_START||mode==='daily')return;
endless=true;roomVac=false;clearT=0;overT=0;hitStop=0;roomVac=false;
$('winOv').classList.add('hidden');
state='playing';
extraReward=true;
openMap();
}
