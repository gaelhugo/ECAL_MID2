class App {
  constructor() {
    console.log('template ready');

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.w = window.innerWidth;
    this.canvas.height = this.h = window.innerHeight;



    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    this.setup();
  }

  setup() {
    this.draw();
  }
  draw() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    /*
      code here
    */

    requestAnimationFrame(this.draw.bind(this));
  }
};

window.onload = function() {
  new App();
}
