import * as admin from "firebase-admin";

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://studious.firebaseio.com",
});

const adminAuth = app.auth();
// adminAuth.
