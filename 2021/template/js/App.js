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

    this.setup();
  }

  setup() {
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    console.log("draw");
    requestAnimationFrame(this.draw.bind(this));
  }
}

window.onload = () => {
  new App();
};
