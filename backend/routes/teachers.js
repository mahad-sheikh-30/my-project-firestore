const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { db } = require("../firestore");

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("teachers").get();
    const teachers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doc = await db.collection("teachers").doc(req.params.id).get();
    if (!doc.exists)
      return res.status(404).json({ error: "Teacher not found" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", auth, admin, upload.single("image"), async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const teacherData = {
      ...req.body,
      image: imageUrl,
      rating: Number(req.body.rating) || 0,
    };
    const docRef = await db.collection("teachers").add(teacherData);
    const teacher = (await docRef.get()).data();

    res.status(201).json({ id: docRef.id, ...teacher });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", auth, admin, upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updateData.image = result.secure_url;
    }

    const docRef = db.collection("teachers").doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists)
      return res.status(404).json({ error: "Teacher not found" });

    await docRef.update(updateData);
    const updatedTeacher = (await docRef.get()).data();

    res.json({ id: docRef.id, ...updatedTeacher });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const docRef = db.collection("teachers").doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists)
      return res.status(404).json({ error: "Teacher not found" });

    await docRef.delete();
    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
