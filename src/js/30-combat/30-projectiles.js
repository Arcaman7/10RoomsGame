/* ================= СНАРЯДЫ ================= */
function projUpdate(dt){
for(const pr of projs){
pr.life-=dt;
if(pr.friendly&&!pr.parried){pr.defCd=(pr.defCd||0)-dt;if(pr.defCd<=0){pr.defCd=.24;bossTryDefense(pr);}}
if(!pr.friendly&&pr.enemySeek&&pr.seekT>0&&!player.dead){pr.seekT-=dt;const an=Math.atan2(player.y-24-pr.y,player.x-pr.x),sp=Math.hypot(pr.vx,pr.vy)||180,k=Math.min(1,dt*1.35);pr.vx+=(Math.cos(an)*sp-pr.vx)*k;pr.vy+=(Math.sin(an)*sp-pr.vy)*k;}
if(!pr.friendly&&pr.returnAfter!=null){pr.returnAfter-=dt;if(pr.returnAfter<=0){const own=pr.returnOwner&&bossById(pr.returnOwner),tx=own?own.x:pr.returnX,ty=own?own.y-own.h*.55:pr.returnY,an=Math.atan2(ty-pr.y,tx-pr.x),sp=Math.max(300,Math.hypot(pr.vx,pr.vy));pr.vx=Math.cos(an)*sp;pr.vy=Math.sin(an)*sp;pr.returnAfter=null;pr.returning=true;}}
if(pr.type==='trident'){
pr.t+=dt;
if(!pr.ret&&pr.t>.45)pr.ret=true;
if(pr.ret&&!player.dead){
const dx=player.x-pr.x,dy=(player.y-26)-pr.y,L=Math.hypot(dx,dy)||1;
if(L<26){pr.life=0;continue;}
pr.vx+=dx/L*1600*dt;pr.vy+=dy/L*1600*dt;
const sp=Math.hypot(pr.vx,pr.vy);if(sp>680){pr.vx*=680/sp;pr.vy*=680/sp;}
}
}
/* ЭВОЛЮЦИИ: самонаводящиеся снаряды (Жнец/Теневой лук/Посох Бездны) */
if(pr.homing&&pr.friendly){
let nb=null,nd=1e9;
if(pr.targetId)nb=mobs.find(m=>m.id===pr.targetId&&m.hp>0)||null;
if(!nb)for(const m of mobs){if(pr.hit&&pr.hit.has(m.id))continue;const dd=Math.hypot(m.x-pr.x,(m.y-m.h*.5)-pr.y);if(dd<nd){nd=dd;nb=m;}}
if(nb){const an=Math.atan2((nb.y-nb.h*.5)-pr.y,nb.x-pr.x),sp=Math.hypot(pr.vx,pr.vy)||420;
const k=Math.min(1,dt*(pr.hturn||6));
pr.vx+=(Math.cos(an)*sp-pr.vx)*k;pr.vy+=(Math.sin(an)*sp-pr.vy)*k;}
}
/* Воронка и сингулярность: удвоенная область поглощения снарядов. */
for(const h of HOLES){if(!pr.friendly&&Math.hypot(pr.x-h.x,pr.y-h.y)<92){pr.life=0;h.ch++;}}
{const pm=pr.friendly?1:(RS.projSpeed||1);pr.x+=pr.vx*dt*pm;pr.y+=pr.vy*dt*pm;}
if(pr.friendly){
/* ЭВОЛЮЦИЯ: ЛАВИНА — растущий вал, катится по земле и сносит врагов */
if(pr.type==='aval'){
pr.grow=Math.min(1,(pr.grow||0)+dt*.6);
const R=34+62*pr.grow;
pr.y=GROUND-14-6*pr.grow;
if(rand()<dt*46)spawnParts(1,pr.x+rnd(-R,R),GROUND-rnd(4,R),'#eaf7ff',130,.5,'chunk',200);
for(const m of [...mobs]){
if(pr.hit.has(m.id))continue;
if(Math.abs(m.x-pr.x)>R+m.w*.5)continue;
if(m.y<GROUND-R-20)continue;
pr.hit.add(m.id);
hitMob(m,pr.dmg,{dir:Math.sign(pr.vx)||1,wpn:true});
if(m.hp>0){m.slow=Math.max(m.slow,2.5);m.frostSt=(m.frostSt||0)+3;
if(m.type!=='boss'){const kr=Math.max(.15,1-(m.ctrlRes||0));m.vx=(Math.sign(pr.vx)||1)*440*kr;m.vy=-250*kr;}}
}
continue;
}
if(pr.type==='meteor'&&pr.y>=GROUND-4){
if(pr.meteorTrap){METEOR_TRAPS.push({x:pr.x,y:GROUND-8,dmg:pr.dmg+1,life:10});popup(pr.x,GROUND-42,'МЕТЕОРИТ-ЛОВУШКА','#ffd27a');}
else explode(pr.x,GROUND-6,pr.dmg+1);
pr.life=0;continue;}
for(const m of [...mobs]){
if(pr.hit&&pr.hit.has(m.id))continue;
if(m.type==='boss'&&m.evadeIframes>0)continue;
const hitR=pr.rad||6;
if(Math.abs(pr.x-m.x)<m.w/2+hitR&&pr.y>m.y-m.h-hitR&&pr.y<m.y+hitR){
if(pr.type==='fire'){explode(pr.x,pr.y,pr.dmg);pr.life=0;break;}
if(pr.type==='meteor'){explode(pr.x,pr.y,pr.dmg+1);pr.life=0;break;}
if(pr.hit)pr.hit.add(m.id);
const wasAlive=m.hp>0;
let impactDmg=pr.dmg;
if(pr.skullExec&&m.maxHp&&m.hp/m.maxHp<pr.skullExec.th)impactDmg*=pr.skullExec.mult;
hitMob(m,impactDmg,{dir:Math.sign(pr.vx)||1,wpn:!!pr.wpn,parried:!!pr.parried,fire:pr.type==='fire'||pr.type==='meteor'});
if(pr.type==='skull'||pr.type==='dragonskull'||pr.type==='mawskull')CTR.summonHits++;
if(wasAlive&&m.hp<=0&&pr.soulReturn){
souls+=2;runSouls+=2;CTR.devourKills=(CTR.devourKills||0)+1;
fxList.push({type:'soulreturn',a:{x:m.x,y:m.y-m.h*.5},b:{x:player.x,y:player.y-30},life:.55,max:.55});
if(pr.devourActive||CTR.devourKills%4===0){player.hp=Math.min(S.maxHp,player.hp+1);popup(player.x,player.y-62,'+1 ♥','#ff8ac8');}
}
if(pr.skullBounce>0){
let nb=null,nd=1e9;
for(const x of mobs){if(x.id===m.id||x.hp<=0)continue;const dd=Math.hypot(x.x-m.x,(x.y-x.h*.5)-(m.y-m.h*.5));if(dd<nd){nd=dd;nb=x;}}
if(nb){const an=Math.atan2((nb.y-nb.h*.5)-(m.y-m.h*.5),nb.x-m.x);
spawnSummonerSkull(m.x+Math.cos(an)*18,m.y-m.h*.5+Math.sin(an)*18,an,pr.dmg*.72,.82,{noDragon:true,bounce:pr.skullBounce-1,targetId:nb.id,col:'#8fe0ff'});
fxList.push({type:'choirnote',a:{x:m.x,y:m.y-m.h*.5},b:{x:nb.x,y:nb.y-nb.h*.5},life:.3,max:.3});}
}
/* ЭВОЛЮЦИИ: спец-флаги снарядов пробуждённого оружия */
FL.finish=false;
if(pr.onHitZap&&m.hp>0)chainAt(m,pr.dmg,2);
if(pr.onHitBurn&&m.hp>0){m.burnD=Math.max(m.burnD||0,1.4);m.burnT=3;}
if(pr.onHitFrost&&m.hp>0){m.slow=Math.max(m.slow,2);m.frostSt=(m.frostSt||0)+2;}
if(pr.onHitBleed&&m.hp>0){m.bleed=Math.min(6,(m.bleed||0)+pr.onHitBleed);m.bleedT=3;}
/* ЭВОЛЮЦИИ: самонаводящаяся стрела метит цель — следующее попадание сильнее */
if(pr.onHitMark&&m.hp>0&&!m.mark){m.mark=true;popup(m.x,m.y-m.h-16,'МЕТКА',pr.tcol||'#7dffc4');
spawnParts(4,m.x,m.y-m.h*.6,pr.tcol||'#7dffc4',110,.3,'spark',40);}
if(pr.wpn&&hasM('g_burst')&&WEAPONS[player.weapon].cat==='magic'&&!(curCfg()||{}).noArea){explode(pr.x,pr.y,pr.dmg*.5);}
if(pr.wpn&&hasM('g_dot')&&WEAPONS[player.weapon].cat==='magic'&&m.hp>0){m.poison=Math.max(m.poison,2);m.poisonT=4;}
if(pr.wpn&&hasM('g_chain')&&WEAPONS[player.weapon].cat==='magic'&&m.hp>0&&!(curCfg()||{}).noChain){CTR.magicChain=(CTR.magicChain||0)+1;
if(CTR.magicChain>=3){CTR.magicChain=0;chainAt(m,Math.max(.5,pr.dmg*.55),1);popup(m.x,m.y-m.h-18,'РЕЗОНАНС','#9db8ff');}}
if(pr.type==='ice'&&m.hp>0){m.slow=Math.max(m.slow,2);}
if(pr.type==='trident'&&!(m.type==='boss'&&m.kbBlock)){
const kd=Math.sign(pr.vx)||1;
m.vx=kd*430*Math.max(.15,1-(m.ctrlRes||0));
if(m.type!=='flyer'&&m.type!=='ghost'&&m.type!=='boss')m.vy=-280;
}
if(!pr.pierce){pr.life=0;break;}
}
}
if(pr.life<=0&&pr.type==='fire'){explode(pr.x,pr.y,pr.dmg);}
/* ЭВОЛЮЦИЯ: шаровая молния, догорев, разряжается цепью по ближайшему */
if(pr.life<=0&&pr.type==='ball'){
fxList.push({type:'blast',x:pr.x,y:pr.y,life:.25,max:.25});
spawnParts(10,pr.x,pr.y,pr.bcol||'#a9c4ff',220,.4,'spark',60);
let nb=null,nd=1e9;
for(const m of mobs){const d=Math.hypot(m.x-pr.x,(m.y-m.h*.5)-pr.y);if(d<150&&d<nd){nd=d;nb=m;}}
if(nb)chainAt(nb,Math.max(1,pr.dmg*.8),2);
}
}else{
if(!player.dead&&(player.parryWin>0||player.parry>0)&&Math.abs(pr.x-player.x)<42&&Math.abs(pr.y-(player.y-26))<48){
if(player.parryWin>0){
let tx=player.x+player.face*300,ty=player.y-30,bd=1e9;
for(const m of mobs){const d=Math.hypot(m.x-player.x,(m.y-m.h*.5)-(player.y-30));if(d<bd){bd=d;tx=m.x;ty=m.y-m.h*.5;}}
const ddx=tx-pr.x,ddy=ty-pr.y,L=Math.hypot(ddx,ddy)||1,sp=560;
pr.vx=ddx/L*sp;pr.vy=ddy/L*sp;
pr.friendly=true;pr.parried=true;pr.wpn=true;pr.dmg=6;pr.pierce=false;pr.hit=new Set();pr.life=Math.max(pr.life,1.8);
spawnParts(14,pr.x,pr.y,'#9ad0ff',280,.4,'spark',150);
popup(player.x,player.y-66,'ПАРИРОВАНИЕ!','#9ad0ff',true);
sfx.parry();addShake(5);hitStop=.07;
}else{
pr.life=0;
spawnParts(8,pr.x,pr.y,'#9ad0ff',200,.3,'spark',300);
popup(player.x,player.y-64,'БЛОК','#9ad0ff');
sfx.block();
}
}else if(!player.dead&&player.inv<=0&&Math.abs(pr.x-player.x)<16&&Math.abs(pr.y-(player.y-22))<26){
pr.life=0;
if(pr.type==='fireball')explodeEnemy(pr.x,pr.y);
if(pr.type==='harpoon'){
 const d2=Math.sign(pr.pullX-player.x)||1,dp=enemyDebuffPower();
 player.vx=d2*760*dp;player.vy=-200*dp;player.grounded=false;
popup(player.x,player.y-62,'ЗАЦЕПИЛ!','#ffd23f');
fxList.push({type:'zap',a:{x:pr.pullX,y:pr.pullY},b:{x:player.x,y:player.y-26},life:.25,max:.25});
addShake(4);
}
 damagePlayer(Math.sign(pr.vx)||1,null,pr.dmg||1,pr.rage,pr.boss,pr.mob,!!(pr.ability||pr.boss||pr.mob));
}
if(pr.y>GROUND+4){if(pr.type==='fireball')explodeEnemy(pr.x,GROUND);pr.life=0;}
}
}
projs=projs.filter(p=>p.life>0&&p.x>-60&&p.x<W+60&&p.y>-60);
}
function explode(x,y,dmg){
spawnParts(14,x,y,'#ff9d45',320,.5,'spark',300);
spawnParts(8,x,y,'#ffd23f',200,.4,'spark',200);
addShake(6);noiseS(.2,.25,500);
const radius=(curCfg()||{}).meteorShot?105:58;
for(const m of [...mobs]){
if(Math.hypot(m.x-x,(m.y-m.h/2)-y)<radius)hitMob(m,dmg,{dir:Math.sign(m.x-x)||1});
}
}
function explodeEnemy(x,y){
spawnParts(10,x,y,'#ff8a3d',240,.4,'spark',300);
}
