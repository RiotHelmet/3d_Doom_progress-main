canvas_editor = document.getElementById("canvas_editor");
ctx_editor = canvas_editor.getContext("2d");

// canvas_editor_2 = document.getElementById("display_canvas_editor");
// ctx_editor_2 = canvas_editor_2.getContext("2d");



ctx_editor.transform(1, 0, 0, -1, 0, canvas_editor.height);

ctx_editor.translate(canvas_editor.width / 2, canvas_editor.height / 2);

let mousePos = { x: 0, y: 0 };
let cameraPosition = { x: 0, y: 0 }

screenWidth = canvas_editor.width;
screenHeight = canvas_editor.height;
let keys = []

let height = 20
let displayObject
let objects = []
let images = []

let currentStyle = "select"

function degToRad(deg) {
  return (deg / 180) * Math.PI;
}



//----------------- Event Listeners ---------------- //

document.getElementById("uploader").addEventListener("change", uploadFile)

function uploadFile(event) {
  event.preventDefault()
  uploadedFile = document.getElementById("uploader").files[0]
  const img = new Image();
  img.src = URL.createObjectURL(uploadedFile)
  img.onload = ()=> {
    images.push(new IMAGE(img, { x : 0, y : 0}, { x : 100, y : 100}))
  }

  document.getElementById("imageUploaderBackground").style.display = "none"

}

document.addEventListener("mouseup", function (e) {
  mouseDown = false
});


document.addEventListener("keydown", function (e) {
  if (e.key == "z") {
    points.splice(points.length - 1, 1);
  }
});

document.addEventListener("keydown", function (e) {

  if(e.key == "h") {
    translation = { x : (mousePos.x - cameraPosition.x), y : (mousePos.y - cameraPosition.y)}
    ctx_editor.setTransform(1, 0, 0, 1, 0, 0)
    ctx_editor.translate((mousePos.x - cameraPosition.x), (mousePos.y - cameraPosition.y));
  }

  if(e.key == "Control") {
    canvas_editor.style.cursor = "grab";
  }

  keys[e.key] = true;
});
document.addEventListener("keyup", function (e) {

  if(e.key == "Control") {
    canvas_editor.style.cursor = "default";
    bool = true
    oldCameraPosition = { x: 0, y: 0}
  }

  keys[e.key] = false;
});

oldCameraPosition = { x: 0, y: 0}

document.addEventListener("mousemove", function (e) {


  if(keys["Control"] && mouseDown) {

    cameraPosition.x = (mousePos.x - oldCameraPosition.x)
    cameraPosition.y = (mousePos.y - oldCameraPosition.y) 

  }

  mousePos.x = e.offsetX - canvas_editor.width / 2
  mousePos.y = -e.offsetY + canvas_editor.height / 2


});
document.addEventListener("wheel", function (e) {
  if(mouseZoom => 0.1 && mouseZoom <= 1) {
     mouseZoom -= e.deltaY / 2000 
  }

  if(mouseZoom < 0.15) {
    mouseZoom = 0.15
  } else if(mouseZoom > 1) {
    mouseZoom = 1
  }
})

mouseDown = false

canvas_editor.addEventListener("mousedown", function (e) {

  mouseDown = true

  oldCameraPosition.x = (-cameraPosition.x + mousePos.x)
  oldCameraPosition.y = (-cameraPosition.y + mousePos.y)

  if(!keys["Control"])

  if(currentStyle == "add")
  {    
    {  console.log(
      Math.round((mousePos.x/mouseZoom  - cameraPosition.x/mouseZoom) / gridSnap) * gridSnap, Math.round((mousePos.y/mouseZoom - cameraPosition.y/mouseZoom) / gridSnap) * gridSnap
        );
        new point(Math.round((mousePos.x/mouseZoom  - cameraPosition.x/mouseZoom) / gridSnap) * gridSnap, Math.round((mousePos.y/mouseZoom - cameraPosition.y/mouseZoom) / gridSnap) * gridSnap);
      }
  } else if(currentStyle == "select") {
    selectObject();
    if(menuObject) {
      selectPoint();
    }
  }
});

//----------------- Event Listeners ---------------- //

class IMAGE {
  position = { x : 0, y : 0}

