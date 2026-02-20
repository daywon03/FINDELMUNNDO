import { useEffect, useState, createContext, useContext } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Lenis from "@studio-freight/lenis";

// Pages
import HomePage from "./pages/HomePage";
import PortfolioPage from "./pages/PortfolioPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Components
import Navigation from "./components/Navigation";
import CustomCursor from "./components/CustomCursor";
import GrainOverlay from "./components/GrainOverlay";
import { Toaster } from "./components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Auth Context
export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

function App() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Check for existing auth
    const token = localStorage.getItem("fdm_token");
    const storedAdmin = localStorage.getItem("fdm_admin");
    if (token && storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);

    return () => {
      lenis.destroy();
    };
  }, []);

  const login = (token, adminData) => {
    localStorage.setItem("fdm_token", token);
    localStorage.setItem("fdm_admin", JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem("fdm_token");
    localStorage.removeItem("fdm_admin");
    setAdmin(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-fdm-bg flex items-center justify-center">
        <div className="loading-line w-32"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      <div className="App bg-fdm-bg min-h-screen">
        <BrowserRouter>
          <CustomCursor />
          <GrainOverlay />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Navigation /><HomePage /></>} />
            <Route path="/portfolio" element={<><Navigation /><PortfolioPage /></>} />
            <Route path="/about" element={<><Navigation /><AboutPage /></>} />
            <Route path="/contact" element={<><Navigation /><ContactPage /></>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/*" 
              element={
                admin ? <AdminDashboard /> : <Navigate to="/admin/login" replace />
              } 
            />
          </Routes>
          <Toaster position="bottom-right" />
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
