import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBWovPjrzjasO3RmSzlaUdz01Yk1Xa4hJE",
  authDomain: "plaatform-pembelajaran.firebaseapp.com",
  projectId: "plaatform-pembelajaran",
  storageBucket: "plaatform-pembelajaran.firebasestorage.app",
  messagingSenderId: "555073569497",
  appId: "1:555073569497:web:c67d10293bb174af7ab4c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)