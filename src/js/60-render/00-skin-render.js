/* ================= ПРОЦЕДУРНЫЕ СКИНЫ ПРЕДНАЧЕРТАНИЙ ================= */
const DETAILED_HERO_SKINS=new Set(['astral_mage','dusk_ranger']);
const DETAILED_WEAPON_SKINS=new Set(['oathblade','moon_katana','verdant_bow','astral_staff']);

function detailedSkinWeaponSlot(p){
 const w=p&&p.weapon;
 if(w==='sword')return 'sword';
 if(w==='katana')return 'katana';
 if(w==='bow')return 'bow';
 if(w==='fire'||w==='summoner'||(typeof WEAPONS!=='undefined'&&WEAPONS[w]&&WEAPONS[w].cat==='magic'))return 'magic';
 return 'weapon';
}
function resolveDetailedWeaponSkinId(p){
 const slot=detailedSkinWeaponSlot(p);let id='';
 if(typeof getSelectedSkinId==='function'){
  try{id=getSelectedSkinId(slot)||'';}catch(_e){}
 }
 if(!id&&typeof META!=='undefined'&&META&&META.skinLoadout&&META.skinLoadout.weapon){
  const loadout=META.skinLoadout.weapon;
  id=typeof loadout==='string'?loadout:(loadout[slot]||'');
 }
 const skinSlot={oathblade:'sword',moon_katana:'katana',verdant_bow:'bow',astral_staff:'magic'}[id];
 return DETAILED_WEAPON_SKINS.has(id)&&skinSlot===slot?id:'';
}
function skinLine(x1,y1,x2,y2,w,col){
 ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
}
function skinJoint(x,y,r,col){ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();}
function skinGlow(x,y,r,col){
 ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,r);
 g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.restore();
}
function detailedHeroPose(p,pose){
 const run=pose.run,ph=pose.lt||0,air=!p.grounded,parry=p.parry>0,rolling=p.roll>0||p.armorRoll>0,dead=p.dead;
 let a1=-4,a2=0,b1=4,b2=0,armF={x:10,y:-25},armB={x:-9,y:-25},lean=0;
 if(run){const s=Math.sin(ph);a1=-4+s*7;a2=Math.min(0,-Math.cos(ph)*3);b1=4-s*7;b2=Math.min(0,Math.cos(ph)*3);armF={x:9-s*5,y:-25+s*3};armB={x:-8+s*5,y:-25-s*3};lean=s*.018;}
 if(air){a1=-6;a2=-5;b1=6;b2=-2;armF={x:11,y:-29};armB={x:-8,y:-20};lean=-.04;}
 if(parry){armF={x:12,y:-38};armB={x:7,y:-29};lean=-.07;}
 if(rolling){a1=-8;a2=-10;b1=8;b2=-8;armF={x:10,y:-14};armB={x:-10,y:-17};lean=.18;}
 if(dead){a1=-4;a2=-1;b1=5;b2=0;armF={x:9,y:-18};armB={x:-7,y:-12};lean=.12;}
 return {a1,a2,b1,b2,armF,armB,lean,bob:pose.bob||0,flow:pose.flow||0};
}
function drawAstralMage(p,pose){
 const q=detailedHeroPose(p,pose),b=q.bob,breath=Math.sin(time*2.1)*.7,roll=p.roll>0||p.armorRoll>0;
 ctx.save();ctx.translate(0,b);ctx.rotate(q.lean);
 // hovering split robe and star-lined mantle
 const hem=roll?-5:0,sw=Math.sin(time*3.2)*1.4-q.flow*.18;
 ctx.fillStyle='#11152f';ctx.beginPath();ctx.moveTo(-8,-31);ctx.quadraticCurveTo(-15,-16,-13+sw,-2+hem);ctx.lineTo(-2,-8);ctx.lineTo(0,-28);ctx.closePath();ctx.fill();
 ctx.fillStyle='#182455';ctx.beginPath();ctx.moveTo(0,-30);ctx.lineTo(13,-4+hem);ctx.lineTo(2+sw,-8);ctx.lineTo(-2,-27);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#739dff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-9,-17);ctx.quadraticCurveTo(0,-12,10,-16);ctx.stroke();
 for(const s of [[-7,-12],[1,-19],[7,-9],[-3,-5]]){skinGlow(s[0],s[1],3,'rgba(111,170,255,.35)');skinJoint(s[0],s[1],.8,'#dff6ff');}
 // articulated legs visible under robe
 skinLine(-3,-13,q.a1,q.a2,4.6,'#18203d');skinLine(3,-13,q.b1,q.b2,4.6,'#202954');
 skinLine(q.a1,q.a2,q.a1+5,q.a2,5,'#7668ba');skinLine(q.b1,q.b2,q.b1+5,q.b2,5,'#7668ba');
 // torso, luminous sash, layered shoulder mantle
 const tg=ctx.createLinearGradient(-9,-35,10,-16);tg.addColorStop(0,'#314d94');tg.addColorStop(.55,'#17244e');tg.addColorStop(1,'#0d1533');
 ctx.fillStyle=tg;ctx.beginPath();ctx.moveTo(-8,-35);ctx.lineTo(8,-34);ctx.lineTo(10,-17);ctx.lineTo(0,-13);ctx.lineTo(-10,-18);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#8ed7ff';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-8,-28);ctx.lineTo(8,-25);ctx.moveTo(-7,-22);ctx.lineTo(7,-19);ctx.stroke();
 ctx.fillStyle='#604ea2';ctx.beginPath();ctx.moveTo(-12,-34);ctx.lineTo(-5,-39);ctx.lineTo(0,-34);ctx.lineTo(6,-39);ctx.lineTo(13,-33);ctx.lineTo(8,-28);ctx.lineTo(-8,-29);ctx.closePath();ctx.fill();
 // arms change silhouette across idle/run/parry/roll
 skinLine(-6,-31,q.armB.x,q.armB.y,4.5,'#293d78');skinJoint(q.armB.x,q.armB.y,2.5,'#a8b9d8');
 skinLine(6,-31,q.armF.x,q.armF.y,4.8,'#35549b');skinJoint(q.armF.x,q.armF.y,2.7,'#bfd3ed');
 // hood and star-mask
 ctx.fillStyle='#101633';ctx.beginPath();ctx.arc(0,-42+breath*.12,9.5,0,7);ctx.fill();
 ctx.fillStyle='#3e55a0';ctx.beginPath();ctx.moveTo(-10,-42);ctx.quadraticCurveTo(-4,-58,2,-54);ctx.quadraticCurveTo(12,-50,10,-39);ctx.lineTo(5,-46);ctx.lineTo(-7,-45);ctx.closePath();ctx.fill();
 ctx.fillStyle='#071022';ctx.beginPath();ctx.ellipse(1,-43,6,5.5,0,0,7);ctx.fill();
 skinGlow(3,-44,8,'rgba(114,210,255,.28)');skinJoint(3,-44,1.5,'#d9fbff');
 ctx.fillStyle='#d3c46e';ctx.beginPath();ctx.moveTo(-2,-52);ctx.lineTo(0,-57);ctx.lineTo(2,-52);ctx.lineTo(0,-49);ctx.closePath();ctx.fill();
 // orbiting idle motes become compressed sparks during roll
 ctx.globalCompositeOperation='lighter';for(let i=0;i<3;i++){const a=time*(roll?7:1.4)+i*2.094,r=roll?12:15;ctx.fillStyle=`rgba(135,205,255,${.45+i*.12})`;ctx.beginPath();ctx.arc(Math.cos(a)*r,-29+Math.sin(a)*7,1.2,0,7);ctx.fill();}ctx.globalCompositeOperation='source-over';
 ctx.restore();return true;
}
function drawDuskRanger(p,pose){
 const q=detailedHeroPose(p,pose),b=q.bob,run=pose.run,roll=p.roll>0||p.armorRoll>0,tail=(pose.flow||0)+Math.sin(time*5)*1.5;
 ctx.save();ctx.translate(0,b);ctx.rotate(q.lean);
 // torn double cape gives a recognisable low, backward silhouette
 ctx.fillStyle='#24172f';ctx.beginPath();ctx.moveTo(-5,-35);ctx.quadraticCurveTo(-19-tail,-27,-18-tail,-8);ctx.lineTo(-9-tail*.4,-14);ctx.lineTo(-5-tail*.2,-5);ctx.lineTo(1,-29);ctx.closePath();ctx.fill();
 ctx.fillStyle='#482240';ctx.beginPath();ctx.moveTo(-4,-34);ctx.quadraticCurveTo(-13-tail,-22,-10-tail,-11);ctx.lineTo(-4,-15);ctx.closePath();ctx.fill();
 // legs and high boots
 skinLine(-3,-14,q.a1,q.a2,5,'#252a31');skinLine(3,-14,q.b1,q.b2,5,'#313843');
 skinLine(q.a1-1,q.a2-6,q.a1+4,q.a2,5.2,'#171a20');skinLine(q.b1-1,q.b2-6,q.b1+4,q.b2,5.2,'#171a20');
 ctx.fillStyle='#3c4850';ctx.fillRect(q.a1-3,q.a2-5,5,2);ctx.fillRect(q.b1-3,q.b2-5,5,2);
 // fitted cuirass with crossed straps
 const rg=ctx.createLinearGradient(-9,-36,9,-16);rg.addColorStop(0,'#526160');rg.addColorStop(.5,'#293b3e');rg.addColorStop(1,'#172629');
 ctx.fillStyle=rg;ctx.beginPath();ctx.moveTo(-8,-35);ctx.lineTo(8,-35);ctx.lineTo(10,-17);ctx.lineTo(0,-13);ctx.lineTo(-10,-18);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#a8754b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-6,-34);ctx.lineTo(7,-17);ctx.moveTo(6,-34);ctx.lineTo(-6,-20);ctx.stroke();
 ctx.fillStyle='#b9934f';ctx.fillRect(-2,-24,4,4);
 // asymmetrical pauldrons and posed arms
 ctx.fillStyle='#65726d';ctx.beginPath();ctx.moveTo(-11,-35);ctx.lineTo(-5,-40);ctx.lineTo(0,-35);ctx.lineTo(-6,-31);ctx.closePath();ctx.fill();
 ctx.fillStyle='#344c46';ctx.beginPath();ctx.moveTo(5,-37);ctx.lineTo(13,-34);ctx.lineTo(8,-29);ctx.closePath();ctx.fill();
 skinLine(-6,-32,q.armB.x,q.armB.y,4.6,'#313c3c');skinJoint(q.armB.x,q.armB.y,2.5,'#95745c');
 skinLine(6,-32,q.armF.x,q.armF.y,4.6,'#3e504b');skinJoint(q.armF.x,q.armF.y,2.5,'#a88368');
 // cowl, beaked half-mask, violet eye slit
 ctx.fillStyle='#17151f';ctx.beginPath();ctx.arc(0,-42,9,0,7);ctx.fill();
 ctx.fillStyle='#3c2944';ctx.beginPath();ctx.moveTo(-9,-43);ctx.quadraticCurveTo(-5,-54,4,-52);ctx.lineTo(11,-43);ctx.lineTo(5,-47);ctx.lineTo(-5,-47);ctx.closePath();ctx.fill();
 ctx.fillStyle='#a5a9a0';ctx.beginPath();ctx.moveTo(-6,-44);ctx.lineTo(7,-45);ctx.lineTo(12,-41);ctx.lineTo(3,-39);ctx.lineTo(-5,-40);ctx.closePath();ctx.fill();
 ctx.fillStyle='#2b1838';ctx.fillRect(0,-45,7,2);skinGlow(4,-44,6,'rgba(204,88,255,.25)');
 // quiver and arrow feathers remain readable while running
 ctx.strokeStyle='#7b4d38';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-8,-31);ctx.lineTo(-13,-45);ctx.stroke();
 for(let i=0;i<3;i++){skinLine(-14+i*2,-44,-15+i*2,-51,1.4,i===1?'#be65dc':'#718b77');}
 if(run&&!roll){ctx.strokeStyle='rgba(183,110,215,.25)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-11,-42);ctx.quadraticCurveTo(-25-tail,-37,-31-tail,-32);ctx.stroke();}
 ctx.restore();return true;
}
function drawDetailedHeroSkin(_ctx,id,p,pose){
 if(!DETAILED_HERO_SKINS.has(id))return false;
 ctx.save();
 try{return id==='astral_mage'?drawAstralMage(p,pose):drawDuskRanger(p,pose);}finally{ctx.restore();}
}

