/* ================= ПЕРЕХОД В ЗАЛ ================= */
let switching=false;
function enterNextRoom(elite){
if(switching)return;switching=true;setTimeout(()=>switching=false,450);
challengeRoom=!!elite;
clearT=0;overT=0;hitStop=0;roomVac=false;
calcStats();
const heal=betweenRoomHeal();
player.hp=Math.min(S.maxHp,player.hp+heal);
$('rewardOv').classList.add('hidden');$('mapOv').classList.add('hidden');$('siteOv').classList.add('hidden');
room++;loadRoom(room);
state='playing';
/* Не ждём периодического тика: Архимаг пробуждается прямо при входе в четвёртый зал. */
if(player.weapon==='archmage'&&room===4)checkEvo();
buffChips();
}
