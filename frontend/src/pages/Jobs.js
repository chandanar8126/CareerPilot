import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const categories = [
  "React Developer", "Python Developer", "Data Scientist",
  "Full Stack Developer", "Machine Learning Engineer", "DevOps Engineer",
  "Android Developer", "Backend Developer", "UI/UX Designer", "Cloud Engineer"
];

const locations = [
  { value: "india", label: "All India" },
  { value: "bangalore", label: "Bangalore" },
  { value: "mumbai", label: "Mumbai" },
  { value: "delhi", label: "Delhi" },
  { value: "hyderabad", label: "Hyderabad" },
  { value: "chennai", label: "Chennai" },
  { value: "pune", label: "Pune" },
];

function Jobs() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("india");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("recommended");
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recLoading, setRecLoading] = useState(true);
  const [searched, setSearched] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchRecommended(); }, []);

  const fetchRecommended = async () => {
    setRecLoading(true);
    try {
      const skillsRes = await axios.get("http://localhost:5000/api/skills", { headers });
      const skills = skillsRes.data.map(s => s.name).join(",");
      const res = await axios.get("http://localhost:5000/api/jobs/recommended", {
        headers, params: { skills: skills || "software developer" }
      });
      setRecommendedJobs(res.data.jobs || []);
    } catch (err) { console.error(err); }
    setRecLoading(false);
  };

  const searchJobs = async (p = 1, q = query, loc = location) => {
    if (!q.trim()) return;
    setLoading(true);
    setActiveTab("search");
    setSearched(true);
    try {
      const res = await axios.get("http://localhost:5000/api/jobs/search", {
        headers, params: { query: q, location: loc, page: p }
      });
      setJobs(res.data.jobs || []);
      setTotal(res.data.total || 0);
      setPage(p);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const quickSearch = (term) => { setQuery(term); searchJobs(1, term, location); };

  const timeAgo = (dateStr) => {
    if (!dateStr) return "Recently";
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return `${diff} days ago`;
  };

  const JobCard = ({ job }) => (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      borderRadius: "12px",
      padding: "1.8rem",
      border: "1px solid rgba(255,255,255,0.08)",
      transition: "all 0.25s ease",
      display: "flex",
      flexDirection: "column",
      gap: "1rem"
    }}
      onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(0,245,212,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ color: "#ffffff", fontSize: "1rem", fontWeight: "600", marginBottom: "0.3rem" }}>{job.title}</h3>
          <p style={{ color: "#00f5d4", fontSize: "0.88rem", fontWeight: "500" }}>{job.company}</p>
        </div>
        <span style={{ background: "rgba(0,245,212,0.08)", border: "1px solid rgba(0,245,212,0.2)", borderRadius: "6px", padding: "0.2rem 0.7rem", color: "#00f5d4", fontSize: "0.72rem", fontWeight: "600", letterSpacing: "0.03em", whiteSpace: "nowrap" }}>
          {job.category}
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
        <span style={{ color: "#888", fontSize: "0.83rem" }}>{job.location}</span>
        <span style={{ color: "#888", fontSize: "0.83rem" }}>{job.salary}</span>
        <span style={{ color: "#888", fontSize: "0.83rem" }}>Posted {timeAgo(job.posted)}</span>
      </div>

      <p style={{ color: "#666", fontSize: "0.84rem", lineHeight: "1.7", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.8rem" }}>{job.description}</p>

      <a href={job.applyLink} target="_blank" rel="noopener noreferrer"
        style={{ display: "inline-block", padding: "0.6rem 1.4rem", borderRadius: "6px", background: "linear-gradient(90deg,#00f5d4,#00bbf9)", color: "#000", fontWeight: "600", textDecoration: "none", fontSize: "0.88rem", alignSelf: "flex-start", letterSpacing: "0.02em" }}>
        Apply Now
      </a>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f0f0f,#1a1a40)" }}>

      {/* Header */}
      <div style={{ padding: "3rem 4rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "700", color: "#ffffff", marginBottom: "0.3rem", letterSpacing: "-0.02em" }}>
          Job Listings
        </h2>
        <p style={{ color: "#666", fontSize: "0.95rem" }}>
          {total > 0 ? `${total.toLocaleString()} positions available` : "Discover opportunities matched to your skills"}
        </p>

        {/* Search */}
        <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.5rem", maxWidth: "700px" }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && searchJobs()}
            placeholder="Search by role, skill, or keyword"
            style={{ flex: 1, padding: "0.8rem 1.2rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none", fontSize: "0.95rem" }}
          />
          <select value={location} onChange={e => setLocation(e.target.value)}
            style={{ padding: "0.8rem 1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none", cursor: "pointer", fontSize: "0.95rem" }}>
            {locations.map(l => <option key={l.value} value={l.value} style={{ background: "#1a1a40" }}>{l.label}</option>)}
          </select>
          <button onClick={() => searchJobs()}
            style={{ padding: "0.8rem 2rem", borderRadius: "8px", background: "linear-gradient(90deg,#00f5d4,#00bbf9)", color: "#000", border: "none", fontWeight: "600", cursor: "pointer", fontSize: "0.95rem", letterSpacing: "0.02em" }}>
            Search
          </button>
        </div>

        {/* Category Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => quickSearch(cat)}
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "#888", padding: "0.35rem 0.9rem", borderRadius: "20px", cursor: "pointer", fontSize: "0.8rem", transition: "all 0.2s", letterSpacing: "0.01em" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "#00f5d4"; e.currentTarget.style.color = "#00f5d4"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#888"; }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "2rem 4rem", maxWidth: "1200px" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {[
            { id: "recommended", label: "Recommended" },
            { id: "search", label: `Search Results${total > 0 ? ` (${total.toLocaleString()})` : ""}` }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding: "0.8rem 1.5rem", border: "none", background: "transparent", cursor: "pointer", fontSize: "0.9rem", fontWeight: "500", color: activeTab === tab.id ? "#00f5d4" : "#666", borderBottom: activeTab === tab.id ? "2px solid #00f5d4" : "2px solid transparent", transition: "all 0.2s", letterSpacing: "0.01em" }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Recommended */}
        {activeTab === "recommended" && (
          recLoading ? (
            <div style={{ padding: "4rem", textAlign: "center" }}>
              <p style={{ color: "#666", fontSize: "0.95rem" }}>Finding positions based on your profile...</p>
            </div>
          ) : recommendedJobs.length === 0 ? (
            <div style={{ padding: "4rem", textAlign: "center", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}>
              <p style={{ color: "#fff", fontWeight: "600", marginBottom: "0.5rem" }}>No recommendations yet</p>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>Add skills in your Career Dashboard to receive personalized job matches.</p>
            </div>
          ) : (
            <>
              <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "1.5rem" }}>{recommendedJobs.length} positions matched to your skills</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(420px,1fr))", gap: "1.2rem" }}>
                {recommendedJobs.map(job => <JobCard key={job.id} job={job} />)}
              </div>
            </>
          )
        )}

        {/* Search Results */}
        {activeTab === "search" && (
          loading ? (
            <div style={{ padding: "4rem", textAlign: "center" }}>
              <p style={{ color: "#666", fontSize: "0.95rem" }}>Searching positions...</p>
            </div>
          ) : !searched ? (
            <div style={{ padding: "4rem", textAlign: "center", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}>
              <p style={{ color: "#fff", fontWeight: "600", marginBottom: "0.5rem" }}>Search for opportunities</p>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>Enter a job title, skill, or keyword to find relevant positions.</p>
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ padding: "4rem", textAlign: "center" }}>
              <p style={{ color: "#666" }}>No results found for "{query}". Try a different search term.</p>
            </div>
          ) : (
            <>
              <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Showing {jobs.length} of {total.toLocaleString()} positions for "{query}"</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(420px,1fr))", gap: "1.2rem", marginBottom: "2rem" }}>
                {jobs.map(job => <JobCard key={job.id} job={job} />)}
              </div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                {page > 1 && (
                  <button onClick={() => searchJobs(page - 1)}
                    style={{ padding: "0.6rem 1.4rem", borderRadius: "6px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", cursor: "pointer", fontSize: "0.88rem" }}>
                    Previous
                  </button>
                )}
                <span style={{ color: "#666", fontSize: "0.88rem" }}>Page {page}</span>
                {jobs.length === 10 && (
                  <button onClick={() => searchJobs(page + 1)}
                    style={{ padding: "0.6rem 1.4rem", borderRadius: "6px", background: "linear-gradient(90deg,#00f5d4,#00bbf9)", border: "none", color: "#000", cursor: "pointer", fontSize: "0.88rem", fontWeight: "600" }}>
                    Next
                  </button>
                )}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}

export default Jobs;