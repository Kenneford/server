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

function generateAccessToken(userName) {
  return jwt.sign({ userName }, process.env.TOKEN_SECRET, {
    expiresIn: "1800s",
  });
}

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
  return { token: generateAccessToken(userName), userName };
};

module.exports = {
  userSignUp,
  getRegUsers,
  validateUser,
  userCheck,
};
