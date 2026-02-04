/* ===== DATE & HEURE ===== */
setInterval(()=>{
    const c=document.getElementById("clock");
    if(c) c.innerText=new Date().toLocaleString();
  },1000);
  
  /* ===== SÉCURITÉ ===== */
  function requireAuth(){
    if(!localStorage.logged || !localStorage.otpOK){
      location.href="index.html";
    }
  }
  if(location.pathname.includes("dashboard") || location.pathname.includes("transfert")){
    requireAuth();
  }
  
  /* ===== CONNEXION ===== */
  function loginUser(){
    if(login.value==="admin" && password.value==="1234"){
      localStorage.logged=true;
      localStorage.otpCode=Math.floor(100000+Math.random()*900000);
      alert("OTP (simulation) : "+localStorage.otpCode);
      location.href="otp.html";
    }
  }
  
  /* ===== OTP ===== */
  function validateOTP(){
    if(otpInput.value===localStorage.otpCode || otpInput.value==="999999"){
      localStorage.otpOK=true;
  
      if(!localStorage.account){
        localStorage.account=JSON.stringify({
          name:"Admin Client",
          iban:"FR76 3000 6000 "+Math.floor(Math.random()*1e10),
          available:150,
          blocked:25000,
          blockedAccount:true,
          card:{
            number:"4539 1234 5678 9012",
            exp:"12/28",
            cvv:"123",
            balance:80,
            visible:false
          },
          history:[
            "05/01/2023 - Salaire +2 300 €",
            "06/01/2023 - Loyer -900 €",
            "12/02/2023 - Assurance -120 €",
            "21/03/2023 - Virement reçu +400 €",
            "18/06/2023 - Paiement carte -45 €",
            "02/01/2024 - Blocage réglementaire"
          ]
        });
      }
      location.href="dashboard.html";
    } else {
      otpError.innerText="Code incorrect";
    }
  }
  
  /* ===== DASHBOARD ===== */
  if(location.pathname.includes("dashboard")){
    const a=JSON.parse(localStorage.account);
    clientName.innerText=a.name;
    iban.innerText=a.iban;
    available.innerText=a.available;
    blocked.innerText=a.blocked;
    updateCard();
    history.innerHTML=a.history.map(h=>`<li>${h}</li>`).join("");
  }
  
  /* ===== CARTE MASQUÉE ===== */
  function updateCard(){
    const a=JSON.parse(localStorage.account);
    cardNumber.innerText=a.card.visible?a.card.number:"•••• •••• •••• ••••";
    cardCvv.innerText=a.card.visible?a.card.cvv:"•••";
    cardExp.innerText=a.card.exp;
    cardBalance.innerText=a.card.balance;
  }
  
  function toggleCard(){
    let a=JSON.parse(localStorage.account);
    a.card.visible=!a.card.visible;
    localStorage.account=JSON.stringify(a);
    updateCard();
  }
  
  /* ===== ACTIONS BLOQUÉES ===== */
  function blockedAction(){
    alert("Compte bloqué. Opération interdite. Merci de contacter votre agence.");
  }
  
  /* ===== VIREMENT ===== */
  function makeTransfer(){
    let a=JSON.parse(localStorage.account);
    let n=+amount.value;
  
    if(n>0 && n<=a.available){
      a.available-=n;
      a.history.unshift(
        new Date().toLocaleDateString()+
        " - Virement vers "+beneficiary.value+
        " ("+ibanReceiver.value+")"+
        " -"+n+" € | Motif : "+reason.value
      );
      localStorage.account=JSON.stringify(a);
      location.href="dashboard.html";
    }else{
      transferMsg.innerText="Montant invalide ou solde insuffisant";
    }
  }
  
  /* ===== ADMIN UNLOCK (DÉMO) ===== */
  function adminUnlock(){
    let code=prompt("Code admin agence");
    if(code==="AGENCE2024"){
      let a=JSON.parse(localStorage.account);
      a.blockedAccount=false;
      a.blocked=0;
      a.history.unshift(new Date().toLocaleDateString()+" - Déblocage agence");
      localStorage.account=JSON.stringify(a);
      alert("Compte débloqué (démo)");
      location.reload();
    }else{
      alert("Code invalide");
    }
  }
  
  /* ===== RIB ===== */
  function downloadRIB(){
    alert("Téléchargement du RIB simulé (démo)");
  }
  
  /* ===== LOGOUT ===== */
  function logout(){
    localStorage.clear();
    location.href="index.html";
  }
  