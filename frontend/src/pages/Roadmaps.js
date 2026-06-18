import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const staticRoadmaps = {
    "Frontend Developer": {
        color: "#4facfe",
        description: "Build responsive, interactive web interfaces using modern frameworks.",
        steps: [
            { title: "HTML & CSS Fundamentals", desc: "Learn semantic HTML5, CSS3, flexbox, grid, and responsive design.", resources: ["MDN Web Docs", "freeCodeCamp"] },
            { title: "JavaScript Essentials", desc: "Master ES6+, DOM manipulation, events, and async programming.", resources: ["javascript.info", "Eloquent JavaScript"] },
            { title: "React.js", desc: "Learn components, hooks, state management, and React Router.", resources: ["React Docs", "Scrimba React Course"] },
            { title: "Version Control", desc: "Git, GitHub — branching, pull requests, collaboration workflows.", resources: ["Pro Git Book", "GitHub Docs"] },
            { title: "Build Tools & Deployment", desc: "Webpack, Vite, npm scripts, deploying to Vercel or Netlify.", resources: ["Vite Docs", "Netlify Docs"] },
            { title: "Testing", desc: "Unit testing with Jest, component testing with React Testing Library.", resources: ["Jest Docs", "Testing Library Docs"] },
        ],
    },
    "Backend Developer": {
        color: "#00f5d4",
        description: "Design and build scalable server-side systems and REST APIs.",
        steps: [
            { title: "Programming Fundamentals", desc: "Master Python or Node.js — functions, OOP, modules, error handling.", resources: ["Python Docs", "Node.js Docs"] },
            { title: "REST API Design", desc: "HTTP methods, status codes, RESTful principles, Express or Flask.", resources: ["REST API Tutorial", "Express Docs"] },
            { title: "Databases", desc: "SQL (PostgreSQL/MySQL) and NoSQL (MongoDB) — queries, indexing, schemas.", resources: ["PostgreSQL Tutorial", "MongoDB University"] },
            { title: "Authentication & Security", desc: "JWT, OAuth2, bcrypt, HTTPS, input validation, CORS.", resources: ["JWT.io", "OWASP Top 10"] },
            { title: "Caching & Performance", desc: "Redis, query optimization, pagination, rate limiting.", resources: ["Redis Docs", "Node.js Performance"] },
            { title: "Deployment & DevOps Basics", desc: "Docker basics, cloud deployment (AWS/GCP/Railway), CI/CD pipelines.", resources: ["Docker Docs", "Railway Docs"] },
        ],
    },
    "Machine Learning Engineer": {
        color: "#f72585",
        description: "Build and deploy intelligent systems using data and ML models.",
        steps: [
            { title: "Python for Data Science", desc: "NumPy, Pandas, Matplotlib — data manipulation and visualization.", resources: ["Kaggle Python Course", "Pandas Docs"] },
            { title: "Mathematics for ML", desc: "Linear algebra, calculus, probability, and statistics fundamentals.", resources: ["3Blue1Brown", "Khan Academy"] },
            { title: "Classical ML Algorithms", desc: "Regression, classification, clustering, decision trees with scikit-learn.", resources: ["Scikit-learn Docs", "Hands-On ML Book"] },
            { title: "Deep Learning", desc: "Neural networks, CNNs, RNNs using PyTorch or TensorFlow.", resources: ["fast.ai", "Deep Learning Book"] },
            { title: "Model Deployment", desc: "Flask/FastAPI APIs, Docker, serving models on cloud platforms.", resources: ["FastAPI Docs", "Hugging Face Spaces"] },
            { title: "MLOps & Experimentation", desc: "MLflow, experiment tracking, model versioning, monitoring in production.", resources: ["MLflow Docs", "Weights & Biases"] },
        ],
    },
    "Data Scientist": {
        color: "#f7c948",
        description: "Extract insights and build data-driven solutions from complex datasets.",
        steps: [
            { title: "Python & R Basics", desc: "Data types, control flow, functions, and libraries for data analysis.", resources: ["Kaggle Python", "R for Data Science"] },
            { title: "Data Wrangling", desc: "Cleaning, transforming, and merging datasets using Pandas.", resources: ["Pandas Docs", "Tidy Data Paper"] },
            { title: "Exploratory Data Analysis", desc: "Statistical summaries, visualizations with Matplotlib and Seaborn.", resources: ["Seaborn Docs", "Plotly Docs"] },
            { title: "Statistical Modeling", desc: "Hypothesis testing, regression analysis, A/B testing fundamentals.", resources: ["StatQuest YouTube", "Think Stats Book"] },
            { title: "Machine Learning", desc: "Supervised and unsupervised learning, model evaluation, feature engineering.", resources: ["Scikit-learn Docs", "Kaggle Competitions"] },
            { title: "Data Communication", desc: "Dashboards with Tableau/Power BI, storytelling with data, SQL reporting.", resources: ["Tableau Public", "Storytelling with Data Book"] },
        ],
    },
    "Full Stack Developer": {
        color: "#c084fc",
        description: "Build complete web applications from frontend to backend and database.",
        steps: [
            { title: "Frontend Foundations", desc: "HTML, CSS, JavaScript — the building blocks of the web.", resources: ["MDN Web Docs", "freeCodeCamp"] },
            { title: "React.js Frontend", desc: "Components, hooks, routing, state management with Context or Redux.", resources: ["React Docs", "Redux Toolkit Docs"] },
            { title: "Backend with Node.js", desc: "Express.js, REST APIs, middleware, error handling.", resources: ["Express Docs", "Node.js Docs"] },
            { title: "Databases", desc: "MongoDB with Mongoose or PostgreSQL with Prisma.", resources: ["MongoDB Docs", "Prisma Docs"] },
            { title: "Authentication", desc: "JWT auth, sessions, OAuth with GitHub/Google.", resources: ["Passport.js Docs", "Auth0 Docs"] },
            { title: "Deployment", desc: "Fullstack deployment on Railway, Render, or Vercel + backend hosting.", resources: ["Railway Docs", "Render Docs"] },
        ],
    },
    "DevOps Engineer": {
        color: "#34d399",
        description: "Automate, monitor, and scale infrastructure and software delivery pipelines.",
        steps: [
            { title: "Linux & Shell Scripting", desc: "Command line, bash scripting, file systems, process management.", resources: ["Linux Journey", "explainshell.com"] },
            { title: "Version Control & CI/CD", desc: "Git workflows, GitHub Actions, Jenkins, automated testing pipelines.", resources: ["GitHub Actions Docs", "Jenkins Docs"] },
            { title: "Containers with Docker", desc: "Docker images, containers, volumes, docker-compose for multi-service apps.", resources: ["Docker Docs", "Play with Docker"] },
            { title: "Kubernetes", desc: "Container orchestration, pods, deployments, services, scaling.", resources: ["Kubernetes Docs", "Kelsey Hightower Tutorial"] },
            { title: "Cloud Platforms", desc: "AWS/GCP/Azure fundamentals, compute, storage, networking basics.", resources: ["AWS Free Tier", "Google Cloud Skills Boost"] },
            { title: "Monitoring & Observability", desc: "Prometheus, Grafana, logging with ELK stack, alerting.", resources: ["Prometheus Docs", "Grafana Docs"] },
        ],
    },
    "Mobile Developer": {
        color: "#fb923c",
        description: "Build cross-platform mobile applications for iOS and Android.",
        steps: [
            { title: "Programming Fundamentals", desc: "JavaScript/Dart basics, OOP concepts, async programming.", resources: ["JavaScript.info", "Dart Docs"] },
            { title: "React Native or Flutter", desc: "Components, navigation, state management for mobile apps.", resources: ["React Native Docs", "Flutter Docs"] },
            { title: "Mobile UI/UX", desc: "Mobile design principles, gestures, animations, accessibility.", resources: ["Material Design", "Apple HIG"] },
            { title: "APIs & State Management", desc: "REST API integration, Redux/Provider, local storage.", resources: ["Expo Docs", "Provider Package"] },
            { title: "Device Features", desc: "Camera, GPS, push notifications, offline support.", resources: ["Expo SDK Docs", "Firebase Docs"] },
            { title: "Publishing", desc: "App Store and Play Store submission, app signing, versioning.", resources: ["Apple Developer Docs", "Google Play Console"] },
        ],
    },
    "UI/UX Designer": {
        color: "#f472b6",
        description: "Design intuitive, beautiful digital experiences that users love.",
        steps: [
            { title: "Design Principles", desc: "Typography, color theory, layout, visual hierarchy, Gestalt principles.", resources: ["Design for Hackers", "Refactoring UI"] },
            { title: "Figma Proficiency", desc: "Wireframing, prototyping, components, auto-layout, design systems.", resources: ["Figma Docs", "Figma YouTube Channel"] },
            { title: "User Research", desc: "User interviews, surveys, personas, empathy maps, journey mapping.", resources: ["Nielsen Norman Group", "UX Research Field Guide"] },
            { title: "Interaction Design", desc: "Microinteractions, transitions, animation principles for UX.", resources: ["Interaction Design Foundation", "Motion Design School"] },
            { title: "Usability Testing", desc: "Conducting tests, analyzing results, iterating based on feedback.", resources: ["Maze.co", "UserTesting Docs"] },
            { title: "Handoff & Collaboration", desc: "Developer handoff with Figma, design tokens, documentation.", resources: ["Zeplin Docs", "Storybook Docs"] },
        ],
    },
};

