require("dotenv").config();
const mongoose = require("mongoose");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
crypto.randomBytes(64);
const jwt = require("jsonwebtoken");

const mongodbConnection = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/test`;
// const mongodbConnection = `mongodb+srv://kenneford88:CodeWithKenn88.@cluster0.h935rfd.mongodb.net/test`;
mongoose.connect(mongodbConnection, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection failed!"));
mongoose.connection.once("open", () => {
  console.log("MongoDB connected!");
});

const corsOptions = {
  origin: "*", // your frontend server address
  credentials: true,
  optionsSuccessStatus: 200,
};

const User = require("./model/userSchema");
const Message = require("./model/messageModel");
const ChatRoom = require("./model/ChatRoom");
const { addUser, getUser, removeUser } = require("./utilities/util");
const { validateUser } = require("./controllers/usersController");

const app = express();
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const serverSocket = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 8083;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.set("view engine", "ejs");
app.use(express.static("public"));

serverSocket.on("connection", (socket) => {
  console.log("New user connected! " + socket.id);

  socket.on("joined", ({ name }, callback) => {
    const user = validateUser({ _id: socket.id, name });
    // if (error) return callback(error);
    console.log(`Welcome, and great to have you here @${name}`);

    socket.emit("message", {
      // user: "admin",
      text: `Welcome @${name}`,
    });

    socket.broadcast.emit("message", {
      // user: "admin",
      text: `${name}, has joined!`,
    });
    socket.join(user.room);
    serverSocket.to(user.room).emit("roomData", text);
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = validateUser(socket.id, name);
    serverSocket.emit("message", { user: user.name, text: message });
    // serverSocket.emit("roomData", text);
    // callback();
  });
  socket.on("closing connection", () => {
    console.log("user disconnected!");
    // const user = getUser(socket.id);
    // if (user) {
    serverSocket.emit("message", {
      // user: "admin",
      text: `${name}, has left!`,
    });
    // }
  });
});

// serverSocket.on("connection", (socket) => {
//   console.log("New user connected! " + socket.id);

// socket.on("joined", ({ name }, callback) => {
//   const user = validateUser({ _id: socket.id, name });
//   // if (error) return callback(error);
//   console.log(`Welcome, and great to have you here @${name}`);

//     socket.emit("join", {
//       user: "admin",
//       text: `Welcome, and great to have you here ${name}`,
//     });
//     socket.on("closing connection", () => {
//       console.log("user disconnected!");
//     });
//   });
// });

// serverSocket.on("connection", (socket) => {
//   console.log(`New user connected! ID: ${socket.id}`);
//   ChatRoom.find().then((result) => {
//     socket.emit("output-rooms", result);
//   });
//   socket.on("create-room", (name) => {
//     const room = new ChatRoom({ name });
//     room.save().then((result) => {
//       serverSocket.emit("room-created", result);
//     });
//   });
//   socket.on("join", ({ name, room_id, user_id }) => {
//     const { error, user } = addUser({
//       socket_id: socket.id,
//       name,
//       room_id,
//       user_id,
//     });
//     socket.join(room_id);
//     if (error) {
//       console.log("join error", error);
//     } else {
//       console.log("join user", user);
//     }
//   });
//   socket.on("sendMessage", (message, room_id, callback) => {
//     const user = getUser(socket.id);
//     const msgToStore = {
//       name: user.name,
//       user_id: user.user_id,
//       room_id,
//       text: message,
//     };
//     console.log("message", msgToStore);
//     const msg = new Message(msgToStore);
//     msg.save().then((result) => {
//       serverSocket.to(room_id).emit("message", result);
//       callback();
//     });
//   });
//   socket.on("get-messages-history", (room_id) => {
//     Message.find({ room_id }).then((result) => {
//       socket.emit("output-messages", result);
//     });
//   });
//   socket.on("disconnect", () => {
//     const user = removeUser(socket.id);
//   });
// });

const authUserRoutes = require("./routes/authUserRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const { text } = require("express");
const { name } = require("ejs");

app.use("/", authUserRoutes);
app.use("/api", authUserRoutes);
app.post("/api", authUserRoutes);
app.post("/api", authUserRoutes);
app.use("/api/", messagesRoutes);
app.post("/api/", messagesRoutes);

server.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
