let mouseDown = false

let mousePos = {
  x : 0, y : 0
}
let currentStyle = "select"

document.addEventListener("mousemove", function (e) {
  deltaMouse.x = e.movementX;
  deltaMouse.y = e.movementY;
  if (game.playing) {
    updatePlayerPosition();
  } else {
    if(keys["Control"] && mouseDown) {

      editor.cameraPosition.x = (mousePos.x - editor.oldCameraPosition.x)
      editor.cameraPosition.y = (mousePos.y - editor.oldCameraPosition.y) 
  
    }
  
    mousePos.x = e.offsetX - canvas_editor.width / 2
    mousePos.y = -e.offsetY + canvas_editor.height / 2  
  }
});

canvas_editor.addEventListener("mousedown", (e) => {
  mouseDown = true
  if(!game.playing) {
    editor.oldCameraPosition.x = (-editor.cameraPosition.x + mousePos.x)
    editor.oldCameraPosition.y = (-editor.cameraPosition.y + mousePos.y)

    if(!keys["Control"]) {
      if(currentStyle == "add")
      {    
        {
            new point(Math.round((mousePos.x/editor.mouseZoom  - editor.cameraPosition.x/editor.mouseZoom) / editor.gridSnap) * editor.gridSnap, 
                      Math.round((mousePos.y/editor.mouseZoom - editor.cameraPosition.y/editor.mouseZoom) / editor.gridSnap) * editor.gridSnap);
          }
      } else if(currentStyle == "select") {
        editor.selectObject();
        if(editor.menuObject) {
          editor.selectLine();
          editor.selectPoint();
        }
      }
    }
  }
})

document.addEventListener("mouseup", (e) => {
  mouseDown = false
})


document.addEventListener("wheel", function (e) {
  if(!game.playing){
    if(editor.mouseZoom >= 0.1 && editor.mouseZoom <= 1) {
    editor.mouseZoom -= e.deltaY / 2000 
  }

  if(editor.mouseZoom < 0.15) {
    editor.mouseZoom = 0.15
  } else if(editor.mouseZoom > 1) {
    editor.mouseZoom = 1
  }}
})


document.addEventListener("keydown", function (e) {
  keys[e.key] = true;

  if(!game.playing) {
    if(e.key == "Control") {
      canvas_editor.style.cursor = "grab";
    }
    if(e.key = "z") {
      editor.points.splice(editor.points.length - 1, 1);  
    }
  }
});

document.addEventListener("keyup", function (e) {
  keys[e.key] = false;

  if(!game.playing) {
    if(e.key == "Control") {
      canvas_editor.style.cursor = "default";
      editor.oldCameraPosition = { x: 0, y: 0}
    }
  }
});

document.addEventListener("keydown", function (e) {

  if(game.playing) {
    if (e.key == "Escape") {
      console.log(settingsMenu.style.display);
      if (settingsMenu.style.display == "none") {
        settingsMenu.style.display = "flex";
      } else {
        settingsMenu.style.display = "none";
      }
    }
  }

  if(e.key == "Tab") {

    gameWindow =  document.getElementById("game_Body")
    editorWindow =  document.getElementById("editor_Body")

    e.preventDefault();
    if(game.playing == true) {
      editorWindow.style.display = "flex"
      gameWindow.style.display = "none"
      document.exitPointerLock();
      game.playing = false
    } else {
      editorWindow.style.display = "none"
      gameWindow.style.display = "flex"
      game.playing = true
    }
  }

});



canvas.addEventListener("click", async () => {
  if(game.playing) {
    await canvas.requestPointerLock();
  }
});

// canvas.addEventListener("mousedown", function () {
//   player.shoot();
// });


document.getElementById("xInput").addEventListener("change", ()=> {
  editor.selectedPoint.x = Number(document.getElementById("xInput").value) - editor.menuObject.position.x

  if(editor.menuObject instanceof IMAGE) {

    let index = editor.menuObject.points.indexOf(editor.selectedPoint)

    console.log(index)

    if(index == 0) {
      editor.menuObject.points[3].x = Number(document.getElementById("xInput").value)
    }

    if(index == 1) {
      editor.menuObject.points[2].x = Number(document.getElementById("xInput").value)
    }

    if(index == 2) {
      editor.menuObject.points[1].x = Number(document.getElementById("xInput").value)
    }
  
    if(index == 3) {
      editor.menuObject.points[0].x = Number(document.getElementById("xInput").value)
    }
    editor.menuObject.update()
  }
})

document.getElementById("yInput").addEventListener("change", ()=> {
  editor.selectedPoint.y = Number(document.getElementById("yInput").value) - editor.menuObject.position.y
  
  if(editor.menuObject instanceof IMAGE) {

    let index = editor.menuObject.points.indexOf(editor.selectedPoint)

    if(index == 0) {
      editor.menuObject.points[1].y = Number(document.getElementById("yInput").value)
    }

    if(index == 1) {
      editor.menuObject.points[0].y = Number(document.getElementById("yInput").value)
    }

    if(index == 2) {
      editor.menuObject.points[3].y = Number(document.getElementById("yInput").value)
    }
  
    if(index == 3) {
      editor.menuObject.points[2].y = Number(document.getElementById("yInput").value)
    }
    editor.menuObject.update()
  }

})


document.getElementById("positionX").addEventListener("change", ()=> {
  editor.menuObject.position.x = Number(document.getElementById("positionX").value)
})
document.getElementById("positionY").addEventListener("change", ()=> {
  editor.menuObject.position.y = Number(document.getElementById("positionY").value)
})
document.getElementById("positionZ").addEventListener("change", ()=> {
  editor.menuObject.position.z = Number(document.getElementById("positionZ").value)
})

document.getElementById("heightInput").addEventListener("change", (e)=> {
  editor.menuObject.height = Number(document.getElementById("heightInput").value)
})

document.getElementById("uploader").addEventListener("change", uploadFile)

function uploadFile(event) {
  event.preventDefault()
  uploadedFile = document.getElementById("uploader").files[0]
  const img = new Image();
  img.src = URL.createObjectURL(uploadedFile)
  img.onload = ()=> {
    editor.images.push(new IMAGE(img, { x : 0, y : 0}, { x : 100, y : 100}))
  }

  document.getElementById("imageUploaderBackground").style.display = "none"

}

document.getElementById("edgeVisibility").addEventListener("change", (e)=> {
  if(!document.getElementById("edgeVisibility").checked) {
    editor.menuObject.faceColors[editor.selectedEdge] = "none";
  } else {
    editor.menuObject.faceColors[editor.selectedEdge] = getRandomColor();

  }
})

document.getElementById("isFloor").addEventListener("change", (e)=> {
  if(document.getElementById("isFloor").checked) {
    for (let i = 0; i < editor.menuObject.faces.length; i++) {
      editor.menuObject.faceColors[i] = "none";
    }
  } else {
    for (let i = 0; i < editor.menuObject.faces.length; i++) {
      editor.menuObject.faceColors[i] = getRandomColor();
    }
  }
})