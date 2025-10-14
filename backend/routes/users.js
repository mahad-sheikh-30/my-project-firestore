const express = require("express");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already exists!" });

    const adminExists = await User.findOne({ role: "admin" });

    let role = "user";
    if (!adminExists) {
      role = "admin";
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({
      ...req.body,
      password: hashPassword,
      role,
    }).save();

    res.status(201).send({ message: `User created successfully as ${role}` });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/", auth, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
