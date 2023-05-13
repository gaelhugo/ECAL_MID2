export default class Piece {
  /**
   * @param {number} col        [combien de colonnes pour définir une pièce complète]
   * @param {number} row        [combien de lignes pour définir une pièce complète]
   * @param {Grid} grid         [ref de la grille de base]
   * @param {number} indexX     [index en X dans la grille du board game]
   * @param {number} indexY     [index en Y dans la grille du board game]
   * @param {BoardGame} board   [coordonnées en pixel du board game]
   **/
  constructor(col, row, grid, indexX, indexY, board) {
    this.indexX = indexX;
    this.indexY = indexY;
    this.board = board;
    this.col = col;
    this.row = row;
    this.grid = grid;
    // scale of each pixel for the piece
    // we can make it bigger or smaller to change the difficulty
    this.scale = 2;
    this.pieceUnit = this.grid.unit * this.scale;

    // random color, for a colored version
    // this.color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
    //   Math.random() * 255
    // )},${Math.floor(Math.random() * 255)})`;

    // default color
    this.color = this.grid.color == "white" ? "black" : "white";

    // pixel coordinates of the piece (instead of grid coordinates)
    this.x =
      this.board.x + this.indexX * this.col * this.grid.unit + this.grid.unit;
    this.y =
      this.board.y + this.indexY * this.row * this.grid.unit + this.grid.unit;
    this.width = this.col * this.grid.unit;
    this.height = this.row * this.grid.unit;

    // negative coordinates
    this.negativeCoordinates = {
      x: 0,
      y: 0,
    };
    // original coordinates (useful for tweening)
    this.bottomCoordinates = {
      x: 0,
      y: 0,
    };

    this.createPositivePiece();
    this.createNegativePiece();
  }

  createPositivePiece() {
    // create a grid of this.col * this.row
    // put 1 or 0 randomly in that grid
    this.piece = [];
    for (let i = 0; i < this.row; i += this.scale) {
      if (i % this.scale == 0) {
        this.piece.push([]);
      }
      for (let j = 0; j < this.col; j += this.scale) {
        if (j % this.scale == 0) {
          this.piece[this.piece.length - 1].push(Math.random() > 0.5 ? 1 : 0);
        }
      }
    }
  }

  createNegativePiece() {
    this.negative = [];
    // just invert the values of the positive piece
    this.piece.forEach((line) => {
      this.negative.push([]);
      line.forEach((col) => {
        this.negative[this.negative.length - 1].push(col == 1 ? 0 : 1);
      });
    });
  }

  draw() {
    this.piece.forEach((line, _y) => {
      line.forEach((col, _x) => {
        // draw only squares if the code is 1
        if (col == 1) {
          const x = this.x + _x * this.pieceUnit;
          const y = this.y + _y * this.pieceUnit;
          this.grid.ctx.fillStyle = this.color;
          this.grid.ctx.fillRect(x, y, this.pieceUnit, this.pieceUnit);
        }
      });
    });
  }

  drawNegative() {
    if (this.negative.length > 0) {
      // draw white background
      //   except if this is Dragging
      if (!this.isDragging && !this.isOverlapping) {
        this.grid.ctx.fillStyle =
          this.grid.color == "white" ? "white" : "black";
        this.grid.ctx.fillRect(
          this.negativeCoordinates.x,
          this.negativeCoordinates.y,
          this.width,
          this.height
        );
      }
      // draw the structure
      this.negative.forEach((line, _y) => {
        line.forEach((col, _x) => {
          if (col == 1) {
            const x = this.negativeCoordinates.x + _x * this.pieceUnit;
            const y = this.negativeCoordinates.y + _y * this.pieceUnit;
            this.grid.ctx.fillStyle = this.color;
            this.grid.ctx.fillRect(x, y, this.pieceUnit, this.pieceUnit);
          }
        });
      });

      //   tween to go back to the original position
      if (!this.isDragging) {
        this.negativeCoordinates.x +=
          (this.bottomCoordinates.x - this.negativeCoordinates.x) * 0.3;
        this.negativeCoordinates.y +=
          (this.bottomCoordinates.y - this.negativeCoordinates.y) * 0.3;
      }
    }
  }

  clickDetection(mousex, mousey) {
    // check if the mouse is inside the piece
    if (
      mousex > this.negativeCoordinates.x &&
      mousex < this.negativeCoordinates.x + this.width &&
      mousey > this.negativeCoordinates.y &&
      mousey < this.negativeCoordinates.y + this.height
    ) {
      return this;
    }
    return false;
  }

  checkOverlap() {
    //check if negativeCoordinates + this.width and this.height is inside the this.x and this.y + this.width and this.height
    if (
      this.negativeCoordinates.x + this.width >= this.x &&
      this.negativeCoordinates.x <= this.x + this.width &&
      this.negativeCoordinates.y + this.height >= this.y &&
      this.negativeCoordinates.y <= this.y + this.height
    ) {
      // SOME FIREBASE IS EXPECTED HERE !!
      console.log("++!!overlap !!");
      this.isOverlapping = true;
      this.bottomCoordinates.x = this.x;
      this.bottomCoordinates.y = this.y;
      return true;
    }
  }
}
