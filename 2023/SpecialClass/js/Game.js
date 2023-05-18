import Player from "./Player";
import Grid from "./Grid";
import KeyboardControl from "./KeyboardControl";
import Tresor from "./Tresor";
export default class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.levels = [
      [2, 5],
      [7, 3],
      [10, 10],
      [13, 15],
      [18, 18],
    ];
    const level = this.levels.shift();
    this.grid = new Grid(level[0], level[1], 50, this.ctx);
    this.player = new Player(0, 0, 10, this.ctx, this.grid);
    // setup a tresor
    this.setTresorPosition();
    this.keyboardControl = new KeyboardControl();
  }

  checkForWin() {
    if (this.player.x === this.tresor.x && this.player.y === this.tresor.y) {
      setTimeout(() => {
        alert("You win!");
        //new grid
        const level = this.levels.shift();
        this.grid = new Grid(level[0], level[1], 50, this.ctx);
        this.player.grid = this.grid;
        this.setTresorPosition();
      }, 1000);
    }
  }

  keyDown(e) {
    this.keyboardControl.move(this.player, e.key);
    this.checkForWin();
  }

  setTresorPosition() {
    const x = Math.floor(Math.random() * this.grid.columns) * this.grid.size;
    const y = Math.floor(Math.random() * this.grid.rows) * this.grid.size;
    this.tresor = new Tresor(x, y, 10, this.ctx);
  }

  draw() {
    this.grid.draw();
    this.tresor.draw();
    this.player.draw();
  }
}
