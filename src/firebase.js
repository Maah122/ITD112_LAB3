// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyA9gVlbDc0NifzxCOeewePM2IZJ_QwDGCo",
  authDomain: "palanialab3.firebaseapp.com",
  projectId: "palanialab3",
  storageBucket: "palanialab3.firebasestorage.app",
  messagingSenderId: "373418434185",
  appId: "1:373418434185:web:28de996ee2887fe090f058",
  measurementId: "G-RMXRF6W4ZQ"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, analytics };
