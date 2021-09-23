const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  message: String,
  date: String,
  receiverUid: String,
  senderUid: String,
  senderName: String,
  receiverName: String,
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
