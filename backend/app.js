const express = require('express');
const app = express();
const port = 3000;

require('dotenv-flow').config();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT", "DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


