import { auth, db, storage } from "./firebase.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { collection, getDocs, updateDoc, doc, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

// Allowed Admin Credentials
const ADMIN_EMAIL = "radhirkamala@gmail.com";

const loginSection = document.getElementById("login-section");
const dashboard = document.getElementById("dashboard");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Tabs
function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
  document.getElementById(tabId).style.display = "block";
}
window.showTab = showTab;

// Login
loginBtn?.addEventListener("click", async () => {
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  if (email !== ADMIN_EMAIL) {
    alert("Access Denied: Only admin can login!");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    alert("Login Failed: " + err.message);
  }
});

// Logout
logoutBtn?.addEventListener("click", () => signOut(auth));

// Auth State
onAuthStateChanged(auth, (user) => {
  if (user && user.email === ADMIN_EMAIL) {
    loginSection.style.display = "none";
    dashboard.style.display = "block";
    loadPayments();
    loadCards();
    loadUsers();
  } else {
    loginSection.style.display = "block";
    dashboard.style.display = "none";
  }
});

// --- Remaining Functions Same (loadPayments, approvePayment, loadCards, loadUsers) ---
