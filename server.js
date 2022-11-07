require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
crypto.randomBytes(64);
const jwt = require("jsonwebtoken");
const authUserRoutes = require("./routes/authUserRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.set("view engine", "ejs");
app.use(express.static("public"));

const port = process.env.PORT || 8083;

app.use("/api", authUserRoutes);
app.post("/api", authUserRoutes);
app.post("/api", authUserRoutes);

app.listen(port, () => console.log(`Server listening at port ${port}`));
