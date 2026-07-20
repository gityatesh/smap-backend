import React, { useState, useEffect } from 'react';

function BookLoader() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Start a 10-second timer (10,000 milliseconds)
    const timer = setTimeout(() => {
      setShowWarning(true);
    }, 10000);

    // Cleanup: If the data loads and this component disappears before 
    // 10 seconds is up, we kill the timer so it doesn't cause errors.
    return () => clearTimeout(timer);
  }, []);

  return (
    // Ensure the loader container is a flex column and centered so the
    // book SVG and message are always visible and positioned correctly.
    <div className="loader-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px' }}>
      
      <div className="loader">
        <div className="book-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Main Book SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 126 75" className="book" aria-hidden="true">
            <rect strokeWidth="6" stroke="var(--accent-green)" rx="7.5" height="70" width="121" y="2.5" x="2.5" fill="var(--bg-card)"></rect>
            <line strokeWidth="6" stroke="var(--accent-green)" y2="75" x2="63.5" x1="63.5"></line>
            <path strokeLinecap="round" strokeWidth="4" stroke="var(--text-main)" d="M25 20H50"></path>
            <path strokeLinecap="round" strokeWidth="4" stroke="var(--text-main)" d="M101 20H76"></path>
            <path strokeLinecap="round" strokeWidth="4" stroke="var(--text-main)" d="M16 30L50 30"></path>
            <path strokeLinecap="round" strokeWidth="4" stroke="var(--text-main)" d="M110 30L76 30"></path>
          </svg>
          
          {/* Flipping Page SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 65 75" className="book-page" aria-hidden="true">
            <path strokeLinecap="round" strokeWidth="4" stroke="var(--text-muted)" d="M40 20H15"></path>
            <path strokeLinecap="round" strokeWidth="4" stroke="var(--text-muted)" d="M49 30L15 30"></path>
            <path strokeWidth="6" stroke="var(--accent-green)" d="M2.5 2.5H55C59.1421 2.5 62.5 5.85786 62.5 10V65C62.5 69.1421 59.1421 72.5 55 72.5H2.5V2.5Z" fill="var(--bg-card)"></path>
          </svg>
        </div>
      </div>

      {/* Conditionally render the server message after 10 seconds */}
      {showWarning && (
        <div 
          className="fade-in-text"
          style={{ 
            marginTop: '30px', 
            textAlign: 'center', 
            maxWidth: '350px',
            padding: '0 20px'
          }}
        >
          <p style={{ color: 'var(--accent-green)', fontWeight: '600', margin: '0 0 8px 0', fontSize: '15px' }}>
            Waking up the server...
          </p>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
            The cloud database is experiencing a cold start. It may take up to 60 seconds to boot up the systems.
          </p>
        </div>
      )}

    </div>
  );
}

export default BookLoader;