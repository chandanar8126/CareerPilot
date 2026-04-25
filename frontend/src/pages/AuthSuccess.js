import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthSuccess() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userStr = params.get("user");

    if (token && userStr) {
      const user = JSON.parse(decodeURIComponent(userStr));
      login(user, token);

      // small delay ensures context updates properly
      setTimeout(() => {
        navigate("/career");
      }, 100);
    } else {
      navigate("/login");
    }
  }, [login, navigate]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg,#0f0f0f,#1a1a40)"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀</div>
        <p style={{ color: "#00f5d4", fontSize: "1.2rem" }}>
          Logging you in...
        </p>
      </div>
    </div>
  );
}

export default AuthSuccess;
