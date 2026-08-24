/* ================= ЗВУК ================= */
let AC=null,noiseB=null;
function initAudio(){
if(AC){if(AC.state==='suspended')AC.resume();return;}
try{
AC=new (window.AudioContext||window.webkitAudioContext)();
const n=AC.sampleRate*.3;noiseB=AC.createBuffer(1,n,AC.sampleRate);
const d=noiseB.getChannelData(0);for(let i=0;i<n;i++)d[i]=rand()*2-1;
}catch(e){}
}
function tone(f0,f1,dur,type,vol){
if(!AC)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();
o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(f1,1),t+dur);
g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+dur+.02);
}
function noiseS(dur,vol,freq){
if(!AC||!noiseB)return;const t=AC.currentTime,s=AC.createBufferSource();s.buffer=noiseB;s.loop=true;
const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=freq;f.Q.value=.8;
const g=AC.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
s.connect(f);f.connect(g);g.connect(AC.destination);s.start(t);s.stop(t+dur+.02);
}
const sfx={
jump(){tone(170,330,.13,'square',.07)},
djump(){tone(240,480,.14,'square',.08)},
roll(){tone(200,360,.15,'triangle',.09);noiseS(.08,.08,900)},
swing(){noiseS(.1,.14,2600)},
shoot(){tone(500,220,.08,'triangle',.1);noiseS(.05,.1,3000)},
cast(){tone(300,900,.16,'sine',.1)},
zap(){noiseS(.16,.22,1800);tone(900,180,.14,'sawtooth',.08)},
hit(){tone(210,70,.09,'square',.14);noiseS(.06,.18,1400)},
kill(){tone(330,45,.3,'sawtooth',.12);noiseS(.2,.16,600)},
hurt(){tone(150,55,.32,'sawtooth',.16)},
block(){tone(320,210,.09,'square',.12)},
parry(){tone(1250,480,.11,'triangle',.14);noiseS(.05,.12,3200)},
throw(){tone(400,160,.12,'triangle',.1)},
reward(){tone(392,392,.1,'triangle',.1);setTimeout(()=>tone(523,523,.16,'triangle',.1),110)},
wave(){tone(330,330,.09,'square',.08);setTimeout(()=>tone(494,494,.14,'square',.08),100)},
boss(){tone(70,45,.6,'sawtooth',.18)}
};
