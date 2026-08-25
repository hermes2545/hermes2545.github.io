(() => {
'use strict';
const canvas=document.getElementById('gameCanvas'),ctx=canvas.getContext('2d');
const W=960,H=640,HUD=54,T=38,COLS=25,ROWS=15;
const keys=new Set(),assets={};
['sprites','blocks','fuel-bar','fuel-indicator'].forEach(n=>{const i=new Image();i.src=`assets/${n}.png`;assets[n]=i;});
const layout=[
'#########################',
'#.....#.....#...........#',
'#.###.#.###.#.#######.#.#',
'#.#...#...#...#.....#.#.#',
'#.#.#####.#####.###.#.#.#',
'#.#.............#...#...#',
'#.####.###.###.##.#####.#',
'#......#....#...........#',
'###.####.###.####.#####.#',
'#...#.....#.....#.......#',
'#.###.####.####.#.#####.#',
'#.....#.......#.#.#.....#',
'#.#####.#####.#.#.#.###.#',
'#.......................#',
'#########################'];
let game,last=0,raf=0;
const dirs={up:{x:0,y:-1,a:-Math.PI/2},down:{x:0,y:1,a:Math.PI/2},left:{x:-1,y:0,a:Math.PI},right:{x:1,y:0,a:0}};
function road(c,r){return r>=0&&r<ROWS&&c>=0&&c<COLS&&layout[r][c]!== '#';}
function cell(c,r){return{x:c*T+T/2,y:HUD+r*T+T/2};}
function nearestRoad(x,y){return{c:Math.round((x-T/2)/T),r:Math.round((y-HUD-T/2)/T)};}
function makeCar(c,r,color,dir='right'){const p=cell(c,r);return{x:p.x,y:p.y,px:p.x,py:p.y,color,dir,next:dir,speed:0,angle:dirs[dir].a,stun:0};}
function buildFlags(stage){const spots=[];for(let r=1;r<ROWS-1;r++)for(let c=1;c<COLS-1;c++)if(road(c,r)&&(c+r*3+stage)%5===0)spots.push({...cell(c,r),special:false});
 spots.sort((a,b)=>Math.hypot(a.x-70,a.y-(HUD+T))-Math.hypot(b.x-70,b.y-(HUD+T)));spots.splice(0,2);return spots.slice(0,12+Math.min(stage,4)).map((f,i)=>({...f,special:i===spots.length%7}));}
function startGame(){
 cancelAnimationFrame(raf);game={score:0,lives:3,stage:1,fuel:100,state:'playing',message:'READY!',messageTime:1.4,smokeAmmo:3,smokes:[],flags:[],enemies:[],player:null};setupStage();last=performance.now();raf=requestAnimationFrame(loop);
}
function setupStage(){game.player=makeCar(1,13,'#ffe34d','right');game.flags=buildFlags(game.stage);game.smokes=[];game.smokeAmmo=3;game.fuel=100;game.enemies=[makeCar(23,1,'#ef3340','left'),makeCar(13,7,'#ff7a26','down')];if(game.stage>2)game.enemies.push(makeCar(5,5,'#ef3340','right'));game.state='playing';}
function canMove(car,d,dist){const nx=car.x+d.x*dist,ny=car.y+d.y*dist;const checks=[[nx-10,ny-10],[nx+10,ny-10],[nx-10,ny+10],[nx+10,ny+10]];return checks.every(([x,y])=>road(Math.floor(x/T),Math.floor((y-HUD)/T)));}
function atCenter(car){const q=nearestRoad(car.x,car.y),p=cell(q.c,q.r);return Math.abs(car.x-p.x)<4&&Math.abs(car.y-p.y)<4;}
function requestedDirection(){if(keys.has('ArrowUp')||keys.has('KeyW'))return'up';if(keys.has('ArrowDown')||keys.has('KeyS'))return'down';if(keys.has('ArrowLeft')||keys.has('KeyA'))return'left';if(keys.has('ArrowRight')||keys.has('KeyD'))return'right';return null;}
function drivePlayer(dt){const p=game.player,req=requestedDirection();if(req)p.next=req;if(atCenter(p)&&canMove(p,dirs[p.next],5))p.dir=p.next;const accelerating=!!req;p.speed=Math.max(0,Math.min(150,p.speed+(accelerating?240:-170)*dt));if(game.fuel<=0)p.speed=Math.min(p.speed,50);const d=dirs[p.dir];if(canMove(p,d,p.speed*dt)){p.x+=d.x*p.speed*dt;p.y+=d.y*p.speed*dt;}else p.speed=0;p.angle=d.a;}
function enemyChoices(e){const q=nearestRoad(e.x,e.y),back={up:'down',down:'up',left:'right',right:'left'}[e.dir];return Object.keys(dirs).filter(n=>n!==back&&road(q.c+dirs[n].x,q.r+dirs[n].y));}
function driveEnemies(dt){for(const e of game.enemies){if(e.stun>0){e.stun-=dt;continue;}if(atCenter(e)){const q=nearestRoad(e.x,e.y),p=cell(q.c,q.r);e.x=p.x;e.y=p.y;const choices=enemyChoices(e);choices.sort((a,b)=>{const da=Math.hypot(cell(q.c+dirs[a].x,q.r+dirs[a].y).x-game.player.x,cell(q.c+dirs[a].x,q.r+dirs[a].y).y-game.player.y);const db=Math.hypot(cell(q.c+dirs[b].x,q.r+dirs[b].y).x-game.player.x,cell(q.c+dirs[b].x,q.r+dirs[b].y).y-game.player.y);return da-db+(Math.random()-.5)*35;});if(choices.length)e.dir=choices[0];}const d=dirs[e.dir],speed=75+game.stage*8;if(canMove(e,d,speed*dt)){e.x+=d.x*speed*dt;e.y+=d.y*speed*dt;}else e.dir=Object.keys(dirs)[Math.floor(Math.random()*4)];e.angle=dirs[e.dir].a;}}
function dropSmoke(){if(!game||game.state!=='playing'||game.smokeAmmo<=0)return;const p=game.player,d=dirs[p.dir];game.smokes.push({x:p.x-d.x*25,y:p.y-d.y*25,life:5,r:8});game.smokeAmmo--;}
function crash(){if(game.state!=='playing')return;game.lives--;game.state='crashed';game.message=game.lives?'CRASH!':'GAME OVER';game.messageTime=1.7;game.player.speed=0;}
function update(dt){if(!game)return;if(game.state==='crashed'){game.messageTime-=dt;if(game.messageTime<=0){if(game.lives){const score=game.score,lives=game.lives,stage=game.stage;setupStage();game.score=score;game.lives=lives;game.stage=stage;}else game.state='over';}return;}if(game.state!=='playing')return;game.messageTime=Math.max(0,game.messageTime-dt);drivePlayer(dt);driveEnemies(dt);game.fuel=Math.max(0,game.fuel-dt*(1.25+game.player.speed/190));
 for(const s of game.smokes){s.life-=dt;s.r=Math.min(30,s.r+24*dt);for(const e of game.enemies)if(Math.hypot(e.x-s.x,e.y-s.y)<s.r+12)e.stun=Math.max(e.stun,1.2);}game.smokes=game.smokes.filter(s=>s.life>0);
 game.flags=game.flags.filter(f=>{if(Math.hypot(f.x-game.player.x,f.y-game.player.y)<20){game.score+=f.special?1000:200;game.fuel=Math.min(100,game.fuel+(f.special?18:5));return false;}return true;});
 if(!game.flags.length){game.score+=2000;game.stage++;game.message=`STAGE ${game.stage}`;setupStage();game.messageTime=1.5;}
 for(const e of game.enemies)if(e.stun<=0&&Math.hypot(e.x-game.player.x,e.y-game.player.y)<21)crash();if(game.fuel<=0&&game.player.speed<1)crash();}
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
function drawMaze(){ctx.fillStyle='#04143f';ctx.fillRect(0,HUD,W,H-HUD);for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(!road(c,r)){const x=c*T,y=HUD+r*T;ctx.fillStyle='#0d55bd';ctx.fillRect(x,y,T,T);ctx.strokeStyle='#58a7ff';ctx.lineWidth=2;ctx.strokeRect(x+2,y+2,T-4,T-4);ctx.fillStyle='#082c77';ctx.fillRect(x+8,y+8,T-16,T-16);}ctx.strokeStyle='#f7df38';ctx.setLineDash([5,10]);ctx.lineWidth=2;for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(road(c,r)){const p=cell(c,r);ctx.beginPath();ctx.moveTo(p.x-6,p.y);ctx.lineTo(p.x+6,p.y);ctx.stroke();}ctx.setLineDash([]);}
function drawCar(car,enemy=false){ctx.save();ctx.translate(car.x,car.y);ctx.rotate(car.angle);ctx.globalAlpha=car.stun>0?.55:1;ctx.fillStyle=car.color;roundRect(-15,-10,30,20,7);ctx.fill();ctx.fillStyle='#d9f4ff';ctx.fillRect(-3,-8,9,16);ctx.fillStyle='#111';ctx.fillRect(-10,-13,8,4);ctx.fillRect(5,-13,8,4);ctx.fillRect(-10,9,8,4);ctx.fillRect(5,9,8,4);ctx.fillStyle=enemy?'#fff':'#ed2224';ctx.fillRect(10,-5,5,10);ctx.restore();}
function drawFlag(f){ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(f.x-7,f.y+12);ctx.lineTo(f.x-7,f.y-12);ctx.stroke();ctx.fillStyle=f.special?'#ff4b58':'#ffe33a';ctx.beginPath();ctx.moveTo(f.x-6,f.y-12);ctx.lineTo(f.x+10,f.y-6);ctx.lineTo(f.x-6,f.y);ctx.fill();}
function drawHud(){ctx.fillStyle='#020613';ctx.fillRect(0,0,W,HUD);ctx.fillStyle='#fff';ctx.font='bold 18px monospace';ctx.fillText(`SCORE ${String(game.score).padStart(6,'0')}`,18,23);ctx.fillText(`LIVES ${game.lives}`,18,46);ctx.textAlign='center';ctx.fillStyle='#ffe548';ctx.fillText(`STAGE ${game.stage}  FLAGS ${game.flags.length}`,W/2,32);ctx.textAlign='left';ctx.fillStyle='#fff';ctx.fillText(`SMOKE ${'●'.repeat(game.smokeAmmo)}${'○'.repeat(3-game.smokeAmmo)}`,680,22);ctx.fillText('FUEL',680,45);ctx.fillStyle='#35101a';ctx.fillRect(744,31,190,16);ctx.fillStyle=game.fuel<25?'#ff334d':'#38e76f';ctx.fillRect(747,34,184*game.fuel/100,10);ctx.strokeStyle='#fff';ctx.strokeRect(744,31,190,16);}
function draw(){if(!game)return;drawMaze();for(const f of game.flags)drawFlag(f);for(const s of game.smokes){ctx.fillStyle=`rgba(220,235,255,${Math.min(.55,s.life/4)})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();}drawCar(game.player);for(const e of game.enemies)drawCar(e,true);drawHud();if(game.messageTime>0||game.state==='over'){ctx.fillStyle='#000b';ctx.fillRect(270,260,420,110);ctx.strokeStyle='#ffe548';ctx.lineWidth=4;ctx.strokeRect(270,260,420,110);ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 42px monospace';ctx.fillText(game.message,W/2,327);ctx.textAlign='left';}if(game.state==='over'){ctx.textAlign='center';ctx.font='18px monospace';ctx.fillStyle='#ffe548';ctx.fillText('กด ENTER หรือแตะจอเพื่อเริ่มใหม่',W/2,356);ctx.textAlign='left';}}
function loop(now){const dt=Math.min(.04,(now-last)/1000||0);last=now;update(dt);draw();raf=requestAnimationFrame(loop);}
function setKey(code,on){if(on){if(code==='Space'&&!keys.has('Space'))dropSmoke();keys.add(code);}else keys.delete(code);}
addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(e.code==='Enter'&&game?.state==='over')startGame();setKey(e.code,true);});addEventListener('keyup',e=>setKey(e.code,false));
document.querySelectorAll('[data-key]').forEach(b=>{const code=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);setKey(code,true);});for(const ev of ['pointerup','pointercancel','pointerleave'])b.addEventListener(ev,()=>setKey(code,false));});
canvas.addEventListener('pointerdown',()=>{if(game?.state==='over')startGame();});document.addEventListener('visibilitychange',()=>{if(document.hidden)keys.clear();});startGame();
})();
