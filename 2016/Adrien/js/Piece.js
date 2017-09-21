var Piece = function(ctx,i,j,color){
  this.ctx = ctx;
  this.posx = i * GRID;
  this.posy = j * GRID;
  this.x= 0 ;
  this.y = 0;
  this.width = this.height = GRID;
  this.color = color;
}

Piece.prototype ={
  update:function(x,y){
    this.x = x + this.posx;
    this.y = y + this.posy;
  },

  display:function(){
    this.ctx.strokeStyle = "grey";
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.rect(this.x, this.y, this.width,this.height);
    this.ctx.fill();
    this.ctx.closePath();
    // this.ctx.stroke(); // to see the outline of each square
  }
}
