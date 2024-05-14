import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDBv40ukKcCpv-nwYlCarIu1NPVe27dApQ",
  authDomain: "pos-by-heonq.firebaseapp.com",
  projectId: "pos-by-heonq",
  storageBucket: "pos-by-heonq.appspot.com",
  messagingSenderId: "769969678902",
  appId: "1:769969678902:web:4e313981a638d7ab194697",
  measurementId: "G-9FZTEZ52LJ",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
