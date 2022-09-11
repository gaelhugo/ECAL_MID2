export default class Bot {
  constructor() {
    fetch("https://lab.onemore-studio.com/ecal/chat/.data.json")
      .then((data) => data.json())
      .then((json) => {
        this.data = json;
        this.index =
          Math.floor(Math.random() * this.data.botMessages.length) - 1;
      });
  }
  get message() {
    this.index++;
    if (this.index >= this.data.botMessages.length) this.index = 0;
    return this.data.botMessages[this.index].message;
  }
}
