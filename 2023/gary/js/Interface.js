import Letters from "./Letters";
export default class Interface {
  /**
   *
   * @param {*} x     [index du positionnement en x de l'interface]
   * @param {*} y     [index du positionnement en y de l'interface]
   * @param {*} grid  [reference à la grille de base]
   * @param {*} align  [option pour dire si l'interface s'aligne à droite ou à gauche]
   */
  constructor(x, y, grid, align = "left") {
    this.x = x;
    this.y = y;
    this.grid = grid;
    this.align = align;
    // in grid units, defaut size of the interface (the width of the text interface)
    this.default_size = 21;
    // initialize the letters tool, that will give us the code for each letter
    this.lettersTool = new Letters();
    this.setup();
  }
  setup() {
    // create the white background positioning
    this.background = {
      x: this.x * this.grid.unit + this.grid.x,
      y: this.y * this.grid.unit + this.grid.y,
    };
  }

  set text(text) {
    // get each letter in an array for a given text
    this.letters_from_text = text.split("");
  }

  draw() {
    // draw the background rectangle with outline
    this.grid.ctx.fillStyle = this.grid.color;
    this.grid.ctx.beginPath();
    this.grid.ctx.rect(
      this.background.x,
      this.background.y,
      this.default_size * this.grid.unit,
      this.grid.unit * 5
    );
    this.grid.ctx.fill();
    this.grid.ctx.lineWidth = 1;
    this.grid.ctx.strokeStyle = this.grid.color == "white" ? "black" : "white";
    this.grid.ctx.stroke();
    this.grid.ctx.closePath();

    // draw the text
    let offset = 0;
    this.letters_from_text.forEach((letter, index) => {
      // get the code
      const code = this.lettersTool.get(letter);
      //   offset for each letter (because each letter is 4 units wide + 1 space)
      offset = index * 5;
      //make the font half the size of the grid unit, otherwise it's too big
      const fontUnit = this.grid.unit / 2;
      code.forEach((line, indexY) => {
        line.forEach((col, indexX) => {
          //draw only black squares if the code is 1
          if (col === 1) {
            // Calculate the position of each "pixel" for each letter
            const x =
              this.background.x + (indexX + 2) * fontUnit + offset * fontUnit;
            const y = this.background.y + (indexY + 2) * fontUnit;
            this.grid.ctx.fillStyle =
              this.grid.color == "white" ? "black" : "white";
            this.grid.ctx.fillRect(x, y, fontUnit, fontUnit);
          }
        });
      });
    });

    // just incase the word is longer than the default size, we need to update the default size
    this.default_size = Math.ceil(offset / 2) + 4;
    if (this.align === "right") {
      this.x = this.grid.nombreDeColonnes - this.default_size - 2;
      this.background.x = this.x * this.grid.unit + this.grid.x;
    }
  }
}
