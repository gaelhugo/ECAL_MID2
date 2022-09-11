import Bubble from "./Bubble";
import Firebase from "./Firebase";
import Bot from "./Bot";
export default class App {
  constructor() {
    this.wrapper = document.querySelector(".bubble_wrapper");
    this.messages = document.querySelector(".messages");
    this.button = document.getElementsByTagName("button")[0];
    this.entry = document.querySelector("#entry");
    this.button.addEventListener("click", this.onClick.bind(this));
    this.entry.addEventListener("keydown", this.onKeyDown.bind(this));
    //
    this.FIREBASE = new Firebase();
    this.FIREBASE.addEventListener("dataReceived", this.onData.bind(this));
    //
    this.bot = new Bot();
  }

  onClick(e) {
    e.preventDefault();
    //   create a bubble
    this.FIREBASE.send(`chat`, { message: this.entry.value, user: "student" });
    // const bubble = new Bubble(this.entry.value, this.messages);
    this.entry.value = "";
  }

  onKeyDown(e) {
    if (e.key == "Enter") {
      //   create a bubble
      this.FIREBASE.send(`chat`, {
        message: this.entry.value,
        user: "student",
      });
      // const bubble = new Bubble(this.entry.value, this.messages);
      this.entry.value = "";
    }
  }

  onData(val) {
    if (val.user == "student") {
      const bubble = new Bubble(val.message, this.messages, "right");
      setTimeout(() => {
        this.FIREBASE.send(`chat`, {
          message: this.bot.message,
          user: "bot",
        });
      }, 1000);
    } else if (val.user == "bot") {
      const bubble = new Bubble(val.message, this.messages, "left");
    }
  }
}
