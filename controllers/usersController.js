// const dotenv = require("dotenv");
// dotenv.config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../model/userSchema");

// const mongodbConnection = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/test`;
// // const mongodbConnection = `mongodb+srv://kenneford88:CodeWithKenn88.@cluster0.h935rfd.mongodb.net/test`;
// mongoose.connect(mongodbConnection);
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection failed!"));

// const userCheck = async () => {
//   const { userName, email } = Users;
//   const usernameCheck = await Users.find({ userName });
//   const emailCheck = await Users.find({ email });
//   if (usernameCheck) {
//     throw new Error("Username already exist!");
//   } else if (emailCheck) {
//     throw new Error("Email already in use by an existing user!");
//   }
// };

//Signing Up New User
const userSignup = async ({
  firstName,
  lastName,
  userName,
  email,
  password,
  confirmPassword,
}) => {
  const passwordHash = bcrypt.hashSync(password, 10);
  const confirmPasswordHash = bcrypt.hashSync(confirmPassword, 10);
  const refreshTokens = jwt.sign(
    { userName },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRY,
    }
  );
  if (!firstName || !lastName) {
    // const error = "First name or last name should not be empty!";
    return;
  }
  const newUser = Users.create({
    firstName,
    lastName,
    userName,
    email,
    passwordHash,
    confirmPasswordHash,
    refreshToken: refreshTokens,
  });
  return newUser;
};

const getRegUsers = async () => {
  const user = await Users.find({});
  return user;
};

function generateAccessToken(userName) {
  const accessToken = jwt.sign({ userName }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_SECRET_EXPIRY,
  });
  return accessToken;
}

// function refreshTokens(userName) {
//   const token = jwt.sign({ userName }, process.env.REFRESH_TOKEN_SECRET);
//   return token;
// }

const validateUser = async ({ userName, password }) => {
  const user = await Users.findOne({ userName, password });
  console.log(user);
  let isValid = false;
  try {
    isValid = await bcrypt.compare(password, user.passwordHash);
  } catch (error) {
    return null;
  }
  if (!isValid) {
    return null;
  } else {
    return {
      token: generateAccessToken(userName),
      refreshToken: user.refreshToken,
      userName,
    };
  }
};

const logout = (req, res) => {};

module.exports = {
  userSignup,
  getRegUsers,
  validateUser,
  //   userCheck,
  //   refreshTokens,
  generateAccessToken,
};
