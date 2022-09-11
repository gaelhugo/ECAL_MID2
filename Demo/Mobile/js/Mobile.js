var Mobile =
    function() {
  this.connection;
  this.controller;
  this.IP = document.body.getAttribute('data-IP');
  this.ID;
  this.init();
}

    Mobile.prototype = {
  init: function() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    // si le navigateur n'accepte pas les websocket
    if (!window.WebSocket) {
      alert('Il faut utiliser un autre navigateur. Chrome par exemple.');
    } else {
      this.initConnection();
    }

    this.launchInteraction();
  },

  initConnection: function() {
    this.connection = new WebSocket('ws://' + this.IP + ':1337');
    // on ouvre la connection
    this.connection.onopen = this.onsocketopen.bind(this);
    this.connection.onerror = this.onError.bind(this);
    this.connection.onmessage = this.onMessage.bind(this);
  },

  onsocketopen: function() {
    console.log('websocket connection ok');
    this.sendMessage('Please give me my ID', null, 'handshake');
    // console.log(this);
  },

  onError: function(error) {
    console.log('!!', error);
  },

  onMessage: function(message) {

    try {
      var json = JSON.parse(message.data);
    } catch (e) {
      console.log('Le fichier JSON semble être mal formé');
      return;
    }

    switch (json.type) {
      case 'backshake':
        this.ID = json.message;
        console.log('ID', this.ID);
        break;
      case 'changeScore':
        var score = document.getElementById('score');
        var actualScore = parseInt(score.textContent);
        score.textContent = actualScore + parseInt(json.message);
        break;
    }

  },

  sendMessage: function(value, controllerID, type) {
    this.connection.send(JSON.stringify(
        {message: value, controllerID: String(controllerID), type: type}));
  },

  launchInteraction: function() {
    document.addEventListener('touchstart', this.onstart.bind(this));
    document.addEventListener('touchmove', this.ontouch.bind(this));
    document.addEventListener('touchend', this.onend.bind(this));
  },

  onstart: function(e) {
    this.sendMessage(
        [e.touches[0].pageX, e.touches[0].pageY], this.ID, 'controllerStart');
    // document.removeEventListener('touchstart',this.onstart.bind(this));
    // document.addEventListener('touchmove',this.ontouch.bind(this));
    // document.addEventListener('touchend',this.onend.bind(this));
  },

  ontouch: function(e) {
    console.log(e.touches[0].pageX, e.touches[0].pageY);
    this.sendMessage(
        [e.touches[0].pageX, e.touches[0].pageY], this.ID, 'controllerMove');
  },

  onend: function(e) {

    this.sendMessage(
        [e.changedTouches[0].pageX, e.changedTouches[0].pageY], this.ID,
        'controllerEnd');
    // document.removeEventListener('touchmove',this.ontouch.bind(this));
    // document.removeEventListener('touchend',this.onend.bind(this));
    // document.addEventListener('touchstart',this.onstart.bind(this));
  }


};

function launch(e) {
  new Mobile();
}
window.addEventListener('DOMContentLoaded', launch);
