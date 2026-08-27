/* ================= МОБЫ ================= */
let MID=0;
/* ФИКС: tint принимает и #rrggbb, и уже готовый rgb(...) — раньше повторный тинт
   (например «ВОЙ» босса по уже перекрашенным вариантам) давал rgb(NaN,NaN,..),
   из-за чего градиент в drawMob падал каждый кадр и картинка застывала */
function tint(h,f){
let r=160,g=160,b=160;
const s=String(h==null?'':h);
if(s[0]==='#'&&s.length>=7){r=parseInt(s.slice(1,3),16);g=parseInt(s.slice(3,5),16);b=parseInt(s.slice(5,7),16);}
else{const mm=s.match(/-?\d+(?:\.\d+)?/g);if(mm&&mm.length>=3){r=+mm[0];g=+mm[1];b=+mm[2];}}
const c=v=>{const x=Math.round((isFinite(v)?v:160)*f);return x<0?0:(x>255?255:x);};
return `rgb(${c(r)},${c(g)},${c(b)})`;}
function spawnMob(type,opts={}){
 const base=MOBS[type];
 const hpScale=type==='bastion'?(RS.wallHp||RS.hp):RS.hp;
const baseHp=endless&&type!=='bastion'?Math.max(base.hp,7):base.hp;
const side=rand()<.5?-1:1;
const sx=opts.x==null?(side<0?-30:W+30):opts.x;
const sy=opts.y==null?((type==='flyer'||(typeof ACT2_MOB_AI!=='undefined'&&ACT2_MOB_AI[type]&&ACT2_MOB_AI[type].fly))?rnd(130,430):(type==='ghost'?rnd(160,500):GROUND)):opts.y;
const m={id:++MID,type,x:sx,y:sy,
vx:0,vy:0,face:-side,w:base.w,h:base.h,
 hp:Math.max(1,Math.round(baseHp*hpScale)),maxHp:Math.max(1,Math.round(baseHp*hpScale)),spd:base.spd*RS.spd,
state:'walk',t:0,atkCd:rnd(.6,1.2)*(ascOn(1)?.8:1),jumpCd:rnd(.5,1),flash:0,hitCd:0,
bleed:0,bleedT:0,poison:0,poisonT:0,burnD:0,burnT:0,rotT:0,dotAcc:0,slow:0,anim:rand()*6,wasG:false,
color:theme.accent,dark:tint(theme.accent,.45),eye:'#ffd94a',variant:'none',
variants:[],sx:1,sy:1,wobT:rand()*6,ctrlRes:endless?(RS.controlResist||0):0,summoned:!!opts.summoned,noLoot:!!opts.noLoot};
/* В расширенных комнатах часть отряда входит в бой с верхних ярусов. */
if(opts.x==null&&type!=='flyer'&&type!=='ghost'&&type!=='driller'&&!(typeof ACT2_MOB_AI!=='undefined'&&ACT2_MOB_AI[type]&&ACT2_MOB_AI[type].fly)&&plats.length>1&&rand()<.42){
const pl=pick(plats.slice(1));m.x=rnd(pl.x+24,pl.x+pl.w-24);m.y=pl.y-2;m.vx=side*-45;}
if(type==='flyer')m.ph=rand()*6.28;
if(type==='mage')m.school=pick(['bolt','ward','mire']);
if(type==='driller'){m.state='under';m.t=rnd(.8,1.8);m.uy=GROUND;m.y=GROUND;m.x=clamp(player.x+rnd(-200,200),40,W-40);}
if(type==='hound'){m.state='walk';m.atkCd=rnd(1.2,2.4);}
if(type==='spore')m.atkCd=rnd(2.2,3.4);
if(type==='slime'){m.splitStage=0;m.color='#74b889';m.dark='#244f3a';}
if(type==='weaver'){m.atkCd=rnd(1.8,3);m.color='#8d6ca8';m.dark='#352342';}
if(type==='binder'){m.atkCd=rnd(2.8,4);m.color='#8d78b8';m.dark='#2c203d';}
if(type==='prism'){m.prismCharge=0;m.color='#65c6d8';m.dark='#244b62';}
if(type==='mimic'){m.atkCd=rnd(1.5,2.5);m.color='#d6b16a';m.dark='#4b3820';}
if(type==='thief'){m.stolen=0;m.escapeT=0;m.color='#d55b7d';m.dark='#4d1c2b';}
if(type==='chrono'){m.atkCd=rnd(2.5,3.5);m.color='#8e8af0';m.dark='#2d2a5a';}
if(type==='magnet'){m.stored=0;m.atkCd=rnd(2,3);m.color='#8b98a8';m.dark='#303844';}
if(type==='builder'){m.atkCd=rnd(2.8,4);m.color='#c58b52';m.dark='#49301e';}
if(type==='cocoon'){m.state='hatch';m.t=5;m.color='#86bd65';m.dark='#314a28';}
if(type==='sporeling'){m.atkCd=.4;m.color='#a9d873';m.dark='#3c5828';}
if(type==='bastion'){m.state='wall';m.t=8;m.color='#9b8268';m.dark='#3d3026';}
if(typeof ACT2_MOB_AI!=='undefined'&&ACT2_MOB_AI[type]){const A=ACT2_MOB_AI[type];m.name=A.name;m.color=A.col;m.dark=tint(A.col,.38);m.eye=theme.deco==='ink'?'#ffffff':'#fff2a0';m.atkCd=rnd(.7,1.5);if(A.fly)m.ph=rand()*6.28;}
const variantChance=endless?Math.min(.9,.60+Math.max(0,room-ABYSS_START)*.015):Math.min(.6,.12+room*.035);
if(!opts.noVariants&&(challengeRoom||ascOn(8)||rand()<variantChance)){
let allow=VARIANTS.filter(v=>{
if(v.id==='shielded'&&(type==='flyer'||type==='ghost'||type==='driller'))return false;
if(v.id==='anchor'&&type==='driller')return false;
if(v.id==='echoing'&&!['weaver','prism','mimic','chrono','magnet','builder'].includes(type))return false;
if(v.id==='cloaked'&&(type==='prism'||type==='chrono'))return false;
return true;
});
let count=endless?(room>=45?3:(room>=25?2:1)):((challengeRoom&&room>=16)?2:1);
if(challengeRoom&&endless)count=Math.max(2,count);
allow=shuffle(allow.slice());
for(let j=0;j<Math.min(count,allow.length);j++)applyVariant(m,allow[j].id);
}
if(hasVariant(m,'bonded')){
const mate=mobs.find(x=>x.hp>0&&hasVariant(x,'bonded')&&!x.bondMate);
if(mate){m.bondId=mate.bondId||mate.id;mate.bondId=m.bondId;m.bondMate=mate.id;mate.bondMate=m.id;}
else m.bondId=m.id;
}
if(difficulty==='easy'&&!(endless&&type==='bastion')){m.hp=m.maxHp=1;}
mobs.push(m);
if(!opts.noFx)spawnParts(10,m.x,m.y-m.h/2,m.color,160,.5,'spark',200);
return m;
}
const ACT2_BOSS_HP=[360,396,436,479,527,580,638,702,772,849];
function spawnBoss(bossRoom=room,hpShare=1){
const def=BOSSES[cyc(bossRoom)];
const bossIndex=cyc(bossRoom);
const abyssMods=abyssBossMods(room,bossRoom);
const side=rand()<.5?-1:1;
const m={id:++MID,type:'boss',
x:side<0?-50:W+50,
y:def.mobility==='fly'?rnd(140,400):(def.mobility==='ghost'?rnd(170,480):GROUND),
vx:0,vy:0,face:-side,w:def.w,h:def.h,hp:def.hp,maxHp:def.hp,spd:def.spd*(def.mobility==='walk'?1.45:1.12),
state:'walk',t:0,atkCd:1,jumpCd:rnd(.45,.9),roamT:rnd(.2,.65),roamDir:-side,flash:0,hitCd:0,
bleed:0,bleedT:0,poison:0,poisonT:0,burnD:0,burnT:0,rotT:0,dotAcc:0,slow:0,anim:0,wasG:false,
sx:1,sy:1,wobT:0,color:def.c,dark:tint(def.c,.4),eye:def.eye,variant:'none',
mobility:def.mobility,seqs:def.seqs,p3:def.p3,special:def.special,proj:def.proj,name:def.name,bossIndex,
bT:1.8,bossAtk:null,phase:1,tpT:1.6,slamLand:false,beamX:0,kbBlock:true,seq:[],spT:6,heads:0,abyssMods,
ctrlRes:endless?Math.min(.9,(RS.controlResist||0)+.15):0,
dodgeCd:rnd(.7,1.2),evadeT:0,evadeIframes:0,sigN:0,sigT:3.8,rageShieldT:0,exposeT:0,shieldNodes:0,headMask:7,headCd:0,searedT:0,iceArmor:bossIndex===5?3:0,forgeForm:0};
if(endless)m.hp=Math.max(1,Math.round(ACT2_BOSS_HP[ACT2_BOSS_HP.length-1]*abyssScale(room).bossHp*hpShare));
else if(bossIndex>=ACT1_LEN)m.hp=Math.max(1,Math.round(ACT2_BOSS_HP[bossIndex-ACT1_LEN]*hpShare));
else m.hp=Math.max(1,Math.round(m.hp*RS.bhp*hpShare));
m.maxHp=m.hp;
if(bossHasMod(m,'iron')){m.hp=Math.round(m.hp*1.25);m.maxHp=m.hp;}
if(bossHasMod(m,'haste'))m.bossHaste=1.18;
if(bossHasMod(m,'regen'))m.abyssRegen=.0025;
if(bossHasMod(m,'ward'))m.ward=3;
if(bossHasMod(m,'relentless'))m.specialRate=1.3;
if(challengeRoom){m.hp=Math.round(m.hp*((!endless&&room>ACT1_LEN)?1.2:1.3));m.maxHp=m.hp;}
if(ascOn(7)){m.hp=Math.round(m.hp*1.25);m.maxHp=m.hp;}
if(difficulty==='easy'){m.hp=5;m.maxHp=5;}
mobs.push(m);bossRef=m;
$('bossbar').style.display='block';
document.querySelector('#bossbar .bname').textContent=def.name+(abyssMods.length?' · '+abyssMods.map(x=>x.icon).join(''):'');
banner(def.name,(endless?'СТРАЖ ГЛУБИНЫ ':'БОСС ЗАЛА ')+room);
sfx.boss();addShake(4);
}
function bossGap(P2,m){
const base=(P2?1.35:2.0)+rnd(.2,.6);
const haste=m&&m.bossHaste?m.bossHaste:1;
if(m&&m.seq&&m.seq.length)return base*.42*RS.boss/haste;
return base*(m&&m.phase>=3?.85:1.15)*RS.boss/haste;
}
function bossById(id){return mobs.find(x=>x.id===id&&x.type==='boss'&&x.hp>0);}
function segDist(px,py,x1,y1,x2,y2){const vx=x2-x1,vy=y2-y1,L=vx*vx+vy*vy||1,q=clamp(((px-x1)*vx+(py-y1)*vy)/L,0,1);return Math.hypot(px-(x1+vx*q),py-(y1+vy*q));}
function addBossEvent(kind,m,o={}){
 const warn=o.warn==null?.65:o.warn,life=o.life==null?.45:o.life;
 const e=Object.assign({kind,owner:m.id,t:warn,warn,maxWarn:warn,life,maxLife:life,fired:false,hit:false,col:m.color,visualSig:m.bossIndex>=ACT1_LEN?(m.sigPose||''):''},o);
 bossEvents.push(e);return e;
}
function bossShot(m,x,y,ang,spd=340,type=m.proj,dmg=1,extra={}){
 projs.push(Object.assign({x,y,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,friendly:false,boss:true,rage:(m.phase>=2?1:0),type,dmg,life:3.4,visualSig:m.bossIndex>=ACT1_LEN?(m.sigPose||''):''},extra));
}
function bossAim(m,x=m.x,y=m.y-m.h*.55){return Math.atan2(player.y-24-y,player.x-x);}
function act2BossSignature(m,a,wm){
 const p=player,px=m.x,py=m.y-m.h*.55,dir=p.x>=m.x?1:-1,aim=bossAim(m);
 const line=(x1,y1,x2,y2,warn=.8,w=34,dmg=.65,extra={})=>addBossEvent('line',m,Object.assign({x1,y1,x2,y2,w,warn:warn*wm,life:.28,dmg},extra));
 const circle=(x,y,r=65,warn=.8,dmg=.7,extra={})=>addBossEvent('circle',m,Object.assign({x,y,r,warn:warn*wm,life:.28,dmg},extra));
 switch(a){
 case 'a2_suction':addBossEvent('vortex',m,{x:clamp(p.x,150,W-150),y:p.y-25,r:175,warn:.85*wm,life:2.2,dmg:.35,pull:true});break;
 case 'a2_anchorarc':for(let k=0;k<3;k++)circle(clamp(p.x+(k-1)*115,45,W-45),GROUND-18,58,.7+k*.25,.85,{bone:true});break;
 case 'a2_bubbles':for(const o of [-.32,-.16,0,.16,.32])bossShot(m,px,py,aim+o,245,'bubble',.4,{enemySeek:true,seekT:1.2});break;
 case 'a2_strikeout':line(0,p.y-25,W,p.y-25,.9,54,.75,{col:'#16131c'});break;
 case 'a2_footnote':circle(p.x,p.y-22,48,1.05,.55,{rune:true});setTimeout(()=>{if(m.hp>0)line(m.x,m.y-m.h*.55,p.x,p.y-22,.65,28,.65,{col:'#efe6cf'});},500);break;
 case 'a2_paperknife':for(const o of [-.28,.28])bossShot(m,px,py,aim+o,390,'paperknife',.55,{returnAfter:.65,returnOwner:m.id});break;
 case 'a2_forcedstep':line(px,py,p.x,p.y-20,.8,20,.45,{pull:true,col:'#ffd8e2'});break;
 case 'a2_scissors':for(let k=0;k<3;k++)line(k%2?W:0,160+k*110,k%2?0:W,250+k*70,.65+k*.27,30,.7,{col:'#ff9ab0'});break;
 case 'a2_applause':line(0,p.y-30,W*.44,p.y-30,.9,62,.75);line(W,p.y-30,W*.56,p.y-30,.9,62,.75);break;
 case 'a2_orderdance':for(let k=0;k<3;k++)line(k%2?W:0,GROUND-50-k*90,k%2?0:W,GROUND-50-k*90,.72+k*.33,30,.55,{col:'#ffd65a'});break;
 case 'a2_waxclone':for(let k=-1;k<=1;k++)bossShot(m,px,py,aim+k*.22,330,player.weapon==='fire'?'fireball':'wax',.5,{returnAfter:.8,returnOwner:m.id});break;
 case 'a2_honeypress':{const gap=clamp(p.x-90,90,W-270);addBossEvent('judgment',m,{safeX:gap,safeY:GROUND,safeW:180,warn:1.05*wm,life:.55,dmg:.8,col:'#ffd65a'});break;}
 case 'a2_fateseed':for(let k=0;k<4;k++)circle(clamp(p.x+rnd(-250,250),45,W-45),GROUND-10,50,.8+k*.2,.65,{col:'#d8ef75'});break;
 case 'a2_pruning':for(const pl of shuffle(plats.slice(1)).slice(0,2))line(pl.x,pl.y,pl.x+pl.w,pl.y,.95,42,.75,{col:'#e7ef7a'});break;
 case 'a2_seasons':for(let k=0;k<8;k++)bossShot(m,px,py,k*Math.PI/4+time,300,['seed','leaf','pollen','thorn'][k%4],.45);break;
 case 'a2_fullsail':line(m.x,m.y-35,clamp(m.x+dir*650,40,W-40),m.y-35,.9,68,.85,{col:'#bcecff'});HZ.windDir=dir;break;
 case 'a2_boarding':bossShot(m,px,py,aim,520,'skyhook',.55,{pullX:m.x,pullY:py});break;
 case 'a2_cargo':for(let k=0;k<4;k++)circle(clamp(p.x+(k-1.5)*125,45,W-45),GROUND-18,54,.8+k*.18,.8,{col:'#d7c29f'});break;
 case 'a2_service':for(let k=0;k<6;k++)bossShot(m,px,py,aim+(k-2.5)*.2,330,'saucer',.45,{bounce:1});break;
 case 'a2_fracture':line(0,GROUND-20,W,160,.95,30,.8,{col:'#6aa7e8'});line(W,GROUND-20,0,230,1.25,30,.8,{col:'#6aa7e8'});break;
 case 'a2_shardlance':line(px,py,p.x,p.y-24,.88,46,.95,{spear:true,col:'#dff4ff'});break;
 case 'a2_order':for(let k=0;k<3;k++)circle(clamp(p.x+(k-1)*105,45,W-45),GROUND-15,58,.75+k*.3,.7,{col:['#ff7777','#77bbff','#9fe079'][k]});break;
 case 'a2_tablecloth':line(dir>0?0:W,GROUND-42,dir>0?W:0,GROUND-42,.9,74,.7,{pull:true,col:'#ead8cb'});break;
 case 'a2_places':for(let k=0;k<5;k++)line(160+k*280,40,160+k*280,GROUND,.75+k*.12,26,.65,{spear:true,col:'#e4c5a2'});break;
 case 'a2_pericenter':for(let k=0;k<10;k++)bossShot(m,W/2,H/2,k*Math.PI/5+time*.4,260,'moonblade',.5,{orbitX:W/2,orbitY:H/2});break;
 case 'a2_poleshift':HZ.gravitySide=(HZ.gravitySide||0)+1;for(let k=0;k<3;k++)line(k%2?W:0,170+k*130,k%2?0:W,170+k*130,.9+k*.25,34,.65,{col:'#a9c8ff'});break;
 case 'a2_smallmoon':circle(p.x,p.y-24,90,.85,.75,{col:'#dce8ff'});for(let k=0;k<6;k++)bossShot(m,p.x,p.y-24,k*Math.PI/3,240,'moon',.42);break;
 case 'a2_stitch':line(clamp(p.x-250,30,W-30),150,clamp(p.x+250,30,W-30),GROUND-20,1.0,24,.75,{pull:true,col:'#f3cf72'});break;
 case 'a2_rippedmoment':for(let k=0;k<3;k++)circle(clamp(p.x+p.vx*.18*k,40,W-40),clamp(p.y-25+p.vy*.08*k,70,GROUND-20),48,.75+k*.32,.72,{col:'#f6dc91'});break;
 case 'a2_wrongpattern':{const safe=Math.floor(rand()*3);for(let k=0;k<3;k++){const x=310+k*410;if(k!==safe)circle(x,GROUND-25,125,1.05,.9,{col:'#d9b85f'});}break;}
 }
}
function signatureBossAttack(m,forced){
 if(!m||m.hp<=0)return;
 const sigs=BOSS_SIGS[m.bossIndex]||[];let a=forced||sigs[(m.sigN++)%sigs.length];if(!a)return;
 if(m.bossIndex===8&&!forced){const need={lioncombo:1,goatfan:2,serpenttrail:4};if(!(m.headMask&need[a])){const alive=sigs.filter(x=>m.headMask&need[x]);a=alive.length?pick(alive):'lioncombo';}}
 const p=player,wm=RS.warnMul||1,dir=p.x>=m.x?1:-1,px=m.x,py=m.y-m.h*.55;
 popup(m.x,m.y-m.h-28,BOSS_SIG_NAME[a]||a,'#fff0b0',true);m.sigPose=a;m.sigPoseT=1.1;addShake(3);
 if(a.startsWith('a2_')){act2BossSignature(m,a,wm);return;}
 if(a==='feint'){
  const fake=dir;addBossEvent('dashline',m,{x1:m.x,y1:m.y-35,x2:clamp(m.x+fake*260,25,W-25),y2:m.y-35,w:55,warn:.48*wm,life:.35,reverse:true});
 }else if(a==='clawcombo'){
  for(let k=0;k<3;k++)addBossEvent('circle',m,{x:clamp(p.x+(k-1)*38,25,W-25),y:p.y-28,r:62,warn:(.3+k*.28)*wm,life:.2,dmg:k===2?1.5:.8,claw:true});
 }else if(a==='huntleap'){
  for(let k=0;k<3;k++)addBossEvent('circle',m,{x:clamp(p.x+rnd(-80,80),35,W-35),y:GROUND-22,r:74,warn:(.48+k*.48)*wm,life:.25,dmg:1.2,leap:true});
 }else if(a==='crossdive'){
  addBossEvent('line',m,{x1:dir>0?0:W,y1:130,x2:dir>0?W:0,y2:GROUND-30,w:44,warn:.62*wm,life:.26,dmg:1.2,feather:true});
  addBossEvent('line',m,{x1:dir>0?W:0,y1:170,x2:dir>0?0:W,y2:GROUND-80,w:44,warn:1.05*wm,life:.26,dmg:1.2,feather:true});
 }else if(a==='returnfeathers'){
  const base=bossAim(m);for(let k=-3;k<=3;k++)bossShot(m,px,py,base+k*.16,360,'bone',.75,{returnAfter:.55,returnX:px,returnY:py,returnOwner:m.id,retBoss:true});
 }else if(a==='wingvortex'){
  addBossEvent('vortex',m,{x:clamp(p.x,100,W-100),y:clamp(p.y-30,130,GROUND-80),r:150,warn:.5*wm,life:2.7,dmg:.7});
 }else if(a==='tongue'){
  addBossEvent('tongue',m,{x1:px,y1:py,x2:p.x,y2:p.y-24,w:24,warn:.58*wm,life:.3,dmg:1,pull:true});
 }else if(a==='bogcrash'){
  addBossEvent('circle',m,{x:clamp(p.x,65,W-65),y:GROUND-12,r:105,warn:.72*wm,life:.5,dmg:1.4,mire:true,leap:true});
 }else if(a==='acidbubbles'){
  for(let k=0;k<5;k++)bossShot(m,px,py,-2.7+k*.34,180,'spit',.65,{enemySeek:true,seekT:2.6,rad:11});
 }else if(a==='bonespear'){
  const an=bossAim(m),L=620;addBossEvent('line',m,{x1:px,y1:py,x2:px+Math.cos(an)*L,y2:py+Math.sin(an)*L,w:25,warn:.66*wm,life:.32,dmg:1.5,spear:true});
 }else if(a==='deadmarch'){
  addBossEvent('march',m,{dir,warn:.75*wm,life:1.8,dmg:.8,gap:clamp(p.x+rnd(-130,130),180,W-180)});
 }else if(a==='bonewall'){
  for(let k=-2;k<=2;k++)addBossEvent('pillar',m,{x:clamp(p.x+k*72,25,W-25),y:GROUND,r:26,warn:(.42+Math.abs(k)*.11)*wm,life:.7,dmg:.9,bone:true});
 }else if(a==='ghosthands'){
  for(let k=0;k<3;k++)addBossEvent('hand',m,{x:clamp(p.x+rnd(-150,150),40,W-40),y:GROUND,r:48,warn:(.48+k*.22)*wm,life:1.2,dmg:.75});
 }else if(a==='gravebeam'){
  const base=bossAim(m);for(let k=-1;k<=1;k++){const an=base+k*.28;addBossEvent('line',m,{x1:px,y1:py,x2:px+Math.cos(an)*900,y2:py+Math.sin(an)*900,w:30,warn:(.58+k*.18+.18)*wm,life:.28,dmg:1.25,ghost:true});}
 }else if(a==='mirrorswap'){
  fxList.push({type:'bossafter',x:m.x,y:m.y-m.h*.5,c:m.color,life:.8,max:.8});m.x=clamp(W-m.x+rnd(-80,80),70,W-70);spawnParts(18,m.x,m.y-m.h*.5,m.color,220,.5,'spark',50);
  for(let k=0;k<8;k++)bossShot(m,m.x,m.y-m.h*.5,k*6.283/8,250,'arcane',.7);
 }else if(a==='iceroll'){
  addBossEvent('dashline',m,{x1:m.x,y1:GROUND-35,x2:dir>0?W-20:20,y2:GROUND-35,w:70,warn:.7*wm,life:.75,dmg:1.6,ice:true});
 }else if(a==='icepillars'){
  const gap=Math.floor(rnd(1,5));for(let k=0;k<6;k++)if(k!==gap)addBossEvent('pillar',m,{x:70+k*(W-140)/5,y:GROUND,r:34,warn:(.55+k*.05)*wm,life:1.5,dmg:1,ice:true});
 }else if(a==='frostgrip'){
  addBossEvent('grip',m,{x:p.x,y:p.y-24,r:78,warn:.68*wm,life:.48,dmg:1.4});
 }else if(a==='forgechain'){
  const an=bossAim(m);bossShot(m,px,py,an,440,'harpoon',.9,{pullX:m.x,pullY:m.y-m.h*.45,rad:10});
 }else if(a==='anvil'){
  addBossEvent('anvil',m,{x:clamp(p.x,55,W-55),y:GROUND,r:92,warn:.72*wm,life:.8,dmg:1.35,fire:true});
 }else if(a==='weaponforge'){
  m.forgeForm=(m.forgeForm+1)%3;fxList.push({type:'forgeweapon',x:m.x,y:m.y-m.h*.55,form:m.forgeForm,life:1,max:1});
  if(m.forgeForm===0)for(let k=-2;k<=2;k++)bossShot(m,px,py,bossAim(m)+k*.15,390,'fireball',.75);
  else if(m.forgeForm===1)addBossEvent('line',m,{x1:px,y1:py,x2:px+dir*720,y2:py,w:28,warn:.45*wm,life:.25,dmg:1.35,fire:true});
  else addBossEvent('circle',m,{x:p.x,y:GROUND-18,r:120,warn:.68*wm,life:.38,dmg:1.45,fire:true});
 }else if(a==='portalshot'){
  const exits=[{x:45,y:160},{x:W-45,y:250},{x:W*.5,y:100}];for(const e of exits){fxList.push({type:'bossportal',x:e.x,y:e.y,c:m.color,life:.8,max:.8});const an=Math.atan2(p.y-24-e.y,p.x-e.x);bossShot(m,e.x,e.y,an,350,'arcane',.75);}
 }else if(a==='delayrune'){
  addBossEvent('rune',m,{x:p.x,y:p.y-24,r:82,warn:1.25*wm,life:.55,dmg:1.5});
 }else if(a==='reversefan'){
  const base=bossAim(m);for(let k=-2;k<=2;k++)bossShot(m,px,py,base+Math.PI+k*.18,255,'arcane',.8,{returnAfter:.5,returnX:p.x,returnY:p.y-24});
 }else if(a==='lioncombo'){
  for(let k=0;k<3;k++)addBossEvent(k===2?'dashline':'circle',m,k===2?{x1:m.x,y1:m.y-35,x2:p.x,y2:p.y-30,w:60,warn:.82*wm,life:.3,dmg:1.5}:{x:m.x+dir*(65+k*35),y:m.y-38,r:64,warn:(.3+k*.25)*wm,life:.22,dmg:.85,claw:true});
 }else if(a==='goatfan'){
  const base=bossAim(m);for(let k=-4;k<=4;k++)bossShot(m,px,py,base+k*.13,330,'bone',.65);
 }else if(a==='serpenttrail'){
  for(let k=0;k<4;k++)addBossEvent('mire',m,{x:clamp(m.x+dir*(80+k*100),60,W-60),y:GROUND,r:65,warn:(.35+k*.14)*wm,life:3,dmg:.65});
 }else if(a==='royalcombo'){
  for(let k=0;k<3;k++){const an=bossAim(m)+[-.22,.18,0][k];addBossEvent('line',m,{x1:px,y1:py,x2:px+Math.cos(an)*700,y2:py+Math.sin(an)*700,w:k===2?42:27,warn:(.3+k*.3)*wm,life:.25,dmg:k===2?1.5:.8,fire:true});}
 }else if(a==='judgment'){
  const safe=pick(plats.filter(x=>!x.ground))||{x:W/2-90,w:180,y:GROUND};addBossEvent('judgment',m,{safeX:safe.x,safeW:safe.w,safeY:safe.y,warn:1.15*wm,life:.7,dmg:1.7});
 }else if(a==='borrowed'){
  const pool=['huntleap','returnfeathers','bonespear','ghosthands','icepillars','anvil','portalshot','goatfan'];signatureBossAttack(m,pick(pool));
 }
 m.bT=Math.max(m.bT,bossGap(true,m)*.8);
}
function bossTryDefense(pr){
 if(!pr.friendly||pr.parried||pr.bossDeflected)return false;
 for(const m of mobs){if(m.type!=='boss'||m.hp<=0||m.evadeT>0||m.evadeIframes>0||m.dodgeCd>0||m.exposeT>0||m.state==='windup'||m.bossAtk)continue;
  const dx=m.x-pr.x,dy=(m.y-m.h*.5)-pr.y,dist=Math.hypot(dx,dy),sp=Math.hypot(pr.vx,pr.vy)||1;
  if(dist>155||(dx*pr.vx+dy*pr.vy)/sp<dist*.72)continue;
  const chance=(m.phase>=3?.4:(m.phase>=2?.3:.2));if(rand()>chance)continue;
  const i=m.bossIndex;m.dodgeCd=(m.phase>=3?1.15:1.7)+rand()*.35;pr.bossDeflected=true;
  if(i===3){m.guard=.75;popup(m.x,m.y-m.h-18,'ЩИТ','#9ad0ff');return false;}
  if(i===5)return false;
  if(i===6){const an=Math.atan2(pr.vy,pr.vx)+(rand()<.5?1:-1)*1.15;pr.vx=Math.cos(an)*sp;pr.vy=Math.sin(an)*sp;fxList.push({type:'bossparry',x:m.x,y:m.y-m.h*.5,c:m.color,life:.35,max:.35});popup(m.x,m.y-m.h-18,'ОТБИЛ','#ffd27a');return true;}
  const oldX=m.x,oldY=m.y-m.h*.5,side=(Math.sign(pr.vy)||1)*(rand()<.5?-1:1);m.evadeT=.28;m.evadeIframes=.24;
  if(i===4||i===7){m.x=clamp(m.x+(rand()<.5?-1:1)*rnd(105,175),45,W-45);if(i===4)m.y=clamp(m.y+rnd(-90,90),90,GROUND-20);}
  else if(i===1){m.y=clamp(m.y+side*95,70,GROUND-40);m.x=clamp(m.x-Math.sign(pr.vx)*45,40,W-40);}
  else {m.vx=(rand()<.5?-1:1)*330;m.vy=(i===0||i===2||i===8)?-430:m.vy;m.x=clamp(m.x+m.vx*.16,35,W-35);}
  fxList.push({type:'bossdodge',x:oldX,y:oldY,tx:m.x,ty:m.y-m.h*.5,c:m.color,life:.42,max:.42});popup(m.x,m.y-m.h-18,i===4||i===7?'СДВИГ':'УВОРОТ','#bfe6ff');return true;
 }
return false;
}
function beginBossBerserk(m){
 m.rageShieldT=5.5;m.exposeT=0;
 const nodes=[1,6,3,0,2,2,1,3,1,3][m.bossIndex]||1;m.shieldNodes=nodes;
 popup(m.x,m.y-m.h-28,'БЕРСЕРК · ЗАЩИТА 90%','#ffffff',true);
 fxList.push({type:'berserkburst',x:m.x,y:m.y-m.h*.5,c:m.color,life:1.1,max:1.1});
 const hints=['ФИНИШЕР ИЛИ ПАРИРОВАНИЕ','СБЕЙ ПЕРЬЯ','ЛОПНИ ПУЗЫРИ','АТАКУЙ СО СПИНЫ','РАЗБЕЙ ОТРАЖЕНИЯ','РАСКОЛИ БРОНЮ','ВЕРНИ УДАР','РАЗРУШЬ РУНЫ','ОГОНЬ ИЛИ ФИНИШЕР','РАЗБЕЙ ЗНАКИ КОРОНЫ'];
 banner('БЕРСЕРК',m.name+' · '+hints[m.bossIndex]);
}
function breakBossBerserk(m,label='ЗАЩИТА СЛОМАНА'){if(!m.rageShieldT)return;m.rageShieldT=0;m.shieldNodes=0;m.exposeT=3;popup(m.x,m.y-m.h-30,label,'#ffd23f',true);fxList.push({type:'shieldbreak',x:m.x,y:m.y-m.h*.5,c:m.color,life:.8,max:.8});addShake(9);}
function bossBerserkCounter(m,o){
 if(!m.rageShieldT)return;
 const i=m.bossIndex,behind=Math.sign(player.x-m.x)!==m.face;
 if(i===3&&behind){breakBossBerserk(m,'ОБХОД ЩИТА');return;}
 let chip=false;
 if(i===0)chip=!!(o.finisher||o.parried);
 else if(i===1||i===2||i===4||i===7||i===9)chip=!!(o.wpn&&(o.parried||o.finisher||o.melee));
 else if(i===5)chip=!!(o.finisher||o.melee);
 else if(i===6)chip=!!o.parried;
 else if(i===8)chip=!!(o.finisher||o.fire||o.dot);
 if(chip){m.nodeCd=m.nodeCd||0;if(m.nodeCd<=0){m.nodeCd=.18;m.shieldNodes=Math.max(0,m.shieldNodes-1);popup(m.x,m.y-m.h-22,'ЗАЩИТА '+m.shieldNodes,'#fff0b0');spawnParts(8,m.x+rnd(-25,25),m.y-rnd(12,m.h),m.color,190,.4,'chunk',100);if(m.shieldNodes<=0)breakBossBerserk(m);}}
}
function updateBossEvents(dt){
 const p=player;
 for(const e of bossEvents){const m=bossById(e.owner);if(!m){e.life=0;e.fired=true;continue;}e.t-=dt;
  if(e.kind==='vortex'&&e.t<=0&&e.life>0&&!p.dead){const dx=e.x-p.x,dy=e.y-(p.y-24),L=Math.hypot(dx,dy)||1,dp=enemyDebuffPower();if(L<e.r*1.45){p.vx+=dx/L*520*dp*dt;p.vy+=dy/L*360*dp*dt;if(L<42&&!e.hit){e.hit=true;damagePlayer(Math.sign(dx)||1,m,e.dmg||.7,true,false,false,true);}}}
  if(!e.fired&&e.t<=0){e.fired=true;
   let hit=false,dir=1;
   if(e.kind==='circle'||e.kind==='pillar'||e.kind==='hand'||e.kind==='grip'||e.kind==='anvil'||e.kind==='rune'||e.kind==='mire'){
    hit=Math.hypot(p.x-e.x,(p.y-24)-e.y)<(e.r||60);dir=Math.sign(p.x-e.x)||1;
   }else if(e.kind==='line'||e.kind==='dashline'||e.kind==='tongue'){
    hit=segDist(p.x,p.y-24,e.x1,e.y1,e.x2,e.y2)<(e.w||30);dir=Math.sign(e.x2-e.x1)||1;
   }else if(e.kind==='judgment'){hit=p.x<e.safeX-12||p.x>e.safeX+e.safeW+12;dir=p.x<W/2?-1:1;}
   if(hit&&!p.dead)damagePlayer(dir,m,e.dmg||1,true,false,false,true);
   if(e.kind==='tongue'&&hit){const dx=e.x1-p.x,dy=e.y1-(p.y-24),L=Math.hypot(dx,dy)||1,dp=enemyDebuffPower();p.vx=dx/L*760*dp;p.vy=dy/L*520*dp;}
   if(e.kind==='dashline'&&m){m.x=clamp(e.x2,35,W-35);if(e.reverse){m.face*=-1;m.vx=-dir*420;}}
   if(e.kind==='circle'&&e.mire){const life=5*(RS.zoneMul||1);fxList.push({type:'mire',enemy:true,x:e.x,life,max:life});}
   if(e.kind==='mire'){const life=3*(RS.zoneMul||1);fxList.push({type:'mire',enemy:true,x:e.x,life,max:life});}
   if(e.kind==='anvil'){explodeEnemy(e.x,GROUND-8);for(let k=0;k<8;k++)if(m)bossShot(m,e.x,GROUND-35,k*6.283/8,245,'fireball',.55);}
   if(e.kind==='march')e.pos=e.dir>0?-80:W+80;
   if(e.kind==='pillar')spawnParts(16,e.x,GROUND-6,e.ice?'#bfeaff':'#e8dfc5',260,.65,'chunk',-80);
   if(e.kind==='rune')spawnParts(22,e.x,e.y,'#c9a0ff',320,.7,'spark',40);
  }
  if(e.fired){e.life-=dt;
   if(e.kind==='march'){
    e.pos+=e.dir*260*dt;const gap=e.gap;if(!p.dead&&!e.hit&&Math.abs(p.x-e.pos)<28&&Math.abs(p.x-gap)>55&&p.y>GROUND-85){e.hit=true;damagePlayer(e.dir,m,e.dmg||.8,true,false,false,true);}
   }
  }
 }
 bossEvents=bossEvents.filter(e=>e.life>0||!e.fired);
}
function dualBossUpdate(dt){
if(!endless||player.dead)return;
const bs=mobs.filter(x=>x.type==='boss'&&x.hp>0);
if(bs.length<2){dualBossWarn=0;dualBossT=Math.max(dualBossT,3);return;}
if(dualBossWarn>0){
dualBossWarn-=dt;
if(dualBossWarn<=0){
for(const b of bs.slice(0,2)){
const px=b.x,py=b.y-b.h*.55,base=Math.atan2(player.y-26-py,player.x-px);
for(const off of [-.32,-.16,0,.16,.32])projs.push({x:px,y:py,vx:Math.cos(base+off)*300,vy:Math.sin(base+off)*300,friendly:false,boss:true,rage:(b.phase>=2?1:0),type:b.proj,dmg:1.1,life:3.2});
spawnParts(12,px,py,'#ffffff',180,.4,'spark',40);
}
popup(player.x,player.y-84,'ПЕРЕКРЁСТНЫЙ ОГОНЬ','#ffffff',true);addShake(7);noiseS(.25,.24,900);
dualBossT=Math.max(3.2,7/(RS.atkSpeed||1));
}
return;
}
dualBossT-=dt;
if(dualBossT<=0){
dualBossWarn=.9*(RS.warnMul||1);
for(const b of bs.slice(0,2))popup(b.x,b.y-b.h-22,'СВЯЗЬ!','#ffd23f',true);
}
}
function startBossAttack(m){
const p=player;
const wm=RS.warnMul||1;
if(!m.seq||!m.seq.length){
m.seq=pick(m.seqs).slice();
if(m.phase>=3&&m.p3&&rand()<.6)m.seq.push(m.p3);
m.seqShow=1.1;
}
const a=m.seq.shift();
m.bossAtk=a;
if(a==='charge'||a==='slam'){m.state='windup';m.t=(a==='charge'?.45:.4)*wm;popup(m.x,m.y-m.h-16,'!','#ffd23f',true);}
else if(a==='beam'){m.state='windup';m.t=.75*wm;m.beamX=p.x;fxList.push({type:'beamwarn',x:p.x,life:.75*wm,max:.75*wm});}
else if(a==='tpcast'){m.state='windup';m.t=.35*wm;spawnParts(10,m.x,m.y-m.h/2,m.color,160,.4,'spark',100);}
else{m.state='walk';execBossAttack(m,a,m.phase>=2);}
}
function execBossAttack(m,a,P2){
const p=player;if(p.dead)return;
const dir=p.x>=m.x?1:-1;
const bd=m.bossIndex>=ACT1_LEN?.62:1;
const gcol=m.proj==='ice'?'#8fe0ff':(m.proj==='fireball'?'#ff8a3d':'#d8d3c0');
if(a==='charge'){
m.state='attack';m.t=.55;
if(m.mobility==='fly'){const ddx=p.x-m.x,ddy=(p.y-20)-m.y,L=Math.hypot(ddx,ddy)||1;m.vx=ddx/L*560;m.vy=ddy/L*560;}
else m.vx=dir*520;
noiseS(.15,.2,700);
}else if(a==='slam'){
m.state='attack';m.slamLand=false;m.vx=dir*230;m.vy=-820;m.t=2.5;
}else if(a==='spread'){
const n=P2?7:5,px=m.x+dir*m.w*.3,py=m.y-m.h*.6;
const base=Math.atan2(p.y-24-py,p.x-px);
for(let i=0;i<n;i++){const off=(i-(n-1)/2)*.18;
projs.push({x:px,y:py,vx:Math.cos(base+off)*320,vy:Math.sin(base+off)*320,friendly:false,boss:true,rage:(m.phase>=2?1:0),type:m.proj,dmg:bd,life:3});}
noiseS(.12,.18,900);
m.bT=bossGap(P2,m);
}else if(a==='ring'){
const n=P2?14:10,cx=m.x,cy=m.y-m.h*.5,r0=rand()*6.28;
for(let i=0;i<n;i++){const an=r0+i*6.283/n;
projs.push({x:cx,y:cy,vx:Math.cos(an)*240,vy:Math.sin(an)*240,friendly:false,boss:true,rage:(m.phase>=2?1:0),type:m.proj,dmg:bd,life:3});}
noiseS(.15,.2,600);
m.bT=bossGap(P2,m);
}else if(a==='rain'){
const n=P2?7:5;
for(let i=0;i<n;i++)projs.push({x:clamp(p.x+rnd(-160,160),20,W-20),y:-20,vx:rnd(-25,25),vy:rnd(300,380),friendly:false,boss:true,rage:(m.phase>=2?1:0),type:m.proj,dmg:bd,life:4});
noiseS(.2,.15,400);
m.bT=bossGap(P2,m);
}else if(a==='summon'){
if(mobs.length<4){spawnRoomMinion();spawnRoomMinion();popup(m.x,m.y-m.h-16,'ПРИСЛУЖИВАЙТЕ!','#ff9d7a',true);}
m.bT=bossGap(P2,m)*1.15;
}else if(a==='wave'){
projs.push({x:m.x-20,y:GROUND-8,vx:-330,vy:0,friendly:false,boss:true,rage:(m.phase>=2?1:0),type:'gwave',dmg:1.5*bd,life:4.2,c:gcol});
projs.push({x:m.x+20,y:GROUND-8,vx:330,vy:0,friendly:false,boss:true,rage:(m.phase>=2?1:0),type:'gwave',dmg:1.5*bd,life:4.2,c:gcol});
addShake(4);noiseS(.18,.2,300);
m.bT=bossGap(P2,m);
}else if(a==='tpcast'){
spawnParts(12,m.x,m.y-m.h/2,m.color,200,.5,'spark',100);
m.x=clamp(rnd(80,W-80),80,W-80);
if(m.mobility==='fly')m.y=rnd(140,260);
if(m.mobility==='ghost')m.y=rnd(180,340);
spawnParts(12,m.x,m.y-m.h/2,m.color,200,.5,'spark',100);
const px=m.x,py=m.y-m.h*.6;
for(const off of [-.25,0,.25]){
const an=Math.atan2(p.y-24-py,p.x-px)+off;
projs.push({x:px,y:py,vx:Math.cos(an)*330,vy:Math.sin(an)*330,friendly:false,boss:true,rage:(m.phase>=2?1:0),type:m.proj,dmg:bd,life:3});}
sfx.cast();
m.bT=bossGap(P2,m);
}else if(a==='beam'){
if(!p.dead&&Math.abs(p.x-m.beamX)<44)damagePlayer(p.x>=m.beamX?1:-1,m,2*bd,m.phase>=2,true,false,true);
fxList.push({type:'beam',x:m.beamX,life:.3,max:.3});
addShake(6);noiseS(.2,.25,1500);
m.bT=bossGap(P2,m);
}
}
function bossSpecial(m){
const p=player;
switch(m.special){
case 'howl':
popup(m.x,m.y-m.h-26,'ВОЙ!','#ffd94a',true);addShake(5);noiseS(.4,.2,300);
/* ФИКС: не больше 2 стаков воя на тварь — иначе они белели и разгонялись до абсурда */
for(const x of mobs){if(x===m)continue;x.atkCd=0;
if((x.howls=(x.howls||0)+1)<=2){x.spd*=1.25;x.color=tint(x.color,1.15);}}
if(mobs.length<maxConc())spawnRoomMinion();
break;
case 'feathers':
popup(m.x,m.y-m.h-26,'ШКВАЛ ПЕРЬЕВ','#bfe6ff');
for(let i=0;i<6;i++)projs.push({x:m.x+rnd(-40,40),y:m.y,vx:rnd(-60,60),vy:rnd(240,320),
friendly:false,boss:true,rage:(m.phase>=2?1:0),type:'bone',dmg:.8,life:3});
break;
case 'acid':
popup(m.x,m.y-m.h-26,'КИСЛОТА','#b6d94a');
for(let i=0;i<2;i++){const z=6*(RS.zoneMul||1);fxList.push({type:'mire',enemy:true,x:clamp(p.x+rnd(-160,160),60,W-60),life:z,max:z});}
break;
case 'banner':
popup(m.x,m.y-m.h-26,'ШТАНДАРТ!','#ffd9a0',true);
for(const x of mobs){if(x===m)continue;x.ward=Math.max(x.ward||0,3);}
if(mobs.length<maxConc()){spawnRoomMinion();spawnRoomMinion();}
break;
case 'mirror': case 'clones':{
popup(m.x,m.y-m.h-26,'ДВОЙНИК','#c9a0ff',true);
const n=m.phase>=3?3:2;
for(let i=0;i<n;i++)fxList.push({type:'clone',x:clamp(rnd(70,W-70),70,W-70),life:2.6,max:2.6,c:m.color});
break;}
case 'frostfloor':
popup(m.x,m.y-m.h-26,'НАЛЕДЬ','#8fe0ff',true);
HZ.iceT=4.5*(RS.zoneMul||1);addShake(4);noiseS(.3,.16,900);
break;
case 'forge':
popup(m.x,m.y-m.h-26,'ПОЛ РАСКАЛЁН','#ff8a3d',true);
HZ.hotT=4*(RS.zoneMul||1);addShake(4);noiseS(.35,.18,420);
break;
case 'regrow':
if(m.hp<m.maxHp*.9){
m.heads=(m.heads||0)+1;
m.hp=Math.min(m.maxHp,m.hp+m.maxHp*.06);
if(m.headMask!==7&&m.searedT<=0){for(const bit of [1,2,4])if(!(m.headMask&bit)){m.headMask|=bit;break;}popup(m.x,m.y-m.h-26,'ОТРАСТАЕТ ГОЛОВА','#ff8a9d',true);}
else popup(m.x,m.y-m.h-26,m.searedT>0?'ШЕЯ ОБОЖЖЕНА':'РЕГЕНЕРАЦИЯ','#ff8a9d',true);
spawnParts(14,m.x,m.y-m.h*.6,'#c05a6a',180,.5,'spark',100);
}
break;
case 'crown':
popup(m.x,m.y-m.h-26,'ЗОВ КОРОНЫ','#ff5030',true);addShake(7);
for(let i=0;i<2&&mobs.length<maxConc()+2;i++)spawnRoomMinion();
for(let i=0;i<10;i++){const an=i*6.283/10;
projs.push({x:m.x,y:m.y-m.h*.5,vx:Math.cos(an)*200,vy:Math.sin(an)*200,friendly:false,boss:true,rage:(m.phase>=2?1:0),type:'fireball',dmg:1,life:2.6});}
break;
default:
if(m.special&&m.special.startsWith('a2_')){
 const sigs=BOSS_SIGS[m.bossIndex]||[];
 if(sigs.length)signatureBossAttack(m,sigs[(m.sigN+++m.phase)%sigs.length]);
 if(m.phase>=3){m.exposeT=Math.max(m.exposeT||0,1.35);popup(m.x,m.y-m.h-26,'МЕХАНИЗМ ОТКРЫТ','#fff0b0',true);}
}
break;
}
}
function enemyShotAt(m,type,spd,dmg,spread=0,power=1){
const px=m.x+m.face*m.w*.35,py=m.y-m.h*.58;
const an=Math.atan2((player.y-24)-py,player.x-px)+spread;
 projs.push({x:px,y:py,vx:Math.cos(an)*spd,vy:Math.sin(an)*spd,friendly:false,mob:true,ability:true,type,dmg:dmg*power,life:3,c:m.eye});
}
function enemyAbility(m,kind,power=1,echo=false){
if(!m||m.hp<=0)return;
if(kind==='spore'){
const owned=mobs.filter(x=>(x.type==='cocoon'||x.type==='sporeling')&&x.ownerId===m.id).length;
if(owned<4){const c=spawnMob('cocoon',{x:clamp(m.x+m.face*rnd(45,90),30,W-30),y:m.y,noVariants:true,summoned:true,noLoot:true});c.ownerId=m.id;c.t=5/power;
popup(c.x,c.y-c.h-8,'КОКОН','#a9d873');fxList.push({type:'sporecast',x:m.x,y:m.y-m.h*.5,tx:c.x,ty:c.y-c.h*.5,life:.45,max:.45});}
}else if(kind==='web'){
const cx=clamp(player.x,90,W-90),span=95+45*power;
 const life=6*power*(RS.zoneMul||1);fxList.push({type:'enemyweb',x1:cx-span,y1:GROUND-8,x2:cx+span,y2:Math.max(130,player.y-80),life,max:life});
popup(m.x,m.y-m.h-10,'ПАУТИНА','#d7b5ff');
}else if(kind==='prism'){
 const n=echo?5:9;for(let i=0;i<n;i++){const an=i*6.283/n+(echo?.2:0);projs.push({x:m.x,y:m.y-m.h*.55,vx:Math.cos(an)*330,vy:Math.sin(an)*330,friendly:false,mob:true,ability:true,type:'prismshard',dmg:.65*power,life:2.2,c:'#9ff3ff'});}
fxList.push({type:'prismburst',x:m.x,y:m.y-m.h*.55,life:.45,max:.45});m.prismCharge=0;
}else if(kind==='mimic'){
const cat=WEAPONS[player.weapon].cat;
if(cat==='melee'){
fxList.push({type:'mimicslash',x:m.x,y:m.y-m.h*.55,dir:m.face,life:.35,max:.35});
 if(Math.abs(player.x-m.x)<150&&Math.abs(player.y-m.y)<80)damagePlayer(m.face,m,1.15*power,false,false,false,true);
 else projs.push({x:m.x+m.face*20,y:m.y-m.h*.55,vx:m.face*430,vy:0,friendly:false,mob:true,ability:true,type:'arcwave',dmg:.8*power,life:1.7,c:'#ffd27a'});
}else if(cat==='ranged')for(const off of [-.16,0,.16])enemyShotAt(m,'mimicshot',430,.55,off,power);
else for(const off of [-.3,-.15,0,.15,.3])enemyShotAt(m,'arcane',290,.45,off,power);
popup(m.x,m.y-m.h-14,cat==='melee'?'КЛИНОК':(cat==='ranged'?'ЗАЛП':'ЧАРЫ'),'#ffd27a');
}else if(kind==='chrono'){
 const life=5*power*(RS.zoneMul||1);fxList.push({type:'timezone',x:clamp(player.x,80,W-80),y:player.y-20,r:105+25*power,life,max:life});
popup(m.x,m.y-m.h-14,'ЗАСТОЙ ВРЕМЕНИ','#b7b4ff');
}else if(kind==='magnet'){
const n=Math.max(1,m.stored||1);for(let i=0;i<n;i++)enemyShotAt(m,'metal',380,.55,(i-(n-1)/2)*.16,power);m.stored=0;
fxList.push({type:'magnetpulse',x:m.x,y:m.y-m.h*.5,life:.38,max:.38});
}else if(kind==='builder'){
const walls=mobs.filter(x=>x.type==='bastion'&&x.ownerId===m.id).length;
if(walls<2){const b=spawnMob('bastion',{x:clamp(m.x+m.face*85,30,W-30),y:m.y,noVariants:true,summoned:true,noLoot:true});b.ownerId=m.id;b.t=8*power;
fxList.push({type:'buildflash',x:b.x,y:b.y-b.h*.5,life:.5,max:.5});popup(m.x,m.y-m.h-12,'БАСТИОН','#e0b27a');}
}
if(!echo&&hasVariant(m,'echoing')&&kind!=='spore'){m.echoT=.7;m.echoKind=kind;}
}
const ACT2_MOB_AI={
a2_eel:{name:'ФОНАРЬ-УГОРЬ',kind:'eel',col:'#4edee4',cd:2.5,warn:.7,fly:1},a2_trumpet:{name:'РАКОВИННЫЙ ТРУБАЧ',kind:'trumpet',col:'#e2b45d',cd:3.2,warn:.8},a2_diver:{name:'ПУСТОЙ НЫРЯЛЬЩИК',kind:'diver',col:'#65aeb5',cd:3.3,warn:.75},
a2_ink:{name:'КЛЯКСА-КУРЬЕР',kind:'ink',col:'#26202c',cd:2.5,warn:.6},a2_binder:{name:'ПЕРЕПЛЁТЧИК',kind:'page',col:'#c7bdab',cd:3.8,warn:.85},a2_letter:{name:'БУКВОЕД',kind:'letter',col:'#3a3042',cd:3.4,warn:.75},
a2_dancer:{name:'ИГОЛЬНАЯ ТАНЦОВЩИЦА',kind:'dancer',col:'#f2c8cf',cd:2.7,warn:.65},a2_masks:{name:'НОСИТЕЛЬ МАСОК',kind:'masks',col:'#b14562',cd:3.4,warn:.75},a2_stagehand:{name:'РАБОЧИЙ СЦЕНЫ',kind:'stagehand',col:'#6d3048',cd:3.6,warn:.9},
a2_wasp:{name:'ШПРИЦЕВАЯ ОСА',kind:'wasp',col:'#f2ba2d',cd:2.5,warn:.65,fly:1},a2_waxguard:{name:'ВОСКОВОЙ СТРАЖ',kind:'waxguard',col:'#ca8a20',cd:4,warn:.85},a2_resonator:{name:'ПЧЕЛА-РЕЗОНАТОР',kind:'resonator',col:'#ffd85c',cd:3.2,warn:.75,fly:1},
a2_moth:{name:'ПЫЛЬЦЕВАЯ МОЛЬ',kind:'pollen',col:'#edf3a0',cd:4,warn:.75,fly:1},a2_vine:{name:'РУКА-ЛИАНА',kind:'vine',col:'#75a848',cd:3.2,warn:.7},a2_seed:{name:'САДОВНИК-СЕМЯ',kind:'seed',col:'#b88a4c',cd:3.6,warn:.8},
a2_ray:{name:'ПАРУСНЫЙ СКАТ',kind:'ray',col:'#a9dded',cd:3.4,warn:.65,fly:1},a2_anchor:{name:'КРАБ-ЯКОРЩИК',kind:'anchor',col:'#7e746c',cd:3.7,warn:.9},a2_gull:{name:'ЧАЙКА-БУМЕРАНГ',kind:'gull',col:'#e8f4f4',cd:2.9,warn:.65,fly:1},
a2_cup:{name:'ЧАШЕЧНЫЙ РЫЦАРЬ',kind:'cup',col:'#e9f2ee',cd:3.1,warn:.75},a2_saucer:{name:'БЛЮДЕЧНЫЙ МОНАХ',kind:'saucer',col:'#9fc9ed',cd:3.2,warn:.8},a2_glazier:{name:'ГЛАЗУРОВЩИК',kind:'glazier',col:'#6c9fd4',cd:4.1,warn:.85},
a2_waiter:{name:'ОФИЦИАНТ-СЕКАЧ',kind:'waiter',col:'#9a5470',cd:3.1,warn:.75},a2_kettle:{name:'КОТЁЛ-СКОРОХОД',kind:'kettle',col:'#a96d43',cd:3.8,warn:.8},a2_cutlery:{name:'РОЙ ПРИБОРОВ',kind:'cutlery',col:'#cbd4d5',cd:2.8,warn:.7,fly:1},
a2_orbiter:{name:'ОРБИТАЛЬНЫЙ СТРЕЛОК',kind:'orbiter',col:'#91b5ed',cd:3.2,warn:.85,fly:1},a2_pendulum:{name:'МАЯТНИКОВЫЙ РЫЦАРЬ',kind:'pendulum',col:'#9c865e',cd:3.5,warn:.9},a2_larva:{name:'ГРАВИТАЦИОННАЯ ЛИЧИНКА',kind:'larva',col:'#746bc1',cd:4,warn:.75},
a2_needle:{name:'ИГЛОКРЫЛ',kind:'needle',col:'#f1e4b2',cd:3.1,warn:.85,fly:1},a2_knot:{name:'УЗЕЛ-ХРАНИТЕЛЬ',kind:'knot',col:'#7d5d9c',cd:4.2,warn:.8},a2_threadmoth:{name:'НИТЯНАЯ МОЛЬ',kind:'threadmoth',col:'#d4ad55',cd:3.5,warn:.85,fly:1}
};
function act2MobAttack(m,A){
 const p=player,aim=Math.atan2((p.y-24)-(m.y-m.h*.55),p.x-m.x),px=m.x+m.face*m.w*.35,py=m.y-m.h*.55;
 const shot=(type,spd,dmg,off=0,extra={})=>projs.push(Object.assign({x:px,y:py,vx:Math.cos(aim+off)*spd,vy:Math.sin(aim+off)*spd,friendly:false,mob:true,ability:true,type,dmg,life:3,c:m.eye},extra));
 switch(A.kind){
 case 'eel':m.vx=m.face*520;m.vy=-260;if(Math.hypot(p.x-m.x,p.y-m.y)<75)damagePlayer(m.face,m,.55);break;
 case 'trumpet':for(const o of [-.32,-.16,0,.16,.32])shot('bubble',260,.3,o);break;
 case 'diver':shot('harpoon',520,.45,0,{pullX:m.x,pullY:py});break;
 case 'ink':m.vx=m.face*590;fxList.push({type:'enemyweb',x1:m.x,y1:m.y-12,x2:clamp(m.x+m.face*230,20,W-20),y2:m.y-12,life:2,max:2});break;
 case 'page':for(const o of [-.18,0,.18])shot('paper',300,.4,o);m.ward=Math.max(m.ward||0,2);break;
 case 'letter':for(const o of [-.4,-.2,0,.2,.4])shot('letter',250,.34,o,{returnAfter:.9,returnX:px,returnY:py});break;
 case 'dancer':for(const o of [-.15,0,.15])shot('needle',440,.38,o);m.vx=m.face*380;break;
 case 'masks':m.maskN=((m.maskN||0)+1)%3;if(m.maskN===0){if(Math.abs(p.x-m.x)<110)damagePlayer(m.face,m,.75);fxList.push({type:'mimicslash',x:m.x,y:py,dir:m.face,life:.35,max:.35});}else if(m.maskN===1){for(const o of [-.18,.18])shot('tear',320,.45,o);}else for(const x of mobs)if(x!==m&&Math.hypot(x.x-m.x,x.y-m.y)<220)x.ward=Math.max(x.ward||0,2);break;
 case 'stagehand':projs.push({x:p.x,y:30,vx:0,vy:500,friendly:false,mob:true,ability:true,type:'stageweight',dmg:.75,life:2.2,c:'#d9aa86'});break;
 case 'wasp':m.vx=Math.cos(aim)*650;m.vy=Math.sin(aim)*650;break;
 case 'waxguard':m.ward=Math.max(m.ward||0,3);for(const x of mobs)if(x!==m&&Math.hypot(x.x-m.x,x.y-m.y)<140)x.ward=Math.max(x.ward||0,1);break;
 case 'resonator':for(let k=0;k<8;k++)shot('resonance',300,.35,k*Math.PI/4-aim);break;
 case 'pollen':{const life=4*(RS.zoneMul||1);fxList.push({type:'timezone',x:p.x,y:p.y-24,r:115,life,max:life});break;}
 case 'vine':shot('vinehook',460,.4,0,{pullX:m.x,pullY:py});break;
 case 'seed':for(const o of [-.25,0,.25])shot('seed',280,.42,o,{vy:Math.sin(aim+o)*280-150});break;
 case 'ray':for(const o of [-.22,0,.22])shot('gust',330,.4,o,{returnAfter:.75,returnX:px,returnY:py});break;
 case 'anchor':shot('skyhook',450,.55,0,{pullX:m.x,pullY:py});break;
 case 'gull':for(const o of [-.28,.28])shot('feather',390,.4,o,{returnAfter:.65,returnX:px,returnY:py});break;
 case 'cup':shot('porcelain',420,.5,0,{bounce:2});m.guard=1.1;break;
 case 'saucer':for(const o of [-.18,.18])shot('saucer',380,.45,o,{returnAfter:.7,returnX:px,returnY:py});break;
 case 'glazier':{const ally=mobs.filter(x=>x!==m&&x.hp>0&&x.hp<x.maxHp).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];if(ally){ally.hp=Math.min(ally.maxHp,ally.hp+ally.maxHp*.12);fxList.push({type:'revivebeam',x1:m.x,y1:py,x2:ally.x,y2:ally.y-ally.h*.5,life:.6,max:.6});}else projs.push({x:p.x,y:25,vx:0,vy:520,friendly:false,mob:true,ability:true,type:'crackshard',dmg:.65,life:2,c:'#6aa7e8'});break;}
 case 'waiter':for(const o of [-.2,.2])shot('plate',390,.45,o,{bounce:1});break;
 case 'kettle':for(const side of [-1,1])for(const o of [-.18,0,.18]){const an=(side>0?0:Math.PI)+o;projs.push({x:m.x,y:py,vx:Math.cos(an)*280,vy:Math.sin(an)*280,friendly:false,mob:true,ability:true,type:'steam',dmg:.34,life:1.4,c:'#f0d9c8'});}break;
 case 'cutlery':m.form=((m.form||0)+1)%3;if(m.form===0)shot('fork',520,.6);else if(m.form===1){m.vx=m.face*480;if(Math.abs(p.x-m.x)<70)damagePlayer(m.face,m,.55);}else m.guard=1.4;break;
 case 'orbiter':for(const o of [-.32,0,.32])shot('orbit',300,.42,o,{enemySeek:true,seekT:1.2});break;
 case 'pendulum':if(Math.abs(p.x-m.x)<125&&Math.abs(p.y-m.y)<80)damagePlayer(m.face,m,.9);fxList.push({type:'mimicslash',x:m.x,y:py,dir:m.face,life:.45,max:.45});break;
 case 'larva':{const life=4*(RS.zoneMul||1);fxList.push({type:'timezone',x:m.x,y:m.y-20,r:135,life,max:life});break;}
 case 'needle':for(const o of [-.35,0,.35])shot('goldthread',440,.45,o);break;
 case 'knot':{const ally=mobs.find(x=>x!==m&&x.hp>0&&Math.hypot(x.x-m.x,x.y-m.y)<260);if(ally){ally.ward=Math.max(ally.ward||0,3);m.ward=Math.max(m.ward||0,2);m.bondMate=ally.id;ally.bondMate=m.id;}break;}
 case 'threadmoth':shot('cocoonshot',270,.35,0,{enemySeek:true,seekT:1.4});break;
 }
}
function updateAct2Mob(m,dt,A,sm,dx,adx,dy){
 const p=player; m.face=dx>=0?1:-1;
 if(A.fly){
 const ty=p.y-70+Math.sin(m.anim*2+m.id)*35;
  const ms=A.kind==='wasp'?300:230;
  m.vx+=(clamp(dx*1.4,-ms,ms)*sm-m.vx)*Math.min(1,dt*2.8);
  m.vy+=(clamp((ty-m.y)*1.6,-190,190)-m.vy)*Math.min(1,dt*2.8);
 }else{
  const want=adx<150?-m.face:(adx>330?m.face:0);m.vx+=(want*m.spd*sm-m.vx)*Math.min(1,dt*4.5);
 }
 if(m.state==='walk'&&m.atkCd<=0&&!p.dead){m.state='a2wind';m.t=A.warn*(RS.warnMul||1);m.vx*=.3;popup(m.x,m.y-m.h-12,A.name,'#fff0b0');}
 else if(m.state==='a2wind'){m.t-=dt;m.vx*=Math.pow(.02,dt);m.vy*=A.fly?Math.pow(.08,dt):1;if(m.t<=0){act2MobAttack(m,A);m.state='walk';m.atkCd=A.cd*(hasVariant(m,'furious')?.6:1);}}
 if(A.fly){m.x=clamp(m.x+m.vx*dt,18,W-18);m.y=clamp(m.y+m.vy*dt,70,GROUND-10);}
 else physics(m,m.w/2,dt);
 return true;
}
function mobUpdate(m,dt){
const p=player;
m.anim+=dt;m.flash-=dt;m.jumpCd-=dt;m.atkCd-=dt*(m.type==='boss'?1:(RS.atkSpeed||1));m.hitCd-=dt;
if(m.echoT>0){m.echoT-=dt;if(m.echoT<=0&&m.echoKind){const k=m.echoKind;m.echoKind='';enemyAbility(m,k,.5,true);popup(m.x,m.y-m.h-20,'ЭХО','#d6a8ff');}}
if(m.slow>0)m.slow-=dt/Math.max(.25,1-(m.ctrlRes||0));
const sm=(m.slow>0?.45:1);
const dx=p.x-m.x,adx=Math.abs(dx),dy=p.y-m.y;
if(!p.dead&&m.type!=='flyer'&&m.type!=='ghost'&&m.type!=='boss')m.face=dx>=0?1:-1;
if(m.type==='boss'&&!p.dead)m.face=dx>=0?1:-1;
if(m.bleedT>0||m.poisonT>0||m.burnT>0){
m.bleedT-=dt;m.poisonT-=dt;m.burnT-=dt;
let rate=m.bleed*.5+m.poison*.35+(m.burnT>0?(m.burnD||1):0);
let rot=false;
if(synOn('rot')&&m.bleedT>0&&m.poisonT>0){rot=true;m.rotT=(m.rotT||0)+dt;rate*=Math.min(2+synLv('rot'),1+m.rotT*(.35+.15*synLv('rot')));}
else m.rotT=0;
m.dotAcc+=rate*dt;
if(m.dotAcc>=1){let d=Math.floor(m.dotAcc);m.dotAcc-=d;
if(difficulty==='easy'){if(m.type==='boss')d=Math.min(d,1);else d=Math.ceil(m.hp);}
d=capEnemyDamage(m,d);
m.hp-=d;m.flash=.08;
popup(m.x,m.y-m.h-6,'-'+d,rot?'#c8ff5a':(m.burnT>0?'#ff9d45':(m.bleed>0?'#ff7a6b':'#8fe07a')));
if(rot)spawnParts(3,m.x,m.y-m.h*.6,'#c8ff5a',80,.4,'spark',60);
else if(m.burnT>0)spawnParts(2,m.x+rnd(-8,8),m.y-m.h*.6,'#ff9d45',70,.45,'spark',-160);
if(m.hp<=0){killMob(m);return;}}
}else m.rotT=0;
const T=m.type;
if(ACT2_MOB_AI[T]){updateAct2Mob(m,dt,ACT2_MOB_AI[T],sm,dx,adx,dy);}
else if(T==='walker'||T==='tank'){
const heavy=T==='tank';
if(m.state==='walk'){
m.vx+=(m.face*m.spd*sm-m.vx)*Math.min(1,dt*6);
if(m.grounded&&!p.dead){
if(dy<-40&&adx<130&&m.jumpCd<=0&&!heavy){m.vy=-900;m.jumpCd=rnd(1.2,2);dust(m.x,m.y,3);}
else if(!heavy&&m.jumpCd<=0&&rand()<dt*.2){m.vy=-560;m.jumpCd=1.5;dust(m.x,m.y,2);}
}
if(!p.dead&&adx<(heavy?66:58)&&Math.abs(dy)<64&&m.atkCd<=0){m.state='windup';m.t=heavy?.7:.5;m.vx=0;}
}else if(m.state==='windup'){
m.vx*=Math.pow(.001,dt);m.t-=dt/(RS.warnMul||1);
if(m.t<=0){m.state='lunge';m.t=.16;m.vx=m.face*(heavy?300:400);
fxList.push({type:'claw',x:m.x+m.face*26,y:m.y-m.h*.6,life:.2,max:.2});
if(!p.dead&&Math.abs(p.x-m.x)<(heavy?80:66)&&Math.abs(p.y-m.y)<70)damagePlayer(m.face,m,heavy?1.6:1);}}
else if(m.state==='lunge'){m.t-=dt;if(m.t<=0){m.state='recover';m.t=.4;}}
else{m.vx*=Math.pow(.02,dt);m.t-=dt;if(m.t<=0){m.state='walk';m.atkCd=rnd(.6,1)*(hasVariant(m,'furious')?.5:1)*(ascOn(1)?.8:1);}}
physics(m,m.w/2,dt);
if(m.grounded&&!m.wasG){dust(m.x,m.y,3);m.sy=.75;m.sx=1.25;}
}else if(T==='flyer'){
m.ph+=dt*3;
const tx=p.x,ty=(p.dead?240:p.y-80+Math.sin(m.ph)*22);
m.vx+=(clamp((tx-m.x)*2.2,-240,240)*sm-m.vx)*Math.min(1,dt*3);
m.vy+=(clamp((ty-m.y)*3,-220,220)-m.vy)*Math.min(1,dt*3);
m.face=m.vx>=0?1:-1;
if(!p.dead&&m.state!=='dive'&&m.state!=='aim'&&adx<90&&dy>-20&&m.atkCd<=0){
m.state='aim';m.t=.45;m.atkCd=1.6;
fxList.push({type:'divemark',mob:m,life:.45,max:.45});
noiseS(.1,.07,2200);
}
if(m.state==='aim'){m.t-=dt;m.vx*=Math.pow(.05,dt);m.vy*=Math.pow(.05,dt);
if(m.t<=0){m.state='dive';m.t=.45;m.vx=m.face*60;m.vy=560;}}
if(m.state==='dive'){m.t-=dt;m.vy=Math.max(m.vy,300);if(m.t<=0){m.state='climb';m.t=.7;m.vy=-260;m.atkCd=1.6;}}
if(m.state==='climb'){m.t-=dt;if(m.t<=0)m.state='walk';}
m.x+=m.vx*dt;m.y+=m.vy*dt;m.x=clamp(m.x,16,W-16);m.y=clamp(m.y,70,GROUND-8);
if(!p.dead&&p.inv<=0&&m.state==='dive'&&adx<24&&Math.abs(p.y-14-m.y)<32)damagePlayer(m.vx>=0?1:-1,m,1);
}else if(T==='spitter'){
const want=adx<150?-m.face:(adx>340?m.face:0);
m.vx+=(want*m.spd*sm-m.vx)*Math.min(1,dt*5);
if(m.grounded&&rand()<dt*.5){m.vy=-560;dust(m.x,m.y,2);}
if(!p.dead&&m.atkCd<=0&&adx>70){m.atkCd=2.1*(hasVariant(m,'furious')?.6:1);
const px=m.x+m.face*16,py=m.y-m.h*.6;
const enraged=m.hp<=m.maxHp*.5;
if(enraged){
const base=Math.atan2(p.y-20-py,p.x-px);
for(const off of [-.22,0,.22])
projs.push({x:px,y:py,vx:Math.cos(base+off)*300,vy:Math.sin(base+off)*300,friendly:false,mob:true,type:'spit',dmg:.5,life:3});
popup(m.x,m.y-m.h-8,'ХРРА!','#c8ff5a');
}else projs.push({x:px,y:py,vx:m.face*(250+rand()*40),vy:(p.y-20-py)*.7,friendly:false,mob:true,type:'spit',dmg:.5,life:3});
sfx.shoot();}
physics(m,m.w/2,dt);
if(m.grounded&&!m.wasG){m.sy=.8;m.sx=1.2;}
}else if(T==='ghost'){
m.anim+=dt*.6;
if(m.state==='walk'){
const tx=p.x-Math.sign(dx||1)*90,ty=p.y-40;
m.vx+=(clamp((tx-m.x)*1.1,-90,90)*sm-m.vx)*Math.min(1,dt*2);
m.vy+=(clamp((ty-m.y)*1.1,-80,80)+Math.sin(m.anim*2)*20-m.vy)*Math.min(1,dt*2);
m.face=dx>=0?1:-1;
if(!p.dead&&m.atkCd<=0&&adx<230){m.state='windup';m.t=.5;m.vx=0;m.vy=0;m.atkCd=2.6;
popup(m.x,m.y-m.h-10,'!','#c9a0ff');noiseS(.14,.08,500);}
}else if(m.state==='windup'){
m.t-=dt/(RS.warnMul||1);m.vx*=Math.pow(.01,dt);m.vy*=Math.pow(.01,dt);
m.face=dx>=0?1:-1;
if(rand()<dt*26)spawnParts(1,m.x+rnd(-14,14),m.y-m.h*.5,'#c9a0ff',60,.4,'spark',-40);
if(m.t<=0){
m.state='phase';m.t=.55;
const L=Math.hypot(dx,(p.y-30)-m.y)||1;
m.vx=dx/L*620;m.vy=((p.y-30)-m.y)/L*620;
spawnParts(12,m.x,m.y-m.h*.5,'#c9a0ff',220,.4,'spark',30);
}
}else if(m.state==='phase'){
m.t-=dt;
if(rand()<dt*30)spawnParts(1,m.x,m.y-m.h*.5,'#b48aff',40,.35,'spark',0);
if(m.t<=0){m.state='walk';}
}
m.x+=m.vx*dt;m.y+=m.vy*dt;m.x=clamp(m.x,16,W-16);m.y=clamp(m.y,80,GROUND-10);
 if(!p.dead&&p.inv<=0&&m.state==='phase'&&adx<26&&Math.abs(p.y-16-m.y)<36)damagePlayer(m.face,m,1.2,false,false,false,true);
}else if(T==='mage'){
m.t-=dt;
const SC=m.school||'bolt';
if(m.state==='walk'){
if(m.atkCd<=0){m.atkCd=SC==='ward'?3.4:2.6;m.state='tp';m.t=.4;spawnParts(8,m.x,m.y-m.h/2,theme.accent,140,.4,'spark',100);}
}else if(m.state==='tp'){
if(m.t<=0){m.x=clamp(rnd(60,W-60),60,W-60);m.y=GROUND;m.state='cast';m.t=.6;
popup(m.x,m.y-m.h-12,SC==='ward'?'ЩИТ':(SC==='mire'?'ТОПЬ':'!'),SC==='ward'?'#9ad0ff':(SC==='mire'?'#b6d94a':'#ffd23f'));
spawnParts(10,m.x,m.y-m.h/2,theme.accent,180,.5,'spark',100);}
}else if(m.state==='cast'){
if(m.t<=0){
if(!p.dead){
if(SC==='bolt'){
const px=m.x+m.face*10,py=m.y-m.h*.7;
const base=Math.atan2((p.y-24)-py,p.x-px);
for(const off of (m.hp<=m.maxHp*.5?[-.2,0,.2]:[0]))
 projs.push({x:px,y:py,vx:Math.cos(base+off)*300,vy:Math.sin(base+off)*300,friendly:false,mob:true,ability:true,type:'arcane',dmg:1,life:3});
sfx.cast();
}else if(SC==='ward'){
let n=0;
for(const x of mobs){if(x===m||x.hp<=0)continue;
if(Math.hypot(x.x-m.x,x.y-m.y)<300&&n<3){x.ward=Math.max(x.ward||0,4);n++;
fxList.push({type:'zap',a:{x:m.x,y:m.y-m.h*.7},b:{x:x.x,y:x.y-x.h*.5},life:.25,max:.25});}}
if(n)popup(m.x,m.y-m.h-24,'ОБЕРЕГ ×'+n,'#9ad0ff');
sfx.cast();
}else{
 const life=5*(RS.zoneMul||1);fxList.push({type:'mire',enemy:true,x:clamp(p.x,60,W-60),life,max:life});
sfx.cast();
}
}
m.state='walk';}
}
physics(m,m.w/2,dt);
}else if(T==='driller'){
m.t-=dt;
if(m.state==='under'){
m.y=GROUND;
m.x+=clamp((p.x-m.x),-1,1)*260*sm*dt;
if(rand()<dt*22)dust(m.x,GROUND,1);
if(m.t<=0){m.state='warn';m.t=.7;
fxList.push({type:'crack',x:m.x,life:.7,max:.7});
noiseS(.16,.12,320);}
}else if(m.state==='warn'){
if(rand()<dt*40)spawnParts(1,m.x+rnd(-16,16),GROUND-2,'#9aa89b',90,.4,'dust',-120);
if(m.t<=0){
m.state='burst';m.t=.5;m.vy=-760;m.grounded=false;
addShake(6);noiseS(.2,.22,260);
spawnParts(18,m.x,GROUND-6,tint(theme.accent,.8),320,.5,'chunk',700);
 if(!p.dead&&Math.abs(p.x-m.x)<50&&p.y>GROUND-90)damagePlayer(p.x>=m.x?1:-1,m,1.5,false,false,false,true);
}
}else if(m.state==='burst'){
physics(m,m.w/2,dt);
if(m.t<=0){m.state='surface';m.t=2.6;}
}else{
m.vx+=(m.face*90*sm-m.vx)*Math.min(1,dt*4);
physics(m,m.w/2,dt);
if(m.t<=0){m.state='under';m.t=rnd(1.4,2.4);m.vx=0;
dust(m.x,GROUND,8);spawnParts(10,m.x,GROUND-4,'#9aa89b',180,.4,'dust',300);}
}
}else if(T==='hound'){
const want=adx<170?-m.face:(adx>330?m.face:0);
m.vx+=(want*m.spd*sm-m.vx)*Math.min(1,dt*5);
if(m.grounded&&dy<-50&&adx<160&&m.jumpCd<=0){m.vy=-780;m.jumpCd=1.6;dust(m.x,m.y,2);}
if(!p.dead&&m.atkCd<=0&&adx>110&&adx<430&&m.state!=='windup'){
m.state='windup';m.t=.55;m.atkCd=3.4*(hasVariant(m,'furious')?.6:1);
popup(m.x,m.y-m.h-10,'ГАРПУН','#ffd23f');
}
if(m.state==='windup'){
m.t-=dt/(RS.warnMul||1);m.vx*=Math.pow(.02,dt);
if(m.t<=0){
m.state='walk';
const px=m.x+m.face*18,py=m.y-m.h*.6;
const ddx=p.x-px,ddy=(p.y-26)-py,L=Math.hypot(ddx,ddy)||1;
 projs.push({x:px,y:py,vx:ddx/L*520,vy:ddy/L*520,friendly:false,mob:true,ability:true,type:'harpoon',dmg:.5,life:1.2,pullX:m.x,pullY:m.y-m.h*.5});
sfx.throw();
}
}
physics(m,m.w/2,dt);
if(m.grounded&&!m.wasG){m.sy=.85;m.sx=1.15;}
}else if(T==='spore'){
const want=adx<180?-m.face:(adx>330?m.face:0);m.vx+=(want*m.spd*sm-m.vx)*Math.min(1,dt*4);
if(m.state==='walk'&&m.atkCd<=0){m.state='cast';m.t=.7;m.atkCd=4.8;popup(m.x,m.y-m.h-10,'СПОРЫ','#a9d873');}
if(m.state==='cast'){m.vx*=Math.pow(.02,dt);m.t-=dt/(RS.warnMul||1);if(m.t<=0){m.state='walk';enemyAbility(m,'spore');}}
physics(m,m.w/2,dt);
}else if(T==='slime'){
m.vx+=(m.face*m.spd*sm-m.vx)*Math.min(1,dt*4);
if(m.splitStage<2&&m.hp<m.maxHp*(m.splitStage===0?.62:.28)){
m.splitStage++;m.w*=.78;m.h*=.82;m.spd*=1.14;
const ch=spawnMob('slime',{x:clamp(m.x-m.face*24,24,W-24),y:m.y,noVariants:true,summoned:true,noLoot:true});
ch.hp=ch.maxHp=Math.max(1,m.maxHp*.32);ch.splitStage=m.splitStage;ch.w=m.w;ch.h=m.h;ch.spd=m.spd;ch.face=-m.face;
popup(m.x,m.y-m.h-8,'ДЕЛЕНИЕ','#8fe6aa');spawnParts(14,m.x,m.y-m.h*.4,'#8fe6aa',180,.45,'spark',100);
}
if(adx<48&&Math.abs(dy)<48&&m.hitCd<=0){m.hitCd=1;damagePlayer(m.face,m,.8);}
physics(m,m.w/2,dt);
}else if(T==='weaver'){
const want=adx<190?-m.face:(adx>390?m.face:0);m.vx+=(want*m.spd*sm-m.vx)*Math.min(1,dt*6);
if(m.state==='walk'&&m.atkCd<=0){m.state='cast';m.t=.65;m.atkCd=4.4;popup(m.x,m.y-m.h-8,'НИТЬ','#d7b5ff');}
if(m.state==='cast'){m.vx*=Math.pow(.02,dt);m.t-=dt/(RS.warnMul||1);if(m.t<=0){m.state='walk';enemyAbility(m,'web');}}
physics(m,m.w/2,dt);
}else if(T==='binder'){
const corpse=CORPSES.find(c=>!c.used&&time-c.time<12);
const want=adx<220?-m.face:(adx>430?m.face:0);m.vx+=(want*m.spd*sm-m.vx)*Math.min(1,dt*4);
if(m.state==='walk'&&m.atkCd<=0){m.state='cast';m.t=.85;m.atkCd=5;m.reviveCorpse=corpse||null;popup(m.x,m.y-m.h-12,corpse?'ВОЗВРАТ':'КОСТЬ','#cbb5ff');}
if(m.state==='cast'){m.vx*=Math.pow(.02,dt);m.t-=dt/(RS.warnMul||1);if(m.t<=0){m.state='walk';
const c=m.reviveCorpse;if(c&&!c.used){c.used=true;const r=spawnMob(c.type,{x:c.x,y:c.y,noVariants:true,summoned:true,noLoot:true});r.hp=r.maxHp=Math.max(1,r.maxHp*.4);r.revived=true;
fxList.push({type:'revivebeam',x1:m.x,y1:m.y-m.h*.7,x2:r.x,y2:r.y-r.h*.5,life:.7,max:.7});popup(r.x,r.y-r.h-10,'ВОСКРЕШЁН','#cbb5ff');}
else enemyShotAt(m,'bone',360,.8);m.reviveCorpse=null;}}
physics(m,m.w/2,dt);
}else if(T==='prism'){
const want=adx<100?-m.face:(adx>260?m.face:0);m.vx+=(want*m.spd*sm-m.vx)*Math.min(1,dt*4);
if(m.prismCharge>=3&&m.state==='walk'){m.state='cast';m.t=.6;popup(m.x,m.y-m.h-12,'ПЕРЕГРУЗКА','#9ff3ff');}
if(m.state==='cast'){m.vx*=Math.pow(.02,dt);m.t-=dt/(RS.warnMul||1);if(m.t<=0){m.state='walk';enemyAbility(m,'prism');}}
if(adx<52&&Math.abs(dy)<55&&m.hitCd<=0){m.hitCd=1.1;damagePlayer(m.face,m,1);}
physics(m,m.w/2,dt);
}else if(T==='mimic'){
const want=adx<130?-m.face:(adx>310?m.face:0);m.vx+=(want*m.spd*sm-m.vx)*Math.min(1,dt*5);
if(m.state==='walk'&&m.atkCd<=0){m.state='cast';m.t=.55;m.atkCd=3.2;popup(m.x,m.y-m.h-12,'КОПИРУЮ','#ffd27a');}
if(m.state==='cast'){m.vx*=Math.pow(.02,dt);m.t-=dt/(RS.warnMul||1);if(m.t<=0){m.state='walk';enemyAbility(m,'mimic');}}
physics(m,m.w/2,dt);
}else if(T==='thief'){
if(m.stolen>0){m.face=m.x<W/2?-1:1;m.vx+=(m.face*m.spd*1.25-m.vx)*Math.min(1,dt*8);m.escapeT+=dt;
if(m.x<18||m.x>W-18||m.escapeT>7){popup(m.x,m.y-m.h-8,'СБЕЖАЛ С '+m.stolen+' 👻','#ff8ab0');mobs=mobs.filter(x=>x!==m);return;}}
else{m.vx+=(m.face*m.spd*sm-m.vx)*Math.min(1,dt*7);if(adx<38&&Math.abs(dy)<50&&m.hitCd<=0){m.hitCd=2;
const take=Math.min(souls,Math.max(4,Math.ceil(souls*.15)));if(take>0){souls-=take;m.stolen=take;popup(m.x,m.y-m.h-10,'УКРАЛ '+take+' 👻','#ff8ab0');fxList.push({type:'soulsteal',a:{x:player.x,y:player.y-30},b:{x:m.x,y:m.y-m.h*.5},life:.55,max:.55});}else damagePlayer(m.face,m,.7);}}
physics(m,m.w/2,dt);
}else if(T==='chrono'){
const want=adx<210?-m.face:(adx>420?m.face:0);m.vx+=(want*m.spd*sm-m.vx)*Math.min(1,dt*4);
if(m.state==='walk'&&m.atkCd<=0){m.state='cast';m.t=.75;m.atkCd=5;popup(m.x,m.y-m.h-12,'ТИК-ТАК','#b7b4ff');}
if(m.state==='cast'){m.vx*=Math.pow(.02,dt);m.t-=dt/(RS.warnMul||1);if(m.t<=0){m.state='walk';enemyAbility(m,'chrono');}}
physics(m,m.w/2,dt);
}else if(T==='magnet'){
for(const pr of projs){if(!pr.friendly||pr.life<=0)continue;const dd=Math.hypot(pr.x-m.x,pr.y-(m.y-m.h*.5));if(dd<220){pr.vx+=(m.x-pr.x)*dt*7;pr.vy+=((m.y-m.h*.5)-pr.y)*dt*7;if(dd<26&&m.stored<3){pr.life=0;m.stored++;popup(m.x,m.y-m.h-10,'ЗАРЯД '+m.stored,'#c9e4ff');}}}
const want=adx<170?-m.face:(adx>350?m.face:0);m.vx+=(want*m.spd*sm-m.vx)*Math.min(1,dt*4);
if(m.atkCd<=0&&(m.stored>0||adx<320)){m.atkCd=3.8;enemyAbility(m,'magnet');}
physics(m,m.w/2,dt);
}else if(T==='builder'){
const want=adx<220?-m.face:(adx>430?m.face:0);m.vx+=(want*m.spd*sm-m.vx)*Math.min(1,dt*4);
if(m.state==='walk'&&m.atkCd<=0){m.state='cast';m.t=.8;m.atkCd=5.4;popup(m.x,m.y-m.h-12,'СТРОЮ','#e0b27a');}
if(m.state==='cast'){m.vx*=Math.pow(.02,dt);m.t-=dt/(RS.warnMul||1);if(m.t<=0){m.state='walk';enemyAbility(m,'builder');}}
physics(m,m.w/2,dt);
}else if(T==='cocoon'){
m.t-=dt;m.vx=0;physics(m,m.w/2,dt);if(m.t<=0){for(const d of [-1,1]){const s=spawnMob('sporeling',{x:clamp(m.x+d*16,20,W-20),y:m.y,noVariants:true,summoned:true,noLoot:true});s.ownerId=m.ownerId;s.face=d;}spawnParts(18,m.x,m.y-m.h*.5,'#a9d873',220,.5,'spark',180);mobs=mobs.filter(x=>x!==m);return;}
}else if(T==='sporeling'){
m.vx+=(m.face*m.spd*sm-m.vx)*Math.min(1,dt*8);if(adx<30&&Math.abs(dy)<35&&m.hitCd<=0){m.hitCd=1.2;damagePlayer(m.face,m,.5);}physics(m,m.w/2,dt);
}else if(T==='bastion'){
m.t-=dt;m.vx=0;physics(m,m.w/2,dt);if(m.t<=0){spawnParts(8,m.x,m.y-m.h*.5,m.color,100,.35,'chunk',400);mobs=mobs.filter(x=>x!==m);return;}
}else if(T==='boss'){
m.bT-=dt;
m.dodgeCd-=dt;m.evadeT=Math.max(0,m.evadeT-dt);m.evadeIframes=Math.max(0,m.evadeIframes-dt);m.sigPoseT=Math.max(0,(m.sigPoseT||0)-dt);
m.guard=Math.max(0,(m.guard||0)-dt);m.nodeCd=Math.max(0,(m.nodeCd||0)-dt);m.headCd=Math.max(0,(m.headCd||0)-dt);m.searedT=Math.max(0,(m.searedT||0)-dt);m.exposeT=Math.max(0,(m.exposeT||0)-dt);
if(m.rageShieldT>0){m.rageShieldT-=dt;if(m.rageShieldT<=0){m.rageShieldT=0;m.shieldNodes=0;m.exposeT=2.6;popup(m.x,m.y-m.h-24,'БЕРСЕРК ИСЧЕРПАН','#ffd23f',true);}}
m.kbBlock=true;
if(m.abyssRegen&&m.hp>0)m.hp=Math.min(m.maxHp,m.hp+m.maxHp*m.abyssRegen*dt);
if(m.phase===1&&m.hp<m.maxHp*.5){m.phase=2;popup(m.x,m.y-m.h-20,'ЯРОСТЬ!','#ff5030',true);addShake(8);m.eye='#ff2010';
banner('ФАЗА II',m.name+' звереет<br><span style="color:#ff9d7a">урон +⅓ · получает на ⅓ меньше</span>');sfx.boss();m.seq=[];if(bossHasMod(m,'ward'))m.ward=Math.max(m.ward||0,2);}
if(m.phase===2&&m.hp<m.maxHp*.25){m.phase=3;popup(m.x,m.y-m.h-20,'ПРЕДСМЕРТНАЯ ЯРОСТЬ!','#ff2010',true);
addShake(12);m.eye='#ffffff';m.seq=[];m.spT=0;
banner('ФАЗА III',(SPECIAL_NAME[m.special]||'')+' · новая атака: '+(m.p3||'—'));
sfx.boss();spawnParts(30,m.x,m.y-m.h/2,'#ff5030',360,.7,'spark',200);if(bossHasMod(m,'ward'))m.ward=Math.max(m.ward||0,2);beginBossBerserk(m);}
if(endless&&room>=30&&m.phase===3&&m.hp<m.maxHp*.1){m.phase=4;m.seq=[];m.spT=0;m.bossHaste=(m.bossHaste||1)*1.15;m.specialRate=(m.specialRate||1)*1.2;
popup(m.x,m.y-m.h-24,'ПОСЛЕДНЯЯ ГРАНЬ!','#ffffff',true);banner('ФАЗА IV','атаки ускорены · особые приёмы без передышки');addShake(14);sfx.boss();}
m.spT-=dt*(m.phase>=3?1.6:(m.phase>=2?1.2:1))*(m.specialRate||1);
if(m.spT<=0){m.spT=m.phase>=3?5:8;bossSpecial(m);}
m.sigT-=dt*(m.phase>=3?1.25:(m.phase>=2?1.08:1));
if(m.sigT<=0&&!p.dead&&m.state!=='windup'&&!m.bossAtk){m.sigT=m.phase>=3?4.4:(m.phase>=2?5.2:6.2);signatureBossAttack(m);}
if(m.state==='windup'){
m.t-=dt/(RS.warnMul||1);m.vx*=Math.pow(.001,dt);
if(m.mobility==='walk'||m.mobility==='tele')physics(m,m.w/2,dt);
if(m.t<=0){const a=m.bossAtk;m.state='walk';execBossAttack(m,a,m.phase>=2);}
}else if(m.bossAtk==='charge'){
m.t-=dt;
if(m.mobility==='walk')physics(m,m.w/2,dt);
else{m.x+=m.vx*dt;m.y+=m.vy*dt;m.x=clamp(m.x,m.w/2,W-m.w/2);m.y=clamp(m.y,60,GROUND-20);}
if(m.t<=0){m.bossAtk='stun';m.t=.5;m.vx=0;m.vy=0;m.bT=bossGap(m.phase>=2,m);}
}else if(m.bossAtk==='slam'){
m.t-=dt;
physics(m,m.w/2,dt);
if((m.grounded&&!m.slamLand)||m.t<=0){
m.slamLand=true;
const gcol=m.proj==='ice'?'#8fe0ff':(m.proj==='fireball'?'#ff8a3d':'#d8d3c0');
const bd=m.bossIndex>=ACT1_LEN?.62:1;
projs.push({x:m.x-24,y:GROUND-8,vx:-330,vy:0,friendly:false,boss:true,rage:(m.phase>=2?1:0),type:'gwave',dmg:1.5*bd,life:4.2,c:gcol});
projs.push({x:m.x+24,y:GROUND-8,vx:330,vy:0,friendly:false,boss:true,rage:(m.phase>=2?1:0),type:'gwave',dmg:1.5*bd,life:4.2,c:gcol});
spawnParts(14,m.x,GROUND-6,gcol,320,.5,'spark',400);
addShake(7);noiseS(.2,.3,300);
m.bossAtk='stun';m.t=.45;m.vx=0;m.bT=bossGap(m.phase>=2,m);
}
}else if(m.bossAtk==='stun'){
m.t-=dt;m.vx*=Math.pow(.01,dt);
if(m.mobility==='walk'||m.mobility==='tele')physics(m,m.w/2,dt);
if(m.t<=0)m.bossAtk=null;
}else{
if(m.mobility==='walk'){
m.roamT-=dt;
const phaseMove=m.phase>=3?1.28:(m.phase>=2?1.14:1);
if(m.roamT<=0){
m.roamT=rnd(.42,.9)/(m.phase>=3?1.25:1);
if(adx>360)m.roamDir=m.face;
else if(adx<125)m.roamDir=-m.face;
else m.roamDir=rand()<.48?-m.face:m.face;
}
if(m.grounded&&m.jumpCd<=0){
const above=p.y<m.y-55;
const jumpDir=above||adx>330?m.face:(adx<145?-m.face:(rand()<.5?-m.face:m.face));
const phaseJump=m.phase>=3?1.22:(m.phase>=2?1.1:1);
m.vy=-(650+(above?150:0))*phaseJump;
m.vx=jumpDir*m.spd*(2.05+(m.phase-1)*.22);
m.roamDir=jumpDir;m.roamT=rnd(.35,.65);
m.jumpCd=rnd(.85,1.45)/(phaseJump*Math.sqrt(RS.atkSpeed||1));
dust(m.x,m.y,5);spawnParts(5,m.x,m.y-5,m.color,110,.3,'dust',120);
}
if(m.grounded)m.vx+=(m.roamDir*m.spd*sm*phaseMove-m.vx)*Math.min(1,dt*7);
else m.vx=clamp(m.vx,-m.spd*2.6,m.spd*2.6);
physics(m,m.w/2,dt);
}else if(m.mobility==='fly'){
const tx=p.x,ty=p.y-90+Math.sin(m.wobT)*20;
m.vx+=(clamp((tx-m.x)*2,-m.spd*1.6,m.spd*1.6)-m.vx)*Math.min(1,dt*3);
m.vy+=(clamp((ty-m.y)*2.5,-260,260)-m.vy)*Math.min(1,dt*3);
m.x+=m.vx*dt;m.y+=m.vy*dt;
m.x=clamp(m.x,m.w/2,W-m.w/2);m.y=clamp(m.y,60,GROUND-30);
}else if(m.mobility==='ghost'){
m.vx+=(clamp((p.x-m.x)*1.2,-m.spd,m.spd)-m.vx)*Math.min(1,dt*2);
m.vy+=(clamp((p.y-30-m.y)*1.2,-m.spd,m.spd)+Math.sin(m.wobT)*15-m.vy)*Math.min(1,dt*2);
m.x+=m.vx*dt;m.y+=m.vy*dt;
m.x=clamp(m.x,m.w/2,W-m.w/2);m.y=clamp(m.y,80,GROUND-10);
}else if(m.mobility==='tele'){
m.tpT-=dt;
if(m.tpT<=0){m.tpT=2.4;
spawnParts(10,m.x,m.y-m.h/2,m.color,180,.5,'spark',100);
m.x=clamp(rnd(80,W-80),80,W-80);
spawnParts(10,m.x,m.y-m.h/2,m.color,180,.5,'spark',100);}
m.vx=0;physics(m,m.w/2,dt);
}
m.wobT+=dt*3;
if(m.bT<=0&&!p.dead&&!(m.mobility==='walk'&&!m.grounded))startBossAttack(m);
}
if(!p.dead&&p.inv<=0&&Math.abs(p.x-m.x)<m.w*.5&&Math.abs(p.y-m.y)<m.h*.7&&m.hitCd<=0){m.hitCd=.8;const a2=m.bossIndex>=ACT1_LEN;damagePlayer(dx>=0?1:-1,m,m.bossAtk==='charge'?(a2?.96:2):(a2?.744:1.2),false,false,false,!!m.bossAtk);}
}
m.wasG=m.grounded;
m.sx+=(1-m.sx)*Math.min(1,dt*10);m.sy+=(1-m.sy)*Math.min(1,dt*10);
m.wobT+=dt*(6+Math.abs(m.vx)*.03);
}
function physics(e,hw,dt){
 e.vy=Math.min(e.vy+GRAV*dt,1000);
 const px=e.x,py=e.y;e.x+=e.vx*dt;e.y+=e.vy*dt;
 e.x=clamp(e.x,hw,W-hw);
 /* Построенные мобами бастионы — полноценные твёрдые стены для героя. */
 if(e===player)for(const b of mobs){
  if(b.type!=='bastion'||b.hp<=0)continue;
  const left=b.x-b.w*.5,right=b.x+b.w*.5,top=b.y-b.h;
  if(e.y<=top||e.y-50>=b.y||(e.vy>=0&&py<=top+.6&&e.y>=top))continue;
  if(e.vx>0&&px+hw<=left&&e.x+hw>left){e.x=left-hw;e.vx=0;}
  else if(e.vx<0&&px-hw>=right&&e.x-hw<right){e.x=right+hw;e.vx=0;}
  else if(e.x+hw>left&&e.x-hw<right){
   if(e.vx>=0){e.x=left-hw;e.vx=0;}else{e.x=right+hw;e.vx=0;}
  }
 }
 e.grounded=false;
 if(e.vy>=0)for(const pl of plats){
 if(!pl.ground&&e.drop>0)continue;
 if(e===player&&pl.ground&&floorGapAt(e.x))continue;
 if(e.x+hw>pl.x&&e.x-hw<pl.x+pl.w&&py<=pl.y+.6&&e.y>=pl.y){e.y=pl.y;e.vy=0;e.grounded=true;}
 }
 if(e===player&&e.vy>=0)for(const b of mobs){
  if(b.type!=='bastion'||b.hp<=0)continue;
  const left=b.x-b.w*.5,right=b.x+b.w*.5,top=b.y-b.h;
  if(e.x+hw>left&&e.x-hw<right&&py<=top+.6&&e.y>=top){e.y=top;e.vy=0;e.grounded=true;}
 }
 }
