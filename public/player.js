class animation_info {
  idle = true;
  walking = false;
  walking_step = 0;
  shooting = false;
}

class Player {
  id;
  position = { x: 0, y: 0, z: 0 };
  rotation = 0;
  tilt = 0;
  shape;
  speed = 1;
  onGround = true

  alive = true;
  health = 100;

  animation = new animation_info();

  constructor(_id) {
    this.id = _id;

    if (this.id !== clientID) {
      this.shape = new object(
        [
          [
            { x: -20, y: 20, z: 0 },
            { x: -20, y: -20, z: 0 },
          ],
          [
            { x: -20, y: -20, z: 0 },
            { x: 20, y: -20, z: 0 },
          ],
          [
            { x: 20, y: -20, z: 0 },
            { x: 20, y: 20, z: 0 },
          ],
          [
            { x: 20, y: 20, z: 0 },
            { x: -20, y: 20, z: 0 },
          ],
        ],
        this.position,
        100
      );
      this.shape.isPlayer = true;
      this.shape.parent = this;
      players.push(this);
    }
  }

  shoot() {
    if (!justShot) {
      let HIT = raycast(this.position, this.rotation)

      if(HIT.isPlayer) {
        console.log(HIT.parent.id)
        socket.emit("raycastHIT", {ID : HIT.parent.id, shooterID : this.id})
      }

    }
    justShot = true;
  }

}

function raycast(origin, dir) {
  let x1 = origin.x;
  let x2 = origin.x + Math.cos(degToRad(-dir) + Math.PI / 2) * 100000;

  let y1 = origin.y;
  let y2 = origin.y + Math.sin(degToRad(-dir) + Math.PI / 2) * 100000;

  let x3;
  let x4;

  let y3;
  let y4;

  for (let i = 0; i < objects.length; i++) {
    const Object = objects[i];

    if (
      !(
        Object.position.z < origin.z + 100 - 5 &&
        origin.z + 100 - 5 < Object.position.z + Object.height
      )
    ) {
      continue;
    }

    for (let j = 0; j < Object.faces.length; j++) {
      const Face = Object.faces[j];

      x3 = Face[0].x + Object.position.x;
      y3 = Face[0].y + Object.position.y;

      x4 = Face[1].x + Object.position.x;
      y4 = Face[1].y + Object.position.y;

      t = (x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4);
      t /= (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

      u = (x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2);
      u /= (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

      if (0 <= t && t <= 1 && 0 <= u && u <= 1) {
        return Object;
      }
    }
  }
  return false;
}

function updateOtherPlayers(ID, position, rotation) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id == ID) {
      if (position.x !== players[i].position.x) {
        players[i].animation.walking = true;
        players[i].animation.idle = false;
        players[i].animation.walking_step += 0.05;
        if (players[i].animation.walking_step > 4) {
          players[i].animation.walking_step = 0;
        }
      }
      players[i].position = position;
      players[i].rotation = rotation;
      players[i].shape.position = players[i].position;
    }
  }
}

