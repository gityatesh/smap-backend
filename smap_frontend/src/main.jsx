// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Manages our page routing
import App from './App.jsx'
import { ThemeProvider } from './ThemeContext.jsx' // 👈 MAKE SURE THIS IS IMPORTED!
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* The ThemeProvider must be placed outside of App so that 
      App can listen to its data broadcast.
    */}
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)