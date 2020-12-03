class Player {
  constructor(id, position, grid, ctx, color = "black") {
    this.id = id;
    this.grid = grid;
    this.position = position;
    this.ctx = ctx;
    this.color = color;
    this.radius = this.grid.size * 0.3;
  }

  detect(x, y) {
    return (
      Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)) <=
      this.radius
    );
  }

  show() {
    this.x =
      this.grid.offset.x +
      this.position.x * this.grid.size +
      this.grid.size / 2;
    this.y =
      this.grid.offset.y +
      this.position.y * this.grid.size +
      this.grid.size / 2;
    //
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.fill();
    this.ctx.closePath();
  }
}
