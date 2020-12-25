// Initialize Firebase
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCboafcPQ_3ZRI1Sf_00MSpl_SURHWnOI",
  authDomain: "jeudiecal.firebaseapp.com",
  databaseURL: "https://jeudiecal.firebaseio.com",
  projectId: "jeudiecal",
  storageBucket: "jeudiecal.appspot.com",
  messagingSenderId: "867653886807",
  appId: "1:867653886807:web:5652a4cbdda0fe1de75412",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// NE PAS OUBLIER DE CONFIGURER FIREBASE AUTH TO ANONYMOUS !!!

// SIGN ANONYMOUS USER ----
firebase.auth().onAuthStateChanged((user) => {
  console.log("onAuthStateChanged");
  if (user) {
    console.log(user);
    // User is signed in.
    let isAnonymous = user.isAnonymous;
    let uid = user.uid;
    // console.log(uid);
  } else {
    // No user is signed in.
  }
});

firebase
  .auth()
  .signInAnonymously()
  .catch((error) => {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log("anonymously auth error ----- " + errorCode);
    console.log(errorCode);
  });

DATABASE = firebase.database();

function SEND_MESSAGE(_type, _data = "yes") {
  // _data = {'data': _data, 't_created': Date.now()};
  DATABASE.ref(_type).set(_data);
}
