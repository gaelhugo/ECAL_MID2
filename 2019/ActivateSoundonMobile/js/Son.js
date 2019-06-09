class Son {
  constructor() {
    console.log('class sound');
    this.audio = document.createElement('audio');
    this.audio.src = 'sound.mp3';
    this.audio.id = 'audio';
    this.audio.controls = true;
    document.body.appendChild(this.audio)
  }
  play() {
    this.audio.play();
  }
  pause() {
    this.audio.pause();
  }
}
