function drawWall(vertices, color) {
  ctx.beginPath();

  ctx.moveTo(vertices[0].x, vertices[0].y);
  ctx.lineTo(vertices[1].x, vertices[1].y);
  ctx.lineTo(vertices[3].x, vertices[3].y);
  ctx.lineTo(vertices[2].x, vertices[2].y);

  ctx.fillStyle = color;
  ctx.fill();
}

function draw2d() {
  ctx_2d.beginPath();
  ctx_2d.rect(
    -canvas_2d.width / 2,
    -canvas_2d.height / 2,
    canvas_2d.width,
    canvas_2d.height
  );
  ctx_2d.fillStyle = "white";
  ctx_2d.fill();

  for (let i = 0; i < objects.length; i++) {
    const Object = objects[i];

    if (Object instanceof item) {
      continue;
    }

    vertices_2D = [];

    for (let j = 0; j < Object.faces.length; j++) {
      const _Face = Object.faces[j];

      vertices_2D.push({
        x: (_Face[0].x + Object.position.x) / mapScale,
        y: (_Face[0].y + Object.position.y) / mapScale,
      });
    }

    ctx_2d.beginPath();
    ctx_2d.moveTo(vertices_2D[0].x, vertices_2D[0].y);

    vertices_2D.forEach((Vertex) => {
      ctx_2d.lineTo(Vertex.x, Vertex.y);
    });
    ctx_2d.lineTo(vertices_2D[0].x, vertices_2D[0].y);

    ctx_2d.fillStyle = Object.faceColors[Object.faceColors.length - 1];
    ctx_2d.fill();

    if (Object.isPlayer) {
      ctx_2d.beginPath();
      ctx_2d.moveTo(
        Object.parent.position.x / mapScale,
        Object.parent.position.y / mapScale
      );
      ctx_2d.lineTo(
        Object.parent.position.x / mapScale +
          Math.cos(degToRad(-Object.parent.rotation) + Math.PI / 2) * 15,
        Object.parent.position.y / mapScale +
          Math.sin(degToRad(-Object.parent.rotation) + Math.PI / 2) * 15
      );
      ctx_2d.stroke();
    }
  }

  ctx_2d.beginPath();
  ctx_2d.moveTo(player.position.x / mapScale, player.position.y / mapScale);
  ctx_2d.lineTo(
    player.position.x / mapScale +
      Math.cos(degToRad(-player.rotation) + Math.PI / 2) * 15,
    player.position.y / mapScale +
      Math.sin(degToRad(-player.rotation) + Math.PI / 2) * 15
  );
  ctx_2d.stroke();

  ctx_2d.beginPath();
  ctx_2d.arc(
    player.position.x / mapScale,
    player.position.y / mapScale,
    3,
    0,
    2 * Math.PI
  );
  ctx_2d.stroke();
}

