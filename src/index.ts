import express from "express";
import cors from "cors";
import mysql from "mysql2";
const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: process.env.DB_HOST, // sau 'nume-container' dacă te conectezi din afara containerului
  user: "root", // utilizatorul MySQL (înlocuiește cu ce utilizator ai)
  password: "root", // parola pentru utilizatorul MySQL
  database: process.env.DB_DATABASE, // baza de date la care vrei să te conectezi
});

connection.connect((err) => {
  if (err) {
    console.error("Eroare la conectarea la baza de date:", err.stack);
    return;
  }
  console.log("Conectat la MySQL ca ID:", connection.threadId);
});

connection.query("SELECT USER()", (error, result) => console.log(result));

app.use(cors());
app.get("/", (req, res) => {
  res.send("ce faci?");
});
console.log("ceau");
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

