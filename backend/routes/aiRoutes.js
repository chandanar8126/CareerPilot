const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const groqRequest = async (prompt) => {
  const res = await axios.post(
    GROQ_API_URL,
    {
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data.choices[0].message.content;
};

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

    const text = await groqRequest(prompt);
    const clean = text.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(clean));
  } catch (err) {
    console.error("Interview feedback error:", err.message);
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
Give exactly 3 careers. Only respond with JSON, no extra text.`;

    const text = await groqRequest(prompt);
    const clean = text.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(clean));
  } catch (err) {
    console.error("Career advice error:", err.message);
    res.status(500).json({ message: "AI career advice failed" });
  }
});

// AI Chat Assistant
router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = `You are CareerPilot AI, a helpful career assistant for students and professionals.
Help with career advice, interview preparation, skill building, resume tips, and job search strategies.
Be concise, practical, and encouraging.

User question: ${message}

Give a helpful, conversational response in 2-4 sentences.`;

    const response = await groqRequest(prompt);
    res.json({ response });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ message: "AI chat failed" });
  }
});

// AI Resume Tips
router.post("/resume-tips", authMiddleware, async (req, res) => {
  try {
    const { skills, targetRole } = req.body;
    const prompt = `Give resume tips for someone with skills: ${skills.join(", ")} targeting a ${targetRole} role. Respond in this exact JSON format:
{
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "summary": "A sample professional summary for their resume in 2-3 sentences"
}
Only respond with JSON, no extra text.`;

    const text = await groqRequest(prompt);
    const clean = text.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(clean));
  } catch (err) {
    console.error("Resume tips error:", err.message);
    res.status(500).json({ message: "Resume tips failed" });
  }
});

// AI Custom Roadmap
router.post("/roadmap", authMiddleware, async (req, res) => {
  try {
    const { skills, targetRole } = req.body;
    const prompt = `You are a career coach. Generate a custom learning roadmap for someone targeting a ${targetRole} role with these existing skills: ${skills.join(", ")}.
Respond in this exact JSON format:
{
  "summary": "2 sentence personalized overview",
  "steps": ["step 1", "step 2", "step 3", "step 4", "step 5", "step 6"]
}
Only respond with JSON, no extra text.`;

    const text = await groqRequest(prompt);
    const clean = text.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(clean));
  } catch (err) {
    console.error("Roadmap error:", err.message);
    res.status(500).json({ message: "Roadmap generation failed" });
  }
});

module.exports = router;