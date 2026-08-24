/* Общая таблица рекордов. Публичный ключ Supabase предназначен для браузера;
   service_role и другие секреты здесь хранить нельзя. */
const GAME_VERSION=Number('{{VERSION_NUMBER}}');
const PUBLIC_LEADERBOARD={
url:'https://vwcfsummyzoesvxsnnlo.supabase.co',
anonKey:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Y2ZzdW1teXpvZXN2eHNubmxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1OTQ4MTEsImV4cCI6MjEwMzE3MDgxMX0.61Fs_MaS7heZiVG5fxp8-Rc5LBnxp2QHJH9G_6pFjos',
table:'ten_rooms_records',
submitRpc:'submit_ten_rooms_record'
};
let leaderboardOpen=false,leaderboardLoading=false,leaderboardRunSubmittedFloor=0;
function leaderboardConfigured(){return !!(PUBLIC_LEADERBOARD.url&&PUBLIC_LEADERBOARD.anonKey);}
function leaderboardHeaders(){return {apikey:PUBLIC_LEADERBOARD.anonKey,Authorization:'Bearer '+PUBLIC_LEADERBOARD.anonKey};}
function leaderboardDate(value){
const d=new Date(value);if(Number.isNaN(d.getTime()))return '—';
return d.toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'});
}
function renderLeaderboardRows(rows){
const body=$('leaderboardBody');if(!body)return;
body.textContent='';
if(!rows.length){
const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=4;td.className='leaderboardEmpty';td.textContent='Рекордов пока нет';tr.appendChild(td);body.appendChild(tr);return;
}
for(const row of rows){
const tr=document.createElement('tr');
for(const value of [row.nickname,'v'+row.game_version,leaderboardDate(row.achieved_at),row.floor]){
const td=document.createElement('td');td.textContent=String(value);tr.appendChild(td);
}
body.appendChild(tr);
}
}
async function loadPublicLeaderboard(){
if(leaderboardLoading)return;
const status=$('leaderboardStatus');
if(!leaderboardConfigured()){
renderLeaderboardRows([]);status.textContent='Общая таблица будет доступна после подключения сервера.';return;
}
leaderboardLoading=true;status.textContent='ЗАГРУЖАЕМ РЕКОРДЫ…';
try{
const base=PUBLIC_LEADERBOARD.url.replace(/\/$/,'');
const query='select=nickname,game_version,achieved_at,floor&order=floor.desc,achieved_at.asc&limit=100';
const res=await fetch(base+'/rest/v1/'+PUBLIC_LEADERBOARD.table+'?'+query,{headers:leaderboardHeaders()});
if(!res.ok)throw new Error('HTTP '+res.status);
const rows=await res.json();renderLeaderboardRows(Array.isArray(rows)?rows:[]);status.textContent='';
}catch(e){renderLeaderboardRows([]);status.textContent='Не удалось загрузить рекорды. Попробуй ещё раз.';}
finally{leaderboardLoading=false;}
}
function openLeaderboard(){leaderboardOpen=true;$('leaderboardOv').classList.remove('hidden');loadPublicLeaderboard();}
function closeLeaderboard(){leaderboardOpen=false;$('leaderboardOv').classList.add('hidden');}
async function submitPublicRecord(floor){
if(difficulty!=='hard')return;
floor=Math.max(1,Math.floor(Number(floor)||1));
if(!leaderboardConfigured()||floor<=leaderboardRunSubmittedFloor)return;
const nickname=String(META.playerName||'').trim().slice(0,20);if(!nickname)return;
leaderboardRunSubmittedFloor=floor;
try{
const base=PUBLIC_LEADERBOARD.url.replace(/\/$/,'');
const headers=leaderboardHeaders();headers['Content-Type']='application/json';
const res=await fetch(base+'/rest/v1/rpc/'+PUBLIC_LEADERBOARD.submitRpc,{method:'POST',headers,body:JSON.stringify({p_nickname:nickname,p_game_version:GAME_VERSION,p_floor:floor})});
if(!res.ok)throw new Error('HTTP '+res.status);
}catch(e){leaderboardRunSubmittedFloor=0;}
}
