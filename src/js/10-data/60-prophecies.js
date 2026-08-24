/* ================= ПРЕДНАЧЕРТАНИЯ =================
   Чистая мета-механика: UI работает только через PROPHECY_API. */
const PROPHECY_POOL=[
 {id:'path_3',icon:'🚪',name:'Первый порог',desc:'Доберись до 3-го зала.',kind:'room',target:3},
 {id:'path_5',icon:'🕯',name:'Глубже во тьму',desc:'Доберись до 5-го зала.',kind:'room',target:5},
 {id:'path_8',icon:'🌘',name:'Дальний рубеж',desc:'Доберись до 8-го зала.',kind:'room',target:8},
 {id:'path_10',icon:'👑',name:'К трону',desc:'Доберись до 10-го зала.',kind:'room',target:10},
 {id:'path_15',icon:'🌌',name:'По ту сторону',desc:'Доберись до 15-го зала.',kind:'room',target:15},
 {id:'boss_2',icon:'⚔️',name:'Охотник на стражей',desc:'Победи 2 боссов.',kind:'bosses',target:2},
 {id:'boss_5',icon:'💀',name:'Гроза владык',desc:'Победи 5 боссов.',kind:'bosses',target:5},
 {id:'boss_10',icon:'👹',name:'Десять корон',desc:'Победи 10 боссов.',kind:'bosses',target:10},
 {id:'kills_25',icon:'🗡',name:'Первая жатва',desc:'Уничтожь 25 врагов.',kind:'kills',target:25},
 {id:'kills_60',icon:'☠',name:'Большая жатва',desc:'Уничтожь 60 врагов.',kind:'kills',target:60},
 {id:'kills_120',icon:'🩸',name:'Алая летопись',desc:'Уничтожь 120 врагов.',kind:'kills',target:120},
 {id:'damage_100',icon:'💥',name:'Сила удара',desc:'Нанеси 100 урона.',kind:'damage',target:100},
 {id:'damage_300',icon:'🔥',name:'Сокрушитель',desc:'Нанеси 300 урона.',kind:'damage',target:300},
 {id:'damage_750',icon:'☄️',name:'Катаклизм',desc:'Нанеси 750 урона.',kind:'damage',target:750},
 {id:'parry_3',icon:'🛡',name:'Точный ответ',desc:'Выполни 3 парирования.',kind:'parries',target:3},
 {id:'parry_8',icon:'⚖️',name:'Зеркало боя',desc:'Выполни 8 парирований.',kind:'parries',target:8},
 {id:'parry_15',icon:'✨',name:'Безупречный щит',desc:'Выполни 15 парирований.',kind:'parries',target:15},
 {id:'dodge_5',icon:'💨',name:'Неуловимый',desc:'Уклонись от 5 атак.',kind:'dodges',target:5},
 {id:'dodge_15',icon:'🌪',name:'Танец между клинков',desc:'Уклонись от 15 атак.',kind:'dodges',target:15},
 {id:'block_5',icon:'🧱',name:'Каменная воля',desc:'Заблокируй 5 атак.',kind:'blocks',target:5},
 {id:'block_15',icon:'🏰',name:'Живая крепость',desc:'Заблокируй 15 атак.',kind:'blocks',target:15},
 {id:'flawless_3',icon:'🪞',name:'Без единой царапины',desc:'Доберись до 3-го зала, не получив урона.',kind:'cleanRoom',target:3,limit:0},
 {id:'flawless_5',icon:'💎',name:'Неприкосновенный',desc:'Доберись до 5-го зала, не получив урона.',kind:'cleanRoom',target:5,limit:0},
 {id:'careful_5',icon:'🩶',name:'Лёгкая походка',desc:'Доберись до 5-го зала, получив не более 3 ударов.',kind:'cleanRoom',target:5,limit:3},
 {id:'careful_10',icon:'🧭',name:'Осторожный странник',desc:'Доберись до 10-го зала, получив не более 8 ударов.',kind:'cleanRoom',target:10,limit:8},
 {id:'weapon_3',icon:'🔨',name:'Закалка',desc:'Подними стартовое оружие до 3-го уровня.',kind:'weaponLevel',target:3},
 {id:'weapon_5',icon:'🌟',name:'Совершенное оружие',desc:'Подними стартовое оружие до 5-го уровня.',kind:'weaponLevel',target:5},
 {id:'mods_2',icon:'🔩',name:'Оружейник',desc:'Установи 2 модификатора на стартовое оружие.',kind:'mods',target:2},
 {id:'mods_3',icon:'⚙️',name:'Мастерская сборка',desc:'Установи 3 модификатора на стартовое оружие.',kind:'mods',target:3},
 {id:'buffs_4',icon:'🌿',name:'Собиратель даров',desc:'Получи 4 разных дара.',kind:'buffs',target:4},
 {id:'buffs_7',icon:'🌈',name:'Живая мозаика',desc:'Получи 7 разных даров.',kind:'buffs',target:7},
 {id:'relic_1',icon:'🎁',name:'Необычная находка',desc:'Найди редкий или легендарный дар.',kind:'relics',target:1},
 {id:'relic_3',icon:'🏛️',name:'Сокровищница чудес',desc:'Собери 3 редких или легендарных дара.',kind:'relics',target:3},
 {id:'curse_1',icon:'🌑',name:'Сделка с тьмой',desc:'Прими одно проклятие.',kind:'curses',target:1},
 {id:'curse_3',icon:'👁',name:'Любимец бездны',desc:'Неси одновременно 3 проклятия.',kind:'curses',target:3},
 {id:'souls_250',icon:'👻',name:'Ловец душ',desc:'Собери 250 душ за поход.',kind:'souls',target:250},
 {id:'souls_600',icon:'💎',name:'Душевладелец',desc:'Собери 600 душ за поход.',kind:'souls',target:600},
 {id:'awaken',icon:'🌠',name:'Пробуждённый',desc:'Пробуди стартовое оружие.',kind:'awaken',target:1},
 {id:'synergy_2',icon:'🔗',name:'Сплетение сил',desc:'Собери 2 разные синергии.',kind:'synergies',target:2},
 {id:'victory',icon:'🏆',name:'Неизбежная победа',desc:'Заверши все 20 залов похода.',kind:'victory',target:1}
];

