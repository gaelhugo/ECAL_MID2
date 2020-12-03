class Grid {
  constructor(rows, cols, size, ctx) {
    this.rows = rows;
    this.cols = cols;
    this.size = size;
    this.ctx = ctx;

    this.offset = {
      x: window.innerWidth / 2 - (this.cols * this.size) / 2,
      y: window.innerHeight / 2 - (this.rows * this.size) / 2,
    };
  }

  show() {
    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        this.ctx.beginPath();
        this.ctx.rect(
          this.offset.x + i * this.size,
          this.offset.y + j * this.size,
          this.size,
          this.size
        );
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  }
}
