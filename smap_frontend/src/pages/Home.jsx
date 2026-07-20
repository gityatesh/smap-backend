// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookLoader from './BookLoader';

function Home() {
  const navigate = useNavigate();
  const [marketData, setMarketData] = useState(null);
  const [topStocks, setTopStocks] = useState([]);
  
  // 1. WE NEED THE FULL LIST TO FIND OUR FAVORITES
  const [allStocks, setAllStocks] = useState([]); 
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. READ THE BROWSER MEMORY ON THE HOME PAGE
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // We added the 'all stocks' endpoint back in here so we can match the names to your saved symbols!
    Promise.all([
      // fetch('http://127.0.0.1:8000/api/market-summary/').then(res => res.json()),
      // fetch('http://127.0.0.1:8000/api/top-stocks/').then(res => res.json()),
      // fetch('http://127.0.0.1:8000/api/stocks/').then(res => res.json()) 
      fetch('https://smap-backend-yrlx.onrender.com/api/market-summary/').then(res => res.json()),
      fetch('https://smap-backend-yrlx.onrender.com/api/top-stocks/').then(res => res.json()),
      fetch('https://smap-backend-yrlx.onrender.com/api/stocks/').then(res => res.json()) 
    ])
    .then(([summaryJson, topStocksJson, allStocksJson]) => {
      setMarketData(summaryJson?.data || {});

      // Normalize top stocks payload to a consistent shape so UI can read `price` reliably.
      const rawTop = (topStocksJson?.data || topStocksJson || []);
      const normalizedTop = rawTop.map(item => {
        const rawPrice = item['Close Price'] ?? item.close_price ?? item.close ?? item.price ?? item.current_price ?? item.Price ?? null;
        const price = rawPrice != null && String(rawPrice).trim() !== '' ? Number(String(rawPrice).replace(/[^0-9.-]+/g, '')) : null;
        return {
          Symbol: item.Symbol || item.symbol || item.ticker || item.code,
          Company_name: item['Company Name'] || item.Company_name || item.company_name || item.name || '',
          price,
          change_percent: item.change_percent ?? item.change ?? item['Change %'] ?? null,
          __raw: item
        };
      });

      setTopStocks(normalizedTop);
      setAllStocks(allStocksJson?.data || []);
      setLoading(false);
    })
    .catch(err => {
      setError("Failed to stream pipeline connection.");
      setLoading(false);
    });
  }, []);
  if (loading) return <BookLoader />;
  if (error) return <div style={{ padding: '40px 0', color: '#ef4444' }}>❌ Error: {error}</div>;

  // 3. FILTER OUT ONLY YOUR WATCHLIST
  // We look through all the stocks, and only keep the ones whose symbol exists in your favorites array.
  const favoriteStocks = allStocks.filter(stock => favorites.includes(stock.Symbol || stock.symbol));

  return (
    <div>
      <h2 style={{ color: 'var(--text-main)', fontSize: '18px', marginBottom: '20px' }}>System Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '50px' }}>
        <div style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Total Streamed Companies</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: 'var(--text-main)' }}>{marketData?.total_stocks || '-'}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Historical Price Rows</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: 'var(--text-main)' }}>{marketData?.total_price_records || '-'}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Pipeline Sync Date</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: 'var(--accent-green)' }}>{marketData?.latest_trading_date || '-'}</p>
        </div>
      </div>

      {/* Top Performing Assets Container */}
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '20px' }}>
          {/* Make sure your array name matches here (e.g., topPerformers, topAssets, etc.) */}
            {topStocks.map((asset, index) => (
              <div key={index} onClick={() => navigate(`/stock/${asset.Symbol || asset.symbol}`)} style={{
                  flex: '1',
                  minWidth: '120px',
                  border: '1px solid #10b981', /* The Crisp Green Border */
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-card)', /* Changes with Light/Dark mode! */
                  transition: 'background-color 0.3s ease'
              }}>
                    <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-main)', fontSize: '16px' }}>
                      {asset.symbol || asset.Symbol}
                  </h4>
                  <p style={{ margin: 0, color: '#10b981', fontWeight: 'bold', fontSize: '15px' }}>
                      ${asset.price || asset.current_price|| '-'} 
                  </p>
              </div>
          ))}
      </div>

      {/* 4. YOUR NEW WATCHLIST SECTION */}
      <div>
        <h2 style={{ color: 'var(--text-main)', fontSize: '18px', marginBottom: '20px' }}>⭐ Your Favourate Stocks</h2>
        
        {favoriteStocks.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {favoriteStocks.map((stock, index) => (
              <div 
                key={`fav-${index}`} 
                onClick={() => navigate(`/stock/${stock.Symbol}`)}
                style={{ cursor: 'pointer', padding: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              >
                <h3 style={{ margin: '0 0 6px 0', color: '#fbbf24', fontSize: '16px', fontWeight: '700' }}>{stock.Symbol}</h3>
                <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '14px', fontWeight: '500' }}>{stock.Company_name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>You haven't saved any stocks yet. Head to the Explore page and click the star icon!</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default Home;                                                  