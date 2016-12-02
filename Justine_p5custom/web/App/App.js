var App = function (connection){
  this.connection = connection;

  this.p5 = new p5(this.launch_p5.bind(this));

  this.setup();
  this.draw();
}

App.prototype = {

  launch_p5:function(s){
    console.log("launch p5");
    this.perso;
    this.GRAVITY = 1;
    this.JUMP = 15;

    this.platform1;
    this.platform2;
    this.platform3;
    this.platform4;
    this.platform5;
    this.platform6;
    this.platform7;
    this.platform8;
    this.platform9;

    this.obstacles;
    this.coins;
    this.dot;


    //s.setup = this.setup.bind(this);
    //s.draw = this.draw.bind(this);
  },

  setup:function(){

    console.log("p5 setup");
    this.p5.createCanvas(this.p5.windowWidth, this.p5.windowHeight);

    this.perso = this.p5.createSprite(this.p5.windowWidth/2-10, 0, 20, 20);

    this.perso.shapeColor = this.p5.color(0,0,0);
    this.perso.setCollider("box", 0,0,64);

     console.log(this.perso);

    this.obstacles = new this.p5.Group();
    this.coins = new this.p5.Group();

    //---------LIGNE 1
   this.platform1 = this.p5.createSprite(this.p5.windowWidth/4-50, this.p5.windowHeight/4-50, 100, 100);
   this.platform1.shapeColor = this.p5.color(255,255,255);
   this.obstacles.add(this.platform1);

   this.platform2 = this.p5.createSprite(this.p5.windowWidth/2-50, this.p5.windowHeight/4-50, 100, 100);
   this.platform2.shapeColor = this.p5.color("#c1a303");
   this.obstacles.add(this.platform2);

   this.platform3 = this.p5.createSprite((this.p5.windowWidth/4)*3-50, this.p5.windowHeight/4-50, 100, 100);
   this.platform3.shapeColor = this.p5.color("#f38f9b");
   this.obstacles.add(this.platform3);

   //---------LIGNE 2
   this.platform4 = this.p5.createSprite(this.p5.windowWidth/4-50, this.p5.windowHeight/2-50, 100, 100);
   this.platform4.shapeColor = this.p5.color("#8aaea2");
   this.obstacles.add(this.platform4);

   this.platform5 = this.p5.createSprite(this.p5.windowWidth/2-50, this.p5.windowHeight/2-50, 100, 100);
   this.platform5.shapeColor = this.p5.color("#9e948a");
   this.obstacles.add(this.platform5);

   this.platform6 = this.p5.createSprite((this.p5.windowWidth/4)*3-50, this.p5.windowHeight/2-50, 100, 100);
   this.platform6.shapeColor = this.p5.color(255,0 ,0);
   this.obstacles.add(this.platform6);

   //---------LIGNE 3
   this.platform7 = this.p5.createSprite(this.p5.windowWidth/4-50, (this.p5.windowHeight/4)*3-50, 100, 100);
   this.platform7.shapeColor = this.p5.color("#8aaea2");
   this.obstacles.add(this.platform7);

   this.platform8 = this.p5.createSprite(this.p5.windowWidth/2-50,(this.p5.windowHeight/4)*3-50, 100, 100);
   this.platform8.shapeColor = this.p5.color("#9e948a");
   this.obstacles.add(this.platform8);

   this.platform9 = this.p5.createSprite((this.p5.windowWidth/4)*3-50, (this.p5.windowHeight/4)*3-50, 100, 100);
   this.platform9.shapeColor = this.p5.color("#9e7d0c");
   this.obstacles.add(this.platform9);

   //--------- coins
   for(var i=0; i<10; i++) {
    this.dot = this.p5.createSprite(this.p5.random(0, this.p5.width), this.p5.random(0,this.p5.height), 10, 10);
    this.dot.shapeColor = this.p5.color("#f3efec");
    this.coins.add(this.dot);
   }

   console.log(this.p5)
  },

  draw:function(){
    this.p5.background("#d8d1c7");

    //
   this.perso.velocity.y += this.GRAVITY;

    // console.log(this.perso.velocity);

    if(this.perso.collide(this.obstacles)) {
      this.perso.velocity.y = 0;
    }

    if(this.p5.keyIsDown(this.p5.UP_ARROW)){
      this.perso.velocity.y = -this.JUMP;
    }
    if (this.p5.keyIsDown(this.p5.LEFT_ARROW)){
      this.perso.velocity.x = -5;
    }
    if (this.p5.keyIsDown(this.p5.RIGHT_ARROW)){
      this.perso.velocity.x = 5;
    }


      this.connection.send(JSON.stringify({
        "sendTo" : "mobile",
        "persoX" : this.perso.position.x,
        "persoY" : this.perso.position.y,
        "persoW" : this.perso.width,
        "persoH" : this.perso.height,

        "platform1X" : this.platform1.position.x,
        "platform1Y" : this.platform1.position.y,
        "platform1W" : this.platform1.width,
        "platform1H" : this.platform1.height,

        "platform2X" : this.platform2.position.x,
        "platform2Y" : this.platform2.position.y,
        "platform2W" : this.platform2.width,
        "platform2H" : this.platform2.height,

        "platform3X" : this.platform3.position.x,
        "platform3Y" : this.platform3.position.y,
        "platform3W" : this.platform3.width,
        "platform3H" : this.platform3.height

      }));
      this.perso.overlap(this.coins, this.collect);
      this.perso.update();
      this.p5.drawSprites();

      requestAnimationFrame(this.draw.bind(this));
  },
  handleInfo:function(info) {
    //FAIRE QUELQUE CHOSE AVEC LES DONNEES RECUES (info)
    // console.log("touchX " + info.touchX);
    // console.log("touchY " + info.touchY);
    console.log(this.perso.shapeColor);
    this.platform1.width = this.p5.map(info.touchX, 0, this.p5.width, 100, 800);
    this.platform2.height = this.p5.map(info.touchY, 0, this.p5.height, 100, 500);
    this.platform3.position.y = this.p5.map(info.touchX, 0, this.p5.height, this.p5.windowHeight/4-50, this.p5.windowHeight-50);
    this.platform4.width = this.p5.map(info.touchX, 0, this.p5.width, 100, 300);
    this.platform4.height = this.p5.map(info.touchX, 0, this.p5.height, 100, 300);
    this.platform5.height = this.p5.map(info.touchX, 0, this.p5.height, 100, 10);
    this.platform5.position.y = this.p5.map(info.touchX, 0, this.p5.height, this.p5.windowHeight/2-50, 700);
    this.platform6.position.x = this.p5.map(info.touchY, 0, this.p5.width, (this.p5.windowWidth/4)*3-50, -200);
    this.platform6.position.y = this.p5.map(info.touchX, 0, this.p5.width, this.p5.windowHeight/2-50, -200);

  }

}
