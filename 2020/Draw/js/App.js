class App {
  constructor() {
    console.log('App ready');

    this.database = firebase.database();

    this.canvas = document.getElementsByTagName('canvas')[0];
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.color = {
      'r': Math.round(Math.random() * 255),
      'g': Math.round(Math.random() * 255),
      'b': Math.round(Math.random() * 255),
    };
    this.UID = '_' + Math.random().toString(36).substr(2, 9);
    // this.ctx.strokeStyle = 'rgb(255,0,0)';

    document.addEventListener('mousedown', this.onmousedown.bind(this));
    document.addEventListener('mousemove', this.onmousemove.bind(this));
    document.addEventListener('mouseup', this.onmouseup.bind(this));

    this.addDatabaseListener();

    this.isDrawing = false;
    this.count = 0;
  }

  onmousedown(e) {
    console.log('mouse down', e);
    this.isDrawing = true;
    // this.ctx.beginPath();
    // this.ctx.moveTo(e.x, e.y);
  }

  onmousemove(e) {
    if (this.isDrawing) {
      console.log('mouse move');
      // this.ctx.lineTo(e.x, e.y);
      // this.ctx.stroke();
      this.send('DRAWINGS/' + this.UID + '/' + Date.now(), {
        'x': e.x,
        'y': e.y,
        'color': this.color,
      });
    }
  }

  onmouseup(e) {
    console.log('mouse up');
    this.isDrawing = false;
    // this.ctx.closePath();
    // this.launch();
    this.send('DRAWINGS/' + this.UID, null);
  }

  send(path, value) {
    const json = {'data': value};
    this.database.ref(path).set(json);
  }

  // launch() {
  //   setInterval(() => {
  //     this.count++;
  //     this.send('COUNTER', this.count);
  //   }, 1000);
  // }

  addDatabaseListener() {
    this.database.ref('DRAWINGS').on('value', (snapshot) => {
      // console.log(snapshot.val());
      this.drawings = snapshot.val();
      console.log(this.drawings);
      for (const user in this.drawings) {
        const points = Object.keys(this.drawings[user]);
        if (points.length >= 2) {
          console.log(points);
          this.ctx.beginPath();
          const data = this.drawings[user][points[0]].data;
          const r = data.color.r;
          const g = data.color.g;
          const b = data.color.b;
          this.ctx.strokeStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
          this.ctx.moveTo(data.x, data.y);
          for (let i = 1; i < points.length; i++) {
            const data2 = this.drawings[user][points[i]].data;
            this.ctx.lineTo(data2.x, data2.y);
          }
          this.ctx.stroke();
          this.ctx.closePath();
        }
      }

    })
  }

  // setup() {
  //   this.draw();
  // }

  // draw() {
  //   requestAnimationFrame(this.draw.bind(this));
  // }
};

window.onload = (param) => {
  const app = new App();
}
