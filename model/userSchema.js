const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    userName: {
      type: String,
      require: [true, "Please add a username!"],
      // unique: true,
    },
    email: {
      type: String,
      require: [true, "Please enter your email!"],
      // unique: true,
      lowercase: true,
      // validator: [validator.isEmail, "Please provide a valid email!"],
    },
    passwordHash: {
      type: String,
      require: [true, "Please provide a password"],
      minlength: 8,
    },
    confirmPasswordHash: {
      type: String,
      require: [true, "Please provide a password"],
    },
    profileImage: String,
    joined: { type: Date, default: Date.now },
  }
  // {
  //   timestamps: true,
  // }
);

module.exports = mongoose.model("Users", userSchema);
