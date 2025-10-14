const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");

router.post("/", async (req, res) => {
  try {
    const { name, phone, email, comments } = req.body;

    const contact = new Contact({
      name,
      phone,
      email,
      comments,
    });

    await contact.save();
    res.status(201).send({ message: "Contact form submitted", contact });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
