class App {
  constructor() {
    console.log("APP EST BIEN LANCE");

    const urlParameter = new URLSearchParams(window.location.search);
    this.ID = urlParameter.get("player");
    console.log(this.ID);
    this.setup();
  }

  setup() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    // Ajouter la balle à l'écran
    //x, y, r, ctx
    this.ball = new Ball(
      window.innerWidth / 2,
      window.innerHeight / 2,
      10,
      this.ctx
    );

    //Ajouter player1
    this.player1 = new Player(
      5,
      window.innerHeight / 2,
      10,
      100,
      this.ctx,
      this.ID
    );

    //Aouter player2
    this.player2 = new Player(
      window.innerWidth - 5,
      window.innerHeight / 2,
      10,
      100,
      this.ctx,
      this.ID
    );

    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));

    this.appHasStarted = false;
    DATABASE.ref("PONG_GAEL/POSITION").on(
      "value",
      this.onValueChanged.bind(this)
    );

    // this.draw();
  }

  draw() {
    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    //  this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    this.ball.move();
    this.ball.show();

    if (this.ID == 1) {
      // montrer player 1
      this.player1.show();
      //déplacer player 1
      this.player1.move();
      this.player1.detect(this.ball);
    }
    if (this.ID == 2) {
      // montrer player 2
      this.player2.show();
      //déplacer player 2
      this.player2.move();
      this.player2.detect(this.ball);
    }

    requestAnimationFrame(this.draw.bind(this));
  }

  onKeyDown(e) {
    console.log(e.keyCode);
    if (e.keyCode == 38) {
      this.player2.direction = -1;
    }
    if (e.keyCode == 40) {
      this.player2.direction = 1;
    }
    if (e.keyCode == 65) {
      this.player1.direction = -1;
    }
    if (e.keyCode == 89) {
      this.player1.direction = 1;
    }
  }
  onKeyUp(e) {
    if (e.keyCode == 38 || e.keyCode == 40) {
      this.player2.direction = 0;
    }
    if (e.keyCode == 65 || e.keyCode == 89) {
      this.player1.direction = 0;
    }
  }

  onValueChanged(snapshot) {
    console.log("snapshot", snapshot.val());
    if (!this.appHasStarted) {
      this.appHasStarted = true;
      this.draw();
    } else {
      this.getTheBall(snapshot.val());
    }
  }

  getTheBall(data) {
    if (this.ID != data.id) {
      this.ball.y = data.y;
      this.ball.speedX = data.vitesseX;
      this.ball.speedY = data.vitesseY;

      // ??? X
      if (this.ID == 1) {
        this.ball.x = window.innerWidth;
      } else if (this.ID == 2) {
        this.ball.x = 0;
      }
      console.log("BALL X", this.ball.x);
    }
  }
}

window.onload = () => {
  new App();
};
