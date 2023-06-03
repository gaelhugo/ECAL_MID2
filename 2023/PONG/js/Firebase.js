//FIREBASE
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  onValue,
  onDisconnect,
} from "firebase/database";

import EventEmitter from "@onemorestudio/eventemitterjs";

export default class Firebase extends EventEmitter {
  constructor() {
    super();
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyAXBDZ7oprpy-U1ARStWUFg20DkjVKcBbc",
      authDomain: "projetexample.firebaseapp.com",
      databaseURL: "https://projetexample.firebaseio.com",
      projectId: "projetexample",
      storageBucket: "projetexample.appspot.com",
      messagingSenderId: "623421962452",
      appId: "1:623421962452:web:a1f376413adf0f1a33a341",
    };

    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
      }
    });
    signInAnonymously(auth)
      .then(() => {
        console.log("signed in");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
    this.DATABASE = getDatabase();

    console.log(this.DATABASE);
    //
    this.resume = false;
    //path
    const path = ref(this.DATABASE, `positionBall`);
    //
    onValue(path, (snapshot) => {
      if (!this.resume) {
        this.resume = true;
      } else {
        const val = snapshot.val();
        console.log("val", val);
        this.emit("dataReceived", [val]);
      }
    });
  }

  send(_path, _val) {
    const path = ref(this.DATABASE, _path);
    set(path, _val);
  }
}
