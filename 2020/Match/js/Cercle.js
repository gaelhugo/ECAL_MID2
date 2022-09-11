class Cercle {
  constructor(ctx) {
    this.positionx = 0;
    this.positiony = 0;
    this.rayon = 0;
    this.color = 'green';
    this.ctx = ctx;
    this.angle = 0;
  }

  affichage() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    // this.ctx.rect(x+(size*i),y+(size*j),size,size);
    this.ctx.arc(
        this.positionx, this.positiony, this.rayon, 0, Math.PI * 2, true);
    this.ctx.fill();
    // this.ctx.stroke();
    this.ctx.closePath();
  }

  anime(i) {
    this.angle++;
    const radian = (this.angle + i * mouseX / 100) * Math.PI / 180;
    const sin = Math.sin(radian);
    this.rayon = Math.abs(sin * 6);
  }
}