function prophecyEnsureMeta(){
 if(!META.prophecies||typeof META.prophecies!=='object')META.prophecies={};
 const p=META.prophecies;
 if(!p.completed||typeof p.completed!=='object')p.completed={};
 if(!Array.isArray(p.offers)||p.offers.length!==6||p.offers.some(id=>!PROPHECY_POOL.some(x=>x.id===id)))p.offers=prophecyDraw([]);
 if(p.selected&&!p.offers.includes(p.selected))p.selected='';
 if(!META.skins||typeof META.skins!=='object')META.skins={};
 /* Миграция: выполненное Предначертание всегда является источником истины.
    Восстанавливает награду в старых или рассинхронизированных сохранениях. */
 const hasCompleted=Object.keys(p.completed).length>0;
 if(hasCompleted&&!META.skins.prophecy_knight){
  META.skins.prophecy_knight=1;META.selectedSkin='prophecy_knight';
 }
 if(hasCompleted||META.skins.prophecy_knight)p.rewardGranted=1;
 return p;
}
function prophecyDraw(previous){
 const ids=PROPHECY_POOL.map(p=>p.id);
 for(let i=ids.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)),t=ids[i];ids[i]=ids[j];ids[j]=t;}
 const next=ids.slice(0,6),old=Array.isArray(previous)?previous:[];
 if(old.length===6&&next.every(id=>old.includes(id))){const replacement=ids.find(id=>!old.includes(id));if(replacement)next[5]=replacement;}
 return next;
}
prophecyEnsureMeta();
saveMeta();

