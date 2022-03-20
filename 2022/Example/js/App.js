import Body from "./Body.js";
import * as dat from "./dat.gui.module.js";

export default class App {
  constructor() {
    console.log("APP");
    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.body = new Body(this.ctx, this.canvas);

    this.gui = new dat.GUI();
    const body_control = this.gui.addFolder("body");
    body_control.add(this.body, "rayon", 0, 300);
    body_control.add(this.body, "rayonInt", 0, 300);
    body_control.add(this.body, "points", 3, 360);
    body_control.add(this.body, "distance", 0, 120);
    body_control.add(this.body, "deformation", 0, 20);

    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.body.draw();
    requestAnimationFrame(this.draw.bind(this));
  }
}
