class App {
  constructor() {
    console.log('template ready');
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.w = window.innerWidth;
    this.canvas.height = this.h = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    this.vitesseLimace = 3;

    const goal1 = {x: 100, y: 100, id: 1};
    const goal2 = {x: 500, y: 100, id: 2};

    this.allGoals = [goal1, goal2];

    this.positionLimace = {x: 100, y: 600, winID: 1};

    this.setup();
  }

  setup() {
    const urls = ['1.png', '2.png', 'l_1.png'];
    this.allImages = [];
    for (let i = 0; i < urls.length; i++) {
      const img = new Image();
      img.src = urls[i];
      this.allImages.push(img)
    }

    this.draw();
  }

  update() {
    if (!this.positionLimace.win) {
      this.positionLimace.y -= this.vitesseLimace;
    }

    for (let i = 0; i < this.allGoals.length; i++) {
      const goal = this.allGoals[i];

      // check sur le goal1
      if (this.positionLimace.x >= goal.x &&
          this.positionLimace.x + 81 <= goal.x + 81 &&
          this.positionLimace.y <= goal.y) {
        // on touche
        //--> check si c'est la bonne prise
        if (this.positionLimace.winID == goal.id) {
          this.positionLimace.win = true;
          // n'importe quelle action qui montre que t'as réussi.
        }
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    /*
      code here
    */
    this.update();

    this.ctx.drawImage(this.allImages[0], this.goal1.x, this.goal1.y);
    this.ctx.drawImage(this.allImages[1], this.goal2.x, this.goal2.y);

    this.ctx.drawImage(
        this.allImages[2], this.positionLimace.x, this.positionLimace.y);

    requestAnimationFrame(this.draw.bind(this));
  }
};

window.onload = function() {
  new App();
}
