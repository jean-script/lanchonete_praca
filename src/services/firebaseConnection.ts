import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBpc3TvF0G7kwOIo18dA6McYwjF3o9CrXU",
  authDomain: "lanchonepraca.firebaseapp.com",
  projectId: "lanchonepraca",
  storageBucket: "lanchonepraca.appspot.com",
  messagingSenderId: "1027230325740",
  appId: "1:1027230325740:web:a3774535febcc3ed477ec9"
};


const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storge = getStorage(firebaseApp)

export { auth, db, storge };