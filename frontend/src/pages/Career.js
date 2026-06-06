import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

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
    axios
      .get("http://localhost:5000/api/skills", { headers })
      .then((res) => { setSkills(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const addSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      const res = await axios.post("http://localhost:5000/api/skills", { name: newSkill }, { headers });
      setSkills([...skills, res.data]);
      setNewSkill("");
      setMsg("Skill added.");
      setTimeout(() => setMsg(""), 2000);
    } catch { setMsg("Failed to add skill."); }
  };

  const deleteSkill = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/skills/${id}`, { headers });
      setSkills(skills.filter((s) => s._id !== id));
    } catch { setMsg("Failed to delete."); }
  };

  const getAIAdvice = async () => {
    if (skills.length === 0) { setMsg("Add at least one skill first."); return; }
    setAiLoading(true);
    setActiveTab("ai");
    try {
      const res = await axios.post("http://localhost:5000/api/ai/career-advice",
        { skills: skills.map((s) => s.name) }, { headers });
      setAiAdvice(res.data);
    } catch { setMsg("AI advice failed. Try again."); }
    setAiLoading(false);
  };

  const getResumeTips = async () => {
    if (skills.length === 0 || !targetRole) { setMsg("Add skills and a target role first."); return; }
    setAiLoading(true);
    setActiveTab("resume");
    try {
      const res = await axios.post("http://localhost:5000/api/ai/resume-tips",
        { skills: skills.map((s) => s.name), targetRole }, { headers });
      setResumeTips(res.data);
    } catch { setMsg("Resume tips failed. Try again."); }
    setAiLoading(false);
  };

  const progress = Math.min((skills.length / 10) * 100, 100);
  const tabs = [
    { id: "skills", label: "My Skills" },
    { id: "ai", label: "AI Career Advice" },
    { id: "resume", label: "Resume Tips" },
  ];

  return (
    <section style={{ minHeight: "100vh", padding: "3rem 2rem", background: "linear-gradient(135deg,#0f0f0f,#1a1a40)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .career-page * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

        .career-tab-btn {
          padding: 0.5rem 1.25rem;
          border-radius: 8px;
          border: 1px solid #ffffff15;
          background: transparent;
          color: #666;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
        }
        .career-tab-btn:hover { color: #aaa; border-color: #ffffff25; }
        .career-tab-btn.active {
          background: #ffffff12;
          color: #fff;
          border-color: #ffffff30;
        }

        .skill-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid #ffffff18;
          border-radius: 8px;
          padding: 0.35rem 0.75rem;
          color: #ccc;
          font-size: 0.875rem;
          transition: border-color 0.15s;
        }
        .skill-tag:hover { border-color: #ffffff30; }
        .skill-tag-delete {
          background: none;
          border: none;
          color: #555;
          cursor: pointer;
          font-size: 1rem;
          line-height: 1;
          padding: 0;
          transition: color 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .skill-tag-delete:hover { color: #ef4444; }

        .career-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: 1px solid #ffffff15;
          background: #ffffff06;
          color: #fff;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .career-input:focus { border-color: #ffffff30; }
        .career-input::placeholder { color: #444; }

        .btn-primary {
          background: #fff;
          color: #0a0a0f;
          border: none;
          border-radius: 10px;
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .btn-primary:hover { opacity: 0.88; }

        .btn-outline {
          background: transparent;
          color: #aaa;
          border: 1px solid #333;
          border-radius: 10px;
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .btn-outline:hover { border-color: #555; color: #fff; }

        .card {
          background: #ffffff05;
          border: 1px solid #ffffff10;
          border-radius: 14px;
          padding: 1.5rem;
        }

        .career-card {
          background: #ffffff05;
          border: 1px solid #ffffff10;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          transition: border-color 0.2s;
        }
        .career-card:hover { border-color: #ffffff20; }

        .match-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          font-family: 'DM Mono', monospace;
          background: #ffffff08;
          color: #aaa;
          border: 1px solid #ffffff15;
        }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 600px) { .two-col { grid-template-columns: 1fr; } }

        .section-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.75rem;
        }

        .keyword-pill {
          display: inline-block;
          padding: 0.3rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8rem;
          background: #ffffff08;
          border: 1px solid #ffffff15;
          color: #aaa;
        }

        .progress-bar {
          background: #ffffff08;
          border-radius: 3px;
          height: 3px;
          overflow: hidden;
          margin-bottom: 0.4rem;
        }
        .progress-fill {
          height: 100%;
          background: #fff;
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .mono { font-family: 'DM Mono', monospace; }
      `}</style>

      <div className="career-page">

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2.5rem", background: "linear-gradient(90deg,#ff6ec7,#4facfe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.3rem" }}>
            Career Path Dashboard
          </h2>
          <p style={{ color: "#aaa", marginBottom: "0.5rem" }}>
            Welcome, {user?.name}. Let AI guide your career journey.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`career-tab-btn${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: "860px", margin: "0 auto" }}>

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div>
              <div className="card" style={{ marginBottom: "1rem" }}>
                {/* Progress */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <p style={{ color: "#888", fontSize: "0.85rem", margin: 0 }}>
                    Skills added — {skills.length} of 10
                  </p>
                  <span className="mono" style={{ color: "#555", fontSize: "0.8rem" }}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>

                {/* Skills list */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", minHeight: "48px", margin: "1.25rem 0" }}>
                  {loading && <p style={{ color: "#555", fontSize: "0.875rem" }}>Loading...</p>}
                  {!loading && skills.length === 0 && (
                    <p style={{ color: "#444", fontSize: "0.875rem" }}>No skills yet. Add your first skill below.</p>
                  )}
                  {skills.map((skill) => (
                    <span key={skill._id} className="skill-tag">
                      {skill.name}
                      <button className="skill-tag-delete" onClick={() => deleteSkill(skill._id)}>×</button>
                    </span>
                  ))}
                </div>

                {/* Add skill */}
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <input
                    className="career-input"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    placeholder="Add a skill (e.g. React, Python, SQL)"
                  />
                  <button className="btn" onClick={addSkill}>Add</button>
                </div>
                {msg && (
                  <p style={{ color: "#888", fontSize: "0.8rem", marginTop: "0.5rem" }}>{msg}</p>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button className="btn" onClick={getAIAdvice} style={{ flex: 1 }}>
                  Get AI career advice
                </button>
                <input
                  className="career-input"
                  style={{ flex: 1, minWidth: "160px" }}
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Target role (e.g. Frontend Developer)"
                />
                <button className="btn secondary" onClick={getResumeTips}>
                  Resume tips
                </button>
              </div>
            </div>
          )}

          {/* AI Advice Tab */}
          {activeTab === "ai" && (
            <div>
              {aiLoading && (
                <div style={{ textAlign: "center", padding: "4rem 0" }}>
                  <p className="mono" style={{ color: "#555", fontSize: "0.85rem" }}>Analyzing your skills...</p>
                </div>
              )}

              {!aiAdvice && !aiLoading && (
                <div style={{ textAlign: "center", padding: "4rem 0" }}>
                  <p style={{ color: "#444", fontSize: "0.9rem" }}>
                    Go to My Skills and click "Get AI career advice"
                  </p>
                </div>
              )}

              {aiAdvice && !aiLoading && (
                <div>
                  {/* Summary */}
                  <div className="card" style={{ marginBottom: "1.5rem" }}>
                    <p className="section-label" style={{ color: "#888" }}>AI Summary</p>
                    <p style={{ color: "#ccc", lineHeight: "1.8", margin: 0, fontSize: "0.95rem" }}>
                      {aiAdvice.summary}
                    </p>
                  </div>

                  {/* Career cards */}
                  {aiAdvice.topCareers?.map((career, i) => (
                    <div key={i} className="career-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                        <div>
                          <p className="mono" style={{ color: "#555", fontSize: "0.75rem", margin: "0 0 0.3rem" }}>
                            #{i + 1}
                          </p>
                          <h3 style={{ color: "#f0f0f0", fontWeight: 600, fontSize: "1.1rem", margin: 0 }}>
                            {career.title}
                          </h3>
                        </div>
                        <span className="match-badge">{career.match}% match</span>
                      </div>

                      <p style={{ color: "#777", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "0.75rem" }}>
                        {career.description}
                      </p>

                      <p className="mono" style={{ color: "#aaa", fontSize: "0.8rem", marginBottom: "1.25rem" }}>
                        {career.avgSalary}
                      </p>

                      <div className="two-col">
                        <div style={{ background: "#ffffff04", border: "1px solid #ffffff08", borderRadius: "10px", padding: "1rem" }}>
                          <p className="section-label" style={{ color: "#888" }}>Skills to learn</p>
                          {career.missingSkills?.map((s, j) => (
                            <p key={j} style={{ color: "#777", fontSize: "0.85rem", margin: "0.25rem 0" }}>— {s}</p>
                          ))}
                        </div>
                        <div style={{ background: "#ffffff04", border: "1px solid #ffffff08", borderRadius: "10px", padding: "1rem" }}>
                          <p className="section-label" style={{ color: "#888" }}>Roadmap</p>
                          {career.roadmap?.map((s, j) => (
                            <p key={j} style={{ color: "#777", fontSize: "0.85rem", margin: "0.25rem 0" }}>
                              <span className="mono" style={{ color: "#555", marginRight: "0.4rem" }}>{j + 1}.</span>
                              {s}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button className="btn secondary" onClick={getAIAdvice} style={{ width: "100%", marginTop: "0.5rem" }}>
                    Refresh advice
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Resume Tips Tab */}
          {activeTab === "resume" && (
            <div>
              {aiLoading && (
                <div style={{ textAlign: "center", padding: "4rem 0" }}>
                  <p className="mono" style={{ color: "#555", fontSize: "0.85rem" }}>Generating resume tips...</p>
                </div>
              )}

              {!resumeTips && !aiLoading && (
                <div style={{ textAlign: "center", padding: "4rem 0" }}>
                  <p style={{ color: "#444", fontSize: "0.9rem" }}>
                    Go to My Skills, enter a target role and click "Resume tips"
                  </p>
                </div>
              )}

              {resumeTips && !aiLoading && (
                <div>
                  {/* Summary */}
                  <div className="card" style={{ marginBottom: "1.25rem" }}>
                    <p className="section-label" style={{ color: "#888" }}>Professional summary</p>
                    <p style={{ color: "#ccc", lineHeight: "1.8", fontStyle: "italic", margin: 0, fontSize: "0.95rem" }}>
                      "{resumeTips.summary}"
                    </p>
                  </div>

                  <div className="two-col" style={{ marginBottom: "1.25rem" }}>
                    {/* Tips */}
                    <div className="card">
                      <p className="section-label" style={{ color: "#888" }}>Resume tips</p>
                      {resumeTips.tips?.map((tip, i) => (
                        <div key={i} style={{ display: "flex", gap: "0.6rem", marginBottom: "0.75rem" }}>
                          <span className="mono" style={{ color: "#555", fontSize: "0.8rem", minWidth: "20px" }}>{i + 1}.</span>
                          <p style={{ color: "#ccc", fontSize: "0.875rem", margin: 0, lineHeight: 1.6 }}>{tip}</p>
                        </div>
                      ))}
                    </div>

                    {/* Keywords */}
                    <div className="card">
                      <p className="section-label" style={{ color: "#888" }}>Keywords to include</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {resumeTips.keywords?.map((kw, i) => (
                          <span key={i} className="keyword-pill">{kw}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Career;