/* ========== АКТ I · УНИКАЛЬНЫЕ МОДЕЛИ БОССОВ И АНИМАЦИИ АТАК ========== */
function a1Poly(points,top,bottom,edge='rgba(245,245,255,.75)',lw=2){
 let lo=0,hi=0;for(const p of points){lo=Math.min(lo,p[1]);hi=Math.max(hi,p[1]);}
 const g=ctx.createLinearGradient(0,lo,0,hi||1);g.addColorStop(0,top);g.addColorStop(1,bottom);
 ctx.fillStyle=g;ctx.strokeStyle=edge;ctx.lineWidth=lw;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();ctx.stroke();
}
function a1Joint(x,y,r,fill,edge='rgba(255,255,255,.55)'){ctx.fillStyle=fill;ctx.strokeStyle=edge;ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.stroke();}
function a1Bone(x1,y1,x2,y2,w=7,col='#ddd7c7'){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.lineCap='butt';a1Joint(x1,y1,w*.42,col);a1Joint(x2,y2,w*.38,col);}
function a1Rune(x,y,r,col,rot=0,n=6){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.strokeStyle=col;ctx.lineWidth=1.8;ctx.beginPath();for(let k=0;k<n;k++){const a=-Math.PI/2+k*6.283/n,qx=Math.cos(a)*r,qy=Math.sin(a)*r;k?ctx.lineTo(qx,qy):ctx.moveTo(qx,qy);}ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(0,0,r*.48,0,7);ctx.stroke();ctx.restore();}
function a1Glow(x,y,r,col,a=.5){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(col,a));g.addColorStop(1,hexA(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.restore();}
function a1Feather(x,y,len,wid,ang,col='#d9e6f3'){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.fillStyle=col;ctx.strokeStyle='rgba(255,255,255,.65)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(len*.55,-wid,len,0);ctx.quadraticCurveTo(len*.55,wid,0,0);ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(50,70,95,.55)';ctx.beginPath();ctx.moveTo(2,0);ctx.lineTo(len-2,0);ctx.stroke();ctx.restore();}
function a1AttackPulse(m,col){
 const active=m.state==='windup'||m.sigPoseT>0||m.bossAtk,cy=-m.h*.55;if(!active)return;
 const q=1-clamp((m.sigPoseT||0)/1.1,0,1),p=.5+.5*Math.sin(time*16);
 ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(col,.28+p*.28);ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(0,cy,m.h*(.48+q*.18)+p*4,0,7);ctx.stroke();ctx.restore();
}
function drawMatriarch(m){
 const h=m.h,s=m.sigPose||'',flap=Math.sin(m.wobT*5),dive=s==='crossdive'||m.bossAtk==='charge',vortex=s==='wingvortex';
 ctx.save();ctx.translate(0,Math.sin(m.wobT*2)*3);if(dive)ctx.rotate(-.18);
 for(const side of [-1,1])for(let k=0;k<3;k++){
  const spread=vortex?1.35:(dive?.72:1),ang=side*((.18+k*.24)+flap*.07)*(dive?.45:1),x=side*(8+k*6),y=-h*.62+k*9;
  ctx.save();ctx.translate(x,y);ctx.rotate(ang);const rx=(50-k*7)*spread,ry=13+k*3;
  const g=ctx.createLinearGradient(0,-ry,rx,ry);g.addColorStop(0,'rgba(92,126,160,.92)');g.addColorStop(.7,'rgba(178,211,231,.72)');g.addColorStop(1,'rgba(238,248,255,.25)');ctx.fillStyle=g;ctx.strokeStyle='#bfe5f5';ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(side*rx*.55,0,rx,ry,0,0,7);ctx.fill();ctx.stroke();
  ctx.strokeStyle='rgba(245,252,255,.45)';ctx.lineWidth=1;for(let n=1;n<5;n++){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(side*rx*(.35+n*.14),(n-2.5)*ry*.28);ctx.stroke();}ctx.restore();
 }
 if(s==='returnfeathers')for(let k=0;k<7;k++){const a=time*2+k*.9;a1Feather(Math.cos(a)*52,-h*.55+Math.sin(a)*32,18,4,a,'#edf7ff');}
 a1Poly([[-28,-8],[-35,-34],[-27,-69],[-13,-89],[14,-89],[29,-66],[35,-31],[25,-7]],'#93b4cf','#263b55','#d9f0ff',2.2);
 ctx.fillStyle='#d8e7f1';ctx.strokeStyle='#36516d';ctx.lineWidth=2;for(let k=-3;k<=3;k++){ctx.beginPath();ctx.ellipse(k*7,-31+Math.abs(k)*2,8,20,k*.08,0,7);ctx.fill();ctx.stroke();}
 ctx.fillStyle='#536f8d';ctx.strokeStyle='#dceeff';ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(0,-76,24,0,7);ctx.fill();ctx.stroke();
 for(const side of [-1,1]){ctx.fillStyle='#e9f4fb';ctx.beginPath();ctx.moveTo(side*5,-92);ctx.lineTo(side*18,-112);ctx.lineTo(side*15,-85);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#ffd94a';ctx.beginPath();ctx.ellipse(side*9,-77,6,8,0,0,7);ctx.fill();a1Glow(side*9,-77,13,'#ffd94a',.35);}
 ctx.fillStyle='#182637';ctx.beginPath();ctx.moveTo(-5,-64);ctx.lineTo(0,-55);ctx.lineTo(6,-64);ctx.closePath();ctx.fill();
 for(const side of [-1,1]){a1Bone(side*12,-18,side*20,3,5,'#a9bfd0');ctx.fillStyle='#d8e6ee';for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(side*(17+k*5),0);ctx.lineTo(side*(26+k*7),7);ctx.lineTo(side*(19+k*5),5);ctx.closePath();ctx.fill();}}
 if(vortex){ctx.strokeStyle='rgba(210,242,255,.55)';ctx.lineWidth=3;for(let k=0;k<4;k++){ctx.beginPath();ctx.arc(0,-55,45+k*10,time*(k%2?-.8:.8)+k,time*(k%2?-.8:.8)+k+4.6);ctx.stroke();}}
 a1AttackPulse(m,'#bfeaff');ctx.restore();return true;
}
function drawBoneGeneral(m){
 const h=m.h,s=m.sigPose||'',spear=s==='bonespear',march=s==='deadmarch',wall=s==='bonewall',raise=spear||m.state==='windup';
 ctx.save();ctx.translate(0,Math.sin(m.wobT*1.5)*1.5);
 ctx.fillStyle='rgba(55,47,42,.72)';ctx.beginPath();ctx.moveTo(-27,-72);ctx.lineTo(-48,-5);ctx.lineTo(4,-14);ctx.closePath();ctx.fill();
 for(const side of [-1,1]){a1Bone(side*16,-50,side*(30+(raise?8:0)),-28-(raise?25:0),9,'#d9d3c0');a1Bone(side*(30+(raise?8:0)),-28-(raise?25:0),side*(34+(raise?18:0)),-4-(raise?42:0),7,'#d9d3c0');}
 a1Poly([[-31,-10],[-37,-56],[-24,-87],[0,-98],[27,-84],[36,-53],[29,-9]],'#77736c','#292726','#e5dfd0',2.4);
 ctx.fillStyle='#5a5650';ctx.strokeStyle='#d8d3c0';ctx.lineWidth=2;for(let y=-74;y<-24;y+=15){ctx.beginPath();ctx.moveTo(-27,y);ctx.quadraticCurveTo(0,y+8,29,y);ctx.lineTo(24,y+8);ctx.quadraticCurveTo(0,y+14,-24,y+8);ctx.closePath();ctx.fill();ctx.stroke();}
 ctx.fillStyle='#d8d3c0';ctx.strokeStyle='#514d48';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(0,-98,23,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#151414';ctx.beginPath();ctx.arc(-8,-101,5,0,7);ctx.arc(9,-101,5,0,7);ctx.fill();ctx.fillRect(-7,-88,14,5);
 ctx.fillStyle='#8d3030';ctx.beginPath();ctx.moveTo(-17,-117);ctx.lineTo(0,-137);ctx.lineTo(18,-117);ctx.lineTo(10,-111);ctx.lineTo(0,-124);ctx.lineTo(-10,-111);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#ded8c9';ctx.lineWidth=6;ctx.beginPath();ctx.arc(-33,-51,24,-1.2,1.25);ctx.stroke();ctx.strokeStyle='#8d3030';ctx.lineWidth=2;ctx.beginPath();ctx.arc(-33,-51,16,-1.2,1.25);ctx.stroke();
 const sy=raise?-111:-75,tipX=raise?58:70,tipY=raise?-132:-8;ctx.strokeStyle='#b8b1a1';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(31,-45);ctx.lineTo(tipX,tipY);ctx.stroke();ctx.fillStyle='#e9e4d8';ctx.beginPath();ctx.moveTo(tipX,tipY);ctx.lineTo(tipX-10,tipY+20);ctx.lineTo(tipX+8,tipY+14);ctx.closePath();ctx.fill();ctx.stroke();
 if(march){ctx.fillStyle='rgba(130,35,35,.7)';ctx.beginPath();ctx.moveTo(-3,-117);ctx.lineTo(64,-151);ctx.lineTo(59,-91);ctx.lineTo(4,-105);ctx.closePath();ctx.fill();ctx.strokeStyle='#d8b46a';ctx.stroke();}
 if(wall)for(let k=-2;k<=2;k++){const x=k*24,y=-8-Math.abs(k)*5;ctx.fillStyle='rgba(220,215,202,.45)';ctx.beginPath();ctx.moveTo(x-8,y);ctx.lineTo(x,y-42);ctx.lineTo(x+8,y);ctx.closePath();ctx.fill();}
 a1AttackPulse(m,'#e8dfc7');ctx.restore();return true;
}
function drawGhostKing(m){
 const h=m.h,s=m.sigPose||'',hands=s==='ghosthands',beam=s==='gravebeam',mirror=s==='mirrorswap',lift=Math.sin(m.wobT*1.8)*4;
 ctx.save();ctx.translate(0,lift);ctx.globalAlpha=.88;
 if(mirror)for(const side of [-1,1]){ctx.globalAlpha=.22;ctx.fillStyle='#c9a0ff';ctx.beginPath();ctx.ellipse(side*48,-58,28,55,0,0,7);ctx.fill();ctx.globalAlpha=.88;}
 const robe=ctx.createLinearGradient(0,-105,0,0);robe.addColorStop(0,'rgba(210,190,255,.92)');robe.addColorStop(.65,'rgba(88,57,130,.72)');robe.addColorStop(1,'rgba(28,15,55,0)');ctx.fillStyle=robe;ctx.strokeStyle='#d9c8ff';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-24,-91);ctx.bezierCurveTo(-56,-61,-51,-18,-70,1);ctx.quadraticCurveTo(-35,-13,0,0);ctx.quadraticCurveTo(35,-13,70,1);ctx.bezierCurveTo(49,-18,57,-63,24,-91);ctx.closePath();ctx.fill();ctx.stroke();
 for(const side of [-1,1]){const ex=side*(hands?74:44),ey=hands?-18:-53;a1Bone(side*18,-72,side*34,-53,7,'#ad8cd4');a1Bone(side*34,-53,ex,ey,6,'#cbb5ed');ctx.fillStyle='#e5d8ff';for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(ex+side*k*4,ey+k*2,7,2.2,side*.3,0,7);ctx.fill();}}
 ctx.fillStyle='#e4d8f5';ctx.strokeStyle='#72509c';ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(0,-99,22,27,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#28173d';ctx.beginPath();ctx.ellipse(-8,-101,5,7,0,0,7);ctx.ellipse(9,-101,5,7,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(0,-89,7,4,0,0,7);ctx.fill();
 ctx.fillStyle='#d7b45f';ctx.strokeStyle='#fff0b0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-25,-116);ctx.lineTo(-17,-142);ctx.lineTo(-5,-124);ctx.lineTo(0,-151);ctx.lineTo(8,-124);ctx.lineTo(20,-143);ctx.lineTo(25,-116);ctx.closePath();ctx.fill();ctx.stroke();
 if(beam){for(let k=-1;k<=1;k++){const a=k*.28;ctx.strokeStyle='rgba(210,175,255,.5)';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,-99);ctx.lineTo(Math.cos(a)*110,-99+Math.sin(a)*110);ctx.stroke();}}
 for(let k=0;k<(m.phase>=3?7:4);k++){const a=time*(k%2?-.35:.35)+k*1.7;a1Rune(Math.cos(a)*47,-67+Math.sin(a)*31,6,'rgba(220,200,255,.62)',a,4);}
 a1Glow(0,-99,42,'#b48aff',m.phase>=3?.62:.3);a1AttackPulse(m,'#c9a0ff');ctx.globalAlpha=1;ctx.restore();return true;
}
function drawIceGolem(m){
 const h=m.h,s=m.sigPose||'',roll=s==='iceroll'||m.bossAtk==='charge',pillars=s==='icepillars',grip=s==='frostgrip',crush=m.state==='windup';
 ctx.save();ctx.translate(0,roll?Math.sin(time*18)*3:0);if(roll)ctx.rotate(time*4*m.face);
 for(const side of [-1,1]){const ex=side*(grip?54:39),ey=grip?-64:-28;a1Poly([[side*18,-72],[side*37,-67],[ex+(side*-9),ey-13],[ex+side*12,ey],[side*31,-38]],'#d8f7ff','#39728e','#effcff',2);a1Joint(ex,ey,11,'#8edbf3','#eaffff');}
 a1Poly([[-38,-10],[-47,-50],[-33,-89],[0,-113],[34,-88],[48,-48],[37,-9]],'#bdeeff','#315d78','#effcff',2.7);
 const plates=[[[-27,-74],[-8,-100],[4,-71],[-8,-47]],[[-3,-72],[17,-99],[29,-69],[15,-42]],[[-30,-42],[-8,-47],[-12,-13],[-35,-10]],[[10,-42],[34,-48],[35,-10],[8,-14]]];for(const q of plates)a1Poly(q,'#dff9ff','#5596b5','#eaffff',1.5);
 ctx.fillStyle='#17384f';ctx.strokeStyle='#e8fdff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-19,-95);ctx.lineTo(0,-127);ctx.lineTo(20,-94);ctx.lineTo(13,-71);ctx.lineTo(-13,-71);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#ffffff';ctx.beginPath();ctx.ellipse(7,-99,4,8,0,0,7);ctx.fill();a1Glow(7,-99,18,'#8fe0ff',.65);
 for(let k=0;k<9;k++){const a=k*6.283/9,r=44+(k%2)*8;ctx.fillStyle=k%2?'#87c9e5':'#d9f8ff';ctx.beginPath();ctx.moveTo(Math.cos(a)*r,-60+Math.sin(a)*r);ctx.lineTo(Math.cos(a+.17)*(r+18),-60+Math.sin(a+.17)*(r+18));ctx.lineTo(Math.cos(a+.3)*r,-60+Math.sin(a+.3)*r);ctx.closePath();ctx.fill();}
 if(pillars)for(let k=-2;k<=2;k++){ctx.fillStyle='rgba(190,240,255,.45)';ctx.beginPath();ctx.moveTo(k*29-8,0);ctx.lineTo(k*29,-55-Math.abs(k)*9);ctx.lineTo(k*29+9,0);ctx.closePath();ctx.fill();}
 if(crush)a1Glow(0,-58,70,'#dffaff',.38);a1AttackPulse(m,'#bdefff');ctx.restore();return true;
}
function drawDemonSmith(m){
 const h=m.h,s=m.sigPose||'',chain=s==='forgechain',anvil=s==='anvil',forge=s==='weaponforge',raise=anvil||m.state==='windup';
 ctx.save();ctx.translate(0,Math.sin(m.wobT*1.4));
 ctx.fillStyle='rgba(40,10,5,.8)';ctx.beginPath();ctx.moveTo(-31,-78);ctx.lineTo(-65,-4);ctx.lineTo(7,-15);ctx.closePath();ctx.fill();
 a1Poly([[-36,-8],[-45,-59],[-27,-100],[0,-116],[31,-98],[46,-55],[36,-7]],'#5d453d','#1b1110','#e17642',2.5);
 ctx.fillStyle='#222025';ctx.strokeStyle='#ff8a3d';ctx.lineWidth=2;for(let y=-86;y<-25;y+=18){ctx.beginPath();ctx.moveTo(-31,y);ctx.lineTo(31,y);ctx.lineTo(26,y+11);ctx.lineTo(-27,y+11);ctx.closePath();ctx.fill();ctx.stroke();}
 ctx.fillStyle='#0d0909';ctx.strokeStyle='#ffb05a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-21,-105);ctx.lineTo(0,-136);ctx.lineTo(23,-105);ctx.lineTo(17,-80);ctx.lineTo(-17,-80);ctx.closePath();ctx.fill();ctx.stroke();for(const side of [-1,1]){ctx.fillStyle='#8d3c24';ctx.beginPath();ctx.moveTo(side*15,-117);ctx.lineTo(side*42,-147);ctx.lineTo(side*27,-103);ctx.closePath();ctx.fill();ctx.stroke();}
 ctx.fillStyle='#ffd23f';ctx.beginPath();ctx.arc(8,-105,4,0,7);ctx.fill();a1Glow(0,-61,28,'#ff6a3d',.65);ctx.fillStyle='#ff9d45';ctx.beginPath();ctx.arc(0,-61,10,0,7);ctx.fill();
 const hx=raise?13:56,hy=raise?-143:-33;a1Bone(22,-68,hx,hy,12,'#6b3f30');ctx.strokeStyle='#8b6045';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(hx+(raise?0:28),hy+(raise?37:-10));ctx.stroke();ctx.fillStyle='#3e3d42';ctx.strokeStyle='#ff9a55';ctx.lineWidth=2.5;ctx.save();ctx.translate(hx+(raise?0:31),hy+(raise?-8:-10));ctx.rotate(raise?0:.8);ctx.fillRect(-20,-11,40,22);ctx.strokeRect(-20,-11,40,22);ctx.restore();
 if(chain){ctx.strokeStyle='#ffb05a';ctx.lineWidth=4;for(let k=0;k<9;k++){ctx.beginPath();ctx.ellipse(35+k*14,-55+k*3,8,5,k%2?0:1.57,0,7);ctx.stroke();}}
 if(forge){const forms=['⚔','◆','●'],q=m.forgeForm||0;ctx.font='bold 30px serif';ctx.fillStyle='#fff1b0';ctx.fillText(forms[q],-13,-145);a1Glow(0,-151,32,'#ff8a3d',.7);}
 a1AttackPulse(m,'#ff9d45');ctx.restore();return true;
}
function drawArchmage(m){
 const h=m.h,s=m.sigPose||'',portal=s==='portalshot',rune=s==='delayrune',fan=s==='reversefan',cast=m.state==='windup'||m.sigPoseT>0;
 ctx.save();ctx.translate(0,Math.sin(m.wobT*2)*4);
 ctx.fillStyle='rgba(25,22,68,.82)';ctx.strokeStyle='#aaa6ff';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-24,-94);ctx.bezierCurveTo(-58,-65,-48,-16,-67,0);ctx.lineTo(0,-14);ctx.lineTo(67,0);ctx.bezierCurveTo(49,-16,57,-65,24,-94);ctx.closePath();ctx.fill();ctx.stroke();
 for(const side of [-1,1])for(let k=0;k<2;k++){const a=time*(side*.7)+k*Math.PI,ex=side*(45+k*14),ey=-65+Math.sin(a)*16;a1Bone(side*13,-76+k*11,ex,ey,6,'#a7a3d8');ctx.fillStyle='#dedcff';ctx.beginPath();ctx.arc(ex,ey,6,0,7);ctx.fill();}
 ctx.fillStyle='#171538';ctx.strokeStyle='#cbc8ff';ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(0,-104,21,28,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#ffd23f';ctx.beginPath();ctx.arc(-8,-105,3,0,7);ctx.arc(9,-105,3,0,7);ctx.fill();
 ctx.fillStyle='#2e2b66';ctx.strokeStyle='#8a8aff';ctx.beginPath();ctx.moveTo(-31,-113);ctx.lineTo(0,-157);ctx.lineTo(32,-113);ctx.lineTo(15,-119);ctx.lineTo(0,-142);ctx.lineTo(-15,-119);ctx.closePath();ctx.fill();ctx.stroke();
 const rings=m.phase>=3?4:3;for(let k=0;k<rings;k++){const a=time*(k%2?-.55:.55)+k;ctx.strokeStyle=['#8a8aff','#d4a7ff','#8fe0ff','#ffd27a'][k];ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-87,38+k*10,16+k*8,a,0,7);ctx.stroke();for(let n=0;n<3;n++){const q=a+n*2.094,x=Math.cos(q)*(38+k*10),y=-87+Math.sin(q)*(16+k*8);a1Rune(x,y,4,ctx.strokeStyle,q,5);}}
 if(portal)for(const side of [-1,1]){ctx.strokeStyle='#b58aff';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(side*68,-68,15,36,time*side,0,7);ctx.stroke();}
 if(rune){a1Rune(0,3,45,'#ffd27a',time,8);a1Glow(0,0,55,'#8a8aff',.45);}
 if(fan)for(let k=-2;k<=2;k++){const a=Math.PI+k*.24;a1Rune(Math.cos(a)*62,-87+Math.sin(a)*62,7,'#c7b4ff',a,4);}
 a1Glow(0,-104,33,'#8a8aff',cast?.62:.28);a1AttackPulse(m,'#b9aaff');ctx.restore();return true;
}
function drawChimera(m){
 const h=m.h,s=m.sigPose||'',lion=s==='lioncombo',goat=s==='goatfan',serpent=s==='serpenttrail',mask=m.headMask==null?7:m.headMask;
 ctx.save();ctx.translate(0,Math.sin(m.wobT*1.5));
 for(const side of [-1,1]){a1Bone(side*21,-39,side*(32+(lion?10:0)),-4,10,'#8e4b43');ctx.fillStyle='#3d2027';ctx.beginPath();ctx.ellipse(side*35,-2,17,6,0,0,7);ctx.fill();}
 a1Poly([[-43,-15],[-50,-54],[-31,-91],[0,-104],[35,-88],[50,-50],[41,-14]],'#b85f66','#3b202b','#e99a84',2.2);
 for(let k=0;k<14;k++){const a=k*6.283/14,x=Math.cos(a)*42,y=-66+Math.sin(a)*37;ctx.fillStyle=k%2?'#e18567':'#6e3439';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(Math.cos(a-.12)*57,-66+Math.sin(a-.12)*50);ctx.lineTo(Math.cos(a+.12)*57,-66+Math.sin(a+.12)*50);ctx.closePath();ctx.fill();}
 if(mask&1){ctx.fillStyle='#c77257';ctx.strokeStyle='#ffd2a6';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-82,24,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#ffd94a';ctx.beginPath();ctx.arc(8,-85,4,0,7);ctx.fill();ctx.fillStyle='#29151a';ctx.beginPath();ctx.ellipse(8,-70,9,5,0,0,7);ctx.fill();if(lion){ctx.strokeStyle='#ffb36b';ctx.lineWidth=5;for(let k=-1;k<=1;k++){ctx.beginPath();ctx.arc(36+k*24,-46,28,-1.5,1.3);ctx.stroke();}}}
 if(mask&2){ctx.save();ctx.translate(-25,-95);ctx.rotate(-.28);ctx.fillStyle='#d4c8b8';ctx.strokeStyle='#fff0d8';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,14,24,0,0,7);ctx.fill();ctx.stroke();ctx.strokeStyle='#a98768';ctx.lineWidth=5;ctx.beginPath();ctx.arc(-10,-19,17,2.4,5.9);ctx.arc(10,-19,17,3.5,.7);ctx.stroke();ctx.fillStyle='#ffd94a';ctx.beginPath();ctx.arc(5,-3,3,0,7);ctx.fill();ctx.restore();if(goat)for(let k=-4;k<=4;k++)a1Rune(-25+Math.cos(k*.3)*55,-95+Math.sin(k*.3)*55,4,'#e7ddc9',k,4);}
 if(mask&4){ctx.strokeStyle='#6d9f65';ctx.lineWidth=13;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(30,-57);ctx.bezierCurveTo(65,-80,85,-39,55,-18);ctx.stroke();ctx.lineCap='butt';ctx.fillStyle='#94c779';ctx.beginPath();ctx.moveTo(52,-25);ctx.lineTo(82,-31);ctx.lineTo(64,-9);ctx.closePath();ctx.fill();ctx.fillStyle='#ffd94a';ctx.beginPath();ctx.arc(68,-24,3,0,7);ctx.fill();if(serpent){ctx.strokeStyle='rgba(150,220,105,.5)';ctx.lineWidth=4;for(let k=0;k<4;k++){ctx.beginPath();ctx.arc(63+k*25,-13,22+k*4,time+k,time+k+4.7);ctx.stroke();}}}
 if(m.phase>=3)a1Glow(0,-64,75,'#ff5d6b',.35);a1AttackPulse(m,'#ff9b83');ctx.restore();return true;
}
function drawHallLord(m){
 const h=m.h,s=m.sigPose||'',royal=s==='royalcombo',judge=s==='judgment',borrow=s==='borrowed',raise=judge||m.state==='windup';
 ctx.save();ctx.translate(0,Math.sin(m.wobT*1.3));ctx.fillStyle='#2a0710';ctx.beginPath();ctx.moveTo(-32,-92);ctx.lineTo(-68,-1);ctx.lineTo(0,-17);ctx.lineTo(68,-1);ctx.lineTo(32,-92);ctx.closePath();ctx.fill();ctx.strokeStyle='#a92724';ctx.lineWidth=3;ctx.stroke();
 a1Poly([[-38,-9],[-46,-61],[-28,-105],[0,-121],[31,-103],[47,-58],[38,-8]],'#8d2526','#250b10','#ff6950',2.6);
 ctx.fillStyle='#31151b';ctx.strokeStyle='#d64b36';ctx.lineWidth=2;for(let y=-88;y<-25;y+=17){ctx.beginPath();ctx.moveTo(-33,y);ctx.lineTo(33,y);ctx.lineTo(27,y+11);ctx.lineTo(-28,y+11);ctx.closePath();ctx.fill();ctx.stroke();}
 ctx.fillStyle='#21080e';ctx.strokeStyle='#ff7254';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-111,21,27,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#ff5030';ctx.beginPath();ctx.arc(8,-113,4,0,7);ctx.fill();a1Glow(8,-113,18,'#ff5030',.65);
 ctx.fillStyle='#ffd23f';ctx.strokeStyle='#fff0a0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-27,-128);ctx.lineTo(-20,-157);ctx.lineTo(-7,-137);ctx.lineTo(0,-166);ctx.lineTo(10,-137);ctx.lineTo(22,-158);ctx.lineTo(27,-128);ctx.closePath();ctx.fill();ctx.stroke();
 const sx=raise?10:45,sy=raise?-155:-49;a1Bone(23,-73,sx,sy,10,'#71302a');ctx.strokeStyle='#ffb15f';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+(raise?0:37),sy+(raise?-13:14));ctx.stroke();ctx.fillStyle='#e04932';ctx.beginPath();ctx.moveTo(sx+(raise?-14:32),sy+(raise?-24:5));ctx.lineTo(sx+(raise?14:51),sy+(raise?-24:17));ctx.lineTo(sx+(raise?8:40),sy+(raise?3:26));ctx.lineTo(sx+(raise?-8:25),sy+(raise?3:14));ctx.closePath();ctx.fill();ctx.stroke();
 if(royal){ctx.strokeStyle='rgba(255,190,90,.62)';ctx.lineWidth=7;for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(35+k*20,-55+k*12,42+k*12,-1.7,.9);ctx.stroke();}}
 if(judge){for(let k=0;k<8;k++){const a=k*6.283/8;a1Rune(Math.cos(a)*72,-76+Math.sin(a)*54,7,'#ffd23f',a,5);}a1Glow(0,-116,85,'#ff6a3d',.45);}
 if(borrow){const cols=['#bfeaff','#d8d3c0','#9fd67a','#b48aff'];for(let k=0;k<4;k++){const a=time*.7+k*1.57;a1Rune(Math.cos(a)*62,-76+Math.sin(a)*38,9,cols[k],-a,6);}}
 a1AttackPulse(m,'#ff8a55');ctx.restore();return true;
}
function drawAct1BossModel(m){
 if(m.type!=='boss'||m.bossIndex>=ACT1_LEN)return false;
 switch(m.bossIndex){
  case 1:return drawMatriarch(m);
  case 3:return drawBoneGeneral(m);
  case 4:return drawGhostKing(m);
  case 5:return drawIceGolem(m);
  case 6:return drawDemonSmith(m);
  case 7:return drawArchmage(m);
  case 8:return drawChimera(m);
  case 9:return drawHallLord(m);
 }
 return false;
}
