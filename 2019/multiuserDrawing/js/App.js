'use strict';
class App {
  constructor() {
    console.log('App is running');
    this.database = firebase.database();
    this.counter = 0;
    this.listen();
    // this.launch();
    this.initDrawing();
  }

  //--------------------------------------
  initDrawing() {
    this.UID = '_' + Math.random().toString(36).substr(2, 9);
    this.canvas = document.getElementsByTagName('canvas')[0];
    this.w = this.canvas.width = window.innerWidth;
    this.h = this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = 'red';
    this.ctx.strokeStyle = 'white';
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.isDrawing = false;
    this.color = Math.random() * 0xffffff;

    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    // this.draw();
  }
  onMouseDown(e) {
    this.isDrawing = true;
    // this.ctx.beginPath();
    // this.ctx.moveTo(e.x, e.y);
  }
  onMouseMove(e) {
    if (this.isDrawing) {
      // this.ctx.lineTo(e.x, e.y);
      // this.ctx.stroke();
      this.send(
          'DRAWINGS/' + this.UID + '/' + Date.now(),
          {'x': e.x, 'y': e.y, 'color': this.color});
    }
  }
  onMouseUp(e) {
    this.isDrawing = false;
    // this.ctx.closePath();
    this.database.ref('DRAWINGS/' + this.UID).set(null);
  }

  // draw(){
  //
  // }


  //---------------------------

  send(path, _data) {
    // ?json
    let json = {'data': _data};
    this.database.ref(path).set(json);
  }

  listen() {
    this.database.ref('DRAWINGS')
        .on('value', (function(snapshot) {
                       console.log(snapshot.val());
                       this.drawings = snapshot.val();

                       // remplace le draw
                       for (let drawing in this.drawings) {
                         let points = Object.keys(this.drawings[drawing]);
                         if (points.length >= 2) {
                           this.ctx.beginPath();
                           let p = this.drawings[drawing][points[0]].data;
                           this.ctx.strokeStyle = p.color;
                           this.ctx.moveTo(p.x, p.y);
                           for (let point in this.drawings[drawing]) {
                             let _p = this.drawings[drawing][point].data;
                             // console.log(_p);
                             this.ctx.lineTo(_p.x, _p.y);
                           }
                           this.ctx.stroke();
                           this.ctx.closePath();
                         }
                       }


                     }).bind(this));
  }

  count() {
    this.counter++;
    this.send('ACTIVATION', this.counter);
  }

  launch() {
    setInterval(this.count.bind(this), 1000);
  }
}

window.onload = function() {
  new App();
}
