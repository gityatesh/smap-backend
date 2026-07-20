// src/pages/StockDetail.jsx
import React, { useState, useEffect, useContext } from 'react'; // 👈 Added useContext
import { useParams, useNavigate } from 'react-router-dom';
import { AreaChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import BookLoader from './BookLoader';
import { AuthContext } from '../AuthContext'; // 👈 Added AuthContext

function StockDetail() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  
  // 🔐 Bring in our Global User Memory
  const { user, token, updateBalance } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartMetric, setChartMetric] = useState('close_price');

  // 🚀 New State for Trading Actions
  const [tradeQuantity, setTradeQuantity] = useState(1);
  const [actionStatus, setActionStatus] = useState(null); // { type: 'success' | 'error', msg: '' }
  const [isTrading, setIsTrading] = useState(false);

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
      // fetch(`https://smap-backend-yrlx.onrender.com/api/stocks/${symbol}/`),
      // fetch(`https://smap-backend-yrlx.onrender.com/api/stocks/${symbol}/prices/`)
    ])
    .then(async ([resProfile, resPrices]) => {
      if (!resProfile.ok || !resPrices.ok) throw new Error('Failed to fetch data from Django');
      const profileJson = await resProfile.json();
      const pricesJson = await resPrices.json();

      setProfile(profileJson.data);
      // Normalize numeric fields so the chart and table render reliably
      // Then sort ascending by Date so `prices[prices.length-1]` is the latest session
      const rawPrices = pricesJson.data.data || [];
      const normalized = rawPrices.map(p => ({
        ...p,
        close_price: p.close_price !== undefined ? Number(p.close_price) : NaN,
        open_price: p.open_price !== undefined ? Number(p.open_price) : NaN,
        high_price: p.high_price !== undefined ? Number(p.high_price) : NaN,
        low_price: p.low_price !== undefined ? Number(p.low_price) : NaN,
        volume: p.volume !== undefined ? Number(p.volume) : 0,
      })).sort((a, b) => new Date(a.Date) - new Date(b.Date));

      setPrices(normalized);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [symbol]);

  // 💥 NEW: Handle Buy/Sell Action
  const handleTrade = async (transactionType) => {
    if (!token) return;
    setIsTrading(true);
    setActionStatus(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/portfolio/trade/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      // const response = await fetch('https://smap-backend-yrlx.onrender.com/api/portfolio/trade/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
        body: JSON.stringify({
          symbol: symbol, 
          transaction_type: transactionType,
          quantity: Number(tradeQuantity)
        })
      });
      
      const data = await response.json();
      console.log("🚨 DJANGO RESPONSE:", data);
      
      if (response.ok) {
        setActionStatus({ type: 'success', msg: `Successfully ${transactionType === 'BUY' ? 'bought' : 'sold'} ${tradeQuantity} shares of ${symbol}!` });
        
        const freshBalance = data.data ? data.data.new_balance : data.new_balance;
        
        // 🛡️ BULLETPROOF CHECK: Make sure updateBalance actually exists before running it!
        if (typeof updateBalance === 'function') {
            if (freshBalance !== undefined) {
                updateBalance(freshBalance); 
            }
        } else {
            console.error("CRITICAL: updateBalance is missing! Did you forget to add it to the value={{}} array in AuthContext.jsx?");
        }

      } else {
        setActionStatus({ type: 'error', msg: data.message || 'Trade failed. Check your balance or holdings.' });
      }
    } catch (err) {
      console.error("React crashed during the trade process:", err); 
      setActionStatus({ type: 'error', msg: 'Network error connecting to the trading server.' });
    } finally {
      setIsTrading(false);
    }
  };

  // ⭐ NEW: Handle Watchlist Action
  const handleWatchlist = async () => {
    if (!token) return;
    setActionStatus(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/portfolio/watchlist/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      // const response = await fetch('https://smap-backend-yrlx.onrender.com/api/portfolio/watchlist/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
        body: JSON.stringify({ symbol:symbol})
      });
      const data = await response.json();
      if (response.ok) {
        setActionStatus({ type: 'success', msg: `${symbol} added to your watchlist!` });
      } else {
        setActionStatus({ type: 'error', msg: data.message || 'Could not add to watchlist.' });
      }
    } catch (err) {
      setActionStatus({ type: 'error', msg: 'Network error connecting to the server.' });
    }
  };

  if (loading) return <BookLoader />;
  if (error) return <div style={{ padding: '40px', color: '#ff4c4c' }}>System Alert: {error}</div>;

  const companyName = profile?.company_name || profile?.Company_name || profile?.name || symbol;
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
    // Accept first arg only (recharts passes value,name,props)
    if (value == null || value === undefined) return ['-', metricLabels[chartMetric]];
    if (chartMetric === 'volume') {
      return [Number(value).toLocaleString(), 'Volume'];
    }
    return [`$${Number(value).toFixed(2)}`, metricLabels[chartMetric]];
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
      
      <button 
        onClick={() => navigate(-1)} 
        style={{
          padding: '8px 16px', backgroundColor: 'transparent', color: 'var(--text-muted)',
          border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer',
          marginBottom: '30px', fontSize: '14px', fontWeight: '600', transition: 'color 0.2s'
        }}
      >
        ← Back
      </button>

      {/* MOBILE RESPONSIVE HEADER + WATCHLIST BUTTON */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px', marginBottom: '30px' }}>
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <h1 style={{ color: 'var(--text-main)', margin: '0 0 5px 0', fontSize: 'clamp(1.4rem, 2.4vw, 2.5rem)', lineHeight: '1.2', maxWidth: '100%', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{companyName}</h1>
          <p style={{ color: 'var(--accent-green)', margin: 0, fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '1px' }}>{symbol}</p>
        </div>
        
        <div style={{ textAlign: 'left', minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 5px 0' }}>Sector: <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{profile.sector}</span></p>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Market Cap: <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{profile['market cap'] ? `$${profile['market cap'].toLocaleString()}` : 'Unknown'}</span></p>
          </div>
          
        </div>
      </div>

      <hr style={{ borderColor: 'var(--border-color)', marginBottom: '30px', borderStyle: 'solid', borderWidth: '1px 0 0 0' }} />

      {latestData && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: 'var(--text-main)', margin: '0 0 15px 0', fontSize: '16px' }}>
            Latest Session: <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>{latestData.Date}</span>
          </h3>
          
          {/* MOBILE RESPONSIVE GRID */}
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

      {/* 🚀 NEW: Trading Execution Panel */}
      {user ? (
        <div className="terminal-card" style={{ marginBottom: '30px', padding: '20px', border: '1px solid var(--accent-green)' }}>
          <h3 style={{ color: 'var(--text-main)', margin: '0 0 15px 0', fontSize: '16px' }}>Execute Trade</h3>
          
          {actionStatus && (
            <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '6px', fontSize: '14px', backgroundColor: actionStatus.type === 'success' ? '#dcfce7' : '#fee2e2', color: actionStatus.type === 'success' ? '#166534' : '#dc2626' }}>
              {actionStatus.msg}
            </div>
          )}

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)', fontSize: '12px' }}>Shares</label>
              <input 
                type="number" 
                min="1" 
                value={tradeQuantity} 
                onChange={(e) => setTradeQuantity(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', width: '100px' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={() => handleTrade('BUY')} 
                disabled={isTrading}
                style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: isTrading ? 'not-allowed' : 'pointer' }}
              >
                {isTrading ? 'Processing...' : 'BUY'}
              </button>
              <button 
                onClick={() => handleTrade('SELL')} 
                disabled={isTrading}
                style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: isTrading ? 'not-allowed' : 'pointer' }}
              >
                {isTrading ? 'Processing...' : 'SELL'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="terminal-card" style={{ marginBottom: '30px', padding: '15px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Login to your account to execute paper trades and add stocks to your watchlist.
        </div>
      )}

      {/* THE CHART SECTION */}
      <div className="terminal-card" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: 'var(--text-main)', margin: 0, fontSize: '16px' }}>30-Day Action <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>({metricLabels[chartMetric]})</span></h3>
          
          <select 
            className="terminal-select" 
            value={chartMetric} 
            onChange={(e) => setChartMetric(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '4px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
          >
            <option value="close_price">Closing Price</option>
            <option value="open_price">Opening Price</option>
            <option value="high_price">Daily High</option>
            <option value="low_price">Daily Low</option>
            <option value="volume">Volume</option>
          </select>
        </div>

        <div style={{ width: '100%', height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={prices}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="Date" stroke="var(--text-main)" tick={{fill: 'var(--text-main)'}} tickMargin={15} minTickGap={30} />
              <YAxis domain={['auto', 'auto']} stroke="var(--text-main)" tick={{fill: 'var(--text-main)'}} tickFormatter={formatYAxis} width={65} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--accent-green)', color: 'var(--text-main)', borderRadius: '5px' }} itemStyle={{ color: 'var(--accent-green)', fontWeight: 'bold' }} formatter={formatTooltip} />
              <Area type="monotone" dataKey={chartMetric} stroke="none" fillOpacity={1} fill="url(#colorMetric)" isAnimationActive={true} />
              <Line type="monotone" dataKey={chartMetric} stroke="#10b981" strokeWidth={2} strokeOpacity={1} dot={false} isAnimationActive={true} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* THE TABLE SECTION */}
      <div className="terminal-card">
        <h3 style={{ color: 'var(--text-main)', margin: '0 0 20px 0', fontSize: '16px' }}>30-Day Session Ledger</h3>
        <div style={{ maxHeight: '400px', overflow: 'auto', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'separate', textAlign: 'left', fontSize: '14px', whiteSpace: 'nowrap' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-secondary)', zIndex: 5, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
              <tr>
                <th style={{ padding: '12px 16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', zIndex: 6, fontWeight: 600 }}>Date</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', zIndex: 6, fontWeight: 600 }}>Open</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', zIndex: 6, fontWeight: 600 }}>High</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', zIndex: 6, fontWeight: 600 }}>Low</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', zIndex: 6, fontWeight: 600 }}>Close</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', zIndex: 6, fontWeight: 600 }}>Volume</th>
              </tr>
            </thead>
            <tbody>
              {[...prices].reverse().map((session, index) => (
                <tr key={`${session.Date}-${index}`} style={{
                    backgroundColor: index === 0 ? 'rgba(33, 206, 153, 0.05)' : 'transparent',
                    borderLeft: index === 0 ? '3px solid var(--accent-green)' : '3px solid transparent',
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'background-color 0.2s ease',
                    fontVariantNumeric: 'tabular-nums'
                  }}
                  onMouseOver={(e) => { if (index !== 0) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; }}
                  onMouseOut={(e) => { if (index !== 0) e.currentTarget.style.backgroundColor = 'translucent'; }}
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