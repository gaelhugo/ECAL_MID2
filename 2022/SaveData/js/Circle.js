export default class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.initRadius = r;
    this.radius = 0;
    this.angle = Math.random() * 360;
  }

  update() {
    this.radius =
      this.initRadius +
      Math.cos(this.angle * (Math.PI / 180)) * (this.initRadius / 2);
    // this.x += Math.sin(this.angle * (Math.PI / 180)) / 2;
    this.angle += 4;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
  }
}
