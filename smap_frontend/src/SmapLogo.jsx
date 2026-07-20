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
      {/* Changed stroke to --text-main so it is stark white in dark mode, and black in light mode */}
      <rect x="5" y="10" width="90" height="80" rx="14" fill="var(--bg-card)" stroke="--bs-tertiary-color" strokeWidth="3"/>
      
      {/* Terminal Top Bar (Mac style dots) */}
      <path d="M5 32 L95 32" stroke="var(--bs-tertiary-color)" strokeWidth="3"/>
      <circle cx="18" cy="21" r="3.5" fill="#ef4444"/> {/* Red */}
      <circle cx="30" cy="21" r="3.5" fill="#f59e0b"/> {/* Yellow */}
      <circle cx="42" cy="21" r="3.5" fill="#10b981"/> {/* Green */}
      
      {/* Background Bar Chart */}
      <rect x="22" y="55" width="12" height="25" rx="2" fill="var(--text-secondary)" opacity="0.3"/>
      <rect x="44" y="42" width="12" height="38" rx="2" fill="var(--text-secondary)" opacity="0.3"/>
      <rect x="66" y="65" width="12" height="15" rx="2" fill="var(--text-secondary)" opacity="0.3"/>
      
      {/* The Upward Trend Line */}
      <path 
        d="M28 55 L 50 42 L 72 65 L 98 25" 
        stroke="#10b981" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Data Nodes on the Trend Line */}
      <circle cx="28" cy="55" r="4" fill="var(--bg-card)" stroke="#10b981" strokeWidth="3"/>
      <circle cx="50" cy="42" r="4" fill="var(--bg-card)" stroke="#10b981" strokeWidth="3"/>
      <circle cx="72" cy="65" r="4" fill="var(--bg-card)" stroke="#10b981" strokeWidth="3"/>
    </svg>
  );
}

export default SmapLogo;