import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Profile() {
    const { token, user: authUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ bio: "", targetRole: "", linkedIn: "", github: "", avatar: "" });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState("");

    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [profileRes, progressRes] = await Promise.all([
                axios.get("http://localhost:5000/api/profile", { headers }),
                axios.get("http://localhost:5000/api/profile/progress", { headers }),
            ]);
            setProfile(profileRes.data);
            setProgress(progressRes.data);
            setForm({
                bio: profileRes.data.bio || "",
                targetRole: profileRes.data.targetRole || "",
                linkedIn: profileRes.data.linkedIn || "",
                github: profileRes.data.github || "",
                avatar: profileRes.data.avatar || "",
            });
        } catch {
            setMsg("Failed to load profile.");
        }
    };

    const saveProfile = async () => {
        setSaving(true);
        try {
            await axios.put("http://localhost:5000/api/profile", form, { headers });
            setMsg("Profile updated.");
            setEditing(false);
            fetchAll();
            setTimeout(() => setMsg(""), 3000);
        } catch {
            setMsg("Failed to save.");
        }
        setSaving(false);
    };

    const circumference = 2 * Math.PI * 36;
    const strokeDash = progress
        ? ((progress.percentage / 100) * circumference).toFixed(1)
        : 0;

    return (
        <section style={{ minHeight: "100vh", padding: "2rem 3rem", background: "linear-gradient(135deg,#0f0f0f,#1a1a40)" }}>
            <style>{`
        .profile-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 1.75rem;
          margin-bottom: 1.25rem;
        }
        .profile-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.06);
          color: #fff;
          font-size: 0.9rem;
          outline: none;
          font-family: "Open Sans", sans-serif;
          transition: border-color 0.2s;
          margin-bottom: 0.75rem;
        }
        .profile-input:focus { border-color: rgba(255,255,255,0.35); }
        .profile-input::placeholder { color: #555; }
        .check-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .check-row:last-child { border-bottom: none; }
        .check-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: bold;
          flex-shrink: 0;
        }
        .check-dot.done { background: rgba(0,245,212,0.15); color: #00f5d4; border: 1px solid #00f5d420; }
        .check-dot.pending { background: rgba(255,255,255,0.05); color: #555; border: 1px solid rgba(255,255,255,0.1); }
        .section-title {
          font-family: "Montserrat", sans-serif;
          color: #00f5d4;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .label { color: #888; font-size: 0.8rem; margin-bottom: 0.3rem; }
        .value { color: #ccc; font-size: 0.95rem; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        @media (max-width: 700px) { .two-col { grid-template-columns: 1fr; } }
      `}</style>

            {/* Header */}
            <h2 style={{ textAlign: "center", fontSize: "2.5rem", background: "linear-gradient(90deg,#ff6ec7,#4facfe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.3rem" }}>
                My Profile
            </h2>
            <p style={{ textAlign: "center", color: "#aaa", marginBottom: "2rem" }}>
                Complete your profile to unlock the full CareerPilot experience.
            </p>

            {msg && <p style={{ textAlign: "center", color: "#00f5d4", marginBottom: "1rem", fontSize: "0.9rem" }}>{msg}</p>}

            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                <div className="two-col">

                    {/* Left — Profile info */}
                    <div>
                        {/* Avatar + name */}
                        <div className="profile-card" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg,#00f5d4,#f72585)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                                {profile?.avatar
                                    ? <img src={profile.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    : <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>{authUser?.name?.[0]?.toUpperCase()}</span>
                                }
                            </div>
                            <div>
                                <h3 style={{ color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 600, marginBottom: "0.2rem" }}>{profile?.name}</h3>
                                <p style={{ color: "#888", fontSize: "0.875rem" }}>{profile?.email}</p>
                                {profile?.targetRole && <p style={{ color: "#00f5d4", fontSize: "0.8rem", marginTop: "0.2rem" }}>{profile.targetRole}</p>}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="profile-card">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                <p className="section-title" style={{ margin: 0 }}>Profile details</p>
                                <button className="btn" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }} onClick={() => setEditing(!editing)}>
                                    {editing ? "Cancel" : "Edit"}
                                </button>
                            </div>

                            {editing ? (
                                <div>
                                    <p className="label">Bio / Headline</p>
                                    <input className="profile-input" placeholder="e.g. Aspiring ML Engineer | CSE @ GCU" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
                                    <p className="label">Target role</p>
                                    <input className="profile-input" placeholder="e.g. Frontend Developer" value={form.targetRole} onChange={e => setForm({ ...form, targetRole: e.target.value })} />
                                    <p className="label">LinkedIn URL</p>
                                    <input className="profile-input" placeholder="https://linkedin.com/in/..." value={form.linkedIn} onChange={e => setForm({ ...form, linkedIn: e.target.value })} />
                                    <p className="label">GitHub URL</p>
                                    <input className="profile-input" placeholder="https://github.com/..." value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} />
                                    <p className="label">Avatar URL</p>
                                    <input className="profile-input" placeholder="https://..." value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} />
                                    <button className="btn" style={{ width: "100%", marginTop: "0.5rem" }} onClick={saveProfile} disabled={saving}>
                                        {saving ? "Saving..." : "Save changes"}
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                                    {[
                                        { label: "Bio", value: profile?.bio || "—" },
                                        { label: "Target role", value: profile?.targetRole || "—" },
                                        { label: "LinkedIn", value: profile?.linkedIn ? <a href={profile.linkedIn} target="_blank" rel="noreferrer" style={{ color: "#4facfe", fontSize: "0.875rem" }}>View profile</a> : "—" },
                                        { label: "GitHub", value: profile?.github ? <a href={profile.github} target="_blank" rel="noreferrer" style={{ color: "#4facfe", fontSize: "0.875rem" }}>View profile</a> : "—" },
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <p className="label">{item.label}</p>
                                            <p className="value">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right — Progress */}
                    <div>
                        <div className="profile-card" style={{ textAlign: "center" }}>
                            <p className="section-title">Profile completion</p>

                            {/* Ring */}
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                                <svg width="100" height="100" viewBox="0 0 80 80">
                                    <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
                                    <circle
                                        cx="40" cy="40" r="36"
                                        fill="none"
                                        stroke="url(#prog-grad)"
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        strokeDasharray={`${strokeDash} ${circumference}`}
                                        transform="rotate(-90 40 40)"
                                        style={{ transition: "stroke-dasharray 0.6s ease" }}
                                    />
                                    <defs>
                                        <linearGradient id="prog-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#00f5d4" />
                                            <stop offset="100%" stopColor="#f72585" />
                                        </linearGradient>
                                    </defs>
                                    <text x="40" y="44" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600" fontFamily="Montserrat, sans-serif">
                                        {progress?.percentage ?? 0}%
                                    </text>
                                </svg>
                            </div>

                            <p style={{ color: "#aaa", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
                                {progress?.completed ?? 0} of {progress?.total ?? 0} tasks complete
                            </p>

                            {/* Checklist */}
                            <div>
                                {progress?.checks?.map((check, i) => (
                                    <div key={i} className="check-row">
                                        <div className={`check-dot ${check.done ? "done" : "pending"}`}>
                                            {check.done ? "✓" : "·"}
                                        </div>
                                        <span style={{ color: check.done ? "#ccc" : "#555", fontSize: "0.875rem", textAlign: "left" }}>
                                            {check.label}
                                        </span>
                                        {!check.done && (
                                            <span style={{ marginLeft: "auto", color: "#333", fontSize: "0.75rem" }}>pending</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="profile-card">
                            <p className="section-title">Stats</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                {[
                                    { label: "Login streak", value: profile?.streak ?? 0, unit: "days" },
                                    { label: "Member since", value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—", unit: "" },
                                ].map((stat, i) => (
                                    <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "1rem", textAlign: "center", border: "1px solid rgba(255,255,255,0.07)" }}>
                                        <p style={{ color: "#00f5d4", fontSize: "1.5rem", fontWeight: 700, fontFamily: "Montserrat, sans-serif", margin: 0 }}>
                                            {stat.value}
                                            {stat.unit && <span style={{ fontSize: "0.75rem", color: "#888", marginLeft: "4px" }}>{stat.unit}</span>}
                                        </p>
                                        <p style={{ color: "#666", fontSize: "0.78rem", marginTop: "0.25rem" }}>{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Profile;