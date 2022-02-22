const { initializeApp } = require("firebase/app");

const firebaseConfig = {
  apiKey: "AIzaSyCqPH40Dnqt3RZjkZWYWJ8vkXBx35-hRO8",
  authDomain: "imagens-36fc6.firebaseapp.com",
  projectId: "imagens-36fc6",
  storageBucket: "imagens-36fc6.appspot.com",
  messagingSenderId: "429572668233",
  appId: "1:429572668233:web:389faecbbbe26a21c1b898",
  measurementId: "G-TGB0EZVMHL"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

module.exports = firebase;