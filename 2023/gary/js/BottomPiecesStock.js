export default class BottomPiecesStock {
  /**
   *
   * @param {*} x [index en X dans la grille ]
   * @param {*} y [index en Y dans la grille ]
   * @param {*} grid [reference à la grille principale]
   */
  constructor(x, y, grid) {
    this.pixelRatio = window.devicePixelRatio || 1;
    this.x = x;
    this.y = y;
    this.grid = grid;
    // define index the coord x,y in grid
    this.index = y * this.grid.nombreDeColonnes + x;
    // share the limit index to the grid so it can update the lineWidth, and create a visual difference.
    this.grid.bottomIndex = this.index;

    // drag piece interaction
    document.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  // When pieces are set, we need to update the coordinates of each piece
  // We need to store coordinates for the negative piece (in a row at the bottom of the grid)
  // We need to store duplicate coordinates of that, to be able to tween the piece back to its original position
  set pieces(_pieces) {
    this._pieces = _pieces;
    this._pieces.forEach((piece, index) => {
      const x =
        this.x * this.grid.unit +
        this.grid.x +
        this.grid.unit +
        index * (piece.width + this.grid.unit);
      const y = this.y * this.grid.unit + this.grid.y + this.grid.unit;
      piece.negativeCoordinates = { x: x, y: y };
      piece.bottomCoordinates = { x: x, y: y };
    });
  }

  draw() {
    this._pieces.forEach((piece, index) => {
      piece.drawNegative();
    });
  }

  // function to detect if the mouse is over a piece
  onMouseDown(e) {
    this._pieces.forEach((piece, index) => {
      if (piece.clickDetection(e.x * this.pixelRatio, e.y * this.pixelRatio)) {
        piece.isDragging = true;
        this.draggablePiece = piece;

        this.offsetPostion = {
          x: e.x * this.pixelRatio - piece.negativeCoordinates.x,
          y: e.y * this.pixelRatio - piece.negativeCoordinates.y,
        };
        return;
      }
    });
  }
  // function to drag the piece
  onMouseMove(e) {
    if (this.draggablePiece) {
      this.draggablePiece.negativeCoordinates.x =
        e.x * this.pixelRatio - this.offsetPostion.x;
      this.draggablePiece.negativeCoordinates.y =
        e.y * this.pixelRatio - this.offsetPostion.y;
    }
  }
  // function to drop the piece if it's over it's own positive value.
  onMouseUp(e) {
    if (this.draggablePiece) {
      this.draggablePiece.checkOverlap();
      this.draggablePiece.isDragging = false;
      this.draggablePiece = null;
    }
  }
}
