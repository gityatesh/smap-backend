import React, { useContext } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { ThemeContext } from './ThemeContext'; 
import ThemeToggle from './ThemeToggle';
import SmapLogo from './SmapLogo';

// Import our newly split pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import StockDetail from './pages/StockDetail';    

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* GLOBAL HEADER & NAVIGATION BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        
        {/* Left Side: Brand Logo */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "8px 0",
  }}
>
  <SmapLogo size={52} />

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <h1
      style={{
        margin: 0,
        fontSize: "2.35rem",
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: "-1px",
        color:"var(--text-main)",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      SMAP
    </h1>

    <p
      style={{
        margin: "6px 0 0 2px",
        fontSize: "0.95rem",
        fontWeight: 500,
        color:"var(--text-secondary)",
        letterSpacing: "0.3px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      Stock Market Analysis Program
    </p>
  </div>
</div>
        
        {/* Middle: Navigation Links */}
        <div style={{ display: "flex", gap: "20px" }}>
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              color: isActive ? "var(--text-main)" : "var(--text-muted)",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "16px",
            })}
          >
            Home
          </NavLink>

          <NavLink
            to="/explore"
            style={({ isActive }) => ({
              color: isActive ? "var(--text-main)" : "var(--text-muted)",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "16px",
            })}
          >
            Explore Market
          </NavLink>
        </div>

        {/* Right Side: Animated Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ThemeToggle 
            isLight={theme === 'light'} 
            toggleTheme={toggleTheme} 
          />
        </div>
      </div>  

      {/* A nice clean separator line under the navigation bar */}
      <hr style={{ border: 'none', height: '1px', backgroundColor: 'var(--border-color)', marginBottom: '40px' }} />

      {/* THE ROUTER (Traffic Cop) */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/stock/:symbol" element={<StockDetail />} />
      </Routes>

    </div>
  );
}

export default App;