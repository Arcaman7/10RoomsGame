/* ================= РИСОВАНИЕ ================= */
function drawSky(){
const g=ctx.createLinearGradient(0,0,0,H);
g.addColorStop(0,theme.sky[0]);g.addColorStop(.5,theme.sky[1]);g.addColorStop(1,theme.sky[2]);
ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
for(const s of stars){ctx.globalAlpha=.25+.55*(.5+.5*Math.sin(time*s.sp+s.ph));ctx.fillStyle='#cfe6da';ctx.fillRect(s.x,s.y,s.r,s.r);}
ctx.globalAlpha=1;
if(theme.deco!=='cave'&&theme.deco!=='crypt'&&theme.deco!=='tower'){
const mx=764,my=108;
const mg=ctx.createRadialGradient(mx,my,10,mx,my,120);
mg.addColorStop(0,theme.light+'.25)');mg.addColorStop(1,theme.light+'0)');
ctx.fillStyle=mg;ctx.beginPath();ctx.arc(mx,my,120,0,7);ctx.fill();
ctx.fillStyle='#e9f2e2';ctx.beginPath();ctx.arc(mx,my,38,0,7);ctx.fill();
}else{
ctx.fillStyle=theme.light+'.12)';
for(const sx of [240,700]){ctx.beginPath();ctx.ellipse(sx,0,90,140,0,0,7);ctx.fill();}
}
}
function drawDeco(){
const A=theme.accent;
for(const d of decos){
switch(d.t){
case 'tree':{
ctx.fillStyle='rgba(8,14,12,.85)';
ctx.fillRect(d.x-4,GROUND-d.h,8,d.h);
for(let i=0;i<3;i++){const w=d.h*(.6-i*.13),yy=GROUND-d.h*.3-d.h*.26*i;
ctx.beginPath();ctx.moveTo(d.x-w/2,yy);ctx.lineTo(d.x+w/2,yy);ctx.lineTo(d.x,yy-d.h*.4);ctx.closePath();ctx.fill();}
break;}
case 'spike':{ctx.fillStyle='rgba(20,10,12,.9)';
ctx.beginPath();ctx.moveTo(d.x-d.h*.4,GROUND);ctx.lineTo(d.x,GROUND-d.h);ctx.lineTo(d.x+d.h*.4,GROUND);ctx.closePath();ctx.fill();break;}
case 'stal':{ctx.fillStyle='rgba(15,20,26,.9)';
ctx.beginPath();ctx.moveTo(d.x-d.h*.3,0);ctx.lineTo(d.x+d.h*.3,0);ctx.lineTo(d.x,d.h);ctx.closePath();ctx.fill();break;}
case 'stal2':{ctx.fillStyle='rgba(15,20,26,.85)';
ctx.beginPath();ctx.moveTo(d.x-d.h*.4,GROUND);ctx.lineTo(d.x+d.h*.4,GROUND);ctx.lineTo(d.x,GROUND-d.h);ctx.closePath();ctx.fill();break;}
case 'cryst':{ctx.globalAlpha=.7;ctx.fillStyle=d.c;
ctx.beginPath();ctx.moveTo(d.x-d.h*.35,GROUND);ctx.lineTo(d.x,GROUND-d.h);ctx.lineTo(d.x+d.h*.35,GROUND);ctx.closePath();ctx.fill();
ctx.globalAlpha=.25;ctx.beginPath();ctx.moveTo(d.x+d.h*.1,GROUND);ctx.lineTo(d.x+d.h*.5,GROUND-d.h*.6);ctx.lineTo(d.x+d.h*.7,GROUND);ctx.closePath();ctx.fill();
ctx.globalAlpha=1;break;}
case 'reed':{const sw=Math.sin(time*1.5+d.ph)*3;
ctx.strokeStyle='rgba(60,80,40,.8)';ctx.lineWidth=2;
ctx.beginPath();ctx.moveTo(d.x,GROUND+2);ctx.quadraticCurveTo(d.x+sw,GROUND-d.h*.6,d.x+sw*1.5,GROUND-d.h);ctx.stroke();break;}
case 'pool':{ctx.fillStyle='rgba(30,50,30,.6)';
ctx.beginPath();ctx.ellipse(d.x,GROUND+6,d.w,7,0,0,7);ctx.fill();
ctx.strokeStyle='rgba(150,190,90,.25)';ctx.lineWidth=1;
ctx.beginPath();ctx.ellipse(d.x,GROUND+6,d.w*.7,4,0,0,7);ctx.stroke();break;}
case 'pil':{const ty=GROUND-d.h;
ctx.fillStyle='rgba(12,14,16,.9)';ctx.fillRect(d.x,ty,d.w,d.h);
ctx.beginPath();ctx.moveTo(d.x,ty);ctx.lineTo(d.x+d.w*.35,ty+d.j[0]);ctx.lineTo(d.x+d.w*.7,ty+d.j[1]);ctx.lineTo(d.x+d.w,ty);ctx.closePath();ctx.fill();
ctx.fillStyle='rgba(12,14,16,.9)';ctx.fillRect(d.x-3,GROUND-6,d.w+6,6);break;}
case 'arch':{ctx.strokeStyle='rgba(12,14,16,.9)';ctx.lineWidth=14;
ctx.beginPath();ctx.moveTo(d.x,GROUND);ctx.lineTo(d.x,GROUND-70);ctx.arc(d.x+60,GROUND-70,60,Math.PI,0);ctx.lineTo(d.x+120,GROUND);ctx.stroke();break;}
case 'grave':{ctx.fillStyle='rgba(14,12,20,.9)';
ctx.fillRect(d.x-8,GROUND-d.h,16,d.h);
ctx.beginPath();ctx.arc(d.x,GROUND-d.h,8,Math.PI,0);ctx.fill();
ctx.fillRect(d.x-1.5,GROUND-d.h+3,3,d.h*.4);ctx.fillRect(d.x-5,GROUND-d.h+8,10,3);break;}
case 'candle':{const fl=1+Math.sin(time*11+d.x)*.3;
ctx.fillStyle='rgba(20,18,26,.9)';ctx.fillRect(d.x-2,GROUND-14,4,14);
ctx.globalCompositeOperation='lighter';
const g=ctx.createRadialGradient(d.x,GROUND-18,0,d.x,GROUND-18,14*fl);
g.addColorStop(0,'rgba(255,190,90,.8)');g.addColorStop(1,'rgba(255,150,60,0)');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(d.x,GROUND-18,14*fl,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';break;}
case 'furnace':{
ctx.fillStyle='rgba(16,10,8,.95)';ctx.fillRect(d.x-40,GROUND-86,80,86);
const fl=1+Math.sin(time*9+d.x)*.2;
ctx.fillStyle='rgba(255,120,40,.85)';ctx.fillRect(d.x-18,GROUND-52,36,36);
ctx.globalCompositeOperation='lighter';
const g=ctx.createRadialGradient(d.x,GROUND-34,4,d.x,GROUND-34,90*fl);
g.addColorStop(0,'rgba(255,140,50,.3)');g.addColorStop(1,'rgba(255,120,40,0)');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(d.x,GROUND-34,90*fl,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';
ctx.fillStyle='rgba(16,10,8,.95)';ctx.fillRect(d.x-44,GROUND-92,88,8);break;}
case 'anvil':{ctx.fillStyle='rgba(18,18,22,.95)';
ctx.fillRect(d.x-16,GROUND-24,32,8);ctx.fillRect(d.x-6,GROUND-16,12,10);ctx.fillRect(d.x-22,GROUND-28,44,6);break;}
case 'chain':{ctx.strokeStyle='rgba(30,30,36,.8)';ctx.lineWidth=3;
ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(d.x,0);ctx.lineTo(d.x,GROUND-50);ctx.stroke();ctx.setLineDash([]);break;}
case 'shelf':{ctx.fillStyle='rgba(14,14,26,.9)';ctx.fillRect(d.x,GROUND-110,120,110);
for(let r=0;r<3;r++){ctx.fillStyle='rgba(10,10,20,.9)';ctx.fillRect(d.x+6,GROUND-96+r*34,108,4);
for(let b=0;b<7;b++){ctx.fillStyle=['#6a4a7a','#4a6a5a','#7a5a3a'][b%3];
ctx.fillRect(d.x+10+b*15,GROUND-112+r*34,9,16);}}break;}
case 'rune':{ctx.globalAlpha=.3+.3*Math.sin(time*2+d.ph);
ctx.strokeStyle=A;ctx.lineWidth=2;
ctx.beginPath();ctx.arc(d.x,GROUND-40,10,0,7);ctx.stroke();
ctx.beginPath();ctx.moveTo(d.x-6,GROUND-46);ctx.lineTo(d.x+6,GROUND-34);ctx.moveTo(d.x+6,GROUND-46);ctx.lineTo(d.x-6,GROUND-34);ctx.stroke();
ctx.globalAlpha=1;break;}
case 'book':{const yy=d.y+Math.sin(time+d.ph)*8;
ctx.save();ctx.translate(d.x,yy);ctx.rotate(Math.sin(time*.7+d.ph)*.3);
ctx.fillStyle='rgba(90,70,110,.8)';ctx.fillRect(-8,-5,16,10);
ctx.fillStyle='rgba(220,210,190,.8)';ctx.fillRect(-8,-1,16,2);
ctx.restore();break;}
case 'throne':{ctx.fillStyle='rgba(20,10,14,.95)';
ctx.fillRect(d.x-40,GROUND-96,80,96);
ctx.beginPath();ctx.moveTo(d.x-40,GROUND-96);ctx.lineTo(d.x-28,GROUND-140);ctx.lineTo(d.x-16,GROUND-96);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.moveTo(d.x-8,GROUND-96);ctx.lineTo(d.x,GROUND-150);ctx.lineTo(d.x+8,GROUND-96);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.moveTo(d.x+16,GROUND-96);ctx.lineTo(d.x+28,GROUND-140);ctx.lineTo(d.x+40,GROUND-96);ctx.closePath();ctx.fill();
ctx.fillStyle='rgba(120,30,30,.8)';ctx.fillRect(d.x-30,GROUND-70,60,50);break;}
case 'banner':{const sw=Math.sin(time*1.2+d.x)*3;
ctx.fillStyle='rgba(110,25,30,.85)';
ctx.beginPath();ctx.moveTo(d.x-14,40);ctx.lineTo(d.x+14,40);ctx.lineTo(d.x+14+sw*.3,130);ctx.lineTo(d.x+sw*.5,148);ctx.lineTo(d.x-14+sw*.3,130);ctx.closePath();ctx.fill();
ctx.fillStyle='rgba(220,180,90,.6)';ctx.fillRect(d.x-14,40,28,4);break;}
}
}
}
function drawGroundAll(){
const g=ctx.createLinearGradient(0,GROUND,0,H);
g.addColorStop(0,theme.ground[1]);g.addColorStop(1,'#050607');
ctx.fillStyle=g;ctx.fillRect(0,GROUND,W,H-GROUND);
ctx.fillStyle=theme.ground[0];ctx.fillRect(0,GROUND,W,4);
ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(0,GROUND,W,1.5);
ctx.lineWidth=1.5;
for(const t of tufts){
const sway=Math.sin(time*1.8+t.ph)*2;
ctx.strokeStyle='rgba(255,255,255,.14)';
ctx.beginPath();ctx.moveTo(t.x,GROUND+2);ctx.lineTo(t.x+sway,GROUND+2-t.h);ctx.stroke();
}
for(let i=1;i<plats.length;i++){
const pl=plats[i];
const gg=ctx.createLinearGradient(0,pl.y,0,pl.y+pl.h+8);
gg.addColorStop(0,'#33454b');gg.addColorStop(1,'#131e20');
ctx.fillStyle=gg;ctx.fillRect(pl.x,pl.y,pl.w,pl.h);
ctx.fillStyle=theme.ground[0];ctx.fillRect(pl.x,pl.y,pl.w,2.5);
ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(pl.x,pl.y+pl.h-3,pl.w,3);
if(HZ.id==='bog'){
const sg=ctx.createLinearGradient(0,pl.y-3,0,pl.y+10);sg.addColorStop(0,'rgba(190,225,80,.8)');sg.addColorStop(1,'rgba(45,85,20,.25)');
ctx.fillStyle=sg;ctx.fillRect(pl.x,pl.y-3,pl.w,9);
}
if(HZ.id==='slip'){
const ig=ctx.createLinearGradient(0,pl.y-5,0,pl.y+10);ig.addColorStop(0,'rgba(220,250,255,.85)');ig.addColorStop(1,'rgba(100,190,225,.22)');
ctx.fillStyle=ig;ctx.fillRect(pl.x,pl.y-5,pl.w,10);ctx.fillStyle='rgba(255,255,255,.55)';ctx.fillRect(pl.x+5,pl.y-3,pl.w*.45,1.5);
}
}
}
function drawLights(){
ctx.globalCompositeOperation='lighter';
for(const lx of [170,720,1270]){
const fl=1+Math.sin(time*7+lx)*.12;
const g=ctx.createRadialGradient(lx,GROUND-40,6,lx,GROUND-40,150*fl);
g.addColorStop(0,theme.light+'.22)');g.addColorStop(1,theme.light+'0)');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(lx,GROUND-40,150*fl,0,7);ctx.fill();
ctx.fillStyle=theme.light+'.8)';
ctx.beginPath();ctx.arc(lx,GROUND-40,3+Math.sin(time*9+lx),0,7);ctx.fill();
}
for(const f of flies){
const x=f.x+Math.sin(time*f.s1+f.ph)*f.r1,y=f.y+Math.sin(time*f.s2+f.ph*2)*f.r2;
const a=.25+.25*Math.sin(time*2+f.ph);
const g=ctx.createRadialGradient(x,y,0,x,y,6);
g.addColorStop(0,theme.light+a+')');g.addColorStop(1,theme.light+'0)');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.fill();
}
ctx.globalCompositeOperation='source-over';
}
function drawShadow(x,y,w){
let gy=GROUND;
for(const pl of plats)if(x>pl.x&&x<pl.x+pl.w&&pl.y<=y+2&&pl.y<gy)gy=pl.y;
const d=clamp(1-(gy-y)/240,.25,1);
ctx.fillStyle=`rgba(0,0,0,${.35*d})`;
ctx.beginPath();ctx.ellipse(x,gy+4,w*d,4*d,0,0,7);ctx.fill();
}
function wpnSwingAngle(p){
if(p.animT>0&&p.cast&&(p.cast.kind==='swing')){
const s=clamp(1-p.animT/p.animDur,0,1),e=1-(1-s)*(1-s);
return -2.25+3.05*e;
}
return .72+Math.sin(time*2.4)*.05;
}
function swingOff(p){
if(p.animT>0&&p.cast&&p.cast.kind==='swing'){
const s=clamp(1-p.animT/p.animDur,0,1),e=1-(1-s)*(1-s);
return -1.5+3.05*e;
}
return Math.sin(time*2.4)*.05;
}
function drawTrail(s,base){
const a0=(base===undefined?-2.25:base),a1=a0+3.05*s;
for(let i=0;i<10;i++){
const t0=i/10,t1=(i+1)/10;
const al=Math.max(0,t0*.5*s-Math.max(0,s-.8)*2.2);
if(al<=0)continue;
ctx.strokeStyle=`rgba(255,240,200,${al})`;
ctx.lineWidth=9-4*t0;ctx.lineCap='round';
ctx.beginPath();ctx.arc(4,-29,46,a0+(a1-a0)*t0,a0+(a1-a0)*t1+.02);ctx.stroke();
}
ctx.lineCap='butt';
}
function drawPlayer(){
const p=player,w=p.weapon,cat=WEAPONS[w].cat;
if(p.inv>0&&p.roll<=0&&p.armorRoll<=0&&!p.dead&&Math.floor(time*18)%2===0)return;
const A=Math.atan2(mouse.y-(p.y-30),mouse.x-p.x);
const la=p.face===1?A:Math.PI-A;
ctx.save();
ctx.translate(p.x,p.y);
if(p.dead){p.rot=Math.min(p.rot+.08,1.45);ctx.rotate(-p.rot*p.face);}
else if(p.armorRoll>0){ctx.rotate(p.armorRollDir*(1-clamp(p.armorRoll/ARMOR_ROLL_T,0,1))*9.425);}
else if(p.roll>0){ctx.rotate(p.rollDir*(1-clamp(p.roll/ROLL_T,0,1))*6.283);}
ctx.scale(p.face,1);
const run=p.grounded&&Math.abs(p.vx)>30,lt=p.anim*13;
const bob=p.grounded?(run?Math.sin(lt)*1.6:Math.sin(time*2)*1):0;
const flow=clamp(-p.vx*p.face*.045,-6,10)+Math.sin(time*7)*2;
ctx.fillStyle='#8a3038';
ctx.beginPath();ctx.moveTo(-3,-33+bob);ctx.quadraticCurveTo(-14-flow,-22+bob,-10-flow*.6,-4+bob);ctx.lineTo(-4,-10+bob);ctx.closePath();ctx.fill();
ctx.strokeStyle='#232f2c';ctx.lineWidth=5;ctx.lineCap='round';
let l1x,l1y,l2x,l2y;
if(p.grounded){l1x=-4+(run?Math.sin(lt)*7:0);l1y=0;l2x=4+(run?-Math.sin(lt)*7:0);l2y=run?Math.min(0,-Math.cos(lt)*3):0;}
else{l1x=-5;l1y=-5;l2x=4;l2y=-2;}
ctx.beginPath();ctx.moveTo(-3,-14+bob);ctx.lineTo(l1x,l1y);ctx.moveTo(3,-14+bob);ctx.lineTo(l2x,l2y);ctx.stroke();
ctx.fillStyle='#4a3320';ctx.fillRect(l1x-3,l1y-3,7,4);ctx.fillRect(l2x-3,l2y-3,7,4);
ctx.fillStyle='#3c5f52';ctx.fillRect(-8,-34+bob,16,21);
ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(-8,-34+bob,4,21);
ctx.fillStyle='#241812';ctx.fillRect(-8,-19+bob,16,4);
ctx.fillStyle='#d8a24a';ctx.fillRect(-2,-19+bob,4,4);
ctx.fillStyle='#e5b78a';ctx.beginPath();ctx.arc(1,-41+bob,7,0,7);ctx.fill();
ctx.fillStyle='#20262b';ctx.fillRect(4,-43+bob,2.5,2.5);
ctx.fillStyle='#84959c';ctx.beginPath();ctx.arc(1,-41+bob,7.8,Math.PI*.98,Math.PI*2.02);ctx.fill();
ctx.fillRect(-6.8,-42+bob,15.6,3);ctx.fillRect(3.5,-44+bob,2.5,6);
ctx.strokeStyle='#c73b3b';ctx.lineWidth=3.5;
ctx.beginPath();ctx.moveTo(1,-49+bob);ctx.quadraticCurveTo(-8,-51+bob,-13,-42+bob+Math.sin(time*6)*1.5);ctx.stroke();
ctx.save();
const aimed=!!WEAPONS[w].aimed;
if(cat==='melee'){
if(w==='thornarmor'){
const pulse=(p.cast&&String(p.cast.kind).indexOf('armor-')===0)?1+Math.sin(clamp(p.cast.t/p.cast.dur,0,1)*Math.PI)*.18:1;
ctx.translate(0,bob);ctx.scale(pulse,pulse);
ctx.fillStyle='#34483e';ctx.strokeStyle='#a8bd91';ctx.lineWidth=2;
ctx.beginPath();ctx.moveTo(-13,-37);ctx.lineTo(13,-37);ctx.lineTo(16,-15);ctx.lineTo(0,-9);ctx.lineTo(-16,-15);ctx.closePath();ctx.fill();ctx.stroke();
ctx.fillStyle='#71866f';ctx.fillRect(-10,-32,20,4);ctx.fillRect(-12,-24,24,4);
ctx.fillStyle='#d7e889';
for(let i=0;i<8;i++){const an=-2.8+i*.8,x=Math.cos(an)*17,y=-24+Math.sin(an)*17;
ctx.save();ctx.translate(x,y);ctx.rotate(an);ctx.beginPath();ctx.moveTo(0,-3);ctx.lineTo(13,0);ctx.lineTo(0,3);ctx.closePath();ctx.fill();ctx.restore();}
ctx.fillStyle='#233029';ctx.beginPath();ctx.arc(0,-24,5,0,7);ctx.fill();
}else if(w==='spear'){
let ext=6;
if(p.animT>0&&p.cast&&p.cast.kind==='thrust'){const s=clamp(1-p.animT/p.animDur,0,1);ext=6+Math.sin(s*Math.PI)*46;}
ctx.translate(4,-29+bob);
if(aimed)ctx.rotate(la);
ctx.strokeStyle='#e5b78a';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-4,2);ctx.lineTo(8,0);ctx.stroke();
ctx.strokeStyle='#5a4326';ctx.lineWidth=3.5;
ctx.beginPath();ctx.moveTo(-26,2);ctx.lineTo(30+ext,0);ctx.stroke();
ctx.fillStyle='#cfd8dc';
ctx.beginPath();ctx.moveTo(30+ext,-3.5);ctx.lineTo(46+ext,0);ctx.lineTo(30+ext,3.5);ctx.closePath();ctx.fill();
ctx.fillStyle='#d8a24a';ctx.fillRect(26+ext,-3,3,6);
}else{
if(p.animT>0&&p.cast&&p.cast.kind==='swing')drawTrail(clamp(1-p.animT/p.animDur,0,1),aimed?la-1.5:undefined);
let ang;
if(p.cast&&p.cast.kind==='spin')ang=-2.25+(1-clamp(p.animT/p.animDur,0,1))*6.6;
else if(p.parry>0)ang=aimed?la-1.3:-1.3;
else ang=aimed?la+swingOff(p):wpnSwingAngle(p);
ctx.translate(4,-29+bob);ctx.rotate(ang);
ctx.strokeStyle='#e5b78a';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(9,0);ctx.stroke();
if(w==='sword'){
ctx.fillStyle='#4a3320';ctx.fillRect(7,-2,7,4);
ctx.fillStyle='#d8a24a';ctx.fillRect(13,-6,3,12);
const bg=ctx.createLinearGradient(16,0,58,0);
bg.addColorStop(0,'#f2f6f7');bg.addColorStop(.5,'#b9c6cc');bg.addColorStop(1,'#e8eef0');
ctx.fillStyle=bg;
ctx.beginPath();ctx.moveTo(16,-2.5);ctx.lineTo(52,-2.5);ctx.lineTo(60,0);ctx.lineTo(52,2.5);ctx.lineTo(16,2.5);ctx.closePath();ctx.fill();
ctx.fillStyle='#7e8a90';ctx.fillRect(16,-.7,38,1.4);
}else if(w==='axe'){
ctx.fillStyle='#5a4326';ctx.fillRect(7,-2.5,40,5);
ctx.fillStyle='#aab7bd';
ctx.beginPath();ctx.moveTo(40,-4);ctx.quadraticCurveTo(58,-18,64,-2);ctx.lineTo(48,4);ctx.closePath();ctx.fill();
ctx.fillStyle='#8a969c';
ctx.beginPath();ctx.moveTo(40,4);ctx.lineTo(52,10);ctx.lineTo(44,2);ctx.closePath();ctx.fill();
}else{ // катана — выраженный изгиб (сори)
ctx.fillStyle='#20202a';ctx.fillRect(1,-2.4,14,4.8);
ctx.strokeStyle='#6e5c3c';ctx.lineWidth=1;
for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(2.5+i*3.2,-2.4);ctx.lineTo(4.5+i*3.2,2.4);ctx.stroke();}
ctx.fillStyle='#c9a25a';ctx.beginPath();ctx.ellipse(16,0,2.6,6,0,0,7);ctx.fill();
ctx.fillStyle='#8a6f38';ctx.beginPath();ctx.ellipse(16,0,1.2,6,0,0,7);ctx.fill();
const bg2=ctx.createLinearGradient(18,4,60,-22);
bg2.addColorStop(0,'#eef4f6');bg2.addColorStop(.45,'#b9c7ce');bg2.addColorStop(.8,'#f4f8fa');bg2.addColorStop(1,'#dfe8ec');
ctx.fillStyle=bg2;
ctx.beginPath();
ctx.moveTo(18,2.6);
ctx.quadraticCurveTo(45,-1,64,-17.5);
ctx.lineTo(68,-21.5);
ctx.quadraticCurveTo(50,-9,18,-2.2);
ctx.closePath();ctx.fill();
ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1;
ctx.beginPath();ctx.moveTo(20,-1.4);ctx.quadraticCurveTo(48,-8.4,64,-18.4);ctx.stroke();
ctx.strokeStyle='rgba(60,80,92,.55)';ctx.lineWidth=1.2;
ctx.beginPath();ctx.moveTo(19,2.2);ctx.quadraticCurveTo(45,-1.4,63,-17.2);ctx.stroke();
}
}
}else if(w==='bow'){
ctx.translate(6,-29+bob);ctx.rotate(la);
ctx.strokeStyle='#e5b78a';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-6,3);ctx.lineTo(2,0);ctx.stroke();
ctx.strokeStyle='#7a5a30';ctx.lineWidth=3.5;
ctx.beginPath();ctx.arc(6,0,16,-1.2,1.2);ctx.stroke();
ctx.strokeStyle='#d9d2bd';ctx.lineWidth=1.2;
const rec=(p.animT>0&&p.cast&&p.cast.kind==='shoot')?-3:0;
ctx.beginPath();ctx.moveTo(6+16*Math.cos(-1.2),16*Math.sin(-1.2));ctx.lineTo(rec,0);ctx.lineTo(6+16*Math.cos(1.2),16*Math.sin(1.2));ctx.stroke();
if(rec<0){ctx.fillStyle='#c8b89a';ctx.fillRect(rec,-1,18,2);}
}else if(w==='crossbow'){
ctx.translate(6,-28+bob);ctx.rotate(la);
ctx.strokeStyle='#e5b78a';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-8,3);ctx.lineTo(0,1);ctx.stroke();
ctx.fillStyle='#5a4326';ctx.fillRect(-2,-3,26,6);
ctx.strokeStyle='#8a969c';ctx.lineWidth=3;
ctx.beginPath();ctx.moveTo(20,-11);ctx.quadraticCurveTo(27,0,20,11);ctx.stroke();
ctx.strokeStyle='#d9d2bd';ctx.lineWidth=1;
ctx.beginPath();ctx.moveTo(20,-11);ctx.lineTo(6,0);ctx.lineTo(20,11);ctx.stroke();
}else if(w==='knives'){
ctx.translate(4,-29+bob);ctx.rotate(la);
const thr=(p.animT>0&&p.cast&&p.cast.kind==='shoot')?10:0;
ctx.strokeStyle='#e5b78a';ctx.lineWidth=4;
ctx.beginPath();ctx.moveTo(0,2);ctx.lineTo(10+thr,0);ctx.stroke();
ctx.fillStyle='#cfd8dc';
ctx.beginPath();ctx.moveTo(12+thr,-3);ctx.lineTo(24+thr,0);ctx.lineTo(12+thr,3);ctx.closePath();ctx.fill();
}else{
ctx.translate(4,-29+bob);ctx.rotate(la);
const orbC=w==='fire'?'#ff8a3d':(w==='summoner'?'#c9a0ff':'#8fe0ff');
ctx.strokeStyle='#e5b78a';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-4,4);ctx.lineTo(8,0);ctx.stroke();
ctx.strokeStyle='#5a4326';ctx.lineWidth=3.5;
ctx.beginPath();ctx.moveTo(-4,6);ctx.lineTo(26,0);ctx.stroke();
const castGlow=(p.animT>0&&p.cast&&p.cast.kind==='cast')?1.8:1;
ctx.globalCompositeOperation='lighter';
const g=ctx.createRadialGradient(28,0,0,28,0,10*castGlow);
g.addColorStop(0,orbC);g.addColorStop(1,'rgba(0,0,0,0)');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(28,0,10*castGlow,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';
ctx.fillStyle=orbC;ctx.beginPath();ctx.arc(28,0,4,0,7);ctx.fill();
if(w==='summoner'){
ctx.fillStyle='#efe7f7';ctx.beginPath();ctx.arc(28,-.5,4.2,0,7);ctx.fill();ctx.fillRect(25.6,2,4.8,3);
ctx.fillStyle='#281733';ctx.beginPath();ctx.arc(26.7,-1.2,1,0,7);ctx.arc(29.3,-1.2,1,0,7);ctx.fill();
ctx.fillRect(27,2.2,.8,2.5);ctx.fillRect(28.6,2.2,.8,2.5);
}
}
ctx.restore();
ctx.restore();
}
function drawNewMobModel(m){
const T=m.type,w=m.w,h=m.h,t=m.anim,cast=m.state==='cast';
if(ACT2_MOB_AI[T]){
 const ids=Object.keys(ACT2_MOB_AI),ix=ids.indexOf(T),role=ix%3,act=Math.floor(ix/3),pulse=1+Math.sin(t*4+ix)*.06;
 ctx.save();ctx.globalAlpha=T==='a2_ink'?.82:1;
 ctx.strokeStyle=m.dark;ctx.fillStyle=m.color;ctx.lineWidth=3;
 if(ACT2_MOB_AI[T].fly){
  ctx.beginPath();ctx.moveTo(-w*.58,-h*.5);ctx.quadraticCurveTo(0,-h*(.95+pulse*.08),w*.58,-h*.5);ctx.quadraticCurveTo(0,-h*.2,-w*.58,-h*.5);ctx.fill();
  ctx.strokeStyle=hexA(m.eye,.65);ctx.beginPath();ctx.moveTo(-w*.42,-h*.48);ctx.lineTo(w*.42,-h*.48);ctx.stroke();
 }else if(role===1){
  ctx.beginPath();for(let k=0;k<6;k++){const an=-Math.PI/2+k*Math.PI/3,x=Math.cos(an)*w*.5,y=-h*.5+Math.sin(an)*h*.5; k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.fill();ctx.stroke();
 }else{
  ctx.beginPath();ctx.roundRect(-w*.45,-h*.92,w*.9,h*.88,role===2?12:5);ctx.fill();ctx.stroke();
 }
 const glyph=['ϟ','◉','⚓','●','▤','A','♢','◐','↧','✦','⬡','◎','❈','☝','♧','≈','⚓','↶','♙','◍','⌁','♨','◉','⋔','⊙','◒','∿','✣','∞','⌁'][ix]||'✦';
 ctx.fillStyle=(act===1||act===6)?'#17304f':m.eye;ctx.font='bold '+Math.max(14,Math.min(24,h*.42))+'px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(glyph,0,-h*.52);
 if(cast||m.state==='a2wind'){ctx.strokeStyle='#fff0b0';ctx.globalAlpha=.45+.35*Math.sin(time*22);ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-h*.52,Math.max(w,h)*.65,0,7);ctx.stroke();}
 ctx.restore();return true;
}
if(T==='spore'){
const puff=1+Math.sin(t*4)*.08;ctx.fillStyle=m.dark;ctx.beginPath();ctx.ellipse(-w*.12,-h*.42,w*.46,h*.46,0,0,7);ctx.fill();
ctx.fillStyle=m.color;ctx.beginPath();ctx.ellipse(-w*.08,-h*.78,w*.62*puff,h*.28*puff,0,0,7);ctx.fill();
ctx.fillStyle='#d9ed9b';for(let i=0;i<5;i++){const a=i*1.7+t*.15;ctx.beginPath();ctx.arc(Math.cos(a)*w*.3,-h*.78+Math.sin(a)*h*.12,2.6,0,7);ctx.fill();}
ctx.fillStyle=m.eye;ctx.fillRect(w*.08,-h*.5,4,4);return true;
}if(T==='slime'){
const squ=1+Math.sin(t*5)*.08;ctx.fillStyle=m.color;ctx.globalAlpha=.84;ctx.beginPath();ctx.ellipse(0,-h*.42,w*.52*squ,h*.52/squ,0,0,7);ctx.fill();
ctx.fillStyle='#d8ffe7';for(const k of [-.22,.12]){ctx.beginPath();ctx.arc(w*k,-h*(.48+Math.sin(t*3+k)*.04),4,0,7);ctx.fill();}ctx.globalAlpha=1;return true;
}if(T==='weaver'){
ctx.strokeStyle=m.dark;ctx.lineWidth=4;for(let i=0;i<4;i++){const yy=-h*.52+i*3,step=Math.sin(t*8+i)*7;ctx.beginPath();ctx.moveTo(-6,yy);ctx.lineTo(-w*.55,yy+step);ctx.lineTo(-w*.72,yy+10);ctx.stroke();ctx.beginPath();ctx.moveTo(6,yy);ctx.lineTo(w*.55,yy-step);ctx.lineTo(w*.72,yy+10);ctx.stroke();}
ctx.fillStyle=m.color;ctx.beginPath();ctx.ellipse(0,-h*.5,w*.34,h*.44,0,0,7);ctx.fill();ctx.fillStyle=m.eye;for(const x of [-6,-2,2,6]){ctx.beginPath();ctx.arc(x,-h*.62,2,0,7);ctx.fill();}return true;
}if(T==='binder'){
ctx.fillStyle=m.dark;ctx.beginPath();ctx.moveTo(-w*.5,0);ctx.lineTo(w*.5,0);ctx.lineTo(w*.26,-h*.82);ctx.lineTo(-w*.26,-h*.82);ctx.closePath();ctx.fill();
ctx.fillStyle=m.color;ctx.beginPath();ctx.arc(0,-h*.72,w*.27,0,7);ctx.fill();ctx.strokeStyle='#d8c8a2';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-w*.42,0);ctx.lineTo(-w*.42,-h*.92);ctx.stroke();
const glow=cast?12:7;ctx.fillStyle='#cbb5ff';ctx.beginPath();ctx.arc(-w*.42,-h*.96,glow*.35,0,7);ctx.fill();ctx.fillStyle=m.eye;ctx.fillRect(5,-h*.74,3,4);return true;
}if(T==='prism'){
ctx.fillStyle=m.dark;ctx.beginPath();ctx.ellipse(0,-h*.42,w*.52,h*.42,0,0,7);ctx.fill();
const charge=(m.prismCharge||0)/3;for(let i=0;i<5;i++){const x=(i-2)*w*.16,hh=h*(.28+i%2*.16)*(1+charge*.35);ctx.fillStyle=i%2?'#9ff3ff':m.color;ctx.beginPath();ctx.moveTo(x-6,-h*.5);ctx.lineTo(x,-h*.5-hh);ctx.lineTo(x+6,-h*.5);ctx.closePath();ctx.fill();}
ctx.fillStyle=m.eye;ctx.beginPath();ctx.arc(w*.28,-h*.44,4,0,7);ctx.fill();return true;
}if(T==='mimic'){
ctx.fillStyle=m.dark;ctx.beginPath();ctx.ellipse(0,-h*.48,w*.45,h*.48,0,0,7);ctx.fill();ctx.fillStyle='#e7d6b2';ctx.beginPath();ctx.moveTo(-w*.24,-h*.72);ctx.lineTo(w*.3,-h*.66);ctx.lineTo(w*.22,-h*.3);ctx.lineTo(-w*.28,-h*.34);ctx.closePath();ctx.fill();
ctx.fillStyle='#241b16';ctx.fillRect(2,-h*.57,12,3);ctx.fillStyle=m.eye;ctx.font='18px serif';ctx.textAlign='center';ctx.fillText(WEAPONS[player.weapon].cat==='melee'?'†':(WEAPONS[player.weapon].cat==='ranged'?'➶':'✦'),0,-h*.78);return true;
}if(T==='thief'){
const run=Math.sin(t*12)*4;ctx.fillStyle=m.dark;ctx.beginPath();ctx.ellipse(0,-h*.46,w*.4,h*.42,0,0,7);ctx.fill();ctx.fillStyle=m.color;ctx.beginPath();ctx.ellipse(-w*.2,-h*.35-run*.02,w*.32+(m.stolen?6:0),h*.3,0,0,7);ctx.fill();
ctx.fillStyle=m.eye;ctx.beginPath();ctx.arc(w*.18,-h*.58,3,0,7);ctx.fill();if(m.stolen){ctx.fillStyle='#bfe6ff';ctx.font='11px serif';ctx.fillText('👻',-w*.22,-h*.36);}return true;
}if(T==='chrono'){
ctx.strokeStyle=m.color;ctx.lineWidth=3;ctx.save();ctx.rotate(t*.7);ctx.beginPath();ctx.arc(0,-h*.52,w*.48,0,7);ctx.stroke();ctx.rotate(-t*1.5);ctx.beginPath();ctx.arc(0,-h*.52,w*.32,0,7);ctx.stroke();ctx.restore();
ctx.fillStyle=m.dark;ctx.beginPath();ctx.arc(0,-h*.52,w*.24,0,7);ctx.fill();ctx.strokeStyle=m.eye;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-h*.52);ctx.lineTo(Math.cos(t)*12,-h*.52+Math.sin(t)*12);ctx.stroke();return true;
}if(T==='magnet'){
ctx.fillStyle=m.dark;ctx.beginPath();ctx.ellipse(0,-h*.42,w*.52,h*.42,0,0,7);ctx.fill();ctx.strokeStyle=m.color;ctx.lineWidth=7;ctx.beginPath();ctx.arc(0,-h*.52,w*.3,.25,Math.PI*1.75);ctx.stroke();ctx.fillStyle=m.eye;ctx.fillRect(w*.18,-h*.5,5,4);
for(let i=0;i<(m.stored||0);i++){const a=t*2+i*2.1;ctx.fillStyle='#c9e4ff';ctx.beginPath();ctx.arc(Math.cos(a)*w*.6,-h*.5+Math.sin(a)*h*.45,3.5,0,7);ctx.fill();}return true;
}if(T==='builder'){
ctx.fillStyle=m.dark;ctx.fillRect(-w*.34,-h*.72,w*.68,h*.72);ctx.fillStyle=m.color;ctx.beginPath();ctx.arc(0,-h*.7,w*.38,Math.PI,0);ctx.fill();ctx.fillRect(-w*.42,-h*.7,w*.84,5);
ctx.strokeStyle='#d8c8a2';ctx.lineWidth=4;ctx.save();ctx.rotate(cast?Math.sin(t*18)*.7:-.45);ctx.beginPath();ctx.moveTo(w*.1,-h*.42);ctx.lineTo(w*.48,-h*.9);ctx.stroke();ctx.fillStyle='#8a745f';ctx.fillRect(w*.37,-h*.98,15,8);ctx.restore();ctx.fillStyle=m.eye;ctx.fillRect(7,-h*.6,4,3);return true;
}if(T==='cocoon'){
const pulse=1+Math.sin(time*7)*.08;ctx.fillStyle=m.dark;ctx.beginPath();ctx.ellipse(0,-h*.42,w*.46*pulse,h*.48/pulse,0,0,7);ctx.fill();ctx.strokeStyle=m.color;ctx.lineWidth=2;for(let y=-h*.75;y<-5;y+=7){ctx.beginPath();ctx.moveTo(-w*.36,y);ctx.lineTo(w*.36,y+5);ctx.stroke();}return true;
}if(T==='sporeling'){
ctx.fillStyle=m.dark;ctx.beginPath();ctx.ellipse(0,-h*.35,w*.4,h*.38,0,0,7);ctx.fill();ctx.fillStyle=m.color;ctx.beginPath();ctx.ellipse(0,-h*.72,w*.55,h*.25,0,0,7);ctx.fill();ctx.fillStyle=m.eye;ctx.fillRect(3,-h*.38,3,3);return true;
}if(T==='bastion'){
ctx.fillStyle=m.dark;ctx.fillRect(-w*.5,-h,w,h);ctx.strokeStyle=m.color;ctx.lineWidth=2;for(let y=-h+8;y<0;y+=12){ctx.beginPath();ctx.moveTo(-w*.5,y);ctx.lineTo(w*.5,y);ctx.stroke();}for(let y=-h+8;y<0;y+=24){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(0,y+12);ctx.stroke();}return true;
}return false;
}
function drawBossMechanics(m){
 if(m.type!=='boss')return;const i=m.bossIndex,cx=m.x,cy=m.y-m.h*.53,pulse=.5+.5*Math.sin(time*7);
 ctx.save();ctx.globalCompositeOperation='lighter';
 if(m.rageShieldT>0){ctx.strokeStyle=`rgba(255,238,190,${.5+pulse*.3})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,m.h*.68+5*pulse,0,7);ctx.stroke();}
 if(m.exposeT>0){ctx.strokeStyle=`rgba(255,255,255,${.35+pulse*.35})`;ctx.lineWidth=2;for(let k=0;k<6;k++){const an=k*1.047+time*.3;ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*m.w*.32,cy+Math.sin(an)*m.h*.3);ctx.lineTo(cx+Math.cos(an+.35)*m.w*.55,cy+Math.sin(an+.35)*m.h*.53);ctx.stroke();}}
 const n=m.rageShieldT>0?m.shieldNodes:0;
 if(i===1&&n)for(let k=0;k<n;k++){const an=time*2+k*6.283/n;ctx.save();ctx.translate(cx+Math.cos(an)*58,cy+Math.sin(an)*22);ctx.rotate(an);ctx.fillStyle='#e5f5ff';ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(-9,-5);ctx.lineTo(-3,0);ctx.lineTo(-9,5);ctx.closePath();ctx.fill();ctx.restore();}
 if(i===2&&n)for(let k=0;k<n;k++){ctx.fillStyle=`rgba(190,235,85,${.7+pulse*.25})`;ctx.beginPath();ctx.arc(cx+(k-1)*27,cy-10-Math.abs(k-1)*7,9+pulse*2,0,7);ctx.fill();}
 if(i===3){ctx.strokeStyle='#dce8ef';ctx.lineWidth=6;ctx.beginPath();ctx.arc(cx+m.face*30,cy,34,-1.15,1.15);ctx.stroke();}
 if(i===4&&n)for(let k=0;k<n;k++){const an=time*.7+k*6.283/n;ctx.globalAlpha=.35;ctx.fillStyle='#c9a0ff';ctx.beginPath();ctx.ellipse(cx+Math.cos(an)*90,cy+Math.sin(an)*28,18,32,0,0,7);ctx.fill();ctx.globalAlpha=1;}
 if(i===5&&(m.iceArmor>0||n))for(let k=0;k<7;k++){const an=k*6.283/7;ctx.strokeStyle=`rgba(190,240,255,${.3+(m.iceArmor/3)*.35+pulse*.2})`;ctx.lineWidth=3+m.iceArmor;ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*38,cy+Math.sin(an)*35);ctx.lineTo(cx+Math.cos(an+.28)*55,cy+Math.sin(an+.28)*50);ctx.stroke();}
 if(i===6){ctx.strokeStyle='#ffb05a';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(cx-m.face*20,cy-5);ctx.lineTo(cx+m.face*42,cy+16);ctx.stroke();ctx.fillStyle='#ffd27a';ctx.fillRect(cx+m.face*30-10,cy-10,22,28);}
 if(i===7&&n)for(let k=0;k<n;k++){const an=time*(k%2?-.8:.8)+k*6.283/n,x=cx+Math.cos(an)*65,y=cy+Math.sin(an)*42;ctx.strokeStyle='#bfa5ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,11,0,7);ctx.stroke();ctx.beginPath();ctx.moveTo(x-7,y);ctx.lineTo(x+7,y);ctx.moveTo(x,y-7);ctx.lineTo(x,y+7);ctx.stroke();}
 if(i===8){const cols=['#ffb36b','#d9d3c0','#9fd67a'],bits=[1,2,4];for(let k=0;k<3;k++)if(m.headMask&bits[k]){ctx.fillStyle=cols[k];ctx.beginPath();ctx.arc(cx+(k-1)*24,cy-26-Math.abs(k-1)*7,12,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(cx+(k-1)*24+4,cy-29-Math.abs(k-1)*7,2.5,0,7);ctx.fill();}}
 if(i===9&&n)for(let k=0;k<n;k++){const an=-Math.PI/2+k*6.283/n,x=cx+Math.cos(an)*68,y=cy+Math.sin(an)*48;ctx.strokeStyle='#ffd23f';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x-10,y+6);ctx.lineTo(x-7,y-8);ctx.lineTo(x,y);ctx.lineTo(x+7,y-10);ctx.lineTo(x+11,y+6);ctx.stroke();}
 ctx.globalCompositeOperation='source-over';ctx.restore();
}
