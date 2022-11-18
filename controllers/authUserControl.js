const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");

const maxAge = 24 * 60 * 60; // equal one day in second
const createJWT = (id) => {
  return jwt.sign({ id }, "chatroom secret", {
    expiresIn: maxAge,
  });
};

//USER SIGNUP FUNCTION
module.exports.signup = async (req, res) => {
  const {
    firstName,
    lastName,
    userName,
    email,
    passwordHash,
    confirmPasswordHash,
    profileImage,
  } = req.body;

  //   const emailExist = await User.findOne({ email: req.body.email });
  //   const userNameExist = await User.findOne({ userName: req.body.userName });
  //   if (emailExist) {
  //     return res.status(400).json({ msg: "Email already exists!" });
  //   }
  //   if (userNameExist) {
  //     return res.status(400).json({ msg: "Username already exists!" });
  //   }
  try {
    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      passwordHash,
      confirmPasswordHash,
      profileImage,
    });
    const token = createJWT(user._id);
    // create a cookie name as jwt and contain token and expire after 1 day
    // in cookies, expiration date calculate by milisecond
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user });
  } catch (error) {
    // let errors = alertError(error);
    res.status(400).json({ error });
  }
};

//LOGIN FUNCTION
module.exports.login = async (req, res) => {
  const { userName, passwordHash } = req.body;
  try {
    const user = await User.login(userName, passwordHash);
    // if (req.body.userName !== user.userName) {
    //     throw Error("Incorrect userName!");
    // }
    // if (req.body.password !== user.password) {
    //     throw Error("Incorrect password!");
    // }
    const token = createJWT(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user });
  } catch (error) {
    // let errors = alertError(error);
    res.status(400).json({ error });
  }
};

//LOGOUT FUNCTION
module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ logout: true });
};

//VERIFY USER FUNCTION
module.exports.verifyuser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "chatroom secret", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
      } else {
        let user = await User.findById(decodedToken.id);
        res.json(user);
        next();
      }
    });
  } else {
    next();
  }
};
