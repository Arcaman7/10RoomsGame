/* ================= ВВОД ================= */
addEventListener('keydown',e=>{
const c=e.code;
if(e.target&&e.target.matches('input,textarea,[contenteditable="true"]')){
if(c==='Enter'){e.preventDefault();e.target.blur();}
return;
}
if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(c))e.preventDefault();
if(keys[c])return void(keys[c]=true);
keys[c]=true;initAudio();
/* КУВЫРОК: режим «двойное нажатие» */
if(state==='playing'&&!paused&&(c==='KeyA'||c==='KeyD')&&META.rollKey!=='ctrl'){
if(time-tapMemo[c]<.28)tryStrafe(c==='KeyA'?-1:1);
tapMemo[c]=time;
}
/* КУВЫРОК: режим «CTRL» */
if(state==='playing'&&!paused&&(c==='ControlLeft'||c==='ControlRight')&&META.rollKey==='ctrl'){
tryStrafe(keys.KeyA?-1:(keys.KeyD?1:player.face));
}
/* Открытый кодекс перехватывает ввод и в меню, и во время паузы. */
if(helpOpen){
if(c==='Escape'||c==='Enter'||c==='Space'){closeHelp();return;}
return;
}
if(codexOpen){
if(c==='KeyC'||c==='Escape'||c==='Enter'||c==='Space'){closeCodex();return;}
return;
}
if(journeyLoading)return;
if(state==='menu'){
if(c==='KeyC'){openCodex();return;}
if(c==='Space'||c==='Enter'){beginJourney();return;}
}
if((state==='over'||state==='win')&&(c==='Space'||c==='Enter'||c==='KeyR')){backToMenu();return;}
if(c==='KeyR'&&state==='playing'){backToMenu();return;}
if(c==='KeyP'&&state==='playing'){togglePause();return;}
if(c==='KeyC'&&state==='playing'&&paused){openCodex();return;}
if(state==='reward'){
if(c==='Enter')confirmReward(false);
else if(c==='KeyR')doReroll();
else if(c==='KeyS')confirmReward(true);
return;
}
if(state==='site'){if(c==='Enter')leaveSite();return;}
if(state==='map')return;
if(state!=='playing'||paused)return;
if(c==='Space'||c==='KeyW'||c==='ArrowUp')player.jbuf=.12;
if(c==='ShiftLeft'||c==='ShiftRight'||c==='KeyQ')tryParry();
});
addEventListener('keyup',e=>keys[e.code]=false);
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;});
$('stage').addEventListener('pointermove',updMouse);
$('stage').addEventListener('mousedown',e=>{
initAudio();
if(TOUCH)return;
updMouse(e);
if(state==='playing'&&!paused&&e.button===0){holdAtk=true;attack();}
if(state==='playing'&&!paused&&e.button===2)tryAlt();
});
addEventListener('mouseup',e=>{if(e.button===0)holdAtk=false;});
addEventListener('blur',()=>{holdAtk=false;});
document.addEventListener('visibilitychange',()=>{
if(document.hidden){holdAtk=false;for(const k in keys)keys[k]=false;
document.querySelectorAll('.tbtn.act').forEach(e=>e.classList.remove('act'));}
last=performance.now();
});
$('stage').addEventListener('contextmenu',e=>e.preventDefault());
$('btnRestart').addEventListener('click',backToMenu);
$('btnWinRestart').addEventListener('click',backToMenu);
$('btnNext').addEventListener('click',()=>confirmReward(false));
$('btnSkip').addEventListener('click',()=>confirmReward(true));
$('btnReroll').addEventListener('click',doReroll);
$('btnSiteLeave').addEventListener('click',leaveSite);
$('btnEndless').addEventListener('click',goEndless);
$('btnStart').addEventListener('click',beginJourney);
$('btnHelp').addEventListener('click',openHelp);
$('btnHelpClose').addEventListener('click',closeHelp);
$('btnCodex').addEventListener('click',openCodex);      /* НОВОЕ */
$('btnPauseCodex').addEventListener('click',e=>{e.stopPropagation();if(state==='playing'&&paused)openCodex();});
$('btnCodexClose').addEventListener('click',closeCodex); /* НОВОЕ */
$('btnResume').addEventListener('click',e=>{e.stopPropagation();if(state==='playing')setPaused(false);});
$('pauseOv').addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;if(state==='playing'&&paused)setPaused(false);});
cvs.addEventListener('contextmenu',e=>e.preventDefault());
