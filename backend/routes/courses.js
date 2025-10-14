const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { db } = require("../firestore");

router.post("/", auth, admin, upload.single("image"), async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const courseData = {
      ...req.body,
      image: imageUrl,
      studentsCount: Number(req.body.studentsCount) || 0,
      coursesCount: Number(req.body.coursesCount) || 0,
      price: Number(req.body.price) || 0,
    };

    const docRef = await db.collection("courses").add(courseData);
    const course = (await docRef.get()).data();

    res.status(201).json({
      message: "Course created",
      course: { id: docRef.id, ...course },
    });
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("courses").get();
    const courses = [];

    for (const doc of snapshot.docs) {
      const courseData = doc.data();

      let teacherData = null;
      if (courseData.teacherId) {
        const teacherSnap = await db
          .collection("teachers")
          .doc(courseData.teacherId)
          .get();
        if (teacherSnap.exists)
          teacherData = { id: teacherSnap.id, ...teacherSnap.data() };
      }

      courses.push({ id: doc.id, ...courseData, teacherId: teacherData });
    }

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const docRef = db.collection("courses").doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists)
      return res.status(404).json({ error: "Course not found" });

    const courseData = docSnap.data();

    // Populate teacher
    let teacherData = null;
    if (courseData.teacherId) {
      const teacherSnap = await db
        .collection("teachers")
        .doc(courseData.teacherId)
        .get();
      if (teacherSnap.exists) {
        teacherData = { id: teacherSnap.id, ...teacherSnap.data() };
      }
    }

    res.json({ id: docSnap.id, ...courseData, teacherId: teacherData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", auth, admin, upload.single("image"), async (req, res) => {
  try {
    const docRef = db.collection("courses").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Course not found" });
    }

    let imageUrl = docSnap.data().image || "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const updateData = {
      ...req.body,
      image: imageUrl,
      studentsCount: Number(req.body.studentsCount) || 0,
      coursesCount: Number(req.body.coursesCount) || 0,
      price: Number(req.body.price) || 0,
    };

    await docRef.update(updateData);

    const updatedCourse = (await docRef.get()).data();

    res.json({
      message: "Course updated",
      course: { id: docRef.id, ...updatedCourse },
    });
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const docRef = db.collection("courses").doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Course not found" });

    await docRef.delete();

    const enrollmentSnapshot = await db
      .collection("enrollments")
      .where("courseId", "==", req.params.id)
      .get();

    enrollmentSnapshot.forEach(
      async (e) => await db.collection("enrollments").doc(e.id).delete()
    );

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
