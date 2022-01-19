const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const compression = require("compression");
const { json } = require("body-parser");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
//middlewares
app.use(cors());
app.use(compression());
app.use(json());
app.use("/assets", express.static("assets"));

const userRouter = require("./api/userRoutes");
const adminRouter = require("./api/adminRoutes");
const chatRouter = require("./api/chatRoutes");
const testRouter = require("./api/testRoutes");
//route middlewars
app.use("/api", adminRouter);
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/test", testRouter);

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 3000;

//active users array TODO Mongo collection
let users = [];

const addUser = (socketId, data) => {
  !users.some((user) => user.data.uid === data.uid) &&
    users.push({ socketId, data });
};

const editUser = (socketId, data) => {
  users = users.map((user) =>
    user.data.uid === data.uid ? { socketId, data } : user
  );
};

const removeUser = (uid) => {
  users = users.filter((user) => user.data.uid !== uid);
};

const getUser = (uid) => {
  return users.find((user) => user.data.uid === uid);
};

io.on("connect", (socket) => {

  socket.on("active", ({uid}) => {
    socket.broadcast.emit("userSignIn", {
      uid: uid,
      active: true,
    });
  });
  socket.on('user-status', ({uid, active})=> {
    socket.broadcast.emit("userStatus", {
      uid,
      active
    })
  })
  socket.on("reconnect", (user) => {
    try {
      addUser(socket.id, user);
      editUser(socket.id, user);
      console.log(users)
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("connect-request", ({ requestSender, receiverId }) => {
    /* 
      @params 
      requestSender {
        fisrtname: string;
        lastname: string;
      }

      receiverId: string
    */
    try {
      const receiver = getUser(receiverId);
      io.to(receiver.socketId).emit("notification", {
        message: `${requestSender.firstname} ${requestSender.lastname} wants to connect`,
      });
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("accept-connect", (user) => {
    try {
      const receiver = getUser(user.uid);
      io.to(receiver.socketId).emit("connection-accepted", user);
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("start-chat", ({ room, receiverId }) => {
    try {
      const receiver = getUser(receiverId);
      io.to(receiver.socketId).emit("startChat", room);
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("isTyping", ({ uid, isTyping }) => {
    try {
      const user = getUser(uid);
      io.to(user.socketId).emit("typing", isTyping);
    } catch (err) {
      console.log(err);
    }
  });
  //user sending message
  socket.on("send-message", (message) => {
    try {
      const receiver = getUser(message.receiverUid);
      io.to(receiver.socketId).emit("chat", message);
    } catch (err) {
      console.log("======================\n" + err);
    }
  });
  //when the user exits the room
  socket.on("inactive", ({uid}) => {
    //the user is deleted from array of users and a left room message displayed
    removeUser(uid);
    socket.broadcast.emit("userSignOut", {
      uid,
      active: false,
    });
  });
});

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("uncaught Exception! SHUTTING DOWN NOW");
  process.exit(1);
});

mongoose
  .connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => console.log(err));

server.listen(port, () => {
  console.log(
    `> Running on http://localhost:${port} with environment ${process.env.NODE_ENV}`
  );
});
