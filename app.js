/* DATE & HEURE */
setInterval(() => {
    document.getElementById("clock").innerText =
      new Date().toLocaleString();
  }, 1000);
  
  /* SÉCURITÉ */
  function requireAuth() {
    if (!localStorage.logged || !localStorage.otpOK) location.href="index.html";
  }
  if (location.pathname.includes("dashboard") || location.pathname.includes("transfert")) requireAuth();
  
  /* CONNEXION */
  function login(){
    if(login.value==="admin" && password.value==="1234"){
      localStorage.logged=true;
      localStorage.otp=Math.floor(100000+Math.random()*900000);
      alert("OTP : "+localStorage.otp);
      location.href="otp.html";
    }
  }
  
  /* OTP */
  function verifyOTP(){
    if(otp.value===localStorage.otp || otp.value==="999999"){
      localStorage.otpOK=true;
      if(!localStorage.account){
        localStorage.account=JSON.stringify({
          name:"Admin Client",
          iban:"FR76 "+Math.floor(Math.random()*1e14),
          available:100,
          blocked:1000000,
          card:{ number:"4539 1234 5678 9012", exp:"12/28", cvv:"123", balance:50 },
          history:[
            "Virement reçu +500 €",
            "Paiement carte -30 €",
            "Virement envoyé -120 €"
          ]
        });
      }
      location.href="dashboard.html";
    }
  }
  
  /* DASHBOARD */
  if(location.pathname.includes("dashboard")){
    const a=JSON.parse(localStorage.account);
    clientName.innerText=a.name;
    iban.innerText=a.iban;
    available.innerText=a.available;
    blocked.innerText=a.blocked;
    cardNumber.innerText=a.card.number;
    cardExp.innerText=a.card.exp;
    cardCvv.innerText=a.card.cvv;
    cardBalance.innerText=a.card.balance;
    history.innerHTML=a.history.map(h=>"<li>"+new Date().toLocaleString()+" - "+h+"</li>").join("");
  }
  
  /* ACTIONS */
  function deposit(){
    let n=+prompt("Montant ?");
    let a=JSON.parse(localStorage.account);
    a.available+=n;a.history.unshift("Dépôt +"+n+" €");
    localStorage.account=JSON.stringify(a);location.reload();
  }
  
  function withdraw(){
    let n=+prompt("Montant ?");
    let a=JSON.parse(localStorage.account);
    if(n<=a.available){a.available-=n;a.history.unshift("Retrait -"+n+" €");}
    localStorage.account=JSON.stringify(a);location.reload();
  }
  
  function unlockFunds(){
    let a=JSON.parse(localStorage.account);
    if(a.available>=500){
      a.available-=500;
      a.blocked=0;
      a.history.unshift("Fonds débloqués -500 €");
      localStorage.account=JSON.stringify(a);location.reload();
    }else alert("Solde insuffisant");
  }
  
  function rechargeCard(){
    let n=+prompt("Montant ?");
    let a=JSON.parse(localStorage.account);
    if(n<=a.available){
      a.available-=n;
      a.card.balance+=n;
      a.history.unshift("Recharge carte -"+n+" €");
    }
    localStorage.account=JSON.stringify(a);location.reload();
  }
  
  function goTransfer(){location.href="transfert.html";}
  function logout(){localStorage.clear();location.href="index.html";}
  
  /* VIREMENT */
  function makeTransfer(){
    let n=+amount.value;
    let a=JSON.parse(localStorage.account);
    if(n<=a.available){
      a.available-=n;
      a.history.unshift("Virement vers "+beneficiary.value+" -"+n+" €");
      localStorage.account=JSON.stringify(a);
      location.href="dashboard.html";
    }
  }
  