var Shape = function(ctx,x,y){
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.radius = 100;
  var edges = [3,4,5,6,7,8,12,360];
  this.shapeSetting = edges[Math.floor(Math.random()*edges.length)];
  this.color = "rgba("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+",1)";
  this.isDragging = false;
  this.touchID = -1;
}

Shape.prototype = {

  update:function(){},

  draw:function(){
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    var step = 360/this.shapeSetting;
    for(var i = 0;i<360;i+=step){
      if(i==0){
        this.ctx.moveTo(this.x + Math.cos(0)*this.radius,this.y);
      }else{
        this.ctx.lineTo(this.x + Math.cos(i*Math.PI/180)*this.radius,this.y + Math.sin(i*Math.PI/180)*this.radius);
      }
    }
    this.ctx.fill();
    this.ctx.closePath();
  },

  drawCircle:function(){
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    this.ctx.fill();
    this.ctx.closePath();
  },

  checkTouch:function(position){
    var distance = this.getDistance(position.x,position.y,this.x,this.y);
    if(distance<this.radius){
      this.isDragging = true;
    }
  },

  checkMultitouch:function(fingers){
    for(var i = 0;i<fingers.length;i++){
        var distance = this.getDistance(fingers[i].pageX,fingers[i].pageY,this.x,this.y);
        if(distance<this.radius){
          this.isDragging = true;
          this.touchID = fingers[i].identifier;
        }
    }
  },

  getDistance:function(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
  },

  move:function(position){
    if(this.isDragging){
      this.x = position.x;
      this.y = position.y;
    }
  },

  multiMove:function(fingers){
    for(var i = 0;i<fingers.length;i++){
      if(this.isDragging && this.touchID==fingers[i].identifier){
        this.x = fingers[i].pageX;
        this.y = fingers[i].pageY;
      }
    }
  },

  release:function(){
    this.isDragging = false;
  },

  multiRelease:function(fingers){
      for(var i = 0;i<fingers.length;i++){
        if(fingers[i].id == this.touchID){
          this.isDragging = false;
          this.touchID = -1;
          break;
        }
      }
  }

}
