export default class Grid {
  constructor(columns, rows, size, ctx) {
    this.columns = columns;
    this.rows = rows;
    this.ctx = ctx;
    this.size = size;
    // useful data
    this.width = this.columns * this.size;
    this.height = this.rows * this.size;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    for (let i = 0; i <= this.columns; i++) {
      this.ctx.moveTo(i * this.size, 0);
      this.ctx.lineTo(i * this.size, this.rows * this.size);
    }
    for (let i = 0; i <= this.rows; i++) {
      this.ctx.moveTo(0, i * this.size);
      this.ctx.lineTo(this.columns * this.size, i * this.size);
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }
}
