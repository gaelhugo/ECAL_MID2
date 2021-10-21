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
  const pathToWrite = ref(DATABASE, "exercice");
  set(pathToWrite, objet);
};

//
//écouteur (Compatible P5)
const path = ref(DATABASE, "exercice");
let radius = 200;
onValue(path, (snapshot) => {
  const val = snapshot.val();
  document.getElementsByClassName("message")[0].textContent = val.numero;
  radius = map(parseInt(val.numero), 0, 9, 10, 200);
});

//EXERCICE SANS P5 NI CLASS

// IDENTIFIER QUEL PLAYER ON EST
// 1
const urlParameter = new URLSearchParams(window.location.search);
const player = urlParameter.get("player");
// PLAYER 1 => affiche seulement le message
// document.querySelector(".grid");
if (player == 1)
  document.getElementsByClassName("grid")[0].classList.add("hidden");
// PLAYER 2 => affiche seulement le clavier
if (player == 2) {
  document.getElementsByClassName("message")[0].classList.add("hidden");
  document.getElementsByTagName("canvas")[0].classList.add("hidden");
}

// 2
// ACTIVER LE CLICK SUR LES BOUTONS
document.getElementsByClassName("grid")[0].addEventListener("click", (e) => {
  console.log(e.target.textContent);
  // CHAQUE BOUTON ENVOIE SON NUMERO A FIREBASE
  send({ numero: e.target.textContent });
});

// 3
// A LA RECEPTION D'UNE VALEUR, ON CHANGE LE TEXTE DU MESSAGE

const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = 400;
canvas.height = 400;
const ctx = canvas.getContext("2d");

let angle = 0;

function draw() {
  // console.log("draw");
  ctx.fillStyle = `rgb(255,${radius},${255 - radius}`;
  ctx.fillRect(0, 0, 400, 400);

  const x = 200 + Math.cos(angle * (Math.PI / 180)) * radius;
  const y = 200 + Math.sin(angle * (Math.PI / 180)) * radius;
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.closePath();
  angle++;
  requestAnimationFrame(draw);
}

function map(num, start1, stop1, start2, stop2) {
  return ((num - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

function lerp(start, stop, amt) {
  return amt * (stop - start) + start;
}

draw();
