import { auth, db, storage } from "./firebase.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { collection, getDocs, updateDoc, doc, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

// Elements
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
  if (user) {
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

// Load Payments
async function loadPayments() {
  const paymentsRef = collection(db, "payments");
  const snapshot = await getDocs(paymentsRef);
  const tbody = document.querySelector("#paymentsTable tbody");
  tbody.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.userId}</td>
      <td>${data.email}</td>
      <td><a href="${data.receiptUrl}" target="_blank">View</a></td>
      <td>${data.status}</td>
      <td>
        <button onclick="approvePayment('${docSnap.id}')">Approve</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
window.approvePayment = async function(id) {
  const paymentRef = doc(db, "payments", id);
  await updateDoc(paymentRef, { status: "approved" });
  alert("Payment Approved! Send Card PDF manually via email.");
  loadPayments();
};

// Upload Card
document.getElementById("cardForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("cardTitle").value;
  const price = parseInt(document.getElementById("cardPrice").value);
  const balance = parseInt(document.getElementById("cardBalance").value);
  const file = document.getElementById("cardPdf").files[0];

  if (price < 500) {
    alert("Minimum price must be ₹500");
    return;
  }

  const storageRef = ref(storage, `cards/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const pdfUrl = await getDownloadURL(storageRef);

  await addDoc(collection(db, "cards"), {
    title, price, balance, pdfUrl
  });

  alert("Card Uploaded!");
  loadCards();
});

// Load Cards
async function loadCards() {
  const snapshot = await getDocs(collection(db, "cards"));
  const list = document.getElementById("cardList");
  list.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `${data.title} - ₹${data.price} - Balance: ${data.balance} <a href="${data.pdfUrl}" target="_blank">View</a>`;
    list.appendChild(li);
  });
}

// Load Users
async function loadUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  const list = document.getElementById("userList");
  list.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `${data.email} (${data.uid})`;
    list.appendChild(li);
  });
}
