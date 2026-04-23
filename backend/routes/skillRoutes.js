const express = require("express");
const Skill = require("../models/Skill");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// GET all skills for logged in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user._id });
    res.json(skills);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ADD a skill
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Skill name required" });
    const skill = await Skill.create({ userId: req.user._id, name });
    res.status(201).json(skill);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a skill
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: "Skill deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;