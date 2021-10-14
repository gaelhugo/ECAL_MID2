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
  //VOTRE CONFIG FIREBASE
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
  const pathToWrite = ref(DATABASE, "exercice");
  set(pathToWrite, objet);
};

//
//écouteur (Compatible P5)
const path = ref(DATABASE, "exercice");
onValue(path, (snapshot) => {
  const val = snapshot.val();
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
