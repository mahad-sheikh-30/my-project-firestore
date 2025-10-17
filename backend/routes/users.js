const express = require("express");
const { db, admin } = require("../firestore");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, uid } = req.body;
    if (!name || !email || !phone || !uid) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userRef = db.collection("users");
    const snapshot = await userRef.where("email", "==", email).get();
    if (!snapshot.empty) {
      return res.status(409).json({ message: "User already exists" });
    }

    const adminSnapshot = await userRef.where("role", "==", "admin").get();
    const role = adminSnapshot.empty ? "admin" : "user";

    await userRef.doc(uid).set({
      name,
      email,
      phone,
      uid,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: `User created as ${role}`, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const snapshot = await db
      .collection("users")
      .orderBy("createdAt", "desc")
      .get();

    if (snapshot.empty) {
      return res.status(200).json({ message: "No users found", users: [] });
    }

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;
