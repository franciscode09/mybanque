/* =========================
   ROUTING / SÉCURITÉ
========================= */
const page = location.pathname;

const isConnected = localStorage.getItem("connected") === "true";
const otpOK = localStorage.getItem("otpVerified") === "true";

if (page.includes("dashboard") || page.includes("transfert")) {
  if (!isConnected || !otpOK) {
    location.href = "index.html";
  }
}

if (page.includes("otp") && !isConnected) {
  location.href = "index.html";
}

/* =========================
   INITIALISATION
========================= */
if (!localStorage.getItem("balance")) {
  localStorage.setItem("balance", "1000");
}

if (!localStorage.getItem("transactions")) {
  localStorage.setItem("transactions", JSON.stringify([]));
}

/* =========================
   CONNEXION
========================= */
function login() {
  const userInput = document.getElementById("user").value;
  const passInput = document.getElementById("pass").value;
  const error = document.getElementById("error");

  if (userInput === "admin" && passInput === "1234") {
    localStorage.setItem("connected", "true");
    localStorage.removeItem("otpVerified");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("otpCode", otp);

    console.log("OTP (simulation) :", otp);
    location.href = "otp.html";
  } else {
    error.innerText = "Identifiants incorrects";
  }
}

/* =========================
   OTP
========================= */
function verifyOTP() {
  const input = document.getElementById("otp").value;
  const error = document.getElementById("error");

  if (input === localStorage.getItem("otpCode")) {
    localStorage.setItem("otpVerified", "true");
    localStorage.removeItem("otpCode");
    location.href = "dashboard.html";
  } else {
    error.innerText = "Code OTP incorrect";
  }
}

/* =========================
   DÉCONNEXION
========================= */
function logout() {
  localStorage.clear();
  location.href = "index.html";
}

/* =========================
   UI
========================= */
function updateUI() {
  const balanceEl = document.getElementById("balance");
  const historyEl = document.getElementById("transactions");

  if (balanceEl) {
    balanceEl.innerText = localStorage.getItem("balance");
  }

  if (historyEl) {
    historyEl.innerHTML = "";
    const list = JSON.parse(localStorage.getItem("transactions"));
    list.forEach(item => {
      const li = document.createElement("li");
      li.innerText = item;
      historyEl.appendChild(li);
    });
  }
}

updateUI();

/* =========================
   HISTORIQUE
========================= */
function addTransaction(text) {
  const list = JSON.parse(localStorage.getItem("transactions"));
  list.unshift(text);
  localStorage.setItem("transactions", JSON.stringify(list));
}

/* =========================
   OPÉRATIONS
========================= */
function deposit() {
  const amount = Number(document.getElementById("amount").value);
  if (amount <= 0) return alert("Montant invalide");

  let bal = Number(localStorage.getItem("balance"));
  bal += amount;

  localStorage.setItem("balance", bal);
  addTransaction("➕ Dépôt de " + amount + " €");
  updateUI();
}

function withdraw() {
  const amount = Number(document.getElementById("amount").value);
  let bal = Number(localStorage.getItem("balance"));

  if (amount <= 0) return alert("Montant invalide");
  if (amount > bal) return alert("Solde insuffisant");

  bal -= amount;
  localStorage.setItem("balance", bal);
  addTransaction("➖ Retrait de " + amount + " €");
  updateUI();
}

function transfer() {
  const amount = Number(document.getElementById("transferAmount").value);
  const benef = document.getElementById("benef").value;
  let bal = Number(localStorage.getItem("balance"));

  if (!benef) return alert("Bénéficiaire requis");
  if (amount <= 0) return alert("Montant invalide");
  if (amount > bal) return alert("Solde insuffisant");

  bal -= amount;
  localStorage.setItem("balance", bal);

  addTransaction("🔁 Virement de " + amount + " € vers " + benef);

  alert("Virement effectué avec succès ✅");
  location.href = "dashboard.html";
}
