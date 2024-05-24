import Firebase from "./Firebase";
export default class MobileApp {
  constructor() {
    this.createButtons();
    this.initFirebase();
  }

  createButtons() {
    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    for (let i = 0; i < 3; i++) {
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
    slider.dataset.index = 4;
    slider.value = this.angle;
    slider.addEventListener("input", (e) => {
      // this.particles.forEach((particle) => {
      //   particle.radius = e.target.value;
      // });
      this.firebase.send("remoteControl", {
        index: 4,
        slider: e.target.value,
        time: new Date().getTime(),
      });
    });
    wrapper.appendChild(slider);
  }

  initFirebase() {
    this.firebase = new Firebase();
  }

  action(e) {
    console.log(e);
    this.firebase.send("remoteControl", {
      index: e.target.dataset.index,
      time: new Date().getTime(),
    });
  }
}
