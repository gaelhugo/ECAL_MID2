// CODE JS
console.log("hello, tout fonctionne");
class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    //ctxx
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = this.w = window.innerWidth;
    this.canvas.height = this.h = window.innerHeight;
    this.mouse = { x: this.w / 2, y: this.h / 2 };

    this.initListener();
    this.setup();
  }
  initListener() {
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  onMouseDown(e) {
    if (
      this.distance(e.x, e.y, this.dragger.x, this.dragger.y) <=
      this.dragger.radius
    )
      this.dragger.isDragging = true;

    if (
      this.distance(e.x, e.y, this.dragger2.x, this.dragger2.y) <=
      this.dragger2.radius
    )
      this.dragger2.isDragging = true;
  }

  onMouseUp(e) {
    this.dragger.isDragging = false;
    this.dragger2.isDragging = false;
  }

  onMouseMove(e) {
    this.mouse.x = e.x;
    this.mouse.y = e.y;
  }

  distance(a, b, c, d) {
    return Math.sqrt(Math.pow(a - c, 2) + Math.pow(b - d, 2));
  }

  setup() {
    this.dragger = new Dragger("red", this.w / 2, this.h / 2, this.ctx, 1);
    this.dragger2 = new Dragger("blue", this.w / 2, this.h / 2, this.ctx, 2);
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    // console.log("draw");
    this.dragger.update(this.mouse);
    this.dragger.show();
    this.dragger2.update(this.mouse);
    this.dragger2.show();
    requestAnimationFrame(this.draw.bind(this));
  }
}

window.onload = () => {
  new App();
};
