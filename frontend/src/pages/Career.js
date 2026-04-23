import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const careerMap = {
  React: "Frontend Developer", JavaScript: "Frontend Developer",
  CSS: "Frontend Developer", HTML: "Frontend Developer",
  Node: "Backend Developer", Express: "Backend Developer",
  MongoDB: "Backend Developer", Python: "Data Scientist",
  ML: "Machine Learning Engineer", Java: "Backend Developer",
  SQL: "Database Administrator", Flutter: "Mobile Developer",
};

function Career() {
  const { token, user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get("http://localhost:5000/api/skills", { headers })
      .then(res => { setSkills(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const addSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      const res = await axios.post("http://localhost:5000/api/skills", { name: newSkill }, { headers });
      setSkills([...skills, res.data]);
      setNewSkill("");
      setMsg("✅ Skill added!");
      setTimeout(() => setMsg(""), 2000);
    } catch { setMsg("❌ Failed to add skill"); }
  };

  const deleteSkill = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/skills/${id}`, { headers });
      setSkills(skills.filter(s => s._id !== id));
    } catch { setMsg("❌ Failed to delete"); }
  };

  const getRecommendations = () => {
    const recs = new Set();
    skills.forEach(s => {
      const match = careerMap[s.name];
      if (match) recs.add(match);
    });
    return [...recs];
  };

  const progress = Math.min((skills.length / 10) * 100, 100);

  return (
    <section className="hero" style={{ alignItems: "stretch", padding: "2rem 3rem" }}>
      <h2>Career Path Dashboard</h2>
      <p>Welcome back, {user?.name}! Track your skills and discover your career path.</p>

      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "15px", padding: "1.5rem", marginTop: "2rem" }}>
        <h3 style={{ color: "#00f5d4", marginBottom: "1rem" }}>My Skills ({skills.length})</h3>

        <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "10px", height: "10px", marginBottom: "1rem" }}>
          <div style={{ background: "linear-gradient(90deg,#00f5d4,#f72585)", width: `${progress}%`, height: "100%", borderRadius: "10px", transition: "0.5s" }} />
        </div>
        <p style={{ color: "#aaa", marginBottom: "1rem" }}>{Math.round(progress)}% profile complete</p>

        {loading ? <p>Loading skills...</p> : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
            {skills.map(skill => (
              <div key={skill._id} style={{ background: "rgba(0,245,212,0.1)", border: "1px solid #00f5d4", borderRadius: "20px", padding: "0.3rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>{skill.name}</span>
                <button onClick={() => deleteSkill(skill._id)} style={{ background: "none", border: "none", color: "#f72585", cursor: "pointer", fontWeight: "bold" }}>×</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem" }}>
          <input
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addSkill()}
            placeholder="Add a skill (e.g. React, Python)"
            style={{ flex: 1, padding: "0.8rem", borderRadius: "10px", border: "none", background: "rgba(255,255,255,0.1)", color: "#fff" }}
          />
          <button className="btn" onClick={addSkill}>Add</button>
        </div>
        {msg && <p style={{ marginTop: "0.5rem", color: "#00f5d4" }}>{msg}</p>}
      </div>

      {getRecommendations().length > 0 && (
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "15px", padding: "1.5rem", marginTop: "2rem" }}>
          <h3 style={{ color: "#00f5d4", marginBottom: "1rem" }}>Recommended Careers</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {getRecommendations().map(rec => (
              <div key={rec} style={{ background: "rgba(0,187,249,0.1)", border: "1px solid #00bbf9", borderRadius: "10px", padding: "1rem 1.5rem" }}>
                <h4 style={{ color: "#00bbf9" }}>{rec}</h4>
                <p style={{ color: "#aaa", fontSize: "0.9rem" }}>Based on your skills</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Career;