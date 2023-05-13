/**
 * @fileoverview
 * Ceci est le fichier principal de l'application.
 * Il est chargé en premier et initialise l'application.
 * Il contient la classe App qui hérite de Playground, une interface à base de canvas fullscreen.
 * Il initialise les objets de l'application et lance la boucle de rendu. La fonction draw() est appelée à chaque frame.
 *
 * Il y a 4 objets principaux:
 * - Grid: dessine la grille
 * - Interface: dessine les interfaces de l'application
 * - BoardGame: dessine le plateau de jeu
 * - Piece: dessine les pièces
 *
 * En parallèle, il y a une class Letters qui permet de dessiner des lettres en chargeant un fichier de structure JSON
 *
 * L'interaction drag and drop est gérée dans la class BottomPiecesStock.js, elle-même chargée dans BoardGame.js
 * C'est la class qui gère les pièces en bas de l'écran.
 * Les listeners des événements souris sont ajoutés dans cette class. (C'est à partir de là qu'il faudra gérer les appels à Firebase)
 *
 * Chaque pièce est un objet de la class Piece.js
 * Elle contient un tableau qui représente la structure de la pièce ainsi qu'un autre tableau qui en représente la structure négative.
 * Cette class contient également une fonction utiles pour vérifier si la pièce est en collision avec sa partie négative.
 *
 */
import Playground from "@onemorestudio/playgroundjs";
import Grid from "./Grid";
import Interface from "./Interface";
import { testChanger } from "./firebase/database";
import BoardGame from "./BoardGame";
export default class App extends Playground {
  constructor() {
    super();
    // use the RETINA resolution
    this.pixelRatio = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * this.pixelRatio;
    this.canvas.height = window.innerHeight * this.pixelRatio;
    this.canvas.style.width = window.innerWidth + "px";
    this.canvas.style.height = window.innerHeight + "px";
    // unit for the grid (in pixels)
    const GRID_UNIT = 30;
    // main background color
    const COLOR = "black";

    // create grid
    this.grid = new Grid(GRID_UNIT, this.ctx, COLOR);
    // create level text display
    this.level_interface = new Interface(2, 2, this.grid);
    this.level_interface.text = "Level 1";
    // create player text display
    // compute the x position of the player interface based on the right side of the grid +2
    const x = this.grid.nombreDeColonnes - 23;
    this.player_interface = new Interface(x, 2, this.grid, "right");
    this.player_interface.text = "Player 1";
    // BOARD GAME Stucture [n pieces on col, n pieces on row, unit for width, unit for height]
    const structure = [3, 3, 6, 6];
    // CENTER EVERYTHING
    const board_x =
      Math.ceil(this.grid.nombreDeColonnes / 2) -
      Math.ceil((structure[0] * structure[2] + 2) / 2);
    const board_y =
      Math.ceil(this.grid.nombreDeLignes / 2) -
      Math.ceil((structure[1] * structure[3] + 2) / 2);
    // create board game
    this.board_game = new BoardGame(
      board_x,
      board_y,
      structure,
      this.grid,
      this.ctx
    );

    this.draw();
  }

  draw() {
    this.ctx.fillStyle = this.grid.color;
    this.ctx.fillRect(
      0,
      0,
      this.canvas.width * this.pixelRatio,
      this.canvas.height * this.pixelRatio
    );
    this.grid.draw();
    this.level_interface.draw();
    this.player_interface.draw();
    this.board_game.draw();
    requestAnimationFrame(this.draw.bind(this));
  }
}
