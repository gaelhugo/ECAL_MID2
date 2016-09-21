var SocketConnection = function (){
  this.connection;
  this.game;
  this.controllerID;
  this.IP = document.body.getAttribute("data-IP");
  this.init();
}

SocketConnection.prototype = {
  init:function(){
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    //si le navigateur n'accepte pas les websocket
    if (!window.WebSocket) {
      alert("Il faut utiliser un autre navigateur. Chrome par exemple.");
    }else{
      this.initConnection();
    }
  },

  initConnection:function(){
    this.connection = new WebSocket('ws://'+this.IP+':1337');
  	//on ouvre la connection
  	this.connection.onopen   = this.onOpen.bind(this);
  	this.connection.onerror  = this.onError.bind(this);
    this.connection.onmessage= this.onMessage.bind(this);
    this.game                = new App(this.connection);
  },

  onOpen:function(){ console.log("websocket connection ok")},

  onError:function(error){ console.log("!!",error);},

  onMessage:function(message){
    try{
        var json = JSON.parse(message.data);
     } catch (e) {
        console.log("Le fichier JSON semble être mal formé");
        return;
     }
     switch(json.type){
       case "controllerReady":
        console.log("controller ready with ID ", json.message);
            this.game.controllerID = json.message;
       break;
       case "controllerMove":
        //this.game.camera.rotation.y += json.message[0]/768 * 0.01;
        this.game.rotate(json.message[0],json.message[1]);
       break;
       case "controllerStart":
        //this.game.camera.rotation.y += json.message[0]/768 * 0.01;
        console.log("start");
        this.game.start(json.message[0],json.message[1]);
       break;
       case "controllerEnd":
        //this.game.camera.rotation.y += json.message[0]/768 * 0.01;
        console.log("end");
        this.game.end(json.message[0],json.message[1]);
       break;
     }
  }
}



function launch(e){
  new SocketConnection();
}

window.addEventListener("DOMContentLoaded",launch);
