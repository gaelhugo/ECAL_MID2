// Initialize Firebase
var config = {
  apiKey: 'AIzaSyBCboafcPQ_3ZRI1Sf_00MSpl_SURHWnOI',
  authDomain: 'jeudiecal.firebaseapp.com',
  databaseURL: 'https://jeudiecal.firebaseio.com',
  projectId: 'jeudiecal',
  storageBucket: 'jeudiecal.appspot.com',
  messagingSenderId: '867653886807'
};
firebase.initializeApp(config);

// stipuler qu'on va utiliser l'utilisateur anonyme
// firebase.auth().onAuthStateChanged(function(user){
//   if(user){
//
//   }
// });

firebase.auth().signInAnonymously().catch(function(error) {
  console.log(error.message);
});
