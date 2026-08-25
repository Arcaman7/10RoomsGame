/* ================= ТЕМАТИЧЕСКИЕ БОЕВЫЕ FX СКИНОВ ================= */
const SKIN_COMBAT_WEAPON_IDS=new Set(['oathblade','moon_katana','verdant_bow','astral_staff']);
const SKIN_COMBAT_HERO_IDS=new Set(['astral_mage','dusk_ranger']);
const SKIN_COMBAT_PALETTES={
oathblade:['#fff4c2','#e9bc52','#8b5a22'],moon_katana:['#f5fbff','#82cfff','#7664c9'],
verdant_bow:['#efffc2','#72d978','#28754c'],astral_staff:['#ffffff','#9ac8ff','#8d63e8'],
astral_mage:['#fff6d8','#79ddff','#b47cff'],dusk_ranger:['#ffd6a1','#b86cff','#362657']
};
function skinCombatWeaponSlot(w){
if(w==='sword')return 'sword';if(w==='katana')return 'katana';if(w==='bow')return 'bow';
return WEAPONS[w]&&WEAPONS[w].cat==='magic'?'magic':'';
}
function skinCombatSelected(slot){
let id='';
if(typeof getSelectedSkinId==='function'){try{id=getSelectedSkinId(slot)||'';}catch(e){id='';}}
if(!id&&typeof META!=='undefined'&&META.skinLoadout){
if(slot==='hero')id=META.skinLoadout.hero||'';
else id=(META.skinLoadout.weapon&&META.skinLoadout.weapon[slot])||'';
}
return id;
}
function skinCombatFx(event,data={}){
if(typeof fxList==='undefined'||!data)return;
const weapon=data.weapon||(typeof player!=='undefined'?player.weapon:''),slot=skinCombatWeaponSlot(weapon);
let weaponSkin=slot?skinCombatSelected(slot):'';
if(!SKIN_COMBAT_WEAPON_IDS.has(weaponSkin)&&slot)weaponSkin=skinCombatSelected('weapon');
const heroSkin=skinCombatSelected('hero'),skins=[];
if(SKIN_COMBAT_WEAPON_IDS.has(weaponSkin))skins.push(weaponSkin);
if(SKIN_COMBAT_HERO_IDS.has(heroSkin)&&heroSkin!==weaponSkin)skins.push(heroSkin);
if(!skins.length)return;
for(const skin of skins){
const hit=data.phase==='hit',life=event==='alt'?.64:(event==='roll'?.42:(event==='parry'?(hit?.56:.34):(data.finisher?.48:.3)));
fxList.push({type:'skinCombat',skin,event,x:data.x,y:data.y,ang:data.ang||0,dir:data.dir||1,
phase:data.phase||'',finisher:!!data.finisher,evolved:!!data.evolved,seed:rand()*6.283,life,max:life});
const pal=SKIN_COMBAT_PALETTES[skin],count=event==='alt'?6:(hit?6:4),spd=event==='roll'?135:(event==='parry'?175:145);
spawnParts(count,data.x,data.y,pal[1],spd,life*.75,'spark',event==='roll'?90:35);
}
}
function skinCombatRune(ctx,x,y,r,rot,col,a,points=6){
ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.strokeStyle=col;ctx.globalAlpha*=a;ctx.lineWidth=1.5;
ctx.beginPath();for(let i=0;i<points;i++){const an=i*6.283/points-Math.PI/2,px=Math.cos(an)*r,py=Math.sin(an)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.stroke();
ctx.beginPath();ctx.arc(0,0,r*.52,0,7);ctx.stroke();ctx.restore();
}
function skinCombatLeaf(ctx,x,y,ang,s,col,a){
ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.fillStyle=col;ctx.globalAlpha*=a;ctx.beginPath();ctx.moveTo(-s,0);ctx.quadraticCurveTo(0,-s*.7,s,0);ctx.quadraticCurveTo(0,s*.7,-s,0);ctx.fill();ctx.strokeStyle='#eaffcf';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-s*.65,0);ctx.lineTo(s*.7,0);ctx.stroke();ctx.restore();
}
function skinCombatArrow(ctx,x,y,ang,len,col,a){
ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.globalAlpha*=a;ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-len*.55,0);ctx.lineTo(len*.45,0);ctx.stroke();ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(len*.55,0);ctx.lineTo(len*.3,-5);ctx.lineTo(len*.34,0);ctx.lineTo(len*.3,5);ctx.closePath();ctx.fill();ctx.restore();
}
function drawOathbladeCombatFx(f,a,q){
const d=f.dir||1,burst=f.event==='alt'||f.finisher,R=burst?112:76;
ctx.translate(f.x,f.y);ctx.rotate(f.ang||0);
if(f.event==='roll'){
ctx.rotate(-(f.ang||0));for(let k=0;k<5;k++){const x=-d*(12+k*24+q*30),al=a*(1-k*.14);skinCombatRune(ctx,x,Math.sin(k*1.7)*8,12-k,Math.PI/4+k*.2,'#e9bc52',al,4);}
}else if(f.event==='parry'){
ctx.rotate(-(f.ang||0));const r=22+q*(f.phase==='hit'?88:34);ctx.strokeStyle=`rgba(255,231,153,${a})`;ctx.lineWidth=f.phase==='hit'?6:3;ctx.beginPath();ctx.arc(0,0,r,-2.45,-.7);ctx.stroke();
skinCombatRune(ctx,0,0,r*.68,q*2,'#fff4c2',a,8);for(let k=-2;k<=2;k++){ctx.beginPath();ctx.moveTo(k*r*.18,-r*.52);ctx.lineTo(k*r*.1,r*.52);ctx.stroke();}
}else{
ctx.strokeStyle=`rgba(233,188,82,${a})`;ctx.lineWidth=burst?10:6;ctx.beginPath();ctx.arc(0,0,R+q*35,-.78,.78);ctx.stroke();ctx.strokeStyle=`rgba(255,248,210,${a*.9})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,R+8+q*42,-.9,.9);ctx.stroke();
for(let k=-2;k<=2;k++)skinCombatRune(ctx,34+k*24,k*7,8+burst*2,q*4+k,'#fff4c2',a*(.85-Math.abs(k)*.08),4);
if(burst){ctx.rotate(-(f.ang||0));skinCombatRune(ctx,d*74,0,42,q*1.5,'#e9bc52',a,8);ctx.font='bold 18px Georgia';ctx.textAlign='center';ctx.fillStyle=`rgba(255,244,194,${a})`;ctx.fillText('I',d*74,6);}
}
}
function drawMoonKatanaCombatFx(f,a,q){
ctx.translate(f.x,f.y);ctx.rotate(f.ang||0);const R=f.event==='alt'?150:(f.finisher?115:82);
if(f.event==='roll'){
ctx.rotate(-(f.ang||0));for(let k=0;k<5;k++){const x=-(f.dir||1)*(15+k*22),r=10+k*2;ctx.fillStyle=`rgba(130,207,255,${a*(.5-k*.07)})`;ctx.beginPath();ctx.arc(x,Math.sin(k)*6,r,-1.5,1.5);ctx.arc(x-5,Math.sin(k)*6,r*.85,1.5,-1.5,true);ctx.fill();}
}else if(f.event==='parry'){
ctx.rotate(-(f.ang||0));const r=20+q*(f.phase==='hit'?82:38);ctx.strokeStyle=`rgba(130,207,255,${a})`;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.stroke();ctx.strokeStyle=`rgba(245,251,255,${a*.9})`;for(let k=0;k<6;k++){const an=k*1.047+q;ctx.beginPath();ctx.moveTo(Math.cos(an)*r*.35,Math.sin(an)*r*.35);ctx.lineTo(Math.cos(an)*r,Math.sin(an)*r);ctx.stroke();}
}else{
for(let k=0;k<(f.event==='alt'?3:2);k++){ctx.strokeStyle=k===1?`rgba(245,251,255,${a})`:`rgba(130,207,255,${a*(.8-k*.15)})`;ctx.lineWidth=7-k*2;ctx.beginPath();ctx.arc(q*28,k*5,R+k*14+q*35,-.72,.72);ctx.stroke();}
for(let k=-2;k<=2;k++){const x=R*.55+k*17,y=k*11;ctx.save();ctx.translate(x,y);ctx.rotate(q*5+k);ctx.fillStyle=`rgba(190,221,255,${a*(.8-Math.abs(k)*.08)})`;ctx.fillRect(-1,-7,2,14);ctx.fillRect(-7,-1,14,2);ctx.restore();}
}
}
function drawVerdantBowCombatFx(f,a,q){
ctx.translate(f.x,f.y);ctx.rotate(f.ang||0);const long=f.event==='alt'?205:125;
if(f.event==='roll'){
ctx.rotate(-(f.ang||0));for(let k=0;k<7;k++)skinCombatLeaf(ctx,-(f.dir||1)*(10+k*18),Math.sin(k*1.8)*12,k*.8+q*4,7-k*.25,k%2?'#72d978':'#efffc2',a*(.8-k*.08));
}else if(f.event==='parry'){
ctx.rotate(-(f.ang||0));const r=22+q*(f.phase==='hit'?78:35);ctx.strokeStyle=`rgba(114,217,120,${a})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.stroke();for(let k=0;k<10;k++){const an=k*.628+q;skinCombatLeaf(ctx,Math.cos(an)*r,Math.sin(an)*r,an,8,'#efffc2',a);}
}else{
ctx.strokeStyle=`rgba(114,217,120,${a*.8})`;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(long*.25,-32,long*.58,30,long,0);ctx.stroke();
for(let k=1;k<=6;k++){const u=k/7,x=long*u,y=Math.sin(u*9)*13;skinCombatLeaf(ctx,x,y,u*5+q,7,k%2?'#efffc2':'#72d978',a*(.95-u*.25));}
for(let k=-1;k<=1;k++)skinCombatArrow(ctx,18,0,k*(f.event==='alt'?.14:.06),62,k?'#72d978':'#efffc2',a);
if(f.event==='alt'){ctx.rotate(-(f.ang||0));skinCombatRune(ctx,long*.62,-45,38,-q*2,'#72d978',a,6);}
}
}
function drawAstralStaffCombatFx(f,a,q){
ctx.translate(f.x,f.y);ctx.rotate(f.ang||0);const long=f.event==='alt'?215:145;
if(f.event==='roll'){
ctx.rotate(-(f.ang||0));ctx.strokeStyle=`rgba(121,221,255,${a*.65})`;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-(f.dir||1)*60,-38,-(f.dir||1)*135,8);ctx.stroke();for(let k=0;k<7;k++){ctx.fillStyle=k%2?'#ffffff':'#9ac8ff';ctx.globalAlpha=a*(1-k*.09);ctx.beginPath();ctx.arc(-(f.dir||1)*(18+k*18),Math.sin(k*2)*12,2+k%3,0,7);ctx.fill();}
}else if(f.event==='parry'){
ctx.rotate(-(f.ang||0));const r=20+q*(f.phase==='hit'?92:42);for(let k=0;k<2;k++)skinCombatRune(ctx,0,0,r-k*11,q*(k? -3:2),'#9ac8ff',a*(1-k*.18),k?6:8);ctx.strokeStyle=`rgba(255,255,255,${a})`;ctx.beginPath();ctx.moveTo(-r*.7,0);ctx.lineTo(r*.7,0);ctx.moveTo(0,-r*.7);ctx.lineTo(0,r*.7);ctx.stroke();
}else{
ctx.strokeStyle=`rgba(154,200,255,${a*.85})`;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,0);for(let k=1;k<=7;k++)ctx.lineTo(long*k/7,(k%2?1:-1)*(5+k));ctx.stroke();
for(let k=1;k<=6;k++){const x=long*k/7,y=(k%2?1:-1)*(5+k);ctx.fillStyle=k%2?'#ffffff':'#b99cff';ctx.globalAlpha=a;ctx.beginPath();ctx.arc(x,y,3+(k%3),0,7);ctx.fill();if(k>1){ctx.strokeStyle=`rgba(185,156,255,${a*.45})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(long*(k-1)/7,((k-1)%2?1:-1)*(4+k));ctx.stroke();}}
ctx.rotate(-(f.ang||0));skinCombatRune(ctx,long*.58,0,f.event==='alt'?50:24,q*3,'#8d63e8',a,f.event==='alt'?8:6);
}
}
function drawAstralMageCombatFx(f,a,q){
ctx.translate(f.x,f.y);ctx.rotate(f.event==='base'||f.event==='alt'?(f.ang||0):0);const r=f.event==='alt'?74:(f.event==='parry'?(f.phase==='hit'?45+q*65:34):28+q*28);
if(f.event==='roll'){
ctx.strokeStyle=`rgba(121,221,255,${a*.65})`;ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-(f.dir||1)*55,-50,-(f.dir||1)*145,5);ctx.stroke();for(let k=0;k<9;k++){ctx.fillStyle=k%3?'#79ddff':'#fff6d8';ctx.beginPath();ctx.arc(-(f.dir||1)*(10+k*16),-8+Math.sin(k*2.1)*17,2+k%3,0,7);ctx.fill();}
}else{
for(let k=0;k<3;k++)skinCombatRune(ctx,0,0,r+k*13,(k%2? -1:1)*(q*2+k*.4),k===1?'#79ddff':'#b47cff',a*(.9-k*.16),k===2?8:6);
ctx.strokeStyle=`rgba(255,246,216,${a})`;ctx.lineWidth=1.5;for(let k=0;k<6;k++){const an=k*1.047+f.seed,rr=r+k%2*14;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(an)*rr,Math.sin(an)*rr);ctx.stroke();ctx.fillStyle='#fff6d8';ctx.beginPath();ctx.arc(Math.cos(an)*rr,Math.sin(an)*rr,2.5,0,7);ctx.fill();}
}
}
function drawDuskRangerCombatFx(f,a,q){
ctx.translate(f.x,f.y);ctx.rotate(f.event==='base'||f.event==='alt'?(f.ang||0):0);const d=f.dir||1;
if(f.event==='roll'){
ctx.fillStyle=`rgba(54,38,87,${a*.75})`;ctx.beginPath();ctx.moveTo(0,-20);ctx.quadraticCurveTo(-d*75,-55,-d*155,0);ctx.quadraticCurveTo(-d*70,38,0,20);ctx.fill();for(let k=0;k<8;k++)skinCombatLeaf(ctx,-d*(14+k*19),Math.sin(k*2.3)*16,d>0?Math.PI:k*.4,8,'#b86cff',a*(.75-k*.07));
}else if(f.event==='parry'){
const r=20+q*(f.phase==='hit'?85:38);ctx.fillStyle=`rgba(31,20,53,${a*.85})`;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();ctx.strokeStyle=`rgba(255,214,161,${a})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(-r*.2,0,r,-1.25,1.25);ctx.stroke();for(let k=0;k<6;k++)skinCombatArrow(ctx,Math.cos(k*1.047)*r,Math.sin(k*1.047)*r,k*1.047+Math.PI,26,'#b86cff',a);
}else{
const n=f.event==='alt'?5:3;for(let k=0;k<n;k++){const off=(k-(n-1)/2)*.13;skinCombatArrow(ctx,25,off*120,off,90+k*8,k%2?'#b86cff':'#ffd6a1',a);}
ctx.strokeStyle=`rgba(184,108,255,${a*.55})`;ctx.lineWidth=f.event==='alt'?12:7;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(70,-32,145+q*55,0);ctx.stroke();
}
}
function drawSkinCombatFx(f){
if(!f||f.type!=='skinCombat'||!SKIN_COMBAT_PALETTES[f.skin])return false;
const a=clamp(f.life/f.max,0,1),q=1-a;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(1,a*1.35);ctx.lineCap='round';ctx.lineJoin='round';
if(f.skin==='oathblade')drawOathbladeCombatFx(f,a,q);
else if(f.skin==='moon_katana')drawMoonKatanaCombatFx(f,a,q);
else if(f.skin==='verdant_bow')drawVerdantBowCombatFx(f,a,q);
else if(f.skin==='astral_staff')drawAstralStaffCombatFx(f,a,q);
else if(f.skin==='astral_mage')drawAstralMageCombatFx(f,a,q);
else if(f.skin==='dusk_ranger')drawDuskRangerCombatFx(f,a,q);
ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.restore();return true;
}
