const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/database");
const auth = require("./routes/auth");
const review = require("./routes/review");
const authMiddleware = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());
console.log(process.env.CLIENT_URL);
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
connectDB();

app.use("/api/auth", auth);
app.use("/api/review", authMiddleware, review);

app.use(express.static(__dirname + "/client"));
app.use("*", express.static(__dirname + "/client"));
app.get("*", (req, res) => {
  res.send(__dirname + "/client/index.html");
});
app.listen(process.env.PORT || 4000, () => {
  console.log("Server is running on ", process.env.PORT || 4000);
});
