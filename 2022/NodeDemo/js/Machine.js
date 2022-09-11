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
    // this.allWheels["roue1"].speed.x = 1;

    //roue2
    this.allWheels["roue2"] = new Wheel(this.allWheels["roue1"], 50);
    this.allWheels["roue2"].speed.y = 3;
    // this.allWheels["roue2"].speed.y = 2;

    // roue3;
    this.allWheels["roue3"] = new Wheel(this.allWheels["roue2"], 50);
    this.allWheels["roue3"].speed.y = 4;
    // roue4;
    this.allWheels["roue4"] = new Wheel(this.allWheels["roue3"], 50);
    // this.allWheels["roue3"].speed.x = 2;
    this.allWheels["roue4"].speed.y = 5;
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
