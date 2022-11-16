const express = require("express");

const router = express.Router();
const { check, validationResult } = require("express-validator");
const Users = require("../model/userSchema");
const {
  userSignup,
  validateUser,
  getRegUsers,
  userCheck,
  refreshTokens,
} = require("../controllers/usersController");
const { authenticateToken } = require("../authUserCheck/authUserCheck");
const { generateAccessToken } = require("../controllers/usersController");

// Get all Users
router.get("/users", async (req, res) => {
  res.send(await getRegUsers());
});

// Signing Up a User
router.post(
  "/signup",
  [
    check("email", "Invalid email provided!").isEmail(),
    check(
      "password",
      "Password should not be less than eight(8) characters!"
    ).isLength({ min: 8 }),
    check(
      "confirmPassword",
      "confirmPassword should not be less than eight(8) characters!"
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const emailExist = await Users.findOne({ email: req.body.email });
    const userNameExist = await Users.findOne({ userName: req.body.userName });
    if (emailExist) {
      return res.status(400).json({ msg: "Email already exists!" });
    }
    if (userNameExist) {
      return res.status(400).json({ msg: "Username already exists!" });
    }
    res.send(await userSignup(req.body));
  }
);

// Signing In a User
router.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  // const userNameExist = await Users.findOne({ userName });
  // const passwordExist = await Users.findOne({ password });
  const result = await validateUser(req.body);
  console.log(result);
  if (!result) {
    res.json({ msg: "Authentication failed! Invalid username or password!" });
  } else {
    res.send(result);
  }
});

router.get("/", authenticateToken, (req, res) => {
  res.render("/");
});

// router.post("/api/token", async (req, res) => {
//   const refreshToken = req.body.token;
//   const refreshTokens = await Users.findOne({
//     refreshToken: req.body.refreshToken,
//   });
//   if (refreshToken == null) return res.sendStatus(401);
//   if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     const access_token = generateAccessToken({ userName: user.userName });
//     res.json({ access_token: access_token });
//   });
// });

router.delete("/api/logout", async (req, res) => {
  const refreshTokens = await Users.findOne({
    refreshToken: req.body.refreshToken,
  });
  refreshTokens.filter((token) => token !== req.body.token);
  response.sendStatus(204);
});

module.exports = router;
