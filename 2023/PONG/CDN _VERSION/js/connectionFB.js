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

// const firebaseConfig = {
//   apiKey: "AIzaSyBs9U_pmY9GrE_Wn8d4hAmSNRw3rDLTmIw",
//   authDomain: "demopong.firebaseapp.com",
//   projectId: "demopong",
//   storageBucket: "demopong.appspot.com",
//   messagingSenderId: "834495338504",
//   databaseURL:
//     "https://demopong-default-rtdb.europe-west1.firebasedatabase.app/",
//   appId: "1:834495338504:web:40f1d3e9f3b3d3c7fdd9bd",
// };

const firebaseConfig = {
  apiKey: "AIzaSyBs9U_pmY9GrE_Wn8d4hAmSNRw3rDLTmIw",
  authDomain: "demopong.firebaseapp.com",
  projectId: "demopong",
  storageBucket: "demopong.appspot.com",
  messagingSenderId: "834495338504",
  databaseURL:
    "https://demopong-default-rtdb.europe-west1.firebasedatabase.app/",
  appId: "1:834495338504:web:40f1d3e9f3b3d3c7fdd9bd",
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

//
const path = ref(DATABASE, "position");

//écouteur
onValue(path, (snapshot) => {
  const val = snapshot.val();
  window.firebaseValue = val;
});

window.send = (objet) => {
  //ecriture dans la base de donnee
  const pathToWrite = ref(DATABASE, "position");
  set(pathToWrite, objet);
};
