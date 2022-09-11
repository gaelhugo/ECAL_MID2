/**
CREATIVE CODING
---
Kill server : CTRL + C
Start server : npm run start
Start secure server : npm run start-https
Final build : npm run build
---
To generate new certificate for https connection with external device run :
#sh
mkcert 0.0.0.0 localhost 127.0.0.1 yourLocalIP ::1
mv 0.0.0.0+4-key.pem certificate.key
mv 0.0.0.0+4.pem certificate.cert
**/

import Playground from "@onemorestudio/playgroundjs";
import * as dat from "dat.gui";
import Dancer from "./Dancer";
import GuiColor from "./GuiColor";

export default class App extends Playground {
  constructor() {
    super();
    this.ctx.strokeStyle = "white";
    this.ctx.lineCap = "round";

    // this.GUI = new GuiColor();
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
      ])
    ).onChange((data) => {
      console.log(this.stringToColors(data));
    });
    this.c.__radios.map(this.colorLabel.bind(this));

    // this.gui.useLocalStorage = false;
    const scale = this.gui.addFolder("DANCER OPTIONS");
    scale.add(SCALE, "scale", 1, 3);

    this.dancer = new Dancer(0, 0);

    scale.add(this.dancer, "showLine");
    scale.add(this.dancer, "lineWidth", 1, 20);

    // generate FULL UI CONTROL
    const keys = Object.keys(this.dancer.skeleton);
    keys.forEach((part) => {
      const chapter = this.gui.addFolder(part);
      const ax = chapter.add(
        this.dancer.skeleton[part].intensity,
        "amplitudeX",
        0,
        100
      );
      const ay = chapter.add(
        this.dancer.skeleton[part].intensity,
        "amplitudeY",
        0,
        100
      );
      chapter.add(this.dancer.skeleton[part], "speed", -4, 4);
      const a = chapter.add(this.dancer.skeleton[part], "angle", 0, 360);
      const lu = chapter.add(
        this.dancer.skeleton[part].limit,
        "limitUp",
        0,
        360
      );
      const ld = chapter.add(
        this.dancer.skeleton[part].limit,
        "limitDown",
        0,
        360
      );
      chapter.add(this.dancer.skeleton[part], "isBoomerang").onChange((val) => {
        if (val) {
          ax.setValue(60);
          ay.setValue(60);
          a.setValue(0);
          lu.setValue(90);
          ld.setValue(0);
        }
      });
    });

    document.addEventListener("keydown", (e) => {
      console.log(e.keyCode);
      if (e.keyCode == 32) {
        // console.log(this.age.getValue());
      }
    });

    this.draw();
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

  draw() {
    // this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "grey";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.save();
    this.ctx.translate(this.width / 2, this.height / 2 + 135 * SCALE.scale);
    this.dancer.draw(this.ctx);
    this.ctx.restore();
    requestAnimationFrame(this.draw.bind(this));
  }
}
