import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'; // Import Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuBma70eMVG1_zPUvndh2w7YDYks3TwDM",
  authDomain: "example-12175.firebaseapp.com",
  projectId: "example-12175",
  storageBucket: "example-12175.appspot.com",
  messagingSenderId: "868335687211",
  appId: "1:868335687211:web:3b3aa95d70e105aabcbc6e",
  measurementId: "G-QG3CV2GGVV"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();  

export { auth, db, storage };

