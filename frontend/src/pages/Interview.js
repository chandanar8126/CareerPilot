import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const modules = [
  {
    id: 1,
    title: "Technical Round",
    tag: "Engineering",
    role: "software developer",
    questions: [
      "Explain the difference between REST and GraphQL.",
      "What is the event loop in JavaScript?",
      "How does React's virtual DOM work?",
      "What is Big O notation? Give examples.",
      "Explain promises and async/await.",
    ],
  },
  {
    id: 2,
    title: "HR Round",
    tag: "Behavioral",
    role: "professional",
    questions: [
      "Tell me about yourself.",
      "What are your greatest strengths and weaknesses?",
      "Where do you see yourself in 5 years?",
      "Why do you want to work here?",
      "Describe a challenge you overcame.",
    ],
  },
  {
    id: 3,
    title: "Group Discussion",
    tag: "Communication",
    role: "communicator",
    questions: [
      "AI is replacing jobs — discuss.",
      "Remote work vs Office work — which is better?",
      "Social media: boon or bane?",
      "Should coding be taught in schools?",
      "Climate change — whose responsibility?",
    ],
  },
  {
    id: 4,
    title: "Aptitude",
    tag: "Analytical",
    role: "analyst",
    questions: [
      "If 2x + 3 = 11, what is x?",
      "A train travels 60km/hr. Distance in 2.5 hours?",
      "Find next: 2, 4, 8, 16, ?",
      "30% of 250 is?",
      "If A=2, B=4, C=6... what is Z?",
    ],
  },
];

const scoreColor = (s) =>
  s >= 8 ? "#10b981" : s >= 5 ? "#f59e0b" : "#ef4444";

