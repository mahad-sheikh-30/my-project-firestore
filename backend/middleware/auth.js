const { admin, db } = require("../firestore"); // Firebase Admin SDK + Firestore

module.exports = async function auth(req, res, next) {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const idToken = authHeader.split(" ")[1];

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found in Firestore" });
    }

    const user = userDoc.data();

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: user.role || "user",
      name: user.name,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
