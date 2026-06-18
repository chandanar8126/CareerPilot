import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Career from "./pages/Career";
import Interview from "./pages/Interview";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AIChat from "./pages/AIChat";
import ProtectedRoute from "./components/ProtectedRoute";
import "./assets/css/style.css";
import AuthSuccess from "./pages/AuthSuccess";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import Roadmaps from "./pages/Roadmaps";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/career" element={<ProtectedRoute><Career /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/roadmaps" element={<ProtectedRoute><Roadmaps /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;