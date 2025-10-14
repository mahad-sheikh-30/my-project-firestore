const express = require("express");
const Course = require("../models/course");
const router = express.Router();
const upload = require("../middleware/multer");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const Enrollment = require("../models/enrollment");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.post("/", auth, admin, upload.single("image"), async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }
    const course = new Course({ ...req.body, image: imageUrl });
    await course.save();

    res.status(201).json({ message: "Course created", course });
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("teacherId", "_id name");

    res.send(courses);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const courses = await Course.findById(id).populate("teacherId", "name");

    res.send(courses);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.put("/:id", auth, admin, upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updateData.image = result.secure_url;
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("teacherId", "name");

    if (!updatedCourse) {
      return res.status(404).send({ error: "Course not found" });
    }
    res.json({ message: "Course updated", course: updatedCourse });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).send({ error: "Course not found" });
    }
    await Enrollment.deleteMany({ courseId: id });
    res.send({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
module.exports = router;
