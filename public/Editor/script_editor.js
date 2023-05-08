canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

let mousePos = { x: 0, y: 0 };

screenWidth = canvas.width;
screenHeight = canvas.height;

document.addEventListener("mousemove", function (e) {
  mousePos.x = e.offsetX;
  mousePos.y = e.offsetY;
});

function clear() {
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fill();
}

let points = [];

class point {
  x;
  y;
  constructor(x, y) {
    this.x = x;
    this.y = y;
    points.push(this);
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    if (points[points.indexOf(this) + 1]) {
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        points[points.indexOf(this) + 1].x,
        points[points.indexOf(this) + 1].y
      );
      ctx.stroke();
    }
  }
}

document.addEventListener("mousedown", function (e) {
  console.log(
    Math.round(mousePos.x / 10) * 10,
    Math.round(mousePos.y / 10) * 10
  );
  new point(Math.round(mousePos.x / 10) * 10, Math.round(mousePos.y / 10) * 10);
});

document.addEventListener("keydown", function (e) {
  if (e.key == "z") {
    points.splice(points.length - 1, 1);
  }
});

function drawGrid(w, h, step) {
  ctx.beginPath();
  for (var x = 0; x <= w; x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  ctx.strokeStyle = "rgb(255,0,0)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  for (var y = 0; y <= h; y += step) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.strokeStyle = "rgb(20,20,20)";

  ctx.stroke();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  clear();
  drawGrid(1000, 750, 50);
  points.forEach((Obj) => {
    Obj.draw();
  });
}
gameLoop();
