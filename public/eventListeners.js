document.addEventListener("mousemove", function (e) {
  deltaMouse.x = e.movementX;
  deltaMouse.y = e.movementY;
  updatePlayerPosition();
});

document.body.addEventListener("keydown", function (e) {
  keys[e.key] = true;
});
document.body.addEventListener("keyup", function (e) {
  keys[e.key] = false;
});

canvas.addEventListener("click", async () => {
  await canvas.requestPointerLock();
});

document.addEventListener("mousedown", function () {
  shoot();
});
