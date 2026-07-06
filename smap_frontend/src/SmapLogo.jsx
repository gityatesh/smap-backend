import React from 'react';

function SmapLogo({ size = 36 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', marginRight: '12px' }}
    >
      {/* Outer Terminal Window Background */}
      <rect x="5" y="10" width="90" height="80" rx="14" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="4"/>
      
      {/* Terminal Top Bar (Mac style dots) */}
      <path d="M5 32 L95 32" stroke="var(--border-color)" strokeWidth="4"/>
      <circle cx="18" cy="21" r="3.5" fill="#ff4c4c"/>
      <circle cx="30" cy="21" r="3.5" fill="#ffcf48"/>
      <circle cx="42" cy="21" r="3.5" fill="var(--accent-green)"/>
      
      {/* Background Bar Chart */}
      <rect x="22" y="55" width="12" height="25" rx="2" fill="var(--text-muted)" opacity="0.2"/>
      <rect x="44" y="42" width="12" height="38" rx="2" fill="var(--text-muted)" opacity="0.2"/>
      <rect x="66" y="65" width="12" height="15" rx="2" fill="var(--text-muted)" opacity="0.2"/>
      
      {/* The Upward Trend Line */}
      <path 
        d="M28 55 L 50 42 L 72 65 L 98 25" 
        stroke="var(--accent-green)" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Data Nodes on the Trend Line */}
      <circle cx="28" cy="55" r="4" fill="var(--bg-secondary)" stroke="var(--accent-green)" strokeWidth="3"/>
      <circle cx="50" cy="42" r="4" fill="var(--bg-secondary)" stroke="var(--accent-green)" strokeWidth="3"/>
      <circle cx="72" cy="65" r="4" fill="var(--bg-secondary)" stroke="var(--accent-green)" strokeWidth="3"/>
    </svg>
  );
}

export default SmapLogo;