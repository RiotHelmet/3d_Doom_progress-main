let loadingIn = true;

class object {
  faces = [];
  faceColors = [];

  rotation = 0;
  height;
  position;
  distance = 0;
  isPlayer = false;
  parent;

  constructor(_faces, _position, _height) {
    this.faces = _faces;
    this.position = _position;
    this.height = _height;

    for (let i = 0; i < _faces.length + 1; i++) {
      this.faceColors.push(getRandomColor());
    }

    objects.push(this);
  }
}

class item {
  position;
  height;
  texture;
  distance;
  constructor(position, height, texture) {
    this.position = position;
    this.height = height;
    this.texture = texture;
    objects.push(this);
  }
}

function orderObjects() {
  for (let i = 0; i < objects.length - 1; i++) {
    for (let j = 0; j < objects.length - i - 1; j++) {
      if (objects[j].distance < objects[j + 1].distance) {
        let st = objects[j];
        objects[j] = objects[j + 1];
        objects[j + 1] = st;
      }
    }
  }
}
