const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("We up");
  });

  module.exports = app;