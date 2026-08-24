/* ================= МЕТА-ПРОГРЕССИЯ ================= */
const META_KEY='halls-meta-v3';
const META_UNLOCKS=[
{id:'w_axe',    kind:'wpn', ref:'axe',     icon:'🪓',name:'Боевой топор',cost:80},
{id:'w_spear',  kind:'wpn', ref:'spear',   icon:'🔱',name:'Трезубец',    cost:90},
{id:'w_knives', kind:'wpn', ref:'knives',  icon:'🔪',name:'Ножи',        cost:100},
{id:'w_crossbow',kind:'wpn',ref:'crossbow',icon:'🎯',name:'Арбалет',     cost:120},
{id:'w_ice',    kind:'wpn', ref:'ice',     icon:'❄️',name:'Посох льда',  cost:130},
{id:'w_bolt',   kind:'wpn', ref:'bolt',    icon:'⚡',name:'Жезл молний', cost:160},
{id:'p_vigor',  kind:'perk',icon:'❤️',name:'Крепость',   cost:140,max:20,desc:'+1 стартовый максимум HP за уровень'},
{id:'p_purse',  kind:'perk',icon:'👛',name:'Кошель',     cost:90, max:20,desc:'+60 душ в начале похода за уровень'},
{id:'p_smith',  kind:'perk',icon:'⚒',name:'Наследие',   cost:150,max:20,desc:'+1 уровень стартовому оружию за уровень'},
{id:'p_luck',   kind:'perk',icon:'🍀',name:'Удача',      cost:190,max:20,desc:'+1 карта в выборе баффа за уровень'},
{id:'p_thrift', kind:'perk',icon:'⟳', name:'Бережливость',cost:110,max:20,desc:'+1 бесплатный реролл в зале за уровень'},
{id:'p_mod',    kind:'perk',icon:'🔩',name:'Оружейник',  cost:170,max:20,desc:'+1 слот модификаторов за уровень'}
];
const BASE_WPN=['sword','katana','thornarmor','bow','fire','summoner'];
const ASC_DESC=[
'Враги атакуют на 20% чаще',
'Реролл наград недоступен',
'На одну карту баффа меньше',
'Враги +20% HP',
'Лечение между залами −1 ♥',
'Поход начинается со случайного проклятия',
'Боссы +25% HP',
'В каждом зале есть элитные твари',
'Цены торговца и кузницы ×1.6',
'Обычные враги не роняют сердца'
];
let META={souls:0,unlocked:{},evoSeen:{},evoOff:{},bestRoom:1,bestEndless:0,asc:0,wins:0,act2Pass:0,rollKey:'double',playerName:''};
function loadMeta(){
try{const r=localStorage.getItem(META_KEY);if(r)META=Object.assign(META,JSON.parse(r));}catch(e){}
if(!META.unlocked)META.unlocked={};
if(!META.evoSeen)META.evoSeen={};
if(!META.evoOff)META.evoOff={};
if(META.rollKey!=='ctrl')META.rollKey='double';
META.playerName=typeof META.playerName==='string'?META.playerName.slice(0,20):'';
}
function saveMeta(){try{localStorage.setItem(META_KEY,JSON.stringify(META));}catch(e){}}
function hasUnlock(id){return (META.unlocked[id]|0)>0;}
/* НОВОЕ: уровень купленного улучшения (перки качаются до 20 раз) */
function unlockLv(id){return META.unlocked[id]|0;}
function unlockMax(u){return u&&u.max?u.max:1;}
/* цена следующего уровня: у перков мягкий рост ×1.18 за уровень (20 уровней), у остального ×1.6 */
function unlockCost(u){const lv=unlockLv(u.id),g=u.kind==='perk'?1.18:1.6;return Math.round(u.cost*Math.pow(g,lv));}
/* НОВОЕ: «выбить» случайное неоткрытое пробуждение — половина базовой цены открытия */
const EVO_ROLL_COST=120;
/* НОВОЕ: пробуждение считается изученным, когда получено в бою или куплено в святилище */
function evoSeen(id){return !!META.evoSeen[id]||hasUnlock('e_'+id);}
function evoBought(id){return hasUnlock('e_'+id);}
function markEvoSeen(id){if(!META.evoSeen[id]){META.evoSeen[id]=1;saveMeta();}}
/* НОВОЕ: отключение пробуждения — его нельзя получить в походе */
function evoOff(id){return !!META.evoOff[id];}
function toggleEvoOff(id){if(META.evoOff[id])delete META.evoOff[id];else META.evoOff[id]=1;saveMeta();}
loadMeta();
const VARIANTS=[
{id:'fast',    mark:'»', col:'#ffe08a',name:'Быстрый',  desc:'вдвое шустрее, но хлипкий'},
{id:'brute',   mark:'●', col:'#ff9d6b',name:'Громила',  desc:'вдвое больше HP и туша'},
{id:'furious', mark:'✖', col:'#ff5d5d',name:'Бешеный',  desc:'атакует вдвое чаще'},
{id:'zealot',  mark:'💥',col:'#ff8a3d',name:'Фанатик',  desc:'взрывается при смерти'},
{id:'shielded',mark:'🛡',col:'#9ad0ff',name:'Щитоносец',desc:'держит щит спереди — обойди или сломай финишером'},
{id:'scavenger',mark:'🩹',col:'#8fe07a',name:'Падальщик',desc:'лечится, когда рядом гибнет свой'},
{id:'anchor',  mark:'⚓',col:'#b48aff',name:'Якорь',    desc:'соседи получают на 25% меньше урона'},
{id:'echoing', mark:'◉',col:'#d6a8ff',name:'Эхо',      desc:'повторяет особую способность с половинной силой'},
{id:'vampiric',mark:'🩸',col:'#ff6f91',name:'Кровопийца',desc:'лечится, когда наносит урон герою'},
{id:'bonded',  mark:'∞',col:'#73e0ff',name:'Связанный', desc:'появляется в паре и усиливает пережившего союзника'},
{id:'crystal', mark:'◆',col:'#9ff3ff',name:'Кристальный',desc:'первый сильный контроль разбивает защиту на осколки'},
{id:'cloaked', mark:'◌',col:'#c5c9df',name:'Скрытный',  desc:'почти невидим между атаками'},
{id:'adaptive',mark:'△',col:'#ffd27a',name:'Адаптивный',desc:'привыкает к повторяющейся категории урона'}
];
function hasVariant(m,id){return !!(m&&(m.variant===id||(m.variants&&m.variants.indexOf(id)>=0)));}
function applyVariant(m,id){
if(!m.variants)m.variants=[];
if(m.variants.indexOf(id)<0)m.variants.push(id);
if(m.variant==='none')m.variant=id;
if(id==='fast'){m.spd*=1.5;m.hp=m.maxHp=Math.max(1,Math.round(m.hp*.7));m.color=tint(theme.accent,1.35);}
if(id==='brute'){m.w*=1.3;m.h*=1.3;m.spd*=.75;m.hp=m.maxHp=Math.round(m.hp*2);m.color=tint(theme.accent,.72);}
if(id==='furious'){m.color='#c04a3e';m.dark='#5c1f1c';m.eye='#ff5030';}
if(id==='zealot'){m.color='#e0703a';m.dark='#5c2a12';m.eye='#ffd23f';}
if(id==='shielded'){m.guard=true;m.color=tint(theme.accent,.85);m.dark='#2a3a4c';m.eye='#9ad0ff';m.hp=m.maxHp=Math.round(m.hp*1.3);}
if(id==='scavenger'){m.color='#7fae4f';m.dark='#2c4420';m.eye='#c8ff5a';}
if(id==='anchor'){m.anchor=true;m.color='#9a7fd8';m.dark='#3a2c58';m.eye='#d8c8ff';m.hp=m.maxHp=Math.round(m.hp*1.6);}
if(id==='echoing'){m.echoVariant=true;m.color=tint(theme.accent,1.18);m.eye='#e6c8ff';}
if(id==='vampiric'){m.color='#a63f58';m.dark='#421725';m.eye='#ff9bb4';}
if(id==='bonded'){m.color=tint(theme.accent,1.08);m.eye='#73e0ff';}
if(id==='crystal'){m.crystalGuard=true;m.color='#68a9bd';m.dark='#244452';m.eye='#d9fbff';m.hp=m.maxHp=Math.round(m.hp*1.2);}
if(id==='cloaked'){m.cloaked=true;m.eye='#eef0ff';}
if(id==='adaptive'){m.adaptCat='';m.adaptN=0;m.color='#b78a45';m.eye='#ffe5a8';}
}
const MOBS={
walker:{hp:3,spd:110,w:40,h:42},
driller:{hp:6,spd:0,w:44,h:44},
hound:{hp:4,spd:135,w:48,h:34},
tank:{hp:9,spd:60,w:56,h:54},
flyer:{hp:2,spd:150,w:34,h:26},
spitter:{hp:3,spd:85,w:40,h:40},
ghost:{hp:4,spd:62,w:38,h:46},
mage:{hp:4,spd:0,w:36,h:48},
spore:{hp:5,spd:72,w:48,h:52},
slime:{hp:7,spd:82,w:52,h:34},
weaver:{hp:5,spd:105,w:54,h:38},
binder:{hp:6,spd:58,w:42,h:56},
prism:{hp:8,spd:75,w:54,h:48},
mimic:{hp:6,spd:100,w:44,h:50},
thief:{hp:4,spd:185,w:36,h:38},
chrono:{hp:6,spd:64,w:46,h:52},
magnet:{hp:8,spd:52,w:58,h:46},
builder:{hp:7,spd:66,w:48,h:48},
cocoon:{hp:3,spd:0,w:34,h:38},
sporeling:{hp:1,spd:170,w:24,h:20},
bastion:{hp:10,spd:0,w:34,h:70},
/* АКТ II · тридцать противников Изнанки. Поведение задаётся в ACT2_MOB_AI. */
a2_eel:{hp:5,spd:158,w:52,h:25},a2_trumpet:{hp:8,spd:62,w:48,h:44},a2_diver:{hp:9,spd:76,w:46,h:58},
a2_ink:{hp:5,spd:132,w:40,h:38},a2_binder:{hp:8,spd:68,w:48,h:52},a2_letter:{hp:7,spd:92,w:46,h:42},
a2_dancer:{hp:6,spd:148,w:38,h:56},a2_masks:{hp:9,spd:74,w:48,h:54},a2_stagehand:{hp:7,spd:104,w:42,h:44},
a2_wasp:{hp:6,spd:176,w:44,h:28},a2_waxguard:{hp:11,spd:54,w:58,h:60},a2_resonator:{hp:8,spd:86,w:46,h:42},
a2_moth:{hp:6,spd:144,w:46,h:34},a2_vine:{hp:9,spd:78,w:54,h:32},a2_seed:{hp:8,spd:70,w:44,h:52},
a2_ray:{hp:7,spd:154,w:62,h:28},a2_anchor:{hp:11,spd:62,w:56,h:46},a2_gull:{hp:7,spd:164,w:40,h:30},
a2_cup:{hp:10,spd:88,w:48,h:52},a2_saucer:{hp:8,spd:112,w:52,h:38},a2_glazier:{hp:9,spd:70,w:42,h:58},
a2_waiter:{hp:8,spd:116,w:42,h:58},a2_kettle:{hp:12,spd:66,w:58,h:52},a2_cutlery:{hp:7,spd:146,w:50,h:34},
a2_orbiter:{hp:8,spd:126,w:44,h:42},a2_pendulum:{hp:12,spd:58,w:56,h:62},a2_larva:{hp:9,spd:98,w:58,h:28},
a2_needle:{hp:9,spd:142,w:46,h:46},a2_knot:{hp:13,spd:54,w:60,h:58},a2_threadmoth:{hp:8,spd:158,w:48,h:30}
};
const ROOMS=[
{name:'ОПУШКА ТЁМНОГО ЛЕСА',deco:'forest',sky:['#081420','#0d2620','#1a3c2c'],ground:['#3f6a46','#101f14'],accent:'#9fd67a',light:'rgba(150,210,140,',monsters:[['walker',2],['flyer',1],['spitter',1],['spore',2]],layout:1},
{name:'ЗАБЫТЫЕ ПЕЩЕРЫ',deco:'cave',sky:['#05070c','#0b0e14','#141821'],ground:['#4a4f58','#0e1013'],accent:'#7fb4d8',light:'rgba(130,180,220,',monsters:[['walker',2],['flyer',1],['driller',1],['slime',2]],layout:2},
{name:'ГНИЛОЕ БОЛОТО',deco:'swamp',sky:['#0a1410','#14261a','#25402a'],ground:['#4a5c30','#131a0d'],accent:'#b6d94a',light:'rgba(170,210,90,',monsters:[['walker',2],['spitter',1],['hound',1],['weaver',2]],layout:3},
{name:'РАЗРУШЕННЫЙ ФОРТ',deco:'ruins',sky:['#101018','#1e1c26','#332e38'],ground:['#5c5a52','#14130f'],accent:'#d8b46a',light:'rgba(220,180,110,',monsters:[['walker',2],['tank',1],['hound',1],['builder',2]],layout:4},
{name:'СКЛЕП КОРОЛЕЙ',deco:'crypt',sky:['#0c0a14','#181426','#2a2440'],ground:['#4c4468','#100d18'],accent:'#b48aff',light:'rgba(170,130,255,',monsters:[['walker',1],['ghost',2],['spitter',1],['binder',2]],layout:5},
{name:'ЛЕДЯНЫЕ ГРОТЫ',deco:'ice',sky:['#081018','#0e2232','#1e3e52'],ground:['#7fa8c0','#101c24'],accent:'#8fe0ff',light:'rgba(140,220,255,',monsters:[['tank',1],['flyer',2],['driller',1],['prism',2]],layout:6},
{name:'КУЗНИЦА ДЕМОНОВ',deco:'forge',sky:['#160a06','#2a120a','#452012'],ground:['#5c3a2a','#120a06'],accent:'#ff8a3d',light:'rgba(255,140,60,',monsters:[['spitter',2],['tank',1],['hound',1],['magnet',2]],layout:7},
{name:'БАШНЯ ЧАРОДЕЯ',deco:'tower',sky:['#0c0c18','#1a1a34','#2e2e54'],ground:['#4c4c7a','#101020'],accent:'#8a8aff',light:'rgba(140,140,255,',monsters:[['mage',2],['flyer',1],['mimic',1],['chrono',2]],layout:8},
{name:'ЛОГОВО ЧУДОВИЩ',deco:'lair',sky:['#14080c','#26101a','#3c1c26'],ground:['#5c3a40','#140a0c'],accent:'#ff5d6b',light:'rgba(255,90,110,',monsters:[['tank',1],['walker',2],['hound',1],['thief',2],['slime',1]],layout:9},
{name:'ТРОННЫЙ ЗАЛ ВЛАДЫКИ',deco:'throne',sky:['#120608','#240c12','#3e1620'],ground:['#4c3038','#120809'],accent:'#ff3b2f',light:'rgba(255,70,50,',monsters:[['walker',1],['mage',1],['mimic',1],['prism',1],['chrono',1],['builder',1]],layout:10},
{name:'ЗАТОПЛЕННАЯ ОБСЕРВАТОРИЯ',deco:'tide',sky:['#031626','#07364c','#0e6070'],ground:['#326b75','#07191f'],accent:'#65e3e6',light:'rgba(80,225,235,',monsters:[['a2_eel',2],['a2_trumpet',2],['a2_diver',2]],layout:11},
{name:'ЧЕРНИЛЬНЫЙ АРХИВ',deco:'ink',sky:['#eee9da','#cfc8b8','#99958d'],ground:['#3b3938','#111112'],accent:'#272331',light:'rgba(245,235,215,',monsters:[['a2_ink',2],['a2_binder',2],['a2_letter',2]],layout:12},
{name:'ТЕАТР ОБОРВАННЫХ НИТЕЙ',deco:'stage',sky:['#170713','#3a0f28','#6a1b36'],ground:['#70412e','#160a0c'],accent:'#ff7895',light:'rgba(255,110,145,',monsters:[['a2_dancer',2],['a2_masks',2],['a2_stagehand',2]],layout:13},
{name:'ЯНТАРНЫЙ УЛЕЙ',deco:'hive',sky:['#211205','#54330a','#9c6514'],ground:['#9d6d26','#241405'],accent:'#ffd65a',light:'rgba(255,210,80,',monsters:[['a2_wasp',2],['a2_waxguard',2],['a2_resonator',2]],layout:14},
{name:'САД ПОСЛЕДНЕГО ЛЕТА',deco:'garden',sky:['#142014','#384b22','#786532'],ground:['#5c6e33','#15180d'],accent:'#e7ef7a',light:'rgba(220,240,115,',monsters:[['a2_moth',2],['a2_vine',2],['a2_seed',2]],layout:15},
{name:'НЕБЕСНАЯ ВЕРФЬ',deco:'shipyard',sky:['#10253b','#326784','#8fc4d0'],ground:['#6d5a43','#17130f'],accent:'#bcecff',light:'rgba(190,235,255,',monsters:[['a2_ray',2],['a2_anchor',2],['a2_gull',2]],layout:16},
{name:'ФАРФОРОВЫЙ ГОРОД',deco:'porcelain',sky:['#d8edf1','#afced8','#729caf'],ground:['#e8f0e9','#23384b'],accent:'#6aa7e8',light:'rgba(210,240,255,',monsters:[['a2_cup',2],['a2_saucer',2],['a2_glazier',2]],layout:17},
{name:'КУХНИ ПУСТОГО ПИРА',deco:'kitchen',sky:['#180e15','#3e2630','#74523f'],ground:['#6d5545','#17100f'],accent:'#e4a86c',light:'rgba(230,170,105,',monsters:[['a2_waiter',2],['a2_kettle',2],['a2_cutlery',2]],layout:18},
{name:'ЛУННЫЙ ДВИГАТЕЛЬ',deco:'moon',sky:['#050918','#111d3d','#304d77'],ground:['#68758c','#101622'],accent:'#a9c8ff',light:'rgba(165,200,255,',monsters:[['a2_orbiter',2],['a2_pendulum',2],['a2_larva',2]],layout:19},
{name:'ТКАЦКАЯ ПУСТОТА',deco:'loom',sky:['#020207','#09091a','#17132c'],ground:['#39304f','#08060e'],accent:'#f3cf72',light:'rgba(245,205,110,',monsters:[['a2_needle',2],['a2_knot',2],['a2_threadmoth',2]],layout:20}
];
const BOSSES=[
{name:'ВОЖАК СТАИ',hp:26,w:72,h:70,spd:135,mobility:'walk',proj:'spit',c:'#7f9e5a',eye:'#ffd94a',
seqs:[['charge','charge'],['slam','spread'],['charge','slam']],p3:'summon',special:'howl'},
{name:'МАТРИАРХА КРЫЛЬЕВ',hp:30,w:64,h:54,spd:160,mobility:'fly',proj:'spit',c:'#7f9ec0',eye:'#ffd94a',
seqs:[['charge','spread'],['ring','charge'],['spread','spread','ring']],p3:'rain',special:'feathers'},
{name:'ГНИЛОСТНЫЙ ЖАБ',hp:38,w:84,h:72,spd:70,mobility:'walk',proj:'spit',c:'#7fae4f',eye:'#ffd94a',
seqs:[['rain','spread'],['summon','ring'],['spread','rain','rain']],p3:'wave',special:'acid'},
{name:'КОСТЯНОЙ ГЕНЕРАЛ',hp:46,w:76,h:80,spd:115,mobility:'walk',proj:'bone',c:'#d8d3c0',eye:'#ff9d45',
seqs:[['charge','spread'],['summon','charge'],['spread','spread','slam']],p3:'ring',special:'banner'},
{name:'КОРОЛЬ ПРИЗРАКОВ',hp:52,w:72,h:84,spd:75,mobility:'ghost',proj:'arcane',c:'#b48aff',eye:'#e8ecff',
seqs:[['tpcast','ring'],['beam','tpcast'],['ring','ring','beam']],p3:'summon',special:'mirror'},
{name:'ЛЕДЯНОЙ ГОЛЕМ',hp:62,w:90,h:88,spd:55,mobility:'walk',proj:'ice',c:'#8fe0ff',eye:'#ffffff',
seqs:[['slam','wave'],['ring','slam'],['wave','wave','ring']],p3:'charge',special:'frostfloor'},
{name:'ДЕМОН-КУЗНЕЦ',hp:70,w:84,h:86,spd:100,mobility:'walk',proj:'fireball',c:'#ff6a3d',eye:'#ffd23f',
seqs:[['rain','wave'],['charge','slam'],['wave','rain','charge']],p3:'ring',special:'forge'},
{name:'АРХИМАГ',hp:76,w:64,h:80,spd:0,mobility:'tele',proj:'arcane',c:'#8a8aff',eye:'#ffd23f',
seqs:[['tpcast','beam'],['ring','tpcast'],['beam','ring','tpcast']],p3:'rain',special:'clones'},
{name:'ХИМЕРА',hp:86,w:92,h:84,spd:125,mobility:'walk',proj:'spit',c:'#c05a6a',eye:'#ffd94a',
seqs:[['charge','slam'],['spread','ring'],['charge','spread','slam']],p3:'summon',special:'regrow'},
{name:'ВЛАДЫКА ЗАЛА',hp:105,w:88,h:92,spd:90,mobility:'walk',proj:'fireball',c:'#ff3b2f',eye:'#ff5030',
seqs:[['charge','spread'],['rain','summon'],['slam','ring','charge'],['spread','spread','rain']],p3:'beam',special:'crown'},
{name:'АДМИРАЛ СИФОН',hp:118,w:98,h:76,spd:82,mobility:'walk',proj:'bubble',c:'#43bfc8',eye:'#ffe27a',seqs:[['spread','wave'],['rain','slam'],['spread','rain','wave']],p3:'charge',special:'a2_tide'},
{name:'БЛЕДНЫЙ ЦЕНЗОР',hp:126,w:74,h:98,spd:72,mobility:'tele',proj:'ink',c:'#e7dfca',eye:'#16131c',seqs:[['tpcast','spread'],['beam','ring'],['tpcast','beam','spread']],p3:'rain',special:'a2_ink'},
{name:'ПРИМА БЕЗ ЛИЦА',hp:134,w:72,h:100,spd:118,mobility:'walk',proj:'needle',c:'#f4b8c2',eye:'#3d1020',seqs:[['charge','spread'],['slam','ring'],['charge','slam','spread']],p3:'beam',special:'a2_stage'},
{name:'ШЕСТИГРАННАЯ МАТКА',hp:144,w:100,h:72,spd:142,mobility:'fly',proj:'wax',c:'#e6a824',eye:'#fff2a0',seqs:[['spread','ring'],['rain','charge'],['ring','spread','rain']],p3:'summon',special:'a2_hive'},
{name:'САДОВНИК ПОСЛЕДНЕГО ЛЕТА',hp:154,w:92,h:108,spd:86,mobility:'walk',proj:'seed',c:'#9ebf58',eye:'#fff49a',seqs:[['slam','rain'],['spread','wave'],['rain','slam','ring']],p3:'charge',special:'a2_garden'},
{name:'КАПИТАН ВИСЯЧЕГО ФЛОТА',hp:164,w:104,h:82,spd:150,mobility:'fly',proj:'feather',c:'#83b9cf',eye:'#ffe0a0',seqs:[['charge','spread'],['rain','wave'],['charge','ring','spread']],p3:'slam',special:'a2_wind'},
{name:'ПОЛЫЙ ПРИНЦ',hp:176,w:78,h:102,spd:112,mobility:'walk',proj:'shard',c:'#e7f0ec',eye:'#347dcc',seqs:[['charge','ring'],['spread','slam'],['ring','charge','spread']],p3:'rain',special:'a2_porcelain'},
{name:'ХОЗЯИН ПУСТОГО ПИРА',hp:188,w:104,h:96,spd:76,mobility:'walk',proj:'plate',c:'#b87a5c',eye:'#d6ff7a',seqs:[['spread','rain'],['wave','summon'],['slam','spread','wave']],p3:'ring',special:'a2_kitchen'},
{name:'ЛУННЫЙ МЕХАНИЗМ',hp:202,w:94,h:104,spd:74,mobility:'ghost',proj:'moon',c:'#7d9fd8',eye:'#ffffff',seqs:[['ring','beam'],['tpcast','spread'],['ring','beam','tpcast']],p3:'rain',special:'a2_gravity'},
{name:'ТКАЧ НЕНАПИСАННОГО НЕБА',hp:220,w:84,h:112,spd:92,mobility:'tele',proj:'goldthread',c:'#d9b85f',eye:'#ffffff',seqs:[['tpcast','beam'],['ring','spread'],['beam','tpcast','ring']],p3:'rain',special:'a2_loom'}
];
/* Версия XIV: у каждого стража есть собственная школа боя. Сигнатурные
   приёмы идут поверх старых связок, но всегда имеют отдельный телеграф. */
