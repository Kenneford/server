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

// userSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt();
//   password = await bcrypt.hash(password, salt);
//   next();
// });

// //CREATING OF  A MANUAL LOGIN METHOD
// userSchema.statics.login = async function (userName, password) {
//   const user = await this.findOne({ userName });
//   if (user) {
//     const isAuthenticated = await bcrypt.compare(password, user.password);
//     if (isAuthenticated) {
//       return user;
//     } else {
//       throw Error("Incorrect password!");
//     }
//   } else {
//     throw Error("Incorrect userName!");
//   }
// };

module.exports = mongoose.model("User", userSchema);
