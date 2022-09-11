import Cell from "./Cell";

export default class Dancer {
  constructor(x, y) {
    this.offsetX = 0;
    this.offsetY = 145;
    this.x = x;
    this.y = y + this.offsetY;
    //
    this.showLine = false;
    this.lineWidth = 1;
    this.skeleton = {};

    this.setup();
  }

  setup() {
    // FOOT L
    this.skeleton["footL"] = new Cell(this.x - 30, this.y);
    // KNEE L
    this.skeleton["kneeL"] = new Cell(0, -60, 10, this.skeleton["footL"]);
    // HIBS L
    this.skeleton["hibsL"] = new Cell(0, -60, 10, this.skeleton["kneeL"]);
    // HIBS R
    this.skeleton["hibsR"] = new Cell(60, 0, 10, this.skeleton["hibsL"]);
    // FOOT R
    this.skeleton["footR"] = new Cell(this.x + 30, this.y);
    // KNEE R
    this.skeleton["kneeR"] = new Cell(0, -60, 10, this.skeleton["footR"]);
    // PLEXUS
    this.skeleton["plexus"] = new Cell(30, -100, 10, this.skeleton["hibsL"]);
    // HEAD
    this.skeleton["head"] = new Cell(0, -50, 20, this.skeleton["plexus"]);
    // SHOULDER R
    this.skeleton["shouldR"] = new Cell(30, -10, 10, this.skeleton["plexus"]);
    // ELB R
    this.skeleton["elbR"] = new Cell(0, 60, 10, this.skeleton["shouldR"]);
    // WRIST R
    this.skeleton["wristR"] = new Cell(0, 50, 10, this.skeleton["elbR"]);
    // SHOULDER L
    this.skeleton["shouldL"] = new Cell(-30, -10, 10, this.skeleton["plexus"]);
    // ELB L
    this.skeleton["elbL"] = new Cell(0, 60, 10, this.skeleton["shouldL"]);
    // WRIST L
    this.skeleton["wristL"] = new Cell(0, 50, 10, this.skeleton["elbL"]);
  }

  draw(ctx, showline) {
    const keys = Object.keys(this.skeleton);
    keys.forEach((item) => {
      this.skeleton[item].update();
      this.skeleton[item].draw(ctx);
      //   if (item == "head") this.skeleton[item].debug();
    });
    if (this.showLine) {
      //   console.log("showLine");
      ctx.lineWidth = this.lineWidth;
      ctx.beginPath();
      ctx.moveTo(this.skeleton[keys[0]].x, this.skeleton[keys[0]].y);
      ctx.lineTo(this.skeleton[keys[1]].x, this.skeleton[keys[1]].y);
      ctx.lineTo(this.skeleton[keys[2]].x, this.skeleton[keys[2]].y);
      ctx.lineTo(this.skeleton[keys[11]].x, this.skeleton[keys[11]].y);
      ctx.moveTo(this.skeleton[keys[11]].x, this.skeleton[keys[11]].y);
      ctx.lineTo(this.skeleton[keys[6]].x, this.skeleton[keys[6]].y);
      ctx.lineTo(this.skeleton[keys[8]].x, this.skeleton[keys[8]].y);
      ctx.moveTo(this.skeleton[keys[8]].x, this.skeleton[keys[8]].y);
      ctx.lineTo(this.skeleton[keys[3]].x, this.skeleton[keys[3]].y);
      ctx.lineTo(this.skeleton[keys[5]].x, this.skeleton[keys[5]].y);
      ctx.lineTo(this.skeleton[keys[4]].x, this.skeleton[keys[4]].y);
      ctx.moveTo(this.skeleton[keys[3]].x, this.skeleton[keys[3]].y);
      ctx.lineTo(this.skeleton[keys[2]].x, this.skeleton[keys[2]].y);
      ctx.moveTo(this.skeleton[keys[13]].x, this.skeleton[keys[13]].y);
      ctx.lineTo(this.skeleton[keys[12]].x, this.skeleton[keys[12]].y);
      ctx.lineTo(this.skeleton[keys[11]].x, this.skeleton[keys[11]].y);
      ctx.moveTo(this.skeleton[keys[10]].x, this.skeleton[keys[10]].y);
      ctx.lineTo(this.skeleton[keys[9]].x, this.skeleton[keys[9]].y);
      ctx.lineTo(this.skeleton[keys[8]].x, this.skeleton[keys[8]].y);
      ctx.stroke();
      ctx.closePath();
    }
  }
}
