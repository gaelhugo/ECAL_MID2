let player = null;
let ball = null;
let showBall = true;
let pad1 = null;
let pad2 = null;
function setup() {
  createCanvas(innerWidth, innerHeight);
  noStroke();
  fill(0);
  //identifier le joueur
  const urlParameter = new URLSearchParams(window.location.search);
  player = urlParameter.get("player");
  if (player == 2) {
    showBall = false;
  }
  ball = new Ball(width / 2, height / 2);
  pad1 = new Paddle(0, 0);
  pad2 = new Paddle(width - 15, 0);
}

function draw() {
  background(150);
  //FIREBASE
  if (newValue) {
    if (parseInt(firebaseValue.player) != player) {
      if (player == 1) {
        ball.x = width;
      } else {
        ball.x = 0;
      }
      ball.y = firebaseValue.y;
      ball.speed.x = firebaseValue.speed.x;
      ball.speed.y = firebaseValue.speed.y;
      showBall = true;
    }
    newValue = false;
  }
  
  if (showBall == true) {
    ball.update();
    ball.draw();
    if (player == 1) ball.check(pad1, true);
    if (player == 2) ball.check(pad2);

    if (ball.checkRightLeft(player)) {
      send({ player: player, y: ball.y, speed: ball.speed });
      showBall = false;
      ball.reset();
    }
  }
  if (player == 1) pad1.draw();
  if (player == 2) pad2.draw();
  //KEYS
  if (keyIsDown(DOWN_ARROW)) {
    pad2.y += 10;
  }
  if (keyIsDown(UP_ARROW)) {
    pad2.y -= 10;
  }
  if (keyIsDown(87)) {
    pad1.y -= 10;
  }
  if (keyIsDown(83)) {
    pad1.y += 10;
  }
}

class Paddle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 15;
    this.height = 100;
  }
  draw() {
    rect(this.x, this.y, this.width, this.height);
  }
}

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.speed = { x: random(-5, 5), y: random(-5, 5) };
  }
  checkTopBottom() {
    if (this.y - this.radius <= 0 || this.y + this.radius > height) {
      this.speed.y *= -1;
    }
  }
  checkRightLeft(player) {
    if (this.x - this.radius < 0 && this.speed.x < 0) {
      if (player == 1) {
        this.reset();
      } else {
        return true;
      }
    }
    if (this.x + this.radius > width && this.speed.x > 0) {
      if (player == 2) {
        this.reset();
      } else {
        return true;
      }
    }
    return false;
  }
  check(paddle, addWidth = false) {
    if (addWidth) {
      if (
        this.x - this.radius < paddle.x + paddle.width &&
        this.y >= paddle.y &&
        this.y <= paddle.y + paddle.height &&
        this.speed.x < 0
      ) {
        this.x = paddle.x + paddle.width;
        this.speed.x *= -1;
      }
    } else {
      if (
        this.x + this.radius > paddle.x &&
        this.y >= paddle.y &&
        this.y <= paddle.y + paddle.height &&
        this.speed.x > 0
      ) {
        this.speed.x *= -1;
        this.x = paddle.x - this.radius;
      }
    }
  }
  update() {
    this.x += this.speed.x;
    this.y += this.speed.y;
    this.checkTopBottom();
  }
  draw() {
    ellipse(this.x, this.y, this.radius);
  }
  reset() {
    this.speed = { x: random(-5, 5), y: random(-5, 5) };
    this.x = width / 2;
    this.y = height / 2;
  }
}


if(addition(10,2))

function addition(a,b){
  if(a>b){return true}else{
  return false;}
}