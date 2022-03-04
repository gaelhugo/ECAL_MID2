import Wheel from "./Wheel";

export default class Machine {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.setupWheels();
  }

  setupWheels() {
    this.allWheels = {};

    // roue1
    this.allWheels["roue1"] = new Wheel();
    this.allWheels["roue1"].speed = 1;

    //roue2
    this.allWheels["roue2"] = new Wheel(this.allWheels["roue1"], 100);
    this.allWheels["roue2"].speed = 4;

    //roue3
    this.allWheels["roue3"] = new Wheel(this.allWheels["roue2"], 50);
    this.allWheels["roue3"].speed = 10;
  }

  draw(ctx) {
    // console.log("draw");

    ctx.save();
    ctx.translate(this.x, this.y);
    const nomDesRoues = Object.keys(this.allWheels);
    nomDesRoues.forEach((nom) => {
      this.allWheels[nom].update();
      this.allWheels[nom].draw(ctx);
    });
    ctx.restore();
  }
}
