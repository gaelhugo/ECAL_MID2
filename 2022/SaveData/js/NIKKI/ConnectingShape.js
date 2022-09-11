export default class ConnectingShape {
  constructor(c1, c2) {
    this.c1 = c1;
    this.c2 = c2;
  }

  detectConnectedAngle() {
    return Math.atan2(this.c2.y - this.c1.y, this.c2.x - this.c1.x);
  }

  calculateConnectedPoints(ctx) {
    //   heading
    const angle = this.detectConnectedAngle();
    const perp = angle + Math.PI / 2;
    const p1 = {
      x: this.c1.x + Math.cos(perp) * this.c1.radius,
      y: this.c1.y + Math.sin(perp) * this.c1.radius,
    };
    const perp2 = perp + Math.PI;
    const p2 = {
      x: this.c1.x + Math.cos(perp2) * this.c1.radius,
      y: this.c1.y + Math.sin(perp2) * this.c1.radius,
    };
    const p3 = {
      x: this.c2.x + Math.cos(perp) * this.c2.radius,
      y: this.c2.y + Math.sin(perp) * this.c2.radius,
    };
    const p4 = {
      x: this.c2.x + Math.cos(perp2) * this.c2.radius,
      y: this.c2.y + Math.sin(perp2) * this.c2.radius,
    };
    return { p1, p2, p3, p4 };
  }

  draw(ctx) {
    const { p1, p2, p3, p4 } = this.calculateConnectedPoints(ctx);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.fill();
    ctx.closePath();
  }

  dist(c1, c2) {
    return Math.sqrt(Math.pow(c2.x - c1.x, 2) + Math.pow(c2.y - c1.y, 2));
  }
}
