import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <>
      <section className="hero">
        <h2>Find Your Path. Ace Your Interviews.</h2>
        <p>An AI-powered platform to help you explore careers, build skills, and practice interviews — all in one place.</p>
        <div className="cta-buttons">
          <Link to={user ? "/career" : "/signup"} className="btn">Explore Career Paths</Link>
          <Link to={user ? "/interview" : "/signup"} className="btn secondary">Start Interview Prep</Link>
        </div>
      </section>
      <section className="features">
        <h3>Why Choose CareerPilot?</h3>
        <div className="feature-grid">
          <div className="feature">
            <h4>🚀 Career Guidance</h4>
            <p>Get AI-driven recommendations tailored to your skills and interests.</p>
          </div>
          <div className="feature">
            <h4>📚 Skill Building</h4>
            <p>Track your skills and get curated resources to improve them.</p>
          </div>
          <div className="feature">
            <h4>🎯 Interview Prep</h4>
            <p>Practice with mock interviews, MCQs, and get instant feedback.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;