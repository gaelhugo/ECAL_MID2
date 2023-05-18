export default class Player {
  constructor(x, y, radius, ctx, grid) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.ctx = ctx;
    this.grid = grid;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    this.ctx.fill();
    this.ctx.closePath();
  }
}
