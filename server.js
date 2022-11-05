require("dotenv").config();

const express = require("express");
const cors = require("cors");
const {
  userSignUp,
  getRegUsers,
  validateUser,
  userCheck,
} = require("./controllers/usersController");
const crypto = require("crypto");
crypto.randomBytes(64);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT || 8083;

app.post("/api/signup", async (req, res) => {
  console.log(req.body);
  res.status(201).send(await userSignUp(req.body));
  // .json({ msg: "You're successfully signed up!" });
});

app.get("/api/users", async (req, res) => {
  res.send(await getRegUsers());
});

// Signing In a User
app.post("/api/login", async (req, res) => {
  const result = await validateUser(req.body);
  console.log(result);
  if (!result) {
    res.status(403).send({ msg: "Authentication failed!" });
    return;
  }
  // res.status(201).send({ msg: "Authentication succeeded!" });
  res.send(result);
});

app.listen(port, () => console.log(`Server listening at port ${port}`));
