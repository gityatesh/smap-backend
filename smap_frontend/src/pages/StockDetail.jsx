// src/pages/StockDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import BookLoader from './BookLoader';

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
      // fetch(`http://127.0.0.1:8000/api/stocks/${symbol}/`),
      // fetch(`http://127.0.0.1:8000/api/stocks/${symbol}/prices/`)
      fetch(`https://smap-backend-yrlx.onrender.com/api/stocks/${symbol}/`),
      fetch(`https://smap-backend-yrlx.onrender.com/${symbol}/prices/`)
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

  if (loading) return <BookLoader />;
  if (error) return <div style={{ padding: '40px', color: '#ff4c4c' }}>System Alert: {error}</div>;

  const latestData = prices.length > 0 ? prices[prices.length - 1] : null;

  const formatYAxis = (tickItem) => {
    if (chartMetric === 'volume') {
      if (tickItem >= 1000000000) return (tickItem / 1000000000).toFixed(1) + 'B';
      if (tickItem >= 1000000) return (tickItem / 1000000).toFixed(1) + 'M';
      if (tickItem >= 1000) return (tickItem / 1000).toFixed(1) + 'K';
      return tickItem;
    }
    return `$${tickItem}`;
  };

  const formatTooltip = (value) => {
    if (chartMetric === 'volume') {
      return [value.toLocaleString(), 'Volume'];
    }
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
          fontWeight: '600',
          transition: 'color 0.2s'
        }}
      >
        ← Back to Directory
      </button>
      
      {/* 📱 MOBILE RESPONSIVE HEADER */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ color: 'var(--text-main)', margin: '0 0 5px 0', fontSize: '2.5rem', lineHeight: '1.2' }}>{profile.Company_name}</h1>
          <p style={{ color: 'var(--accent-green)', margin: 0, fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '1px' }}>{symbol}</p>
        </div>
        <div style={{ textAlign: 'left', minWidth: '200px' }}>
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
          
          {/* 📱 MOBILE RESPONSIVE GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
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
            <div className="terminal-card" style={{ padding: '15px' }}>
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
      
      <div className="terminal-card" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: 'var(--text-main)', margin: 0, fontSize: '16px' }}>30-Day Action ({metricLabels[chartMetric]})</h3>
          
          <select 
            className="terminal-select" 
            value={chartMetric}
            onChange={(e) => setChartMetric(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
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
              <XAxis dataKey="Date" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} tickMargin={15} minTickGap={30} />
              <YAxis domain={['auto', 'auto']} stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} tickMargin={10} tickFormatter={formatYAxis} width={65} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '5px' }} itemStyle={{ color: 'var(--accent-green)', fontWeight: 'bold' }} formatter={formatTooltip} />
              <Area type="monotone" dataKey={chartMetric} stroke="var(--accent-green)" strokeWidth={3} fillOpacity={1} fill="url(#colorMetric)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="terminal-card">
        <h3 style={{ color: 'var(--text-main)', margin: '0 0 20px 0', fontSize: '16px' }}>30-Day Session Ledger</h3>
        
        {/* 📱 MOBILE SWIPEABLE TABLE CONTAINER */}
        <div style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', whiteSpace: 'nowrap' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-secondary)', zIndex: 1 }}>
              <tr>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Date</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Open</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>High</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Low</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Close</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Volume</th>
              </tr>
            </thead>
            <tbody>
              {[...prices].reverse().map((session, index) => (
                <tr 
                  key={session.Date} 
                  style={{ 
                    backgroundColor: index === 0 ? 'rgba(33, 206, 153, 0.05)' : 'transparent',
                    borderLeft: index === 0 ? '3px solid var(--accent-green)' : '3px solid transparent',
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'background-color 0.2s ease',
                    fontVariantNumeric: 'tabular-nums' // 👈 Forces numbers to align perfectly
                  }}
                  onMouseOver={(e) => {
                    if (index !== 0) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseOut={(e) => {
                    if (index !== 0) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>{session.Date}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>${parseFloat(session.open_price).toFixed(2)}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>${parseFloat(session.high_price).toFixed(2)}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>${parseFloat(session.low_price).toFixed(2)}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>${parseFloat(session.close_price).toFixed(2)}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>{session.volume.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default StockDetail;