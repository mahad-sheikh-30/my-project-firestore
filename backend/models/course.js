const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  tag: { type: String, enum: ["Free", "Premium"], required: true },
  price: { type: Number, required: true, default: 0 },
  coursesCount: { type: Number, required: true },
  studentsCount: { type: Number, default: 0 },
  image: { type: String },
  popular: { type: Boolean, default: false },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
