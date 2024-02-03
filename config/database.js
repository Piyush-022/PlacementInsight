const mongoose = require("mongoose");
require("dotenv").config();
exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (error) {
    console.log("error occured while connecting to the database");
    console.log(error);
  }
};