const scoreLabel = (s) =>
  s >= 8 ? "Excellent" : s >= 5 ? "Good" : "Needs Work";

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
      const res = await axios.post(
        "http://localhost:5000/api/ai/interview-feedback",
        { question: active.questions[current], answer, role: active.role },
        { headers }
      );
      setFeedback(res.data);
      setScores([...scores, res.data.score]);
    } catch {
      setFeedback({
        score: 0,
        strengths: [],
        improvements: ["Could not get AI feedback"],
        betterAnswer: "",
        tips: "Please try again.",
      });
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

  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  return (
    <section style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .interview-page * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

        .module-card {
          background: #ffffff08;
          border: 1px solid #ffffff12;
          border-radius: 16px;
          padding: 2rem;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
        }
        .module-card:hover {
          background: #ffffff10;
          border-color: #ffffff30;
          transform: translateY(-3px);
        }

        .tag {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .btn-primary {
          background: #fff;
          color: #0a0a0f;
          border: none;
          border-radius: 10px;
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          transition: opacity 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-primary:hover { opacity: 0.88; }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

        .btn-secondary {
          background: transparent;
          color: #aaa;
          border: 1px solid #333;
          border-radius: 10px;
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-secondary:hover { border-color: #666; color: #fff; }

        .feedback-section {
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1rem;
        }

        .answer-box {
          width: 100%;
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid #ffffff18;
          background: #ffffff06;
          color: #fff;
          resize: vertical;
          font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          line-height: 1.6;
          margin-bottom: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .answer-box:focus { border-color: #ffffff40; }

        .progress-bar {
          background: #ffffff10;
          border-radius: 4px;
          height: 3px;
          margin-bottom: 0.5rem;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: #fff;
          border-radius: 4px;
          transition: width 0.4s ease;
        }

        .score-ring {
          position: relative;
          width: 80px;
          height: 80px;
          flex-shrink: 0;
        }
        .score-ring svg { transform: rotate(-90deg); }
        .score-number {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Mono', monospace;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        @media (max-width: 600px) { .grid-2 { grid-template-columns: 1fr; } }

        .mono { font-family: 'DM Mono', monospace; }
      `}</style>

      <div className="interview-page">
        {/* Header */}
        <div style={styles.header}>
          <h2 style={{ fontSize: "2.5rem", background: "linear-gradient(90deg,#ff6ec7,#4facfe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.5rem" }}>
            AI Interview Coach
          </h2>
          <p style={{ color: "#aaa", marginBottom: "2rem" }}>
            Practice with AI-powered real-time feedback on every response.
          </p>
        </div>

        {/* Module selection */}
        {!active && !done && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", maxWidth: "960px", margin: "0 auto" }}>
            {modules.map((mod, i) => {
              const tagColors = [
                { bg: "#1d3461", color: "#60a5fa" },
                { bg: "#1a2e1a", color: "#4ade80" },
                { bg: "#2e1a2e", color: "#c084fc" },
                { bg: "#2e2010", color: "#fbbf24" },
              ];
              const tc = tagColors[i % tagColors.length];
              return (
                <div key={mod.id} className="module-card" onClick={() => startModule(mod)}>
                  <span className="tag" style={{ background: tc.bg, color: tc.color }}>
                    {mod.tag}
                  </span>
                  <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                    {mod.title}
                  </h3>
                  <p style={{ color: "#888", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                    {mod.questions.length} questions · AI feedback
                  </p>
                  <button className="btn">Begin session</button>
                </div>
              );
            })}
          </div>
        )}

        {/* Active session */}
        {active && !done && (
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            {/* Top bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div>
                <p style={{ color: "#888", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>{active.title}</p>
                <p style={{ color: "#555", fontSize: "0.8rem", margin: "0.25rem 0 0" }} className="mono">
                  {current + 1} / {active.questions.length}
                </p>
              </div>
              <button className="btn-secondary" onClick={() => setActive(null)}>← Back</button>
            </div>

            {/* Progress */}
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((current + 1) / active.questions.length) * 100}%` }} />
            </div>
            <p style={{ color: "#555", fontSize: "0.78rem", marginBottom: "1.5rem" }} className="mono">
              {Math.round(((current + 1) / active.questions.length) * 100)}% complete
            </p>

            {/* Question */}
            <div style={{ background: "#ffffff06", border: "1px solid #ffffff12", borderRadius: "14px", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <p style={{ color: "#888", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>Question</p>
              <p style={{ color: "#f0f0f0", fontSize: "1.1rem", lineHeight: "1.7", margin: 0, fontWeight: 400 }}>
                {active.questions[current]}
              </p>
            </div>

            {/* Answer input */}
            {!feedback && (
              <>
                <textarea
                  className="answer-box"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Write your answer here. Be specific and use examples where possible."
                  rows={6}
                />
                <button className="btn" onClick={submitAnswer} disabled={loading || !answer.trim()}>
                  {loading ? "Analyzing your response..." : "Submit for feedback"}
                </button>
              </>
            )}

            {/* Feedback */}
            {feedback && (
              <div>
                {/* Score */}
                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", background: "#ffffff05", border: "1px solid #ffffff10", borderRadius: "14px", padding: "1.25rem", marginBottom: "1rem" }}>
                  <div className="score-ring">
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#ffffff10" strokeWidth="5" />
                      <circle
                        cx="40" cy="40" r="34" fill="none"
                        stroke={scoreColor(feedback.score)}
                        strokeWidth="5"
                        strokeDasharray={`${(feedback.score / 10) * 213.6} 213.6`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="score-number" style={{ color: scoreColor(feedback.score) }}>
                      {feedback.score}/10
                    </div>
                  </div>
                  <div>
                    <p style={{ color: "#fff", fontWeight: 600, fontSize: "1rem", margin: 0 }}>
                      {scoreLabel(feedback.score)}
                    </p>
                    <p style={{ color: "#666", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>
                      AI assessment complete
                    </p>
                  </div>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid-2">
                  <div className="feedback-section" style={{ background: "#0d2218", border: "1px solid #10b98120" }}>
                    <p style={{ color: "#10b981", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Strengths</p>
                    {feedback.strengths?.map((s, i) => (
                      <p key={i} style={{ color: "#ccc", fontSize: "0.875rem", margin: "0.3rem 0", lineHeight: 1.5 }}>— {s}</p>
                    ))}
                  </div>
                  <div className="feedback-section" style={{ background: "#1f1208", border: "1px solid #f59e0b20" }}>
                    <p style={{ color: "#f59e0b", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>To improve</p>
                    {feedback.improvements?.map((s, i) => (
                      <p key={i} style={{ color: "#ccc", fontSize: "0.875rem", margin: "0.3rem 0", lineHeight: 1.5 }}>— {s}</p>
                    ))}
                  </div>
                </div>

                {/* Better answer */}
                <div className="feedback-section" style={{ background: "#0f1825", border: "1px solid #60a5fa20", marginBottom: "1rem" }}>
                  <p style={{ color: "#60a5fa", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Sample answer</p>
                  <p style={{ color: "#ccc", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{feedback.betterAnswer}</p>
                </div>

                {/* Tip */}
                <div className="feedback-section" style={{ background: "#1a1108", border: "1px solid #fbbf2420", marginBottom: "1.5rem" }}>
                  <p style={{ color: "#fbbf24", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Key insight</p>
                  <p style={{ color: "#ccc", fontSize: "0.9rem", margin: 0, lineHeight: 1.6 }}>{feedback.tips}</p>
                </div>

                <button className="btn" onClick={nextQuestion}>
                  {current < active.questions.length - 1 ? "Next question" : "View results"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {done && (
          <div style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ color: "#888", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>Session complete</p>
            <div style={{ background: "#ffffff05", border: "1px solid #ffffff10", borderRadius: "20px", padding: "2.5rem", marginBottom: "2rem" }}>
              <p style={{ color: "#888", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Average score</p>
              <p className="mono" style={{ fontSize: "4rem", fontWeight: 500, color: scoreColor(avgScore), margin: "0 0 0.5rem" }}>
                {avgScore}<span style={{ fontSize: "1.5rem", color: "#444" }}>/10</span>
              </p>
              <p style={{ color: "#666", fontSize: "0.9rem", margin: 0 }}>
                {avgScore >= 8
                  ? "Outstanding. You are interview-ready."
                  : avgScore >= 5
                    ? "Solid effort. Keep refining your answers."
                    : "Keep practising — consistent effort pays off."}
              </p>
            </div>

            {/* Per-question scores */}
            <div style={{ background: "#ffffff05", border: "1px solid #ffffff08", borderRadius: "14px", padding: "1.25rem", marginBottom: "2rem", textAlign: "left" }}>
              <p style={{ color: "#888", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>Score breakdown</p>
              {scores.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
                  <span className="mono" style={{ color: "#555", fontSize: "0.8rem", minWidth: "24px" }}>Q{i + 1}</span>
                  <div style={{ flex: 1, height: "4px", background: "#ffffff08", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s * 10}%`, background: scoreColor(s), borderRadius: "2px", transition: "width 0.5s ease" }} />
                  </div>
                  <span className="mono" style={{ color: scoreColor(s), fontSize: "0.85rem", minWidth: "32px", textAlign: "right" }}>{s}/10</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn" onClick={() => startModule(active)}>Retry module</button>
              <button className="btn-secondary" onClick={() => { setActive(null); setDone(false); }}>All modules</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "3rem 2rem",
    background: "#0a0a0f",
  },
  header: {
    textAlign: "center",
    marginBottom: "3rem",
  },
  eyebrow: {
    color: "#555",
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    marginBottom: "0.75rem",
    fontFamily: "'DM Mono', monospace",
  },
  title: {
    color: "#f0f0f0",
    fontSize: "2.4rem",
    fontWeight: 600,
    marginBottom: "0.75rem",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    color: "#666",
    fontSize: "1rem",
    maxWidth: "480px",
    margin: "0 auto",
    lineHeight: 1.6,
  },
};

export default Interview;