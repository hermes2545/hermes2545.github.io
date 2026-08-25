"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height, TILE = 16;
const DIRS = { up:{x:0,y:-1,a:-Math.PI/2}, down:{x:0,y:1,a:Math.PI/2}, left:{x:-1,y:0,a:Math.PI}, right:{x:1,y:0,a:0} };
const FALLBACK_LEVEL = `..........................
..........................
..##..##..##..##..##..##..
..##..##..##..##..##..##..
..##..##..##..##..##..##..
..##..##..##..##..##..##..
..##..##..##@@##..##..##..
..##..##..##@@##..##..##..
..##..##..##..##..##..##..
..##..##..........##..##..
..##..##..........##..##..
..........##..##..........
..........##..##..........
##..####..........####..##
@@..####..........####..@@
..........##..##..........
..........######..........
..##..##..######..##..##..
..##..##..##..##..##..##..
..##..##..##..##..##..##..
..##..##..##..##..##..##..
..##..##..........##..##..
..##..##..........##..##..
..##..##...####...##..##..
...........#..#...........
...........#..#...........`;

let tiles=[], player=null, enemies=[], bullets=[], particles=[];
let score=0, lives=3, running=false, gameOver=false, levelLoaded=false;
let agentEnabled=false, soundEnabled=true, lastTime=0, enemyTimer=0, spawnLeft=14, baseAlive=true;
const keys = new Set();
const sounds = Object.fromEntries(["fire","explosion","brick","steel","gamestart","gameover"].map(n => [n,new Audio(`sounds/${n}.ogg`)]));

