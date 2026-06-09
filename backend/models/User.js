const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  streak: { type: Number, default: 0 },
  bio: { type: String, default: "" },
  targetRole: { type: String, default: "" },
  interviewDone: { type: Boolean, default: false },
  linkedIn: { type: String, default: "" },
  github: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);