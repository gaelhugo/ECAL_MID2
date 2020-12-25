class Dragger {
  constructor(color, x, y, ctx, id) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = 50;
    this.color = color;
    this.isDragging = false;
    const urlParameter = new URLSearchParams(window.location.search);
    this.name = id;
    this.ID = urlParameter.get("player");
    if (id != this.ID) {
      DATABASE.ref("POSITION_CHANGE").on("value", (snapshot) => {
        const value = snapshot.val();
        if (value) {
          this.x = parseInt(value[this.name].x);
          this.y = parseInt(value[this.name].y);
        }
      });
    }
  }

  update(mouse) {
    if (this.isDragging && this.name == this.ID) {
      this.x = mouse.x;
      this.y = mouse.y;
      //-->send to firebase
      this.send();
    }
  }

  show() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.fill();
    this.ctx.closePath();
  }

  send() {
    SEND_MESSAGE("POSITION_CHANGE/" + this.ID, {
      x: this.x,
      y: this.y,
      id: this.ID,
    });
  }
}
