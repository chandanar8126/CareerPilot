import { useState } from "react";

function Home() {
  const [showMsg, setShowMsg] = useState(false);

  return (
    <section className="hero">
      <h2>Find Your Path. Ace Your Interviews.</h2>
      <p>
        An AI-powered platform to help you explore careers, build skills, and practice interviews — all in one place.
      </p>
      <div className="cta-buttons">
        <button className="btn" onClick={() => setShowMsg(!showMsg)}>
          {showMsg ? "Hide Message" : "Get Started"}
        </button>
      </div>
      {showMsg && <p>🚀 Welcome to CareerPilot!</p>}
    </section>
  );
}

export default Home;