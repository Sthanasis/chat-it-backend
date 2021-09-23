const catchAsync = require("../utils/catchAsync");
const Room = require("../models/Room");

exports.getChat = catchAsync(async (req, res) => {
  const roomId = req.query.roomId;
  const limit = req.query.limit.toString();

  const room = await Room.findOne({ roomId });
  console.log(room);
  if (room) {
    res.json({
      ok: true,
      result: room.chats.slice(parseInt(limit), parseInt(limit) + 10).reverse(),
      error: null,
    });
    res.status(200);
  } else {
    res.json({
      ok: false,
      error: `Room with id ${roomId} not found`,
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
      ok: true,
      message: `Message has been added to room ${roomId}`,
      result: result,
    });
    res.status(201);
  } else {
    res.json({
      ok: false,
      message: `Failure on message send.`,
    });
    res.status(400);
  }
});
