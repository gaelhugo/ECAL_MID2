export default class Body {
  constructor(ctx, canvas) {
    this.ctx = ctx;

    //cercle exterieur
    this.rayon = 150;
    this.rayonInt = 125;
    this.points = 20;

    this.centre = { x: canvas.width / 2, y: canvas.height / 2 };

    this.angleAnimation = 0;
    this.deformation = 1;
    this.distance = 10;

    // this.pointsCercleExterieur = [];
    // for (let i = 0; i < 360; i += angle) {
    //   const x = centre.x + Math.cos(this.radian(i)) * rayon;
    //   const y = centre.y + Math.sin(this.radian(i)) * rayon;
    //   this.pointsCercleExterieur.push({ x: x, y: y });
    // }

    // // cercle interieur
    // this.pointsCercleInterieur = [];
    // for (let i = 0; i < 360; i += angle) {
    //   const x = centre.x + Math.cos(this.radian(i + demiAngle)) * rayonInt;
    //   const y = centre.y + Math.sin(this.radian(i + demiAngle)) * rayonInt;
    //   this.pointsCercleInterieur.push({ x: x, y: y });
    // }

    // faire les lignes exterieur
  }

  draw() {
    //   this.ctx;
    // this.pointsCercleExterieur.forEach((point) => {
    //   this.ctx.beginPath();
    //   this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2, false);
    //   this.ctx.fill();
    //   this.ctx.closePath();
    // });
    // this.pointsCercleInterieur.forEach((point) => {
    //   this.ctx.beginPath();
    //   this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2, false);
    //   this.ctx.fill();
    //   this.ctx.closePath();
    // });

    const offset = Math.sin(this.radian(this.angleAnimation)) * this.distance;
    this.angleAnimation += this.deformation;

    this.angle = 360 / this.points;
    this.demiAngle = this.angle / 2;

    this.pointsCercleExterieur = [];
    for (let i = 0; i < 360; i += this.angle) {
      const x =
        this.centre.x + Math.cos(this.radian(i)) * (this.rayon + offset);
      const y =
        this.centre.y + Math.sin(this.radian(i)) * (this.rayon + offset);
      this.pointsCercleExterieur.push({ x: x, y: y });
    }

    // cercle interieur
    this.pointsCercleInterieur = [];
    for (let i = 0; i < 360; i += this.angle) {
      const x =
        this.centre.x +
        Math.cos(this.radian(i + this.demiAngle)) * (this.rayonInt - offset);
      const y =
        this.centre.y +
        Math.sin(this.radian(i + this.demiAngle)) * (this.rayonInt - offset);
      this.pointsCercleInterieur.push({ x: x, y: y });
    }

    this.ctx.beginPath();
    this.pointsCercleExterieur.forEach((point, index) => {
      if (index == 0) {
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(
          this.pointsCercleInterieur[index].x,
          this.pointsCercleInterieur[index].y
        );
      } else {
        this.ctx.lineTo(point.x, point.y);
        this.ctx.lineTo(
          this.pointsCercleInterieur[index].x,
          this.pointsCercleInterieur[index].y
        );
      }
    });
    this.ctx.lineTo(
      this.pointsCercleExterieur[0].x,
      this.pointsCercleExterieur[0].y
    );
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
  }

  radian(angleDegre) {
    return angleDegre * (Math.PI / 180);
  }
}
