import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import StockDetail from './pages/StockDetail'

function App() {
  return (
    <Routes>
      {/* If the URL is just "/", show the Dashboard */}
      <Route path="/" element={<Dashboard />} />
      
      {/* If the URL is "/stock/SOMETHING", show the Details page */}
      <Route path="/stock/:symbol" element={<StockDetail />} />
    </Routes>
  )
}

export default App