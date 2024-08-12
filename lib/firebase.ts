import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBwBiShUhEigBdy-SO850ovH3BVvB8TQfA",
  authDomain: "chat2chat-c4cf6.firebaseapp.com",
  projectId: "chat2chat-c4cf6",
  storageBucket: "chat2chat-c4cf6.appspot.com",
  messagingSenderId: "60472477827",
  appId: "1:60472477827:web:3c20bb2fc6ebb48569f3b6",
  measurementId: "G-X4N6VQKDN6",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, firestore, auth };
