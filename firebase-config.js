// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCX9mMtVjoW0GeG9xFTcCideyyqQK0R6QM",
  authDomain: "manager-venituri3.firebaseapp.com",
  projectId: "manager-venituri3",
  storageBucket: "manager-venituri3.firebasestorage.app",
  messagingSenderId: "407482064898",
  appId: "1:407482064898:web:ce18efe85f685cf03a471b",
  measurementId: "G-JK7QT9TXRY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
