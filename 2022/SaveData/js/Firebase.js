import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  onDisconnect,
} from "firebase/database";

export default class Firebase {
  constructor() {
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

  async getFullData(chemin) {
    const path = ref(this.DATABASE, chemin);
    const data = await get(path);
    return data;
  }
}
