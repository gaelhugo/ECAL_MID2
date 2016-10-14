var App = function(connection){

  this.connection = connection;
  this.canvas = document.getElementById("canvas");
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;
  this.ctx = this.canvas.getContext("2d");
  this.color = 'rgba('+Math.round(Math.random()*255)+','+Math.round(Math.random()*255)+','+Math.round(Math.random()*255)+',1)';
  this.isDrawing = false;
  this.init();
}

App.prototype = {

  init:function(){
    this.ctx.fillStyle = 'white'
    this.ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    this.ctx.fillStyle = this.color;
    this.canvas.addEventListener('mousedown',(function(e){
        this.isDrawing = true;
    }).bind(this));
    this.canvas.addEventListener('mouseup',(function(e){
        this.isDrawing = false;
    }).bind(this));
    this.canvas.addEventListener('mousemove',(function(e){
        //console.log(e);
        if(this.isDrawing){
          this.ctx.fillStyle = this.color;
          this.ctx.beginPath();
          this.ctx.ellipse(e.x, e.y, 5, 2, 10, 0, Math.PI*2, false);
          this.ctx.fill();
          // ENVOI D'INFOS AU SERVEUR
          this.connection.send(JSON.stringify({"mouseX":e.x,"mouseY":e.y,"color":this.color,"shapeWidth":5,"shapeHeight":2}));
        }
    }).bind(this));

    //this.draw();
  },

  remoteDrawing:function(json){
    this.ctx.fillStyle = json.color;
    this.ctx.beginPath();
    this.ctx.ellipse(json.mouseX, json.mouseY, json.shapeWidth, json.shapeHeight, 10, 0, Math.PI*2, false);
    this.ctx.fill();
  },

  draw:function(){
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    requestAnimationFrame(this.draw.bind(this));
  }

}
