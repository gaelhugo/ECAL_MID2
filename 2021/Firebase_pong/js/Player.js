class Player {
  constructor(x, y, w, h, ctx, id) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = "white";
    this.ID = id;

    this.speed = 20;
    this.direction = 0;
  }

  show() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    this.ctx.closePath();
  }

  move() {
    this.y += this.speed * this.direction;

    if (this.y - this.h / 2 < 0) {
      this.y = this.h / 2;
    }
    if (this.y + this.h / 2 > window.innerHeight) {
      this.y = window.innerHeight - this.h / 2;
    }
  }

  detect(ball) {
    //si la ball est touchée, changer sa ball.SPEEDX
    if (
      this.ID == 2 &&
      ball.speedX > 0 &&
      ball.x + ball.r > window.innerWidth - this.w &&
      ball.y > this.y - this.h / 2 &&
      ball.y < this.y + this.h / 2
    ) {
      ball.x = window.innerWidth - this.w;
      ball.speedX *= -1;
      console.log("change orientation 1");
    } else if (
      this.ID == 1 &&
      ball.speedX < 0 &&
      ball.x - ball.r < this.w &&
      ball.y > this.y - this.h / 2 &&
      ball.y < this.y + this.h / 2
    ) {
      ball.x = this.w;
      ball.speedX *= -1;
      console.log("change orientation 2");
    } else if (ball.speedX != 0 && (ball.x < 0 || ball.x > window.innerWidth)) {
      //if (!ball.hasReset) ball.reset();
      // 4 cas de figure à vérifier

      //1. --> this.ID == 1 && ball.x< 0 --> loose
      //2. --> this.ID == 1 && ball.x> window.innerWidth --> send Firebase
      //3. --> this.ID == 2 && ball.x<0 --> send Firebase
      //4 --> this.ID == 2 && ball.x> window.innerWidth --> loose
      const data = {
        vitesseX: ball.speedX,
        vitesseY: ball.speedY,
        y: ball.y,
        id: this.ID,
      };
      // LOOSE CONDITION
      if (
        (this.ID == 1 && ball.x < 0) ||
        (this.ID == 2 && ball.x > window.innerWidth)
      ) {
        // console.log("LOOSE");
        if (!ball.hasReset) ball.reset();
      }

      if (
        (this.ID == 2 && ball.x < 0) ||
        (this.ID == 1 && ball.x > window.innerWidth)
      ) {
        // console.log("SEND TO FIREBASE");

        SEND_MESSAGE("PONG_GAEL/POSITION", data);
        ball.hide();
      }
    }
  }
}
