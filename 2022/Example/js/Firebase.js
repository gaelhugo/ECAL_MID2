import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  onValue,
  onDisconnect,
} from "firebase/database";

export default class Firebase {
  constructor() {
    // Your web app's Firebase configuration
    //  A MODIFIER AVEC VOTRE CONFIGURATION PERSO
    const firebaseConfig = {
      apiKey: "***",
      authDomain: "***",
      databaseURL: "***",
      projectId: "***",
      storageBucket: "***",
      messagingSenderId: "***",
      appId: "***",
    };

    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.uid = user.uid;
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
  }

  send(_path, _val) {
    const path = ref(this.DATABASE, _path);
    set(path, _val);
  }
}
