import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
    getDatabase,
    ref,
    set,
    onValue,
    onDisconnect,
} from "firebase/database";

// ___________________________________  Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAX3jef_f8jq3C9_ktADt5gSFouWxkerOQ",
    authDomain: "contrariogame.firebaseapp.com",
    databaseURL:
      "https://contrariogame-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "contrariogame",
    storageBucket: "contrariogame.appspot.com",
    messagingSenderId: "907964337155",
    appId: "1:907964337155:web:0bb49b0404e461c1e15236",
  };

const app = initializeApp(firebaseConfig);

// ___________________________________  Initialize Firebase
const auth = getAuth();
console.log(auth);

// ___________________________________ permet de pas avoir a s'identifier a chaque fois, linker ce truc de loggin anonymous. code cree par Gael
signInAnonymously(auth)
  .then(() => {
    console.log("signed in anonymously");
  })

  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });

// ___________________________________ Import the functions you need from the SDKs you need

const DATABASE = getDatabase(app);
console.log(DATABASE);

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const path = ref(DATABASE, 'contrario/test');

set(path, Date.now().toString())

export function testChanger(listener) {
    
    //
    onValue(path, (snapshot) => { // 
                let val = snapshot.val(); // faire appel à la fonction val, class avec pleins de fonctions
                // emit("dataReceived", [val]);
                listener(val);
        });
    }

