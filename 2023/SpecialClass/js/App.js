import Game from "./Game.js";
import Playground from "@onemorestudio/playgroundjs";
export default class App extends Playground {
  constructor() {
    super();
    this.game = new Game(this.ctx);
    this.listen();
    this.draw();
  }
  listen() {
    document.addEventListener("keydown", (e) => {
      e.preventDefault();
      this.game.keyDown(e);
    });
  }
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(
      this.canvas.width / 2 - this.game.grid.width / 2,
      this.canvas.height / 2 - this.game.grid.height / 2
    );
    this.game.draw();
    this.ctx.restore();
    requestAnimationFrame(this.draw.bind(this));
  }
}