function CirclevsOBB(_Circle, _OBB) {

  // if(_Circle.position.z < _OBB.position.z) {
  //   if (
  //     _Circle.position.z + 5 > _OBB.position.z + _OBB.height
  //   ) {
  //     return false;
  //   }
  // }



  let closestDist = Infinity;
  let closestPoint;

  player_radius = 30;

  normals = [];
  faces = [];
  vertices = [];


  collisionNormal = {
    x: _Circle.position.x - _OBB.position.x,
    y: _Circle.position.y - _OBB.position.y,
  };


  for (let i = 0; i < _OBB.faces.length; i++) {
    vertex_A = {
      x: _OBB.faces[i][0].x + _OBB.position.x,
      y: _OBB.faces[i][0].y + _OBB.position.y,
    };
    vertices.push(vertex_A)
    vertex_B = {
      x: _OBB.faces[i][1].x + _OBB.position.x,
      y: _OBB.faces[i][1].y + _OBB.position.y,
    };

    face_normal = new Vec2(vertex_B.x - vertex_A.x, vertex_B.y - vertex_A.y)
      .normalize()
      .normal()
      .mult(-1);

    // if (DotProduct(collisionNormal, face_normal) > 0)
     {
      faces.push([vertex_A, vertex_B, face_normal]);
    }
  }

  if((_Circle.position.z >= _OBB.position.z &&  _Circle.position.z + 90 <= _OBB.position.z + _OBB.height)) 
  {
  for (let i = 0; i < faces.length; i++) {
    distSqrd = pDistance(
      _Circle.position.x,
      _Circle.position.y,
      faces[i][0].x,
      faces[i][0].y,
      faces[i][1].x,
      faces[i][1].y
    );
    if (distSqrd[0] < closestDist) {
      closestDist = distSqrd[0];
      closestPoint = distSqrd[1];
    }
  }
  if (closestDist < player_radius ** 2) {

    normal = new Vec2(
      closestPoint.x - _Circle.position.x,
      closestPoint.y - _Circle.position.y
    ).normalize();


    penetrationDepth = player_radius - Math.sqrt(closestDist);

    // position correction
    percent = 1; // usually 20% to 80%
    buffer = 0.01;

    correction = normal.mult(
      (Math.max(penetrationDepth - buffer, 0) / (1 + 0)) * percent
    );


    _Circle.position = {
      x: _Circle.position.x - correction.x,
      y: _Circle.position.y - correction.y,
      z: _Circle.position.z,
    };
    return true;
  }}

  

  next = 0;
  let collision = false

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

    if (((vc.y > _Circle.position.y && vn.y < _Circle.position.y) || (vc.y < _Circle.position.y && vn.y > _Circle.position.y)) &&
         (_Circle.position.x < (vn.x-vc.x)*(_Circle.position.y-vc.y) / (vn.y-vc.y)+vc.x)) {
            collision = !collision;
    
    }
  }
  
  if(collision) {
    if(_Circle.position.z + 90 > _OBB.position.z + _OBB.height && _OBB.position.z + _OBB.height > _Circle.position.z) {
      _Circle.position.z = _OBB.position.z + _OBB.height
      return true
    } else if( _OBB.position.z + _OBB.height + deltaT < _Circle.position.z){
      _Circle.position.z -= deltaT
    }
  }

  return false;

}

sensitivity = 20;

function updatePlayerMovement() {
  let walking = false;
  let speed = (deltaT * player.speed) / 1.5;



  dx = Math.sin(degToRad(player.rotation)) * speed;
  dy = Math.cos(degToRad(player.rotation)) * speed;

  if (keys["w"]) {
    player.position.x += dx;
    player.position.y += dy;
    walking = true;
  }

  if (keys["a"]) {
    player.position.x -= dy;
    player.position.y += dx;
    walking = true;
  }

  if (keys["s"]) {
    player.position.x -= dx;
    player.position.y -= dy;
    walking = true;
  }

  if (keys["d"]) {
    player.position.x += dy;
    player.position.y -= dx;
    walking = true;
  }

  if (keys[" "]) {
    // player.position.z -= 10;
  }

  if (keys["Control"]) {
    // player.position.z += 10;
  }

  player.rotation += (deltaMouse.x / sensitivity) * deltaT;

  // player.tilt += deltaMouse.y / 5;

  if (keys["ArrowLeft"]) {
    player.rotation -= 1;

    walking = true;
  }
  if (keys["ArrowRight"]) {
    player.rotation += 1;

    walking = true;
  }

  if (keys["ArrowUp"]) {
    if (player.tilt > -20) {
      player.tilt -= 0.4;
      walking = true;
    }
  }
  if (keys["ArrowDown"]) {
    if (player.tilt < 30) {
      player.tilt += 0.4;
      walking = true;
    }
  }

  if (player.rotation > 360) {
    player.rotation -= 360;
  }
  if (player.rotation < 0) {
    player.rotation += 360;
  }

  if (walking) {
    updatePlayerPosition();
  }
}
