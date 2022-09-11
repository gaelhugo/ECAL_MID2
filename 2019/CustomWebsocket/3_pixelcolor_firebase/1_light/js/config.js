// Initialize Firebase
var config = {
  apiKey: 'AIzaSyBZmYMCRP-QYJreT2tLSbe3TTOqTYBAgLg',
  authDomain: 'nrd-light.firebaseapp.com',
  databaseURL: 'https://nrd-light.firebaseio.com',
  projectId: 'nrd-light',
  storageBucket: 'nrd-light.appspot.com',
  messagingSenderId: '556896552819'
};
firebase.initializeApp(config);

// stipuler qu'on va utiliser l'utilisateur anonyme
// firebase.auth().onAuthStateChanged(function(user){
//   if(user){
//
//   }
// });

firebase.auth().signInAnonymously().catch(function (error) {
    console.log(error.message);
});
