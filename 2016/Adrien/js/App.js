var GRID = 0;
var NBR = 30;
var LEFT = 0;
var RIGHT = window.innerWidth;

var App = function(){
  this.canvas = document.getElementById("canvas");
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;
  this.ctx = this.canvas.getContext('2d');
  this.allComposites = [];
  this.tick = 0;
  this.speedTick= 10; // Fall Speed
  /*
    to solve each line
    we have to know how many lines and column we have in total in the game
    WE NEED THE GRID !!
  */
  GRID = Math.round(window.innerWidth/NBR);
  this.cols = Math.ceil(window.innerWidth/GRID);
  this.rows = Math.ceil(window.innerHeight/GRID);
  LEFT = GRID;
  RIGHT= (this.cols-1) * GRID;
  this.setup();
}

App.prototype = {

  setup:function(){
    var event = {"click":"click"};
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
      // Touch events are supported
      event.click = "touchstart";
    }
    //CLICK AS FUNCTION TO CREATE SHAPE ---> MUST BE CHANGED WITH websocket call
    document.addEventListener(event.click, this.onclick.bind(this));
    //LEFT, RIGHT AS FUNCTION TO MOVE ---> MUST BE CHANGED WITH accelerometer
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    //START
    this.draw();
  },

  onclick:function(e){
    e.preventDefault();
    this.generateNewComposite();
  },

  generateNewComposite:function(nbr){
    var nbr = nbr || Math.ceil(Math.random()*6);
    var cols = nbr;
    var rows = Math.ceil(Math.random()*6);
    var color = "rgb("+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+")";
    var x =  Math.floor((Math.random()*( window.innerWidth-(6*GRID) )/GRID)+1)*GRID;
    var y = -rows*GRID;
    var c = new Composite(this.ctx,x,y,rows,cols,color);
    this.allComposites.push(c);
  },

  onKeyDown:function(e){
     // CONTROLLER
     for(var i = 0;i<this.allComposites.length;i++){
       this.allComposites[i].keydown(e);
     }

     //DEBUG TOOLS ---------------------------------------
     if(parseInt(e.key)<=9){
       this.generateNewComposite(parseInt(e.key));
     }
     if(e.keyCode == 32) this.getDICTS();
     //DEBUG TOOLS ---------------------------------------
  },

  //DEBUG FUNCTION
  getDICTS:function(){
    for(var i = 0;i<this.allComposites.length;i++){
      console.log(this.allComposites[i].DICT);
    }
  },

  draw:function(){
    this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    //BACKGROUND GRID
    this.drawGrid();

    for(var i = 0;i<this.allComposites.length;i++){
      //SPEED LIMITATION, OTHERWISE IT GOES TOO FAST
      if(this.tick%this.speedTick==0){
        //FUNCTION TO MOVE ALL PIECES TO THE BOTTOM
        this.allComposites[i].update(this.allComposites);
        this.tick = 0;
        this.solver();
      }
      // DISPLAY ALL PIECES
      this.allComposites[i].display();
    }

    for(var i = this.allComposites.length-1;i>=0;i--){
      //IF NO LINE LEFT IN THE COMPOSITE, WE REMOVE IT
      if(this.allComposites[i].rows == 0){
        this.removeComposite(i);
      }
    }
    this.tick++;
    requestAnimationFrame(this.draw.bind(this));
  },

  drawGrid:function(){
    this.ctx.strokeStyle = "lightGrey";
    this.ctx.fillStyle = "white";
    for(var j = 0;j<this.rows-1;j++){
      for(var i = 1;i<this.cols-1;i++){
        this.ctx.beginPath();
        this.ctx.rect(i*GRID,j*GRID,GRID,GRID);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  },

  solver:function(){
    /*
      CHECK IF A LINE IS COMPLETED
      TO DO THAT WE LOOP THROUGH EACH LINE FROM THE BOTTOM
      FOR EACH LINE WE ASK EACH COMPOSITE IF THEY HAVE ELEMENT ON THAT LINE
      IF YES, WE INCREMENT A total
      IF THE TOTAL REACHES THE NUMBER OF COLS, WE HAVE A FULL LINE
      IF WE HAVE A FULL LINE, WE NEED TO REMOVE IT
    */

      for(var i=this.rows-1;i>0;i--){
        var total=0;
        for(var j = 0;j<this.allComposites.length;j++){
          if(this.allComposites[j].DICT[i]!=undefined){
            total+= this.allComposites[j].DICT[i][0];
          }
        }

        if(total>=this.cols-2){
          this.remover(i);
        }
      }
  },

  remover:function(key){
      //remove lines
      for(var j = 0;j<this.allComposites.length;j++){
          if(this.allComposites[j].DICT[key]!=undefined){
            this.allComposites[j].remove(key);
          }
      }
      //re-activate motion for stopped pieces
      for(var j = 0;j<this.allComposites.length;j++){
          this.allComposites[j].fix();
      }
  },

  removeComposite:function(id){
      this.allComposites.splice(id,1);
  }

}
//Launch the app
new App();
