import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBaXkDBHcHr9oybn7GC_HL17geGSqhVtIg",
  authDomain: "dinetime-1043e.firebaseapp.com",
  projectId: "dinetime-1043e",
  storageBucket: "dinetime-1043e.appspot.com",
  messagingSenderId: "61801382418",
  appId: "1:61801382418:web:9ba8f973ff1af6783e0ecb",
};

// Check and initialize Firebase app if not already done
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);

export { app, db };
