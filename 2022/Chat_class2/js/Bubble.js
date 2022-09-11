export default class Bubble {
  constructor(text, container, side) {
    this.container = container;
    const div = document.createElement("div");
    div.classList.add("bubble", side);
    div.innerHTML = text;
    this.container.appendChild(div);
  }
}
