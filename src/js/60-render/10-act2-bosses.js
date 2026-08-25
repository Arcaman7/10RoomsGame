/* ================= АКТ II · ДЕТАЛИЗИРОВАННЫЕ МОДЕЛИ БОССОВ =================
   Все модели собраны из Canvas-примитивов и намеренно не используют общий
   эллипсоидный силуэт боссов первого акта. Координаты локальные: (0,0) — опора. */
function a2Plate(points,c1,c2,edge='#e8f4ff'){
let minY=0,maxY=0;for(const p of points){minY=Math.min(minY,p[1]);maxY=Math.max(maxY,p[1]);}
const g=ctx.createLinearGradient(0,minY,0,maxY||1);g.addColorStop(0,c1);g.addColorStop(1,c2);ctx.fillStyle=g;ctx.strokeStyle=edge;ctx.lineWidth=2;
ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();ctx.stroke();
}
function a2Limb(x1,y1,x2,y2,w,col,joint='#e8eef0'){
ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.lineCap='butt';
ctx.fillStyle=joint;ctx.strokeStyle='rgba(15,20,28,.75)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x1,y1,w*.34,0,7);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(x2,y2,w*.3,0,7);ctx.fill();ctx.stroke();
}
function a2Glow(x,y,r,col,a=.7){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(col,a));g.addColorStop(1,hexA(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.restore();}
function a2Wing(x,y,rx,ry,rot,col,veins=4){ctx.save();ctx.translate(x,y);ctx.rotate(rot);const g=ctx.createLinearGradient(-rx,0,rx,0);g.addColorStop(0,hexA(col,.18));g.addColorStop(.55,hexA(col,.72));g.addColorStop(1,hexA('#ffffff',.12));ctx.fillStyle=g;ctx.strokeStyle=hexA(col,.9);ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,7);ctx.fill();ctx.stroke();ctx.strokeStyle=hexA('#ffffff',.38);ctx.lineWidth=1;for(let k=1;k<veins;k++){const q=k/veins;ctx.beginPath();ctx.moveTo(-rx,0);ctx.quadraticCurveTo(0,(q-.5)*ry*1.5,rx*(1-q*.15),(q-.5)*ry);ctx.stroke();}ctx.restore();}
function a2Cable(points,w,col){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.lineCap='butt';}
function a2Rivets(list,col='#e9d7a6'){ctx.fillStyle=col;for(const p of list){ctx.beginPath();ctx.arc(p[0],p[1],2.2,0,7);ctx.fill();}}
function a2Cracks(list,col='#6aa7e8'){ctx.strokeStyle=col;ctx.lineWidth=1.6;ctx.beginPath();list.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();}
function a2BossPhaseAura(m,col){if(m.phase<2)return;const p=.5+.5*Math.sin(time*6);ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(col,m.phase>=3?.65:.32);ctx.lineWidth=m.phase>=3?4:2;for(let k=0;k<(m.phase>=3?3:1);k++){ctx.beginPath();ctx.arc(0,-m.h*.52,m.h*(.52+k*.1)+p*4,time*(k%2?-.5:.5)+k,time*(k%2?-.5:.5)+k+4.9);ctx.stroke();}ctx.restore();}
function drawAct2BossModel(m){
if(m.type!=='boss'||m.bossIndex<ACT1_LEN)return false;
const j=m.bossIndex-ACT1_LEN,w=m.w,h=m.h,cy=-h*.53,idle=Math.sin(m.wobT*1.7+j)*3,wind=(m.state==='windup'||m.sigPoseT>0)?1:0,p2=m.phase>=2,p3=m.phase>=3;
ctx.save();ctx.translate(0,idle);ctx.lineJoin='round';
if(j===0){/* Адмирал Сифон · краб-водолаз, насос и якорная клешня */
 for(const s of [-1,1])for(let k=0;k<3;k++){const y=-18-k*12,a=s*(38+k*5),b=s*(66+k*8);a2Limb(s*25,y-25,a,y-8,b<0?9:9,'#2b6870','#b88a52');a2Limb(a,y-8,b,2-k*5,7,'#245159','#d7a85f');}
 a2Cable([[-34,-62],[-58,-82],[-70,-57-wind*8],[-84,-43]],5,'#354950');
 ctx.strokeStyle='#907148';ctx.lineWidth=4;for(let k=0;k<5;k++){ctx.beginPath();ctx.arc(-83,-36+k*7,9,-1.2,1.2);ctx.stroke();}
 a2Plate([[-47,-24],[-57,-60],[-36,-91],[5,-103],[44,-82],[53,-38],[31,-19]],'#4dbfc5','#163f49','#b8edf0');
 ctx.fillStyle='#a56f3c';ctx.strokeStyle='#e5b66d';ctx.lineWidth=3;ctx.beginPath();ctx.arc(-3,-76,27,Math.PI,0);ctx.lineTo(24,-43);ctx.lineTo(-30,-43);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle='rgba(35,92,105,.78)';ctx.beginPath();ctx.arc(-3,-70,18,0,7);ctx.fill();ctx.strokeStyle='#d9b16f';ctx.lineWidth=5;ctx.stroke();a2Glow(-3,-70,18,'#8ff9ff',.45);
 ctx.fillStyle='#ffe27a';for(const x of [-9,3]){ctx.beginPath();ctx.arc(x,-72,2.8,0,7);ctx.fill();}
 /* насос справа */ctx.fillStyle='#7e5937';ctx.strokeStyle='#ecc37c';ctx.lineWidth=3;ctx.fillRect(29,-82,29,45);ctx.strokeRect(29,-82,29,45);for(let y=-75;y<-39;y+=9)ctx.fillRect(34,y,20,3);a2Cable([[53,-55],[74,-65],[82,-45]],7,'#7a4e2d');
 ctx.fillStyle='#c99a5d';ctx.beginPath();ctx.moveTo(70,-54);ctx.lineTo(94,-67);ctx.lineTo(85,-42);ctx.lineTo(101,-30);ctx.lineTo(73,-31);ctx.closePath();ctx.fill();ctx.stroke();a2Rivets([[-35,-52],[38,-73],[40,-29],[17,-93]]);
}else if(j===1){/* Бледный Цензор · мантия из листов и шесть перьевых рук */
 for(let k=0;k<6;k++){const side=k<3?-1:1,q=k%3,y=-88+q*24,x=side*(22+q*5),tx=side*(62+wind*15),ty=y+(q-1)*16;a2Limb(x,y,tx,ty,7,'#b8aa96','#f1ead9');ctx.save();ctx.translate(tx,ty);ctx.rotate(side*(.25+q*.18));ctx.fillStyle=q===1?'#15121a':'#2d2632';ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(side*30,-10,side*42,0);ctx.quadraticCurveTo(side*27,9,0,4);ctx.closePath();ctx.fill();ctx.restore();}
 a2Plate([[-42,-5],[-55,-57],[-37,-116],[0,-130],[37,-116],[55,-57],[42,-5]],'#f2ead8','#8e8479','#2c2630');
 /* страницы мантии */for(let k=-2;k<=2;k++){ctx.fillStyle=k%2?'#d6cdbc':'#eee5d2';ctx.strokeStyle='#5b5153';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(k*18-13,-55);ctx.lineTo(k*18+11,-58);ctx.lineTo(k*16+16,-8);ctx.lineTo(k*16-12,-4);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#40363f';for(let y=-47;y<-15;y+=9)ctx.fillRect(k*17-7,y,14,1);}
 ctx.fillStyle='#faf5e9';ctx.strokeStyle='#17131b';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-104,24,31,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#17131b';ctx.fillRect(-13,-108,26,5);ctx.fillRect(-8,-96,16,3);a2Glow(0,-104,34,p3?'#ffdf8a':'#eee6d5',p3?.55:.22);
 if(p2){ctx.strokeStyle='#1d1720';ctx.lineWidth=3;for(let k=0;k<4;k++){const an=time*.25+k*1.57;ctx.beginPath();ctx.arc(0,-101,38+k*6,an,an+1);ctx.stroke();}}
}else if(j===2){/* Прима · фарфоровая марионетка */
 ctx.strokeStyle='rgba(245,225,210,.52)';ctx.lineWidth=1.5;for(const x of [-25,-9,9,25]){ctx.beginPath();ctx.moveTo(x,-H);ctx.lineTo(x+(wind?Math.sin(time*9+x)*10:0),-68);ctx.stroke();}
 /* платье каркасом */a2Plate([[-45,-8],[-54,-52],[-30,-80],[0,-69],[30,-80],[54,-52],[45,-8]],'#7d1838','#240916','#f1b5c1');for(let k=-3;k<=3;k++){ctx.strokeStyle='#f2a9b8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(k*9,-65);ctx.lineTo(k*13,-9);ctx.stroke();}
 a2Limb(-24,-70,-52,-47-wind*10,8,'#e8d9d2','#8f2c49');a2Limb(-52,-47-wind*10,-60,-22,7,'#eaded7','#8f2c49');a2Limb(24,-70,55,-48+wind*8,8,'#e8d9d2','#8f2c49');a2Limb(55,-48+wind*8,67,-29,7,'#eaded7','#8f2c49');
 ctx.fillStyle='#f4e8df';ctx.strokeStyle='#5c1930';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-100,23,30,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#2a0d1a';ctx.beginPath();ctx.ellipse(0,-103,9,14,0,0,7);ctx.fill();ctx.strokeStyle='#efb8c5';ctx.beginPath();ctx.moveTo(-5,-112);ctx.lineTo(7,-94);ctx.moveTo(6,-111);ctx.lineTo(-7,-94);ctx.stroke();
 /* ножницы-нимб */ctx.strokeStyle='#e6d2c5';ctx.lineWidth=3;for(const s of [-1,1]){ctx.beginPath();ctx.ellipse(s*17,-134,8,12,s*.35,0,7);ctx.stroke();ctx.beginPath();ctx.moveTo(s*12,-125);ctx.lineTo(-s*38,-84);ctx.stroke();}if(p3){for(let k=0;k<5;k++)a2Glow(Math.sin(k*2.31)*34,-68+Math.cos(k*1.77)*43,6,'#ff6e93',.35);}
}else if(j===3){/* Шестигранная Матка · сегментированная пчела-витраж */
 const flap=Math.sin(m.wobT*4)*.18;for(const s of [-1,1])for(let k=0;k<3;k++)a2Wing(s*18,-76+k*14,48-k*5,16+k*2,s*(.45+k*.22+flap),'#ffe275',5);
 ctx.save();ctx.translate(0,-54);ctx.rotate(Math.PI/2);for(let k=0;k<4;k++){ctx.fillStyle=k%2?'#3b2410':'#d99818';ctx.strokeStyle='#ffdf6a';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(-24+k*11,-31,31,62,12);ctx.fill();ctx.stroke();}ctx.restore();
 a2Plate([[-31,-72],[-24,-111],[0,-128],[27,-107],[32,-71],[0,-53]],'#f0b52b','#6e3d0b','#ffe994');
 ctx.fillStyle='#271807';ctx.beginPath();ctx.arc(-9,-100,7,0,7);ctx.arc(10,-100,7,0,7);ctx.fill();ctx.fillStyle='#fff3a0';ctx.beginPath();ctx.arc(-7,-102,2.5,0,7);ctx.arc(12,-102,2.5,0,7);ctx.fill();
 /* корона-соты */ctx.strokeStyle='#fff0a0';ctx.lineWidth=3;for(let k=-2;k<=2;k++){const x=k*11;ctx.beginPath();for(let n=0;n<6;n++){const an=n*1.047,x1=x+Math.cos(an)*8,y1=-132+Math.sin(an)*8;n?ctx.lineTo(x1,y1):ctx.moveTo(x1,y1);}ctx.closePath();ctx.stroke();}if(p3){ctx.fillStyle='rgba(255,210,50,.25)';ctx.fillRect(-55,-105,110,78);}
}else if(j===4){/* Садовник · древесный олень с сезонными рогами */
 for(const s of [-1,1]){a2Limb(s*20,-35,s*31,-4,10,'#523b24','#8a6d3d');ctx.strokeStyle='#49351f';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(s*13,-92);ctx.lineTo(s*27,-128);ctx.lineTo(s*48,-151);ctx.moveTo(s*28,-126);ctx.lineTo(s*55,-119);ctx.moveTo(s*38,-141);ctx.lineTo(s*34,-165);ctx.stroke();}
 a2Plate([[-38,-10],[-46,-55],[-28,-103],[0,-121],[29,-103],[44,-52],[36,-11]],'#91a94c','#3d311d','#d9e58a');
 /* кора */ctx.strokeStyle='#5e4628';ctx.lineWidth=4;for(let x=-25;x<=25;x+=12){ctx.beginPath();ctx.moveTo(x,-102);ctx.bezierCurveTo(x-8,-75,x+9,-45,x-4,-12);ctx.stroke();}
 ctx.fillStyle='#493821';ctx.beginPath();ctx.moveTo(-18,-111);ctx.lineTo(0,-137);ctx.lineTo(18,-111);ctx.lineTo(13,-88);ctx.lineTo(-13,-88);ctx.closePath();ctx.fill();ctx.fillStyle='#fff49a';ctx.beginPath();ctx.arc(8,-111,4,0,7);ctx.fill();
 const leafCols=p3?['#89e06a','#ffd34e','#ff765f','#dff6ff']:['#89c857','#e6db6c','#bd7650','#a8d9df'];for(let k=0;k<18;k++){const s=k%2?-1:1,x=s*(25+(k%5)*8),y=-120-(k%4)*12;ctx.fillStyle=leafCols[k%4];ctx.beginPath();ctx.ellipse(x,y,7,3.5,s*.4,0,7);ctx.fill();}
}else if(j===5){/* Капитан Висячего Флота · нос корабля, мачта, призрачный офицер */
 ctx.fillStyle='#233f4d';ctx.strokeStyle='#b9eaff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-64,-12);ctx.lineTo(58,-12);ctx.lineTo(82,-39);ctx.lineTo(25,-50);ctx.lineTo(-50,-43);ctx.closePath();ctx.fill();ctx.stroke();for(let x=-40;x<50;x+=18){ctx.strokeStyle='#8d6d4c';ctx.beginPath();ctx.moveTo(x,-42);ctx.lineTo(x+5,-14);ctx.stroke();}
 ctx.strokeStyle='#72563d';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(4,-42);ctx.lineTo(4,-144);ctx.stroke();a2Cable([[3,-124],[55,-108],[4,-67]],2,'#d8c39b');
 ctx.fillStyle=hexA('#dff8ff',.48);ctx.strokeStyle='#c2edff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(8,-137);ctx.quadraticCurveTo(55,-128,58,-93);ctx.lineTo(8,-100);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(0,-118);ctx.quadraticCurveTo(-45,-112,-55,-78);ctx.lineTo(0,-88);ctx.closePath();ctx.fill();ctx.stroke();
 /* капитан */a2Plate([[-25,-43],[-32,-91],[-18,-126],[12,-129],[29,-91],[23,-43]],'#56859b','#172d39','#c9efff');ctx.fillStyle='#d4edf2';ctx.beginPath();ctx.arc(-1,-130,17,0,7);ctx.fill();ctx.fillStyle='#213746';ctx.beginPath();ctx.moveTo(-23,-137);ctx.lineTo(22,-137);ctx.lineTo(8,-153);ctx.lineTo(-6,-150);ctx.closePath();ctx.fill();ctx.strokeStyle='#ffd59a';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#ffe0a0';ctx.beginPath();ctx.arc(6,-132,3,0,7);ctx.fill();
 a2Limb(21,-98,56,-72-wind*12,8,'#486e80','#d7edf0');ctx.strokeStyle='#65717a';ctx.lineWidth=4;ctx.beginPath();ctx.arc(65,-62,15,.4,5.7);ctx.stroke();if(p3)a2Glow(3,-117,55,'#9fe7ff',.35);
}else if(j===6){/* Полый Принц · фарфоровый рыцарь из пластин */
 ctx.fillStyle=hexA('#6aa7e8',.3);ctx.beginPath();ctx.moveTo(-28,-90);ctx.lineTo(-62,-18);ctx.lineTo(-15,-9);ctx.closePath();ctx.fill();
 for(const s of [-1,1]){a2Limb(s*19,-67,s*(35+wind*8),-35,11,'#e7efeb','#78aee0');a2Limb(s*(35+wind*8),-35,s*31,-5,9,'#d9e7e5','#78aee0');}
 a2Plate([[-35,-12],[-43,-62],[-28,-104],[0,-121],[28,-104],[43,-62],[34,-12]],'#f7fbf5','#9db7bd','#387dc2');
 /* сегменты брони */for(let y=-91;y<-24;y+=17){ctx.strokeStyle='#6d9bc2';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-31,y);ctx.quadraticCurveTo(0,y+8,31,y);ctx.stroke();}
 ctx.fillStyle='#f6faf5';ctx.strokeStyle='#397fc5';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-22,-111);ctx.lineTo(0,-139);ctx.lineTo(22,-111);ctx.lineTo(15,-85);ctx.lineTo(-15,-85);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#14385e';ctx.beginPath();ctx.ellipse(0,-111,10,16,0,0,7);ctx.fill();
 const cracks=p3?[[-8,-130],[0,-113],[11,-101],[2,-88],[16,-72]]:[[-7,-123],[0,-111],[9,-103]];a2Cracks(cracks,p3?'#bfeaff':'#6aa7e8');for(let k=0;k<(p2?6:3);k++){const an=time*.35+k*6.283/(p2?6:3);ctx.save();ctx.translate(Math.cos(an)*52,-67+Math.sin(an)*35);ctx.rotate(an);a2Plate([[-7,-14],[8,-8],[11,8],[-9,13]],'#f4faf5','#7097b8','#bfeaff');ctx.restore();}
}else if(j===7){/* Хозяин Пустого Пира · аристократ-стол и живая сервировка */
 /* стол */ctx.fillStyle='#40251d';ctx.strokeStyle='#d7a776';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(-67,-45,134,30,7);ctx.fill();ctx.stroke();for(const x of [-50,50]){ctx.fillStyle='#553425';ctx.fillRect(x-6,-17,12,17);ctx.strokeRect(x-6,-17,12,17);ctx.beginPath();ctx.arc(x,0,10,0,7);ctx.fill();ctx.stroke();}
 ctx.fillStyle='#e8d7c7';ctx.beginPath();ctx.moveTo(-60,-42);ctx.lineTo(60,-42);ctx.lineTo(47,-25);ctx.lineTo(-48,-25);ctx.closePath();ctx.fill();for(let x=-45;x<=45;x+=30){ctx.strokeStyle='#9d765c';ctx.beginPath();ctx.arc(x,-42,13,0,Math.PI);ctx.stroke();}
 /* худой торс */a2Plate([[-22,-45],[-30,-104],[-15,-139],[14,-139],[29,-103],[20,-45]],'#7b3e58','#2c1420','#e4b18e');for(const s of [-1,1]){a2Limb(s*20,-108,s*(48+wind*10),-79,7,'#d8b092','#f0d1b8');a2Limb(s*(48+wind*10),-79,s*61,-42,6,'#cba488','#f0d1b8');ctx.fillStyle='#d7dfe0';ctx.save();ctx.translate(s*64,-39);ctx.rotate(s*.3);ctx.fillRect(-2,-25,4,50);for(let k=-1;k<=1;k++)ctx.fillRect(k*6-1,-30,2,20);ctx.restore();}
 ctx.fillStyle='#e6c5aa';ctx.beginPath();ctx.ellipse(0,-147,16,24,0,0,7);ctx.fill();ctx.fillStyle='#2b131b';ctx.beginPath();ctx.arc(5,-151,3,0,7);ctx.fill();
 /* грудная пасть */ctx.fillStyle='#190a0d';ctx.strokeStyle='#d9ff79';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-94,11,p3?29:21,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#f2e5cf';for(let k=-3;k<=3;k++){ctx.beginPath();ctx.moveTo(-8,-94+k*6);ctx.lineTo(0,-91+k*6);ctx.lineTo(8,-94+k*6);ctx.closePath();ctx.fill();}if(p2)a2Glow(0,-94,31,['#ff7777','#77bbff','#9fe079'][Math.floor(time)%3],.35);
}else if(j===8){/* Лунный Механизм · серафим-астролябия */
 ctx.save();ctx.translate(0,-78);for(let r=0;r<3;r++){ctx.rotate((r%2?-.35:.25)*time+r);ctx.strokeStyle=['#dce8ff','#7ea7e8','#b9cfff'][r];ctx.lineWidth=4-r;ctx.beginPath();ctx.ellipse(0,0,48+r*14,24+r*16,r*.45,0,7);ctx.stroke();for(let k=0;k<4;k++){const an=k*1.57,x=Math.cos(an)*(48+r*14),y=Math.sin(an)*(24+r*16);ctx.fillStyle='#e7efff';ctx.beginPath();ctx.arc(x,y,3+r,0,7);ctx.fill();}}ctx.restore();
 for(let k=0;k<6;k++){const an=-2.6+k*1.04,sx=Math.cos(an)*24,sy=-78+Math.sin(an)*20,ex=Math.cos(an)*(p3?83:68),ey=-78+Math.sin(an)*(p3?70:58);ctx.strokeStyle=k%2?'#759be0':'#b9d4ff';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(ex,ey);ctx.stroke();ctx.fillStyle='#dfe9ff';ctx.save();ctx.translate(ex,ey);ctx.rotate(an);ctx.beginPath();ctx.moveTo(22,0);ctx.lineTo(-10,-8);ctx.lineTo(-3,0);ctx.lineTo(-10,8);ctx.closePath();ctx.fill();ctx.restore();}
 ctx.fillStyle='#080b17';ctx.strokeStyle='#f2f6ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-81,28,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#e8f0ff';ctx.beginPath();ctx.arc(9,-88,5,0,7);ctx.fill();a2Glow(0,-81,42,'#a9c8ff',.45);
 ctx.fillStyle='#526f9f';ctx.beginPath();ctx.moveTo(-23,-51);ctx.lineTo(0,-12);ctx.lineTo(23,-51);ctx.closePath();ctx.fill();
}else{/* Ткач Ненаписанного Неба · шесть рук, маска, плащ-созвездие */
 /* плащ */ctx.fillStyle='#0b0920';ctx.strokeStyle='#d9b85f';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-37,-105);ctx.quadraticCurveTo(-72,-47,-51,-5);ctx.lineTo(0,-18);ctx.lineTo(51,-5);ctx.quadraticCurveTo(72,-47,37,-105);ctx.closePath();ctx.fill();ctx.stroke();
 const stars=[[-35,-67],[-17,-91],[2,-52],[22,-81],[39,-35],[-25,-30],[14,-22]];ctx.strokeStyle='rgba(243,207,114,.55)';ctx.lineWidth=1;ctx.beginPath();stars.forEach((p,k)=>k?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.fillStyle='#fff0b0';for(const p of stars){ctx.beginPath();ctx.arc(p[0],p[1],2.4,0,7);ctx.fill();}
 for(let k=0;k<6;k++){const side=k<3?-1:1,q=k%3,y=-104+q*27,x=side*18,tx=side*(48+q*10+wind*10),ty=y+(q-1)*18;a2Limb(x,y,tx,ty,6,q===1?'#d0ad54':'#eee3be','#f3cf72');ctx.fillStyle='#f4e6bf';ctx.save();ctx.translate(tx,ty);ctx.rotate(side*(.3+q*.22));ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(side*19,-4);ctx.lineTo(side*30,0);ctx.lineTo(side*19,4);ctx.closePath();ctx.fill();ctx.restore();}
 a2Plate([[-25,-45],[-31,-103],[-16,-130],[16,-130],[31,-103],[25,-45]],'#6d5425','#171124','#f3cf72');
 ctx.fillStyle='#d9b85f';ctx.strokeStyle='#fff0b0';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-20,-128);ctx.lineTo(0,-151);ctx.lineTo(20,-128);ctx.lineTo(13,-100);ctx.lineTo(-13,-100);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#110c1e';ctx.fillRect(-10,-126,20,4);a2Glow(0,-124,37,'#f3cf72',p3?.7:.35);
 /* ткацкий нимб */ctx.strokeStyle='#d9b85f';ctx.lineWidth=2;for(let k=0;k<4;k++){const r=42+k*10,st=time*(k%2?-.22:.22)+k;ctx.beginPath();ctx.arc(0,-119,r,st,st+4.7);ctx.stroke();for(let n=0;n<4;n++){const an=st+n*1.57;ctx.fillStyle='#fff0b0';ctx.beginPath();ctx.arc(Math.cos(an)*r,-119+Math.sin(an)*r,2,0,7);ctx.fill();}}
}
a2BossPhaseAura(m,[ '#65e3e6','#eee5d2','#ff7895','#ffd65a','#dcef75','#bcecff','#6aa7e8','#e4a86c','#a9c8ff','#f3cf72'][j]);
if(m.flash>0){ctx.globalAlpha=Math.min(.75,m.flash*7);ctx.globalCompositeOperation='screen';ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,cy,Math.max(w,h)*.62,0,7);ctx.fill();ctx.globalCompositeOperation='source-over';}
ctx.restore();return true;
}
function drawMob(m){
const w=m.w,h=m.h,T=m.type;
if(T==='driller'&&(m.state==='under'||m.state==='warn')){
ctx.save();
ctx.fillStyle=tint(theme.accent,.5);
ctx.beginPath();ctx.ellipse(m.x,GROUND-1,17,6,0,Math.PI,0);ctx.fill();
ctx.restore();
return;
}
ctx.save();ctx.translate(m.x,m.y);ctx.scale(m.face,1);
if(m.cloaked&&m.state==='walk'&&m.atkCd>.35)ctx.globalAlpha=.2+.08*Math.sin(time*5);
if(drawAct1BossModel(m)){
}else if(drawAct2BossModel(m)){
}else if(drawNewMobModel(m)){
}else if(T==='flyer'){
const fl=Math.sin(m.anim*16)*.9;
ctx.fillStyle=m.dark;
ctx.save();ctx.rotate(-.3-fl*.4);ctx.beginPath();ctx.ellipse(-w*.5,-h*.6,w*.55,h*.3,-.3,0,7);ctx.fill();ctx.restore();
ctx.save();ctx.rotate(.3+fl*.4);ctx.beginPath();ctx.ellipse(-w*.5,-h*.2,w*.55,h*.3,.3,0,7);ctx.fill();ctx.restore();
const bg=ctx.createLinearGradient(0,-h,0,0);bg.addColorStop(0,m.color);bg.addColorStop(1,m.dark);
ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(0,-h*.5,w*.42,h*.5,0,0,7);ctx.fill();
ctx.fillStyle=m.eye;
ctx.beginPath();ctx.arc(w*.12,-h*.6,3,0,7);ctx.fill();
ctx.beginPath();ctx.arc(w*.3,-h*.55,3,0,7);ctx.fill();
ctx.fillStyle='#fff';
ctx.beginPath();ctx.moveTo(w*.05,-h*.2);ctx.lineTo(w*.1,-h*.05);ctx.lineTo(w*.16,-h*.2);ctx.closePath();ctx.fill();
}else if(T==='ghost'){
const lift=Math.sin(m.anim*2)*4;
ctx.globalAlpha=.72;
const bg=ctx.createLinearGradient(0,-h+lift,0,lift);bg.addColorStop(0,'#e8ecf4');bg.addColorStop(1,m.color);
ctx.fillStyle=bg;
ctx.beginPath();ctx.arc(0,-h*.55+lift,w*.5,Math.PI,0);
for(let i=3;i>=-3;i--)ctx.lineTo(i*w/7,-h*.15+lift+(i%2?6:0));
ctx.closePath();ctx.fill();
ctx.fillStyle='#141420';
ctx.beginPath();ctx.ellipse(w*.12,-h*.6+lift,3.4,4.6,0,0,7);ctx.fill();
ctx.beginPath();ctx.ellipse(w*.32,-h*.58+lift,3,4,0,0,7);ctx.fill();
ctx.globalAlpha=1;
}else if(T==='mage'){
const cy=-h*.5;
ctx.fillStyle=m.dark;
ctx.beginPath();ctx.moveTo(-w*.5,0);ctx.lineTo(w*.5,0);ctx.lineTo(w*.3,cy-h*.3);ctx.lineTo(-w*.3,cy-h*.3);ctx.closePath();ctx.fill();
ctx.fillStyle=m.color;
ctx.beginPath();ctx.arc(0,cy-h*.28,w*.3,0,7);ctx.fill();
ctx.fillStyle=m.dark;
ctx.beginPath();ctx.moveTo(-w*.34,cy-h*.34);ctx.lineTo(w*.34,cy-h*.34);ctx.lineTo(0,cy-h*.95);ctx.closePath();ctx.fill();
ctx.fillStyle=m.eye;
ctx.beginPath();ctx.arc(w*.1,cy-h*.26,2.6,0,7);ctx.fill();
ctx.beginPath();ctx.arc(w*.24,cy-h*.26,2.6,0,7);ctx.fill();
if(m.state==='cast'){
ctx.globalCompositeOperation='lighter';
const g=ctx.createRadialGradient(w*.4,cy-h*.4,0,w*.4,cy-h*.4,12);
g.addColorStop(0,m.eye);g.addColorStop(1,'rgba(0,0,0,0)');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(w*.4,cy-h*.4,12,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';
}
ctx.strokeStyle='#5a4326';ctx.lineWidth=3;
ctx.beginPath();ctx.moveTo(-w*.45,0);ctx.lineTo(-w*.45,-h*.85);ctx.stroke();
ctx.fillStyle=m.eye;ctx.beginPath();ctx.arc(-w*.45,-h*.9,3.5,0,7);ctx.fill();
}else if(T==='boss'){
const wob=Math.sin(m.wobT)*.03,cy=-h*.5;
if(m.mobility==='ghost')ctx.globalAlpha=.78;
if(m.mobility==='fly'){
const fl=Math.sin(m.wobT*3)*.7;
ctx.fillStyle=m.dark;
ctx.save();ctx.rotate(-.25-fl*.3);ctx.beginPath();ctx.ellipse(-w*.6,cy-h*.15,w*.6,h*.32,-.25,0,7);ctx.fill();ctx.restore();
ctx.save();ctx.rotate(.25+fl*.3);ctx.beginPath();ctx.ellipse(-w*.6,cy+h*.2,w*.6,h*.32,.25,0,7);ctx.fill();ctx.restore();
}
const bg=ctx.createLinearGradient(0,-h,0,0);bg.addColorStop(0,m.color);bg.addColorStop(1,m.dark);
ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(0,cy,w*.55,h*.55,0,0,7);ctx.fill();
ctx.fillStyle=tint(m.color==='#d8d3c0'?'#8a8578':theme.accent,.3);
ctx.beginPath();ctx.moveTo(-w*.3,cy-h*.2);ctx.lineTo(w*.3,cy-h*.2);ctx.lineTo(0,cy+h*.4);ctx.closePath();ctx.fill();
ctx.fillStyle='#d8d3c0';
ctx.beginPath();ctx.moveTo(-w*.3,cy-h*.4);ctx.lineTo(-w*.55,cy-h*.85);ctx.lineTo(-w*.15,cy-h*.45);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.moveTo(w*.25,cy-h*.42);ctx.lineTo(w*.55,cy-h*.85);ctx.lineTo(w*.4,cy-h*.36);ctx.closePath();ctx.fill();
ctx.fillStyle='#ffd23f';
ctx.fillRect(-w*.2,cy-h*.62,w*.4,h*.1);
for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-w*.2+i*w*.13,cy-h*.62);ctx.lineTo(-w*.16+i*w*.13,cy-h*.75);ctx.lineTo(-w*.1+i*.13*w,cy-h*.62);ctx.closePath();ctx.fill();}
ctx.globalCompositeOperation='lighter';
const g=ctx.createRadialGradient(w*.2,cy-h*.2,0,w*.2,cy-h*.2,16);
g.addColorStop(0,m.eye);g.addColorStop(1,'rgba(0,0,0,0)');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(w*.2,cy-h*.2,16,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';
ctx.fillStyle=m.eye;
ctx.beginPath();ctx.arc(w*.1,cy-h*.22,5,0,7);ctx.fill();
ctx.beginPath();ctx.arc(w*.32,cy-h*.18,5.5,0,7);ctx.fill();
ctx.fillStyle='#1c0f12';
ctx.beginPath();ctx.ellipse(w*.2,cy+h*.15,w*.22,h*.12,0,0,7);ctx.fill();
ctx.fillStyle='#fff';
for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(w*.02+i*w*.1,cy+h*.08);ctx.lineTo(w*.06+i*w*.1,cy+h*.2);ctx.lineTo(w*.1+i*w*.1,cy+h*.08);ctx.closePath();ctx.fill();}
if(m.phase>=2){ctx.strokeStyle=m.phase>=4?'rgba(255,255,255,.7)':'rgba(255,60,30,.5)';ctx.lineWidth=m.phase>=4?4:3;
ctx.beginPath();ctx.ellipse(0,cy,w*.62,h*.62,0,0,7);ctx.stroke();}
ctx.globalAlpha=1;
}else{
const wob=m.grounded?Math.sin(m.wobT)*.06:0;
let sx=m.sx+wob,sy=m.sy-wob,lean=0;
if(m.state==='windup'){lean=-.15;sy*=1+Math.sin(time*40)*.02;}
if(m.state==='lunge')sx*=1.15;
ctx.rotate(lean);
ctx.fillStyle=m.dark;
const step=m.grounded?Math.sin(m.wobT)*3:0;
ctx.beginPath();ctx.ellipse(-w*.25+step,-3,6,4,0,0,7);ctx.fill();
ctx.beginPath();ctx.ellipse(w*.22-step,-3,6,4,0,0,7);ctx.fill();
const cy=-h*.52;
const bg=ctx.createLinearGradient(0,cy-h*.5,0,cy+h*.5);
bg.addColorStop(0,m.color);bg.addColorStop(1,m.dark);
ctx.fillStyle=bg;
ctx.beginPath();ctx.ellipse(0,cy,w*.52*sx,h*.52*sy,0,0,7);ctx.fill();
if(T==='tank'){ctx.fillStyle='rgba(0,0,0,.25)';
ctx.beginPath();ctx.ellipse(0,cy-h*.2,w*.4,h*.25,0,0,7);ctx.fill();}
if(T==='spitter'){ctx.fillStyle='rgba(0,0,0,.3)';
ctx.beginPath();ctx.ellipse(w*.28,cy,6,8,0,0,7);ctx.fill();}
ctx.fillStyle='#d8d3c0';
ctx.beginPath();ctx.moveTo(-w*.2,cy-h*.4);ctx.lineTo(-w*.3,cy-h*.72);ctx.lineTo(-w*.08,cy-h*.42);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.moveTo(w*.16,cy-h*.42);ctx.lineTo(w*.3,cy-h*.7);ctx.lineTo(w*.32,cy-h*.36);ctx.closePath();ctx.fill();
ctx.fillStyle=m.eye;
ctx.beginPath();ctx.arc(w*.08,cy-h*.14,3.4,0,7);ctx.fill();
ctx.beginPath();ctx.arc(w*.28,cy-h*.08,3.8,0,7);ctx.fill();
ctx.fillStyle='#141414';
ctx.fillRect(w*.09,cy-h*.14-2,1.6,4);ctx.fillRect(w*.29,cy-h*.08-2,1.6,4.6);
ctx.fillStyle='#1c0f12';
ctx.beginPath();ctx.ellipse(w*.16,cy+h*.18,7,4,0,0,7);ctx.fill();
ctx.fillStyle='#fff';
ctx.beginPath();ctx.moveTo(w*.1,cy+h*.15);ctx.lineTo(w*.13,cy+h*.24);ctx.lineTo(w*.16,cy+h*.15);ctx.closePath();ctx.fill();
}
if(m.flash>0&&!(m.type==='boss'&&m.bossIndex>=ACT1_LEN)){ctx.globalAlpha=m.flash*6;ctx.fillStyle='#fff';
ctx.beginPath();ctx.ellipse(0,-h*.5,w*.55,h*.55,0,0,7);ctx.fill();ctx.globalAlpha=1;}
ctx.restore();
drawBossMechanics(m);
if(m.crystalGuard){ctx.strokeStyle='rgba(159,243,255,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(m.x,m.y-m.h*.52,m.h*.62,0,7);ctx.stroke();}
if(hasVariant(m,'echoing')){ctx.strokeStyle='rgba(214,168,255,.28)';ctx.lineWidth=2;for(const d of [7,13]){ctx.beginPath();ctx.ellipse(m.x-d*m.face,m.y-m.h*.5,m.w*.52,m.h*.52,0,0,7);ctx.stroke();}}
if(m.bondMate){const bm=mobs.find(x=>x.id===m.bondMate&&x.hp>0);if(bm&&m.id<bm.id){ctx.strokeStyle='rgba(115,224,255,.32)';ctx.lineWidth=1.5;ctx.setLineDash([5,6]);ctx.beginPath();ctx.moveTo(m.x,m.y-m.h*.5);ctx.lineTo(bm.x,bm.y-bm.h*.5);ctx.stroke();ctx.setLineDash([]);}}
let iy=m.y-m.h-10;
if(m.hp<m.maxHp&&m.type!=='boss'){
const bw=m.w*.9;
ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(m.x-bw/2,iy,bw,4);
ctx.fillStyle='#ff5d5d';ctx.fillRect(m.x-bw/2,iy,bw*clamp(m.hp/m.maxHp,0,1),4);
iy-=7;
}
ctx.font='9px "IBM Plex Mono"';ctx.textAlign='center';
let ix=m.x-14;
if(m.bleed>0){ctx.fillStyle='#ff7a6b';ctx.fillText('🩸'+m.bleed,ix,iy);ix+=22;}
if(m.poison>0){ctx.fillStyle='#8fe07a';ctx.fillText('☠'+m.poison,ix,iy);ix+=22;}
if(m.slow>0){ctx.fillStyle='#8fe0ff';ctx.fillText('❄',ix,iy);ix+=14;}
if(m.ward>0){ctx.fillStyle='#9ad0ff';ctx.fillText('✦'+m.ward,ix,iy);ix+=20;}
if(m.variants&&m.variants.length){
const marks=m.variants.map(id=>VARIANTS.find(v=>v.id===id)).filter(Boolean);
ctx.font='700 11px "IBM Plex Mono"';
marks.forEach((V,k)=>{ctx.fillStyle=V.col;ctx.fillText(V.mark,ix+(k-(marks.length-1)/2)*13,iy);});
}
if(m.guard){
ctx.save();
ctx.globalAlpha=.5+Math.sin(time*4)*.12;
ctx.strokeStyle='#9ad0ff';ctx.lineWidth=2.5;
ctx.beginPath();ctx.arc(m.x+m.face*m.w*.42,m.y-m.h*.55,m.h*.42,-1.1,1.1);ctx.stroke();
ctx.restore();
}
if(m.anchor){
ctx.save();ctx.globalAlpha=.18+Math.sin(time*2)*.06;
ctx.strokeStyle='#b48aff';ctx.lineWidth=1.5;
ctx.beginPath();ctx.arc(m.x,m.y-m.h*.5,240,0,7);ctx.stroke();ctx.restore();
}
if(m.type==='boss'&&m.seqShow>0){
m.seqShow-=1/60;
ctx.font='700 10px "IBM Plex Mono"';ctx.fillStyle='#ffd23f';
ctx.fillText('СВЯЗКА ×'+((m.seq?m.seq.length:0)+1),m.x,m.y-m.h-22);
}
if((m.type==='boss'||m.type==='walker'||m.type==='tank'||m.type==='hound'||m.type==='ghost')&&m.state==='windup'){
if(Math.floor(time*10)%2===0){ctx.fillStyle='#ffd23f';ctx.font='700 15px "IBM Plex Mono"';
ctx.fillText('!',m.x,m.y-m.h-18);}
}
}
function drawAct2Projectile(p){
 const a=Math.atan2(p.vy,p.vx),rot=time*7+(p.x+p.y)*.01,t=p.type;
 const known=['bubble','ink','paperknife','needle','wax','seed','leaf','pollen','thorn','feather','skyhook','shard','saucer','plate','steam','moon','moonblade','goldthread'];
 if(!known.includes(t))return false;
 ctx.save();ctx.rotate(a);
 /* единый читаемый признак парируемого снаряда — бирюзовый сердечник */
 ctx.strokeStyle='rgba(160,250,255,.8)';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(0,0,12+Math.sin(time*10)*1.5,0,7);ctx.stroke();
 if(t==='bubble'){
  ctx.fillStyle='rgba(78,220,235,.18)';ctx.strokeStyle='#8cf7ff';ctx.lineWidth=2.3;ctx.beginPath();ctx.arc(0,0,13,0,7);ctx.fill();ctx.stroke();ctx.strokeStyle='#dfffff';ctx.beginPath();ctx.arc(-4,-4,4,3.3,5.8);ctx.stroke();ctx.fillStyle='#b8874d';ctx.beginPath();ctx.arc(2,2,4,0,7);ctx.fill();ctx.fillStyle='#22343a';ctx.fillRect(0,-3,4,6);
 }else if(t==='ink'){
  ctx.fillStyle='#17131d';ctx.strokeStyle='#eee5cf';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(14,0);ctx.bezierCurveTo(5,-8,-5,-7,-10,0);ctx.bezierCurveTo(-5,7,5,8,14,0);ctx.fill();ctx.stroke();for(let k=0;k<3;k++){ctx.fillStyle='#17131d';ctx.beginPath();ctx.arc(-11-k*5,(k-1)*3,2.5-k*.4,0,7);ctx.fill();}
 }else if(t==='paperknife'){
  ctx.fillStyle='#efe7d3';ctx.strokeStyle='#9ba6aa';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(18,0);ctx.lineTo(-10,-7);ctx.lineTo(-5,0);ctx.lineTo(-10,7);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle='#a92b35';ctx.beginPath();ctx.moveTo(-5,-3);ctx.lineTo(9,0);ctx.lineTo(-5,3);ctx.stroke();
 }else if(t==='needle'){
  ctx.strokeStyle='#f8dedf';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-16,0);ctx.lineTo(18,0);ctx.stroke();ctx.beginPath();ctx.ellipse(-13,0,3,5,0,0,7);ctx.stroke();ctx.strokeStyle='#b72e58';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-15,0);ctx.bezierCurveTo(-25,-12,-34,12,-45,2);ctx.stroke();
 }else if(t==='wax'){
  ctx.fillStyle='#ffd65a';ctx.strokeStyle='#8d5412';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(12,0);ctx.bezierCurveTo(4,-10,-8,-8,-11,1);ctx.bezierCurveTo(-7,9,5,8,12,0);ctx.fill();ctx.stroke();ctx.fillStyle='#fff4ad';ctx.beginPath();ctx.ellipse(2,-3,4,2,-.3,0,7);ctx.fill();
 }else if(t==='seed'){
  ctx.rotate(rot);ctx.fillStyle='#7b5429';ctx.strokeStyle='#dcef75';ctx.beginPath();ctx.ellipse(0,0,9,5,.4,0,7);ctx.fill();ctx.stroke();ctx.strokeStyle='#9ad35c';ctx.beginPath();ctx.moveTo(3,-2);ctx.quadraticCurveTo(9,-10,14,-7);ctx.stroke();
 }else if(t==='leaf'){
  ctx.fillStyle='#d7793f';ctx.strokeStyle='#fff0a0';ctx.beginPath();ctx.moveTo(13,0);ctx.quadraticCurveTo(0,-12,-12,0);ctx.quadraticCurveTo(0,8,13,0);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-10,0);ctx.lineTo(11,0);ctx.stroke();
 }else if(t==='pollen'){
  ctx.fillStyle='#efff9a';for(let k=0;k<9;k++){const an=k*.698+rot;ctx.beginPath();ctx.arc(Math.cos(an)*7,Math.sin(an)*7,3,0,7);ctx.fill();}ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,4,0,7);ctx.fill();
 }else if(t==='thorn'){
  ctx.rotate(rot);ctx.fillStyle='#3d6333';for(let k=0;k<8;k++){ctx.rotate(.785);ctx.beginPath();ctx.moveTo(3,-3);ctx.lineTo(15,0);ctx.lineTo(3,3);ctx.closePath();ctx.fill();}ctx.fillStyle='#ff8da5';ctx.beginPath();ctx.arc(0,0,5,0,7);ctx.fill();
 }else if(t==='feather'){
  ctx.fillStyle='#cbe9ec';ctx.strokeStyle='#638fa4';ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(-10,-9);ctx.quadraticCurveTo(-3,0,-10,9);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-9,0);ctx.lineTo(14,0);ctx.stroke();
 }else if(t==='skyhook'){
  ctx.strokeStyle='#8a633b';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-23,0);ctx.lineTo(6,0);ctx.stroke();ctx.strokeStyle='#d6b06a';ctx.lineWidth=3;for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(-22-k*8,0,5,-1.2,1.2);ctx.stroke();}ctx.fillStyle='#d9e6e7';for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(17,0);ctx.lineTo(3,s*10);ctx.lineTo(7,0);ctx.closePath();ctx.fill();}
 }else if(t==='shard'){
  ctx.fillStyle='#f3f7f1';ctx.strokeStyle='#3ab6ff';ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(-5,-8);ctx.lineTo(-12,1);ctx.lineTo(-3,8);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle='#2767a5';ctx.beginPath();ctx.moveTo(-4,-5);ctx.lineTo(5,1);ctx.lineTo(-2,5);ctx.stroke();
 }else if(t==='saucer'){
  ctx.rotate(-a+rot);ctx.fillStyle='#eef5f2';ctx.strokeStyle='#2767a5';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,14,5,0,0,7);ctx.fill();ctx.stroke();ctx.strokeStyle='#c8a55b';ctx.beginPath();ctx.ellipse(0,-1,8,2.5,0,0,7);ctx.stroke();
 }else if(t==='plate'){
  ctx.rotate(-a+rot);ctx.fillStyle='#f2e3cf';ctx.strokeStyle='#9a5c50';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,12,0,7);ctx.fill();ctx.stroke();ctx.strokeStyle='#5c8f5d';ctx.beginPath();ctx.arc(0,0,6,0,7);ctx.stroke();ctx.fillStyle='#e4a86c';ctx.beginPath();ctx.arc(0,0,2.5,0,7);ctx.fill();
 }else if(t==='steam'){
  ctx.strokeStyle='rgba(240,250,255,.85)';ctx.lineWidth=4;for(let k=-1;k<=1;k++){ctx.beginPath();ctx.moveTo(-12,k*4);ctx.bezierCurveTo(-4,k*4-8,4,k*4+8,13,k*4);ctx.stroke();}
 }else if(t==='moon'||t==='moonblade'){
  ctx.fillStyle='#dbe8fa';ctx.strokeStyle='#7592b9';ctx.lineWidth=1.7;ctx.beginPath();ctx.arc(0,0,t==='moon'?11:15,-1.35,1.35);ctx.arc(5,0,t==='moon'?7:10,1.35,-1.35,true);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#273b73';ctx.beginPath();ctx.arc(-1,-3,2,0,7);ctx.arc(-3,4,1.5,0,7);ctx.fill();
 }else if(t==='goldthread'){
  ctx.fillStyle='#fff0a8';ctx.beginPath();ctx.moveTo(18,0);ctx.lineTo(-8,-4);ctx.lineTo(-4,0);ctx.lineTo(-8,4);ctx.closePath();ctx.fill();ctx.strokeStyle='#e1bd63';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-7,0);for(let k=1;k<=5;k++)ctx.lineTo(-7-k*8,Math.sin(time*8+k)*5);ctx.stroke();for(let k=1;k<4;k++){ctx.fillStyle='#fff5c7';ctx.beginPath();ctx.arc(-8-k*10,Math.sin(time*8+k)*5,2,0,7);ctx.fill();}
 }
 ctx.restore();return true;
}
function drawProjs(){
for(const p of projs){
/* ЭВОЛЮЦИИ: светящийся след самонаводящихся снарядов */
if(p.friendly&&p.homing&&p.tcol&&rand()<.85)
particles.push({x:p.x,y:p.y,vx:rnd(-16,16),vy:rnd(-16,16),life:.24,max:.24,c:p.tcol,type:'spark',grav:0});
ctx.save();ctx.translate(p.x,p.y);
if(p.friendly&&p.homing&&p.tcol){
ctx.globalCompositeOperation='lighter';
const gg=ctx.createRadialGradient(0,0,0,0,0,16);
gg.addColorStop(0,hexA(p.tcol,.45));gg.addColorStop(1,hexA(p.tcol,0));
ctx.fillStyle=gg;ctx.beginPath();ctx.arc(0,0,16,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';
}
if(drawAct2Projectile(p)){
}else if(p.type==='arrow'||p.type==='rainarrow'){
ctx.rotate(Math.atan2(p.vy,p.vx));
ctx.fillStyle='#c8b89a';ctx.fillRect(-10,-1,18,2);
ctx.fillStyle='#aab7bd';ctx.beginPath();ctx.moveTo(8,-3);ctx.lineTo(14,0);ctx.lineTo(8,3);ctx.closePath();ctx.fill();
}else if(p.type==='bolt'){
ctx.rotate(Math.atan2(p.vy,p.vx));
ctx.fillStyle='#8a969c';ctx.fillRect(-12,-2,24,4);
ctx.fillStyle='#cfd8dc';ctx.beginPath();ctx.moveTo(12,-4);ctx.lineTo(20,0);ctx.lineTo(12,4);ctx.closePath();ctx.fill();
}else if(p.type==='heavybolt'){
ctx.rotate(Math.atan2(p.vy,p.vx));
ctx.globalCompositeOperation='lighter';
const g=ctx.createRadialGradient(0,0,0,0,0,20);
g.addColorStop(0,'rgba(255,220,150,.5)');g.addColorStop(1,'rgba(255,200,120,0)');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,20,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';
ctx.fillStyle='#5a4326';ctx.fillRect(-18,-3,30,6);
ctx.fillStyle='#e8eef0';ctx.fillRect(-14,-1.5,24,3);
ctx.fillStyle='#cfd8dc';ctx.beginPath();ctx.moveTo(12,-6);ctx.lineTo(28,0);ctx.lineTo(12,6);ctx.closePath();ctx.fill();
}else if(p.type==='knife'){
ctx.rotate(time*20);
ctx.fillStyle='#cfd8dc';ctx.beginPath();ctx.moveTo(-6,-2);ctx.lineTo(6,0);ctx.lineTo(-6,2);ctx.closePath();ctx.fill();
}else if(p.type==='fire'||p.type==='fireball'){
const r=p.type==='fire'?9:7;
ctx.globalCompositeOperation='lighter';
const g=ctx.createRadialGradient(0,0,0,0,0,r*2.2);
g.addColorStop(0,'rgba(255,220,140,.9)');g.addColorStop(.5,'rgba(255,130,50,.6)');g.addColorStop(1,'rgba(255,100,40,0)');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r*2.2,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';
ctx.fillStyle='#ffd28a';ctx.beginPath();ctx.arc(0,0,r*.7,0,7);ctx.fill();
}else if(p.type==='meteor'){
ctx.globalCompositeOperation='lighter';
const g=ctx.createRadialGradient(0,0,0,0,0,26);
g.addColorStop(0,'rgba(255,220,140,.95)');g.addColorStop(.5,'rgba(255,130,50,.6)');g.addColorStop(1,'rgba(255,100,40,0)');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,26,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';
ctx.fillStyle='#ffd28a';ctx.beginPath();ctx.arc(0,0,9,0,7);ctx.fill();
if(rand()<.6)particles.push({x:p.x+rnd(-6,6),y:p.y-14,vx:rnd(-20,20),vy:rnd(-120,-60),life:.3,max:.3,c:'#ff9d45',type:'spark',grav:0});
}else if(p.type==='ice'){
ctx.rotate(Math.atan2(p.vy,p.vx));
ctx.fillStyle='#bfeaff';
ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-6,-4);ctx.lineTo(-2,0);ctx.lineTo(-6,4);ctx.closePath();ctx.fill();
}else if(p.type==='skull'){
ctx.rotate(Math.atan2(p.vy,p.vx));
const pu=1+Math.sin(time*16+(p.ph||0))*.08;
ctx.globalCompositeOperation='lighter';
const g=ctx.createRadialGradient(0,0,1,0,0,14*pu);
g.addColorStop(0,'rgba(224,208,255,.58)');g.addColorStop(1,'rgba(150,100,220,0)');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,14*pu,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';
ctx.fillStyle='#e4dcf0';ctx.beginPath();ctx.arc(1,-1,6,0,7);ctx.fill();ctx.fillRect(-2,3,6,4);
ctx.fillStyle='#281733';ctx.beginPath();ctx.arc(-1,-2,1.5,0,7);ctx.arc(3,-2,1.5,0,7);ctx.fill();
ctx.fillRect(-.5,4,1,3);ctx.fillRect(2,4,1,3);
}else if(p.type==='dragonskull'){
ctx.rotate(Math.atan2(p.vy,p.vx));ctx.globalCompositeOperation='lighter';
const g=ctx.createLinearGradient(-34,0,20,0);g.addColorStop(0,'rgba(240,226,192,0)');g.addColorStop(1,'rgba(240,226,192,.55)');
ctx.fillStyle=g;ctx.fillRect(-36,-8,56,16);ctx.globalCompositeOperation='source-over';
ctx.fillStyle='#f0e2c0';ctx.beginPath();ctx.moveTo(22,0);ctx.lineTo(8,-13);ctx.lineTo(-8,-10);ctx.lineTo(-15,0);ctx.lineTo(-8,10);ctx.lineTo(8,13);ctx.closePath();ctx.fill();
ctx.fillStyle='#382719';ctx.beginPath();ctx.arc(7,-5,2.5,0,7);ctx.arc(7,5,2.5,0,7);ctx.fill();
ctx.strokeStyle='#f0e2c0';ctx.lineWidth=3;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(-18-i*8,0,7+i*2,-1.15,1.15);ctx.stroke();}
}else if(p.type==='mawskull'){
ctx.rotate(Math.atan2(p.vy,p.vx));const bite=.3+.7*Math.abs(Math.sin(time*10+(p.ph||0)));
ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(0,0,2,0,0,30);
g.addColorStop(0,'rgba(255,170,220,.7)');g.addColorStop(1,'rgba(130,40,120,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,30,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';ctx.fillStyle='#f6d7ea';
ctx.beginPath();ctx.arc(2,-8*bite,14,-2.8,-.25);ctx.lineTo(-9,-1);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.arc(2,8*bite,14,.25,2.8);ctx.lineTo(-9,1);ctx.closePath();ctx.fill();
ctx.fillStyle='#421638';ctx.beginPath();ctx.arc(6,-9*bite,3,0,7);ctx.arc(6,9*bite,3,0,7);ctx.fill();
}else if(p.type==='spit'){
ctx.fillStyle='#8abf3a';ctx.beginPath();ctx.arc(0,0,5,0,7);ctx.fill();
ctx.fillStyle='rgba(160,220,80,.5)';ctx.beginPath();ctx.arc(-4,0,3,0,7);ctx.fill();
}else if(p.type==='arcane'){
ctx.globalCompositeOperation='lighter';
const g=ctx.createRadialGradient(0,0,0,0,0,10);
g.addColorStop(0,'rgba(200,180,255,.9)');g.addColorStop(1,'rgba(140,120,255,0)');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,10,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';
}else if(p.type==='ghostshot'){ /* ЭВОЛЮЦИИ: призрачный снаряд Посоха Бездны */
ctx.globalCompositeOperation='lighter';
const g=ctx.createRadialGradient(0,0,0,0,0,13);
g.addColorStop(0,'rgba(190,150,255,.9)');g.addColorStop(1,'rgba(120,80,200,0)');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,13,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';
ctx.fillStyle='#e0d0ff';ctx.beginPath();ctx.arc(0,0,3.5,0,7);ctx.fill();
ctx.fillStyle='rgba(20,10,30,.8)';ctx.fillRect(-1.6,-1.8,1.2,1.4);ctx.fillRect(.6,-1.8,1.2,1.4);
}else if(p.type==='prismshard'){
ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.vy,p.vx));ctx.fillStyle=p.c||'#9ff3ff';ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-6,-4);ctx.lineTo(-2,0);ctx.lineTo(-6,4);ctx.closePath();ctx.fill();ctx.restore();
}else if(p.type==='mimicshot'){
ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.vy,p.vx));ctx.strokeStyle='#ffd27a';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-9,0);ctx.lineTo(9,0);ctx.stroke();ctx.fillStyle='#fff1c2';ctx.beginPath();ctx.moveTo(9,0);ctx.lineTo(3,-4);ctx.lineTo(3,4);ctx.closePath();ctx.fill();ctx.restore();
}else if(p.type==='metal'){
ctx.save();ctx.translate(p.x,p.y);ctx.rotate(time*10);ctx.fillStyle='#c9e4ff';ctx.fillRect(-6,-6,12,12);ctx.strokeStyle='#536272';ctx.strokeRect(-6,-6,12,12);ctx.restore();
}else if(p.type==='bone'){
ctx.rotate(Math.atan2(p.vy,p.vx));
ctx.fillStyle='#e8e3d5';ctx.fillRect(-8,-2,16,4);
ctx.beginPath();ctx.arc(-8,0,3,0,7);ctx.arc(8,0,3,0,7);ctx.fill();
}else if(p.type==='harpoon'){
const a=Math.atan2(p.vy,p.vx);
ctx.save();ctx.translate(p.x,p.y);ctx.rotate(a);
ctx.strokeStyle='#8a7a6a';ctx.lineWidth=2;
ctx.beginPath();ctx.moveTo(-16,0);ctx.lineTo(4,0);ctx.stroke();
ctx.fillStyle='#d8d3c0';
ctx.beginPath();ctx.moveTo(11,0);ctx.lineTo(2,-4.5);ctx.lineTo(4,0);ctx.lineTo(2,4.5);ctx.closePath();ctx.fill();
ctx.restore();
}else if(p.type==='ball'){
/* шаровая молния */
const c=p.bcol||'#a9c4ff',pu=1+Math.sin(time*18+(p.ph||0))*.12;
ctx.globalCompositeOperation='lighter';
const g=ctx.createRadialGradient(0,0,1,0,0,17*pu);
g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(.22,hexA(c,.85));g.addColorStop(.6,hexA(c,.35));g.addColorStop(1,hexA(c,0));
ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,17*pu,0,7);ctx.fill();
ctx.strokeStyle=hexA(c,.95);ctx.lineWidth=1.6;
for(let k=0;k<4;k++){ctx.beginPath();
const a0=time*7+k*1.6;ctx.moveTo(Math.cos(a0)*3,Math.sin(a0)*3);
for(let s=1;s<=4;s++)ctx.lineTo(Math.cos(a0+s*.6)*(4+s*3.6)+rnd(-2.5,2.5),Math.sin(a0+s*.6)*(4+s*3.6)+rnd(-2.5,2.5));
ctx.stroke();}
ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=.8;ctx.beginPath();ctx.arc(0,0,10+Math.sin(time*12)*1.5,0,7);ctx.stroke();
ctx.globalCompositeOperation='source-over';
ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(0,0,2.6,0,7);ctx.fill();
}else if(p.type==='aval'){
/* лавина: катящийся снежный вал */
const R=34+62*(p.grow||0),d=Math.sign(p.vx)||1;
ctx.globalAlpha=.95;
ctx.fillStyle='rgba(200,232,250,.32)';
ctx.beginPath();ctx.ellipse(-d*R*.55,4,R*1.25,R*.72,0,0,7);ctx.fill();
ctx.fillStyle='rgba(215,240,255,.5)';
ctx.beginPath();ctx.ellipse(-d*R*.2,2,R*.95,R*.6,0,0,7);ctx.fill();
ctx.fillStyle='#e8f6ff';
for(let k=0;k<7;k++){
const a=time*(5+k)+k*1.7,rr=R*(.3+.075*k);
ctx.beginPath();ctx.arc(d*(k*R*.13-R*.34)+Math.cos(a)*5,-rr*.42+Math.sin(a)*4,rr,0,7);ctx.fill();
}
ctx.fillStyle='rgba(255,255,255,.9)';
for(let k=0;k<4;k++){ctx.beginPath();
ctx.arc(d*(R*.35+k*6),-R*.55-k*5+Math.sin(time*9+k)*3,4.5-k*.7,0,7);ctx.fill();}
ctx.globalAlpha=1;
}else if(p.type==='gwave'){
ctx.fillStyle=p.c||'#d8d3c0';
ctx.beginPath();ctx.moveTo(-14,8);ctx.lineTo(-4,-14);ctx.lineTo(2,8);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.moveTo(2,8);ctx.lineTo(10,-8);ctx.lineTo(16,8);ctx.closePath();ctx.fill();
}else if(p.type==='arcwave'){
ctx.rotate(Math.atan2(p.vy,p.vx));
ctx.globalCompositeOperation='lighter';
ctx.strokeStyle='rgba(255,240,210,.9)';ctx.lineWidth=4;
ctx.beginPath();ctx.arc(-8,0,18,-1.2,1.2);ctx.stroke();
ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=2;
ctx.beginPath();ctx.arc(-4,0,24,-1,1);ctx.stroke();
ctx.globalCompositeOperation='source-over';
}else if(p.type==='trident'){
ctx.rotate(Math.atan2(p.vy,p.vx));
ctx.strokeStyle='#5a4326';ctx.lineWidth=3;
ctx.beginPath();ctx.moveTo(-16,0);ctx.lineTo(12,0);ctx.stroke();
ctx.fillStyle='#cfd8dc';
ctx.fillRect(10,-6,3,12);
ctx.beginPath();ctx.moveTo(13,0);ctx.lineTo(26,0);ctx.lineTo(13,2.5);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.moveTo(13,-6);ctx.lineTo(22,-6);ctx.lineTo(13,-3.5);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.moveTo(13,6);ctx.lineTo(22,6);ctx.lineTo(13,3.5);ctx.closePath();ctx.fill();
}
ctx.restore();
}
}
function drawAwakenAltFx(f,a){
const q=1-a,tx=clamp(f.tx||f.x,24,W-24),ty=clamp(f.ty||f.y,30,GROUND-8),d=f.dir||1;
ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(1,a*1.45);ctx.lineCap='round';
switch(f.alt){
case 'exec':{ /* огненная корона и королевский вертикальный разрез */
ctx.translate(f.x+d*(35+q*80),f.y);ctx.scale(d,1);ctx.strokeStyle='#ffd27a';ctx.lineWidth=5;
ctx.beginPath();ctx.moveTo(-34,-48);ctx.lineTo(-20,-64);ctx.lineTo(-7,-48);ctx.lineTo(7,-68);ctx.lineTo(20,-48);ctx.lineTo(34,-64);ctx.stroke();
ctx.strokeStyle='#ff6b35';ctx.lineWidth=13-7*q;ctx.beginPath();ctx.moveTo(-20,-72+q*32);ctx.lineTo(24,72-q*15);ctx.stroke();break;}
case 'wave':{ /* три расходящихся пепельных серпа */
ctx.translate(f.x,f.y);ctx.scale(d,1);for(let k=0;k<3;k++){const r=42+k*24+q*80;
ctx.strokeStyle=k===1?'#ffd08a':'#ff7a32';ctx.lineWidth=9-k*2;ctx.beginPath();ctx.arc(q*80,0,r,-1.18,1.18);ctx.stroke();}break;}
case 'echodash':{ /* цепочка синих призрачных двойников */
for(let k=0;k<4;k++){const x=f.x+d*(q*170-k*38),al=(1-k*.18)*a;ctx.fillStyle=`rgba(157,184,255,${al*.34})`;
ctx.beginPath();ctx.arc(x,f.y-26,11,0,7);ctx.fill();ctx.fillRect(x-8,f.y-14,16,32);ctx.strokeStyle=`rgba(210,225,255,${al})`;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,f.y-2);ctx.lineTo(x+d*42,f.y-42);ctx.stroke();}break;}
case 'dash':{ /* алый крест-разрез */
ctx.translate(f.x+d*(35+q*145),f.y);ctx.scale(d,1);for(let k=0;k<3;k++){ctx.strokeStyle=k===1?'#ffe1d8':'#ff3f58';ctx.lineWidth=12-k*3;
ctx.beginPath();ctx.moveTo(-72,-48+k*11);ctx.lineTo(72,42-k*8);ctx.stroke();}ctx.strokeStyle='#ff8794';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-50,48);ctx.lineTo(58,-55);ctx.stroke();break;}
case 'spinfire':{ /* огненная трёхлопастная спираль */
ctx.translate(f.x,f.y);for(let k=0;k<3;k++){const st=q*9+k*2.094;ctx.strokeStyle=k===1?'#ffd27a':'#ff6a28';ctx.lineWidth=11-k*2;
ctx.beginPath();ctx.arc(0,0,48+k*21,st,st+1.9);ctx.stroke();const ex=Math.cos(st+1.9)*(48+k*21),ey=Math.sin(st+1.9)*(48+k*21);ctx.fillStyle='#fff0b0';ctx.beginPath();ctx.arc(ex,ey,5,0,7);ctx.fill();}break;}
case 'boomerang':{ /* вращающийся громовой двойной топор */
const x=f.x+(tx-f.x)*Math.min(1,q*1.4),y=f.y+(ty-f.y)*Math.min(1,q*1.4);ctx.translate(x,y);ctx.rotate(q*14*d);ctx.strokeStyle='#b9d8ff';ctx.lineWidth=8;
ctx.beginPath();ctx.arc(-18,0,34,-1.25,1.25);ctx.stroke();ctx.beginPath();ctx.arc(18,0,34,1.9,4.4);ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-32,0);ctx.lineTo(32,0);ctx.stroke();break;}
case 'slam':{ /* золотая печать суда и трещины земли */
ctx.translate(f.x,GROUND-8);ctx.strokeStyle='#ffd23f';for(let k=0;k<3;k++){ctx.lineWidth=6-k;ctx.beginPath();ctx.ellipse(0,0,30+q*(80+k*45),8+q*(12+k*7),0,0,7);ctx.stroke();}
for(let k=0;k<8;k++){const an=Math.PI+k*Math.PI/7,L=55+q*135;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(an)*L,Math.sin(an)*L*.22);ctx.stroke();}break;}
case 'lunge':{ /* молниевый коридор копья */
ctx.translate(f.x,f.y);ctx.scale(d,1);for(let k=0;k<3;k++){ctx.strokeStyle=k===1?'#fff':'#8fb4ff';ctx.lineWidth=8-k*2;ctx.beginPath();ctx.moveTo(0,k*10-10);
for(let s=1;s<=7;s++)ctx.lineTo(s*44,(s%2?18:-18)+k*10-10);ctx.stroke();}break;}
case 'shadowvolley':{ /* три теневых портала над стрелком */
for(let k=-1;k<=1;k++){const x=f.x+k*45,y=f.y-55-Math.abs(k)*18;ctx.save();ctx.translate(x,y);ctx.rotate(k*.28);ctx.fillStyle='rgba(22,8,38,.75)';ctx.beginPath();ctx.ellipse(0,0,22+q*12,9+q*5,0,0,7);ctx.fill();ctx.strokeStyle='#b48aff';ctx.lineWidth=3;ctx.stroke();ctx.restore();}break;}
case 'seekfan':{ /* изумрудный прицел с пятью ищущими стрелками */
ctx.translate(tx,ty);ctx.strokeStyle='#7dffc4';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,18+q*42,0,7);ctx.stroke();
for(let k=0;k<5;k++){const an=k*1.257-time*2,rr=34+q*55;ctx.save();ctx.translate(Math.cos(an)*rr,Math.sin(an)*rr);ctx.rotate(an+Math.PI);ctx.fillStyle='#d8ffe9';ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(-8,-6);ctx.lineTo(-4,0);ctx.lineTo(-8,6);ctx.closePath();ctx.fill();ctx.restore();}break;}
case 'volley':{ /* веер из пяти небесных молний */
ctx.translate(f.x,f.y);ctx.scale(d,1);for(let k=-2;k<=2;k++){ctx.strokeStyle=k===0?'#fff':'#9db8ff';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,0);
for(let s=1;s<=5;s++)ctx.lineTo(s*55,(k*25*s/3)+(s%2?10:-10));ctx.stroke();}break;}
case 'nail':{ /* тяжёлый прицел-гвоздь */
const an=Math.atan2(ty-f.y,tx-f.x);ctx.translate(tx,ty);ctx.rotate(an);ctx.strokeStyle='#ff8a9d';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,28+q*22,0,7);ctx.stroke();
ctx.strokeStyle='#f5e4d5';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(-105+q*70,0);ctx.lineTo(35,0);ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(42,0);ctx.lineTo(24,-12);ctx.lineTo(24,12);ctx.closePath();ctx.fill();break;}
case 'huntvolley':{ /* три головы ледяных гончих */
for(let k=-1;k<=1;k++){const x=f.x+d*(45+q*120),y=f.y+k*35;ctx.save();ctx.translate(x,y);ctx.scale(d,1);ctx.strokeStyle='#8fe0ff';ctx.lineWidth=5;
ctx.beginPath();ctx.moveTo(-28,-16);ctx.lineTo(2,-25);ctx.lineTo(28,0);ctx.lineTo(2,25);ctx.lineTo(-28,16);ctx.lineTo(-8,0);ctx.closePath();ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(7,-7,3,0,7);ctx.fill();ctx.restore();}break;}
case 'energyburst':{ /* три кольца снятых стихийных статусов */
ctx.translate(f.x,f.y);const cols=['#ff5d6b','#8fe07a','#ff9d45'];for(let k=0;k<3;k++){ctx.strokeStyle=cols[k];ctx.lineWidth=8-k*1.5;ctx.beginPath();ctx.arc(0,0,28+q*(80+k*38),k*2.094+q*4,k*2.094+q*4+4.5);ctx.stroke();}break;}
case 'giantmeteor':{ /* огромный падающий солнечный диск */
const y=-90+q*(GROUND*.82);ctx.translate(W/2,y);const R=42+q*48,g=ctx.createRadialGradient(0,0,5,0,0,R);g.addColorStop(0,'#fff7c8');g.addColorStop(.45,'#ff9d45');g.addColorStop(1,'rgba(255,60,20,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R,0,7);ctx.fill();
ctx.strokeStyle='#ffd27a';ctx.lineWidth=8;for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(-30+k*20,-R);ctx.lineTo(-70+k*45,-R-90);ctx.stroke();}break;}
case 'wildfire':{ /* три непредсказуемые огненные руны */
ctx.translate(f.x,f.y);for(let k=0;k<3;k++){const an=f.seed+k*2.094+q*(5+k),rr=35+k*19,x=Math.cos(an)*rr,y=Math.sin(an)*rr;ctx.fillStyle=k===1?'#ffd27a':'#ff6a28';ctx.beginPath();ctx.moveTo(x,y-16);ctx.quadraticCurveTo(x+18,y,x,y+18);ctx.quadraticCurveTo(x-13,y+2,x,y-16);ctx.fill();}break;}
case 'hole':{ /* фиолетовый горизонт событий сингулярности */
ctx.translate(tx,GROUND-70);ctx.fillStyle='rgba(5,0,12,.92)';ctx.beginPath();ctx.arc(0,0,28+q*38,0,7);ctx.fill();for(let k=0;k<5;k++){ctx.strokeStyle=k%2?'#ff8ac8':'#b48aff';ctx.lineWidth=6-k*.7;ctx.beginPath();ctx.ellipse(0,0,48+k*18+q*30,13+k*6,time*(1.8+k*.2),0,5.4);ctx.stroke();}break;}
case 'desperado':{ /* циферблат остановленного времени */
ctx.translate(f.x,f.y);ctx.strokeStyle='#79ddff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,55+q*95,0,7);ctx.stroke();for(let k=0;k<12;k++){const an=k*.524,R=55+q*95;ctx.beginPath();ctx.moveTo(Math.cos(an)*(R-12),Math.sin(an)*(R-12));ctx.lineTo(Math.cos(an)*R,Math.sin(an)*R);ctx.stroke();}
ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(-1.1-q*5)*70,Math.sin(-1.1-q*5)*70);ctx.stroke();break;}
case 'icespikes':{ /* настоящий ряд поднимающихся ледяных пик */
for(let k=0;k<18;k++){const x=25+k*(W-50)/17,h=(18+42*(.5+.5*Math.sin(k*1.7+f.seed)))*Math.sin(Math.min(1,q*2.2)*Math.PI);ctx.fillStyle=k%2?'#dff6ff':'#8fe0ff';ctx.beginPath();ctx.moveTo(x-13,GROUND);ctx.lineTo(x,GROUND-h);ctx.lineTo(x+13,GROUND);ctx.closePath();ctx.fill();}break;}
case 'icebite':{ /* смыкающаяся пасть из ледяных зубов */
ctx.translate(f.x,f.y);const close=Math.sin(Math.min(1,q*1.5)*Math.PI),R=80-close*28;ctx.strokeStyle='#9de7ff';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,R,-2.8,-.35);ctx.stroke();ctx.beginPath();ctx.arc(0,0,R,.35,2.8);ctx.stroke();ctx.fillStyle='#eaffff';for(let k=-3;k<=3;k++){const x=k*18;ctx.beginPath();ctx.moveTo(x-7,-R);ctx.lineTo(x+7,-R);ctx.lineTo(x,-R+22+close*20);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(x-7,R);ctx.lineTo(x+7,R);ctx.lineTo(x,R-22-close*20);ctx.closePath();ctx.fill();}break;}
case 'glacier':{ /* две противоположные стены ледника */
ctx.translate(f.x,GROUND-8);for(let side=-1;side<=1;side+=2)for(let k=0;k<6;k++){const x=side*(25+k*32+q*45),h=35+(k%3)*18;ctx.fillStyle=k%2?'#dff6ff':'#8fdcff';ctx.beginPath();ctx.moveTo(x-18,0);ctx.lineTo(x,-h);ctx.lineTo(x+18,0);ctx.closePath();ctx.fill();}break;}
case 'flurry':{ /* три последовательных рапирных следа */
ctx.translate(f.x,f.y);ctx.scale(d,1);for(let k=0;k<3;k++){const phase=clamp(q*3-k,0,1),y=(k-1)*22;ctx.strokeStyle=k===2?'#fff':'#9de7ff';ctx.lineWidth=7-k;ctx.beginPath();ctx.moveTo(15,y);ctx.lineTo(25+phase*190,y-12+k*12);ctx.stroke();ctx.fillStyle='#dffaff';ctx.beginPath();ctx.arc(25+phase*190,y-12+k*12,5,0,7);ctx.fill();}break;}
case 'vortex':{ /* голубая воздушная спираль, отдельная от сингулярности */
ctx.translate(tx,ty);for(let k=0;k<6;k++){const st=-time*3+k*1.047,r=20+k*14+q*22;ctx.strokeStyle=k%2?'#dff6ff':'#79cfff';ctx.lineWidth=5-k*.45;ctx.beginPath();ctx.arc(0,0,r,st,st+4.5);ctx.stroke();}break;}
case 'saturation':{ /* сходящиеся к посоху кристаллы заряда */
ctx.translate(f.x,f.y);for(let k=0;k<4;k++){const an=k*1.571+time*.8,rr=95*(1-q)+22*q,x=Math.cos(an)*rr,y=Math.sin(an)*rr;ctx.save();ctx.translate(x,y);ctx.rotate(an+q*4);ctx.strokeStyle='#7fb8ff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,-14);ctx.lineTo(10,0);ctx.lineTo(0,14);ctx.lineTo(-10,0);ctx.closePath();ctx.stroke();ctx.restore();}ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,6+q*12,0,7);ctx.fill();break;}
case 'ballnova':{ /* пятиконечная корона шаровых молний */
ctx.translate(f.x,f.y);const base=Math.atan2(ty-f.y,tx-f.x);for(let k=-2;k<=2;k++){const an=base+k*.4,rr=25+q*90;ctx.save();ctx.translate(Math.cos(an)*rr,Math.sin(an)*rr);ctx.fillStyle='#a9c4ff';ctx.beginPath();ctx.arc(0,0,10+3*Math.sin(time*15+k),0,7);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();for(let s=0;s<5;s++)ctx.lineTo((s%2?8:-8),-10+s*5);ctx.stroke();ctx.restore();}break;}
}
ctx.lineCap='butt';ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.restore();
}
function drawAct2EventArt(e,warning,q,blink){
 const s=e.visualSig||'';if(!s.startsWith('a2_'))return;
 const alpha=warning?.35+.35*q:.72*q,active=!warning;
 ctx.save();ctx.globalCompositeOperation=s==='a2_strikeout'?'source-over':'lighter';ctx.globalAlpha=alpha;ctx.lineCap='round';ctx.lineJoin='round';
 if(s==='a2_suction'){
  ctx.translate(e.x,e.y);ctx.strokeStyle='#65e3e6';for(let k=0;k<5;k++){const r=25+k*23-q*9,st=-time*(1.5+k*.17)+k;ctx.lineWidth=5-k*.55;ctx.beginPath();ctx.arc(0,0,r,st,st+4.4);ctx.stroke();for(let n=0;n<3;n++){const an=st+n*1.35;ctx.beginPath();ctx.arc(Math.cos(an)*r,Math.sin(an)*r,2+k*.35,0,7);ctx.stroke();}}ctx.fillStyle='rgba(5,40,55,.65)';ctx.beginPath();ctx.arc(0,0,18+q*8,0,7);ctx.fill();
 }else if(s==='a2_anchorarc'&&e.x!=null){
  ctx.translate(e.x,e.y);ctx.strokeStyle='#d49a57';ctx.lineWidth=3;for(let k=0;k<8;k++){const an=k*.785+time*.12;ctx.beginPath();ctx.ellipse(Math.cos(an)*(e.r||58)*.8,Math.sin(an)*(e.r||58)*.8,6,3,an,0,7);ctx.stroke();}ctx.translate(0,-(active?12:28*(1-q)));ctx.fillStyle='#b88a52';ctx.fillRect(-4,-28,8,38);ctx.beginPath();ctx.arc(0,8,20,0,Math.PI);ctx.lineTo(13,3);ctx.lineTo(20,15);ctx.lineTo(-20,15);ctx.lineTo(-13,3);ctx.closePath();ctx.fill();
 }else if(s==='a2_strikeout'){
  const dx=e.x2-e.x1,dy=e.y2-e.y1,L=Math.hypot(dx,dy),an=Math.atan2(dy,dx);ctx.translate(e.x1,e.y1);ctx.rotate(an);ctx.fillStyle=active?'#17131d':'rgba(23,19,29,.28)';ctx.beginPath();ctx.moveTo(0,-(e.w||54)*.45);for(let k=0;k<=12;k++){const x=L*k/12,y=Math.sin(k*5.1)*4;ctx.lineTo(x,y-(e.w||54)*.42);}for(let k=12;k>=0;k--){const x=L*k/12,y=Math.cos(k*4.7)*4;ctx.lineTo(x,y+(e.w||54)*.42);}ctx.closePath();ctx.fill();ctx.fillStyle='#a92b35';ctx.font='bold 14px Georgia';for(let k=1;k<9;k++)ctx.fillText(k%2?'×':'§',L*k/9,-9+(k%3)*9);
 }else if(s==='a2_footnote'&&e.kind==='circle'){
  ctx.translate(e.x,e.y);ctx.strokeStyle='#17131d';ctx.lineWidth=3;ctx.strokeRect(-(e.r||48)*.72,-(e.r||48)*.72,(e.r||48)*1.44,(e.r||48)*1.44);ctx.fillStyle='#a92b35';ctx.font='bold 22px Georgia';ctx.textAlign='center';ctx.fillText('¹',(e.r||48)*.25,-(e.r||48)*.18);ctx.setLineDash([3,5]);ctx.beginPath();ctx.moveTo((e.r||48)*.7,0);ctx.lineTo((e.r||48)*1.25,-24);ctx.stroke();ctx.setLineDash([]);
 }else if(s==='a2_forcedstep'){
  const dx=e.x2-e.x1,dy=e.y2-e.y1,L=Math.hypot(dx,dy);ctx.translate(e.x1,e.y1);ctx.rotate(Math.atan2(dy,dx));ctx.strokeStyle='#ff8dab';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);for(let k=1;k<=12;k++)ctx.lineTo(L*k/12,Math.sin(k*2.3+time*5)*3);ctx.stroke();ctx.fillStyle='#f5dfe7';for(let k=1;k<6;k++){ctx.beginPath();ctx.arc(L*k/6,Math.sin(k*2.3+time*5)*3,3,0,7);ctx.fill();}ctx.translate(L,0);ctx.strokeStyle='#d6a45f';ctx.strokeRect(-12,-16,24,8);ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(0,15);ctx.moveTo(-10,2);ctx.lineTo(10,2);ctx.stroke();
 }else if(s==='a2_scissors'){
  const dx=e.x2-e.x1,dy=e.y2-e.y1,L=Math.hypot(dx,dy);ctx.translate(e.x1,e.y1);ctx.rotate(Math.atan2(dy,dx));ctx.strokeStyle='#f2eef0';ctx.lineWidth=5;for(const z of [-1,1]){ctx.beginPath();ctx.moveTo(0,z*(warning?13:3));ctx.lineTo(L,z*(warning?3:0));ctx.stroke();}ctx.strokeStyle='#5b142b';ctx.lineWidth=2;ctx.setLineDash([14,8]);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(L,0);ctx.stroke();ctx.setLineDash([]);
 }else if(s==='a2_applause'){
  const dx=e.x2-e.x1,dy=e.y2-e.y1,L=Math.hypot(dx,dy);ctx.translate(e.x1,e.y1);ctx.rotate(Math.atan2(dy,dx));ctx.fillStyle='rgba(248,222,223,.5)';ctx.beginPath();ctx.roundRect(L*.45,-30,50,60,18);ctx.fill();ctx.strokeStyle='#ff7895';for(let k=0;k<4;k++){ctx.lineWidth=5-k;ctx.beginPath();ctx.arc(L*.9,0,18+k*13,-1.2,1.2);ctx.stroke();}
 }else if(s==='a2_orderdance'){
  const dx=e.x2-e.x1,dy=e.y2-e.y1,L=Math.hypot(dx,dy);ctx.translate(e.x1,e.y1);ctx.rotate(Math.atan2(dy,dx));ctx.strokeStyle='#ffd65a';ctx.lineWidth=2;for(let k=0;k<Math.ceil(L/30);k++){const x=k*30+time*18%30;ctx.beginPath();for(let n=0;n<6;n++){const an=n*1.047;ctx.lineTo(x+Math.cos(an)*12,Math.sin(an)*12);}ctx.closePath();ctx.stroke();ctx.fillStyle='#24180c';ctx.beginPath();ctx.moveTo(x+9,0);ctx.lineTo(x-4,-4);ctx.lineTo(x-4,4);ctx.closePath();ctx.fill();}
 }else if(s==='a2_honeypress'&&e.kind==='judgment'){
  ctx.strokeStyle='#ffe6a0';ctx.fillStyle='rgba(255,198,64,.14)';for(const side of [[0,e.safeX],[e.safeX+e.safeW,W]])for(let x=side[0]+14;x<side[1];x+=28)for(let y=24;y<H;y+=24){ctx.beginPath();for(let n=0;n<6;n++){const an=n*1.047;ctx.lineTo(x+Math.cos(an)*12,y+Math.sin(an)*12);}ctx.closePath();ctx.fill();ctx.stroke();}
 }else if(['a2_fateseed','a2_cargo','a2_order','a2_smallmoon','a2_rippedmoment','a2_wrongpattern'].includes(s)&&e.x!=null){
  ctx.translate(e.x,e.y);const R=e.r||55;if(s==='a2_fateseed'){ctx.strokeStyle='#789648';ctx.lineWidth=3;for(let k=0;k<9;k++){const an=k*.698;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(Math.cos(an+.4)*R*.5,Math.sin(an+.4)*R*.5,Math.cos(an)*R,Math.sin(an)*R);ctx.stroke();}ctx.fillStyle='#7b5429';ctx.beginPath();ctx.ellipse(0,-8,9,14,0,0,7);ctx.fill();}
  else if(s==='a2_cargo'){ctx.strokeStyle='#d3b77a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-18,-R);ctx.lineTo(-18,-22);ctx.moveTo(18,-R);ctx.lineTo(18,-22);ctx.stroke();ctx.fillStyle='#926945';ctx.strokeStyle='#c79b55';ctx.fillRect(-24,-22,48,38);ctx.strokeRect(-24,-22,48,38);ctx.beginPath();ctx.moveTo(-24,-22);ctx.lineTo(24,16);ctx.moveTo(24,-22);ctx.lineTo(-24,16);ctx.stroke();}
  else if(s==='a2_order'){ctx.fillStyle='rgba(242,227,207,.55)';ctx.strokeStyle=e.col;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,R*.72,0,7);ctx.fill();ctx.stroke();ctx.font='bold 22px Georgia';ctx.textAlign='center';ctx.fillStyle=e.col;ctx.fillText(e.col==='#ff7777'?'♨':e.col==='#77bbff'?'❄':'✿',0,8);}
  else if(s==='a2_smallmoon'){ctx.fillStyle='#08142b';ctx.strokeStyle='#dce8ff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,R*.72,0,7);ctx.fill();ctx.stroke();ctx.strokeStyle='#79cfff';ctx.beginPath();ctx.ellipse(0,0,R,R*.34,time*.3,0,7);ctx.stroke();}
  else if(s==='a2_rippedmoment'){ctx.strokeStyle='#f3cf72';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,R*.75,0,7);ctx.stroke();ctx.font='bold 20px Georgia';ctx.textAlign='center';ctx.fillStyle='#fff0a8';ctx.fillText(['I','II','III'][Math.abs(Math.floor(e.x+e.y))%3],0,7);for(let k=0;k<8;k++){const an=k*.785;ctx.beginPath();ctx.moveTo(Math.cos(an)*R*.65,Math.sin(an)*R*.65);ctx.lineTo(Math.cos(an)*R*.85,Math.sin(an)*R*.85);ctx.stroke();}}
  else {ctx.fillStyle='rgba(40,27,77,.42)';ctx.strokeStyle='#e1bd63';ctx.lineWidth=3;ctx.fillRect(-R*.75,-R*.8,R*1.5,R*1.6);ctx.strokeRect(-R*.75,-R*.8,R*1.5,R*1.6);for(let k=-2;k<=2;k++){ctx.beginPath();ctx.moveTo(-R*.65,k*R*.25);ctx.lineTo(R*.65,k*R*.25+Math.sin(k)*8);ctx.stroke();}}
 }else if(['a2_pruning','a2_fullsail','a2_fracture','a2_shardlance','a2_tablecloth','a2_places','a2_poleshift','a2_stitch'].includes(s)&&e.x1!=null){
  const dx=e.x2-e.x1,dy=e.y2-e.y1,L=Math.hypot(dx,dy);ctx.translate(e.x1,e.y1);ctx.rotate(Math.atan2(dy,dx));
  if(s==='a2_pruning'){ctx.strokeStyle='#dfe7e8';ctx.lineWidth=5;for(const z of [-1,1]){ctx.beginPath();ctx.moveTo(0,z*10*(warning?1:q));ctx.lineTo(L,z*2);ctx.stroke();}ctx.fillStyle='#789648';for(let k=1;k<10;k++){ctx.beginPath();ctx.ellipse(L*k/10,(k%2?1:-1)*9,8,3,k,0,7);ctx.fill();}}
  else if(s==='a2_fullsail'){ctx.fillStyle='rgba(203,233,236,.28)';ctx.strokeStyle='#638fa4';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-32);ctx.quadraticCurveTo(L*.5,-55,L,0);ctx.quadraticCurveTo(L*.5,55,0,32);ctx.closePath();ctx.fill();ctx.stroke();for(let k=1;k<6;k++){ctx.beginPath();ctx.moveTo(L*k/6,-30);ctx.lineTo(L*k/6,30);ctx.stroke();}}
  else if(s==='a2_fracture'){ctx.strokeStyle='#3ab6ff';ctx.lineWidth=active?7:3;ctx.beginPath();ctx.moveTo(0,0);for(let k=1;k<=12;k++)ctx.lineTo(L*k/12,(k%2?1:-1)*(3+k%3*3));ctx.stroke();ctx.strokeStyle='#f3f7f1';ctx.lineWidth=2;for(let k=2;k<12;k+=2){ctx.beginPath();ctx.moveTo(L*k/12,0);ctx.lineTo(L*k/12+8,(k%4?1:-1)*14);ctx.stroke();}}
  else if(s==='a2_shardlance'){ctx.fillStyle='#f3f7f1';ctx.strokeStyle='#2767a5';ctx.lineWidth=2;for(let k=0;k<8;k++){const x=L*(warning?q:1)*k/8;ctx.save();ctx.translate(x,(k%2?1:-1)*8);ctx.rotate(k*.8);ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(-7,-5);ctx.lineTo(-4,5);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}}
  else if(s==='a2_tablecloth'){ctx.fillStyle='rgba(234,216,203,.45)';ctx.strokeStyle='#956248';ctx.beginPath();ctx.moveTo(0,-28);for(let k=0;k<=10;k++)ctx.lineTo(L*k/10,-28+Math.sin(k*1.8+time*5)*9);for(let k=10;k>=0;k--)ctx.lineTo(L*k/10,28+Math.sin(k*1.8+time*5)*9);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(120,70,70,.4)';for(let k=1;k<10;k++){ctx.beginPath();ctx.moveTo(L*k/10,-25);ctx.lineTo(L*k/10,25);ctx.stroke();}}
  else if(s==='a2_places'){ctx.strokeStyle='#bfc0b8';ctx.lineWidth=5;for(let k=0;k<3;k++){const x=L*(.25+k*.25);ctx.beginPath();ctx.moveTo(x,-30);ctx.lineTo(x,30);ctx.stroke();ctx.beginPath();ctx.moveTo(x-5,-30);ctx.lineTo(x-5,-16);ctx.moveTo(x+5,-30);ctx.lineTo(x+5,-16);ctx.stroke();}}
  else if(s==='a2_poleshift'){ctx.strokeStyle='#7592b9';ctx.lineWidth=2;for(let k=0;k<L;k+=34){ctx.beginPath();ctx.moveTo(k,-18);ctx.lineTo(k+18,0);ctx.lineTo(k,18);ctx.stroke();ctx.beginPath();ctx.moveTo(k+10,-5);ctx.lineTo(k+18,0);ctx.lineTo(k+10,5);ctx.stroke();}}
  else {ctx.strokeStyle='#e1bd63';ctx.lineWidth=3;ctx.setLineDash([8,7]);ctx.lineDashOffset=-time*35;for(const z of [-1,1]){ctx.beginPath();ctx.moveTo(0,z*8);ctx.lineTo(L,z*8);ctx.stroke();}ctx.setLineDash([]);for(let k=1;k<10;k++){const x=L*k/10;ctx.beginPath();ctx.moveTo(x,-8);ctx.lineTo(x+8,8);ctx.stroke();}}
 }
 ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.setLineDash([]);ctx.restore();
}
function drawBossEvents(){
 for(const e of bossEvents){const warning=!e.fired,q=warning?clamp(1-e.t/(e.maxWarn||1),0,1):clamp(e.life/(e.maxLife||1),0,1),blink=.55+.35*Math.sin(time*18);ctx.save();ctx.globalCompositeOperation='lighter';
  drawAct2EventArt(e,warning,q,blink);
  const col=e.ice?'#9deaff':(e.fire?'#ff8a3d':(e.ghost?'#c9a0ff':(e.bone?'#eee4c7':e.col||'#ff6b4a')));
  if(e.kind==='circle'||e.kind==='grip'||e.kind==='rune'||e.kind==='anvil'||e.kind==='mire'){
   ctx.translate(e.x,e.y);ctx.scale(1,e.kind==='mire'?.28:1);ctx.fillStyle=hexA(col,warning?.06+.10*q:.18*q);ctx.beginPath();ctx.arc(0,0,e.r||60,0,7);ctx.fill();ctx.strokeStyle=hexA(col,warning?blink:.9*q);ctx.lineWidth=warning?2+q*3:7*q;ctx.setLineDash(warning?[9,7]:[]);ctx.beginPath();ctx.arc(0,0,(e.r||60)*(warning?(.72+.28*q):1),0,7);ctx.stroke();ctx.setLineDash([]);
   if(e.kind==='rune'){ctx.rotate(time*.7);for(let k=0;k<8;k++){const an=k*.785,R=(e.r||60)*.72;ctx.font='bold 18px Georgia';ctx.fillStyle=hexA('#e6dcff',blink);ctx.fillText(k%2?'ᚱ':'✦',Math.cos(an)*R,Math.sin(an)*R);}}
   if(e.kind==='anvil'&&!warning){ctx.scale(1,3.57);ctx.fillStyle='#4b3a38';ctx.fillRect(-34,-72,68,38);ctx.fillStyle='#ffb05a';ctx.fillRect(-25,-68,50,7);}
  }else if(e.kind==='line'||e.kind==='dashline'||e.kind==='tongue'){
   ctx.strokeStyle=hexA(col,warning?blink:.95*q);ctx.lineWidth=warning?2:(e.w||25);ctx.setLineDash(warning?[12,9]:[]);ctx.beginPath();ctx.moveTo(e.x1,e.y1);ctx.lineTo(e.x2,e.y2);ctx.stroke();ctx.setLineDash([]);
   if(e.kind==='tongue'){ctx.strokeStyle=hexA('#ff8aa0',warning?.55:.95*q);ctx.lineWidth=warning?3:12;ctx.beginPath();ctx.moveTo(e.x1,e.y1);for(let k=1;k<=7;k++){const u=k/7;ctx.lineTo(e.x1+(e.x2-e.x1)*u,e.y1+(e.y2-e.y1)*u+Math.sin(u*18-time*12)*4);}ctx.stroke();}
   if(e.spear&&!warning){const an=Math.atan2(e.y2-e.y1,e.x2-e.x1);ctx.fillStyle='#f3ead3';ctx.save();ctx.translate(e.x2,e.y2);ctx.rotate(an);ctx.beginPath();ctx.moveTo(22,0);ctx.lineTo(-10,-9);ctx.lineTo(-5,0);ctx.lineTo(-10,9);ctx.closePath();ctx.fill();ctx.restore();}
  }else if(e.kind==='pillar'||e.kind==='hand'){
   const rise=warning?q:1;ctx.translate(e.x,e.y);ctx.strokeStyle=hexA(col,warning?blink:.9*q);ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,e.r||30,9,0,0,7);ctx.stroke();
   if(e.kind==='pillar'){ctx.fillStyle=hexA(col,warning?.28:.8*q);for(let k=-1;k<=1;k++){const x=k*18,h=(24+18*(k===0))*rise;ctx.beginPath();ctx.moveTo(x-13,0);ctx.lineTo(x,-h);ctx.lineTo(x+13,0);ctx.closePath();ctx.fill();}}
   else {ctx.strokeStyle=hexA('#d8c6ff',warning?.45:.9*q);ctx.lineWidth=8;for(let k=-2;k<=2;k++){ctx.beginPath();ctx.moveTo(k*7,0);ctx.quadraticCurveTo(k*10,-35*rise,k*15,-55*rise);ctx.stroke();}}
  }else if(e.kind==='vortex'){
   ctx.translate(e.x,e.y);for(let k=0;k<6;k++){const r=24+k*18+(warning?q*20:0);ctx.strokeStyle=hexA('#cbeaff',(warning?.35:.7*q)-k*.04);ctx.lineWidth=5-k*.5;ctx.beginPath();ctx.arc(0,0,r,-time*(2+k*.18)+k,-time*(2+k*.18)+k+4.6);ctx.stroke();}
  }else if(e.kind==='march'){
   const x=e.fired?e.pos:(e.dir>0?-35:W+35);for(let k=-3;k<=3;k++){const xx=x+k*44,skip=Math.abs(xx-e.gap)<55;ctx.globalAlpha=skip?.14:(warning?blink:.85*q);ctx.strokeStyle='#eee4c7';ctx.lineWidth=4;ctx.beginPath();ctx.arc(xx,GROUND-48,13,0,7);ctx.stroke();ctx.beginPath();ctx.moveTo(xx,GROUND-35);ctx.lineTo(xx,GROUND-5);ctx.moveTo(xx,GROUND-26);ctx.lineTo(xx+e.dir*18,GROUND-16);ctx.stroke();}ctx.globalAlpha=1;
  }else if(e.kind==='judgment'){
   ctx.fillStyle=`rgba(255,70,35,${warning?.06+.08*q:.2*q})`;ctx.fillRect(0,0,Math.max(0,e.safeX),H);ctx.fillRect(e.safeX+e.safeW,0,W-e.safeX-e.safeW,H);ctx.strokeStyle=`rgba(255,220,120,${warning?blink:.9*q})`;ctx.lineWidth=4;ctx.setLineDash([12,8]);ctx.strokeRect(e.safeX,e.safeY-80,e.safeW,82);ctx.setLineDash([]);ctx.font='700 13px "IBM Plex Mono"';ctx.textAlign='center';ctx.fillStyle='#fff0b0';ctx.fillText('БЕЗОПАСНАЯ ПЛАТФОРМА',e.safeX+e.safeW/2,e.safeY-90);
  }
  ctx.globalCompositeOperation='source-over';ctx.restore();
 }
}
function drawFx(){
for(const f of fxList){
const a=f.life/f.max;
if(typeof drawSkinCombatFx==='function'&&drawSkinCombatFx(f))continue;
if(f.type==='awakenAlt'){drawAwakenAltFx(f,a);continue;}
if(f.type==='bossdodge'){
 const q=1-a;ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(f.c||'#bfe6ff',a*.8);ctx.lineWidth=3+5*a;ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.quadraticCurveTo((f.x+f.tx)/2,f.y-35,f.tx,f.ty);ctx.stroke();for(let k=0;k<4;k++){const u=clamp(q-k*.12,0,1);ctx.fillStyle=hexA(f.c||'#bfe6ff',a*(.45-k*.08));ctx.beginPath();ctx.arc(f.x+(f.tx-f.x)*u,f.y+(f.ty-f.y)*u,9-k,0,7);ctx.fill();}ctx.restore();
}else if(f.type==='bossafter'){
 ctx.save();ctx.globalAlpha=a*.45;ctx.fillStyle=f.c||'#c9a0ff';ctx.beginPath();ctx.ellipse(f.x,f.y,25+20*(1-a),42+12*(1-a),0,0,7);ctx.fill();ctx.restore();
}else if(f.type==='bossparry'||f.type==='shieldbreak'||f.type==='berserkburst'){
 const q=1-a,R=(f.type==='berserkburst'?30:18)+q*(f.type==='berserkburst'?150:105);ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(f.type==='shieldbreak'?'#ffffff':(f.c||'#ffd27a'),a);ctx.lineWidth=6*a+2;for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(f.x,f.y,R+k*13,k*1.4+q*3,k*1.4+q*3+4.7);ctx.stroke();}ctx.restore();
}else if(f.type==='forgeweapon'){
 const q=1-a;ctx.save();ctx.translate(f.x,f.y-30*q);ctx.rotate((q-.5)*.5);ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(255,190,95,${a})`;ctx.lineWidth=7;if(f.form===0){ctx.beginPath();ctx.moveTo(-35,20);ctx.lineTo(40,-28);ctx.stroke();}else if(f.form===1){ctx.beginPath();ctx.moveTo(-55,0);ctx.lineTo(60,0);ctx.stroke();}else{ctx.strokeRect(-25,-20,50,40);ctx.beginPath();ctx.moveTo(0,20);ctx.lineTo(0,60);ctx.stroke();}ctx.restore();
}else if(f.type==='bossportal'){
 const q=1-a;ctx.save();ctx.translate(f.x,f.y);ctx.rotate(time*2);ctx.strokeStyle=hexA(f.c||'#b48aff',a);ctx.lineWidth=4;for(let k=0;k<3;k++){ctx.beginPath();ctx.ellipse(0,0,12+q*24+k*8,28+q*35+k*7,k*.6,0,5.2);ctx.stroke();}ctx.restore();
}else if(f.type==='enemyweb'){
ctx.strokeStyle=`rgba(215,181,255,${Math.min(.78,a)})`;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(f.x1,f.y1);ctx.lineTo(f.x2,f.y2);ctx.stroke();
ctx.lineWidth=1;for(let k=1;k<5;k++){const q=k/5,x=f.x1+(f.x2-f.x1)*q,y=f.y1+(f.y2-f.y1)*q;ctx.beginPath();ctx.arc(x,y,8+3*Math.sin(time*4+k),0,7);ctx.stroke();}
}else if(f.type==='timezone'){
ctx.save();ctx.translate(f.x,f.y);ctx.strokeStyle=`rgba(183,180,255,${a*.65})`;for(let k=0;k<3;k++){ctx.lineWidth=2-k*.35;ctx.beginPath();ctx.arc(0,0,f.r*(.62+k*.18),time*(k%2?-.5:.5)+k, time*(k%2?-.5:.5)+k+4.7);ctx.stroke();}
ctx.fillStyle=`rgba(105,100,210,${a*.09})`;ctx.beginPath();ctx.arc(0,0,f.r,0,7);ctx.fill();ctx.restore();
}else if(f.type==='sporecast'||f.type==='revivebeam'){
const x1=f.x==null?f.x1:f.x,y1=f.y==null?f.y1:f.y,x2=f.tx==null?f.x2:f.tx,y2=f.ty==null?f.y2:f.ty;
ctx.strokeStyle=f.type==='sporecast'?`rgba(169,216,115,${a})`:`rgba(203,181,255,${a})`;ctx.lineWidth=4;ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.setLineDash([]);
}else if(f.type==='soulsteal'){
ctx.strokeStyle=`rgba(191,230,255,${a})`;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(f.a.x,f.a.y);ctx.quadraticCurveTo((f.a.x+f.b.x)/2,f.a.y-70,f.b.x,f.b.y);ctx.stroke();
}else if(f.type==='prismburst'||f.type==='magnetpulse'||f.type==='buildflash'){
const q=1-a,R=(f.type==='prismburst'?25:18)+q*(f.type==='prismburst'?115:70);ctx.strokeStyle=f.type==='prismburst'?`rgba(159,243,255,${a})`:(f.type==='magnetpulse'?`rgba(201,228,255,${a})`:`rgba(224,178,122,${a})`);ctx.lineWidth=4;ctx.beginPath();ctx.arc(f.x,f.y,R,0,7);ctx.stroke();
}else if(f.type==='mimicslash'){
ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.dir||1,1);ctx.strokeStyle=`rgba(255,210,122,${a})`;ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,0,70,-1.1,1.1);ctx.stroke();ctx.restore();
}else if(f.type==='claw'){
ctx.strokeStyle=`rgba(255,90,70,${a})`;ctx.lineWidth=2.5;
for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(f.x-10,f.y+i*6-6);ctx.lineTo(f.x+10,f.y+i*6+4);ctx.stroke();}
}else if(f.type==='thornretaliate'){
const q=1-a,ang=Math.atan2(f.ty-f.y,f.tx-f.x),R=18+q*34,col=f.col||'#b8d08a';
ctx.save();ctx.translate(f.x,f.y);ctx.rotate(ang);ctx.globalCompositeOperation='lighter';
ctx.strokeStyle=hexA(col,a*.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.hypot(f.tx-f.x,f.ty-f.y),0);ctx.stroke();
ctx.fillStyle=hexA(col,a);for(let k=-2;k<=2;k++){const x=R+k*9;ctx.beginPath();ctx.moveTo(x,-5);ctx.lineTo(x+18,0);ctx.lineTo(x,5);ctx.closePath();ctx.fill();}
ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='spikebloom'){
const q=1-a,R=22+q*132,col=f.col||'#d7e889';ctx.save();ctx.translate(f.x,f.y);ctx.globalCompositeOperation='lighter';
ctx.strokeStyle=hexA(col,a*.65);ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,R*.72,0,7);ctx.stroke();
ctx.fillStyle=hexA(col,a);for(let k=0;k<16;k++){const an=k*6.283/16+q*.35,x=Math.cos(an)*R,y=Math.sin(an)*R;
ctx.save();ctx.translate(x,y);ctx.rotate(an);ctx.beginPath();ctx.moveTo(-15,-5);ctx.lineTo(13,0);ctx.lineTo(-15,5);ctx.closePath();ctx.fill();ctx.restore();}
ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='bloodvine'){
const q=1-a;ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.dir||1,1);ctx.globalCompositeOperation='lighter';
for(let k=-1;k<=1;k++){ctx.strokeStyle=`rgba(255,72,104,${a*(.92-Math.abs(k)*.15)})`;ctx.lineWidth=7-Math.abs(k)*2;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(0,k*7);ctx.bezierCurveTo(55,-48+k*20,135,52-k*18,220+q*12,k*12);ctx.stroke();
ctx.fillStyle=`rgba(255,170,180,${a})`;for(let j=1;j<5;j++){const x=j*42,y=Math.sin(j*2.2+k)*20;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-10,y-13);ctx.lineTo(x+5,y-5);ctx.closePath();ctx.fill();}}
ctx.lineCap='butt';ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='stormram'){
const q=1-a;ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.dir||1,1);ctx.globalCompositeOperation='lighter';
ctx.fillStyle=`rgba(100,145,255,${a*.2})`;ctx.beginPath();ctx.moveTo(-18,-34);ctx.lineTo(235+q*35,0);ctx.lineTo(-18,34);ctx.closePath();ctx.fill();
for(let k=0;k<4;k++){ctx.strokeStyle=k===0?`rgba(255,255,255,${a})`:`rgba(145,184,255,${a*.75})`;ctx.lineWidth=4-k*.6;ctx.beginPath();ctx.moveTo(-5,k*10-15);
for(let j=1;j<=6;j++)ctx.lineTo(j*38,(j%2?1:-1)*(17-k*2));ctx.stroke();}
ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='fortressslam'){
const q=1-a,R=25+q*165;ctx.save();ctx.translate(f.x,f.y);ctx.globalCompositeOperation='lighter';
for(let k=0;k<3;k++){ctx.strokeStyle=`rgba(216,200,162,${a*(.9-k*.2)})`;ctx.lineWidth=7-k*1.5;ctx.beginPath();ctx.ellipse(0,0,R+k*13,10+k*4,0,0,7);ctx.stroke();}
ctx.fillStyle=`rgba(225,214,185,${a})`;for(let k=0;k<12;k++){const an=k*6.283/12,x=Math.cos(an)*R,y=Math.sin(an)*R*.16;
ctx.beginPath();ctx.moveTo(x-7,y);ctx.lineTo(x,y-18-q*16);ctx.lineTo(x+7,y);ctx.closePath();ctx.fill();}
ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='reacharc'){
const q=1-a,show=Math.sin(Math.min(1,q*3)*Math.PI/2);
const span=Math.max(.08,Math.asin(Math.min(.95,(f.half||20)/f.r)));
ctx.save();ctx.translate(f.x,f.y);ctx.globalCompositeOperation='lighter';
ctx.strokeStyle=`rgba(255,225,145,${Math.pow(a,.7)*.9})`;ctx.lineWidth=1.25;ctx.lineCap='round';
ctx.beginPath();ctx.arc(0,0,f.r,f.ang-span*show,f.ang+span*show);ctx.stroke();
const ex=Math.cos(f.ang)*f.r,ey=Math.sin(f.ang)*f.r,nx=-Math.sin(f.ang),ny=Math.cos(f.ang);
ctx.strokeStyle=`rgba(255,242,196,${a*.65})`;ctx.lineWidth=1;
ctx.beginPath();ctx.moveTo(ex-nx*4,ey-ny*4);ctx.lineTo(ex+nx*4,ey+ny*4);ctx.stroke();
ctx.lineCap='butt';ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='legiongate'){
const q=1-a;ctx.save();ctx.translate(f.x,f.y);ctx.globalCompositeOperation='lighter';
for(let k=0;k<3;k++){const R=14+q*(42+k*18);ctx.strokeStyle=`rgba(201,160,255,${a*(.8-k*.18)})`;ctx.lineWidth=2-k*.35;
ctx.beginPath();ctx.arc(0,0,R,time*(k%2?2:-2)+k,0,5.1);ctx.stroke();}
for(let k=0;k<6;k++){const an=k*1.047+q*5,rr=28+q*54;ctx.fillStyle=`rgba(236,224,248,${a})`;ctx.beginPath();ctx.arc(Math.cos(an)*rr,Math.sin(an)*rr,3,0,7);ctx.fill();}
ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='choirwave'){
const q=1-a;ctx.save();ctx.translate(f.x,f.y);ctx.globalCompositeOperation='lighter';ctx.textAlign='center';
for(let k=0;k<4;k++){ctx.strokeStyle=`rgba(143,224,255,${a*(.7-k*.12)})`;ctx.lineWidth=2;
ctx.beginPath();ctx.ellipse(0,0,25+q*(70+k*34),8+q*(18+k*8),0,0,7);ctx.stroke();}
ctx.font='700 20px serif';ctx.fillStyle=`rgba(210,245,255,${a})`;for(let k=-2;k<=2;k++)ctx.fillText(k%2?'♪':'♫',k*30,-20-q*(30+Math.abs(k)*12));
ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='mawgate'){
const q=1-a,R=12+q*56;ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.ang||0);ctx.globalCompositeOperation='lighter';
ctx.strokeStyle=`rgba(255,138,200,${a})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,R,-2.7,-.25);ctx.stroke();ctx.beginPath();ctx.arc(0,0,R,.25,2.7);ctx.stroke();
ctx.fillStyle=`rgba(255,215,235,${a*.85})`;for(let k=-3;k<=3;k++){ctx.beginPath();ctx.moveTo(k*8,-R);ctx.lineTo(k*8+4,-R+12);ctx.lineTo(k*8-4,-R+12);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(k*8,R);ctx.lineTo(k*8+4,R-12);ctx.lineTo(k*8-4,R-12);ctx.closePath();ctx.fill();}
ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='dragongate'){
const q=1-a,R=18+q*76;ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.dir||1,1);ctx.globalCompositeOperation='lighter';
ctx.strokeStyle=`rgba(240,226,192,${a})`;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,0,R*.55,R,0,0,7);ctx.stroke();
for(let k=-3;k<=3;k++){const yy=k*R/4,xx=Math.cos(k*.8+time*5)*R*.32;ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx-18,yy-7);ctx.moveTo(xx,yy);ctx.lineTo(xx-18,yy+7);ctx.stroke();}
ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='soulreturn'){
const q=1-a,mx=(f.a.x+f.b.x)/2,my=Math.min(f.a.y,f.b.y)-45;
ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(255,138,200,${a*.65})`;ctx.lineWidth=2;
ctx.beginPath();ctx.moveTo(f.a.x,f.a.y);ctx.quadraticCurveTo(mx,my,f.b.x,f.b.y);ctx.stroke();
const u=q,x=(1-u)*(1-u)*f.a.x+2*(1-u)*u*mx+u*u*f.b.x,y=(1-u)*(1-u)*f.a.y+2*(1-u)*u*my+u*u*f.b.y;
ctx.fillStyle=`rgba(255,220,240,${a})`;ctx.beginPath();ctx.arc(x,y,4+Math.sin(time*18)*1.5,0,7);ctx.fill();ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='choirnote'){
const q=1-a,mx=(f.a.x+f.b.x)/2,my=(f.a.y+f.b.y)/2-30;ctx.save();ctx.globalCompositeOperation='lighter';
ctx.strokeStyle=`rgba(143,224,255,${a*.8})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(f.a.x,f.a.y);ctx.quadraticCurveTo(mx,my,f.b.x,f.b.y);ctx.stroke();
ctx.font='700 13px serif';ctx.fillStyle=`rgba(220,248,255,${a})`;ctx.fillText('♪',mx,my);ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='legionlink'){
ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(201,160,255,${a*.7})`;ctx.lineWidth=1;
ctx.setLineDash([3,5]);ctx.beginPath();ctx.moveTo(f.a.x,f.a.y);ctx.lineTo(f.b.x,f.b.y);ctx.stroke();ctx.setLineDash([]);ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='boneburst'){
const q=1-a;ctx.save();ctx.translate(f.x,f.y);ctx.strokeStyle=`rgba(240,226,192,${a})`;ctx.lineWidth=3;
for(let k=0;k<8;k++){const an=k*.785,ri=8+q*18,ro=18+q*48;ctx.beginPath();ctx.moveTo(Math.cos(an)*ri,Math.sin(an)*ri);ctx.lineTo(Math.cos(an)*ro,Math.sin(an)*ro);ctx.stroke();}
ctx.restore();
}else if(f.type==='countercut'){
const q=1-a,flash=Math.sin(Math.min(1,q*1.7)*Math.PI);
ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.dir||1,1);ctx.globalCompositeOperation='lighter';
ctx.strokeStyle=`rgba(255,244,215,${a})`;ctx.lineWidth=3+flash*4;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(-58+q*18,30);ctx.quadraticCurveTo(0,-42,66,-24+q*12);ctx.stroke();
ctx.strokeStyle=`rgba(255,194,105,${a*.75})`;ctx.lineWidth=2;
ctx.beginPath();ctx.moveTo(-40,-28);ctx.lineTo(48,25);ctx.stroke();
ctx.strokeStyle=`rgba(255,233,190,${a*.55})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(-24,0,27,-1.2,1.2);ctx.stroke();
ctx.globalCompositeOperation='source-over';ctx.lineCap='butt';ctx.restore();
}else if(f.type==='bastion'){
const q=1-a,R=34+q*112;
ctx.save();ctx.translate(f.x,f.y);ctx.globalCompositeOperation='lighter';
for(let k=0;k<3;k++){ctx.strokeStyle=`rgba(255,210,63,${a*(.72-k*.16)})`;ctx.lineWidth=6-k*1.4;
ctx.beginPath();ctx.arc(0,0,R+k*10,-2.55,-.59);ctx.stroke();}
ctx.fillStyle=`rgba(255,224,110,${a*.12})`;ctx.beginPath();ctx.arc(0,0,R,0,7);ctx.fill();
for(let k=0;k<6;k++){const an=k*1.047+time*.35;ctx.fillStyle=`rgba(255,240,180,${a*.8})`;
ctx.beginPath();ctx.arc(Math.cos(an)*R,Math.sin(an)*R,2.6,0,7);ctx.fill();}
ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='rotcrescent'){
const q=1-a;
ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.dir||1,1);ctx.rotate(-1.1+q*2.2);ctx.globalCompositeOperation='lighter';
ctx.strokeStyle=`rgba(182,217,74,${a})`;ctx.lineWidth=9;ctx.lineCap='round';
ctx.beginPath();ctx.arc(0,0,62,-1.15,1.15);ctx.stroke();
ctx.strokeStyle=`rgba(143,224,122,${a*.8})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,72,-1.05,1.05);ctx.stroke();
ctx.fillStyle=`rgba(80,35,90,${a*.35})`;ctx.beginPath();ctx.arc(12,0,45,-1.05,1.05);ctx.lineTo(28,0);ctx.closePath();ctx.fill();
ctx.lineCap='butt';ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='rotspin'){
const q=1-a;
ctx.save();ctx.translate(f.x,f.y);ctx.globalCompositeOperation='lighter';
for(let k=0;k<3;k++){const st=q*6.2+k*2.094;ctx.strokeStyle=k===1?`rgba(143,224,122,${a*.75})`:`rgba(182,217,74,${a*.9})`;
ctx.lineWidth=3+k;ctx.beginPath();ctx.arc(0,0,45+k*16,st,st+2.25);ctx.stroke();}
ctx.fillStyle=`rgba(120,180,55,${a*.16})`;ctx.beginPath();ctx.arc(0,0,82,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='devourbite'){
const q=1-a,close=Math.sin(Math.min(1,q*1.4)*Math.PI);
ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.dir||1,1);ctx.globalCompositeOperation='lighter';
ctx.strokeStyle=`rgba(255,138,157,${a})`;ctx.lineWidth=4;
ctx.beginPath();ctx.arc(0,0,34,-2.65,-.3-close*.35);ctx.stroke();ctx.beginPath();ctx.arc(0,0,34,.3+close*.35,2.65);ctx.stroke();
ctx.fillStyle=`rgba(255,235,225,${a*.9})`;
for(let k=-2;k<=2;k++){const x=k*10;ctx.beginPath();ctx.moveTo(x-4,-24+close*16);ctx.lineTo(x+4,-24+close*16);ctx.lineTo(x, -12+close*18);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.moveTo(x-4,24-close*16);ctx.lineTo(x+4,24-close*16);ctx.lineTo(x,12-close*18);ctx.closePath();ctx.fill();}
ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='bonecrush'){
const q=1-a,drop=Math.min(1,q*2.2),yy=-92*(1-drop);
ctx.save();ctx.translate(f.x,f.y);ctx.rotate(-.18*(f.dir||1)*(1-drop));
ctx.strokeStyle=`rgba(216,211,192,${a})`;ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,yy-50);ctx.lineTo(0,yy+10);ctx.stroke();
ctx.fillStyle=`rgba(170,183,189,${a})`;ctx.fillRect(-28,yy-57,56,22);ctx.fillStyle=`rgba(240,236,218,${a*.8})`;ctx.fillRect(-22,yy-53,44,5);
if(drop>.75){const r=(drop-.75)*260;ctx.strokeStyle=`rgba(216,211,192,${a})`;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,r,8+r*.1,0,0,7);ctx.stroke();}
ctx.lineCap='butt';ctx.restore();
}else if(f.type==='harvest'){
const q=1-a,st=-2.5+q*5.5;
ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.dir||1,1);ctx.globalCompositeOperation='lighter';
ctx.strokeStyle=`rgba(174,242,176,${a})`;ctx.lineWidth=8;ctx.lineCap='round';ctx.beginPath();ctx.arc(0,0,74,st,st+2.7);ctx.stroke();
ctx.strokeStyle=`rgba(220,255,225,${a*.7})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,88,st-.25,st+2.95);ctx.stroke();
for(let k=0;k<5;k++){const an=st+k*.55;ctx.fillStyle=`rgba(174,242,176,${a*(1-k*.12)})`;ctx.beginPath();ctx.arc(Math.cos(an)*82,Math.sin(an)*42,3,0,7);ctx.fill();}
ctx.lineCap='butt';ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='bloodcleave'){
const q=1-a;
ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.dir||1,1);ctx.rotate(-1.35+q*2.5);ctx.globalCompositeOperation='lighter';
ctx.strokeStyle=`rgba(255,70,78,${a*.9})`;ctx.lineWidth=14;ctx.lineCap='round';ctx.beginPath();ctx.arc(0,0,84,-1.1,1.05);ctx.stroke();
ctx.strokeStyle=`rgba(255,210,190,${a})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,94,-1.03,.98);ctx.stroke();
for(let k=0;k<4;k++){ctx.fillStyle=`rgba(255,93,93,${a*.75})`;ctx.beginPath();ctx.arc(78+k*9,-18+k*7,3-k*.35,0,7);ctx.fill();}
ctx.lineCap='butt';ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='flailwhirl'){
const q=1-a,an=q*12.5*(f.dir||1),R=65+Math.sin(q*Math.PI)*55;
ctx.save();ctx.translate(f.x,f.y);ctx.globalCompositeOperation='lighter';
ctx.strokeStyle=`rgba(190,202,207,${a*.8})`;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(0,0);
for(let k=1;k<=7;k++){const rr=R*k/7,aa=an-k*.08*(f.dir||1);ctx.lineTo(Math.cos(aa)*rr,Math.sin(aa)*rr*.55);}ctx.stroke();
const bx=Math.cos(an)*R,by=Math.sin(an)*R*.55;ctx.fillStyle=`rgba(170,183,189,${a})`;ctx.beginPath();ctx.arc(bx,by,11,0,7);ctx.fill();
for(let k=0;k<8;k++){const aa=k*.785+an*.2;ctx.strokeStyle=`rgba(220,230,232,${a*.75})`;ctx.beginPath();ctx.moveTo(bx+Math.cos(aa)*8,by+Math.sin(aa)*8);ctx.lineTo(bx+Math.cos(aa)*16,by+Math.sin(aa)*16);ctx.stroke();}
ctx.strokeStyle=`rgba(210,225,230,${a*.35})`;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,0,R,R*.35,0,0,7);ctx.stroke();
ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='frostring'){
const q=1-a,R=24+q*145;
ctx.save();ctx.translate(f.x,f.y);ctx.globalCompositeOperation='lighter';
ctx.strokeStyle=`rgba(191,234,255,${a})`;ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(0,0,R,R*.3,0,0,7);ctx.stroke();
for(let k=0;k<12;k++){const an=k*6.283/12+time*.15,x=Math.cos(an)*R,y=Math.sin(an)*R*.3;
ctx.save();ctx.translate(x,y);ctx.rotate(an);ctx.fillStyle=`rgba(220,247,255,${a*.9})`;ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(16,0);ctx.lineTo(0,9);ctx.closePath();ctx.fill();ctx.restore();}
ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='chaos'){
const q=1-a,pulse=1+Math.sin(time*8+f.ph)*.08;
ctx.save();ctx.translate(f.x,f.y);ctx.scale(1,.38);ctx.globalCompositeOperation='lighter';
ctx.fillStyle=`rgba(90,45,125,${Math.min(.3,a*.45)})`;ctx.beginPath();ctx.arc(0,0,88*pulse,0,7);ctx.fill();
for(let k=0;k<3;k++){ctx.strokeStyle=k%2?`rgba(180,138,255,${a*.7})`:`rgba(255,138,61,${a*.75})`;ctx.lineWidth=4-k;
ctx.beginPath();ctx.arc(0,0,45+k*19,time*(k%2?1.7:-1.4)+k, time*(k%2?1.7:-1.4)+k+4.2);ctx.stroke();}
for(let k=0;k<7;k++){const an=time*(1.4+k*.08)+k*.9,rr=25+k*8;ctx.fillStyle=k%2?'#b48aff':'#ff9d45';ctx.beginPath();ctx.arc(Math.cos(an)*rr,Math.sin(an)*rr,3.5,0,7);ctx.fill();}
ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='sentence'){
const q=1-a,R=36+Math.sin(Math.min(1,q*1.8)*Math.PI)*110;
ctx.save();ctx.translate(f.x,f.y);ctx.globalCompositeOperation='lighter';
ctx.strokeStyle=`rgba(143,224,122,${a*.9})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,R,0,7);ctx.stroke();
ctx.strokeStyle=`rgba(210,255,190,${a*.55})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,R-13,time*1.2,time*1.2+5.2);ctx.stroke();
ctx.font='bold 17px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';
for(let k=0;k<8;k++){const an=k*.785-time*.35;ctx.save();ctx.translate(Math.cos(an)*R,Math.sin(an)*R);ctx.rotate(an+1.57);ctx.fillStyle=`rgba(190,245,160,${a})`;ctx.fillText(k%2?'†':'ᚱ',0,0);ctx.restore();}
ctx.fillStyle=`rgba(80,170,85,${a*.16})`;ctx.beginPath();ctx.arc(0,0,R-5,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='whirlwind'){
const q=1-a;
ctx.save();ctx.translate(f.x,f.y);ctx.globalCompositeOperation='lighter';
for(let k=0;k<6;k++){const yy=-k*17-q*32,rr=28+k*10+Math.sin(time*8+k)*7,st=time*(3.2+k*.18)+k;
ctx.strokeStyle=`rgba(${150+k*12},${205+k*7},255,${a*(.72-k*.07)})`;ctx.lineWidth=5-k*.45;
ctx.beginPath();ctx.ellipse(0,yy,rr,rr*.24,0,st,st+4.8);ctx.stroke();}
for(let k=0;k<8;k++){const an=time*5+k*.8,rr=30+k*8;ctx.fillStyle=`rgba(205,238,255,${a*.65})`;ctx.beginPath();ctx.arc(Math.cos(an)*rr,-25-k*10+Math.sin(an)*6,2.5,0,7);ctx.fill();}
ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='bloodroar'){
const q=1-a;
ctx.save();ctx.translate(f.x,f.y);ctx.globalCompositeOperation='lighter';
for(let k=0;k<3;k++){const R=22+q*(65+k*36);ctx.strokeStyle=`rgba(255,70,58,${a*(.8-k*.17)})`;ctx.lineWidth=6-k*1.4;
ctx.beginPath();ctx.arc(0,0,R,-2.8,-.34);ctx.stroke();}
for(let k=0;k<9;k++){const an=-2.75+k*.3,R=42+q*95;ctx.strokeStyle=`rgba(255,125,85,${a*.75})`;ctx.lineWidth=2;
ctx.beginPath();ctx.moveTo(Math.cos(an)*R,Math.sin(an)*R);ctx.lineTo(Math.cos(an)*(R+16),Math.sin(an)*(R+16));ctx.stroke();}
ctx.fillStyle=`rgba(255,55,45,${a*.13})`;ctx.beginPath();ctx.arc(0,0,70+q*45,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='sunray'){
ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
ctx.strokeStyle=`rgba(255,174,58,${a*.35})`;ctx.lineWidth=34;ctx.beginPath();ctx.moveTo(f.a.x,f.a.y);ctx.lineTo(f.b.x,f.b.y);ctx.stroke();
ctx.strokeStyle=`rgba(255,225,120,${a*.78})`;ctx.lineWidth=16;ctx.stroke();ctx.strokeStyle=`rgba(255,255,235,${a})`;ctx.lineWidth=5;ctx.stroke();
ctx.lineCap='butt';ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='stormray'){
ctx.save();ctx.globalCompositeOperation='lighter';
ctx.strokeStyle=`rgba(110,145,255,${a*.32})`;ctx.lineWidth=38;ctx.beginPath();ctx.moveTo(f.a.x,f.a.y);ctx.lineTo(f.b.x,f.b.y);ctx.stroke();
for(let k=0;k<3;k++){ctx.strokeStyle=k===1?`rgba(255,255,255,${a})`:`rgba(155,190,255,${a*.9})`;ctx.lineWidth=5-k;
ctx.beginPath();ctx.moveTo(f.a.x,f.a.y);for(let s=1;s<9;s++){const t=s/9,x=f.a.x+(f.b.x-f.a.x)*t,y=f.a.y+(f.b.y-f.a.y)*t;
const nx=-(f.b.y-f.a.y),ny=f.b.x-f.a.x,L=Math.hypot(nx,ny)||1,off=Math.sin(s*9.7+k*2.1+time*35)*(10-k*3);
ctx.lineTo(x+nx/L*off,y+ny/L*off);}ctx.lineTo(f.b.x,f.b.y);ctx.stroke();}
ctx.globalCompositeOperation='source-over';ctx.restore();
}else if(f.type==='zap'){
ctx.globalCompositeOperation='lighter';
ctx.strokeStyle=`rgba(190,210,255,${a})`;ctx.lineWidth=2.5;
const seg=6;
ctx.beginPath();ctx.moveTo(f.a.x,f.a.y);
for(let i=1;i<seg;i++){const t=i/seg;
ctx.lineTo(f.a.x+(f.b.x-f.a.x)*t+rnd(-9,9),f.a.y+(f.b.y-f.a.y)*t+rnd(-9,9));}
ctx.lineTo(f.b.x,f.b.y);ctx.stroke();
ctx.strokeStyle=`rgba(255,255,255,${a*.7})`;ctx.lineWidth=1;ctx.stroke();
ctx.globalCompositeOperation='source-over';
}else if(f.type==='beamwarn'){
const bl=.18+.14*Math.sin(time*22);
ctx.fillStyle=`rgba(255,80,60,${bl*a+.04})`;
ctx.fillRect(f.x-42,0,84,GROUND);
ctx.strokeStyle=`rgba(255,120,90,${.4*a})`;ctx.lineWidth=1;
ctx.strokeRect(f.x-42,0,84,GROUND);
}else if(f.type==='beam'){
ctx.globalCompositeOperation='lighter';
ctx.fillStyle=`rgba(255,255,255,${a*.85})`;
ctx.fillRect(f.x-13,0,26,GROUND);
ctx.fillStyle=`rgba(170,190,255,${a*.45})`;
ctx.fillRect(f.x-42,0,84,GROUND);
ctx.globalCompositeOperation='source-over';
}else if(f.type==='zapwarn'){
ctx.strokeStyle=`rgba(190,210,255,${.5*a})`;ctx.lineWidth=2;ctx.setLineDash([8,7]);
ctx.beginPath();ctx.moveTo(f.x,0);ctx.lineTo(f.x,GROUND);ctx.stroke();ctx.setLineDash([]);
}else if(f.type==='divemark'){
const mb=f.mob;if(!mb||mb.hp<=0)continue;
const a=1-f.life/f.max;
ctx.strokeStyle=`rgba(255,90,90,${.35+a*.5})`;ctx.lineWidth=2;
ctx.beginPath();ctx.ellipse(mb.x,GROUND-4,26-a*10,7-a*2,0,0,7);ctx.stroke();
ctx.setLineDash([4,4]);ctx.strokeStyle=`rgba(255,90,90,${.2+a*.3})`;
ctx.beginPath();ctx.moveTo(mb.x,mb.y+4);ctx.lineTo(mb.x,GROUND-6);ctx.stroke();ctx.setLineDash([]);
}else if(f.type==='crack'){
const a=1-f.life/f.max;
ctx.strokeStyle=`rgba(255,180,90,${.4+a*.5})`;ctx.lineWidth=1.5+a*1.5;
for(let i=0;i<5;i++){
const an=-Math.PI/2+(i-2)*.5;
ctx.beginPath();ctx.moveTo(f.x,GROUND-2);
ctx.lineTo(f.x+Math.cos(an)*(6+a*22),GROUND-2+Math.sin(an)*(3+a*5));ctx.stroke();
}
ctx.fillStyle=`rgba(60,30,15,${.4+a*.4})`;
ctx.beginPath();ctx.ellipse(f.x,GROUND-2,10+a*20,4+a*4,0,0,7);ctx.fill();
}else if(f.type==='blast'){
const a=1-f.life/f.max;
ctx.globalCompositeOperation='lighter';
const g=ctx.createRadialGradient(f.x,f.y,2,f.x,f.y,20+a*80);
g.addColorStop(0,`rgba(255,200,120,${(1-a)*.8})`);g.addColorStop(1,'rgba(255,120,40,0)');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(f.x,f.y,20+a*80,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';
}else if(f.type==='clone'){
const a2=clamp(f.life/f.max,0,1);
ctx.globalAlpha=.28*a2;
ctx.fillStyle=f.c||'#b48aff';
ctx.beginPath();ctx.ellipse(f.x,GROUND-42,30,42,0,0,7);ctx.fill();
ctx.globalAlpha=.5*a2;ctx.strokeStyle='#e8ecff';ctx.lineWidth=1;
ctx.beginPath();ctx.ellipse(f.x,GROUND-42,30,42,0,0,7);ctx.stroke();
ctx.globalAlpha=1;
}else if(f.type==='mire'){
const a=clamp(f.life/f.max,0,1);
ctx.globalAlpha=.5*Math.min(1,a*3);
const g=ctx.createRadialGradient(f.x,GROUND-4,4,f.x,GROUND-4,86);
g.addColorStop(0,'rgba(140,190,60,.55)');g.addColorStop(1,'rgba(60,90,30,0)');
ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(f.x,GROUND-4,86,17,0,0,7);ctx.fill();
ctx.globalAlpha=.65;ctx.strokeStyle='#b6d94a';ctx.lineWidth=1;
ctx.beginPath();ctx.ellipse(f.x,GROUND-4,86,17,0,0,7);ctx.stroke();
ctx.globalAlpha=1;
if(rand()<.35)spawnParts(1,f.x+rnd(-80,80),GROUND-6,'#b6d94a',40,.6,'spark',-70);
}else if(f.type==='meteorwarn'){
ctx.strokeStyle=`rgba(255,140,60,${.5*a+.2*Math.sin(time*20)})`;ctx.lineWidth=2;
ctx.beginPath();ctx.ellipse(f.x,GROUND,26,7,0,0,7);ctx.stroke();
}
}
for(const pt of particles){
const a=clamp(pt.life/pt.max,0,1);
if(pt.type==='spark'){
ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;
ctx.fillStyle=pt.c;ctx.fillRect(pt.x-1.5,pt.y-1.5,3,3);
ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
}else if(pt.type==='chunk'){
ctx.globalAlpha=a;ctx.fillStyle=pt.c;
ctx.save();ctx.translate(pt.x,pt.y);ctx.rotate(pt.life*8);ctx.fillRect(-3,-3,6,6);ctx.restore();
ctx.globalAlpha=1;
}else{
ctx.globalAlpha=a*.5;ctx.fillStyle=pt.c;
ctx.beginPath();ctx.arc(pt.x,pt.y,2.5+(1-a)*3,0,7);ctx.fill();ctx.globalAlpha=1;
}
}
ctx.textAlign='center';
for(const pp of popups){
const a=clamp(1-pp.t/.9,0,1);
ctx.globalAlpha=a;ctx.font=pp.big?'700 20px "IBM Plex Mono"':'700 14px "IBM Plex Mono"';
ctx.strokeStyle='rgba(0,0,0,.7)';ctx.lineWidth=3;
ctx.strokeText(pp.txt,pp.x,pp.y-pp.t*34);
ctx.fillStyle=pp.color;ctx.fillText(pp.txt,pp.x,pp.y-pp.t*34);
ctx.globalAlpha=1;
}
}
function drawDjHud(){
if(state!=='playing'&&state!=='reward')return;
const dj=player.djCd;
const HB=TOUCH?VH-48:VH-34, HX=TOUCH?VW/2-88:0;
ctx.save();
ctx.translate(HX+28,HB);
ctx.fillStyle='rgba(8,14,12,.72)';
ctx.beginPath();ctx.arc(0,0,16,0,7);ctx.fill();
ctx.strokeStyle='#33493f';ctx.lineWidth=2;
ctx.beginPath();ctx.arc(0,0,16,0,7);ctx.stroke();
if(dj>0){
ctx.strokeStyle='#5d7168';ctx.lineWidth=3;
ctx.beginPath();ctx.arc(0,0,11,-Math.PI/2,-Math.PI/2+6.283*(1-dj/DJ_CD));ctx.stroke();
ctx.fillStyle='#93a89c';ctx.font='700 10px "IBM Plex Mono"';ctx.textAlign='center';
ctx.fillText(String(Math.ceil(dj)),0,4);
}else{
ctx.strokeStyle='#9ad0ff';ctx.lineWidth=3;
ctx.beginPath();ctx.arc(0,0,11,0,7);ctx.stroke();
ctx.fillStyle='#9ad0ff';ctx.font='700 11px "IBM Plex Mono"';ctx.textAlign='center';
ctx.fillText('×2',0,4);
}
ctx.font='8px "IBM Plex Mono"';ctx.fillStyle='#5d7168';ctx.textAlign='center';
ctx.fillText('ПРЫЖОК',0,28);
ctx.restore();
ctx.save();
ctx.translate(HX+68,HB);
const abCd=player.altCd;
const abMax=Math.max(player.altMax,.001);
ctx.fillStyle='rgba(8,14,12,.72)';
ctx.beginPath();ctx.arc(0,0,16,0,7);ctx.fill();
ctx.strokeStyle='#33493f';ctx.lineWidth=2;
ctx.beginPath();ctx.arc(0,0,16,0,7);ctx.stroke();
if(abCd>0){
ctx.strokeStyle='#5d7168';ctx.lineWidth=3;
ctx.beginPath();ctx.arc(0,0,11,-Math.PI/2,-Math.PI/2+6.283*(1-clamp(abCd/abMax,0,1)));ctx.stroke();
ctx.fillStyle='#93a89c';ctx.font='700 10px "IBM Plex Mono"';ctx.textAlign='center';
ctx.fillText(String(Math.ceil(abCd)),0,4);
}else{
ctx.strokeStyle='#ffb45e';ctx.lineWidth=3;
ctx.beginPath();ctx.arc(0,0,11,0,7);ctx.stroke();
ctx.font='700 12px "IBM Plex Mono"';ctx.fillStyle='#ffb45e';ctx.textAlign='center';
ctx.fillText('✦',0,4);
}
ctx.font='8px "IBM Plex Mono"';ctx.fillStyle='#5d7168';ctx.textAlign='center';
ctx.fillText('УМЕНИЕ',0,28);
ctx.restore();
ctx.save();
ctx.translate(HX+108,HB);
ctx.fillStyle='rgba(8,14,12,.72)';
ctx.beginPath();ctx.arc(0,0,16,0,7);ctx.fill();
ctx.strokeStyle='#33493f';ctx.lineWidth=2;
ctx.beginPath();ctx.arc(0,0,16,0,7);ctx.stroke();
if(player.rollCd>0){
ctx.strokeStyle='#5d7168';ctx.lineWidth=3;
ctx.beginPath();ctx.arc(0,0,11,-Math.PI/2,-Math.PI/2+6.283*(1-clamp(player.rollCd/ROLL_CD,0,1)));ctx.stroke();
ctx.fillStyle='#93a89c';ctx.font='700 10px "IBM Plex Mono"';ctx.textAlign='center';
ctx.fillText(player.rollCd.toFixed(1),0,4);
}else{
ctx.strokeStyle='#a8d08d';ctx.lineWidth=3;
ctx.beginPath();ctx.arc(0,0,11,0,7);ctx.stroke();
ctx.font='700 12px "IBM Plex Mono"';ctx.fillStyle='#a8d08d';ctx.textAlign='center';
ctx.fillText('💨',0,4);
}
ctx.font='8px "IBM Plex Mono"';ctx.fillStyle='#5d7168';ctx.textAlign='center';
ctx.fillText('РЫВОК',0,28);
ctx.restore();
ctx.save();
ctx.translate(HX+148,HB);
ctx.fillStyle='rgba(8,14,12,.72)';
ctx.beginPath();ctx.arc(0,0,16,0,7);ctx.fill();
ctx.strokeStyle='#33493f';ctx.lineWidth=2;
ctx.beginPath();ctx.arc(0,0,16,0,7);ctx.stroke();
if(player.parryWin>0){
ctx.strokeStyle='#bef2ff';ctx.lineWidth=3.5;
ctx.beginPath();ctx.arc(0,0,12,0,7);ctx.stroke();
}else if(player.parryCd>0){
ctx.strokeStyle='#5d7168';ctx.lineWidth=3;
ctx.beginPath();ctx.arc(0,0,11,-Math.PI/2,-Math.PI/2+6.283*(1-clamp(player.parryCd/PARRY_CD,0,1)));ctx.stroke();
ctx.fillStyle='#93a89c';ctx.font='700 10px "IBM Plex Mono"';ctx.textAlign='center';
ctx.fillText(player.parryCd.toFixed(1),0,4);
}else{
ctx.strokeStyle='#9ad0ff';ctx.lineWidth=3;
ctx.beginPath();ctx.arc(0,0,11,0,7);ctx.stroke();
ctx.font='700 11px "IBM Plex Mono"';ctx.fillStyle='#9ad0ff';ctx.textAlign='center';
ctx.fillText('🛡',0,4);
}
ctx.font='8px "IBM Plex Mono"';ctx.fillStyle='#5d7168';ctx.textAlign='center';
ctx.fillText('ПАРИР',0,28);
ctx.restore();
}
/* После победы над боссом указывает ближайшего недобитого обычного врага. */
function drawRemainingMobArrow(){
if(!bossDefeated||state!=='playing'||player.dead)return;
const left=mobs.filter(m=>m.hp>0&&m.type!=='boss');if(!left.length)return;
let target=null,bd=1e9;for(const m of left){const d=Math.hypot(m.x-player.x,(m.y-m.h*.5)-(player.y-30));if(d<bd){bd=d;target=m;}}
if(!target)return;
const sx=target.x-CAM.x,sy=target.y-target.h*.5-CAM.y;
const visible=sx>30&&sx<VW-30&&sy>45&&sy<VH-35;
let x,y,an;
if(visible){x=sx;y=sy-30;an=Math.PI/2;}
else{
const cx=VW/2,cy=VH/2;an=Math.atan2(sy-cy,sx-cx);const co=Math.cos(an),si=Math.sin(an),margin=34;
const tx=Math.abs(co)<.001?1e9:(VW/2-margin)/Math.abs(co),ty=Math.abs(si)<.001?1e9:(VH/2-margin)/Math.abs(si),t=Math.min(tx,ty);
x=cx+co*t;y=cy+si*t;
}
const pulse=.78+.22*Math.sin(time*7);
ctx.save();ctx.translate(x,y);ctx.rotate(an);ctx.globalAlpha=pulse;
ctx.shadowColor='rgba(255,35,35,.8)';ctx.shadowBlur=8;ctx.fillStyle='#ff3b3b';
ctx.beginPath();ctx.moveTo(11,0);ctx.lineTo(-7,-6);ctx.lineTo(-4,0);ctx.lineTo(-7,6);ctx.closePath();ctx.fill();
ctx.restore();
}
function render(){
ctx.clearRect(0,0,VW,VH);
/* Плавная камера следует за героем и заранее показывает пространство по направлению прицела. */
const lookX=clamp((mouse.x-player.x)*.12,-95,95),lookY=clamp((mouse.y-(player.y-30))*.08,-55,55);
const tx=clamp(player.x-VW*.5+lookX,0,W-VW),ty=clamp(player.y-VH*.62+lookY,0,H-VH);
CAM.x+=(tx-CAM.x)*.1;CAM.y+=(ty-CAM.y)*.1;
ctx.save();
ctx.translate(-CAM.x,-CAM.y);
if(shakeAmp>0)ctx.translate(rnd(-1,1)*shakeAmp,rnd(-1,1)*shakeAmp);
drawSky();
drawDeco();
drawLights();
drawGroundAll();
hazardDrawBack();
drawBossFloor();
drawBossEvents();
for(const m of mobs){if(m.type!=='flyer'&&m.type!=='ghost'&&!(m.type==='boss'&&m.mobility==='fly'))drawShadow(m.x,m.y,m.w*.55);}
drawShadow(player.x,player.y,16);
for(const m of mobs)drawMob(m);
for(const g of rollGhosts){
const a=clamp(g.life/g.max,0,1);
ctx.globalAlpha=a*.30;
ctx.fillStyle='#9ad0ff';
ctx.beginPath();ctx.ellipse(g.x,g.y-22,11,20,0,0,7);ctx.fill();
ctx.globalAlpha=1;
}
drawPickups();
drawPlayer();
drawEvoAura(); /* ЭВОЛЮЦИИ: аура пробуждённого оружия */
if(player.parry>0&&!player.dead){
const a=clamp(player.parry/PARRY_T,0,1),perfect=player.parryWin>0;
ctx.save();ctx.translate(player.x,player.y-28);ctx.rotate(player.aim);
if(perfect){
ctx.globalAlpha=.16;ctx.fillStyle='#9ad0ff';
ctx.beginPath();ctx.arc(0,0,34,-1.25,1.25);ctx.lineTo(0,0);ctx.closePath();ctx.fill();
ctx.globalAlpha=1;
ctx.strokeStyle='rgba(190,242,255,.95)';ctx.lineWidth=4;
}else{
ctx.strokeStyle='rgba(120,170,200,'+(.25+.3*a)+')';ctx.lineWidth=2.5;
}
ctx.beginPath();ctx.arc(0,0,30+(1-a)*10,-1.25,1.25);ctx.stroke();
ctx.restore();
}
if(player.roll>0&&player.inv>0&&!player.dead){
const a=clamp(player.inv/ROLL_INV,0,1);
ctx.globalCompositeOperation='lighter';
const g=ctx.createRadialGradient(player.x,player.y-22,4,player.x,player.y-22,30);
g.addColorStop(0,'rgba(150,210,255,'+(a*.28)+')');
g.addColorStop(1,'rgba(150,210,255,0)');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(player.x,player.y-22,30,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';
ctx.strokeStyle='rgba(170,220,255,'+(a*.5)+')';ctx.lineWidth=1.5;
ctx.beginPath();ctx.ellipse(player.x,player.y-22,15+(1-a)*7,25+(1-a)*7,0,0,7);ctx.stroke();
}
if(player.healT>0&&!player.dead){
const a=clamp(player.healT,0,1);
ctx.globalCompositeOperation='lighter';
const g=ctx.createRadialGradient(player.x,player.y-24,2,player.x,player.y-24,36);
g.addColorStop(0,player.healCol+(a*.45)+')');
g.addColorStop(1,player.healCol+'0)');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(player.x,player.y-24,36,0,7);ctx.fill();
ctx.globalCompositeOperation='source-over';
ctx.fillStyle=player.healCol+a+')';
ctx.font='700 13px "IBM Plex Mono"';ctx.textAlign='center';
ctx.fillText('✚',player.x,player.y-54-(1-a)*12);
}
hazardDrawFront();
drawProjs();
drawFx();
drawHoles(); /* ЭВОЛЮЦИИ: чёрные дыры */
drawSummonerEntities();
drawDarkness();
if(hasCurse('blind')&&HZ.id!=='dark')drawBlind();
/* прицел рисуется в координатах расширенного мира */
if(state==='playing'&&!TOUCH&&!player.dead){
ctx.strokeStyle='rgba(255,220,160,.8)';ctx.lineWidth=1.5;
ctx.beginPath();ctx.arc(mouse.x,mouse.y,7,0,7);ctx.stroke();ctx.beginPath();
ctx.moveTo(mouse.x-11,mouse.y);ctx.lineTo(mouse.x-4,mouse.y);ctx.moveTo(mouse.x+4,mouse.y);ctx.lineTo(mouse.x+11,mouse.y);
ctx.moveTo(mouse.x,mouse.y-11);ctx.lineTo(mouse.x,mouse.y-4);ctx.moveTo(mouse.x,mouse.y+4);ctx.lineTo(mouse.x,mouse.y+11);ctx.stroke();}
ctx.restore();
const vg=ctx.createRadialGradient(VW/2,VH*.45,VH*.35,VW/2,VH*.55,VH*.85);
vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(2,4,5,.6)');
ctx.fillStyle=vg;ctx.fillRect(0,0,VW,VH);
if(redFlash>0){ctx.fillStyle=`rgba(255,40,30,${redFlash*.25})`;ctx.fillRect(0,0,VW,VH);}
drawRemainingMobArrow();
drawDjHud();
}
