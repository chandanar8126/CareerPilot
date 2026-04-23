import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const modules = [
  { id: 1, title: "Technical Round", icon: "💻", desc: "Practice DSA, coding, and problem-solving questions.", questions: ["What is a closure in JavaScript?", "Explain Big O notation.", "What is the difference between == and ===?"] },
  { id: 2, title: "HR Round", icon: "🤝", desc: "Prepare for behavioral and situation-based questions.", questions: ["Tell me about yourself.", "What are your strengths and weaknesses?", "Where do you see yourself in 5 years?"] },
  { id: 3, title: "Group Discussion", icon: "👥", desc: "Boost your communication and presentation skills.", questions: ["AI is replacing jobs — discuss.", "Remote work vs Office work.", "Social media: boon or bane?"] },
  { id: 4, title: "Aptitude", icon: "🧠", desc: "Sharpen logical reasoning and numerical ability.", questions: ["If 2x + 3 = 11, what is x?", "Find the next number: 2, 4, 8, 16, ?", "A train travels 60 km in 1 hour. How far in 2.5 hours?"] },
];

function Interview() {
  const { user } = useAuth();
  const [active, setActive] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const startModule = (mod) => { setActive(mod); setCurrent(0); setAnswer(""); setFeedback(""); };

  const submitAnswer = () => {
    if (!answer.trim()) return;
    setFeedback("✅ Good attempt! Keep practicing to improve your answers. Try to be more specific and use examples.");
  };

  const nextQuestion = () => {
    if (current < active.questions.length - 1) {
      setCurrent(current + 1);
      setAnswer("");
      setFeedback("");
    } else {
      setFeedback("🎉 Module complete! Great job!");
    }
  };

  return (
    <section className="hero" style={{ alignItems: "stretch", padding: "2rem 3rem" }}>
      <h2>Interview Prep Dashboard</h2>
      <p>Welcome, {user?.name}! Choose a module and start practicing.</p>

      {!active ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))", gap: "1.5rem", marginTop: "2rem" }}>
          {modules.map(mod => (
            <div key={mod.id} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "15px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.1)" }}>
              <h3 style={{ color: "#00f5d4" }}>{mod.icon} {mod.title}</h3>
              <p style={{ color: "#aaa", margin: "0.8rem 0" }}>{mod.desc}</p>
              <button className="btn" onClick={() => startModule(mod)}>Start</button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "15px", padding: "2rem", marginTop: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ color: "#00f5d4" }}>{active.icon} {active.title}</h3>
            <button onClick={() => setActive(null)} style={{ background: "none", border: "1px solid #aaa", color: "#aaa", padding: "0.3rem 0.8rem", borderRadius: "10px", cursor: "pointer" }}>← Back</button>
          </div>

          <p style={{ color: "#aaa", marginBottom: "0.5rem" }}>Question {current + 1} of {active.questions.length}</p>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "10px", height: "6px", marginBottom: "1.5rem" }}>
            <div style={{ background: "linear-gradient(90deg,#00f5d4,#f72585)", width: `${((current + 1) / active.questions.length) * 100}%`, height: "100%", borderRadius: "10px" }} />
          </div>

          <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>{active.questions[current]}</h4>

          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            rows={4}
            style={{ width: "100%", padding: "1rem", borderRadius: "10px", border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", resize: "vertical", marginBottom: "1rem" }}
          />

          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="btn" onClick={submitAnswer}>Submit Answer</button>
            {feedback && <button className="btn secondary" onClick={nextQuestion}>Next →</button>}
          </div>

          {feedback && (
            <div style={{ marginTop: "1rem", padding: "1rem", background: "rgba(0,245,212,0.1)", borderRadius: "10px", border: "1px solid #00f5d4", color: "#00f5d4" }}>
              {feedback}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Interview;