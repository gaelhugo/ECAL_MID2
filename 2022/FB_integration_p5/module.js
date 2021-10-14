import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

const firebaseConfig = {
  //...
  //your config
  //...
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// on s'authentifie de manière anonyme
const auth = getAuth();

signInAnonymously(auth).then(() => {
  console.log("all good, signed in");
});

// on récupère l'objet DATABASE
const DATABASE = getDatabase();

// pour enregistrer des valeurs
window.send = (objet) => {
  //ecriture dans la base de donnee
  const pathToWrite = ref(DATABASE, "test");
  set(pathToWrite, objet);
};

//
//écouteur (Compatible P5)
const path = ref(DATABASE, "test");
window.newValue = false;
window.firebaseValue = null;
let firstShot = false;
onValue(path, (snapshot) => {
  if (!firstShot) {
    firstShot = true;
  } else {
    const val = snapshot.val();
    firebaseValue = val;
    newValue = true;
  }
});
