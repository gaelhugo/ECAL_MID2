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
onValue(path, (snapshot) => {
  const val = snapshot.val();
  firebaseValue = val;
  newValue = true;
  document.querySelector(".message").textContent = val.numero;
});

//EXERCICE SANS P5 NI CLASS

// IDENTIFIER QUEL PLAYER ON EST
// 1
// PLAYER 1 => affiche seulement le message
// PLAYER 2 => affiche seulement le clavier

// 2
// ACTIVER LE CLICK SUR LES BOUTONS
// CHAQUE BOUTON ENVOIE SON NUMERO A FIREBASE

// 3
// A LA RECEPTION D'UNE VALEUR, ON CHANGE LE TEXTE DU MESSAGE

//1
const urlParameter = new URLSearchParams(window.location.search);
const player = urlParameter.get("player");
if (player == 1) {
  document.querySelector(".grid").classList.add("hidden");
}
if (player == 2) {
  document.querySelector(".message").classList.add("hidden");
}
//2
document.querySelector(".grid").addEventListener("click", (e) => {
  console.log(e.target.textContent);
  send({ numero: e.target.textContent });
});
