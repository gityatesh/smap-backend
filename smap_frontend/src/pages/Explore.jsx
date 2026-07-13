// src/pages/Explore.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookLoader from './BookLoader';

function Explore() {
  const navigate = useNavigate();
  const [allStocks, setAllStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMethod, setSortMethod] = useState('name'); 
  const [loading, setLoading] = useState(true);

  // 1. THE FAVORITES MEMORY
  // We check the browser's localStorage to see if a 'favorites' list already exists. 
  // If it does, we parse it into a Javascript Array. If not, we start with a blank array [].
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // fetch('https://smap-backend-yrlx.onrender.com/api/stocks/')
    fetch('http://127.0.0.1:8000/api/stocks/')
      .then(res => res.json())
      .then(json => {
        setAllStocks(json?.data || []);
        setLoading(false);
      })
      .catch(err => console.error("Database connection failed", err));
  }, []);

  // 2. THE TOGGLE LOGIC
  // This function runs when you click a star. 
  const toggleFavorite = (e, symbol) => {
    // e.stopPropagation() stops the click from "bubbling up" to the card.
    // Without this, clicking the star would accidentally navigate you to the details page!
    e.stopPropagation(); 
    
    let newFavorites;
    if (favorites.includes(symbol)) {
      // If it's already a favorite, we filter it out (remove it)
      newFavorites = favorites.filter(fav => fav !== symbol);
    } else {
      // If it's not a favorite, we add it to the list
      newFavorites = [...favorites, symbol];
    }
    
    // Update React's memory so the star changes color instantly
    setFavorites(newFavorites);
    // Save the new list to the browser's permanent local memory
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const displayedStocks = allStocks
    .filter(stock => 
      stock.Symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
      stock.Company_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortMethod === 'name') return a.Company_name.localeCompare(b.Company_name);
      if (sortMethod === 'symbol') return a.Symbol.localeCompare(b.Symbol);
      return 0;
    });

  if (loading) return <BookLoader />

  return (
    <div>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: 'var(--text-main)', margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>Search Terminal Catalog</h2>
          <input 
            type="text" 
            placeholder="Filter by company name or ticker symbol..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
            style={{ width: '100%', padding: '10px 14px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <h2 style={{ color: 'var(--text-main)', margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>Order Grid Mapping</h2>
          <select 
            value={sortMethod} 
            onChange={(e) => setSortMethod(e.target.value)}
            style={{ padding: '10px 14px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}
          >
            <option value="name">Company Name</option>
            <option value="symbol">Ticker Symbol</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
        {displayedStocks.length > 0 ? (
          displayedStocks.map((stock, index) => {
            // Check if this specific stock is inside our favorites array
            const isFav = favorites.includes(stock.Symbol);
            
            return (
              <div 
                key={index} 
                onClick={() => navigate(`/stock/${stock.Symbol}`)}
                style={{ 
                  cursor: 'pointer', 
                  padding: '20px', 
                  backgroundColor: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '8px',
                  position: 'relative' // Required to position the star in the corner
                }}
              >
                {/* 3. THE STAR BUTTON */}
                <span 
                  onClick={(e) => toggleFavorite(e, stock.Symbol)}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    fontSize: '20px',
                    // If it's a favorite, it's yellow. If not, it's a faded gray outline.
                    color: isFav ? '#fbbf24' : 'var(--border-color)', 
                    transition: 'color 0.2s'
                  }}
                >
                  {isFav ? '★' : '☆'}
                </span>

                <h3 style={{ margin: '0 0 6px 0', color: 'var(--accent-green)', fontSize: '16px', fontWeight: '700' }}>{stock.Symbol}</h3>
                <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '14px', fontWeight: '500', paddingRight: '25px' }}>{stock.Company_name}</p>
              </div>
            );
          })
        ) : (
          <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1' }}>No matches found in the archive.</p>
        )}
      </div>
    </div>
  );
}

export default Explore;