const API = "http://localhost:3000";

/* =====================
   CONNEXION
===================== */
async function login() {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    alert("Identifiants incorrects");
    return;
  }

  localStorage.setItem("email", email);
  location.href = "otp.html";
}

/* =====================
   OTP
===================== */
async function verifyOTP() {
  const otp = document.getElementById("otpInput").value;
  const email = localStorage.getItem("email");

  const res = await fetch(API + "/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp })
  });

  if (!res.ok) {
    alert("OTP incorrect");
    return;
  }

  const data = await res.json();
  localStorage.setItem("token", data.token);
  location.href = "dashboard.html";
}

/* =====================
   DASHBOARD
===================== */
async function loadDashboard() {
  const email = localStorage.getItem("email");
  if (!email) return location.href = "index.html";

  const res = await fetch(API + "/dashboard/" + email);
  const user = await res.json();

  document.getElementById("balance").innerText = user.balance;
  document.getElementById("transactions").innerHTML =
    user.transactions.map(t => `<li>${t}</li>`).join("");
}

/* =====================
   VIREMENT
===================== */
async function makeTransfer() {
  const email = localStorage.getItem("email");
  const amount = Number(document.getElementById("amountInput").value);
  const benef = document.getElementById("benefInput").value;

  const res = await fetch(API + "/transfer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, amount, benef })
  });

  if (!res.ok) {
    alert("Erreur lors du virement");
    return;
  }

  alert("Virement effectué avec succès ✅");
  location.href = "dashboard.html";
}

/* =====================
   DÉCONNEXION
===================== */
function logout() {
  localStorage.clear();
  location.href = "index.html";
}
