// DEMO IDENTIFIANTS
const USER = "client01";
const PASS = "2580";
const OTP = "123456";

let balance = 2450;
let accountBlocked = false;

let transactions = [
  "01/02/2026 09:12 | Salaire +22 000 €",
  "28/01/2026 18:45 | Paiement CB -450 €",
  "25/01/2026 10:30 | Virement reçu +3 200 €",
  "20/01/2026 15:02 | Retrait DAB -300 €"
];

// AUTH
function login() {
  if (user.value === USER && pass.value === PASS) {
    window.location = "otp.html";
  } else error.textContent = "Identifiants incorrects";
}

function verifyOTP() {
  if (otp.value === OTP) window.location = "dashboard.html";
  else alert("Code incorrect");
}

function logout() {
  window.location = "index.html";
}

// UTILS
function now() {
  return new Date().toLocaleString("fr-FR");
}

function updateUI() {
  if (!document.getElementById("balance")) return;
  document.getElementById("balance").textContent = balance;

  const list = document.getElementById("transactions");
  list.innerHTML = "";
  transactions.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    list.appendChild(li);
  });

  const status = document.getElementById("status");
  status.textContent = accountBlocked ? "BLOQUÉ" : "ACTIF";
  status.className = accountBlocked ? "blocked" : "active";
}

// ACTIONS
function deposit() {
  if (accountBlocked) return alert("Compte bloqué");
  let a = Number(amount.value);
  balance += a;
  transactions.unshift(`${now()} | Dépôt +${a} €`);
  updateUI();
}

function withdraw() {
  if (accountBlocked) return alert("Compte bloqué");
  let a = Number(amount.value);
  if (a <= balance) {
    balance -= a;
    transactions.unshift(`${now()} | Retrait -${a} €`);
    updateUI();
  }
}

function pay() {
  if (accountBlocked) return alert("Compte bloqué");
  let a = Number(amount.value);
  balance -= a;
  transactions.unshift(`${now()} | Paiement CB -${a} €`);
  updateUI();
}

function transfer() {
  if (accountBlocked) return alert("Compte bloqué");
  let a = Number(transferAmount.value);
  if (a <= balance) {
    balance -= a;
    alert("Virement effectué");
  }
}

function triggerBlock() {
  accountBlocked = true;
  transactions.unshift(`${now()} | ⚠️ Compte bloqué – activité suspecte`);
  updateUI();
  alert("Compte temporairement bloqué");
}

// PDF
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  pdf.text("NeoBank - Relevé bancaire", 10, 10);
  transactions.forEach((t, i) => pdf.text(t, 10, 20 + i * 8));
  pdf.save("releve-bancaire.pdf");
}

// TIME
function updateTime() {
  const el = document.getElementById("datetime");
  el && (el.textContent = now());
}
setInterval(updateTime, 1000);
window.onload = () => { updateUI(); updateTime(); };
