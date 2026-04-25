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
  Django: "Backend Developer", TypeScript: "Frontend Developer",
};

function Career() {
  const { token, user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [aiAdvice, setAiAdvice] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [resumeTips, setResumeTips] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [activeTab, setActiveTab] = useState("skills");

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

  const getAIAdvice = async () => {
    if (skills.length === 0) { setMsg("❌ Add at least one skill first!"); return; }
    setAiLoading(true);
    setActiveTab("ai");
    try {
      const res = await axios.post("http://localhost:5000/api/ai/career-advice",
        { skills: skills.map(s => s.name) }, { headers });
      setAiAdvice(res.data);
    } catch { setMsg("❌ AI advice failed"); }
    setAiLoading(false);
  };

  const getResumeTips = async () => {
    if (skills.length === 0 || !targetRole) { setMsg("❌ Add skills and target role!"); return; }
    setAiLoading(true);
    setActiveTab("resume");
    try {
      const res = await axios.post("http://localhost:5000/api/ai/resume-tips",
        { skills: skills.map(s => s.name), targetRole }, { headers });
      setResumeTips(res.data);
    } catch { setMsg("❌ Resume tips failed"); }
    setAiLoading(false);
  };

  const progress = Math.min((skills.length / 10) * 100, 100);

  const tabs = [
    { id: "skills", label: " My Skills" },
    { id: "ai", label: "🤖 AI Career Advice" },
    { id: "resume", label: "Resume Tips" },
  ];

  return (
    <section style={{ minHeight: "100vh", padding: "2rem 3rem", background: "linear-gradient(135deg,#0f0f0f,#1a1a40)" }}>
      <h2 style={{ textAlign: "center", fontSize: "2.5rem", background: "linear-gradient(90deg,#ff6ec7,#4facfe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.3rem" }}>
        🚀 Career Path Dashboard
      </h2>
      <p style={{ textAlign: "center", color: "#aaa", marginBottom: "2rem" }}>Welcome, {user?.name}! Let AI guide your career journey.</p>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ padding: "0.6rem 1.5rem", borderRadius: "25px", border: "none", cursor: "pointer", fontWeight: "600", transition: "0.3s", background: activeTab === tab.id ? "linear-gradient(90deg,#00f5d4,#00bbf9)" : "rgba(255,255,255,0.1)", color: activeTab === tab.id ? "#000" : "#fff" }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {activeTab === "skills" && (
          <div>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "20px", padding: "2rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <h3 style={{ color: "#00f5d4" }}>My Skills ({skills.length})</h3>
                <span style={{ color: "#aaa" }}>{Math.round(progress)}% complete</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "10px", height: "10px", marginBottom: "1.5rem" }}>
                <div style={{ background: "linear-gradient(90deg,#00f5d4,#f72585)", width: `${progress}%`, height: "100%", borderRadius: "10px", transition: "0.5s" }} />
              </div>

              {loading ? <p style={{ color: "#aaa" }}>Loading...</p> : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", marginBottom: "1.5rem", minHeight: "50px" }}>
                  {skills.length === 0 && <p style={{ color: "#aaa" }}>No skills yet. Add your first skill! 👇</p>}
                  {skills.map(skill => (
                    <div key={skill._id} style={{ background: "rgba(0,245,212,0.1)", border: "1px solid #00f5d4", borderRadius: "25px", padding: "0.4rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: "#fff" }}>{skill.name}</span>
                      <button onClick={() => deleteSkill(skill._id)} style={{ background: "none", border: "none", color: "#f72585", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>×</button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: "1rem" }}>
                <input value={newSkill} onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addSkill()}
                  placeholder="Add a skill (e.g. React, Python, SQL...)"
                  style={{ flex: 1, padding: "0.8rem 1rem", borderRadius: "25px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }} />
                <button className="btn" onClick={addSkill}>+ Add</button>
              </div>
              {msg && <p style={{ marginTop: "0.5rem", color: "#00f5d4" }}>{msg}</p>}
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button className="btn" onClick={getAIAdvice} style={{ flex: 1 }}>🤖 Get AI Career Advice</button>
              <div style={{ flex: 1, display: "flex", gap: "0.5rem" }}>
                <input value={targetRole} onChange={e => setTargetRole(e.target.value)}
                  placeholder="Target role (e.g. Frontend Dev)"
                  style={{ flex: 1, padding: "0.8rem", borderRadius: "25px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }} />
                <button className="btn secondary" onClick={getResumeTips}>📄 Resume Tips</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div>
            {aiLoading && (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤖</div>
                <p style={{ color: "#00f5d4", fontSize: "1.2rem" }}>AI is analyzing your skills...</p>
              </div>
            )}
            {aiAdvice && !aiLoading && (
              <div>
                <div style={{ background: "rgba(0,245,212,0.05)", borderRadius: "15px", padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid rgba(0,245,212,0.2)" }}>
                  <h4 style={{ color: "#00f5d4", marginBottom: "0.5rem" }}> AI Summary</h4>
                  <p style={{ color: "#ccc", lineHeight: "1.8" }}>{aiAdvice.summary}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {aiAdvice.topCareers?.map((career, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "20px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h3 style={{ color: "#fff" }}>#{i + 1} {career.title}</h3>
                        <span style={{ background: "linear-gradient(90deg,#00f5d4,#00bbf9)", color: "#000", padding: "0.3rem 1rem", borderRadius: "20px", fontWeight: "bold" }}>{career.match}% match</span>
                      </div>
                      <p style={{ color: "#aaa", marginBottom: "1rem" }}>{career.description}</p>
                      <p style={{ color: "#f7c948", marginBottom: "1rem" }}>💰 {career.avgSalary}</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={{ background: "rgba(247,37,133,0.1)", borderRadius: "10px", padding: "1rem" }}>
                          <h5 style={{ color: "#f72585", marginBottom: "0.5rem" }}>📚 Skills to Learn</h5>
                          {career.missingSkills?.map((s, j) => <p key={j} style={{ color: "#ccc", fontSize: "0.9rem", margin: "0.2rem 0" }}>• {s}</p>)}
                        </div>
                        <div style={{ background: "rgba(79,172,254,0.1)", borderRadius: "10px", padding: "1rem" }}>
                          <h5 style={{ color: "#4facfe", marginBottom: "0.5rem" }}>🗺️ Roadmap</h5>
                          {career.roadmap?.map((s, j) => <p key={j} style={{ color: "#ccc", fontSize: "0.9rem", margin: "0.2rem 0" }}>{j + 1}. {s}</p>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn" onClick={getAIAdvice} style={{ marginTop: "1.5rem", width: "100%" }}>🔄 Refresh AI Advice</button>
              </div>
            )}
            {!aiAdvice && !aiLoading && (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <p style={{ color: "#aaa" }}>Go to Skills tab and click "Get AI Career Advice"</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "resume" && (
          <div>
            {aiLoading && (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📄</div>
                <p style={{ color: "#00f5d4", fontSize: "1.2rem" }}>AI is crafting your resume tips...</p>
              </div>
            )}
            {resumeTips && !aiLoading && (
              <div>
                <div style={{ background: "rgba(0,245,212,0.05)", borderRadius: "15px", padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid rgba(0,245,212,0.2)" }}>
                  <h4 style={{ color: "#00f5d4", marginBottom: "0.5rem" }}>📝 Professional Summary</h4>
                  <p style={{ color: "#ccc", lineHeight: "1.8", fontStyle: "italic" }}>"{resumeTips.summary}"</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "15px", padding: "1.5rem" }}>
                    <h4 style={{ color: "#f7c948", marginBottom: "1rem" }}>💡 Resume Tips</h4>
                    {resumeTips.tips?.map((tip, i) => (
                      <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.8rem" }}>
                        <span style={{ color: "#00f5d4", fontWeight: "bold" }}>{i + 1}.</span>
                        <p style={{ color: "#ccc", fontSize: "0.9rem", margin: 0 }}>{tip}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "15px", padding: "1.5rem" }}>
                    <h4 style={{ color: "#4facfe", marginBottom: "1rem" }}> Keywords to Include</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {resumeTips.keywords?.map((kw, i) => (
                        <span key={i} style={{ background: "rgba(79,172,254,0.2)", border: "1px solid #4facfe", borderRadius: "15px", padding: "0.3rem 0.8rem", color: "#4facfe", fontSize: "0.9rem" }}>{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!resumeTips && !aiLoading && (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <p style={{ color: "#aaa" }}>Go to Skills tab, enter your target role and click "Resume Tips"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Career;