function drawSurface(vertices, color) {
  ctx.fillStyle = color;
  ctx.beginPath();

  ctx.moveTo(vertices[0].x, vertices[0].y);

  for (let i = 1; i < vertices.length; i++) {
    const vertex = vertices[i];

    ctx.lineTo(vertex.x, vertex.y);
  }
  ctx.lineTo(vertices[0].x, vertices[0].y);
  ctx.fill();
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

function draw3d(Object) {
  CS = Math.cos(degToRad(player.rotation));
  SN = Math.sin(degToRad(player.rotation));

  if (Object instanceof item) {
    x1 = -player.position.x + Object.position.x;
    y1 = -player.position.y + Object.position.y;
    z1 = -(player.position.z + 90) + Object.position.z;

    world_x1 = x1 * CS - y1 * SN;

    world_y1 = y1 * CS + x1 * SN;

    if (world_y1 > 0) {
      world_z1 = z1 + (player.tilt * world_y1) / 32;

      world_1 = { x: world_x1, y: world_y1, z: world_z1 };

      Object.distance = distance(world_x1, 0, world_y1, 0);

      p1 = {
        x: (world_1.x * 200) / world_1.y + screenWidth / 2,
        y: (world_1.z * 200) / world_1.y + screenHeight / 2,
      };

      p2 = {
        x: (world_1.x * 200) / world_1.y + screenWidth / 2,
        y: ((world_1.z + Object.height) * 200) / world_1.y + screenHeight / 2,
      };

      ctx.drawImage(
        Object.texture,
        300,
        660,
        70,
        -30,
        p1.x - ((p2.y - p1.y) * 4) / 2,
        p1.y,
        (p2.y - p1.y) * 7.5,
        (p2.y - p1.y) * 3.5
      );
    }

    return;
  }

  Object.distance = 0;
  let surface = 0;
  if (!Object.isPlayer) {
    if (player.position.z + 90 > Object.position.z + Object.height) {
      surface = 1;
    } else if (player.position.z + 90 < Object.position.z) {
      surface = 2;
    }
  }

  let pairs = [];

  for (let i = 0; i < Object.faces.length; i++) {
    const _Face = Object.faces[i];

    x1 = _Face[0].x - player.position.x + Object.position.x;
    x2 = _Face[1].x - player.position.x + Object.position.x;

    y1 = _Face[0].y - player.position.y + Object.position.y;
    y2 = _Face[1].y - player.position.y + Object.position.y;

    z1 = _Face[0].z - (player.position.z + 90) + Object.position.z;
    z2 = _Face[1].z - (player.position.z + 90) + Object.position.z;

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

    Object.distance += distance(world_x1, 0, world_y1, 0);

    //world z

    world_z1 = z1 + (player.tilt * world_y1) / 32;
    world_z2 = z2 + (player.tilt * world_y2) / 32;

    world_z3 = world_z1 + Object.height;
    world_z4 = world_z2 + Object.height;

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
      x: (world_1.x * 200) / world_1.y + screenWidth / 2,
      y: (world_1.z * 200) / world_1.y + screenHeight / 2,
    };

    p2 = {
      x: (world_2.x * 200) / world_2.y + screenWidth / 2,
      y: (world_2.z * 200) / world_2.y + screenHeight / 2,
    };

    p3 = {
      x: (world_3.x * 200) / world_3.y + screenWidth / 2,
      y: (world_3.z * 200) / world_3.y + screenHeight / 2,
    };

    p4 = {
      x: (world_4.x * 200) / world_4.y + screenWidth / 2,
      y: (world_4.z * 200) / world_4.y + screenHeight / 2,
    };

    if (surface == 1) {
      pairs.push(p3);
      pairs.push(p4);
    } else if (surface == 2) {
      pairs.push(p1);
      pairs.push(p2);
    }

    if (surfaceNormal.x * viewVector.x + surfaceNormal.y * viewVector.y < 0) {
      // if the object is behind player, dont draw
      continue;
    }

    if (!Object.isPlayer) {
      drawWall([p1, p2, p3, p4], Object.faceColors[i]);
    }
  }

  if (Object.isPlayer == true) {
    x1 = -player.position.x + Object.position.x;
    y1 = -player.position.y + Object.position.y;
    z1 = -(player.position.z + 90) + Object.position.z + Object.height;

    world_x1 = x1 * CS - y1 * SN;

    world_y1 = y1 * CS + x1 * SN;

    if (world_y1 > 0) {
      world_z1 = z1 + (player.tilt * world_y1) / 32;

      world_1 = { x: world_x1, y: world_y1, z: world_z1 };

      p1 = {
        x: (world_1.x * 200) / world_1.y + screenWidth / 2,
        y: (world_1.z * 200) / world_1.y + screenHeight / 2,
      };

      p2 = {
        x: (world_1.x * 200) / world_1.y + screenWidth / 2,
        y: ((world_1.z + Object.height) * 200) / world_1.y + screenHeight / 2,
      };

      animation(
        Object.parent,
        Object.parent.rotation - player.rotation,
        p1.x - ((p1.y - p2.y) * 0.8) / 2,
        p1.y,
        (p1.y - p2.y) * 0.8,
        p1.y - p2.y
      );
    }
  }

  if (surface !== 0 && pairs.length > 0) {
    drawSurface(pairs, Object.faceColors[Object.faceColors.length - 1]);
  }

  Object.distance /= Object.faces.length;
}

function clear() {
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fill();
}
