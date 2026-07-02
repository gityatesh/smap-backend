import React, { useContext } from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom'; // 👈 We imported 'Link' here to make clickable buttons
import { ThemeContext } from './ThemeContext'; 

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
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-main)' }}>📈 SMAP Terminal</h1>
        </div>
        
        {/* Middle: Navigation Links */}
        {/* In React, NEVER use an <a href="/"> tag. It forces the browser to reload the page. 
            Instead, we use <Link to="/">. It swaps the page instantly without loading! */}
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

        {/* Right Side: Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          style={{
            padding: '10px 18px', borderRadius: '6px', cursor: 'pointer',
            backgroundColor: 'var(--bg-secondary)', color: 'var(--text-main)',
            border: '1px solid var(--border-color)', fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          {theme === 'light' ? '🌙 Go Dark' : '☀️ Go Light'}
        </button>
      </div>

      {/* A nice clean separator line under the navigation bar */}
      <hr style={{ border: 'none', height: '1px', backgroundColor: 'var(--border-color)', marginBottom: '40px' }} />

      {/* THE ROUTER (Traffic Cop) */}
      <Routes>
        {/* We map the URLs to our new pages! */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/stock/:symbol" element={<StockDetail />} />
      </Routes>

    </div>
  );
}

export default App;