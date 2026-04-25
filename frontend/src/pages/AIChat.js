import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AIChat() {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi " + (user?.name || "there") + "! I'm CareerPilot AI. Ask me anything about careers, interviews, skills, or job search!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const history = messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));
      const res = await axios.post("http://localhost:5000/api/ai/chat",
        { message: input, history }, { headers });
      setMessages(prev => [...prev, { role: "assistant", content: res.data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process that. Please try again!" }]);
    }
    setLoading(false);
  };

  const suggestions = ["How do I prepare for a technical interview?", "What skills should a frontend developer have?", "How to write a good resume?", "Tips for salary negotiation"];

  return (
    <section style={{ minHeight: "100vh", padding: "2rem", background: "linear-gradient(135deg,#0f0f0f,#1a1a40)", display: "flex", flexDirection: "column" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", background: "linear-gradient(90deg,#ff6ec7,#4facfe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.3rem" }}>
        🤖 CareerPilot AI Assistant
      </h2>
      <p style={{ textAlign: "center", color: "#aaa", marginBottom: "1.5rem" }}>Your personal AI career coach — available 24/7</p>

      <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto", background: "rgba(255,255,255,0.03)", borderRadius: "20px", padding: "1.5rem", marginBottom: "1rem", minHeight: "400px", maxHeight: "500px", border: "1px solid rgba(255,255,255,0.1)" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: "1rem" }}>
              <div style={{ maxWidth: "75%", padding: "1rem 1.2rem", borderRadius: msg.role === "user" ? "20px 20px 5px 20px" : "20px 20px 20px 5px", background: msg.role === "user" ? "linear-gradient(90deg,#00f5d4,#00bbf9)" : "rgba(255,255,255,0.08)", color: msg.role === "user" ? "#000" : "#fff", lineHeight: "1.6", fontSize: "0.95rem" }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "1rem" }}>
              <div style={{ padding: "1rem 1.5rem", borderRadius: "20px 20px 20px 5px", background: "rgba(255,255,255,0.08)", color: "#00f5d4" }}>
                🤖 Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => setInput(s)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", color: "#aaa", padding: "0.4rem 0.8rem", borderRadius: "15px", cursor: "pointer", fontSize: "0.8rem", transition: "0.3s" }}>
              {s}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !loading && sendMessage()}
            placeholder="Ask anything about careers, interviews, skills..."
            style={{ flex: 1, padding: "1rem 1.5rem", borderRadius: "25px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none", fontSize: "1rem" }} />
          <button className="btn" onClick={sendMessage} disabled={loading || !input.trim()}>Send →</button>
        </div>
      </div>
    </section>
  );
}

export default AIChat;