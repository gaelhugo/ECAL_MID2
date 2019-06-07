let PX;
// GRID SPACE
let SPACE = 5;
// 0.5 - 0.01 , the bigger the faster
let LERP_FACTOR = 0.1;
// IMAGES TO BE ANALYZED
let IMAGES = ['image1.png', 'opi.png'];
let SCREEN_DIMENSIONS = {'width': 768, 'height': 1024};
/**
 * PARTICLE_AMOUNT
 * this number should be at least equal to
 * Math.ceil(width / space) * Math.ceil(height / space)
 * ex : 77 * 103 = 7931
 */
let PARTICLE_AMOUNT = Math.ceil(SCREEN_DIMENSIONS.width / SPACE) *
    Math.ceil(SCREEN_DIMENSIONS.height / SPACE);
class App {
  constructor() {
    // NEED A HIDDEN CANVAS TO GET IMAGE DATA
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.w = SCREEN_DIMENSIONS.width;
    this.canvas.height = this.h = SCREEN_DIMENSIONS.height;
    this.ctx = this.canvas.getContext('2d');
    this.setup();
  }
  setup() {
    // WHICH IMAGE TO GENERATE FIRST
    this.imageIndex = 0;
    this.initPixi();
    this.loadImages();
    this.initListeners();
  }

  initPixi() {
    PX = new PIXI.Application(this.w, this.h, {antialias: true});
    document.body.appendChild(PX.view);
    PX.renderer.backgroundColor = '0xffcccc';
    // create an image pool
    this.allImagesDatas = [];
    // create sprite pool FOR WHITE AND BLACK PIXELS
    this.whitePixels = [];
    this.blackPixels = [];
    // place all pixels naturally out of the screen in circle.
    // With random, it will take more time to load.
    let VCenter = {'x': this.w / 2, 'y': this.h / 2};
    let radius = Math.sqrt(Math.pow(VCenter.x, 2) + Math.pow(VCenter.y, 2)) + 1;
    for (let i = 0; i < PARTICLE_AMOUNT; i++) {
      // CREATE BLACK AND WHITE PIXELS
      let pixel = PIXI.Sprite.fromImage('pixel.png');
      let bpixel = PIXI.Sprite.fromImage('pixel.png');
      bpixel.tint = 0x000000;
      // COULD REMOVE RANDOM TO SPEED UP LOADING
      let randomAngle = Math.random() * (360 + i);
      // SET INTIAL VALUES
      pixel.x = VCenter.x + Math.cos(randomAngle * Math.PI / 180) * radius;
      pixel.y = VCenter.y + Math.sin(randomAngle * Math.PI / 180) * radius;
      bpixel.x = VCenter.x + Math.cos(randomAngle * Math.PI / 180) * radius;
      bpixel.y = VCenter.y + Math.sin(randomAngle * Math.PI / 180) * radius;
      pixel.positions = [];
      bpixel.positions = [];
      for (let j = 0; j < IMAGES.length; j++) {
        pixel.positions.push({
          'x': VCenter.x + Math.cos(randomAngle * Math.PI / 180) * radius,
          'y': VCenter.y + Math.sin(randomAngle * Math.PI / 180) * radius
        });
        bpixel.positions.push({
          'x': VCenter.x + Math.cos(randomAngle * Math.PI / 180) * radius,
          'y': VCenter.y + Math.sin(randomAngle * Math.PI / 180) * radius
        });
      }
      this.whitePixels.push(pixel);
      this.blackPixels.push(bpixel);
    }
    // INIT PARTICLES with black and white textures
    this.sprites = new PIXI.particles.ParticleContainer(
        (this.whitePixels.length + this.blackPixels.length),
        {scale: true, position: true, alpha: true});
    for (let i = 0; i < this.whitePixels.length; i++) {
      this.sprites.addChild(this.whitePixels[i]);
      this.sprites.addChild(this.blackPixels[i]);
    }
    PX.stage.addChild(this.sprites);
  }
  /**
   * Load all images one after the other
   * When done, analye them to get the brigthness value
   */
  loadImages() {
    if (IMAGES.length > 0) {
      let image_src = IMAGES.shift();
      let image = new Image();
      image.onload = () => {
        this.ctx.drawImage(image, 0, 0, this.w, this.h);
        this.allImagesDatas.push(this.ctx.getImageData(0, 0, this.w, this.h));
        this.loadImages();
      };
      image.src = image_src;
    } else {
      this.analyzeImages();
    }
  }

  initListeners() {
    document.addEventListener('click', this.onclick.bind(this));
  }

  onclick(e) {
    if (this.imageIndex >= this.allImagesDatas.length - 1) {
      this.imageIndex = 0;
    } else {
      this.imageIndex++;
    }
    console.log(this.imageIndex);
  }
  /**
   * Set all position for black and white pixels depending on each picture
   * To make sure we'll not only using the same pixels only, we shift the array
   */
  analyzeImages() {
    for (let i = 0; i < this.allImagesDatas.length; i++) {
      let imageData = this.allImagesDatas[i];
      for (let y = 0; y < this.h; y += SPACE) {
        for (let x = 0; x < this.w; x += SPACE) {
          let index = (y * this.w + x) * 4;
          let red = imageData.data[index];
          let green = imageData.data[index + 1];
          let blue = imageData.data[index + 2];
          let brightness = Math.round(red * 0.3 + green * 0.59 + blue * 0.11);
          if (brightness < 50) {
            let blackPixel = this.blackPixels.shift();
            blackPixel.positions[i].x = x;
            blackPixel.positions[i].y = y;
            this.blackPixels.push(blackPixel);
          } else {
            let whitePixel = this.whitePixels.shift();
            whitePixel.positions[i].x = x;
            whitePixel.positions[i].y = y;
            this.whitePixels.push(whitePixel);
          }
        }
      }
    }
    console.log('done');
    PX.ticker.add(this.draw, this);
  }
  /**
   * Draw all white pixels, even if they outside the screen
   */
  drawWhitePixels() {
    for (let pixel of this.whitePixels) {
      // lerp
      pixel.x =
          this.lerp(pixel.x, pixel.positions[this.imageIndex].x, LERP_FACTOR);
      pixel.y =
          this.lerp(pixel.y, pixel.positions[this.imageIndex].y, LERP_FACTOR);
    }
  }
  /**
   * Draw all black pixels, even if they outside the screen
   */
  drawBlackPixels() {
    for (let pixel of this.blackPixels) {
      // lerp
      pixel.x =
          this.lerp(pixel.x, pixel.positions[this.imageIndex].x, LERP_FACTOR);
      pixel.y =
          this.lerp(pixel.y, pixel.positions[this.imageIndex].y, LERP_FACTOR);
    }
  }
  /**
   * smooth transition
   */
  lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
  }

  draw() {
    /*
      code here
    */
    this.drawWhitePixels();
    this.drawBlackPixels();
  }
};

window.onload = function() {
  new App();
}
