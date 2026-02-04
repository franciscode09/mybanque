import express from "express";
import cors from "cors";
import { users } from "./db.js";
import { login, verifyOTP } from "./auth.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/login", login);
app.post("/verify-otp", verifyOTP);

app.get("/dashboard/:email", (req, res) => {
  const user = users.find(u => u.email === req.params.email);
  res.json(user);
});

app.post("/transfer", (req, res) => {
  const { email, amount, benef } = req.body;
  const user = users.find(u => u.email === email);

  if (amount > user.balance) {
    return res.status(400).json({ error: "Solde insuffisant" });
  }

  user.balance -= amount;
  user.transactions.unshift(`Virement ${amount}€ vers ${benef}`);
  res.json({ success: true });
});

app.listen(3000, () => console.log("🚀 API NeoBank sur http://localhost:3000"));
