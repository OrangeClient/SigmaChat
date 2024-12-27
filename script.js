// Import the required Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAaGmwlZcXTdLJiSM8Nh2C6Frk6huNsdQQ",
    authDomain: "site-37508.firebaseapp.com",
    projectId: "site-37508",
    storageBucket: "site-37508.appspot.com",
    messagingSenderId: "339266667493",
    appId: "1:339266667493:web:90086f5c8b956deef1a50c",
    measurementId: "G-H6L35J3L25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// DOM Elements
const authContainer = document.getElementById("auth-container");
const chatContainer = document.getElementById("chat-container");
const authTitle = document.getElementById("auth-title");
const authForm = document.getElementById("auth-form");
const authButton = document.getElementById("auth-button");
const authSwitch = document.getElementById("switch-to-signup");
const logoutButton = document.getElementById("logout-button");
const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message");

// Auth State Listener
auth.onAuthStateChanged(user => {
    if (user) {
        authContainer.classList.add("hidden");
        chatContainer.classList.remove("hidden");
        loadMessages();
    } else {
        authContainer.classList.remove("hidden");
        chatContainer.classList.add("hidden");
    }
});

// Switch to Signup
authSwitch.addEventListener("click", () => {
    authTitle.textContent = "Sign Up";
    authButton.textContent = "Sign Up";
    authForm.onsubmit = handleSignup;
});

// Handle Login or Signup
authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (authTitle.textContent === "Login") {
        handleLogin();
    } else {
        handleSignup();
    }
});

async function handleLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error(error.message);
    }
}

async function handleSignup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error(error.message);
    }
}

// Logout
logoutButton.addEventListener("click", async () => {
    await signOut(auth);
});

// Chat Functionality
chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message) {
        await addDoc(collection(db, "messages"), {
            message: message,
            user: auth.currentUser.email,
            timestamp: new Date(),
        });
        messageInput.value = "";
        loadMessages();
    }
});

// Load Messages
async function loadMessages() {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const querySnapshot = await getDocs(q);
    chatBox.innerHTML = "";
    querySnapshot.forEach((doc) => {
        const message = doc.data();
        chatBox.innerHTML += `<p><strong>${message.user}:</strong> ${message.message}</p>`;
    });
}
