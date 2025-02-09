import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcCnBBCw5Rw4Ino5eLVD2_U01uxy95F-s",
  authDomain: "voyage-coe64-371.firebaseapp.com",
  projectId: "voyage-coe64-371",
  databaseURL: "https://voyage-coe64-371-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "voyage-coe64-371.appspot.com",
  messagingSenderId: "493404570218",
  appId: "1:493404570218:web:0c14b36a08569b64918013"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // Export storage
