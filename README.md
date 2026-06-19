# CareerPilot

An AI-powered career guidance platform for students and early-career professionals. CareerPilot helps users discover career paths, practice interviews, track skills, and find jobs — all in one place.

---

## Demo

![CareerPilot Demo](screenshots/demo.gif)

---

## Features

- **AI Career Advice** — Get personalized career recommendations based on your skills, powered by Llama 3.3 via Groq
- **Career Roadmaps** — Step-by-step learning paths for 8 roles including Frontend, ML, DevOps, and more
- **Interview Prep** — Practice with role-specific question banks and get instant AI feedback with scoring
- **Resume Tips** — AI-generated resume summaries and keyword suggestions for your target role
- **Job Search** — Live job listings powered by the Adzuna API, filtered by role and location across India
- **Skills Tracker** — Add and manage your skills, track progress toward your career goals
- **Profile Progress** — Completion tracker showing what's done and what's missing from your profile
- **AI Chat** — Conversational career assistant for quick advice and guidance
- **Authentication** — Secure login with JWT, plus GitHub and Google OAuth

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, HTML, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| AI | Llama 3.3 70B via Groq API |
| Jobs API | Adzuna |
| Auth | JWT, GitHub OAuth, Google OAuth |

---

## Project Structure

```
CareerPilot/
├── backend/
│   ├── middleware/       # JWT auth middleware
│   ├── models/           # MongoDB schemas (User, Skill)
│   ├── routes/           # API routes (auth, skills, ai, jobs, profile)
│   └── server.js         # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # Header, Footer, ProtectedRoute
│   │   ├── context/      # AuthContext
│   │   └── pages/        # Home, Career, Interview, Jobs, Roadmaps, Profile, AIChat
│   └── public/
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Groq API key — [console.groq.com](https://console.groq.com)
- Adzuna API credentials — [developer.adzuna.com](https://developer.adzuna.com)
- GitHub OAuth App credentials (optional)
- Google OAuth credentials (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/chandanar8126/CareerPilot.git
cd CareerPilot

# Setup Backend
cd backend
npm install
cp .env.example .env   # Fill in your credentials
npm start

# Setup Frontend (new terminal)
cd frontend
npm install
npm start
```

### Environment Variables

Create a `.env` file in the `backend/` folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
GROQ_API_KEY=your_groq_api_key
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with JWT |
| GET | `/auth/github` | GitHub OAuth |
| GET | `/auth/google` | Google OAuth |

### Skills
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/skills` | Get user skills |
| POST | `/api/skills` | Add a skill |
| DELETE | `/api/skills/:id` | Delete a skill |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/career-advice` | Get AI career recommendations |
| POST | `/api/ai/resume-tips` | Get resume tips for target role |
| POST | `/api/ai/interview-feedback` | Get AI feedback on interview answer |
| POST | `/api/ai/chat` | Chat with AI career assistant |
| POST | `/api/ai/roadmap` | Generate custom career roadmap |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs/search` | Search jobs by query and location |
| GET | `/api/jobs/recommended` | Get jobs matched to user skills |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update profile details |
| GET | `/api/profile/progress` | Get profile completion percentage |

---

## Author

**Chandana R**
- GitHub: [chandanar8126](https://github.com/chandanar8126)
- LinkedIn: [chandana-r-274036331](https://www.linkedin.com/in/chandana-r-274036331)
- Email: chandanar8126@gmail.com

---

## License

This project is open source and available under the [MIT License](LICENSE).