// firebase.js

// 1. Import the needed Firebase modules

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";



// 2. Firebase Config
export const firebaseConfig = {
  apiKey: "AIzaSyDkpXPLhxq8o4Fxb4inFolC5IrHJnugUqY",
  authDomain: "swarlok-214f4.firebaseapp.com",
  projectId: "swarlok-214f4",
  storageBucket: "swarlok-214f4.firebasestorage.app",
  messagingSenderId: "763053442821",
  appId: "1:763053442821:web:8288f8c48b9ae2124ed96c",
  measurementId: "G-MLWDLG25CE"
};
  
 // 3. Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// 4. Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
  