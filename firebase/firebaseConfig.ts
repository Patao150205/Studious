import Firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyBhUr2QPiHdVAHtmGc9qXiJ39b_RksH8LA",
  authDomain: "stadious.firebaseapp.com",
  projectId: "stadious",
  storageBucket: "stadious.appspot.com",
  messagingSenderId: "459323240550",
  appId: "1:459323240550:web:6ceb09330b0d6568adbda7",
  measurementId: "G-T22RM7G9GV",
};

export const firebase = Firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

export const FirebaseTimestamp = Firebase.firestore.Timestamp;
