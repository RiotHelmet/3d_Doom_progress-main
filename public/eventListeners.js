canvas.addEventListener("mousemove", function (e) {
  deltaMouse.x = e.movementX;
  deltaMouse.y = e.movementY;
  if(game.playing) {
    updatePlayerPosition();
  }
});

document.addEventListener("keydown", function (e) {
  keys[e.key] = true;
});
document.addEventListener("keyup", function (e) {
  keys[e.key] = false;
});

document.addEventListener("keydown", function (e) {
  if(e.key == "Escape") {
    console.log(settingsMenu.style.display)
    if(settingsMenu.style.display == "none") {
      settingsMenu.style.display = "flex"
    } else {
      settingsMenu.style.display = "none"
    }
  }
});

canvas.addEventListener("click", async () => {
  await canvas.requestPointerLock();
});

canvas.addEventListener("mousedown", function () {
  player.shoot();
});
