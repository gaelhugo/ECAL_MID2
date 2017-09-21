var WebSocketConnection = function() {
  this.connection;
  this.IPAdress = 'localhost';
  this.init();
}

WebSocketConnection.prototype = {

  init:function() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    if(!window.WebSocket) {
      alert("WebSocket n'est pas disp");
    } else {
      this.initConnection();
    }
  },



  initConnection:function() {
    this.connection = new WebSocket("ws://"+this.IPAdress+":1337");
    this.connection.onopen = (function( ){
       this.app = new App(this.connection);
      //DECLARING WHO IS WHO
      this.connection.send(JSON.stringify({"role" : "webapp"}));
     }).bind(this);
    this.connection.onerror = function(error){};
    this.connection.onmessage = (function(message){
      //console.log(message.data);
      var json = JSON.parse(message.data);
      this.app.handleInfo(json);
    }).bind(this);
  }
}

window.addEventListener("DOMContentLoaded", function() {new WebSocketConnection});
