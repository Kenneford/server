const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../model/userSchema");

const mongodbConnection = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/test`;
// const mongodbConnection = `mongodb+srv://kenneford88:CodeWithKenn88.@cluster0.h935rfd.mongodb.net/test`;
mongoose.connect(mongodbConnection);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection failed!"));

const userCheck = async () => {
  const { userName, email } = Users;
  const usernameCheck = await Users.find({ userName });
  const emailCheck = await Users.find({ email });
  if (usernameCheck) {
    throw new Error("Username already exist!");
  } else if (emailCheck) {
    throw new Error("Email already in use by an existing user!");
  }
};

const userSignUp = ({
  firstName,
  lastName,
  userName,
  email,
  password,
  confirmPassword,
}) => {
  // if (userCheck()) {
  const passwordHash = bcrypt.hashSync(password, 10);
  const confirmPasswordHash = bcrypt.hashSync(confirmPassword, 10);
  const newUser = Users.create({
    firstName,
    lastName,
    userName,
    email,
    passwordHash,
    confirmPasswordHash,
  });
  return newUser;
  // }
};

const getRegUsers = async () => {
  return Users.find({});
};

const validateUser = async ({ userName, password }) => {
  const user = await Users.findOne({ userName });
  console.log(user);
  let isValid = false;
  try {
    isValid = await bcrypt.compare(password, user.passwordHash);
  } catch (error) {
    return null;
  }
  if (!isValid) {
    return null;
  }
  //   const refreshToken = jwt.sign(userName, process.env.REFRESH_TOKEN_SECRET);
  return {
    token: generateAccessToken(userName),
    refreshToken: refreshTokens(userName),
    userName,
  };
};

function generateAccessToken(userName) {
  const accessToken = jwt.sign({ userName }, process.env.TOKEN_SECRET, {
    expiresIn: "1800s",
  });
  return accessToken;
}
function refreshTokens(userName) {
  const token = jwt.sign({ userName }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1800s",
  });
  return token;
}

// function refreshTokens(req, res, next) {
//   const newRefreshToken = req.body.token;
//   if (newRefreshToken == null) return resendStatus(401);
//   if (!refreshToken.includes(newRefreshToken)) return resendStatus(403);
//   jwt.verify(newRefreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     const accessToken = generateAccessToken({ userName: user.userName });
//     res.json({ accessToken: accessToken });
//   });
// }

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];
  let token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    token = req.cookies.access_token?.token;
  }
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = {
  userSignUp,
  getRegUsers,
  validateUser,
  userCheck,
  authenticateToken,
  refreshTokens,
};
