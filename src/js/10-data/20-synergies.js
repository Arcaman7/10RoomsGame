/* ================= СИНЕРГИИ БАФФОВ ================= */
const SYN=[
{id:'rot',   name:'ГНИЛЬ',        icon:'🧪',need:['poison','bleed'], desc:'Яд и кровь сливаются: урон DoT растёт со временем (до ×3)'},
{id:'fchain',name:'МЁРЗЛАЯ ЦЕПЬ', icon:'🌩',need:['frost','shock'],  desc:'Разряд перескакивает между скованными врагами'},
{id:'reflect',name:'ОТРАЖЕНИЕ',   icon:'🪞',need:['thorns','armor'], desc:'Поглощённый бронёй урон возвращается атакующему целиком'},
{id:'exec',  name:'ПАЛАЧ',        icon:'🪓',need:['crit','str'],     desc:'Криты бьют втройне вместо вдвойне'},
{id:'undying',name:'НЕЖИТЬ',      icon:'🧟',need:['vamp','regen'],   desc:'Регенерация вдвое быстрее, вампиризм лечит на 2 ♥'},
{id:'phantom',name:'ФАНТОМ',      icon:'👤',need:['spd','dodge'],    desc:'Уклонение обнуляет кд рывка и даёт 0.5 с неуязвимости'},
{id:'inferno',name:'ИНФЕРНО',     icon:'🌋',need:['berserk','haste'],desc:'Ниже половины HP: +35% темпа атаки поверх всего'},
{id:'overload',name:'ПЕРЕГРУЗКА', icon:'🌩',need:['fire','shock'],   desc:'Разряд по горящему врагу вызывает взрыв стихий'}
];
function synOn(id){const s=SYN.find(x=>x.id===id);return !!(s&&s.need.every(n=>buffs[n]>0));}
function synLv(id){const s=SYN.find(x=>x.id===id);if(!s)return 0;
let mn=99;for(const n of s.need)mn=Math.min(mn,buffs[n]);return mn===99?0:mn;}
function activeSyns(){return SYN.filter(s=>s.need.every(n=>buffs[n]>0));}
