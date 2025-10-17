const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { db } = require("../firestore");

const parseCourseData = (body, imageUrl) => ({
  ...body,
  image: imageUrl,
  studentsCount: Number(body.studentsCount) || 0,
  coursesCount: Number(body.coursesCount) || 0,
  price: Number(body.price) || 0,
  popular: body.popular === "true" || body.popular === true,
});

router.post("/", auth, admin, upload.single("image"), async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const courseData = parseCourseData(req.body, imageUrl);
    const docRef = await db.collection("courses").add(courseData);
    const courseSnap = await docRef.get();

    res.status(201).json({
      message: "Course created successfully",
      course: { id: docRef.id, ...courseSnap.data() },
    });
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("courses").get();

    const courses = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const courseData = doc.data();

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

        return { id: doc.id, ...courseData, teacherId: teacherData };
      })
    );

    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const docSnap = await db.collection("courses").doc(req.params.id).get();
    if (!docSnap.exists)
      return res.status(404).json({ error: "Course not found" });

    const courseData = docSnap.data();
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
    console.error("Error fetching course:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", auth, admin, upload.single("image"), async (req, res) => {
  try {
    const docRef = db.collection("courses").doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists)
      return res.status(404).json({ error: "Course not found" });

    let imageUrl = docSnap.data().image || "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const updateData = parseCourseData(req.body, imageUrl);
    await docRef.update(updateData);

    const updatedCourse = (await docRef.get()).data();
    res.json({
      message: "Course updated successfully",
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
    const docSnap = await docRef.get();

    if (!docSnap.exists)
      return res.status(404).json({ error: "Course not found" });

    await docRef.delete();

    const enrollmentSnap = await db
      .collection("enrollments")
      .where("courseId", "==", req.params.id)
      .get();

    const batch = db.batch();
    enrollmentSnap.forEach((e) => batch.delete(e.ref));
    await batch.commit();

    res.json({ message: "Course and related enrollments deleted" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
