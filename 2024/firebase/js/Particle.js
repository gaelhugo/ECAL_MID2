export default class Particle {
  constructor(x, y, radius, color, emoji) {
    this.x = x;
    this.y = y;
    this.target = { x: x, y: y };
    this.radius = radius;
    this.color = color;
    this.ease = 0.05;
    this.speed = 1 - Math.random() / 1.1;
    this.emoji = emoji;
  }

  easeTo() {
    this.x += (this.target.x - this.x) * this.ease * this.speed;
    this.y += (this.target.y - this.y) * this.ease * this.speed;
  }

  draw(ctx) {
    ctx.font = "12px Arial";
    ctx.beginPath();
    // if (this.emoji) ctx.fillText(this.emoji, this.x, this.y);
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
