/* ================= МЕНЮ ================= */
function wpnUnlocked(k){
if(k==='archmage')return wpnUnlocked('fire')&&wpnUnlocked('ice')&&wpnUnlocked('summoner')&&wpnUnlocked('bolt');
if(BASE_WPN.indexOf(k)>=0)return true;
const u=META_UNLOCKS.find(x=>x.kind==='wpn'&&x.ref===k);
return u?hasUnlock(u.id):true;
}
function buildModeTabs(){
$('modeTabs').innerHTML=
`<div class="tab${mode==='normal'?' on':''}" data-m="normal">ОБЫЧНЫЙ ПОХОД</div>
<div class="tab${mode==='daily'?' on':''}" data-m="daily">☀ ЕЖЕДНЕВНЫЙ ЗАБЕГ</div>`;
document.querySelectorAll('#modeTabs .tab').forEach(t=>t.onclick=()=>{mode=t.dataset.m;buildMenu();});
$('lbSection').style.display=mode==='daily'?'':'none';
if(mode==='daily')buildLeaderboard();
}
/* НОВОЕ: настройка кувырка — двойное нажатие A/D или CTRL */
function buildRollTabs(){
$('rollTabs').innerHTML=
`<div class="tab${META.rollKey==='double'?' on':''}" data-r="double">×2 НАЖАТИЯ A/D</div>
<div class="tab${META.rollKey==='ctrl'?' on':''}" data-r="ctrl">CTRL</div>`;
document.querySelectorAll('#rollTabs .tab').forEach(t=>t.onclick=()=>{
META.rollKey=t.dataset.r==='ctrl'?'ctrl':'double';saveMeta();buildRollTabs();updHint();
try{sfx.reward();}catch(e){}
});
}
let pauseKeyCapture=false;
function pauseKeyLabel(code){
const named={Space:'ПРОБЕЛ',Enter:'ENTER',Tab:'TAB',Backspace:'BACKSPACE',Delete:'DELETE',Insert:'INSERT',Home:'HOME',End:'END',PageUp:'PAGE UP',PageDown:'PAGE DOWN',ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→',ShiftLeft:'SHIFT',ShiftRight:'SHIFT',ControlLeft:'CTRL',ControlRight:'CTRL',AltLeft:'ALT',AltRight:'ALT'};
if(named[code])return named[code];
if(/^Key[A-Z]$/.test(code))return code.slice(3);
if(/^Digit[0-9]$/.test(code))return code.slice(5);
if(/^Numpad[0-9]$/.test(code))return 'NUM '+code.slice(6);
return code.replace(/(Left|Right)$/,' $1').toUpperCase();
}
function buildPauseKey(){
const btn=$('pauseKeyBtn'),note=$('pauseKeyNote');if(!btn||!note)return;
btn.textContent=pauseKeyCapture?'…':pauseKeyLabel(META.pauseKey);
btn.classList.toggle('listening',pauseKeyCapture);
note.textContent=pauseKeyCapture?'НАЖМИ КЛАВИШУ · ESC — ОТМЕНА':'НАЖМИ, ЧТОБЫ ИЗМЕНИТЬ';
btn.onclick=()=>{pauseKeyCapture=true;buildPauseKey();btn.focus();};
btn.onblur=()=>{if(pauseKeyCapture){pauseKeyCapture=false;buildPauseKey();}};
}
function capturePauseKey(e){
if(!pauseKeyCapture)return false;
e.preventDefault();e.stopPropagation();
if(e.code!=='Escape'){META.pauseKey=e.code;saveMeta();try{sfx.reward();}catch(err){}}
pauseKeyCapture=false;buildPauseKey();updHint();return true;
}
function buildPlayerName(){
const input=$('playerNameInput');if(!input)return;
input.value=META.playerName||'';
input.oninput=()=>{META.playerName=input.value.slice(0,20);saveMeta();};
input.onblur=()=>{
const name=input.value.trim().slice(0,20);
if(input.value!==name)input.value=name;
if(META.playerName!==name){META.playerName=name;saveMeta();}
};
}
function updHint(){
const el=$('hintKb');if(!el)return;
const pause=pauseKeyLabel(META.pauseKey);
const pausePrompt=$('pausePromptKb');if(pausePrompt)pausePrompt.textContent='НАЖМИ '+pause+', ЧТОБЫ ПРОДОЛЖИТЬ';
const armor=(state==='menu'?menuWpn:player.weapon)==='thornarmor';
const tel=$('hintTt');if(tel)tel.textContent=armor
?'Кнопки внизу · ⚔ не атакует до пробуждения · ✦ — тяжёлый перекат с неуязвимостью и уроном · 🛡 — парирование'
:'Кнопки внизу · ×2 нажатия ◀/▶ — рывок · прицел сам · 🛡 — парирование · ⚔ трижды подряд — комбо с финишером';
const atk=armor
?'ЛКМ — нет атаки до пробуждения · ПКМ — тяжёлый перекат с неуязвимостью и уроном'
:'ЛКМ — атака в сторону курсора (комбо из 3: третий — финишер) · ПКМ — умение';
el.textContent=META.rollKey==='ctrl'
?'A D — движение · CTRL — кувырок · W / ПРОБЕЛ — прыжок ×2 · S — спуск · '+atk+' · SHIFT / Q — парирование · '+pause+' — пауза · R — выйти в святилище'
:'A D — движение (×2 нажатия — кувырок) · W / ПРОБЕЛ — прыжок ×2 · S — спуск · '+atk+' · SHIFT / Q — парирование · '+pause+' — пауза · R — выйти в святилище';
}
function buildAsc(){
const max=META.asc||0;
let h='';
for(let i=0;i<=10;i++){
const lock=i>max;
h+=`<div class="ascBtn${menuAsc===i?' on':''}${lock?' lock':''}" data-a="${i}">${i}</div>`;
}
$('ascRow').innerHTML=h;
document.querySelectorAll('#ascRow .ascBtn').forEach(b=>b.onclick=()=>{
const v=+b.dataset.a;if(v>(META.asc||0))return;menuAsc=v;buildAsc();
});
$('ascList').innerHTML=menuAsc===0
? '<span class="dim">Тьма ещё не сгустилась. Пройди поход, чтобы открыть первый уровень.</span>'
: ASC_DESC.slice(0,menuAsc).map((d,i)=>'<div>'+(i+1)+'. '+d+'</div>').join('');
}
function buildLeaderboard(){
const key='halls-daily-'+todayKey();
let list=[];try{list=JSON.parse(localStorage.getItem(key)||'[]');}catch(e){}
list.sort((a,b)=>b.room-a.room||b.kills-a.kills||a.time-b.time);
$('lbList').innerHTML=list.length
? list.slice(0,10).map((r,i)=>`<div class="lrow${r.me?' me':''}"><span>${i+1}. зал ${r.room}${r.win?' 👑':''}</span>
<span>${r.kills} убийств · ${Math.floor(r.time/60)}:${String(Math.floor(r.time%60)).padStart(2,'0')}</span></div>`).join('')
: '<div class="lrow"><span class="dim">Сегодня забегов ещё не было</span><span></span></div>';
}
/* Карточки основной витрины святилища: оружие и уровни перков. */
function metaCard(u){
const lv=unlockLv(u.id),mx=unlockMax(u),maxed=lv>=mx;
const cost=unlockCost(u),aff=(META.souls|0)>=cost;
const ico=u.icon,name=u.name,desc=u.desc||'открыть оружие';
let pips='';
if(mx>1){pips='<div class="pips">';
for(let i=0;i<mx;i++)pips+='<div class="pip'+(i<lv?' on':'')+'"></div>';
pips+='</div>';}
const cls='mitem'+(maxed?(mx>1?' max':' own'):(aff?'':' poor'));
const price=maxed?(mx>1?'УР. '+mx+' — МАКС':'✔'):(mx>1?'УР. '+(lv+1)+' · '+cost+' 👻':cost+' 👻');
return `<div class="${cls}" data-u="${u.id}">
<div class="mi">${ico}</div>
<div class="mn">${name}</div>
<div>${desc}</div>
${pips}
<div style="color:${maxed?'#a8d08d':(aff?'#bfe6ff':'#8a5a5a')}">${price}</div>
</div>`;
}
/* Открытие случайной записи пробуждения за полцены теперь живёт в кодексе. */
let lastEvoRoll='';
function evoRollPool(){return EVOS.filter(e=>!evoBought(e.id));}
function rollEvoUnlock(){
const pool=evoRollPool();
if(!pool.length||(META.souls|0)<EVO_ROLL_COST)return;
const e=pool[Math.floor(Math.random()*pool.length)];
META.souls-=EVO_ROLL_COST;
META.unlocked['e_'+e.id]=1;
if(META.evoOff[e.id])delete META.evoOff[e.id];
lastEvoRoll='открыто: '+e.name;
META.evoSeen[e.id]=1;
saveMeta();sfx.reward();buildMetaShop();if(codexOpen)buildCodex();
}
function buildMetaShop(){
$('metaSouls').textContent=META.souls|0;
const grp=[['— ОРУЖИЕ —','wpn'],['— БАФФЫ ПОХОДА · до 20 уровней —','perk']];
let h='';
for(const [lbl,kind] of grp){
const items=META_UNLOCKS.filter(u=>u.kind===kind);
if(!items.length)continue;
h+='<div class="mhead">'+lbl+'</div>';
h+=items.map(metaCard).join('');
}
$('metaGrid').innerHTML=h;
document.querySelectorAll('#metaGrid .mitem').forEach(el=>el.onclick=(ev)=>{
const u=META_UNLOCKS.find(x=>x.id===el.dataset.u);
if(!u)return;
if(unlockLv(u.id)>=unlockMax(u))return;
const cost=unlockCost(u);
if((META.souls|0)<cost)return;
META.souls-=cost;META.unlocked[u.id]=unlockLv(u.id)+1;
saveMeta();sfx.reward();buildMenu();
});
}
/* КОДЕКС ПРОБУЖДЕНИЙ — все 50 эволюций с условиями */
let codexOpen=false;
function buyEvoRecord(id){
const e=findEvo(id),u=META_UNLOCKS.find(x=>x.id==='e_'+id);
if(!e||!u||evoBought(id))return;
const cost=unlockCost(u);
if((META.souls|0)<cost)return;
META.souls-=cost;META.unlocked[u.id]=1;META.evoSeen[id]=1;
saveMeta();sfx.reward();buildMetaShop();buildCodex();
}
function buildCodex(){
const bases={};
for(const e of EVOS)(bases[e.base]=bases[e.base]||[]).push(e);
const seen=EVOS.filter(e=>evoSeen(e.id)).length,bought=EVOS.filter(e=>evoBought(e.id)).length;
const offN=EVOS.filter(e=>evoOff(e.id)).length,shrine=state==='menu';
$('codexCount').innerHTML='ИЗУЧЕНО '+seen+' / '+EVOS.length+' · ЗАПИСЕЙ '+bought+' / '+EVOS.length+
(offN?' · <span style="color:#ff9d9d">НЕАКТИВНО '+offN+'</span>':'')+
(shrine?' · <span style="color:#bfe6ff">'+(META.souls|0)+' 👻</span>':'');
let h='';
if(shrine){
const pool=evoRollPool(),done=!pool.length,aff=(META.souls|0)>=EVO_ROLL_COST;
h+='<div class="evoTools"><div><div class="en">🎲 СЛУЧАЙНАЯ ЗАПИСЬ</div>'
+'<div class="ed">'+(done?'Все записи уже открыты.':'Открыть одну из '+pool.length+' записей за половину обычной цены.')
+(lastEvoRoll?'<br><span style="color:#ffb0f0">'+lastEvoRoll+'</span>':'')+'</div></div>'
+'<button class="evoAct" id="btnEvoRoll"'+(done||!aff?' disabled':'')+'>'+(done?'ГОТОВО':EVO_ROLL_COST+' 👻')+'</button></div>';
}
for(const b in bases){
const kn=bases[b].filter(e=>evoSeen(e.id)).length;
h+='<div class="evoBase">'+WEAPONS[b].icon+' '+WEAPONS[b].name.toUpperCase()+
' <span class="dim">'+kn+'/'+bases[b].length+'</span></div>';
for(const e of bases[b]){
/* НОВОЕ: неизученные пробуждения скрыты */
if(!evoSeen(e.id)){
const u=META_UNLOCKS.find(x=>x.id==='e_'+e.id),cost=unlockCost(u),aff=(META.souls|0)>=cost;
h+='<div class="evoRow lock">'
+'<div class="ei">'+evoIconLocked(e.base,34)+'</div>'
+'<div style="flex:1">'
+'<div class="en">'+WEAPONS[b].name+' → ???'
+(e.rar==='legend'?' ★':(e.rar==='secret'?' · СЕКРЕТ':''))+'</div>'
+'<div class="eh" style="color:#8a7a4a">УСЛОВИЕ: неизвестно</div>'
+'<div class="ed">Запись ещё не открыта. Выполни условие пробуждения в бою — или открой её за души.</div>'
+'</div>'+(shrine?'<div class="evoActions"><button class="evoAct" data-buy-evo="'+e.id+'"'+(aff?'':' disabled')+'>ОТКРЫТЬ · '+cost+' 👻</button></div>':'')+'</div>';
continue;
}
const rc=e.rar==='legend'?' legend':(e.rar==='secret'?' secret':'');
const u=META_UNLOCKS.find(x=>x.id==='e_'+e.id),boughtNow=evoBought(e.id),cost=unlockCost(u),aff=(META.souls|0)>=cost,off=evoOff(e.id);
h+='<div class="evoRow'+rc+'">'
+'<div class="ei">'+evoIcon(e,34)+'</div>'
+'<div style="flex:1">'
+'<div class="en" style="color:'+e.col+'">'+WEAPONS[b].name+' → '+e.name
+(e.rar==='legend'?' ★':(e.rar==='secret'?' · СЕКРЕТ':''))
+(boughtNow?' <span style="color:#a8d08d;font-size:9px">· ЗАПИСЬ ОТКРЫТА</span>':'')
+(off?' <span style="color:#ff9d9d;font-size:9px">· НЕАКТИВНО</span>':' <span style="color:#a8d08d;font-size:9px">· АКТИВНО</span>')+'</div>'
+'<div class="eh">УСЛОВИЕ: '+e.how+'</div>'
+'<div class="ed">'+e.desc+'</div>'
+'<div class="ea">УМЕНИЕ: '+e.abil+'</div>'
+'</div>'+(shrine?'<div class="evoActions">'
+(!boughtNow?'<button class="evoAct" data-buy-evo="'+e.id+'"'+(aff?'':' disabled')+'>ОТКРЫТЬ ЗАПИСЬ · '+cost+' 👻</button>':'')
+'<button class="evoAct'+(off?' off':'')+'" data-toggle-evo="'+e.id+'">'+(off?'НЕАКТИВНО':'АКТИВНО')+'</button>'
+'</div>':'')+'</div>';
}
}
$('codexList').innerHTML=h;
$('btnEvoRoll')?.addEventListener('click',rollEvoUnlock);
document.querySelectorAll('#codexList [data-buy-evo]').forEach(btn=>btn.onclick=()=>buyEvoRecord(btn.dataset.buyEvo));
document.querySelectorAll('#codexList [data-toggle-evo]').forEach(btn=>btn.onclick=()=>{
toggleEvoOff(btn.dataset.toggleEvo);sfx.reward();buildCodex();
});
}
function openCodex(){codexOpen=true;buildCodex();$('codexOv').classList.remove('hidden');}
function closeCodex(){codexOpen=false;$('codexOv').classList.add('hidden');}
let merchantOpen=false;
function openMerchant(){
if(state!=='menu')return;
merchantOpen=true;buildMetaShop();$('metaGrid').scrollTop=0;$('merchantOv').classList.remove('hidden');
}
function closeMerchant(){merchantOpen=false;$('merchantOv').classList.add('hidden');}
let helpOpen=false;
function openHelp(){helpOpen=true;$('helpBody').scrollTop=0;$('helpOv').classList.remove('hidden');}
function closeHelp(){helpOpen=false;$('helpOv').classList.add('hidden');}
let secondaryMenuOpen=false;
function setSecondaryMenu(open){
secondaryMenuOpen=!!open;
const start=$('startOv'),panel=$('secondaryMenu'),button=$('btnSecondaryMenu');
if(start)start.classList.toggle('secondary-open',secondaryMenuOpen);
if(panel)panel.setAttribute('aria-hidden',String(matchMedia('(max-width:900px) and (max-height:500px)').matches&&!secondaryMenuOpen));
if(button)button.setAttribute('aria-expanded',String(secondaryMenuOpen));
}

/* ПРЕДНАЧЕРТАНИЯ — шесть случайных целей текущего цикла святилища. */
function menuEsc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function prophecyOffers(){
try{return typeof getProphecyOffers==='function'?(getProphecyOffers()||[]):[];}catch(e){return [];}
}
function prophecySelected(){
try{return typeof getSelectedProphecyId==='function'?getSelectedProphecyId():null;}catch(e){return null;}
}
function prophecyDone(id){
try{return typeof isProphecyCompleted==='function'&&isProphecyCompleted(id);}catch(e){return false;}
}
function buildProphecyOffers(){
const host=$('prophecyCards');if(!host)return;
const offers=prophecyOffers().slice(0,6),selected=prophecySelected();
if(!offers.length){
host.innerHTML=Array.from({length:6},(_,i)=>`<div class="prophecyCard locked" aria-disabled="true"><div class="prophecySigil">${i===0?'◇':'✧'}</div><div class="prophecyCopy"><div class="prophecyName">НЕЯСНОЕ ЗНАМЕНИЕ</div><div class="prophecyDesc">Святилище ещё не открыло эту судьбу.</div></div></div>`).join('');
return;
}
host.innerHTML=offers.map((p,i)=>{
const id=p.id,done=prophecyDone(id),active=String(selected)===String(id),locked=p.locked===true||p.available===false;
const progress=p.progressText||(p.progress&&p.progress.current!=null?p.progress.current+' / '+p.progress.target:'');
return `<button type="button" class="prophecyCard${active?' active':''}${done?' complete':''}${locked?' locked':''}" data-prophecy="${menuEsc(id)}" role="radio" aria-checked="${active}"${locked?' disabled aria-disabled="true"':''}>
<span class="prophecySigil">${menuEsc(locked?'🔒':(p.icon||p.sigil||['✦','♜','☽','⚔','♢','✧'][i]))}</span>
<span class="prophecyCopy"><span class="prophecyName">${menuEsc(p.name||p.title||'НЕИЗВЕСТНАЯ СУДЬБА')}</span><span class="prophecyDesc">${menuEsc(p.desc||p.description||p.condition||'Условие скрыто туманом.')}</span>${progress?`<span class="prophecyProgress">${menuEsc(progress)}</span>`:''}</span>
<span class="prophecyState">${active?'ВЫБРАНО':(done?'ПРОЙДЕНО'+(p.completionCount?' ×'+p.completionCount:''):'ВЫБРАТЬ')}</span></button>`;
}).join('');
host.querySelectorAll('[data-prophecy]').forEach(card=>card.onclick=()=>{
if(card.disabled||typeof selectProphecy!=='function')return;
selectProphecy(card.dataset.prophecy);try{sfx.reward();}catch(e){}buildProphecyOffers();
});
}

/* СКИНЧИКИ — два независимых слота: облик героя и облик оружия. */
const SHRINE_BASE_SKINS=[
{id:'basic',slot:'hero',icon:'◈',name:'СТРАННИК',tag:'ГЕРОЙ · БАЗОВЫЙ',desc:'Знакомый облик воина, прошедшего первые залы.'},
{id:'prophecy_knight',slot:'hero',icon:'♜',name:'РЫЦАРЬ ПРЕДНАЧЕРТАНИЯ',tag:'ГЕРОЙ · НАГРАДА',desc:'Детализированная реликтовая броня из случайного пула наград.',condition:'Случайная награда'}
];
function shrineSkins(){
let rewards=[];try{rewards=typeof getSkinRewards==='function'?(getSkinRewards()||[]):[];}catch(e){}
return SHRINE_BASE_SKINS.concat(rewards.map(s=>Object.assign({},s,{condition:'Случайная награда'})));
}
let skinsOpen=false;
function skinUnlocked(id){
if(id==='basic')return true;
try{return typeof isSkinUnlocked==='function'&&isSkinUnlocked(id);}catch(e){return false;}
}
function selectedSkin(slot){
try{return typeof getSelectedSkinId==='function'?getSelectedSkinId(slot):(slot==='weapon'?'':'basic');}catch(e){return slot==='weapon'?'':'basic';}
}
function buildSkins(){
const host=$('skinsGrid');if(!host)return;const heroCurrent=selectedSkin('hero'),weaponCurrent=selectedSkin('weapon'),all=shrineSkins();
const group=(slot,title,lead)=>`<section class="skinShelf skinShelf-${slot}"><div class="skinShelfHead"><h3>${title}</h3><span>${lead}</span></div><div class="skinShelfGrid">${all.filter(s=>s.slot===slot).map(s=>{const unlocked=skinUnlocked(s.id),active=(slot==='hero'?heroCurrent:weaponCurrent)===s.id;
return `<button type="button" class="skinCard skin-${menuEsc(s.id)}${active?' active':''}${unlocked?'':' locked'}" data-skin="${menuEsc(s.id)}"${unlocked?'':' disabled'} aria-pressed="${active}">
<span class="skinPortrait ${menuEsc(s.id)}"><span class="skinGlow"></span>${s.id==='prophecy_knight'?'<img class="skinRaster" alt="Рыцарь Предначертания">':`<span class="skinHelm">${menuEsc(s.icon||'◈')}</span>`}</span>
<span class="skinInfo"><span class="skinTag">${unlocked?menuEsc(s.tag):'🔒 ЗАКРЫТО'}</span><span class="skinName">${menuEsc(s.name)}</span><span class="skinDesc">${menuEsc(s.desc)}</span>${s.condition?`<span class="skinCondition">ПРЕДНАЧЕРТАНИЕ · ${menuEsc(s.condition)}</span>`:''}<span class="skinAction">${unlocked?(active?(slot==='weapon'?'ВКЛЮЧЁН · НАЖМИ, ЧТОБЫ СНЯТЬ':'ВКЛЮЧЁН'):'ДОСТУПЕН · ВКЛЮЧИТЬ'):'ИСПОЛНИ ПРЕДНАЧЕРТАНИЕ'}</span></span></button>`;
}).join('')}</div></section>`;
host.innerHTML=group('hero','ОБЛИК ГЕРОЯ','один активный облик')+group('weapon','ОБЛИК ОРУЖИЯ','одна активная реликвия');
const raster=host.querySelector('.skinRaster');if(raster&&typeof PROPHECY_KNIGHT_IMG!=='undefined')raster.src=PROPHECY_KNIGHT_IMG.src;
host.querySelectorAll('[data-skin]').forEach(card=>card.onclick=()=>{
if(card.disabled||typeof selectSkin!=='function')return;
selectSkin(card.dataset.skin);try{sfx.reward();}catch(e){}buildSkins();
});
}
function openSkins(){if(state!=='menu')return;skinsOpen=true;buildSkins();$('skinsOv').classList.remove('hidden');$('skinsOv').setAttribute('aria-hidden','false');}
function closeSkins(){skinsOpen=false;$('skinsOv').classList.add('hidden');$('skinsOv').setAttribute('aria-hidden','true');}
function bindSkinMenu(){
const open=$('btnSkins'),close=$('btnSkinsClose'),ov=$('skinsOv');
if(open)open.onclick=openSkins;if(close)close.onclick=closeSkins;
if(ov)ov.onpointerdown=e=>{if(e.target===ov)closeSkins();};
}
addEventListener('keydown',e=>{if(skinsOpen&&e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();closeSkins();}},true);
function buildMenu(){
buildModeTabs();
$('diffCards').innerHTML=
`<div class="card${menuDiff==='easy'?' picked':''}" data-d="easy">
<div class="icon">🌤</div><div class="cname">ЛЁГКИЙ</div>
<div class="cdesc">Обычные враги — с 1 удара, боссы — с 5 ударов. Враги наносят вдвое меньше урона.</div></div>
<div class="card${menuDiff==='hard'?' picked':''}" data-d="hard">
<div class="icon">💀</div><div class="cname">СЛОЖНЫЙ</div>
<div class="cdesc">Классический режим: угроза растёт от зала к залу до ×1.9. Проверь себя.</div></div>`;
document.querySelectorAll('#diffCards .card').forEach(c=>c.onclick=()=>{menuDiff=c.dataset.d;buildMenu();});
$('startWpnCards').innerHTML=Object.keys(WEAPONS).map(k=>{const w=WEAPONS[k],un=wpnUnlocked(k);
if(!un&&menuWpn===k)menuWpn='sword';
return `<div class="card sm${menuWpn===k?' picked':''}${un?'':' dis'}" data-w="${k}">
<div class="icon">${un?w.icon:'🔒'}</div><div class="cname">${w.name}</div>
<div class="tag t-${w.cat}">${un?CATNAME[w.cat]:'ЗАКРЫТО'}</div></div>`;}).join('');
document.querySelectorAll('#startWpnCards .card').forEach(c=>c.onclick=()=>{
if(!wpnUnlocked(c.dataset.w))return;menuWpn=c.dataset.w;buildMenu();});
buildProphecyOffers();
const evoBases=menuWpn==='archmage'?['fire','ice','bolt']:[menuWpn];
const startEvos=EVOS.filter(e=>evoBases.includes(e.base)&&evoBought(e.id)&&!evoOff(e.id));
const showStartEvos=menuDiff==='easy'&&startEvos.length>0;
$('startEvoSection').style.display=showStartEvos?'':'none';
if(showStartEvos){
if(!startEvos.some(e=>e.id===menuEvo))menuEvo=startEvos[0].id;
$('startEvoCards').innerHTML=startEvos.map(e=>`<div class="card sm${menuEvo===e.id?' picked':''}" data-e="${e.id}">
<div class="icon">${evoIcon(e,34)}</div><div class="cname">${e.name}</div>
<div class="tag t-upg">ПРОБУЖДЕНИЕ</div></div>`).join('');
document.querySelectorAll('#startEvoCards .card').forEach(c=>c.onclick=()=>{menuEvo=c.dataset.e;buildMenu();});
}else $('startEvoCards').innerHTML='';
buildAsc();
buildMetaShop();
buildRollTabs(); /* НОВОЕ: настройка кувырка */
buildPauseKey();
buildPlayerName();
bindSkinMenu();
updHint();
}
