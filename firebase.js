import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyCHHiOonsKHa1Ds0k92cgl1wd-syjEZK4g",
  authDomain: "test-6621d.firebaseapp.com",
  projectId: "test-6621d",
  storageBucket: "test-6621d.firebasestorage.app",
  messagingSenderId: "628489695688",
  appId: "1:628489695688:web:c57206dbfd3841346c90fd",
  measurementId: "G-DF5EDXLMRP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app)

export { db }