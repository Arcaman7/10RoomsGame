/* ================= КАРТА ПОХОДА ================= */
let nodeOffers=[];
function drawMapTrack(){
const from=endless?Math.max(1,room-6):(room<ACT1_LEN?1:ACT1_LEN+1),to=endless?room+2:(room<ACT1_LEN?ACT1_LEN:RUN_LEN);
let h='';
for(let i=from;i<=to;i++){
if(i>from)h+='<div class="mlink"></div>';
const ic=pathHistory[i-1]||'';
const cls=i<=room?'done':(i===room+1?'cur':'');
h+=`<div class="mnode ${cls}" title="зал ${i}">${ic||(i===RUN_LEN&&!endless?'👑':(i===ACT1_LEN&&!endless?'🎟':'·'))}</div>`;
}
$('mapTrack').innerHTML=h;
}
function betweenRoomHeal(){
let n=(room>=15&&room<19)?1:2;
return Math.max(0,n-(ascOn(5)?1:0))*(hasCurse('rage')?0:1);
}
function rollNodes(){
const last=room>=RUN_LEN-1&&!endless;
let pool=['battle','elite','treasure','forge','shop','altar'];
if(room<2)pool=['battle','elite','forge','treasure'];
pool=shuffle(pool);
const out=[];
out.push(rand()<.5?'battle':'elite');
for(const t of pool){if(out.length>=3)break;if(out.indexOf(t)<0)out.push(t);}
nodeOffers=shuffle(out);
}
function openMap(){
if(room===ACT1_LEN&&!endless&&!act2GatePassedRun){showActPass();return;}
if(room>=RUN_LEN&&!endless){showWin();return;}
state='map';
rollNodes();
$('mapKicker').textContent=endless?'БЕЗДНА · ГЛУБИНА '+(room+1):'ПУТЬ ВГЛУБЬ · ЗАЛ '+(room+1)+' / '+RUN_LEN;
drawMapTrack();
const heal=betweenRoomHeal();
$('mapNote').innerHTML='👻 душ: <b style="color:#bfe6ff">'+souls+'</b> · перед залом '+(heal?'восстановится +'+heal+' ♥':'<span class="bad">лечения не будет</span>');
$('pathCards').innerHTML=nodeOffers.map(t=>{const n=NODES[t];
return `<div class="card" data-n="${t}">
<div class="icon">${n.icon}</div><div class="cname">${n.name}</div>
<div class="tag ${n.cls}">${n.tag}</div>
<div class="cdesc">${n.desc}</div>
<div class="cstats">${n.stat}</div></div>`;}).join('');
document.querySelectorAll('#pathCards .card').forEach(c=>c.onclick=()=>{chooseNode(c.dataset.n);});
$('mapOv').classList.remove('hidden');
}
function chooseNode(t){
if(state!=='map'||switching)return;
sfx.reward();
pathHistory[room]=NODES[t].icon;
$('mapOv').classList.add('hidden');
if(t==='battle'||t==='elite'){enterNextRoom(t==='elite');return;}
pendingSite=t;openSite(t);
}
