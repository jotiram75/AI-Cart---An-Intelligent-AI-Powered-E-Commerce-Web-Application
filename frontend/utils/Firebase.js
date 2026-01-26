import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "aicart-46981.firebaseapp.com",
  projectId: "aicart-46981",
  storageBucket: "aicart-46981.firebasestorage.app",
  messagingSenderId: "667652550347",
  appId: "1:667652550347:web:584cfdb105fa96bf14754e",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
