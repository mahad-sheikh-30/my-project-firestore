const mongoose = require("mongoose");

module.exports = async function connectDB() {
  const uri = process.env.DB;
  if (!uri) {
    console.error("DB connection string missing (process.env.DB)");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log("Connected to database");
  } catch (err) {
    console.error("Could not connect to database:", err.message || err);
    process.exit(1);
  }
};
