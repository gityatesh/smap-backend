import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()
  
  const [marketData, setMarketData] = useState(null)
  const [allStocks, setAllStocks] = useState([]) 
  // NEW: State for top stocks
  const [topStocks, setTopStocks] = useState([]) 
  const [searchQuery, setSearchQuery] = useState('') 
  const [sortMethod, setSortMethod] = useState('name') 
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // We now fetch three things simultaneously!
    Promise.all([
      fetch('http://127.0.0.1:8000/api/market-summary/').then(res => res.json()),
      fetch('http://127.0.0.1:8000/api/stocks/').then(res => res.json()),
      fetch('http://127.0.0.1:8000/api/top-stocks/').then(res => res.json())
    ])
    .then(([summaryJson, stocksJson, topStocksJson]) => {
      console.log("RAW TOP STOCKS:", topStocksJson)
      setMarketData(summaryJson.data)
      setAllStocks(stocksJson.data)
      setTopStocks(topStocksJson.data) // Load the top stocks
      setLoading(false)
    })
    .catch(err => {
      setError("Failed to connect to the Django API.")
      setLoading(false)
    })
  }, [])

  const displayedStocks = allStocks
    .filter(stock => 
      stock.Symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
      stock.Company_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortMethod === 'name') return a.Company_name.localeCompare(b.Company_name)
      if (sortMethod === 'symbol') return a.Symbol.localeCompare(b.Symbol)
      return 0
    })

  if (loading) return <div style={{ padding: '40px' }}><h3 style={{color: 'white'}}>Connecting to Django Vault...</h3></div>
  if (error) return <div style={{ padding: '40px' }}><h3 style={{color: 'white'}}>❌ {error}</h3></div>

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{color: 'white'}}>SMAP Terminal Dashboard</h1>
      <hr style={{ marginBottom: '30px', borderColor: '#334155' }} />
      
      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={{ padding: '20px', border: '1px solid #334155', borderRadius: '8px', backgroundColor: '#1e293b' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#94a3b8' }}>Total Companies</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>{marketData?.total_stocks || '-'}</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #334155', borderRadius: '8px', backgroundColor: '#1e293b' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#94a3b8' }}>Data Vault Size</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>{marketData?.total_price_records || '-'}</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #334155', borderRadius: '8px', backgroundColor: '#1e293b' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#94a3b8' }}>Last Pipeline Run</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#10b981' }}>{marketData?.latest_trading_date || '-'}</p>
        </div>
      </div>

      {/* NEW: Top Performers Row */}
      {topStocks.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#10b981', margin: '0 0 15px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
         Top Performing Stocks (Latest Session)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px' }}>
            {topStocks.map((stock, index) => (
              <div 
                key={`top-${index}`} 
                onClick={() => navigate(`/stock/${stock.Symbol}`)} /* Changed to capital S */
                style={{ padding: '15px', border: '1px solid #10b981', borderRadius: '6px', backgroundColor: '#1e293b', cursor: 'pointer', textAlign: 'center' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#064e3b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
              >
                <h3 style={{ margin: '0 0 5px 0', color: 'white' }}>{stock.Symbol}</h3> {/* Changed to capital S */}
                <p style={{ margin: 0, color: '#10b981', fontWeight: 'bold' }}>
                  {/* Used bracket notation for the space, and formatted it to 2 decimal places for a clean UI */}
                  ${parseFloat(stock['Close Price']).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          </div>
      )}

     

      {/* Controls Section */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: '#e2e8f0', margin: '0 0 10px 0', fontSize: '1.2rem' }}>Directory Search</h2>
          <input 
            type="text" 
            placeholder="Search by ticker symbol..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="cyber-input" 
          />
        </div>

        <div>
          <h2 style={{ color: '#e2e8f0', margin: '0 0 10px 0', fontSize: '1.2rem' }}>Sort By</h2>
          <div className="cyber-select-wrapper">
            <select 
              className="cyber-select" 
              value={sortMethod} 
              onChange={(e) => setSortMethod(e.target.value)}
            >
              <option value="name">Company Name</option>
              <option value="symbol">Ticker Symbol</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="cyber-select-arrow">
              <path strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" fill="none" d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Stock List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
        {displayedStocks.length > 0 ? (
          displayedStocks.map((stock, index) => (
            <div 
              key={index} 
              onClick={() => navigate(`/stock/${stock.Symbol}`)}
              style={{ padding: '15px', border: '1px solid #334155', borderRadius: '6px', backgroundColor: '#1e293b', cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgb(0, 255, 255)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#334155'}
            >
              <h3 style={{ margin: '0 0 5px 0', color: '#38bdf8' }}>{stock.Symbol}</h3>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>{stock.Company_name}</p>
            </div>
          ))
        ) : (
          <p style={{ color: '#94a3b8' }}>No stocks found matching your search.</p>
        )}
      </div>

    </div>
  )
}

export default Dashboard