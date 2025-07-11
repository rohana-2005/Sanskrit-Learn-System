import Dashboard from "./components/Dashboard";
import HeroSection from "./components/HeroSection";
import Landing from "./components/Landing";
import Questions from './components/Question';
import { LoginSignup } from './components/login_signup';
import DragDropGame from './components/DragDropGame';
import { ParallaxProvider } from "react-scroll-parallax";
import React, { useRef, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { tokenManager } from './services/api';

// Authentication wrapper component
function AuthWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = tokenManager.isAuthenticated();
      setIsAuthenticated(isAuth);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    tokenManager.removeToken();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #d2691e 0%, #cd853f 25%, #daa520 50%, #b8860b 75%, #a0522d 100%)',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/questions" element={<Questions />} />
      <Route path="/login" element={<LoginSignup onLogin={handleLogin} />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated ? (
            <DashboardWithNavigation onLogout={handleLogout} />
          ) : (
            <LoginSignup onLogin={handleLogin} />
          )
        } 
      />
      <Route 
        path="/hero" 
        element={
          isAuthenticated ? (
            <HeroSectionWithButton onLogout={handleLogout} />
          ) : (
            <LoginSignup onLogin={handleLogin} />
          )
        } 
      />
      <Route 
        path="/game" 
        element={
          isAuthenticated ? (
            <DragDropGame onLogout={handleLogout} />
          ) : (
            <LoginSignup onLogin={handleLogin} />
          )
        } 
      />
    </Routes>
  );
}

// Dashboard with navigation buttons
function DashboardWithNavigation({ onLogout }) {
  const navigate = useNavigate();

  const handleGoToHero = () => {
    navigate('/hero');
  };

  const handleStartGame = () => {
    navigate('/game');
  };

  return (
    <div style={{ position: 'relative' }}>
      <Dashboard />
      {/* Navigation buttons */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <button
          onClick={handleGoToHero}
          style={{
            padding: '12px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#1976D2';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#2196F3';
            e.target.style.transform = 'scale(1)';
          }}
        >
          🏛️ Hero Section
        </button>
        <button
          onClick={handleStartGame}
          style={{
            padding: '15px 25px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#45a049';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#4CAF50';
            e.target.style.transform = 'scale(1)';
          }}
        >
          🎮 Start Sanskrit Game
        </button>
        <button
          onClick={onLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

// Modified HeroSection with button to navigate to game
function HeroSectionWithButton({ onLogout }) {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/game');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div style={{ position: 'relative' }}>
      <HeroSection />
      {/* Floating button to start game */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <button
          onClick={handleBackToDashboard}
          style={{
            padding: '10px 18px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}
        >
          📊 Dashboard
        </button>
        <button
          onClick={handleStartGame}
          style={{
            padding: '15px 25px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#45a049';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#4CAF50';
            e.target.style.transform = 'scale(1)';
          }}
        >
          🎮 Start Sanskrit Game
        </button>
        <button
          onClick={onLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthWrapper />
    </BrowserRouter>
  );
}

export default App;
