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
import Machine from "./Machine";
import * as centroid from "triangle-centroid";
import * as incenter from "triangle-incenter";
import * as circumcenter from "circumcenter";
import Blob from "./Blob";

export default class App extends Playground {
  constructor() {
    super();

    this.myMachine = new Machine(this.width / 2, this.height / 2);

    this.triangle = [
      [100, 100],
      [400, 400],
      [0, 200],
    ];
    this.centroid = centroid(this.triangle);
    this.incenter = incenter(this.triangle);
    this.circumcenter = circumcenter(this.triangle);

    this.circumcenterRadius = this.dist(
      this.triangle[0][0],
      this.triangle[0][1],
      this.circumcenter[0],
      this.circumcenter[1]
    );
    // console.log("centroid", this.centroid);
    console.log(this.incenter, this.circumcenter);
    this.blob = new Blob(this.circumcenter, this.circumcenterRadius);
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "black";
    this.myMachine.draw(this.ctx);

    this.triangle.forEach((point) => {
      this.ctx.beginPath();
      this.ctx.arc(point[0], point[1], 20, 0, Math.PI * 2, false);
      this.ctx.fill();
      this.ctx.closePath();
    });

    //
    this.ctx.fillStyle = "red";
    this.ctx.beginPath();
    this.ctx.arc(this.centroid[0], this.centroid[1], 4, 0, Math.PI * 2, false);
    this.ctx.fill();
    this.ctx.closePath();

    //
    this.ctx.fillStyle = "green";
    this.ctx.beginPath();
    this.ctx.arc(this.incenter[0], this.incenter[1], 4, 0, Math.PI * 2, false);
    this.ctx.fill();
    this.ctx.closePath();

    //
    this.ctx.fillStyle = "blue";
    this.ctx.beginPath();
    this.ctx.arc(
      this.circumcenter[0],
      this.circumcenter[1],
      4,
      0,
      Math.PI * 2,
      false
    );
    this.ctx.fill();
    this.ctx.closePath();

    //
    this.ctx.fillStyle = "grey";
    this.ctx.beginPath();
    this.ctx.arc(
      this.circumcenter[0],
      this.circumcenter[1],
      this.circumcenterRadius,
      0,
      Math.PI * 2,
      false
    );
    this.ctx.stroke();
    this.ctx.closePath();

    this.blob.draw(this.ctx);

    requestAnimationFrame(this.draw.bind(this));
  }

  dist(a, b, c, d) {
    return Math.sqrt(Math.pow(c - a, 2) + Math.pow(d - b, 2));
  }
}
