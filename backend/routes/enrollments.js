const express = require("express");
const Enrollment = require("../models/enrollment");
const Course = require("../models/course");
const auth = require("../middleware/auth");
const router = express.Router();
const { User } = require("../models/user");

const admin = require("../middleware/admin");

router.post("/", auth, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    if (!courseId) {
      return res.status(400).json({ error: "courseId is required" });
    }

    const enrollment = new Enrollment({ userId, courseId });
    await enrollment.save();

    await Course.findByIdAndUpdate(courseId, { $inc: { studentsCount: 1 } });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: "student" },
      { new: true }
    );
    if (!updatedUser) {
      console.log("User not found");
      return;
    }
    res.status(201).json(enrollment);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "User already enrolled in this course" });
    }
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("userId", "name email")
      .populate({
        path: "courseId",
        populate: { path: "teacherId", select: "name role" },
      });

    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const enrollments = await Enrollment.find({ userId }).select("courseId");
    const courseIds = enrollments.map((e) => e.courseId.toString());
    res.json(courseIds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const enrollmentId = req.params.id;

    const enrollment = await Enrollment.findByIdAndDelete(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    await Course.findByIdAndUpdate(enrollment.courseId, {
      $inc: { studentsCount: -1 },
    });

    const stillEnrolled = await Enrollment.exists({
      userId: enrollment.userId,
    });

    let newRole = null;
    if (!stillEnrolled) {
      const updatedUser = await User.findByIdAndUpdate(
        enrollment.userId,
        { role: "user" },
        { new: true }
      );
      newRole = updatedUser;
    }
    return res.json({
      newRole: newRole?.role || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
