const express = require("express");
const router = express.Router();
const { db } = require("../firestore");

router.post("/", async (req, res) => {
  try {
    const { name, phone, email, comments } = req.body;

    if (!name || !phone || !email) {
      return res
        .status(400)
        .send({ message: "Name, phone, and email are required" });
    }

    const contactData = {
      name,
      phone,
      email,
      comments: comments || "",
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("contacts").add(contactData);

    res.status(201).send({
      message: "Contact form submitted successfully",
      contactId: docRef.id,
      contact: contactData,
    });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
