// login.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// --- Apna firebase config yahan daal ---
const firebaseConfig = {
    apiKey: "AIzaSyDkpXPLhxq8o4Fxb4inFolC5IrHJnugUqY",
    authDomain: "swarlok-214f4.firebaseapp.com",
    projectId: "swarlok-214f4",
    storageBucket: "swarlok-214f4.firebasestorage.app",
    messagingSenderId: "763053442821",
    appId: "1:763053442821:web:8288f8c48b9ae2124ed96c",
    measurementId: "G-MLWDLG25CE"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements select karo
const emailInput = document.querySelector('input[placeholder="Email Address"]');
const passwordInput = document.querySelector('input[placeholder="Password"]');
const continueBtn = document.querySelector('.submit');

// Button pe click listener lagao
continueBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        alert("Please fill in both fields.");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Login Successful ✅", user);

        // After successful login, redirect to homepage
        window.location.href = "/home"; // Apna homepage ka route daal
    } catch (error) {
        console.error("Login Error ❌", error);
        alert(error.message); // Show firebase error
    }
});
