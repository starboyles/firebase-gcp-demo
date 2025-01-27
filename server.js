const express = require("express");
const app = express();
const { admin, db } = require("./config/firebase.config");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.post("/signup", async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  const userResponse = await admin.auth().createUser({
    email: user.email,
    password: user.password,
    emailVerified: false,
    disabled: false,
  });
  res.json(userResponse);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
