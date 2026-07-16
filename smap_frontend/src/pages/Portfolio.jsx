import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Link, Navigate } from 'react-router-dom';

const Portfolio = () => {
    const { user, token } = useContext(AuthContext);
    const [holdings, setHoldings] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [liveBalance, setLiveBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // If there's no token, we can't fetch data
        if (!token) return;

        const fetchPortfolioData = async () => {
            try {
                // Fetch both endpoints at the same time for performance
                const [summaryRes, watchlistRes] = await Promise.all([
                    fetch('http://127.0.0.1:8000/api/portfolio/summary/', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('http://127.0.0.1:8000/api/portfolio/watchlist/', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('http://127.0.0.1:8000/api/portfolio/wallet/', { 
                        headers: { 'Authorization': `Bearer ${token}` } 
                    })
                ]);

                if (!summaryRes.ok || !watchlistRes.ok) {
                    throw new Error("Failed to fetch portfolio data.");
                }

                const summaryData = await summaryRes.json();
                const watchlistData = await watchlistRes.json();

                setHoldings(summaryData.data);
                setWatchlist(watchlistData.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolioData();
    }, [token]);

    // Security Check: Kick unauthenticated users back to login
    if (!user) {
        return <Navigate to="/login" />;
    }

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-main)' }}>Loading your assets...</div>;
    }

    // Calculate dynamic total net worth based on live API prices
    const totalInvestedValue = holdings.reduce((sum, item) => sum + item.current_value, 0);
    const netWorth = (user?.balance || 0) + totalInvestedValue;
    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            
            {/* Header Section */}
            <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px' }}>
                <h1 style={{ margin: '0 0 10px 0', color: 'var(--text-main)' }}>{user.username}'s Portfolio</h1>
                <div style={{ display: 'flex', gap: '30px' }}>
                    <div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Purchasing Power</p>
                        <h2 style={{ margin: 0, color: '#10b981' }}>
                            ${(user.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                        
                    </div>
                    <div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Total Net Worth</p>
                        <h2 style={{ margin: 0, color: 'var(--text-main)' }}>${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    </div>
                </div>
            </div>

            {error && (
                <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px', marginBottom: '20px' }}>
                    {error}
                </div>
            )}

            {/* Active Holdings Table */}
            <h2 style={{ color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Active Holdings</h2>
            {holdings.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No active trades found. Visit the market to buy some stock!</p>
            ) : (
                <div style={{ overflowX: 'auto', marginBottom: '40px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--text-main)' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                <th style={{ padding: '12px' }}>Asset</th>
                                <th style={{ padding: '12px' }}>Shares</th>
                                <th style={{ padding: '12px' }}>Current Price</th>
                                <th style={{ padding: '12px' }}>Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.map((stock) => (
                                <tr key={stock.symbol} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '12px' }}>
                                        <Link to={`/stock/${stock.symbol}`} style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>
                                            {stock.symbol}
                                        </Link>
                                    </td>
                                    <td style={{ padding: '12px' }}>{stock.net_shares}</td>
                                    <td style={{ padding: '12px' }}>${stock.current_price.toFixed(2)}</td>
                                    <td style={{ padding: '12px' }}>${stock.current_value.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Watchlist Section */}
            <h2 style={{ color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Watchlist</h2>
            {watchlist.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>Your watchlist is empty.</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    {watchlist.map((item) => (
                        <Link 
                            key={item.symbol} 
                            to={`/stock/${item.symbol}`} 
                            style={{ 
                                padding: '15px 25px', 
                                backgroundColor: 'var(--bg-secondary)', 
                                borderRadius: '8px', 
                                textDecoration: 'none', 
                                color: 'var(--text-main)',
                                border: '1px solid var(--border-color)',
                                fontWeight: 'bold'
                            }}
                        >
                            {item.symbol}
                        </Link>
                    ))}
                </div>
            )}
            
        </div>
    );
};

export default Portfolio;