function playSound(name){ if(!soundEnabled || !sounds[name]) return; const s=sounds[name].cloneNode(); s.volume=.35; s.play().catch(()=>{}); }
function parseLevel(text){
  const rows=text.trim().split(/\r?\n/).slice(0,26);
  tiles=[];
  rows.forEach((row,y)=>[...row.slice(0,26)].forEach((ch,x)=>{ if(ch==="#"||ch==="@") tiles.push({x:x*TILE,y:y*TILE,w:TILE,h:TILE,type:ch==="#"?"brick":"steel",hp:ch==="#"?1:99}); }));
  levelLoaded=true;
}
async function loadLevel(){
  try{ const r=await fetch("levels/1.txt"); if(!r.ok) throw Error(r.status); parseLevel(await r.text()); }
  catch(_){ parseLevel(FALLBACK_LEVEL); }
}
function tank(x,y,color,isEnemy=false){ return {x,y,w:22,h:22,color,isEnemy,dir:isEnemy?"down":"up",speed:isEnemy?55:82,cooldown:0,think:0}; }
function resetRound(){
  parseLevel(FALLBACK_LEVEL); player=tank(128,386,"#f5d142"); enemies=[]; bullets=[]; particles=[]; enemyTimer=.3; spawnLeft=14; baseAlive=true;
}
function startGame(){
  score=0; lives=3; gameOver=false; running=true; resetRound();
  document.getElementById("overlay").hidden=true; updateHud(); playSound("gamestart"); lastTime=performance.now();
}
function toggleAgent(force){
  agentEnabled=typeof force==="boolean"?force:!agentEnabled;
  const b=document.getElementById("agentToggle"); b.classList.toggle("active",agentEnabled); b.setAttribute("aria-pressed",String(agentEnabled)); b.textContent=agentEnabled?"🤖 AI Autopilot: ON":"🤖 เปิด AI Autopilot"; updateHud();
}
function updateHud(){
  document.getElementById("score").textContent=score; document.getElementById("lives").textContent=lives; document.getElementById("enemies").textContent=enemies.length+spawnLeft; document.getElementById("mode").textContent=agentEnabled?"AI":"MANUAL";
}
function rectHit(a,b,pad=0){ return a.x+pad<b.x+b.w && a.x+a.w-pad>b.x && a.y+pad<b.y+b.h && a.y+a.h-pad>b.y; }
function blocked(t,nx,ny){
  const r={x:nx,y:ny,w:t.w,h:t.h};
  if(nx<0||ny<0||nx+t.w>W||ny+t.h>H) return true;
  if(tiles.some(q=>rectHit(r,q,2))) return true;
  const others=[player,...enemies].filter(o=>o&&o!==t); return others.some(o=>rectHit(r,o,3));
}
function moveTank(t,dir,dt){ const d=DIRS[dir]; if(!d)return; t.dir=dir; const dist=t.speed*dt, nx=t.x+d.x*dist, ny=t.y+d.y*dist; if(!blocked(t,nx,ny)){t.x=nx;t.y=ny;} }
function shoot(t){
  if(!t||t.cooldown>0)return; const d=DIRS[t.dir]; bullets.push({x:t.x+t.w/2-3+d.x*12,y:t.y+t.h/2-3+d.y*12,w:6,h:6,vx:d.x*220,vy:d.y*220,enemy:t.isEnemy}); t.cooldown=t.isEnemy?.9:.38; playSound("fire");
}
function nearestEnemy(){ return enemies.reduce((best,e)=>!best||Math.hypot(e.x-player.x,e.y-player.y)<Math.hypot(best.x-player.x,best.y-player.y)?e:best,null); }
function agentControl(dt){
  if(!player)return; const e=nearestEnemy(); if(!e){moveTank(player,"up",dt);return;}
  const dx=e.x-player.x, dy=e.y-player.y, alignedX=Math.abs(dx)<20, alignedY=Math.abs(dy)<20;
  if(alignedX){ player.dir=dy<0?"up":"down"; shoot(player); if(Math.random()<.08) moveTank(player,dx>0?"right":"left",dt); }
  else if(alignedY){ player.dir=dx<0?"left":"right"; shoot(player); }
  else { const prefer=Math.abs(dx)>Math.abs(dy)?(dx<0?"left":"right"):(dy<0?"up":"down"); const ox=player.x,oy=player.y; moveTank(player,prefer,dt); if(player.x===ox&&player.y===oy) moveTank(player,prefer==="left"||prefer==="right"?(dy<0?"up":"down"):(dx<0?"left":"right"),dt); if(player.cooldown<=0&&Math.random()<.06)shoot(player); }
}
function spawnEnemy(){
  const spots=[8,197,386]; for(let i=0;i<3;i++){ const x=spots[(Math.random()*spots.length)|0]; const e=tank(x,4,["#f05b4f","#db8b2b","#b65cf0"][(Math.random()*3)|0],true); if(!blocked(e,e.x,e.y)){enemies.push(e);spawnLeft--;break;} }
}
function explode(x,y,color="#ffb52e"){ for(let i=0;i<12;i++)particles.push({x,y,vx:(Math.random()-.5)*130,vy:(Math.random()-.5)*130,life:.5,color}); playSound("explosion"); }
function loseLife(){
  explode(player.x+11,player.y+11); lives--; bullets=bullets.filter(b=>b.enemy===false); if(lives<=0){finish(false);return;} player=tank(128,386,"#f5d142"); updateHud();
}
function finish(win){
  running=false;gameOver=true; if(!win)playSound("gameover"); const ov=document.getElementById("overlay"); ov.hidden=false; document.getElementById("message").textContent=win?"MISSION COMPLETE":"GAME OVER"; document.getElementById("submessage").textContent=win?`ฐานปลอดภัย! คะแนน ${score}`:`คะแนน ${score} — ลองใหม่อีกครั้ง`; document.getElementById("startButton").textContent="เล่นอีกครั้ง";
}
function update(dt){
  if(!running)return;
  if(player.cooldown>0)player.cooldown-=dt;
  if(agentEnabled)agentControl(dt); else { const map={ArrowUp:"up",KeyW:"up",ArrowDown:"down",KeyS:"down",ArrowLeft:"left",KeyA:"left",ArrowRight:"right",KeyD:"right"}; for(const k of keys)if(map[k]){moveTank(player,map[k],dt);break;} if(keys.has("Space"))shoot(player); }
  enemyTimer-=dt; if(spawnLeft>0&&enemies.length<4&&enemyTimer<=0){spawnEnemy();enemyTimer=1.6;}
  for(const e of enemies){ e.cooldown-=dt;e.think-=dt;if(e.think<=0){ const toward=Math.random()<.42?(Math.abs(208-e.x)>Math.abs(392-e.y)?(208<e.x?"left":"right"):"down"):["up","down","left","right"][(Math.random()*4)|0];e.dir=toward;e.think=.35+Math.random()*1.1;} const ox=e.x,oy=e.y;moveTank(e,e.dir,dt);if(e.x===ox&&e.y===oy)e.think=0;if(Math.random()<dt*.75)shoot(e); }
  for(const b of bullets){b.x+=b.vx*dt;b.y+=b.vy*dt;}
  for(let i=bullets.length-1;i>=0;i--){ const b=bullets[i]; if(b.x<-8||b.y<-8||b.x>W||b.y>H){bullets.splice(i,1);continue;} const ti=tiles.findIndex(t=>rectHit(b,t)); if(ti>=0){const t=tiles[ti];bullets.splice(i,1);if(t.type==="brick"){tiles.splice(ti,1);playSound("brick");}else playSound("steel");continue;} const base={x:192,y:384,w:32,h:32};if(baseAlive&&rectHit(b,base)){bullets.splice(i,1);baseAlive=false;explode(208,400);finish(false);break;} if(b.enemy&&player&&rectHit(b,player,3)){bullets.splice(i,1);loseLife();continue;} if(!b.enemy){const ei=enemies.findIndex(e=>rectHit(b,e,3));if(ei>=0){const e=enemies[ei];bullets.splice(i,1);enemies.splice(ei,1);score+=100;explode(e.x+11,e.y+11,e.color);updateHud();}} }
  for(let i=bullets.length-1;i>=0;i--)for(let j=i-1;j>=0;j--)if(bullets[i].enemy!==bullets[j].enemy&&rectHit(bullets[i],bullets[j])){bullets.splice(i,1);bullets.splice(j,1);i--;break;}
  particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;});particles=particles.filter(p=>p.life>0);
  if(spawnLeft===0&&enemies.length===0)finish(true); updateHud();
}
function drawTank(t){
  ctx.save();ctx.translate(Math.round(t.x+t.w/2),Math.round(t.y+t.h/2));ctx.rotate(DIRS[t.dir].a);ctx.fillStyle="#20252b";ctx.fillRect(-11,-11,22,5);ctx.fillRect(-11,6,22,5);ctx.fillStyle=t.color;ctx.fillRect(-8,-8,16,16);ctx.fillStyle="#111";ctx.fillRect(-3,-4,7,8);ctx.fillStyle=t.color;ctx.fillRect(2,-2,13,4);ctx.restore();
}
function draw(){
  ctx.fillStyle="#050505";ctx.fillRect(0,0,W,H);ctx.strokeStyle="#111";ctx.lineWidth=1;for(let i=0;i<=W;i+=TILE){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,H);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(W,i);ctx.stroke();}
  for(const t of tiles){if(t.type==="brick"){ctx.fillStyle="#a94728";ctx.fillRect(t.x,t.y,16,16);ctx.strokeStyle="#e27b4c";ctx.strokeRect(t.x+.5,t.y+.5,15,7);ctx.strokeRect(t.x+4.5,t.y+8.5,11,7);}else{const g=ctx.createLinearGradient(t.x,t.y,t.x+16,t.y+16);g.addColorStop(0,"#eee");g.addColorStop(.45,"#777");g.addColorStop(1,"#ddd");ctx.fillStyle=g;ctx.fillRect(t.x,t.y,16,16);ctx.strokeStyle="#333";ctx.strokeRect(t.x+.5,t.y+.5,15,15);}}
  ctx.fillStyle=baseAlive?"#d9a72e":"#56352d";ctx.fillRect(193,385,30,30);ctx.fillStyle="#111";ctx.beginPath();ctx.moveTo(208,389);ctx.lineTo(213,398);ctx.lineTo(221,400);ctx.lineTo(215,405);ctx.lineTo(216,412);ctx.lineTo(208,408);ctx.lineTo(200,412);ctx.lineTo(201,405);ctx.lineTo(195,400);ctx.lineTo(203,398);ctx.closePath();ctx.fill();
  if(player)drawTank(player);enemies.forEach(drawTank);for(const b of bullets){ctx.fillStyle=b.enemy?"#ff715b":"#fff6a6";ctx.beginPath();ctx.arc(b.x+3,b.y+3,3,0,Math.PI*2);ctx.fill();}for(const p of particles){ctx.globalAlpha=Math.max(0,p.life*2);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,4,4);}ctx.globalAlpha=1;
  if(agentEnabled&&running){ctx.fillStyle="#20d879";ctx.font="bold 12px monospace";ctx.fillText("AI ●",8,15);}
}
function loop(now){const dt=Math.min(.033,(now-lastTime)/1000||0);lastTime=now;update(dt);draw();requestAnimationFrame(loop);}

document.addEventListener("keydown",e=>{if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(e.code))e.preventDefault();keys.add(e.code);});
document.addEventListener("keyup",e=>keys.delete(e.code));
document.getElementById("startButton").addEventListener("click",startGame);document.getElementById("restartButton").addEventListener("click",startGame);document.getElementById("agentToggle").addEventListener("click",()=>toggleAgent());document.getElementById("soundToggle").addEventListener("click",e=>{soundEnabled=!soundEnabled;e.currentTarget.textContent=soundEnabled?"🔊 เสียง":"🔇 ปิดเสียง";e.currentTarget.setAttribute("aria-pressed",String(soundEnabled));});
document.querySelectorAll("[data-key]").forEach(b=>{const key=b.dataset.key;const down=e=>{e.preventDefault();keys.add(key);if(key==="Space"&&running&&!agentEnabled)shoot(player);};const up=e=>{e.preventDefault();keys.delete(key);};b.addEventListener("pointerdown",down);b.addEventListener("pointerup",up);b.addEventListener("pointercancel",up);b.addEventListener("pointerleave",up);});
loadLevel().finally(()=>{draw();requestAnimationFrame(loop);});
