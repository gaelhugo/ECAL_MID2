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
    this.button = new Button(this.w / 2, this.h / 2, 50, 50, this.ctx);
    //FB
    //listener
    DATABASE.ref("COLOR_CHANGE").on("value", (snapshot) => {
      if (!this.appHasStarted) {
        this.button.changeColor(snapshot.val());
        this.draw();
        this.appHasStarted = true;
      } else {
        const value = snapshot.val();
        this.button.changeColor(value);
      }
    });

    // this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.button.show();
    // console.log("draw");
    requestAnimationFrame(this.draw.bind(this));
  }
}

window.onload = () => {
  new App();
};
