// new item({ x: 100, y: 100, z: 0 }, 20, animation_sheet);

let player = new Player(clientID);

new object(
  [
    [
      { x: -300, y: 300, z: 0 },
      { x: -300, y: -300, z: 0 },
    ],
    [
      { x: -300, y: -300, z: 0 },
      { x: 300, y: -300, z: 0 },
    ],
    [
      { x: 300, y: -300, z: 0 },
      { x: 300, y: 300, z: 0 },
    ],
    [
      { x: 300, y: 300, z: 0 },
      { x: -300, y: 300, z: 0 },
    ],
  ],
  { x: 0, y: 0, z: 0 },
  1
);

new object(
  [
    [
      { x: -300, y: 15, z: 0 },
      { x: -300, y: -15, z: 0 },
    ],
    [
      { x: -300, y: -15, z: 0 },
      { x: 300, y: -15, z: 0 },
    ],
    [
      { x: 300, y: -15, z: 0 },
      { x: 300, y: 15, z: 0 },
    ],
    [
      { x: 300, y: 15, z: 0 },
      { x: -300, y: 15, z: 0 },
    ],
  ],
  { x: 0, y: 300, z: 0 },
  100
);

function gameLoop() {
  requestAnimationFrame(gameLoop);
  updatePlayerMovement();
  clear();

  orderObjects();

  objects.forEach((Object) => {
    if (!Object.isPlayer && !(Object instanceof item)) {
      CirclevsOBB(player, Object);
    }
    draw3d(Object);
  });

  draw2d();

  ctx.drawImage(
    gun_sprite,
    Math.floor(shoot_step) * 99.5,
    0,
    99.5,
    138,
    screenWidth / 2 - 75,
    0,
    150,
    150
  );

  deltaMouse.x = 0;
  deltaMouse.y = 0;
  resetPlayerAnimation();

  if (justShot == true) {
    shoot_step += 0.2;
    if (shoot_step > 4) {
      shoot_step = 0;
      justShot = false;
    }
  }
}
function shoot() {
  if (!justShot) {
    console.log(raycast(player.position, player.rotation));
  }
  justShot = true;
}

gameLoop();
