// src/pages/StockDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function StockDetail() {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [chartMetric, setChartMetric] = useState('close_price');

  const metricLabels = {
    'close_price': 'Close Price',
    'open_price': 'Open Price',
    'high_price': 'Daily High',
    'low_price': 'Daily Low',
    'volume': 'Trading Volume'
  };

  useEffect(() => {
    Promise.all([
      fetch(`http://127.0.0.1:8000/api/stocks/${symbol}/`),
      fetch(`http://127.0.0.1:8000/api/stocks/${symbol}/prices/`)
    ])
    .then(async ([resProfile, resPrices]) => {
      if (!resProfile.ok || !resPrices.ok) throw new Error('Failed to fetch data from Django');
      const profileJson = await resProfile.json();
      const pricesJson = await resPrices.json();
      
      setProfile(profileJson.data);
      setPrices(pricesJson.data.data.reverse());
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [symbol]);

  if (loading) return <div style={{ padding: '40px', color: 'var(--text-muted)' }}>Loading {symbol} Terminal...</div>;
  if (error) return <div style={{ padding: '40px', color: 'red' }}>❌ Error: {error}</div>;

  const latestData = prices.length > 0 ? prices[prices.length - 1] : null;

  // =====================================================================
  // SMART CHART FORMATTERS
  // These functions decide how numbers look on the Y-Axis and in the Hover Box
  // =====================================================================

  // Formats the Y-Axis (The numbers on the left side of the chart)
  const formatYAxis = (tickItem) => {
    if (chartMetric === 'volume') {
      // If it's a billion or more, divide by 1 billion and add 'B'
      if (tickItem >= 1000000000) return (tickItem / 1000000000).toFixed(1) + 'B';
      // If it's a million or more, divide by 1 million and add 'M'
      if (tickItem >= 1000000) return (tickItem / 1000000).toFixed(1) + 'M';
      // If it's a thousand or more, add 'K'
      if (tickItem >= 1000) return (tickItem / 1000).toFixed(1) + 'K';
      return tickItem;
    }
    // If it is NOT volume, it must be a price, so just add a dollar sign
    return `$${tickItem}`;
  };

  // Formats the Tooltip (The dark box that appears when you hover your mouse)
  const formatTooltip = (value) => {
    if (chartMetric === 'volume') {
      // toLocaleString() adds the commas (e.g., 66,368,400)
      return [value.toLocaleString(), 'Volume'];
    }
    // If it's a price, format it to exactly 2 decimal places with a dollar sign
    return [`$${parseFloat(value).toFixed(2)}`, metricLabels[chartMetric]];
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
      
      <button 
        onClick={() => navigate('/')}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: 'transparent', 
          color: 'var(--text-muted)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '6px', 
          cursor: 'pointer', 
          marginBottom: '30px',
          fontSize: '14px',
          fontWeight: '600'
        }}
      >
        ← Back to Directory
      </button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
        <div>
          <h1 style={{ color: 'var(--text-main)', margin: '0 0 5px 0', fontSize: '2.5rem' }}>{profile.Company_name}</h1>
          <p style={{ color: 'var(--accent-green)', margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>{symbol}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 5px 0' }}>Sector: <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{profile.sector}</span></p>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Market Cap: <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{profile['market cap'] ? `$${profile['market cap'].toLocaleString()}` : 'Unknown'}</span></p>
        </div>
      </div>

      <hr style={{ borderColor: 'var(--border-color)', marginBottom: '30px', borderStyle: 'solid', borderWidth: '1px 0 0 0' }}/>
      
      {latestData && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: 'var(--text-main)', margin: '0 0 15px 0', fontSize: '16px' }}>
            Latest Session: <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>{latestData.Date}</span>
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px' }}>
            <div className="terminal-card" style={{ padding: '15px' }}>
              <p style={{ margin: '0 0 5px 0', color: 'var(--text-muted)', fontSize: '13px' }}>Opening Price</p>
              <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '18px', fontWeight: 'bold' }}>${parseFloat(latestData.open_price).toFixed(2)}</p>
            </div>
            <div className="terminal-card" style={{ padding: '15px' }}>
              <p style={{ margin: '0 0 5px 0', color: 'var(--text-muted)', fontSize: '13px' }}>Highest Price</p>
              <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '18px', fontWeight: 'bold' }}>${parseFloat(latestData.high_price).toFixed(2)}</p>
            </div>
            <div className="terminal-card" style={{ padding: '15px' }}>
              <p style={{ margin: '0 0 5px 0', color: 'var(--text-muted)', fontSize: '13px' }}>Lowest Price</p>
              <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '18px', fontWeight: 'bold' }}>${parseFloat(latestData.low_price).toFixed(2)}</p>
            </div>
            <div className="terminal-card" style={{ padding: '15px'/*, borderBottom: '3px solid var(--accent-green)'*/ }}>
              <p style={{ margin: '0 0 5px 0', color: 'var(--text-muted)', fontSize: '13px' }}>Closing Price</p>
              <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '18px', fontWeight: 'bold' }}>${parseFloat(latestData.close_price).toFixed(2)}</p>
            </div>
            <div className="terminal-card" style={{ padding: '15px' }}>
              <p style={{ margin: '0 0 5px 0', color: 'var(--text-muted)', fontSize: '13px' }}>Volume</p>
              <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '18px', fontWeight: 'bold' }}>{latestData.volume.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="terminal-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: 'var(--text-main)', margin: 0 }}>30-Day Action ({metricLabels[chartMetric]})</h3>
          
          <select 
            className="terminal-select" 
            value={chartMetric}
            onChange={(e) => setChartMetric(e.target.value)}
          >
            <option value="close_price">Closing Price</option>
            <option value="open_price">Opening Price</option>
            <option value="high_price">Daily High</option>
            <option value="low_price">Daily Low</option>
            <option value="volume">Volume</option>
          </select>
        </div>
        
        <div style={{ width: '100%', height: '400px' }}>
          <ResponsiveContainer>
            <AreaChart data={prices}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="Date" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} tickMargin={15} />
              
              {/* 👈 WE ADDED THE tickFormatter PROP HERE */}
              <YAxis 
                domain={['auto', 'auto']} 
                stroke="var(--text-muted)" 
                tick={{fill: 'var(--text-muted)'}} 
                tickMargin={10} 
                tickFormatter={formatYAxis} 
                width={70} // Giving it just a tiny bit more room so the '$' sign doesn't clip
              />
              
              {/* 👈 WE ADDED THE formatter PROP HERE */}
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '5px' }}
                itemStyle={{ color: 'var(--accent-green)', fontWeight: 'bold' }}
                formatter={formatTooltip}
              />
              
              <Area type="monotone" dataKey={chartMetric} stroke="var(--accent-green)" strokeWidth={3} fillOpacity={1} fill="url(#colorMetric)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default StockDetail;