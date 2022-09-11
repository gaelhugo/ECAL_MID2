export default class Wheel {
  constructor(parent = null, dist = 0) {
    this.parent = parent;
    this.speed = { x: 0, y: 0 };
    this.angle = { x: 0, y: 0 };
    this.dist = 100;

    if (!this.parent) {
      this.x = 1;
      this.y = 1;
    } else {
      //
      this.x = this.parent.x + dist;
      this.y = this.parent.y + dist;
    }
  }

  update() {
    const deplacementX = Math.cos((this.angle.x * Math.PI) / 180) * this.dist;
    const deplacementY = Math.sin((this.angle.y * Math.PI) / 180) * this.dist;

    // if (this.x) {
    if (!this.parent) {
      this.x = deplacementX;
      this.y = deplacementY;
      // console.log("ok");
    } else {
      //
      this.x = this.parent.x + deplacementX;
      this.y = this.parent.y + deplacementY;
      // console.log("ok");
    }
    // }

    this.angle.x += this.speed.x;
    this.angle.y += this.speed.y;
    // console.log(this.angle);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 20, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
  }
}
