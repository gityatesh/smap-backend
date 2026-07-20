import React, { useContext } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { ThemeContext } from './ThemeContext'; 
import { AuthContext } from './AuthContext';
import ThemeToggle from './ThemeToggle';
import SmapLogo from './SmapLogo';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Import our newly split pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import StockDetail from './pages/StockDetail';  
import Portfolio from './pages/Portfolio';
import Profile from './pages/Profile';  

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext); // GRAB USER AND LOGOUT FUNCTION
  const navigate = useNavigate(); // To redirect them after logging out

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
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <NavLink to="/" end style={({ isActive }) => ({ color: isActive ? "var(--text-main)" : "var(--text-muted)", textDecoration: "none", fontWeight: "600", fontSize: "16px" })}>
            Home
          </NavLink>
          
          <NavLink to="/explore" style={({ isActive }) => ({ color: isActive ? "var(--text-main)" : "var(--text-muted)", textDecoration: "none", fontWeight: "600", fontSize: "16px" })}>
            Explore Market
          </NavLink>

          {/* DYNAMIC AUTH LINKS */}
          {user ? (
            <>
              {/* If Logged In */}
              <NavLink to="/portfolio" style={({ isActive }) => ({ color: isActive ? "var(--text-main)" : "var(--text-muted)", textDecoration: "none", fontWeight: "600", fontSize: "16px" })}>
                Portfolio
              </NavLink>
              
              <div style={{ padding: "4px 12px", backgroundColor: "var(--bg-secondary)", borderRadius: "8px", fontSize: "14px", fontWeight: "bold" }}>
                💵 ${user.balance?.toLocaleString()}
              </div>
              <NavLink to="/profile" style={({ isActive }) => ({ color: isActive ? "var(--text-main)" : "var(--text-muted)", textDecoration: "none", fontWeight: "600", fontSize: "16px" })}>
                Profile
              </NavLink>
            </>
          ) : (
            <>
              {/* If Logged Out */}
              <NavLink to="/login" style={({ isActive }) => ({ color: isActive ? "var(--text-main)" : "var(--text-muted)", textDecoration: "none", fontWeight: "600", fontSize: "16px" })}>
                Login
              </NavLink>
              <NavLink to="/signup" style={({ isActive }) => ({ color: isActive ? "var(--text-main)" : "var(--text-muted)", textDecoration: "none", fontWeight: "600", fontSize: "16px" })}>
                Sign Up
              </NavLink>
            </>
          )}
        </div> 
        </div>
      {/* A nice clean separator line under the navigation bar */}
      <hr style={{ border: 'none', height: '1px', backgroundColor: 'var(--border-color)', marginBottom: '40px' }} />

      {/* THE ROUTER (Traffic Cop) */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/stock/:symbol" element={<StockDetail />} />
        <Route path = "/login" element = {<Login />} /> 
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/portfolio" element={<Portfolio />} /> 
        <Route path="/profile" element={<Profile />} /> 
      </Routes>

    </div>
  );
}

export default App;