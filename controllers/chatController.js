const catchAsync = require("../utils/catchAsync");
const Room = require("../models/Room");

exports.getChat = catchAsync(async (req, res) => {
  const roomId = req.query.roomId;
  const limit = req.query.limit.toString();

  const room = await Room.findOne({ roomId });
  const STEP = 15
  if (room) {
    res.json({
      data: {
        messages: room.chats.slice(parseInt(limit), parseInt(limit) + STEP),
        totalCount: room.chats.length,
      }
    });
    res.status(200);
  } else {
    res.json({
      message: `Room with id ${roomId} not found`,
    });
    res.status(404);
  }

  res.end();
});

exports.postChat = catchAsync(async (req, res) => {
  const { roomId, message } = req.body;

  const result = await Room.updateOne(
    { roomId },
    {
      $push: {
        chats: {
          $each: [message],
          $position: 0,
        },
      },
    }
  );
  if (result) {
    res.json({
      message: `Message has been added to room ${roomId}`,
      data: result,
    });
    res.status(201);
  } else {
    res.json({
      message: `Failure on message send.`,
    });
    res.status(400);
  }
});
