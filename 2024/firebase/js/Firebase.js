//FIREBASE
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

import EventEmitter from "@onemorestudio/eventemitterjs";
// extend the class with a custom event emitter to be able to listen when data are received
export default class Firebase extends EventEmitter {
  constructor() {
    super();
    // Your web app's Firebase configuration
    const firebaseConfig = {};

    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);

    this.DATABASE = getDatabase();

    console.log(this.DATABASE);
    //
    this.resume = false;
    //path
    const path = ref(this.DATABASE, `remoteControl`);
    //
    onValue(path, (snapshot) => {
      if (!this.resume) {
        this.resume = true;
      } else {
        const val = snapshot.val();
        console.log("----------val", val);
        this.emit("dataReceived", [val]);
      }
    });
  }

  send(_path, _val) {
    const path = ref(this.DATABASE, _path);
    console.log(path, _val);
    set(path, _val);
  }
}
