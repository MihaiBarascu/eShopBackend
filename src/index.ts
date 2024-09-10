import express from "express";
import cors from "cors";

const app = express();
const port = 3000;
app.use(cors());
app.get("/", (req, res) => {
  res.send("ce faci?");
});
console.log("ceau");
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

