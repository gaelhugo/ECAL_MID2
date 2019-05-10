'use strict';
class App {
  constructor() {
    console.log('App is running');
    this.database = firebase.database();
    this.counter = 0;
    this.UID = '_' + Math.random().toString(36).substr(2, 9);
    this.master = false;
    this.IP = '10.192.232.123';
    this.listen();
    this.collection = [
      'WorkIt1.mp3',   'MakeIt1.mp3', 'DoIt1.mp3',   'MakesUs1.mp3',
      'Harder1.mp3',   'Better1.mp3', 'Faster1.mp3', 'Stronger1.mp3',
      'MoreThan1.mp3', 'Hour1.mp3',   'Our1_1.mp3',  'Never1.mp3',
      'Ever1.mp3',     'After1.mp3',  'WorkIs1.mp3', 'Over1.mp3',
      'WorkIt2.mp3',   'MakeIt2.mp3', 'DoIt2.mp3',   'MakesUs2.mp3',
      'Harder2.mp3',   'Better2.mp3', 'Faster2.mp3', 'Stronger2.mp3'
    ];
  }

  //--------------------------------------
  playSequencer() {
    if (this.master) {
      // remove the disconnected ....
      for (let id in this.users) {
        if (this.users[id].data == 'disconnect' || this.users[id].data == 0) {
          delete this.users[id]
        }
      }
      let users_list = Object.keys(this.users);
      users_list.sort((a, b) => this.users[a].data - this.users[b].data);
      // console.log(this.users, users_list);
      /*
        READY TO LAUNCH
      */
      this.flash(users_list);
    }
  }
  stopSequencer() {
    clearTimeout(this.interval);
  }

  flash(users_list) {
    this.interval = setTimeout(() => {
      this.send('FLASH/', users_list[0]);
      const shift = users_list.shift();
      users_list.push(shift);
      this.flash(users_list);
    }, 400);
  }

  setFlashingLight() {
    this.audio.play();
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.w, this.h);
    setTimeout(() => {
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, 0, this.w, this.h);
    }, 20);
  }



  //--------------------------------------
  initDrawing() {
    this.canvas = document.getElementsByTagName('canvas')[0];
    this.w = this.canvas.width = window.innerWidth;
    this.h = this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = 'black';
    this.ctx.strokeStyle = 'white';
    this.ctx.fillRect(0, 0, this.w, this.h);
    // this.isDrawing = false;
    if (this.master) {
      document.body.classList.add('master');
      const button = document.createElement('button');
      button.innerHTML = 'START';
      button.addEventListener('click', (e) => {
        console.log(e);
        if (e.target.textContent == 'START') {
          this.playSequencer();
          button.innerHTML = 'STOP';
        } else {
          this.stopSequencer();
          button.innerHTML = 'START';
        }
      });
      document.body.appendChild(button);
      document.body.removeChild(this.canvas);
    }
  }


  //---------------------------

  send(path, _data) {
    // ?json
    let json = {'data': _data};
    this.database.ref(path).set(json);
  }

  drawDisconnect() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('Disconnected', 100, 100);
  }

  listen() {
    this.database.ref('USERS').on('value', (snapshot) => {
      // console.log('USERS: ', snapshot.val());
      const urlParams = new URLSearchParams(window.location.search);
      const position = urlParams.get('position');
      if (position == 0) this.master = true;
      this.users = snapshot.val()
      let record = false;
      if (this.users == null) {
        this.send('USERS/' + this.UID, position);
        record = true;

        this.audio = new Audio();
        this.audio.src = 'http://' + this.IP + ':8080/audio/' +
            this.collection[parseInt(position) - 1];
        this.audio.load();
        document.body.appendChild(this.audio);
      } else {
        for (let user in this.users) {
          if (this.users[user].data == position && user != this.UID) {
            this.send('USERS/' + user, 'disconnect');
            this.send('USERS/' + this.UID, position);
            record = true;
          } else if (
              this.users[user].data == 'disconnect' && this.UID == user) {
            this.database.ref('USERS/' + this.UID).set(null);
            this.database.ref('USERS').off();
            this.drawDisconnect();
            record = true;
          } else if (user == this.UID) {
            record = true;
          } else if (this.users[user].data == 'disconnect' && this.master) {
            // const button = document.getElementsByTagName('button')[0];
            // this.stopSequencer();
            // button.innerHTML = 'START';
          }
        }
        if (!record) {
          this.send('USERS/' + this.UID, position);
          this.audio = new Audio();
          this.audio.src = 'http://' + this.IP + ':8080/audio/' +
              this.collection[parseInt(position) - 1];
          this.audio.load();
          document.body.appendChild(this.audio);
          this.initDrawing();
        }
      }

    });
    this.database.ref('USERS/' + this.UID).onDisconnect().set(null);



    this.database.ref('FLASH').on('value', (snapshot) => {
      const flash = snapshot.val();
      if (flash && flash.data == this.UID) {
        this.setFlashingLight();
      }
    });
    this.database.ref('FLASH').onDisconnect().set(null);
  }
}

window.onload = function() {
  new App();
}
