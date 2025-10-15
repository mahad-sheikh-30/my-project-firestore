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

      const newUser = {
        uid,
        email,
        name: name || decodedToken.name || "",
        role,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await userRef.set(newUser);

      return res.status(201).json({
        ...newUser,
        message: "User created and logged in successfully",
      });
    }

    const userData = userDoc.data();

    res.status(200).json({
      ...userData,
      message: "Logged in successfully",
    });
  } catch (err) {
    console.error("Firebase login error:", err);

    if (err.code === "auth/invalid-credential") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(500).json({ message: "Firebase login failed" });
  }
});

module.exports = router;
