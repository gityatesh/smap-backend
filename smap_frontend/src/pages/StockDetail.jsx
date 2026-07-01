import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function StockDetail() {
  const { symbol } = useParams()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // NEW: State to track which metric the user wants to chart
  const [chartMetric, setChartMetric] = useState('close_price')

  // A dictionary to translate the database key to a nice readable title
  const metricLabels = {
    'close_price': 'Close Price',
    'open_price': 'Open Price',
    'high_price': 'Daily High',
    'low_price': 'Daily Low',
    'volume': 'Trading Volume'
  }

  useEffect(() => {
    Promise.all([
      fetch(`http://127.0.0.1:8000/api/stocks/${symbol}/`),
      fetch(`http://127.0.0.1:8000/api/stocks/${symbol}/prices/`)
    ])
    .then(async ([resProfile, resPrices]) => {
      if (!resProfile.ok || !resPrices.ok) throw new Error('Failed to fetch data from Django')
      const profileJson = await resProfile.json()
      const pricesJson = await resPrices.json()
      setProfile(profileJson.data)
      setPrices(pricesJson.data.data.reverse())
      setLoading(false)
    })
    .catch(err => {
      setError(err.message)
      setLoading(false)
    })
  }, [symbol])

  if (loading) return <div style={{ padding: '40px', color: 'white' }}><h3>Loading {symbol} Terminal...</h3></div>
  if (error) return <div style={{ padding: '40px', color: 'white' }}><h3>❌ Error: {error}</h3></div>

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui', maxWidth: '1200px', margin: '0 auto' }}>
      
      <button 
        onClick={() => navigate('/')}
        style={{ padding: '10px 20px', backgroundColor: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '20px', cursor: 'pointer', marginBottom: '20px', transition: '0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
      >
        ← Back to Directory
      </button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
        <div>
          <h1 style={{ color: 'white', margin: '0 0 5px 0', fontSize: '2.5rem' }}>{profile.Company_name}</h1>
          <p style={{ color: 'rgb(0, 255, 255)', margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>{symbol}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: '#94a3b8', margin: '0 0 5px 0' }}>Sector: <span style={{ color: 'white' }}>{profile.sector}</span></p>
          <p style={{ color: '#94a3b8', margin: 0 }}>Market Cap: <span style={{ color: 'white' }}>{profile['market cap'] ? `$${profile['market cap'].toLocaleString()}` : 'Unknown'}</span></p>
        </div>
      </div>

      <hr style={{ borderColor: '#334155', marginBottom: '30px' }}/>
      
      {/* Interactive Chart Section */}
      <div style={{ padding: '30px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}>
        
        {/* NEW: Flexbox header containing the dynamic title and the dropdown */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#e2e8f0', margin: 0 }}>30-Day Action ({metricLabels[chartMetric]})</h3>
          
          <div className="cyber-select-wrapper" style={{ width: '200px' }}>
            <select 
              className="cyber-select" 
              value={chartMetric}
              onChange={(e) => setChartMetric(e.target.value)}
            >
              <option value="close_price">Close Price</option>
              <option value="open_price">Open Price</option>
              <option value="high_price">Daily High</option>
              <option value="low_price">Daily Low</option>
              <option value="volume">Volume</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="cyber-select-arrow">
              <path strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" fill="none" d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"></path>
            </svg>
          </div>
        </div>
        
        <div style={{ width: '100%', height: '400px' }}>
          <ResponsiveContainer>
            <AreaChart data={prices}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(0, 255, 255)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="rgb(0, 255, 255)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="Date" stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickMargin={15} />
              <YAxis domain={['auto', 'auto']} stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickMargin={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: 'white', borderRadius: '5px' }}
                itemStyle={{ color: 'rgb(0, 255, 255)', fontWeight: 'bold' }}
              />
              {/* NEW: dataKey is now dynamic based on the dropdown! */}
              <Area type="monotone" dataKey={chartMetric} stroke="rgb(0, 255, 255)" strokeWidth={3} fillOpacity={1} fill="url(#colorMetric)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default StockDetail