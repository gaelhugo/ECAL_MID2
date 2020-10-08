class Button {
  constructor(x, y, w, h, ctx) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.ctx = ctx;
    this.color = "black";
    this.ID = Math.random() * 10;
    document.addEventListener("click", this.send.bind(this));
  }
  show() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  send() {
    SEND_MESSAGE("COLOR_CHANGE", {
      color: `rgb(${Math.round(Math.random() * 255)},0,${Math.round(
        Math.random() * 255
      )})`,
      id: this.ID,
    });
  }

  changeColor(data) {
    if (this.ID != data.id) {
      this.color = data.color;
    }
  }
}
