// Complete Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCX9mMtVjoW0GeG9xFTcCideyyqQK0R6QM",
  authDomain: "manager-venituri3.firebaseapp.com",
  projectId: "manager-venituri3",
  storageBucket: "manager-venituri3.appspot.com",
  messagingSenderId: "407482064898",
  appId: "1:407482064898:web:ce18efe85f685cf03a471b",
  measurementId: "G-JK7QT9TXRY"
};

// Proper initialization with error handling
if (typeof window !== 'undefined') {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
} else {
  console.error('Firebase cannot be initialized in this environment');
}