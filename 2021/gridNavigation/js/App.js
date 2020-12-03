// CODE JS
class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    //ctx
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = this.w = window.innerWidth;
    this.canvas.height = this.h = window.innerHeight;
    this.ctx.strokeStyle = "black";

    //mémoire pour stocker tous les players
    this.players = [];
    //player qui suivra les touches clavier
    this.activePlayer = null;
    this.listener();
    this.setup();
  }

  listener() {
    // start interaction clavier
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    // start interaction click
    document.addEventListener("click", this.onClick.bind(this));
  }

  onClick(e) {
    // pour tous les players enregistré
    // on detect si on click dessus avec la souris
    // si c'est le cas, on défini le player "ACTIF"
    this.players.forEach((item, id) => {
      if (item.detect(e.x, e.y)) {
        this.activePlayer = item;
        return;
      }
    });
  }

  onKeyDown(e) {
    //les interactions du clavier pour naviguer dans la grille haut-bas-gauche-droite
    switch (e.key) {
      case "ArrowDown":
        if (
          this.activePlayer &&
          this.activePlayer.position.y < this.grid.rows - 1
        )
          this.activePlayer.position.y++;
        break;
      case "ArrowUp":
        if (this.activePlayer && this.activePlayer.position.y > 0)
          this.activePlayer.position.y--;
        break;
      case "ArrowLeft":
        if (this.activePlayer && this.activePlayer.position.x > 0)
          this.activePlayer.position.x--;
        break;
      case "ArrowRight":
        if (
          this.activePlayer &&
          this.activePlayer.position.x < this.grid.cols - 1
        )
          this.activePlayer.position.x++;
        break;
    }
  }

  setup() {
    // on définit des dimensions de grille (ligne, colonne, dimension, context)
    this.grid = new Grid(8, 8, 60, this.ctx);
    //Ajouter 3 players, sur 3 cases différentes, de 3 couleurs différentes
    this.players.push(
      new Player(0, { x: 0, y: 0 }, this.grid, this.ctx, "violet")
    );
    this.players.push(
      new Player(1, { x: 1, y: 0 }, this.grid, this.ctx, "red")
    );
    this.players.push(
      new Player(2, { x: 2, y: 0 }, this.grid, this.ctx, "black")
    );
    // player par default initié avec le premier player de la liste
    this.activePlayer = this.players[0];
    if (this.draw) this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    //on affiche la grille
    this.grid.show();
    // on affiche tous les players
    this.players.forEach((item, id) => {
      item.show();
    });
    requestAnimationFrame(this.draw.bind(this));
  }
}

window.onload = () => {
  // pour Melanie
  new App();
  // pour SAMUEL
  // new TargetInOrder();
};
