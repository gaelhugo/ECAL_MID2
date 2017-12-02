'use strict';

class App {
  constructor(c) {
    this.connection = c;
    this.canvas;
    this.ctx;

    this.init();
  }

  init() {
    // let button = document.getElementsByTagName('button')[0];
    // button.addEventListener('click', this.onClick.bind(this));
    this.canvas = document.getElementsByTagName('canvas')[0];
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    // add listeners
    this.canvas.addEventListener('mousedown', this.onDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onUp.bind(this));
    // couleur
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;

    // variables du jeu
    this.cols = 12;
    this.rows = 7;
    this.dist = 100;
    this.allBoules = [];
    this.allBoulesDict = {};
    this.allBoulesVert = [];
    this.allJunctions = {};
    let chance = 2;
    let id = 0;
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (Math.floor(Math.random() * chance) < 1) {
          let b = new Boule(
              x * this.dist, y * this.dist, 35, id, this.ctx,
              this.allBoules.length);
          this.allBoules.push(b);
          this.allBoulesDict[id] = b;
        } else {
          // console.log(id);
        }
        id++;
      }
    }
    // connections horizontales
    for (let i = 0; i < this.allBoules.length; i++) {
      if (this.allBoules[i + 1] != undefined &&
          this.allBoules[i].y == this.allBoules[i + 1].y) {
        let id = i + ',' + (i + 1);
        let junction = new Junction(
            id, this.allBoules[i].x, this.allBoules[i].y,
            this.allBoules[i + 1].x, this.allBoules[i + 1].y, this.ctx);
        junction.connectedBoules.push(
            this.allBoules[i].position, this.allBoules[i + 1].position);
        this.allJunctions[id] = junction;
        this.allBoules[i].dict[id] = junction;
        this.allBoules[i + 1].dict[id] = junction;
      }
    }


    // connections verticales
    // first create a new array organized vertically
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        let id = y * this.cols + x;
        if (this.allBoulesDict[id] != null) {
          this.allBoulesVert.push(this.allBoulesDict[id]);
        }
      }
    }
    // create the vertical connections
    for (let i = 0; i < this.allBoulesVert.length; i++) {
      if (this.allBoulesVert[i + 1] != undefined &&
          this.allBoulesVert[i].x == this.allBoulesVert[i + 1].x) {
        let id = this.allBoulesVert[i].id + ',' + this.allBoulesVert[i + 1].id;
        let junction = new Junction(
            id, this.allBoulesVert[i].x, this.allBoulesVert[i].y,
            this.allBoulesVert[i + 1].x, this.allBoulesVert[i + 1].y, this.ctx);
        junction.connectedBoules.push(
            this.allBoules[i].position, this.allBoules[i + 1].position);
        this.allJunctions[id] = junction;
        this.allBoulesVert[i].dict[id] = junction;
        this.allBoulesVert[i + 1].dict[id] = junction;
      }
    }

    // remove some connections
    let chanceJ = 4;
    for (let junction in this.allJunctions) {
      if (this.allJunctions.hasOwnProperty(junction)) {
        // try to delete
        if (Math.floor(Math.random() * chanceJ) < 1) {
          // check all connected allBoules
          // if they have more that one connections
          let cb = this.allJunctions[junction].connectedBoules;
          for (let i = 0; i < cb.length; i++) {
            // check connection length for that ball
            let b = this.allBoules[cb[i]];
            let connections = Object.keys(b.dict);
            // console.log(connections, connections.length, junction);
            if (connections.length > 1 && b.dict[junction] &&
                this.allJunctions[junction]) {
              // delete this.allJunctions[junction];
              // delete b.dict[junction];
              this.allJunctions[junction].deletable = true;
            } else {
              this.allJunctions[junction].deletable = false;
            }
          }
        }
      }
    }
    for (let junction in this.allJunctions) {
      if (this.allJunctions.hasOwnProperty(junction)) {
        if (this.allJunctions[junction].deletable) {
          // console.log('to delete');
          let cb = this.allJunctions[junction].connectedBoules;
          for (let i = 0; i < cb.length; i++) {
            let b = this.allBoules[cb[i]];
            delete b.dict[junction];
          }
          delete this.allJunctions[junction];
        }
      }
    }


    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.ctx.save();
    this.ctx.translate(this.dist, this.dist);
    for (let junction in this.allJunctions) {
      if (this.allJunctions.hasOwnProperty(junction)) {
        this.allJunctions[junction].draw();
      }
    }
    for (let i = 0; i < this.allBoules.length; i++) {
      this.allBoules[i].draw();
    }
    this.ctx.restore();
    requestAnimationFrame(this.draw.bind(this));
  }

  onDown(e) {}

  onMove(e) {}

  onUp(e) {}
}


class Boule {
  constructor(x, y, r, id, ctx, position) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.ctx = ctx;
    this.id = id;
    this.position = position;
    this.dict = {};
  }
  draw() {
    let d = Object.keys(this.dict);
    this.ctx.strokeStyle = 'black';
    this.ctx.fillStyle = (d.length == 0) ? 'red' : 'white';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();
  }
}

class Junction {
  constructor(id, x, y, x1, y1, ctx) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.x1 = x1;
    this.y1 = y1;
    this.ctx = ctx;
    this.connectedBoules = [];
    this.deletable = false;
  }
  draw() {
    this.ctx.strokeStyle = (this.deletable) ? 'red' : 'black';
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.x1, this.y1);
    this.ctx.stroke();
    this.ctx.closePath();
  }
}


window.onload = function() {
  new App();
};
