class App {
  constructor(connection) {
    this.connection = connection;
    this.id = 'player1';
    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.canvas.width = this.w = window.innerWidth;
    this.canvas.height = this.h = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    setTimeout(this.setup.bind(this), 10);
  }
  setup() {
    // example
    // create few random elements on canvas
    this.particles = [];
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        'x': Math.random() * this.w,
        'y': Math.random() * this.h,
        'isDragged': false
      })
    }
    // send their initial positions the other player (if is already connected)
    this.send(this.particles, 'initial_positions');
    // make them interactive
    document.addEventListener('mousedown', this.onmousedown.bind(this));
    document.addEventListener('mouseup', this.onmouseup.bind(this));
    document.addEventListener('mousemove', this.onmousemove.bind(this));

    this.draw();
  }

  onmousedown(e) {
    let mouse = {'x': e.x, 'y': e.y};
    for (let p of this.particles) {
      if (this.dist(p, mouse) < 5) {
        p.isDragged = true;
      }
    }
  }
  onmouseup(e) {
    for (let p of this.particles) {
      p.isDragged = false;
    }
  }
  onmousemove(e) {
    for (let p of this.particles) {
      if (p.isDragged) {
        p.x = e.x;
        p.y = e.y;
      }
    }
    // send position updates to the other player
    this.send(this.particles, 'move');
  }

  draw() {
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.ctx.fillStyle = 'black';
    for (let p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 10, 0, Math.PI * 2, false);
      this.ctx.fill();
      this.ctx.closePath();
    }
    requestAnimationFrame(this.draw.bind(this));
  }

  // function to send data through websocket
  send(data, type) {
    this.connection.send(
        JSON.stringify({data: data, type: type, player: this.id}));
  }

  // function to receive data from websocket
  update(json) {
    let type = json.message.type;
    switch (type) {
      case 'is_there_any_elements_on_stage':
        this.send(this.particles, 'initial_positions');
        break;
        // we can add other messages here
    }
  }
  // get distance between 2 points
  dist(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }
}
