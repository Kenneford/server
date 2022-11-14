const express = require("express");

const router = express.Router();
const Users = require("../model/userSchema");
const {
  postMessage,
  getAllMessage,
} = require("../controllers/messagesController");

router.post("/post-message", postMessage);
router.get("/all-messages", getAllMessage);

module.exports = router;
