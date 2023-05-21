canvas_editor = document.getElementById("canvas_editor");
ctx_editor = canvas_editor.getContext("2d");
ctx_editor.transform(1, 0, 0, -1, 0, canvas_editor.height);
ctx_editor.translate(canvas_editor.width / 2, canvas_editor.height / 2);

class point {
    x;
    y;
    z = 0;
    constructor(x, y) {
      this.x = x;
      this.y = y;
      
      editor.points.push(this);
  
      editor.checkPoints();  
  
    }

    draw() {
      ctx_editor.beginPath();
      ctx_editor.arc((this.x * editor.mouseZoom + editor.cameraPosition.x ) , (this.y * editor.mouseZoom + editor.cameraPosition.y), 3, 0, 2 * Math.PI);
      ctx_editor.fillStyle = "red";
      ctx_editor.fill();
  
      if (editor.points[editor.points.indexOf(this) + 1]) {
        ctx_editor.moveTo((this.x * editor.mouseZoom + editor.cameraPosition.x), (this.y * editor.mouseZoom + editor.cameraPosition.y));
        ctx_editor.lineTo(
          (editor.points[editor.points.indexOf(this) + 1].x * editor.mouseZoom + editor.cameraPosition.x),
          (editor.points[editor.points.indexOf(this) + 1].y * editor.mouseZoom + editor.cameraPosition.y)
        );
        ctx_editor.stroke();
      }
    }
}

class IMAGE {
  position = { x : 0, y : 0}
  _position = { x : 0, y : 0}

  size = { x : 0, y : 0}

  img;

  points;

  constructor(img, pos, size) {
    this.img = img
    this._position = pos
    this.size = size
    this.points = [{ x : this.position.x, y : this.position.y}, { x : this.position.x + this.size.x, y : this.position.y}, 
      { x : this.position.x + this.size.x, y : this.position.y + this.size.y} , { x : this.position.x, y : this.position.y + this.size.y}];
  }

  draw() {
    ctx_editor.drawImage(this.img, this._position.x * editor.mouseZoom + editor.cameraPosition.x
                        ,this._position.y * editor.mouseZoom + editor.cameraPosition.y
                        ,this.size.x * editor.mouseZoom, this.size.y * editor.mouseZoom)

    this.points.forEach(point => {
      ctx_editor.beginPath();
      ctx_editor.arc((point.x * editor.mouseZoom + editor.cameraPosition.x)
                    ,(point.y * editor.mouseZoom + editor.cameraPosition.y), 3, 0, 2 * Math.PI);
      ctx_editor.fillStyle = "red";
      ctx_editor.fill();
    })
  }

  update() {
    this._position = this.points[0]
    this.size = { x : this.points[2].x - this._position.x, y : this.points[2].y - this._position.y}
  }

}


objectMenu = document.getElementById("selectObject")


class Editor {

    // Settings //

    gridSnap = 25;
    mouseZoom = 0.3;

    // -------- //

    // Menu //

    menuObject;
    selectedPoint;
    selectedEdge;
    // ---- //

    points = []
    images = []

    displayCamera;
    cameraPosition = { x : 0, y : 0}
    oldCameraPosition = { x: 0, y: 0}

    constructor() {};

    clear() {
                ctx_editor.beginPath();
                ctx_editor.rect(-canvas_editor.width / 2, -canvas_editor.height / 2, canvas_editor.width, canvas_editor.height);
                ctx_editor.fillStyle = "white";
                ctx_editor.fill();
    }

    checkPoints() {
        if(this.points.length !== 1) {
            if(this.points[0].x == this.points[this.points.length - 1].x && this.points[0].y == this.points[this.points.length - 1].y) {
            console.log("Loop")

            // Center points so that they are based around origo.

            let centerPos = { x : 0, y : 0, z : 0}

            this.points.forEach(point => {
              centerPos.x += point.x
              centerPos.y += point.y
            })

            centerPos.x /= this.points.length
            centerPos.y /= this.points.length

            this.points.forEach(point => {
              point.x -= centerPos.x
              point.y -= centerPos.y
            })

            // --------------------------

            new object(this.points, centerPos, 50)
            this.points = [];
            }
        }
    }

