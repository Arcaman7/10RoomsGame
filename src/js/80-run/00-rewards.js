/* ================= НАГРАДЫ ================= */
let wpnOffers=[],buffOffers=[],rerollCost=12,rerollsUsed=0;
const LATE_DARS=[
{id:'soul',icon:'👻',name:'СГУСТОК ДУШ',desc:'+60 душ'},
{id:'mend',icon:'✚',name:'ЖИВАЯ ИСКРА',desc:'восстановление 40% максимального HP'},
{id:'guard',icon:'◈',name:'ПЕЧАТЬ ЗАЩИТЫ',desc:'поглощает следующий полученный удар'},
{id:'cleanse',icon:'☀',name:'ОЧИЩЕНИЕ',desc:'снимает случайное проклятие; если проклятий нет — +40 душ'}
];
function lateDar(){return {kind:'late',id:pick(LATE_DARS).id};}
function lateDef(id){return LATE_DARS.find(x=>x.id===id)||LATE_DARS[0];}
function buffsNeeded(){
let n=(extraReward&&!endless)?2:1;
return n;
}
function buffCardCount(){
let n=3+(extraReward?1:0)+unlockLv('p_luck')-(ascOn(3)?1:0);
return clamp(n,2,7);
}
function freeSlot(k){return wpnMods(k).length<wpnSlots(k);}
function randMod(k){
const av=MODKEYS.filter(m=>!hasMod(k,m));
return av.length?pick(av):null;
}
function synHint(id){
for(const s of SYN){
if(s.need.indexOf(id)<0)continue;
if(s.need.every(n=>buffs[n]>0))continue;
if(s.need.every(n=>n===id||buffs[n]>0))return s;
}
return null;
}
function rollWpnOffers(){
const cur=player.weapon,offers=[];
if(wpnLv(cur)<MAXLV){
const a=wStat(cur),lvNext=wpnLv(cur)+1;
const save={},sl=wLv[cur];wLv[cur]=lvNext;const b=wStat(cur);wLv[cur]=sl;
offers.push({kind:'lvl',ref:cur,lv:lvNext,from:a,to:b});
}
const m=freeSlot(cur)?randMod(cur):null;
if(m)offers.push({kind:'mod',ref:cur,mod:m});
const pool=shuffle(Object.keys(WEAPONS).filter(k=>k!==cur&&wpnUnlocked(k)));
const nw=pool[0];
if(nw)offers.push({kind:'new',ref:nw,lv:Math.max(1,bestLv()-1)});
shuffle(offers);
wpnOffers=offers.slice(0,3);
}
function rareChance(){return Math.min(.34,(.08+.022*room)*(challengeRoom?1.6:1));}
function legendChance(){return Math.min(.11,(.015+.008*room)*(challengeRoom?1.6:1));}
function rollBuffOffers(){
const n=buffCardCount();
/* В Бездне обычный постоянный дар выдаётся через глубину; элита всегда даёт дар. */
const lateOnly=((endless&&room>ABYSS_START+1)||(!endless&&room>ACT1_LEN&&room<RUN_LEN))&&!challengeRoom&&room%2===0;
if(lateOnly){buffOffers=Array.from({length:n},()=>lateDar());return;}
/* ФИКС: если все баффы уже на максимуме, пул пустел и карта дара приходила без id —
   окно награды падало на отрисовке и экран замирал. Теперь есть подстраховка. */
let bp=shuffle(BUFFS.filter(b=>buffs[b.id]<8).map(b=>b.id));
const freeR=RARE.filter(r=>!rareOn(r.id));
const freeL=LEGEND.filter(r=>!rareOn(r.id));
const out=[];
for(let i=0;i<n;i++){
const r=rand();
if(freeL.length&&r<legendChance()){
const c=pick(freeL);out.push({kind:'legend',id:c.id});
freeL.splice(freeL.indexOf(c),1);continue;
}
if(freeR.length&&r<legendChance()+rareChance()){
const c=pick(freeR);out.push({kind:'rare',id:c.id});
freeR.splice(freeR.indexOf(c),1);continue;
}
if(bp.length)out.push({kind:'buff',id:bp[i%bp.length]});
else out.push(lateDar());
}
const freeC=CURSES.filter(c=>!hasCurse(c.id));
if(freeC.length&&rand()<(room>=2?.42:.25)&&out.length>1){
const slot=Math.floor(rand()*out.length);
if(out[slot].kind==='buff')out[slot]={kind:'curse',id:pick(freeC).id};
}
buffOffers=shuffle(out);
}
function wpnCardHtml(o,i){
if(o.kind==='keep'){
const w=WEAPONS[player.weapon],st=wStat(player.weapon);
return `<div class="card" data-i="keep">
<div class="icon">${w.icon}</div><div class="cname">${w.name}</div>
<div class="tag t-keep">ОСТАВИТЬ КАК ЕСТЬ</div>
<div class="cdesc">Ур. ${wpnLv(player.weapon)} · ${wpnMods(player.weapon).map(m=>WMODS[m].icon).join(' ')||'без модов'}</div>
<div class="cstats">${player.weapon==='thornarmor'?'шипы '+st.dmg+' · ЛКМ нет · ПКМ-перекат':'урон '+st.dmg+' · темп '+st.cd+'с'}</div></div>`;
}
if(o.kind==='lvl'){
const w=WEAPONS[o.ref];
return `<div class="card upg" data-i="${i}">
<div class="icon">⬆${w.icon}</div><div class="cname">${w.name} · УР.${o.lv}</div>
<div class="tag t-upg">УРОВЕНЬ ОРУЖИЯ</div>
<div class="cdesc">Оружие растёт вместе с тобой: +45% базового урона и −10% кд.${LVPERK[o.lv]?'<br><b style="color:#ffd23f">'+LVPERK[o.lv]+'</b>':''}</div>
<div class="cstats">урон ${o.from.dmg} → <b style="color:#aef2b0">${o.to.dmg}</b> · кд ${o.from.cd} → <b style="color:#aef2b0">${o.to.cd}</b></div></div>`;
}
if(o.kind==='mod'){
const M=WMODS[o.mod],w=WEAPONS[o.ref];
return `<div class="card upg" data-i="${i}">
<div class="icon">${M.icon}</div><div class="cname">${M.name}</div>
<div class="tag t-mod">МОДИФИКАТОР</div>
<div class="cdesc">${M.desc}</div>
<div class="cstats">в слот: ${w.name} (${wpnMods(o.ref).length+1}/${wpnSlots(o.ref)})</div></div>`;
}
const w=WEAPONS[o.ref];const sl=wLv[o.ref];wLv[o.ref]=o.lv;const st=wStat(o.ref);if(sl===undefined)delete wLv[o.ref];else wLv[o.ref]=sl;
return `<div class="card" data-i="${i}">
<div class="icon">${w.icon}</div><div class="cname">${w.name}</div>
<div class="tag t-${w.cat}">${CATNAME[w.cat]}</div>
<div class="cdesc">${w.desc}</div>
<div class="cstats">приходит ур.${o.lv} · ${o.ref==='thornarmor'?'шипы '+st.dmg+' · ЛКМ нет':'урон '+st.dmg+' · темп '+st.cd+'с'}</div></div>`;
}
function buffCardHtml(o,i){
if(o.kind==='late'){const q=lateDef(o.id);return `<div class="card" data-i="${i}">
<div class="icon">${q.icon}</div><div class="cname">${q.name}</div>
<div class="tag t-keep">ПОЗДНИЙ ДАР</div>
<div class="cdesc">${q.desc}. Не увеличивает постоянные характеристики.</div></div>`;}
if(o.kind==='rare'||o.kind==='legend'){
const src=o.kind==='rare'?RARE:LEGEND;
const r=src.find(x=>x.id===o.id);
const cls=o.kind==='rare'?'rare':'legend';
return `<div class="card ${cls}" data-i="${i}">
<div class="icon">${r.icon}</div><div class="cname">${r.name}</div>
<div class="tag t-${cls}">${o.kind==='rare'?'РЕДКИЙ ДАР':'★ ЛЕГЕНДА ★'}</div>
<div class="cdesc">${r.desc}</div></div>`;
}
if(o.kind==='curse'){
const c=CURSES.find(x=>x.id===o.id);
return `<div class="card curse" data-i="${i}">
<div class="icon">${c.icon}</div><div class="cname">${c.name}</div>
<div class="tag t-curse">ПРОКЛЯТЫЙ ДАР</div>
<div class="cdesc"><span class="good">${c.good}</span><br><span class="bad">${c.bad}</span></div></div>`;
}
const b=BUFFS.find(x=>x.id===o.id),sh=synHint(o.id);
return `<div class="card" data-i="${i}">
<div class="icon">${b.icon}</div><div class="cname">${b.name}</div>
<div class="tag t-buff">УРОВЕНЬ ${buffs[b.id]} → ${buffs[b.id]+1}</div>
<div class="cdesc">${b.desc}${sh?`<br><b style="color:#ffb0f0">→ синергия «${sh.name}»</b>`:''}</div></div>`;
}
function renderReward(){
$('wpnCards').innerHTML=wpnOffers.map((o,i)=>wpnCardHtml(o,i)).join('')+wpnCardHtml({kind:'keep'},-1);
$('buffCards').innerHTML=buffOffers.map((o,i)=>buffCardHtml(o,i)).join('');
const need=buffsNeeded();
$('buffLabel').textContent=need>1?'— ДВА ДАРА (награда за элитный зал) —':'— ДАР —';
document.querySelectorAll('#wpnCards .card').forEach(c=>c.onclick=()=>{
document.querySelectorAll('#wpnCards .card').forEach(x=>x.classList.remove('picked'));
c.classList.add('picked');pickedWpn=c.dataset.i;sfx.reward();
});
const mq=masteryQueue[0];
$('mastSection').style.display=mq?'':'none';
if(mq){
$('mastCards').innerHTML=mq.options.map((o,i)=>
`<div class="card mast" data-m="${i}">
<div class="icon">${o.icon}</div><div class="cname">${o.name}</div>
<div class="tag t-mast">${CATNAME[mq.cat]}</div>
<div class="cdesc">${o.desc}</div>
<div class="cstats">бесплатно · не тратит выбор дара</div></div>`).join('');
document.querySelectorAll('#mastCards .card').forEach(c=>c.onclick=()=>{
const o=mq.options[+c.dataset.m];
mastery[o.id]=1;masteryQueue.shift();
sfx.reward();calcStats();buffChips();renderReward();
});
}
document.querySelectorAll('#buffCards .card').forEach(c=>c.onclick=()=>{
const id=c.dataset.i,k=pickedBuffs.indexOf(id);
if(k>=0){pickedBuffs.splice(k,1);c.classList.remove('picked');}
else{
if(pickedBuffs.length>=need){
const drop=pickedBuffs.shift();
const el=document.querySelector('#buffCards .card[data-i="'+drop+'"]');
if(el)el.classList.remove('picked');
}
pickedBuffs.push(id);c.classList.add('picked');sfx.reward();
}
});
const freeRr=hasCurse('brittle')||(rerollsUsed<unlockLv('p_thrift'));
const cost=freeRr?0:rerollCost;
$('rrCost').textContent=ascOn(2)?'закрыто Тьмой':(freeRr?'бесплатно':cost+' 👻');
$('btnReroll').disabled=ascOn(2)||(!freeRr&&souls<cost);
$('rwNote').innerHTML='👻 душ: <b style="color:#bfe6ff">'+souls+'</b> · ♥ '+player.hp+'/'+S.maxHp+
' · оружие: '+WEAPONS[player.weapon].name+' ур.'+wpnLv(player.weapon)+
' ['+ (wpnMods(player.weapon).map(m=>WMODS[m].icon).join(' ')||'—') +' '+wpnMods(player.weapon).length+'/'+wpnSlots(player.weapon)+']';
}
function openReward(){
state='reward';
pickedWpn=null;pickedBuffs=[];rerollCost=12;rerollsUsed=0;
$('rwKicker').textContent='ЗАЛ '+room+(challengeRoom?' (ЭЛИТНЫЙ)':'')+' ЗАЧИЩЕН';
rollWpnOffers();rollBuffOffers();
renderReward();
$('rewardOv').classList.remove('hidden');
}
function doReroll(){
if(ascOn(2))return;
const freeRr=hasCurse('brittle')||(rerollsUsed<unlockLv('p_thrift'));
const cost=freeRr?0:rerollCost;
if(!freeRr&&souls<cost)return;
souls-=cost;rerollsUsed++;
if(!freeRr)rerollCost+=8;
pickedWpn=null;pickedBuffs=[];
rollWpnOffers();rollBuffOffers();renderReward();sfx.reward();
}
function applyWpnPick(){
if(pickedWpn===null||pickedWpn==='keep')return;
const o=wpnOffers[+pickedWpn];if(!o)return;
if(o.kind==='lvl')wLv[o.ref]=o.lv;
else if(o.kind==='mod')wpnMods(o.ref).push(o.mod);
else if(o.kind==='new'){
if(!wLv[o.ref]||wLv[o.ref]<o.lv)wLv[o.ref]=o.lv;
player.weapon=o.ref;
}
}
function applyBuffPick(id){
const o=buffOffers[+id];if(!o)return;
if(o.kind==='late'){
if(o.id==='soul')souls+=60;
else if(o.id==='mend')player.hp=Math.min(S.maxHp,player.hp+Math.max(1,Math.ceil(S.maxHp*.4)));
else if(o.id==='guard')abyssGuard=Math.min(3,abyssGuard+1);
else if(o.id==='cleanse'){if(curses.length)curses.splice(Math.floor(rand()*curses.length),1);else souls+=40;}
}
else if(o.kind==='curse'){if(!hasCurse(o.id))curses.push(o.id);}
else if(o.kind==='rare'||o.kind==='legend'){if(!rareOn(o.id))relics.push(o.id);}
else buffs[o.id]=Math.min(8,buffs[o.id]+1);
}
function confirmReward(skip){
if(state!=='reward')return;
if(!skip){
applyWpnPick();
for(const b of pickedBuffs)applyBuffPick(b);
}else{souls+=15;}
calcStats();
extraReward=false;
$('rewardOv').classList.add('hidden');
buffChips();
openMap();
}
