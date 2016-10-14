var Mobile = function(){
  this.connection;
  this.controller;
  this.IP = document.body.getAttribute("data-IP");
  this.ID;
  this.allShapes = [];
  this.init();
}

Mobile.prototype = {
  init:function(){
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    //si le navigateur n'accepte pas les websocket
    if (!window.WebSocket) {
      alert("Il faut utiliser un autre navigateur. Chrome par exemple.");
    }else{
      this.initConnection();
    }

    this.launchInteraction();
  },

  initConnection:function(){
    this.connection = new WebSocket('ws://'+this.IP+':1337');
    // on ouvre la connection
    this.connection.onopen   = this.onsocketopen.bind(this);
    this.connection.onerror  = this.onError.bind(this);
    this.connection.onmessage= this.onMessage.bind(this);
  },

  onsocketopen:function(){
    console.log("websocket connection ok");
    this.sendMessage("Please give me my ID",null,"handshake");
    // console.log(this);
  },

  onError:function(error){ console.log("!!",error);},

  onMessage:function(message){

    try{
        var json = JSON.parse(message.data);
     } catch (e) {
        console.log("Le fichier JSON semble être mal formé");
        return;
     }

     switch(json.type){
       case "backshake":
          this.ID = json.message;
          console.log("ID",this.ID);
       break;
       case "initialPositions":
          this.initPositions(json.message);
       break;

     }

  },

  sendMessage:function(value,controllerID,type){
  	this.connection.send(JSON.stringify({message:value,controllerID:String(controllerID),type:type}));
  },

  launchInteraction:function(){
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.ctx = canvas.getContext("2d");

    document.addEventListener('touchstart',this.onstart.bind(this));
    document.addEventListener('touchmove',this.ontouch.bind(this));
    document.addEventListener('touchend',this.onend.bind(this));


  },

  onstart:function(e){
    e.stopPropagation();
    e.preventDefault();
    for(var i = 0;i<this.allShapes.length;i++){
      this.allShapes[i].checkMultitouch(e.touches);
    }
    console.log(e);
    var t = [];
    for(var i=0;i<e.touches.length;i++){
      t.push({"x":e.touches[i].pageX/window.innerWidth*this.desktopWidth,"y":e.touches[i].pageY/window.innerHeight*this.desktopHeight,"id":e.touches[i].identifier});
    }
    this.sendMessage(t,this.ID,"controllerStart");
    // document.removeEventListener('touchstart',this.onstart.bind(this));
    // document.addEventListener('touchmove',this.ontouch.bind(this));
    // document.addEventListener('touchend',this.onend.bind(this));
  },

  ontouch:function(e){
    e.stopPropagation();
    e.preventDefault();
    for(var i = 0;i<this.allShapes.length;i++){
      this.allShapes[i].multiMove(e.touches);
    }
    var t = [];
    for(var i=0;i<e.touches.length;i++){
      t.push({"x":e.touches[i].pageX/window.innerWidth*this.desktopWidth,"y":e.touches[i].pageY/window.innerHeight*this.desktopHeight,"id":e.touches[i].identifier});
    }
    this.sendMessage(t,this.ID,"controllerMove");
  },

  onend:function(e){
    e.stopPropagation();
    e.preventDefault();
    for(var i = 0;i<this.allShapes.length;i++){
      this.allShapes[i].multiRelease(e.changedTouches);
    }
    var t = [];
    for(var i=0;i<e.changedTouches.length;i++){
      t.push({"x":e.changedTouches[i].pageX/window.innerWidth*this.desktopWidth,"y":e.changedTouches[i].pageY/window.innerHeight*this.desktopHeight,"id":e.changedTouches[i].identifier});
    }
    this.sendMessage(t,this.ID,"controllerEnd");
    // document.removeEventListener('touchmove',this.ontouch.bind(this));
    // document.removeEventListener('touchend',this.onend.bind(this));
    // document.addEventListener('touchstart',this.onstart.bind(this));
  },

  initPositions:function(json){
    this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    console.log(json);
    this.desktopWidth = json.size[0];
    this.desktopHeight= json.size[1];
    //this.allShapes = json.allShapes;
    for(var i = 0;i<json.allShapes.length;i++){
      var shape = new Shape(this.ctx,json.allShapes[i].x*window.innerWidth/this.desktopWidth,json.allShapes[i].y*window.innerHeight/this.desktopHeight);
      shape.radius *= window.innerWidth/this.desktopWidth;
      shape.color = json.allShapes[i].color;
      shape.shapeSetting = json.allShapes[i].shapeSetting;
      this.allShapes.push(shape);
      // var shape =
      // this.ctx.beginPath();
      // this.ctx.fillStyle = json.allShapes[i].color;
      // this.ctx.arc((json.allShapes[i].x/desktopWidth)*window.innerWidth,(json.allShapes[i].y/desktopHeight)*window.innerHeight,10,0,Math.PI*2,false);
      // this.ctx.fill();
      // this.ctx.closePath();
    }
    //console.log(this.allShapes);
    this.draw();
  },

  draw:function(){
      this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
      for(var i = 0;i<this.allShapes.length;i++){
        this.allShapes[i].draw();
      }
    requestAnimationFrame(this.draw.bind(this));
  }


}

function launch(e){
  new Mobile();
}
window.addEventListener("DOMContentLoaded",launch);
