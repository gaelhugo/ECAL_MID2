export default class Utils {
  constructor() {}

  //load json file
  static loadJSON(url) {
    return fetch(url)
      .then((response) => response.json())
      .then((json) => json);
  }
}