  size = { x : 0, y : 0}

  img;

  points;

  constructor(img, pos, size) {
    this.img = img
    this.position = pos
    this.size = size
    this.points = [{ x : this.position.x, y : this.position.y}, { x : this.position.x + this.size.x, y : this.position.y}, 
      { x : this.position.x + this.size.x, y : this.position.y + this.size.y} , { x : this.position.x, y : this.position.y + this.size.y}];
  }

  draw() {
    ctx_editor.drawImage(this.img, this.position.x * mouseZoom + cameraPosition.x, this.position.y * mouseZoom + cameraPosition.y, this.size.x * mouseZoom, this.size.y * mouseZoom)

    this.points.forEach(point => {
      ctx_editor.beginPath();
      ctx_editor.arc((point.x * mouseZoom + cameraPosition.x - translation.x), (point.y * mouseZoom + cameraPosition.y - translation.y), 3, 0, 2 * Math.PI);
      ctx_editor.fillStyle = "red";
      ctx_editor.fill();
    })
  }

  update() {
    this.position = this.points[0]
    this.size = { x : this.points[2].x - this.position.x, y : this.points[2].y - this.position.y}
  }

}

class Camera {

  position = { x : 0, y : 0, z : -100}
  rotation = 0
  tilt = 0

  constructor() {}
}

class Object {

  points = []

  colorData = []

  height = 50

  centerPoint = {x : 0, y : 0}

  constructor(pointString) {

    let returnString = ""

    let returnPos = { x : 0, y : 0};

    for (let i = 0; i < pointString.length; i++) {
      const character = pointString[i];



      if(character !== "," && character !== ":"){
        returnString += character
      }

      if(character == ",") {
        returnPos.x = Number(returnString)
        returnString = ""
      }

      if(character == ":") {
        returnPos.y = Number(returnString)
        this.points.push({ x: returnPos.x, y : returnPos.y})
        returnString = ""
      }    
    }

    // for (let i = 0; i < this.points.length; i++) {
    //   this.centerPoint.x += this.points[i].x
    //   this.centerPoint.y += this.points[i].y
    // }

    // this.centerPoint.x /= this.points.length
    // this.centerPoint.y /= this.points.length

    // for (let i = 0; i < this.points.length; i++) {
    //   this.points[i].x -= this.centerPoint.x
    //   this.points[i].y -= this.centerPoint.y
    // }

    for (let i = 0; i < (this.points.length / 2) + 2; i++) {
      this.colorData.push(`rgb(${Math.random() * 255}, 0, 0)`)
    }

    objects.push(this)

  }



}

function drawWall(vertices, color) {
  ctx_editor_2.beginPath();

  ctx_editor_2.moveTo(vertices[0].x, vertices[0].y);
  ctx_editor_2.lineTo(vertices[1].x, vertices[1].y);
  ctx_editor_2.lineTo(vertices[3].x, vertices[3].y);
  ctx_editor_2.lineTo(vertices[2].x, vertices[2].y);

  ctx_editor_2.fillStyle = color;
  ctx_editor_2.fill();
}

function clipBehindPlayer(p1, p2) {
  d = p1.y - p2.y;
  if (d == 0) {
    d = 1;
  }
  s = p1.y / d;
  p1.x = p1.x + s * (p2.x - p1.x);
  p1.y = 1;
  p1.z = p1.z + s * (p2.z - p1.z);
}

displayCamera = new Camera();

function drawSurface(vertices, color) {
  ctx_editor_2.fillStyle = color;
  ctx_editor_2.beginPath();

  ctx_editor_2.moveTo(vertices[0].x, vertices[0].y);

  for (let i = 1; i < vertices.length; i++) {
    const vertex = vertices[i];

    ctx_editor_2.lineTo(vertex.x, vertex.y);
  }
  ctx_editor_2.lineTo(vertices[0].x, vertices[0].y);
  ctx_editor_2.fill();
}

