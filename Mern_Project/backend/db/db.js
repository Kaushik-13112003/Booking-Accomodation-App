const mongoose = require("mongoose");
const colors = require("colors");

const DB = process.env.DB;
const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("Database Connected");
  } catch (err) {
    console.log("Database not Connected", colors.red(err));
  }
};

connectDB();
