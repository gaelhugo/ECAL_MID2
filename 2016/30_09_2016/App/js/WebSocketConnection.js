var WebSocketConnection = function(){
    this.connection;
    this.IPAdress = 'localhost';
    this.app;
    this.init();
}

WebSocketConnection.prototype = {

  init:function(){
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    if(!window.WebSocket){
      alert("Websocket n'est pas dispo pour ce browser");
    }else{
      this.initConnection();
    }
  },

  initConnection:function(){
    this.connection = new WebSocket('ws://'+this.IPAdress+":1337");
    this.connection.onopen = this.onOpen.bind(this);
    this.connection.onerror= function(error){};
    this.connection.onmessage = (function(message){
      console.log(message.data);
      var json  = JSON.parse(message.data);
      this.app.remoteDrawing(json);
    }).bind(this);
  },

  onOpen:function(){
      this.app = new App(this.connection);
  }
//'10.192.234.181'

}


window.addEventListener("DOMContentLoaded",function(){ new WebSocketConnection(); });
