import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "stadious.firebaseapp.com",
  databaseURL: "https://stadious.firebaseio.com",
  projectId: "stadious",
  storageBucket: "stadious.appspot.com",
  messagingSenderId: "459323240550",
  appId: "1:459323240550:web:6ceb09330b0d6568adbda7",
  measurementId: "G-T22RM7G9GV",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const TwitterProvider = new firebase.auth.TwitterAuthProvider();
export const GitHubProvider = new firebase.auth.GithubAuthProvider();

export const db = firebase.firestore();
export const storage = firebase.storage();

// export const adminAuth = admin.auth();

export const FirebaseTimestamp = firebase.firestore.Timestamp;

export default firebase;
