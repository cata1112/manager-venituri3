// Firebase configuration for manager-venituri3
const firebaseConfig = {
  apiKey: "AIzaSyCX9mMtVjoW0GeG9xFTcCideyyqQK0R6QM",
  authDomain: "manager-venituri3.firebaseapp.com",
  projectId: "manager-venituri3",
  storageBucket: "manager-venituri3.firebasestorage.app",
  messagingSenderId: "407482064898",
  appId: "1:407482064898:web:ce18efe85f685cf03a471b",
  measurementId: "G-JK7QT9TXRY"
};

// Initialize Firebase only once
if (typeof firebase === 'undefined') {
  console.warn('Firebase SDK not loaded');
} else if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}