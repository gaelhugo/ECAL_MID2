/**
CREATIVE CODING
---
Kill server : CTRL + C
Start server : npm run start
Start secure server : npm run start-https
Final build : npm run build
---
To generate new certificate for https connection with external device run :
#sh
mkcert 0.0.0.0 localhost 127.0.0.1 yourLocalIP ::1
mv 0.0.0.0+4-key.pem certificate.key
mv 0.0.0.0+4.pem certificate.cert
**/

import Playground from "@onemorestudio/playgroundjs";
import Vector from "@onemorestudio/vectorjs";
import Ball from "./Ball";
import GateKeeper from "./GateKeeper";
import Firebase from "./Firebase";

export default class App extends Playground {
  constructor() {
    super();
    this.handlers = {
      down: this.ondown.bind(this),
      up: this.onup.bind(this),
      data: this.onData.bind(this),
    };
    this.AUTOPILOT = true;
    this.COUNTER = 0;
    this.TOP_COUNT = 5;
    this.LERP = 0.1;
    //ELEMENT
    this.ball = new Ball(new Vector(this.width / 2, this.height / 2));
    // GET PLAYER
    const urlParameter = new URLSearchParams(window.location.search);
    this.ID = urlParameter.get("player");
    if (this.ID == 2) this.ball.hide();

    this.keeper_Left = new GateKeeper(this.width, this.height);
    this.keeper_Right = new GateKeeper(this.width, this.height, true);
    // interaction
    document.addEventListener("keydown", this.handlers.down);
    document.addEventListener("keyup", this.handlers.up);
    this.FIREBASE = new Firebase();
    this.FIREBASE.addEventListener("dataReceived", this.handlers.data);
    this.draw();
  }

  draw() {
    this.ctx.fillStyle = "rgba(0,0,0,0.2)";
    this.ctx.fillRect(0, 0, this.width, this.height);

    if (this.ID == 1) this.keeper_Left.draw(this.ctx);

    if (this.ID == 2) this.keeper_Right.draw(this.ctx);

    if (
      this.ball.checkBordersDualScreen(
        this.width,
        this.height,
        this.ID,
        this.FIREBASE,
        this.COUNTER,
        this.LERP,
        this.ball.maxSpeed
      )
    )
      this.reset();

    if (this.ID == 1 && this.ball.checkLeft(this.keeper_Left)) this.COUNTER++;
    if (this.ID == 2 && this.ball.checkRight(this.keeper_Right)) this.COUNTER++;

    // LEVEL SPEED
    if (this.COUNTER >= this.TOP_COUNT) {
      this.COUNTER = 0;
      this.LERP *= 1.3;
      this.ball.maxSpeed += 2;
    }

    this.ball.update();
    this.ball.draw(this.ctx);

    //interaction
    if (this.up_L) {
      this.keeper_Left.position.y -= 10;
    }
    if (this.down_L) {
      this.keeper_Left.position.y += 10;
    }
    if (this.up_R) {
      this.keeper_Right.position.y -= 10;
    }
    if (this.down_R) {
      this.keeper_Right.position.y += 10;
    }

    // AUTOMATIC PONG
    if (
      this.AUTOPILOT &&
      this.ball.projector.line[1].y >= 0 &&
      this.ball.projector.line[1].y <= this.height
    ) {
      let goal = null;
      if (this.ball.projector.GOLEFT) {
        goal = this.ball.projector.line[1].y - this.keeper_Left.height / 2;
        this.keeper_Left.position.lerp(20, goal, Math.min(1, this.LERP));
      } else {
        goal = this.ball.projector.line[1].y - this.keeper_Right.height / 2;
        this.keeper_Right.position.lerp(
          this.width - 40,
          goal,
          Math.min(1, this.LERP)
        );
      }
    }
    requestAnimationFrame(this.draw.bind(this));
  }
  ondown(e) {
    // A S / UP DOWN
    switch (e.keyCode) {
      case 87:
        //up
        this.up_L = true;
        break;
      case 65:
        //down
        this.down_L = true;
        break;
      case 38:
        //up
        this.up_R = true;
        break;
      case 40:
        //down
        this.down_R = true;
        break;
    }
  }
  onup(e) {
    switch (e.keyCode) {
      case 87:
        //up
        this.up_L = false;
        break;
      case 65:
        //down
        this.down_L = false;
        break;
      case 38:
        //up
        this.up_R = false;
        break;
      case 40:
        //down
        this.down_R = false;
        break;
    }
  }

  onData(val) {
    // check if ball can be seen
    if (parseInt(val.id) != this.ID) {
      this.ball.show();
      this.ball.position.y = val.y;
      this.ball.vel.set(val.vel.x, val.vel.y);
      this.ball.acc.set(val.acc.x, val.acc.y);
      this.ball.maxSpeed = val.ms;
      this.COUNTER = val.counter;
      this.LERP = val.lerp;

      if (this.ID == 1) {
        this.ball.position.x = this.width;
      } else {
        this.ball.position.x = 0;
      }
    }
  }

  reset() {
    this.COUNTER = 0;
    this.LERP = 0.1;
    this.ball.maxSpeed = 5;
    this.ball.position.set(this.width / 2, this.height / 2);
    this.ball.vel.set(0, 0);
    this.ball.acc.set(Math.random(), Math.random());
  }
}
