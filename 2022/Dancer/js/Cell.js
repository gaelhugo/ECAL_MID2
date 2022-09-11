export default class Cell {
  constructor(x, y, r = 10, parent = { x: 0, y: 0 }) {
    this._original = { x: x, y: y };
    this.parent = parent;
    this.deltaX = x;
    this.deltaY = y;
    this.radius = r;
    this.color = "white";
    //
    this.offset = { x: 0, y: 0 };
    this.intensity = { amplitudeX: 0, amplitudeY: 0 };
    this.speed = 1;
    this.angle = 0;
    //
    this.limit = { limitUp: 0, limitDown: 0 };
    this.scale = 1;
    this.isBoomerang = false;
  }
  //   set transform(options) {
  //     this.deltaX = this._original.x;
  //     this.deltaY = this._original.y;
  //     this.limit = null;
  //     this.intensity = {
  //       amplitudeX: options.amplitudeX,
  //       amplitudeY: options.amplitudeY,
  //     };
  //     this.speed = options.speed;
  //     this.angle = options.startAngle;
  //   }

  //   set boomerang(options) {
  //     this.deltaX = 0;
  //     this.deltaY = 0;
  //     this.intensity = {
  //       amplitudeX: options.amplitudeX,
  //       amplitudeY: options.amplitudeY,
  //     };
  //     this.speed = options.speed;
  //     this.angle = options.startAngle;
  //     this.limit = { limitUp: options.limitUp, limitDown: options.limitDown };
  //   }

  update() {
    this.scale = SCALE.scale;
    if (this.isBoomerang) {
      this.deltaX = 0;
      this.deltaY = 0;
    } else {
      this.deltaX = this._original.x * this.scale;
      this.deltaY = this._original.y * this.scale;
    }
    this.offset.x =
      Math.cos((this.angle * Math.PI) / 180) *
      this.intensity.amplitudeX *
      this.scale;
    this.offset.y =
      Math.sin((this.angle * Math.PI) / 180) *
      this.intensity.amplitudeY *
      this.scale;
    this.x = this.parent.x + this.deltaX + this.offset.x;
    this.y = this.parent.y + this.deltaY + this.offset.y;
    this.angle += this.speed;
    if (this.angle >= 360) {
      this.angle = 0;
    }
    if (this.angle <= -360) {
      this.angle = 0;
    }
    if (this.isBoomerang) {
      if (
        Math.abs(this.angle) >= this.limit.limitUp ||
        Math.abs(this.angle) <= this.limit.limitDown
      ) {
        this.speed *= -1;
      }
    }
  }

  debug() {
    console.log(this.parent.x, this.parent.y);
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
  }
}
