import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAN8CUNI9rhpATs-9gMSswuAlutLfpsmYg",
  authDomain: "blogging-app-31aaf.firebaseapp.com",
  projectId: "blogging-app-31aaf",
  storageBucket: "blogging-app-31aaf.firebasestorage.app",
  messagingSenderId: "865151856886",
  appId: "1:865151856886:web:a8969d38ef138355597cd7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app
export const auth = getAuth(app);
 const db = getFirestore(app);
export { db, doc,setDoc,createUserWithEmailAndPassword}
