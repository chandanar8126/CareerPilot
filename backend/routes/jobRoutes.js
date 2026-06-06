const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;

router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { query = "software developer", location = "india", page = 1 } = req.query;
    const response = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/in/search/${page}`, {
      params: {
        app_id: APP_ID,
        app_key: APP_KEY,
        what: query,
        where: location,
        results_per_page: 10,

      }
    }
    );
    const jobs = response.data.results.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name || "Company not listed",
      location: job.location?.display_name || location,
      salary: job.salary_min ? `₹${Math.round(job.salary_min).toLocaleString()} - ₹${Math.round(job.salary_max).toLocaleString()}` : "Salary not disclosed",
      description: job.description?.substring(0, 200) + "...",
      applyLink: job.redirect_url,
      posted: job.created,
      category: job.category?.label || "Technology",
    }));
    res.json({ jobs, total: response.data.count });
  } catch (err) {
    console.error("Adzuna error:", err.response?.data || err.message);
    res.status(500).json({ message: "Job search failed: " + err.message });
  }
});

router.get("/recommended", authMiddleware, async (req, res) => {
  try {
    const { skills } = req.query;
    const skillList = skills ? skills.split(",") : ["software developer"];
    const query = skillList.slice(0, 3).join(" ");
    const response = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/in/search/1`, {
      params: {
        app_id: APP_ID,
        app_key: APP_KEY,
        what: query,
        where: "india",
        results_per_page: 6,

      }
    }
    );
    const jobs = response.data.results.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name || "Company not listed",
      location: job.location?.display_name || "India",
      salary: job.salary_min ? `₹${Math.round(job.salary_min).toLocaleString()} - ₹${Math.round(job.salary_max).toLocaleString()}` : "Salary not disclosed",
      description: job.description?.substring(0, 150) + "...",
      applyLink: job.redirect_url,
      posted: job.created,
      category: job.category?.label || "Technology",
    }));
    res.json({ jobs, total: response.data.count });
  } catch (err) {
    res.status(500).json({ message: "Recommended jobs failed" });
  }
});

module.exports = router;