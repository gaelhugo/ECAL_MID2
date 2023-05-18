export default class KeyboardControl {
  constructor() {}

  move(player, command) {
    switch (command) {
      case "ArrowUp":
        player.y -= player.grid.size;
        if (player.y < 0) {
          player.y = player.grid.height;
        }
        break;
      case "ArrowDown":
        player.y += player.grid.size;
        if (player.y > player.grid.height) {
          player.y = 0;
        }
        break;
      case "ArrowLeft":
        player.x -= player.grid.size;
        if (player.x < 0) {
          player.x = player.grid.width;
        }
        break;
      case "ArrowRight":
        player.x += player.grid.size;
        if (player.x > player.grid.width) {
          player.x = 0;
        }
        break;
    }
  }
}
