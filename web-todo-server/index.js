import express from "express";
import cors from "cors";

const app = express()
app.use(cors());
const port = 3000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

app.get("/", (req, res) => {
  res.json({ Hello: "world" });
});
