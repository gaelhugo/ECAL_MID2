export default class Shape {
  constructor(x, y, sizex, sizey, name) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.origin = { x: x, y: y };
    this.sizex = sizex;
    this.sizey = sizey;
    this.newGoal = { x: this.x, y: this.y };
    this.color = `rgb(${Math.random() * 255},${Math.random() * 10},${
      Math.random() * 255
    })`;

    // // anim
    this.c = {
      x: 0,
      y: 0,
      speedx: Math.random() < 0.5 ? Math.random() : -Math.random(),
      speedy: Math.random() < 0.5 ? Math.random() : -Math.random(),
    };
  }

  updateMotion() {
    this.c.x += this.c.speedx;
    this.c.y += this.c.speedy;
    if (this.c.x + 2 > this.sizex / 2 || this.c.x - 2 < -this.sizex / 2) {
      this.c.speedx *= -1;
    }
    if (this.c.y + 2 > this.sizey / 2 || this.c.y - 2 < -this.sizey / 2) {
      this.c.speedy *= -1;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.save();
    ctx.translate(
      this.x - window.innerWidth / 2,
      this.y - window.innerHeight / 2
    );
    ctx.fillRect(-this.sizex / 2, -this.sizey / 2, this.sizex, this.sizey);

    // // demo motion
    this.updateMotion();
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.c.x, this.c.y, 2, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}