function draw3d(camera, Object) {
  CS = Math.cos(degToRad(camera.rotation));
  SN = Math.sin(degToRad(camera.rotation));

  let surface = 0;

  if (camera.position.z < 0 - Object.height) {
    surface = 1;
  } else if (camera.position.z > 0) {
    surface = 2;
  }

  let pairs = [];

  for (let i = 0; i < Object.points.length; i++) {
    const point_1 = Object.points[i];
    const point_2 = Object.points[(i + 1) % Object.points.length];

    x1 = point_1.x - camera.position.x;
    x2 = point_2.x - camera.position.x;

    y1 = point_1.y - camera.position.y;
    y2 = point_2.y - camera.position.y;

    z1 = - (camera.position.z);
    z2 = - (camera.position.z);
    // world x

    world_x1 = x1 * CS - y1 * SN;
    world_x2 = x2 * CS - y2 * SN;

    world_x3 = world_x1;
    world_x4 = world_x2;

    // world y

    world_y1 = y1 * CS + x1 * SN;
    world_y2 = y2 * CS + x2 * SN;

    world_y3 = world_y1;
    world_y4 = world_y2;

    //world z

    world_z1 = z1 + (camera.tilt * world_y1) / 32;
    world_z2 = z2 + (camera.tilt * world_y2) / 32;

    world_z3 = world_z1 - Object.height
    world_z4 = world_z2 - Object.height

    //backface culling, surface normal DOT viewVector

    surfaceNormal = { x: -world_y2 + world_y1, y: world_x2 - world_x1 };

    viewVector = { x: world_x1, y: world_y1 };

    if (world_y1 < 1 && world_y2 < 0) {
      continue;
    }

    world_1 = { x: world_x1, y: world_y1, z: world_z1 };
    world_2 = { x: world_x2, y: world_y2, z: world_z2 };
    world_3 = { x: world_x3, y: world_y3, z: world_z3 };
    world_4 = { x: world_x4, y: world_y4, z: world_z4 };

    if (world_1.y < 0) {
      clipBehindPlayer(world_1, world_2);
      clipBehindPlayer(world_3, world_4);
    }

    if (world_2.y < 0) {
      clipBehindPlayer(world_2, world_1);
      clipBehindPlayer(world_4, world_3);
    }

    p1 = {
      x: (world_1.x * 200) / world_1.y + canvas_editor_2.width / 2,
      y: (world_1.z * 200) / world_1.y + canvas_editor_2.height / 2,
    };

    p2 = {
      x: (world_2.x * 200) / world_2.y + canvas_editor_2.width / 2,
      y: (world_2.z * 200) / world_2.y + canvas_editor_2.height / 2,
    };

    p3 = {
      x: (world_3.x * 200) / world_3.y + canvas_editor_2.width / 2,
      y: (world_3.z * 200) / world_3.y + canvas_editor_2.height / 2,
    };

    p4 = {
      x: (world_4.x * 200) / world_4.y + canvas_editor_2.width / 2,
      y: (world_4.z * 200) / world_4.y + canvas_editor_2.height / 2,
    };

    if (surface == 1) {
      pairs.push(p3);
      pairs.push(p4);
    } else if (surface == 2) {
      pairs.push(p1);
      pairs.push(p2);
    }

    if (surfaceNormal.x * viewVector.x + surfaceNormal.y * viewVector.y < 0) {
      // if the object is behind camera, dont draw
      continue;
    }

    if (!Object.iscamera) {
      drawWall([p1, p2, p3, p4], Object.colorData[Math.floor(i / 2)]);
    }
  }

  if (surface !== 0 && pairs.length > 0) {
    drawSurface(pairs, Object.colorData[Object.colorData.length - 1]);
  }
}


function clear() {
  ctx_editor.beginPath();
  ctx_editor.rect(-translation.x - canvas_editor.width / 2, -translation.y - canvas_editor.height / 2, canvas_editor.width, canvas_editor.height);
  ctx_editor.fillStyle = "white";
  ctx_editor.fill();

  // ctx_editor_2.beginPath();
  // ctx_editor_2.rect(0, 0, canvas_editor.width, canvas_editor.height);
  // ctx_editor_2.fillStyle = "white";
  // ctx_editor_2.fill();

}

let translation = { x : 0, y : 0}

let points = [];

function checkPoints() {
  if(points.length !== 1) {
    if(points[0].x == points[points.length - 1].x && points[0].y == points[points.length - 1].y) {
      console.log("Loop")
      exportPoints(points);
      points = [];
    }
  }
}

