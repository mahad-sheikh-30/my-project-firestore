const express = require("express");
const Teacher = require("../models/teacher");
const router = express.Router();
const upload = require("../middleware/multer");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find().sort();
    res.send(teachers);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const teachers = await Teacher.findById(id);
    res.send(teachers);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.post("/", auth, admin, upload.single("image"), async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const newTeacher = new Teacher({ ...req.body, image: imageUrl });
    await newTeacher.save();
    res.send(newTeacher);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.put("/:id", auth, admin, upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id;
    let updateData = { ...req.body };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updateData.image = result.secure_url;
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTeacher) {
      return res.status(404).send({ error: "Teacher not found" });
    }

    res.send(updatedTeacher);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Teacher.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).send({ error: "Teacher not found" });
    }
    res.send({ message: "Teacher deleted successfully" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
module.exports = router;
