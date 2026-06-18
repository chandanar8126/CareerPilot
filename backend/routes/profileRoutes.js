const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Skill = require("../models/Skill");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/profile
router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.json(user);
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

// PUT /api/profile
router.put("/", authMiddleware, async (req, res) => {
    try {
        const { bio, targetRole, linkedIn, github } = req.body;
        const updated = await User.findByIdAndUpdate(
            req.user._id,
            { bio, targetRole, linkedIn, github },
            { new: true }
        ).select("-password");
        res.json(updated);
    } catch {
        res.status(500).json({ message: "Update failed" });
    }
});

// PUT /api/profile/interview-done
router.put("/interview-done", authMiddleware, async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(
            req.user._id,
            { interviewDone: true },
            { new: true }
        ).select("-password");
        res.json(updated);
    } catch {
        res.status(500).json({ message: "Update failed" });
    }
});

// GET /api/profile/progress
router.get("/progress", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        const skills = await Skill.find({ userId: req.user._id });

        const checks = [
            { label: "Name added", done: !!user.name },
            { label: "Bio / headline written", done: !!user.bio },
            { label: "Target role set", done: !!user.targetRole },
            { label: "3+ skills added", done: skills.length >= 3 },
            { label: "Interview session done", done: !!user.interviewDone },
            { label: "LinkedIn profile added", done: !!user.linkedIn },
            { label: "GitHub profile added", done: !!user.github },
        ];

        const completed = checks.filter((c) => c.done).length;
        const percentage = Math.round((completed / checks.length) * 100);

        res.json({ percentage, completed, total: checks.length, checks });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;