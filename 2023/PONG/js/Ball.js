import Vector from "@onemorestudio/vectorjs";
import Projector from "./Projector";
export default class Ball {
  constructor(center) {
    this.radius = 10;
    this.position = new Vector(center.x, center.y);
    this.vel = new Vector(0, 0);
    this.acc = new Vector(Math.random(), Math.random());
    this.maxSpeed = 7;
    this.visible = true;
    this.projector = new Projector(this);
  }
  update() {
    if (this.visible) {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.position.add(this.vel);
      this.projector.update(this.position, this.vel);
    }
  }

  checkBorders(w, h) {
    if (this.position.x > w - this.radius) {
      this.acc.x *= -1;
      this.vel.x *= -1;
      this.position.x = w - this.radius;
      return true;
    }
    if (this.position.x < this.radius) {
      this.acc.x *= -1;
      this.vel.x *= -1;
      this.position.x = this.radius;
      return true;
    }
    if (this.position.y > h) {
      this.acc.y *= -1;
      this.vel.y *= -1;
      this.position.y = h - this.radius;
    }
    if (this.position.y < 0) {
      this.acc.y *= -1;
      this.vel.y *= -1;
      this.position.y = this.radius;
    }
    return false;
  }

  checkBordersDualScreen(w, h, id, firebase, counter, lerp, ms) {
    // info to send to NEXT SCREEN
    const data = {
      acc: this.acc,
      vel: this.vel,
      y: this.position.y,
      id: id,
      counter: counter,
      lerp: lerp,
      ms: ms,
    };

    if (this.position.x > w) {
      if (parseInt(id) == 1 && this.visible) {
        firebase.send(`positionBall`, data);
        this.acc.set(0, 0);
        this.vel.set(0, 0);
        this.position.set(-50, h / 2);
        this.hide();

        return false;
      } else {
        return true;
      }
    } else if (this.position.x < 0) {
      if (parseInt(id) == 2 && this.visible) {
        firebase.send(`positionBall`, data);
        this.acc.set(0, 0);
        this.vel.set(0, 0);
        this.position.set(w + 50, h / 2);
        this.hide();

        return false;
      } else {
        return true;
      }
    }
    if (this.position.y > h) {
      this.acc.y *= -1;
      this.vel.y *= -1;
      this.position.y = h - this.radius;
    }
    if (this.position.y < 0) {
      this.acc.y *= -1;
      this.vel.y *= -1;
      this.position.y = this.radius;
    }
    return false;
  }

  checkLeft(gateKeeper) {
    if (
      this.position.x - this.radius <
        gateKeeper.position.x + gateKeeper.width &&
      this.position.y > gateKeeper.position.y &&
      this.position.y < gateKeeper.position.y + gateKeeper.height
    ) {
      this.acc.x *= -1;
      this.vel.x *= -1;
      return true;
    }
    return false;
  }

  checkRight(gateKeeper) {
    if (
      this.position.x + this.radius > gateKeeper.position.x &&
      this.position.y > gateKeeper.position.y &&
      this.position.y < gateKeeper.position.y + gateKeeper.height
    ) {
      this.acc.x *= -1;
      this.vel.x *= -1;
      return true;
    }
    return false;
  }

  draw(ctx) {
    if (this.visible) {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, 10, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
      // this.projector.draw(ctx);
    }
  }
  hide() {
    this.visible = false;
  }
  show() {
    this.visible = true;
  }
}
