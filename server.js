require("dotenv").config();
const mongoose = require("mongoose");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
crypto.randomBytes(64);
const jwt = require("jsonwebtoken");
const http = require("http");
const WebSocket = require("ws");

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

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.set("view engine", "ejs");
app.use(express.static("public"));

const PORT = process.env.PORT || 8083;

const server = http.createServer(app);
// const WebSocket = require("ws").Server;
const wsServer = new WebSocket.Server({ server });

// wsServer.on("connection", (socket) => {
//   // this code will run each time a new client connects to the server
//   console.log("New client connected!");
//   wsServer.send("Welcome new client!");
// });

const authUserRoutes = require("./routes/authUserRoutes");
const messagesRoutes = require("./routes/messagesRoutes");

const Users = require("./model/userSchema");
const Message = require("./model/messageModel");
const ChatRoom = require("./model/ChatRoom");

app.use("/api", authUserRoutes);
app.post("/api", authUserRoutes);
app.post("/api", authUserRoutes);
app.use("/api/", messagesRoutes);
app.post("/api/", messagesRoutes);

server.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
