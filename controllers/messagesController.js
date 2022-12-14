const Messages = require("../model/messageModel");

const postMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) {
      return res.json({ msg: "Message added successfully!" });
    } else {
      return res.json({ msg: "Failed to add message to the database!" });
    }
  } catch (err) {}
};
const getAllMessage = () => {};

module.exports = {
  postMessage,
  getAllMessage,
};