const BOSS_SIGS=[
 ['feint','clawcombo','huntleap'],
 ['crossdive','returnfeathers','wingvortex'],
 ['tongue','bogcrash','acidbubbles'],
 ['bonespear','deadmarch','bonewall'],
 ['ghosthands','gravebeam','mirrorswap'],
 ['iceroll','icepillars','frostgrip'],
 ['forgechain','anvil','weaponforge'],
 ['portalshot','delayrune','reversefan'],
 ['lioncombo','goatfan','serpenttrail'],
 ['royalcombo','judgment','borrowed'],
 ['a2_suction','a2_anchorarc','a2_bubbles'],
 ['a2_strikeout','a2_footnote','a2_paperknife'],
 ['a2_forcedstep','a2_scissors','a2_applause'],
 ['a2_orderdance','a2_waxclone','a2_honeypress'],
 ['a2_fateseed','a2_pruning','a2_seasons'],
 ['a2_fullsail','a2_boarding','a2_cargo'],
 ['a2_service','a2_fracture','a2_shardlance'],
 ['a2_order','a2_tablecloth','a2_places'],
 ['a2_pericenter','a2_poleshift','a2_smallmoon'],
 ['a2_stitch','a2_rippedmoment','a2_wrongpattern']
];
const BOSS_SIG_NAME={feint:'ЛОЖНЫЙ РЫВОК',clawcombo:'КОГТИ ВОЖАКА',huntleap:'БОЛЬШАЯ ОХОТА',
crossdive:'ПЕРЕКРЁСТНЫЙ НАЛЁТ',returnfeathers:'ВОЗВРАТНЫЕ ПЕРЬЯ',wingvortex:'ВОЗДУШНАЯ ВОРОНКА',
tongue:'ЯЗЫК',bogcrash:'БОЛОТНЫЙ ПРЫЖОК',acidbubbles:'ЯДОВИТЫЕ ПУЗЫРИ',
bonespear:'КОСТЯНОЕ КОПЬЁ',deadmarch:'МАРШ МЕРТВЕЦОВ',bonewall:'КОСТЯНАЯ СТЕНА',
ghosthands:'ПРИЗРАЧНЫЕ РУКИ',gravebeam:'ПОГРЕБАЛЬНЫЙ ЛУЧ',mirrorswap:'ОБМЕН ОТРАЖЕНИЙ',
iceroll:'ЛЕДЯНОЙ ТАРАН',icepillars:'ЛЕДЯНЫЕ СТОЛБЫ',frostgrip:'ДРОБЯЩИЙ ЗАХВАТ',
forgechain:'ЦЕПЬ КУЗНЕЦА',anvil:'РАСКАЛЁННАЯ НАКОВАЛЬНЯ',weaponforge:'КОВКА ОРУЖИЯ',
portalshot:'ПОРТАЛЬНАЯ СТРЕЛА',delayrune:'ОТЛОЖЕННОЕ ЗАКЛИНАНИЕ',reversefan:'ОБРАТНЫЙ ВЕЕР',
lioncombo:'ЛЬВИНАЯ ЯРОСТЬ',goatfan:'РОГА ХИМЕРЫ',serpenttrail:'ЗМЕИНЫЙ СЛЕД',
royalcombo:'ПЫЛАЮЩИЙ КЛИНОК',judgment:'ПРИГОВОР',borrowed:'ПАМЯТЬ ЗАЛОВ'};
Object.assign(BOSS_SIG_NAME,{
a2_suction:'ОСУШЕНИЕ',a2_anchorarc:'ЯКОРНАЯ ДУГА',a2_bubbles:'ПУЗЫРНАЯ ТЮРЬМА',
a2_strikeout:'ЗАЧЁРКИВАНИЕ',a2_footnote:'СНОСКА',a2_paperknife:'НОЖИ ДЛЯ БУМАГИ',
a2_forcedstep:'ГЛАВНАЯ РОЛЬ',a2_scissors:'ТАНЕЦ НОЖНИЦ',a2_applause:'АПЛОДИСМЕНТЫ',
a2_orderdance:'ТАНЕЦ ПРИКАЗА',a2_waxclone:'ВОСКОВАЯ КОПИЯ',a2_honeypress:'МЕДОВЫЙ ПРЕСС',
a2_fateseed:'ПОСЕВ СУДЬБЫ',a2_pruning:'ОБРЕЗКА',a2_seasons:'СМЕНА СЕЗОНА',
a2_fullsail:'ПОЛНЫЙ ПАРУС',a2_boarding:'АБОРДАЖ',a2_cargo:'СБРОС ГРУЗА',
a2_service:'КОРОЛЕВСКИЙ СЕРВИЗ',a2_fracture:'ЛИНИЯ ИЗЛОМА',a2_shardlance:'КОПЬЁ ОСКОЛКОВ',
a2_order:'ЗАКАЗ',a2_tablecloth:'СКАТЕРТЬ',a2_places:'ПРИБОРЫ ПО МЕСТАМ',
a2_pericenter:'ПЕРИЦЕНТР',a2_poleshift:'СМЕНА ПОЛЮСОВ',a2_smallmoon:'МАЛАЯ ЛУНА',
a2_stitch:'СТЕЖОК',a2_rippedmoment:'РАСПОРОТЫЙ МИГ',a2_wrongpattern:'НЕВЕРНЫЙ УЗОР'});
const SPECIAL_NAME={howl:'ВОЙ ВОЖАКА',feathers:'ПЕРЬЕВОЙ ШКВАЛ',acid:'КИСЛОТНЫЕ ЛУЖИ',banner:'ШТАНДАРТ',
mirror:'ЗЕРКАЛЬНЫЙ ДВОЙНИК',frostfloor:'НАЛЕДЬ',forge:'РАСКАЛЁННЫЙ ПОЛ',clones:'ДВОЙНИКИ',
regrow:'ОТРАСТАЕТ ГОЛОВА',crown:'ЗОВ КОРОНЫ',
a2_tide:'РАЗРЫВ ТРУБ',a2_ink:'СГИБ СТРАНИЦЫ',a2_stage:'РУКИ КУКЛОВОДА',a2_hive:'ЯНТАРНЫЙ КОКОН',
a2_garden:'ЧЕТЫРЕ СЕЗОНА',a2_wind:'ВЕТРОВОЙ ЩИТ',a2_porcelain:'СБОР ОСКОЛКОВ',a2_kitchen:'ПУСТОЙ ПИР',
a2_gravity:'ТРИ ГРАВИТАЦИОННЫХ ЗАМКА',a2_loom:'ЗОЛОТОЙ ШОВ'};
const ABYSS_BOSS_MODS=[
{id:'iron',icon:'◆',name:'НЕСОКРУШИМЫЙ'},
{id:'haste',icon:'»',name:'СТРЕМИТЕЛЬНЫЙ'},
{id:'regen',icon:'✚',name:'ЖИВУЧИЙ'},
{id:'ward',icon:'◇',name:'ОБЕРЕГАЕМЫЙ'},
{id:'relentless',icon:'✦',name:'НЕУТОМИМЫЙ'}
];
function abyssBossMods(depth,bossRoom){
if(!endless)return [];
const count=Math.min(5,Math.floor(Math.max(0,depth-ABYSS_START)/5)),out=[];
for(let i=0;i<count;i++)out.push(ABYSS_BOSS_MODS[(bossRoom+Math.floor(depth/5)+i*2)%ABYSS_BOSS_MODS.length]);
return out;
}
function bossHasMod(m,id){return !!(m&&m.abyssMods&&m.abyssMods.some(x=>x.id===id));}
const LAYOUTS=[[],
/* 1 · лес: нижние корни, средняя поляна и высокая крона */
[{x:620,y:565,w:200},{x:90,y:520,w:240},{x:410,y:420,w:250},{x:770,y:520,w:230},{x:1090,y:350,w:250}],
/* 2 · пещеры: уступы вокруг центральной вертикальной шахты */
[{x:620,y:565,w:200},{x:80,y:515,w:250},{x:390,y:395,w:230},{x:735,y:275,w:230},{x:1070,y:420,w:270}],
/* 3 · болото: безопасные корни над тремя участками трясины */
[{x:620,y:565,w:200},{x:70,y:530,w:210},{x:350,y:455,w:230},{x:675,y:360,w:220},{x:1010,y:455,w:260},{x:1240,y:300,w:150}],
/* 4 · форт: две стены, двор и разрушенный верхний переход */
[{x:620,y:565,w:200},{x:70,y:470,w:290},{x:430,y:350,w:250},{x:760,y:470,w:250},{x:1080,y:330,w:290},{x:590,y:235,w:260}],
/* 5 · склеп: ярусы катакомб с боковыми нишами */
[{x:620,y:565,w:200},{x:80,y:520,w:220},{x:360,y:410,w:220},{x:650,y:300,w:220},{x:940,y:410,w:220},{x:1190,y:520,w:180}],
/* 6 · лёд: длинные разгонные террасы и короткие тормозные островки */
[{x:620,y:565,w:200},{x:70,y:510,w:350},{x:505,y:390,w:180},{x:760,y:285,w:300},{x:1130,y:430,w:240}],
/* 7 · кузница: три производственных уровня с решётчатыми мостами */
[{x:620,y:565,w:200},{x:80,y:505,w:260},{x:400,y:385,w:250},{x:735,y:505,w:260},{x:1055,y:350,w:280},{x:570,y:245,w:260}],
/* 8 · башня: винтовой подъём вокруг центральной пустоты */
[{x:620,y:565,w:200},{x:80,y:520,w:240},{x:390,y:420,w:220},{x:700,y:315,w:220},{x:1010,y:215,w:260},{x:1150,y:500,w:190}],
/* 9 · логово: три шахты для движущихся подъёмников */
[{x:620,y:565,w:200},{x:100,y:500,w:230},{x:430,y:390,w:230},{x:760,y:500,w:230},{x:1080,y:360,w:250},{x:610,y:250,w:220}],
/* 10 · трон: широкие ступени, поднимающиеся к центру */
[{x:620,y:565,w:200},{x:70,y:535,w:260},{x:360,y:455,w:230},{x:620,y:365,w:200},{x:850,y:455,w:230},{x:1110,y:535,w:260},{x:610,y:245,w:220}],
/* 11–20 · Изнанка: каждая схема поддерживает собственную физику зала. */
[{x:80,y:510,w:280},{x:430,y:395,w:220},{x:720,y:285,w:220},{x:1010,y:420,w:300},{x:570,y:540,w:260}],
[{x:65,y:520,w:220},{x:350,y:430,w:250},{x:680,y:335,w:230},{x:980,y:245,w:250},{x:1130,y:500,w:210}],
[{x:80,y:515,w:300},{x:450,y:385,w:210},{x:735,y:385,w:210},{x:1015,y:515,w:300},{x:600,y:240,w:240}],
[{x:75,y:500,w:230},{x:360,y:420,w:210},{x:625,y:335,w:210},{x:890,y:420,w:210},{x:1150,y:500,w:230}],
[{x:55,y:525,w:250},{x:350,y:455,w:190},{x:600,y:370,w:250},{x:900,y:455,w:190},{x:1130,y:525,w:250},{x:610,y:225,w:220}],
[{x:70,y:505,w:260},{x:390,y:390,w:250},{x:710,y:275,w:230},{x:1005,y:390,w:290},{x:1130,y:535,w:220}],
[{x:70,y:520,w:260},{x:385,y:430,w:210},{x:650,y:325,w:230},{x:935,y:430,w:210},{x:1190,y:520,w:190}],
[{x:60,y:510,w:310},{x:430,y:410,w:220},{x:710,y:510,w:260},{x:1030,y:365,w:280},{x:600,y:245,w:240}],
[{x:70,y:500,w:240},{x:360,y:385,w:220},{x:650,y:270,w:220},{x:940,y:385,w:220},{x:1170,y:500,w:210}],
[{x:70,y:525,w:230},{x:350,y:440,w:220},{x:640,y:350,w:200},{x:900,y:440,w:220},{x:1170,y:525,w:210},{x:620,y:215,w:240}]
].map(L=>L.map(p=>({x:p.x,y:p.y,w:p.w,h:16})));
