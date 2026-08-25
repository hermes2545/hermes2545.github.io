(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("overlay");
  const startButton = document.getElementById("startButton");
  const subtitle = document.getElementById("subtitle");
  const W = canvas.width;
  const H = canvas.height;
  const ASSET = "assets/";
  const keys = { left: false, right: false, fire: false };
  const images = {};
  const stars = Array.from({ length: 100 }, (_, i) => ({
    x: (i * 137.7) % W,
    y: (i * 83.3) % H,
    speed: 18 + (i % 4) * 13,
    size: 1 + (i % 3 === 0 ? 1 : 0)
  }));

  const fallbackLevels = [
    { MonsterGrid: [".gggggggggg.", "rrrrrrrrrrrr", "rrrrrrrrrrrr", ".bbbbbbbbbb.", "..bbbbbbbb.."], MonsterConfig: [
      { Name: "Red", Speed: 0.5, ScoreAward: 200, Weapon: 2, Health: 2 },
      { Name: "Green", Speed: 0.5, ScoreAward: 300, Weapon: 2.5, Health: 2 },
      { Name: "Blue", Speed: 0.5, ScoreAward: 100, Weapon: 0, Health: 2 }
    ]},
    { MonsterGrid: [".gggggggggggg.", "rrrrrrrrrrrrrr", "rrrrrrrrrrrrrr", ".bbbbbbbbbbbb.", "..bbbbbbbbbb.."], MonsterConfig: [
      { Name: "Red", Speed: 0.6, ScoreAward: 200, Weapon: 2, Health: 2 },
      { Name: "Green", Speed: 0.6, ScoreAward: 300, Weapon: 2.5, Health: 2 },
      { Name: "Blue", Speed: 0.6, ScoreAward: 100, Weapon: 0, Health: 2 }
    ]},
    { MonsterGrid: ["rrggggggggggrr", "rggrrrrrrrrggr", "rrrrrbbbbrrrrr", "bbbbbbbbbbbbbb", "rrbbbbbbbbbbrr"], MonsterConfig: [
      { Name: "Red", Speed: 0.8, ScoreAward: 200, Weapon: 2, Health: 2 },
      { Name: "Green", Speed: 0.7, ScoreAward: 300, Weapon: 2.5, Health: 2 },
      { Name: "Blue", Speed: 1, ScoreAward: 100, Weapon: 0, Health: 2 }
    ]}
  ];

  let levels = fallbackLevels;
  let shipConfig = { Lifes: 3, Speed: 7, ShootDelay: 0.3, Damage: 1.1 };
  let player;
  let enemies = [];
  let playerShots = [];
  let enemyShots = [];
  let particles = [];
  let score = 0;
  let highScore = Number(localStorage.getItem("galagaHighScore") || 0);
  let lives = 3;
  let wave = 1;
  let running = false;
  let pausedForWave = false;
  let formationTime = 0;
  let diveTimer = 2;
  let shotTimer = 1;
  let lastTime = 0;
  let animationId = 0;

  function loadImage(name) {
    const image = new Image();
    image.src = ASSET + name + ".png";
    images[name] = image;
  }
  ["Ship", "Red", "Green", "Blue", "RocketBlue", "RocketRed", "Explosion"].forEach(loadImage);

  async function loadConfigs() {
    try {
      const paths = ["configs/ConfigLevel00.json", "configs/ConfigLevel01.json", "configs/ConfigLevel03.json", "configs/ConfigShip.json"];
      const loaded = await Promise.all(paths.map(path => fetch(path).then(response => {
        if (!response.ok) throw new Error(path);
        return response.json();
      })));
      levels = loaded.slice(0, 3);
      shipConfig = loaded[3];
    } catch (error) {
      console.info("Using bundled config fallback.");
    }
  }
  loadConfigs();

  function resetPlayer() {
    player = {
      x: W / 2,
      y: H - 82,
      w: 42,
      h: 42,
      speed: shipConfig.Speed * 62,
      cooldown: 0,
      invincible: 1.6,
      alive: true
    };
  }

  function startGame() {
    cancelAnimationFrame(animationId);
    score = 0;
    wave = 1;
    lives = shipConfig.Lifes || 3;
    enemies = [];
    playerShots = [];
    enemyShots = [];
    particles = [];
    resetPlayer();
    running = true;
    pausedForWave = false;
    overlay.hidden = true;
    spawnWave();
    lastTime = performance.now();
    animationId = requestAnimationFrame(loop);
  }

  function spawnWave() {
    const level = levels[(wave - 1) % levels.length];
    const configs = Object.fromEntries(level.MonsterConfig.map(item => [item.Name.toLowerCase(), item]));
    const grid = level.MonsterGrid;
    const columns = Math.max(...grid.map(row => row.length));
    const gapX = Math.min(58, (W - 150) / columns);
    const startX = W / 2 - ((columns - 1) * gapX) / 2;
    enemies = [];
    grid.forEach((row, rowIndex) => {
      [...row].forEach((code, columnIndex) => {
        const type = ({ r: "Red", g: "Green", b: "Blue" })[code];
        if (!type) return;
        const config = configs[type.toLowerCase()];
        enemies.push({
          type,
          homeX: startX + columnIndex * gapX,
          homeY: 102 + rowIndex * 52,
          x: startX + columnIndex * gapX,
          y: -80 - rowIndex * 30 - columnIndex * 8,
          w: 38,
          h: 38,
          hp: config.Health,
          score: config.ScoreAward,
          weapon: config.Weapon,
          speed: config.Speed,
          phase: columnIndex * 0.45 + rowIndex,
          state: "entering",
          diveT: 0,
          startX: 0,
          startY: 0
        });
      });
    });
    formationTime = 0;
    diveTimer = Math.max(0.8, 2.7 - wave * 0.08);
    shotTimer = 1.1;
  }

  function firePlayer() {
    if (!player.alive || player.cooldown > 0) return;
    playerShots.push({ x: player.x, y: player.y - player.h / 2, w: 6, h: 18, vy: -670 });
    player.cooldown = shipConfig.ShootDelay || 0.3;
  }

  function enemyFire(enemy) {
    if (!enemy.weapon) return;
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const length = Math.hypot(dx, dy) || 1;
    const speed = 245 + wave * 9;
    enemyShots.push({ x: enemy.x, y: enemy.y + 16, w: 7, h: 16, vx: dx / length * speed, vy: dy / length * speed });
  }

  function hit(a, b) {
    return Math.abs(a.x - b.x) * 2 < a.w + b.w && Math.abs(a.y - b.y) * 2 < a.h + b.h;
  }

  function explode(x, y, color = "#ffcf33") {
    for (let i = 0; i < 13; i++) {
      const angle = Math.PI * 2 * i / 13;
      const speed = 45 + (i % 5) * 22;
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 0.5 + (i % 3) * 0.12, color });
    }
  }

  function damagePlayer() {
    if (!player.alive || player.invincible > 0) return;
    lives -= 1;
    explode(player.x, player.y, "#58e8ff");
    player.alive = false;
    enemyShots = [];
    if (lives <= 0) {
      endGame();
    } else {
      setTimeout(() => {
        if (!running) return;
        resetPlayer();
      }, 850);
    }
  }

  function endGame() {
    running = false;
    highScore = Math.max(highScore, score);
    localStorage.setItem("galagaHighScore", String(highScore));
    subtitle.textContent = `GAME OVER · SCORE ${score.toLocaleString()} · Press Start to try again`;
    startButton.textContent = "RESTART";
    overlay.hidden = false;
  }

  function update(dt) {
    stars.forEach(star => {
      star.y += star.speed * dt;
      if (star.y > H) { star.y = 0; star.x = (star.x + 193) % W; }
    });
    particles.forEach(particle => {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.life -= dt;
    });
    particles = particles.filter(particle => particle.life > 0);
    if (!running || pausedForWave) return;

    formationTime += dt;
    if (player.alive) {
      const direction = (keys.left ? -1 : 0) + (keys.right ? 1 : 0);
      player.x = Math.max(26, Math.min(W - 26, player.x + direction * player.speed * dt));
      player.cooldown -= dt;
      player.invincible -= dt;
      if (keys.fire) firePlayer();
    }

    playerShots.forEach(shot => shot.y += shot.vy * dt);
    enemyShots.forEach(shot => { shot.x += shot.vx * dt; shot.y += shot.vy * dt; });
    playerShots = playerShots.filter(shot => shot.y > -25);
    enemyShots = enemyShots.filter(shot => shot.y < H + 25 && shot.x > -25 && shot.x < W + 25);

    enemies.forEach(enemy => {
      if (enemy.state === "entering") {
        enemy.x += (enemy.homeX - enemy.x) * Math.min(1, dt * 2.5);
        enemy.y += (enemy.homeY - enemy.y) * Math.min(1, dt * 2.5);
        if (Math.abs(enemy.y - enemy.homeY) < 2) enemy.state = "formation";
      } else if (enemy.state === "formation") {
        enemy.x = enemy.homeX + Math.sin(formationTime * 1.45 + enemy.phase) * 18;
        enemy.y = enemy.homeY + Math.sin(formationTime * 2 + enemy.phase) * 4;
      } else {
        enemy.diveT += dt * (0.38 + enemy.speed * 0.12 + wave * 0.005);
        const t = enemy.diveT;
        enemy.x = enemy.startX + Math.sin(t * Math.PI * 2) * (150 + wave * 2) + (player.x - enemy.startX) * Math.min(1, t) * 0.35;
        enemy.y = enemy.startY + t * 520;
        if (enemy.y > H + 60) {
          enemy.state = "entering";
          enemy.y = -40;
          enemy.x = enemy.homeX;
          enemy.diveT = 0;
        }
      }
    });

    diveTimer -= dt;
    if (diveTimer <= 0) {
      const candidates = enemies.filter(enemy => enemy.state === "formation");
      if (candidates.length) {
        const enemy = candidates[Math.floor(Math.random() * candidates.length)];
        enemy.state = "diving";
        enemy.startX = enemy.x;
        enemy.startY = enemy.y;
        enemy.diveT = 0;
      }
      diveTimer = Math.max(0.65, 2.6 - wave * 0.09) + Math.random();
    }

    shotTimer -= dt;
    if (shotTimer <= 0 && player.alive) {
      const shooters = enemies.filter(enemy => enemy.weapon > 0 && enemy.y > 40 && enemy.y < H - 120);
      if (shooters.length) enemyFire(shooters[Math.floor(Math.random() * shooters.length)]);
      shotTimer = Math.max(0.45, 1.6 - wave * 0.055) + Math.random() * 0.5;
    }

    for (const shot of playerShots) {
      if (shot.dead) continue;
      for (const enemy of enemies) {
        if (enemy.dead || !hit(shot, enemy)) continue;
        shot.dead = true;
        enemy.hp -= shipConfig.Damage || 1.1;
        if (enemy.hp <= 0) {
          enemy.dead = true;
          score += enemy.score;
          highScore = Math.max(highScore, score);
          explode(enemy.x, enemy.y, enemy.type === "Green" ? "#55ff77" : enemy.type === "Red" ? "#ff455d" : "#45a7ff");
        }
        break;
      }
    }
    playerShots = playerShots.filter(shot => !shot.dead);
    enemies = enemies.filter(enemy => !enemy.dead);

    if (player.alive) {
      for (const shot of enemyShots) {
        if (hit(shot, player)) { shot.dead = true; damagePlayer(); break; }
      }
      for (const enemy of enemies) {
        if (hit(enemy, player)) { enemy.dead = true; explode(enemy.x, enemy.y); damagePlayer(); break; }
      }
    }
    enemyShots = enemyShots.filter(shot => !shot.dead);
    enemies = enemies.filter(enemy => !enemy.dead);

    if (enemies.length === 0 && !pausedForWave) {
      pausedForWave = true;
      wave += 1;
      enemyShots = [];
      setTimeout(() => {
        if (!running) return;
        pausedForWave = false;
        spawnWave();
      }, 1300);
    }
    window.__galagaState = { running, score, highScore, lives, wave, enemies: enemies.length, playerShots: playerShots.length, enemyShots: enemyShots.length, playerX: player ? Math.round(player.x) : null, playerY: player ? Math.round(player.y) : null, playerAlive: !!(player && player.alive), playerInvincible: player ? Number(player.invincible.toFixed(2)) : null };
  }

  function drawSprite(name, x, y, w, h, rotation = 0) {
    const image = images[name];
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.rotate(rotation);
    if (image && image.complete && image.naturalWidth) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, -w / 2, -h / 2, w, h);
    } else {
      ctx.fillStyle = name === "Ship" ? "#4ff" : name === "Red" ? "#f45" : name === "Green" ? "#5f7" : "#48f";
      ctx.fillRect(-w / 2, -h / 2, w, h);
    }
    ctx.restore();
  }

  function draw() {
    ctx.fillStyle = "#02030c";
    ctx.fillRect(0, 0, W, H);
    stars.forEach(star => {
      ctx.fillStyle = star.size > 1 ? "#94e8ff" : "#fff";
      ctx.globalAlpha = 0.45 + star.size * 0.2;
      ctx.fillRect(Math.round(star.x), Math.round(star.y), star.size, star.size);
    });
    ctx.globalAlpha = 1;

    ctx.font = "bold 22px 'Courier New', monospace";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#fff";
    ctx.fillText(`SCORE  ${String(score).padStart(6, "0")}`, 24, 18);
    ctx.textAlign = "center";
    ctx.fillStyle = "#ff4058";
    ctx.fillText(`HIGH  ${String(highScore).padStart(6, "0")}`, W / 2, 18);
    ctx.textAlign = "right";
    ctx.fillStyle = "#69efff";
    ctx.fillText(`WAVE ${wave}`, W - 24, 18);
    ctx.fillStyle = "#fff";
    ctx.fillText(`LIVES ${lives}`, W - 24, 48);
    ctx.textAlign = "left";

    enemies.forEach(enemy => {
      const rotation = enemy.state === "diving" ? Math.sin(enemy.diveT * Math.PI * 2) * 0.45 : 0;
      drawSprite(enemy.type, enemy.x, enemy.y, enemy.w, enemy.h, rotation);
    });
    playerShots.forEach(shot => drawSprite("RocketBlue", shot.x, shot.y, 10, 22));
    enemyShots.forEach(shot => drawSprite("RocketRed", shot.x, shot.y, 10, 22, Math.atan2(shot.vy, shot.vx) - Math.PI / 2));
    if (player && player.alive && (player.invincible <= 0 || Math.floor(player.invincible * 12) % 2 === 0)) {
      drawSprite("Ship", player.x, player.y, player.w, player.h);
    }
    particles.forEach(particle => {
      ctx.globalAlpha = Math.min(1, particle.life * 2);
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x - 3, particle.y - 3, 6, 6);
    });
    ctx.globalAlpha = 1;
    if (pausedForWave && running) {
      ctx.textAlign = "center";
      ctx.font = "bold 38px 'Courier New', monospace";
      ctx.fillStyle = "#fff";
      ctx.fillText(`WAVE ${wave}`, W / 2, H / 2);
      ctx.textAlign = "left";
    }
  }

  function loop(now) {
    const dt = Math.min(0.034, Math.max(0, (now - lastTime) / 1000));
    lastTime = now;
    update(dt);
    draw();
    if (running) animationId = requestAnimationFrame(loop);
  }

  function setKey(name, value) {
    if (name in keys) keys[name] = value;
  }
  const keyMap = { ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right", " ": "fire", Space: "fire", Spacebar: "fire" };
  addEventListener("keydown", event => {
    const name = keyMap[event.key] || keyMap[event.code];
    if (!name) return;
    event.preventDefault();
    setKey(name, true);
  });
  addEventListener("keyup", event => {
    const name = keyMap[event.key] || keyMap[event.code];
    if (!name) return;
    event.preventDefault();
    setKey(name, false);
  });
  addEventListener("blur", () => Object.keys(keys).forEach(name => setKey(name, false)));

  document.querySelectorAll("[data-key]").forEach(button => {
    const name = button.dataset.key;
    const press = event => { event.preventDefault(); setKey(name, true); };
    const release = event => { event.preventDefault(); setKey(name, false); };
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("pointerleave", release);
  });
  startButton.addEventListener("click", startGame);

  resetPlayer();
  draw();
  window.__galagaState = { running: false, score, highScore, lives, wave, enemies: 0, playerShots: 0, enemyShots: 0 };
  window.__galagaTest = { startGame, spawnWave, update, draw };
})();
