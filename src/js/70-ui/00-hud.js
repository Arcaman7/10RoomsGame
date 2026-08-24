/* ================= HUD ================= */
function buffChips(){
const bh=BUFFS.filter(b=>buffs[b.id]>0).map(b=>`<span class="chip">${b.icon} ${b.name} <b>${buffs[b.id]}</b></span>`).join('');
const ah=abyssGuard>0?`<span class="chip relic" title="Поглощает следующий удар">◈ ПЕЧАТЬ ×${abyssGuard}</span>`:'';
const sh=activeSyns().map(sy=>`<span class="chip syn" title="${sy.desc}">${sy.icon} ${sy.name}</span>`).join('');
const ch=curses.map(id=>{const c=CURSES.find(x=>x.id===id);
return `<span class="chip curse" title="${c.good} / ${c.bad}">${c.icon} ${c.name}</span>`;}).join('');
const rh=relics.map(id=>{
const L=LEGEND.find(x=>x.id===id);
const r=L||RARE.find(x=>x.id===id);
if(!r)return '';
return `<span class="chip ${L?'leg':'relic'}" title="${r.desc}">${r.icon} ${r.name}</span>`;}).join('');
const mh=Object.keys(mastery).map(id=>{
for(const c in MASTERY){const f=MASTERY[c].find(x=>x.id===id);
if(f)return `<span class="chip mast" title="${f.desc}">${f.icon} ${f.name}</span>`;}
return '';}).join('');
$('buffRow').innerHTML=ah+rh+mh+sh+ch+bh;
}
function syncHud(){
if(TOUCH){const t=$('touch');const vis=(state==='playing');if(t)t.style.visibility=vis?'visible':'hidden';}
document.body.classList.toggle('gpaused',!!paused);
if(player.hp!==hudHp){
hudHp=player.hp;
let html='';
for(let i=0;i<S.maxHp;i++){
if(player.hp>=i+1)html+='<span class="heart">♥</span>';
else if(player.hp>=i+0.5)html+='<span class="heart half">♥</span>';
else html+='<span class="heart off">♥</span>';
}
$('hearts').innerHTML=html;
$('hearts').classList.remove('pop');void $('hearts').offsetWidth;$('hearts').classList.add('pop');
}
if(kills!==hudKills){hudKills=kills;$('killsLbl').textContent='УБИЙСТВ: '+kills;}
if(room!==hudRoom||difficulty!==hudDiff||challengeRoom!==hudChal){hudRoom=room;hudDiff=difficulty;hudChal=challengeRoom;
$('roomLbl').innerHTML=(endless?'БЕЗДНА · ГЛУБИНА '+room:'КОМНАТА '+room+'/'+RUN_LEN)+' · '+(difficulty==='easy'?'ЛЁГКИЙ':'СЛОЖНЫЙ')+
' <span style="color:#ff9d7a">· HP ×'+fmtMul(RS.hp)+' · УРОН ×'+fmtMul(RS.dmg)+'</span>'+
(endless?'<br><span style="color:#c9a0ff;font-size:10px">СТЕНЫ ×'+fmtMul(RS.wallHp)+' · АБИЛКИ М/Б ×'+fmtMul(RS.mobAbilityDmg)+'/'+fmtMul(RS.bossAbilityDmg)+' · ДЕБАФЫ ×'+fmtMul(RS.debuffPower)+'</span>':'')+
(challengeRoom?' <span style="color:#ff5d6b">· ЭЛИТНЫЙ</span>':'')+
(ascLevel>0?' <span style="color:#ff9d7a">· ТЬМА '+ascLevel+'</span>':'')+
(mode==='daily'?' <span style="color:#ffd23f">· ☀ ДЕНЬ</span>':'');}
const wk=player.weapon,wsig=wk+'|'+wpnLv(wk)+'|'+wpnMods(wk).join(',')+'|'+(evoActive[wk]||'');
if(wsig!==hudWpn){hudWpn=wsig;
const st=wStat(wk);
$('wpnChip').textContent=WEAPONS[wk].icon+' '+WEAPONS[wk].name+' · УР.'+wpnLv(wk)+' · '+st.dmg+(wk==='thornarmor'?'🌵':'⚔');
/* ЭВОЛЮЦИИ: чип пробуждённого оружия */
const EV=evoActive[wk]?findEvo(evoActive[wk]):null;
if(EV){$('wpnChip').innerHTML=evoIcon(EV,16)+' '+EV.name+' · ПРОБУЖДЕНИЕ';
$('wpnChip').style.borderColor=EV.col;$('wpnChip').style.color=EV.col;}
else{$('wpnChip').style.borderColor='';$('wpnChip').style.color='';}
const md=wpnMods(wk),sl=wpnSlots(wk);
let mh='';
for(let i=0;i<sl;i++)mh+=md[i]?`<span class="mchip">${WMODS[md[i]].icon} ${WMODS[md[i]].name}</span>`:'<span class="mchip empty">◇ слот</span>';
$('modRow').innerHTML=mh;
}
if(souls!==hudSouls){hudSouls=souls;$('soulNum').textContent=souls;}
{
const cat=WEAPONS[player.weapon].cat;
const owned=(MASTERY[cat]||[]).filter(x=>hasM(x.id)).length;
const sig=cat+owned+'|'+masteryKills[cat];
if(sig!==hudMods){
hudMods=sig;
if(owned>=3)$('mastBar').innerHTML='<span style="color:#c9a0ff">★ мастер</span>';
else{
const need=MASTERY_STEPS[owned],prev=owned?MASTERY_STEPS[owned-1]:0;
const pr=clamp((masteryKills[cat]-prev)/(need-prev),0,1);
$('mastBar').innerHTML='мастерство <span class="mt"><span class="mf" style="width:'+(pr*100)+'%;display:block"></span></span> '+masteryKills[cat]+'/'+need;
}
}
}
const cb=$('comboBar');
if(player.comboT>0&&player.comboShow>0&&state==='playing'){
cb.style.display='block';
$('comboNum').textContent='×'+player.comboShow+(player.comboShow===3?' ⚡':'');
$('comboFill').style.width=clamp(player.comboT/COMBO_WIN,0,1)*100+'%';
}else if(cb.style.display!=='none')cb.style.display='none';
if(bossRef)$('bossfill').style.width=(clamp(bossRef.hp/bossRef.maxHp,0,1)*100)+'%';
}
function banner(t,sub){
const b=$('waveBanner');
b.innerHTML=t+(sub?`<span class="bsub">${sub}</span>`:'');
b.classList.remove('show');void b.offsetWidth;b.classList.add('show');
}
