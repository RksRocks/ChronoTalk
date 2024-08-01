const express = require("express");
const User = require("../models/userModel.js");
const router = express.Router();

router.post("/update-time/:id", async (req, res) => {
  const userId = req.params.id;
  const { timeSpent } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const currentDate = new Date().toISOString().split("T")[0];
    const lastLoginDate = new Date(user.lastLoginDate)
      .toISOString()
      .split("T")[0];

    if (currentDate !== lastLoginDate) {
      user.timeSpent = 0;
      user.lastLoginDate = new Date();
    }

    user.timeSpent = timeSpent;
    await user.save();
    res.status(200).json({ timeSpent: user.timeSpent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/time/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ timeSpent: user.timeSpent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
