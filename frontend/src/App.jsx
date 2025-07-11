import Dashboard from "./components/Dashboard";
import HeroSection from "./components/HeroSection";
import Landing from "./components/Landing";
import { ParallaxProvider } from "react-scroll-parallax";
import React, { useRef, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Questions from './components/Question';

function ScrollSections() {
  const heroRef = useRef(null);
  const dashboardRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isScrolling = useRef(false);

  // Update route on scroll
  useEffect(() => {
    function handleScroll() {
      if (isScrolling.current) return;
      
      const heroRect = heroRef.current?.getBoundingClientRect();
      const dashboardRect = dashboardRef.current?.getBoundingClientRect();
      
      if (heroRect && dashboardRect) {
        const heroBottom = heroRect.bottom;
        const dashboardTop = dashboardRect.top;
        const windowHeight = window.innerHeight;
        
        // If hero section is mostly out of view and dashboard is coming into view
        if (heroBottom <= windowHeight * 0.3) {
          if (location.pathname !== "/dashboard") {
            navigate("/dashboard", { replace: true });
          }
        } 
        // If dashboard is mostly out of view and hero is coming into view
        else if (dashboardTop >= windowHeight * 0.7) {
          if (location.pathname !== "/") {
            navigate("/", { replace: true });
          }
        }
      }
    }
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigate, location.pathname]);

  // Scroll to section on route change
  useEffect(() => {
    if (isScrolling.current) return;
    
    let target = null;
    if (location.pathname === "/dashboard") {
      target = dashboardRef.current;
    } else if (location.pathname === "/") {
      target = heroRef.current;
    }
    
    if (target) {
      isScrolling.current = true;
      target.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        isScrolling.current = false;
      }, 1000); // prevent scroll handler from firing during smooth scroll
    }
  }, [location.pathname]);

  return (
    <>
      <div ref={heroRef} id="hero-section">
        <HeroSection />
      </div>
      <div ref={dashboardRef} id="dashboard-section" style={{ marginTop: '600px' }}>
        <ParallaxProvider>
          <Dashboard />
        </ParallaxProvider>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}/>
        <Route path="/questions" element={<Questions />}/>
        <Route path="/hero" element={<ScrollSections />}/>
        <Route path="/dashboard" element={<ScrollSections />}/>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
