/* ================= КОМНАТЫ-СОБЫТИЯ ================= */
let siteOffers=[];
function priceMul(){return ascOn(9)?1.6:1;}
function P(v){return Math.round(v*priceMul());}
function siteTitleFor(t){
return {forge:['КУЗНИЦА','ЗВОН МОЛОТА'],shop:['ТОРГОВЕЦ','ЛАВКА В ТЕНИ'],
altar:['АЛТАРЬ','СДЕЛКА С ТЬМОЙ'],treasure:['СОКРОВИЩНИЦА','ЗАБЫТЫЙ ТАЙНИК']}[t];
}
function buildForge(){
const k=player.weapon,out=[];
if(wpnLv(k)<MAXLV){
const from=wStat(k);const sl=wLv[k];wLv[k]=wpnLv(k)+1;const to=wStat(k);if(sl===undefined)delete wLv[k];else wLv[k]=sl;
out.push({icon:'⬆'+WEAPONS[k].icon,name:'КОВКА · УР.'+(wpnLv(k)+1),tag:'УРОВЕНЬ',cls:'t-upg',
desc:'+45% базового урона и −10% кд.'+(LVPERK[wpnLv(k)+1]?' <b style="color:#ffd23f">'+LVPERK[wpnLv(k)+1]+'</b>':''),
stat:'урон '+from.dmg+' → '+to.dmg+' · кд '+from.cd+' → '+to.cd,
cost:P(40+22*wpnLv(k)),act(){wLv[k]=wpnLv(k)+1;}});
}
const m1=freeSlot(k)?randMod(k):null;
if(m1)out.push({icon:WMODS[m1].icon,name:WMODS[m1].name,tag:'МОДИФИКАТОР',cls:'t-mod',
desc:WMODS[m1].desc,stat:'слот '+(wpnMods(k).length+1)+'/'+wpnSlots(k),cost:P(70),act(){wpnMods(k).push(m1);}});
const m2=freeSlot(k)?randMod(k):null;
if(m2&&m2!==m1)out.push({icon:WMODS[m2].icon,name:WMODS[m2].name,tag:'МОДИФИКАТОР',cls:'t-mod',
desc:WMODS[m2].desc,stat:'слот '+(wpnMods(k).length+1)+'/'+wpnSlots(k),cost:P(70),act(){wpnMods(k).push(m2);}});
if(wpnMods(k).length)out.push({icon:'♻',name:'ПЕРЕПЛАВКА',tag:'СНЯТЬ МОДЫ',cls:'t-keep',
desc:'Убрать все модификаторы с оружия и вернуть часть душ.',stat:'+'+(30*wpnMods(k).length)+' 👻',cost:0,
act(){souls+=30*wpnMods(k).length;wMods[k]=[];}});
return out;
}
function buildShop(){
const k=player.weapon;
const all=[];
const b1=pick(BUFFS).id,b2=pick(BUFFS).id;
all.push({icon:BUFFS.find(b=>b.id===b1).icon,name:BUFFS.find(b=>b.id===b1).name,tag:'БАФФ',cls:'t-buff',
desc:BUFFS.find(b=>b.id===b1).desc,stat:'ур. '+buffs[b1]+' → '+(buffs[b1]+1),cost:P(55),act(){buffs[b1]++;}});
all.push({icon:BUFFS.find(b=>b.id===b2).icon,name:BUFFS.find(b=>b.id===b2).name,tag:'БАФФ',cls:'t-buff',
desc:BUFFS.find(b=>b.id===b2).desc,stat:'ур. '+buffs[b2]+' → '+(buffs[b2]+1),cost:P(55),act(){buffs[b2]++;}});
const m=freeSlot(k)?randMod(k):null;
if(m)all.push({icon:WMODS[m].icon,name:WMODS[m].name,tag:'МОДИФИКАТОР',cls:'t-mod',
desc:WMODS[m].desc,stat:'в '+WEAPONS[k].name,cost:P(80),act(){wpnMods(k).push(m);}});
if(wpnLv(k)<MAXLV)all.push({icon:'⬆'+WEAPONS[k].icon,name:'КОВКА УР.'+(wpnLv(k)+1),tag:'УРОВЕНЬ',cls:'t-upg',
desc:'Уровень текущему оружию прямо в лавке.',stat:'урон +35%, кд −10%',cost:P(75),act(){wLv[k]=wpnLv(k)+1;}});
all.push({icon:'✚',name:'ЦЕЛЕБНЫЙ ОТВАР',tag:'ЛЕЧЕНИЕ',cls:'t-keep',
desc:'Полностью восстанавливает здоровье.',stat:'♥ до максимума',cost:P(50),act(){player.hp=S.maxHp;}});
all.push({icon:'❤️',name:'КАМЕНЬ ЖИЗНИ',tag:'МАКСИМУМ HP',cls:'t-keep',
desc:'+1 к максимуму здоровья навсегда.',stat:'♥ макс +1',cost:P(90),act(){buffs.vit++;player.hp++;}});
return shuffle(all).slice(0,4);
}
function buildAltar(){
const freeC=CURSES.filter(c=>!hasCurse(c.id));
const k=player.weapon;
const gifts=[
{icon:'⚒',name:'ДАР КУЗНЕЦА',desc:'+2 уровня текущему оружию',stat:'ур. '+wpnLv(k)+' → '+Math.min(MAXLV,wpnLv(k)+2),
act(){wLv[k]=Math.min(MAXLV,wpnLv(k)+2);}},
{icon:'✨',name:'ДАР СИЛЫ',desc:'Два случайных баффа сразу',stat:'+1 к двум баффам',
act(){buffs[pick(BUFFS).id]++;buffs[pick(BUFFS).id]++;}},
{icon:'❤️',name:'ДАР ПЛОТИ',desc:'+2 к максимуму HP и полное лечение',stat:'♥ макс +2',
act(){buffs.vit+=2;calcStats();player.hp=S.maxHp;}},
{icon:'👻',name:'ДАР ЖАДНОСТИ',desc:'Щедрая горсть душ',stat:'+150 👻',act(){souls+=150;}},
{icon:'🔩',name:'ДАР МАСТЕРА',desc:'Модификатор в свободный слот',stat:'случайный мод',
act(){const m=freeSlot(k)?randMod(k):null;if(m)wpnMods(k).push(m);else souls+=80;}}
];
return shuffle(gifts).slice(0,3).map((g,i)=>{
const c=freeC.length?freeC[i%freeC.length]:null;
return {icon:g.icon,name:g.name,tag:'СДЕЛКА',cls:'t-curse',curse:c,
desc:'<span class="good">'+g.desc+'</span><br><span class="bad">проклятие: '+(c?c.name+' — '+c.bad:'нет свободных, сделка чистая')+'</span>',
stat:g.stat,cost:0,act(){g.act();if(c&&!hasCurse(c.id))curses.push(c.id);}};
});
}
function buildTreasure(){
const k=player.weapon;
const gold=Math.round(rnd(70,120));
const out=[
{icon:'👻',name:'ГОРСТЬ ДУШ',tag:'ВАЛЮТА',cls:'t-site',desc:'Забрать всё звонкое, что лежит в тайнике.',
stat:'+'+gold+' 👻',cost:0,act(){souls+=gold;}},
{icon:'✚',name:'ЦЕЛЕБНЫЙ РОДНИК',tag:'ЛЕЧЕНИЕ',cls:'t-site',desc:'Полное лечение и +1 к максимуму HP.',
stat:'♥ макс +1',cost:0,act(){buffs.vit++;calcStats();player.hp=S.maxHp;}}
];
const m=freeSlot(k)?randMod(k):null;
if(m)out.push({icon:WMODS[m].icon,name:WMODS[m].name,tag:'НАХОДКА',cls:'t-mod',desc:WMODS[m].desc,
stat:'в '+WEAPONS[k].name+' бесплатно',cost:0,act(){wpnMods(k).push(m);}});
else if(wpnLv(k)<MAXLV)out.push({icon:'⬆'+WEAPONS[k].icon,name:'ТОЧИЛЬНЫЙ КАМЕНЬ',tag:'УРОВЕНЬ',cls:'t-upg',
desc:'Бесплатный уровень оружию.',stat:'ур. '+wpnLv(k)+' → '+(wpnLv(k)+1),cost:0,act(){wLv[k]=wpnLv(k)+1;}});
return out;
}
function openSite(t){
state='site';
const [kick,tit]=siteTitleFor(t);
$('siteKicker').textContent=kick;$('siteTitle').textContent=tit;
siteOffers = t==='forge'?buildForge():t==='shop'?buildShop():t==='altar'?buildAltar():buildTreasure();
const once=(t==='altar'||t==='treasure');
$('siteNote').innerHTML='👻 душ: <b style="color:#bfe6ff">'+souls+'</b>'+
(once?' · выбрать можно только одно':' · можно взять всё, на что хватит душ');
renderSite(t,once);
$('siteOv').classList.remove('hidden');
}
function renderSite(t,once){
$('siteCards').innerHTML=siteOffers.map((o,i)=>{
const aff=souls>=o.cost;
return `<div class="card${o.cls==='t-curse'?' curse':''}${o.done?' dis':(aff?'':' dis')}" data-i="${i}">
<div class="icon">${o.icon}</div><div class="cname">${o.name}</div>
<div class="tag ${o.cls}">${o.tag}</div>
<div class="cdesc">${o.desc}</div>
<div class="cstats">${o.stat}</div>
<div class="price${aff?'':' no'}">${o.done?'✔ ВЗЯТО':(o.cost?o.cost+' 👻':'БЕСПЛАТНО')}</div></div>`;}).join('');
document.querySelectorAll('#siteCards .card').forEach(c=>c.onclick=()=>{
const o=siteOffers[+c.dataset.i];
if(!o||o.done||souls<o.cost)return;
souls-=o.cost;o.act();o.done=true;calcStats();buffChips();sfx.reward();
if(once)siteOffers.forEach(x=>{if(x!==o)x.done=true;});
$('siteNote').innerHTML='👻 душ: <b style="color:#bfe6ff">'+souls+'</b>'+(once?' · сделка заключена':'');
renderSite(t,once);
});
}
function leaveSite(){
if(state!=='site')return;
$('siteOv').classList.add('hidden');
pendingSite=null;
enterNextRoom(false);
}
