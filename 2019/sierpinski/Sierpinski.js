var center;
var master;
var scaling = 1;
var hasMoved = false;
var DEBUG = false;


function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  center = {'x': windowWidth / 2, 'y': windowHeight / 2};
  master = new Triangle(0, 0, windowHeight / 2);
}

function draw() {
  background(200);
  push();
  translate(center.x, center.y);
  scale(scaling);
  master.draw();
  pop();
}

function keyPressed() {
  // A
  if (keyCode === 65) {
    master.add(new Triangle(0, 0, windowHeight / 2));
  }
  redraw();
}

function mouseClicked() {
  if (!hasMoved) {
    master.split();
    redraw();
  } else {
    hasMoved = false;
  }
}
// pour déplacer la scène
function mouseDragged(e) {
  hasMoved = true;
  center.x += e.movementX;
  center.y += e.movementY;
  redraw();
}

function mouseWheel(e) {
  scaling += e.delta / 1000;
  redraw();
}
