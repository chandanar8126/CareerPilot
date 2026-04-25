import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <header>
      <nav>
        <div className="logo">🚀 CareerPilot</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          {user ? (
            <>
              <li><Link to="/career">Career Paths</Link></li>
              <li><Link to="/interview">Interview Prep</Link></li>
              <li><Link to="/chat">🤖 AI Chat</Link></li>
              <li><button className="btn" style={{ padding: "0.4rem 1rem" }} onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;