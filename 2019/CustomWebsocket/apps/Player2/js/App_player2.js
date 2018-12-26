class App {
  constructor(connection) {
    this.connection = connection;
    this.id = 'player2';
    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.canvas.width = this.w = window.innerWidth;
    this.canvas.height = this.h = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = 'black';
    // player 2 doesn't create any elements
    // check if there is any existing state
    this.send(null, 'is_there_any_elements_on_stage')
  }

  setup(elements) {
    this.particles = [];
    for (let i = 0; i < elements.length; i++) {
      this.particles.push(elements[i]);
    }
    this.draw();
  }
  draw() {
    this.ctx.clearRect(0, 0, this.w, this.h);
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
        JSON.stringify({message: data, type: type, player: this.id}));
  }

  // function to receive data from websocket
  update(json) {
    let type = json.message.type;
    switch (type) {
      case 'initial_positions':
        // get initial state if there is any
        this.setup(json.message.data);
        break;
      case 'move':
        // replace every particle position when moving
        this.particles = json.message.data;
        break;
    }
  }
}
