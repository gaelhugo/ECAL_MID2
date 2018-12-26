class SocketConnection {
  constructor() {
    this.connection;
    // this.game;
    this.controllerID;
    this.IP = document.body.getAttribute('data-IP');
    this.init();
  }
  init() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    // si le navigateur n'accepte pas les websocket
    if (!window.WebSocket) {
      alert('Il faut utiliser un autre navigateur. Chrome par exemple.');
    } else {
      this.initConnection();
    }
  }
  initConnection() {
    this.connection = new WebSocket('ws://' + this.IP + ':1337');
    // open connection
    this.connection.onopen = this.onOpen.bind(this);
    this.connection.onerror = this.onError.bind(this);
    // setup listener
    this.connection.onmessage = this.onMessage.bind(this);
  }

  onOpen() {
    console.log('websocket connection ok');
    // this.game = new App(this.connection);
  }

  onError(error) {
    console.log('!!', error);
  }

  onMessage(message) {
    try {
      var json = JSON.parse(message.data);
    } catch (e) {
      console.log('Le fichier JSON semble être mal formé');
      return;
    }
    switch (json.type) {
      default:
        // this.game.update(json);
        websocket_update(json);
    }
  }
};

function launch(e) {
  new SocketConnection();
};

window.addEventListener('DOMContentLoaded', launch);
