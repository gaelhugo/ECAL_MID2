import Utils from "./Utils";
export default class Letters {
  constructor() {
    this.loadLetters();
  }
  async loadLetters() {
    this.letters = await Utils.loadJSON("json/letters.json");
  }
  get(letter) {
    if (this.letters) return this.letters[letter.toLowerCase()];
    else return [];
  }
}
