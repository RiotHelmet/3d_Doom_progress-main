canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

let animation_sheet = new Image();
animation_sheet.src = "images/animation_sheet.png";

animation_sheet.onload = () => {};

let gun_sprite = new Image();
gun_sprite.src = "images/gun_sprite.png";

gun_sprite.onload = () => {};

let blood_sprite = new Image();
blood_sprite.src = "images/blood_sprite.png";

blood_sprite.onload = () => {};

function animation(player, rotation, x, y, sizex, sizey) {

  rotation = Math.abs(rotation);
  if (player.animation.idle) {
    if (180 - 45 < rotation && rotation < 180 + 45) {
      //front

      ctx.drawImage(
        animation_sheet,
        0,
        640 - 4 * 60,
        (40 * 3) / 4,
        -60,
        x + (0.2 * sizex) / 10,
        y,
        (sizex * 3) / 4,
        sizey
      );
    } else if (360 - 45 < rotation || rotation < 45) {
      //back
      ctx.drawImage(
        animation_sheet,
        195,
        640 - 4 * 60,
        (35 * 3) / 4,
        -60,
        x + (1.3 * sizex) / 10,
        y,
        (sizex * 3) / 4,
        sizey
      );
    } else if (270 - 45 < rotation && rotation < 270 + 45) {
      //left
      ctx.drawImage(
        animation_sheet,
        225,
        640 - 4 * 60,
        50,
        -60,
        x - (3 * sizex) / 10,
        y,
        (sizex * 3) / 2.5,
        sizey
      );
    } else if (45 < rotation && rotation < 90 + 45) {
      //right
      ctx.drawImage(
        animation_sheet,
        80,
        640 - 4 * 60,
        50,
        -60,
        x + (2 * sizex) / 10,
        y,
        (sizex * 3) / 2.5,
        sizey
      );
    }
  }

  // walking

  if (player.animation.walking) {
    // front
    if (180 - 45 < rotation && rotation < 180 + 45) {
      ctx.drawImage(
        animation_sheet,
        0,
        640 - Math.floor(player.animation.walking_step) * 60,
        40,
        -60,
        x - (1.5 * sizex) / 10,
        y,
        sizex,
        sizey
      );
    } else if (360 - 45 < rotation || rotation < 45) {
      //back
      ctx.drawImage(
        animation_sheet,
        175,
        640 - Math.floor(player.animation.walking_step) * 60,
        40,
        -60,
        x + (2 * sizex) / 10,
        y,
        sizex,
        sizey
      );
    } else if (270 - 45 < rotation && rotation < 270 + 45) {
      // left
      ctx.drawImage(
        animation_sheet,
        230,
        640 - Math.floor(player.animation.walking_step) * 60,
        40,
        -60,
        x + (1 * sizex) / 10,
        y,
        sizex,
        sizey
      );
    } else if (45 < rotation && rotation < 90 + 45) {
      //right
      ctx.drawImage(
        animation_sheet,
        80,
        640 - Math.floor(player.animation.walking_step) * 60,
        40,
        -60,
        x + (1 * sizex) / 10,
        y,
        sizex,
        sizey
      );
    }
  }
}