function exportPoints(points) {

  let returnString = ""
  
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    
    returnString += `${point.x},${point.y}:`
  }

  console.log(returnString)
  displayObject = new Object(returnString);
}



class point {
  x;
  y;
  constructor(x, y) {
    this.x = x;
    this.y = y;
    points.push(this);

    checkPoints();  

  }
  draw() {
    ctx_editor.beginPath();
    ctx_editor.arc((this.x * mouseZoom + cameraPosition.x - translation.x) , (this.y * mouseZoom + cameraPosition.y - translation.y), 3, 0, 2 * Math.PI);
    ctx_editor.fillStyle = "red";
    ctx_editor.fill();

    if (points[points.indexOf(this) + 1]) {
      ctx_editor.moveTo((this.x * mouseZoom + cameraPosition.x - translation.x), (this.y * mouseZoom + cameraPosition.y - translation.y));
      ctx_editor.lineTo(
        (points[points.indexOf(this) + 1].x * mouseZoom + cameraPosition.x - translation.x),
        (points[points.indexOf(this) + 1].y * mouseZoom + cameraPosition.y - translation.y)
      );
      ctx_editor.stroke();
    }
  }
}

mouseZoom = 0.4


// ------------ Selected Object Menu -------------- //

function selectObject() {

  images.forEach(Obj => {
    let collision = false
    let vertices = Obj.points

    

    for (current=0; current<vertices.length; current++) {
      // get next vertex in list
      // if we've hit the end, wrap around to 0
      next = current+1;
      if (next == vertices.length) next = 0;
  
      // get the PVectors at our current position
      // this makes our if statement a little cleaner
      vc = vertices[current];    // c for "current"
      vn = vertices[next];       // n for "next"
  
      // compare position, flip 'collision' variable
      // back and forth
  
      // console.log(vc, vn)
  
      if (((vc.y > mousePos.y - cameraPosition.y && vn.y < mousePos.y - cameraPosition.y) || (vc.y < mousePos.y - cameraPosition.y && vn.y > mousePos.y - cameraPosition.y)) &&
           (mousePos.x - cameraPosition.x < (vn.x-vc.x)*(mousePos.y - cameraPosition.y-vc.y) / (vn.y-vc.y)+vc.x)) {
              collision = !collision;
      
      }
    }
    
    if(collision) {
      console.log(Obj)
      openMenu(Obj)
      return true
    }
    console.log("No")
    return false;
  })

  objects.forEach(Obj => {
    let collision = false
    let vertices = Obj.points;

    

    for (current=0; current<vertices.length; current++) {
      // get next vertex in list
      // if we've hit the end, wrap around to 0
      next = current+1;
      if (next == vertices.length) next = 0;
  
      // get the PVectors at our current position
      // this makes our if statement a little cleaner
      vc = vertices[current];    // c for "current"
      vn = vertices[next];       // n for "next"
  
      // compare position, flip 'collision' variable
      // back and forth
  
      // console.log(vc, vn)
  
      if (((vc.y > (mousePos.y - cameraPosition.y) / mouseZoom && vn.y < (mousePos.y - cameraPosition.y) / mouseZoom) || (vc.y < (mousePos.y - cameraPosition.y) / mouseZoom && vn.y > (mousePos.y - cameraPosition.y) / mouseZoom)) &&
           ((mousePos.x - cameraPosition.x) / mouseZoom < (vn.x-vc.x)*((mousePos.y - cameraPosition.y) / mouseZoom -vc.y) / (vn.y-vc.y)+vc.x)) {
              collision = !collision;
      
      }
    }
    
    if(collision) {
      console.log(Obj)
      openMenu(Obj)
      return true
    }
    console.log("No")
    return false;
  })


}

let menuObject;

function openMenu(Obj) {
  if(Obj.height) {
    document.getElementById("heightInput").value = Obj.height
  }
  objectMenu.style.display = "block"
  menuObject = Obj
}

objectMenu = document.getElementById("selectObject")

document.getElementById("heightInput").addEventListener("change", (e)=> {
    menuObject.height = Number(document.getElementById("heightInput").value)
})


dragElement("selectObject");
dragElement("selectPoint");

