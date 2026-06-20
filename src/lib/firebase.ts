import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfigData from "../../firebase-applet-config.json";

// The config provides databaseId, but standard firebase initialization does not use it as a top-level field.
// We map it properly to initialize Firestore correctly.
// Also note firebase-applet-config.json has 'firestoreDatabaseId'.

const config = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

const app = initializeApp(config);
const db = getFirestore(app, firebaseConfigData.firestoreDatabaseId);
const auth = getAuth(app);

export { db, auth };
