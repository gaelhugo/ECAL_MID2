import * as dat from "dat.gui";
export default class GuiColor {
  constructor() {
    this.gui = new dat.GUI();

    const config = {
      couleurs: "ffffff-000000",
    };

    this.c = this.selectToRadios(
      this.gui.add(config, "couleurs", [
        "ffffff-000000",
        "002626-0e4749-95c623-e55812-efe7da",
        "003049-d62828-f77f00-fcbf49-eae2b7",
        "20bf55-0b4f6c",
        "1a535c-4ecdc4-f7fff7-ff6b6b-ffe66d",
        "cc211a-234ec3-f6dc28-e8ebf7-acbed8",
        "5d737e-64b6ac-c0fdfb-daffef-fcfffd",
        "ff9f1c-ffbf69-ffffff-cbf3f0-2ec4b6",
        "50514f-f25f5c-ffe066-247ba0-70c1b3",
      ])
    ).onChange((data) => {
      console.log(this.stringToColors(data));
    });
    this.c.__radios.map(this.colorLabel.bind(this));
  }

  stringToColors(url) {
    return url.split("-").map((c) => {
      return "#" + c;
    });
  }
  gradient(colors) {
    return (
      "linear-gradient(90deg," +
      colors.map((color, i, colors) => {
        return (
          color +
          " " +
          (i * 100) / colors.length +
          "%" +
          "," +
          color +
          " " +
          ((i + 1) * 100) / colors.length +
          "%"
        );
      }) +
      ")"
    );
  }

  colorLabel(label) {
    label.style.display = "inline-flex";
    label.style.alignItems = "center";
    var radio = label.children[0];
    radio.nextSibling.remove();
    var span = document.createElement("span");
    span.style.background = this.gradient(this.stringToColors(radio.value));
    span.style.paddingRight = "10em";
    span.style.height = "25px";
    span.style.display = "inline-block";
    span.style.marginRight = "0em";
    label.appendChild(span);
  }

  selectToRadios(controller) {
    var wrapper = controller.domElement;
    var select = wrapper.children[0];

    wrapper.parentNode.parentNode.style.height = "auto";
    controller.__radios = Array.prototype.map.call(
      select.children,
      (option, i) => {
        var radio = document.createElement("input");
        radio.type = "radio";
        radio.name = option.name;
        radio.value = option.value;
        radio.checked = option.selected;

        radio.addEventListener("change", (e) => {
          option.selected = true;
          this.c.__select.dispatchEvent(new e.constructor(e.type, e));
        });

        var label = document.createElement("label");
        label.appendChild(radio);
        label.appendChild(document.createTextNode(option.innerText));
        wrapper.appendChild(label);
        return label;
      }
    );
    wrapper.removeChild(select);
    return controller;
  }
}
