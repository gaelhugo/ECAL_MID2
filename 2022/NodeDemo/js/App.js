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

export default class App extends Playground {
  constructor() {
    super();

    this.myMachine = new Machine(this.width / 2, this.height / 2);

    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.myMachine.draw(this.ctx);
    requestAnimationFrame(this.draw.bind(this));
  }
}
