
'use strict';
/* Видимое окно остаётся 960×540, а игровой мир расширен в 1.5 раза по ширине и на треть по высоте. */
const VW=960,VH=540,W=1440,H=720,GROUND=648,GRAV=2300,JUMP=910,DJ_CD=2;
const CAM={x:(W-VW)/2,y:H-VH};
const ROLL_T=.3,ROLL_CD=.9,ROLL_INV=.26;
const ARMOR_ROLL_T=.52,ARMOR_ROLL_INV=.58;
const DPR=Math.min(window.devicePixelRatio||1,2);
const cvs=document.getElementById('game'),ctx=cvs.getContext('2d');
cvs.width=VW*DPR;cvs.height=VH*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);
const $=id=>document.getElementById(id);
/* ===== ГЕНЕРАТОР СЛУЧАЙНОСТИ (сидируемый — для ежедневного забега) ===== */
let RNGs=null;
function seedRng(s){RNGs=(s>>>0)||1;}
function unseedRng(){RNGs=null;}
function rand(){
if(RNGs===null)return Math.random();
RNGs=(RNGs+0x6D2B79F5)|0;
let t=RNGs;
t=Math.imul(t^(t>>>15),t|1);
t^=t+Math.imul(t^(t>>>7),t|61);
return ((t^(t>>>14))>>>0)/4294967296;
}
function hashStr(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h>>>0;}
function todayKey(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
const clamp=(v,a,b)=>v<a?a:v>b?b:v,rnd=(a,b)=>a+rand()*(b-a);
const pick=a=>a[Math.floor(rand()*a.length)];
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
