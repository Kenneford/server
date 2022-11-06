require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {
  userSignUp,
  getRegUsers,
  validateUser,
  userCheck,
  authenticateToken,
  refreshTokens,
} = require("./controllers/usersController");
const crypto = require("crypto");
crypto.randomBytes(64);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT || 8083;

app.post("/api/signup", async (req, res) => {
  console.log(req.body);
  const result = await userSignUp(req.body);
  //   res.status(201).send(await userSignUp(req.body));
  // .json({ msg: "You're successfully signed up!" });
  if (!result) {
    res.status(403).send({ msg: "Signup failed!" });
    return;
  }
  // res.status(201).send({ msg: "Authentication succeeded!" });
  res.send(result);
});

app.get("/api/users", async (req, res) => {
  res.send(await getRegUsers());
  //   const refreshToken = req.body.token;
  //   if (refreshToken == null) return res.status(401);
  //   if (!refreshTokens.includes(refreshToken)) return resendStatus(403);
  //   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
  //     if (err) return res.sendStatus(403);
  //     const accessToken = generateAccessToken({ userName: user.userName });
  //     res.json({ accessToken: accessToken });
  //   });
});

// Signing In a User
app.post("api/login", async (req, res) => {
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
