import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <nav>
        <div className="logo">🚀 CareerPilot</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/career">Career Paths</Link></li>
          <li><Link to="/interview">Interview Prep</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;