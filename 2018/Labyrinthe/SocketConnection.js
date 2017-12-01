'use strict';

class SocketConnection {
  constructor() {
    // localhost
    this.IP = '10.192.232.47';
    this.port = '1337';
    this.connection;
    this.app;
    this.init();
  }

  init() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    if (!window.WebSocket) {
      alert('Faudrait changer de navigateur.');
    } else {
      this.goServer();
    }
  }

  goServer() {
    this.connection = new WebSocket('ws://' + this.IP + ':' + this.port);
    this.connection.onerror = this.onError.bind(this);
    this.connection.onopen = this.onOpen.bind(this);
    this.connection.onmessage = this.onMessage.bind(this);
  }

  onError(error) {
    console.log(error);
  }

  onOpen() {
    console.log('websocket ouvert et pret à l\'emploi');
    this.app = new App(this.connection);
  }

  onMessage(message) {
    let json = JSON.parse(message.data);
    console.log(json.color);
    switch (json.type) {
      case 'mousedown':
        this.app.ctx.fillStyle = 'rgb(' + json.color[0] + ',' + json.color[1] +
            ',' + json.color[2] + ')';
        this.app.ctx.beginPath();
        this.app.ctx.arc(
            json.position.x, json.position.y, 2, 0, Math.PI * 2, false);
        this.app.ctx.fill();
        this.app.ctx.closePath();
        // this.app.ctx.moveTo(json.position.x, json.position.y);
        break;
      case 'mousemove':

        this.app.ctx.fillStyle = 'rgb(' + json.color[0] + ',' + json.color[1] +
            ',' + json.color[2] + ')';
        this.app.ctx.beginPath();
        this.app.ctx.arc(
            json.position.x, json.position.y, 2, 0, Math.PI * 2, false);
        this.app.ctx.fill();
        this.app.ctx.closePath();

        break;
      case 'mouseup':
        break;
    }
  }
}


window.addEventListener('DOMContentLoaded', function() {
  new SocketConnection();
});
