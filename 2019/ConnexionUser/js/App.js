'use strict';
class App {
  constructor() {
    console.log('App is running');
    this.database = firebase.database();
    this.player = null;
    this.listen();
  }
  listen() {
    this.database.ref('USER').on(
        'value', (function(snapshot) {
                   if ((snapshot.val() == null || snapshot.val().data == 2) &&
                       this.player == null) {
                     // initialise le joueur 1
                     console.log('YOU ARE PLAYER 1');
                     this.player = 1;
                     this.send('USER', 1);
                   } else if (this.player == null) {
                     // initialise le joueur 1
                     console.log('YOU ARE PLAYER 2');
                     this.player = 2;
                     this.send('USER', 2);
                   }
                 }).bind(this));
  }

  send(path, _data) {
    let json = {'data': _data};
    this.database.ref(path).set(json);
  }
}

window.onload = function() {
  new App();
}
