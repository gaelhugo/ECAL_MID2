import Vector from "@onemorestudio/vectorjs";
export default class Projector {
  constructor(master) {
    this.master = master;
    this.lastAngle = 0;
    this.GOLEFT = false;
    this.line = [new Vector(0, 0), new Vector(0, 0)];
  }

  update(position, velocity) {
    /**
     * PROJECTION FOR FUTUR COLLISION WITH VERTICAL LINE @ BOTH KEEPER
     * (40 from the left and the right, should be dynamic if shape updates)
     */
    //init line @ ball position
    this.line[0].set(position);
    // copy velocity
    const vel = velocity.copy();
    // get angle
    const angle = vel.heading();
    // adjust angle for easier condition
    const _angle = (360 - (angle / Math.PI) * 180) % 360;
    let AB = null;
    // get horizontal distance
    if (_angle > 90 && _angle < 270) {
      // go left
      AB = this.master.position.x - 40;
      this.GOLEFT = true;
    } else {
      // go right
      AB = window.innerWidth - 40 - this.master.position.x;
      this.GOLEFT = false;
    }
    // get hypotenus
    const AC = Math.abs(AB / Math.cos(angle));
    // set the distance to the direction vector
    vel.setMag(AC);
    // calculate the destination point
    const direction = Vector.vector_add(position, vel);
    // store it in line
    this.line[1].set(direction);
  }

  draw(ctx) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.line[0].x, this.line[0].y);
    ctx.lineTo(this.line[1].x, this.line[1].y);
    ctx.stroke();
    ctx.closePath();
  }
}