    drawGrid() {
        let xStretch =  {left : Math.round((-canvas_editor.width / 2 - this.cameraPosition.x) / this.gridSnap / this.mouseZoom ) * this.gridSnap * this.mouseZoom + this.cameraPosition.x, right : canvas_editor.width / 2}
        let yStretch =  {top : Math.round((-canvas_editor.height / 2 - this.cameraPosition.y) / this.gridSnap / this.mouseZoom ) * this.gridSnap * this.mouseZoom + this.cameraPosition.y, bot : canvas_editor.height / 2}

        ctx_editor.strokeStyle = "rgba(0,0,0,0.2)";
      
      
        for (let i = 0; i < Infinity; i++) {
          ctx_editor.beginPath();
          ctx_editor.moveTo(xStretch.left + i * this.gridSnap * this.mouseZoom, -canvas_editor.height / 2 + 1)
          ctx_editor.lineTo(xStretch.left + i * this.gridSnap * this.mouseZoom, canvas_editor.height / 2 - 1)
          ctx_editor.stroke()
      
          if(xStretch.left + i * this.gridSnap * this.mouseZoom > xStretch.right) {
            break
          }
        }
      
        for (let j = 0; j < Infinity; j++) {
      
          ctx_editor.beginPath();
          ctx_editor.moveTo( -canvas_editor.width / 2 + 1, yStretch.top + j * this.gridSnap * this.mouseZoom)
          ctx_editor.lineTo( canvas_editor.width / 2 - 1, yStretch.top + j * this.gridSnap * this.mouseZoom)
          ctx_editor.stroke()
      
          if(yStretch.top + j * this.gridSnap * this.mouseZoom > yStretch.bot) {
            break
          }
        }
        ctx_editor.strokeStyle = "rgba(0,0,0,1)";
    } 

    selectObject() {

      this.images.forEach(Obj => {
        let collision = false
        let vertices = Obj.points;
    
        for ( let current=0; current<vertices.length; current++) { 
          // get next vertex in list
          // if we've hit the end, wrap around to 0
          let next = current+1;
          if (next == vertices.length) next = 0;
      
          // get the PVectors at our current position
          // this makes our if statement a little cleaner
          let vc = { x : vertices[current].x + Obj.position.x,  y : vertices[current].y + Obj.position.y};    // c for "current"
          let vn = { x : vertices[next].x + Obj.position.x,  y : vertices[next].y + Obj.position.y};    // n for "next"
      
          // compare position, flip 'collision' variable
          // back and forth
      
          // console.log(vc, vn)
      
          if (((vc.y > (mousePos.y - editor.cameraPosition.y) / editor.mouseZoom && vn.y < (mousePos.y - editor.cameraPosition.y) / editor.mouseZoom) || (vc.y < (mousePos.y - editor.cameraPosition.y) / editor.mouseZoom && vn.y > (mousePos.y - editor.cameraPosition.y) / editor.mouseZoom)) &&
               ((mousePos.x - editor.cameraPosition.x) / editor.mouseZoom < (vn.x-vc.x)*((mousePos.y - editor.cameraPosition.y) / editor.mouseZoom -vc.y) / (vn.y-vc.y)+vc.x)) {
                  collision = !collision;
          
          }
        }
        
        if(collision) {
          console.log(Obj)
          this.openMenu(Obj)
          return true
        }
        console.log("No")
        return false;
      })

      objects.forEach(Obj => {
        let collision = false
        let vertices = Obj.points;
    
        for ( let current=0; current<vertices.length; current++) { 
          // get next vertex in list
          // if we've hit the end, wrap around to 0
          let next = current+1;
          if (next == vertices.length) next = 0;
      
          // get the PVectors at our current position
          // this makes our if statement a little cleaner
          let vc = { x : vertices[current].x + Obj.position.x,  y : vertices[current].y + Obj.position.y};    // c for "current"
          let vn = { x : vertices[next].x + Obj.position.x,  y : vertices[next].y + Obj.position.y};    // n for "next"
      
          // compare position, flip 'collision' variable
          // back and forth
      
          // console.log(vc, vn)
      
          if (((vc.y > (mousePos.y - editor.cameraPosition.y) / editor.mouseZoom && vn.y < (mousePos.y - editor.cameraPosition.y) / editor.mouseZoom) || (vc.y < (mousePos.y - editor.cameraPosition.y) / editor.mouseZoom && vn.y > (mousePos.y - editor.cameraPosition.y) / editor.mouseZoom)) &&
               ((mousePos.x - editor.cameraPosition.x) / editor.mouseZoom < (vn.x-vc.x)*((mousePos.y - editor.cameraPosition.y) / editor.mouseZoom -vc.y) / (vn.y-vc.y)+vc.x)) {
                  collision = !collision;
          
          }
        }
        
        if(collision) {
          console.log(Obj)
          this.openMenu(Obj)
          return true
        }
        console.log("No")
        return false;
      })
    
    }

    selectPoint() {
      this.menuObject.points.forEach(point => {
        if((mousePos.x - (point.x + this.menuObject.position.x) * this.mouseZoom - this.cameraPosition.x)**2 + (mousePos.y - (point.y + this.menuObject.position.y) * this.mouseZoom - this.cameraPosition.y)**2 < 20) {
          console.log(point)
          this.selectedPoint = point
          document.getElementById("selectPoint").style.display = "block"
          if(this.menuObject instanceof object) {
            document.getElementById("xInput").value = point.x + this.menuObject.position.x
            document.getElementById("yInput").value = point.y + this.menuObject.position.y
          } else {
            document.getElementById("xInput").value = point.x
            document.getElementById("yInput").value = point.y
          }
        }
      })
    }

