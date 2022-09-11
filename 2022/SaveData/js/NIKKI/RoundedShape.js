import Circle from "./Circle";
import ConnectingShape from "./ConnectingShape";
export default class RoundedShape {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    /**
     *
     *  | 0 | 0 | 0 |
     *  | 0 | 0 | 0 |
     *  | 0 | 0 | 0 |
     */
    this.buildGrid();
    this.shapes = [
      [0, 4],
      [4, 7],
      [4, 6],
      [7, 8],
    ];
    this.initShapes(this.shapes);
  }

  buildGrid() {
    this.grid = [];
    const dimension = 100;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        this.grid.push(
          new Circle(
            x * dimension,
            y * dimension,
            Math.random() * (dimension / 2)
          )
        );
      }
    }
  }
  initShapes(shapes) {
    this.shapesArray = [];
    shapes.forEach((shape) => {
      this.shapesArray.push(
        new ConnectingShape(this.grid[shape[0]], this.grid[shape[1]])
      );
    });
  }
  drawSelection(ctx, circles) {
    const filtered = [...new Set(circles.flat(1))];
    filtered.forEach((item) => {
      this.grid[item].update();
      this.grid[item].draw(ctx);
    });
    this.shapesArray.forEach((shape) => {
      shape.draw(ctx);
    });
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    this.drawSelection(ctx, this.shapes);
    ctx.restore();
  }
}
