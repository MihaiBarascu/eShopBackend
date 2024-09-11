import express from "express";
import cors from "cors";
import mysql from "mysql2";
const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: "root",
  password: "root",
  database: process.env.DB_DATABASE,
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

