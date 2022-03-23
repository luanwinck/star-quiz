const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyB6vQS34WztK7_Jvn6p0GnDznhhzJBQ9gw",
  authDomain: "star-quiz-92519.firebaseapp.com",
  projectId: "star-quiz-92519",
  storageBucket: "star-quiz-92519.appspot.com",
  messagingSenderId: "972511423407",
  appId: "1:972511423407:web:f598caecf4f41448de9d5a"
};

initializeApp(firebaseConfig);

const firebaseDb = getFirestore();

module.exports = {
  firebaseDb,
}