function dragElement(element) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  document.getElementById(`${element}Header`).onmousedown = dragMouseDown;
  element = document.getElementById(element)

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;

    document.onmousemove = elementDrag;

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();

      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}

let selectedPoint;

function selectPoint() {
  menuObject.points.forEach(point => {
    if((mousePos.x - point.x * mouseZoom - cameraPosition.x)**2 + (mousePos.y - point.y * mouseZoom - cameraPosition.y)**2 < 20) {
      console.log(point)
      selectedPoint = point
      document.getElementById("xInput").value = point.x 
      document.getElementById("yInput").value = point.y
      document.getElementById("selectPoint").style.display = "block"
    }
  })
}

document.getElementById("xInput").addEventListener("change", ()=> {
  selectedPoint.x = Number(document.getElementById("xInput").value)

  if(menuObject instanceof IMAGE) {

    let index = menuObject.points.indexOf(selectedPoint)

    console.log(index)

    if(index == 0) {
      menuObject.points[3].x = Number(document.getElementById("xInput").value)
    }

    if(index == 1) {
      menuObject.points[2].x = Number(document.getElementById("xInput").value)
    }

    if(index == 2) {
      menuObject.points[1].x = Number(document.getElementById("xInput").value)
    }
  
    if(index == 3) {
      menuObject.points[0].x = Number(document.getElementById("xInput").value)
    }
    menuObject.update()
  }
})

document.getElementById("yInput").addEventListener("change", ()=> {
  selectedPoint.y = Number(document.getElementById("yInput").value)
  
  if(menuObject instanceof IMAGE) {

    let index = menuObject.points.indexOf(selectedPoint)

    if(index == 0) {
      menuObject.points[1].y = Number(document.getElementById("yInput").value)
    }

    if(index == 1) {
      menuObject.points[0].y = Number(document.getElementById("yInput").value)
    }

    if(index == 2) {
      menuObject.points[3].y = Number(document.getElementById("yInput").value)
    }
  
    if(index == 3) {
      menuObject.points[2].y = Number(document.getElementById("yInput").value)
    }
    menuObject.update()
  }

})

function reversePoints(points) {
  console.log(points)
  
  console.log(points.reverse())
}


// ------------ Selected Object Menu -------------- //

// ------------ Save Data -------------- //

function saveData() {
  let returnString = ""

  objects.forEach(Obj => {
    Obj.points.forEach(point => {
      returnString += `${point.x},${point.y};`
    })

    returnString += `${Obj.height}O`

  })

  navigator.clipboard.writeText(returnString);
  alert("Copied to clipboard!")
}

// ------------ Save Data -------------- //



function updatePlayerMovement() {
  let speed = 1;

  dx = Math.sin(degToRad(displayCamera.rotation)) * speed;
  dy = Math.cos(degToRad(displayCamera.rotation)) * speed;

  if (keys["w"]) {
    displayCamera.position.x += dx;
    displayCamera.position.y += dy;
  }

  if (keys["a"]) {
    displayCamera.position.x -= dy;
    displayCamera.position.y += dx;
  }

  if (keys["s"]) {
    displayCamera.position.x -= dx;
    displayCamera.position.y -= dy;
  }

  if (keys["d"]) {
    displayCamera.position.x += dy;
    displayCamera.position.y -= dx;
  }

  if (keys[" "]) {
    displayCamera.position.z -= speed;
  }

  if (keys["Shift"]) {
    displayCamera.position.z += speed;
  }

  // player.tilt += deltaMouse.y / 5;

  if (keys["ArrowLeft"]) {
    displayCamera.rotation -= 1;
  }
  if (keys["ArrowRight"]) {
    displayCamera.rotation += 1;
  }

  if (keys["ArrowUp"]) {
    if (displayCamera.tilt > -20) {
      displayCamera.tilt -= 0.4;
    }
  }
  if (keys["ArrowDown"]) {
    if (displayCamera.tilt < 30) {
      displayCamera.tilt += 0.4;
    }
  }

  if (displayCamera.rotation > 360) {
    displayCamera.rotation -= 360;
  }
  if (displayCamera.rotation < 0) {
    displayCamera.rotation += 360;
  }
}

let gridSnap = 25

