class App {
  constructor() {
    this.button = document.getElementsByTagName('button')[0];
    this.audio = new Son();
  }

  setupListeners() {
    // FIRST INTERACTION TO LET AUDIO TO BE PLAYED BY JS
    this.button.addEventListener('click', this.onclick.bind(this));
  }

  onclick(e) {
    // ACTIVATE AUDIO
    this.audio.play();
    // PAUSE AUDIO
    this.audio.pause();
    // EXAMPLE OF delayed sound...
    setTimeout(() => this.audio.play(), 10000);
  }
};

window.onload = function() {
  new App();
}
