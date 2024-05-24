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
import Particle from "./Particle";
import Firebase from "./Firebase";
import * as dat from "dat.gui";
export default class App extends Playground {
  constructor() {
    super();
    this.particles = [];
    this.initParticles();
    this.createButtons();
    this.initFirebase();
    this.initGUI();
    this.draw();
  }

  initParticles() {
    const colors = [
      `hsl(${Math.random() * 360}, 50%, 50%)`,
      `hsl(${Math.random() * 360}, 50%, 50%)`,
      `hsl(${Math.random() * 360}, 50%, 50%)`,
    ];
    const emojis = ["😎", "👽", "💩"];
    const nbr = 2500;
    let index = 0;
    for (let i = 0; i < nbr; i++) {
      const radius = 4;
      const color = colors[index];
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      this.particles.push(new Particle(x, y, radius, color, emojis[index]));
      if (i % Math.floor(nbr / colors.length) === 0 && i !== 0) {
        index++;
      }
    }
  }

  initGUI() {
    this.gui = new dat.GUI();
    this.angle = 1;
    this.gui.add(this, "angle", 0, 10, 1).onChange((value) => {
      // console.log("change");
      this.action({
        target: { dataset: { index: String(1) } },
      });
    });
    this.gui.domElement.style.position = "absolute";
    this.gui.domElement.style.top = 0;
    document.body.appendChild(this.gui.domElement);
  }

  createButtons() {
    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    for (let i = 0; i < 4; i++) {
      const button = document.createElement("button");
      button.innerHTML = `Action (${i})`;
      button.dataset.index = i;
      wrapper.appendChild(button);
      document.body.appendChild(wrapper);
      button.addEventListener("click", this.action.bind(this));
    }

    // add slider with range 1-10
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = 1;
    slider.max = 10;
    slider.value = this.angle;
    slider.addEventListener("input", (e) => {
      // this.angle = e.target.value;
      this.particles.forEach((particle) => {
        particle.radius = e.target.value;
      });
    });
    wrapper.appendChild(slider);
  }

  initFirebase() {
    this.firebase = new Firebase();
    this.firebase.addEventListener(
      "dataReceived",
      this.onFirebaseData.bind(this)
    );
  }

  onFirebaseData(data) {
    console.log("***DATA***", data);
    this.action({
      target: {
        dataset: { index: String(data.index), slider: parseInt(data.slider) },
      },
    });
  }

  action(e) {
    // console.log(e);
    switch (e.target.dataset.index) {
      case "0":
        //  position all particles in a circle following the fibonacci sequence
        const goldenRatio = 1.61803398875;
        const angle = Math.PI * 2 * goldenRatio;
        let radius = 0;
        let index = 0;
        this.particles.forEach((particle, i) => {
          radius = i * 0.3;
          const x = this.canvas.width / 2 + Math.cos(angle * i) * radius;
          const y = this.canvas.height / 2 + Math.sin(angle * i) * radius;
          particle.target = { x, y };
        });
        break;
      case "1":
        //  position all particles in a sinusoidal grid
        const rows = 50;
        const cols = 50;
        const margin = 100;
        const width = this.canvas.width - margin * 2;
        const height = this.canvas.height - margin * 2;
        const stepX = width / cols;
        const stepY = height / rows;
        let alpha = 0;
        this.particles.forEach((particle, i) => {
          const deltaX = Math.cos(alpha) * stepX;
          const deltaY = Math.sin(alpha) * stepY;

          const x = margin + (i % cols) * stepX + deltaX;
          const y = margin + Math.floor(i / cols) * stepY + deltaY;
          particle.target = { x, y };
          alpha += this.angle;
        });

        break;
      case "2":
        //  split the particle in 3 groups, grouped by color
        let color = null;

        let groupCenter = {
          x: this.canvas.width / 2,
          y: this.canvas.height / 2,
        };
        const bigRadius = 100;
        this.particles.forEach((particle) => {
          if (color != particle.color) {
            color = particle.color;
            // set the group center to a random position
            groupCenter = {
              x:
                Math.random() * (this.canvas.width - bigRadius * 2) + bigRadius,
              y:
                Math.random() * (this.canvas.height - bigRadius * 2) +
                bigRadius,
            };
          }
          // organize the particles in a circle around the group center
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * bigRadius;
          const x = groupCenter.x + Math.cos(angle) * radius;
          const y = groupCenter.y + Math.sin(angle) * radius;
          particle.target = { x, y };
        });

        break;
      case "3":
        console.log("ENVOI DE DONNEES A FIREBASE");

        this.firebase.send("remoteControl", {
          index: 2,
          time: new Date().getTime(),
        });

        break;

      case "4":
        this.particles.forEach((particle) => {
          particle.radius = e.target.dataset.slider;
        });
        break;
      default:
        break;
    }
  }

  draw() {
    // console.log(this.angle);
    this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((particle) => {
      particle.easeTo();
      particle.draw(this.ctx);
    });

    requestAnimationFrame(this.draw.bind(this));
  }
}
