let loadingIn = true;

class object {
  faces = [];
  faceColors = [];

  points;


  rotation = 0;
  height;
  position;
  distance = 0;
  isPlayer = false;
  parent;

  constructor(_points, _position, _height, colors) {
    this.points = _points;

    for (let i = 0; i < _points.length; i++) {
      const point_1 = _points[i];
      const point_2 = _points[(i + 1) % _points.length];
      this.faces.push([point_1, point_2])
    }
    
    this.position = _position;
    this.height = _height;

    if(colors) {
      this.faceColors = colors;
    } else {
    for (let i = 0; i < this.faces.length + 1; i++) {
      this.faceColors.push(getRandomColor());
      }
    }




    objects.push(this);
  }

  updatePoints() {
    this.faces = []
    for (let i = 0; i < this.points.length; i++) {
      const point_1 = this.points[i];
      const point_2 = this.points[(i + 1) % this.points.length];
      this.faces.push([point_1, point_2])
    }
  }

  draw_editor() {
    for (let i = 0; i < this.points.length; i++) {
      const point_1 = {x : this.points[i].x + this.position.x
                      ,y : this.points[i].y + this.position.y
                      ,z : this.points[i].z + this.position.z}

      const point_2 = {x : this.points[(i + 1) % this.points.length].x + this.position.x
                      ,y : this.points[(i + 1) % this.points.length].y + this.position.y
                      ,z : this.points[(i + 1) % this.points.length].z + this.position.z}
  
      ctx_editor.strokeStyle = "black"

      ctx_editor.beginPath()
      ctx_editor.moveTo((point_1.x * editor.mouseZoom + editor.cameraPosition.x), (point_1.y * editor.mouseZoom + editor.cameraPosition.y));
      ctx_editor.lineTo(
        (point_2.x * editor.mouseZoom + editor.cameraPosition.x),
        (point_2.y * editor.mouseZoom + editor.cameraPosition.y)
      );
      ctx_editor.stroke();

      ctx_editor.beginPath();
      ctx_editor.arc((point_1.x * editor.mouseZoom + editor.cameraPosition.x), (point_1.y * editor.mouseZoom + editor.cameraPosition.y), 3, 0, 2 * Math.PI);
      ctx_editor.fillStyle = "red";
      ctx_editor.fill();
    }
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
