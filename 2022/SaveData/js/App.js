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
import Firebase from "./Firebase";
import RoundedShape from "./RoundedShape";
export default class App extends Playground {
  constructor() {
    super();
    // this.shapes = [
    //   [0, 4],
    //   [4, 7],
    //   [4, 6],
    //   [7, 8],
    // ];

    //  LOAD INITIAL DATA

    this.init();
  }

  async init() {
    const FB = new Firebase();

    const snapshot = await FB.getFullData("exercice");
    console.log(snapshot.val());





    
    this.allShapes = [];
    this.allShapes.push(
      new RoundedShape(100, 100, [
        [0, 4],
        [4, 7],
        [4, 6],
        [7, 8],
      ])
    );
    this.allShapes.push(
      new RoundedShape(400, 100, [
        [0, 1],
        [1, 4],
        // [1, 5],
        [5, 8],
      ])
    );
    this.allShapes.push(
      new RoundedShape(700, 100, [
        [3, 4],
        [4, 6],
        [4, 2],
      ])
    );

    this.allShapes.push(
      new RoundedShape(100, 400, [
        [0, 4],
        [4, 7],
        [4, 6],
        [7, 8],
      ])
    );
    this.allShapes.push(
      new RoundedShape(400, 400, [
        [7, 4],
        [4, 2],
        [2, 5],
      ])
    );
    this.allShapes.push(
      new RoundedShape(700, 400, [
        [0, 4],
        [4, 8],
        [8, 6],
      ])
    );

    // this.myRoundedShape = new RoundedShape(100, 100);
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    // this.myRoundedShape.draw(this.ctx);
    this.allShapes.forEach((shape) => {
      shape.draw(this.ctx);
    });
    requestAnimationFrame(this.draw.bind(this));
  }
}
