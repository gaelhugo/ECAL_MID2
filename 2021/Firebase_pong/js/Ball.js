class Ball {
  constructor(x, y, r, ctx) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.speedX = 0;
    this.speedY = 0;
    this.color = "white";
    this.ctx = ctx;
    this.hasReset = false;
    this.init();
    console.log("BALL IS READY");
  }

  init() {
    this.speedX = 8 * (Math.random() > 0.5 ? 1 : -1);
    this.speedY = 8 - Math.random() * 16;
  }

  show() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    this.ctx.fill();
    this.ctx.closePath();
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.y > window.innerHeight || this.y < 0) {
      this.speedY *= -1;
    }

    // if (this.x > window.innerWidth || this.x < 0) {
    //   this.speedX *= -1;
    //   //   console.log("LOOOSE");
    // }
  }

  reset() {
    this.hasReset = true;
    const message = document.getElementById("message");
    message.textContent = "FAIL !";
    this.speedX = 0;
    this.speedY = 0;
    setTimeout(() => {
      this.hasReset = false;
      message.textContent = "";
      this.x = window.innerHeight / 2;
      this.y = window.innerWidth / 2;
      this.init();
    }, 2000);
  }

  hide() {
    this.speedX = 0;
    this.speedY = 0;
    this.x = -50;
    this.y = -50;
  }
}
