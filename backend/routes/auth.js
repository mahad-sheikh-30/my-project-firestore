const router = require("express").Router();
const { admin, db } = require("../firestore");

router.post("/firebase-login", async (req, res) => {
  try {
    const { idToken, providerId } = req.body;
    if (!idToken) return res.status(400).json({ message: "Token required" });

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      return res.status(200).json({
        ...userData,
        message: "Logged in successfully",
      });
    }

    const userName = name || decodedToken.name || "Facebook User";
    const userEmail =
      email || `${userName.replace(" ", "")}${uid.slice(0, 3)}@facebook.com`;

    const emailSnapshot = await db
      .collection("users")
      .where("email", "==", userEmail)
      .get();

    if (!emailSnapshot.empty) {
      return res.status(409).json({
        message:
          "Email already exists. Please use the same sign-in method or link your accounts.",
      });
    }

    const adminSnapshot = await db
      .collection("users")
      .where("role", "==", "admin")
      .get();
    const role = adminSnapshot.empty ? "admin" : "user";

    const newUser = {
      uid,
      email: userEmail,
      name: userName,
      role,
      provider: providerId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await userRef.set(newUser);

    return res.status(201).json({
      ...newUser,
      message: "User created and logged in successfully",
    });
  } catch (err) {
    console.error("Firebase login error:", err);
    res.status(500).json({ message: "Firebase login failed" });
  }
});

module.exports = router;
