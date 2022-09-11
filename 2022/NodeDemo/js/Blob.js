import { noise } from "@chriscourses/perlin-noise";

export default class Blob {
  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
    this.precision = 50;
    // this.noise = new noise();
    console.log(noise);
  }

  draw(ctx) {
    const circle = [];
    const fact = 100;
    for (let i = 0; i < 360; i += 360 / this.precision) {
      const x =
        this.center[0] +
        Math.cos((i * Math.PI) / 180) * (this.radius + 100) * noise(i / fact);
      const y =
        this.center[1] +
        Math.sin((i * Math.PI) / 180) * (this.radius + 100) * noise(i / fact);

      circle.push({ x: x, y: y });
    }
    ctx.strokeStyle = "green";
    ctx.beginPath();
    circle.forEach((point, i) => {
      if (i == 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
      //   ctx.beginPath();
      //   ctx.arc(point.x, point.y, 4, 0, Math.PI * 2, false);
      //   ctx.fill();
      //   ctx.closePath();
    });
    ctx.stroke();
    ctx.closePath();
  }
}
