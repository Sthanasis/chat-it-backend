const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

exports.getUserHandler = catchAsync(async (req, res) => {
  const { uid } = req.params;

  const result = await User.findOne({ uid });

  if (result) {
    res.json({ ok: true, message: "User found", result, error: null });
    res.status(200).end();
  } else {
    res.json({ ok: true, message: "User not found", error: null });
    res.status(200).end();
  }
});

exports.updateUserStatus = catchAsync(async (req, res) => {
  const { uid, active } = req.body;
  const result = await User.findOneAndUpdate({ uid }, { $set: { active } });

  if (result) {
    res.json({ ok: true });
    res.status(200).end();
  } else {
    res.json({ ok: false });
    res.status(200).end();
  }
});

exports.searchUsers = catchAsync(async (req, res) => {
  const params = req.query.search;
  let search;
  if (!Array.isArray(params)) {
    search = params;
  } else {
    search = params.join(" ");
  }
  //add schema for $text operator
  User.createIndexes({ firstname: "text", lastname: "text" });

  const result = await User.find(
    { $text: { $search: search } },
    { projection: { password: 0, _id: 0 } }
  );

  res.json({ users: result });
  res.status(200).end();
});

exports.getAllUsers = catchAsync(async (req, res) => {
  const result = await User.find({}, { projection: { password: 0, _id: 0 } });
  res.json({ users: result });
  res.status(200).end();
});

exports.getAllActiveUsers = catchAsync(async (req, res) => {
  const params = req.query.uids;
  let uids;
  if (!Array.isArray(params)) {
    uids = [params];
  } else {
    uids = params;
  }

  const result = await User.find(
    { uid: { $in: uids } },
    { projection: { password: 0, _id: 0 } }
  );
  res.json({ users: result });

  res.status(200).end();
});

exports.connectWithUser = catchAsync(async (req, res) => {
  const myUid = req.body.uid;
  const otherUid = req.body.uid2;

  const updateFirst = User.updateOne(
    { uid: myUid },
    { $addToSet: { connectedTo: otherUid } }
  );

  const updateSecond = User.updateOne(
    { uid: otherUid },
    { $addToSet: { connectedTo: myUid } }
  );

  const createChatRoom = roomCollection.insertOne({
    roomId: combineUserUids(myUid, otherUid),
    chats: [],
  });
  const promises = Promise.all([updateFirst, updateSecond, createChatRoom]);

  const result = await promises;

  if (result) {
    res.json({
      ok: true,
      message: `You have connected with the user`,
      result: [updateFirst, updateSecond, createChatRoom],
    });
    res.status(201).end();
  } else {
    res.json({
      ok: false,
      message: `Connecting with the user failed.`,
    });
    res.status(400).end();
  }
  client.close();
});
