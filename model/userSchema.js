const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      require: [true, "Please add your first name!"],
    },
    lastName: {
      type: String,
      require: [true, "Please add your last name!"],
    },
    userName: {
      type: String,
      require: [true, "Please add a username!"],
      //   unique: true,
    },
    email: {
      type: String,
      require: [true, "Please provide an email!"],
      //   unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      require: [true, "Please provide a password"],
      minlength: 8,
    },
    confirmPasswordHash: {
      type: String,
      //   require: [true, "Please provide a password"],
    },
    refreshToken: String,
    profileImage: String,
    joined: { type: Date, default: Date.now },
  }
  // {
  //   timestamps: true,
  // }
);

module.exports = mongoose.model("Users", userSchema);
