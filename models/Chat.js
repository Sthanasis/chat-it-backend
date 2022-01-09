const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  message: String,
  date: String,
  senderUid: String,
  reveiverUid: String,
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
