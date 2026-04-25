import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const modules = [
  { id: 1, title: "Technical Round", icon: "💻", role: "software developer", questions: ["Explain the difference between REST and GraphQL.", "What is the event loop in JavaScript?", "How does React's virtual DOM work?", "What is Big O notation? Give examples.", "Explain promises and async/await."] },
  { id: 2, title: "HR Round", icon: "🤝", role: "professional", questions: ["Tell me about yourself.", "What are your greatest strengths and weaknesses?", "Where do you see yourself in 5 years?", "Why do you want to work here?", "Describe a challenge you overcame."] },
  { id: 3, title: "Group Discussion", icon: "👥", role: "communicator", questions: ["AI is replacing jobs — discuss.", "Remote work vs Office work — which is better?", "Social media: boon or bane?", "Should coding be taught in schools?", "Climate change — whose responsibility?"] },
  { id: 4, title: "Aptitude", icon: "🧠", role: "analyst", questions: ["If 2x + 3 = 11, what is x?", "A train travels 60km/hr. Distance in 2.5 hours?", "Find next: 2, 4, 8, 16, ?", "30% of 250 is?", "If A=2, B=4, C=6... what is Z?"] },
];

function Interview() {
  const { user, token } = useAuth();
  const [active, setActive] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState([]);
  const [done, setDone] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  const startModule = (mod) => {
    setActive(mod);
    setCurrent(0);
    setAnswer("");
    setFeedback(null);
    setScores([]);
    setDone(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/ai/interview-feedback", {
        question: active.questions[current],
        answer,
        role: active.role,
      }, { headers });
      setFeedback(res.data);
      setScores([...scores, res.data.score]);
    } catch {
      setFeedback({ score: 0, strengths: [], improvements: ["Could not get AI feedback"], betterAnswer: "", tips: "Please try again." });
    }
    setLoading(false);
  };

  const nextQuestion = () => {
    if (current < active.questions.length - 1) {
      setCurrent(current + 1);
      setAnswer("");
      setFeedback(null);
    } else {
      setDone(true);
    }
  };

  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const scoreColor = (s) => s >= 8 ? "#00f5d4" : s >= 5 ? "#f7c948" : "#f72585";

  return (
    <section style={{ minHeight: "100vh", padding: "2rem 3rem", background: "linear-gradient(135deg,#0f0f0f,#1a1a40)" }}>
      <h2 style={{ textAlign: "center", fontSize: "2.5rem", background: "linear-gradient(90deg,#ff6ec7,#4facfe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.5rem" }}>
        🎯 AI Interview Coach
      </h2>
      <p style={{ textAlign: "center", color: "#aaa", marginBottom: "2rem" }}>
        Welcome, {user?.name}! Practice with AI-powered real-time feedback.
      </p>

      {!active && !done && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "1.5rem", maxWidth: "1000px", margin: "0 auto" }}>
          {modules.map(mod => (
            <div key={mod.id} onClick={() => startModule(mod)} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "20px", padding: "2rem", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", transition: "0.3s" }}
              onMouseOver={e => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{mod.icon}</div>
              <h3 style={{ color: "#00f5d4", marginBottom: "0.5rem" }}>{mod.title}</h3>
              <p style={{ color: "#aaa", fontSize: "0.9rem" }}>{mod.questions.length} questions • AI feedback</p>
              <button className="btn" style={{ marginTop: "1rem", width: "100%" }}>Start →</button>
            </div>
          ))}
        </div>
      )}

      {active && !done && (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ color: "#00f5d4" }}>{active.icon} {active.title}</h3>
            <button onClick={() => setActive(null)} style={{ background: "none", border: "1px solid #aaa", color: "#aaa", padding: "0.3rem 0.8rem", borderRadius: "10px", cursor: "pointer" }}>← Back</button>
          </div>

          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "10px", height: "8px", marginBottom: "0.5rem" }}>
            <div style={{ background: "linear-gradient(90deg,#00f5d4,#f72585)", width: `${((current + 1) / active.questions.length) * 100}%`, height: "100%", borderRadius: "10px", transition: "0.5s" }} />
          </div>
          <p style={{ color: "#aaa", marginBottom: "1.5rem", fontSize: "0.9rem" }}>Question {current + 1} of {active.questions.length}</p>

          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "15px", padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid rgba(0,245,212,0.3)" }}>
            <h4 style={{ fontSize: "1.2rem", color: "#fff", lineHeight: "1.6" }}>{active.questions[current]}</h4>
          </div>

          {!feedback && (
            <>
              <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type your answer here... Be specific and use examples!" rows={5}
                style={{ width: "100%", padding: "1rem", borderRadius: "15px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "#fff", resize: "vertical", marginBottom: "1rem", fontSize: "1rem" }} />
              <button className="btn" onClick={submitAnswer} disabled={loading || !answer.trim()} style={{ width: "100%" }}>
                {loading ? "🤖 AI is analyzing your answer..." : "Submit for AI Feedback →"}
              </button>
            </>
          )}

          {feedback && (
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "15px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: `conic-gradient(${scoreColor(feedback.score)} ${feedback.score * 36}deg, rgba(255,255,255,0.1) 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "55px", height: "55px", borderRadius: "50%", background: "#1a1a40", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: scoreColor(feedback.score), fontWeight: "bold", fontSize: "1.2rem" }}>{feedback.score}/10</span>
                  </div>
                </div>
                <div>
                  <h4 style={{ color: "#fff", margin: 0 }}>AI Score</h4>
                  <p style={{ color: "#aaa", margin: 0, fontSize: "0.9rem" }}>{feedback.score >= 8 ? "Excellent! 🌟" : feedback.score >= 5 ? "Good effort! 👍" : "Keep practicing! 💪"}</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ background: "rgba(0,245,212,0.1)", borderRadius: "10px", padding: "1rem" }}>
                  <h5 style={{ color: "#00f5d4", marginBottom: "0.5rem" }}>✅ Strengths</h5>
                  {feedback.strengths?.map((s, i) => <p key={i} style={{ color: "#ccc", fontSize: "0.9rem", margin: "0.2rem 0" }}>• {s}</p>)}
                </div>
                <div style={{ background: "rgba(247,37,133,0.1)", borderRadius: "10px", padding: "1rem" }}>
                  <h5 style={{ color: "#f72585", marginBottom: "0.5rem" }}>📈 Improvements</h5>
                  {feedback.improvements?.map((s, i) => <p key={i} style={{ color: "#ccc", fontSize: "0.9rem", margin: "0.2rem 0" }}>• {s}</p>)}
                </div>
              </div>

              <div style={{ background: "rgba(79,172,254,0.1)", borderRadius: "10px", padding: "1rem", marginBottom: "1rem" }}>
                <h5 style={{ color: "#4facfe", marginBottom: "0.5rem" }}>💡 Better Answer</h5>
                <p style={{ color: "#ccc", fontSize: "0.9rem", lineHeight: "1.6" }}>{feedback.betterAnswer}</p>
              </div>

              <div style={{ background: "rgba(247,201,72,0.1)", borderRadius: "10px", padding: "1rem", marginBottom: "1.5rem" }}>
                <h5 style={{ color: "#f7c948", marginBottom: "0.5rem" }}>🎯 Pro Tip</h5>
                <p style={{ color: "#ccc", fontSize: "0.9rem" }}>{feedback.tips}</p>
              </div>

              <button className="btn" onClick={nextQuestion} style={{ width: "100%" }}>
                {current < active.questions.length - 1 ? "Next Question →" : "See Final Results 🏆"}
              </button>
            </div>
          )}
        </div>
      )}

      {done && (
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🏆</div>
          <h3 style={{ color: "#00f5d4", fontSize: "2rem", marginBottom: "1rem" }}>Session Complete!</h3>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "20px", padding: "2rem", marginBottom: "2rem" }}>
            <p style={{ color: "#aaa", marginBottom: "0.5rem" }}>Average Score</p>
            <p style={{ fontSize: "4rem", fontWeight: "bold", color: scoreColor(avgScore), margin: "0" }}>{avgScore}/10</p>
            <p style={{ color: "#aaa", marginTop: "0.5rem" }}>{avgScore >= 8 ? "Outstanding performance! You're interview-ready! 🌟" : avgScore >= 5 ? "Good job! Keep practicing to improve! 💪" : "Keep practicing — you'll get better! 🔥"}</p>
          </div>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button className="btn" onClick={() => startModule(active)}>Retry Module</button>
            <button className="btn secondary" onClick={() => { setActive(null); setDone(false); }}>Choose Another</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Interview;