function detailedAttackProgress(p){return p.animT>0&&p.animDur>0?clamp(1-p.animT/p.animDur,0,1):0;}
function detailedArcTrail(cx,cy,r,a0,a1,col,width,alpha){
 ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
 for(let i=0;i<7;i++){const f=i/7;ctx.strokeStyle=col.replace('ALPHA',String(alpha*(1-f*.72)));ctx.lineWidth=width*(1-f*.55);ctx.beginPath();ctx.arc(cx,cy,r-i*1.3,a0+(a1-a0)*f,a1);ctx.stroke();}
 ctx.restore();
}
function drawOathblade(p,o){
 const s=detailedAttackProgress(p),attack=p.cast&&p.cast.kind==='swing'&&p.animT>0,ang=p.parry>0?(o.aimed?o.la-1.28:-1.28):(o.aimed?o.la+swingOff(p):wpnSwingAngle(p));
 if(attack)detailedArcTrail(4,-29,50,-2.3,-2.3+3.15*s,'rgba(255,205,91,ALPHA)',10,.5);
 ctx.save();ctx.translate(4,-29+o.bob);ctx.rotate(ang);skinLine(0,0,10,0,4,'#c7a475');
 ctx.fillStyle='#201c26';ctx.fillRect(7,-2.5,10,5);ctx.fillStyle='#e2b64d';ctx.fillRect(15,-7,3,14);
 const g=ctx.createLinearGradient(18,-4,67,3);g.addColorStop(0,'#fff4c7');g.addColorStop(.45,'#d7c06f');g.addColorStop(.7,'#fff7d7');g.addColorStop(1,'#a67b28');ctx.fillStyle=g;
 ctx.beginPath();ctx.moveTo(18,-3.5);ctx.lineTo(58,-4);ctx.lineTo(69,0);ctx.lineTo(58,4);ctx.lineTo(18,3);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#fff6c7';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(22,-1.2);ctx.lineTo(59,-1.5);ctx.stroke();
 ctx.fillStyle='#9c6626';for(let x=25;x<57;x+=10){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+3,-2);ctx.lineTo(x+5,0);ctx.lineTo(x+3,2);ctx.closePath();ctx.fill();}
 skinGlow(53,0,10,'rgba(255,200,60,.28)');ctx.restore();return true;
}
function drawMoonKatana(p,o){
 const s=detailedAttackProgress(p),attack=p.cast&&p.cast.kind==='swing'&&p.animT>0,ang=p.parry>0?(o.aimed?o.la-1.35:-1.35):(o.aimed?o.la+swingOff(p):wpnSwingAngle(p));
 if(attack){detailedArcTrail(4,-29,55,-2.42,-2.42+3.2*s,'rgba(111,210,255,ALPHA)',7,.48);detailedArcTrail(4,-29,47,-2.35,-2.35+3.1*s,'rgba(190,120,255,ALPHA)',3,.35);}
 ctx.save();ctx.translate(4,-29+o.bob);ctx.rotate(ang);ctx.fillStyle='#151425';ctx.fillRect(1,-2.7,16,5.4);
 ctx.strokeStyle='#8c79b4';ctx.lineWidth=1;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(3+i*3,-2.5);ctx.lineTo(5+i*3,2.5);ctx.stroke();}
 ctx.fillStyle='#b4dfff';ctx.beginPath();ctx.ellipse(18,0,3,7,0,0,7);ctx.fill();
 const g=ctx.createLinearGradient(19,3,70,-22);g.addColorStop(0,'#d9f8ff');g.addColorStop(.5,'#88bde1');g.addColorStop(.8,'#f4e9ff');g.addColorStop(1,'#7652b7');ctx.fillStyle=g;
 ctx.beginPath();ctx.moveTo(20,2.7);ctx.quadraticCurveTo(49,-1,68,-20);ctx.lineTo(72,-25);ctx.quadraticCurveTo(50,-10,20,-2.2);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#e8fbff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(22,-1.2);ctx.quadraticCurveTo(51,-9,68,-21);ctx.stroke();
 skinGlow(63,-18,12,'rgba(108,188,255,.28)');ctx.restore();return true;
}
function drawVerdantBow(p,o){
 const shooting=p.animT>0&&p.cast&&p.cast.kind==='shoot',s=detailedAttackProgress(p),rec=shooting?-4*(1-Math.min(1,s*2)):0;
 if(shooting){ctx.save();ctx.translate(7,-29+o.bob);ctx.rotate(o.la);ctx.globalCompositeOperation='lighter';for(let i=0;i<4;i++){ctx.strokeStyle=`rgba(${130+i*18},255,${120+i*20},${.5-i*.09})`;ctx.lineWidth=4-i*.7;ctx.beginPath();ctx.moveTo(10+i*5,0);ctx.lineTo(70+i*12,Math.sin(i*2.2)*3);ctx.stroke();}ctx.restore();}
 ctx.save();ctx.translate(6,-29+o.bob);ctx.rotate(o.la);skinLine(-7,3,1,0,4,'#a88368');
 ctx.strokeStyle='#527b39';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(8,-18);ctx.quadraticCurveTo(22,-10,19,0);ctx.quadraticCurveTo(22,10,8,18);ctx.stroke();
 ctx.strokeStyle='#b9e38c';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(8,-18);ctx.lineTo(rec,0);ctx.lineTo(8,18);ctx.stroke();
 ctx.fillStyle='#8fd75c';for(const yy of [-13,-6,7,14]){ctx.beginPath();ctx.ellipse(13,yy,4,2,yy<0?-.6:.6,0,7);ctx.fill();}
 ctx.fillStyle='#d7f5b1';ctx.fillRect(rec,-1,27,2);ctx.beginPath();ctx.moveTo(27,-4);ctx.lineTo(36,0);ctx.lineTo(27,4);ctx.closePath();ctx.fill();skinGlow(17,0,10,'rgba(136,255,100,.22)');ctx.restore();return true;
}
function drawAstralStaff(p,o){
 const casting=p.animT>0&&p.cast&&p.cast.kind==='cast',s=detailedAttackProgress(p),pulse=casting?1+Math.sin(s*Math.PI)*.8:1;
 if(casting){ctx.save();ctx.translate(5,-29+o.bob);ctx.rotate(o.la);ctx.globalCompositeOperation='lighter';for(let i=0;i<3;i++){ctx.strokeStyle=`rgba(${120+i*30},${160+i*20},255,${.5-i*.12})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(31,0,10+i*6,-s*5+i,s*4+i);ctx.stroke();}for(let i=0;i<5;i++){const a=i*1.257+s*8;ctx.fillStyle='rgba(200,230,255,.7)';ctx.beginPath();ctx.arc(31+Math.cos(a)*(16+s*12),Math.sin(a)*(10+s*7),1.8,0,7);ctx.fill();}ctx.restore();}
 ctx.save();ctx.translate(4,-29+o.bob);ctx.rotate(o.la);skinLine(-5,5,8,0,4,'#b8c8de');skinLine(-2,6,29,0,4,'#433a68');skinLine(2,4,26,0,1,'#9ca9ff');
 ctx.strokeStyle='#9bbcff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(32,0,8,0,7);ctx.stroke();ctx.beginPath();ctx.moveTo(32,-10);ctx.lineTo(40,0);ctx.lineTo(32,10);ctx.lineTo(24,0);ctx.closePath();ctx.stroke();
 skinGlow(32,0,15*pulse,'rgba(104,150,255,.4)');ctx.fillStyle='#eef6ff';ctx.beginPath();ctx.arc(32,0,3.6*pulse,0,7);ctx.fill();ctx.restore();return true;
}
function drawDetailedWeaponSkin(_ctx,id,p,o){
 if(!DETAILED_WEAPON_SKINS.has(id))return false;
 ctx.save();try{
  if(id==='oathblade')return drawOathblade(p,o);
  if(id==='moon_katana')return drawMoonKatana(p,o);
  if(id==='verdant_bow')return drawVerdantBow(p,o);
  return drawAstralStaff(p,o);
 }finally{ctx.restore();}
}
