import Playground from "@onemorestudio/playgroundjs";
import Shape from "./Shape";
export default class App extends Playground {
  constructor() {
    super();
    this.handler = {
      click: this.onClick.bind(this),
      keydown: this.onKeyDown.bind(this),
    };
    this.zoom = 1;
    this.zoomGoal = 1;
    this.speed = 0.001;
    this.allShapes = [];

    const query = window.location.search;
    const urlParams = new URLSearchParams(query);
    this.page = urlParams.get("page") || 0;
    // console.log(this.page);

    /**
     *  LOAD ALL SHAPES WITH FIREBASE PARAMETERS
     */

    // 217
    // console.log(Math.sqrt(217));

    const ObjectFirebase = {
      asdf1élkj: { val2: 0.32, val3: 0.56 },
      asdfé2lkj: { val2: 0.32, val3: 0.56 },
      asdf2élkj: { val2: 0.32, val3: 0.56 },
      asdfél3kj: { val2: 0.32, val3: 0.56 },
      asd4félkj: { val2: 0.32, val3: 0.56 },
      asd5félkj: { val2: 0.32, val3: 0.56 },
      asd6félkj: { val2: 0.32, val3: 0.56 },
      asd7félkj: { val2: 0.32, val3: 0.56 },
      asdf8élkj: { val2: 0.32, val3: 0.56 },
      as9dfélkj: { val2: 0.32, val3: 0.56 },
      as1dfélkj: { val2: 0.32, val3: 0.56 },
      asd2félkj: { val2: 0.32, val3: 0.56 },
      as1dfwélkj: { val2: 0.32, val3: 0.56 },
      asdf2élkdj: { val2: 0.32, val3: 0.56 },
      as7dfél4kj: { val2: 0.32, val3: 0.56 },
      asd23félkj: { val2: 0.32, val3: 0.56 },
      asdf5élkj: { val2: 0.32, val3: 0.56 },
      asdfél8kj: { val2: 0.32, val3: 0.56 },
      asdf2élkj: { val2: 0.32, val3: 0.56 },
      ashdfélkj: { val2: 0.32, val3: 0.56 },
      asdqfélkj: { val2: 0.32, val3: 0.56 },
      asdffélkj: { val2: 0.32, val3: 0.56 },
      asdfsélkj: { val2: 0.32, val3: 0.56 },
      asdfélkj: { val2: 0.32, val3: 0.56 },
      asdfélkmj: { val2: 0.32, val3: 0.56 },
      asadfélkj: { val2: 0.32, val3: 0.56 },
      asydfvélkj: { val2: 0.32, val3: 0.56 },
      asdfyélkj: { val2: 0.32, val3: 0.56 },
      asydfélkj: { val2: 0.32, val3: 0.56 },
      asdyfélkj: { val2: 0.32, val3: 0.56 },
      asdfélkkj: { val2: 0.32, val3: 0.56 },
      asdjfélkj: { val2: 0.32, val3: 0.56 },
      asdsfélkj: { val2: 0.32, val3: 0.56 },
      asdsfélkj: { val2: 0.32, val3: 0.56 },
      asdféklkj: { val2: 0.32, val3: 0.56 },
      a11sdfélkj: { val2: 0.32, val3: 0.56 },
      asd22félkj: { val2: 0.32, val3: 0.56 },
      t7: { val2: 0.32, val3: 0.56 },
      aszzdfélkj: { val2: 0.32, val3: 0.56 },
      asdfélookj: { val2: 0.32, val3: 0.56 },
    };

    const keys = Object.keys(ObjectFirebase);

    const col = 4;
    const li = 4;

    const limit = col * li;
    const depart = this.page * limit;
    const arrivee = depart + limit;
    let x = 0;
    let y = 0;
    let name = 0;
    keys.forEach((key, index) => {
      if (index >= depart && index < arrivee) {
        if (y < li) {
          this.allShapes.push(
            new Shape(x * 60 + 60, y * 60 + 60, 30, 30, name)
          );
          x++;
          if (x % col == 0) {
            x = 0;
            y++;
          }
          name++;
        }
      }
    });

    // let name = 0;
    // for (let j = 0; j < 4; j++) {
    //   for (let i = 0; i < 4; i++) {
    //     this.allShapes.push(new Shape(i * 60 + 60, j * 60 + 60, 30, 30, name));
    //     name++;
    //   }
    // }

    document.addEventListener("click", this.handler.click);

    // search box
    const search = document.createElement("input");
    search.type = "text";
    search.value = `Entrez un chiffre de 0 à ${this.allShapes.length - 1}`;
    search.setAttribute(
      "style",
      "position:absolute;top:0px;left:0px;width:300px"
    );
    document.body.appendChild(search);
    search.addEventListener("keydown", this.handler.keydown);

    this.draw();
  }

  onKeyDown(e) {
    if (e.key == "Enter") {
      let nearest = null;
      this.allShapes.forEach((shape) => {
        if (shape.name == e.target.value) {
          nearest = { x: shape.x, y: shape.y };
        }
      });

      if (this.zoomGoal != 1) {
        this.zoomGoal = 1;
        this.speed = 0.09;
        setTimeout(() => {
          this.changeFocus(nearest);
        }, 2000);
      } else {
        this.changeFocus(nearest);
      }
    }
    if (e.keyCode == "13") {
      console.log("spacebar");
    }
  }

  changeFocus(nearest) {
    this.zoomGoal = 25;
    this.speed = 0.001;
    // center the grid to that element
    // by calculating the X-Y diff from the center
    this.offset = {
      x: window.innerWidth / 2 - nearest.x,
      y: window.innerHeight / 2 - nearest.y,
    };
    // set new goal for each shape
    this.allShapes.forEach((shape) => {
      shape.newGoal.x += this.offset.x;
      shape.newGoal.y += this.offset.y;
    });
  }

  onClick(e) {
    if (e.target.tagName == "INPUT") {
    } else {
      if (this.zoomGoal != 1) {
        this.zoomGoal = 1;
        this.speed = 0.09;
      } else {
        //   get the nearest element
        let nearest = null;
        let maxDist = 1000;
        this.allShapes.forEach((shape) => {
          const dist = this.dist(shape.x, shape.y, e.x, e.y);
          if (dist < maxDist) {
            maxDist = dist;
            nearest = { x: shape.x, y: shape.y };
          }
        });
        this.changeFocus(nearest);
      }
    }
  }

  draw() {
    this.ctx.fillStyle = "rgba(255,255,255,0.1)";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.save();
    this.ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
    this.zoom = this.lerp(this.zoom, this.zoomGoal, this.speed);
    this.ctx.scale(this.zoom, this.zoom);
    this.allShapes.forEach((shape) => {
      shape.x = this.lerp(shape.x, shape.newGoal.x, this.speed * 20);
      shape.y = this.lerp(shape.y, shape.newGoal.y, this.speed * 20);
      shape.draw(this.ctx);
    });

    this.ctx.restore();
    requestAnimationFrame(this.draw.bind(this));
  }

  lerp(start, stop, amount) {
    return amount * (stop - start) + start;
  }

  dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
}
