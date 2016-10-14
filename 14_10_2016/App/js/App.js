var App = function(socketConnection){
  this.connection = socketConnection;
  this.allShapes = [];
  this.controllerID = null;
  this.setup();
}

App.prototype = {
  setup:function(){
      this.canvas = document.getElementById("canvas");
      this.ctx   = canvas.getContext("2d");
      this.canvas.width = window.innerWidth;
      this.canvas.height= window.innerHeight;
      this.ctx.strokeStyle = "white";
      //this.canvas.addEventListener("mousedown",function(e){e.stopPropagation();});

      document.addEventListener("mousedown",this.onmousedown.bind(this));
      document.addEventListener("mousemove",this.onmousemove.bind(this));
      document.addEventListener("mouseup",this.onmouseup.bind(this));

      for(var i = 0; i<10; i++){
        var shape = new Shape(this.ctx,Math.random()*(window.innerWidth-200) + 100,Math.random()*(window.innerHeight-200)+100);
        this.allShapes.push(shape);
      }

      this.connection.send(JSON.stringify({"allShapes":this.allShapes,"size":[window.innerWidth,window.innerHeight],"type":"setupMobile"}));

      this.animate();
  },

  draw:function(){
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    for(var i = 0;i<this.allShapes.length;i++){
      this.allShapes[i].update();
      this.allShapes[i].draw();
    }

  },

  animate:function(){
    this.draw();
    requestAnimationFrame(this.animate.bind(this));
  },

  start:function(val,valy){
    console.log("should start");
    var evt = new MouseEvent('mousedown',{
      "clientX":val,
      "clientY":valy,
      "shifKey":false
    });
    document.dispatchEvent(evt);
  },

  end:function(val,valy){
    console.log("should end");
    var evt = new MouseEvent('mouseup',{
      "clientX":val,
      "clientY":valy,
      "shifKey":false
    });
    document.dispatchEvent(evt);
  },

  onmousedown:function(e){
      for(var i = 0;i<this.allShapes.length;i++){
        this.allShapes[i].checkTouch({"x":e.x,"y":e.y});
      }
  },

  onmousemove:function(e){
    for(var i = 0;i<this.allShapes.length;i++){
      this.allShapes[i].move({"x":e.x,"y":e.y});
    }
  },

  onmouseup:function(e){
    for(var i = 0;i<this.allShapes.length;i++){
      this.allShapes[i].release();
    }
  },

  onMultiDown:function(json){
    for(var i = 0;i<this.allShapes.length;i++){
      this.allShapes[i].checkMultitouch(json);
    }
  },

  onMultiMove:function(json){
    for(var i = 0;i<this.allShapes.length;i++){
      this.allShapes[i].multiMove(json);
    }

  },

  onMultiEnd:function(json){
    for(var i = 0;i<this.allShapes.length;i++){
      this.allShapes[i].multiRelease(json);
    }
  }

}