const careerMap = {
    React: "Frontend Developer", JavaScript: "Frontend Developer",
    CSS: "Frontend Developer", HTML: "Frontend Developer",
    TypeScript: "Frontend Developer",
    Node: "Backend Developer", Express: "Backend Developer",
    MongoDB: "Backend Developer", Django: "Backend Developer",
    Python: "Machine Learning Engineer", ML: "Machine Learning Engineer",
    PyTorch: "Machine Learning Engineer", TensorFlow: "Machine Learning Engineer",
    SQL: "Data Scientist", Pandas: "Data Scientist", NumPy: "Data Scientist",
    Java: "Backend Developer", Flutter: "Mobile Developer",
    Docker: "DevOps Engineer", Kubernetes: "DevOps Engineer",
    Figma: "UI/UX Designer",
};

function Roadmaps() {
    const { token } = useAuth();
    const [skills, setSkills] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [completedSteps, setCompletedSteps] = useState({});
    const [aiRoadmap, setAiRoadmap] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [view, setView] = useState("browse"); // browse | detail

    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get("http://localhost:5000/api/skills", { headers })
            .then(res => setSkills(res.data))
            .catch(() => { });
    }, []);

    // Match skills to roles
    const matchedRoles = [...new Set(
        skills.map(s => careerMap[s.name]).filter(Boolean)
    )];

    const allRoles = Object.keys(staticRoadmaps);
    const suggestedRoles = matchedRoles.length > 0 ? matchedRoles : allRoles.slice(0, 3);

    const toggleStep = (roleKey, stepIndex) => {
        const key = `${roleKey}-${stepIndex}`;
        setCompletedSteps(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const getProgress = (roleKey) => {
        const steps = staticRoadmaps[roleKey]?.steps || [];
        const done = steps.filter((_, i) => completedSteps[`${roleKey}-${i}`]).length;
        return { done, total: steps.length, pct: Math.round((done / steps.length) * 100) };
    };

    const getAIRoadmap = async (role) => {
        setAiLoading(true);
        setAiRoadmap(null);
        try {
            const res = await axios.post("http://localhost:5000/api/ai/roadmap",
                { skills: skills.map(s => s.name), targetRole: role }, { headers });
            setAiRoadmap(res.data);
        } catch {
            setAiRoadmap({ error: "AI roadmap unavailable. Using static roadmap below." });
        }
        setAiLoading(false);
    };

    const openRoadmap = (role) => {
        setSelectedRole(role);
        setView("detail");
        setAiRoadmap(null);
    };

    const roadmap = selectedRole ? staticRoadmaps[selectedRole] : null;
    const prog = selectedRole ? getProgress(selectedRole) : null;

    return (
        <section style={{ minHeight: "100vh", padding: "2rem 3rem", background: "linear-gradient(135deg,#0f0f0f,#1a1a40)" }}>
            <style>{`
        .roadmap-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 1.5rem;
          cursor: pointer;
          transition: border-color 0.2s, transform 0.2s;
        }
        .roadmap-card:hover {
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-3px);
        }
        .step-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.25rem;
          margin-bottom: 0.75rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          transition: border-color 0.2s;
          cursor: pointer;
        }
        .step-card:hover { border-color: rgba(255,255,255,0.15); }
        .step-card.done { border-color: rgba(0,245,212,0.2); background: rgba(0,245,212,0.03); }
        .step-check {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
          transition: all 0.2s;
          font-size: 0.75rem;
          font-weight: bold;
        }
        .step-check.done {
          background: rgba(0,245,212,0.15);
          border-color: #00f5d4;
          color: #00f5d4;
        }
        .resource-pill {
          display: inline-block;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          font-size: 0.75rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #888;
          margin: 0.25rem 0.25rem 0 0;
        }
        .role-tab {
          padding: 0.45rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: #666;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: "Open Sans", sans-serif;
        }
        .role-tab:hover { color: #aaa; border-color: rgba(255,255,255,0.2); }
        .role-tab.active { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.25); }
        .prog-bar { background: rgba(255,255,255,0.07); border-radius: 3px; height: 3px; overflow: hidden; }
        .prog-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
      `}</style>

            {/* Header */}
            <h2 style={{ textAlign: "center", fontSize: "2.5rem", background: "linear-gradient(90deg,#ff6ec7,#4facfe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.3rem" }}>
                Career Roadmaps
            </h2>
            <p style={{ textAlign: "center", color: "#aaa", marginBottom: "2rem" }}>
                Step-by-step learning paths tailored to your skills.
            </p>

            {/* Browse view */}
            {view === "browse" && (
                <div style={{ maxWidth: "960px", margin: "0 auto" }}>
                    {/* Suggested based on skills */}
                    {matchedRoles.length > 0 && (
                        <div style={{ marginBottom: "2rem" }}>
                            <p style={{ color: "#888", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
                                Suggested based on your skills
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: "1rem" }}>
                                {matchedRoles.map(role => {
                                    const rm = staticRoadmaps[role];
                                    if (!rm) return null;
                                    const p = getProgress(role);
                                    return (
                                        <div key={role} className="roadmap-card" onClick={() => openRoadmap(role)}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                                                <h3 style={{ color: "#f0f0f0", fontSize: "1rem", fontWeight: 600, fontFamily: "Montserrat, sans-serif" }}>{role}</h3>
                                                <span style={{ background: "rgba(0,245,212,0.1)", color: "#00f5d4", fontSize: "0.7rem", padding: "0.2rem 0.5rem", borderRadius: "5px", border: "1px solid rgba(0,245,212,0.2)" }}>Match</span>
                                            </div>
                                            <p style={{ color: "#666", fontSize: "0.83rem", lineHeight: 1.5, marginBottom: "1rem" }}>{rm.description}</p>
                                            <div className="prog-bar" style={{ marginBottom: "0.4rem" }}>
                                                <div className="prog-fill" style={{ width: `${p.pct}%`, background: rm.color }} />
                                            </div>
                                            <p style={{ color: "#555", fontSize: "0.75rem" }}>{p.done}/{p.total} steps complete</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* All roadmaps */}
                    <p style={{ color: "#888", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
                        All roadmaps
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: "1rem" }}>
                        {allRoles.map(role => {
                            const rm = staticRoadmaps[role];
                            const p = getProgress(role);
                            return (
                                <div key={role} className="roadmap-card" onClick={() => openRoadmap(role)}>
                                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: rm.color, marginBottom: "0.75rem" }} />
                                    <h3 style={{ color: "#f0f0f0", fontSize: "1rem", fontWeight: 600, fontFamily: "Montserrat, sans-serif", marginBottom: "0.5rem" }}>{role}</h3>
                                    <p style={{ color: "#666", fontSize: "0.83rem", lineHeight: 1.5, marginBottom: "1rem" }}>{rm.description}</p>
                                    <div className="prog-bar" style={{ marginBottom: "0.4rem" }}>
                                        <div className="prog-fill" style={{ width: `${p.pct}%`, background: rm.color }} />
                                    </div>
                                    <p style={{ color: "#555", fontSize: "0.75rem" }}>{p.done}/{p.total} steps complete</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Detail view */}
            {view === "detail" && roadmap && (
                <div style={{ maxWidth: "760px", margin: "0 auto" }}>
                    {/* Back + header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                        <button className="btn secondary" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }} onClick={() => setView("browse")}>
                            Back
                        </button>
                        <button className="btn" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }} onClick={() => getAIRoadmap(selectedRole)} disabled={aiLoading}>
                            {aiLoading ? "Generating..." : "Get AI Roadmap"}
                        </button>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: roadmap.color, flexShrink: 0 }} />
                        <h2 style={{ color: "#f0f0f0", fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 700 }}>{selectedRole}</h2>
                    </div>
                    <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1.5rem" }}>{roadmap.description}</p>

                    {/* Progress summary */}
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
                        <div style={{ flex: 1 }}>
                            <div className="prog-bar">
                                <div className="prog-fill" style={{ width: `${prog.pct}%`, background: roadmap.color }} />
                            </div>
                        </div>
                        <p style={{ color: "#aaa", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                            {prog.done} / {prog.total} complete — {prog.pct}%
                        </p>
                    </div>

                    {/* AI roadmap result */}
                    {aiRoadmap?.error && (
                        <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: "1rem" }}>{aiRoadmap.error}</p>
                    )}
                    {aiRoadmap && !aiRoadmap.error && (
                        <div style={{ background: "rgba(0,245,212,0.04)", border: "1px solid rgba(0,245,212,0.15)", borderRadius: "14px", padding: "1.25rem", marginBottom: "1.5rem" }}>
                            <p style={{ color: "#00f5d4", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>AI Custom Roadmap</p>
                            <p style={{ color: "#ccc", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1rem" }}>{aiRoadmap.summary}</p>
                            {aiRoadmap.steps?.map((step, i) => (
                                <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem" }}>
                                    <span style={{ color: "#555", fontSize: "0.8rem", fontFamily: "monospace", minWidth: "20px" }}>{i + 1}.</span>
                                    <p style={{ color: "#bbb", fontSize: "0.875rem", margin: 0 }}>{step}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Static steps */}
                    <p style={{ color: "#555", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
                        Learning path — click steps to mark complete
                    </p>
                    {roadmap.steps.map((step, i) => {
                        const key = `${selectedRole}-${i}`;
                        const done = !!completedSteps[key];
                        return (
                            <div key={i} className={`step-card${done ? " done" : ""}`} onClick={() => toggleStep(selectedRole, i)}>
                                <div className={`step-check${done ? " done" : ""}`}>{done ? "✓" : ""}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                                        <h4 style={{ color: done ? "#00f5d4" : "#e0e0e0", fontSize: "0.95rem", fontWeight: 600, fontFamily: "Montserrat, sans-serif" }}>
                                            {i + 1}. {step.title}
                                        </h4>
                                    </div>
                                    <p style={{ color: "#777", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "0.5rem" }}>{step.desc}</p>
                                    <div>
                                        {step.resources.map((r, j) => (
                                            <span key={j} className="resource-pill">{r}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default Roadmaps;