
function Triangle(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.rotation = 0;
  this.subTriangles = [];
  this.exoCenters = [];
  this.direction = 2;
  this.slaveTriangles = [];
  this.translation = {'x': 0, 'y': 0};

  // nouvelle méthode pour créer un triangle équilatéral
  // on relie 3 points sur un même cercle
  // chacun de ces points répartis à 60° d'interval
  // on décale de -90° (-Math.PI/2) juste pour avoir le sommet en haut
  //--> stockages des 3 points d'un triangle dans un tableau points
  this.points = [];
  for (let val = 0; val < 3; val++) {
    this.points.push({
      'x': this.r * Math.cos(val / 3 * Math.PI * 2 - Math.PI / 2) + this.x,
      'y': this.r * Math.sin(val / 3 * Math.PI * 2 - Math.PI / 2) + this.y
    });
  }
  // on récupère le centre de ce Triangle
  // le centre d'équilibre d'un triangle est appelé centroid
  this.centroid = {
    'x': (this.points[0].x + this.points[1].x + this.points[2].x) / 3,
    'y': (this.points[0].y + this.points[1].y + this.points[2].y) / 3
  };
  // on récupère les milieux des segments
  // chaque milieu de segment étant un point composant les triangles subdivisés
  this.newPoints = [];
  for (let i = 0; i < 3; i++) {
    let next = (i < 2) ? i + 1 : 0;
    let xDist = this.points[next].x - this.points[i].x;
    let yDist = this.points[next].y - this.points[i].y;
    let dist = this.dist(
        this.points[i].x, this.points[i].y, this.points[next].x,
        this.points[next].y);
    this.newPoints.push({
      'x': this.points[i].x + xDist * 0.5,
      'y': this.points[i].y + yDist * 0.5
    });
  }
  // on calcule les centres des triangles subdivisés
  let c1 = {
    'x': (this.newPoints[0].x + this.points[1].x + this.newPoints[1].x) / 3,
    'y': (this.newPoints[0].y + this.points[1].y + this.newPoints[1].y) / 3
  };
  let c2 = {
    'x': (this.newPoints[1].x + this.points[2].x + this.newPoints[2].x) / 3,
    'y': (this.newPoints[1].y + this.points[2].y + this.newPoints[2].y) / 3
  };
  let c3 = {
    'x': (this.newPoints[2].x + this.points[0].x + this.newPoints[0].x) / 3,
    'y': (this.newPoints[2].y + this.points[0].y + this.newPoints[0].y) / 3
  };
  this.nextCenters = [c1, c2, c3];
  // on calcule le nouveau rayon des triangles subdivisés
  this.nextRayon = c1.y - this.newPoints[0].y;
  // chaque triangle master possède 3 exos triangles
  // dont les centres sont perpendiculaires à chaque côté
  this.getExoCenters();
};

Triangle.prototype.getExoCenters = function() {
  for (let i = 0; i < 3; i++) {
    let xDist = this.newPoints[i].x - this.centroid.x;
    let yDist = this.newPoints[i].y - this.centroid.y;
    this.exoCenters.push({
      'x': this.translation.x + this.centroid.x + 2 * xDist,
      'y': this.translation.y + this.centroid.y + 2 * yDist
    });
  };
};

Triangle.prototype.split = function() {
  // si le triangle master possède 1 ou plusieurs exo triangle
  // on split les exotriangles
  // (par récurrence, uniquement le dernier triangle se subdivise)
  if (this.slaveTriangles.length != 0) {
    for (let slave of this.slaveTriangles) {
      slave.split();
    }
  } else {
    // si le triangle en cours ne possède pas de subdivision
    // on le subdivise
    if (this.subTriangles.length == 0) {
      this.subTriangles.push(new Triangle(
          this.nextCenters[0].x, this.nextCenters[0].y, this.nextRayon));
      this.subTriangles.push(new Triangle(
          this.nextCenters[1].x, this.nextCenters[1].y, this.nextRayon));
      this.subTriangles.push(new Triangle(
          this.nextCenters[2].x, this.nextCenters[2].y, this.nextRayon));
    } else {
      // sinon, on subdivise les triangles enfants
      for (let subtriangle of this.subTriangles) {
        subtriangle.split();
      }
    }
  }
};

Triangle.prototype.draw = function() {
  push();

  rotate(this.rotation);

  if (this.subTriangles.length != 0) {
    for (let subtriangle of this.subTriangles) {
      subtriangle.draw();
    }
  } else {
    fill(0);
    triangle(
        this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y,
        this.points[2].x, this.points[2].y);
  }

  if (DEBUG) {
    this.drawDebug();
  }

  // s'il y a 1 ou des exo triangles, on se déplace en leur centre, et les draw.
  if (this.slaveTriangles.length != 0) {
    for (let slave of this.slaveTriangles) {
      push();
      translate(
          this.exoCenters[this.direction].x, this.exoCenters[this.direction].y);
      slave.draw();
      pop();
    }
  }

  pop();
};

Triangle.prototype.add = function(triangle) {
  if (this.slaveTriangles.length == 0) {
    triangle.rotation = Math.PI;
    // on assigne une direction aléatoire pour la construction du nouveau
    // triangle
    // ----> à remplacer par la valeur d'une touche clavier....
    triangle.direction = this.randomExcept(0, 2, this.direction);
    console.log(triangle.direction);
    this.slaveTriangles.push(triangle);
  } else {
    for (let slave of this.slaveTriangles) {
      slave.add(triangle);
    }
  }
};

/*
--------------------------------------------------------------------------------
Petites fonctions supplémentaires utiles
-> draw Debug -> dessine les cercles inscrits et les axes de construction
-> dist -> calcul la distance entre 2 newPoints
-> randomExcept ->retourne un nombre aléatoire entre 2 valeurs, sauf 1
--------------------------------------------------------------------------------
*/

// JUSTE POUR DEBUG
Triangle.prototype.drawDebug = function() {
  noFill();
  stroke(255, 0, 0)
  ellipse(this.centroid.x, this.centroid.y, 2, 2);
  stroke(255, 255, 0)
  ellipse(this.x, this.y, this.r, this.r);
  //
  for (let point of this.newPoints) {
    ellipse(point.x, point.y, 5, 5);
  }
  for (let center of this.nextCenters) {
    ellipse(center.x, center.y, 2, 2);
  }
  stroke(255, 0, 0)
  w = 0;
  for (let exo of this.exoCenters) {
    line(this.centroid.x, this.centroid.y, exo.x, exo.y);
    text(w, exo.x, exo.y);
    w++;
  }


};

Triangle.prototype.dist = function(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

Triangle.prototype.randomExcept = function(min, max, except) {
  var num = Math.floor(Math.random() * (max - min + 1)) + min;
  return (num === except) ? this.randomExcept(min, max) : num;
};
