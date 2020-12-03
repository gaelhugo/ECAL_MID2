class Target {
  constructor(id, position, grid, color, ctx) {
    this.id = id;
    this.color = color;
    this.ctx = ctx;
    this.position = position;
    this.grid = grid;
    this.detected = false;
  }

  show() {
    const x = this.grid.offset.x + this.position.x * this.grid.size;
    const y = this.grid.offset.y + this.position.y * this.grid.size;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(x, y, this.grid.size, this.grid.size);
  }
}
