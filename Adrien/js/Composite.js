var Composite = function(ctx,x,y,rows,cols,color){
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.rows = rows;
  this.cols = cols;
  this.allPieces = [];
  this.color = color;
  this.move = true;
  this.moveRight = true;
  this.moveLeft = true;
  this.DICT = [];
  this.setup();
}

Composite.prototype = {

  setup:function(){
    this.height= this.rows * GRID;
    this.width = this.cols * GRID;
    for(var j = 0;j<this.rows;j++){
      var line = [];
      for(var i = 0;i<this.cols;i++){
          line.push(new Piece(this.ctx,i,j,this.color));
      }
      this.allPieces.push(line);
    }
  },

  keydown:function(e){
    e = e || window.event;
    if (e.keyCode == '38') {
       // up arrow
      //  console.log("up");
     }
     else if (e.keyCode == '40') {
         // down arrow
        //  console.log("down");
     }
     else if (e.keyCode == '37') {
        // left arrow
        // console.log("left");
        if(this.move && this.moveLeft) this.x-=GRID;
     }
     else if (e.keyCode == '39') {
        // right arrow
        // console.log("right");
        if(this.move && this.moveRight) this.x+=GRID;
     }

  },


  update:function(composites){
    //check walls
    if(this.x<=LEFT){
        this.moveLeft = false;
    }else{
        this.moveLeft = true;
    }
    if(this.x+this.width>=RIGHT){
        this.moveRight= false;
    }else{
        this.moveRight = true;
    }


    for(var i = 0;i<composites.length;i++){
      if(this != composites[i]){
        //check touch bottom
        if(this.y+this.height>=composites[i].y && this.y<composites[i].y + composites[i].height && (this.x<composites[i].x+composites[i].width && this.x + this.width>composites[i].x ) && this.move ){
          this.y = composites[i].y - this.height;
          this.move = false;
          this.moveRight = false;
          this.moveLeft = false;
          this.solve();
        }

        // check X with this.x+this.width
        if(this.x+this.width>=composites[i].x && (this.y+this.height>=composites[i].y && this.y<=composites[i].y+composites[i].height ) ){
            this.moveRight = false;
        }else if(this.x+this.width>=composites[i].x && (this.y>=composites[i].y+composites[i].height)){
            this.moveRight = true;
        }

        //check X + width with this.x
        if(this.x<=composites[i].x+composites[i].width && (this.y+this.height>=composites[i].y && this.y<=composites[i].y+composites[i].height ) ){
            this.moveLeft = false;
        }else if(this.x<=composites[i].x+composites[i].width && (this.y>=composites[i].y+composites[i].height)){
            this.moveLeft = true;
        }
      }
    }

    if(this.y+this.height+GRID<window.innerHeight && this.move){
        this.y += GRID;
    }else if(this.move){
      this.move = false;
      this.moveRight = false;
      this.moveLeft = false;
      this.solve();
    }

  },

  solve:function(){
    //we create a dictionnary that stores how many pieces we have for a specific row . Row beeing the KEY
    this.DICT = [];
    //we calculate on which row we are
    var index = this.y/GRID + 1;
    //index for element in the composite
    var _index = 0;
    for(var i = index;i<index+this.rows;i++){
      //we store the number of element and its index in the allpieces array for a specific row (i) in a dictionnary
      this.DICT[i] =[this.cols,_index];
      _index++;
    }

  },

  remove:function(key){
      //remove only the piece of the exact line that's recognize as full
      var index = this.DICT[key][1];
      this.allPieces.splice(index,1);
      //new rows, new height
      this.rows = this.allPieces.length;
      this.height = this.rows*GRID;

      //Fix piece position if not removed from bottom
      for(var j = 0;j<this.rows;j++){
        for(var i = 0;i<this.cols;i++){
          if(this.allPieces[j]!=undefined){
            this.allPieces[j][i].posy = j * GRID;
          }
        }
      }
      if(index!=this.allPieces.length-1){
        this.y+=GRID;
      }

  },

  fix:function(){
    this.move = true;
    this.DICT = [];
  },

  display:function(){
    for(var j = 0;j<this.rows;j++){
      for(var i = 0;i<this.cols;i++){
        if(this.allPieces[j]!=undefined){
          this.allPieces[j][i].update(this.x,this.y);
          this.allPieces[j][i].display();
        }
      }
    }
  }
}
