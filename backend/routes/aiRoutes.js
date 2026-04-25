const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// AI Interview Feedback
router.post("/interview-feedback", authMiddleware, async (req, res) => {
  try {
    const { question, answer, role } = req.body;
    const prompt = `You are an expert interview coach. A candidate is interviewing for a ${role || "software developer"} position.

Question: "${question}"
Candidate's Answer: "${answer}"

Give structured feedback in this exact JSON format:
{
  "score": <number 1-10>,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "betterAnswer": "A sample better answer in 2-3 sentences",
  "tips": "One key tip for this type of question"
}
Only respond with the JSON, no extra text.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    const feedback = JSON.parse(clean);
    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI feedback failed" });
  }
});

// AI Career Recommendations
router.post("/career-advice", authMiddleware, async (req, res) => {
  try {
    const { skills } = req.body;
    const prompt = `You are a career counselor. Based on these skills: ${skills.join(", ")}, give career advice in this exact JSON format:
{
  "topCareers": [
    {
      "title": "Career Title",
      "match": <percentage 0-100>,
      "description": "2 sentence description",
      "avgSalary": "salary range in INR",
      "missingSkills": ["skill1", "skill2"],
      "roadmap": ["step1", "step2", "step3"]
    }
  ],
  "summary": "One paragraph personalized advice"
}
Give exactly 3 careers. Only respond with JSON.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    const advice = JSON.parse(clean);
    res.json(advice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI career advice failed" });
  }
});

// AI Chat Assistant
// AI Chat Assistant
router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = `You are CareerPilot AI, a helpful career assistant for students and professionals. 
Help with career advice, interview preparation, skill building, resume tips, and job search strategies. 
Be concise, practical, and encouraging. 

User question: ${message}

Give a helpful, conversational response in 2-4 sentences.`;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    res.json({ response });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ message: "AI chat failed: " + err.message });
  }
});

// AI Resume Tips
router.post("/resume-tips", authMiddleware, async (req, res) => {
  try {
    const { skills, targetRole } = req.body;
    const prompt = `Give resume tips for someone with skills: ${skills.join(", ")} targeting a ${targetRole} role. Respond in JSON:
{
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "summary": "A sample professional summary for their resume in 2-3 sentences"
}
Only respond with JSON.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    const tips = JSON.parse(clean);
    res.json(tips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Resume tips failed" });
  }
});

module.exports = router;