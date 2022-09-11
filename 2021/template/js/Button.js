class Button {
  constructor(x, y, w, h, ctx) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.ctx = ctx;
    this.color = "black";
    this.ID = Math.random() * 10;
    document.addEventListener("click", this.send.bind(this));

    this.URLS = [
      "https://pbs.twimg.com/media/DkflEb-XcAAT9JT.jpg",
      "https://headerpop.com/wp-content/uploads/2018/08/insta-repeat-ce-compte-nous-montre-comment-les-photos-instagram-se-ressemblent-toutes-01.jpg",
      "https://i.dailymail.co.uk/i/newpix/2018/08/01/15/4EB3F44A00000578-6015131-image-a-48_1533132975450.jpg",
    ];

    this.image = new Image();
    this.image.src = this.URLS[0];
  }
  show() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
    this.ctx.drawImage(this.image, this.x, this.y, 200, 200);
  }

  send() {
    SEND_MESSAGE("COLOR_CHANGE", {
      color: `rgb(${Math.round(Math.random() * 255)},0,${Math.round(
        Math.random() * 255
      )})`,
      image: this.URLS[Math.floor(this.URLS.length * Math.random())],
      id: this.ID,
    });
  }

  changeColor(data) {
    if (this.ID != data.id) {
      this.color = data.color;
      this.image.src = data.image;
    }
  }
}
