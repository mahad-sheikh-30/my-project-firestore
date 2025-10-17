const express = require("express");
const { db, admin } = require("../firestore");
const auth = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");

const router = express.Router();

const formatDate = (ts) =>
  ts instanceof admin.firestore.Timestamp
    ? ts.toDate().toISOString()
    : ts || null;

const toNumber = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

router.get("/my", auth, async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId)
      return res.status(401).json({ error: "User not authenticated" });

    const txSnap = await db
      .collection("transactions")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const transactions = await Promise.all(
      txSnap.docs.map(async (doc) => {
        const data = doc.data();
        const courseSnap = await db
          .collection("courses")
          .doc(data.courseId)
          .get();
        const course = courseSnap.exists ? courseSnap.data() : {};

        return {
          _id: doc.id,
          amount: toNumber(data.amount),
          paymentIntentId: data.paymentIntentId || "",
          createdAt: formatDate(data.createdAt),
          courseId: {
            title: course.title || "N/A",
            price: toNumber(course.price),
          },
        };
      })
    );

    res.json(transactions);
  } catch (err) {
    console.error("Fetch my transactions error:", err);
    res.status(500).json({ error: "Failed to fetch your transactions" });
  }
});

router.get("/", auth, adminMiddleware, async (req, res) => {
  try {
    const txSnap = await db
      .collection("transactions")
      .orderBy("createdAt", "desc")
      .get();

    const transactions = await Promise.all(
      txSnap.docs.map(async (doc) => {
        const data = doc.data();

        const [userSnap, courseSnap] = await Promise.all([
          db.collection("users").doc(data.userId).get(),
          db.collection("courses").doc(data.courseId).get(),
        ]);

        const user = userSnap.exists ? userSnap.data() : {};
        const course = courseSnap.exists ? courseSnap.data() : {};

        return {
          _id: doc.id,
          amount: toNumber(data.amount),
          paymentIntentId: data.paymentIntentId || "",
          createdAt: formatDate(data.createdAt),
          userId: {
            name: user.name || "N/A",
            email: user.email || "",
          },
          courseId: {
            title: course.title || "N/A",
          },
        };
      })
    );

    res.json(transactions);
  } catch (err) {
    console.error("Fetch all transactions error:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

module.exports = router;