function drawGrid() {
  xStretch =  {left : Math.round((-canvas_editor.width / 2 - cameraPosition.x) / gridSnap / mouseZoom ) * gridSnap * mouseZoom + cameraPosition.x, right : canvas_editor.width / 2}
  yStretch =  {top : Math.round((-canvas_editor.height / 2 - cameraPosition.y) / gridSnap / mouseZoom ) * gridSnap * mouseZoom + cameraPosition.y, bot : canvas_editor.height / 2}
  // for (let j = 0; j < 75; j++) {
  //   for (let i = 0; i < 75; i++) {
  //     ctx_editor.beginPath();
  //     ctx_editor.arc(xStretch.left + i * 10, Math.round(yStretch.top * 10) / 10 + j * 10, 2, 0, 2 * Math.PI);
  //     ctx_editor.fillStyle = "rgba(0,0,0,0.2)";
  //     ctx_editor.fill();
      
  //     if(xStretch.left + i * 10 > xStretch.right) {
  //       break
  //     }
  //   }

  //   if(yStretch.top + j * 10 > yStretch.bot) {
  //     break
  //   }
  // }

  ctx_editor.strokeStyle = "rgba(0,0,0,0.2)";


  for (let i = 0; i < Infinity; i++) {
    ctx_editor.beginPath();
    ctx_editor.moveTo(xStretch.left + i * gridSnap * mouseZoom, -canvas_editor.height / 2 + 1)
    ctx_editor.lineTo(xStretch.left + i * gridSnap * mouseZoom, canvas_editor.height / 2 - 1)
    ctx_editor.stroke()

    if(xStretch.left + i * gridSnap * mouseZoom > xStretch.right) {
      break
    }
  }

  for (let j = 0; j < Infinity; j++) {

    ctx_editor.beginPath();
    ctx_editor.moveTo( -canvas_editor.width / 2 + 1, yStretch.top + j * gridSnap * mouseZoom)
    ctx_editor.lineTo( canvas_editor.width / 2 - 1, yStretch.top + j * gridSnap * mouseZoom)
    ctx_editor.stroke()

    if(yStretch.top + j * gridSnap * mouseZoom > yStretch.bot) {
      break
    }
  }
  ctx_editor.strokeStyle = "rgba(0,0,0,1)";
}

function editor_draw2D() {

  clear();

  images.forEach(img => {
    img.draw()
  })

  if(selectedPoint) {
    ctx_editor.beginPath();
    ctx_editor.arc(selectedPoint.x * mouseZoom + cameraPosition.x,selectedPoint.y * mouseZoom + cameraPosition.y, 7, 0, 2 * Math.PI);
    ctx_editor.fillStyle = "black";
    ctx_editor.stroke();
  }

  drawGrid()

  // drawGrid(1000, 750, mouseZoom);
  points.forEach((Obj) => {
    Obj.draw();
  });


  objects.forEach(Obj => {
    // draw3d(displayCamera, Obj)
    Obj.draw2d()
  })

  
  ctx_editor.beginPath();
  ctx_editor.arc(displayCamera.position.x * mouseZoom + cameraPosition.x,displayCamera.position.y * mouseZoom + cameraPosition.y, 10 * mouseZoom, 0, 2 * Math.PI);
  ctx_editor.fillStyle = "red";
  ctx_editor.fill();


  ctx_editor.beginPath()
  ctx_editor.moveTo(displayCamera.position.x * mouseZoom + cameraPosition.x, displayCamera.position.y * mouseZoom + cameraPosition.y)
  ctx_editor.lineTo(displayCamera.position.x * mouseZoom + cameraPosition.x + Math.cos(degToRad(-displayCamera.rotation) + Math.PI / 2) * 10, displayCamera.position.y * mouseZoom + cameraPosition.y + Math.sin(degToRad(-displayCamera.rotation) + Math.PI / 2) * 10)
  ctx_editor.stroke()

  // cameraPosition.x += 0.5


  ctx_editor.beginPath();
  ctx_editor.arc(cameraPosition.x ,cameraPosition.y, 3, 0, 2 * Math.PI);
  ctx_editor.fillStyle = "red";
  ctx_editor.fill();

}


function gameLoop() {
  requestAnimationFrame(gameLoop);

  updatePlayerMovement();


}
gameLoop();
