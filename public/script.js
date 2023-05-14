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

console.log(document.cookie)

//--------------------------------------------------
//          Game Object
//--------------------------------------------------

const game = {
              gameID : 0,
              playing : false,
              players : players,
              objects : objects,
              
              render: () => {
                clear();
                game.objects.forEach(Object => { draw3d(Object) })
              },

              collision: () => {
                { game.objects.forEach(Object => { if(!Object.isPlayer)  { CirclevsOBB(player, Object); } }) }
              },

              updatePlayers: () => { updatePlayerMovement() },

              orderObjects: () => { orderObjects() },

              drawEffects: () => {},


}

//--------------------------------------------------
//          Gameloop
//--------------------------------------------------

let oldDate, newDate, deltaT

function gameLoop() {
  requestAnimationFrame(gameLoop);

  if (oldDate === undefined) {
		oldDate = Date.now()
	}

	newDate = Date.now()

  deltaT = newDate - oldDate;


  if(game.playing) {

                  game.updatePlayers()  // Updates player positions client and server side.
                  game.collision()      // Checks for collisions between player and objects
                  game.orderObjects()   // Orders objects so that they render in the correct order
                  game.render()         // Renders objects
                
                  ctx.drawImage(
                    gun_sprite,
                    Math.floor(shoot_step) * 99.5,
                    0,
                    99.5,
                    138,
                    screenWidth / 2 - 60,
                    0,
                    120,
                    120
                  );
                
                  healthCount.innerHTML = `Health: ${player.health}`

                  // console.log(player.position.z) 

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
	oldDate = Date.now()
}

gameLoop();
