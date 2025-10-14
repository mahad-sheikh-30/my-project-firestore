const express = require("express");
const { db, admin } = require("../firestore");
const auth = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");

const router = express.Router();

const enrollmentsRef = db.collection("enrollments");
const coursesRef = db.collection("courses");
const usersRef = db.collection("users");
const teachersRef = db.collection("teachers");

router.post("/", auth, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user?.uid;

    if (!userId)
      return res.status(401).json({ error: "User not authenticated" });
    if (!courseId)
      return res.status(400).json({ error: "courseId is required" });

    const existingSnap = await enrollmentsRef
      .where("userId", "==", userId)
      .where("courseId", "==", courseId)
      .get();

    if (!existingSnap.empty)
      return res.status(400).json({ error: "Already enrolled in this course" });

    const enrollmentData = {
      userId,
      courseId,
      enrolledAt: admin.firestore.Timestamp.now(),
    };
    const docRef = await enrollmentsRef.add(enrollmentData);

    await coursesRef.doc(courseId).update({
      studentsCount: admin.firestore.FieldValue.increment(1),
    });

    const userDoc = await usersRef.doc(userId).get();
    if (userDoc.exists && userDoc.data().role !== "admin") {
      await usersRef.doc(userId).update({ role: "student" });
    }

    res.status(201).json({ id: docRef.id, ...enrollmentData });
  } catch (err) {
    console.error("Enrollment creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId)
      return res.status(401).json({ error: "User not authenticated" });

    const snapshot = await enrollmentsRef.where("userId", "==", userId).get();
    if (snapshot.empty) return res.json([]);

    const courseIds = snapshot.docs.map((doc) => doc.data().courseId);

    res.json(courseIds);
  } catch (err) {
    console.error("Fetch my enrollments error:", err);
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
});

router.get("/", auth, adminMiddleware, async (req, res) => {
  try {
    const snapshot = await enrollmentsRef.get();
    const enrollments = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();

      const userSnap = await usersRef.doc(data.userId).get();
      const user = userSnap.exists ? userSnap.data() : {};

      const courseSnap = await coursesRef.doc(data.courseId).get();
      const course = courseSnap.exists ? courseSnap.data() : {};

      let teacherName = "N/A";
      if (course.teacherId) {
        const teacherSnap = await teachersRef.doc(course.teacherId).get();
        teacherName = teacherSnap.exists ? teacherSnap.data().name : "N/A";
      }

      enrollments.push({
        _id: doc.id,
        user: { name: user.name || "N/A" },
        course: {
          title: course.title || "Untitled",
          teacher: teacherName,
        },
      });
    }

    res.json(enrollments);
  } catch (err) {
    console.error("Fetch enrollments error:", err);
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
});

router.delete("/:id", auth, adminMiddleware, async (req, res) => {
  try {
    const enrollmentDoc = enrollmentsRef.doc(req.params.id);
    const enrollmentSnap = await enrollmentDoc.get();

    if (!enrollmentSnap.exists)
      return res.status(404).json({ error: "Enrollment not found" });

    const { userId, courseId } = enrollmentSnap.data();

    await enrollmentDoc.delete();

    await coursesRef
      .doc(courseId)
      .update({ studentsCount: admin.firestore.FieldValue.increment(-1) });

    const remainingSnap = await enrollmentsRef
      .where("userId", "==", userId)
      .get();

    if (remainingSnap.empty) {
      await usersRef.doc(userId).update({ role: "user" });
    }

    res.json({ message: "Enrollment deleted successfully" });
  } catch (err) {
    console.error("Delete enrollment error:", err);
    res.status(500).json({ error: "Failed to delete enrollment" });
  }
});

module.exports = router;
