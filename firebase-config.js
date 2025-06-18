// Updated Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCX9mMtVjoW0GeG9xFTcCideyyqQK0R6QM",
  authDomain: "manager-venituri3.firebaseapp.com",
  databaseURL: "https://manager-venituri3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "manager-venituri3",
  storageBucket: "manager-venituri3.appspot.com",
  messagingSenderId: "407482064898",
  appId: "1:407482064898:web:ce18efe85f685cf03a471b"
};

// Proper initialization
if (typeof window !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}