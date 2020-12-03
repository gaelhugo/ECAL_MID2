// CODE JS
console.log("hello, tout fonctionne");
class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    //ctxx
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = this.w = window.innerWidth;
    this.canvas.height = this.h = window.innerHeight;

    this.setup();
  }

  setup() {
    this.listener();
    //this.draw();
  }

  listener() {
    document.addEventListener("click", this.onClick.bind(this));
  }

  onClick(e) {
    e.preventDefault();
    const TEST_JSON_OBJECT = {
      levels: [
        {
          points: [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 2 },
          ],
          name: "level 1",
          targets: [
            { x: 10, y: 10 },
            { x: 11, y: 11 },
            { x: 21, y: 21 },
          ],
        },
        {
          points: [
            { x: 3, y: 3 },
            { x: 4, y: 4 },
            { x: 5, y: 5 },
          ],
          name: "level 2",
          targets: [
            { x: 110, y: 110 },
            { x: 111, y: 111 },
            { x: 211, y: 211 },
          ],
        },
        {
          points: [
            { x: 6, y: 6 },
            { x: 7, y: 7 },
            { x: 8, y: 8 },
          ],
          name: "level 3",
          targets: [
            { x: 1110, y: 1110 },
            { x: 1111, y: 1111 },
            { x: 2111, y: 2111 },
          ],
        },
      ],
    };
    this.downloadObjectAsJson(TEST_JSON_OBJECT, "myTest");
  }

  draw() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    requestAnimationFrame(this.draw.bind(this));
  }

  downloadObjectAsJson(exportObj, exportName) {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportObj));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}

window.onload = () => {
  new App();
};
