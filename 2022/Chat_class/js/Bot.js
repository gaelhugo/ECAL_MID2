const data = require("../.data.json");
export default class Bot {
  constructor() {}
  get message() {
    return data.botMessages[Math.floor(Math.random() * data.botMessages.length)]
      .message;
  }
}
