import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth(); // include user
  const navigate = useNavigate();

  // REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    if (user) {
      navigate("/career");
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );
      login(res.data.user, res.data.token);
      navigate("/career");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        {error && (
          <p style={{ color: "#f72585", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div
          style={{
            margin: "1.5rem 0",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.2)" }} />
          <span style={{ color: "#aaa", fontSize: "0.9rem" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.2)" }} />
        </div>

        {/* GOOGLE LOGIN */}
        <a
          href="http://localhost:5000/auth/google"
          style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.8rem",
          padding: "0.8rem",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          textDecoration: "none",
          marginBottom: "1rem",
        }}
>
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="google"
          style={{ width: "20px", height: "20px" }}
        />
        Continue with Google
      </a>

        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

