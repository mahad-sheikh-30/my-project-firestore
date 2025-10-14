const router = require("express").Router();
const { admin, db } = require("../firestore");

router.post("/firebase-login", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: "Token required" });

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      const adminSnapshot = await db
        .collection("users")
        .where("role", "==", "admin")
        .get();
      const role = adminSnapshot.empty ? "admin" : "user";

      await userRef.set({
        uid,
        email,
        name: name || "",
        role,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    const userData = (await userRef.get()).data();

    res.status(200).json({
      uid: userData.uid,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      message: "Logged in successfully",
    });
  } catch (err) {
    console.error("Firebase login error:", err);
    res.status(500).json({ message: "Firebase login failed" });
  }
});

module.exports = router;
