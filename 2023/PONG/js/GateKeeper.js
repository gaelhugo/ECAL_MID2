import Vector from "@onemorestudio/vectorjs";
export default class GateKeeper {
  constructor(w, h, r = false) {
    this.position = new Vector(r ? w - 40 : 20, h / 2);
    this.height = 100;
    this.width = 20;
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
