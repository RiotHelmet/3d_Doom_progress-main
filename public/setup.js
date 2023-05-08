canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas_2d = document.getElementById("canvas_2D_map");
ctx_2d = canvas_2d.getContext("2d");
ctx.imageSmoothingEnabled = false;

ctx_2d.translate(canvas_2d.width / 2, canvas_2d.height / 2);

ctx.transform(1, 0, 0, -1, 0, canvas.height);

let objects = [];
let players = [];

keys = [];

screenWidth = canvas.width;
screenHeight = canvas.height;

mapScale = 10;

deltaMouse = { x: 0, y: 0 };

shoot_step = 0;
justShot = false;
