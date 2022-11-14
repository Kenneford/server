const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatRoomSchema = new Schema({
  firstName: {
    type: String,
    require: [true, "Please add your first name!"],
  },
});

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
