const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
  },
  chats: [
    {
      message: {
        type: String,
      },
      date: {
        type: String,
      },
      senderUid: {
        type: String,
      },
      receiverUid: {
        type: String,
      },
    },
  ],
});

const Room = mongoose.model("chat-rooms", roomSchema);

module.exports = Room;