let prophecyRunId='',prophecyRunWeapon='',prophecyRunDone=false,prophecyTick=0,prophecyEvent=null;
function prophecyById(id){return PROPHECY_POOL.find(p=>p.id===id)||null;}
function prophecyValue(def,win){
 switch(def.kind){
 case'room':return room;case'bosses':return RUNSTAT.bosses;case'kills':return kills;
 case'damage':return Math.floor(RUNSTAT.damageDealt);case'parries':return RUNSTAT.parries;
 case'dodges':return RUNSTAT.dodges;case'blocks':return RUNSTAT.blocks;
 case'weaponLevel':return wpnLv(prophecyRunWeapon||player.weapon);
 case'mods':return wpnMods(prophecyRunWeapon||player.weapon).length;
 case'buffs':return Object.keys(buffs).filter(k=>buffs[k]>0).length;
 case'relics':return relics.length;case'curses':return curses.length;case'souls':return runSouls;
 case'awaken':return curEvoId()?1:0;
 case'synergies':return SYN.filter(s=>synOn(s.id)).length;
 case'victory':return win?1:0;
 case'cleanRoom':return room>=def.target&&RUNSTAT.hitsTaken<=def.limit?def.target:Math.min(room,def.target-1);
 default:return 0;
 }
}
function prophecyProgress(id,win){
 const def=prophecyById(id);if(!def)return null;
 const value=prophecyValue(def,!!win),complete=def.kind==='cleanRoom'?(room>=def.target&&RUNSTAT.hitsTaken<=def.limit):value>=def.target;
 return {id:def.id,value:Math.min(value,def.target),target:def.target,complete,
  text:def.kind==='cleanRoom'?(Math.min(room,def.target)+'/'+def.target+' зал · '+RUNSTAT.hitsTaken+'/'+def.limit+' уд.'):(Math.min(value,def.target)+'/'+def.target)};
}
function prophecyComplete(id){
 const p=prophecyEnsureMeta(),def=prophecyById(id);if(!def||p.completed[id])return false;
 p.completed[id]=Date.now();
 let skinUnlocked=false;
 if(!p.rewardGranted||!META.skins.prophecy_knight){
  p.rewardGranted=1;META.skins.prophecy_knight=1;META.selectedSkin='prophecy_knight';skinUnlocked=true;
 }
 prophecyRunDone=true;prophecyEvent={type:'completed',id,skinUnlocked,skinId:skinUnlocked?'prophecy_knight':''};
 if(typeof banner==='function')banner('ПРЕДНАЧЕРТАНИЕ ИСПОЛНЕНО',skinUnlocked?'ОТКРЫТ СКИН «РЫЦАРЬ ПРЕДНАЧЕРТАНИЯ»':def.name.toUpperCase());
 try{sfx.reward();}catch(e){}
 saveMeta();return true;
}
function prophecyCheckpoint(dt,win){
 if(!prophecyRunId||prophecyRunDone)return false;
 prophecyTick-=dt||0;if(!win&&prophecyTick>0)return false;prophecyTick=.2;
 const progress=prophecyProgress(prophecyRunId,!!win);
 return !!(progress&&progress.complete&&prophecyComplete(prophecyRunId));
}
function prophecyBeginRun(){
 const p=prophecyEnsureMeta();prophecyRunId=p.selected&&p.offers.includes(p.selected)?p.selected:'';
 prophecyRunWeapon=player.weapon;prophecyRunDone=!!p.completed[prophecyRunId];prophecyTick=0;prophecyEvent=null;
}
function prophecyFinishRun(win){prophecyCheckpoint(0,!!win);prophecyRunId='';prophecyRunWeapon='';prophecyRunDone=false;}
function prophecyRotateAfterDeath(){const p=prophecyEnsureMeta();p.offers=prophecyDraw(p.offers);p.selected='';p.rotation=(p.rotation|0)+1;saveMeta();}
function prophecyCard(def){
 const p=prophecyEnsureMeta(),progress=prophecyRunId===def.id?prophecyProgress(def.id,false):null;
 return {id:def.id,icon:def.icon,name:def.name,desc:def.desc,description:def.desc,
  completed:!!p.completed[def.id],selected:p.selected===def.id,progress,
  progressText:progress?progress.text:''};
}
const PROPHECY_API={
 pool:()=>PROPHECY_POOL.map(prophecyCard),
 getOffers:()=>{const p=prophecyEnsureMeta();return p.offers.map(prophecyById).filter(Boolean).map(prophecyCard);},
 select:id=>{const p=prophecyEnsureMeta();if(typeof state!=='undefined'&&state!=='menu')return false;if(!p.offers.includes(id)||!prophecyById(id))return false;p.selected=id;saveMeta();return true;},
 getSelected:()=>prophecyEnsureMeta().selected||'',
 getActive:()=>prophecyRunId?prophecyCard(prophecyById(prophecyRunId)):null,
 getProgress:id=>prophecyProgress(id||prophecyRunId,false),
 getState:()=>{const p=prophecyEnsureMeta();return {offers:PROPHECY_API.getOffers(),selected:p.selected||'',active:PROPHECY_API.getActive(),completedCount:Object.keys(p.completed).length,total:PROPHECY_POOL.length,rewardGranted:!!p.rewardGranted,skinUnlocked:!!META.skins.prophecy_knight,rotation:p.rotation|0};},
 consumeEvent:()=>{const e=prophecyEvent;prophecyEvent=null;return e;}
};
/* Узкие совместимые хелперы для DOM-меню святилища. */
function getProphecyOffers(){return PROPHECY_API.getOffers();}
function getSelectedProphecyId(){return PROPHECY_API.getSelected();}
function isProphecyCompleted(id){return !!prophecyEnsureMeta().completed[id];}
function selectProphecy(id){return PROPHECY_API.select(id);}
function isSkinUnlocked(id){prophecyEnsureMeta();return id==='basic'||!!META.skins[id];}
function getSelectedSkinId(){prophecyEnsureMeta();return isSkinUnlocked(META.selectedSkin)?META.selectedSkin:'basic';}
function selectSkin(id){if(typeof state!=='undefined'&&state!=='menu')return false;if(!isSkinUnlocked(id))return false;META.selectedSkin=id==='prophecy_knight'?id:'basic';saveMeta();return true;}
if(typeof window!=='undefined')window.PROPHECY_API=PROPHECY_API;
