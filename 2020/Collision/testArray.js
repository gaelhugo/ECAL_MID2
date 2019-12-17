// GOOD LUCK
//
// Créér l'Objet TILE avec ses propriétés :
// dimensions (w,h), couleur (dispaly), id, rotationState (0), )
//
// Créér un Tableau des TILES (placer les TILES sur une grille)
//
// Créér un Tableau LevelDesign, comptant les TILES et définissant :
// rotationState, linkedTo, (ce qui différencie les Levels)
// avec leurs Propriétés dans chaque Niveau
// Exemple (Niveau 1 = Index 0 du Leveldesign)

// QUESTIONS :
// lignes 215-222 (connect ray à tile? bind ?)

// PROCHAINES ETAPES :
// Clarifier Objet Ray
// Changement du rotationState lorsque Balle/Ray entre
// boolean touched ?
// Get tile.rotationState in Ray ?
// Changement direction Ray en fonction du rotationState
// en collision avec Tile
// Ajout linkedTo dans les paramètres levelDesign



// firebase
let database;
let donnees;
let UID;

// tableau tiles, qui place les Objets Tile
let tiles = [9];

let ray;



// permet de setter le level 0 au début
let activeLevel = 0;

let iphoneWidth = 0;

let d;



// tableau levelDesign,
// qui configure les propriété des tiles à chaque niveau
// Ajouter linkedTo
let levelDesign = [
    [ //level 0
        { rotation: 0 }, { rotation: 0 }, { rotation: 0 }, { rotation: 90 }, { rotation: 0 },
        { rotation: 0 }, { rotation: 0 }, { rotation: 0 }, { rotation: 0 }
    ],
    [ //level 1
        { rotation: 0 }, { rotation: 45 }, { rotation: 225 }, { rotation: 45 },
        { rotation: 0 }, { rotation: 0 }, { rotation: 90 }, { rotation: 135 },
        { rotation: 0 }
    ],
    [ // level 2
        { rotation: 225 }, { rotation: 180 }, { rotation: 180 }, { rotation: 0 },
        { rotation: 45 }, { rotation: 90 }, { rotation: 45 }, { rotation: 0 },
        { rotation: 135 }
    ]
];

//__________________________________________SETUP

function setup() {
  console.log(windowWidth, windowHeight);
  createCanvas(windowWidth, windowHeight);

  database = firebase.database();
  UID = '_' + Math.random().toString(36).substr(2, 9);
  addDatabaseListener();

  // Tableau pour positionner les Tiles en grille de 3 sur 3
  let index = 0;
  for (var y = height / 6; y < height; y += height / 3) {
    for (var x = height / 6; x < height; x += height / 3) {
      tiles[index++] = new Tile(x, y, 0, 0);
    }

    ray = new Ray();
  }


  // permet de sélectionner le bon level au setup()
  setLevel();
}

//__________________________________________SETUP FUNCTIONS

// fonction pour choisir le level
function setLevel() {
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    tiles[i].rotation = radians(levelDesign[activeLevel][i].rotation);
    // ajouter le paramètre linkedTo, qui lie la
    // rotation d'une tile à une autre pendant le jeu
  }
}



//__________________________________________DRAW

function draw() {
  background(0);
  // Dessin des Tiles d'après nombre dans le tableau tiles[]
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].display();
  }


  ray.checkTiles();
  ray.path();
  ray.display();


  // for (var i = 0; i < tiles.length; i++) {
  //     tiles[i].rotate(ray.x - iphoneWidth, ray.y);
  // }
}



//__________________________________________TILE
class Tile {
  // propriétés de l'Objet Tile (position, taille, rotation)
  constructor(x, y, rotation, rotationState) {
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.rotationState = 0;

    this.width = 30;
    this.height = 60;
    this.col = color(255);
    this.hasRotate = false;

    this.p = {x: 0, y: 0};
  }

  // fonction de dessin de l'Objet Tile (apparence)
  display() {
    // new rect (rotation center)
    fill(0, 255, 0);
    // Debug rect_centre de rotation
    // rect(-this.width/2, -this.height/2, this.width, this.height);
    let off_x = this.x;  //+ this.width / 2;
    let off_y = this.y;  // + this.height / 2;

    push();
    translate(off_x, off_y);
    rotate(this.rotation);
    // rect blanc
    fill(this.col);
    stroke(255);
    strokeWeight(1);
    rectMode(CENTER);
    rect(-this.width / 2, 0, this.width, this.height);
    // rect noir
    fill(0);
    rectMode(CENTER);
    rect(this.width / 2, 0, this.width, this.height);
    pop();

    // stroke('purple');
    // strokeWeight(50);
    // point(this.p.x, this.p.y);
  }



  rotateOnClick() {
    var d = dist(mouseX, mouseY, this.x, this.y);

    if (this.rotationState < 7) {
      this.rotationState++;
    } else {
      this.rotationState = 0;
    }
    // console.log(this.rotationState);


    if (d < this.width) {
      // color debug
      // this.col = color(255,0,0);
      // now same with rotation

      // rotation 90 degrees at click
      // 4 different rotationState
      // this.rotation += radians(90);

      // rotation 45 degrees
      // 7 different rotationState
      this.rotation += radians(45);
    }
  }

