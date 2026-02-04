const path = location.pathname;

// 🔒 Sécurité des pages
if (path.includes("dashboard") || path.includes("transfert")) {
  if (!localStorage.getItem("connected") || !localStorage.getItem("otpVerified")) {
    location.href = "index.html";
  }
}

if (path.includes("otp")) {
  if (!localStorage.getItem("connected")) {
    location.href = "index.html";
  }
}

// 💰 Initialisation
if (!localStorage.getItem("balance")) {
  localStorage.setItem("balance", "1000");
}
if (!localStorage.getItem("transactions")) {
  localStorage.setItem("transactions", JSON.stringify([]));
}

// 🔐 Connexion
function login() {
  const user = user.value;
  const pass = pass.value;

  if (user === "admin" && pass === "1234") {
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

// 🔑 OTP
function verifyOTP() {
  if (otp.value === localStorage.getItem("otpCode")) {
    localStorage.setItem("otpVerified", "true");
    localStorage.removeItem("otpCode");
    location.href = "dashboard.html";
  } else {
    error.innerText = "Code incorrect";
  }
}

// 🚪 Déconnexion
function logout() {
  localStorage.clear();
  location.href = "index.html";
}

// 💳 Solde & historique
function updateUI() {
  if (document.getElementById("balance")) {
    balance.innerText = localStorage.getItem("balance");
  }

  if (document.getElementById("transactions")) {
    const list = JSON.parse(localStorage.getItem("transactions"));
    transactions.innerHTML = "";
    list.forEach(t => {
      const li = document.createElement("li");
      li.innerText = t;
      transactions.appendChild(li);
    });
  }
}
updateUI();

// ➕ Dépôt
function deposit() {
  const amt = Number(amount.value);
  let bal = Number(localStorage.getItem("balance"));
  bal += amt;

  localStorage.setItem("balance", bal);
  save("Dépôt de " + amt + " €");
  updateUI();
}

// ➖ Retrait
function withdraw() {
  const amt = Number(amount.value);
  let bal = Number(localStorage.getItem("balance"));

  if (amt <= bal) {
    bal -= amt;
    localStorage.setItem("balance", bal);
    save("Retrait de " + amt + " €");
    updateUI();
  } else {
    alert("Solde insuffisant");
  }
}

// 🔁 Virement
function transfer() {
  const amt = Number(transferAmount.value);
  let bal = Number(localStorage.getItem("balance"));

  if (amt <= bal) {
    bal -= amt;
    localStorage.setItem("balance", bal);
    save("Virement de " + amt + " €");
    location.href = "dashboard.html";
  } else {
    alert("Solde insuffisant");
  }
}

// 📝 Historique
function save(text) {
  const list = JSON.parse(localStorage.getItem("transactions"));
  list.unshift(text);
  localStorage.setItem("transactions", JSON.stringify(list));
}
