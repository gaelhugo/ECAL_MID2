import Piece from "./Piece";
import BottomPiecesStock from "./BottomPiecesStock";
export default class BoardGame {
  /**
   *
   * @param {*} x         [index du placement du board en x]
   * @param {*} y         [index du placement du board en y]
   * @param {*} structure [structure du board en [col, row, unité hor, unité vert] ]
   * @param {*} grid      [ref de la grille de base]
   */
  constructor(x, y, structure, grid) {
    this.x = x;
    this.y = y;
    this.grid = grid;
    // structure of the game
    this.structure = structure;
    // background data
    // (the rectangle that contains all pieces)
    this.background = {
      x: this.x * this.grid.unit + this.grid.x,
      y: this.y * this.grid.unit + this.grid.y,
      width: (this.structure[0] * this.structure[2] + 2) * this.grid.unit,
      height: (this.structure[1] * this.structure[3] + 2) * this.grid.unit,
    };
    // pieces
    this.pieces = [];
    this.createPieces();
    // create bottom interface
    // the bottom collection of pieces
    const bottom_height = this.grid.nombreDeLignes - this.structure[3] - 2;
    this.bottom = new BottomPiecesStock(0, bottom_height, this.grid);
    // we share the pieces with the bottom class
    this.bottom.pieces = this.pieces;
  }

  // function to create the pieces
  // and store them in the pieces array
  // it uses the structure of the game
  createPieces() {
    let w = 0;
    for (let i = 0; i < this.structure[0]; i++) {
      for (let j = 0; j < this.structure[1]; j++) {
        this.pieces.push(
          new Piece(
            this.structure[2],
            this.structure[3],
            this.grid,
            i,
            j,
            this.background
          )
        );
      }
    }
  }

  draw() {
    // draw a basic rectangle for the background
    this.grid.ctx.strokeStyle = this.grid.color == "white" ? "black" : "white";
    this.grid.ctx.strokeRect(
      this.background.x,
      this.background.y,
      this.background.width,
      this.background.height
    );
    // draw the pieces in place
    this.pieces.forEach((piece, index) => {
      //draw the outline of the piece
      this.grid.ctx.setLineDash([5, 10]);
      this.grid.ctx.strokeRect(piece.x, piece.y, piece.width, piece.height);
      //remove dash
      this.grid.ctx.setLineDash([]);
      // draw ony the positive piece
      piece.draw();
    });

    // draw the bottom collection
    this.bottom.draw();
  }
}