    selectLine() {
      if(this.menuObject instanceof IMAGE) {
        return;
      }

      for (let i = 0; i < this.menuObject.points.length; i++) {
        const point_1 = { x : this.menuObject.points[i].x + this.menuObject.position.x
                        , y : this.menuObject.points[i].y + this.menuObject.position.y};
        const point_2 = { x : this.menuObject.points[(i + 1) % this.menuObject.points.length].x + this.menuObject.position.x
                        , y : this.menuObject.points[(i + 1) % this.menuObject.points.length].y + this.menuObject.position.y};

                        if(pDistance((mousePos.x - this.cameraPosition.x)/this.mouseZoom
                                    ,(mousePos.y - this.cameraPosition.y)/this.mouseZoom
                                    , point_1.x, point_1.y ,point_2.x, point_2.y)[0] < 500) {
                                      this.selectedEdge = i

                                      let checkmark = document.getElementById("edgeVisibility")

                                      document.getElementById("selectEdge").style.display = "block"
                                      if(this.menuObject.faceColors[i] == "none") {
                                        checkmark.checked = false;
                                      } else {
                                        checkmark.checked = true
                                      }
                                    }
                        }
                      }
  

    openMenu(Obj) {
      if(Obj instanceof object) {
        document.getElementById("heightInput").value = Obj.height
        document.getElementById("positionX").value = Obj.position.x
        document.getElementById("positionY").value = Obj.position.y
        document.getElementById("positionZ").value = Obj.position.z
        document.getElementById("heightInput").style.display = "inline-block"
        document.getElementById("positionX").style.display = "inline-block"
        document.getElementById("positionY").style.display = "inline-block"
        document.getElementById("positionZ").style.display = "inline-block"

        let checkmark = document.getElementById("edgeVisibility")
        checkmark.checked = true
        for (let i = 0; i < Obj.faces.length; i++) {
          const color = Obj.faces[i];
          
          if(color !== "none") {
            checkmark.checked = false;
            break
          }
        }


      } else {
        document.getElementById("heightInput").style.display = "none"
        document.getElementById("positionX").style.display = "none"
        document.getElementById("positionY").style.display = "none"
        document.getElementById("positionZ").style.display = "none"
      }

      objectMenu.style.display = "block"
      this.menuObject = Obj
    }

    draw() {
                this.clear();

                this.images.forEach(img => {
                    img.draw()
                })

                if(this.selectedPoint) {
                    ctx_editor.beginPath();
                    ctx_editor.arc(this.selectedPoint.x * this.mouseZoom + this.cameraPosition.x + this.menuObject.position.x ,this.selectedPoint.y * this.mouseZoom + this.cameraPosition.y + this.menuObject.position.y, 7, 0, 2 * Math.PI);
                    ctx_editor.fillStyle = "black";
                    ctx_editor.stroke();
                }

                this.drawGrid()

                this.points.forEach((Obj) => {
                    Obj.draw();
                });


                objects.forEach(Obj => {
                    Obj.draw_editor()
                })

                
                ctx_editor.beginPath();
                ctx_editor.arc(this.displayCamera.position.x * this.mouseZoom + this.cameraPosition.x,this.displayCamera.position.y * this.mouseZoom + this.cameraPosition.y, 10 * this.mouseZoom, 0, 2 * Math.PI);
                ctx_editor.fillStyle = "red";
                ctx_editor.fill();


                ctx_editor.beginPath()
                ctx_editor.moveTo(this.displayCamera.position.x * this.mouseZoom + this.cameraPosition.x, this.displayCamera.position.y * this.mouseZoom + this.cameraPosition.y)
                ctx_editor.lineTo(this.displayCamera.position.x * this.mouseZoom + this.cameraPosition.x + Math.cos(degToRad(-this.displayCamera.rotation) + Math.PI / 2) * 20, this.displayCamera.position.y * this.mouseZoom + this.cameraPosition.y + Math.sin(degToRad(-this.displayCamera.rotation) + Math.PI / 2) * 10)
                ctx_editor.stroke()

                ctx_editor.beginPath();
                ctx_editor.arc(this.cameraPosition.x ,this.cameraPosition.y, 3, 0, 2 * Math.PI);
                ctx_editor.fillStyle = "red";
                ctx_editor.fill();
        }

    saveData() {
      let returnString = ""
    
      objects.forEach(Obj => {
        Obj.points.forEach(point => {
          returnString += `${point.x},${point.y};`
        })
    
        returnString += `${Obj.height}H${Obj.position.x}x${Obj.position.y}y${Obj.position.z}zC`
        
        Obj.faceColors.forEach(Color => {
          if(Color == "none") {
            returnString += ("!")
          } else {
            returnString += ("r")
          }
        })
        returnString += ("O")
      })
    
      navigator.clipboard.writeText(returnString);
      alert("Copied to clipboard!")
    }
    
    
}


// ----------------- DRAG ELEMENT ----------------- //


dragElement("selectObject");
dragElement("selectPoint");
dragElement("selectEdge");

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