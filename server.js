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

const app = express();
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const sSocket = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const { serverChat } = require("./controllers/serverChat");

const PORT = process.env.PORT || 8083;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.set("view engine", "ejs");
app.use(express.static("public"));

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

serverChat(sSocket);

server.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
