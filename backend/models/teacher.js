const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  rating: { type: Number, default: 0 },
  image: { type: String },
});

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
