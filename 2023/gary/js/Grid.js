/**
 * MAIN GRID CLASS
 */

export default class Grid {
  /**
   * @param {number} size                   [taille d'une cellule de la grille]
   * @param {CanvasRenderingContext2D} ctx  [canvas context]
   * @param {string} color                  [couleur de fond]
   **/
  constructor(size, ctx, color) {
    this.pixelRatio = window.devicePixelRatio || 1;
    this.unit = size;
    this.ctx = ctx;
    this.color = color;
    this.bottomIndex = null;
    this.x = 0;
    this.y = 0;
    this.setup();
  }
  setup() {
    // how many rows and columns
    this.nombreDeColonnes = Math.floor(
      (window.innerWidth * this.pixelRatio) / this.unit
    );
    this.nombreDeLignes = Math.floor(
      (window.innerHeight * this.pixelRatio) / this.unit
    );
    // center the grid
    this.x =
      (window.innerWidth * this.pixelRatio -
        this.nombreDeColonnes * this.unit) /
      2;
    this.y =
      (window.innerHeight * this.pixelRatio - this.nombreDeLignes * this.unit) /
      2;
    // create an array of cells
    this.cells = [];
    for (let i = 0; i < this.nombreDeLignes; i++) {
      for (let j = 0; j < this.nombreDeColonnes; j++) {
        this.cells.push({
          x: this.x + j * this.unit,
          y: this.y + i * this.unit,
          width: this.unit,
          height: this.unit,
        });
      }
    }
  }
  draw() {
    this.ctx.strokeStyle =
      this.color == "white" ? "rgba(0,0,0,.5)" : "rgba(255,255,255,0.5)";
    this.ctx.lineWidth = 0.25;
    this.cells.forEach((cell, index) => {
      // change the lineWidth if we are in the bottom part of the grid
      if (this.bottomIndex && index >= this.bottomIndex) {
        this.ctx.lineWidth = 1;
      }
      this.ctx.beginPath();
      this.ctx.rect(cell.x, cell.y, cell.width, cell.height);
      this.ctx.stroke();
      this.ctx.closePath();
    });
  }
}