  // rotate(goalX, goalY) {
  //   d = dist(goalX, goalY, this.x + this.width / 2, this.y + this.height /
  //   2);
  //
  //   // Comment faire pour changer le rotationState propre à chaque Tile ?
  //   // Comment enregistrer ces données ?
  //   // Constructeur du tableau levelDesign ou non ?
  //   // Comment mettre en place le tableau levelDesign ?
  //
  //
  //   if (this.rotationState < 7) {
  //     this.rotationState++;
  //   } else {
  //     this.rotationState = 0;
  //   }
  //
  //   let firsttime = true;
  //
  //
  //   if (d <= 1 && d > 0) {
  //     if (firsttime == true) {
  //       this.hasRotate = !this.hasRotate;
  //       firsttime = false;
  //     }
  //   } else {
  //     firsttime = true;
  //   }
  //
  //   if (this.hasRotate == false && firsttime == false) {
  //     this.rotation += radians(45);
  //     firsttime != firsttime;
  //
  //   } else if (this.hasRotate == true && firsttime == true) {
  //     this.rotation += radians(0);
  //   }
  //
  //   if (firsttime != firsttime) {
  //     console.log('firsttime' + firsttime);
  //   }
  //   if (this.hasRotate != this.hasRotate) {
  //     console.log('hasRotate' + this.hasRotate);
  //   }
  // }
  rotateOnTouch() {
    this.rotation += radians(45);
    this.hasRotate = true;
  }
  contains(ray) {
    const d = (this.x - ray.x) ** 2 + (this.y - ray.y) ** 2;
    if (d <= this.width ** 2) {
      this.col = color(255, 0, 0);
    } else {
      this.col = color(255);
      this.hasRotate = false;
      return false;
    }
    if (d <= this.width ** 2 && !this.hasRotate) {
      this.rotateOnTouch();
      ray.x = this.x;
      ray.y = this.y;
      return true;
    }
  }
}

//__________________________________________RAY

class Ray {
  constructor() {
    this.offset = 30;
    this.start_x = 0;

    this.row1 = windowHeight / 6 + this.offset;
    this.row2 = windowHeight / 6 * 3 + this.offset;
    this.row3 = windowHeight / 6 * 5 + this.offset;

    this.col1 = windowWidth / 6 + this.offset / 2;
    this.col2 = windowWidth / 6 * 3 + this.offset / 2;
    this.col3 = windowWidth / 6 * 5 + this.offset / 2;

    this.x = 0;
    this.y = windowHeight / 2;  // + this.offset;
    this.dirx = 1;
    this.diry = 0;
    this.diameter = 10;

    this.speed = 1;
  }

  checkTiles() {
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      // check distance
      if (tile.contains(this)) {
        // let's rotate tile and change direction following the angle
        const angle = tile.rotation;
        this.dirx = Math.cos(angle + Math.PI);
        this.diry = Math.sin(angle + Math.PI);
      }
    }
  }

  path() {
    this.x += this.dirx * this.speed;
    this.y += this.diry * this.speed;
  }

  display() {
    stroke(255, 255, 0);
    strokeWeight(3);
    noFill();

    // basic move
    // line(this.start_x, this.row2, this.x + this.dirx, this.row2 + this.diry);


    // créér condition qui :
    // fait tourner tile quand ray touche
    // change direction dirx diry de ray selon rotationState de tile
    // ajouter un wait au ray
    // réinitialise la line(new x, new y, new x + dirx, new y + diry)
    // mieux de créér les cas de changement de directioin en fonction
    // du rotationState d'abord ?
    // bind activé/désactivé avec boolean touched ?

    /*if () { //ray touched tile
      touched = true;
    } else {
      touched = false;
    }*/



    fill(255, 255, 0);
    noStroke();
    ellipse(this.x - iphoneWidth, this.y, this.diameter, this.diameter);
  }
}

//__________________________________________INTERACTION FUNCTIONS
// if mouse clicked = rotation
function mouseClicked() {
  for (var i = 0; i < tiles.length; i++) {
    tiles[i].rotateOnClick();
  }
}


// changer cette fonction en fonction permttant d'aller au niveau
// suivant si la balle/ray est arrivé au point final
function keyPressed() {
  console.log('keydown', keyCode);
  activeLevel++;
  if (activeLevel > levelDesign.length - 1) {
    activeLevel = 0;
  }
  setLevel();
}

function send(path, value) {
  const json = {'data': value};
  database.ref(path).set(json);
}

function addDatabaseListener() {
  database.ref('VALUES').on('value', (snapshot) => {
    console.log(snapshot.val());
    donnees = null;  // snapshot.val();
    if (donnees) {
      let receivedUID = donnees.data.uid;

      if (receivedUID == UID) {
        console.log('coucou');

      } else {
        ray.x = donnees.data.ray_x;
        ray.y = donnees.data.ray_y;
        iphoneWidth = donnees.data.iphoneWidth;
      }
    }
  })
}
